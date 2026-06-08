// Router Configuration

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { JourneyStage } from '@/types/journey.types';

// Layouts
import MainLayout from '@/components/layout/MainLayout';

// Pages - Lazy loaded for code splitting
import { lazy } from 'react';

// Auth Pages
const Login = lazy(() => import('@/pages/Login'));

// Protected Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ScenarioBuilder = lazy(() => import('@/pages/ScenarioBuilder'));
const ScenarioDetail = lazy(() => import('@/pages/ScenarioDetail'));
const PortfolioAnalysis = lazy(() => import('@/pages/PortfolioAnalysis'));
const RiskHeatmap = lazy(() => import('@/pages/RiskHeatmap'));
const SimulationResults = lazy(() => import('@/pages/SimulationResults'));
const RunSimulation = lazy(() => import('@/pages/RunSimulation'));
const SimulationJourney = lazy(() => import('@/pages/SimulationResults/SimulationJourney'));
const SimulationHistory = lazy(() => import('@/pages/SimulationHistory'));
const FinancialWarRoom = lazy(() => import('@/pages/FinancialWarRoom'));
const Recommendations = lazy(() => import('@/pages/Recommendations'));
const Admin = lazy(() => import('@/pages/Admin'));

// New Pages
const ScenarioValidation = lazy(() => import('@/pages/ScenarioValidation'));
const CaseClosure = lazy(() => import('@/pages/CaseClosure'));
const CaseLibrary = lazy(() => import('@/pages/CaseLibrary'));
const ScenarioCompare = lazy(() => import('@/pages/ScenarioCompare'));

// Route Guards
import PrivateRoute from './PrivateRoute';
import JourneyRoute from './JourneyRoute';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.SCENARIOS,
        element: <ScenarioBuilder />,
      },
      {
        path: ROUTES.SCENARIOS_NEW,
        element: <ScenarioBuilder />,
      },
      {
        path: ROUTES.SCENARIOS_DETAIL,
        element: <ScenarioDetail />,
      },
      {
        path: ROUTES.SCENARIOS_EDIT,
        element: <ScenarioBuilder />,
      },
      {
        path: ROUTES.PORTFOLIO,
        element: <PortfolioAnalysis />,
      },
      {
        path: ROUTES.PORTFOLIO_ANALYSIS,
        element: <PortfolioAnalysis />,
      },
      {
        path: ROUTES.RISK_HEATMAP,
        element: <RiskHeatmap />,
      },
      {
        path: '/simulations/new',
        element: <RunSimulation />,
      },
      {
        path: '/simulations/run',
        element: (
          <JourneyRoute requiredStage={JourneyStage.RUN_SIMULATION}>
            <RunSimulation />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.SIMULATIONS_DETAIL,
        element: <SimulationResults />,
      },
      {
        path: '/simulations/:id/journey',
        element: <SimulationJourney />,
      },
      {
        path: '/simulations/history',
        element: <SimulationHistory />,
      },
      {
        path: '/simulations/:id/war-room',
        element: <FinancialWarRoom />,
      },
      {
        path: '/war-room',
        element: <FinancialWarRoom />,
      },
      {
        path: '/portfolio/impact',
        element: <PortfolioAnalysis />,
      },
      {
        path: '/recovery',
        element: <SimulationResults />,
      },
      {
        path: '/recovery-center',
        element: <Recommendations />,
      },
      {
        path: '/agent-studio',
        element: <Admin />,
      },
      {
        path: '/export',
        element: <SimulationResults />,
      },
      {
        path: ROUTES.RECOMMENDATIONS,
        element: <Recommendations />,
      },
      // New Crisis Management Routes
      {
        path: '/scenarios/:id/validate',
        element: <ScenarioValidation />,
      },
      {
        path: '/cases/:id/closure',
        element: <CaseClosure />,
      },
      {
        path: '/case-closure',
        element: <CaseClosure />,
      },
      {
        path: '/case-library',
        element: <CaseLibrary />,
      },
      {
        path: '/scenarios/compare',
        element: <ScenarioCompare />,
      },
      {
        path: '/mission-control',
        element: <Dashboard />,
      },
      // Journey-based routes with guards
      {
        path: ROUTES.JOURNEY_CREATE_SCENARIO,
        element: (
          <JourneyRoute requiredStage={JourneyStage.CREATE_SCENARIO}>
            <ScenarioBuilder />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_RUN_SIMULATION,
        element: (
          <JourneyRoute requiredStage={JourneyStage.RUN_SIMULATION}>
            <SimulationResults />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_CRISIS_CENTER,
        element: (
          <JourneyRoute requiredStage={JourneyStage.CRISIS_CENTER}>
            <FinancialWarRoom />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_PORTFOLIO_IMPACT,
        element: (
          <JourneyRoute requiredStage={JourneyStage.PORTFOLIO_IMPACT}>
            <PortfolioAnalysis />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_RISK_HEATMAP,
        element: (
          <JourneyRoute requiredStage={JourneyStage.RISK_HEATMAP}>
            <RiskHeatmap />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_AI_RECOMMENDATIONS,
        element: (
          <JourneyRoute requiredStage={JourneyStage.AI_RECOMMENDATIONS}>
            <Recommendations />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_RECOVERY,
        element: (
          <JourneyRoute requiredStage={JourneyStage.RECOVERY_SIMULATION}>
            <SimulationResults />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_AGENT_STUDIO,
        element: (
          <JourneyRoute requiredStage={JourneyStage.AGENT_STUDIO}>
            <Admin />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.JOURNEY_EXPORT,
        element: (
          <JourneyRoute requiredStage={JourneyStage.EXPORT_REPORT}>
            <SimulationResults />
          </JourneyRoute>
        ),
      },
      {
        path: ROUTES.ADMIN,
        element: (
          <PrivateRoute requiredRole="admin">
            <Admin />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export default router;

// Made with Bob
