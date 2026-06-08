// Admin & Monitoring Dashboard Page Component

import React from 'react';
import { Card, CardBody, CardHeader, Badge } from '@/components/common';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'simulation' | 'scenario' | 'recommendation' | 'risk_update';
  description: string;
  status: 'success' | 'warning' | 'error';
}

const Admin: React.FC = () => {
  // System metrics
  const systemMetrics = {
    simulationsRun: 24,
    simulationsChange: 8,
    failedScenarios: 3,
    failedChange: -1,
    averageRisk: 65,
    riskTrend: 'stable',
    lastShock: {
      type: 'Currency Crash',
      daysAgo: 2,
    },
    recoveryTime: 7,
  };

  // Performance data
  const performanceData = [
    { date: 'Jan 15', simulations: 18, avgDuration: 45 },
    { date: 'Jan 16', simulations: 22, avgDuration: 42 },
    { date: 'Jan 17', simulations: 20, avgDuration: 48 },
    { date: 'Jan 18', simulations: 25, avgDuration: 40 },
    { date: 'Jan 19', simulations: 24, avgDuration: 43 },
    { date: 'Jan 20', simulations: 28, avgDuration: 38 },
    { date: 'Jan 21', simulations: 24, avgDuration: 41 },
  ];

  // Agent performance
  const agentPerformance = [
    { agent: 'Risk Agent', recommendations: 45, accuracy: 87 },
    { agent: 'Market Agent', recommendations: 38, accuracy: 82 },
    { agent: 'Portfolio Agent', recommendations: 52, accuracy: 91 },
    { agent: 'Recommendation Agent', recommendations: 41, accuracy: 85 },
  ];

  // Recent activity logs
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      timestamp: '2024-01-21 14:32:15',
      type: 'simulation',
      description: 'Simulation completed: Banking Crisis Q1',
      status: 'success',
    },
    {
      id: '2',
      timestamp: '2024-01-21 14:28:03',
      type: 'risk_update',
      description: 'Risk score updated: 65 → 58',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-01-21 14:15:42',
      type: 'recommendation',
      description: 'Recommendation applied: Bond rebalance',
      status: 'success',
    },
    {
      id: '4',
      timestamp: '2024-01-21 13:58:21',
      type: 'scenario',
      description: 'Scenario created: Oil Price Spike',
      status: 'success',
    },
    {
      id: '5',
      timestamp: '2024-01-21 13:45:10',
      type: 'simulation',
      description: 'Simulation failed: Timeout error',
      status: 'error',
    },
    {
      id: '6',
      timestamp: '2024-01-21 13:30:55',
      type: 'risk_update',
      description: 'High risk detected in Energy sector',
      status: 'warning',
    },
    {
      id: '7',
      timestamp: '2024-01-21 13:12:33',
      type: 'simulation',
      description: 'Simulation completed: Interest Rate Hike',
      status: 'success',
    },
    {
      id: '8',
      timestamp: '2024-01-21 12:58:47',
      type: 'recommendation',
      description: 'New recommendation: Reduce tech exposure',
      status: 'success',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'simulation':
        return '⚡';
      case 'scenario':
        return '📊';
      case 'recommendation':
        return '💡';
      case 'risk_update':
        return '⚠️';
      default:
        return '📝';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Monitoring & Audit Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System metrics, performance analytics, and activity monitoring
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Simulations Run
              </h3>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {systemMetrics.simulationsRun}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ↑ +{systemMetrics.simulationsChange} this week
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Failed Scenarios
              </h3>
              <span className="text-2xl">❌</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {systemMetrics.failedScenarios}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ↓ {systemMetrics.failedChange} from last week
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Risk</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {systemMetrics.averageRisk}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              → {systemMetrics.riskTrend}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Shock</h3>
              <span className="text-2xl">💥</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {systemMetrics.lastShock.type}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {systemMetrics.lastShock.daysAgo} days ago
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Recovery Timeline */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recovery Timeline</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {systemMetrics.lastShock.type} → Baseline
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemMetrics.recoveryTime} days
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: '70%' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Day 0</span>
                <span>Day 3</span>
                <span>Day 7</span>
                <span>Day 10</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Performance */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Simulation Performance
            </h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="simulations"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Simulations"
                />
                <Line
                  type="monotone"
                  dataKey="avgDuration"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Avg Duration (s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Agent Performance
            </h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="agent" stroke="#9CA3AF" angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="accuracy" fill="#10B981" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Export Audit Trail →
            </button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-2xl">{getTypeIcon(log.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
                <Badge variant={getStatusColor(log.status)} size="sm">
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Health</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">45ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  99.9%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">0.1%</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Database</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Scenarios</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Simulations</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1,243</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2.4 GB</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Agents</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Agents</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">4/4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">84%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Recommendations</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">176</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

// Made with Bob
