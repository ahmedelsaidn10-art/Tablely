import { STORAGE_KEYS } from '../config/constants.js';
import { reviews as initialReviews } from '../data/reviews.data.js';
import { getStoredValue, setStoredValue } from '../utils/storage.js';

function getSavedReviews() {
  const savedReviews = getStoredValue(STORAGE_KEYS.reviews, []);
  return Array.isArray(savedReviews) ? savedReviews : [];
}

// Reviews stored by this browser belong to the current guest until auth exists.
export function getMyReviews() {
  return getSavedReviews().sort((a, b) => (
    new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date)
  ));
}

export function getReviewsByRestaurant(restaurantId) {
  return [
    ...initialReviews.filter((review) => review.restaurantId === restaurantId),
    ...getSavedReviews().filter((review) => review.restaurantId === restaurantId),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addReview(reviewDetails) {
  const review = {
    ...reviewDetails,
    id: globalThis.crypto?.randomUUID?.() || `review-${Date.now()}`,
    author: 'Guest',
    date: new Date().toISOString(),
  };
  const saved = setStoredValue(STORAGE_KEYS.reviews, [...getSavedReviews(), review]);
  return saved ? review : null;
}

export function updateReview(reviewId, changes) {
  const currentReviews = getSavedReviews();
  const reviewIndex = currentReviews.findIndex((review) => review.id === reviewId);
  if (reviewIndex === -1) return null;

  const updatedReview = {
    ...currentReviews[reviewIndex],
    rating: Number(changes.rating),
    comment: String(changes.comment || '').trim(),
    updatedAt: new Date().toISOString(),
  };
  const nextReviews = [...currentReviews];
  nextReviews[reviewIndex] = updatedReview;
  return setStoredValue(STORAGE_KEYS.reviews, nextReviews) ? updatedReview : null;
}

export function deleteReview(reviewId) {
  const currentReviews = getSavedReviews();
  const nextReviews = currentReviews.filter((review) => review.id !== reviewId);
  if (nextReviews.length === currentReviews.length) return false;
  return setStoredValue(STORAGE_KEYS.reviews, nextReviews);
}

export function getRatingSummary(restaurant) {
  const addedReviews = getSavedReviews().filter((review) => review.restaurantId === restaurant.id);
  const baseCount = Number(restaurant.reviewCount) || 0;
  const addedCount = addedReviews.length;
  const totalCount = baseCount + addedCount;
  const totalRating = (Number(restaurant.rating) || 0) * baseCount
    + addedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);

  return {
    count: totalCount,
    average: totalCount ? totalRating / totalCount : 0,
  };
}
