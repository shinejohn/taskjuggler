"""
DNS Infrastructure
Route53 hosted zones and records
"""
import pulumi
from typing import Union
import pulumi_aws as aws


def create_frontend_dns_records(
    project_name: str,
    environment: str,
    zone_id: Union[str, pulumi.Output[str]],
    frontend_deployments: dict,
    domain_aliases: dict,
) -> dict:
    """Create DNS records for frontend subdomains pointing to CloudFront distributions"""
    
    frontend_records = {}
    
    for frontend_name, aliases in domain_aliases.items():
        if frontend_name not in frontend_deployments:
            continue
            
        distribution = frontend_deployments[frontend_name]["distribution"]
        
        for alias in aliases:
            # Extract subdomain from alias (e.g., "urpa.taskjuggler.com" -> "urpa")
            # For external domains like "app.4calls.ai", use the full domain
            if alias.endswith(".taskjuggler.com"):
                subdomain = alias.replace(".taskjuggler.com", "")
                record_name = alias
            else:
                # External domain - need to check if zone_id matches
                # For now, skip external domains or handle separately
                continue
            
            # Create A record with alias pointing to CloudFront
            record = aws.route53.Record(
                f"{project_name}-{environment}-{frontend_name}-{subdomain}-record",
                zone_id=zone_id,
                name=record_name,
                type="A",
                aliases=[aws.route53.RecordAliasArgs(
                    name=distribution.domain_name,
                    zone_id=distribution.hosted_zone_id,
                    evaluate_target_health=False,
                )],
            )
            frontend_records[f"{frontend_name}-{subdomain}"] = record
    
    return frontend_records


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
        subject_alternative_names=[f"*.{domain_name}", f"api.{domain_name}", "app.4calls.ai", "urpa.ai"],
        validation_method="DNS",
        tags={
            "Name": f"{project_name}-{environment}-cert",
            "Project": project_name,
            "Environment": environment,
        }
    )
    
    # Certificate validation records
    # Note: domain_validation_options is a Pulumi Output, so we need to handle it differently
    # For now, we'll create validation records manually for the main domain and wildcard
    certificate_validation_records = []
    
    # Create validation record for main domain
    main_validation_record = aws.route53.Record(
        f"{project_name}-{environment}-cert-validation-main",
        zone_id=zone_id,
        name=certificate.domain_validation_options.apply(lambda opts: opts[0].resource_record_name if opts and len(opts) > 0 else ""),
        type=certificate.domain_validation_options.apply(lambda opts: opts[0].resource_record_type if opts and len(opts) > 0 else "CNAME"),
        records=certificate.domain_validation_options.apply(lambda opts: [opts[0].resource_record_value] if opts and len(opts) > 0 else []),
        ttl=300,
    )
    certificate_validation_records.append(main_validation_record)
    
    # Create validation record for wildcard domain (if exists)
    wildcard_validation_record = aws.route53.Record(
        f"{project_name}-{environment}-cert-validation-wildcard",
        zone_id=zone_id,
        name=certificate.domain_validation_options.apply(lambda opts: opts[1].resource_record_name if opts and len(opts) > 1 else ""),
        type=certificate.domain_validation_options.apply(lambda opts: opts[1].resource_record_type if opts and len(opts) > 1 else "CNAME"),
        records=certificate.domain_validation_options.apply(lambda opts: [opts[1].resource_record_value] if opts and len(opts) > 1 else []),
        ttl=300,
    )
    certificate_validation_records.append(wildcard_validation_record)
    
    # Certificate validation
    # Note: DNS records are already in place, validation should complete automatically
    # Certificate validation will wait for DNS propagation (default timeout is sufficient)
    certificate_validation = aws.acm.CertificateValidation(
        f"{project_name}-{environment}-cert-validation",
        certificate_arn=certificate.arn,
        validation_record_fqdns=pulumi.Output.all(*[record.fqdn for record in certificate_validation_records]),
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
