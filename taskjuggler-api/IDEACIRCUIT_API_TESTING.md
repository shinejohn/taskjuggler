# IdeaCircuit API Testing Guide

## Overview

This guide provides examples for testing the IdeaCircuit API endpoints using Postman, curl, or the frontend application.

## Base URL

```
http://localhost:8000/api
```

## Authentication

All IdeaCircuit endpoints require authentication via Laravel Sanctum. You must include a Bearer token in the Authorization header.

### Getting a Token

1. **Register a new user** (or use existing credentials):
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

2. **Login**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password"
}
```

Response:
```json
{
  "data": {
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "test@example.com"
    }
  }
}
```

3. **Use the token** in subsequent requests:
```
Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## API Endpoints

### Meetings

#### List Meetings
```bash
GET /api/ideacircuit/meetings
Authorization: Bearer {token}
```

#### Create Meeting
```bash
POST /api/ideacircuit/meetings
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Team Standup",
  "description": "Daily team sync",
  "meeting_type": "general",
  "visibility": "private",
  "allow_guests": true,
  "max_participants": 10,
  "scheduled_at": "2025-01-15T10:00:00Z"
}
```

#### Get Meeting
```bash
GET /api/ideacircuit/meetings/{meeting_id}
Authorization: Bearer {token}
```

#### Update Meeting
```bash
PUT /api/ideacircuit/meetings/{meeting_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Meeting Title",
  "status": "active"
}
```

#### Delete Meeting
```bash
DELETE /api/ideacircuit/meetings/{meeting_id}
Authorization: Bearer {token}
```

#### Join Meeting
```bash
POST /api/ideacircuit/meetings/{meeting_id}/join
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "is_guest": false
}
```

#### End Meeting
```bash
POST /api/ideacircuit/meetings/{meeting_id}/end
Authorization: Bearer {token}
```

### Notes

#### List Notes for Meeting
```bash
GET /api/ideacircuit/meetings/{meeting_id}/notes
Authorization: Bearer {token}
```

#### Create Note
```bash
POST /api/ideacircuit/meetings/{meeting_id}/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "category": "Action Items",
  "content": "Follow up on Q3 planning",
  "priority": "high",
  "status": "open"
}
```

### Messages

#### List Messages for Meeting
```bash
GET /api/ideacircuit/meetings/{meeting_id}/messages
Authorization: Bearer {token}
```

#### Send Message
```bash
POST /api/ideacircuit/meetings/{meeting_id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Hello everyone!",
  "message_type": "text"
}
```

### Transcripts

#### Get Meeting Transcript
```bash
GET /api/ideacircuit/meetings/{meeting_id}/transcript
Authorization: Bearer {token}
```

### Task Integration

#### Create Task from Meeting
```bash
POST /api/ideacircuit/meetings/{meeting_id}/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Finish the Q3 project proposal",
  "priority": "high",
  "due_date": "2025-01-20"
}
```

#### Get Meeting Tasks
```bash
GET /api/ideacircuit/meetings/{meeting_id}/tasks
Authorization: Bearer {token}
```

### Appointment Integration

#### Create Appointment from Meeting
```bash
POST /api/ideacircuit/meetings/{meeting_id}/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "appointment_type_id": "{appointment_type_uuid}",
  "guest_name": "Jane Smith",
  "guest_email": "jane@example.com",
  "start_time": "2025-01-20T14:00:00Z",
  "end_time": "2025-01-20T15:00:00Z",
  "timezone": "America/New_York"
}
```

#### Get Meeting Appointments
```bash
GET /api/ideacircuit/meetings/{meeting_id}/appointments
Authorization: Bearer {token}
```

### User Profile

#### Get User Profile
```bash
GET /api/ideacircuit/user/profile
Authorization: Bearer {token}
```

#### Update User Profile
```bash
PUT /api/ideacircuit/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "timezone": "America/Los_Angeles"
}
```

#### Get User Activity
```bash
GET /api/ideacircuit/user/activity
Authorization: Bearer {token}
```

## Testing with curl

### Example: Create a Meeting
```bash
curl -X POST http://localhost:8000/api/ideacircuit/meetings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Test Meeting",
    "description": "This is a test meeting",
    "meeting_type": "general"
  }'
```

## Testing with Postman

1. Create a new collection called "IdeaCircuit API"
2. Set collection variables:
   - `base_url`: `http://localhost:8000/api`
   - `token`: (will be set after login)
3. Create a "Login" request to get the token
4. Use the token in subsequent requests via the Authorization header

## Testing with Frontend

The frontend is already configured to use these endpoints. Simply:

1. Start the Laravel backend:
   ```bash
   cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code/taskjuggler-api
   php artisan serve
   ```

2. Start the frontend:
   ```bash
   cd /Users/johnshine/Dropbox/Fibonacco/Alpha-Site/IdeaCircuit/frontend
   npm run dev
   ```

3. Navigate to `http://localhost:5173` (or your frontend port)
4. Login and test the meeting functionality

## Expected Response Format

All endpoints return JSON in the following format:

**Success:**
```json
{
  "data": {
    // Resource data
  }
}
```

**Error:**
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `403` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error





