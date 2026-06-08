# 🚀 FinTwin AI - Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js >= 20.0.0
- ✅ npm >= 10.0.0
- ✅ MongoDB >= 6.0 (or Docker)

Check versions:
```bash
node --version
npm --version
mongod --version  # or docker --version
```

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
# Install all dependencies (root, backend, frontend)
npm install
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Minimum required:
# - MONGODB_URI=mongodb://localhost:27017/fintwin-ai
# - JWT_SECRET=your-secret-key-min-32-characters-long
# - JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

### Step 3: Start Application

**Option A: Using Docker (Recommended)**
```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
npm run docker:up

# Stop all services
npm run docker:down
```

**Option B: Manual Start**
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

## 🌐 Access Points

Once running, access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend API** | http://localhost:3000 | Fastify server |
| **API Docs** | http://localhost:3000/api/docs | Swagger documentation |
| **Health Check** | http://localhost:3000/api/v1/health | System health |

## ✅ Verify Installation

### 1. Check Frontend
Open http://localhost:5173 - You should see the FinTwin AI welcome page

### 2. Check Backend
```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-25T12:00:00.000Z",
  "version": "1.0.0"
}
```

### 3. Check API Documentation
Open http://localhost:3000/api/docs - You should see Swagger UI

## 🔧 Troubleshooting

### Issue: Port Already in Use

**Frontend (5173)**
```bash
# Change port in frontend/vite.config.ts
server: {
  port: 5174  // Change to different port
}
```

**Backend (3000)**
```bash
# Change PORT in .env
PORT=3001
```

### Issue: MongoDB Connection Failed

**Check MongoDB is running:**
```bash
# If using local MongoDB
mongod --version
ps aux | grep mongod

# If using Docker
docker ps | grep mongo
```

**Fix connection string in .env:**
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/fintwin-ai

# Docker MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/fintwin-ai?authSource=admin
```

### Issue: Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

### Issue: TypeScript Errors

These are expected before installing dependencies:
```bash
npm install  # This will resolve all TypeScript errors
```

## 📚 Next Steps

### 1. Test Authentication API

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "ANALYST"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Explore API Documentation
Visit http://localhost:3000/api/docs and try the interactive API explorer

### 3. Check Implementation Guide
Read `docs/IMPLEMENTATION_GUIDE.md` for detailed documentation

## 🐳 Docker Commands

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
docker-compose logs -f

# Rebuild containers
npm run docker:build

# Clean everything
docker-compose down -v
docker system prune -a
```

## 📊 Development Commands

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build both projects
npm run test         # Run all tests
npm run lint         # Lint all code
npm run format       # Format all code

# Backend only
cd backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm run test:unit    # Unit tests
npm run test:integration  # Integration tests

# Frontend only
cd frontend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
```

## 🎓 Learning Resources

- **Architecture**: See `docs/IMPLEMENTATION_GUIDE.md`
- **API Reference**: http://localhost:3000/api/docs
- **ICA Patterns**: `.ica/patterns/`
- **Bob Workflows**: `.bob/workflows/`
- **Database Models**: `backend/src/models/`

## 🆘 Getting Help

### Check Logs

**Backend logs:**
```bash
# If running manually
cd backend && npm run dev

# If using Docker
docker-compose logs backend
```

**Frontend logs:**
```bash
# If running manually
cd frontend && npm run dev

# If using Docker
docker-compose logs frontend
```

### Common Solutions

1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Restart services** - Stop and start again
3. **Check .env file** - Ensure all required variables are set
4. **Verify MongoDB** - Ensure it's running and accessible
5. **Check ports** - Ensure 3000 and 5173 are available

## ✨ What's Working

✅ Frontend React application
✅ Backend Fastify server
✅ MongoDB database connection
✅ Authentication system (JWT)
✅ API documentation (Swagger)
✅ Docker setup
✅ CI/CD pipeline

## 🎯 What's Next

The following features are ready to be implemented:
- [ ] Scenario Builder UI
- [ ] Market Simulation Engine
- [ ] Portfolio Management
- [ ] AI Agent System
- [ ] Dashboard & Analytics

---

**Need help?** Check the logs, verify your .env file, and ensure all services are running.

**Ready to develop?** Start with the authentication endpoints and explore the API documentation!

🚀 **Happy Coding!**