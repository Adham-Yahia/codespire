/**
 * ProfilePage.js
 * --------------
 * Authenticated user profile & settings page.
 * Lets the user update their name, specialization, and theme preference.
 * Uses AuthContext.updateProfile() → PUT /api/auth/profile.
 */

import React, { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './LoginPage.css';
import './ProfilePage.css';

const SPECIALIZATIONS = [
  { value: 'none',               label: 'Not sure yet',          icon: '🤔' },
  { value: 'ai',                 label: 'AI',                    icon: '🤖' },
  { value: 'data-science',       label: 'Data Science',          icon: '📊' },
  { value: 'web-development',    label: 'Web Dev',               icon: '🌐' },
  { value: 'mobile-development', label: 'Mobile Dev',            icon: '📱' },
  { value: 'cybersecurity',      label: 'Cybersecurity',         icon: '🔐' },
  { value: 'cloud-computing',    label: 'Cloud',                 icon: '☁️' },
];

/** Returns the first 1–2 uppercase initials from a name string. */
const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

const ProfilePage = ({ onNavigate }) => {
  const { user, updateProfile, logout } = useAuth();
  const { isDarkMode } = useTheme();

  const [form, setForm] = useState({
    name:           user?.name           || '',
    specialization: user?.specialization || 'none',
    theme:          user?.theme          || 'dark',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const setTheme = (t) => {
    setForm(prev => ({ ...prev, theme: t }));
    setError('');
    setSuccess('');
  };

  const setSpec = (v) => {
    setForm(prev => ({ ...prev, specialization: v }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name:           form.name.trim(),
        specialization: form.specialization,
        theme:          form.theme,
      });
      setSuccess('Profile updated successfully! ✨');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className={`profile-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={`profile-card ${isDarkMode ? 'dark' : 'light'}`}>

        {/* Avatar + name */}
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{getInitials(user?.name)}</div>
          <p className="profile-greeting">{user?.name}</p>
          <p className="profile-email">{user?.email}</p>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="profile-success" role="status">
            <span>✅</span> {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <p className="profile-section-title">Display Name</p>
          <div className="auth-form">
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input
                id="profile-name"
                name="name"
                type="text"
                className="auth-input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Specialization */}
          <p className="profile-section-title">Field of Interest</p>
          <div className="spec-badge-grid" style={{ marginBottom: '1.5rem' }}>
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                id={`profile-spec-${s.value}`}
                className={`spec-badge${form.specialization === s.value ? ' selected' : ''}`}
                onClick={() => setSpec(s.value)}
                disabled={loading}
              >
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Theme */}
          <p className="profile-section-title">Theme Preference</p>
          <div className="theme-toggle-row" style={{ marginBottom: '0.5rem' }}>
            <button
              type="button"
              id="profile-theme-dark"
              className={`theme-btn${form.theme === 'dark' ? ' active' : ''}`}
              onClick={() => setTheme('dark')}
              disabled={loading}
            >
              🌙 Dark
            </button>
            <button
              type="button"
              id="profile-theme-light"
              className={`theme-btn${form.theme === 'light' ? ' active' : ''}`}
              onClick={() => setTheme('light')}
              disabled={loading}
            >
              ☀️ Light
            </button>
          </div>

          {/* Save */}
          <button
            id="profile-save-btn"
            type="submit"
            className="profile-save-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Saving…</>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>

        <hr className="profile-divider" />

        {/* Sign out */}
        <button
          id="profile-logout-btn"
          type="button"
          className="profile-danger-btn"
          onClick={handleLogout}
        >
          Sign out of CodeSpire
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;
