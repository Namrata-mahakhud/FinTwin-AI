# FinTwin AI Frontend - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### Step 3: Login with Demo Account

The application includes a **demo mode** that works without a backend!

#### Option 1: Quick Demo Login Button
1. Open http://localhost:5173
2. Click the **"🚀 Quick Demo Login"** button
3. You'll be automatically logged in and redirected to the dashboard

#### Option 2: Manual Login
Use these credentials:
- **Email**: `demo@fintwin.ai`
- **Password**: `demo123` (any password works in demo mode)

Or for admin access:
- **Email**: `admin@fintwin.ai`
- **Password**: `admin123` (any password works in demo mode)

## 📱 Navigation

Once logged in, you can navigate through all pages:

### Main Pages
1. **Dashboard** (`/dashboard`) - Overview with metrics and recent activity
2. **Scenarios** (`/scenarios`) - Create and manage economic scenarios
3. **Portfolio** (`/portfolio`) - Portfolio analysis and holdings
4. **Risk Heatmap** (`/risk-heatmap`) - Visual risk analysis
5. **Simulations** (`/simulations`) - Run and view simulations
6. **Recommendations** (`/recommendations`) - AI-powered recommendations
7. **Admin** (`/admin`) - Admin panel (admin role only)

### UI Features
- **Sidebar Navigation** - Click any menu item to navigate
- **Sidebar Toggle** - Click the hamburger menu in header to collapse/expand
- **Theme Toggle** - Click the sun/moon icon to switch between light/dark mode
- **User Menu** - Click logout icon to sign out

## 🎨 Demo Mode Features

The demo mode provides:
- ✅ Full navigation between all pages
- ✅ Persistent login state (survives page refresh)
- ✅ Theme preferences saved to localStorage
- ✅ Sidebar state persistence
- ✅ All UI components functional
- ✅ No backend required

## 🔧 Development Features

### Hot Module Replacement (HMR)
Changes to code will automatically reload in the browser.

### TypeScript Support
Full type checking and IntelliSense in VS Code.

### Tailwind CSS
Utility-first CSS framework for rapid UI development.

### React Query DevTools
Open the React Query DevTools panel (bottom-left corner) to inspect queries and cache.

## 📊 Page Descriptions

### Dashboard
- Portfolio value metrics
- Active scenarios count
- Risk score indicator
- Recent simulations
- Quick action buttons

### Scenario Builder
- Create custom economic scenarios
- Define multiple events
- Set severity levels
- Configure parameters

### Portfolio Analysis
- Total portfolio value
- Holdings breakdown
- Performance metrics
- Risk analysis

### Risk Heatmap
- Visual risk representation
- Color-coded risk levels
- Interactive heatmap grid

### Simulation Results
- Expected returns
- Best/worst case scenarios
- Confidence intervals
- Detailed projections

### Recommendations
- AI-generated insights
- Priority-based recommendations
- Expected impact metrics
- Action buttons

### Admin Panel
- User management
- System statistics
- Activity logs
- Settings

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process
npx kill-port 5173

# Or change the port in vite.config.ts
```

### Can't See Other Pages After Login
1. Make sure you clicked the "Quick Demo Login" button or used demo credentials
2. Check browser console for errors (F12)
3. Clear localStorage and try again:
   ```javascript
   // In browser console
   localStorage.clear()
   location.reload()
   ```

### Sidebar Not Showing
1. The sidebar is fixed on the left side
2. Try toggling it with the hamburger menu
3. Check if you're on a small screen (sidebar may be hidden on mobile)

### Dark Mode Not Working
1. Click the sun/moon icon in the header
2. Theme preference is saved to localStorage
3. Refresh the page to see if it persists

## 🔄 Connecting to Real Backend

When you're ready to connect to the actual backend API:

1. Start the backend server (see backend/README.md)
2. Update `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
3. Remove demo credentials from login
4. The app will automatically use real API calls

## 📝 Next Steps

1. ✅ Test all pages and navigation
2. ✅ Try theme switching
3. ✅ Test sidebar collapse/expand
4. 📊 Add real data to pages
5. 📈 Implement chart components
6. 🔥 Add interactive heatmaps
7. 🎨 Customize styling
8. 🧪 Add unit tests

## 💡 Tips

- Use **Cmd/Ctrl + Shift + P** in VS Code for TypeScript commands
- Install **Tailwind CSS IntelliSense** extension for better autocomplete
- Use **React Developer Tools** browser extension for debugging
- Check **Network tab** in DevTools to see API calls (when backend is connected)

## 🎯 Demo Workflow

Try this workflow to explore all features:

1. **Login** with demo account
2. **Dashboard** - View overview
3. **Scenarios** - See scenario list
4. **Portfolio** - Check portfolio metrics
5. **Risk Heatmap** - View risk visualization
6. **Simulations** - See simulation results
7. **Recommendations** - Review AI suggestions
8. **Admin** - Access admin panel (if using admin@fintwin.ai)
9. **Toggle Theme** - Switch between light/dark
10. **Collapse Sidebar** - Test responsive layout
11. **Logout** - Return to login page

---

**Enjoy exploring FinTwin AI! 🚀**

For issues or questions, check the main README.md or ARCHITECTURE.md files.