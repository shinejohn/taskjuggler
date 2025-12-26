"""
Storage Infrastructure
S3 buckets for file storage, backups, and static assets
"""
import pulumi
import pulumi_aws as aws


def create_storage(project_name: str, environment: str) -> dict:
    """Create S3 buckets for storage"""
    
    config = pulumi.Config()
    
    # Main application storage bucket
    app_bucket = aws.s3.Bucket(
        f"{project_name}-{environment}-storage",
        bucket=f"{project_name}-{environment}-storage",
        force_destroy=config.get_bool("s3_force_destroy", False),
        tags={
            "Name": f"{project_name}-{environment}-storage",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Enable versioning
    aws.s3.BucketVersioning(
        f"{project_name}-{environment}-storage-versioning",
        bucket=app_bucket.id,
        versioning_configuration=aws.s3.BucketVersioningVersioningConfigurationArgs(
            status="Enabled",
        ),
    )
    
    # Enable encryption
    aws.s3.BucketServerSideEncryptionConfiguration(
        f"{project_name}-{environment}-storage-encryption",
        bucket=app_bucket.id,
        rules=[aws.s3.BucketServerSideEncryptionConfigurationRuleArgs(
            apply_server_side_encryption_by_default=aws.s3.BucketServerSideEncryptionConfigurationRuleApplyServerSideEncryptionByDefaultArgs(
                sse_algorithm="AES256",
            ),
        )],
    )
    
    # Lifecycle policy
    aws.s3.BucketLifecycleConfiguration(
        f"{project_name}-{environment}-storage-lifecycle",
        bucket=app_bucket.id,
        rules=[
            aws.s3.BucketLifecycleConfigurationRuleArgs(
                id="transition-to-ia",
                status="Enabled",
                transitions=[aws.s3.BucketLifecycleConfigurationRuleTransitionArgs(
                    days=30,
                    storage_class="STANDARD_IA",
                )],
            ),
            aws.s3.BucketLifecycleConfigurationRuleArgs(
                id="transition-to-glacier",
                status="Enabled",
                transitions=[aws.s3.BucketLifecycleConfigurationRuleTransitionArgs(
                    days=90,
                    storage_class="GLACIER",
                )],
            ),
        ],
    )
    
    # Public access block
    aws.s3.BucketPublicAccessBlock(
        f"{project_name}-{environment}-storage-pab",
        bucket=app_bucket.id,
        block_public_acls=True,
        block_public_policy=True,
        ignore_public_acls=True,
        restrict_public_buckets=True,
    )
    
    # Backups bucket
    backup_bucket = aws.s3.Bucket(
        f"{project_name}-{environment}-backups",
        bucket=f"{project_name}-{environment}-backups",
        force_destroy=config.get_bool("s3_force_destroy", False),
        tags={
            "Name": f"{project_name}-{environment}-backups",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Backup bucket versioning
    aws.s3.BucketVersioning(
        f"{project_name}-{environment}-backups-versioning",
        bucket=backup_bucket.id,
        versioning_configuration=aws.s3.BucketVersioningVersioningConfigurationArgs(
            status="Enabled",
        ),
    )
    
    # Backup bucket encryption
    aws.s3.BucketServerSideEncryptionConfiguration(
        f"{project_name}-{environment}-backups-encryption",
        bucket=backup_bucket.id,
        rules=[aws.s3.BucketServerSideEncryptionConfigurationRuleArgs(
            apply_server_side_encryption_by_default=aws.s3.BucketServerSideEncryptionConfigurationRuleApplyServerSideEncryptionByDefaultArgs(
                sse_algorithm="AES256",
            ),
        )],
    )
    
    # Backup bucket lifecycle - longer retention
    aws.s3.BucketLifecycleConfiguration(
        f"{project_name}-{environment}-backups-lifecycle",
        bucket=backup_bucket.id,
        rules=[
            aws.s3.BucketLifecycleConfigurationRuleArgs(
                id="transition-to-glacier",
                status="Enabled",
                transitions=[aws.s3.BucketLifecycleConfigurationRuleTransitionArgs(
                    days=7,
                    storage_class="GLACIER",
                )],
            ),
            aws.s3.BucketLifecycleConfigurationRuleArgs(
                id="delete-old-backups",
                status="Enabled",
                expiration=aws.s3.BucketLifecycleConfigurationRuleExpirationArgs(
                    days=90,
                ),
            ),
        ],
    )
    
    aws.s3.BucketPublicAccessBlock(
        f"{project_name}-{environment}-backups-pab",
        bucket=backup_bucket.id,
        block_public_acls=True,
        block_public_policy=True,
        ignore_public_acls=True,
        restrict_public_buckets=True,
    )
    
    return {
        "app_bucket": app_bucket,
        "backup_bucket": backup_bucket,
        "app_bucket_name": app_bucket.id,
        "backup_bucket_name": backup_bucket.id,
    }
