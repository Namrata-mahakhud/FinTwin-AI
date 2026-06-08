# FinTwin Backend Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Backend Won't Start - Module Loading Error

**Symptoms:**

```
Error: Cannot find module 'tsx/dist/register-B0kp8V6j.cjs'
at Object.transformer
```

**Solution:**
Try these steps in order:

#### Step 1: Clean Install

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Step 2: Use Alternative Run Command

Instead of `npm run dev`, try:

```bash
# Option A: Use ts-node
npx ts-node src/server.ts

# Option B: Build and run
npm run build
npm start

# Option C: Use nodemon with ts-node
npx nodemon --exec ts-node src/server.ts
```

#### Step 3: Install Missing Dependencies

```bash
cd backend
npm install --save-dev ts-node tsconfig-paths
```

#### Step 4: Update package.json scripts

If still having issues, update `backend/package.json`:

```json
{
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/server.ts",
    "dev:watch": "nodemon --exec ts-node -r tsconfig-paths/register src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

### Issue 2: Network Error on Frontend

**Symptoms:**

- Frontend shows "Network error. Please check your connection"
- Login page cannot connect to backend

**Causes:**

1. Backend is not running
2. Backend is running on wrong port
3. CORS configuration issue
4. Frontend API URL is incorrect

**Solutions:**

#### Check 1: Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:3000

# Should return:
# {
#   "name": "FinTwin AI API",
#   "version": "1.0.0",
#   ...
# }
```

#### Check 2: Verify Backend Port

1. Check `backend/.env`:

```env
PORT=3000
```

2. Check frontend API configuration in `frontend/src/constants/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

#### Check 3: Test API Endpoint

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Test login endpoint
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fintwin.ai","password":"Admin@123"}'
```

#### Check 4: CORS Configuration

Verify `backend/.env` has correct CORS origin:

```env
CORS_ORIGIN=http://localhost:5173
```

---

### Issue 3: MongoDB Connection Error

**Symptoms:**

```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

#### Option A: Start MongoDB with Docker

```bash
# From project root
docker-compose up -d mongodb

# Verify MongoDB is running
docker ps | grep mongodb
```

#### Option B: Use Local MongoDB

```bash
# Start MongoDB service
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### Option C: Use MongoDB Atlas (Cloud)

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fintwin?retryWrites=true&w=majority
```

---

### Issue 4: JWT Secret Not Set

**Symptoms:**

```
Error: JWT_SECRET is not defined
```

**Solution:**

1. Copy `.env.example` to `.env`:

```bash
cd backend
cp .env.example .env
```

2. Generate a secure JWT secret:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Update `backend/.env`:

```env
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

---

### Issue 5: TypeScript Compilation Errors

**Symptoms:**

- TypeScript errors in console
- Build fails

**Solutions:**

#### Solution A: Skip Type Checking (Quick Fix)

```bash
# Run without type checking
npm run dev -- --transpile-only
```

#### Solution B: Fix TypeScript Config

Ensure `backend/tsconfig.json` has:

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "strictPropertyInitialization": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

---

## Quick Start Checklist

Use this checklist to ensure everything is set up correctly:

### Backend Setup

- [ ] Node.js v20+ installed
- [ ] MongoDB running (Docker or local)
- [ ] `backend/.env` file exists with all required variables
- [ ] Dependencies installed: `cd backend && npm install`
- [ ] Backend starts without errors: `npm run dev`
- [ ] API responds: `curl http://localhost:3000`

### Frontend Setup

- [ ] Dependencies installed: `cd frontend && npm install`
- [ ] Frontend starts: `npm run dev`
- [ ] Can access: `http://localhost:5173`
- [ ] API URL is correct in `frontend/src/constants/api.ts`

### Database Setup

- [ ] MongoDB is running
- [ ] Can connect to MongoDB
- [ ] Database `fintwin` is created (auto-created on first connection)

---

## Environment Variables Reference

### Backend `.env` (Required)

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/fintwin

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# Logging
LOG_LEVEL=info
```

### Frontend `.env` (Optional)

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:3000
```

Expected response:

```json
{
  "name": "FinTwin AI API",
  "version": "1.0.0",
  "description": "Autonomous Financial Digital Twin for Market Shock Simulation",
  "documentation": "/api/docs",
  "health": "/api/v1/health"
}
```

### 2. Test API Documentation

Open in browser:

```
http://localhost:3000/api/docs
```

### 3. Test Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fintwin.ai",
    "password": "Admin@123"
  }'
```

### 4. Test Scenarios Endpoint

```bash
# Get auth token first (from login response)
TOKEN="your-jwt-token-here"

curl http://localhost:3000/api/v1/scenarios \
  -H "Authorization: Bearer $TOKEN"
```

---

## Alternative: Run with Docker

If you're having persistent issues, try running everything with Docker:

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## Getting Help

### Check Logs

```bash
# Backend logs
cd backend
npm run dev

# Look for errors in the console
```

### Enable Debug Logging

Update `backend/.env`:

```env
LOG_LEVEL=debug
```

### Common Log Messages

**Success:**

```
Server running on http://localhost:3000
API Documentation: http://localhost:3000/api/docs
Environment: development
MongoDB connected successfully
```

**Errors to Watch For:**

- `ECONNREFUSED` - MongoDB not running
- `EADDRINUSE` - Port 3000 already in use
- `JWT_SECRET is not defined` - Missing environment variable
- `Cannot find module` - Missing dependency

---

## Port Conflicts

If port 3000 is already in use:

### Option 1: Change Backend Port

Update `backend/.env`:

```env
PORT=3001
```

Update `frontend/src/constants/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3001/api/v1';
```

### Option 2: Kill Process Using Port 3000

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## Still Having Issues?

### 1. Check Node Version

```bash
node --version
# Should be v20.0.0 or higher
```

### 2. Clear All Caches

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json dist
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json dist
npm install
```

### 3. Use Minimal Start

Create `backend/src/test-server.ts`:

```typescript
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3000');
});
```

Run it:

```bash
npx ts-node src/test-server.ts
```

If this works, the issue is in the main server configuration.

---

## Success Indicators

You'll know everything is working when:

1. ✅ Backend starts without errors
2. ✅ `curl http://localhost:3000` returns JSON
3. ✅ MongoDB connection successful message in logs
4. ✅ Frontend loads at `http://localhost:5173`
5. ✅ Login page appears (no network error)
6. ✅ Can login with demo credentials
7. ✅ Dashboard loads after login

---

## Demo Credentials

Once backend is running and database is seeded:

```
Email: admin@fintwin.ai
Password: Admin@123
```

If these don't work, you may need to seed the database:

```bash
cd backend
npm run seed
```

---

**Last Updated:** 2026-05-25
**Version:** 1.0.0
