// Simulation Processing Overlay Component
// Shows AI agent activation during simulation startup

import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/common';

interface ProcessingStep {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
}

interface SimulationProcessingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SimulationProcessingOverlay: React.FC<SimulationProcessingOverlayProps> = ({
  isVisible,
  onComplete,
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'market', label: 'Market Agent Activated', icon: '📊', completed: false },
    { id: 'inflation', label: 'Inflation Model Loaded', icon: '💰', completed: false },
    { id: 'currency', label: 'Currency Risk Evaluated', icon: '💱', completed: false },
    { id: 'stress', label: 'Portfolio Stress Test Running', icon: '⚡', completed: false },
    { id: 'recommendation', label: 'Recommendation Engine Started', icon: '🤖', completed: false },
  ]);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setSteps(steps.map(s => ({ ...s, completed: false })));
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next < steps.length) {
          setSteps(current =>
            current.map((step, idx) =>
              idx === prev ? { ...step, completed: true } : step
            )
          );
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-primary-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <LoadingSpinner size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Running Financial Digital Twin Simulation
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Initializing AI agents and market models...
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${step.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : index === currentStep
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 animate-pulse'
                  : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700'
                }
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {step.completed ? (
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                ) : index === currentStep ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span className="text-2xl opacity-50">{step.icon}</span>
                )}
              </div>
              <span
                className={`
                  text-sm font-medium
                  ${step.completed
                    ? 'text-green-700 dark:text-green-300'
                    : index === currentStep
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Agentic SDLC Framework</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationProcessingOverlay;

// Made with Bob