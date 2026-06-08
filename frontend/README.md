# FinTwin AI Frontend

Modern React + TypeScript frontend application for FinTwin AI - Autonomous Financial Digital Twin for Market Shock Simulation.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query (React Query v5)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios

## 📁 Project Structure

```
frontend/src/
├── assets/              # Static assets
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Card, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── charts/         # Chart components
│   ├── heatmap/        # Heatmap components
│   └── widgets/        # Business-specific widgets
├── pages/              # Page components
│   ├── Login/
│   ├── Dashboard/
│   ├── ScenarioBuilder/
│   ├── PortfolioAnalysis/
│   ├── RiskHeatmap/
│   ├── SimulationResults/
│   ├── Recommendations/
│   └── Admin/
├── hooks/              # Custom React hooks
├── services/           # API integration layer
│   └── api/           # API service modules
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
├── router/             # Routing configuration
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp ../.env.example .env

# Update .env with your configuration
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_WS_URL=ws://localhost:3000
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🎨 Features

### Pages

1. **Login** - User authentication
2. **Dashboard** - Overview of portfolio and recent activity
3. **Scenario Builder** - Create and manage economic scenarios
4. **Portfolio Analysis** - Analyze portfolio performance and risk
5. **Risk Heatmap** - Visual risk analysis across assets
6. **Simulation Results** - View simulation outcomes and projections
7. **Recommendations** - AI-powered portfolio recommendations
8. **Admin** - System administration (admin only)

### Key Features

- 🔐 **Authentication** - JWT-based authentication with refresh tokens
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Mobile-first responsive layout
- 🔄 **Real-time Updates** - WebSocket support for live data
- 📊 **Interactive Charts** - Rich data visualizations
- 🔥 **Risk Heatmaps** - Visual risk analysis
- 💾 **State Persistence** - Local storage for user preferences
- 🚀 **Code Splitting** - Lazy loading for optimal performance
- 🔍 **Type Safety** - Full TypeScript coverage

## 🏗️ Architecture

### Component Architecture

- **Atomic Design**: Components organized by complexity
- **Composition**: Build complex UIs from simple components
- **Props Interface**: Well-defined TypeScript interfaces
- **Error Boundaries**: Graceful error handling

### State Management

#### Zustand Stores

- `authStore` - User authentication and session
- `uiStore` - UI state (theme, sidebar, notifications)
- `scenarioStore` - Scenario management (to be implemented)
- `portfolioStore` - Portfolio data (to be implemented)
- `simulationStore` - Simulation state (to be implemented)

#### React Query

- Server state caching and synchronization
- Automatic refetching and background updates
- Optimistic updates for better UX

### API Integration

All API calls are centralized in the `services/api` directory:

- `client.ts` - Axios client with interceptors
- `auth.api.ts` - Authentication endpoints
- `scenarios.api.ts` - Scenario management
- `portfolio.api.ts` - Portfolio operations
- `simulation.api.ts` - Simulation execution

### Routing

- **Public Routes**: Login, Register
- **Protected Routes**: All authenticated pages
- **Role-based Access**: Admin-only routes
- **Lazy Loading**: Code splitting for better performance

## 🎯 Development Guidelines

### Code Style

- Use functional components with hooks
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Write meaningful commit messages

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types**: PascalCase (e.g., `User`, `Portfolio`)

### File Organization

- One component per file
- Co-locate related files (component + styles + tests)
- Use index.ts for clean imports
- Keep files under 300 lines

## 🔧 Configuration

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=FinTwin AI
```

### Tailwind Configuration

Custom theme configuration in `tailwind.config.js`:
- Primary colors: Blue gradient
- Secondary colors: Purple gradient
- Custom breakpoints
- Extended spacing and typography

### Vite Configuration

- Path aliases (@/ for src/)
- Proxy configuration for API
- Build optimization
- Code splitting strategy

## 📚 API Documentation

### Authentication

```typescript
// Login
POST /api/v1/auth/login
Body: { email: string, password: string }
Response: { user: User, accessToken: string, refreshToken: string }

// Get current user
GET /api/v1/auth/me
Headers: { Authorization: 'Bearer <token>' }
Response: { user: User }
```

### Scenarios

```typescript
// Get all scenarios
GET /api/v1/scenarios
Response: { data: Scenario[], pagination: Pagination }

// Create scenario
POST /api/v1/scenarios
Body: CreateScenarioRequest
Response: { data: Scenario }
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in vite.config.ts or kill the process
   npx kill-port 5173
   ```

2. **Module not found errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Restart TypeScript server in VS Code
   # Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
   ```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run linter and tests
5. Submit a pull request

## 📄 License

Copyright © 2026 FinTwin AI. All rights reserved.

## 🔗 Links

- [Backend API](../backend/README.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Implementation Guide](../docs/IMPLEMENTATION_GUIDE.md)

---

Built with ❤️ using Agentic SDLC, IBM Bob, and ICA Context Studio