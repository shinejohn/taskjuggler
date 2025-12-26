"""
Messaging Infrastructure
SNS topics, SQS queues, and SES configuration
Replaces Pusher for real-time messaging
"""
import json
import pulumi
import pulumi_aws as aws


def create_messaging(project_name: str, environment: str) -> dict:
    """Create messaging infrastructure"""
    
    config = pulumi.Config()
    
    # SNS Topics for real-time notifications
    # Task notifications topic
    task_topic = aws.sns.Topic(
        f"{project_name}-{environment}-task-topic",
        name=f"{project_name}-{environment}-tasks",
        display_name=f"Task Juggler {environment} Task Notifications",
        tags={
            "Name": f"{project_name}-{environment}-task-topic",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # User notifications topic
    user_topic = aws.sns.Topic(
        f"{project_name}-{environment}-user-topic",
        name=f"{project_name}-{environment}-users",
        display_name=f"Task Juggler {environment} User Notifications",
        tags={
            "Name": f"{project_name}-{environment}-user-topic",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # SQS Queues for background jobs
    # Default queue
    default_queue = aws.sqs.Queue(
        f"{project_name}-{environment}-default-queue",
        name=f"{project_name}-{environment}-default",
        visibility_timeout_seconds=300,
        message_retention_seconds=1209600,  # 14 days
        receive_wait_time_seconds=20,  # Long polling
        tags={
            "Name": f"{project_name}-{environment}-default-queue",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # High priority queue
    high_priority_queue = aws.sqs.Queue(
        f"{project_name}-{environment}-high-priority-queue",
        name=f"{project_name}-{environment}-high-priority",
        visibility_timeout_seconds=300,
        message_retention_seconds=1209600,
        receive_wait_time_seconds=0,  # Short polling for high priority
        tags={
            "Name": f"{project_name}-{environment}-high-priority-queue",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Dead letter queue
    dlq = aws.sqs.Queue(
        f"{project_name}-{environment}-dlq",
        name=f"{project_name}-{environment}-dlq",
        message_retention_seconds=1209600,
        tags={
            "Name": f"{project_name}-{environment}-dlq",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Redrive policy for default queue
    aws.sqs.RedrivePolicy(
        f"{project_name}-{environment}-default-redrive",
        queue_url=default_queue.id,
        redrive_policy=dlq.arn.apply(lambda arn: json.dumps({
            "deadLetterTargetArn": arn,
            "maxReceiveCount": 3
        })),
    )
    
    # Redrive policy for high priority queue
    aws.sqs.RedrivePolicy(
        f"{project_name}-{environment}-high-priority-redrive",
        queue_url=high_priority_queue.id,
        redrive_policy=dlq.arn.apply(lambda arn: json.dumps({
            "deadLetterTargetArn": arn,
            "maxReceiveCount": 3
        })),
    )
    
    # SES Configuration
    # Email identity (domain or email address)
    ses_domain_identity = aws.ses.DomainIdentity(
        f"{project_name}-{environment}-ses-domain",
        domain=config.get("ses_domain", "taskjuggler.com"),
    )
    
    # Verification record (only if zone_id is provided)
    ses_verification_record = None
    zone_id = config.get("route53_zone_id", "")
    if zone_id:
        ses_verification_record = aws.route53.Record(
            f"{project_name}-{environment}-ses-verification",
            zone_id=zone_id,
            name=ses_domain_identity.verification_token.apply(lambda token: f"_amazonses.{config.get('ses_domain', 'taskjuggler.com')}"),
            type="TXT",
            ttl=600,
            records=[ses_domain_identity.verification_token],
        )
    
    # DKIM records (only if zone_id is provided)
    ses_dkim = None
    dkim_records = []
    if zone_id:
        ses_dkim = aws.ses.DomainDkim(
            f"{project_name}-{environment}-ses-dkim",
            domain=ses_domain_identity.domain,
        )
    
    # SES Configuration Set
    ses_config_set = aws.ses.ConfigurationSet(
        f"{project_name}-{environment}-ses-config",
        name=f"{project_name}-{environment}-ses-config",
    )
    
    # Note: Event destinations can be configured later via AWS Console or CLI
    # CloudWatch logging is enabled by default for SES
    
    return {
        "task_topic": task_topic,
        "user_topic": user_topic,
        "default_queue": default_queue,
        "high_priority_queue": high_priority_queue,
        "dlq": dlq,
        "ses_domain": ses_domain_identity,
        "ses_config_set": ses_config_set,
    }
