// Mission Control - Crisis Command & Recovery Dashboard

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Card, CardBody, Badge } from '@/components/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCaseStore } from '@/store/caseStore';
import { SEED_ACTIVE_CASE, SEED_COMPLETED_CASES, SEED_PORTFOLIOS } from '@/data/seedData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeCase, cases, setActiveCase, isLoading, error } = useCaseStore();
  const [initialized, setInitialized] = useState(false);

  // Initialize with seed data on first load
  useEffect(() => {
    if (!initialized && cases.length === 0) {
      // Load seed data
      const allCases = [SEED_ACTIVE_CASE, ...SEED_COMPLETED_CASES];
      useCaseStore.setState({ cases: allCases, activeCase: SEED_ACTIVE_CASE });
      setInitialized(true);
    } else if (!activeCase && cases.length > 0) {
      // Set first active case if none selected
      const active = cases.find((c) => c.status === 'analyzing' || c.status === 'active');
      if (active) {
        setActiveCase(active.caseId);
      }
    }
  }, [initialized, cases, activeCase, setActiveCase]);

  const handleStartNewCrisis = () => {
    navigate(ROUTES.SCENARIOS_NEW);
  };

  const handleContinueCase = () => {
    if (activeCase) {
      // Navigate based on current stage
      switch (activeCase.currentStage) {
        case 'create_scenario':
          navigate(ROUTES.SCENARIOS_NEW);
          break;
        case 'validate':
          navigate(`/scenarios/${activeCase.scenario.id}/validate`);
          break;
        case 'simulate':
          navigate('/simulations/new');
          break;
        case 'analyze':
          navigate('/war-room');
          break;
        case 'recover':
          navigate('/recovery-center');
          break;
        case 'compare':
          navigate('/scenarios/compare');
          break;
        default:
          navigate('/war-room');
      }
    }
  };

  const handleLoadHistoricalCase = () => {
    navigate('/case-library');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'recovering':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'active':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 dark:text-red-400';
    if (risk >= 60) return 'text-orange-600 dark:text-orange-400';
    if (risk >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getRecommendedAction = () => {
    if (!activeCase) return 'Start a new crisis simulation';

    switch (activeCase.currentStage) {
      case 'create_scenario':
        return 'Complete scenario creation';
      case 'validate':
        return 'Validate scenario parameters';
      case 'simulate':
        return 'Run portfolio impact simulation';
      case 'analyze':
        return 'Review AI agent analysis in War Room';
      case 'recover':
        return 'Apply recovery recommendations';
      case 'compare':
        return 'Compare scenarios and outcomes';
      case 'close_case':
        return 'Export final report';
      default:
        return 'Continue crisis management';
    }
  };

  // Portfolio performance data
  const performanceData = [
    { month: 'Jan', value: 2200000 },
    { month: 'Feb', value: 2280000 },
    { month: 'Mar', value: 2250000 },
    { month: 'Apr', value: 2350000 },
    { month: 'May', value: 2400000 },
    { month: 'Jun', value: activeCase ? activeCase.portfolio.value : 2450000 },
  ];

  // Asset allocation data
  const allocationData = [
    { name: 'Stocks', value: 45, amount: 1102500 },
    { name: 'Bonds', value: 25, amount: 612500 },
    { name: 'ETF', value: 15, amount: 367500 },
    { name: 'Gold', value: 10, amount: 245000 },
    { name: 'Cash', value: 5, amount: 122500 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const recentCases = cases.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎯 Mission Control</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Financial Crisis Command & Recovery Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartNewCrisis}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">🚨</span>
            <span>Start New Crisis Simulation</span>
          </button>
          {activeCase && (
            <button
              onClick={handleContinueCase}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">▶️</span>
              <span>Continue Active Case</span>
            </button>
          )}
          <button
            onClick={handleLoadHistoricalCase}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">📚</span>
            <span>Load Historical Case</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-600 rounded-xl p-6 text-center">
          <div className="animate-spin text-4xl mb-2">⚙️</div>
          <p className="text-blue-800 dark:text-blue-400">Loading crisis data...</p>
        </div>
      )}

      {/* Active Crisis Case Card */}
      {activeCase ? (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-500 dark:border-red-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-3xl animate-pulse">
                🚨
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeCase.caseName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {activeCase.scenario.name} • {activeCase.portfolio.name}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(activeCase.status)}`}
            >
              {activeCase.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Risk</p>
              <p className={`text-2xl font-bold ${getRiskColor(activeCase.currentRisk)}`}>
                {activeCase.currentRisk}/100
              </p>
              <p className="text-xs text-gray-500 mt-1">Initial: {activeCase.initialRisk}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Loss</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {activeCase.initialLoss.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Portfolio impact</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recovered</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeCase.recoveredLoss.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Loss reduction</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recovery Progress</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeCase.recoveryProgress}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${activeCase.recoveryProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Stage</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {activeCase.currentStage.replace(/_/g, ' ').toUpperCase()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Recommended Next Action:</strong> {getRecommendedAction()}
            </p>
          </div>

          {activeCase.recommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Active Recommendations
              </p>
              <div className="space-y-2">
                {activeCase.recommendations.slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-900 dark:text-white">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleContinueCase}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Case
            </button>
            <button
              onClick={() => navigate('/war-room')}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Open War Room
            </button>
          </div>
        </div>
      ) : (
        /* No Active Case State */
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Active Crisis Case
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start a new crisis simulation or load a historical case to begin analysis
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleStartNewCrisis}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start New Crisis
            </button>
            <button
              onClick={handleLoadHistoricalCase}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Load Historical Case
            </button>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Portfolio Performance
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Data Source: Portfolio Management System • Updated: Today
            </div>
          </CardBody>
        </Card>

        {/* Asset Allocation Chart */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Asset Allocation
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Current distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Data Source: Portfolio Management System • Updated: Today
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Cases */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Crisis Cases
          </h2>
          <Link
            to="/case-library"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View All →
          </Link>
        </div>
        {recentCases.length > 0 ? (
          <div className="space-y-3">
            {recentCases.map((caseItem) => (
              <div
                key={caseItem.caseId}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setActiveCase(caseItem.caseId)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{caseItem.caseName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {caseItem.scenario.name} • Risk: {caseItem.currentRisk}/100
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {caseItem.recoveryProgress}% Recovered
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(caseItem.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(caseItem.status)}`}
                  >
                    {caseItem.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No crisis cases yet. Start your first simulation above.
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          ⚠️ <strong>Disclaimer:</strong> Simulation output is for risk planning and is not
          financial advice. All scenarios are based on historical data and statistical models with
          inherent uncertainties.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
