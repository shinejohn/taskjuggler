# Manual Webhook Setup from GitHub Side

Since AWS is hitting GitHub API limits, let's set up the webhook from GitHub instead.

## Option 1: Use GitHub Actions to Trigger CodeBuild

This is the most reliable approach and avoids webhook setup entirely.

### Create GitHub Actions Workflow

Create file: `.github/workflows/trigger-codebuild.yml`

```yaml
name: Trigger CodeBuild

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Trigger CodeBuild
        run: |
          aws codebuild start-build \
            --project-name taskjuggler-production-build \
            --region us-east-1
```

### Setup GitHub Secrets

1. Go to: https://github.com/shinejohn/taskjuggler/settings/secrets/actions
2. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## Option 2: Wait and Retry

The GitHub API limit might reset. Wait 15-30 minutes and try:

```bash
cd infrastructure/pulumi
./create-webhook.sh
```

## Option 3: Check if Webhook URL Exists

Sometimes AWS creates the webhook URL even if creation fails. Check:

```bash
aws codebuild batch-get-projects \
  --names taskjuggler-production-build \
  --region us-east-1 \
  --query 'projects[0].webhook.url' \
  --output text
```

If a URL exists, add it to GitHub manually.

## Recommendation

**Use Option 1 (GitHub Actions)** - It's more reliable and gives you better control over when builds trigger.

