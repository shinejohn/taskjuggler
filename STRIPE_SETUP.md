# Stripe Secret Key Setup

## Current Status
❌ **Stripe secret key is NOT configured** in AWS Secrets Manager

## How to Get Your Stripe Secret Key

### 1. Get from Stripe Dashboard

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/apikeys
2. **Sign in** to your Stripe account
3. **Select environment**:
   - **Test mode**: For development/testing (keys start with `sk_test_`)
   - **Live mode**: For production (keys start with `sk_live_`)
4. **Copy the Secret key** (not the Publishable key)
   - Format: `sk_live_xxxxx` or `sk_test_xxxxx`

### 2. Store in AWS Secrets Manager

**Option A: Via AWS Console**
1. Go to: https://console.aws.amazon.com/secretsmanager/secret?name=taskjuggler%2Fproduction%2Fapp&region=us-east-1
2. Click **"Retrieve secret value"**
3. Click **"Edit"**
4. Update the JSON to include your Stripe keys:
   ```json
   {
     "STRIPE_KEY": "pk_live_xxxxx",
     "STRIPE_SECRET": "sk_live_xxxxx",
     "STRIPE_WEBHOOK_SECRET": "whsec_xxxxx"
   }
   ```
5. Click **"Save"**

**Option B: Via AWS CLI**
```bash
aws secretsmanager update-secret \
  --secret-id "taskjuggler/production/app" \
  --region us-east-1 \
  --secret-string '{
    "APP_KEY": "base64:tempkey",
    "STRIPE_KEY": "pk_live_YOUR_KEY_HERE",
    "STRIPE_SECRET": "sk_live_YOUR_SECRET_HERE",
    "STRIPE_WEBHOOK_SECRET": "whsec_YOUR_WEBHOOK_SECRET_HERE"
  }'
```

### 3. Get Stripe Webhook Secret

1. **Go to Stripe Webhooks**: https://dashboard.stripe.com/webhooks
2. **Create or select webhook endpoint**
3. **Copy the Signing secret** (starts with `whsec_`)

---

## Required Stripe Keys

| Key | Environment Variable | Format | Where to Get |
|-----|---------------------|--------|--------------|
| **Publishable Key** | `STRIPE_KEY` | `pk_live_xxxxx` | Stripe Dashboard → API Keys |
| **Secret Key** | `STRIPE_SECRET` | `sk_live_xxxxx` | Stripe Dashboard → API Keys |
| **Webhook Secret** | `STRIPE_WEBHOOK_SECRET` | `whsec_xxxxx` | Stripe Dashboard → Webhooks |

---

## For Local Development

Add to `taskjuggler-api/.env`:
```bash
STRIPE_KEY=pk_test_xxxxx
STRIPE_SECRET=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## Verify Configuration

After setting in AWS Secrets Manager:
```bash
aws secretsmanager get-secret-value \
  --secret-id "taskjuggler/production/app" \
  --region us-east-1 \
  --query 'SecretString' \
  --output text | python3 -m json.tool | grep STRIPE
```

Should show your Stripe keys (not empty strings).

---

**Note**: The Stripe secret key is currently **empty** in AWS Secrets Manager. You need to add it from your Stripe account.

