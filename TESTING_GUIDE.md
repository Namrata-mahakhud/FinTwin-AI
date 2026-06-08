# FinTwin AI - Testing Guide

## Quick Start Testing

### Prerequisites

```bash
# Ensure you have Node.js 20+ and npm 10+
node --version
npm --version
```

### Build & Run

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Build backend
npm run build:backend

# 3. Build frontend
npm run build:frontend

# 4. Build entire project
npm run build

# 5. Run development servers
npm run dev
```

The application should now be running at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## Manual Testing Checklist

### ✅ Phase 1: Authentication & Navigation

#### Test 1.1: Login

- [ ] Navigate to http://localhost:5173
- [ ] Should redirect to `/login`
- [ ] Enter any credentials (demo mode)
- [ ] Should successfully login and redirect to Mission Control

#### Test 1.2: Sidebar Navigation

- [ ] Verify sidebar shows new structure:
  - 🎯 Mission Control
  - 📚 Case Library
  - ⚡ Scenario Builder
  - 🔬 War Room
  - 💊 Recovery Center
  - 📊 Compare
  - 💼 Portfolio
  - 🔥 Risk Heatmap
  - 🤖 Agent Studio
- [ ] Click each menu item - should navigate correctly
- [ ] Verify active state highlights current page

---

### ✅ Phase 2: Mission Control (Dashboard)

#### Test 2.1: Active Case Display

- [ ] Mission Control should show "Banking Crisis Q1" as active case
- [ ] Verify displayed metrics:
  - Current Risk: 58/100
  - Estimated Loss: -18.5%
  - Recovered: 6.2%
  - Recovery Progress: 35%
- [ ] Verify case status shows "ANALYZING"
- [ ] Verify current stage shows "ANALYZE"

#### Test 2.2: Action Buttons

- [ ] Click "Start New Crisis Simulation" → should navigate to Scenario Builder
- [ ] Click "Continue Active Case" → should navigate based on current stage
- [ ] Click "Load Historical Case" → should navigate to Case Library
- [ ] Click "Open War Room" → should navigate to War Room

#### Test 2.3: Charts & Data

- [ ] Verify Portfolio Performance chart displays
- [ ] Verify Asset Allocation pie chart displays
- [ ] Verify Recent Crisis Cases list shows 5 cases
- [ ] Click on a case in the list → should set as active case

#### Test 2.4: States

- [ ] Verify loading state (if applicable)
- [ ] Verify "No Active Case" state (clear active case to test)
- [ ] Verify error state (if applicable)
- [ ] Verify disclaimer at bottom of page

---

### ✅ Phase 3: Case Library

#### Test 3.1: Case Display

- [ ] Navigate to Case Library
- [ ] Verify 6 historical scenarios display:
  - 2008 Financial Crisis
  - COVID Market Crash
  - Oil Shock 2022
  - Inflation Surge
  - Banking Collapse
  - Currency Crash
- [ ] Verify each case shows:
  - Icon/emoji
  - Severity badge
  - Type badge (Historical/Template)
  - Estimated impact
  - Description

#### Test 3.2: Filters

- [ ] Click "All Cases" → should show all 6 cases
- [ ] Click "Historical" → should show 3 historical cases
- [ ] Click "Templates" → should show 3 template cases

#### Test 3.3: Case Actions

- [ ] Click "View Assumptions" on any case → should expand assumptions list
- [ ] Click "Load Case" → should create new case and navigate to Scenario Builder
- [ ] Click "Run vs Portfolio" → should show alert (demo mode)

#### Test 3.4: Statistics

- [ ] Verify statistics cards show:
  - Total Cases: 6
  - Historical Events: 3
  - Avg Impact: calculated average

---

### ✅ Phase 4: Scenario Validation

#### Test 4.1: Access Validation

- [ ] From Scenario Builder, click "Validate Scenario" (if available)
- [ ] Or navigate to `/scenarios/[id]/validate`
- [ ] Should show validation page

#### Test 4.2: Validation Process

- [ ] Verify loading state with spinner
- [ ] After 1.5 seconds, should show validation results
- [ ] Verify validation checks display:
  - ✓ Scenario Name
  - ✓ Shock Type Selected
  - ✓ Severity Level
  - ✓ Portfolio Selected
  - ✓ Affected Sectors
  - ✓ Duration Specified
  - ✓ Simulation Assumptions

#### Test 4.3: Validation Summary

- [ ] Verify "Validation Passed" message (if all checks pass)
- [ ] Verify check count: "7/7 Checks Passed"
- [ ] Verify scenario summary displays
- [ ] Verify "Assumptions Used" section displays

#### Test 4.4: Actions

- [ ] Click "Back to Scenario" → should navigate to Scenario Builder
- [ ] Click "Run Simulation" → should be enabled and navigate to simulation
- [ ] Verify disclaimer at bottom

---

### ✅ Phase 5: Scenario Compare

#### Test 5.1: Case Selection

- [ ] Navigate to Scenario Compare
- [ ] Verify closed cases display for selection
- [ ] Click on 2-3 cases to select them
- [ ] Verify selection count updates
- [ ] Click "Clear Selection" → should deselect all

#### Test 5.2: Comparison Display

- [ ] With 2+ cases selected, verify comparison table shows:
  - Scenario names
  - Initial Loss vs Recovered Loss
  - Initial Risk vs Final Risk
  - Recovery Time
  - Actions Applied
  - Recovery Progress
- [ ] Verify Risk Score Comparison chart displays
- [ ] Verify Loss Recovery Comparison chart displays

#### Test 5.3: Actions

- [ ] Click "Export Comparison Report" → should show alert (demo mode)
- [ ] Click "Back to Mission Control" → should navigate to dashboard

---

### ✅ Phase 6: Case Closure

#### Test 6.1: Access Closure

- [ ] Navigate to `/case-closure` or `/cases/[id]/closure`
- [ ] Should show Case Closure page

#### Test 6.2: Summary Display

- [ ] Verify "Crisis Case Closed" success message
- [ ] Verify summary cards show:
  - Risk Reduction
  - Loss Recovery
  - Recovery Progress
  - Actions Applied
- [ ] Verify all metrics display correctly

#### Test 6.3: Charts & Analysis

- [ ] Verify Recovery Timeline chart displays
- [ ] Verify Recovery Actions Impact chart displays
- [ ] Verify Recommendations Applied list displays
- [ ] Verify AI Agent Summary displays (3 agents)
- [ ] Verify Report Preview section displays

#### Test 6.4: Actions

- [ ] Click "Export Full Report" → should show loading, then alert
- [ ] Click "Replay Simulation" → should navigate to scenario
- [ ] Click "Archive Case" → should show confirmation, then navigate
- [ ] Click "Start New Crisis Simulation" → should navigate to Scenario Builder

---

### ✅ Phase 7: War Room (Existing)

#### Test 7.1: Access

- [ ] Navigate to War Room from sidebar or Mission Control
- [ ] Verify War Room page loads

#### Test 7.2: Functionality

- [ ] Verify existing War Room features work
- [ ] Verify agent analysis displays (if implemented)
- [ ] Verify timeline displays (if implemented)

---

### ✅ Phase 8: Recovery Center (Recommendations)

#### Test 8.1: Access

- [ ] Navigate to Recovery Center from sidebar
- [ ] Verify Recommendations page loads

#### Test 8.2: Functionality

- [ ] Verify existing recommendations display
- [ ] Verify recommendation actions work
- [ ] Note: Full Recovery Center UI transformation is optional

---

### ✅ Phase 9: Agent Studio (Admin)

#### Test 9.1: Access

- [ ] Navigate to Agent Studio from sidebar
- [ ] Verify Admin page loads

#### Test 9.2: Functionality

- [ ] Verify existing admin features work
- [ ] Note: Full Agent Studio UI transformation is optional

---

### ✅ Phase 10: Integration Testing

#### Test 10.1: Complete Flow

- [ ] Start at Mission Control
- [ ] Click "Start New Crisis Simulation"
- [ ] Create/configure scenario in Scenario Builder
- [ ] Navigate to Scenario Validation
- [ ] Validate scenario
- [ ] Run simulation
- [ ] View War Room analysis
- [ ] Apply recommendations in Recovery Center
- [ ] Compare scenarios
- [ ] Close case
- [ ] Export report

#### Test 10.2: Case State Persistence

- [ ] Create a new case
- [ ] Refresh the page
- [ ] Verify case persists (localStorage)
- [ ] Verify active case is restored

#### Test 10.3: Navigation Flow

- [ ] Test all navigation paths
- [ ] Verify breadcrumbs (if implemented)
- [ ] Verify back buttons work correctly
- [ ] Verify stage progression works

---

## Trustworthiness Verification

### Check on Every Page:

- [ ] "Assumptions Used" section present (where applicable)
- [ ] "Model Confidence" indicators present (85-92%)
- [ ] "Data Source" labels present
- [ ] "Last Updated" timestamps present
- [ ] Disclaimer present: "⚠️ Simulation output is for risk planning and is not financial advice"

---

## Error Handling Verification

### Test Error States:

- [ ] No active case → should show appropriate empty state
- [ ] No closed cases for comparison → should show empty state
- [ ] Invalid route → should redirect appropriately
- [ ] Missing data → should show loading or error state

---

## Responsive Design Testing

### Test on Different Screen Sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Verify:

- [ ] Sidebar collapses appropriately
- [ ] Charts resize correctly
- [ ] Tables scroll horizontally on mobile
- [ ] Buttons stack vertically on mobile

---

## Dark Mode Testing

### Toggle Dark Mode:

- [ ] All pages render correctly in dark mode
- [ ] Charts use appropriate dark mode colors
- [ ] Text remains readable
- [ ] Borders and backgrounds adjust properly

---

## Performance Testing

### Check Performance:

- [ ] Initial page load < 3 seconds
- [ ] Navigation between pages is smooth
- [ ] Charts render without lag
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

---

## Browser Compatibility

### Test in Multiple Browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

## Known Limitations (Demo Mode)

The following features show alerts instead of full functionality:

- Export Report → Shows alert
- Run Against Portfolio → Shows alert
- Some backend integrations → Use seed data

---

## Troubleshooting

### If builds fail:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build artifacts
rm -rf frontend/dist backend/dist

# Rebuild
npm run build
```

### If routes don't work:

- Check that all new pages are imported in `router/index.tsx`
- Verify route paths match navigation links
- Check browser console for errors

### If data doesn't persist:

- Check browser localStorage
- Verify Zustand persist middleware is working
- Check for localStorage quota errors

---

## Success Criteria

All tests should pass with:

- ✅ No console errors
- ✅ All pages load correctly
- ✅ All navigation works
- ✅ All charts display
- ✅ All data persists
- ✅ All states handle correctly
- ✅ Trustworthiness elements present
- ✅ Responsive design works
- ✅ Dark mode works

---

## Reporting Issues

If you find issues, please note:

1. **Page/Component**: Where the issue occurs
2. **Steps to Reproduce**: How to trigger the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Browser/Environment**: Browser version, OS, screen size
6. **Console Errors**: Any errors in browser console

---

## Next Steps After Testing

Once testing is complete:

1. Document any issues found
2. Prioritize fixes (critical vs. nice-to-have)
3. Implement fixes
4. Re-test
5. Deploy to staging/production

---

**Happy Testing!** 🚀
