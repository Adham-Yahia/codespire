# CodeSpire Backend API

Clean, modular Node.js/Express backend with MongoDB and JWT authentication.

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   └── authController.js    # Authentication business logic
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   └── User.js              # User schema & model
├── routes/
│   └── authRoutes.js        # Authentication endpoints
└── server.js                # Express app entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your values
   ```

3. **Start MongoDB** (if using local installation):
   ```bash
   mongod
   ```

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   # or
   npm run server
   ```

Server will start on `http://localhost:5000`

## 🔑 Environment Variables

Required variables in `.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/codespire` |
| `JWT_SECRET` | JWT signing secret | Generate with crypto |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📡 API Endpoints

### Authentication Routes

Base URL: `/api/auth`

#### Register User
- **POST** `/api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "specialization": "ai",
    "theme": "dark"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "specialization": "ai",
      "theme": "dark",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register

#### Get Profile
- **GET** `/api/auth/me`
- **Access:** Private (requires JWT token)
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "specialization": "ai",
      "theme": "dark",
      "createdAt": "2026-09-09T...",
      "updatedAt": "2026-09-09T..."
    }
  }
  ```

#### Update Profile
- **PUT** `/api/auth/profile`
- **Access:** Private (requires JWT token)
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Body:** (all fields optional)
  ```json
  {
    "name": "Jane Doe",
    "specialization": "data-science",
    "theme": "light",
    "password": "newpassword123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "name": "Jane Doe",
      "email": "john@example.com",
      "specialization": "data-science",
      "theme": "light",
      "updatedAt": "2026-09-09T..."
    }
  }
  ```

## 🗄️ User Model

### Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | Yes | - | Max 50 characters |
| `email` | String | Yes | - | Unique, validated |
| `password` | String | Yes | - | Min 6 characters, auto-hashed |
| `specialization` | String | No | `'none'` | Enum: ai, data-science, web-development, mobile-development, cybersecurity, cloud-computing, none |
| `theme` | String | No | `'light'` | Enum: light, dark |
| `createdAt` | Date | Auto | - | Timestamp |
| `updatedAt` | Date | Auto | - | Timestamp |

### Methods

- `matchPassword(enteredPassword)`: Compare plain text password with hashed password

## 🔒 Authentication Flow

1. **Registration/Login:** User provides credentials → Server validates → Returns JWT token
2. **Protected Routes:** Client sends token in `Authorization: Bearer <token>` header
3. **Middleware Verification:** `protect` middleware validates token → Attaches user to request
4. **Access Granted:** Controller accesses authenticated user via `req.user`

## 🧪 Testing with Postman/Thunder Client

### 1. Register a new user
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "specialization": "ai"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```
Save the token from response!

### 3. Get Profile (Protected)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_token_here>
```

### 4. Update Profile (Protected)
```
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer <paste_token_here>
Content-Type: application/json

{
  "name": "Updated Name",
  "theme": "dark"
}
```

## ⚠️ Security Notes

- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens expire in 30 days
- ✅ Password field excluded from queries by default
- ✅ Input validation on all fields
- ✅ Email format validation
- ✅ CORS configured for frontend origin
- ⚠️ Change `JWT_SECRET` in production!
- ⚠️ Use HTTPS in production
- ⚠️ Never commit `.env` to version control

## 📝 Next Steps

To extend this backend:

1. **Add more routes** in `routes/` directory
2. **Create new models** in `models/` directory
3. **Add controllers** in `controllers/` directory
4. **Extend User model** with additional fields
5. **Add validation middleware** for request bodies
6. **Implement refresh tokens** for better security
7. **Add rate limiting** to prevent abuse
8. **Set up logging** (Winston, Morgan)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- For Atlas: verify network access and credentials

### JWT Token Errors
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL
- Check frontend is sending requests to correct backend URL

## 📚 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

**Built with focus and simplicity** 🚀
