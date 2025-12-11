# Nixpacks Composer Fix

## Problem

Build failing with:
```
error: undefined variable 'composer'
at /app/.nixpacks/nixpkgs-5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.nix:19:9:
   composer php82
```

## Root Cause

Nixpacks was trying to use `composer` as a variable in the generated `.nix` file, but it's not a valid Nix package name in that context.

## Solution

**Composer is automatically included by Nixpacks** when it detects a `composer.json` file. You don't need to explicitly list it in `nixPkgs`.

**Fixed `nixpacks.toml`:**
```toml
[phases.setup]
nixPkgs = ["php82"]  # Composer is auto-included when composer.json is detected
```

## What Changed

**Before:**
```toml
nixPkgs = ["...", "php82", "php82Packages.composer"]
```

**After:**
```toml
nixPkgs = ["php82"]
```

## Why This Works

- Nixpacks automatically detects `composer.json` files
- When detected, it automatically includes Composer
- No need to explicitly list `php82Packages.composer`
- The `"..."` syntax was also causing issues with the generated `.nix` file

## Verification

The build should now succeed because:
- ✅ `php82` is specified
- ✅ Composer will be auto-detected from `composer.json`
- ✅ No invalid `composer` variable reference

## Next Build

Railway will use the updated `nixpacks.toml` and the build should complete successfully! 🎯
