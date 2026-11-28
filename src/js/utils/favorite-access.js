import { getCurrentUser } from '../services/auth.service.js';

// Keep private account actions behind the same sign-in and verification check.
export function requireVerifiedUser() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }

  if (user.emailVerified !== true) {
    const email = encodeURIComponent(user.email || '');
    window.location.href = `verify-email.html${email ? `?email=${email}` : ''}`;
    return false;
  }

  return true;
}

export const canUseFavorites = requireVerifiedUser;
