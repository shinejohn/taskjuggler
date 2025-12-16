# Railway Custom Domains & SSL Certificates Setup

Railway automatically provisions SSL certificates via Let's Encrypt when you add custom domains. No manual certificate management needed!

## Domains to Configure

- `taskjuggler.ai` → `taskjuggler-web` service
- `4process.ai` → `process-web` service
- `4projects.ai` → `projects-web` service

## Step-by-Step Setup

### 1. Add Custom Domain in Railway

For each service:

#### taskjuggler.ai → taskjuggler-web

1. Go to Railway Dashboard
2. Select your project
3. Click on **taskjuggler-web** service
4. Go to **Settings** tab
5. Scroll to **Domains** section
6. Click **+ New Domain**
7. Enter: `taskjuggler.ai`
8. Click **Add Domain**
9. Railway will show DNS records to add (see below)

#### 4process.ai → process-web

1. Go to Railway Dashboard
2. Select **process-web** service
3. Go to **Settings** → **Domains**
4. Click **+ New Domain**
5. Enter: `4process.ai`
6. Click **Add Domain**

#### 4projects.ai → projects-web

1. Go to Railway Dashboard
2. Select **projects-web** service
3. Go to **Settings** → **Domains**
4. Click **+ New Domain**
5. Enter: `4projects.ai`
6. Click **Add Domain**

### 2. Configure DNS Records

Railway will provide DNS records for each domain. You need to add these at your domain registrar (where you bought the domains).

#### Typical DNS Records Railway Provides

For each domain, Railway will show something like:

**Type: CNAME**
- **Name:** `@` (or root domain)
- **Value:** `your-service.up.railway.app`

**OR**

**Type: A**
- **Name:** `@`
- **Value:** Railway IP address

**Type: CNAME**
- **Name:** `www`
- **Value:** `your-service.up.railway.app`

### 3. Add DNS Records at Domain Registrar

Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add the DNS records Railway provided.

**Example for taskjuggler.ai:**

If Railway shows:
- Type: CNAME
- Name: `@`
- Value: `taskjuggler-web-production.up.railway.app`

Add this at your registrar:
- Type: CNAME
- Host: `@` (or leave blank for root)
- Value: `taskjuggler-web-production.up.railway.app`
- TTL: 3600 (or default)

**For www subdomain:**
- Type: CNAME
- Host: `www`
- Value: `taskjuggler-web-production.up.railway.app`
- TTL: 3600

### 4. Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Usually takes 5-30 minutes
- Check propagation: https://dnschecker.org

### 5. Railway Automatically Provisions SSL

Once DNS propagates:
- Railway detects the domain is pointing correctly
- Automatically requests SSL certificate from Let's Encrypt
- Certificate is provisioned within 1-5 minutes
- HTTPS is enabled automatically

### 6. Verify SSL Certificate

After Railway provisions the certificate:

```bash
# Check SSL certificate
curl -I https://taskjuggler.ai
curl -I https://4process.ai
curl -I https://4projects.ai

# Should return HTTP/2 200 or similar
```

Or visit in browser - should show padlock icon 🔒

## Railway CLI Method (Alternative)

You can also add domains via CLI:

```bash
# Add domain for taskjuggler-web
railway domain add taskjuggler.ai --service taskjuggler-web

# Add domain for process-web
railway domain add 4process.ai --service process-web

# Add domain for projects-web
railway domain add 4projects.ai --service projects-web

# List domains
railway domains --service taskjuggler-web
```

## Troubleshooting

### Domain Not Resolving

1. **Check DNS records are correct:**
   ```bash
   dig taskjuggler.ai
   dig 4process.ai
   dig 4projects.ai
   ```

2. **Verify DNS propagation:**
   - https://dnschecker.org
   - Enter domain and check globally

3. **Check Railway dashboard:**
   - Domain should show "Active" status
   - If "Pending", DNS hasn't propagated yet

### SSL Certificate Not Provisioning

1. **Wait 5-10 minutes** after DNS propagates
2. **Check Railway logs:**
   - Go to service → Deployments → View Logs
   - Look for SSL/certificate messages
3. **Verify domain is pointing correctly:**
   ```bash
   curl -I http://taskjuggler.ai
   # Should redirect to HTTPS or show Railway response
   ```
4. **Force certificate renewal:**
   - Remove domain in Railway
   - Re-add domain
   - Railway will request new certificate

### Certificate Expired

- Railway automatically renews certificates
- Let's Encrypt certificates expire every 90 days
- Railway renews automatically before expiration
- No action needed

## Domain Configuration Summary

| Domain | Service | Status | SSL |
|--------|---------|--------|-----|
| `taskjuggler.ai` | `taskjuggler-web` | ⏳ To Configure | ⏳ Auto |
| `4process.ai` | `process-web` | ⏳ To Configure | ⏳ Auto |
| `4projects.ai` | `projects-web` | ⏳ To Configure | ⏳ Auto |

## Quick Checklist

- [ ] Add `taskjuggler.ai` domain in Railway (taskjuggler-web)
- [ ] Add `4process.ai` domain in Railway (process-web)
- [ ] Add `4projects.ai` domain in Railway (projects-web)
- [ ] Copy DNS records from Railway for each domain
- [ ] Add DNS records at domain registrar
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify Railway shows domain as "Active"
- [ ] Wait for SSL certificate provisioning (1-5 minutes)
- [ ] Test HTTPS: `curl -I https://taskjuggler.ai`
- [ ] Test in browser - should show padlock 🔒

## Notes

- Railway uses Let's Encrypt for SSL certificates
- Certificates are automatically renewed
- No manual certificate management needed
- HTTPS is enabled automatically
- HTTP redirects to HTTPS automatically

## Support

If you encounter issues:
1. Check Railway documentation: https://docs.railway.app/guides/custom-domains
2. Check Railway status: https://status.railway.app
3. Check DNS propagation: https://dnschecker.org

