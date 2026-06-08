# FinTwin AI Frontend Architecture

## Overview

Modern React + TypeScript application with component-based architecture, state management, and comprehensive API integration.

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP Client**: Axios

## Folder Structure

```
frontend/src/
├── assets/              # Static assets (images, fonts, icons)
│   ├── icons/
│   ├── images/
│   └── fonts/
├── components/          # Reusable UI components
│   ├── common/         # Generic reusable components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Spinner/
│   │   └── Alert/
│   ├── layout/         # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── MainLayout/
│   ├── charts/         # Chart components
│   │   ├── LineChart/
│   │   ├── BarChart/
│   │   ├── PieChart/
│   │   └── AreaChart/
│   ├── heatmap/        # Heatmap components
│   │   ├── RiskHeatmap/
│   │   └── CorrelationHeatmap/
│   └── widgets/        # Business-specific widgets
│       ├── PortfolioCard/
│       ├── RiskIndicator/
│       ├── ScenarioCard/
│       └── MetricCard/
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
│   ├── useAuth.ts
│   ├── useScenarios.ts
│   ├── usePortfolio.ts
│   ├── useSimulation.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── services/           # API integration layer
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   ├── scenarios.api.ts
│   │   ├── portfolio.api.ts
│   │   ├── simulation.api.ts
│   │   └── recommendations.api.ts
│   └── websocket/
│       └── simulation.ws.ts
├── store/              # Zustand state management
│   ├── authStore.ts
│   ├── scenarioStore.ts
│   ├── portfolioStore.ts
│   ├── simulationStore.ts
│   └── uiStore.ts
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   ├── scenario.types.ts
│   ├── portfolio.types.ts
│   ├── simulation.types.ts
│   ├── api.types.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   ├── calculations.ts
│   ├── date.ts
│   └── storage.ts
├── constants/          # Application constants
│   ├── routes.ts
│   ├── api.ts
│   ├── colors.ts
│   └── config.ts
├── styles/             # Global styles
│   ├── globals.css
│   └── themes.css
├── router/             # Routing configuration
│   ├── index.tsx
│   ├── PrivateRoute.tsx
│   └── routes.config.ts
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── vite-env.d.ts       # Vite type definitions
```

## Component Architecture

### Component Hierarchy

```
App
├── Router
│   ├── PublicRoutes
│   │   └── Login
│   └── PrivateRoutes (Protected)
│       ├── MainLayout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── Content
│       │       ├── Dashboard
│       │       ├── ScenarioBuilder
│       │       ├── PortfolioAnalysis
│       │       ├── RiskHeatmap
│       │       ├── SimulationResults
│       │       ├── Recommendations
│       │       └── Admin
│       └── Footer
```

### Component Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition**: Build complex UIs from simple components
3. **Reusability**: Create generic components for common patterns
4. **Props Interface**: Well-defined TypeScript interfaces
5. **Error Boundaries**: Graceful error handling

## State Management Strategy

### Zustand Stores

1. **authStore**: User authentication, tokens, permissions
2. **scenarioStore**: Scenario creation, editing, management
3. **portfolioStore**: Portfolio data, holdings, performance
4. **simulationStore**: Simulation state, results, progress
5. **uiStore**: UI state (modals, notifications, theme)

### React Query

- Server state caching
- Automatic refetching
- Optimistic updates
- Background synchronization

## API Integration Layer

### API Client Configuration

- Base URL configuration
- Request/response interceptors
- Error handling
- Token management
- Retry logic

### API Services

- **auth.api.ts**: Login, logout, refresh token
- **scenarios.api.ts**: CRUD operations for scenarios
- **portfolio.api.ts**: Portfolio data and analysis
- **simulation.api.ts**: Run simulations, get results
- **recommendations.api.ts**: AI-generated recommendations

## Routing Strategy

### Route Structure

```
/                       → Redirect to /login or /dashboard
/login                  → Login page (public)
/dashboard              → Main dashboard (protected)
/scenarios              → Scenario list (protected)
/scenarios/new          → Create scenario (protected)
/scenarios/:id          → Scenario details (protected)
/scenarios/:id/edit     → Edit scenario (protected)
/portfolio              → Portfolio analysis (protected)
/risk-heatmap           → Risk heatmap visualization (protected)
/simulations/:id        → Simulation results (protected)
/recommendations        → AI recommendations (protected)
/admin                  → Admin panel (protected, admin only)
/admin/users            → User management (protected, admin only)
```

### Route Protection

- Public routes: Accessible without authentication
- Protected routes: Require authentication
- Role-based routes: Require specific permissions

## Custom Hooks

### Data Hooks

- `useAuth()`: Authentication state and methods
- `useScenarios()`: Scenario data and operations
- `usePortfolio()`: Portfolio data and analysis
- `useSimulation()`: Simulation execution and results

### Utility Hooks

- `useDebounce()`: Debounce values
- `useLocalStorage()`: Persist state to localStorage
- `useMediaQuery()`: Responsive design helpers
- `useWebSocket()`: WebSocket connections

## Responsive Design

### Breakpoints (Tailwind)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interactions

## Performance Optimization

### Code Splitting

- Route-based code splitting
- Component lazy loading
- Dynamic imports

### Optimization Techniques

- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable function references
- Virtual scrolling for large lists
- Image optimization and lazy loading

## Testing Strategy

### Unit Tests (Vitest)

- Component rendering
- Hook behavior
- Utility functions
- Store logic

### Integration Tests

- User flows
- API integration
- Form submissions

### E2E Tests (Playwright)

- Critical user journeys
- Cross-browser testing

## Build & Deployment

### Development

```bash
npm run dev          # Start dev server
npm run lint         # Run linter
npm run format       # Format code
npm run test         # Run tests
```

### Production

```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Variables

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_VERSION=1.0.0
```

## Security Considerations

1. **Authentication**: JWT tokens stored in httpOnly cookies
2. **Authorization**: Role-based access control
3. **XSS Prevention**: Sanitize user inputs
4. **CSRF Protection**: CSRF tokens for mutations
5. **HTTPS**: Enforce HTTPS in production
6. **Content Security Policy**: Restrict resource loading

## Accessibility (a11y)

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Add labels for screen readers
3. **Keyboard Navigation**: Full keyboard support
4. **Color Contrast**: WCAG AA compliance
5. **Focus Management**: Visible focus indicators

## UI/UX Guidelines

### Design System

- Consistent spacing (4px grid)
- Typography scale
- Color palette (primary, secondary, semantic)
- Shadow system
- Border radius standards

### Interaction Patterns

- Loading states
- Error states
- Empty states
- Success feedback
- Confirmation dialogs

## Future Enhancements

1. **Progressive Web App (PWA)**: Offline support
2. **Internationalization (i18n)**: Multi-language support
3. **Dark Mode**: Theme switching
4. **Real-time Updates**: WebSocket integration
5. **Advanced Analytics**: User behavior tracking
6. **Micro-frontends**: Modular architecture

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-25  
**Maintained By**: FinTwin AI Team
