// Portfolio Analysis Page Component

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Badge } from '@/components/common';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  change: number;
  sector: string;
}

interface AssetDetail extends Asset {
  volatility: number;
  beta: number;
  sharpeRatio: number;
  holdings: SubAsset[];
}

interface SubAsset {
  symbol: string;
  name: string;
  value: number;
  change: number;
}

const PortfolioAnalysis: React.FC = () => {
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  // Mock portfolio data
  const totalValue = 2450000;
  const totalChange = 12.5;

  const assets: Asset[] = [
    { id: '1', symbol: 'STOCKS', name: 'Stocks', value: 1102500, percentage: 45, change: 12.8, sector: 'Equity' },
    { id: '2', symbol: 'BONDS', name: 'Bonds', value: 612500, percentage: 25, change: 3.2, sector: 'Fixed Income' },
    { id: '3', symbol: 'ETF', name: 'ETF', value: 367500, percentage: 15, change: -2.1, sector: 'Mixed' },
    { id: '4', symbol: 'GOLD', name: 'Gold', value: 245000, percentage: 10, change: 8.5, sector: 'Commodity' },
    { id: '5', symbol: 'CASH', name: 'Cash', value: 122500, percentage: 5, change: 0.1, sector: 'Cash' },
  ];

  const assetDetails: Record<string, AssetDetail> = {
    '1': {
      ...assets[0],
      volatility: 18.5,
      beta: 1.15,
      sharpeRatio: 1.42,
      holdings: [
        { symbol: 'AAPL', name: 'Apple Inc.', value: 150000, change: 5.2 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', value: 120000, change: 3.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 171000, change: 7.1 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 98000, change: -1.2 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', value: 85000, change: 15.3 },
        { symbol: 'JPM', name: 'JPMorgan Chase', value: 180000, change: 4.5 },
        { symbol: 'BAC', name: 'Bank of America', value: 120000, change: 2.8 },
        { symbol: 'WFC', name: 'Wells Fargo', value: 67500, change: 1.9 },
        { symbol: 'CVX', name: 'Chevron Corp.', value: 58500, change: 6.2 },
        { symbol: 'XOM', name: 'Exxon Mobil', value: 39500, change: 4.8 },
        { symbol: 'JNJ', name: 'Johnson & Johnson', value: 98000, change: 2.1 },
        { symbol: 'UNH', name: 'UnitedHealth Group', value: 98000, change: 3.5 },
      ],
    },
    '2': {
      ...assets[1],
      volatility: 5.2,
      beta: 0.35,
      sharpeRatio: 0.85,
      holdings: [
        { symbol: 'AGG', name: 'iShares Core US Aggregate Bond', value: 245000, change: 2.8 },
        { symbol: 'BND', name: 'Vanguard Total Bond Market', value: 183750, change: 3.1 },
        { symbol: 'TLT', name: 'iShares 20+ Year Treasury', value: 122500, change: 4.2 },
        { symbol: 'LQD', name: 'iShares iBoxx Investment Grade', value: 61250, change: 2.5 },
      ],
    },
    '3': {
      ...assets[2],
      volatility: 12.3,
      beta: 0.95,
      sharpeRatio: 1.12,
      holdings: [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', value: 147000, change: -1.5 },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', value: 110250, change: -3.2 },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market', value: 73500, change: -1.8 },
        { symbol: 'IWM', name: 'iShares Russell 2000', value: 36750, change: -2.5 },
      ],
    },
    '4': {
      ...assets[3],
      volatility: 15.8,
      beta: 0.12,
      sharpeRatio: 0.95,
      holdings: [
        { symbol: 'GLD', name: 'SPDR Gold Shares', value: 171500, change: 9.2 },
        { symbol: 'IAU', name: 'iShares Gold Trust', value: 73500, change: 7.8 },
      ],
    },
    '5': {
      ...assets[4],
      volatility: 0.1,
      beta: 0.0,
      sharpeRatio: 0.15,
      holdings: [
        { symbol: 'CASH', name: 'Money Market Fund', value: 122500, change: 0.1 },
      ],
    },
  };

  const pieData = assets.map((asset) => ({
    name: asset.name,
    value: asset.percentage,
    actualValue: asset.value,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const performanceData = [
    { month: 'Jan', value: 2200000 },
    { month: 'Feb', value: 2280000 },
    { month: 'Mar', value: 2250000 },
    { month: 'Apr', value: 2350000 },
    { month: 'May', value: 2400000 },
    { month: 'Jun', value: 2450000 },
  ];

  const toggleAsset = (assetId: string) => {
    setExpandedAsset(expandedAsset === assetId ? null : assetId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Tech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Finance': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Healthcare': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Energy': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive portfolio performance and risk analysis
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Portfolio Value
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(totalValue)}
            </p>
            <p className={`text-sm mt-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalChange >= 0 ? '↑' : '↓'} {Math.abs(totalChange)}% this month
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Risk Score
            </h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">65/100</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Moderate Risk</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Holdings
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Across 8 sectors</p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Performance
            </h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Asset Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Asset Allocation
            </h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${formatCurrency(props.payload.actualValue)})`,
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
          </CardBody>
        </Card>
      </div>

      {/* Asset Breakdown */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Asset Breakdown
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {assets.map((asset) => {
              const detail = assetDetails[asset.id];
              const isExpanded = expandedAsset === asset.id;

              return (
                <div key={asset.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Asset Summary */}
                  <button
                    onClick={() => toggleAsset(asset.id)}
                    className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[assets.indexOf(asset)] }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {asset.name}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {asset.percentage}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(asset.value)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change >= 0 ? '↑' : '↓'} {Math.abs(asset.change)}%
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && detail && (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gain/Loss</p>
                          <p className={`font-semibold ${detail.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency((detail.value * detail.change) / 100)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volatility</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{detail.volatility}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Beta</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{detail.beta}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sharpe Ratio</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{detail.sharpeRatio}</p>
                        </div>
                      </div>

                      {/* Holdings */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Holdings</h4>
                        <div className="space-y-2">
                          {detail.holdings.map((holding) => (
                            <div
                              key={holding.symbol}
                              className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                            >
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  {holding.symbol}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{holding.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  {formatCurrency(holding.value)}
                                </p>
                                <p className={`text-xs ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {holding.change >= 0 ? '+' : ''}{holding.change}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PortfolioAnalysis;

// Made with Bob
