import { deleteReview, getMyReviews, updateReview } from '../services/reviews.service.js';
import { escapeHTML } from '../utils/helpers.js';

const page = document.querySelector('[data-my-reviews-page]');
const reviewsContainer = document.querySelector('#reviews-container');
const pagination = document.querySelector('#my-reviews-pagination');
const emptyState = document.querySelector('#reviews-empty');
const editModal = document.querySelector('#edit-review-modal');
const deleteModal = document.querySelector('#delete-review-modal');
const editForm = document.querySelector('#edit-review-form');
const commentInput = document.querySelector('#edit-review-comment');
const ratingValue = document.querySelector('#edit-rating-value');
const toast = document.querySelector('#review-toast');
const toastMessage = document.querySelector('#review-toast-message');

let reviews = [];
let activeFilter = 'all';
let selectedReview = null;
let selectedRating = 0;
let activeModal = null;
let returnFocusTo = null;
let toastTimer;
let currentPage = 1;
let totalPages = 0;
let totalReviews = 0;

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function getPlaceType(review) {
  return (review.restaurant?.type || review.placeType || 'Restaurant').toLowerCase();
}

function createStars(rating) {
  return Array.from({ length: 5 }, (_, index) => {
    const active = index < Number(rating);
    return `<span class="material-symbols-outlined ${active ? 'text-tertiary' : 'text-surface-highest'}" style="font-variation-settings: 'FILL' 1" aria-hidden="true">star</span>`;
  }).join('');
}

function createReviewMarkup(review) {
  const place = review.restaurant;
  const placeName = place?.name || review.restaurantName || 'Restaurant';
  const placeType = place?.type || review.placeType || 'Restaurant';
  const cuisine = place?.cuisine || 'Dining experience';
  const location = place?.location || '';
  const image = place?.image || '/images/restaurants/category-restaurants.jpg';
  const imageAlt = place?.imageAlt || `${placeName} venue`;
  const dateLabel = formatDate(review.date);
  const updatedLabel = review.updatedAt ? `Updated ${formatDate(review.updatedAt)}` : '';

  return `
    <article class="flex flex-col gap-4 rounded-2xl border border-surface-high bg-surface p-4 shadow-sm transition hover:shadow-md sm:p-5 md:flex-row md:gap-5" data-review-id="${escapeHTML(review.id)}">
      <a class="h-48 shrink-0 overflow-hidden rounded-xl bg-surface-high md:h-auto md:w-56 lg:w-64" href="restaurant-details.html?id=${encodeURIComponent(review.restaurantId)}" aria-label="View ${escapeHTML(placeName)} details">
        <img class="h-full w-full object-cover transition duration-500 hover:scale-105" src="${escapeHTML(image)}" alt="${escapeHTML(imageAlt)}" loading="lazy" />
      </a>
      <div class="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <span class="inline-flex rounded-full bg-surface-low px-2.5 py-1 text-[11px] font-bold text-on-surface-variant">${escapeHTML(placeType)}</span>
              <h2 class="mt-2 font-display text-lg font-bold text-on-surface">${escapeHTML(placeName)}</h2>
              <p class="mt-1 text-xs text-on-surface-variant">${escapeHTML(cuisine)}${location ? ` <span aria-hidden="true">·</span> ${escapeHTML(location)}` : ''}</p>
            </div>
            <div class="flex shrink-0 items-center gap-1.5 rounded-full bg-tertiary-fixed/50 px-3 py-1.5" aria-label="${Number(review.rating)} out of 5 stars">
              <div class="flex">${createStars(review.rating)}</div><span class="text-sm font-extrabold text-on-surface">${Number(review.rating)}.0</span>
            </div>
          </div>
          <p class="mt-4 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-base text-primary" aria-hidden="true">event_available</span>
            <time datetime="${escapeHTML(review.date || '')}">${escapeHTML(dateLabel)}</time>
            ${updatedLabel ? `<span aria-hidden="true">·</span><span>${escapeHTML(updatedLabel)}</span>` : '<span aria-hidden="true">·</span><span class="font-semibold text-primary">Verified reservation</span>'}
          </p>
          ${review.comment ? `<p class="mt-3 whitespace-pre-line text-sm leading-6 text-on-surface-variant">${escapeHTML(review.comment)}</p>` : '<p class="mt-3 text-sm italic text-on-surface-variant">No written comment.</p>'}
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-surface-high pt-3">
          <a class="inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2" href="restaurant-details.html?id=${encodeURIComponent(review.restaurantId)}">View restaurant details <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></a>
          <div class="flex items-center gap-2">
            <button class="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-surface-low px-3.5 py-2 text-xs font-bold text-on-surface transition hover:bg-surface-high" data-action="edit" type="button"><span class="material-symbols-outlined text-base" aria-hidden="true">edit</span>Edit</button>
            <button class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-low text-on-surface-variant transition hover:bg-red-100 hover:text-red-700" data-action="delete" type="button" aria-label="Delete review for ${escapeHTML(placeName)}"><span class="material-symbols-outlined text-lg" aria-hidden="true">delete</span></button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function updateMetrics() {
  const total = totalReviews;
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;
  const places = new Set(reviews.map((review) => review.restaurantId)).size;

  document.querySelector('#metric-total').textContent = String(total);
  document.querySelector('#metric-average').textContent = total ? average.toFixed(1) : '—';
  document.querySelector('#metric-places').textContent = String(places);

  const counts = {
    all: totalReviews,
    restaurant: reviews.filter((review) => getPlaceType(review) === 'restaurant').length,
    cafe: reviews.filter((review) => getPlaceType(review) === 'cafe').length,
  };
  document.querySelectorAll('[data-filter-count]').forEach((count) => {
    count.textContent = `(${counts[count.dataset.filterCount] || 0})`;
  });
}

function updateFilterButtons() {
  document.querySelectorAll('.review-filter').forEach((button) => {
    const selected = button.dataset.filter === activeFilter;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('bg-primary', selected);
    button.classList.toggle('text-on-primary', selected);
    button.classList.toggle('font-bold', selected);
    button.classList.toggle('bg-surface-low', !selected);
    button.classList.toggle('text-on-surface-variant', !selected);
    button.classList.toggle('font-semibold', !selected);
  });
}

function renderReviews() {
  updateMetrics();
  updateFilterButtons();
  const visibleReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter((review) => getPlaceType(review) === activeFilter);

  reviewsContainer.innerHTML = visibleReviews.map(createReviewMarkup).join('');
  reviewsContainer.classList.toggle('hidden', visibleReviews.length === 0);
  emptyState.classList.toggle('hidden', visibleReviews.length > 0);

  const hasAnyReviews = totalReviews > 0;
  document.querySelector('#empty-title').textContent = hasAnyReviews
    ? `No ${activeFilter === 'cafe' ? 'cafe' : 'restaurant'} reviews yet`
    : 'You have not written any reviews yet';
  document.querySelector('#empty-description').textContent = hasAnyReviews
    ? 'Choose another filter to see your reviews.'
    : 'After you book a place, share your experience from its details page and your review will appear here.';
  document.querySelector('#empty-action').classList.toggle('hidden', hasAnyReviews);
}

function renderPagination() {
  pagination.replaceChildren();
  pagination.classList.toggle('hidden', totalPages <= 1);
  for (let number = 1; number <= totalPages; number += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.page = String(number);
    button.textContent = String(number);
    button.className = number === currentPage
      ? 'h-10 w-10 rounded-xl bg-primary text-sm font-bold text-on-primary'
      : 'h-10 w-10 rounded-xl border border-surface-high bg-surface text-sm font-semibold text-on-surface';
    if (number === currentPage) button.setAttribute('aria-current', 'page');
    pagination.append(button);
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.remove('translate-y-6', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  toastTimer = window.setTimeout(() => {
    toast.classList.add('translate-y-6', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

function openModal(modal, trigger) {
  returnFocusTo = trigger;
  activeModal = modal;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
  modal.focus();
}

function closeModal(modal) {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  activeModal = null;
  document.body.classList.remove('overflow-hidden');
  returnFocusTo?.focus();
}

function setSelectedRating(value) {
  selectedRating = Number(value);
  ratingValue.textContent = `${selectedRating} / 5`;
  document.querySelectorAll('.edit-rating-star').forEach((button) => {
    const selected = Number(button.dataset.rating) <= selectedRating;
    button.classList.toggle('text-tertiary', selected);
    button.classList.toggle('text-surface-highest', !selected);
    button.setAttribute('aria-pressed', String(Number(button.dataset.rating) === selectedRating));
  });
  document.querySelector('#edit-rating-error').classList.add('hidden');
}

function openEditModal(review, trigger) {
  selectedReview = review;
  selectedRating = Number(review.rating) || 0;
  const placeName = review.restaurant?.name || review.restaurantName || 'Restaurant';
  document.querySelector('#edit-restaurant-name').textContent = placeName;
  commentInput.value = review.comment || '';
  document.querySelector('#edit-char-count').textContent = `${commentInput.value.length} / 500`;
  setSelectedRating(selectedRating);
  openModal(editModal, trigger);
  editModal.querySelector('.edit-rating-star').focus();
}

function openDeleteModal(review, trigger) {
  selectedReview = review;
  openModal(deleteModal, trigger);
  document.querySelector('#confirm-delete-review').focus();
}

function bindEvents() {
  document.querySelectorAll('.review-filter').forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderReviews();
    });
  });

  reviewsContainer.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const card = actionButton.closest('[data-review-id]');
    const review = reviews.find((item) => String(item.id) === card?.dataset.reviewId);
    if (!review) return;
    if (actionButton.dataset.action === 'edit') openEditModal(review, actionButton);
    if (actionButton.dataset.action === 'delete') openDeleteModal(review, actionButton);
  });

  document.querySelectorAll('.edit-rating-star').forEach((button) => {
    button.addEventListener('click', () => setSelectedRating(button.dataset.rating));
  });
  commentInput.addEventListener('input', () => {
    document.querySelector('#edit-char-count').textContent = `${commentInput.value.length} / 500`;
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!selectedReview) return;
    if (selectedRating < 1 || selectedRating > 5) {
      document.querySelector('#edit-rating-error').classList.remove('hidden');
      return;
    }

    const submitButton = editForm.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
    const saved = await updateReview(selectedReview.id, {
      rating: selectedRating,
      comment: commentInput.value.trim(),
    });
    if (!saved) {
      showToast('Could not save your changes. Please try again.');
      return;
    }

    closeModal(editModal);
    selectedReview = null;
    await refreshReviews();
    showToast('Your review was updated.');
    } catch (error) {
      showToast(error.message || 'Could not save your changes.');
    } finally { if (submitButton) submitButton.disabled = false; }
  });

  document.querySelector('#confirm-delete-review').addEventListener('click', async (event) => {
    if (!selectedReview) return;
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await deleteReview(selectedReview.id);
      if (reviews.length === 1 && currentPage > 1) currentPage -= 1;
      closeModal(deleteModal);
      selectedReview = null;
      await refreshReviews();
      showToast('Your review was deleted.');
    } catch (error) { showToast(error.message || 'Could not delete the review. Please try again.'); }
    finally { button.disabled = false; }
  });

  document.querySelectorAll('[data-close-edit]').forEach((button) => {
    button.addEventListener('click', () => closeModal(editModal));
  });
  document.querySelectorAll('[data-close-delete]').forEach((button) => {
    button.addEventListener('click', () => closeModal(deleteModal));
  });
  [editModal, deleteModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) closeModal(activeModal);
  });
  pagination.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-page]');
    if (!button) return;
    currentPage = Number(button.dataset.page);
    await refreshReviews();
  });
}

async function refreshReviews() {
  try {
    const result = await getMyReviews({ page: currentPage, pageSize: 6 });
    reviews = result.items || [];
    currentPage = result.page || currentPage;
    totalPages = result.totalPages || 0;
    totalReviews = result.totalItems || 0;
  } catch (error) {
    reviewsContainer.innerHTML = `<p class="rounded-xl bg-red-50 p-4 text-sm text-red-800">${error.message || 'Could not load reviews.'}</p>`;
    return;
  }
  renderReviews();
  renderPagination();
}

export async function initMyReviewsPage() {
  if (!page) return;
  bindEvents();
  await refreshReviews();
}
