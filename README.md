# 🏠 PropConnect

**Piattaforma Digitale per la Compravendita Immobiliare tra Privati**

A professional digital platform designed to facilitate direct real estate transactions between private parties while maintaining certified intermediation and market transparency.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Status](#project-status)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PropConnect is a B2C digital platform that bridges the gap between traditional real estate agencies and peer-to-peer market transactions. It offers:

- **Certified Intermediation**: Professional verification of documents and KYC for all parties
- **Real-time Market Data**: Integrated dashboard with live pricing, trends, and comparable properties
- **Complete Digital Experience**: End-to-end transaction management from listing to signature
- **Security & Compliance**: GDPR-compliant with audit trails and encrypted document storage

### Key Features

1. **User Management & KYC**
   - Multi-role registration (seller, buyer, broker)
   - Automated document verification with OCR
   - Real-time verification status tracking

2. **Property Listings**
   - Rich media uploads (photos, videos, floor plans)
   - Technical documentation (cadastral maps, APE, energy certificates)
   - Interactive geolocation mapping
   - Multi-stage publication workflow

3. **Document Verification**
   - Broker dashboard with prioritized verification queue
   - Checklist system by property type
   - Automated notifications for missing/non-compliant documents
   - Complete audit trail

4. **Certified Communication**
   - Messaging activated only after dual verification
   - Immutable conversation history
   - In-chat document sharing with digital signatures
   - Automatic inactivity and deadline alerts

5. **Market Data Dashboard**
   - Price analytics by zone and timeframe
   - Property comparables and market liquidity index
   - AI-powered property valuation estimates
   - Exportable PDF reports

## 📊 Project Status

**Version**: 1.0 — Draft  
**Last Updated**: May 2026  
**Status**: In development — Internal review

### Development Phases

- **Phase 1** (Months 1–4): MVP Web App ⏳ Current
- **Phase 2** (Months 5–8): Advanced Features
- **Phase 3** (Months 9–14): Native Mobile Apps
- **Phase 4** (Months 15+): Scaling & Monetization

## 🛠 Technology Stack

### Frontend

- **React.js** 18+ with TypeScript
- **Tailwind CSS** for responsive styling
- **Redux Toolkit** for state management
- **Vite** for fast build tooling
- **Vitest** & **React Testing Library** for testing

### Backend

- **Node.js** (LTS) with Express.js / NestJS
- **TypeScript** for type safety
- **PostgreSQL** for relational data
- **Redis** for caching and sessions
- **JWT & OAuth2** for authentication
- **AWS S3** for secure document storage

### DevOps & CI/CD

- **Docker** containerization
- **Kubernetes** orchestration
- **GitHub Actions** for automated deployment
- **AWS** or **GCP** cloud infrastructure

### Testing & Quality

- **Jest** for unit testing
- **Cypress** for E2E testing
- **ESLint** & **Prettier** for code quality
- **OWASP ZAP** for security scanning

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 3.0.0
- PostgreSQL >= 14
- Redis >= 7.0
- Docker (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GeroldTatiagoum/PropConnect.git
   cd PropConnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**

   ```bash
   # Backend
   npm run dev:backend

   # Frontend (in another terminal)
   npm run dev:frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

### Docker Setup

```bash
docker-compose up -d
```

## 📁 Project Structure

```
PropConnect/
├── docs/
│   ├── ARCHITECTURE.md          # System architecture & design patterns
│   ├── API.md                   # API documentation & endpoints
│   ├── DATABASE.md              # Database schema & migrations
│   ├── SECURITY.md              # Security guidelines & best practices
│   ├── GDPR_COMPLIANCE.md       # Privacy & compliance documentation
│   └── DEPLOYMENT.md            # Deployment guides & environments
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration management
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── properties/
│   │   │   ├── verification/
│   │   │   ├── messaging/
│   │   │   └── marketplace/
│   │   ├── shared/              # Shared utilities & middleware
│   │   ├── database/            # Database setup & migrations
│   │   └── main.ts              # Application entry point
│   ├── tests/
│   ├── docker/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Route pages
│   │   ├── stores/              # Redux state management
│   │   ├── services/            # API client services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   └── App.tsx              # Main App component
│   ├── tests/
│   ├── public/
│   └── package.json
├── docker-compose.yml
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # CI pipeline
│   │   └── deploy.yml           # CD pipeline
│   └── ISSUE_TEMPLATE/
├── .env.example
├── .gitignore
└── README.md
```

## 🛣 Development Roadmap

### Phase 1: MVP Web App (Months 1–4)

- [x] Project initialization & setup
- [ ] Backend architecture & database schema
- [ ] User registration & authentication
- [ ] KYC document upload & verification
- [ ] Property listing creation & management
- [ ] Broker verification dashboard
- [ ] Certified messaging system

### Phase 2: Advanced Features (Months 5–8)

- [ ] Market data dashboard & analytics
- [ ] Property valuation algorithm
- [ ] Email & push notifications
- [ ] Digital document signatures
- [ ] External data source integrations

### Phase 3: Mobile Apps (Months 9–14)

- [ ] React Native codebase setup
- [ ] iOS app development & deployment
- [ ] Android app development & deployment
- [ ] Mobile-specific features (geolocation, camera)

### Phase 4: Scale & Monetization (Months 15+)

- [ ] Premium subscription features
- [ ] Geographic expansion strategy
- [ ] Broker partner program
- [ ] AI-powered matching algorithms

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design & component interactions
- **[API.md](./docs/API.md)** - Complete API reference & integration guide
- **[DATABASE.md](./docs/DATABASE.md)** - Schema design & migration procedures
- **[SECURITY.md](./docs/SECURITY.md)** - Security protocols & best practices
- **[GDPR_COMPLIANCE.md](./docs/GDPR_COMPLIANCE.md)** - Privacy & regulatory compliance
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Environment setup & deployment procedures

## 🤝 Contributing

We welcome contributions from team members. Please follow these guidelines:

### Branch Convention

- Feature: `feature/description`
- Bugfix: `bugfix/description`
- Docs: `docs/description`
- Development: `env/svil`

### Commit Convention

```
<type>: <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### Pull Request Process

1. Create a feature branch from `env/svil`
2. Make atomic, well-documented commits
3. Submit PR with clear description
4. Ensure all tests pass & code quality checks succeed
5. Request review from at least one team member
6. Merge after approval

## 🔒 Security

This project follows strict security practices:

- Regular security audits and penetration testing
- OWASP Top 10 compliance
- End-to-end encryption for sensitive data
- Complete audit trails for all operations
- Regular dependency updates and vulnerability scanning

For security concerns, please refer to [SECURITY.md](./docs/SECURITY.md)

## 📋 License

PropConnect is proprietary software. All rights reserved. Unauthorized copying or distribution is prohibited.

---

**PropConnect — Internal Use Only — v1.0 — May 2026**

For questions or issues, please contact the development team.
