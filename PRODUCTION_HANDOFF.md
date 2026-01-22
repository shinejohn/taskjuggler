# Production Handoff & Readiness Report

## 1. Secrets Configuration
The following secrets have been successfully populated in AWS Secrets Manager (Region: `us-east-1`).
**Action:** Please rotate these values immediately if "CHANGE_ME" placeholders were used or if you wish to use your own secure passwords.

| Secret Name | Description | Status |
|---|---|---|
| `taskjuggler/production/redis` | Redis Auth Token | ✅ Configured (Randomly Generated) |
| `taskjuggler/production/database` | RDS Credentials (JSON) | ✅ Configured (Randomly Generated Password) |
| `taskjuggler/production/app` | App Keys & AWS Credentials | ⚠️ **Action Required:** Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` from "CHANGE_ME" |

**To update the App Secrets:**
```bash
aws secretsmanager put-secret-value \
    --secret-id "taskjuggler/production/app" \
    --secret-string "{\"APP_KEY\":\"...\",\"AWS_ACCESS_KEY_ID\":\"YOUR_REAL_KEY\",\"AWS_SECRET_ACCESS_KEY\":\"YOUR_REAL_SECRET\", ...}"
```

## 2. DNS & Domain Mapping
Configure your DNS provider (e.g., Route53, GoDaddy) with the following CNAME records.

| Service / App | Recommended Subdomain | Target (CNAME Value) |
|---|---|---|
| **4Calls (Coordinator)** | `app.4calls.ai` | `d3l52oz9viqx0o.cloudfront.net` |
| **API** | `api.taskjuggler.com` | `taskjuggler-production-alb-230168975.us-east-1.elb.amazonaws.com` |
| **TaskJuggler Web** | `app.taskjuggler.com` | `d3uvfru4v0wilx.cloudfront.net` |
| **Scanner Web** | `scanner.taskjuggler.com` | `dzgtd08xmaydd.cloudfront.net` |
| **Projects Web** | `projects.taskjuggler.com` | `d123yb6oxze472.cloudfront.net` |
| **Process Web** | `process.taskjuggler.com` | `d1nwg3454j9jud.cloudfront.net` |
| **URPA Web** | `urpa.taskjuggler.com` | `d1zilsk1lgdhvs.cloudfront.net` |
| **IdeaCircuit Web** | `ideas.taskjuggler.com` | `d1zqqh906slong.cloudfront.net` |

## 3. Rebranding Status
The `coordinator-web` application has been rebranded to **4Calls.ai**.
- **App Name:** 4Calls.ai
- **Terminology:** "Coordinator" -> "4 Call"
- **Environment:** Production builds will perform this substitution automatically via the updated Vue components.

## 4. Deployment Pipeline
- **Infrastructure:** Managed via Pulumi (`infrastructure/pulumi`).
- **CI/CD:** GitHub Actions workflows (`.github/workflows`) are ready but require a manual `git push` to trigger the initial run on GitHub.
- **Docker:** Standardized Dockerfiles are verified.

## 5. Next Steps
1.  **Push Code:** Run `git push origin main` to sync local changes (rebranding, workflows) to GitHub.
2.  **Update Secrets:** Replace "CHANGE_ME" values in AWS Secrets Manager.
3.  **Update DNS:** Create the CNAME records listed above.
4.  **Final Verification:** Visit `https://app.4calls.ai` (once DNS propagates) to verify the rebranding and application health.
