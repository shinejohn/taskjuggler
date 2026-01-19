# Testing Processes and Projects Modules

## Prerequisites

1. Run migrations:
```bash
php artisan migrate
```

2. Ensure you have:
   - A user account
   - A team created
   - Authentication token (Sanctum)

## Testing with cURL

### Set up environment variables
```bash
export API_URL="http://localhost:8000/api"
export AUTH_TOKEN="your-auth-token-here"
export TEAM_ID="your-team-uuid-here"
```

### Projects API

#### 1. Create a Project
```bash
curl -X POST "$API_URL/projects" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "code": "TP001",
    "description": "A test project",
    "methodology": "agile",
    "status": "active",
    "priority": "high",
    "start_date": "2024-01-01",
    "target_end_date": "2024-12-31"
  }'
```

#### 2. List Projects
```bash
curl -X GET "$API_URL/projects" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

#### 3. Get Project Stats
```bash
curl -X GET "$API_URL/projects/{project-id}/stats" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

#### 4. Add Project Member
```bash
curl -X POST "$API_URL/projects/{project-id}/members" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "role": "member",
    "allocation_percentage": 50
  }'
```

#### 5. List Project Members
```bash
curl -X GET "$API_URL/projects/{project-id}/members" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

### Processes API

#### 1. Create a Process
```bash
curl -X POST "$API_URL/processes" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Task Auto-Assignment",
    "description": "Automatically assign tasks to team members",
    "trigger_type": "task_created",
    "project_id": null
  }'
```

#### 2. Add Process Steps
```bash
curl -X POST "$API_URL/processes/{process-id}/steps" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Create Notification",
    "order": 1,
    "step_type": "notification",
    "config": {
      "recipients": ["user@example.com"],
      "subject": "New Task Created",
      "message": "A new task has been created"
    }
  }'
```

#### 3. Publish Process
```bash
curl -X POST "$API_URL/processes/{process-id}/publish" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

#### 4. Execute Process Manually
```bash
curl -X POST "$API_URL/processes/{process-id}/execute" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "task-uuid-here"
  }'
```

#### 5. List Process Executions
```bash
curl -X GET "$API_URL/processes/{process-id}/executions" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

## Testing Process Triggers

Processes with `trigger_type: task_created` or `trigger_type: task_updated` will automatically execute when tasks are created or updated.

### Test Task Creation Trigger

1. Create a process with `trigger_type: task_created`
2. Publish the process
3. Create a task:
```bash
curl -X POST "$API_URL/tasks" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This will trigger the process",
    "priority": "normal"
  }'
```

4. Check process executions:
```bash
curl -X GET "$API_URL/processes/executions?task_id={task-id}" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Team-ID: $TEAM_ID"
```

## Integration Testing

### Full Workflow Test

1. **Create a Project**
2. **Create a Process** linked to the project
3. **Add Steps** to the process (e.g., create_task, notification)
4. **Publish** the process
5. **Create a Task** - this should trigger the process
6. **Check Executions** - verify the process ran successfully
7. **Add Project Members** - test member management
8. **View Project Stats** - verify task statistics

## Troubleshooting

### Process Not Triggering

1. Check process status is `active` (not `draft`)
2. Verify process has steps
3. Check trigger_type matches the event (task_created/task_updated)
4. Verify task belongs to the same team as the process
5. Check logs: `storage/logs/laravel.log`

### Team Context Issues

- Ensure `X-Team-ID` header is set
- Verify user is a member of the team
- Check TeamContext middleware is applied

### Migration Issues

If migrations don't run:
```bash
php artisan migrate:refresh --path=app/Modules/Processes/Migrations
php artisan migrate:refresh --path=app/Modules/Projects/Migrations
```

