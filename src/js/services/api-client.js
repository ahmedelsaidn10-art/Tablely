import { API_BASE_URL } from '../config/api.config.js';

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Send a JSON request to the configured backend.
export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('The backend URL is not configured. Set VITE_API_BASE_URL first.');
  }

  const endpoint = String(path).replace(/^\/+/, '');
  const headers = new Headers(options.headers || {});
  let body = options.body;

  if (body !== undefined && body !== null && typeof body !== 'string' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers,
      body,
    });
  } catch (error) {
    throw new ApiError(error.message || 'Could not connect to the backend.');
  }

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (response.status !== 204) {
    try {
      data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : `The backend request failed (${response.status}).`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: 'GET' });
}

export function apiPost(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'POST', body });
}

export function apiPut(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'PUT', body });
}

export function apiDelete(path, options = {}) {
  return apiRequest(path, { ...options, method: 'DELETE' });
}
