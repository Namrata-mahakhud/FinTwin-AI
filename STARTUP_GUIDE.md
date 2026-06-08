# 🚀 FinTwin Backend Startup Guide

## ✅ FIXED: MongoDB Connection Issue

The backend was hanging because:

1. MongoDB URI was missing authentication credentials
2. MongoDB container wasn't started

**SOLUTION APPLIED:** Updated `backend/.env` with correct MongoDB URI including credentials.

---

## 📋 Complete Startup Instructions

### Step 1: Start MongoDB Container

```powershell
# In project root directory
cd C:\Users\NamrataMahakhud\BobTask\ica-bobathon-FinTwin

# Start ONLY MongoDB (not the full stack)
docker-compose up -d mongodb

# Wait 10 seconds for MongoDB to initialize
# You should see: "Creating fintwin-mongodb ... done"
```

**Verify MongoDB is running:**

```powershell
docker ps
# Should show: fintwin-mongodb container with status "Up"
```

### Step 2: Start Backend

```powershell
# In backend terminal
cd backend

# Stop the hanging process first (Ctrl+C if still running)

# Start backend
npm run dev

# You should see:
# - "MongoDB connected successfully"
# - "Server running on http://localhost:3000"
```

### Step 3: Start Frontend

```powershell
# In frontend terminal
cd frontend

# Start frontend
npm run dev

# You should see:
# - "Local: http://localhost:5173"
```

### Step 4: Test the Application

1. Open browser: http://localhost:5173
2. You should see the login page WITHOUT "Network error"
3. Try logging in with demo credentials:
   - Email: admin@fintwin.ai
   - Password: Admin@123

---

## 🔧 What Was Fixed

### backend/.env

```env
# OLD (WRONG):
MONGODB_URI=mongodb://localhost:27017/fintwin

# NEW (CORRECT):
MONGODB_URI=mongodb://admin:admin123@localhost:27017/fintwin-ai?authSource=admin
```

This matches the MongoDB credentials in `docker-compose.yml`:

- Username: `admin`
- Password: `admin123`
- Database: `fintwin-ai`
- Auth Source: `admin`

---

## 🎯 Quick Start (All Steps)

```powershell
# Terminal 1: MongoDB
docker-compose up -d mongodb
# Wait 10 seconds

# Terminal 2: Backend
cd backend
npm run dev
# Wait for "Server running on http://localhost:3000"

# Terminal 3: Frontend
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## ✅ Success Checklist

- [ ] MongoDB container is running (`docker ps` shows `fintwin-mongodb`)
- [ ] Backend shows "MongoDB connected successfully"
- [ ] Backend shows "Server running on http://localhost:3000"
- [ ] Frontend loads at http://localhost:5173
- [ ] Login page shows NO "Network error"
- [ ] Can access http://localhost:3000 in browser

---

## 🐛 Troubleshooting

### Backend Still Hangs?

**Check MongoDB is actually running:**

```powershell
docker ps
# Must show fintwin-mongodb container
```

**Check MongoDB logs:**

```powershell
docker logs fintwin-mongodb
# Should show "Waiting for connections on port 27017"
```

**Test MongoDB connection:**

```powershell
docker exec -it fintwin-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
# Should connect successfully
```

### Frontend Shows "Network Error"?

**Check backend is running:**

```powershell
# Test backend API
curl http://localhost:3000
# Should return response (not connection refused)
```

**Check backend logs:**
Look for errors in the backend terminal

### MongoDB Won't Start?

**Check if port 27017 is already in use:**

```powershell
netstat -ano | findstr :27017
# If something is using it, stop that service
```

**Reset MongoDB container:**

```powershell
docker-compose down
docker volume rm ica-bobathon-fintwin_mongodb_data
docker-compose up -d mongodb
```

---

## 📊 Expected Output

### MongoDB Startup

```
Creating network "ica-bobathon-fintwin_fintwin-network" ... done
Creating volume "ica-bobathon-fintwin_mongodb_data" ... done
Creating fintwin-mongodb ... done
```

### Backend Startup

```
> backend@1.0.0 dev
> tsx watch src/server.ts

MongoDB connected successfully
Server running on http://localhost:3000
```

### Frontend Startup

```
> frontend@0.0.0 dev
> vite

  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎉 You're Ready!

Once all three services are running:

1. Open http://localhost:5173
2. Login with demo credentials
3. Start building financial scenarios!

---

## 📝 Notes

- **MongoDB Credentials:** admin / admin123 (development only)
- **Backend Port:** 3000
- **Frontend Port:** 5173
- **Database Name:** fintwin-ai

**Security Note:** Change MongoDB credentials in production!

---

## 🔄 Stopping Services

```powershell
# Stop backend: Ctrl+C in backend terminal
# Stop frontend: Ctrl+C in frontend terminal
# Stop MongoDB:
docker-compose down
```

---

**Last Updated:** 2026-05-25
**Status:** ✅ Ready to Start
