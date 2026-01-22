"""
Frontend Build Infrastructure
CodeBuild projects for building frontend applications
"""
import pulumi
import pulumi_aws as aws
import json


def create_frontend_build_projects(
    project_name: str,
    environment: str,
    frontend_projects: list[str],
    frontend_buckets: dict,
    api_url: str = None,
) -> dict:
    """Create CodeBuild projects for frontend builds"""
    
    config = pulumi.Config()
    build_projects = {}
    
    # Ensure URL has protocol
    if api_url and not api_url.startswith("http"):
        api_url = f"https://{api_url}" # Default to HTTPS for production
    
    for frontend_name in frontend_projects:
        bucket = frontend_buckets[frontend_name]["bucket"]
        
        # IAM Role for CodeBuild
        build_role = aws.iam.Role(
            f"{project_name}-{environment}-{frontend_name}-build-role",
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
                "Frontend": frontend_name,
            }
        )
        
        # CodeBuild policy
        aws.iam.RolePolicyAttachment(
            f"{project_name}-{environment}-{frontend_name}-build-policy",
            role=build_role.name,
            policy_arn="arn:aws:iam::aws:policy/CloudWatchLogsFullAccess",
        )
        
        # S3 permissions for deployment
        s3_policy = aws.iam.RolePolicy(
            f"{project_name}-{environment}-{frontend_name}-build-s3-policy",
            role=build_role.id,
            policy=pulumi.Output.all(
                bucket_arn=bucket.arn,
            ).apply(lambda args: json.dumps({
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Action": [
                            "s3:PutObject",
                            "s3:PutObjectAcl",
                            "s3:GetObject",
                            "s3:DeleteObject",
                            "s3:ListBucket"
                        ],
                        "Resource": [
                            args["bucket_arn"],
                            f"{args['bucket_arn']}/*"
                        ]
                    }
                ]
            })),
        )
        
        # CloudWatch Log Group
        log_group = aws.cloudwatch.LogGroup(
            f"{project_name}-{environment}-{frontend_name}-build-logs",
            name=f"/aws/codebuild/{project_name}-{environment}-{frontend_name}",
            retention_in_days=7,
            tags={
                "Project": project_name,
                "Environment": environment,
                "Frontend": frontend_name,
            }
        )
        
        # Environment variables
        env_vars = [
            aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                name="AWS_DEFAULT_REGION",
                value="us-east-1",
            ),
            aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                name="S3_BUCKET",
                value=bucket.id,
            ),
            aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                name="FRONTEND_NAME",
                value=frontend_name,
            ),
            # Inject API URL for Vite
            aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                name="VITE_API_URL",
                value=api_url or "http://localhost:8000/api",
            ),
            # Inject App Name for Vite (Capitalize and replace hyphens)
            aws.codebuild.ProjectEnvironmentEnvironmentVariableArgs(
                name="VITE_APP_NAME",
                value=frontend_name.replace("-web", "").replace("-", " ").title(),
            ),
        ]
        
        # CodeBuild Project
        build_project = aws.codebuild.Project(
            f"{project_name}-{environment}-{frontend_name}-build",
            name=f"{project_name}-{environment}-{frontend_name}-build",
            description=f"Build {frontend_name} frontend for {project_name} {environment}",
            service_role=build_role.arn,
            source=aws.codebuild.ProjectSourceArgs(
                type="CODEPIPELINE",
                buildspec=f"{frontend_name}/buildspec.yml",
            ),
            artifacts=aws.codebuild.ProjectArtifactsArgs(
                type="CODEPIPELINE",
            ),
            environment=aws.codebuild.ProjectEnvironmentArgs(
                type="LINUX_CONTAINER",
                image="aws/codebuild/standard:7.0",
                compute_type="BUILD_GENERAL1_SMALL",
                environment_variables=env_vars,
            ),
            logs_config=aws.codebuild.ProjectLogsConfigArgs(
                cloudwatch_logs=aws.codebuild.ProjectLogsConfigCloudwatchLogsArgs(
                    group_name=log_group.name,
                    stream_name=f"{project_name}-{environment}-{frontend_name}-build",
                ),
            ),
            tags={
                "Project": project_name,
                "Environment": environment,
                "Frontend": frontend_name,
            }
        )
        
        build_projects[frontend_name] = {
            "build_project": build_project,
            "build_project_name": build_project.name,
            "build_role": build_role,
        }
    
    return build_projects

