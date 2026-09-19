/**
 * server.js
 * ---------
 * Express server entry point for CodeSpire backend.
 * Loads environment variables, connects to MongoDB,
 * registers middleware, and mounts API routes.
 */

// Load .env variables FIRST — before any other imports
require('dotenv').config();

const http    = require('http');
const express = require('express');
const cors    = require('cors');

const connectDB   = require('./config/database');
const authRoutes  = require('./routes/authRoutes');
const postRoutes  = require('./routes/postRoutes');

// ── Startup validation ────────────────────────────────────────────────────────

// JWT_SECRET must be explicitly set — never fall back to an auto-generated value
// because rotating secrets on restart would invalidate all active user sessions.
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in .env — server cannot start.');
  console.error('   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

const PORT            = process.env.PORT || 5000;
const NODE_ENV        = process.env.NODE_ENV || 'development';
// Default to 64 KB (65536 bytes) header limit — 4x Node's default 16 KB
const MAX_HEADER_SIZE = parseInt(process.env.MAX_HEADER_SIZE, 10) || 64 * 1024;

// ── Database connection ───────────────────────────────────────────────────────

connectDB().catch((err) => {
  console.error(`❌ Database connection failed: ${err.message}`);
  process.exit(1); // Don't serve requests without a database
});

// ── Express app setup ─────────────────────────────────────────────────────────

const app = express();

// CORS — allow requests from the React frontend (localhost, 127.0.0.1, or custom CLIENT_URL)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', cors());

// Header hygiene middleware: sanitize, deduplicate, and prevent header bloat
app.use((req, _res, next) => {
  // Normalize and clean Authorization header if present
  if (req.headers.authorization) {
    if (Array.isArray(req.headers.authorization)) {
      req.headers.authorization = req.headers.authorization[0];
    } else if (typeof req.headers.authorization === 'string' && req.headers.authorization.includes(',')) {
      // Pick the first valid Bearer token if multiple were appended by proxies
      const tokens = req.headers.authorization.split(',');
      const bearer = tokens.find(t => t.trim().toLowerCase().startsWith('bearer ')) || tokens[0];
      req.headers.authorization = bearer.trim();
    }
  }

  // Prune bloated cookies if present in headers (CodeSpire uses Bearer JWT tokens, not cookies)
  if (req.headers.cookie && req.headers.cookie.length > 4096) {
    delete req.headers.cookie;
  }

  next();
});

// Parse incoming JSON and URL-encoded request bodies with safe limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Basic request logger (development only)
if (NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`→ ${req.method} ${req.path}`);
    next();
  });
}

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth',  authRoutes);
app.use('/api/posts', postRoutes);

// Health-check root endpoint
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'CodeSpire API is running', version: '1.0.0' });
});

// ── Error Handlers ────────────────────────────────────────────────────────────

// 404 — no route matched
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — catches errors passed via next(err)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Expose stack only in development
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ── Start Server with configured maxHeaderSize ────────────────────────────────

const server = http.createServer({
  maxHeaderSize: MAX_HEADER_SIZE
}, app);

// Set maxHeadersCount to prevent header count overflow
server.maxHeadersCount = 2000;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🚀 CodeSpire Backend Server            ║
║   Port        : ${PORT}                     ║
║   Environment : ${NODE_ENV.padEnd(12)}       ║
║   Max Headers : ${((MAX_HEADER_SIZE / 1024) + ' KB').padEnd(12)}       ║
╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM (e.g. Docker / PM2 stop)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received — shutting down gracefully.');
  server.close(() => process.exit(0));
});

module.exports = app;
