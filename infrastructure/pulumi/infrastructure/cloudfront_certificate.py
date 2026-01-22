"""
CloudFront Certificate Management
Handles ACM certificates for CloudFront distributions (must be in us-east-1)
"""
import pulumi
import pulumi_aws as aws


def create_cloudfront_certificate(
    project_name: str,
    environment: str,
    domains: list[str],
) -> dict:
    """
    Create ACM certificate in us-east-1 for CloudFront distributions
    
    CloudFront requires certificates to be in us-east-1 regardless of where
    other resources are located.
    """
    
    # Provider for us-east-1 (required for CloudFront certificates)
    cloudfront_provider = aws.Provider(
        "cloudfront-cert-provider",
        region="us-east-1",
    )
    
    # Primary domain (first in list)
    primary_domain = domains[0] if domains else None
    # Additional domains as SANs
    subject_alternative_names = domains[1:] if len(domains) > 1 else []
    
    if not primary_domain:
        raise ValueError("At least one domain must be provided")
    
    certificate = aws.acm.Certificate(
        f"{project_name}-{environment}-cloudfront-cert",
        domain_name=primary_domain,
        subject_alternative_names=subject_alternative_names,
        validation_method="DNS",
        opts=pulumi.ResourceOptions(provider=cloudfront_provider),
        tags={
            "Name": f"{project_name}-{environment}-cloudfront-cert",
            "Project": project_name,
            "Environment": environment,
            "Purpose": "CloudFront",
        }
    )
    
    # Export validation options for manual DNS configuration
    # Note: For external domains (like app.4calls.ai), DNS validation records
    # must be added to the domain's DNS provider (GoDaddy)
    validation_options = certificate.domain_validation_options
    
    return {
        "certificate": certificate,
        "certificate_arn": certificate.arn,
        "validation_options": validation_options,
        "domains": domains,
    }

