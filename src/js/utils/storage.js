// Keep browser storage calls in one place so the app can switch to an API later.
export function getStoredValue(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;

    try {
      return JSON.parse(value);
    } catch {
      // Support simple strings saved before values were stored as JSON.
      return value;
    }
  } catch {
    return fallback;
  }
}

export function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}
