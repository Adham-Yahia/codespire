/**
 * User.js
 * -------
 * Mongoose User schema.
 * Fields: name, email, password, specialization, theme.
 * Password is hashed automatically before saving via a pre-save hook.
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Full display name
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name must be 50 characters or fewer']
    },

    // Unique login identifier — stored lowercase
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address'
      ]
    },

    // Stored as bcrypt hash; excluded from query results by default
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false
    },

    // User's primary area of interest
    specialization: {
      type:    String,
      enum:    [
        'ai',
        'data-science',
        'web-development',
        'mobile-development',
        'cybersecurity',
        'cloud-computing',
        'none'
      ],
      default: 'none'
    },

    // UI theme preference
    theme: {
      type:    String,
      enum:    ['light', 'dark'],
      default: 'light'
    }
  },
  {
    // Automatically manages createdAt and updatedAt timestamps
    timestamps: true
  }
);

// ── Pre-save Hook ─────────────────────────────────────────────────────────────

/**
 * Hash the password before saving if it has been modified.
 * Uses bcrypt with a salt factor of 10.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Compares a plain-text candidate password against the stored hash.
 * @param   {string}  candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
