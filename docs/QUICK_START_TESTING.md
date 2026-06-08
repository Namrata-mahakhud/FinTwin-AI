# Quick Start Testing Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB running (or connection string)
- Git repository cloned

### Step 1: Environment Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Update .env with your values:
# MONGODB_URI=mongodb://localhost:27017/fintwin
# JWT_SECRET=your-secret-key
# PORT=3000

# Start backend
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Step 2: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🧪 Testing the Multi-Step Flow

### Test Scenario 1: Complete Flow

1. **Login** at http://localhost:5173/login
2. **Create Scenario**:
   - Navigate to "Scenarios" → "New Scenario"
   - Name: "Banking Crisis Q1"
   - Type: "Market Crash"
   - Severity: "High"
   - Duration: 90 days
   - Click "Save"

3. **Run Simulation**:
   - Click "Run Simulation" button
   - **Step 1 - Validation**: Wait for checks to complete (2s)
   - **Step 2 - Preview**: Review impact preview (2s)
   - **Step 3 - Agent Processing**: Watch agents execute (30s)
   - **Step 4 - Recovery**: Select recovery actions
   - **Step 5 - Results**: View in War Room

4. **View History**:
   - Navigate to `/simulations/history`
   - See your completed simulation
   - Try replay, compare, export

### Test Scenario 2: Validation Failure

1. Create scenario with missing fields
2. Click "Run Simulation"
3. Verify validation fails
4. See missing requirements
5. Proceed button should be disabled

### Test Scenario 3: Recovery Actions

1. Complete simulation
2. In recovery modal, select multiple actions
3. Watch impact calculation update
4. Apply recovery
5. Verify risk and loss reduce

## 📊 Expected Results

### Validation Step

```
✓ Scenario Name → PASS
✓ Minimum Events → PASS (3 events)
✓ Severity Selected → PASS (HIGH)
✓ Portfolio Exists → PASS
✓ Duration Specified → PASS (3 months)

Ready for simulation ✓
```

### Preview Step

```
Expected Loss: -25%
Banking Risk: HIGH
Recovery Time: 4 Months
Confidence: 82%

Affected Sectors:
🏦 Banking      🔴 -35%
⚡ Energy       🟠 -28%
💻 Technology   🟡 -15%
🏥 Healthcare   🟢 -5%
```

### Agent Processing

```
📊 Market Agent        ✓ Complete (5s)
⚠️ Risk Agent         ✓ Complete (8s)
💼 Portfolio Agent    ✓ Complete (10s)
🎯 Recommendation     ✓ Complete (5s)
📄 Reporting Agent    ✓ Complete (2s)

Overall Progress: 100%
```

### Recovery Results

```
Original Risk: 84
New Risk: 61 (-23)

Original Loss: -25%
New Loss: -14% (+11%)

Actions Applied: 3
```

## 🐛 Common Issues & Fixes

### Issue 1: Backend Won't Start

**Error**: `Cannot connect to MongoDB`
**Fix**:

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Issue 2: Frontend Build Errors

**Error**: `Module not found`
**Fix**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Authentication Errors

**Error**: `401 Unauthorized`
**Fix**:

- Ensure you're logged in
- Check JWT token in localStorage
- Verify backend JWT_SECRET matches

### Issue 4: Modal Not Opening

**Error**: Modal doesn't appear
**Fix**:

- Check browser console for errors
- Verify scenario ID exists in journey store
- Clear localStorage and try again

### Issue 5: TypeScript Errors

**Error**: Type errors in IDE
**Fix**:

- These are minor and don't affect functionality
- Run `npm run build` to verify actual errors
- Most are related to flexible `any` types during development

## 🔍 Debugging Tips

### Frontend Debugging

```javascript
// Check journey store
console.log(useJourneyStore.getState());

// Check simulation flow store
console.log(useSimulationFlowStore.getState());

// Check current step
console.log(useSimulationFlowStore.getState().currentStep);
```

### Backend Debugging

```bash
# Enable debug logs
DEBUG=* npm run dev

# Check API endpoints
curl http://localhost:3000/api/v1/scenarios/:id/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Browser DevTools

1. Open DevTools (F12)
2. **Console**: Check for errors
3. **Network**: Monitor API calls
4. **Application**: Check localStorage
5. **React DevTools**: Inspect component state

## ✅ Verification Checklist

After testing, verify:

- [ ] All modals open and close properly
- [ ] Progress indicator updates correctly
- [ ] Data flows between steps
- [ ] Recovery actions calculate correctly
- [ ] History page displays simulations
- [ ] Export downloads JSON file
- [ ] No console errors
- [ ] Mobile responsive (test on phone)
- [ ] Dark mode works
- [ ] Back buttons work
- [ ] Cancel confirmation works

## 📈 Performance Checks

Monitor these metrics:

- **Validation**: Should complete in < 2s
- **Preview**: Should complete in < 2s
- **Agent Processing**: Should complete in < 30s
- **Recovery**: Should apply in < 3s
- **Page Load**: Should load in < 2s

## 🎯 Success Criteria

The implementation is successful if:

1. ✅ User can complete entire flow without errors
2. ✅ All modals display correctly
3. ✅ Data persists between steps
4. ✅ Recovery actions work
5. ✅ History page shows simulations
6. ✅ No critical console errors
7. ✅ Mobile responsive
8. ✅ Performance meets targets

## 📞 Support

If you encounter issues:

1. Check `docs/TESTING_AND_FIXES.md` for detailed fixes
2. Review `docs/MULTI_STEP_SIMULATION_FLOW.md` for architecture
3. Check browser console for specific errors
4. Verify all environment variables are set
5. Ensure MongoDB is running

## 🎉 Next Steps

After successful testing:

1. Deploy to staging environment
2. Conduct user acceptance testing
3. Monitor error logs
4. Gather user feedback
5. Iterate and improve

---

**Happy Testing!** 🚀

// Made with Bob
