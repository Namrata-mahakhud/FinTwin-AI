// Simulation Flow Types
// Multi-step simulation execution flow types

export type SimulationFlowStep =
  | 'validation'
  | 'preview'
  | 'agent-processing'
  | 'results'
  | 'recovery';

export interface ValidationCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  icon: string;
}

export interface ValidationResult {
  scenarioId: string;
  scenarioName: string;
  eventsSelected: Array<{
    type: string;
    description: string;
  }>;
  severity: string;
  duration?: number;
  portfolioId?: string;
  checks: ValidationCheck[];
  canProceed: boolean;
  missingRequirements?: string[];
}

export interface SectorPreview {
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact: number;
  icon: string;
  color: string;
}

export interface ImpactPreview {
  estimatedLoss: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recoveryTime: number; // in months
  confidence: number; // percentage
  affectedSectors: SectorPreview[];
  portfolioValue: {
    before: number;
    after: number;
  };
}

export interface AgentProgress {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number; // 0-100
  message: string;
  icon: string;
  color: string;
  startTime?: Date;
  endTime?: Date;
  details?: string[];
}

export interface RecoveryAction {
  id: string;
  title: string;
  description: string;
  type: 'rebalance' | 'hedge' | 'diversify' | 'reduce_exposure';
  estimatedImpact: {
    riskReduction: number;
    lossReduction: number;
  };
  selected: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface RecoveryResult {
  originalRisk: number;
  newRisk: number;
  originalLoss: number;
  newLoss: number;
  appliedActions: RecoveryAction[];
  timestamp: Date;
}

export interface SimulationHistoryItem {
  id: string;
  scenarioId: string;
  scenarioName: string;
  status: 'completed' | 'running' | 'recovered' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  results: {
    loss: number;
    riskScore: number;
    recoveryApplied: boolean;
    portfolioValue: {
      before: number;
      after: number;
    };
  };
  duration?: number; // in seconds
}

export interface SimulationFlowState {
  currentStep: SimulationFlowStep;
  scenarioId?: string;
  validationResult?: ValidationResult;
  impactPreview?: ImpactPreview;
  agentProgress?: AgentProgress[];
  simulationId?: string;
  selectedRecoveryActions?: RecoveryAction[];
  recoveryResult?: RecoveryResult;
  error?: string;
}

// Made with Bob
