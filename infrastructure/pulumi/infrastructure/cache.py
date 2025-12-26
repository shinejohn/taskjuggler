"""
Cache Infrastructure
ElastiCache Redis Cluster
"""
import pulumi
import pulumi_aws as aws


def create_cache(project_name: str, environment: str, networking: dict) -> dict:
    """Create ElastiCache Redis cluster"""
    
    config = pulumi.Config()
    
    # Subnet Group for ElastiCache
    cache_subnet_group = aws.elasticache.SubnetGroup(
        f"{project_name}-{environment}-cache-subnet-group",
        subnet_ids=networking["private_subnet_ids"],
        tags={
            "Name": f"{project_name}-{environment}-cache-subnet-group",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Parameter Group for Redis optimizations
    cache_parameter_group = aws.elasticache.ParameterGroup(
        f"{project_name}-{environment}-cache-params",
        family="redis7",
        description="Redis 7 parameter group for Task Juggler",
        parameters=[
            aws.elasticache.ParameterGroupParameterArgs(
                name="maxmemory-policy",
                value="allkeys-lru",
            ),
            aws.elasticache.ParameterGroupParameterArgs(
                name="timeout",
                value="300",
            ),
        ],
        tags={
            "Name": f"{project_name}-{environment}-cache-params",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Redis Cluster
    redis_cluster = aws.elasticache.ReplicationGroup(
        f"{project_name}-{environment}-redis",
        replication_group_id=f"{project_name}-{environment}-redis",
        description=f"Redis cluster for {project_name} {environment}",
        engine="redis",
        engine_version="7.1",
        node_type=config.get("redis_node_type", "cache.t3.micro"),
        num_cache_clusters=config.get_int("redis_num_nodes", 2),
        port=6379,
        parameter_group_name=cache_parameter_group.name,
        subnet_group_name=cache_subnet_group.name,
        security_group_ids=[networking["redis_sg"].id],
        at_rest_encryption_enabled=True,
        transit_encryption_enabled=True,
        auth_token=config.get_secret("redis_auth_token") or pulumi.Output.secret("changeme123!"),
        automatic_failover_enabled=True,
        multi_az_enabled=True,
        snapshot_retention_limit=config.get_int("redis_snapshot_retention", 1),
        snapshot_window="03:00-05:00",
        maintenance_window="mon:05:00-mon:07:00",
        tags={
            "Name": f"{project_name}-{environment}-redis",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "cluster": redis_cluster,
        "endpoint": redis_cluster.primary_endpoint_address,
        "port": redis_cluster.port,
        "auth_token": redis_cluster.auth_token,
    }
