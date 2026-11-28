import { createReviewCard } from '../components/review-card.js';
import { getRestaurantById } from '../services/restaurants.service.js';
import { hasBookingForRestaurant, createBooking } from '../services/bookings.service.js';
import { addReview, getReviewsByRestaurant } from '../services/reviews.service.js';
import { isFavorite, loadFavorites, toggleFavorite } from '../services/favorites.service.js';
import { getCurrentUser } from '../services/auth.service.js';
import { escapeHTML } from '../utils/helpers.js';
import { requireVerifiedUser } from '../utils/favorite-access.js';

const page = document.querySelector('[data-restaurant-details-page]');
const menuFilters = document.querySelector('#menu-filters');
const menuItems = document.querySelector('#menu-items');
const reviewsList = document.querySelector('#reviews-list');
const reviewsPagination = document.querySelector('#reviews-pagination');
const toast = document.querySelector('#page-toast');

const defaultMenu = [
  { category: 'starters', name: 'Seasonal Garden Salad', description: 'Fresh greens, local vegetables, and house dressing.', price: 'Ask for price', image: '/images/restaurants/category-casual-dining.jpg' },
  { category: 'mains', name: 'Chef’s Signature Plate', description: 'A seasonal dish prepared with the chef’s favorite ingredients.', price: 'Ask for price', image: '/images/restaurants/aura-bistro.jpg' },
  { category: 'desserts', name: 'House Dessert', description: 'A sweet finish made fresh in the kitchen.', price: 'Ask for price', image: '/images/cafes/atelier-morning-roast.jpg' },
  { category: 'drinks', name: 'Fresh Citrus Cooler', description: 'Fresh citrus, herbs, and sparkling water.', price: 'Ask for price', image: '/images/cafes/botanica-roastery.jpg' },
];

const menuCategoryLabels = {
  all: 'All items',
  starters: 'Starters',
  mains: 'Main courses',
  desserts: 'Desserts',
  drinks: 'Drinks',
};

let restaurant = null;
let activeMenuFilter = 'all';
let selectedRating = 0;
let selectedGuests = 2;
let selectedTime = '6:00 PM';
let toastTimer;
let activeModal = null;
let reviewPage = 1;
let reviewTotalPages = 0;

function toBackendTime(value) {
  const match = String(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return value;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('translate-y-6', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  toastTimer = window.setTimeout(() => {
    toast.classList.add('translate-y-6', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

function setModalVisibility(modal, isOpen) {
  modal.classList.toggle('hidden', !isOpen);
  modal.classList.toggle('flex', isOpen);
  document.body.classList.toggle('overflow-hidden', isOpen);
  activeModal = isOpen ? modal : null;
}

function updateFavoriteButton() {
  const button = document.querySelector('#favorite-button');
  const icon = document.querySelector('#favorite-icon');
  const saved = isFavorite(restaurant.id);
  button.setAttribute('aria-pressed', String(saved));
  button.setAttribute('aria-label', saved ? 'Remove from favorites' : 'Add to favorites');
  icon.style.fontVariationSettings = saved ? "'FILL' 1" : "'FILL' 0";
}

function renderRestaurantInfo() {
  const subtitle = [restaurant.type, restaurant.cuisine].filter(Boolean).join(' · ');
  document.title = `${restaurant.name} | Tablely`;
  document.querySelector('#breadcrumb-restaurant').textContent = restaurant.name;
  document.querySelector('#restaurant-name').textContent = restaurant.name;
  document.querySelector('#restaurant-location').innerHTML = `<span class="material-symbols-outlined text-lg" aria-hidden="true">location_on</span>${escapeHTML(restaurant.location)}`;
  document.querySelector('#restaurant-subtitle').textContent = subtitle;
  document.querySelector('#reservation-place-name').textContent = `Choose a time at ${restaurant.name}`;
  document.querySelector('#restaurant-type').textContent = restaurant.type;
  document.querySelector('#restaurant-price').textContent = restaurant.price;
  document.querySelector('#restaurant-description').textContent = restaurant.description
    || `Discover ${restaurant.name}, a local favorite for ${restaurant.cuisine} in ${restaurant.location}.`;
  document.querySelector('#restaurant-address').innerHTML = `<span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">pin_drop</span>${escapeHTML(restaurant.address || restaurant.location)}`;
  const hours = document.querySelector('#restaurant-hours');
  hours.innerHTML = `<span class="material-symbols-outlined text-lg text-primary" aria-hidden="true">schedule</span>${escapeHTML(restaurant.hours || restaurant.availability)}`;

  const gallery = restaurant.gallery?.length ? restaurant.gallery : [
    restaurant.image,
    '/images/restaurants/aura-bistro.jpg',
    '/images/cafes/botanica-roastery.jpg',
    '/images/restaurants/category-fine-dining.jpg',
    '/images/restaurants/trattoria-della-nonna.jpg',
  ];
  const [mainImage, ...smallImages] = gallery.slice(0, 5);
  document.querySelector('#restaurant-gallery').innerHTML = `
    <div class="relative min-h-0 overflow-hidden bg-surface-high lg:col-span-2 lg:row-span-2">
      <img class="h-full w-full object-cover transition duration-700 hover:scale-105" src="${escapeHTML(mainImage)}" alt="${escapeHTML(restaurant.imageAlt || `${restaurant.name} dining room`)}" fetchpriority="high" />
    </div>
    <div class="grid min-h-0 grid-cols-4 gap-2 lg:contents">
      ${smallImages.map((image, index) => `
        <div class="relative min-h-0 overflow-hidden bg-surface-high">
          <img class="h-full w-full object-cover transition duration-700 hover:scale-105" src="${escapeHTML(image)}" alt="${escapeHTML(`${restaurant.name} dining photo ${index + 1}`)}" loading="lazy" />
        </div>
      `).join('')}
    </div>
  `;

  updateFavoriteButton();
  renderRatingSummary();
}

function renderRatingSummary() {
  const average = Number(restaurant.rating || 0) ? Number(restaurant.rating).toFixed(1) : 'New';
  const count = Number(restaurant.reviewCount || 0);
  document.querySelector('#restaurant-rating').textContent = average;
  document.querySelector('#restaurant-review-count').textContent = `${count} ${count === 1 ? 'review' : 'reviews'}`;
  document.querySelector('#reviews-summary-rating').textContent = average;
  document.querySelector('#reviews-summary-count').textContent = count;
}

async function loadRestaurantReviews() {
  reviewsList.innerHTML = '<p class="text-sm text-on-surface-variant">Loading reviews...</p>';
  try {
    const result = await getReviewsByRestaurant(restaurant.id, { page: reviewPage, pageSize: 5 });
    reviewPage = result.page || reviewPage;
    reviewTotalPages = result.totalPages || 0;
    const reviews = result.items || [];
    reviewsList.innerHTML = reviews.length
      ? reviews.map(createReviewCard).join('')
      : '<p class="rounded-2xl bg-surface-low p-5 text-sm text-on-surface-variant">No written reviews yet. Be the first guest to share your experience.</p>';
    reviewsPagination.replaceChildren();
    reviewsPagination.classList.toggle('hidden', reviewTotalPages <= 1);
    for (let number = 1; number <= reviewTotalPages; number += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.reviewPage = String(number);
      button.textContent = String(number);
      button.className = number === reviewPage
        ? 'h-9 w-9 rounded-lg bg-primary text-sm font-bold text-on-primary'
        : 'h-9 w-9 rounded-lg border border-surface-high text-sm font-semibold text-on-surface';
      if (number === reviewPage) button.setAttribute('aria-current', 'page');
      reviewsPagination.append(button);
    }
  } catch (error) {
    reviewsList.innerHTML = `<p class="rounded-xl bg-red-50 p-4 text-sm text-red-800">${escapeHTML(error.message || 'Could not load reviews.')}</p>`;
  }
}

function renderMenuFilters(menu) {
  const categories = ['all', ...new Set(menu.map((item) => item.category))];
  menuFilters.innerHTML = categories.map((category, index) => `
    <button class="menu-filter rounded-full px-4 py-2 text-sm font-semibold transition ${index === 0 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-low text-on-surface-variant hover:bg-surface-high'}" type="button" role="tab" aria-selected="${index === 0}" data-category="${escapeHTML(category)}">
      ${escapeHTML(menuCategoryLabels[category] || category)}
    </button>
  `).join('');

  menuFilters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    activeMenuFilter = button.dataset.category;
    menuFilters.querySelectorAll('[data-category]').forEach((filter) => {
      const isActive = filter === button;
      filter.setAttribute('aria-selected', String(isActive));
      filter.classList.toggle('bg-primary', isActive);
      filter.classList.toggle('text-on-primary', isActive);
      filter.classList.toggle('shadow-sm', isActive);
      filter.classList.toggle('bg-surface-low', !isActive);
      filter.classList.toggle('text-on-surface-variant', !isActive);
    });
    renderMenuItems(menu);
  });
}

function renderMenuItems(menu) {
  const visibleItems = activeMenuFilter === 'all'
    ? menu
    : menu.filter((item) => item.category === activeMenuFilter);

  menuItems.innerHTML = visibleItems.map((item) => `
    <article class="flex gap-4 overflow-hidden rounded-2xl border border-surface-high bg-surface p-3 transition hover:shadow-md">
      <div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-high sm:h-28 sm:w-28">
        <img class="h-full w-full object-cover" src="${escapeHTML(item.image || restaurant.image)}" alt="${escapeHTML(item.name)}" loading="lazy" />
      </div>
      <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <h3 class="font-display font-bold text-on-surface">${escapeHTML(item.name)}</h3>
          <p class="mt-1 line-clamp-2 text-xs leading-5 text-on-surface-variant">${escapeHTML(item.description)}</p>
        </div>
        <p class="mt-2 text-sm font-bold text-primary">${escapeHTML(item.price)}</p>
      </div>
    </article>
  `).join('');
}

function updateChoiceButtons(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    const isActive = button === activeButton;
    button.setAttribute('aria-pressed', String(isActive));
    button.classList.toggle('bg-primary', isActive);
    button.classList.toggle('text-on-primary', isActive);
    button.classList.toggle('font-bold', isActive);
    button.classList.toggle('bg-surface-low', !isActive);
    button.classList.toggle('text-on-surface-variant', !isActive);
    button.classList.toggle('font-semibold', !isActive);
  });
}

function bindReservationForm() {
  const dateInput = document.querySelector('#reservation-date');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;
  dateInput.value = localToday;

  document.querySelector('#guest-options').addEventListener('click', (event) => {
    const button = event.target.closest('[data-guests]');
    if (!button) return;
    selectedGuests = Number(button.dataset.guests);
    updateChoiceButtons('.guest-option', button);
  });

  document.querySelector('#time-options').addEventListener('click', (event) => {
    const button = event.target.closest('[data-time]');
    if (!button) return;
    selectedTime = button.dataset.time;
    updateChoiceButtons('.time-option', button);
  });

  document.querySelector('#reservation-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!getCurrentUser()) {
      window.location.href = 'login.html';
      return;
    }
    if (getCurrentUser()?.emailVerified !== true) {
      const email = encodeURIComponent(getCurrentUser()?.email || '');
      window.location.href = `verify-email.html${email ? `?email=${email}` : ''}`;
      return;
    }

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
    const booking = await createBooking({
      restaurantId: restaurant.id,
      date: String(formData.get('date')),
      time: toBackendTime(selectedTime),
      guests: selectedGuests,
      specialRequests: String(formData.get('requests') || '').trim(),
    });

    if (!booking) {
      showToast('Could not save your reservation. Please try again.');
      return;
    }

    const dateLabel = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
      .format(new Date(`${booking.date}T00:00:00`));
    document.querySelector('#booking-success-summary').textContent = `${restaurant.name} · ${dateLabel} at ${booking.time} · ${booking.guests} guests`;
    setModalVisibility(document.querySelector('#booking-success-modal'), true);
    } catch (error) {
      showToast(error.message || 'Could not save your reservation. Please try again.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function updateReviewStars() {
  document.querySelectorAll('.review-star').forEach((button) => {
    const isSelected = Number(button.dataset.rating) <= selectedRating;
    button.classList.toggle('text-primary', isSelected);
    button.classList.toggle('text-surface-highest', !isSelected);
    button.setAttribute('aria-checked', String(Number(button.dataset.rating) === selectedRating));
  });
  document.querySelector('#review-rating-error').classList.add('hidden');
}

function bindReviewForm() {
  const modal = document.querySelector('#review-modal');
  const reviewForm = document.querySelector('#review-form');

  document.querySelector('#write-review-button').addEventListener('click', async () => {
    if (!getCurrentUser()) { window.location.href = 'login.html'; return; }
    if (!requireVerifiedUser()) return;
    const eligibilityMessage = document.querySelector('#review-eligibility-message');
    try {
    if (!await hasBookingForRestaurant(restaurant.id)) {
      eligibilityMessage.textContent = 'You need to book this restaurant before you can write a review.';
      eligibilityMessage.classList.remove('hidden');
      return;
    }

    eligibilityMessage.classList.add('hidden');
    selectedRating = 0;
    updateReviewStars();
    document.querySelector('#review-modal-restaurant').textContent = restaurant.name;
    reviewForm.reset();
    setModalVisibility(modal, true);
    modal.querySelector('[data-rating="1"]').focus();
    } catch (error) {
      eligibilityMessage.textContent = error.message || 'Could not check your booking.';
      eligibilityMessage.classList.remove('hidden');
    }
  });

  document.querySelector('#review-stars').addEventListener('click', (event) => {
    const button = event.target.closest('[data-rating]');
    if (!button) return;
    selectedRating = Number(button.dataset.rating);
    updateReviewStars();
  });

  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (selectedRating < 1 || selectedRating > 5) {
      document.querySelector('#review-rating-error').classList.remove('hidden');
      return;
    }

    const submitButton = reviewForm.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
    const review = await addReview(restaurant.id, {
      rating: selectedRating,
      comment: document.querySelector('#review-comment').value.trim(),
    });
    if (!review) {
      showToast('Could not save your review. Please try again.');
      return;
    }

    restaurant = await getRestaurantById(restaurant.id);
    renderRatingSummary();
    reviewPage = 1;
    await loadRestaurantReviews();
    setModalVisibility(modal, false);
    showToast('Your review has been submitted successfully.');
    } catch (error) {
      showToast(error.message || 'Could not save your review. Please try again.');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  modal.querySelectorAll('[data-close-review-modal]').forEach((button) => {
    button.addEventListener('click', () => setModalVisibility(modal, false));
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) setModalVisibility(modal, false);
  });
}

function bindModals() {
  document.querySelectorAll('[data-close-booking-modal]').forEach((button) => {
    button.addEventListener('click', () => setModalVisibility(document.querySelector('#booking-success-modal'), false));
  });

  document.querySelector('#booking-success-modal').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) setModalVisibility(event.currentTarget, false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) setModalVisibility(activeModal, false);
  });
}

export async function initRestaurantDetailsPage() {
  if (!page) return;
  const restaurantId = new URLSearchParams(window.location.search).get('id');
  try {
    restaurant = await getRestaurantById(restaurantId);
  } catch (error) {
    document.querySelector('#restaurant-name').textContent = 'Could not load restaurant';
    document.querySelector('#restaurant-subtitle').textContent = error.message || 'Check your connection and try again.';
    return;
  }

  if (!restaurant) {
    document.querySelector('#restaurant-name').textContent = 'Restaurant not found';
    document.querySelector('#restaurant-subtitle').textContent = 'This place could not be found. Explore our restaurants and cafes to choose another one.';
    document.querySelector('#restaurant-gallery').classList.add('hidden');
    document.querySelector('#restaurant-description').innerHTML = '<a class="font-bold text-primary underline" href="explore.html">Explore places</a>';
    document.querySelector('#reservation-section').classList.add('hidden');
    document.querySelector('#menu-title').closest('section').classList.add('hidden');
    document.querySelector('#reviews-section').classList.add('hidden');
    return;
  }

  if (getCurrentUser()?.emailVerified === true) {
    try { await loadFavorites(); } catch { /* Favorite state can be refreshed from the button. */ }
  }
  renderRestaurantInfo();
  await loadRestaurantReviews();
  const menu = restaurant.menu?.length ? restaurant.menu : defaultMenu;
  renderMenuFilters(menu);
  renderMenuItems(menu);
  bindReservationForm();
  bindReviewForm();
  bindModals();

  document.querySelector('#favorite-button').addEventListener('click', async () => {
    if (!requireVerifiedUser()) return;
    const button = document.querySelector('#favorite-button');
    button.disabled = true;
    try {
      const saved = await toggleFavorite(restaurant.id);
      updateFavoriteButton();
      showToast(saved ? 'Added to your favorites.' : 'Removed from your favorites.');
    } catch (error) { showToast(error.message || 'Could not update favorites.'); }
    finally { button.disabled = false; }
  });

  reviewsPagination.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-review-page]');
    if (!button) return;
    reviewPage = Number(button.dataset.reviewPage);
    await loadRestaurantReviews();
  });
}
