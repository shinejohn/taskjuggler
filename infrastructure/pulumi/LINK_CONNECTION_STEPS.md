# Link CodeStar Connection to CodeBuild

## What You're Seeing

If you see "You have not connected to GitHub" or "Manage account credentials", the CodeStar Connection needs to be linked.

## Steps to Link Connection

### Option 1: Use "Manage account credentials" Link

1. **Click "Manage account credentials"** link
2. This should take you to CodeStar Connections page
3. Find `taskjuggler-github` connection
4. Make sure it shows status: **"Available"**
5. Go back to CodeBuild project edit page
6. The connection should now appear in the dropdown

### Option 2: Direct Link Method

1. **In the CodeBuild Edit page**, look for:
   - A link that says "Connect to GitHub" or similar
   - Or a dropdown that says "Select a connection"
   
2. **Click on it** and you should see:
   - `taskjuggler-github` in the list
   - Select it

3. **Save the changes**

### Option 3: Verify Connection First

1. **Go to CodeStar Connections**:
   - https://console.aws.amazon.com/codesuite/settings/connections?region=us-east-1
   
2. **Verify**:
   - Connection `taskjuggler-github` exists
   - Status is **"Available"** (green)
   
3. **If status is "Available"**, go back to CodeBuild:
   - The connection should appear in the dropdown
   - If it doesn't, try refreshing the page

## After Linking

Once the connection is selected and saved:
```bash
cd infrastructure/pulumi
./create-webhook.sh
```

## Troubleshooting

If the connection doesn't appear:
- Wait 1-2 minutes after creating/authorizing connection
- Refresh the CodeBuild edit page
- Make sure you're in the same AWS region (us-east-1)
- Check that connection status is "Available" not "Pending"

