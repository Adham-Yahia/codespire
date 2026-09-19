/**
 * LoginPage.js
 * ------------
 * Login form. Calls AuthContext.login() which hits POST /api/auth/login,
 * stores the JWT, and navigates to home on success.
 */

import React, { useState } from 'react';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './LoginPage.css';

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      onNavigate('home'); // redirect on success
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isDarkMode ? 'dark' : 'light'}`}>
      <div className={`auth-card ${isDarkMode ? 'dark' : 'light'}`}>

        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🚀</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your CodeSpire account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              className={`auth-input${error ? ' input-error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`auth-input${error ? ' input-error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <button
            className="auth-link"
            onClick={() => onNavigate('register')}
            type="button"
          >
            Create one
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
