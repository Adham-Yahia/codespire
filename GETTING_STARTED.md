# 🚀 Getting Started with CodeSpire Backend

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies ✅
```bash
npm install
```
**Status:** ✅ Already completed!

---

### Step 2: Set Up Environment Variables

1. **Create `.env` file:**
   ```bash
   copy .env.example .env
   ```

2. **Edit `.env` with your values:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/codespire
   JWT_SECRET=paste_generated_secret_here
   CLIENT_URL=http://localhost:3000
   ```

3. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and paste it as `JWT_SECRET` in your `.env` file.

---

### Step 3: Start MongoDB

#### Option A: Local MongoDB
```bash
mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string
7. Update `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codespire?retryWrites=true&w=majority
   ```

---

### Step 4: Start the Backend Server
```bash
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
📡 Mongoose connected to MongoDB
```

---

### Step 5: Test the API

#### Using Browser (GET request only):
```
http://localhost:5000
```
You should see: `{"success":true,"message":"CodeSpire API is running","version":"1.0.0"}`

#### Using cURL (All endpoints):

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"specialization\":\"ai\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Get Profile (replace TOKEN):**
```bash
curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Using Postman/Thunder Client:
1. Import the collection (create one from API_REFERENCE.md)
2. Test all 4 endpoints
3. Save the token from login/register responses

---

## 📋 Complete Checklist

### Prerequisites
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed OR Atlas account created
- [ ] Terminal/PowerShell access

### Setup
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] JWT_SECRET generated and added to `.env`
- [ ] MONGO_URI configured in `.env`
- [ ] MongoDB running (local or Atlas)

### Testing
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Root endpoint returns JSON
- [ ] Register endpoint creates user
- [ ] Login endpoint returns token
- [ ] Get profile works with valid token
- [ ] Update profile modifies user data

### Verification
- [ ] Check MongoDB for created users
- [ ] Verify password is hashed in database
- [ ] Confirm JWT token works for protected routes
- [ ] Test error cases (invalid credentials, missing token)

---

## 🎯 What to Do Next

### 1. Test All Endpoints
Use Postman, Thunder Client, or cURL to test:
- ✅ Register new user
- ✅ Login existing user
- ✅ Get user profile
- ✅ Update user profile

### 2. Verify Database
- Install [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect to your database
- Check `users` collection
- Verify data structure

### 3. Understand the Code
Read through:
- `backend/server.js` - Entry point
- `backend/models/User.js` - Data model
- `backend/controllers/authController.js` - Business logic
- `backend/middleware/auth.js` - Authentication
- `backend/routes/authRoutes.js` - API routes

### 4. Integrate with Frontend
- Connect React app to backend
- Implement login/register forms
- Store JWT token in localStorage
- Create authenticated API calls
- Build user profile page

---

## 📚 Important Documentation

| File | Purpose |
|------|---------|
| `BACKEND_SETUP_GUIDE.md` | Detailed setup instructions |
| `API_REFERENCE.md` | Complete API documentation |
| `BACKEND_ARCHITECTURE.md` | System architecture diagrams |
| `BACKEND_IMPLEMENTATION_SUMMARY.md` | What was built |
| `backend/README.md` | Technical documentation |

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is already in use
# Solution 1: Change PORT in .env
PORT=5001

# Solution 2: Kill process using port 5000
# Find process: netstat -ano | findstr :5000
# Kill it: taskkill /PID <process_id> /F
```

### MongoDB connection error
```bash
# Check MongoDB is running
# Local: mongod
# Atlas: Verify connection string and network access
```

### JWT token invalid
```bash
# Ensure JWT_SECRET is set in .env
# Token format: "Bearer <token>" (space after Bearer)
# Check token hasn't expired (30 days)
```

### Cannot POST error
```bash
# Verify Content-Type header: application/json
# Check request body is valid JSON
# Ensure server is running on correct port
```

---

## 🎓 Testing Workflow

### 1. First Time Setup
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start backend
npm run server
```

### 2. Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

**Save the token from response!**

### 3. Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer <paste_token_here>"
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile ^
  -H "Authorization: Bearer <paste_token_here>" ^
  -H "Content-Type: application/json" ^
  -d "{\"theme\":\"dark\",\"specialization\":\"data-science\"}"
```

---

## 💡 Pro Tips

1. **Keep server running** during development
2. **Use Postman** to save requests as collections
3. **Monitor server logs** for errors
4. **Check MongoDB Compass** to view database changes
5. **Save your JWT token** after login for testing
6. **Use environment variables** for all sensitive data
7. **Read error messages** - they're descriptive!

---

## 🎉 You're Ready!

Once you complete the checklist:
- ✅ Backend is running
- ✅ Database is connected
- ✅ API endpoints are working
- ✅ Authentication is functional

**Next Step:** Connect your React frontend to consume these APIs!

---

## 📞 Quick Reference Commands

```bash
# Start backend
npm run server

# Start MongoDB (local)
mongod

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Test root endpoint
curl http://localhost:5000

# Install dependencies
npm install

# Check Node version
node --version

# Check npm version
npm --version
```

---

**Happy Coding!** 🚀 The backend foundation is solid and ready for your CodeSpire application!
