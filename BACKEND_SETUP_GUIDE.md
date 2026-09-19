# 🚀 CodeSpire Backend - Quick Setup Guide

## ✅ What We've Built

A complete, modular backend with:
- ✅ MongoDB database connection
- ✅ User model with password hashing
- ✅ JWT-based authentication
- ✅ Protected routes with middleware
- ✅ Clean MVC architecture
- ✅ Comprehensive error handling

## 📦 Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (cross-origin requests)
- dotenv (environment variables)

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and configure:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/codespire
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Step 4: Start the Server

```bash
npm run server
```

You should see:
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

## 🧪 Test the API

### Using curl:

**1. Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"test123\",\"specialization\":\"ai\"}"
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"test123\"}"
```

**3. Get profile (replace YOUR_TOKEN):**
```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman/Thunder Client:

1. **Register** → `POST http://localhost:5000/api/auth/register`
2. **Login** → `POST http://localhost:5000/api/auth/login`
3. Copy the `token` from response
4. **Get Profile** → `GET http://localhost:5000/api/auth/me`
   - Add header: `Authorization: Bearer <paste_token>`

## 📡 Available Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get user profile |
| PUT | `/api/auth/profile` | Private | Update profile |

## 🏗️ Backend Architecture

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Business logic
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   └── User.js              # User schema
├── routes/
│   └── authRoutes.js        # API routes
└── server.js                # Entry point
```

## 🎯 Key Features Implemented

### 1. User Model
- ✅ Name, email, password fields
- ✅ Specialization (ai, data-science, etc.)
- ✅ Theme preference (light/dark)
- ✅ Auto password hashing (bcrypt)
- ✅ Password comparison method

### 2. Authentication Controller
- ✅ **Register**: Creates user with hashed password
- ✅ **Login**: Validates credentials, returns JWT
- ✅ **Get Profile**: Fetches authenticated user
- ✅ **Update Profile**: Modifies user data

### 3. Auth Middleware
- ✅ JWT token verification
- ✅ User authentication
- ✅ Request protection
- ✅ Error handling

### 4. Server Setup
- ✅ Express configuration
- ✅ CORS enabled
- ✅ JSON body parsing
- ✅ Database connection
- ✅ Global error handling
- ✅ Graceful shutdown

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with 30-day expiration
- ✅ Password field excluded from queries
- ✅ Input validation (email format, length)
- ✅ CORS protection
- ✅ Environment variable protection

## 🐛 Common Issues & Solutions

### MongoDB Connection Failed
```
❌ Solution: 
- Start MongoDB: mongod
- Check MONGO_URI in .env
- Verify MongoDB is running on port 27017
```

### JWT Token Invalid
```
❌ Solution:
- Ensure JWT_SECRET is set in .env
- Check Authorization header format: "Bearer <token>"
- Verify token hasn't expired (30 days)
```

### Port Already in Use
```
❌ Solution:
- Change PORT in .env to different number (e.g., 5001)
- Or stop process using port 5000
```

### Cannot POST /api/auth/...
```
❌ Solution:
- Ensure Content-Type header is "application/json"
- Verify server is running on correct port
- Check request body is valid JSON
```

## 📚 Next Development Steps

Once backend is running, you can:

1. **Test all endpoints** with Postman/Thunder Client
2. **Verify MongoDB data** with MongoDB Compass
3. **Connect React frontend** to backend
4. **Add more models** (Progress, Courses, etc.)
5. **Implement additional features** (Reset password, Email verification)

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

## 💡 Development Tips

1. Keep server running with `npm run server`
2. Use Postman collections to save requests
3. Check MongoDB data with MongoDB Compass
4. Monitor server logs for errors
5. Test each endpoint before frontend integration

---

**You're all set!** 🎉 The backend is ready for authentication and user profile management.
