#!/bin/bash

# Map Railway Service Names to Workspace Names
echo "Starting service..."
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
    clean_name=$(echo "$RAILWAY_SERVICE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
    echo "No explicit mapping found. Trying '$clean_name'..."
    TARGET_WORKSPACE="$clean_name"
    ;;
esac

echo "Target Workspace: $TARGET_WORKSPACE"

# Run the start command
# Note: npm run start -w needs to be mapped to the actual PACKAGE NAME, not just folder.
# But in our setup, folder usually equals workspace name or close enough?
# Wait, coordinator-web package name is "4calls-ai-web".
# ideacircuit-web package name is "frontend".
# This logic is FOLDER based mostly.
# Let's verify if -w accepts folder path. YES, npm -w accepts folder path.

echo "Running: npm run start -w $TARGET_WORKSPACE"
npm run start -w "$TARGET_WORKSPACE"
