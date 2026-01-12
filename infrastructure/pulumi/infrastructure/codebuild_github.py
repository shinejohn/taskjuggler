"""
CodeBuild with GitHub Source
Direct GitHub integration for CodeBuild (alternative to CodePipeline)
"""
import pulumi
import pulumi_aws as aws
import json


def create_codebuild_github(
    project_name: str,
    environment: str,
    ecr_repo: aws.ecr.Repository,
    github_owner: str,
    github_repo: str,
    github_branch: str = "main",
    github_token_secret_name: str = None,
) -> dict:
    """Create CodeBuild project with GitHub source"""
    
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
    
    # Secrets Manager permissions for GitHub token
    if github_token_secret_name:
        codebuild_secrets_policy = aws.iam.RolePolicy(
            f"{project_name}-{environment}-codebuild-secrets-policy",
            role=codebuild_role.id,
            policy=json.dumps({
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Action": [
                        "secretsmanager:GetSecretValue"
                    ],
                    "Resource": f"arn:aws:secretsmanager:*:*:secret:{github_token_secret_name}*"
                }]
            }),
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
    
    # GitHub source configuration
    github_source = aws.codebuild.ProjectSourceArgs(
        type="GITHUB",
        location=f"https://github.com/{github_owner}/{github_repo}.git",
        buildspec="taskjuggler-api/buildspec.yml",  # Path to buildspec in repo
    )
    
    # Add GitHub auth if token provided
    if github_token_secret_name:
        github_source.auth = aws.codebuild.ProjectSourceAuthArgs(
            type="OAUTH",
            resource=pulumi.Output.secret(
                aws.secretsmanager.get_secret(
                    name=github_token_secret_name
                ).arn
            ),
        )
    
    # CodeBuild Project
    build_project = aws.codebuild.Project(
        f"{project_name}-{environment}-build",
        name=f"{project_name}-{environment}-build",
        description=f"Build Docker image for {project_name} {environment} from GitHub",
        service_role=codebuild_role.arn,
        artifacts=aws.codebuild.ProjectArtifactsArgs(
            type="NO_ARTIFACTS",
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
        source=github_source,
        source_version=github_branch,
        logs_config=aws.codebuild.ProjectLogsConfigArgs(
            cloudwatch_logs=aws.codebuild.ProjectLogsConfigCloudwatchLogsArgs(
                group_name=log_group.name,
                stream_name=f"{project_name}-{environment}-build",
            ),
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Webhook for automatic builds on push
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
                    pattern=f"^refs/heads/{github_branch}$",
                ),
            ],
        )],
    )
    
    return {
        "build_project": build_project,
        "build_project_name": build_project.name,
        "codebuild_role": codebuild_role,
        "webhook": webhook,
        "webhook_url": webhook.url,
    }
