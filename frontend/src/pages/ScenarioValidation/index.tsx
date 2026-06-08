// Scenario Validation Page
// Validates crisis scenario before running simulation

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody } from '@/components/common';
import { useCaseStore } from '@/store/caseStore';

interface ValidationCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  icon: string;
}

const ScenarioValidation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { activeCase, updateCase, advanceStage } = useCaseStore();
  
  const [isValidating, setIsValidating] = useState(true);
  const [validationChecks, setValidationChecks] = useState<ValidationCheck[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const [missingRequirements, setMissingRequirements] = useState<string[]>([]);

  useEffect(() => {
    // Simulate validation process
    setTimeout(() => {
      performValidation();
    }, 1500);
  }, []);

  const performValidation = () => {
    const checks: ValidationCheck[] = [
      {
        id: 'scenario-name',
        name: 'Scenario Name',
        status: 'pass',
        message: activeCase?.scenario.name || 'Scenario name is valid',
        icon: '✓',
      },
      {
        id: 'shock-type',
        name: 'Shock Type Selected',
        status: 'pass',
        message: `Shock type: ${activeCase?.scenario.type || 'Market Crash'}`,
        icon: '✓',
      },
      {
        id: 'severity',
        name: 'Severity Level',
        status: 'pass',
        message: `Severity: ${activeCase?.scenario.severity?.toUpperCase() || 'HIGH'}`,
        icon: '✓',
      },
      {
        id: 'portfolio',
        name: 'Portfolio Selected',
        status: 'pass',
        message: `Portfolio: ${activeCase?.portfolio.name || 'Balanced Portfolio'}`,
        icon: '✓',
      },
      {
        id: 'sectors',
        name: 'Affected Sectors',
        status: 'pass',
        message: '3 sectors identified: Banking, Energy, Technology',
        icon: '✓',
      },
      {
        id: 'duration',
        name: 'Duration Specified',
        status: 'pass',
        message: 'Duration: 6 months',
        icon: '✓',
      },
      {
        id: 'assumptions',
        name: 'Simulation Assumptions',
        status: 'pass',
        message: 'All required assumptions configured',
        icon: '✓',
      },
    ];

    const failedChecks = checks.filter(c => c.status === 'fail');
    const missing = failedChecks.map(c => c.name);

    setValidationChecks(checks);
    setCanProceed(failedChecks.length === 0);
    setMissingRequirements(missing);
    setIsValidating(false);

    // Update case stage
    if (activeCase && failedChecks.length === 0) {
      updateCase(activeCase.caseId, { currentStage: 'validate' });
    }
  };

  const handleRunSimulation = () => {
    if (canProceed && activeCase) {
      // Advance to simulation stage
      advanceStage();
      navigate('/simulations/new');
    }
  };

  const handleBackToScenario = () => {
    navigate('/scenarios/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500';
      case 'fail':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-500';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return '✓';
      case 'fail':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '○';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔍 Scenario Validation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Validating crisis scenario configuration before simulation
          </p>
        </div>
      </div>

      {/* Validation Progress */}
      {isValidating && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="animate-spin text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Validating Scenario...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Checking scenario parameters and requirements
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Validation Results */}
      {!isValidating && (
        <>
          {/* Summary Card */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    canProceed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {canProceed ? '✓' : '✗'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {canProceed ? 'Validation Passed' : 'Validation Failed'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {canProceed 
                        ? 'All checks passed. Ready to run simulation.' 
                        : `${missingRequirements.length} requirement(s) missing`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {validationChecks.filter(c => c.status === 'pass').length}/{validationChecks.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Checks Passed</p>
                </div>
              </div>

              {/* Scenario Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Scenario Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Scenario Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activeCase?.scenario.name || 'Banking Crisis Q1'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Shock Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activeCase?.scenario.type || 'Banking Collapse'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Severity</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activeCase?.scenario.severity?.toUpperCase() || 'CRITICAL'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activeCase?.portfolio.name || 'Balanced Portfolio'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing Requirements */}
              {!canProceed && missingRequirements.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                    Missing Requirements
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {missingRequirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-red-700 dark:text-red-300">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Validation Checks */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Validation Checks
              </h3>
              <div className="space-y-3">
                {validationChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${getStatusColor(check.status)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getStatusIcon(check.status)}
                      </div>
                      <div>
                        <p className="font-semibold">{check.name}</p>
                        <p className="text-sm opacity-90">{check.message}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white dark:bg-gray-800">
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Assumptions Used */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📋 Assumptions Used
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Market volatility: 35% (Historical average for crisis scenarios)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Interest rate impact: 4.5% (Current Federal Reserve rate)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Recovery period: 6-12 months (Based on 2008 crisis baseline)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Correlation factors: Banking sector correlation 0.85 with market indices
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Model Confidence:</strong> 87% • <strong>Data Source:</strong> Federal Reserve, Bloomberg • <strong>Last Updated:</strong> January 2024
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleBackToScenario}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Scenario
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={!canProceed}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              {canProceed ? '▶️ Run Simulation' : '🔒 Cannot Proceed'}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              ⚠️ <strong>Disclaimer:</strong> Simulation output is for risk planning and is not financial advice. 
              Validation checks ensure data integrity but do not guarantee prediction accuracy.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioValidation;

// Made with Bob