#!/bin/bash
# Create proper source archive with buildspec.yml at root

set -e

TEMP_DIR="/tmp/taskjuggler-build-$(date +%s)"
ARCHIVE="/tmp/taskjuggler-source-$(date +%s).tar.gz"

echo "Creating source archive..."

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Copy buildspec
cp /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/infrastructure/pulumi/buildspec-ultra-simple.yml buildspec.yml

# Copy all taskjuggler-api files (excluding vendor, node_modules, .git)
rsync -av \
  --exclude='vendor' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api/ .

# Verify key files
echo ""
echo "Verifying key files:"
ls -la buildspec.yml Dockerfile composer.json

# Create archive
echo ""
echo "Creating archive..."
tar -czf "$ARCHIVE" .

# Verify archive contents
echo ""
echo "Verifying archive:"
tar -tzf "$ARCHIVE" | grep -E "^(buildspec\.yml|Dockerfile)$" && echo "✓ Key files found in archive"

# Upload to S3
echo ""
echo "Uploading to S3..."
aws s3 cp "$ARCHIVE" s3://taskjuggler-build-source/source.tar.gz --region us-east-1

echo ""
echo "✓ Archive created and uploaded: $ARCHIVE"
echo ""
echo "Start build with:"
echo "aws codebuild start-build --project-name taskjuggler-production-build --region us-east-1"

# Cleanup
rm -rf "$TEMP_DIR"
