import { STORAGE_KEYS } from '../config/constants.js';
import { users as initialUsers } from '../data/users.data.js';
import { getStoredValue, setStoredValue } from '../utils/storage.js';

// Temporary local demo authentication. The backend must handle passwords before production.

function getUsers() {
  const storedUsers = getStoredValue(STORAGE_KEYS.users, initialUsers);
  return Array.isArray(storedUsers) ? storedUsers : [];
}

function saveCurrentUser(user, rememberMe) {
  const safeUser = { name: user.name, email: user.email, phone: user.phone || '' };
  try { localStorage.removeItem(STORAGE_KEYS.currentUser); } catch { /* Continue with session storage. */ }
  try { sessionStorage.removeItem(STORAGE_KEYS.currentUser); } catch { /* Continue with local storage. */ }

  if (rememberMe) return setStoredValue(STORAGE_KEYS.currentUser, safeUser);

  try {
    sessionStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(safeUser));
    return true;
  } catch {
    return false;
  }
}

export function registerUser({ name, email, phone, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const currentUsers = getUsers();
  const existingIndex = currentUsers.findIndex((user) => (
    String(user.email || '').trim().toLowerCase() === normalizedEmail
  ));
  const existingUser = currentUsers[existingIndex];

  // Old locally registered accounts used hashes and cannot be converted back to passwords.
  // Let the user register that email again to replace the old local record.
  if (existingUser && !Object.hasOwn(existingUser, 'passwordHash')) {
    return { success: false, error: 'email-exists' };
  }

  const user = {
    name: String(name || '').trim(),
    email: normalizedEmail,
    phone: String(phone || '').trim(),
    // Stored as plain text only until authentication is moved to the backend.
    password: String(password || ''),
    createdAt: existingUser?.createdAt || new Date().toISOString(),
  };
  const nextUsers = existingIndex >= 0
    ? currentUsers.map((savedUser, index) => index === existingIndex ? user : savedUser)
    : [...currentUsers, user];

  if (!setStoredValue(STORAGE_KEYS.users, nextUsers)) {
    return { success: false, error: 'storage-unavailable' };
  }
  return {
    success: true,
    user: { name: user.name, email: user.email, phone: user.phone },
  };
}

export function loginUser({ email, password, rememberMe = false }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = getUsers().find((savedUser) => (
    String(savedUser.email || '').trim().toLowerCase() === normalizedEmail
    && String(savedUser.password || '') === String(password || '')
  ));
  if (!user) return { success: false, error: 'invalid-credentials' };

  if (!saveCurrentUser(user, rememberMe)) {
    return { success: false, error: 'storage-unavailable' };
  }
  return { success: true, user: { name: user.name, email: user.email, phone: user.phone || '' } };
}

export function getCurrentUser() {
  try {
    const savedUser = getStoredValue(STORAGE_KEYS.currentUser);
    if (savedUser?.email) return savedUser;

    const sessionUser = sessionStorage.getItem(STORAGE_KEYS.currentUser);
    const parsedUser = sessionUser ? JSON.parse(sessionUser) : null;
    return parsedUser?.email ? parsedUser : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  try { localStorage.removeItem(STORAGE_KEYS.currentUser); } catch { /* Storage may be restricted. */ }
  try { sessionStorage.removeItem(STORAGE_KEYS.currentUser); } catch { /* Storage may be restricted. */ }
}
