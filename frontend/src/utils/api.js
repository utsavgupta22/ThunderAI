/**
 * API utility - constructs full URLs using VITE_API_URL from .env
 * Falls back to /api (relative) for dev/proxy, or http://localhost:5000 as last resort
 */

const getApiUrl = () => {
  // In production (Vercel), use VITE_API_URL from .env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development with Vite proxy, use relative /api paths
  // In production without VITE_API_URL set, this will fallback to /api
  return '/api';
};

export const API_BASE_URL = getApiUrl();

/**
 * Build a full API URL
 * @param {string} endpoint - e.g., '/chats', '/auth/login', '/chat'
 * @returns {string} - full URL ready for fetch
 */
export const buildApiUrl = (endpoint) => {
  // If API_BASE_URL already contains /api, don't duplicate it
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}${endpoint}`;
  }
  // If endpoint doesn't start with /, add it
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

/**
 * Generic fetch wrapper with auth token
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  return response;
};
