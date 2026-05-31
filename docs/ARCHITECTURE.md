# PropConnect Architecture Documentation

## Overview

PropConnect is a full-stack web application designed with a modular, scalable architecture following modern software engineering best practices. This document outlines the system design, component interactions, and technical patterns used throughout the application.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  React Frontend  │  │  Mobile (Phase 2)│                │
│  │  (Vite + TS)    │  │  (React Native) │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
└───────────┼──────────────────────┼─────────────────────────┘
            │                      │
            └──────────┬───────────┘
                       │ HTTPS/WSS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway / Reverse Proxy               │
│                    (Nginx / CloudFront)                     │
│            Rate limiting, SSL/TLS termination               │
└──────────────────────┬────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Node.js / NestJS Backend Server           │  │
│  │                                                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │  │
│  │  │ Auth Module │  │ User Module │  │ Properties │  │  │
│  │  │   Routes    │  │   Routes    │  │  Routes    │  │  │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │  │
│  │                                                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │  │
│  │  │Verification │  │ Messaging   │  │ Marketplace│  │  │
│  │  │   Module    │  │   Module    │  │  Module    │  │  │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │        Middleware & Utilities Layer          │  │  │
│  │  │  (Auth, Validation, Error Handling, Logging) │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
        ▼             ▼             ▼              ▼
    ┌────────┐  ┌─────────┐  ┌────────┐  ┌──────────────┐
    │  PgSQL │  │ Redis   │  │ AWS S3 │  │ External APIs│
    │ Primary│  │ Cache   │  │Document│  │(OMI, etc)    │
    │Database│  │ Sessions│  │Storage │  │              │
    └────────┘  └─────────┘  └────────┘  └──────────────┘
        │
        ▼
    ┌──────────────┐
    │  Backup/    │
    │  Replica    │
    └──────────────┘
```

## Core Modules

### 1. Authentication Module (`/backend/src/modules/auth`)

**Responsibility**: Handle user authentication, authorization, and session management.

**Components**:

- `auth.controller.ts` - HTTP request handlers
- `auth.service.ts` - Business logic
- `auth.guard.ts` - Route protection middleware
- `jwt.strategy.ts` - JWT passport strategy
- `oauth.strategy.ts` - OAuth2 integration

**Key Features**:

- JWT token generation and validation
- Refresh token rotation
- Two-factor authentication (2FA)
- OAuth2 social login (Google, Facebook)
- Session management with Redis

**Flow**:

```
User Registration/Login
    ↓
Validate Credentials
    ↓
Generate JWT + Refresh Token
    ↓
Store Session in Redis
    ↓
Return Tokens to Client
    ↓
Client stores JWT in memory/secure cookie
    ↓
Subsequent requests include JWT in Authorization header
```

### 2. User Management Module (`/backend/src/modules/users`)

**Responsibility**: User profile management, KYC documentation, and user role administration.

**Components**:

- `user.controller.ts` - User CRUD operations
- `user.service.ts` - User business logic
- `user.entity.ts` - Database schema
- `kyc.service.ts` - KYC verification logic
- `document-upload.service.ts` - Document handling

**User Roles**:

- **Seller** - Property owner listing properties
- **Buyer** - Property seeker/purchaser
- **Broker** - Intermediary who verifies documents and parties
- **Admin** - Platform administrator

**KYC Process**:

```
User uploads identity document
    ↓
System performs OCR extraction
    ↓
Document stored in S3 with encryption
    ↓
Broker queue notified
    ↓
Broker reviews document
    ↓
Document approved/rejected
    ↓
User notified of KYC status
```

### 3. Property Module (`/backend/src/modules/properties`)

**Responsibility**: Property listing management, media handling, and property data.

**Components**:

- `property.controller.ts` - Property CRUD operations
- `property.service.ts` - Property business logic
- `property.entity.ts` - Database schema
- `media.service.ts` - Photo/video management
- `geolocation.service.ts` - Map integration

**Property Lifecycle States**:

```
Draft → Pending Verification → Published → Archived
        ↑_________________________↓
              (Rejected)
```

**Data Fields**:

- Basic info: address, rooms, bathrooms, area, price
- Technical docs: cadastral maps, APE, floor plans
- Media: photos, virtual tours, videos
- Location: coordinates, radius search
- Metadata: created_at, updated_at, view_count

### 4. Verification Module (`/backend/src/modules/verification`)

**Responsibility**: Document verification workflow, broker task management.

**Components**:

- `verification.controller.ts` - Broker operations
- `verification.service.ts` - Verification logic
- `verification-queue.service.ts` - Priority queue management
- `verification-checklist.service.ts` - Checklist validation

**Verification Workflow**:

```
Seller/Buyer uploads documents
    ↓
Document added to verification queue
    ↓
Broker assigned (round-robin or by specialization)
    ↓
Broker reviews checklist items
    ↓
Broker approves/requests corrections
    ↓
User notified
    ↓
Upon completion: unlock buyer-seller communication
```

**Verification States**:

- `pending` - Awaiting broker review
- `in_review` - Broker actively reviewing
- `approved` - All documents verified
- `rejected` - Issues found, user must correct
- `expired` - Verification expired, needs renewal

### 5. Messaging Module (`/backend/src/modules/messaging`)

**Responsibility**: Real-time certified communication between buyers and sellers.

**Components**:

- `message.controller.ts` - Message CRUD
- `message.service.ts` - Message logic
- `websocket.gateway.ts` - Real-time WebSocket handler
- `notification.service.ts` - Push notifications

**Key Features**:

- Real-time messaging via WebSocket
- Immutable message history
- Document sharing in messages
- Automatic notifications
- Message encryption in transit

**Message Types**:

- Text messages
- Document shares
- System notifications
- Meeting proposals

### 6. Marketplace Module (`/backend/src/modules/marketplace`)

**Responsibility**: Market data analytics, pricing, and property comparables.

**Components**:

- `market-data.service.ts` - Data aggregation
- `valuation.service.ts` - Property valuation algorithm
- `analytics.controller.ts` - Analytics endpoints
- `price-index.service.ts` - Price trend calculation

**Data Sources**:

- Internal transaction history
- OMI (Agenzia delle Entrate) API
- Immobiliare.it API
- idealista API

**Calculations**:

- Average price per m² by zone
- Price trends (6/12/24 months)
- Market liquidity index
- Comparable properties
- AI valuation estimates

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── Header
│   │   ├── Footer
│   │   ├── Navigation
│   │   └── ...
│   ├── auth/                # Auth-related components
│   │   ├── LoginForm
│   │   ├── RegisterForm
│   │   └── ...
│   ├── property/            # Property listing components
│   │   ├── PropertyCard
│   │   ├── PropertyDetail
│   │   └── ...
│   └── dashboard/           # Dashboard components
│       ├── BrokerDashboard
│       ├── SellerDashboard
│       └── ...
├── pages/                   # Route pages
│   ├── LoginPage
│   ├── DashboardPage
│   ├── PropertyDetailPage
│   └── ...
├── stores/                  # Redux state management
│   ├── auth.slice.ts
│   ├── user.slice.ts
│   ├── property.slice.ts
│   └── ...
├── services/                # API client services
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── property.service.ts
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useProperty.ts
│   └── ...
├── types/                   # TypeScript definitions
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── property.types.ts
│   └── ...
└── utils/                   # Utility functions
    ├── format.ts
    ├── validation.ts
    └── ...
```

### State Management

**Redux Store Structure**:

```
store/
├── auth
│   ├── user
│   ├── token
│   └── isAuthenticated
├── user
│   ├── profile
│   ├── kyc_status
│   └── loading
├── properties
│   ├── items[]
│   ├── currentProperty
│   ├── filters
│   └── pagination
├── marketplace
│   ├── marketData
│   ├── comparables[]
│   └── valuation
└── ui
    ├── modal
    ├── notification
    └── loading
```

## Database Schema

### Key Tables

**users**

```sql
- id (UUID primary key)
- email (unique)
- password_hash
- role (enum: seller, buyer, broker, admin)
- kyc_status (enum: pending, approved, rejected)
- created_at, updated_at
- is_active
```

**properties**

```sql
- id (UUID primary key)
- seller_id (FK to users)
- address
- latitude, longitude
- rooms, bathrooms
- total_area_sqm
- price
- status (enum: draft, pending, published, archived)
- created_at, updated_at
```

**documents**

```sql
- id (UUID primary key)
- user_id or property_id (FK)
- document_type (enum: identity, property_doc, etc)
- s3_path (encrypted storage location)
- verified_at
- verified_by (FK to broker)
- created_at
```

**messages**

```sql
- id (UUID primary key)
- sender_id (FK to users)
- recipient_id (FK to users)
- conversation_id (FK to conversations)
- content (encrypted)
- is_deleted (soft delete pattern)
- created_at
```

**verifications**

```sql
- id (UUID primary key)
- user_id or property_id (FK)
- verification_type
- status
- assigned_broker_id (FK)
- created_at, expires_at
```

## Security Architecture

### Authentication & Authorization

1. **JWT Strategy**
   - Short-lived access tokens (15 minutes)
   - Refresh tokens stored in Redis with rotation
   - Claims include user ID, role, permissions

2. **Role-Based Access Control (RBAC)**
   - Guards check user role before accessing routes
   - Decorator pattern: `@Role('broker', 'admin')`
   - Fine-grained permissions per action

3. **Two-Factor Authentication**
   - TOTP (Time-based One-Time Password)
   - Backup codes generation
   - Recovery procedures

### Data Protection

1. **Encryption at Rest**
   - Documents stored in encrypted AWS S3
   - Database credentials in AWS Secrets Manager
   - Sensitive fields encrypted in PostgreSQL

2. **Encryption in Transit**
   - HTTPS/TLS for all API calls
   - WSS (WebSocket Secure) for real-time communication
   - Certificate pinning for mobile (Phase 2)

3. **Sensitive Data Handling**
   - PII encrypted with field-level encryption
   - Document access logged
   - Regular security audits

### API Security

1. **Rate Limiting**
   - Per-IP limits (100 requests/minute)
   - Per-user limits (1000 requests/hour)
   - Burst protection

2. **Input Validation**
   - Whitelist validation patterns
   - Sanitization of user input
   - Protection against injection attacks

3. **CORS Configuration**
   - Allowed origins configured in env
   - Credentials only with same-origin
   - Preflight requests validated

## Performance Optimization

### Caching Strategy

1. **Redis Caching Layers**
   - User sessions: 24-hour TTL
   - Market data: 1-hour TTL
   - API responses: Variable TTL by endpoint
   - Database query results: 30-minute TTL

2. **Frontend Optimization**
   - Code splitting by route
   - Lazy loading of components
   - Image optimization and CDN delivery
   - Service worker for offline support

### Database Optimization

1. **Indexing Strategy**
   - Composite indexes on frequent queries
   - Indexes on foreign keys
   - Partial indexes for status-based queries

2. **Query Optimization**
   - N+1 query prevention with eager loading
   - Database connection pooling
   - Read replicas for analytics queries

## Deployment Architecture

### Environments

1. **Development** (`localhost`)
   - Local Docker Compose stack
   - Hot reloading enabled
   - Mock data seeding

2. **Staging** (`staging.propconnect.internal`)
   - AWS ECS deployment
   - Production-like configuration
   - E2E testing automated

3. **Production** (`app.propconnect.it`)
   - AWS multi-AZ deployment
   - Auto-scaling enabled
   - Blue-green deployments
   - CDN for static assets

### CI/CD Pipeline

```
Git Push
  ↓
GitHub Actions triggers
  ↓
Lint & Format checks
  ↓
Unit tests (Jest)
  ↓
Integration tests
  ↓
Build Docker images
  ↓
Push to ECR registry
  ↓
Deploy to Staging
  ↓
E2E tests (Cypress)
  ↓
Manual approval gate
  ↓
Deploy to Production
```

## Scalability Considerations

### Horizontal Scaling

- Stateless backend allows multiple instances
- Session state in Redis (not in-memory)
- Load balancing via Application Load Balancer (ALB)
- Database read replicas for report generation

### Vertical Scaling

- Container resource allocation in Kubernetes
- Auto-scaling policies based on CPU/memory
- RDS instance sizing for database

### Data Handling

- Document archiving for old transactions
- Pagination for large result sets
- Aggregated analytics queries
- Time-series data compression

## Technology Decision Rationale

| Component         | Choice         | Rationale                                                                        |
| ----------------- | -------------- | -------------------------------------------------------------------------------- |
| Language          | TypeScript     | Type safety, shared types between frontend and backend, fewer runtime errors     |
| Backend Framework | NestJS         | Spring Boot-inspired: DI, decorators, modules, guards — enterprise patterns without Java verbosity |
| Frontend          | React          | Large ecosystem, component-based, excellent DevTools                             |
| Database          | PostgreSQL     | ACID compliance, JSON support, robust                                            |
| Cache             | Redis          | Fast in-memory store, session management                                         |
| Storage           | AWS S3         | Scalable, secure, cost-effective                                                 |
| Auth              | JWT            | Stateless, scalable, standard                                                    |
| Real-time         | WebSocket      | Native browser support, low latency                                              |

### Why NestJS over Java/Spring Boot

This choice was evaluated deliberately. PropConnect's backend workload is almost entirely **I/O-bound**: PostgreSQL queries, Redis reads/writes, S3 document uploads, external API calls (OMI, Immobiliare.it), and WebSocket message routing. Node.js's non-blocking event loop is purpose-built for exactly this profile — Java's thread-per-request model offers no advantage here and carries significant overhead.

Beyond raw performance, NestJS provides the same enterprise architectural patterns as Spring Boot (dependency injection, module system, guards, interceptors, exception filters, pipes) with far less boilerplate. The biggest additional win is a **unified TypeScript codebase**: DTOs, validation schemas, and domain types defined once in the backend are directly reusable by the frontend, eliminating an entire class of contract drift bugs.

**When Java/Spring Boot would be the right call instead:**
- The core workload shifts to CPU-intensive computation (complex financial modeling, ML inference) that cannot be offloaded
- The team is primarily Java-experienced with no TypeScript background
- The platform needs to sustain tens of thousands of concurrent persistent WebSocket connections per node

None of those conditions apply to PropConnect at its current stage or foreseeable Italian market scale. The analytics and valuation computations in the Marketplace module (the one CPU-heavier area) run as background jobs and can be handed off to a dedicated worker process or a lightweight Python service if they become a bottleneck — without requiring a full backend rewrite.

**Note on Express**: NestJS uses Express as its HTTP adapter under the hood. There is no need to reference Express directly in the architecture — NestJS is the framework and Express is an implementation detail it abstracts away.

---

**Last Updated**: June 2026  
**Version**: 1.1
