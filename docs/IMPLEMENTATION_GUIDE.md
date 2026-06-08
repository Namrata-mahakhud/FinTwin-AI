# FinTwin AI - Implementation Guide

## 📋 Project Overview

**FinTwin AI** is an Autonomous Financial Digital Twin platform built using **Agentic SDLC** principles with **IBM Bob** and **ICA Context Studio** integration.

## 🏗️ Architecture Summary

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js 20 + Fastify + TypeScript
- **Database**: MongoDB 7.0
- **Cache**: Redis 7
- **AI**: Multi-agent orchestration system
- **DevOps**: Docker + GitHub Actions

### ICA Architecture Layers

```
┌─────────────────────────────────────────┐
│   Presentation Layer (React + Vite)     │
├─────────────────────────────────────────┤
│   API Gateway (Fastify + Swagger)       │
├─────────────────────────────────────────┤
│   Service Layer (Business Logic)        │
├─────────────────────────────────────────┤
│   AI Agent Layer (Multi-Agent System)   │
├─────────────────────────────────────────┤
│   Data Layer (MongoDB + Redis)          │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
fintwin-ai/
├── .bob/                          # Bob AI Agent Configuration
│   ├── agents/
│   │   └── code-generation-agent.json
│   └── workflows/
│       └── agentic-sdlc-workflow.yaml
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD Pipeline
├── .ica/                          # ICA Context Studio
│   ├── context/
│   │   └── domain-context.json    # Financial domain knowledge
│   └── patterns/
│       └── service-layer-pattern.md
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth/          # Authentication routes
│   │   │       └── index.ts
│   │   ├── config/
│   │   │   ├── database.ts        # MongoDB connection
│   │   │   ├── environment.ts     # Environment validation
│   │   │   └── logger.ts          # Pino logger
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts # JWT authentication
│   │   │   └── error.middleware.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── scenario.model.ts
│   │   │   ├── portfolio.model.ts
│   │   │   ├── simulation.model.ts
│   │   │   ├── recommendation.model.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── auth.service.ts    # Authentication service
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript types
│   │   ├── utils/
│   │   │   └── jwt.util.ts        # JWT utilities
│   │   └── server.ts              # Main server file
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc.json
├── docker-compose.yml
├── package.json
├── README.md
└── tsconfig.json
```

## 🗄️ Database Models

### 1. User Model

```typescript
{
  email: string(unique, indexed);
  passwordHash: string;
  role: 'ANALYST' | 'RISK_MANAGER' | 'PORTFOLIO_MANAGER' | 'ADMIN';
  firstName: string;
  lastName: string;
  lastLogin: Date;
  preferences: {
    theme: string;
    notifications: boolean;
    defaultCurrency: string;
  }
}
```

### 2. Scenario Model

```typescript
{
  name: string
  description: string
  eventType: 'INTEREST_RATE_CHANGE' | 'INFLATION_CHANGE' | ...
  parameters: {
    changePercent: number
    duration: string
    affectedRegions: string[]
    severity: string
  }
  targetDate: Date
  createdBy: ObjectId (ref: User)
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
}
```

### 3. Portfolio Model

```typescript
{
  name: string
  userId: ObjectId (ref: User)
  totalValue: number
  riskAppetite: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
  currency: string
  assets: [{
    assetType: string
    symbol: string
    quantity: number
    allocationPercent: number
    currentValue: number
  }]
}
```

### 4. Simulation Model

```typescript
{
  scenarioId: ObjectId (ref: Scenario)
  portfolioId: ObjectId (ref: Portfolio)
  executedAt: Date
  completedAt: Date
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  duration: number
  configuration: {
    timeHorizon: string
    granularity: string
    includeSecondaryEffects: boolean
  }
  summary: {
    totalImpact: number
    riskScore: number
    affectedSectors: string[]
  }
  results: [{
    sector: string
    impactPercent: number
    profitLoss: number
    riskScore: number
    marketReaction: object
  }]
}
```

### 5. Recommendation Model

```typescript
{
  simulationId: ObjectId (ref: Simulation)
  agentType: 'MARKET' | 'RISK' | 'RECOMMENDATION' | 'REPORT'
  category: 'RISK_MITIGATION' | 'PORTFOLIO_REBALANCE' | ...
  recommendation: string
  priority: number (1-10)
  reasoning: {
    analysis: string
    confidence: number (0-1)
    supportingData: object
  }
}
```

## 🔐 Authentication System

### JWT Implementation

- **Access Token**: 7 days expiry
- **Refresh Token**: 30 days expiry
- **Algorithm**: HS256
- **Storage**: Client-side (localStorage/sessionStorage)

### API Endpoints

#### POST /api/v1/auth/register

Register a new user

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ANALYST"
}
```

#### POST /api/v1/auth/login

Login user

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### POST /api/v1/auth/refresh

Refresh access token

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET /api/v1/auth/profile

Get current user profile (requires authentication)

#### PUT /api/v1/auth/profile

Update user profile (requires authentication)

#### POST /api/v1/auth/logout

Logout user (requires authentication)

### Role-Based Access Control (RBAC)

| Role                  | Permissions                                         |
| --------------------- | --------------------------------------------------- |
| **ANALYST**           | Create scenarios, view simulations, basic analytics |
| **RISK_MANAGER**      | All analyst permissions + risk management features  |
| **PORTFOLIO_MANAGER** | All analyst permissions + portfolio management      |
| **ADMIN**             | Full system access + user management                |

## 🚀 Getting Started

### Prerequisites

```bash
node >= 20.0.0
npm >= 10.0.0
MongoDB >= 6.0
Redis >= 7.0 (optional)
Docker & Docker Compose (optional)
```

### Installation Steps

1. **Clone and Install**

```bash
git clone <repository-url>
cd fintwin-ai
npm install
```

2. **Environment Setup**

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT (min 32 characters)
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `CORS_ORIGIN`: Frontend URL

3. **Start with Docker (Recommended)**

```bash
npm run docker:up
```

4. **Start Manually**

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1/health

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/              # Unit tests for services, utils
├── integration/       # API integration tests
└── e2e/              # End-to-end tests
```

## 🤖 Agentic SDLC Workflow

### Bob AI Agents

1. **Code Generation Agent**: Generates ICA-compliant code
2. **Testing Agent**: Creates comprehensive test suites
3. **Review Agent**: Performs code quality checks
4. **Deployment Agent**: Automates deployment pipeline

### Workflow Phases

1. **Requirements Analysis** → ICA Context Studio
2. **Design** → Architecture + API specs
3. **Code Generation** → Bob generates code
4. **Testing** → Automated test execution
5. **Code Review** → Quality gates
6. **Documentation** → Auto-generated docs
7. **Deployment** → CI/CD pipeline
8. **Monitoring** → Performance tracking

## 📊 CI/CD Pipeline

### GitHub Actions Workflow

- **Lint**: ESLint + Prettier
- **Test**: Unit + Integration tests
- **Build**: TypeScript compilation
- **Security**: npm audit + Snyk scan
- **Docker**: Build and test images

### Quality Gates

- ✅ Lint pass
- ✅ Type check pass
- ✅ Test coverage >= 80%
- ✅ Security scan pass
- ✅ ICA compliance check

## 🔒 Security Best Practices

1. **Authentication**: JWT with secure secrets
2. **Password Hashing**: bcrypt with salt rounds
3. **Rate Limiting**: 100 requests per 15 minutes
4. **CORS**: Configured for specific origins
5. **Helmet**: Security headers enabled
6. **Input Validation**: Zod schema validation
7. **SQL Injection**: Mongoose parameterized queries
8. **XSS Protection**: Content Security Policy

## 📈 Performance Optimization

1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Redis Caching**: Cache frequently accessed data
3. **Connection Pooling**: MongoDB connection pool (5-10 connections)
4. **Lazy Loading**: Frontend code splitting
5. **Compression**: Gzip enabled
6. **CDN**: Static assets served via CDN (production)

## 🐛 Troubleshooting

### Common Issues

**TypeScript Errors**

```bash
# Install dependencies first
npm install
```

**MongoDB Connection Failed**

```bash
# Check MongoDB is running
mongod --version
# Verify connection string in .env
```

**Port Already in Use**

```bash
# Change port in .env
PORT=3001
```

**Docker Issues**

```bash
# Clean and rebuild
npm run docker:down
docker system prune -a
npm run docker:up
```

## 📚 Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [ICA Architecture Patterns](./ica/patterns/)
- [API Documentation](http://localhost:3000/api/docs)

## 🤝 Contributing

1. Follow ICA architecture principles
2. Use Bob for code generation
3. Write tests for new features
4. Update documentation
5. Follow conventional commits

## 📝 License

MIT License - see LICENSE file for details

---

**Built with Agentic SDLC** 🤖 | **Powered by IBM Bob & ICA Context Studio** 🚀
