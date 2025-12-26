"""
DNS Infrastructure
Route53 hosted zones and records
"""
import pulumi
import pulumi_aws as aws


def create_dns(project_name: str, environment: str, compute: dict) -> dict:
    """Create DNS infrastructure"""
    
    config = pulumi.Config()
    domain_name = config.get("domain_name", "taskjuggler.com")
    zone_id = config.get("route53_zone_id", "")
    
    if not zone_id:
        # Create hosted zone if it doesn't exist
        hosted_zone = aws.route53.Zone(
            f"{project_name}-{environment}-zone",
            name=domain_name,
            tags={
                "Name": f"{project_name}-{environment}-zone",
                "Project": project_name,
                "Environment": environment,
            }
        )
        zone_id = hosted_zone.zone_id
    else:
        hosted_zone = None
    
    # ACM Certificate for HTTPS
    certificate = aws.acm.Certificate(
        f"{project_name}-{environment}-cert",
        domain_name=domain_name,
        subject_alternative_names=[f"*.{domain_name}", f"api.{domain_name}"],
        validation_method="DNS",
        tags={
            "Name": f"{project_name}-{environment}-cert",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Certificate validation records
    certificate_validation_records = []
    # Create validation records for each domain
    for i, validation_option in enumerate(certificate.domain_validation_options):
        if validation_option.resource_record_name and validation_option.resource_record_value:
            validation_record = aws.route53.Record(
                f"{project_name}-{environment}-cert-validation-{i}",
                zone_id=zone_id,
                name=validation_option.resource_record_name,
                type=validation_option.resource_record_type,
                records=[validation_option.resource_record_value],
                ttl=300,
            )
            certificate_validation_records.append(validation_record)
    
    # Certificate validation
    certificate_validation = aws.acm.CertificateValidation(
        f"{project_name}-{environment}-cert-validation",
        certificate_arn=certificate.arn,
        validation_record_fqdns=[record.fqdn for record in certificate_validation_records],
    )
    
    # A record for API (pointing to ALB)
    api_record = aws.route53.Record(
        f"{project_name}-{environment}-api-record",
        zone_id=zone_id,
        name=f"api.{domain_name}",
        type="A",
        aliases=[aws.route53.RecordAliasArgs(
            name=compute["alb"].dns_name,
            zone_id=compute["alb"].zone_id,
            evaluate_target_health=True,
        )],
    )
    
    # A record for CloudFront (if using CDN)
    cdn_record = aws.route53.Record(
        f"{project_name}-{environment}-cdn-record",
        zone_id=zone_id,
        name=domain_name,
        type="A",
        aliases=[aws.route53.RecordAliasArgs(
            name=compute["cloudfront_distribution"].domain_name,
            zone_id=compute["cloudfront_distribution"].hosted_zone_id,
            evaluate_target_health=False,
        )],
    )
    
    return {
        "hosted_zone": hosted_zone,
        "zone_id": zone_id,
        "certificate": certificate,
        "certificate_arn": certificate_validation.certificate_arn if certificate_validation else certificate.arn,
        "api_record": api_record,
        "cdn_record": cdn_record,
    }
