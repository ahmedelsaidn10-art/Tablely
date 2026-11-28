import { API_BASE_URL } from '../config/api.config.js';

export class ApiError extends Error {
  constructor(message, { status = 0, data = null, code = null, fields = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.code = code;
    this.fields = fields;
  }
}

function readCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

// Send a JSON request to the configured backend.
export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('The backend URL is not configured. Set VITE_API_BASE_URL first.');
  }

  const endpoint = String(path).replace(/^\/+/, '');
  const headers = new Headers(options.headers || {});
  const method = String(options.method || 'GET').toUpperCase();
  let body = options.body;

  if (body !== undefined && body !== null && typeof body !== 'string' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = readCookie('csrf_access_token');
    if (csrfToken) headers.set('X-CSRF-TOKEN', csrfToken);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      method,
      credentials: 'include',
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
    const responseData = data && typeof data === 'object' ? data.data : null;
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : `The backend request failed (${response.status}).`;
    throw new ApiError(message, {
      status: response.status,
      data,
      code: responseData?.code || null,
      fields: responseData?.fields || null,
    });
  }

  if (data && typeof data === 'object' && data.success === false) {
    throw new ApiError(data.message || 'The backend request failed.', {
      status: response.status,
      data,
      code: data.data?.code || null,
      fields: data.data?.fields || null,
    });
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
