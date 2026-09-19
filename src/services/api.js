/**
 * api.js
 * ------
 * Lightweight fetch wrapper for the CodeSpire backend.
 *
 * Base URL is intentionally relative so the CRA dev-server proxy
 * (set to http://localhost:5000 in package.json) forwards all /api
 * requests without CORS restrictions.
 *
 * Usage:
 *   import api from '../services/api';
 *   const data = await api.post('/auth/login', { email, password });
 *   const me   = await api.get('/auth/me');
 */

const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // When running locally in browser on dev server (e.g. port 3000),
  // connecting to port 5000 directly guarantees requests work immediately
  // without depending on restarting the CRA development server.
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port !== '5000'
  ) {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const BASE_URL = getBaseUrl();

/**
 * Cleanly extracts and validates a JWT token string.
 * Strips accidental whitespace, wrapping quotes, and duplicate 'Bearer ' prefixes.
 * @param {string} token
 * @returns {string|null}
 */
export const cleanToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  let trimmed = token.trim();
  // Strip outer quotes if any
  trimmed = trimmed.replace(/^"+|"+$/g, '').trim();
  // Strip Bearer prefix if any
  trimmed = trimmed.replace(/^Bearer\s+/i, '').trim();
  // Strip remaining quotes if inner token was quoted
  trimmed = trimmed.replace(/^"+|"+$/g, '').trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  return trimmed;
};

/**
 * Cleans up non-HttpOnly cookies on the current domain and root path.
 * Useful for purging bloated cookies that accumulate on localhost from other
 * development projects, which commonly causes HTTP 431 (Header Fields Too Large).
 */
export const cleanStaleCookies = () => {
  if (typeof document === 'undefined' || !document.cookie) return;
  try {
    const cookies = document.cookie.split(';');
    const hostname = window.location.hostname;
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (!name) continue;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname}`;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost`;
      }
    }
  } catch (e) {
    console.warn('Could not clean stale cookies:', e);
  }
};

/**
 * Returns the stored JWT token, or null if the user is not logged in.
 */
const getToken = () => cleanToken(localStorage.getItem('cs_token'));

/**
 * Build clean headers without case-insensitive duplicates.
 */
const buildHeaders = (customHeaders = {}, token = null) => {
  const headers = {};
  const normalized = {};

  if (customHeaders) {
    Object.entries(customHeaders).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        normalized[k.toLowerCase()] = { key: k, value: v };
      }
    });
  }

  // Set default Content-Type if not provided
  if (!normalized['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Set Authorization header if token exists and not overridden
  if (token && !normalized['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge custom headers
  Object.values(normalized).forEach(({ key, value }) => {
    headers[key] = value;
  });

  return headers;
};

/**
 * Core request function.
 * @param {string} endpoint  - e.g. '/auth/login'
 * @param {object} options   - standard fetch options
 * @returns {Promise<object>} - parsed JSON response body
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = buildHeaders(options.headers, token);

  // Set credentials to 'omit' by default to prevent bloated localhost cookies
  // from being sent with requests (CodeSpire uses Bearer JWT tokens).
  const fetchOptions = {
    credentials: options.credentials || 'omit',
    ...options,
    headers
  };
  delete fetchOptions._isRetry;

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
  } catch (networkErr) {
    // If direct connection failed, attempt relative proxy path as fallback
    if (BASE_URL !== '/api') {
      try {
        response = await fetch(`/api${endpoint}`, fetchOptions);
      } catch {
        const err = new Error('Unable to reach the server. Please make sure the backend is running on port 5000.');
        err.status = 0;
        throw err;
      }
    } else {
      const err = new Error('Unable to reach the server. Please make sure the backend is running on port 5000.');
      err.status = 0;
      throw err;
    }
  }

  // Handle HTTP 431 Request Header Fields Too Large automatically
  if (response.status === 431 && !options._isRetry) {
    console.warn('⚠️ HTTP 431 Header Too Large received. Purging stale cookies and retrying with minimal headers...');
    cleanStaleCookies();
    return request(endpoint, {
      ...options,
      credentials: 'omit',
      _isRetry: true
    });
  }

  // Parse JSON response safely
  let json;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    json = await response.json();
  } else {
    const text = await response.text();
    try {
      json = JSON.parse(text);
    } catch {
      const is431 = response.status === 431;
      const msg = is431
        ? 'Request headers too large (HTTP 431). Stale cookies on localhost may need to be cleared.'
        : `Server returned unexpected response (${response.status})`;
      const err = new Error(msg);
      err.status = response.status;
      throw err;
    }
  }

  // Throw a normalised error so callers only need one catch branch
  if (!response.ok) {
    const err = new Error(json.message || 'Request failed');
    err.status = response.status;
    throw err;
  }

  return json;
};

// ── Convenience methods ──────────────────────────────────────────────────────

const api = {
  get:    (endpoint, options)        => request(endpoint, { method: 'GET', ...options }),
  post:   (endpoint, body, options)  => request(endpoint, { method: 'POST',  body: JSON.stringify(body), ...options }),
  put:    (endpoint, body, options)  => request(endpoint, { method: 'PUT',   body: JSON.stringify(body), ...options }),
  delete: (endpoint, options)        => request(endpoint, { method: 'DELETE', ...options })
};

export default api;
