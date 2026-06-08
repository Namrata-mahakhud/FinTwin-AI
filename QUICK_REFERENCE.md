# FinTwin AI - Quick Reference Guide

## 🎯 New Features Overview

### Mission Control (Dashboard)

**What**: Central command center for crisis management  
**Access**: `/dashboard` or sidebar "Mission Control"  
**Key Features**:

- Active crisis case display
- Real-time risk and loss metrics
- Recovery progress tracking
- Quick action buttons
- Recent cases list

### Case Library

**What**: Historical crisis scenarios and templates  
**Access**: `/case-library` or sidebar "Case Library"  
**Key Features**:

- 6 pre-loaded crisis scenarios
- Filter by Historical/Template
- View assumptions
- Load case or run against portfolio
- Severity and impact indicators

### Scenario Validation

**What**: Pre-simulation validation checks  
**Access**: `/scenarios/:id/validate`  
**Key Features**:

- 7 validation checks
- Pass/fail/warning status
- Scenario summary
- Assumptions display
- Enable/disable simulation based on validation

### Scenario Compare

**What**: Side-by-side scenario comparison  
**Access**: `/scenarios/compare` or sidebar "Compare"  
**Key Features**:

- Select 2-3 cases to compare
- Detailed comparison table
- Risk and loss charts
- Export comparison report

### Case Closure

**What**: Final crisis case summary and report  
**Access**: `/case-closure` or `/cases/:id/closure`  
**Key Features**:

- Before/after metrics
- Recovery timeline chart
- Actions impact visualization
- AI agent summary
- Export report functionality

---

## 🗺️ User Journey Map

```
1. Mission Control
   ↓ Start New Crisis
2. Scenario Builder
   ↓ Configure Scenario
3. Scenario Validation
   ↓ Validate & Approve
4. Run Simulation
   ↓ Execute Analysis
5. War Room
   ↓ Review AI Analysis
6. Recovery Center
   ↓ Apply Recommendations
7. Scenario Compare
   ↓ Compare Outcomes
8. Case Closure
   ↓ Export Report
```

---

## 📊 Key Metrics Tracked

### Risk Metrics

- **Initial Risk**: Starting risk score (0-100)
- **Current Risk**: Current risk score after actions
- **Risk Reduction**: Points reduced from initial

### Loss Metrics

- **Initial Loss**: Estimated portfolio loss (%)
- **Recovered Loss**: Amount recovered through actions (%)
- **Recovery Progress**: Overall recovery percentage (0-100%)

### Case Metrics

- **Case Status**: draft, active, analyzing, recovering, closed, archived
- **Current Stage**: create_scenario, validate, simulate, analyze, recover, compare, close_case
- **Recovery Time**: Days from case creation to closure
- **Actions Applied**: Number of recommendations implemented

---

## 🎨 UI Elements

### Status Badges

- 🟢 **CLOSED** - Case successfully completed
- 🔵 **ANALYZING** - AI agents processing
- 🟡 **RECOVERING** - Applying recommendations
- 🟣 **ACTIVE** - Case in progress
- ⚪ **DRAFT** - Case being created

### Severity Levels

- 🔴 **CRITICAL** - Severe market impact
- 🟠 **HIGH** - Significant impact
- 🟡 **MEDIUM** - Moderate impact
- 🟢 **LOW** - Minor impact

### Validation Status

- ✓ **PASS** - Check passed
- ✗ **FAIL** - Check failed
- ⚠ **WARNING** - Check passed with warnings

---

## 🔑 Keyboard Shortcuts

_Note: Standard browser shortcuts apply_

- `Ctrl/Cmd + K` - Focus search (if implemented)
- `Esc` - Close modals
- Browser back/forward for navigation

---

## 📱 Responsive Breakpoints

- **Desktop**: 1920px+ (full layout)
- **Laptop**: 1366px-1919px (standard layout)
- **Tablet**: 768px-1365px (adjusted layout)
- **Mobile**: <768px (stacked layout)

---

## 🎨 Color Coding

### Risk Levels

- **80-100**: Red (Critical)
- **60-79**: Orange (High)
- **40-59**: Yellow (Medium)
- **0-39**: Green (Low)

### Status Colors

- **Success**: Green
- **Warning**: Yellow
- **Error**: Red
- **Info**: Blue
- **Neutral**: Gray

---

## 📋 Data Sources

All simulations use:

- **Federal Reserve Economic Data (FRED)**
- **Bloomberg Terminal**
- **Historical Market Analysis**
- **Model Confidence**: 85-92%
- **Last Updated**: January 2024

---

## ⚠️ Important Notes

### Demo Mode

- Uses seeded data for immediate testing
- Some features show alerts instead of full functionality
- No real backend integration required

### Data Persistence

- Cases stored in browser localStorage
- Persists across page refreshes
- Clear browser data to reset

### Trustworthiness

Every page includes:

- Assumptions used
- Model confidence scores
- Data source attribution
- Clear disclaimers

---

## 🚀 Quick Actions

### From Mission Control

1. **Start New Crisis** → Scenario Builder
2. **Continue Active Case** → Current stage page
3. **Load Historical Case** → Case Library

### From Case Library

1. **Load Case** → Create new case from template
2. **Run vs Portfolio** → Select portfolio and run

### From Scenario Validation

1. **Back to Scenario** → Edit scenario
2. **Run Simulation** → Execute simulation

### From Case Closure

1. **Export Report** → Download PDF (demo)
2. **Replay Simulation** → Re-run scenario
3. **Archive Case** → Move to archive

---

## 🔧 Troubleshooting

### Page Not Loading

- Check browser console for errors
- Verify route exists in router
- Clear browser cache

### Data Not Persisting

- Check localStorage quota
- Verify browser allows localStorage
- Check for private/incognito mode

### Charts Not Displaying

- Verify recharts library loaded
- Check browser compatibility
- Inspect console for errors

---

## 📞 Support

For issues or questions:

1. Check `TESTING_GUIDE.md` for detailed testing steps
2. Review `IMPLEMENTATION_SUMMARY.md` for technical details
3. Check browser console for error messages
4. Document issue with reproduction steps

---

## 🎓 Best Practices

### Creating Cases

1. Use descriptive case names
2. Select appropriate severity
3. Validate before running
4. Review assumptions

### Comparing Scenarios

1. Select similar case types
2. Compare 2-3 cases maximum
3. Focus on key metrics
4. Export for documentation

### Closing Cases

1. Review all metrics
2. Verify recommendations applied
3. Export report before archiving
4. Document lessons learned

---

## 📈 Success Metrics

### Good Case Management

- Risk reduced by 10+ points
- Loss recovery >50%
- Recovery progress >70%
- All recommendations reviewed

### Effective Comparison

- Clear metric differences
- Actionable insights
- Documented learnings
- Exported reports

---

## 🔄 Update Frequency

- **Seed Data**: Static (demo mode)
- **Market Data**: Real-time (when integrated)
- **Model Confidence**: Updated quarterly
- **Assumptions**: Reviewed monthly

---

## 📚 Related Documentation

- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation
- `TESTING_GUIDE.md` - Comprehensive testing
- `QUICKSTART.md` - Quick start guide

---

**Version**: 1.0.0  
**Last Updated**: May 26, 2026  
**Platform**: FinTwin AI Crisis Command & Recovery
