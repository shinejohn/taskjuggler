"""
SiteHealth Scanner Infrastructure
SQS queues, S3 buckets, and ECS tasks for scanner worker
"""
import pulumi
import pulumi_aws as aws
import json

def create_scanner_infrastructure(project_name: str, environment: str, networking_stack: dict, security_stack: dict, compute_stack: dict, database_stack: dict):
    """
    Create scanner-specific infrastructure:
    - SQS queue for scan jobs
    - S3 bucket for screenshots and reports
    - ECS task definition for scanner worker
    - Auto-scaling configuration
    """
    
    # SQS Queue for scan jobs
    scan_queue = aws.sqs.Queue(
        f"{project_name}-scanner-queue-{environment}",
        name=f"{project_name}-scanner-queue-{environment}",
        visibility_timeout_seconds=300,  # 5 minutes
        message_retention_seconds=1209600,  # 14 days
        receive_wait_time_seconds=20,  # Long polling
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner",
        },
    )

    # Dead letter queue for failed scans
    dlq = aws.sqs.Queue(
        f"{project_name}-scanner-dlq-{environment}",
        name=f"{project_name}-scanner-dlq-{environment}",
        message_retention_seconds=1209600,  # 14 days
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-dlq",
        },
    )

    # Connect DLQ to main queue via redrive policy
    aws.sqs.RedrivePolicy(
        f"{project_name}-scanner-redrive-{environment}",
        queue_url=scan_queue.id,
        redrive_policy=dlq.arn.apply(
            lambda dlq_arn: json.dumps({
                "deadLetterTargetArn": dlq_arn,
                "maxReceiveCount": 3
            })
        ),
    )

    # S3 Bucket for screenshots and reports
    scanner_bucket = aws.s3.Bucket(
        f"{project_name}-scanner-{environment}",
        bucket=f"{project_name}-scanner-{environment}",
        force_destroy=False,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner",
        },
    )

    # S3 Bucket lifecycle policy
    aws.s3.BucketLifecycleConfigurationV2(
        f"{project_name}-scanner-lifecycle-{environment}",
        bucket=scanner_bucket.id,
        rules=[
            aws.s3.BucketLifecycleConfigurationV2RuleArgs(
                id="delete-old-reports",
                status="Enabled",
                expiration=aws.s3.BucketLifecycleConfigurationV2RuleExpirationArgs(
                    days=90,  # Keep reports for 90 days
                ),
            ),
        ],
    )

    # ECR Repository for scanner worker
    scanner_repo = aws.ecr.Repository(
        f"{project_name}-scanner-worker-{environment}",
        name=f"{project_name}/scanner-worker",
        image_tag_mutability="MUTABLE",
        image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
            scan_on_push=True,
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        },
    )

    # ECS Task Execution Role
    task_execution_role = aws.iam.Role(
        f"{project_name}-scanner-execution-role-{environment}",
        assume_role_policy=aws.iam.get_policy_document(
            statements=[
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    principals=[
                        aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                            type="Service",
                            identifiers=["ecs-tasks.amazonaws.com"],
                        )
                    ],
                    actions=["sts:AssumeRole"],
                )
            ]
        ).json,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        },
    )

    # Attach ECS Task Execution Role Policy
    aws.iam.RolePolicyAttachment(
        f"{project_name}-scanner-execution-policy-{environment}",
        role=task_execution_role.name,
        policy_arn="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    )

    # ECS Task Role (for SQS, S3, RDS access)
    task_role = aws.iam.Role(
        f"{project_name}-scanner-task-role-{environment}",
        assume_role_policy=aws.iam.get_policy_document(
            statements=[
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    principals=[
                        aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                            type="Service",
                            identifiers=["ecs-tasks.amazonaws.com"],
                        )
                    ],
                    actions=["sts:AssumeRole"],
                )
            ]
        ).json,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        },
    )

    # Task role policy for SQS, S3, RDS
    task_role_policy = aws.iam.RolePolicy(
        f"{project_name}-scanner-task-policy-{environment}",
        role=task_role.id,
        policy=aws.iam.get_policy_document(
            statements=[
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    actions=[
                        "sqs:ReceiveMessage",
                        "sqs:DeleteMessage",
                        "sqs:GetQueueAttributes",
                    ],
                    resources=[scan_queue.arn],
                ),
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    actions=[
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:DeleteObject",
                    ],
                    resources=[scanner_bucket.arn.apply(lambda arn: f"{arn}/*")],
                ),
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    actions=[
                        "rds:DescribeDBInstances",
                    ],
                    resources=["*"],
                ),
            ]
        ).json,
    )

    # CloudWatch Log Group
    log_group = aws.cloudwatch.LogGroup(
        f"{project_name}-scanner-worker-{environment}",
        name=f"/ecs/{project_name}-scanner-worker-{environment}",
        retention_in_days=7,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        },
    )

    # ECS Task Definition for Scanner Worker
    scanner_task_definition = aws.ecs.TaskDefinition(
        f"{project_name}-scanner-worker-task-{environment}",
        family=f"{project_name}-scanner-worker-{environment}",
        network_mode="awsvpc",
        requires_compatibilities=["FARGATE"],
        cpu="512",
        memory="1024",
        execution_role_arn=task_execution_role.arn,
        task_role_arn=task_role.arn,
        container_definitions=pulumi.Output.all(
            scanner_repo_url=scanner_repo.repository_url,
            db_endpoint=database_stack["endpoint"],
            db_name=database_stack["database_name"],
            log_group_name=log_group.name,
            scan_queue_url=scan_queue.url,
            scanner_bucket_name=scanner_bucket.id,
            db_secret_arn=database_stack["secret_arn"],
        ).apply(lambda args: json.dumps([{
            "name": "scanner-worker",
            "image": f"{args['scanner_repo_url']}:latest",
            "essential": True,
            "environment": [
                {"name": "SQS_QUEUE_URL", "value": args["scan_queue_url"]},
                {"name": "AWS_REGION", "value": "us-east-1"},
                {"name": "DB_HOST", "value": str(args["db_endpoint"])},
                {"name": "DB_PORT", "value": "5432"},
                {"name": "DB_DATABASE", "value": str(args["db_name"])},
                {"name": "DB_SSL", "value": "true"},
            ],
            "secrets": [
                {
                    "name": "DB_USERNAME",
                    "valueFrom": f"{args['db_secret_arn']}:username::"
                },
                {
                    "name": "DB_PASSWORD",
                    "valueFrom": f"{args['db_secret_arn']}:password::"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": args["log_group_name"],
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "scanner-worker"
                }
            },
        }])),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        }
    )

    # ECS Service for Scanner Worker (scale to zero, auto-scale based on queue)
    scanner_service = aws.ecs.Service(
        f"{project_name}-scanner-worker-service-{environment}",
        name=f"{project_name}-scanner-worker-{environment}",
        cluster=compute_stack["cluster"].arn,
        task_definition=scanner_task_definition.arn,
        desired_count=0,  # Start at 0, auto-scale based on queue
        launch_type="FARGATE",
        network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
            subnets=networking_stack["private_subnet_ids"],
            security_groups=[networking_stack["ecs_sg"].id],
            assign_public_ip=False,
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "scanner-worker",
        }
    )

    # ============================================
    # MCP Server Infrastructure
    # ============================================
    
    # ECR Repository for MCP Server
    mcp_repo = aws.ecr.Repository(
        f"{project_name}-mcp-server-{environment}",
        name=f"{project_name}/mcp-server",
        image_tag_mutability="MUTABLE",
        image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
            scan_on_push=True,
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # MCP Server Task Execution Role
    mcp_execution_role = aws.iam.Role(
        f"{project_name}-mcp-execution-role-{environment}",
        assume_role_policy=aws.iam.get_policy_document(
            statements=[
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    principals=[
                        aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                            type="Service",
                            identifiers=["ecs-tasks.amazonaws.com"],
                        )
                    ],
                    actions=["sts:AssumeRole"],
                )
            ]
        ).json,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # Attach ECS Task Execution Role Policy
    aws.iam.RolePolicyAttachment(
        f"{project_name}-mcp-execution-policy-{environment}",
        role=mcp_execution_role.name,
        policy_arn="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    )

    # MCP Server Task Role (for API access)
    mcp_task_role = aws.iam.Role(
        f"{project_name}-mcp-task-role-{environment}",
        assume_role_policy=aws.iam.get_policy_document(
            statements=[
                aws.iam.GetPolicyDocumentStatementArgs(
                    effect="Allow",
                    principals=[
                        aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                            type="Service",
                            identifiers=["ecs-tasks.amazonaws.com"],
                        )
                    ],
                    actions=["sts:AssumeRole"],
                )
            ]
        ).json,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # MCP Server CloudWatch Log Group
    mcp_log_group = aws.cloudwatch.LogGroup(
        f"{project_name}-mcp-server-{environment}",
        name=f"/ecs/{project_name}-mcp-server-{environment}",
        retention_in_days=7,
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # Get API URL from config
    config = pulumi.Config()
    api_url = config.get("api_url", "https://api.taskjuggler.com")

    # MCP Server Task Definition
    mcp_task_definition = aws.ecs.TaskDefinition(
        f"{project_name}-mcp-server-task-{environment}",
        family=f"{project_name}-mcp-server-{environment}",
        network_mode="awsvpc",
        requires_compatibilities=["FARGATE"],
        cpu="256",
        memory="512",
        execution_role_arn=mcp_execution_role.arn,
        task_role_arn=mcp_task_role.arn,
        container_definitions=pulumi.Output.all(
            mcp_repo_url=mcp_repo.repository_url,
            log_group_name=mcp_log_group.name,
            api_url=api_url,
        ).apply(lambda args: json.dumps([{
            "name": "mcp-server",
            "image": f"{args['mcp_repo_url']}:latest",
            "essential": True,
            "portMappings": [{
                "containerPort": 3001,
                "protocol": "tcp"
            }],
            "environment": [
                {"name": "PORT", "value": "3001"},
                {"name": "API_URL", "value": args["api_url"]},
                {"name": "AUTH_API_URL", "value": args["api_url"]},
                {"name": "SCANNER_API_URL", "value": f"{args['api_url']}/api"},
                {"name": "NODE_ENV", "value": environment},
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": args["log_group_name"],
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "mcp-server"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }])),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        }
    )

    # Target Group for MCP Server (for ALB)
    mcp_target_group = aws.lb.TargetGroup(
        f"{project_name}-mcp-tg-{environment}",
        name=f"{project_name}-mcp-{environment}",
        port=3001,
        protocol="HTTP",
        vpc_id=networking_stack["vpc_id"],
        target_type="ip",
        health_check=aws.lb.TargetGroupHealthCheckArgs(
            enabled=True,
            path="/health",
            protocol="HTTP",
            healthy_threshold=2,
            unhealthy_threshold=3,
            timeout=5,
            interval=30,
            matcher="200",
        ),
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # ECS Service for MCP Server
    mcp_service = aws.ecs.Service(
        f"{project_name}-mcp-server-service-{environment}",
        name=f"{project_name}-mcp-server-{environment}",
        cluster=compute_stack["cluster"].arn,
        task_definition=mcp_task_definition.arn,
        desired_count=1,  # Always running for public access
        launch_type="FARGATE",
        network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
            subnets=networking_stack["private_subnet_ids"],
            security_groups=[networking_stack["ecs_sg"].id],
            assign_public_ip=False,
        ),
        load_balancers=[aws.ecs.ServiceLoadBalancerArgs(
            target_group_arn=mcp_target_group.arn,
            container_name="mcp-server",
            container_port=3001,
        )],
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        }
    )

    # ALB Listener Rule for MCP Server (path-based routing)
    # Must be created after service to ensure target group is ready
    mcp_listener_rule = aws.lb.ListenerRule(
        f"{project_name}-mcp-listener-rule-{environment}",
        listener_arn=compute_stack["http_listener"].arn,
        priority=100,  # Higher priority than default
        actions=[aws.lb.ListenerRuleActionArgs(
            type="forward",
            target_group_arn=mcp_target_group.arn,
        )],
        conditions=[
            aws.lb.ListenerRuleConditionArgs(
                path_pattern=aws.lb.ListenerRuleConditionPathPatternArgs(
                    values=["/mcp/*"],
                ),
            ),
        ],
        tags={
            "Project": project_name,
            "Environment": environment,
            "Component": "mcp-server",
        },
    )

    # Export outputs
    return {
        "scan_queue_url": scan_queue.url,
        "scan_queue_arn": scan_queue.arn,
        "dlq_url": dlq.url,
        "scanner_bucket_name": scanner_bucket.id,
        "scanner_bucket_arn": scanner_bucket.arn,
        "scanner_repo_url": scanner_repo.repository_url,
        "task_execution_role_arn": task_execution_role.arn,
        "task_role_arn": task_role.arn,
        "log_group_name": log_group.name,
        "scanner_service": scanner_service,
        # MCP Server outputs
        "mcp_repo_url": mcp_repo.repository_url,
        "mcp_service": mcp_service,
        "mcp_target_group": mcp_target_group,
        "mcp_target_group_arn": mcp_target_group.arn,
        "mcp_listener_rule": mcp_listener_rule,
    }
