// Keep local storage calls in one place for settings that stay in the browser.
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
