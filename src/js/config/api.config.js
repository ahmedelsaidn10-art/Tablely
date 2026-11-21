// Set VITE_API_BASE_URL in a local .env file when the backend is ready.
export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');
