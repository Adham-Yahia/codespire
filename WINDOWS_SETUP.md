# 🪟 Windows PowerShell Setup Guide

## ⚡ Quick Start (2 Commands)

### Option 1: Automatic Setup (Recommended) ✨
```powershell
# Step 1: Run the setup script
npm run setup

# Step 2: Start the server (MongoDB not required immediately)
npm run server
```

That's it! The setup script will:
- ✅ Auto-generate a secure `.env` file
- ✅ Create a random JWT secret
- ✅ Set sensible defaults
- ✅ No manual file editing needed!

---

### Option 2: Manual Setup
If you prefer to create `.env` manually:

```powershell
# Copy the example file
Copy-Item .env.example .env

# Edit .env in your favorite editor
notepad .env
```

---

## 🚀 Complete Setup Steps

### 1️⃣ Install Dependencies
```powershell
npm install
```

### 2️⃣ Run Setup Script
```powershell
npm run setup
```

**What this does:**
- Creates `.env` file with secure defaults
- Generates a cryptographically secure JWT secret
- Sets up local MongoDB connection
- Configures CORS for React frontend

### 3️⃣ Start MongoDB (Choose One)

#### Option A: Local MongoDB
```powershell
# Start MongoDB service
mongod
```

**Don't have MongoDB installed?**
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) instead ⬇️

#### Option B: MongoDB Atlas (Cloud - No Installation)
1. Go to https://www.mongodb.com/atlas
2. Create free account (M0 Free Tier)
3. Create a cluster
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (for development)
6. Get connection string
7. Update `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codespire?retryWrites=true&w=majority
   ```

### 4️⃣ Start the Backend Server
```powershell
npm run server
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║                                        ║
║     🚀 CodeSpire Backend Server        ║
║                                        ║
║     Server running on port 5000        ║
║     Environment: development           ║
║                                        ║
╚════════════════════════════════════════╝
✅ MongoDB Connected: localhost
```

### 5️⃣ Test the API
```powershell
# Test root endpoint (in browser or PowerShell)
curl http://localhost:5000

# Or open in browser
start http://localhost:5000
```

---

## 🎯 Testing with PowerShell

### Register a User
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    specialization = "ai"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Save the token
$token = $response.data.token
Write-Host "Token: $token"
```

### Get Profile (Protected Route)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
```

### Update Profile
```powershell
$body = @{
    name = "Updated Name"
    theme = "dark"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method PUT -Body $body -ContentType "application/json" -Headers $headers
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot find module 'dotenv'"
```powershell
# Solution: Install dependencies
npm install
```

### Issue: MongoDB Connection Failed
```powershell
# Check if MongoDB is running
Get-Process mongod

# If not running, start it
mongod

# Or use MongoDB Atlas (cloud) instead
```

### Issue: Port 5000 Already in Use
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in .env
# Edit .env and set: PORT=5001
```

### Issue: JWT_SECRET Error
**No need to worry!** The server now auto-generates a JWT secret if `.env` is missing.

But if you want to create one manually:
```powershell
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Issue: .env File Not Created
```powershell
# Run setup script again
npm run setup

# Or create manually
New-Item -Path .env -ItemType File
notepad .env
```

---

## 📋 Default Configuration

When you run `npm run setup` or start the server without `.env`, these defaults are used:

| Variable | Default Value |
|----------|--------------|
| `NODE_ENV` | `development` |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb://localhost:27017/codespire` |
| `JWT_SECRET` | Auto-generated secure random string |
| `CLIENT_URL` | `http://localhost:3000` |

---

## 🎓 PowerShell-Specific Tips

### 1. Running Multiple Commands
```powershell
# Start MongoDB and server in separate windows
Start-Process powershell -ArgumentList "mongod"
Start-Process powershell -ArgumentList "npm run server"
```

### 2. View Environment Variables
```powershell
# Check if .env is loaded
Get-Content .env
```

### 3. Testing with Invoke-RestMethod
PowerShell's `Invoke-RestMethod` is great for API testing:
```powershell
# Pretty print JSON response
Invoke-RestMethod -Uri "http://localhost:5000" | ConvertTo-Json -Depth 10
```

### 4. Kill Server Process
```powershell
# If server is stuck
Get-Process node | Stop-Process -Force
```

---

## ✅ Quick Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Setup script run (`npm run setup`)
- [ ] `.env` file exists
- [ ] MongoDB running (local or Atlas)
- [ ] Server starts without errors
- [ ] API responds at http://localhost:5000
- [ ] Registration endpoint works
- [ ] Login endpoint works

---

## 🚀 One-Liner Full Setup

For the impatient (runs everything in sequence):
```powershell
npm install; npm run setup; npm run server
```

**Note:** MongoDB must be running separately!

---

## 💡 Pro Tips

1. **Use MongoDB Atlas** - No local installation needed
2. **Run `npm run setup`** - Easiest way to configure
3. **Keep server running** - No need to restart for most changes
4. **Use Postman** - Better than PowerShell for complex API testing
5. **Check server logs** - They provide helpful error messages

---

## 🎉 You're All Set!

The backend is configured with smart defaults and will work out of the box.

**Next Steps:**
1. Test the API endpoints
2. Connect your React frontend
3. Start building features!

---

**Need Help?** Check the comprehensive documentation:
- `GETTING_STARTED.md` - General setup guide
- `API_REFERENCE.md` - Complete API documentation
- `BACKEND_ARCHITECTURE.md` - System architecture
- `backend/README.md` - Technical details
