# PropConnect Database Schema

## Overview

PropConnect uses PostgreSQL as its primary relational database. This document outlines the complete schema, relationships, and migration strategies.

## Core Tables

### 1. Users Table

Stores user account information and profile data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('seller', 'buyer', 'broker', 'admin') NOT NULL DEFAULT 'buyer',
  kyc_status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_secret VARCHAR(255),
  profile_photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
```

### 2. Documents Table

Stores uploaded documents for KYC and property verification.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  document_type ENUM('identity_card', 'passport', 'driving_license', 
                      'cadastral_map', 'ape', 'floor_plan', 
                      'utility_bill', 'property_deed') NOT NULL,
  s3_path VARCHAR(500) NOT NULL,
  s3_key VARCHAR(500) NOT NULL UNIQUE,
  file_size_bytes INTEGER,
  file_mime_type VARCHAR(50),
  ocr_extracted_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  verification_notes TEXT,
  document_side ENUM('front', 'back', 'full') DEFAULT 'full',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_verified ON documents(is_verified);
```

### 3. Properties Table

Core property listing information.

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES users(id),
  address VARCHAR(500) NOT NULL,
  postal_code VARCHAR(10),
  city VARCHAR(100) NOT NULL,
  province VARCHAR(50) NOT NULL,
  country VARCHAR(50) DEFAULT 'IT',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  property_type ENUM('apartment', 'house', 'villa', 'commercial', 'land') NOT NULL,
  sub_type VARCHAR(100),
  rooms_count SMALLINT NOT NULL,
  bathrooms_count SMALLINT,
  total_area_sqm DECIMAL(10, 2) NOT NULL,
  land_area_sqm DECIMAL(10, 2),
  price DECIMAL(15, 2) NOT NULL,
  price_per_sqm DECIMAL(10, 2) GENERATED ALWAYS AS (price / total_area_sqm),
  currency VARCHAR(3) DEFAULT 'EUR',
  description TEXT,
  amenities JSONB,
  status ENUM('draft', 'pending_verification', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  contact_request_count INTEGER DEFAULT 0,
  year_built SMALLINT,
  condition ENUM('new', 'good', 'fair', 'needs_renovation'),
  heating_type VARCHAR(100),
  cooling_type VARCHAR(100),
  is_furnished BOOLEAN DEFAULT false,
  has_elevator BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_terrace BOOLEAN DEFAULT false,
  has_garden BOOLEAN DEFAULT false,
  energy_class VARCHAR(1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT valid_coords CHECK (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180)
);

CREATE INDEX idx_properties_seller ON properties(seller_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_published ON properties(published_at);
CREATE INDEX idx_properties_coords ON properties(latitude, longitude);
CREATE INDEX idx_properties_price ON properties(price);
```

### 4. Property Media Table

Stores photos, videos, and floor plans for properties.

```sql
CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_type ENUM('photo', 'video', 'floor_plan', 'virtual_tour') NOT NULL,
  s3_url VARCHAR(500) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  file_size_bytes INTEGER,
  display_order SMALLINT DEFAULT 0,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_property_media_property ON property_media(property_id);
CREATE INDEX idx_property_media_order ON property_media(property_id, display_order);
```

### 5. Verifications Table

Tracks document verification tasks assigned to brokers.

```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  verification_type ENUM('kyc_user', 'kyc_seller', 'property_documents', 'financial_capacity'),
  status ENUM('pending', 'in_review', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  assigned_broker_id UUID REFERENCES users(id),
  assigned_at TIMESTAMP,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  checklist JSONB, -- Array of checklist items
  rejection_reason TEXT,
  rejection_details JSONB,
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_verifications_status ON verifications(status);
CREATE INDEX idx_verifications_broker ON verifications(assigned_broker_id);
CREATE INDEX idx_verifications_user ON verifications(user_id);
CREATE INDEX idx_verifications_property ON verifications(property_id);
CREATE INDEX idx_verifications_priority ON verifications(priority);
```

### 6. Conversations Table

Stores messaging conversations between buyers and sellers.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  status ENUM('active', 'archived', 'blocked') DEFAULT 'active',
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT different_users CHECK (buyer_id != seller_id)
);

CREATE INDEX idx_conversations_property ON conversations(property_id);
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);
```

### 7. Messages Table

Stores individual messages in conversations.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  message_type ENUM('text', 'document_share', 'system_notification', 'meeting_proposal') DEFAULT 'text',
  metadata JSONB,
  is_deleted BOOLEAN DEFAULT false, -- Soft delete
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_read ON messages(read_at);
```

### 8. Contact Requests Table

Tracks buyer interest in properties.

```sql
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES properties(seller_id),
  status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  message TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  response_message TEXT,
  CONSTRAINT unique_request UNIQUE(property_id, buyer_id)
);

CREATE INDEX idx_contact_requests_property ON contact_requests(property_id);
CREATE INDEX idx_contact_requests_buyer ON contact_requests(buyer_id);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
```

### 9. Transactions Table

Records completed property transactions.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  transaction_value DECIMAL(15, 2) NOT NULL,
  propconnect_commission_amount DECIMAL(15, 2),
  commission_percentage DECIMAL(5, 2),
  transaction_date TIMESTAMP NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

### 10. Market Data Table

Stores market analytics and trends.

```sql
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  date_recorded DATE NOT NULL,
  avg_price_per_sqm DECIMAL(10, 2),
  min_price_per_sqm DECIMAL(10, 2),
  max_price_per_sqm DECIMAL(10, 2),
  avg_days_to_sale INTEGER,
  active_listings_count INTEGER,
  sold_count_last_30_days INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_market_data UNIQUE(zone_name, property_type, date_recorded)
);

CREATE INDEX idx_market_data_zone ON market_data(zone_name);
CREATE INDEX idx_market_data_date ON market_data(date_recorded DESC);
CREATE INDEX idx_market_data_type ON market_data(property_type);
```

### 11. Valuations Table

Stores AI-generated property valuations.

```sql
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES properties(id),
  estimated_value DECIMAL(15, 2) NOT NULL,
  value_range_low DECIMAL(15, 2),
  value_range_high DECIMAL(15, 2),
  confidence_score DECIMAL(3, 2),
  factors JSONB, -- Weights for location, size, condition, etc.
  algorithm_version VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_valuations_property ON valuations(property_id);
```

### 12. Audit Logs Table

Tracks all sensitive operations for compliance.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100), -- 'user', 'property', 'document', etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  status ENUM('success', 'failure') DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

## Relationships Diagram

```
users
├── properties (seller_id FK)
├── documents (user_id FK)
├── verifications (user_id, assigned_broker_id, completed_by FK)
├── conversations (buyer_id, seller_id FK)
├── messages (sender_id, recipient_id FK)
├── contact_requests (buyer_id FK)
└── transactions (seller_id, buyer_id FK)

properties
├── property_media (property_id FK)
├── documents (property_id FK)
├── valuations (property_id FK)
├── verifications (property_id FK)
├── conversations (property_id FK)
├── contact_requests (property_id FK)
├── transactions (property_id FK)
└── market_data (derived from)

conversations
├── messages (conversation_id FK)
└── users (buyer_id, seller_id FK)
```

## Indexing Strategy

**Performance Priorities**:
1. User lookup by email (authentication)
2. Property search by location & price
3. Property status filtering
4. Verification queue queries
5. Message retrieval by conversation
6. Audit log searches

**Composite Indexes**:
```sql
-- Property filtering
CREATE INDEX idx_properties_status_type_price 
  ON properties(status, property_type, price);

-- Verification queue
CREATE INDEX idx_verifications_status_broker_priority 
  ON verifications(status, assigned_broker_id, priority);

-- Market data queries
CREATE INDEX idx_market_data_zone_type_date 
  ON market_data(zone_name, property_type, date_recorded DESC);
```

## Partitioning Strategy (for scaling)

Future partitioning by date for large tables:

```sql
-- Messages table partitioned by month
CREATE TABLE messages_2026_05 PARTITION OF messages
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

## Backup & Recovery

- Daily automated backups to AWS RDS Backups
- 30-day retention
- Point-in-time recovery available
- Multi-region cross-region read replicas for high availability

---

**Database Version**: PostgreSQL 14+  
**Last Updated**: May 2026
