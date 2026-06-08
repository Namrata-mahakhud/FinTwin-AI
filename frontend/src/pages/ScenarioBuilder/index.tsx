// Market Shock Scenario Builder Page Component

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Badge, LoadingSpinner } from '@/components/common';
import { useCreateScenario } from '@/hooks/useScenarios';
import { ScenarioType, SeveritLevel, EventType } from '@/types';
import { ROUTES, buildRoute } from '@/constants/routes';
import { JourneyWrapper } from '@/components/journey';
import { JourneyStage } from '@/types/journey.types';
import { useJourneyStore } from '@/store/journeyStore';
import { useToastStore } from '@/store/toastStore';

interface EventOption {
  type: EventType;
  label: string;
  icon: string;
  description: string;
}

interface ImpactArea {
  id: string;
  label: string;
  selected: boolean;
}

const eventOptions: EventOption[] = [
  {
    type: EventType.INTEREST_RATE,
    label: 'Interest Rate Hike',
    icon: '📈',
    description: 'Central bank increases interest rates',
  },
  {
    type: EventType.INFLATION,
    label: 'Inflation Increase',
    icon: '💰',
    description: 'Rising consumer prices and inflation',
  },
  {
    type: EventType.CURRENCY_FLUCTUATION,
    label: 'Currency Crash',
    icon: '💱',
    description: 'Significant currency devaluation',
  },
  {
    type: EventType.COMMODITY_PRICE,
    label: 'Oil Price Spike',
    icon: '🛢️',
    description: 'Sharp increase in oil prices',
  },
  {
    type: EventType.MARKET_VOLATILITY,
    label: 'Sector Collapse',
    icon: '🏢',
    description: 'Major sector downturn',
  },
  {
    type: EventType.REGULATORY_CHANGE,
    label: 'Global Conflict',
    icon: '⚔️',
    description: 'Geopolitical tensions and conflicts',
  },
];

const ScenarioBuilder: React.FC = () => {
  const navigate = useNavigate();
  const createScenario = useCreateScenario();
  const { setJourneyData } = useJourneyStore();
  const { addToast } = useToastStore();

  // Form state
  const [scenarioName, setScenarioName] = useState('Banking Crisis Q1');
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([]);
  const [severity, setSeverity] = useState<SeveritLevel>(SeveritLevel.MEDIUM);
  const [duration, setDuration] = useState<number>(3); // months
  const [impactAreas, setImpactAreas] = useState<ImpactArea[]>([
    { id: 'banking', label: 'Banking', selected: true },
    { id: 'tech', label: 'Tech', selected: false },
    { id: 'energy', label: 'Energy', selected: false },
    { id: 'healthcare', label: 'Healthcare', selected: false },
  ]);

  // Calculate estimated impact
  const calculateImpact = () => {
    const baseImpact = selectedEvents.length * -2.5;
    const severityMultiplier = {
      [SeveritLevel.LOW]: 0.5,
      [SeveritLevel.MEDIUM]: 1.0,
      [SeveritLevel.HIGH]: 1.5,
      [SeveritLevel.CRITICAL]: 2.0,
    };
    const durationMultiplier = duration / 3;
    const impactCount = impactAreas.filter((a) => a.selected).length;

    const portfolioLoss = baseImpact * severityMultiplier[severity] * durationMultiplier;
    const riskIncrease = Math.abs(portfolioLoss) * 1.5;
    const affectedSector = impactAreas.find((a) => a.selected)?.label || 'Multiple';

    return {
      portfolioLoss: portfolioLoss.toFixed(1),
      riskIncrease: Math.round(riskIncrease),
      affectedSector,
      suggestedAction: portfolioLoss < -5 ? 'Move 10% to bonds' : 'Monitor closely',
    };
  };

  const impact = calculateImpact();

  const toggleEvent = (eventType: EventType) => {
    setSelectedEvents((prev) =>
      prev.includes(eventType) ? prev.filter((e) => e !== eventType) : [...prev, eventType]
    );
  };

  const toggleImpactArea = (id: string) => {
    setImpactAreas((prev) =>
      prev.map((area) => (area.id === id ? { ...area, selected: !area.selected } : area))
    );
  };

  const getSeverityColor = (level: SeveritLevel) => {
    switch (level) {
      case SeveritLevel.LOW:
        return 'bg-green-500';
      case SeveritLevel.MEDIUM:
        return 'bg-yellow-500';
      case SeveritLevel.HIGH:
        return 'bg-orange-500';
      case SeveritLevel.CRITICAL:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNext = async () => {
    // Validation
    if (selectedEvents.length === 0) {
      addToast({
        type: 'error',
        message: 'Please select at least one event type',
      });
      return false;
    }

    if (!scenarioName.trim()) {
      addToast({
        type: 'error',
        message: 'Please enter a scenario name',
      });
      return false;
    }

    const scenarioData = {
      name: scenarioName,
      description: `${severity} severity scenario with ${selectedEvents.length} events over ${duration} months`,
      type: ScenarioType.CUSTOM,
      severity,
      events: selectedEvents.map((eventType) => ({
        type: eventType,
        description: eventOptions.find((e) => e.type === eventType)?.description || '',
        impact: {
          markets: ['equity', 'bond'],
          sectors: impactAreas.filter((a) => a.selected).map((a) => a.label.toLowerCase()),
          magnitude: parseFloat(impact.portfolioLoss),
        },
        probability: 70,
        timeframe: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000).toISOString(),
          duration: duration * 30,
        },
        parameters: {
          duration: `${duration} months`,
          severity,
        },
      })),
    };

    try {
      const result = await createScenario.mutateAsync(scenarioData);

      // Save to journey
      setJourneyData('scenarioId', result.id);
      setJourneyData('scenario', result);

      addToast({
        type: 'success',
        message: 'Scenario created successfully!',
      });

      return true;
    } catch (error) {
      console.error('Failed to create scenario:', error);
      addToast({
        type: 'error',
        message: 'Failed to create scenario. Please try again.',
      });
      return false;
    }
  };

  return (
    <JourneyWrapper
      stage={JourneyStage.CREATE_SCENARIO}
      onNext={handleNext}
      nextLabel="Run Simulation"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Market Shock Scenario Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and configure economic event scenarios to test portfolio resilience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scenario Name */}
            <Card>
              <CardBody>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Banking Crisis Q1"
                />
              </CardBody>
            </Card>

            {/* Event Type Selection */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Event Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eventOptions.map((event) => (
                    <button
                      key={event.type}
                      onClick={() => toggleEvent(event.type)}
                      className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${
                        selectedEvents.includes(event.type)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{event.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {event.label}
                            </h4>
                            {selectedEvents.includes(event.type) && (
                              <span className="text-primary-600 dark:text-primary-400">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Severity Level */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Severity Level
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {Object.values(SeveritLevel).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSeverity(level)}
                        className={`
                        flex-1 py-3 px-4 rounded-lg font-medium transition-all
                        ${
                          severity === level
                            ? 'ring-2 ring-primary-500 shadow-md'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                      >
                        <div
                          className={`
                        w-full h-2 rounded-full mb-2
                        ${getSeverityColor(level)}
                      `}
                        />
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {level}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Low Impact</span>
                    <span>High Impact</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Duration */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Duration
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 3, 6, 12].map((months) => (
                    <button
                      key={months}
                      onClick={() => setDuration(months)}
                      className={`
                      py-3 px-4 rounded-lg font-medium transition-all
                      ${
                        duration === months
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                    >
                      {months} {months === 1 ? 'Month' : 'Months'}
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Impact Areas */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Impact Areas
                </h3>
                <div className="flex flex-wrap gap-3">
                  {impactAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => toggleImpactArea(area.id)}
                      className={`
                      px-4 py-2 rounded-full font-medium transition-all
                      ${
                        area.selected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Impact Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <Card className="border-2 border-primary-200 dark:border-primary-800">
                <CardBody>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Estimated Impact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Portfolio Loss
                      </p>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {impact.portfolioLoss}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Increase</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        +{impact.riskIncrease}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Affected Sector
                      </p>
                      <Badge variant="warning" size="lg">
                        {impact.affectedSector}
                      </Badge>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Suggested Rebalance
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {impact.suggestedAction}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </JourneyWrapper>
  );
};

export default ScenarioBuilder;

// Made with Bob
