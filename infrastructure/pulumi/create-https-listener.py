#!/usr/bin/env python3
"""
Create HTTPS listener after certificate validation
"""
import subprocess
import json
import sys

AWS_REGION = "us-east-1"
PROJECT_NAME = "taskjuggler"
ENVIRONMENT = "production"
CERT_ARN = "arn:aws:acm:us-east-1:195430954683:certificate/4689482e-252f-4056-98dc-8ac924872b47"

def get_alb_arn():
    """Get ALB ARN"""
    result = subprocess.run(
        ['aws', 'elbv2', 'describe-load-balancers', '--region', AWS_REGION, '--query', f'LoadBalancers[?contains(LoadBalancerName, \'{PROJECT_NAME}-{ENVIRONMENT}-alb\')].LoadBalancerArn', '--output', 'text'],
        capture_output=True, text=True
    )
    arn = result.stdout.strip()
    return arn if arn else None

def get_target_group_arn():
    """Get target group ARN"""
    result = subprocess.run(
        ['aws', 'elbv2', 'describe-target-groups', '--region', AWS_REGION, '--query', f'TargetGroups[?contains(TargetGroupName, \'{PROJECT_NAME}-{ENVIRONMENT}-api\')].TargetGroupArn', '--output', 'text'],
        capture_output=True, text=True
    )
    arn = result.stdout.strip()
    return arn if arn else None

def check_certificate_status():
    """Check if certificate is validated"""
    result = subprocess.run(
        ['aws', 'acm', 'describe-certificate', '--certificate-arn', CERT_ARN, '--region', AWS_REGION, '--query', 'Certificate.Status', '--output', 'text'],
        capture_output=True, text=True
    )
    status = result.stdout.strip()
    return status == 'ISSUED'

def create_https_listener():
    """Create HTTPS listener"""
    if not check_certificate_status():
        status_result = subprocess.run(
            ['aws', 'acm', 'describe-certificate', '--certificate-arn', CERT_ARN, '--region', AWS_REGION, '--query', 'Certificate.Status', '--output', 'text'],
            capture_output=True, text=True
        )
        print(f"Certificate status is not ISSUED. Current status: {status_result.stdout.strip()}")
        print("Please wait for certificate validation to complete.")
        return False
    
    alb_arn = get_alb_arn()
    tg_arn = get_target_group_arn()
    
    if not alb_arn or not tg_arn:
        print("ERROR: Could not find ALB or Target Group")
        return False
    
    # Check if HTTPS listener already exists
    result = subprocess.run(
        ['aws', 'elbv2', 'describe-listeners', '--load-balancer-arn', alb_arn, '--region', AWS_REGION, '--query', 'Listeners[?Port==`443`].ListenerArn', '--output', 'text'],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        print("HTTPS listener already exists")
        return True
    
    # Create HTTPS listener
    try:
        result = subprocess.run([
            'aws', 'elbv2', 'create-listener',
            '--load-balancer-arn', alb_arn,
            '--protocol', 'HTTPS',
            '--port', '443',
            '--ssl-policy', 'ELBSecurityPolicy-TLS13-1-2-2021-06',
            '--certificates', f'CertificateArn={CERT_ARN}',
            '--default-actions', f'Type=forward,TargetGroupArn={tg_arn}',
            '--region', AWS_REGION,
            '--query', 'Listeners[0].ListenerArn',
            '--output', 'text'
        ], capture_output=True, text=True, check=True)
        
        print(f"✓ HTTPS listener created: {result.stdout.strip()}")
        
        # Update HTTP listener to redirect
        http_result = subprocess.run(
            ['aws', 'elbv2', 'describe-listeners', '--load-balancer-arn', alb_arn, '--region', AWS_REGION, '--query', 'Listeners[?Port==`80`].ListenerArn', '--output', 'text'],
            capture_output=True, text=True
        )
        if http_result.stdout.strip():
            http_listener_arn = http_result.stdout.strip()
            subprocess.run([
                'aws', 'elbv2', 'modify-listener',
                '--listener-arn', http_listener_arn,
                '--default-actions', 'Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}',
                '--region', AWS_REGION
            ], check=True)
            print("✓ HTTP listener updated to redirect to HTTPS")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR creating HTTPS listener: {e.stderr}")
        return False

if __name__ == "__main__":
    print("Checking certificate status...")
    if create_https_listener():
        print("\n✓ HTTPS configuration complete!")
    else:
        print("\n✗ HTTPS configuration failed")
        sys.exit(1)
