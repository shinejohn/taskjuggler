# GitHub Actions Workflows - DISABLED

All GitHub Actions workflows have been disabled in favor of AWS CodePipeline/CodeBuild.

## Migration to AWS CodePipeline

The CI/CD pipeline has been migrated to AWS-native services:

- **CodePipeline**: Orchestrates the entire CI/CD process
- **CodeBuild**: Builds Docker images and runs tests
- **ECS**: Deploys to production automatically

## Benefits

- ✅ No GitHub Actions billing
- ✅ Native AWS IAM integration (no GitHub Secrets needed)
- ✅ Direct integration with ECR and ECS
- ✅ Everything managed in AWS

## Workflow Files

All previous workflow files have been moved to `.github/workflows-disabled/`:
- `backend-tests.yml`
- `build.yml`
- `ci.yml`
- `deploy.yml`
- `frontend-tests.yml`
- `lint.yml`
- `trigger-codebuild.yml`

## Current CI/CD

The pipeline is now managed via Pulumi infrastructure code:
- `infrastructure/pulumi/infrastructure/codepipeline.py`
- `infrastructure/pulumi/infrastructure/codebuild.py`

Pipeline triggers automatically on pushes to `main` branch via GitHub webhook.
