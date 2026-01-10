# Connecting to TaskJuggler MCP Server from Cursor
## Public MCP Server with User Authentication

**Version:** 2.0  
**Last Updated:** December 2025

---

## Overview

The TaskJuggler MCP Server is now **publicly available** and accessible from anywhere. This guide shows you how to connect to it from Cursor IDE using your user account and API key.

---

## Quick Start

### Step 1: Create an Account

Register for a free MCP account:

```bash
curl -X POST https://api.taskjuggler.com/api/mcp/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-secure-password",
    "name": "Your Name"
  }'
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "your-email@example.com",
    "name": "Your Name"
  },
  "api_key": "mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "mcp_server_url": "https://mcp.taskjuggler.com"
}
```

**Save your `api_key` - you'll need it to connect!**

### Step 2: Get Your API Key (If Already Registered)

If you already have an account, login to get your API key:

```bash
curl -X POST https://api.taskjuggler.com/api/mcp/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "your-email@example.com",
    "name": "Your Name"
  },
  "api_key": "mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "mcp_server_url": "https://mcp.taskjuggler.com"
}
```

### Step 3: Configure Cursor IDE

#### Option A: HTTP Transport (Recommended)

Edit your Cursor MCP configuration file:

**macOS/Linux**: `~/.cursor/mcp.json`  
**Windows**: `%APPDATA%\Cursor\mcp.json`

```json
{
  "mcpServers": {
    "taskjuggler-scanner": {
      "url": "https://mcp.taskjuggler.com/mcp",
      "transport": "http",
      "headers": {
        "X-API-Key": "mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

**Replace `mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual API key!**

#### Option B: Query Parameter

If headers don't work, use query parameter:

```json
{
  "mcpServers": {
    "taskjuggler-scanner": {
      "url": "https://mcp.taskjuggler.com/mcp?api_key=mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "transport": "http"
    }
  }
}
```

### Step 4: Restart Cursor

Restart Cursor IDE to load the new MCP configuration.

### Step 5: Test Connection

In Cursor, try using an MCP tool:

```
@taskjuggler-scanner scan_website url="https://example.com" site_name="Example Site"
```

---

## MCP Server Endpoints

After deployment, the MCP server is available at:

- **Base URL**: `https://mcp.taskjuggler.com/mcp`
- **Health Check**: `https://mcp.taskjuggler.com/mcp/health`
- **List Tools**: `GET https://mcp.taskjuggler.com/mcp/tools`
- **Call Tool**: `POST https://mcp.taskjuggler.com/mcp/tools/{toolName}`
- **MCP Protocol**: `POST https://mcp.taskjuggler.com/mcp/call`

---

## Available Tools

The MCP server provides these tools:

### 1. `scan_website`
Scan a website for accessibility, SEO, performance, and security issues.

**Parameters:**
- `url` (required): The URL to scan
- `site_name` (required): Name for the site
- `max_pages` (optional): Maximum pages to scan (default: 50)

**Example:**
```json
{
  "name": "scan_website",
  "arguments": {
    "url": "https://example.com",
    "site_name": "Example Site",
    "max_pages": 50
  }
}
```

### 2. `get_scan_results`
Get results from a completed scan.

**Parameters:**
- `scan_id` (required): The ID of the scan

### 3. `list_sites`
List all sites being monitored.

**Parameters:** None

### 4. `get_site_issues`
Get all issues for a specific site.

**Parameters:**
- `site_id` (required): The ID of the site

### 5. `generate_fix`
Generate a code fix for a specific issue.

**Parameters:**
- `issue_id` (required): The ID of the issue

---

## Authentication

### API Key Format

API keys follow this format:
```
mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Using Your API Key

**In HTTP Headers:**
```bash
curl -H "X-API-Key: mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  https://mcp.taskjuggler.com/mcp/health
```

**In Query Parameters:**
```bash
curl "https://mcp.taskjuggler.com/mcp/health?api_key=mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**In Cursor Configuration:**
```json
{
  "mcpServers": {
    "taskjuggler-scanner": {
      "url": "https://mcp.taskjuggler.com/mcp",
      "headers": {
        "X-API-Key": "mcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Regenerating Your API Key

If you need a new API key:

```bash
# Login first to get auth token
TOKEN=$(curl -X POST https://api.taskjuggler.com/api/mcp/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}' \
  | jq -r '.token')

# Regenerate API key
curl -X POST https://api.taskjuggler.com/api/mcp/api-key/regenerate \
  -H "Authorization: Bearer $TOKEN"
```

---

## Account Management

### View Your API Key

```bash
# Login to get token
TOKEN=$(curl -X POST https://api.taskjuggler.com/api/mcp/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}' \
  | jq -r '.token')

# Get API key
curl -X GET https://api.taskjuggler.com/api/mcp/api-key \
  -H "Authorization: Bearer $TOKEN"
```

### Account Plans

- **Free Plan**: Basic MCP access, limited scans
- **Pro Plan**: Unlimited scans, priority support
- **Enterprise Plan**: Custom limits, dedicated support

---

## Troubleshooting

### "Invalid API key" Error

1. **Check your API key**: Make sure it starts with `mcp_`
2. **Verify it's correct**: Copy-paste from registration/login response
3. **Check expiration**: API keys don't expire, but can be regenerated
4. **Try regenerating**: Use the regenerate endpoint if needed

### "Connection refused" Error

1. **Check MCP server status**: Visit `https://mcp.taskjuggler.com/mcp/health`
2. **Verify URL**: Make sure you're using the correct URL
3. **Check Cursor config**: Verify `~/.cursor/mcp.json` syntax

### "Tool not found" Error

1. **List available tools**: `GET https://mcp.taskjuggler.com/mcp/tools`
2. **Check tool name**: Use exact tool names from the list
3. **Verify parameters**: Check required vs optional parameters

### Cursor Not Recognizing MCP Server

1. **Restart Cursor**: After changing `mcp.json`, restart Cursor
2. **Check config syntax**: Validate JSON syntax
3. **Check Cursor version**: Update to latest version
4. **Check logs**: Look for MCP errors in Cursor logs

---

## Security Best Practices

1. **Keep API key secret**: Never share your API key
2. **Use environment variables**: Store API key securely
3. **Regenerate if compromised**: If key is exposed, regenerate immediately
4. **Use HTTPS**: Always use `https://` URLs
5. **Monitor usage**: Check your account for unusual activity

---

## Example: Complete Setup

```bash
# 1. Register account
curl -X POST https://api.taskjuggler.com/api/mcp/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@example.com",
    "password": "SecurePassword123!",
    "name": "Developer Name"
  }' | jq -r '.api_key' > ~/.taskjuggler_api_key

# 2. Get API key
API_KEY=$(cat ~/.taskjuggler_api_key)

# 3. Test connection
curl -H "X-API-Key: $API_KEY" \
  https://mcp.taskjuggler.com/mcp/health

# 4. Configure Cursor
cat > ~/.cursor/mcp.json << EOF
{
  "mcpServers": {
    "taskjuggler-scanner": {
      "url": "https://mcp.taskjuggler.com/mcp",
      "transport": "http",
      "headers": {
        "X-API-Key": "$API_KEY"
      }
    }
  }
}
EOF

# 5. Restart Cursor and test!
```

---

## Support

- **Documentation**: https://docs.taskjuggler.com/mcp
- **API Docs**: https://api.taskjuggler.com/api/docs
- **Support Email**: support@taskjuggler.com
- **Status Page**: https://status.taskjuggler.com

---

## Next Steps

1. ✅ Register for an account
2. ✅ Get your API key
3. ✅ Configure Cursor
4. ✅ Test connection
5. ✅ Start scanning websites!

**Your MCP server is publicly available and ready to use!** 🚀





