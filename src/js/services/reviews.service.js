import { apiDelete, apiGet, apiPost, apiPut } from './api-client.js';

function paginationQuery({ page = 1, pageSize = 6 } = {}) {
  return new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
}

export async function getMyReviews(options = {}) {
  const response = await apiGet(`reviews/mine?${paginationQuery(options)}`);
  return response?.data || { items: [], page: 1, pageSize: 6, totalItems: 0, totalPages: 0 };
}

export async function getReviewsByRestaurant(restaurantId, options = {}) {
  const response = await apiGet(`restaurants/${encodeURIComponent(restaurantId)}/reviews?${paginationQuery(options)}`);
  return response?.data || { items: [], page: 1, pageSize: 6, totalItems: 0, totalPages: 0 };
}

export async function addReview(restaurantId, { rating, comment = '' }) {
  const response = await apiPost(`restaurants/${encodeURIComponent(restaurantId)}/reviews`, {
    rating: Number(rating),
    comment: String(comment).trim(),
  });
  return response?.data?.review || null;
}

export async function updateReview(reviewId, changes) {
  const response = await apiPut(`reviews/${encodeURIComponent(reviewId)}`, {
    ...(changes.rating !== undefined ? { rating: Number(changes.rating) } : {}),
    ...(changes.comment !== undefined ? { comment: String(changes.comment).trim() } : {}),
  });
  return response?.data?.review || null;
}

export async function deleteReview(reviewId) {
  const response = await apiDelete(`reviews/${encodeURIComponent(reviewId)}`);
  return response?.success === true;
}
