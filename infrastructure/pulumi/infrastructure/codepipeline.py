"""
CodePipeline Infrastructure
AWS-native CI/CD pipeline with GitHub source, CodeBuild, and ECS deployment
"""
import pulumi
import pulumi_aws as aws
import json


def _create_pipeline_with_resolved_ids(
    project_name: str,
    environment: str,
    pipeline_role: aws.iam.Role,
    artifact_bucket: aws.s3.Bucket,
    source_owner: str,
    source_provider: str,
    source_action_config: dict,
    build_actions: list,
    deploy_actions_base: list,
    frontend_deployments: dict,
    distribution_ids: dict,
):
    """Helper function to create pipeline with resolved distribution IDs"""
    # Rebuild deploy actions with resolved distribution IDs (now plain strings)
    deploy_actions = list(deploy_actions_base)  # Copy base actions
    for frontend_name, dist_id in distribution_ids.items():
        deploy_actions.append(
            aws.codepipeline.PipelineStageActionArgs(
                name=f"Invalidate-{frontend_name.replace('-', '_').title()}",
                category="Deploy",
                owner="AWS",
                provider="CloudFront",
                version="1",
                input_artifacts=[f"{frontend_name}_build_output"],
                configuration={
                    "DistributionId": dist_id,  # Now a resolved string, not Output
                    "ObjectPaths": ["/*"],
                },
            )
        )
    
    stages = [
        aws.codepipeline.PipelineStageArgs(
            name="Source",
            actions=[aws.codepipeline.PipelineStageActionArgs(
                name="Source",
                category="Source",
                owner=source_owner,
                provider=source_provider,
                version="1",
                output_artifacts=["source_output"],
                configuration=source_action_config,
            )],
        ),
        aws.codepipeline.PipelineStageArgs(
            name="Build",
            actions=build_actions,
        ),
        aws.codepipeline.PipelineStageArgs(
            name="Deploy",
            actions=deploy_actions,
        ),
    ]
    
    return aws.codepipeline.Pipeline(
        f"{project_name}-{environment}-pipeline",
        name=f"{project_name}-{environment}-pipeline",
        role_arn=pipeline_role.arn,
        artifact_stores=[aws.codepipeline.PipelineArtifactStoreArgs(
            location=artifact_bucket.bucket,
            type="S3",
        )],
        stages=stages,
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )


def create_codepipeline(
    project_name: str,
    environment: str,
    codebuild_project: aws.codebuild.Project,
    ecs_cluster: aws.ecs.Cluster,
    ecs_service: aws.ecs.Service,
    frontend_build_projects: dict = None,
    frontend_deployments: dict = None,
    github_connection_arn: str = None,
    github_owner: str = "shinejohn",
    github_repo: str = "taskjuggler",
    github_branch: str = "main",
) -> dict:
    """Create CodePipeline with GitHub source, CodeBuild, and ECS deployment
    
    Args:
        frontend_build_projects: Dict of frontend_name -> {build_project: CodeBuild Project, ...}
        frontend_deployments: Dict of frontend_name -> {distribution: CloudFront Distribution, ...}
    """
    
    config = pulumi.Config()
    
    # S3 bucket for pipeline artifacts
    artifact_bucket = aws.s3.Bucket(
        f"{project_name}-{environment}-pipeline-artifacts",
        bucket=f"{project_name}-{environment}-pipeline-artifacts-{pulumi.get_stack()}",
        force_destroy=True,
        tags={
            "Name": f"{project_name}-{environment}-pipeline-artifacts",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Block public access
    aws.s3.BucketPublicAccessBlock(
        f"{project_name}-{environment}-pipeline-artifacts-pab",
        bucket=artifact_bucket.id,
        block_public_acls=True,
        block_public_policy=True,
        ignore_public_acls=True,
        restrict_public_buckets=True,
    )
    
    # Enable versioning for artifacts
    aws.s3.BucketVersioning(
        f"{project_name}-{environment}-pipeline-artifacts-versioning",
        bucket=artifact_bucket.id,
        versioning_configuration=aws.s3.BucketVersioningVersioningConfigurationArgs(
            status="Enabled",
        ),
    )
    
    # IAM Role for CodePipeline
    pipeline_role = aws.iam.Role(
        f"{project_name}-{environment}-pipeline-role",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "codepipeline.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Collect all CodeBuild ARNs (API + frontends)
    codebuild_arns = [codebuild_project.arn]
    if frontend_build_projects:
        for frontend_name, frontend_build in frontend_build_projects.items():
            codebuild_arns.append(frontend_build["build_project"].arn)
    
    # Pipeline policy with ECS deployment permissions
    pipeline_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-pipeline-policy",
        role=pipeline_role.id,
        policy=pulumi.Output.all(
            artifact_bucket_arn=artifact_bucket.arn,
            ecs_cluster_arn=ecs_cluster.arn,
            ecs_service_arn=ecs_service.id,
        ).apply(lambda args: json.dumps({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObject",
                        "s3:GetObjectVersion",
                        "s3:PutObject",
                        "s3:GetBucketVersioning",
                        "s3:PutBucketVersioning"
                    ],
                    "Resource": [
                        f"{args['artifact_bucket_arn']}",
                        f"{args['artifact_bucket_arn']}/*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "codebuild:BatchGetBuilds",
                        "codebuild:StartBuild"
                    ],
                    "Resource": "*"  # Allow all CodeBuild projects
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecs:DescribeServices",
                        "ecs:DescribeTaskDefinition",
                        "ecs:DescribeTasks",
                        "ecs:ListTasks",
                        "ecs:RegisterTaskDefinition",
                        "ecs:UpdateService"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "iam:PassRole"
                    ],
                    "Resource": "*",
                    "Condition": {
                        "StringEqualsIfExists": {
                            "iam:PassedToService": [
                                "ecs-tasks.amazonaws.com"
                            ]
                        }
                    }
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "cloudfront:CreateInvalidation"
                    ],
                    "Resource": "*"
                },
            ]
        })),
    )
    
    # Add CodeStar Connections permission if connection ARN provided
    if github_connection_arn:
        codestar_policy = aws.iam.RolePolicy(
            f"{project_name}-{environment}-pipeline-codestar-policy",
            role=pipeline_role.id,
            policy=json.dumps({
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "codestar-connections:UseConnection"
                        ],
                        "Resource": github_connection_arn
                    }
                ]
            }),
        )
    
    # Source configuration - use CodeStar Connection if provided, otherwise GitHub OAuth
    # For now, we'll require github_connection_arn to avoid Output serialization issues
    if not github_connection_arn:
        # Try to get from config
        github_connection_arn = config.get("github_connection_arn")
    
    if github_connection_arn:
        # Use CodeStar Connection (preferred) - all values are plain strings
        source_action_config = {
            "ConnectionArn": str(github_connection_arn),
            "FullRepositoryId": f"{github_owner}/{github_repo}",
            "BranchName": github_branch,
            "OutputArtifactFormat": "CODE_ZIP",
        }
        source_provider = "CodeStarSourceConnection"
        source_owner = "AWS"
    else:
        # Fallback to GitHub OAuth - but this creates Output issues
        # Better to set up CodeStar Connection
        raise Exception(
            "github_connection_arn must be provided. Set it with: pulumi config set github_connection_arn <arn>"
        )
    
    # Build actions - API + all frontends in parallel
    # Note: CodeBuild project names are strings, not Outputs, so they're safe to use directly
    build_actions = [
        # API build
        aws.codepipeline.PipelineStageActionArgs(
            name="Build-API",
            category="Build",
            owner="AWS",
            provider="CodeBuild",
            version="1",
            input_artifacts=["source_output"],
            output_artifacts=["api_build_output"],
            configuration={
                "ProjectName": codebuild_project.name,
            },
        ),
    ]
    
    # Add frontend builds in parallel
    if frontend_build_projects:
        for frontend_name, frontend_build in frontend_build_projects.items():
            build_actions.append(
                aws.codepipeline.PipelineStageActionArgs(
                    name=f"Build-{frontend_name.replace('-', '_').title()}",
                    category="Build",
                    owner="AWS",
                    provider="CodeBuild",
                    version="1",
                    input_artifacts=["source_output"],
                    output_artifacts=[f"{frontend_name}_build_output"],
                    configuration={
                        "ProjectName": frontend_build["build_project_name"],
                    },
                )
            )
    
    # Deploy actions - ECS for API, CloudFront invalidation for frontends
    # ECS cluster and service names are strings, not Outputs, so safe to use directly
    deploy_actions = [
        # API deployment to ECS
        aws.codepipeline.PipelineStageActionArgs(
            name="Deploy-API",
            category="Deploy",
            owner="AWS",
            provider="ECS",
            version="1",
            input_artifacts=["api_build_output"],
            configuration={
                "ClusterName": ecs_cluster.name,
                "ServiceName": ecs_service.name,
                "FileName": "imagedefinitions.json",
            },
        ),
    ]
    
    # Collect all distribution IDs as Outputs for CloudFront invalidations
    # We need to resolve all Outputs before creating the pipeline stages
    if frontend_deployments:
        # Collect all distribution ID Outputs
        dist_id_outputs = {
            frontend_name: frontend_deploy["distribution"].id
            for frontend_name, frontend_deploy in frontend_deployments.items()
        }
        
        # Resolve all distribution IDs, then create pipeline with resolved values
        all_dist_ids = pulumi.Output.all(**dist_id_outputs)
        
        # Create pipeline inside apply with resolved distribution IDs
        pipeline = all_dist_ids.apply(lambda dist_ids: _create_pipeline_with_resolved_ids(
            project_name=project_name,
            environment=environment,
            pipeline_role=pipeline_role,
            artifact_bucket=artifact_bucket,
            source_owner=source_owner,
            source_provider=source_provider,
            source_action_config=source_action_config,
            build_actions=build_actions,
            deploy_actions_base=deploy_actions,
            frontend_deployments=frontend_deployments,
            distribution_ids=dist_ids,
        ))
    else:
        # No frontend deployments - create pipeline directly
        stages = [
            aws.codepipeline.PipelineStageArgs(
                name="Source",
                actions=[aws.codepipeline.PipelineStageActionArgs(
                    name="Source",
                    category="Source",
                    owner=source_owner,
                    provider=source_provider,
                    version="1",
                    output_artifacts=["source_output"],
                    configuration=source_action_config,
                )],
            ),
            aws.codepipeline.PipelineStageArgs(
                name="Build",
                actions=build_actions,
            ),
            aws.codepipeline.PipelineStageArgs(
                name="Deploy",
                actions=deploy_actions,
            ),
        ]
        pipeline = aws.codepipeline.Pipeline(
            f"{project_name}-{environment}-pipeline",
            name=f"{project_name}-{environment}-pipeline",
            role_arn=pipeline_role.arn,
            artifact_stores=[aws.codepipeline.PipelineArtifactStoreArgs(
                location=artifact_bucket.bucket,
                type="S3",
            )],
            stages=stages,
            tags={
                "Project": project_name,
                "Environment": environment,
            }
        )
    
    return {
        "pipeline": pipeline,
        "pipeline_name": pipeline.name,
        "pipeline_url": pipeline.arn.apply(lambda arn: f"https://console.aws.amazon.com/codesuite/codepipeline/pipelines/{pipeline.name}/view"),
        "artifact_bucket": artifact_bucket,
        "pipeline_role": pipeline_role,
    }
