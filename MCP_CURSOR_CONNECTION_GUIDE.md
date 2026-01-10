# MCP Server Connection Guide for Cursor
## How to Connect Model Context Protocol (MCP) Servers to Cursor IDE

**Version:** 1.0  
**Last Updated:** December 2025

---

## TABLE OF CONTENTS

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Understanding MCP Servers](#understanding-mcp-servers)
4. [Setting Up the SiteHealth Scanner MCP Server](#setting-up-the-sitehealth-scanner-mcp-server)
5. [Configuring Cursor IDE](#configuring-cursor-ide)
6. [Environment Variables](#environment-variables)
7. [Testing the Connection](#testing-the-connection)
8. [Using MCP Tools in Cursor](#using-mcp-tools-in-cursor)
9. [Troubleshooting](#troubleshooting)
10. [Creating Custom MCP Servers](#creating-custom-mcp-servers)

---

## INTRODUCTION

Model Context Protocol (MCP) is a protocol that allows AI assistants like Cursor to interact with external tools and services. By connecting MCP servers to Cursor, you can extend Cursor's capabilities with custom tools and integrations.

This guide will walk you through connecting the SiteHealth Scanner MCP server to Cursor IDE, and provide instructions for connecting other MCP servers.

### What You'll Learn

- How MCP servers work
- Setting up the SiteHealth Scanner MCP server
- Configuring Cursor to use MCP servers
- Testing and using MCP tools
- Troubleshooting common issues

---

## PREREQUISITES

Before you begin, ensure you have:

1. **Cursor IDE** installed (latest version recommended)
2. **Node.js** (v18 or higher) installed
3. **npm** or **yarn** package manager
4. **TypeScript** (for TypeScript-based MCP servers)
5. Access to the **Task Juggler API** (for SiteHealth Scanner MCP)
6. A valid **API token** for authentication

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check if Cursor is installed
# Open Cursor IDE and check version in Help > About
```

---

## UNDERSTANDING MCP SERVERS

### What is MCP?

Model Context Protocol (MCP) is a standardized protocol that enables AI assistants to:
- **Discover** available tools
- **Call** tools with parameters
- **Receive** structured responses
- **Handle** errors gracefully

### How MCP Works

```
┌─────────────┐         MCP Protocol         ┌──────────────┐
│             │ ◄──────────────────────────► │              │
│  Cursor IDE │      (stdio/HTTP/SSE)        │  MCP Server  │
│             │                              │              │
└─────────────┘                              └──────────────┘
                                                      │
                                                      │ API Calls
                                                      ▼
                                            ┌─────────────────┐
                                            │  External APIs  │
                                            │  (Your Services)│
                                            └─────────────────┘
```

### MCP Server Types

1. **stdio** - Standard input/output (most common)
2. **HTTP** - HTTP-based servers
3. **SSE** - Server-Sent Events

The SiteHealth Scanner MCP server uses **stdio** transport.

---

## SETTING UP THE SITEHEALTH SCANNER MCP SERVER

### Step 1: Navigate to the MCP Server Directory

```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/scanner-mcp
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `@modelcontextprotocol/sdk` - MCP SDK
- `axios` - HTTP client for API calls
- TypeScript and development dependencies

### Step 3: Build the TypeScript Code

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 4: Verify the Build

```bash
# Check that dist/index.js exists
ls -la dist/index.js

# Test the server runs (should output to stderr)
node dist/index.js
```

You should see: `SiteHealth Scanner MCP server running on stdio`

**Note:** The server communicates via stdin/stdout, so direct output goes to stderr for logging.

### Step 5: Create Environment File

Create a `.env` file in the `scanner-mcp` directory:

```bash
cd scanner-mcp
touch .env
```

Add your configuration:

```env
SCANNER_API_URL=http://localhost:8000/api
SCANNER_API_TOKEN=your_api_token_here
```

**Important:** Replace `your_api_token_here` with your actual API token from the Task Juggler API.

---

## CONFIGURING CURSOR IDE

Cursor uses a configuration file to register MCP servers. The location depends on your operating system.

### Step 1: Locate Cursor Configuration Directory

#### macOS
```
~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

Or create/edit:
```
~/.cursor/mcp.json
```

#### Windows
```
%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json
```

Or create/edit:
```
%USERPROFILE%\.cursor\mcp.json
```

#### Linux
```
~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

Or create/edit:
```
~/.cursor/mcp.json
```

### Step 2: Create or Edit MCP Configuration File

Create the configuration file if it doesn't exist, or edit the existing one:

```json
{
  "mcpServers": {
    "sitehealth-scanner": {
      "command": "node",
      "args": [
        "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/scanner-mcp/dist/index.js"
      ],
      "env": {
        "SCANNER_API_URL": "http://localhost:8000/api",
        "SCANNER_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### Step 3: Update Paths for Your System

**Important:** Update the following in the configuration:

1. **Command Path**: Ensure `node` is in your PATH, or use full path:
   ```json
   "command": "/usr/local/bin/node"
   ```

2. **Script Path**: Update to your actual path:
   ```json
   "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/scanner-mcp/dist/index.js"
   ```

3. **Environment Variables**: Set your actual API URL and token:
   ```json
   "SCANNER_API_URL": "https://api.yourdomain.com/api",
   "SCANNER_API_TOKEN": "your_actual_token"
   ```

### Step 4: Alternative Configuration Format

If the above format doesn't work, try Cursor's native MCP configuration format:

**For Cursor Settings (Settings > Features > MCP):**

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP" or "Model Context Protocol"
3. Click "Edit in settings.json"
4. Add:

```json
{
  "mcp.servers": {
    "sitehealth-scanner": {
      "command": "node",
      "args": [
        "/Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/scanner-mcp/dist/index.js"
      ],
      "env": {
        "SCANNER_API_URL": "http://localhost:8000/api",
        "SCANNER_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### Step 5: Restart Cursor

After configuring, **restart Cursor IDE** completely to load the MCP server configuration.

---

## ENVIRONMENT VARIABLES

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SCANNER_API_URL` | Base URL of the Task Juggler API | `http://localhost:8000/api` |
| `SCANNER_API_TOKEN` | Authentication token for API access | `1|abc123def456...` |

### Getting Your API Token

1. **Login to Task Juggler API**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com","password":"yourpassword"}'
   ```

2. **Extract the token** from the response:
   ```json
   {
     "token": "1|abc123def456...",
     "user": {...}
   }
   ```

3. **Use the token** in your MCP configuration

### Setting Environment Variables

You can set environment variables in three ways:

#### Option 1: In Cursor Configuration (Recommended)
Set in the `env` section of your MCP configuration:

```json
{
  "env": {
    "SCANNER_API_URL": "http://localhost:8000/api",
    "SCANNER_API_TOKEN": "your_token"
  }
}
```

#### Option 2: System Environment Variables
Set in your shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
export SCANNER_API_URL="http://localhost:8000/api"
export SCANNER_API_TOKEN="your_token"
```

#### Option 3: .env File (Development)
Create `.env` in `scanner-mcp` directory (for local development):

```env
SCANNER_API_URL=http://localhost:8000/api
SCANNER_API_TOKEN=your_token
```

**Note:** The MCP server reads from `process.env`, so system environment variables will work if not set in Cursor config.

---

## TESTING THE CONNECTION

### Step 1: Check MCP Server Status

1. Open Cursor IDE
2. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
3. Type: `MCP` or `Model Context Protocol`
4. Look for MCP-related commands or status indicators

### Step 2: Verify Server is Running

Check Cursor's output/logs for MCP server messages:

1. Open **View > Output**
2. Select **MCP** or **Model Context Protocol** from the dropdown
3. Look for connection messages or errors

### Step 3: Test MCP Tools

In a Cursor chat, try asking:

```
"Can you scan a website using the SiteHealth Scanner?"
```

Or more specifically:

```
"Use the scan_website tool to scan https://example.com"
```

### Step 4: Manual Testing

Test the MCP server directly:

```bash
cd scanner-mcp

# Test the server starts
node dist/index.js

# In another terminal, test with echo
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

You should see a JSON response with available tools.

---

## USING MCP TOOLS IN CURSOR

### Available SiteHealth Scanner Tools

Once connected, Cursor can use these tools:

#### 1. `scan_website`
Scan a website for issues:
```
"Scan https://example.com for accessibility and SEO issues"
```

**Parameters:**
- `url` (required): Website URL
- `site_name` (required): Name for the site
- `max_pages` (optional): Max pages to scan (default: 50)

#### 2. `get_scan_results`
Get results from a completed scan:
```
"Get results for scan ID 123"
```

**Parameters:**
- `scan_id` (required): The scan ID

#### 3. `list_sites`
List all monitored sites:
```
"List all sites being monitored"
```

#### 4. `get_site_issues`
Get issues for a specific site:
```
"Get all issues for site ID 5"
```

**Parameters:**
- `site_id` (required): The site ID

#### 5. `generate_fix`
Generate a code fix for an issue:
```
"Generate a fix for issue ID 42"
```

**Parameters:**
- `issue_id` (required): The issue ID

### Example Conversations

**Example 1: Scanning a Website**
```
User: "Can you scan https://mywebsite.com for me? Call it 'My Website'"

Cursor: [Uses scan_website tool]
        "I've started a scan for https://mywebsite.com. 
         Scan ID: 123. Status: running. 
         The scan will check for accessibility, SEO, performance, 
         and security issues."
```

**Example 2: Getting Scan Results**
```
User: "What were the results of scan 123?"

Cursor: [Uses get_scan_results tool]
        "Scan results:
         - Health Score: 85
         - Pages Scanned: 12
         - Issues Found: 3
         - Category Scores:
           * Accessibility: 90
           * SEO: 85
           * Performance: 80"
```

**Example 3: Listing Sites**
```
User: "Show me all the sites I'm monitoring"

Cursor: [Uses list_sites tool]
        "You're monitoring 3 sites:
         1. example.com - Health: 85% - Issues: 3
         2. mysite.com - Health: 62% - Issues: 12
         3. testsite.com - Health: 95% - Issues: 1"
```

---

## TROUBLESHOOTING

### Problem: MCP Server Not Connecting

**Symptoms:**
- Tools not available in Cursor
- No MCP server status in output

**Solutions:**

1. **Check Configuration Path**
   ```bash
   # Verify the path to index.js exists
   ls -la /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/scanner-mcp/dist/index.js
   ```

2. **Verify Node.js Path**
   ```bash
   # Find Node.js location
   which node
   # Use full path in Cursor config if needed
   ```

3. **Check File Permissions**
   ```bash
   chmod +x scanner-mcp/dist/index.js
   ```

4. **Restart Cursor** completely (quit and reopen)

### Problem: "Command Not Found" Error

**Symptoms:**
- Error: `node: command not found`

**Solutions:**

1. **Use Full Path to Node.js**:
   ```json
   "command": "/usr/local/bin/node"
   ```
   Or on macOS with Homebrew:
   ```json
   "command": "/opt/homebrew/bin/node"
   ```

2. **Add Node.js to PATH**:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export PATH="/usr/local/bin:$PATH"
   ```

### Problem: Authentication Errors

**Symptoms:**
- `401 Unauthorized` errors
- `Error: Invalid token`

**Solutions:**

1. **Verify API Token**:
   ```bash
   # Test token manually
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:8000/api/scanner/sites
   ```

2. **Check Environment Variables**:
   - Verify `SCANNER_API_TOKEN` is set correctly
   - Ensure no extra spaces or quotes

3. **Regenerate Token**:
   - Login again to get a new token
   - Update configuration with new token

### Problem: API Connection Errors

**Symptoms:**
- `ECONNREFUSED` errors
- `Network Error`

**Solutions:**

1. **Verify API is Running**:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check API URL**:
   - Ensure `SCANNER_API_URL` is correct
   - Include `/api` suffix if needed
   - Use `http://` for localhost, `https://` for production

3. **Check Firewall/Network**:
   - Ensure API port is accessible
   - Check firewall rules

### Problem: TypeScript Build Errors

**Symptoms:**
- `npm run build` fails
- Type errors

**Solutions:**

1. **Clean Build**:
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build
   ```

2. **Check TypeScript Version**:
   ```bash
   npm install typescript@latest --save-dev
   ```

3. **Fix Type Errors**:
   - Review TypeScript errors
   - Update type definitions if needed

### Problem: Tools Not Appearing in Cursor

**Symptoms:**
- MCP server connects but tools unavailable

**Solutions:**

1. **Check MCP Server Logs**:
   - View Cursor output panel
   - Look for MCP server errors

2. **Verify Tool Registration**:
   ```bash
   # Test tool list manually
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
     node dist/index.js
   ```

3. **Check Cursor Version**:
   - Update to latest Cursor version
   - MCP support may require newer version

### Getting Help

If issues persist:

1. **Check Cursor Logs**:
   - Help > Toggle Developer Tools
   - Check Console for errors

2. **MCP Server Logs**:
   - Check stderr output
   - Add console.error() for debugging

3. **Test MCP Server Independently**:
   ```bash
   # Run server and test manually
   node dist/index.js
   ```

---

## CREATING CUSTOM MCP SERVERS

### Basic MCP Server Structure

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'my_tool',
      description: 'Description of my tool',
      inputSchema: {
        type: 'object',
        properties: {
          param1: {
            type: 'string',
            description: 'Parameter description',
          },
        },
        required: ['param1'],
      },
    },
  ],
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  switch (name) {
    case 'my_tool':
      // Tool implementation
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ result: 'success' }),
          },
        ],
      }
    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('MCP server running')
}

main().catch(console.error)
```

### Steps to Create Custom MCP Server

1. **Initialize Project**:
   ```bash
   mkdir my-mcp-server
   cd my-mcp-server
   npm init -y
   npm install @modelcontextprotocol/sdk
   npm install -D typescript @types/node tsx
   ```

2. **Create `tsconfig.json`**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "ESNext",
       "moduleResolution": "node",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true
     }
   }
   ```

3. **Create `src/index.ts`** with your server code

4. **Build**:
   ```bash
   npm run build
   ```

5. **Add to Cursor Config**:
   ```json
   {
     "mcpServers": {
       "my-custom-server": {
         "command": "node",
         "args": ["/path/to/my-mcp-server/dist/index.js"]
       }
     }
   }
   ```

---

## QUICK REFERENCE

### Configuration File Locations

| OS | Path |
|----|------|
| macOS | `~/.cursor/mcp.json` or `~/Library/Application Support/Cursor/...` |
| Windows | `%USERPROFILE%\.cursor\mcp.json` |
| Linux | `~/.cursor/mcp.json` |

### Common Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run server (for testing)
node dist/index.js

# Check Node.js version
node --version

# Find Node.js path
which node
```

### Configuration Template

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["/full/path/to/dist/index.js"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

---

## ADDITIONAL RESOURCES

- **MCP Specification**: https://modelcontextprotocol.io
- **MCP SDK Documentation**: https://github.com/modelcontextprotocol/typescript-sdk
- **Cursor Documentation**: https://cursor.sh/docs
- **SiteHealth Scanner API**: See `taskjuggler-api` documentation

---

## SUMMARY

You've learned how to:

1. ✅ Set up the SiteHealth Scanner MCP server
2. ✅ Configure Cursor IDE to connect to MCP servers
3. ✅ Set environment variables for API access
4. ✅ Test MCP server connections
5. ✅ Use MCP tools in Cursor conversations
6. ✅ Troubleshoot common issues
7. ✅ Create custom MCP servers

### Next Steps

1. **Connect the MCP server** following this guide
2. **Test with a real website** scan
3. **Explore other MCP servers** available in the ecosystem
4. **Create custom tools** for your specific needs

---

**MCP Cursor Connection Guide v1.0**  
*Last Updated: December 2025*
