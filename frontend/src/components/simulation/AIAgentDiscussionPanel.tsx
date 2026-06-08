// AI Agent Discussion Panel Component
// Shows multi-agent collaboration and decision-making process

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Badge } from '@/components/common';

interface AgentMessage {
  agent: string;
  agentType: 'market' | 'risk' | 'portfolio' | 'recommendation' | 'reporting';
  message: string;
  icon: string;
  timestamp: number;
  confidence?: number;
  data?: Record<string, any>;
}

interface AIAgentDiscussionPanelProps {
  messages: AgentMessage[];
  isActive?: boolean;
}

const AIAgentDiscussionPanel: React.FC<AIAgentDiscussionPanelProps> = ({
  messages,
  isActive = false,
}) => {
  const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || messages.length === 0) {
      setVisibleMessages([]);
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < messages.length) {
          setVisibleMessages((current) => [...current, messages[prev]]);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive, messages]);

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'market':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300';
      case 'risk':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300';
      case 'portfolio':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300';
      case 'recommendation':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300';
      case 'reporting':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-500 text-gray-700 dark:text-gray-300';
    }
  };

  const getAgentBadgeColor = (type: string) => {
    switch (type) {
      case 'market':
        return 'info';
      case 'risk':
        return 'danger';
      case 'portfolio':
        return 'default';
      case 'recommendation':
        return 'success';
      case 'reporting':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card className="border-2 border-primary-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🤖</span>
              AI Agent Discussion Panel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Multi-agent collaboration in real-time
            </p>
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {visibleMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-gray-600 dark:text-gray-400">
              Waiting for agent collaboration to begin...
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {visibleMessages.map((msg, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border-l-4 animate-slide-in-right
                  ${getAgentColor(msg.agentType)}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{msg.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{msg.agent}</div>
                      <Badge variant={getAgentBadgeColor(msg.agentType)} size="sm">
                        {msg.agentType}
                      </Badge>
                    </div>
                  </div>
                  {msg.confidence && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {msg.confidence}%
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {msg.message}
                </p>

                {msg.data && Object.keys(msg.data).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(msg.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {typeof value === 'number' ? value.toFixed(2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Agent Summary */}
        {visibleMessages.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-5 gap-2">
              {['market', 'risk', 'portfolio', 'recommendation', 'reporting'].map((type) => {
                const count = visibleMessages.filter((m) => m.agentType === type).length;
                return (
                  <div key={type} className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{count}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AIAgentDiscussionPanel;

// Made with Bob
