"""
Database Infrastructure
RDS PostgreSQL with Multi-AZ, backups, and monitoring
"""
import pulumi
import pulumi_aws as aws


def create_database(project_name: str, environment: str, networking: dict) -> dict:
    """Create RDS PostgreSQL database"""
    
    config = pulumi.Config()
    
    # Subnet Group for RDS
    db_subnet_group = aws.rds.SubnetGroup(
        f"{project_name}-{environment}-db-subnet-group",
        subnet_ids=networking["private_subnet_ids"],
        tags={
            "Name": f"{project_name}-{environment}-db-subnet-group",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Parameter Group for PostgreSQL optimizations
    # Note: Some parameters require DB restart, so we'll use defaults for now
    # Parameters can be adjusted later via AWS Console or separate update
    db_parameter_group = aws.rds.ParameterGroup(
        f"{project_name}-{environment}-db-params",
        family="postgres16",
        description="PostgreSQL 16 parameter group for Task Juggler",
        # Start with minimal parameters - add more after DB is created
        tags={
            "Name": f"{project_name}-{environment}-db-params",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Database credentials stored in Secrets Manager
    db_secret = aws.secretsmanager.Secret(
        f"{project_name}-{environment}-db-secret",
        name=f"{project_name}/{environment}/database",
        description="RDS PostgreSQL credentials",
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    db_secret_version = aws.secretsmanager.SecretVersion(
        f"{project_name}-{environment}-db-secret-version",
        secret_id=db_secret.id,
        secret_string=pulumi.Output.all(
            username=config.get("db_username", "taskjuggler"),
            password=config.get_secret("db_password") or pulumi.Output.secret("changeme123!"),
        ).apply(lambda args: f'{{"username":"{args["username"]}","password":"{args["password"]}"}}'),
    )
    
    # RDS Instance
    db_instance = aws.rds.Instance(
        f"{project_name}-{environment}-db",
        identifier=f"{project_name}-{environment}-db",
        engine="postgres",
        engine_version="16.4",  # Use available PostgreSQL 16 version
        instance_class=config.get("db_instance_class", "db.t3.medium"),
        allocated_storage=config.get_int("db_allocated_storage", 100),
        max_allocated_storage=config.get_int("db_max_allocated_storage", 500),
        storage_type="gp3",
        storage_encrypted=True,
        db_name=config.get("db_name", "taskjuggler"),
        username=config.get("db_username", "taskjuggler"),
        password=db_secret_version.secret_string.apply(lambda s: eval(s)["password"]),
        vpc_security_group_ids=[networking["rds_sg"].id],
        db_subnet_group_name=db_subnet_group.name,
        parameter_group_name=db_parameter_group.name,
        multi_az=config.get_bool("db_multi_az", True),
        backup_retention_period=config.get_int("db_backup_retention", 7),
        backup_window="03:00-04:00",
        maintenance_window="mon:04:00-mon:05:00",
        enabled_cloudwatch_logs_exports=["postgresql", "upgrade"],
        performance_insights_enabled=True,
        performance_insights_retention_period=7,
        deletion_protection=config.get_bool("db_deletion_protection", True),
        skip_final_snapshot=not config.get_bool("db_deletion_protection", True),
        final_snapshot_identifier=f"{project_name}-{environment}-final-snapshot",
        tags={
            "Name": f"{project_name}-{environment}-db",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Enhanced Monitoring IAM Role
    monitoring_role = aws.iam.Role(
        f"{project_name}-{environment}-rds-monitoring-role",
        assume_role_policy="""{
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Principal": {"Service": "monitoring.rds.amazonaws.com"},
                "Action": "sts:AssumeRole"
            }]
        }""",
    )
    
    aws.iam.RolePolicyAttachment(
        f"{project_name}-{environment}-rds-monitoring-policy",
        role=monitoring_role.name,
        policy_arn="arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole",
    )
    
    return {
        "instance": db_instance,
        "endpoint": db_instance.endpoint,
        "port": db_instance.port,
        "database_name": db_instance.db_name,
        "secret_arn": db_secret.arn,
        "subnet_group": db_subnet_group,
    }
