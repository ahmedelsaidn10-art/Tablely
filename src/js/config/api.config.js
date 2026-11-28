// The backend API root is configured with VITE_API_BASE_URL.
export const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');
