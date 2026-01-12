"""
Task Juggler AWS Infrastructure
Main entry point for Pulumi infrastructure deployment
"""
import pulumi
from infrastructure import (
    networking,
    database,
    cache,
    compute,
    storage,
    monitoring,
    messaging,
    dns,
    security,
    scanner
)

# Get configuration
config = pulumi.Config()
environment = config.get("environment", "production")
project_name = config.get("project_name", "taskjuggler")

# Export project info
pulumi.export("project_name", project_name)
pulumi.export("environment", environment)

# Initialize infrastructure components
networking_stack = networking.create_networking(project_name, environment)
database_stack = database.create_database(project_name, environment, networking_stack)
cache_stack = cache.create_cache(project_name, environment, networking_stack)
storage_stack = storage.create_storage(project_name, environment)
security_stack = security.create_security(project_name, environment, networking_stack)
messaging_stack = messaging.create_messaging(project_name, environment)
compute_stack = compute.create_compute(
    project_name, 
    environment, 
    networking_stack,
    database_stack,
    cache_stack,
    storage_stack,
    security_stack
)
monitoring_stack = monitoring.create_monitoring(project_name, environment, compute_stack)
dns_stack = dns.create_dns(project_name, environment, compute_stack)
scanner_stack = scanner.create_scanner_infrastructure(
    project_name,
    environment,
    networking_stack,
    security_stack,
    compute_stack,
    database_stack
)

# Update compute stack with DNS info for HTTPS listener
# Note: This requires a second pass or manual HTTPS listener creation after cert validation

# Export important outputs
pulumi.export("vpc_id", networking_stack["vpc_id"])
pulumi.export("database_endpoint", database_stack["endpoint"])
pulumi.export("redis_endpoint", cache_stack["endpoint"])
pulumi.export("load_balancer_dns", compute_stack["load_balancer_dns"])
pulumi.export("cloudfront_url", compute_stack["cloudfront_url"])
pulumi.export("scanner_queue_url", scanner_stack["scan_queue_url"])
pulumi.export("scanner_bucket_name", scanner_stack["scanner_bucket_name"])
pulumi.export("scanner_repo_url", scanner_stack["scanner_repo_url"])
# MCP Server outputs
pulumi.export("mcp_server_url", compute_stack["load_balancer_dns"].apply(lambda dns: f"http://{dns}/mcp"))
pulumi.export("mcp_repo_url", scanner_stack["mcp_repo_url"])
pulumi.export("mcp_health_url", compute_stack["load_balancer_dns"].apply(lambda dns: f"http://{dns}/mcp/health"))
