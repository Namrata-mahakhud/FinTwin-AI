# FinTwin Backend Architecture

## Overview

Node.js + Fastify + MongoDB backend architecture with modular service design.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Fastify
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Authentication**: JWT
- **Logging**: Pino (via Fastify)

## Architecture Layers

### 1. API Layer (Controllers)

- Handle HTTP requests/responses
- Input validation
- Route definitions
- Response formatting

### 2. Service Layer

- Business logic implementation
- Data transformation
- External service integration
- Transaction management

### 3. Repository Layer

- Database operations
- Query building
- Data access abstraction
- Model interactions

### 4. Model Layer

- MongoDB schemas
- Data validation
- Relationships
- Indexes

## Project Structure

```
backend/
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── scenarios/          # Scenario endpoints
│   │       ├── market/             # Market data endpoints
│   │       ├── portfolios/         # Portfolio endpoints
│   │       ├── risk/               # Risk analysis endpoints
│   │       ├── recommendations/    # Recommendation endpoints
│   │       └── reports/            # Report endpoints
│   ├── services/
│   │   ├── scenario.service.ts
│   │   ├── market.service.ts
│   │   ├── portfolio.service.ts
│   │   ├── risk.service.ts
│   │   ├── recommendation.service.ts
│   │   └── report.service.ts
│   ├── repositories/
│   │   ├── scenario.repository.ts
│   │   ├── portfolio.repository.ts
│   │   ├── simulation.repository.ts
│   │   └── recommendation.repository.ts
│   ├── models/
│   │   ├── scenario.model.ts
│   │   ├── portfolio.model.ts
│   │   ├── simulation.model.ts
│   │   ├── recommendation.model.ts
│   │   └── user.model.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── utils/
│   │   ├── errors.util.ts
│   │   ├── validation.util.ts
│   │   ├── helpers.util.ts
│   │   └── jwt.util.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── environment.ts
│   │   └── logger.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

## Modules

### 1. Scenario Service

**Purpose**: Manage financial scenarios and simulations

**Responsibilities**:

- Create/update/delete scenarios
- Define scenario parameters
- Trigger simulations
- Store simulation results

**Key Features**:

- Scenario templates (market crash, bull market, recession, etc.)
- Custom scenario builder
- Parameter validation
- Simulation orchestration

### 2. Market Engine

**Purpose**: Fetch and simulate market data

**Responsibilities**:

- Fetch real-time market data
- Calculate technical indicators
- Simulate market conditions
- Project future prices

**Key Features**:

- Market data integration
- Technical analysis (RSI, MACD, Moving Averages, Bollinger Bands)
- Monte Carlo simulations
- Volatility calculations

### 3. Portfolio Service

**Purpose**: Manage investment portfolios

**Responsibilities**:

- CRUD operations for portfolios
- Manage holdings
- Calculate performance metrics
- Track historical values

**Key Features**:

- Multi-portfolio support
- Real-time valuation
- Performance analytics
- Transaction history

### 4. Risk Engine

**Purpose**: Analyze portfolio risk

**Responsibilities**:

- Calculate risk metrics
- Generate risk heatmaps
- Perform stress tests
- Monitor risk alerts

**Key Features**:

- Value at Risk (VaR) calculations
- Conditional VaR (CVaR)
- Beta and volatility analysis
- Concentration risk assessment
- Correlation analysis

### 5. Recommendation Engine

**Purpose**: Generate investment recommendations

**Responsibilities**:

- Analyze portfolio composition
- Generate rebalancing suggestions
- Suggest new assets
- Optimize allocations

**Key Features**:

- AI-powered recommendations
- Rebalancing plans
- Asset suggestions
- Tax optimization
- Risk-adjusted recommendations

### 6. Report Service

**Purpose**: Generate comprehensive reports

**Responsibilities**:

- Create portfolio reports
- Generate simulation reports
- Comparison reports
- Export to multiple formats

**Key Features**:

- PDF/CSV/JSON export
- Customizable templates
- Chart generation
- Scheduled reports

## Shared Components

### Error Handling

- Custom error classes hierarchy
- Standardized error responses
- Error logging
- Operational vs programming errors

### Validation

- Request validation middleware
- Schema-based validation
- Custom validators
- Sanitization

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Token refresh mechanism
- Session management

### Rate Limiting

- Per-user rate limits
- Per-endpoint rate limits
- Configurable windows
- Redis-ready (currently in-memory)

### Logging

- Structured logging with Pino
- Request/response logging
- Error logging
- Performance metrics

## API Design Principles

### RESTful Conventions

- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes
- Pagination
- Filtering and sorting

### Response Format

```json
{
  "success": true,
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": [],
    "requestId": "req_xxx"
  }
}
```

## Database Design

### Collections

#### scenarios

- Scenario definitions
- Parameters
- Status tracking
- User ownership

#### portfolios

- Portfolio metadata
- Holdings array
- Performance cache
- User ownership

#### simulations

- Simulation results
- Scenario reference
- Portfolio reference
- Projections data

#### recommendations

- Recommendation data
- Priority levels
- Actions array
- Confidence scores

#### users

- User credentials
- Profile information
- Preferences
- Roles

### Indexes

- User ID indexes for ownership queries
- Status indexes for filtering
- Date indexes for time-series queries
- Compound indexes for common queries

## Security

### Authentication

- JWT tokens with expiration
- Refresh token rotation
- Password hashing (bcrypt)
- Rate limiting on auth endpoints

### Authorization

- Role-based access control (RBAC)
- Resource ownership validation
- API key support for external integrations

### Data Protection

- Input sanitization
- SQL injection prevention (NoSQL)
- XSS prevention
- CORS configuration

## Performance Optimization

### Caching

- In-memory caching for frequently accessed data
- Redis-ready architecture
- Cache invalidation strategies

### Database

- Proper indexing
- Query optimization
- Connection pooling
- Aggregation pipelines

### API

- Response compression
- Pagination
- Field selection
- Batch operations

## Monitoring & Observability

### Logging

- Request/response logs
- Error logs
- Performance logs
- Audit logs

### Metrics

- Request rate
- Response time
- Error rate
- Database query time

### Health Checks

- Database connectivity
- External service status
- Memory usage
- CPU usage

## Deployment

### Environment Variables

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://...
JWT_SECRET=...
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://...
```

### Docker Support

- Multi-stage builds
- Production-optimized images
- Health checks
- Volume mounts

### Scaling

- Horizontal scaling ready
- Stateless design
- External session storage
- Load balancer compatible

## Testing Strategy

### Unit Tests

- Service layer tests
- Utility function tests
- Validation tests

### Integration Tests

- API endpoint tests
- Database integration tests
- External service mocks

### E2E Tests

- Complete user flows
- Scenario simulations
- Report generation

## Development Workflow

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Pre-commit hooks

### Git Workflow

- Feature branches
- Pull request reviews
- Automated CI/CD
- Semantic versioning

## Future Enhancements

### Planned Features

- WebSocket support for real-time updates
- GraphQL API
- Microservices architecture
- Event-driven architecture
- Message queue integration (RabbitMQ/Kafka)
- Advanced caching with Redis
- Elasticsearch integration for analytics
- Machine learning model integration

### Scalability

- Database sharding
- Read replicas
- CDN integration
- API gateway

## API Documentation

Comprehensive API documentation available in:

- `docs/API_CONTRACTS.md` - Complete API specifications
- Swagger/OpenAPI (to be added)
- Postman collection (to be added)

## Dependencies

### Core

- fastify: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing

### Utilities

- pino: Logging
- dotenv: Environment variables
- joi/zod: Validation (optional)

### Development

- typescript: Type safety
- ts-node: TypeScript execution
- nodemon: Development server
- eslint: Linting
- prettier: Code formatting

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start MongoDB:

   ```bash
   docker-compose up -d mongodb
   ```

4. Run development server:

   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation
4. Follow commit message conventions
5. Create pull requests for review

## License

MIT License - See LICENSE file for details
