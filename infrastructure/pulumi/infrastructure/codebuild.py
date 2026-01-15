"""
CodeBuild Infrastructure
Automated Docker image building
"""
import pulumi
import pulumi_aws as aws
import json


def create_codebuild(project_name: str, environment: str, ecr_repo: aws.ecr.Repository) -> dict:
    """Create CodeBuild project for automated Docker builds"""
    
    config = pulumi.Config()
    
    # IAM Role for CodeBuild
    codebuild_role = aws.iam.Role(
        f"{project_name}-{environment}-codebuild-role",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "codebuild.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # CodeBuild policy
    aws.iam.RolePolicyAttachment(
        f"{project_name}-{environment}-codebuild-policy",
        role=codebuild_role.name,
        policy_arn="arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
    )
    
    # S3 permissions for source code
    codebuild_s3_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-codebuild-s3-policy",
        role=codebuild_role.id,
        policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObject",
                        "s3:GetObjectVersion"
                    ],
                    "Resource": f"arn:aws:s3:::taskjuggler-build-source/*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:ListBucket"
                    ],
                    "Resource": "arn:aws:s3:::taskjuggler-build-source"
                }
            ]
        }),
    )
    
    # ECR permissions
    codebuild_ecr_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-codebuild-ecr-policy",
        role=codebuild_role.id,
        policy=pulumi.Output.all(
            ecr_repo_arn=ecr_repo.arn,
        ).apply(lambda args: json.dumps({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecr:GetAuthorizationToken",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:BatchGetImage",
                        "ecr:PutImage",
                        "ecr:InitiateLayerUpload",
                        "ecr:UploadLayerPart",
                        "ecr:CompleteLayerUpload"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "ecr:PutImage"
                    ],
                    "Resource": f"{args['ecr_repo_arn']}*"
                }
            ]
        })),
    )
    
    # CloudWatch Log Group
    log_group = aws.cloudwatch.LogGroup(
        f"{project_name}-{environment}-codebuild-logs",
        name=f"/aws/codebuild/{project_name}-{environment}",
        retention_in_days=7,
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Source configuration - use CODEPIPELINE when used in pipeline (default), GitHub for standalone builds
    github_config = config.get_object("github", {})
    use_codepipeline = config.get_bool("use_codepipeline", True)  # Default to True since CodePipeline is used
    github_token_secret_name = config.get("github_token_secret_name")  # Optional: for private repos
    
    # Extract GitHub config for potential webhook use
    github_owner = github_config.get("owner", "shinejohn")
    github_repo = github_config.get("repo", "taskjuggler")
    github_branch = github_config.get("branch", "refs/heads/main")
    
    if use_codepipeline:
        # Use CODEPIPELINE source type for CodePipeline integration
        source = aws.codebuild.ProjectSourceArgs(
            type="CODEPIPELINE",
            buildspec="taskjuggler-api/buildspec.yml",
        )
        source_version = None
    else:
        # Use GitHub source for direct builds with webhook support
        github_source_args = {
            "type": "GITHUB",
            "location": f"https://github.com/{github_owner}/{github_repo}.git",
            "buildspec": github_config.get("buildspec", "taskjuggler-api/buildspec.yml"),
        }
        
        # Add GitHub auth if token provided (for private repos)
        if github_token_secret_name:
            try:
                github_secret = aws.secretsmanager.get_secret(name=github_token_secret_name)
                github_source_args["auth"] = aws.codebuild.ProjectSourceAuthArgs(
                    type="OAUTH",
                    resource=github_secret.arn,
                )
            except Exception:
                # If secret doesn't exist, continue without auth (public repo)
                pass
        
        source = aws.codebuild.ProjectSourceArgs(**github_source_args)
        source_version = github_branch
    
    # CodeBuild Project
    # When using CodePipeline, artifacts must also be CODEPIPELINE type
    artifacts_type = "CODEPIPELINE" if use_codepipeline else "NO_ARTIFACTS"
    
    build_project = aws.codebuild.Project(
        f"{project_name}-{environment}-build",
        name=f"{project_name}-{environment}-build",
        description=f"Build Docker image for {project_name} {environment}",
        service_role=codebuild_role.arn,
        source=source,
        source_version=source_version,
        artifacts=aws.codebuild.ProjectArtifactsArgs(
            type=artifacts_type,
        ),
        environment=aws.codebuild.ProjectEnvironmentArgs(
            type="LINUX_CONTAINER",
            image="aws/codebuild/standard:7.0",
            compute_type="BUILD_GENERAL1_SMALL",
            privileged_mode=True,
            environment_variables=[
                aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                    name="AWS_DEFAULT_REGION",
                    value="us-east-1",
                ),
                aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                    name="AWS_ACCOUNT_ID",
                    value="195430954683",
                ),
                aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                    name="IMAGE_REPO_NAME",
                    value=ecr_repo.name,
                ),
                aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                    name="IMAGE_TAG",
                    value="latest",
                ),
            ],
        ),
        logs_config=aws.codebuild.ProjectLogsConfigArgs(
            cloudwatch_logs=aws.codebuild.ProjectLogsConfigCloudwatchLogsArgs(
                group_name=log_group.name,
                stream_name=f"{project_name}-{environment}-build",
            ),
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
        },
    )
    
    # Webhook for automatic builds on GitHub push (only for GitHub source, not CodePipeline)
    webhook = None
    if not use_codepipeline:
        # Extract branch name from refs/heads/main format if needed
        branch_name = github_branch.replace("refs/heads/", "") if github_branch.startswith("refs/heads/") else github_branch
        
        webhook = aws.codebuild.Webhook(
            f"{project_name}-{environment}-webhook",
            project_name=build_project.name,
            filter_groups=[aws.codebuild.WebhookFilterGroupArgs(
                filters=[
                    aws.codebuild.WebhookFilterGroupFilterArgs(
                        type="EVENT",
                        pattern="PUSH",
                    ),
                    aws.codebuild.WebhookFilterGroupFilterArgs(
                        type="HEAD_REF",
                        pattern=f"^refs/heads/{branch_name}$",
                    ),
                ],
            )],
        )
    
    return {
        "build_project": build_project,
        "build_project_name": build_project.name,
        "codebuild_role": codebuild_role,
        "webhook": webhook,
    }
