# 4Calls Integration Guide
## Complete Guide for Integrating External Applications with 4Calls (Coordinator)

**Version:** 1.0  
**Last Updated:** January 2026  
**Purpose:** This document provides comprehensive instructions for integrating external applications with 4Calls (formerly Coordinator), enabling seamless coordination, appointment scheduling, contact management, and AI agent interactions.

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Webhooks](#webhooks)
6. [AI Agent Integration](#ai-agent-integration)
7. [Integration Patterns](#integration-patterns)
8. [Code Examples](#code-examples)
9. [Error Handling](#error-handling)
10. [Rate Limits](#rate-limits)
11. [Best Practices](#best-practices)

---

## OVERVIEW

4Calls (Coordinator) is an AI-powered virtual assistant platform that manages:
- **Organizations**: Multi-tenant business management
- **Coordinators**: AI virtual assistants with customizable roles and personas
- **Contacts**: Customer relationship management
- **Appointments**: Calendar and scheduling management
- **Calls**: Call logging and analytics
- **Campaigns**: Outbound calling campaigns
- **AI Agents**: Internal AI agent protocol for real-time operations

### Key Features for Integration

- **Organization Management**: Create and manage organizations
- **Coordinator Creation**: Deploy AI coordinators with custom roles
- **Contact Sync**: Import and sync contacts from external systems
- **Appointment Booking**: Create and manage appointments
- **Call Logging**: Track and analyze calls
- **Campaign Management**: Run outbound calling campaigns
- **Webhook Support**: Receive real-time notifications
- **AI Agent Protocol**: Integrate with internal AI agents

---

## ARCHITECTURE

### Base URL

```
Production: https://api.taskjuggler.com/api/coordinator
Development: http://localhost:8000/api/coordinator
```

### Internal AI Agent API

```
Production: https://api.taskjuggler.com/api/internal/ai
Development: http://localhost:8000/api/internal/ai
```

### API Versioning

4Calls API uses URL-based versioning. Current version is v1 (default).

### Data Format

All requests and responses use JSON format with `Content-Type: application/json`.

---

## AUTHENTICATION

4Calls uses Laravel Sanctum for API authentication. All endpoints (except webhooks and internal AI agent auth) require authentication.

### Getting an API Token

1. **User Registration/Login**
   ```bash
   POST /api/auth/register
   POST /api/auth/login
   ```

2. **Get API Token**
   ```bash
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password"
   }
   
   Response:
   {
     "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "user": { ... }
   }
   ```

3. **Using the Token**
   Include the token in the `Authorization` header:
   ```bash
   Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### AI Agent Authentication

AI agents use a separate authentication endpoint:

```bash
POST /api/internal/ai/auth
Content-Type: application/json

{
  "agent_id": "agent_uuid",
  "api_key": "agent_api_key"
}

Response:
{
  "access_token": "agent_token",
  "expires_in": 3600
}
```

---

## API ENDPOINTS

### Organizations

#### List Organizations
```http
GET /api/coordinator/organizations
Authorization: Bearer {token}
```

#### Create Organization
```http
POST /api/coordinator/organizations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Acme Corporation",
  "industry": "Technology",
  "timezone": "America/New_York",
  "metadata": {
    "website": "https://acme.com",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Acme Corporation",
  "industry": "Technology",
  "timezone": "America/New_York",
  "user_id": "user_uuid",
  "created_at": "2026-01-20T10:00:00Z"
}
```

### Coordinators

#### List Coordinators for Organization
```http
GET /api/coordinator/organizations/{orgId}/coordinators
Authorization: Bearer {token}
```

#### Create Coordinator
```http
POST /api/coordinator/organizations/{orgId}/coordinators
Authorization: Bearer {token}
Content-Type: application/json

{
  "role_template_id": "uuid",
  "persona_template_id": "uuid",
  "display_name": "Sarah - Sales Assistant",
  "voice_id": "voice_123",
  "custom_greeting": "Hello! I'm Sarah, your sales assistant.",
  "custom_prompts": {
    "system": "You are a helpful sales assistant..."
  },
  "availability": {
    "monday": {"start": "09:00", "end": "17:00"},
    "tuesday": {"start": "09:00", "end": "17:00"}
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "organization_id": "org_uuid",
  "display_name": "Sarah - Sales Assistant",
  "status": "active",
  "role_template": { ... },
  "persona_template": { ... },
  "created_at": "2026-01-20T10:00:00Z"
}
```

### Contacts

#### List Contacts
```http
GET /api/coordinator/organizations/{orgId}/contacts
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Search by name, email, or phone
- `tags` (optional): Filter by tags (comma-separated)
- `page` (optional): Page number
- `per_page` (optional): Items per page

#### Create Contact
```http
POST /api/coordinator/organizations/{orgId}/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "tags": ["client", "priority"],
  "metadata": {
    "source": "external_app",
    "source_id": "contact_123"
  }
}
```

#### Bulk Operations
```http
POST /api/coordinator/organizations/{orgId}/contacts/bulk-tag
Authorization: Bearer {token}
Content-Type: application/json

{
  "contact_ids": ["uuid1", "uuid2"],
  "tags": ["tag1", "tag2"]
}
```

### Appointments

#### List Appointments
```http
GET /api/coordinator/organizations/{orgId}/appointments
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `status` (optional): Filter by status (`scheduled`, `confirmed`, `cancelled`, `completed`)

#### Create Appointment
```http
POST /api/coordinator/organizations/{orgId}/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "contact_id": "contact_uuid",
  "appointment_type_id": "type_uuid",
  "scheduled_at": "2026-01-25T14:00:00Z",
  "duration_minutes": 30,
  "notes": "Follow-up call",
  "metadata": {
    "source": "external_app",
    "source_id": "appointment_123"
  }
}
```

#### Cancel Appointment
```http
POST /api/coordinator/organizations/{orgId}/appointments/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Client requested reschedule"
}
```

### Calls

#### List Calls
```http
GET /api/coordinator/organizations/{orgId}/calls
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `status` (optional): Filter by status (`completed`, `missed`, `voicemail`)
- `coordinator_id` (optional): Filter by coordinator

#### Get Call Statistics
```http
GET /api/coordinator/organizations/{orgId}/calls/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_calls": 150,
  "completed_calls": 120,
  "missed_calls": 20,
  "voicemails": 10,
  "average_duration_seconds": 180,
  "calls_by_date": { ... }
}
```

### Campaigns

#### List Campaigns
```http
GET /api/coordinator/organizations/{orgId}/campaigns
Authorization: Bearer {token}
```

#### Create Campaign
```http
POST /api/coordinator/organizations/{orgId}/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Q1 Follow-up Campaign",
  "description": "Follow up with Q1 leads",
  "contact_list_ids": ["list_uuid1", "list_uuid2"],
  "coordinator_id": "coordinator_uuid",
  "script": "Hello, this is a follow-up call...",
  "scheduled_start": "2026-01-25T09:00:00Z",
  "metadata": {
    "source": "external_app",
    "source_id": "campaign_123"
  }
}
```

#### Start Campaign
```http
POST /api/coordinator/organizations/{orgId}/campaigns/{id}/start
Authorization: Bearer {token}
```

#### Get Campaign Statistics
```http
GET /api/coordinator/organizations/{orgId}/campaigns/{id}/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_contacts": 100,
  "calls_made": 75,
  "calls_completed": 60,
  "calls_missed": 10,
  "voicemails_left": 5,
  "completion_rate": 0.8
}
```

### Dashboard

#### Get Dashboard Metrics
```http
GET /api/coordinator/organizations/{orgId}/dashboard/metrics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_calls": 150,
  "today_calls": 10,
  "total_appointments": 50,
  "today_appointments": 5,
  "total_contacts": 200,
  "active_coordinators": 3
}
```

---

## WEBHOOKS

4Calls supports webhooks to notify external applications of events.

### Webhook Events

- `organization.created`: New organization created
- `coordinator.created`: New coordinator created
- `coordinator.activated`: Coordinator activated
- `contact.created`: New contact created
- `contact.updated`: Contact updated
- `appointment.created`: New appointment created
- `appointment.confirmed`: Appointment confirmed
- `appointment.cancelled`: Appointment cancelled
- `call.completed`: Call completed
- `call.missed`: Call missed
- `campaign.started`: Campaign started
- `campaign.completed`: Campaign completed
- `ai_interaction.logged`: AI interaction logged

### Registering a Webhook

```http
POST /api/coordinator/organizations/{orgId}/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My App Webhook",
  "url": "https://myapp.com/webhooks/4calls",
  "secret": "your_secret_key",
  "events": [
    "contact.created",
    "appointment.created",
    "call.completed"
  ]
}
```

### Webhook Payload

```json
{
  "event": "contact.created",
  "timestamp": "2026-01-20T10:00:00Z",
  "organization_id": "org_uuid",
  "data": {
    "id": "contact_uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### Webhook Signature Verification

4Calls signs webhook payloads using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  );
}
```

---

## AI AGENT INTEGRATION

4Calls provides an internal AI agent protocol for real-time operations.

### Authentication

```http
POST /api/internal/ai/auth
Content-Type: application/json

{
  "agent_id": "agent_uuid",
  "api_key": "agent_api_key"
}
```

### Context Packets

Get business context for AI agents:

```http
GET /api/internal/ai/context/{business_id}
Authorization: Bearer {agent_token}
```

**Response:**
```json
{
  "business_id": "business_uuid",
  "business_name": "Acme Corporation",
  "contacts": [ ... ],
  "appointments": [ ... ],
  "faqs": [ ... ],
  "polls": [ ... ],
  "last_updated": "2026-01-20T10:00:00Z"
}
```

### Real-Time Operations

#### Get Availability
```http
GET /api/internal/ai/calendar/{business_id}/availability
Authorization: Bearer {agent_token}
Query Parameters:
  - date: YYYY-MM-DD
  - duration_minutes: 30
```

#### Lookup Customer
```http
GET /api/internal/ai/crm/{business_id}/customers/lookup
Authorization: Bearer {agent_token}
Query Parameters:
  - phone: +1234567890
  - email: customer@example.com
```

#### Create Booking
```http
POST /api/internal/ai/calendar/{business_id}/bookings
Authorization: Bearer {agent_token}
Content-Type: application/json

{
  "contact_id": "contact_uuid",
  "appointment_type_id": "type_uuid",
  "scheduled_at": "2026-01-25T14:00:00Z",
  "duration_minutes": 30
}
```

#### Create Lead
```http
POST /api/internal/ai/crm/{business_id}/leads
Authorization: Bearer {agent_token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "notes": "Interested in product demo"
}
```

### Log Interactions

```http
POST /api/internal/ai/interactions/{business_id}
Authorization: Bearer {agent_token}
Content-Type: application/json

{
  "interaction_type": "call",
  "contact_id": "contact_uuid",
  "duration_seconds": 180,
  "transcript": "Call transcript...",
  "outcome": "appointment_scheduled",
  "metadata": {}
}
```

---

## INTEGRATION PATTERNS

### Pattern 1: Contact Sync

Sync contacts from your CRM to 4Calls:

```javascript
async function syncContacts(organizationId, contacts) {
  const results = [];
  
  for (const contact of contacts) {
    try {
      // Check if contact exists
      const existing = await searchContact(organizationId, contact.email);
      
      if (existing) {
        // Update existing contact
        const response = await fetch(
          `https://api.taskjuggler.com/api/coordinator/organizations/${organizationId}/contacts/${existing.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              metadata: {
                source: 'my_crm',
                source_id: contact.id,
                last_synced: new Date().toISOString()
              }
            })
          }
        );
        results.push({ action: 'updated', contact: await response.json() });
      } else {
        // Create new contact
        const response = await fetch(
          `https://api.taskjuggler.com/api/coordinator/organizations/${organizationId}/contacts`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              metadata: {
                source: 'my_crm',
                source_id: contact.id
              }
            })
          }
        );
        results.push({ action: 'created', contact: await response.json() });
      }
    } catch (error) {
      results.push({ action: 'error', contact: contact, error: error.message });
    }
  }
  
  return results;
}
```

### Pattern 2: Appointment Booking

Create appointments from external booking systems:

```javascript
async function createAppointment(organizationId, booking) {
  // First, find or create contact
  let contactId = await findContactByEmail(organizationId, booking.email);
  
  if (!contactId) {
    const contact = await createContact(organizationId, {
      name: booking.name,
      email: booking.email,
      phone: booking.phone
    });
    contactId = contact.id;
  }
  
  // Create appointment
  const response = await fetch(
    `https://api.taskjuggler.com/api/coordinator/organizations/${organizationId}/appointments`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact_id: contactId,
        appointment_type_id: booking.appointment_type_id,
        scheduled_at: booking.scheduled_at,
        duration_minutes: booking.duration_minutes,
        notes: booking.notes,
        metadata: {
          source: 'my_booking_system',
          source_id: booking.id
        }
      })
    }
  );
  
  return response.json();
}
```

### Pattern 3: Campaign Integration

Create and manage campaigns from external systems:

```javascript
async function createCampaign(organizationId, campaignData) {
  const response = await fetch(
    `https://api.taskjuggler.com/api/coordinator/organizations/${organizationId}/campaigns`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: campaignData.name,
        description: campaignData.description,
        contact_list_ids: campaignData.contact_list_ids,
        coordinator_id: campaignData.coordinator_id,
        script: campaignData.script,
        scheduled_start: campaignData.scheduled_start,
        metadata: {
          source: 'my_marketing_system',
          source_id: campaignData.id
        }
      })
    }
  );
  
  const campaign = await response.json();
  
  // Start campaign if scheduled_start is in the past
  if (new Date(campaignData.scheduled_start) <= new Date()) {
    await fetch(
      `https://api.taskjuggler.com/api/coordinator/organizations/${organizationId}/campaigns/${campaign.id}/start`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  }
  
  return campaign;
}
```

### Pattern 4: Webhook Integration

Receive real-time notifications from 4Calls:

```javascript
// Webhook endpoint in your app
app.post('/webhooks/4calls', async (req, res) => {
  // Verify signature
  const signature = req.headers['x-4calls-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  const { event, organization_id, data } = req.body;
  
  switch (event) {
    case 'contact.created':
      await syncContactToMySystem(data);
      break;
    case 'appointment.created':
      await syncAppointmentToMySystem(data);
      break;
    case 'call.completed':
      await logCallInMySystem(data);
      break;
    case 'campaign.completed':
      await updateCampaignInMySystem(data);
      break;
  }
  
  res.status(200).send('OK');
});
```

---

## CODE EXAMPLES

### JavaScript/TypeScript Example

```typescript
class FourCallsIntegration {
  constructor(private baseUrl: string, private token: string) {}
  
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`4Calls API error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async createOrganization(data: any) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async createCoordinator(orgId: string, data: any) {
    return this.request(`/organizations/${orgId}/coordinators`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async createContact(orgId: string, contact: any) {
    return this.request(`/organizations/${orgId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }
  
  async createAppointment(orgId: string, appointment: any) {
    return this.request(`/organizations/${orgId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }
  
  async createCampaign(orgId: string, campaign: any) {
    return this.request(`/organizations/${orgId}/campaigns`, {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }
}

// Usage
const fourCalls = new FourCallsIntegration(
  'https://api.taskjuggler.com/api/coordinator',
  'your_token_here'
);

const org = await fourCalls.createOrganization({
  name: 'Acme Corporation',
  industry: 'Technology',
  timezone: 'America/New_York'
});

const contact = await fourCalls.createContact(org.id, {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});
```

### Python Example

```python
import requests

class FourCallsIntegration:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def create_organization(self, data):
        response = requests.post(
            f'{self.base_url}/organizations',
            json=data,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def create_coordinator(self, org_id, data):
        response = requests.post(
            f'{self.base_url}/organizations/{org_id}/coordinators',
            json=data,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def create_contact(self, org_id, contact):
        response = requests.post(
            f'{self.base_url}/organizations/{org_id}/contacts',
            json=contact,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def create_appointment(self, org_id, appointment):
        response = requests.post(
            f'{self.base_url}/organizations/{org_id}/appointments',
            json=appointment,
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

# Usage
four_calls = FourCallsIntegration(
    'https://api.taskjuggler.com/api/coordinator',
    'your_token_here'
)

org = four_calls.create_organization({
    'name': 'Acme Corporation',
    'industry': 'Technology',
    'timezone': 'America/New_York'
})

contact = four_calls.create_contact(org['id'], {
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '+1234567890'
})
```

---

## ERROR HANDLING

### Error Response Format

```json
{
  "error": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  },
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `422`: Validation Error - Invalid input data
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

---

## RATE LIMITS

4Calls API has rate limits:

- **Standard**: 100 requests per minute per token
- **Bulk Operations**: 10 requests per minute per token
- **Webhooks**: No rate limit (but signature verification required)
- **AI Agent API**: 200 requests per minute per agent token

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

---

## BEST PRACTICES

### 1. Use Webhooks for Real-Time Updates

Register webhooks instead of polling:

```javascript
await fetch(`https://api.taskjuggler.com/api/coordinator/organizations/${orgId}/webhooks`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My App Webhook',
    url: 'https://myapp.com/webhooks/4calls',
    secret: 'your_secret',
    events: ['contact.created', 'appointment.created']
  })
});
```

### 2. Use Metadata for External References

Store external IDs in metadata:

```javascript
{
  name: 'John Doe',
  email: 'john@example.com',
  metadata: {
    source: 'my_crm',
    source_id: 'crm_contact_123',
    last_synced: '2026-01-20T10:00:00Z'
  }
}
```

### 3. Implement Idempotency

Use `source_id` to prevent duplicates:

```javascript
// Check if contact exists before creating
const existing = await searchContact(orgId, { 
  'metadata->source_id': 'crm_contact_123' 
});

if (!existing) {
  await createContact(orgId, contact);
}
```

### 4. Handle Rate Limits

Implement exponential backoff:

```javascript
async function requestWithRetry(endpoint, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(endpoint, options);
    } catch (error) {
      if (error.status === 429) {
        const retryAfter = error.headers.get('Retry-After') || Math.pow(2, i);
        await sleep(retryAfter * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

---

## SUPPORT

For integration support:
- **Documentation**: See `PLATFORM_INTEGRATION_GUIDE.md` for platform-level integration
- **API Reference**: Check API documentation at `/api/docs`
- **Support**: Contact support@taskjuggler.com

---

**END OF 4CALLS INTEGRATION GUIDE**

