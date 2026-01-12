"""
CodePipeline Infrastructure
AWS-native CI/CD pipeline with GitHub source, CodeBuild, and ECS deployment
"""
import pulumi
import pulumi_aws as aws
import json


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
    
    # Get GitHub token from config if no connection ARN
    github_token = None
    if not github_connection_arn:
        github_token = config.get_secret("github_token")
    
    # Source configuration - use CodeStar Connection if provided, otherwise GitHub OAuth
    source_action_config = {}
    
    if github_connection_arn:
        # Use CodeStar Connection (preferred)
        source_action_config = {
            "ConnectionArn": github_connection_arn,
            "FullRepositoryId": f"{github_owner}/{github_repo}",
            "BranchName": github_branch,
            "OutputArtifactFormat": "CODE_ZIP",
        }
        source_provider = "CodeStarSourceConnection"
        source_owner = "AWS"
    else:
        # Fallback to GitHub OAuth (requires token in config)
        github_token = config.get_secret("github_token")
        if github_token:
            source_action_config = {
                "Owner": github_owner,
                "Repo": github_repo,
                "Branch": github_branch,
                "OAuthToken": github_token,
                "PollForSourceChanges": "false",
            }
            source_provider = "GitHub"
            source_owner = "ThirdParty"
        else:
            raise Exception(
                "Either github_connection_arn or github_token config must be provided"
            )
    
    # Build actions - API + all frontends in parallel
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
    
    # Add CloudFront invalidations for frontends
    if frontend_deployments:
        for frontend_name, frontend_deploy in frontend_deployments.items():
            deploy_actions.append(
                aws.codepipeline.PipelineStageActionArgs(
                    name=f"Invalidate-{frontend_name.replace('-', '_').title()}",
                    category="Deploy",
                    owner="AWS",
                    provider="CloudFront",
                    version="1",
                    input_artifacts=[f"{frontend_name}_build_output"],
                    configuration={
                        "DistributionId": frontend_deploy["distribution"].id,
                        "ObjectPaths": ["/*"],
                    },
                )
            )
    
    # CodePipeline stages
    stages = [
        # Source stage - GitHub
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
        # Build stage - API + Frontends in parallel
        aws.codepipeline.PipelineStageArgs(
            name="Build",
            actions=build_actions,
        ),
        # Deploy stage - ECS + CloudFront invalidations
        aws.codepipeline.PipelineStageArgs(
            name="Deploy",
            actions=deploy_actions,
        ),
    ]
    
    # CodePipeline
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
