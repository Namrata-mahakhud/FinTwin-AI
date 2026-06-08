# Journey Navigation Fix

## Issue
When clicking "Run Simulation" button in the Scenario Builder, the application was logging out instead of navigating to the simulation page.

## Root Cause
The journey navigation system was trying to navigate to `/simulations/run`, but this route didn't exist in the router configuration. When React Router couldn't find the route, it fell back to the catch-all route which redirected to `/dashboard`, and the authentication guard interpreted this as requiring login.

## Solution

### 1. Created RunSimulation Page
**File**: `frontend/src/pages/RunSimulation/index.tsx`

A dedicated page that:
- Automatically starts simulation when loaded
- Shows animated progress with phases (Initialize → Load → Fetch Data → Run → Calculate → Generate)
- Displays real-time progress bar and statistics
- Saves simulation results to journey store
- Automatically navigates to War Room (Crisis Center) when complete

### 2. Added Missing Routes
**File**: `frontend/src/router/index.tsx`

Added routes that were referenced in `STAGE_CONFIG` but missing from router:
- `/simulations/run` → RunSimulation page
- `/war-room` → FinancialWarRoom page
- `/portfolio/impact` → PortfolioAnalysis page
- `/recovery` → SimulationResults page
- `/agent-studio` → Admin page
- `/export` → SimulationResults page

### 3. Journey Flow Now Works
The complete journey flow is now functional:

```
Dashboard (Start Journey)
    ↓
Create Scenario (/scenarios/new)
    ↓ [Click "Run Simulation"]
Run Simulation (/simulations/run) ← NEW PAGE
    ↓ [Auto-navigates after completion]
Crisis Center (/war-room)
    ↓
Portfolio Impact (/portfolio/impact)
    ↓
Risk Heatmap (/risk-heatmap)
    ↓
AI Recommendations (/recommendations)
    ↓
Recovery (/recovery)
    ↓
Agent Studio (/agent-studio)
    ↓
Export Report (/export)
```

## Features of RunSimulation Page

1. **Auto-Start**: Simulation begins automatically when page loads
2. **Progress Tracking**: Visual progress bar with percentage
3. **Phase Display**: Shows current simulation phase
4. **Statistics**: Real-time stats (phases complete, scenarios tested, events analyzed)
5. **Journey Integration**: Saves results to journey store
6. **Auto-Navigation**: Automatically proceeds to next stage when complete
7. **Error Handling**: Graceful error handling with toast notifications

## Testing

1. Start journey from Dashboard
2. Create a scenario with events
3. Click "Run Simulation"
4. Watch the simulation progress (takes ~8 seconds)
5. Automatically navigates to War Room when complete

## Technical Details

- Uses `JourneyWrapper` for consistent layout
- Integrates with `useJourneyStore` for state management
- Mock simulation with realistic timing
- Saves `simulationId` and `simulationResults` to journey data
- Marks `RUN_SIMULATION` stage as complete before navigation

## Files Modified/Created

**Created**:
- `frontend/src/pages/RunSimulation/index.tsx` (186 lines)
- `docs/JOURNEY_NAVIGATION_FIX.md` (this file)

**Modified**:
- `frontend/src/router/index.tsx` (added 7 new routes)

---

Made with Bob