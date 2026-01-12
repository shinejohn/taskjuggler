# GitHub Token Setup for CodePipeline

## ⚠️ Security Note

**Important**: Using a GitHub Personal Access Token (PAT) is less secure than CodeStar Connections. 

### Recommended: CodeStar Connections (OAuth)
- More secure (OAuth flow, no token storage)
- Better access control
- Easier to revoke access
- No token expiration issues

### Current Setup: GitHub Token
A GitHub token has been configured as a fallback. This will work, but consider migrating to CodeStar Connections for better security.

## Token Configuration

The token has been stored securely in Pulumi config as a secret:
```bash
pulumi config set --secret github_token "ghp_..."
```

## Next Steps

1. **Deploy CodePipeline**:
   ```bash
   cd infrastructure/pulumi
   source venv/bin/activate
   pulumi stack select production
   pulumi up
   ```

2. **Test the Pipeline**:
   - Make a commit to `main` branch
   - CodePipeline should automatically trigger
   - Check pipeline status in AWS Console

## Migrating to CodeStar Connections (Recommended)

When ready, migrate to CodeStar Connections:

1. Create connection in AWS Console:
   - Go to: https://console.aws.amazon.com/codesuite/settings/connections
   - Create connection → GitHub
   - Authorize via OAuth

2. Set connection ARN:
   ```bash
   pulumi config set github_connection_arn "arn:aws:codestar-connections:us-east-1:ACCOUNT:connection/CONNECTION_ID"
   ```

3. Remove token (optional):
   ```bash
   pulumi config rm github_token
   ```

4. Redeploy:
   ```bash
   pulumi up
   ```

## Token Permissions Required

The GitHub token needs these permissions:
- `repo` (Full control of private repositories)
- `admin:repo_hook` (Full control of repository hooks) - if using webhooks

## Security Best Practices

1. ✅ Token stored as Pulumi secret (encrypted)
2. ⚠️ Consider rotating token periodically
3. ⚠️ Use CodeStar Connections for production (recommended)
4. ✅ Token only used for CodePipeline source access
5. ✅ No token stored in code or version control

