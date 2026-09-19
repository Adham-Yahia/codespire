/**
 * authRoutes.js
 * -------------
 * Mounts all authentication API endpoints under /api/auth.
 *
 *   POST /api/auth/register   — public
 *   POST /api/auth/login      — public
 *   GET  /api/auth/me         — private (JWT required)
 *   PUT  /api/auth/profile    — private (JWT required)
 */

const express = require('express');
const router  = express.Router();

const { register, login, getProfile, updateProfile, getUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ── Public Routes ─────────────────────────────────────────────────────────────

router.post('/register', register);
router.post('/login',    login);
router.get('/users',     getUsers);

// ── Protected Routes (JWT required) ──────────────────────────────────────────

router.get('/me',       protect, getProfile);
router.put('/profile',  protect, updateProfile);

module.exports = router;
