import { apiDelete, apiGet, apiPost } from './api-client.js';

let favoriteIds = new Set();

function rememberFavorites(items = []) {
  favoriteIds = new Set(items.map((item) => String(item.id ?? item.restaurantId)));
  return favoriteIds;
}

export function getFavoriteIds() {
  return [...favoriteIds];
}

export function isFavorite(restaurantId) {
  return favoriteIds.has(String(restaurantId));
}

export async function loadFavorites({ page = 1, pageSize = 50 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  const response = await apiGet(`favorites?${params}`);
  const result = response?.data || { items: [], page, pageSize, totalItems: 0, totalPages: 0 };
  rememberFavorites(result.items);
  return result;
}

export async function addFavorite(restaurantId) {
  const response = await apiPost('favorites', { restaurantId: Number(restaurantId) });
  favoriteIds.add(String(restaurantId));
  return response?.data;
}

export async function removeFavorite(restaurantId) {
  const response = await apiDelete(`favorites/${encodeURIComponent(restaurantId)}`);
  favoriteIds.delete(String(restaurantId));
  return response?.success === true;
}

export async function toggleFavorite(restaurantId) {
  if (isFavorite(restaurantId)) {
    await removeFavorite(restaurantId);
    return false;
  }
  await addFavorite(restaurantId);
  return true;
}
