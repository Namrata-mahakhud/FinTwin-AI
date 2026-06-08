// Market Shock Timeline Component
// Displays animated vertical timeline of market events

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/common';

interface TimelineEvent {
  day: number;
  title: string;
  description: string;
  icon: string;
  impact: number;
  riskScore: number;
  type: 'shock' | 'impact' | 'recovery';
}

interface MarketShockTimelineProps {
  events: TimelineEvent[];
  isAnimating?: boolean;
}

const MarketShockTimeline: React.FC<MarketShockTimelineProps> = ({
  events,
  isAnimating = true,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'shock':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'impact':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'recovery':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'shock':
        return 'bg-red-500 text-white';
      case 'impact':
        return 'bg-orange-500 text-white';
      case 'recovery':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📅</span>
          Market Shock Timeline
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          30-day simulation of market events and portfolio impact
        </p>
      </CardHeader>
      <CardBody>
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-orange-500 to-green-500" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div
                key={index}
                className={`
                  relative pl-20 animate-slide-in-left
                  ${isAnimating ? 'opacity-0' : 'opacity-100'}
                `}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Day Marker */}
                <div className="absolute left-0 flex items-center gap-3">
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-2xl
                      shadow-lg border-4 border-white dark:border-gray-800
                      ${getIconColor(event.type)}
                    `}
                  >
                    {event.icon}
                  </div>
                </div>

                {/* Event Card */}
                <button
                  onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    hover:shadow-lg hover:scale-[1.02]
                    ${getEventColor(event.type)}
                    ${selectedEvent === index ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        DAY {event.day}
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {event.title}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${event.impact < 0 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {event.impact > 0 ? '+' : ''}
                        {event.impact}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Risk: {event.riskScore}
                      </div>
                    </div>
                  </div>

                  {selectedEvent === index && (
                    <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 animate-fade-in">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  )}
                </button>

                {/* Connector Arrow */}
                {index < events.length - 1 && (
                  <div className="absolute left-8 -bottom-3 text-2xl text-gray-400 dark:text-gray-600 animate-bounce">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {events.filter((e) => e.type === 'shock').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Market Shocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {events.filter((e) => e.type === 'impact').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Portfolio Impacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {events.filter((e) => e.type === 'recovery').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Recovery Events</div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MarketShockTimeline;

// Made with Bob
