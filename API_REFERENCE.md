# 🔌 CodeSpire Backend API - Quick Reference

Base URL: `http://localhost:5000`

---

## 📡 Authentication Endpoints

### 1️⃣ Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "specialization": "ai",      // optional: ai, data-science, web-development, etc.
  "theme": "dark"              // optional: light or dark
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "66f8a1b2c3d4e5f678901234",
    "name": "John Doe",
    "email": "john@example.com",
    "specialization": "ai",
    "theme": "dark",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2️⃣ Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66f8a1b2c3d4e5f678901234",
    "name": "John Doe",
    "email": "john@example.com",
    "specialization": "ai",
    "theme": "dark",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3️⃣ Get User Profile
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66f8a1b2c3d4e5f678901234",
    "name": "John Doe",
    "email": "john@example.com",
    "specialization": "ai",
    "theme": "dark",
    "createdAt": "2026-09-09T20:30:00.000Z",
    "updatedAt": "2026-09-09T21:15:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

---

### 4️⃣ Update User Profile
```http
PUT /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body (all fields optional):**
```json
{
  "name": "Jane Doe",
  "specialization": "data-science",
  "theme": "light",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66f8a1b2c3d4e5f678901234",
    "name": "Jane Doe",
    "email": "john@example.com",
    "specialization": "data-science",
    "theme": "light",
    "updatedAt": "2026-09-09T22:00:00.000Z"
  }
}
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register or /login
       │    { email, password }
       ▼
┌─────────────┐
│   Server    │
└──────┬──────┘
       │
       │ 2. Validate credentials
       │ 3. Hash password (register only)
       │ 4. Generate JWT token
       ▼
┌─────────────┐
│  Database   │
└──────┬──────┘
       │
       │ 5. Return user + token
       ▼
┌─────────────┐
│   Client    │ (Store token)
└──────┬──────┘
       │
       │ 6. GET /api/auth/me
       │    Header: Authorization: Bearer <token>
       ▼
┌─────────────┐
│   Server    │
└──────┬──────┘
       │
       │ 7. Verify token (middleware)
       │ 8. Attach user to req.user
       │ 9. Return user data
       ▼
┌─────────────┐
│   Client    │ (Display profile)
└─────────────┘
```

---

## 📋 Valid Field Values

### Specialization Options
- `ai` - Artificial Intelligence
- `data-science` - Data Science
- `web-development` - Web Development
- `mobile-development` - Mobile Development
- `cybersecurity` - Cybersecurity
- `cloud-computing` - Cloud Computing
- `none` - No specialization (default)

### Theme Options
- `light` - Light theme (default)
- `dark` - Dark theme

---

## 🧪 cURL Test Commands

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"specialization\":\"ai\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Name\",\"theme\":\"dark\"}"
```

---

## 🎯 JavaScript/Fetch Examples

### Register
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    specialization: 'ai'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
}
```

### Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('token', data.data.token);
}
```

### Get Profile
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.data); // User profile
```

### Update Profile
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Updated Name',
    theme: 'dark'
  })
});

const data = await response.json();
console.log(data.data); // Updated profile
```

---

## ⚠️ Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | User already exists | Use different email or login instead |
| 400 | Please provide name, email, and password | Include all required fields |
| 401 | Invalid email or password | Check credentials |
| 401 | Not authorized, no token provided | Add Authorization header |
| 401 | Invalid token | Login again to get new token |
| 401 | Token expired | Login again to get new token |
| 404 | User not found | User may have been deleted |
| 500 | Server error | Check server logs |

---

## 🔧 Environment Variables Required

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/codespire
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
```

---

## 📊 HTTP Status Codes

- **200** - Success (GET, PUT)
- **201** - Created (POST register)
- **400** - Bad Request (validation error)
- **401** - Unauthorized (auth error)
- **404** - Not Found (resource doesn't exist)
- **500** - Server Error (internal error)

---

**Quick Tip:** Save your token after login/register and include it in the `Authorization: Bearer <token>` header for all protected routes!
