# FinTwin API Contracts

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints (except auth endpoints) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Scenario Service

### 1.1 Create Scenario
**POST** `/scenarios`

**Request Body:**
```json
{
  "name": "string (required, 3-100 chars)",
  "description": "string (optional, max 500 chars)",
  "type": "string (required, enum: ['market_crash', 'bull_market', 'recession', 'inflation', 'custom'])",
  "parameters": {
    "marketVolatility": "number (0-100)",
    "interestRateChange": "number (-10 to 10)",
    "inflationRate": "number (0-20)",
    "gdpGrowth": "number (-10 to 10)",
    "customFactors": "object (optional)"
  },
  "duration": "number (required, days: 1-365)",
  "startDate": "string (ISO date, optional, defaults to now)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "type": "string",
    "parameters": "object",
    "duration": "number",
    "startDate": "string",
    "status": "draft",
    "createdBy": "string (userId)",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

### 1.2 Get All Scenarios
**GET** `/scenarios?page=1&limit=10&type=market_crash&status=active`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)
- `type`: string (optional filter)
- `status`: string (optional filter: draft, active, completed, archived)
- `search`: string (optional, searches name and description)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "scenarios": ["array of scenario objects"],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 1.3 Get Scenario by ID
**GET** `/scenarios/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "type": "string",
    "parameters": "object",
    "duration": "number",
    "startDate": "string",
    "status": "string",
    "simulations": ["array of simulation IDs"],
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 1.4 Update Scenario
**PUT** `/scenarios/:id`

**Request Body:** (same as create, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "...updated scenario object"
  }
}
```

### 1.5 Delete Scenario
**DELETE** `/scenarios/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Scenario deleted successfully"
}
```

### 1.6 Run Scenario Simulation
**POST** `/scenarios/:id/simulate`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "iterations": "number (optional, default: 1000, max: 10000)"
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "simulationId": "string",
    "status": "processing",
    "estimatedCompletionTime": "string (ISO date)"
  }
}
```

---

## 2. Market Engine

### 2.1 Get Market Data
**GET** `/market/data?symbols=AAPL,GOOGL&period=1y`

**Query Parameters:**
- `symbols`: string (required, comma-separated)
- `period`: string (required: 1d, 5d, 1m, 3m, 6m, 1y, 5y)
- `interval`: string (optional: 1m, 5m, 15m, 1h, 1d)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "currentPrice": 150.25,
      "change": 2.5,
      "changePercent": 1.69,
      "volume": 50000000,
      "marketCap": 2500000000000,
      "historicalData": [
        {
          "date": "string",
          "open": "number",
          "high": "number",
          "low": "number",
          "close": "number",
          "volume": "number"
        }
      ]
    }
  }
}
```

### 2.2 Get Market Indicators
**GET** `/market/indicators?symbols=AAPL,GOOGL`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "AAPL": {
      "symbol": "AAPL",
      "indicators": {
        "rsi": 65.5,
        "macd": {
          "value": 1.2,
          "signal": 0.8,
          "histogram": 0.4
        },
        "movingAverages": {
          "sma20": 148.5,
          "sma50": 145.2,
          "sma200": 140.8
        },
        "bollingerBands": {
          "upper": 155.0,
          "middle": 150.0,
          "lower": 145.0
        }
      }
    }
  }
}
```

### 2.3 Simulate Market Conditions
**POST** `/market/simulate`

**Request Body:**
```json
{
  "scenarioId": "string (required)",
  "symbols": ["array of strings (required)"],
  "startDate": "string (ISO date, required)",
  "endDate": "string (ISO date, required)",
  "parameters": {
    "volatility": "number",
    "trend": "string (bullish, bearish, neutral)",
    "correlations": "object (optional)"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "simulationId": "string",
    "projections": {
      "AAPL": [
        {
          "date": "string",
          "projectedPrice": "number",
          "confidence": "number (0-1)",
          "range": {
            "low": "number",
            "high": "number"
          }
        }
      ]
    }
  }
}
```

### 2.4 Get Market Volatility
**GET** `/market/volatility?period=30d`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overall": {
      "vix": 18.5,
      "historicalVolatility": 22.3,
      "impliedVolatility": 20.1
    },
    "sectors": {
      "technology": 25.5,
      "finance": 18.2,
      "healthcare": 15.8
    }
  }
}
```

---

## 3. Portfolio Service

### 3.1 Create Portfolio
**POST** `/portfolios`

**Request Body:**
```json
{
  "name": "string (required, 3-100 chars)",
  "description": "string (optional)",
  "initialValue": "number (required, > 0)",
  "currency": "string (default: USD)",
  "holdings": [
    {
      "symbol": "string (required)",
      "quantity": "number (required, > 0)",
      "purchasePrice": "number (required, > 0)",
      "purchaseDate": "string (ISO date, required)"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "initialValue": "number",
    "currentValue": "number",
    "currency": "string",
    "holdings": ["array"],
    "performance": {
      "totalReturn": "number",
      "totalReturnPercent": "number",
      "dayChange": "number",
      "dayChangePercent": "number"
    },
    "createdBy": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 3.2 Get All Portfolios
**GET** `/portfolios?page=1&limit=10`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolios": ["array of portfolio objects"],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 3.3 Get Portfolio by ID
**GET** `/portfolios/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "...portfolio object with detailed holdings"
  }
}
```

### 3.4 Update Portfolio
**PUT** `/portfolios/:id`

**Request Body:** (same as create, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "...updated portfolio object"
  }
}
```

### 3.5 Delete Portfolio
**DELETE** `/portfolios/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

### 3.6 Add Holding
**POST** `/portfolios/:id/holdings`

**Request Body:**
```json
{
  "symbol": "string (required)",
  "quantity": "number (required, > 0)",
  "purchasePrice": "number (required, > 0)",
  "purchaseDate": "string (ISO date, required)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "...updated portfolio object"
  }
}
```

### 3.7 Update Holding
**PUT** `/portfolios/:id/holdings/:holdingId`

**Request Body:**
```json
{
  "quantity": "number (optional)",
  "purchasePrice": "number (optional)",
  "purchaseDate": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "...updated portfolio object"
  }
}
```

### 3.8 Remove Holding
**DELETE** `/portfolios/:id/holdings/:holdingId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "...updated portfolio object"
  }
}
```

### 3.9 Get Portfolio Performance
**GET** `/portfolios/:id/performance?period=1y`

**Query Parameters:**
- `period`: string (1d, 1w, 1m, 3m, 6m, 1y, all)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "period": "string",
    "metrics": {
      "totalReturn": "number",
      "totalReturnPercent": "number",
      "annualizedReturn": "number",
      "volatility": "number",
      "sharpeRatio": "number",
      "maxDrawdown": "number",
      "beta": "number",
      "alpha": "number"
    },
    "historicalValues": [
      {
        "date": "string",
        "value": "number",
        "return": "number"
      }
    ]
  }
}
```

---

## 4. Risk Engine

### 4.1 Calculate Portfolio Risk
**POST** `/risk/calculate`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "scenarioId": "string (optional)",
  "timeHorizon": "number (days, default: 30)",
  "confidenceLevel": "number (0-1, default: 0.95)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "calculatedAt": "string",
    "metrics": {
      "valueAtRisk": {
        "var95": "number",
        "var99": "number",
        "cvar95": "number"
      },
      "volatility": "number",
      "beta": "number",
      "sharpeRatio": "number",
      "maxDrawdown": "number",
      "concentrationRisk": "number"
    },
    "riskBreakdown": {
      "marketRisk": "number",
      "specificRisk": "number",
      "currencyRisk": "number",
      "liquidityRisk": "number"
    },
    "holdingRisks": [
      {
        "symbol": "string",
        "contribution": "number",
        "volatility": "number",
        "beta": "number"
      }
    ]
  }
}
```

### 4.2 Get Risk Heatmap
**GET** `/risk/heatmap/:portfolioId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "heatmap": [
      {
        "symbol": "string",
        "riskScore": "number (0-100)",
        "category": "string (low, medium, high, critical)",
        "factors": {
          "volatility": "number",
          "concentration": "number",
          "correlation": "number",
          "liquidity": "number"
        }
      }
    ],
    "overallRiskScore": "number (0-100)",
    "riskDistribution": {
      "low": "number (count)",
      "medium": "number",
      "high": "number",
      "critical": "number"
    }
  }
}
```

### 4.3 Stress Test Portfolio
**POST** `/risk/stress-test`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "scenarios": [
    {
      "name": "string",
      "type": "string",
      "shocks": {
        "marketDrop": "number (percent)",
        "volatilityIncrease": "number (percent)",
        "correlationChange": "number"
      }
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "baselineValue": "number",
    "results": [
      {
        "scenarioName": "string",
        "projectedValue": "number",
        "loss": "number",
        "lossPercent": "number",
        "recoveryTime": "number (days)",
        "impactedHoldings": [
          {
            "symbol": "string",
            "impact": "number"
          }
        ]
      }
    ]
  }
}
```

### 4.4 Get Risk Alerts
**GET** `/risk/alerts/:portfolioId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "alerts": [
      {
        "id": "string",
        "severity": "string (info, warning, critical)",
        "type": "string (concentration, volatility, drawdown, correlation)",
        "message": "string",
        "affectedHoldings": ["array of symbols"],
        "threshold": "number",
        "currentValue": "number",
        "createdAt": "string"
      }
    ]
  }
}
```

---

## 5. Recommendation Engine

### 5.1 Get Portfolio Recommendations
**GET** `/recommendations/:portfolioId?type=all`

**Query Parameters:**
- `type`: string (all, rebalance, diversify, risk_reduction, optimization)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "generatedAt": "string",
    "recommendations": [
      {
        "id": "string",
        "type": "string",
        "priority": "string (low, medium, high)",
        "title": "string",
        "description": "string",
        "rationale": "string",
        "expectedImpact": {
          "returnImprovement": "number (percent)",
          "riskReduction": "number (percent)",
          "diversificationScore": "number"
        },
        "actions": [
          {
            "action": "string (buy, sell, hold)",
            "symbol": "string",
            "quantity": "number",
            "targetAllocation": "number (percent)"
          }
        ],
        "confidence": "number (0-1)"
      }
    ],
    "summary": {
      "totalRecommendations": "number",
      "highPriority": "number",
      "estimatedImpact": "string"
    }
  }
}
```

### 5.2 Generate Rebalancing Plan
**POST** `/recommendations/rebalance`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "targetAllocation": {
    "stocks": "number (percent)",
    "bonds": "number (percent)",
    "cash": "number (percent)",
    "alternatives": "number (percent)"
  },
  "constraints": {
    "maxTurnover": "number (percent, optional)",
    "minTradeSize": "number (optional)",
    "taxOptimization": "boolean (optional)"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolioId": "string",
    "currentAllocation": "object",
    "targetAllocation": "object",
    "rebalancingPlan": [
      {
        "symbol": "string",
        "action": "string (buy, sell)",
        "currentShares": "number",
        "targetShares": "number",
        "sharesToTrade": "number",
        "estimatedCost": "number",
        "taxImpact": "number"
      }
    ],
    "summary": {
      "totalTrades": "number",
      "estimatedCost": "number",
      "estimatedTaxImpact": "number",
      "turnoverPercent": "number"
    }
  }
}
```

### 5.3 Get Asset Suggestions
**POST** `/recommendations/suggest-assets`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "criteria": {
    "riskTolerance": "string (conservative, moderate, aggressive)",
    "investmentHorizon": "number (years)",
    "sectors": ["array of strings (optional)"],
    "excludeSymbols": ["array of strings (optional)"]
  },
  "limit": "number (default: 10, max: 50)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "symbol": "string",
        "name": "string",
        "sector": "string",
        "currentPrice": "number",
        "score": "number (0-100)",
        "rationale": "string",
        "metrics": {
          "expectedReturn": "number",
          "volatility": "number",
          "sharpeRatio": "number",
          "correlationWithPortfolio": "number"
        },
        "suggestedAllocation": "number (percent)"
      }
    ]
  }
}
```

### 5.4 Apply Recommendation
**POST** `/recommendations/:recommendationId/apply`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "executeImmediately": "boolean (default: false)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendationId": "string",
    "status": "string (pending, executed)",
    "executionDetails": {
      "tradesExecuted": "number",
      "totalCost": "number",
      "updatedPortfolio": "object"
    }
  }
}
```

---

## 6. Report Service

### 6.1 Generate Portfolio Report
**POST** `/reports/portfolio`

**Request Body:**
```json
{
  "portfolioId": "string (required)",
  "reportType": "string (required: summary, detailed, performance, risk, tax)",
  "period": "string (required: 1m, 3m, 6m, 1y, ytd, all)",
  "format": "string (default: json, options: json, pdf, csv)",
  "includeCharts": "boolean (default: true)",
  "sections": ["array of strings (optional)"]
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "status": "generating",
    "estimatedCompletionTime": "string (ISO date)"
  }
}
```

### 6.2 Get Report Status
**GET** `/reports/:reportId/status`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "status": "string (generating, completed, failed)",
    "progress": "number (0-100)",
    "downloadUrl": "string (if completed)",
    "error": "string (if failed)"
  }
}
```

### 6.3 Download Report
**GET** `/reports/:reportId/download`

**Response (200):**
- Content-Type: application/pdf or application/json or text/csv
- Binary file or JSON data

### 6.4 Get Report History
**GET** `/reports/history?portfolioId=xxx&page=1&limit=10`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "string",
        "portfolioId": "string",
        "reportType": "string",
        "period": "string",
        "format": "string",
        "status": "string",
        "createdAt": "string",
        "downloadUrl": "string"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 6.5 Generate Simulation Report
**POST** `/reports/simulation`

**Request Body:**
```json
{
  "simulationId": "string (required)",
  "format": "string (default: json)",
  "includeCharts": "boolean (default: true)"
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "status": "generating"
  }
}
```

### 6.6 Generate Comparison Report
**POST** `/reports/comparison`

**Request Body:**
```json
{
  "portfolioIds": ["array of strings (required, 2-5 portfolios)"],
  "metrics": ["array of strings (optional)"],
  "period": "string (required)",
  "format": "string (default: json)"
}
```

**Response (202):**
```json
{
  "success": true,
  "data": {
    "reportId": "string",
    "status": "generating"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Resource already exists or conflict detected"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_LOGIC_ERROR",
    "message": "Business logic validation failed",
    "details": "string"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": "number (seconds)"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "string"
  }
}
```

---

## Rate Limiting

- Standard endpoints: 100 requests per minute per user
- Simulation endpoints: 10 requests per minute per user
- Report generation: 5 requests per minute per user

Rate limit headers included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering and Sorting

List endpoints support:
- `sort`: Field to sort by (prefix with `-` for descending)
- `filter[field]`: Filter by field value
- `search`: Full-text search (where applicable)

Example:
```
GET /portfolios?sort=-createdAt&filter[currency]=USD&search=retirement