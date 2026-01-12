#!/bin/bash
# Deploy CodePipeline infrastructure with Pulumi
set -e

cd "$(dirname "$0")"
source venv/bin/activate

# Set Pulumi access token
export PULUMI_ACCESS_TOKEN="<your-pulumi-access-token>"

# Select stack
pulumi stack select shinejohn/production

echo "🚀 Deploying CodePipeline infrastructure..."
echo ""

# Deploy
pulumi up --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Pipeline URL:"
pulumi stack output pipeline_url 2>/dev/null || echo "Run: pulumi stack output pipeline_url"
echo ""
echo "CodeBuild project:"
pulumi stack output codebuild_project_name 2>/dev/null || echo "Run: pulumi stack output codebuild_project_name"

