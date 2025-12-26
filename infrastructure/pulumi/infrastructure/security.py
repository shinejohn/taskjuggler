"""
Security Infrastructure
Secrets Manager, IAM roles, and security configurations
"""
import pulumi
import pulumi_aws as aws
import json


def create_security(project_name: str, environment: str, networking: dict) -> dict:
    """Create security infrastructure"""
    
    config = pulumi.Config()
    
    # Application Secrets
    app_secrets = aws.secretsmanager.Secret(
        f"{project_name}-{environment}-app-secrets",
        name=f"{project_name}/{environment}/app",
        description="Application secrets for Task Juggler",
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Store application secrets
    app_secrets_version = aws.secretsmanager.SecretVersion(
        f"{project_name}-{environment}-app-secrets-version",
        secret_id=app_secrets.id,
        secret_string=pulumi.Output.all(
            app_key=config.get_secret("app_key") or pulumi.Output.secret("base64:changeme"),
            twilio_sid=config.get_secret("twilio_account_sid") or pulumi.Output.secret(""),
            twilio_token=config.get_secret("twilio_auth_token") or pulumi.Output.secret(""),
            sendgrid_key=config.get_secret("sendgrid_api_key") or pulumi.Output.secret(""),
            openrouter_key=config.get_secret("openrouter_api_key") or pulumi.Output.secret(""),
            stripe_key=config.get_secret("stripe_key") or pulumi.Output.secret(""),
            stripe_secret=config.get_secret("stripe_secret") or pulumi.Output.secret(""),
            stripe_webhook=config.get_secret("stripe_webhook_secret") or pulumi.Output.secret(""),
        ).apply(lambda args: json.dumps({
            "APP_KEY": args["app_key"],
            "TWILIO_ACCOUNT_SID": args["twilio_sid"],
            "TWILIO_AUTH_TOKEN": args["twilio_token"],
            "SENDGRID_API_KEY": args["sendgrid_key"],
            "OPENROUTER_API_KEY": args["openrouter_key"],
            "STRIPE_KEY": args["stripe_key"],
            "STRIPE_SECRET": args["stripe_secret"],
            "STRIPE_WEBHOOK_SECRET": args["stripe_webhook"],
        })),
    )
    
    # Redis Auth Token Secret
    redis_secret = aws.secretsmanager.Secret(
        f"{project_name}-{environment}-redis-secret",
        name=f"{project_name}/{environment}/redis",
        description="Redis authentication token",
        tags={
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    return {
        "app_secrets": app_secrets,
        "app_secrets_arn": app_secrets.arn,
        "redis_secret": redis_secret,
        "redis_secret_arn": redis_secret.arn,
    }
