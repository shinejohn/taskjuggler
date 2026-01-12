"""
CodePipeline Infrastructure
GitHub-based CI/CD pipeline for automated deployments
"""
import pulumi
import pulumi_aws as aws
import json


def create_codepipeline(
    project_name: str,
    environment: str,
    codebuild_project: aws.codebuild.Project,
    github_owner: str,
    github_repo: str,
    github_branch: str = "main",
    github_token_secret_name: str = None,
) -> dict:
    """Create CodePipeline with GitHub source"""
    
    config = pulumi.Config()
    
    # GitHub connection (for GitHub App or OAuth)
    # Note: This requires setting up GitHub connection in AWS Console first
    # Or use GitHub token stored in Secrets Manager
    
    # S3 bucket for pipeline artifacts
    artifact_bucket = aws.s3.Bucket(
        f"{project_name}-{environment}-pipeline-artifacts",
        bucket=f"{project_name}-{environment}-pipeline-artifacts",
        force_destroy=True,
        tags={
            "Name": f"{project_name}-{environment}-pipeline-artifacts",
            "Project": project_name,
            "Environment": environment,
        }
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
    
    # Pipeline policy
    pipeline_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-pipeline-policy",
        role=pipeline_role.id,
        policy=pulumi.Output.all(
            codebuild_arn=codebuild_project.arn,
            artifact_bucket_arn=artifact_bucket.arn,
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
                    "Resource": args["codebuild_arn"]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "sts:AssumeRole"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "secretsmanager:GetSecretValue"
                    ],
                    "Resource": "*"
                }
            ]
        })),
    )
    
    # Get GitHub token from Secrets Manager if provided
    github_source_config = {}
    
    if github_token_secret_name:
        # Use GitHub token from Secrets Manager
        github_source_config = {
            "type": "GITHUB",
            "owner": github_owner,
            "repo": github_repo,
            "branch": github_branch,
            "oauth_token": pulumi.Output.secret(
                aws.secretsmanager.get_secret(
                    name=github_token_secret_name
                ).secret_string
            ),
        }
    else:
        # Use GitHub connection (requires manual setup in AWS Console)
        # This is the preferred method for GitHub Apps
        github_source_config = {
            "type": "GITHUB",
            "owner": github_owner,
            "repo": github_repo,
            "branch": github_branch,
            # Connection ARN would be set via config or manual setup
        }
    
    # CodePipeline
    pipeline = aws.codepipeline.Pipeline(
        f"{project_name}-{environment}-pipeline",
        name=f"{project_name}-{environment}-pipeline",
        role_arn=pipeline_role.arn,
        artifact_store=aws.codepipeline.PipelineArtifactStoreArgs(
            location=artifact_bucket.bucket,
            type="S3",
        ),
        stages=[
            # Source stage - GitHub
            aws.codepipeline.PipelineStageArgs(
                name="Source",
                actions=[aws.codepipeline.PipelineStageActionArgs(
                    name="Source",
                    category="Source",
                    owner="ThirdParty",
                    provider="GitHub",
                    version="1",
                    output_artifacts=["source_output"],
                    configuration={
                        "Owner": github_owner,
                        "Repo": github_repo,
                        "Branch": github_branch,
                        "OAuthToken": github_source_config.get("oauth_token", ""),
                        "PollForSourceChanges": "false",  # Use webhooks instead
                    },
                )],
            ),
            # Build stage - CodeBuild
            aws.codepipeline.PipelineStageArgs(
                name="Build",
                actions=[aws.codepipeline.PipelineStageActionArgs(
                    name="Build",
                    category="Build",
                    owner="AWS",
                    provider="CodeBuild",
                    version="1",
                    input_artifacts=["source_output"],
                    output_artifacts=["build_output"],
                    configuration={
                        "ProjectName": codebuild_project.name,
                    },
                )],
            ),
        ],
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "pipeline": pipeline,
        "pipeline_name": pipeline.name,
        "artifact_bucket": artifact_bucket,
        "pipeline_role": pipeline_role,
    }
