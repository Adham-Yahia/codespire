/**
 * authController.js
 * -----------------
 * Business logic for all authentication endpoints.
 *
 * Routes handled:
 *   POST /api/auth/register   — create account
 *   POST /api/auth/login      — authenticate & issue token
 *   GET  /api/auth/me         — fetch own profile  (protected)
 *   PUT  /api/auth/profile    — update own profile (protected)
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Signs and returns a JWT for the given user ID.
 * Token expires in 30 days.
 * @param   {string} id  - MongoDB ObjectId of the user
 * @returns {string}     - Signed JWT
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * Returns only the safe, public fields for a user document.
 * Keeps response shapes consistent across all endpoints.
 * @param   {import('../models/User')} user
 * @returns {object}
 */
const formatUser = (user) => ({
  _id:            user._id,
  name:           user.name,
  email:          user.email,
  specialization: user.specialization,
  theme:          user.theme,
  createdAt:      user.createdAt,
  updatedAt:      user.updatedAt
});

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user account
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, specialization, theme } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and password are required'
      });
    }

    // Prevent duplicate accounts
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists'
      });
    }

    // Create user — password is hashed by the pre-save hook in the model
    const user = await User.create({
      name,
      email,
      password,
      specialization: specialization || 'none',
      theme:          theme          || 'light'
    });

    res.status(201).json({
      success: true,
      data: {
        ...formatUser(user),
        token: generateToken(user._id)
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user; returns a JWT on success
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required'
      });
    }

    // Include password field (excluded by default via `select: false`)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      // Return a generic message to avoid email enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        ...formatUser(user),
        token: generateToken(user._id)
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Return the currently authenticated user's profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // req.user is populated by the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: formatUser(user) });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update the authenticated user's name, specialization, or theme
 * @access  Private
 *
 * Only name, specialization, and theme are updatable via this endpoint.
 * Password changes are intentionally excluded from this route.
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Apply only the fields the caller provided
    if (req.body.name           !== undefined) user.name           = req.body.name;
    if (req.body.specialization !== undefined) user.specialization = req.body.specialization;
    if (req.body.theme          !== undefined) user.theme          = req.body.theme;

    const updated = await user.save();

    res.json({ success: true, data: formatUser(updated) });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

/**
 * @route   GET /api/auth/users
 * @desc    Return a list of users for mentions autocomplete
 * @access  Public
 */
const getUsers = async (_req, res) => {
  try {
    const users = await User.find({}, '_id name specialization').sort({ name: 1 }).limit(100);
    res.json({
      success: true,
      data: users.map(u => ({
        _id: u._id,
        id: u._id,
        name: u.name,
        specialization: u.specialization
      }))
    });
  } catch (err) {
    console.error('getUsers error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

module.exports = { register, login, getProfile, updateProfile, getUsers };
