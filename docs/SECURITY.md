# PropConnect Security & Compliance Documentation

## Security Overview

PropConnect implements multi-layered security controls to protect user data, ensure platform integrity, and comply with Italian and European regulations. This document outlines security practices, compliance measures, and incident response procedures.

## 1. GDPR Compliance (EU Regulation 2016/679)

### Data Protection Officer (DPO)

- **Designation**: DPO appointed as per GDPR Article 37
- **Contact**: dpo@propconnect.it
- **Responsibilities**:
  - Monitor GDPR compliance
  - Act as contact point for supervisory authorities
  - Conduct Data Protection Impact Assessments (DPIA)

### User Data Rights

PropConnect users have the following rights under GDPR:

#### 1.1 Right of Access (Article 15)
- Users can request a copy of their personal data
- **Endpoint**: `GET /users/me/data-export`
- **Timeline**: 30 days response time
- **Format**: Machine-readable JSON/CSV

#### 1.2 Right to Rectification (Article 16)
- Users can correct inaccurate personal data
- **Endpoint**: `PATCH /users/me`
- **Automatic**: Audit trail maintained

#### 1.3 Right to Erasure (Article 17)
- Users can request permanent data deletion
- **Endpoint**: `DELETE /users/me`
- **Exceptions**:
  - Active transactions must complete
  - Legal/regulatory retention periods
  - Backup retention (30 days max)
- **Process**: 30-day grace period before permanent deletion

#### 1.4 Right to Data Portability (Article 20)
- Users can download their data in portable format
- **Endpoint**: `GET /users/me/data-portable`
- **Formats**: JSON, CSV
- **Timeline**: 45 days

#### 1.5 Right to Object (Article 21)
- Users can object to processing
- **Endpoint**: `POST /users/me/withdraw-consent`
- **Effect**: Account suspended, data not processed

### Consent Management

**Explicit Consent Required For**:
- Collection of sensitive personal data (identity documents)
- Marketing communications
- Analytics and tracking
- Third-party data sharing

**Consent Storage**:
- All consent records timestamped and logged
- Users can withdraw consent anytime
- Clear audit trail in compliance logs

### Data Retention Policy

| Data Type | Retention Period | Rationale |
|-----------|------------------|-----------|
| Identity Documents | Until account deletion + 7 years | Tax/legal requirements |
| Transaction Records | 10 years | Italian tax law |
| Communication Logs | Until transaction closes + 6 months | Dispute resolution |
| Session Logs | 90 days | Security monitoring |
| Marketing Data | Until consent withdrawn | Marketing |

### Data Processing Agreements (DPA)

- **Processors**: AWS, Auth0, SendGrid, etc.
- **Standard Clauses**: EU Standard Contractual Clauses (SCC) included
- **Sub-processor List**: Published on website
- **Review Frequency**: Annual

## 2. Authentication & Authorization

### 2.1 Password Security

**Requirements**:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Password reset via secure email link (24-hour validity)
- Bcrypt hashing with salt (rounds: 12)
- Password history: Cannot reuse last 5 passwords

**Implementation**:
```typescript
// Password hashing example
import bcrypt from 'bcryptjs';

const passwordHash = await bcrypt.hash(password, 12);
const isMatch = await bcrypt.compare(inputPassword, passwordHash);
```

### 2.2 Two-Factor Authentication (2FA)

**Methods Supported**:
1. **TOTP** (Time-based One-Time Password)
   - Apps: Google Authenticator, Authy, Microsoft Authenticator
   - QR code provisioning
   - 6-digit codes, 30-second windows

2. **Email OTP** (Fallback)
   - 6-digit code sent to email
   - Valid for 10 minutes
   - Rate limited: 3 attempts per 5 minutes

3. **Backup Codes**
   - 10 codes generated during 2FA setup
   - Each code single-use
   - Stored encrypted in database

**Flow**:
```
User enters email/password
  ↓
2FA enabled? Check database
  ↓
Yes: Send OTP / Prompt for TOTP
  ↓
User enters OTP
  ↓
Verify code validity
  ↓
Generate JWT if valid
```

### 2.3 JWT Token Management

**Token Structure**:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "seller",
  "iat": 1622486000,
  "exp": 1622489600,
  "iss": "propconnect",
  "aud": "propconnect-api"
}
```

**Token Lifecycle**:
- **Access Token**: 15-minute expiration
- **Refresh Token**: 30-day expiration, stored in Redis
- **Refresh Rotation**: New refresh token on each refresh
- **Blacklisting**: Logout invalidates refresh token immediately

**Implementation**:
```typescript
// JWT signing
const token = jwt.sign(
  { sub: userId, role, email },
  process.env.JWT_SECRET,
  { expiresIn: '15m', issuer: 'propconnect' }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 2.4 Role-Based Access Control (RBAC)

**Roles Hierarchy**:
```
Admin (highest)
  ↓
Broker
  ├─ Seller
  └─ Buyer (lowest)
```

**Permission Matrix**:

| Action | Admin | Broker | Seller | Buyer |
|--------|-------|--------|--------|-------|
| Create Property | Yes | No | Yes | No |
| Verify Documents | Yes | Yes | No | No |
| View All Properties | Yes | Yes | Yes | Yes |
| Delete User | Yes | No | User Only | User Only |
| Access Analytics | Yes | Yes | Own | Own |
| Manage Broker | Yes | Yes | No | No |

**Implementation**:
```typescript
// Guard decorator
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('seller', 'broker')
@Post('properties')
createProperty(@Body() dto: CreatePropertyDto) {
  // Only sellers and brokers can create
}
```

## 3. Data Security

### 3.1 Encryption

**At Rest**:
- AES-256 encryption for sensitive fields in PostgreSQL
  ```sql
  -- Example: Encrypt identity document path
  UPDATE documents 
  SET s3_path = pgp_sym_encrypt(s3_path, 'encryption_key') 
  WHERE document_type = 'identity';
  ```

- AWS S3 Server-Side Encryption (SSE-S3)
- Encryption keys rotated annually
- Key management via AWS KMS

**In Transit**:
- HTTPS/TLS 1.3 for all API communication
- WSS (WebSocket Secure) for real-time messaging
- Certificate pinning for mobile apps (Phase 2)
- HSTS headers enabled (max-age: 1 year)

### 3.2 Document Storage

**AWS S3 Configuration**:
```json
{
  "ServerSideEncryptionConfiguration": [
    {
      "Rules": [
        {
          "ApplyServerSideEncryptionByDefault": {
            "SSEAlgorithm": "AES256"
          }
        }
      ]
    }
  ],
  "PublicAccessBlockConfiguration": {
    "BlockPublicAcls": true,
    "BlockPublicPolicy": true,
    "IgnorePublicAcls": true,
    "RestrictPublicBuckets": true
  }
}
```

**Access Control**:
- Pre-signed URLs with 1-hour expiration for downloads
- Upload restricted to authenticated users
- Virus scanning via ClamAV on upload
- File type validation (whitelist only)

### 3.3 API Security

#### Input Validation
```typescript
// Example validation
import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(12)
  @MaxLength(128)
  password: string;
}
```

#### SQL Injection Prevention
- Prepared statements (parameterized queries)
- ORM layer (TypeORM) prevents direct SQL construction
- Query validation before execution

#### Cross-Site Scripting (XSS) Prevention
- Input sanitization with DOMPurify
- Content Security Policy (CSP) headers
- Output encoding in templates

#### Cross-Site Request Forgery (CSRF) Prevention
- CSRF tokens in forms
- SameSite cookie attribute set to 'Strict'
- Verify origin/referer headers

### 3.4 API Rate Limiting

**Strategy**: Token bucket algorithm

**Limits**:
```typescript
// Unauthenticated: 10 req/min per IP
// Authenticated: 100 req/min per user
// Broker: 500 req/min
// Admin: Unlimited

const rateLimitConfig = {
  unauthenticated: { windowMs: 60000, max: 10 },
  authenticated: { windowMs: 60000, max: 100 },
  broker: { windowMs: 60000, max: 500 },
};
```

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1622486400
Retry-After: 45
```

## 4. Compliance

### 4.1 Italian Real Estate Regulations

**Law 39/1989** (Agenti Immobiliari)
- PropConnect operates as certified marketplace
- Broker roles comply with DUEMILA requirements
- Commission tracking and reporting compliant

**Italian Tax Code (Codice Civile)**
- Transaction documentation requirements met
- Capital gains reporting compliant
- Agency fee treatment correct

### 4.2 Anti-Money Laundering (AML)

**KYC Process**:
1. Identity verification (photographic ID)
2. Address verification (proof of residence)
3. Source of funds declaration
4. Beneficial ownership identification
5. PEP (Politically Exposed Person) screening

**Ongoing Monitoring**:
- Flag large transactions (>€10,000)
- Unusual transaction patterns detected
- Quarterly compliance reviews
- SAR (Suspicious Activity Reports) to authorities if needed

**Implementation**:
```typescript
// KYC verification workflow
async function verifyKYC(userId: string) {
  const documents = await getDocuments(userId);
  
  // 1. Verify identity
  const identity = await verifyIdentity(documents);
  
  // 2. Check PEP list
  const isPEP = await checkPEPList(identity);
  if (isPEP) throw new ComplianceError('User flagged as PEP');
  
  // 3. Address verification
  const address = await verifyAddress(documents);
  
  // 4. Record verification
  await recordVerification(userId, { identity, address, isPEP });
}
```

### 4.3 Consumer Protection

**Italian Consumer Code** (D. Lgs. 206/2005)
- Clear terms and conditions
- Right to withdraw (14 days for certain services)
- Dispute resolution procedures
- Transparent pricing

**Online Dispute Resolution (ODR)**
- EU ODR platform integration
- Internal complaints handling
- Response within 30 days

## 5. Infrastructure Security

### 5.1 Network Security

**WAF (Web Application Firewall)**
- AWS WAF rules enabled
- SQL injection protection
- XSS attack prevention
- DDoS mitigation
- Geographic IP blocking (suspicious regions)

**VPC Configuration**:
- Private subnets for database
- NAT gateway for outbound traffic
- Security groups with least-privilege rules
- Network ACLs for additional filtering

**Example Security Group**:
```
Inbound:
- 443/tcp from 0.0.0.0/0 (HTTPS)
- 80/tcp from CloudFront (HTTP redirect)
- 3306/tcp from app-sg only (MySQL)
- 6379/tcp from app-sg only (Redis)

Outbound:
- All traffic allowed to any
```

### 5.2 Logging & Monitoring

**Application Logs**:
- CloudWatch for centralized logging
- Structured JSON logs
- Log retention: 90 days (production), 30 days (staging)

**Security Events Logged**:
```typescript
// Log security events
logger.security({
  event: 'login_attempt',
  user: userId,
  success: true,
  ip: clientIP,
  userAgent: req.headers['user-agent'],
  timestamp: new Date(),
});

logger.security({
  event: 'document_access',
  actor: brokerId,
  resource: documentId,
  action: 'view',
  timestamp: new Date(),
});
```

**Metrics**:
- Failed login attempts (alert if > 5 per minute)
- Unauthorized access attempts
- API error rates
- Database connection anomalies

### 5.3 Incident Response

**Response Plan**:
1. **Detection**: Automated alerts from monitoring
2. **Containment**: Isolate affected systems
3. **Investigation**: Analyze logs and traces
4. **Remediation**: Fix vulnerabilities
5. **Communication**: Notify users if data exposed
6. **Review**: Post-incident analysis

**Notification Timeline**:
- Critical incidents: User notification within 72 hours
- Data breach: Notify authorities within 72 hours
- Non-critical: Document for review

## 6. Vulnerability Management

### 6.1 Dependency Scanning

```bash
# Regular scanning
npm audit
snyk test
dependabot integration

# Frequency: Every commit
# Critical vulnerabilities: Emergency patch within 24 hours
```

### 6.2 Penetration Testing

- **Frequency**: Semi-annual (before major releases)
- **Scope**: Full infrastructure, API endpoints, frontend
- **Remediation**: Fix critical/high within 2 weeks
- **Documentation**: Pentest report archived

### 6.3 Security Headers

```typescript
// Implemented headers
app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 7. Backup & Disaster Recovery

### 7.1 Backup Strategy

**Database**:
- Automated daily backups
- 30-day retention
- Multi-region replication
- Point-in-time recovery capability

**Documents (S3)**:
- Versioning enabled
- Cross-region replication
- Glacier archival after 90 days

### 7.2 RTO & RPO

- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 1 hour
- Quarterly disaster recovery drills

## 8. Third-Party Security

### 8.2 Vendor Assessment

**Criteria**:
- SOC 2 Type II compliance
- Regular security audits
- Data processing agreements
- Incident notification SLA

**Current Vendors**:
- AWS: SOC 2 certified, DPA signed
- Auth0: SOC 2 certified
- SendGrid: SOC 2 certified

---

**Last Updated**: May 2026  
**Review Cycle**: Quarterly
