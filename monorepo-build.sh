#!/bin/bash

# Map Railway Service Names to Workspace Names (Package Names or Directory Names)
# We use the package directory name as the workspace identifier for npm -w

echo "Detecting service for build..."
echo "RAILWAY_SERVICE_NAME: $RAILWAY_SERVICE_NAME"

TARGET_WORKSPACE=""

case "$RAILWAY_SERVICE_NAME" in
  "taskjuggler-web")
    TARGET_WORKSPACE="taskjuggler-web"
    ;;
  "Idea Circuit")
    TARGET_WORKSPACE="ideacircuit-web"
    ;;
  "Official Notice")
    TARGET_WORKSPACE="official-notice-web"
    ;;
  "Site Health")
    TARGET_WORKSPACE="scanner-web"
    ;;
  "URPA")
    TARGET_WORKSPACE="urpa-web"
    ;;
  "4projects")
    TARGET_WORKSPACE="projects-web"
    ;;
  "4calls")
    TARGET_WORKSPACE="coordinator-web"
    ;;
  "4process")
    TARGET_WORKSPACE="process-web"
    ;;
  "4doctors-web")
    TARGET_WORKSPACE="4doctors-web"
    ;;
  *)
    # Fallback: Try to match basic name or assume it's the service name lowercased
    clean_name=$(echo "$RAILWAY_SERVICE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
    echo "No explicit mapping found for '$RAILWAY_SERVICE_NAME'. Trying '$clean_name'..."
    TARGET_WORKSPACE="$clean_name"
    ;;
esac

echo "Target Workspace: $TARGET_WORKSPACE"

if [ -z "$TARGET_WORKSPACE" ]; then
  echo "Error: Could not determine workspace for service '$RAILWAY_SERVICE_NAME'"
  exit 1
fi

# Run the build
echo "Running: npm install && npm run build -w $TARGET_WORKSPACE"
npm install
npm run build -w "$TARGET_WORKSPACE"
