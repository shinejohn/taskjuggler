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
        
        # CloudFront Origin Access Control (OAC) - preferred over OAI
        oac = aws.cloudfront.OriginAccessControl(
            f"{project_name}-{environment}-{frontend_name}-oac",
            name=f"{project_name}-{environment}-{frontend_name}-oac",
            description=f"OAC for {frontend_name}",
            origin_access_control_origin_type="s3",
            signing_behavior="always",
            signing_protocol="sigv4",
        )
        
        # CloudFront distribution with OAC
        distribution = aws.cloudfront.Distribution(
            f"{project_name}-{environment}-{frontend_name}-cdn",
            origins=[aws.cloudfront.DistributionOriginArgs(
                domain_name=bucket.bucket_regional_domain_name,
                origin_id=f"{frontend_name}-origin",
                origin_access_control_id=oac.id,
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
        
        # S3 bucket policy for CloudFront OAC access (set after distribution for ARN)
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
                        "Sid": "AllowCloudFrontServicePrincipal",
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
            opts=pulumi.ResourceOptions(depends_on=[distribution, oac]),
        )
        
        frontends[frontend_name] = {
            "bucket": bucket,
            "bucket_name": bucket.id,
            "distribution": distribution,
            "url": distribution.domain_name,
        }
    
    return frontends

