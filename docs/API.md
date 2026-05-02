# LeadFlow Pro - API Documentation

Base URL: `http://localhost:3001/api/v1`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "sales_agent" | "business_manager" | "admin"
}
```

Response:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "sales_agent",
    "is_active": true
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "sales_agent",
    "is_active": true
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbG..."
}
```

Response:
```json
{
  "accessToken": "eyJhbG..."
}
```

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <access_token>`

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "sales_agent",
    "is_active": true
  }
}
```

---

## Leads

### List Leads
**GET** `/leads`

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string[] | Filter by status |
| source | string[] | Filter by source |
| assignedTo | string | Filter by assigned user ID |
| search | string | Search in name/email/phone |
| sortBy | string | Sort field |
| sortOrder | ASC/DESC | Sort direction |

Response:
```json
{
  "leads": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "source": "website",
      "status": "new",
      "priority": 1,
      "interested_car_model": "Toyota Camry",
      "budget_min": 25000,
      "budget_max": 35000,
      "financing_needed": true,
      "assigned_to": {
        "id": "uuid",
        "full_name": "Agent Name",
        "email": "agent@example.com"
      },
      "lead_score": 75,
      "tags": ["hot", "follow-up"],
      "notes": "Customer interested in test drive",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Create Lead
**POST** `/leads`

Request:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "source": "website",
  "status": "new",
  "priority": 1,
  "interested_car_model": "Toyota Camry",
  "budget_min": 25000,
  "budget_max": 35000,
  "financing_needed": true,
  "trade_in_vehicle": "Honda Civic 2020",
  "preferred_contact_time": "morning",
  "tags": ["hot"],
  "notes": "Interested in test drive"
}
```

### Get Lead by ID
**GET** `/leads/:id`

Response:
```json
{
  "id": "uuid",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "source": "website",
  "status": "contacted",
  "priority": 1,
  "interested_car_model": "Toyota Camry",
  "budget_min": 25000,
  "budget_max": 35000,
  "financing_needed": true,
  "assigned_to": { ... },
  "lead_score": 75,
  "tags": ["hot"],
  "notes": "...",
  "first_contacted_at": "2024-01-02T00:00:00Z",
  "last_contacted_at": "2024-01-03T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-03T00:00:00Z"
}
```

### Update Lead
**PUT** `/leads/:id`

Request:
```json
{
  "status": "contacted",
  "priority": 2,
  "notes": "Customer requested callback"
}
```

### Delete Lead
**DELETE** `/leads/:id`

Response: `204 No Content`

### Assign Lead
**POST** `/leads/:id/assign`

Request:
```json
{
  "assigned_to": "user-uuid"
}
```

### Update Lead Status
**PATCH** `/leads/:id/status`

Request:
```json
{
  "status": "qualified"
}
```

---

## Lead Activities

### Get Lead Activities
**GET** `/leads/:id/activities`

Response:
```json
{
  "activities": [
    {
      "id": "uuid",
      "lead_id": "lead-uuid",
      "type": "call" | "email" | "meeting" | "note" | "status_change",
      "description": "Called customer",
      "created_by": {
        "id": "uuid",
        "full_name": "Agent Name"
      },
      "created_at": "2024-01-02T00:00:00Z"
    }
  ]
}
```

### Create Activity
**POST** `/leads/:id/activities`

Request:
```json
{
  "type": "call",
  "description": "Discussed financing options"
}
```

---

## Automation Rules

### List Rules
**GET** `/automation-rules`

Response:
```json
{
  "rules": [
    {
      "id": "uuid",
      "name": "High Priority Alert",
      "trigger": {
        "type": "lead_created" | "status_changed" | "score_above",
        "conditions": { ... }
      },
      "actions": [
        {
          "type": "notify" | "assign" | "update_field" | "create_task",
          "config": { ... }
        }
      ],
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ]
}
```

### Create Rule
**POST** `/automation-rules`

Request:
```json
{
  "name": "New Lead Notification",
  "trigger": {
    "type": "lead_created",
    "conditions": {}
  },
  "actions": [
    {
      "type": "notify",
      "config": {
        "channel": "email",
        "recipients": ["manager@example.com"],
        "template": "new_lead"
      }
    }
  ],
  "is_active": true
}
```

### Update Rule
**PUT** `/automation-rules/:id`

### Delete Rule
**DELETE** `/automation-rules/:id`

---

## Real-time Events

Connect to Socket.io server at `http://localhost:3001`

### Events Emitted by Server

| Event | Data | Description |
|-------|------|-------------|
| `lead:created` | Lead object | New lead created |
| `lead:updated` | Lead object | Lead updated |
| `lead:deleted` | leadId | Lead deleted |
| `lead:assigned` | { lead, user } | Lead assigned |
| `activity:created` | Activity object | New activity |

### Events to Server

| Event | Data | Description |
|-------|------|-------------|
| `join:lead` | leadId | Join lead room |
| `leave:lead` | leadId | Leave lead room |

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error