# Check SSL Certificate Status

Railway automatically provisions SSL certificates via Let's Encrypt once DNS propagates. Here's how to check status and verify SSL.

## Automatic SSL Provisioning

Railway will automatically:
1. Detect when DNS propagates (domain pointing to Railway)
2. Request SSL certificate from Let's Encrypt
3. Provision certificate (usually 1-5 minutes)
4. Enable HTTPS automatically

**No manual action needed!**

## Check SSL Status

### 1. Check Domain Status in Railway Dashboard

For each service:
- Go to Railway Dashboard
- Select service (taskjuggler-web, process-web, projects-web)
- Go to **Settings** → **Domains**
- Check domain status:
  - ✅ **Active** = DNS propagated, SSL should be provisioning/active
  - ⏳ **Pending** = DNS not propagated yet, wait longer
  - ❌ **Error** = DNS issue, check DNS records

### 2. Check DNS Propagation

```bash
# Check if DNS is pointing to Railway
dig taskjuggler.ai +short
dig 4process.ai +short
dig 4projects.ai +short

# Should show Railway IP or CNAME
```

Or use online tool: https://dnschecker.org

### 3. Test HTTPS Connection

```bash
# Test SSL certificate
curl -I https://taskjuggler.ai
curl -I https://4process.ai
curl -I https://4projects.ai

# Should return HTTP/2 200 or similar
# If SSL not ready, you'll get connection error
```

### 4. Check SSL Certificate Details

```bash
# Check certificate details
openssl s_client -connect taskjuggler.ai:443 -servername taskjuggler.ai < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Or use online tool: https://www.ssllabs.com/ssltest/
```

### 5. Verify in Browser

Visit each domain in browser:
- `https://taskjuggler.ai`
- `https://4process.ai`
- `https://4projects.ai`

Look for:
- 🔒 Padlock icon in address bar
- "Secure" or "Connection is secure" message
- HTTPS in URL (not HTTP)

## Timeline

After DNS propagates:
- **0-1 minute:** Railway detects domain is pointing correctly
- **1-5 minutes:** Railway requests SSL certificate from Let's Encrypt
- **5-10 minutes:** Certificate is provisioned and HTTPS is enabled

**Total wait time:** Usually 5-15 minutes after DNS propagates

## Troubleshooting

### SSL Not Provisioning After 15 Minutes

1. **Verify DNS is pointing correctly:**
   ```bash
   dig taskjuggler.ai
   # Should show Railway IP or CNAME
   ```

2. **Check Railway dashboard:**
   - Domain should show "Active" status
   - If "Pending", DNS hasn't propagated yet

3. **Check Railway logs:**
   - Go to service → Deployments → View Logs
   - Look for SSL/certificate messages

4. **Force certificate request:**
   - Remove domain in Railway
   - Re-add domain
   - Railway will request new certificate

### Certificate Errors

If you see certificate errors:

1. **Wait a few more minutes** - Let's Encrypt may be rate-limited
2. **Check domain status** in Railway dashboard
3. **Verify DNS** is pointing correctly
4. **Try removing and re-adding** domain in Railway

### HTTP Not Redirecting to HTTPS

Railway should automatically redirect HTTP to HTTPS. If not:
- Check Railway dashboard for redirect settings
- Verify domain is "Active" in Railway
- Wait a few more minutes for redirect to activate

## Verify All Domains

Run this to check all three:

```bash
#!/bin/bash
echo "Checking SSL status for all domains..."
echo ""

for domain in taskjuggler.ai 4process.ai 4projects.ai; do
  echo "Checking $domain..."
  if curl -I -s "https://$domain" | head -1 | grep -q "200\|301\|302"; then
    echo "✅ $domain - HTTPS working"
  else
    echo "⏳ $domain - SSL not ready yet"
  fi
  echo ""
done
```

## What to Expect

### Before SSL is Ready:
- Domain resolves but HTTPS doesn't work
- Browser shows "Connection refused" or "SSL error"
- Railway dashboard shows domain as "Pending" or "Active" but no SSL yet

### After SSL is Ready:
- ✅ HTTPS works
- ✅ Browser shows padlock 🔒
- ✅ Railway dashboard shows domain as "Active"
- ✅ HTTP redirects to HTTPS automatically

## Current Status

Check your domains now:

```bash
# Quick check
curl -I https://taskjuggler.ai 2>&1 | head -1
curl -I https://4process.ai 2>&1 | head -1
curl -I https://4projects.ai 2>&1 | head -1
```

If you see `HTTP/2 200` or `HTTP/1.1 200`, SSL is working! 🎉

