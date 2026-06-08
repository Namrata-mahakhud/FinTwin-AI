// Scenario Validation Modal Component
// Step 1: Validates scenario before simulation

import React, { useEffect, useState } from 'react';
import { Modal, LoadingSpinner, Badge } from '@/components/common';
import { ValidationResult, ValidationCheck } from '@/types/simulation-flow.types';

interface ScenarioValidationModalProps {
  isOpen: boolean;
  scenarioId: string;
  onClose: () => void;
  onProceed: (validationResult: ValidationResult) => void;
}

const ScenarioValidationModal: React.FC<ScenarioValidationModalProps> = ({
  isOpen,
  scenarioId,
  onClose,
  onProceed,
}) => {
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    if (isOpen && scenarioId) {
      performValidation();
    }
  }, [isOpen, scenarioId]);

  const performValidation = async () => {
    setIsValidating(true);
    
    // Simulate validation API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation result
    const checks: ValidationCheck[] = [
      {
        id: 'scenario-name',
        name: 'Scenario Name',
        status: 'pass',
        message: 'Scenario name is valid',
        icon: '✓',
      },
      {
        id: 'events',
        name: 'Minimum Events',
        status: 'pass',
        message: '3 events selected',
        icon: '✓',
      },
      {
        id: 'severity',
        name: 'Severity Selected',
        status: 'pass',
        message: 'Severity level: HIGH',
        icon: '✓',
      },
      {
        id: 'portfolio',
        name: 'Portfolio Exists',
        status: 'pass',
        message: 'Portfolio found',
        icon: '✓',
      },
      {
        id: 'duration',
        name: 'Duration Specified',
        status: 'pass',
        message: '3 months',
        icon: '✓',
      },
    ];

    const result: ValidationResult = {
      scenarioId,
      scenarioName: 'Banking Crisis Q1',
      eventsSelected: [
        { type: 'Inflation Increase', description: 'Consumer prices rise by 3%' },
        { type: 'Oil Price Spike', description: 'Oil prices increase 25%' },
        { type: 'Global Conflict', description: 'Geopolitical tensions escalate' },
      ],
      severity: 'HIGH',
      duration: 3,
      portfolioId: 'portfolio-1',
      checks,
      canProceed: checks.every(c => c.status === 'pass'),
      missingRequirements: checks
        .filter(c => c.status === 'fail')
        .map(c => c.name),
    };

    setValidationResult(result);
    setIsValidating(false);
  };

  const getStatusIcon = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'pass':
        return <span className="text-green-500 text-xl">✓</span>;
      case 'fail':
        return <span className="text-red-500 text-xl">✗</span>;
      case 'warning':
        return <span className="text-yellow-500 text-xl">⚠</span>;
    }
  };

  const getStatusColor = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'pass':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'fail':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Scenario Validation"
      size="lg"
    >
      <div className="space-y-6">
        {isValidating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Validating scenario configuration...
            </p>
          </div>
        ) : validationResult ? (
          <>
            {/* Scenario Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Scenario Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scenario Name:</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {validationResult.scenarioName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Events Selected:</p>
                  <div className="space-y-1">
                    {validationResult.eventsSelected.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {event.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Severity:</p>
                    <Badge variant="danger" size="lg" className="mt-1">
                      {validationResult.severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration:</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {validationResult.duration} months
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Checks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Validation Status
              </h3>
              
              <div className="space-y-2">
                {validationResult.checks.map((check) => (
                  <div
                    key={check.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border-2
                      ${getStatusColor(check.status)}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {check.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {check.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Requirements */}
            {!validationResult.canProceed && validationResult.missingRequirements && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  Missing Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.missingRequirements.map((req, idx) => (
                    <li key={idx} className="text-sm text-red-800 dark:text-red-400">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ready Status */}
            {validationResult.canProceed && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-green-900 dark:text-green-300">
                  ✓ Ready for simulation
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  All validation checks passed successfully
                </p>
              </div>
            )}
          </>
        ) : null}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => validationResult && onProceed(validationResult)}
            disabled={isValidating || !validationResult?.canProceed}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <span>→</span>
            Proceed to Impact Preview
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScenarioValidationModal;

// Made with Bob