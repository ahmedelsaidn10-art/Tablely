import { ApiError, apiGet, apiPost, clearCsrfToken, setCsrfToken } from './api-client.js';

let currentUser = null;

function errorResult(error) {
  if (!(error instanceof ApiError)) {
    return { success: false, error: 'request-failed', message: 'Could not connect to the server.' };
  }
  return {
    success: false,
    error: error.code || 'request-failed',
    message: error.message,
    fields: error.fields,
    status: error.status,
  };
}

function updateUser(envelope) {
  currentUser = envelope?.data?.user || null;
  setCsrfToken(envelope?.data?.csrfToken);
  return currentUser;
}

export async function registerUser({ name, email, password }) {
  try {
    const result = await apiPost('auth/register', {
      name: String(name || '').trim(),
      email: String(email || '').trim(),
      password,
    });
    return { success: true, user: updateUser(result), message: result.message };
  } catch (error) {
    return errorResult(error);
  }
}

export async function verifyEmail({ email, code }) {
  try {
    const result = await apiPost('auth/verify-email', { email, code });
    return { success: true, user: updateUser(result), message: result.message };
  } catch (error) {
    return errorResult(error);
  }
}

export async function resendVerificationCode(email) {
  try {
    const result = await apiPost('auth/resend-otp', { email });
    return { success: true, message: result.message };
  } catch (error) {
    return errorResult(error);
  }
}

export async function loginUser({ email, password }) {
  try {
    const result = await apiPost('auth/login', { email, password });
    return { success: true, user: updateUser(result), message: result.message };
  } catch (error) {
    return errorResult(error);
  }
}

export async function loadCurrentUser() {
  try {
    return updateUser(await apiGet('auth/me'));
  } catch (error) {
    currentUser = null;
    clearCsrfToken();
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function getCurrentUser() {
  return currentUser;
}

export async function logoutUser() {
  try {
    await apiPost('auth/logout');
  } finally {
    currentUser = null;
    clearCsrfToken();
  }
}
