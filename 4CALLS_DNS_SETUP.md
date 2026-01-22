# 4Calls.ai DNS Setup Guide

## Overview
This guide explains how to configure DNS for `4calls.ai` to work with CloudFront.

## Prerequisites
1. Domain `4calls.ai` registered in GoDaddy
2. AWS Account with Pulumi infrastructure deployed
3. ACM certificate created in `us-east-1` region (required for CloudFront)

## Step 1: ACM Certificate Validation

After deploying the infrastructure, you'll need to validate the ACM certificate:

1. **Get Certificate Validation Records**
   - Go to AWS Certificate Manager (ACM) in **us-east-1** region
   - Find the certificate for `4calls.ai`
   - Copy the DNS validation records (CNAME records)

2. **Add Validation Records in GoDaddy**
   - Log into GoDaddy DNS management
   - Add the CNAME records provided by ACM
   - Wait for validation (usually 5-30 minutes)

## Step 2: Configure GoDaddy DNS

Once the certificate is validated, configure DNS in GoDaddy:

### Option A: CNAME Record (Recommended)
```
Type: CNAME
Name: @ (or leave blank for root domain)
Value: d3l52oz9viqx0o.cloudfront.net
TTL: 600 (or default)
```

**Note:** GoDaddy may not support CNAME for root domain (@). If so, use Option B.

### Option B: CNAME Flattening (If GoDaddy supports it)
Some DNS providers support CNAME flattening for root domains. Check GoDaddy's documentation.

### Option C: Redirect (Alternative)
If CNAME doesn't work for root domain:
1. Create CNAME for `www.4calls.ai` → `d3l52oz9viqx0o.cloudfront.net`
2. Set up redirect in GoDaddy: `4calls.ai` → `www.4calls.ai`

## Step 3: Verify CloudFront Configuration

Ensure CloudFront distribution has:
1. **Alternate Domain Names (CNAMEs)**: `4calls.ai` (and `www.4calls.ai` if using redirect)
2. **SSL Certificate**: Select the ACM certificate for `4calls.ai` (must be in us-east-1)
3. **Default Root Object**: `index.html`
4. **Custom Error Responses**: 
   - 404 → 200 → `/index.html`
   - 403 → 200 → `/index.html`

## Step 4: Verify DNS Propagation

After configuring DNS:
1. Wait 5-30 minutes for DNS propagation
2. Test with: `nslookup 4calls.ai` or `dig 4calls.ai`
3. Should resolve to CloudFront IP addresses

## Step 5: Test HTTPS

1. Visit `https://4calls.ai`
2. Should load without SSL errors
3. Check browser shows valid certificate

## Troubleshooting

### Certificate Not Validated
- Check DNS validation records are correctly added in GoDaddy
- Wait up to 30 minutes for propagation
- Verify records match exactly what ACM shows

### DNS Not Resolving
- Verify CNAME record is correct in GoDaddy
- Check TTL and wait for propagation
- Use `dig` or `nslookup` to verify

### SSL Certificate Error
- Ensure certificate is in **us-east-1** region
- Verify certificate is attached to CloudFront distribution
- Check certificate covers `4calls.ai` domain

### 403 Error on CloudFront
- Verify S3 bucket policy allows CloudFront OAC access
- Check CloudFront distribution is enabled
- Ensure `index.html` exists in S3 bucket

## CloudFront Distribution Details

- **Distribution ID**: Check AWS Console
- **Domain Name**: `d3l52oz9viqx0o.cloudfront.net`
- **Certificate Region**: `us-east-1` (REQUIRED)
- **Certificate ARN**: Check ACM in us-east-1

## Quick Reference

### GoDaddy DNS Records Needed:
```
Type: CNAME
Name: @ (or www)
Value: d3l52oz9viqx0o.cloudfront.net
```

### ACM Certificate Validation (in GoDaddy):
```
Type: CNAME
Name: [from ACM validation]
Value: [from ACM validation]
```

### CloudFront Settings:
- Alternate Domain Names: `4calls.ai`
- SSL Certificate: ACM cert in us-east-1
- Viewer Protocol Policy: Redirect HTTP to HTTPS

