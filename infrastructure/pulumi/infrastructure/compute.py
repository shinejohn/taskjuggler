"""
Compute Infrastructure
ECS Fargate cluster with Laravel API, queue workers, and scheduler
"""
import pulumi
import pulumi_aws as aws
import json


def create_compute(
    project_name: str,
    environment: str,
    networking: dict,
    database: dict,
    cache: dict,
    storage: dict,
    security: dict,
) -> dict:
    """Create ECS Fargate cluster and services"""
    
    config = pulumi.Config()
    
    # ECS Cluster
    cluster = aws.ecs.Cluster(
        f"{project_name}-{environment}-cluster",
        name=f"{project_name}-{environment}-cluster",
        settings=[aws.ecs.ClusterSettingArgs(
            name="containerInsights",
            value="enabled",
        )],
        tags={
            "Name": f"{project_name}-{environment}-cluster",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ECR Repository for Docker images
    ecr_repo = aws.ecr.Repository(
        f"{project_name}-{environment}-repo",
        name=f"{project_name}-{environment}",
        image_tag_mutability="MUTABLE",
        image_scanning_configuration=aws.ecr.RepositoryImageScanningConfigurationArgs(
            scan_on_push=True,
        ),
        encryption_configurations=[aws.ecr.RepositoryEncryptionConfigurationArgs(
            encryption_type="AES256",
        )],
        tags={
            "Name": f"{project_name}-{environment}-repo",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Lifecycle policy for ECR
    aws.ecr.LifecyclePolicy(
        f"{project_name}-{environment}-repo-lifecycle",
        repository=ecr_repo.name,
        policy=json.dumps({
            "rules": [{
                "rulePriority": 1,
                "description": "Keep last 10 images",
                "selection": {
                    "tagStatus": "any",
                    "countType": "imageCountMoreThan",
                    "countNumber": 10
                },
                "action": {
                    "type": "expire"
                }
            }]
        }),
    )
    
    # Application Load Balancer
    alb = aws.lb.LoadBalancer(
        f"{project_name}-{environment}-alb",
        name=f"{project_name}-{environment}-alb",
        load_balancer_type="application",
        subnets=networking["public_subnet_ids"],
        security_groups=[networking["alb_sg"].id],
        enable_deletion_protection=config.get_bool("alb_deletion_protection", True),
        enable_http2=True,
        enable_cross_zone_load_balancing=True,
        tags={
            "Name": f"{project_name}-{environment}-alb",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Target Group for API
    api_target_group = aws.lb.TargetGroup(
        f"{project_name}-{environment}-api-tg",
        name=f"{project_name}-{environment}-api-tg",
        port=8080,
        protocol="HTTP",
        vpc_id=networking["vpc_id"],
        target_type="ip",
        health_check=aws.lb.TargetGroupHealthCheckArgs(
            enabled=True,
            path="/api/health",
            protocol="HTTP",
            healthy_threshold=2,
            unhealthy_threshold=3,
            timeout=5,
            interval=30,
            matcher="200",
        ),
        deregistration_delay=30,
        tags={
            "Name": f"{project_name}-{environment}-api-tg",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # HTTP Listener (redirects to HTTPS)
    http_listener = aws.lb.Listener(
        f"{project_name}-{environment}-http-listener",
        load_balancer_arn=alb.arn,
        port=80,
        protocol="HTTP",
        default_actions=[aws.lb.ListenerDefaultActionArgs(
            type="redirect",
            redirect=aws.lb.ListenerDefaultActionRedirectArgs(
                port="443",
                protocol="HTTPS",
                status_code="HTTP_301",
            ),
        )],
    )
    
    # HTTPS Listener (will be created after certificate validation via separate script)
    # Certificate ARN will be available after DNS validation completes
    https_listener = None
    
    # ECS Task Execution Role
    task_execution_role = aws.iam.Role(
        f"{project_name}-{environment}-task-execution-role",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Attach AWS managed policy for task execution
    aws.iam.RolePolicyAttachment(
        f"{project_name}-{environment}-task-execution-policy",
        role=task_execution_role.name,
        policy_arn="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    )
    
    # Additional permissions for Secrets Manager and S3
    task_execution_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-task-execution-custom-policy",
        role=task_execution_role.id,
        policy=pulumi.Output.all(
            db_secret_arn=database["secret_arn"],
            redis_secret_arn=cache.get("auth_token", pulumi.Output.secret("")).apply(lambda token: f"arn:aws:secretsmanager:us-east-1:195430954683:secret:taskjuggler/{environment}/redis*") if isinstance(cache.get("auth_token"), pulumi.Output) else f"arn:aws:secretsmanager:us-east-1:195430954683:secret:taskjuggler/{environment}/redis*",
            app_secrets_arn=security.get("app_secrets_arn", ""),
            app_bucket_arn=storage["app_bucket"].arn,
            backup_bucket_arn=storage["backup_bucket"].arn,
        ).apply(lambda args: json.dumps({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "secretsmanager:GetSecretValue",
                        "secretsmanager:DescribeSecret"
                    ],
                    "Resource": [
                        args["db_secret_arn"],
                        args.get("redis_secret_arn", ""),
                        args.get("app_secrets_arn", "")
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        f"{args['app_bucket_arn']}/*",
                        args["app_bucket_arn"],
                        f"{args['backup_bucket_arn']}/*",
                        args["backup_bucket_arn"]
                    ]
                }
            ]
        })),
    )
    
    # ECS Task Role (for application permissions)
    task_role = aws.iam.Role(
        f"{project_name}-{environment}-task-role",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "ecs-tasks.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Task role policy for S3, SNS, SES, etc.
    task_role_policy = aws.iam.RolePolicy(
        f"{project_name}-{environment}-task-role-policy",
        role=task_role.id,
        policy=pulumi.Output.all(
            app_bucket_arn=storage["app_bucket"].arn,
            backup_bucket_arn=storage["backup_bucket"].arn,
        ).apply(lambda args: json.dumps({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        f"{args['app_bucket_arn']}/*",
                        args["app_bucket_arn"],
                        f"{args['backup_bucket_arn']}/*",
                        args["backup_bucket_arn"]
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "ses:SendEmail",
                        "ses:SendRawEmail"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "sns:Publish"
                    ],
                    "Resource": "*"
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "sqs:SendMessage",
                        "sqs:ReceiveMessage",
                        "sqs:DeleteMessage",
                        "sqs:GetQueueAttributes"
                    ],
                    "Resource": "*"
                }
            ]
        })),
    )
    
    # CloudWatch Log Group
    log_group = aws.cloudwatch.LogGroup(
        f"{project_name}-{environment}-logs",
        name=f"/ecs/{project_name}-{environment}",
        retention_in_days=config.get_int("log_retention_days", 30),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Task Definition for API
    api_task_definition = aws.ecs.TaskDefinition(
        f"{project_name}-{environment}-api-task",
        family=f"{project_name}-{environment}-api",
        network_mode="awsvpc",
        requires_compatibilities=["FARGATE"],
        cpu=config.get("api_cpu", "512"),
        memory=config.get("api_memory", "1024"),
        execution_role_arn=task_execution_role.arn,
        task_role_arn=task_role.arn,
        container_definitions=pulumi.Output.all(
            ecr_repo_url=ecr_repo.repository_url,
            db_endpoint=database["endpoint"],
            db_name=database["database_name"],
            redis_endpoint=cache["endpoint"],
            app_bucket_name=storage["app_bucket_name"],
            log_group_name=log_group.name,
            db_secret_arn=database["secret_arn"],
            redis_secret_arn=cache["auth_token"].apply(lambda token: f"arn:aws:secretsmanager:us-east-1:195430954683:secret:{project_name}/{environment}/redis"),
        ).apply(lambda args: json.dumps([{
            "name": "api",
            "image": f"{args['ecr_repo_url']}:latest",
            "essential": True,
            "portMappings": [{
                "containerPort": 8080,
                "protocol": "tcp"
            }],
            "environment": [
                {"name": "APP_ENV", "value": environment},
                {"name": "APP_NAME", "value": project_name},
                {"name": "DB_HOST", "value": str(args["db_endpoint"])},
                {"name": "DB_DATABASE", "value": str(args["db_name"])},
                {"name": "REDIS_HOST", "value": str(args["redis_endpoint"])},
                {"name": "AWS_S3_BUCKET", "value": str(args["app_bucket_name"])},
                {"name": "APP_SEED_DB", "value": config.get("seed_db", "false")},
            ],
            "secrets": [
                {
                    "name": "DB_PASSWORD",
                    "valueFrom": f"{args['db_secret_arn']}:password::"
                },
                {
                    "name": "REDIS_PASSWORD",
                    "valueFrom": str(args["redis_secret_arn"])
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": args["log_group_name"],
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "api"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/health || exit 1"],
                "interval": 30,
                "timeout": 5,
                "retries": 3,
                "startPeriod": 60
            }
        }])),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ECS Service for API
    api_service = aws.ecs.Service(
        f"{project_name}-{environment}-api-service",
        name=f"{project_name}-{environment}-api",
        cluster=cluster.arn,
        task_definition=api_task_definition.arn,
        desired_count=config.get_int("api_desired_count", 2),
        launch_type="FARGATE",
        network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
            subnets=networking["private_subnet_ids"],
            security_groups=[networking["ecs_sg"].id],
            assign_public_ip=False,
        ),
        load_balancers=[aws.ecs.ServiceLoadBalancerArgs(
            target_group_arn=api_target_group.arn,
            container_name="api",
            container_port=8080,
        )],
        # Deployment configuration - using dict format for compatibility
        # maximum_percent and minimum_healthy_percent are set via deployment_maximum_percent and deployment_minimum_healthy_percent
        enable_execute_command=True,
        tags={
            "Name": f"{project_name}-{environment}-api-service",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Task Definition for Queue Worker
    worker_task_definition = aws.ecs.TaskDefinition(
        f"{project_name}-{environment}-worker-task",
        family=f"{project_name}-{environment}-worker",
        network_mode="awsvpc",
        requires_compatibilities=["FARGATE"],
        cpu=config.get("worker_cpu", "256"),
        memory=config.get("worker_memory", "512"),
        execution_role_arn=task_execution_role.arn,
        task_role_arn=task_role.arn,
        container_definitions=pulumi.Output.all(
            ecr_repo_url=ecr_repo.repository_url,
            db_endpoint=database["endpoint"],
            db_name=database["database_name"],
            redis_endpoint=cache["endpoint"],
            log_group_name=log_group.name,
            db_secret_arn=database["secret_arn"],
            redis_secret_arn=cache["auth_token"].apply(lambda token: f"arn:aws:secretsmanager:us-east-1:195430954683:secret:{project_name}/{environment}/redis"),
        ).apply(lambda args: json.dumps([{
            "name": "worker",
            "image": f"{args['ecr_repo_url']}:latest",
            "essential": True,
            "command": ["php", "artisan", "queue:work", "--tries=3", "--timeout=300"],
            "environment": [
                {"name": "APP_ENV", "value": environment},
                {"name": "APP_NAME", "value": project_name},
                {"name": "DB_HOST", "value": str(args["db_endpoint"])},
                {"name": "DB_DATABASE", "value": str(args["db_name"])},
                {"name": "REDIS_HOST", "value": str(args["redis_endpoint"])},
                {"name": "QUEUE_CONNECTION", "value": "redis"},
            ],
            "secrets": [
                {
                    "name": "DB_PASSWORD",
                    "valueFrom": f"{args['db_secret_arn']}:password::"
                },
                {
                    "name": "REDIS_PASSWORD",
                    "valueFrom": str(args["redis_secret_arn"])
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": args["log_group_name"],
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "worker"
                }
            }
        }])),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # ECS Service for Queue Worker
    worker_service = aws.ecs.Service(
        f"{project_name}-{environment}-worker-service",
        name=f"{project_name}-{environment}-worker",
        cluster=cluster.arn,
        task_definition=worker_task_definition.arn,
        desired_count=config.get_int("worker_desired_count", 2),
        launch_type="FARGATE",
        network_configuration=aws.ecs.ServiceNetworkConfigurationArgs(
            subnets=networking["private_subnet_ids"],
            security_groups=[networking["ecs_sg"].id],
            assign_public_ip=False,
        ),
        tags={
            "Name": f"{project_name}-{environment}-worker-service",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Task Definition for Scheduler (EventBridge + ECS)
    scheduler_task_definition = aws.ecs.TaskDefinition(
        f"{project_name}-{environment}-scheduler-task",
        family=f"{project_name}-{environment}-scheduler",
        network_mode="awsvpc",
        requires_compatibilities=["FARGATE"],
        cpu=config.get("scheduler_cpu", "256"),
        memory=config.get("scheduler_memory", "512"),
        execution_role_arn=task_execution_role.arn,
        task_role_arn=task_role.arn,
        container_definitions=pulumi.Output.all(
            ecr_repo_url=ecr_repo.repository_url,
            db_endpoint=database["endpoint"],
            db_name=database["database_name"],
            redis_endpoint=cache["endpoint"],
            log_group_name=log_group.name,
            db_secret_arn=database["secret_arn"],
        ).apply(lambda args: json.dumps([{
            "name": "scheduler",
            "image": f"{args['ecr_repo_url']}:latest",
            "essential": True,
            "command": ["php", "artisan", "schedule:run"],
            "environment": [
                {"name": "APP_ENV", "value": environment},
                {"name": "APP_NAME", "value": project_name},
                {"name": "DB_HOST", "value": str(args["db_endpoint"])},
                {"name": "DB_DATABASE", "value": str(args["db_name"])},
                {"name": "REDIS_HOST", "value": str(args["redis_endpoint"])},
            ],
            "secrets": [
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
                    "awslogs-stream-prefix": "scheduler"
                }
            }
        }])),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # EventBridge Rule for Scheduler (runs every minute)
    scheduler_rule = aws.cloudwatch.EventRule(
        f"{project_name}-{environment}-scheduler-rule",
        name=f"{project_name}-{environment}-scheduler",
        description="Run Laravel scheduler every minute",
        schedule_expression="rate(1 minute)",
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # IAM Role for EventBridge to run ECS tasks
    eventbridge_role = aws.iam.Role(
        f"{project_name}-{environment}-eventbridge-role",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "events.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }),
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Policy for EventBridge to run ECS tasks
    eventbridge_policy = pulumi.Output.all(
        task_def_arn=scheduler_task_definition.arn,
        execution_role_arn=task_execution_role.arn,
        task_role_arn=task_role.arn,
    ).apply(lambda args: json.dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Action": [
                "ecs:RunTask"
            ],
            "Resource": str(args["task_def_arn"]).replace(":task-definition/", ":task-definition/*"),
        }, {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": [
                str(args["execution_role_arn"]),
                str(args["task_role_arn"]),
            ],
        }]
    }))
    
    aws.iam.RolePolicy(
        f"{project_name}-{environment}-eventbridge-policy",
        role=eventbridge_role.id,
        policy=eventbridge_policy,
    )
    
    # EventBridge Target for Scheduler
    scheduler_target = aws.cloudwatch.EventTarget(
        f"{project_name}-{environment}-scheduler-target",
        rule=scheduler_rule.name,
        arn=cluster.arn,
        role_arn=eventbridge_role.arn,
        ecs_target=aws.cloudwatch.EventTargetEcsTargetArgs(
            task_count=1,
            task_definition_arn=scheduler_task_definition.arn,
            launch_type="FARGATE",
            network_configuration=aws.cloudwatch.EventTargetEcsTargetNetworkConfigurationArgs(
                subnets=networking["private_subnet_ids"],
                security_groups=[networking["ecs_sg"].id],
                assign_public_ip=False,
            ),
        ),
    )
    
    # CloudFront Distribution for CDN
    cloudfront_distribution = aws.cloudfront.Distribution(
        f"{project_name}-{environment}-cdn",
        enabled=True,
        default_root_object="index.html",
        origins=[aws.cloudfront.DistributionOriginArgs(
            domain_name=alb.dns_name,
            origin_id="alb-origin",
            custom_origin_config=aws.cloudfront.DistributionOriginCustomOriginConfigArgs(
                http_port=80,
                https_port=443,
                origin_protocol_policy="http-only",
                origin_ssl_protocols=["TLSv1.2"],
            ),
        )],
        default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
            allowed_methods=["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
            cached_methods=["GET", "HEAD"],
            target_origin_id="alb-origin",
            forwarded_values=aws.cloudfront.DistributionDefaultCacheBehaviorForwardedValuesArgs(
                query_string=True,
                headers=["Host", "Authorization"],
                cookies=aws.cloudfront.DistributionDefaultCacheBehaviorForwardedValuesCookiesArgs(
                    forward="none",
                ),
            ),
            viewer_protocol_policy="redirect-to-https",
            min_ttl=0,
            default_ttl=3600,
            max_ttl=86400,
            compress=True,
        ),
        price_class="PriceClass_100",  # US, Canada, Europe
        restrictions=aws.cloudfront.DistributionRestrictionsArgs(
            geo_restriction=aws.cloudfront.DistributionRestrictionsGeoRestrictionArgs(
                restriction_type="none",
            ),
        ),
        viewer_certificate=aws.cloudfront.DistributionViewerCertificateArgs(
            cloudfront_default_certificate=True,  # Will be replaced with ACM cert
        ),
        tags={
            "Name": f"{project_name}-{environment}-cdn",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "cluster": cluster,
        "ecr_repo": ecr_repo,
        "alb": alb,
        "load_balancer_dns": alb.dns_name,
        "load_balancer_arn": alb.arn,
        "load_balancer_zone_id": alb.zone_id,
        "http_listener": http_listener,
        "api_service": api_service,
        "worker_service": worker_service,
        "scheduler_rule": scheduler_rule,
        "cloudfront_distribution": cloudfront_distribution,
        "cloudfront_url": cloudfront_distribution.domain_name,
        "log_group": log_group,
    }
