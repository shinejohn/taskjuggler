# Quick Domain & SSL Setup Guide

## 🚀 Quick Start

Railway **automatically** provisions SSL certificates via Let's Encrypt. Just add the domains!

## Option 1: Railway Dashboard (Recommended)

### For Each Domain:

1. **Railway Dashboard** → Select service
2. **Settings** → **Domains** → **+ New Domain**
3. Enter domain name
4. Copy DNS records shown
5. Add DNS records at domain registrar
6. Wait 5-30 minutes for DNS propagation
7. Railway auto-provisions SSL (1-5 minutes)

### Domains to Add:

| Domain | Service | Steps |
|--------|---------|-------|
| `taskjuggler.ai` | `taskjuggler-web` | Settings → Domains → Add |
| `4process.ai` | `process-web` | Settings → Domains → Add |
| `4projects.ai` | `projects-web` | Settings → Domains → Add |

## Option 2: Railway CLI

```bash
# Run the setup script
./setup-custom-domains.sh

# Or manually:
railway domain add taskjuggler.ai --service taskjuggler-web
railway domain add 4process.ai --service process-web
railway domain add 4projects.ai --service projects-web
```

## DNS Records

After adding domain in Railway, you'll see DNS records like:

**CNAME Record:**
- Type: `CNAME`
- Name: `@` (or blank for root)
- Value: `your-service.up.railway.app`
- TTL: `3600`

Add these at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)

## Timeline

1. **Add domain in Railway** → Instant
2. **Add DNS records** → 5 minutes
3. **DNS propagation** → 5-30 minutes
4. **SSL provisioning** → 1-5 minutes after DNS
5. **Total time** → ~10-40 minutes

## Verify SSL

```bash
# Check SSL certificates
curl -I https://taskjuggler.ai
curl -I https://4process.ai
curl -I https://4projects.ai

# Should return HTTP/2 200
```

## Important Notes

✅ **SSL is automatic** - Railway handles everything  
✅ **Auto-renewal** - Certificates renew automatically  
✅ **HTTPS enabled** - HTTP redirects to HTTPS  
✅ **No manual cert management** - Fully automated  

## Troubleshooting

**Domain not resolving?**
- Check DNS records are correct
- Wait for DNS propagation (check: https://dnschecker.org)

**SSL not provisioning?**
- Wait 5-10 minutes after DNS propagates
- Check Railway dashboard for domain status
- Verify domain is pointing correctly

**Certificate expired?**
- Railway auto-renews (no action needed)
- Let's Encrypt certs expire every 90 days
- Renewal happens automatically

## Full Guide

See `RAILWAY_CUSTOM_DOMAINS_SSL.md` for detailed instructions.

