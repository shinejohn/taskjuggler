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
    scanner,
    codebuild,
    codepipeline,
    frontend_deployment,
    frontend_build,
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
# Create DNS stack - pass domain_aliases to extract external domains for CloudFront cert
dns_stack = dns.create_dns(project_name, environment, compute_stack, domain_aliases=domain_aliases)
scanner_stack = scanner.create_scanner_infrastructure(
    project_name,
    environment,
    networking_stack,
    security_stack,
    compute_stack,
    database_stack
)

# Frontend projects to deploy
frontend_projects = [
    "coordinator-web",
    "taskjuggler-web",
    "scanner-web",
    "urpa-web",
    "projects-web",
    "process-web",
    "ideacircuit-web",
]

# Domain Aliases for Frontends
domain_aliases = {
    "coordinator-web": ["4calls.ai"],
    "taskjuggler-web": ["app.taskjuggler.com"],
    "scanner-web": ["scanner.taskjuggler.com"],
    "projects-web": ["projects.taskjuggler.com"],
    "process-web": ["process.taskjuggler.com"],
    "urpa-web": ["urpa.taskjuggler.com", "urpa.ai"],
    "ideacircuit-web": ["ideas.taskjuggler.com"],
}

# Frontend deployment infrastructure (S3 + CloudFront)
# Use CloudFront certificate for frontends (must be in us-east-1)
frontend_deployment_stack = frontend_deployment.create_frontend_deployment(
    project_name,
    environment,
    frontend_projects,
    aliases=domain_aliases,
    acm_certificate_arn=dns_stack.get("cloudfront_certificate_arn") or dns_stack["certificate_arn"],
)

# Create DNS records for frontend subdomains
frontend_dns_records = dns.create_frontend_dns_records(
    project_name,
    environment,
    dns_stack["zone_id"],
    frontend_deployment_stack,
    domain_aliases,
)

# Frontend build projects (CodeBuild)
# Use the API domain if available, otherwise ALB DNS
api_url = dns_stack["api_record"].fqdn.apply(lambda fqdn: f"{fqdn}/api")

frontend_build_stack = frontend_build.create_frontend_build_projects(
    project_name,
    environment,
    frontend_projects,
    frontend_deployment_stack,
    api_url=api_url,
)

# CodeBuild for CI/CD (API)
codebuild_stack = codebuild.create_codebuild(
    project_name,
    environment,
    compute_stack["ecr_repo"]
)

# CodePipeline for automated deployments
# Get GitHub connection ARN from config (set up manually in AWS Console)
config = pulumi.Config()
github_connection_arn = config.get("github_connection_arn")  # e.g., "arn:aws:codestar-connections:us-east-1:ACCOUNT:connection/CONNECTION_ID"

codepipeline_stack = codepipeline.create_codepipeline(
    project_name,
    environment,
    codebuild_stack["build_project"],
    compute_stack["cluster"],
    compute_stack["api_service"],
    frontend_build_projects=frontend_build_stack,
    frontend_deployments=frontend_deployment_stack,
    github_connection_arn=github_connection_arn,
    github_owner="shinejohn",
    github_repo="taskjuggler",
    github_branch="main",
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
# CI/CD outputs
pulumi.export("codebuild_project_name", codebuild_stack["build_project_name"])
pulumi.export("pipeline_name", codepipeline_stack["pipeline_name"])
pulumi.export("pipeline_url", codepipeline_stack["pipeline_url"])

# Frontend deployment outputs
for frontend_name in frontend_projects:
    if frontend_name in frontend_deployment_stack:
        pulumi.export(f"{frontend_name}_url", frontend_deployment_stack[frontend_name]["url"])
        pulumi.export(f"{frontend_name}_bucket", frontend_deployment_stack[frontend_name]["bucket_name"])
