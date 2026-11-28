import { apiGet } from './api-client.js';

function queryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

// Search, filter, sort, and paginate restaurants through the backend API.
export async function getRestaurants(filters = {}) {
  const query = queryString(filters);
  const response = await apiGet(`restaurants${query ? `?${query}` : ''}`);
  return response?.data || { items: [], page: 1, pageSize: 6, totalItems: 0, totalPages: 0 };
}

export async function getFeaturedRestaurants(pageSize = 3) {
  const result = await getRestaurants({ page: 1, pageSize, sort: 'highest' });
  return result.items || [];
}

export async function getRestaurantById(restaurantId) {
  if (!/^\d+$/.test(String(restaurantId))) return null;
  const response = await apiGet(`restaurants/${encodeURIComponent(restaurantId)}`);
  return response?.data?.restaurant || null;
}
