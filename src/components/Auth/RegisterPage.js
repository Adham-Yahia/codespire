/**
 * RegisterPage.js
 * ---------------
 * Registration form. Calls AuthContext.register() which hits
 * POST /api/auth/register, stores the JWT, and navigates home on success.
 */

import React, { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './LoginPage.css';
import './RegisterPage.css';

const SPECIALIZATIONS = [
  { value: 'none',              label: 'Not sure yet'          },
  { value: 'ai',                label: 'Artificial Intelligence' },
  { value: 'data-science',      label: 'Data Science'           },
  { value: 'web-development',   label: 'Web Development'        },
  { value: 'mobile-development',label: 'Mobile Development'     },
  { value: 'cybersecurity',     label: 'Cybersecurity'          },
  { value: 'cloud-computing',   label: 'Cloud Computing'        },
];

const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const { isDarkMode } = useTheme();

  const [form, setForm] = useState({
    name:           '',
    email:          '',
    password:       '',
    specialization: 'none',
    theme:          'dark',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const setTheme = (t) => setForm(prev => ({ ...prev, theme: t }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!form.name.trim())     { setError('Name is required.');                return; }
    if (!form.email.trim())    { setError('Email is required.');               return; }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name:           form.name.trim(),
        email:          form.email.trim(),
        password:       form.password,
        specialization: form.specialization,
        theme:          form.theme,
      });
      onNavigate('home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={`auth-card ${isDarkMode ? 'dark' : 'light'}`}>

        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">✨</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join CodeSpire and start your journey</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              className="auth-input"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              className="auth-input"
              placeholder="ada@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password <span style={{opacity:0.5,fontSize:'0.8em'}}>(min. 6 chars)</span></label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label htmlFor="reg-spec">Your field of interest</label>
            <select
              id="reg-spec"
              name="specialization"
              className="auth-select"
              value={form.specialization}
              onChange={handleChange}
              disabled={loading}
            >
              {SPECIALIZATIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Theme preference */}
          <div className="form-group">
            <label>Theme preference</label>
            <div className="theme-toggle-row">
              <button
                type="button"
                id="reg-theme-dark"
                className={`theme-btn${form.theme === 'dark' ? ' active' : ''}`}
                onClick={() => setTheme('dark')}
                disabled={loading}
              >
                🌙 Dark
              </button>
              <button
                type="button"
                id="reg-theme-light"
                className={`theme-btn${form.theme === 'light' ? ' active' : ''}`}
                onClick={() => setTheme('light')}
                disabled={loading}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Creating account…</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{' '}
          <button
            className="auth-link"
            onClick={() => onNavigate('login')}
            type="button"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
