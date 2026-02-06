# Fix Railway npm Workspace Errors

## Common Railway npm Workspace Errors

If all apps show the **same error**, it's likely one of these:

### Error 1: "workspace not found"
```
npm error workspace shared-ui not found
npm error workspace <service> not found
```

**Cause:** Railway isn't recognizing workspaces because:
- Root directory not set correctly
- npm install not running from root
- package.json workspaces array not being read

### Error 2: "Cannot find module"
```
Error: Cannot find module '@taskjuggler/ui'
Error: Cannot find module '../shared-ui'
```

**Cause:** shared-ui not built or not installed before app build

### Error 3: "npm ERR! code ENOENT"
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /app/package.json
```

**Cause:** Railway running commands from wrong directory

## 🔧 Fix: Update Railway Build Commands

Railway might need explicit workspace installation. Update all railway.json files:

### Current (May Not Work):
```json
"buildCommand": "npm install && npm run build -w shared-ui && npm run build -w <service>"
```

### Fixed Version 1 (Explicit Workspace Install):
```json
"buildCommand": "npm install --workspaces && npm run build --workspace=shared-ui && npm run build --workspace=<service>"
```

### Fixed Version 2 (Install All Workspaces First):
```json
"buildCommand": "npm install && npm install --workspace=shared-ui && npm run build --workspace=shared-ui && npm run build --workspace=<service>"
```

### Fixed Version 3 (Use npm ci for clean install):
```json
"buildCommand": "npm ci && npm run build --workspace=shared-ui && npm run build --workspace=<service>"
```

## 🎯 Recommended Fix

Update all railway.json files to use explicit workspace flags:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install --workspaces && npm run build --workspace=shared-ui && npm run build --workspace=<service-name>"
  }
}
```

This ensures:
1. All workspaces are installed
2. Explicit workspace targeting
3. Proper dependency resolution
