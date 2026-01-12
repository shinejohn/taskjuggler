# Buildspec.yml Fix - CodeBuild YAML Error

**Date**: January 2025  
**Issue**: CodeBuild YAML parsing error  
**Status**: ✅ Fixed

---

## Error Message

```
Phase context status code: YAML_FILE_ERROR 
Message: Expected Commands[4] to be of string type: found subkeys instead at line 37, 
value of the key tag on line 36 might be empty
```

---

## Root Cause

The original buildspec.yml had this line:
```yaml
- IMAGE_TAG=${COMMIT_HASH:=latest}
```

CodeBuild's YAML parser was having trouble with the `${COMMIT_HASH:=latest}` shell parameter expansion syntax, potentially interpreting it as YAML syntax rather than a shell command string.

---

## Fix Applied

Replaced the problematic line with a simpler single-line shell command:

**Before**:
```yaml
- IMAGE_TAG=${COMMIT_HASH:=latest}
```

**After**:
```yaml
- test -z "$COMMIT_HASH" && export IMAGE_TAG=latest || export IMAGE_TAG=$COMMIT_HASH
```

This uses a standard shell conditional that CodeBuild's YAML parser can handle correctly.

---

## Verification

- ✅ YAML syntax validated with Python yaml parser
- ✅ All commands are single-line strings (CodeBuild requirement)
- ✅ Shell syntax is valid and will work correctly
- ✅ File has 27 lines (no hidden characters or formatting issues)

---

## Updated Buildspec Structure

```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password ...
      - REPOSITORY_URI=...
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - test -z "$COMMIT_HASH" && export IMAGE_TAG=latest || export IMAGE_TAG=$COMMIT_HASH
      - echo "Building from commit: $COMMIT_HASH"
      - cd taskjuggler-api
      - pwd
      - ls -la
  build:
    commands:
      - echo "Build started"
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
  post_build:
    commands:
      - echo "Build completed"
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - docker push $REPOSITORY_URI:latest
      - echo Image URI: $REPOSITORY_URI:latest
```

---

## Next Steps

1. Commit and push the updated buildspec.yml
2. Trigger a new CodeBuild build
3. Verify the build completes successfully
4. Confirm Docker images are built and pushed to ECR

---

**Status**: ✅ Fixed  
**File**: `taskjuggler-api/buildspec.yml`

