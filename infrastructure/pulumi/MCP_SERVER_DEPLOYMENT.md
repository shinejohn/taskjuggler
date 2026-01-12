# MCP Server Deployment Guide

## Overview

The MCP (Model Context Protocol) server for SiteHealth Scanner is now included in the Pulumi infrastructure and will be deployed as part of the main infrastructure deployment.

## What Gets Deployed

### Infrastructure Components

1. **ECR Repository**: `taskjuggler/mcp-server`
   - Stores Docker images for the MCP server

2. **ECS Task Definition**: `taskjuggler-production-mcp-server`
   - CPU: 256
   - Memory: 512 MB
   - Container port: 3001
   - Health check: `/health` endpoint

3. **ECS Service**: `taskjuggler-production-mcp-server`
   - Desired count: 1 (always running)
   - Deployed in private subnets
   - Connected to ALB via target group

4. **ALB Target Group**: `taskjuggler-production-mcp-tg`
   - Port: 3001
   - Health check: `/health`
   - Path-based routing: `/mcp/*`

5. **ALB Listener Rule**: Routes `/mcp/*` requests to MCP server

6. **CloudWatch Log Group**: `/ecs/taskjuggler-production-mcp-server`
   - Log retention: 7 days

7. **IAM Roles**:
   - Execution role (for ECS)
   - Task role (for API access)

## Deployment Steps

### Step 1: Build and Push Docker Image

```bash
cd scanner-mcp

# Build and push to ECR
./build-and-push.sh
```

Or manually:

```bash
# Build
docker build -t taskjuggler/mcp-server:latest .

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 195430954683.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag taskjuggler/mcp-server:latest 195430954683.dkr.ecr.us-east-1.amazonaws.com/taskjuggler/mcp-server:latest
docker push 195430954683.dkr.ecr.us-east-1.amazonaws.com/taskjuggler/mcp-server:latest
```

### Step 2: Deploy Infrastructure

```bash
cd infrastructure/pulumi
source venv/bin/activate
pulumi up --yes
```

This will create:
- ECR repository
- ECS task definition
- ECS service
- ALB target group and listener rule
- All supporting resources

### Step 3: Verify Deployment

After deployment, check:

```bash
# Get MCP server URL
pulumi stack output mcp_server_url

# Check health
curl $(pulumi stack output mcp_server_url)/health

# View service status
aws ecs describe-services \
  --cluster taskjuggler-production-cluster \
  --services taskjuggler-production-mcp-server \
  --region us-east-1
```

## MCP Server Endpoints

After deployment, the MCP server will be available at:

- **Base URL**: `http://<alb-dns>/mcp`
- **Health Check**: `http://<alb-dns>/mcp/health`
- **Tools List**: `http://<alb-dns>/mcp/tools`
- **Tool Call**: `POST http://<alb-dns>/mcp/tools/{toolName}`
- **MCP Protocol**: `POST http://<alb-dns>/mcp/call`

## Environment Variables

The MCP server container receives:

- `PORT=3001`
- `API_URL=https://api.taskjuggler.com` (or from config)
- `AUTH_API_URL=https://api.taskjuggler.com`
- `SCANNER_API_URL=https://api.taskjuggler.com/api`
- `NODE_ENV=production`

## Authentication

The MCP server requires an API key in the `X-API-Key` header or `api_key` query parameter.

Users get API keys by:
1. Registering: `POST /api/mcp/register`
2. Logging in: `POST /api/mcp/login`

## Viewing in Pulumi Cloud

After deployment, you can see the MCP server resources at:

**https://app.pulumi.com/shinejohn/TaskJuggler/production**

Look for resources with `mcp-server` in the name.

## Troubleshooting

### Service Not Starting

```bash
# Check ECS service events
aws ecs describe-services \
  --cluster taskjuggler-production-cluster \
  --services taskjuggler-production-mcp-server \
  --region us-east-1 \
  --query 'services[0].events[:5]'

# Check CloudWatch logs
aws logs tail /ecs/taskjuggler-production-mcp-server --follow --region us-east-1
```

### Health Check Failing

```bash
# Check target group health
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn> \
  --region us-east-1

# Check container logs
aws logs tail /ecs/taskjuggler-production-mcp-server --follow --region us-east-1
```

### Image Not Found

Make sure you've built and pushed the Docker image:

```bash
cd scanner-mcp
./build-and-push.sh
```

---

**The MCP server is now part of the infrastructure and will be deployed with `pulumi up`!**





