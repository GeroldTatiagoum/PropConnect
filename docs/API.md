# PropConnect API Documentation

## Overview

PropConnect API is a RESTful API built with Express.js/NestJS that powers the web and mobile applications. The API follows OpenAPI 3.0 specification and provides comprehensive endpoints for user management, property listings, verification workflows, and marketplace operations.

**Base URL**: `https://api.propconnect.it/v1`  
**Documentation**: `https://api.propconnect.it/v1/docs` (Swagger UI)

## Authentication

### JWT Bearer Token

All authenticated endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh

**Endpoint**: `POST /auth/refresh`

```json
{
  "refreshToken": "refresh_token_value"
}
```

**Response**:
```json
{
  "accessToken": "new_jwt_token",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

### API Keys (Coming in Phase 2)

For broker integrations and partner APIs:

```bash
X-API-Key: pk_live_xxxxxxxxxxxxx
```

## Core Endpoints

### Authentication & Users

#### 1. User Registration

**POST** `/auth/register`

Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "Mario",
  "lastName": "Rossi",
  "role": "seller",
  "phone": "+39 3XX XXX XXXX"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "firstName": "Mario",
  "lastName": "Rossi",
  "role": "seller",
  "kycStatus": "pending",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 900
}
```

**Error Responses**:
- `400 Bad Request` - Validation failed
- `409 Conflict` - Email already registered

#### 2. User Login

**POST** `/auth/login`

Authenticate user with email and password.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "role": "seller",
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresIn": 900
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Too many login attempts

#### 3. Get User Profile

**GET** `/users/me`

Retrieve authenticated user profile.

**Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Mario",
  "lastName": "Rossi",
  "role": "seller",
  "phone": "+39 3XX XXX XXXX",
  "kycStatus": "approved",
  "createdAt": "2026-05-31T10:00:00Z",
  "updatedAt": "2026-05-31T15:30:00Z"
}
```

#### 4. Update User Profile

**PATCH** `/users/me`

Update user profile information.

**Request**:
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "phone": "+39 3XX XXX XXXX",
  "profilePhoto": "https://s3.aws.com/photos/user-id.jpg"
}
```

**Response** (200 OK): Updated user object

### KYC & Document Management

#### 5. Upload KYC Document

**POST** `/users/kyc/documents`

Upload identity document for KYC verification.

**Request** (multipart/form-data):
```
- file: (binary) Document file (PDF, JPG, PNG - max 10MB)
- documentType: "identity_card" | "passport" | "driving_license"
- side: "front" | "back"
```

**Response** (201 Created):
```json
{
  "id": "document-uuid",
  "documentType": "identity_card",
  "side": "front",
  "s3Path": "encrypted-s3-path",
  "uploadedAt": "2026-05-31T10:00:00Z",
  "status": "pending_verification",
  "verificationNotes": null
}
```

#### 6. Get KYC Status

**GET** `/users/kyc/status`

Retrieve KYC verification status.

**Response** (200 OK):
```json
{
  "overallStatus": "pending",
  "documents": [
    {
      "id": "doc-uuid",
      "type": "identity_card",
      "status": "approved",
      "verifiedAt": "2026-05-31T12:00:00Z",
      "verifiedBy": "broker-uuid"
    }
  ],
  "lastReviewedAt": "2026-05-31T12:00:00Z",
  "expiresAt": "2027-05-31T12:00:00Z"
}
```

### Property Management

#### 7. Create Property Listing

**POST** `/properties`

Create a new property listing.

**Request**:
```json
{
  "address": "Via Roma 123, 20100 Milano",
  "latitude": 45.4642,
  "longitude": 9.1900,
  "propertyType": "apartment",
  "rooms": 3,
  "bathrooms": 2,
  "totalAreaSqm": 120,
  "price": 450000,
  "description": "Bellissimo appartamento nel centro di Milano...",
  "amenities": ["elevator", "parking", "heating"],
  "documents": ["cadastral_map", "ape", "floor_plan"]
}
```

**Response** (201 Created):
```json
{
  "id": "property-uuid",
  "sellerId": "seller-uuid",
  "address": "Via Roma 123, 20100 Milano",
  "latitude": 45.4642,
  "longitude": 9.1900,
  "price": 450000,
  "status": "draft",
  "createdAt": "2026-05-31T10:00:00Z",
  "updatedAt": "2026-05-31T10:00:00Z"
}
```

#### 8. Get Property Details

**GET** `/properties/{id}`

Retrieve detailed property information.

**Query Parameters**:
- `include` - comma-separated fields: `media`, `comparables`, `valuation`

**Response** (200 OK):
```json
{
  "id": "property-uuid",
  "sellerId": "seller-uuid",
  "address": "Via Roma 123, 20100 Milano",
  "price": 450000,
  "rooms": 3,
  "bathrooms": 2,
  "totalAreaSqm": 120,
  "pricePerSqm": 3750,
  "status": "published",
  "media": [
    {
      "id": "media-uuid",
      "type": "photo",
      "url": "https://cdn.propconnect.it/properties/photo-1.jpg",
      "order": 1
    }
  ],
  "documents": [
    {
      "id": "doc-uuid",
      "type": "cadastral_map",
      "verified": true
    }
  ],
  "comparables": [
    {
      "id": "comparable-uuid",
      "address": "Via Milano 45",
      "price": 440000,
      "pricePerSqm": 3667
    }
  ],
  "valuation": {
    "estimatedValue": 445000,
    "range": [435000, 455000],
    "confidence": 0.87
  },
  "viewCount": 245,
  "contactRequestsCount": 12,
  "createdAt": "2026-05-31T10:00:00Z"
}
```

#### 9. Update Property Listing

**PATCH** `/properties/{id}`

Update property information (only by owner).

**Request**:
```json
{
  "price": 460000,
  "description": "Updated description",
  "amenities": ["elevator", "parking", "heating", "terrace"]
}
```

**Response** (200 OK): Updated property object

#### 10. List Properties

**GET** `/properties`

Search and filter properties with pagination.

**Query Parameters**:
```
GET /properties?
  status=published&
  minPrice=300000&
  maxPrice=500000&
  rooms=3&
  latitude=45.46&
  longitude=9.19&
  radius=5&
  page=1&
  limit=20&
  sort=date_desc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "property-uuid",
      "address": "Via Roma 123, 20100 Milano",
      "price": 450000,
      "pricePerSqm": 3750,
      "rooms": 3,
      "bathrooms": 2,
      "thumbnail": "https://cdn.propconnect.it/thumb.jpg",
      "status": "published",
      "createdAt": "2026-05-31T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Document Verification (Broker)

#### 11. Get Verification Queue

**GET** `/verification/queue`

Retrieve pending verification tasks (broker only).

**Query Parameters**:
```
GET /verification/queue?
  status=pending&
  type=property&
  page=1&
  limit=10&
  sort=priority_desc,created_at_asc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "verification-uuid",
      "type": "property_documents",
      "userId": "seller-uuid",
      "propertyId": "property-uuid",
      "status": "pending",
      "priority": "high",
      "checklist": [
        {
          "id": "item-1",
          "name": "Cadastral Certificate",
          "required": true,
          "completed": false,
          "notes": ""
        }
      ],
      "createdAt": "2026-05-31T09:00:00Z",
      "expiresAt": "2026-06-07T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 10
  }
}
```

#### 12. Approve Verification

**POST** `/verification/{id}/approve`

Approve a verification task (broker only).

**Request**:
```json
{
  "notes": "All documents checked and verified",
  "completedItems": ["item-1", "item-2", "item-3"]
}
```

**Response** (200 OK):
```json
{
  "id": "verification-uuid",
  "status": "approved",
  "approvedAt": "2026-05-31T14:30:00Z",
  "approvedBy": "broker-uuid"
}
```

#### 13. Reject Verification

**POST** `/verification/{id}/reject`

Request corrections for verification (broker only).

**Request**:
```json
{
  "reason": "Document quality insufficient",
  "rejectedItems": ["item-2"],
  "requestedCorrections": ["item-2"]
}
```

**Response** (200 OK):
```json
{
  "id": "verification-uuid",
  "status": "rejected",
  "rejectedAt": "2026-05-31T14:30:00Z",
  "rejectedBy": "broker-uuid",
  "requestedCorrections": ["item-2"]
}
```

### Messaging & Communication

#### 14. Get Conversations

**GET** `/messages/conversations`

Retrieve user's message conversations.

**Query Parameters**:
```
GET /messages/conversations?
  page=1&
  limit=20&
  sort=last_message_desc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "conversation-uuid",
      "otherParty": {
        "id": "user-uuid",
        "name": "Mario Rossi",
        "photo": "https://cdn.propconnect.it/user.jpg"
      },
      "property": {
        "id": "property-uuid",
        "address": "Via Roma 123",
        "price": 450000
      },
      "lastMessage": "Disponibile per una visita?",
      "unreadCount": 2,
      "lastMessageAt": "2026-05-31T15:45:00Z"
    }
  ]
}
```

#### 15. Get Conversation Messages

**GET** `/messages/conversations/{conversationId}`

Retrieve messages in a conversation.

**Query Parameters**:
```
GET /messages/conversations/{id}?
  page=1&
  limit=50&
  sort=date_asc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "message-uuid",
      "sender": {
        "id": "user-uuid",
        "name": "Mario Rossi"
      },
      "content": "Sono interessato a questa proprietà",
      "type": "text",
      "createdAt": "2026-05-31T14:30:00Z",
      "readAt": "2026-05-31T14:32:00Z"
    }
  ]
}
```

#### 16. Send Message

**POST** `/messages/conversations/{conversationId}/messages`

Send a message in a conversation.

**Request**:
```json
{
  "content": "Disponibile per una visita domani pomeriggio?",
  "type": "text"
}
```

**Response** (201 Created):
```json
{
  "id": "message-uuid",
  "conversationId": "conversation-uuid",
  "sender": {
    "id": "user-uuid",
    "name": "Current User"
  },
  "content": "Disponibile per una visita domani pomeriggio?",
  "type": "text",
  "createdAt": "2026-05-31T15:00:00Z"
}
```

### Market Data & Analytics

#### 17. Get Market Overview

**GET** `/marketplace/overview`

Retrieve market data summary for a zone.

**Query Parameters**:
```
GET /marketplace/overview?
  latitude=45.46&
  longitude=9.19&
  radius=5&
  propertyType=apartment
```

**Response** (200 OK):
```json
{
  "zone": {
    "name": "Centro Storico, Milano",
    "latitude": 45.4642,
    "longitude": 9.1900
  },
  "pricePerSqm": {
    "average": 3750,
    "min": 2800,
    "max": 5200,
    "trend": "+2.5%"
  },
  "marketLiquidity": {
    "averageDaysToSale": 87,
    "trend": "-5%"
  },
  "activeListings": 234,
  "recentTransactions": 12,
  "priceHistory": [
    {
      "month": "2026-05",
      "pricePerSqm": 3650
    }
  ]
}
```

#### 18. Get Property Valuation

**GET** `/marketplace/valuations/{propertyId}`

Get AI-powered property valuation estimate.

**Response** (200 OK):
```json
{
  "propertyId": "property-uuid",
  "estimatedValue": 445000,
  "range": {
    "low": 435000,
    "high": 455000
  },
  "confidence": 0.87,
  "factors": {
    "location": 0.35,
    "size": 0.25,
    "condition": 0.20,
    "market_trend": 0.15,
    "amenities": 0.05
  },
  "comparables": [
    {
      "id": "comparable-uuid",
      "address": "Via Milano 45",
      "price": 440000,
      "pricePerSqm": 3667,
      "similarity": 0.92
    }
  ],
  "generatedAt": "2026-05-31T15:00:00Z"
}
```

#### 19. Get Comparable Properties

**GET** `/marketplace/comparables`

Find similar properties for comparison.

**Query Parameters**:
```
GET /marketplace/comparables?
  propertyId=property-uuid&
  maxResults=10&
  similarity=0.80
```

**Response** (200 OK):
```json
{
  "referenceProperty": {
    "id": "property-uuid",
    "address": "Via Roma 123",
    "price": 450000,
    "pricePerSqm": 3750
  },
  "comparables": [
    {
      "id": "comp-1",
      "address": "Via Milano 45",
      "price": 440000,
      "pricePerSqm": 3667,
      "similarity": 0.92,
      "soldAt": "2026-04-15",
      "differencePercentage": -2.2
    }
  ]
}
```

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PATCH/DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response |
| 400 | Bad Request | Validation or client error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failure |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Rate Limiting

### Limits per Authentication Level

**Unauthenticated**:
- 10 requests per minute per IP

**Authenticated User**:
- 100 requests per minute
- 5000 requests per hour

**Broker**:
- 500 requests per minute
- 50000 requests per hour

**Admin**:
- Unlimited

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1622486400
```

## Webhooks

PropConnect supports webhooks for event notifications (Phase 2).

**Events**:
- `verification.approved`
- `verification.rejected`
- `message.received`
- `property.published`
- `transaction.completed`

## Pagination

All list endpoints support cursor-based pagination:

**Query Parameters**:
```
GET /endpoint?page=1&limit=20&sort=field_asc
```

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 20,
    "pages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Testing the API

### Using cURL

```bash
# Register
curl -X POST https://api.propconnect.it/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "Mario",
    "lastName": "Rossi",
    "role": "seller"
  }'

# Login
curl -X POST https://api.propconnect.it/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'

# Authenticated request
curl -X GET https://api.propconnect.it/v1/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

Import the OpenAPI collection:
```
https://api.propconnect.it/v1/openapi.json
```

---

**API Version**: 1.0  
**Last Updated**: May 2026  
**Swagger UI**: https://api.propconnect.it/v1/docs
