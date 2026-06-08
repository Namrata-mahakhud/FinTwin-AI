// Risk Heatmap Page Component

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Badge } from '@/components/common';

interface HeatmapCell {
  sector: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  exposure: number;
  impact: number;
  recovery: number;
}

interface TooltipData extends HeatmapCell {
  x: number;
  y: number;
}

const RiskHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<TooltipData | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Mock data - in real app, this would come from API
  const heatmapData: HeatmapCell[][] = [
    [
      { sector: 'Banking', riskLevel: 'Low', exposure: 35, impact: -3, recovery: 45 },
      { sector: 'Banking', riskLevel: 'Medium', exposure: 35, impact: -8, recovery: 60 },
      { sector: 'Banking', riskLevel: 'High', exposure: 35, impact: -12, recovery: 90 },
      { sector: 'Banking', riskLevel: 'Critical', exposure: 35, impact: -18, recovery: 120 },
    ],
    [
      { sector: 'Technology', riskLevel: 'Low', exposure: 28, impact: -2, recovery: 30 },
      { sector: 'Technology', riskLevel: 'Medium', exposure: 28, impact: -5, recovery: 45 },
      { sector: 'Technology', riskLevel: 'High', exposure: 28, impact: -9, recovery: 75 },
      { sector: 'Technology', riskLevel: 'Critical', exposure: 28, impact: -15, recovery: 100 },
    ],
    [
      { sector: 'Energy', riskLevel: 'Low', exposure: 15, impact: -4, recovery: 50 },
      { sector: 'Energy', riskLevel: 'Medium', exposure: 15, impact: -10, recovery: 70 },
      { sector: 'Energy', riskLevel: 'High', exposure: 15, impact: -16, recovery: 95 },
      { sector: 'Energy', riskLevel: 'Critical', exposure: 15, impact: -25, recovery: 150 },
    ],
    [
      { sector: 'Healthcare', riskLevel: 'Low', exposure: 12, impact: -1, recovery: 25 },
      { sector: 'Healthcare', riskLevel: 'Medium', exposure: 12, impact: -3, recovery: 40 },
      { sector: 'Healthcare', riskLevel: 'High', exposure: 12, impact: -6, recovery: 60 },
      { sector: 'Healthcare', riskLevel: 'Critical', exposure: 12, impact: -10, recovery: 85 },
    ],
  ];

  const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
  const sectors = ['Banking', 'Technology', 'Energy', 'Healthcare'];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-500 hover:bg-green-600';
      case 'Medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'High':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Critical':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskEmoji = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'High':
        return '🔴';
      case 'Critical':
        return '⚫';
      default:
        return '⚪';
    }
  };

  const handleCellClick = (cell: HeatmapCell) => {
    setSelectedSector(cell.sector);
  };

  const handleCellHover = (cell: HeatmapCell, rowIndex: number, colIndex: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredCell({
      ...cell,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Risk Heatmap</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visual representation of portfolio risk across sectors and scenarios
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Exposure</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">$2.45M</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Risk</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">65/100</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">High Risk Sectors</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Recovery</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">68 days</p>
          </CardBody>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sector Risk Analysis
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span className="text-gray-600 dark:text-gray-400">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span className="text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔴</span>
                <span className="text-gray-600 dark:text-gray-400">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚫</span>
                <span className="text-gray-600 dark:text-gray-400">Critical</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sector
                  </th>
                  {riskLevels.map((level) => (
                    <th
                      key={level}
                      className="text-center p-4 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {level}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {row[0].sector}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="p-2">
                        <button
                          onClick={() => handleCellClick(cell)}
                          onMouseEnter={(e) => handleCellHover(cell, rowIndex, colIndex, e)}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`
                            w-full h-20 rounded-lg transition-all duration-200 transform
                            ${getRiskColor(cell.riskLevel)}
                            ${selectedSector === cell.sector ? 'ring-4 ring-primary-500 scale-105' : ''}
                            flex items-center justify-center text-3xl
                            shadow-md hover:shadow-lg
                          `}
                        >
                          {getRiskEmoji(cell.riskLevel)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 10}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl p-4 min-w-[250px] border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-lg">{hoveredCell.sector}</h4>
              <Badge
                variant={
                  hoveredCell.riskLevel === 'Low'
                    ? 'success'
                    : hoveredCell.riskLevel === 'Medium'
                    ? 'warning'
                    : 'danger'
                }
              >
                {hoveredCell.riskLevel} Risk
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Exposure:</span>
                <span className="font-medium">{hoveredCell.exposure}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Impact:</span>
                <span className="font-medium text-red-400">{hoveredCell.impact}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recovery:</span>
                <span className="font-medium">{hoveredCell.recovery} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Correlation:</span>
                <span className="font-medium">0.{Math.floor(Math.random() * 30 + 70)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Sector Details */}
      {selectedSector && (
        <Card className="border-2 border-primary-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedSector} Sector Analysis
              </h2>
              <button
                onClick={() => setSelectedSector(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Risk Distribution
                </h4>
                <div className="space-y-2">
                  {heatmapData
                    .find((row) => row[0].sector === selectedSector)
                    ?.map((cell, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {cell.riskLevel}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getRiskColor(cell.riskLevel).split(' ')[0]}`}
                              style={{ width: `${Math.abs(cell.impact) * 5}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {cell.impact}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Key Metrics
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio Weight</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {heatmapData.find((row) => row[0].sector === selectedSector)?.[0].exposure}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Volatility</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(Math.random() * 10 + 15).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Beta</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(Math.random() * 0.5 + 0.8).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      ⚠️ Consider reducing exposure by 5-10%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      💡 Diversify with defensive assets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default RiskHeatmap;

// Made with Bob
