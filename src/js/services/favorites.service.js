import { STORAGE_KEYS } from '../config/constants.js';
import { getStoredValue, setStoredValue } from '../utils/storage.js';

export function getFavoriteIds() {
  const ids = getStoredValue(STORAGE_KEYS.favorites, []);
  return Array.isArray(ids) ? ids : [];
}

export function isFavorite(restaurantId) {
  return getFavoriteIds().includes(restaurantId);
}

export function toggleFavorite(restaurantId) {
  const currentIds = getFavoriteIds();
  const isSaved = currentIds.includes(restaurantId);
  const nextIds = isSaved
    ? currentIds.filter((id) => id !== restaurantId)
    : [...currentIds, restaurantId];

  setStoredValue(STORAGE_KEYS.favorites, nextIds);
  return !isSaved;
}
