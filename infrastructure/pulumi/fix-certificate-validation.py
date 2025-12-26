#!/usr/bin/env python3
"""
Fix SSL Certificate Validation by creating DNS records
"""
import boto3
import json
import sys

AWS_REGION = "us-east-1"
CERT_ARN = "arn:aws:acm:us-east-1:195430954683:certificate/4689482e-252f-4056-98dc-8ac924872b47"
DOMAIN_NAME = "taskjuggler.com"

def get_certificate_validation_records():
    """Get DNS validation records needed for certificate"""
    acm = boto3.client('acm', region_name=AWS_REGION)
    
    cert = acm.describe_certificate(CertificateArn=CERT_ARN)
    validation_options = cert['Certificate']['DomainValidationOptions']
    
    records = []
    for option in validation_options:
        if 'ResourceRecord' in option:
            records.append({
                'domain': option['DomainName'],
                'name': option['ResourceRecord']['Name'],
                'type': option['ResourceRecord']['Type'],
                'value': option['ResourceRecord']['Value']
            })
    
    return records

def get_hosted_zone_id(domain):
    """Get Route53 hosted zone ID for domain"""
    route53 = boto3.client('route53')
    
    zones = route53.list_hosted_zones()
    for zone in zones['HostedZones']:
        # Remove trailing dot
        zone_name = zone['Name'].rstrip('.')
        if zone_name == domain or domain.endswith('.' + zone_name):
            return zone['Id'].split('/')[-1]
    
    return None

def create_dns_record(zone_id, name, record_type, value):
    """Create DNS record in Route53"""
    route53 = boto3.client('route53')
    
    # Remove trailing dot from name if present
    name = name.rstrip('.')
    
    try:
        response = route53.change_resource_record_sets(
            HostedZoneId=zone_id,
            ChangeBatch={
                'Changes': [{
                    'Action': 'UPSERT',
                    'ResourceRecordSet': {
                        'Name': name,
                        'Type': record_type,
                        'TTL': 300,
                        'ResourceRecords': [{'Value': value}]
                    }
                }]
            }
        )
        return response['ChangeInfo']['Id']
    except Exception as e:
        print(f"Error creating record: {e}")
        return None

def main():
    print("Getting certificate validation records...")
    records = get_certificate_validation_records()
    
    if not records:
        print("No validation records found. Certificate may already be validated.")
        return
    
    print(f"\nFound {len(records)} validation record(s) needed:")
    for record in records:
        print(f"  Domain: {record['domain']}")
        print(f"  Name: {record['name']}")
        print(f"  Type: {record['type']}")
        print(f"  Value: {record['value']}")
        print()
    
    zone_id = get_hosted_zone_id(DOMAIN_NAME)
    if not zone_id:
        print(f"ERROR: Hosted zone not found for {DOMAIN_NAME}")
        print("Please create the hosted zone first or update the domain name.")
        return
    
    print(f"Found hosted zone: {zone_id}")
    
    print("\nCreating DNS validation records...")
    for record in records:
        change_id = create_dns_record(
            zone_id,
            record['name'],
            record['type'],
            record['value']
        )
        if change_id:
            print(f"✓ Created record for {record['name']} (Change ID: {change_id})")
        else:
            print(f"✗ Failed to create record for {record['name']}")
    
    print("\nDNS records created. Waiting for certificate validation...")
    print("This may take a few minutes. Check status with:")
    print(f"aws acm describe-certificate --certificate-arn {CERT_ARN} --region {AWS_REGION}")

if __name__ == "__main__":
    main()
