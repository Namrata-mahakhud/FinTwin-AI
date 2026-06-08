# ICA Service Layer Pattern

## Overview

The Service Layer pattern separates business logic from API routes and data access, following ICA architecture principles.

## Structure

```
backend/src/
├── api/              # API Routes (thin layer)
├── services/         # Business Logic (thick layer)
├── models/           # Data Models
└── middleware/       # Cross-cutting concerns
```

## Implementation Guidelines

### 1. API Layer (Routes)

**Responsibility**: Handle HTTP requests/responses, validation, and error handling

```typescript
// api/v1/scenarios/index.ts
import { FastifyInstance } from 'fastify';
import { scenarioService } from '../../../services/scenario.service';

export default async function scenarioRoutes(fastify: FastifyInstance) {
  fastify.post('/scenarios', async (request, reply) => {
    const scenario = await scenarioService.createScenario(request.body);
    return reply.code(201).send(scenario);
  });
}
```

### 2. Service Layer

**Responsibility**: Business logic, orchestration, and domain rules

```typescript
// services/scenario.service.ts
export class ScenarioService {
  async createScenario(data: CreateScenarioDto): Promise<Scenario> {
    // Validate business rules
    this.validateScenarioData(data);

    // Apply domain logic
    const scenario = await this.scenarioModel.create(data);

    // Trigger side effects
    await this.notificationService.notifyScenarioCreated(scenario);

    return scenario;
  }
}
```

### 3. Model Layer

**Responsibility**: Data structure and database operations

```typescript
// models/scenario.model.ts
export const ScenarioSchema = new Schema({
  name: { type: String, required: true },
  eventType: { type: String, enum: EVENT_TYPES },
  // ... other fields
});
```

## Benefits

1. **Separation of Concerns**: Clear boundaries between layers
2. **Testability**: Easy to unit test business logic
3. **Reusability**: Services can be used by multiple routes
4. **Maintainability**: Changes isolated to specific layers
5. **Scalability**: Easy to extract services into microservices

## Best Practices

1. Keep routes thin - delegate to services
2. Services should not know about HTTP
3. Use dependency injection for services
4. Handle errors at the appropriate layer
5. Use DTOs for data transfer between layers
6. Implement proper logging at each layer

## Example Flow

```
Request → Route → Service → Model → Database
                    ↓
                 Agent (if needed)
                    ↓
Response ← Route ← Service ← Model ← Database
```

## Anti-Patterns to Avoid

❌ Business logic in routes
❌ Direct database access from routes
❌ Services depending on HTTP objects
❌ Mixing concerns across layers
❌ Circular dependencies between services

## ICA Compliance Checklist

- [ ] Routes only handle HTTP concerns
- [ ] Business logic in service layer
- [ ] Models only handle data structure
- [ ] Proper error handling at each layer
- [ ] Dependency injection used
- [ ] Comprehensive logging
- [ ] Unit tests for services
- [ ] Integration tests for routes
