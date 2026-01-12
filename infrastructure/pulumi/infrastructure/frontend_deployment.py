"""
Frontend Deployment Infrastructure
S3 buckets and CloudFront distributions for frontend projects
"""
import pulumi
import pulumi_aws as aws


def create_frontend_deployment(
    project_name: str,
    environment: str,
    frontend_projects: list[str],
) -> dict:
    """Create S3 buckets and CloudFront distributions for frontend projects"""
    
    config = pulumi.Config()
    frontends = {}
    
    for frontend_name in frontend_projects:
        # S3 bucket for frontend static files
        bucket = aws.s3.Bucket(
            f"{project_name}-{environment}-{frontend_name}",
            bucket=f"{project_name}-{environment}-{frontend_name}",
            force_destroy=True,
            website=aws.s3.BucketWebsiteArgs(
                index_document="index.html",
                error_document="index.html",  # SPA routing
            ),
            tags={
                "Name": f"{project_name}-{environment}-{frontend_name}",
                "Project": project_name,
                "Environment": environment,
                "Frontend": frontend_name,
            }
        )
        
        # Public read access for website hosting
        bucket_policy = aws.s3.BucketPolicy(
            f"{project_name}-{environment}-{frontend_name}-policy",
            bucket=bucket.id,
            policy=bucket.id.apply(lambda bucket_id: f'''{{
                "Version": "2012-10-17",
                "Statement": [
                    {{
                        "Sid": "PublicReadGetObject",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::{bucket_id}/*"
                    }}
                ]
            }}'''),
        )
        
        # CloudFront distribution
        distribution = aws.cloudfront.Distribution(
            f"{project_name}-{environment}-{frontend_name}-cdn",
            origins=[aws.cloudfront.DistributionOriginArgs(
                domain_name=bucket.bucket_regional_domain_name,
                origin_id=f"{frontend_name}-origin",
                s3_origin_config=aws.cloudfront.DistributionOriginS3OriginConfigArgs(
                    origin_access_identity="",  # Using bucket policy instead
                ),
            )],
            enabled=True,
            default_root_object="index.html",
            default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
                allowed_methods=["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
                cached_methods=["GET", "HEAD"],
                target_origin_id=f"{frontend_name}-origin",
                forwarded_values=aws.cloudfront.DistributionDefaultCacheBehaviorForwardedValuesArgs(
                    query_string=False,
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
            # Custom error responses for SPA routing
            custom_error_responses=[
                aws.cloudfront.DistributionCustomErrorResponseArgs(
                    error_code=404,
                    response_code=200,
                    response_page_path="/index.html",
                ),
                aws.cloudfront.DistributionCustomErrorResponseArgs(
                    error_code=403,
                    response_code=200,
                    response_page_path="/index.html",
                ),
            ],
            price_class="PriceClass_100",
            restrictions=aws.cloudfront.DistributionRestrictionsArgs(
                geo_restriction=aws.cloudfront.DistributionRestrictionsGeoRestrictionArgs(
                    restriction_type="none",
                ),
            ),
            viewer_certificate=aws.cloudfront.DistributionViewerCertificateArgs(
                cloudfront_default_certificate=True,
            ),
            tags={
                "Name": f"{project_name}-{environment}-{frontend_name}-cdn",
                "Project": project_name,
                "Environment": environment,
                "Frontend": frontend_name,
            }
        )
        
        frontends[frontend_name] = {
            "bucket": bucket,
            "bucket_name": bucket.id,
            "distribution": distribution,
            "url": distribution.domain_name,
        }
    
    return frontends

