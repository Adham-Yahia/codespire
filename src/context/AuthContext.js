/**
 * AuthContext.js
 * --------------
 * Global authentication state for CodeSpire.
 *
 * Provides:
 *   { user, token, loading, login, register, logout, updateProfile }
 *
 * Token + user are persisted in localStorage so sessions survive refresh.
 * On login the user's theme preference is synced to ThemeContext.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import api, { cleanToken, cleanStaleCookies } from '../services/api';
import { useTheme } from './ThemeContext';

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ── Storage helpers ───────────────────────────────────────────────────────────

const TOKEN_KEY = 'cs_token';
const USER_KEY  = 'cs_user';

const saveSession = (token, user) => {
  const cleaned = cleanToken(token);
  if (cleaned) {
    localStorage.setItem(TOKEN_KEY, cleaned);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const loadSession = () => {
  try {
    const rawToken = localStorage.getItem(TOKEN_KEY);
    const token = cleanToken(rawToken);
    const user  = JSON.parse(localStorage.getItem(USER_KEY));
    return token && user ? { token, user } : null;
  } catch {
    return null;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  // true while we're restoring session from localStorage
  const [loading, setLoading] = useState(true);

  // ── Sync user's theme preference from the DB ─────────────────────────────

  /**
   * After login/register/profileUpdate, ensure the in-app theme
   * matches what the user saved in their profile.
   */
  const syncTheme = useCallback((dbTheme) => {
    const wantsDark = dbTheme === 'dark';
    if (wantsDark !== isDarkMode) toggleTheme();
  }, [isDarkMode, toggleTheme]);

  // ── Restore session on mount ──────────────────────────────────────────────

  useEffect(() => {
    // Proactively clean up any stale cookies on localhost to prevent 431 errors
    cleanStaleCookies();

    const session = loadSession();
    if (session) {
      setToken(session.token);
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Authenticate with email + password.
   * Saves token + user, syncs theme.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, ...userData } = res.data;
    saveSession(t, userData);
    setToken(t);
    setUser(userData);
    syncTheme(userData.theme);
    return userData;
  };

  /**
   * Create a new account.
   * @param {{ name, email, password, specialization, theme }} data
   */
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: t, ...userData } = res.data;
    saveSession(t, userData);
    setToken(t);
    setUser(userData);
    syncTheme(userData.theme);
    return userData;
  };

  /**
   * Update name / specialization / theme on the logged-in user.
   * @param {{ name?, specialization?, theme? }} updates
   */
  const updateProfile = async (updates) => {
    const res = await api.put('/auth/profile', updates);
    const updated = res.data;
    // Re-save with the same token
    saveSession(token, updated);
    setUser(updated);
    if (updates.theme) syncTheme(updates.theme);
    return updated;
  };

  /** Clear all auth state and send user back to home. */
  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  // ── Value ─────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
