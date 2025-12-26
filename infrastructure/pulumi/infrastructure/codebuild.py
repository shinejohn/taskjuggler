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
    
    # CodeBuild Project
    build_project = aws.codebuild.Project(
        f"{project_name}-{environment}-build",
        name=f"{project_name}-{environment}-build",
        description=f"Build Docker image for {project_name} {environment}",
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
        source=aws.codebuild.ProjectSourceArgs(
            type="NO_SOURCE",
            buildspec="""
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Writing image definitions file...
      - printf '{"ImageURI":"%s"}' $REPOSITORY_URI:latest > imageDetail.json
artifacts:
  files:
    - imageDetail.json
""",
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
        }
    )
    
    return {
        "build_project": build_project,
        "build_project_name": build_project.name,
        "codebuild_role": codebuild_role,
    }
