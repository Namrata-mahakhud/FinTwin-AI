# Multi-Step Simulation Flow Implementation

## Overview

This document describes the complete implementation of the multi-step simulation execution flow that transforms the "Run Simulation" experience from a single-click action into an engaging, educational, and transparent process.

## Architecture

### Flow Diagram

```
Select Events
      ↓
Validate Scenario
      ↓
Preview Impact
      ↓
Agent Analysis
      ↓
Confirm Simulation
      ↓
Run Engine
      ↓
Results
      ↓
Recovery Actions
      ↓
History
```

## Implementation Components

### 1. Frontend Components

#### Type Definitions
- **Location**: `frontend/src/types/simulation-flow.types.ts`
- **Purpose**: Defines all TypeScript interfaces for the simulation flow
- **Key Types**:
  - `SimulationFlowStep`: Union type for flow steps
  - `ValidationResult`: Scenario validation data
  - `ImpactPreview`: Quick impact estimation
  - `AgentProgress`: Real-time agent execution tracking
  - `RecoveryAction`: Recovery strategy options
  - `SimulationHistoryItem`: Historical simulation data

#### State Management
- **Location**: `frontend/src/store/simulationFlowStore.ts`
- **Purpose**: Zustand store for managing simulation flow state
- **Features**:
  - Persistent storage of current step
  - Navigation between steps
  - State for each flow stage
  - Reset functionality

#### Modal Components

##### ScenarioValidationModal
- **Location**: `frontend/src/components/simulation/ScenarioValidationModal.tsx`
- **Purpose**: Step 1 - Validates scenario before simulation
- **Features**:
  - Checks scenario name, events, severity, portfolio, duration
  - Visual status indicators (pass/fail/warning)
  - Displays missing requirements
  - Prevents proceeding if validation fails

##### ImpactPreviewModal
- **Location**: `frontend/src/components/simulation/ImpactPreviewModal.tsx`
- **Purpose**: Step 2 - Shows estimated impact before full simulation
- **Features**:
  - Quick calculation (< 2 seconds)
  - Expected loss percentage
  - Risk level assessment
  - Recovery time estimation
  - Sector-by-sector impact breakdown
  - Portfolio value before/after comparison

##### AgentProcessingModal
- **Location**: `frontend/src/components/simulation/AgentProcessingModal.tsx`
- **Purpose**: Step 3 - Real-time agent execution tracking
- **Features**:
  - Sequential agent execution visualization
  - Progress bars for each agent
  - Status indicators (pending/running/completed/error)
  - Detailed messages for each phase
  - Overall progress percentage
  - Execution timing information

##### RecoveryActionsModal
- **Location**: `frontend/src/components/simulation/RecoveryActionsModal.tsx`
- **Purpose**: Step 5 - Apply recovery strategies
- **Features**:
  - Multiple recovery action options
  - Selectable checkboxes
  - Estimated impact for each action
  - Cumulative effect calculation
  - Before/after comparison
  - Skip option available

#### Pages

##### RunSimulation (Updated)
- **Location**: `frontend/src/pages/RunSimulation/index.tsx`
- **Purpose**: Orchestrates the entire multi-step flow
- **Features**:
  - Progress indicator showing current step
  - Modal state management
  - Step-by-step navigation
  - Data passing between steps
  - Integration with journey store
  - Error handling and cancellation

##### SimulationHistory
- **Location**: `frontend/src/pages/SimulationHistory/index.tsx`
- **Purpose**: View, replay, and compare past simulations
- **Features**:
  - List of all simulations
  - Status filtering (completed/running/recovered/failed)
  - Selection for comparison
  - Replay functionality
  - Export to JSON
  - Detailed results summary

### 2. Backend Components (To Be Implemented)

#### Validation Endpoint
```typescript
POST /api/v1/scenarios/:id/validate
```
- Validates scenario configuration
- Checks all prerequisites
- Returns validation result with detailed checks

#### Preview Calculation
```typescript
POST /api/v1/scenarios/:id/preview
```
- Quick impact estimation
- No Monte Carlo simulation
- Returns estimated metrics in < 1 second

#### Recovery Application
```typescript
POST /api/v1/simulations/:id/apply-recovery
```
- Applies selected recovery actions
- Recalculates portfolio metrics
- Returns updated risk and loss values

#### Simulation History
```typescript
GET /api/v1/simulations/history
GET /api/v1/simulations/:id/replay
GET /api/v1/simulations/compare?ids=id1,id2
GET /api/v1/simulations/:id/export
```
- Retrieves simulation history
- Supports replay functionality
- Comparison between simulations
- Export to various formats

## User Flow

### Step 1: Validation (5-10 seconds)
1. User clicks "Run Simulation"
2. Validation modal opens automatically
3. System checks:
   - ✓ Scenario name exists
   - ✓ Minimum 1 event selected
   - ✓ Severity level chosen
   - ✓ Portfolio exists
   - ✓ Duration specified
4. If all pass: "Proceed to Impact Preview" button enabled
5. If any fail: Shows missing requirements, button disabled

### Step 2: Impact Preview (10-15 seconds)
1. User clicks "Proceed to Impact Preview"
2. Preview modal opens
3. Quick calculation runs (< 2 seconds)
4. Displays:
   - Expected loss: -25%
   - Risk level: HIGH
   - Recovery time: 4 months
   - Confidence: 82%
   - Sector impacts with color coding
5. User reviews and clicks "Start Agent Analysis"

### Step 3: Agent Processing (20-30 seconds)
1. Agent processing modal opens
2. Agents execute sequentially:
   - Market Agent (analyzing inflation, correlations)
   - Risk Agent (identifying exposures, calculating scores)
   - Portfolio Agent (running stress tests, calculating loss)
   - Recommendation Agent (generating strategies)
   - Reporting Agent (compiling results)
3. Real-time progress updates
4. Overall progress bar
5. Automatically proceeds when complete

### Step 4: Results Display (User-controlled)
1. Simulation results stored
2. User sees complete analysis
3. Portfolio impact visualization
4. Risk assessment
5. Timeline of events

### Step 5: Recovery Actions (Optional)
1. Recovery modal opens
2. User selects from recommended actions:
   - Reduce banking exposure
   - Increase bond allocation
   - Add gold hedge
   - Currency risk hedge
   - Portfolio rebalancing
3. Shows projected impact of selections
4. User can apply or skip
5. If applied: Recalculates metrics

### Step 6: Navigation to War Room
1. Journey stage completed
2. Navigates to Financial War Room
3. Full results available
4. Simulation saved to history

## Benefits

### User Experience
- ✅ **Transparency**: Users see what's happening at each stage
- ✅ **Control**: Users can review before committing
- ✅ **Education**: Preview helps understand impact
- ✅ **Confidence**: Validation prevents errors
- ✅ **Engagement**: Multi-step process is more interactive

### Technical
- ✅ **Error Prevention**: Validation catches issues early
- ✅ **Performance**: Preview uses quick calculations
- ✅ **Modularity**: Each step is independent
- ✅ **Testability**: Components can be tested individually
- ✅ **Maintainability**: Clear separation of concerns

### Business
- ✅ **User Retention**: Engaging flow keeps users interested
- ✅ **Learning**: Users understand the simulation process
- ✅ **Trust**: Transparency builds confidence
- ✅ **Recovery**: Built-in recovery actions provide value
- ✅ **History**: Users can track and compare simulations

## Routes

```typescript
/simulations/run              // Multi-step simulation flow
/simulations/history          // Simulation history page
/simulations/:id/results      // Detailed results
/simulations/:id/replay       // Replay simulation
/simulations/compare          // Compare simulations
```

## State Flow

```typescript
// Initial State
{
  currentStep: 'validation',
  scenarioId: undefined,
  validationResult: undefined,
  impactPreview: undefined,
  agentProgress: undefined,
  simulationId: undefined,
  selectedRecoveryActions: undefined,
  recoveryResult: undefined,
}

// After Validation
{
  currentStep: 'preview',
  scenarioId: 'scn_001',
  validationResult: { canProceed: true, checks: [...] },
  ...
}

// After Preview
{
  currentStep: 'agent-processing',
  impactPreview: { estimatedLoss: -25, riskLevel: 'high', ... },
  ...
}

// After Agent Processing
{
  currentStep: 'recovery',
  simulationId: 'sim_001',
  agentProgress: [{ status: 'completed', ... }],
  ...
}

// After Recovery
{
  currentStep: 'recovery',
  recoveryResult: { newRisk: 61, newLoss: -14, ... },
  ...
}
```

## Error Handling

### Validation Errors
- Display specific missing requirements
- Disable proceed button
- Provide guidance on how to fix

### Preview Calculation Errors
- Show error message
- Allow retry
- Option to go back to validation

### Agent Processing Errors
- Mark failed agent with error status
- Show error message
- Option to retry or cancel

### Recovery Application Errors
- Show error message
- Allow retry
- Option to skip recovery

## Future Enhancements

1. **Real-time Updates**: WebSocket/SSE for live agent progress
2. **Comparison View**: Side-by-side simulation comparison
3. **Export Formats**: PDF, Excel, CSV export options
4. **Scheduled Simulations**: Run simulations on schedule
5. **Notification System**: Email/SMS when simulation completes
6. **Advanced Filters**: Filter history by date, scenario, status
7. **Batch Operations**: Run multiple simulations
8. **Custom Recovery**: User-defined recovery actions
9. **AI Insights**: GPT-powered analysis and recommendations
10. **Collaboration**: Share simulations with team members

## Testing Checklist

- [ ] Validation modal opens on page load
- [ ] Validation checks execute correctly
- [ ] Preview calculation completes in < 2 seconds
- [ ] Agent processing shows real-time progress
- [ ] Recovery actions calculate correctly
- [ ] Navigation between steps works
- [ ] Back button functionality
- [ ] Cancel confirmation works
- [ ] Data persists across steps
- [ ] History page displays simulations
- [ ] Replay functionality works
- [ ] Export downloads JSON file
- [ ] Comparison selects multiple items
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Error handling for all scenarios

## Deployment Notes

1. Ensure all modal components are exported in index.ts
2. Add SimulationHistory route to router
3. Update navigation menu to include History link
4. Test complete flow end-to-end
5. Update user documentation
6. Add analytics tracking for each step
7. Monitor performance metrics
8. Set up error logging

## Support

For questions or issues:
- Check this documentation first
- Review component source code
- Test in development environment
- Contact development team

---

**Last Updated**: 2024-01-26
**Version**: 1.0.0
**Status**: Implementation Complete (Frontend)

// Made with Bob