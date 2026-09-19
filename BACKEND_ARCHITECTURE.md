# 🏗️ CodeSpire Backend Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (JSON)
                             │ Authorization: Bearer <JWT>
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Node.js)                     │
│                     http://localhost:5000                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE LAYER                      │  │
│  │                                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │  │
│  │  │   CORS   │  │   JSON   │  │  Request Logging     │  │  │
│  │  │  Enabled │  │  Parser  │  │   (Development)      │  │  │
│  │  └──────────┘  └──────────┘  └──────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    ROUTE LAYER                           │  │
│  │                                                          │  │
│  │         /api/auth/* ──────► authRoutes.js               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AUTH MIDDLEWARE (Protected Routes)          │  │
│  │                                                          │  │
│  │  1. Extract JWT from Authorization header               │  │
│  │  2. Verify token with JWT_SECRET                        │  │
│  │  3. Fetch user from database                            │  │
│  │  4. Attach user to req.user                             │  │
│  │  5. Continue to controller                              │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  CONTROLLER LAYER                        │  │
│  │              (Business Logic)                            │  │
│  │                                                          │  │
│  │  • register()  - Create new user                        │  │
│  │  • login()     - Authenticate user                      │  │
│  │  • getProfile()    - Fetch user data                    │  │
│  │  • updateProfile() - Update user data                   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     MODEL LAYER                          │  │
│  │                   (Data Access)                          │  │
│  │                                                          │  │
│  │  User Model (Mongoose Schema)                           │  │
│  │  • name, email, password                                │  │
│  │  • specialization, theme                                │  │
│  │  • Pre-save password hashing                            │  │
│  │  • matchPassword() method                               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ MongoDB Driver (Mongoose)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB DATABASE                           │
│                  mongodb://localhost:27017                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  users Collection                                       │   │
│  │  {                                                      │   │
│  │    _id: ObjectId,                                       │   │
│  │    name: String,                                        │   │
│  │    email: String (unique),                              │   │
│  │    password: String (hashed),                           │   │
│  │    specialization: String,                              │   │
│  │    theme: String,                                       │   │
│  │    createdAt: Date,                                     │   │
│  │    updatedAt: Date                                      │   │
│  │  }                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### 1. Registration Flow

```
User → Frontend
       ↓
POST /api/auth/register
{ name, email, password, specialization, theme }
       ↓
Express Server
       ↓
authRoutes.js → router.post('/register', register)
       ↓
authController.register()
  ├─ Validate input
  ├─ Check if user exists
  ├─ Create user (password auto-hashed by pre-save hook)
  ├─ Generate JWT token
  └─ Return user + token
       ↓
MongoDB (User saved)
       ↓
Response { success: true, data: { user, token } }
       ↓
Frontend (Store token, redirect to dashboard)
```

### 2. Login Flow

```
User → Frontend
       ↓
POST /api/auth/login
{ email, password }
       ↓
Express Server
       ↓
authRoutes.js → router.post('/login', login)
       ↓
authController.login()
  ├─ Find user by email
  ├─ Compare password with hash (user.matchPassword())
  ├─ Generate JWT token
  └─ Return user + token
       ↓
MongoDB (User queried)
       ↓
Response { success: true, data: { user, token } }
       ↓
Frontend (Store token, redirect to dashboard)
```

### 3. Get Profile Flow (Protected)

```
User → Frontend
       ↓
GET /api/auth/me
Header: Authorization: Bearer <token>
       ↓
Express Server
       ↓
authRoutes.js → router.get('/me', protect, getProfile)
       ↓
auth.protect() Middleware
  ├─ Extract token from header
  ├─ Verify token with JWT_SECRET
  ├─ Find user by decoded ID
  ├─ Attach user to req.user
  └─ Call next()
       ↓
authController.getProfile()
  ├─ Access req.user (set by middleware)
  └─ Return user data
       ↓
MongoDB (User queried)
       ↓
Response { success: true, data: { user } }
       ↓
Frontend (Display profile)
```

### 4. Update Profile Flow (Protected)

```
User → Frontend
       ↓
PUT /api/auth/profile
Header: Authorization: Bearer <token>
Body: { name, specialization, theme, password }
       ↓
Express Server
       ↓
authRoutes.js → router.put('/profile', protect, updateProfile)
       ↓
auth.protect() Middleware
  ├─ Verify token
  ├─ Attach user to req.user
  └─ Call next()
       ↓
authController.updateProfile()
  ├─ Find user by req.user._id
  ├─ Update fields
  ├─ Save (password re-hashed if changed)
  └─ Return updated user
       ↓
MongoDB (User updated)
       ↓
Response { success: true, data: { updatedUser } }
       ↓
Frontend (Update UI)
```

---

## 📁 File Structure & Responsibilities

```
backend/
│
├── config/
│   └── database.js
│       • MongoDB connection setup
│       • Connection event handlers
│       • Error handling
│
├── models/
│   └── User.js
│       • User schema definition
│       • Password hashing middleware
│       • matchPassword() method
│       • Validation rules
│
├── middleware/
│   └── auth.js
│       • JWT token extraction
│       • Token verification
│       • User authentication
│       • Request protection
│
├── controllers/
│   └── authController.js
│       • register() - User registration
│       • login() - User authentication
│       • getProfile() - Fetch user
│       • updateProfile() - Update user
│       • Business logic & validation
│
├── routes/
│   └── authRoutes.js
│       • Route definitions
│       • Middleware attachment
│       • Controller mapping
│
└── server.js
    • Express app initialization
    • Middleware configuration
    • Database connection
    • Route mounting
    • Error handling
    • Server startup
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                                  │
│  • CORS enabled (specific origin)                           │
│  • HTTPS in production                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Input Validation                                  │
│  • Email format validation                                  │
│  • Password length requirements                             │
│  • Field type validation                                    │
│  • Required field checks                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Authentication                                    │
│  • JWT token verification                                   │
│  • Token expiration (30 days)                               │
│  • User existence validation                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Password Security                                 │
│  • Bcrypt hashing (10 rounds)                               │
│  • Password never exposed in responses                      │
│  • Secure comparison (matchPassword)                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 5: Database Security                                 │
│  • Unique email constraint                                  │
│  • Schema validation                                        │
│  • Password field select: false                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (Future)                       │
│  • React                                                     │
│  • React Router                                              │
│  • Axios/Fetch                                               │
│  • LocalStorage (token storage)                              │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ REST API (JSON)
                            │
┌──────────────────────────────────────────────────────────────┐
│                      BACKEND (Current)                       │
│  • Node.js - Runtime                                         │
│  • Express.js - Web framework                                │
│  • Mongoose - ODM                                            │
│  • bcryptjs - Password hashing                               │
│  • jsonwebtoken - JWT authentication                         │
│  • cors - Cross-origin requests                              │
│  • dotenv - Environment variables                            │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            │
┌──────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│  • MongoDB - NoSQL database                                  │
│  • Collections: users                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 API Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ Public | Create new user |
| POST | `/api/auth/login` | ❌ Public | Login user |
| GET | `/api/auth/me` | ✅ Protected | Get profile |
| PUT | `/api/auth/profile` | ✅ Protected | Update profile |

---

## 🔄 Data Flow Diagram

```
┌──────────┐
│  Client  │
│ (React)  │
└────┬─────┘
     │
     │ 1. HTTP Request + Token
     ▼
┌─────────────┐
│   Express   │
│   Server    │ ◄───────┐
└────┬────────┘         │
     │                  │
     │ 2. Middleware    │ 6. Response
     ▼                  │
┌─────────────┐         │
│    Auth     │         │
│ Middleware  │         │
└────┬────────┘         │
     │                  │
     │ 3. req.user      │
     ▼                  │
┌─────────────┐         │
│ Controller  │         │
│   Logic     │         │
└────┬────────┘         │
     │                  │
     │ 4. Model Query   │
     ▼                  │
┌─────────────┐         │
│   Model     │         │
│  (User.js)  │         │
└────┬────────┘         │
     │                  │
     │ 5. DB Operation  │
     ▼                  │
┌─────────────┐         │
│   MongoDB   │         │
│  Database   │─────────┘
└─────────────┘
```

---

## 🚀 Deployment Architecture (Future)

```
┌────────────────────────────────────────────────────────┐
│                     PRODUCTION                         │
│                                                        │
│  ┌──────────────┐         ┌──────────────┐           │
│  │   Frontend   │         │   Backend    │           │
│  │   (Vercel/   │────────▶│   (Heroku/   │           │
│  │   Netlify)   │  HTTPS  │   Railway)   │           │
│  └──────────────┘         └───────┬──────┘           │
│                                    │                   │
│                                    │ MongoDB Driver    │
│                                    ▼                   │
│                           ┌──────────────┐            │
│                           │   MongoDB    │            │
│                           │    Atlas     │            │
│                           │   (Cloud)    │            │
│                           └──────────────┘            │
│                                                        │
│  Environment Variables:                                │
│  • NODE_ENV=production                                 │
│  • JWT_SECRET=<strong_secret>                          │
│  • MONGO_URI=<atlas_connection_string>                 │
└────────────────────────────────────────────────────────┘
```

---

## ✅ Current Implementation Status

### ✅ Completed
- [x] Express server setup
- [x] MongoDB connection
- [x] User model with validation
- [x] Password hashing
- [x] JWT authentication
- [x] Protected routes middleware
- [x] Auth controller (register, login, profile)
- [x] API routes
- [x] Error handling
- [x] CORS configuration
- [x] Environment variables
- [x] Documentation

### 🔜 Future Enhancements
- [ ] Password reset
- [ ] Email verification
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Request validation middleware
- [ ] User roles/permissions
- [ ] Session management
- [ ] Logging system
- [ ] Unit tests
- [ ] Integration tests

---

**Architecture is clean, modular, and ready for scaling!** 🏗️
