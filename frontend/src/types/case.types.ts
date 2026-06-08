// Crisis Case Types
// Case-based state management for Financial Crisis Command & Recovery Platform

export interface CrisisCase {
  caseId: string;
  caseName: string;
  scenario: {
    id: string;
    name: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
  portfolio: {
    id: string;
    name: string;
    value: number;
  };
  status: 'draft' | 'active' | 'analyzing' | 'recovering' | 'closed' | 'archived';
  currentStage: CaseStage;
  initialRisk: number;
  currentRisk: number;
  initialLoss: number;
  recoveredLoss: number;
  recoveryProgress: number; // 0-100
  recommendations: string[];
  reportStatus: 'pending' | 'generating' | 'ready';
  createdAt: string; // ISO string for localStorage compatibility
  updatedAt: string; // ISO string for localStorage compatibility
}

export type CaseStage =
  | 'create_scenario'
  | 'validate'
  | 'simulate'
  | 'analyze'
  | 'recover'
  | 'compare'
  | 'close_case';

export interface CaseLibraryItem {
  id: string;
  name: string;
  description: string;
  type: 'historical' | 'template';
  year?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  assumptions: string[];
  estimatedImpact: number;
  icon: string;
}

export interface CaseComparison {
  caseId: string;
  caseName: string;
  scenarioName: string;
  initialLoss: number;
  recoveredLoss: number;
  initialRisk: number;
  finalRisk: number;
  recoveryTime: number; // in days
  actionsApplied: number;
  status: string;
}

export interface CaseReport {
  caseId: string;
  caseName: string;
  generatedAt: string;
  summary: {
    initialRisk: number;
    finalRisk: number;
    riskReduction: number;
    initialLoss: number;
    recoveredLoss: number;
    recoveryProgress: number;
    totalRecoveryTime: number;
  };
  scenario: {
    name: string;
    type: string;
    severity: string;
    duration: number;
  };
  portfolio: {
    name: string;
    initialValue: number;
    finalValue: number;
  };
  recommendations: Array<{
    title: string;
    status: 'applied' | 'rejected' | 'pending';
    impact: string;
  }>;
  agentAnalysis: Array<{
    agent: string;
    finding: string;
    confidence: number;
  }>;
}

// Made with Bob
