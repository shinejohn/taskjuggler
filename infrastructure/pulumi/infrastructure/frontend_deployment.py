"""
Frontend Deployment Infrastructure
S3 buckets and CloudFront distributions for frontend projects
"""
import pulumi
import pulumi_aws as aws
import json


def create_frontend_deployment(
    project_name: str,
    environment: str,
    frontend_projects: list[str],
    aliases: dict = None,
    acm_certificate_arn: str = None,
) -> dict:
    """Create S3 buckets and CloudFront distributions for frontend projects"""
    
    config = pulumi.Config()
    frontends = {}
    aliases = aliases or {}
    
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
        
        # Block public access - CloudFront will access via OAC
        bucket_public_access_block = aws.s3.BucketPublicAccessBlock(
            f"{project_name}-{environment}-{frontend_name}-public-access-block",
            bucket=bucket.id,
            block_public_acls=True,
            block_public_policy=True,
            ignore_public_acls=True,
            restrict_public_buckets=True,
        )
        
        # S3 bucket CORS configuration for proper asset loading
        bucket_cors = aws.s3.BucketCorsConfigurationV2(
            f"{project_name}-{environment}-{frontend_name}-cors",
            bucket=bucket.id,
            cors_rules=[aws.s3.BucketCorsConfigurationV2CorsRuleArgs(
                allowed_headers=["*"],
                allowed_methods=["GET", "HEAD"],
                allowed_origins=["*"],
                expose_headers=["ETag"],
                max_age_seconds=3000,
            )],
            opts=pulumi.ResourceOptions(depends_on=[bucket_public_access_block]),
        )
        
        # CloudFront Origin Access Control (OAC) - preferred over OAI
        oac = aws.cloudfront.OriginAccessControl(
            f"{project_name}-{environment}-{frontend_name}-oac",
            name=f"{project_name}-{environment}-{frontend_name}-oac",
            description=f"OAC for {frontend_name}",
            origin_access_control_origin_type="s3",
            signing_behavior="always",
            signing_protocol="sigv4",
        )

        # Viewer Certificate Configuration
        viewer_certificate = aws.cloudfront.DistributionViewerCertificateArgs(
            cloudfront_default_certificate=True,
        )
        
        project_aliases = aliases.get(frontend_name, [])
        
        if project_aliases and acm_certificate_arn:
            viewer_certificate = aws.cloudfront.DistributionViewerCertificateArgs(
                acm_certificate_arn=acm_certificate_arn,
                ssl_support_method="sni-only",
                minimum_protocol_version="TLSv1.2_2021",
            )
        elif project_aliases:
            # If aliases exist but no cert provided, we can't fully support HTTPS for custom domain
            # But we can try setting it (CloudFront might error if no cert matches)
            # Fallback to default cert which DOES NOT support custom domains (will error on deploy)
            pulumi.log.warn(f"Aliases defined for {frontend_name} but no ACM certificate provided. Custom domains may fail.")

        
        # CloudFront distribution with OAC
        distribution = aws.cloudfront.Distribution(
            f"{project_name}-{environment}-{frontend_name}-cdn",
            origins=[aws.cloudfront.DistributionOriginArgs(
                domain_name=bucket.bucket_regional_domain_name,
                origin_id=f"{frontend_name}-origin",
                origin_access_control_id=oac.id,
            )],
            enabled=True,
            aliases=project_aliases,
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
            viewer_certificate=viewer_certificate,
            tags={
                "Name": f"{project_name}-{environment}-{frontend_name}-cdn",
                "Project": project_name,
                "Environment": environment,
                "Frontend": frontend_name,
            }
        )
        
        # S3 bucket policy for CloudFront OAC access (set after distribution for ARN)
        # With OAC, CloudFront accesses S3 via signed requests, so we allow the CloudFront service principal
        bucket_policy = aws.s3.BucketPolicy(
            f"{project_name}-{environment}-{frontend_name}-policy",
            bucket=bucket.id,
            policy=pulumi.Output.all(
                bucket_arn=bucket.arn,
                distribution_arn=distribution.arn
            ).apply(lambda args: json.dumps({
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "AllowCloudFrontOACAccess",
                        "Effect": "Allow",
                        "Principal": {
                            "Service": "cloudfront.amazonaws.com"
                        },
                        "Action": "s3:GetObject",
                        "Resource": f"{args['bucket_arn']}/*",
                        "Condition": {
                            "StringEquals": {
                                "AWS:SourceArn": args["distribution_arn"]
                            }
                        }
                    }
                ]
            })),
            opts=pulumi.ResourceOptions(depends_on=[distribution, oac, bucket_public_access_block]),
        )
        
        frontends[frontend_name] = {
            "bucket": bucket,
            "bucket_name": bucket.id,
            "distribution": distribution,
            "url": distribution.domain_name,
        }
    
    return frontends

