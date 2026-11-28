import { createRestaurantCard } from '../components/restaurant-card.js';
import { loadFavorites, toggleFavorite } from '../services/favorites.service.js';

const filterButtons = [...document.querySelectorAll('.favorite-filter')];
const grid = document.querySelector('#favorites-grid');
const emptyState = document.querySelector('#favorites-empty');
const emptyTitle = document.querySelector('#empty-title');
const emptyDescription = document.querySelector('#empty-description');
const counter = document.querySelector('#saved-counter');
const pagination = document.querySelector('#favorites-pagination');
const toast = document.querySelector('#favorites-toast');
const toastMessage = document.querySelector('#toast-message');

let restaurants = [];
let totalItems = 0;
let currentPage = 1;
let totalPages = 0;
let activeFilter = 'all';
let toastTimer;

function updateFilterButtons(counts) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.setAttribute('aria-selected', String(isActive));
    button.classList.toggle('bg-primary', isActive);
    button.classList.toggle('text-on-primary', isActive);
    button.classList.toggle('shadow-sm', isActive);
    button.classList.toggle('bg-surface-low', !isActive);
    button.classList.toggle('text-on-surface-variant', !isActive);
    button.classList.toggle('font-bold', isActive);
    button.classList.toggle('font-semibold', !isActive);
    const badge = button.querySelector('[data-count]');
    if (badge) badge.textContent = String(counts[button.dataset.filter] || 0);
  });
}

function renderPagination() {
  pagination.replaceChildren();
  pagination.classList.toggle('hidden', totalPages <= 1);
  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.page = String(page);
    button.textContent = String(page);
    button.className = page === currentPage
      ? 'h-10 w-10 rounded-xl bg-primary text-sm font-bold text-on-primary'
      : 'h-10 w-10 rounded-xl border border-surface-high bg-surface text-sm font-semibold text-on-surface';
    if (page === currentPage) button.setAttribute('aria-current', 'page');
    pagination.append(button);
  }
}

function renderFavorites() {
  const counts = {
    all: totalItems,
    restaurant: restaurants.filter((place) => place.type.toLowerCase() === 'restaurant').length,
    cafe: restaurants.filter((place) => place.type.toLowerCase() === 'cafe').length,
  };
  const visible = activeFilter === 'all'
    ? restaurants
    : restaurants.filter((place) => place.type.toLowerCase() === activeFilter);

  counter.textContent = `${totalItems} saved ${totalItems === 1 ? 'place' : 'places'}`;
  updateFilterButtons(counts);
  grid.innerHTML = visible.map(createRestaurantCard).join('');
  grid.classList.toggle('hidden', visible.length === 0);
  emptyState.classList.toggle('hidden', visible.length > 0);
  if (totalItems === 0) {
    emptyTitle.textContent = 'Your favorites list is empty';
    emptyDescription.textContent = 'Save places you love and they will show up here for later.';
  } else if (visible.length === 0) {
    emptyTitle.textContent = `No ${activeFilter === 'cafe' ? 'cafes' : 'restaurants'} on this page`;
    emptyDescription.textContent = 'Try the other favorite pages or change the filter.';
  }
  renderPagination();
}

async function refreshFavorites() {
  grid.setAttribute('aria-busy', 'true');
  try {
    const result = await loadFavorites({ page: currentPage, pageSize: 6 });
    restaurants = result.items || [];
    totalItems = result.totalItems || 0;
    currentPage = result.page || currentPage;
    totalPages = result.totalPages || 0;
    renderFavorites();
  } catch (error) {
    grid.innerHTML = `<p class="col-span-full rounded-xl bg-red-50 p-4 text-sm text-red-800">${error.message || 'Could not load favorites.'}</p>`;
  } finally {
    grid.setAttribute('aria-busy', 'false');
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
  }, 3500);
}

function bindInteractions() {
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    renderFavorites();
  }));

  grid.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-favorite-id]');
    if (!button) return;
    button.disabled = true;
    const name = restaurants.find((place) => String(place.id) === button.dataset.favoriteId)?.name || 'Place';
    try {
      await toggleFavorite(button.dataset.favoriteId);
      if (restaurants.length === 1 && currentPage > 1) currentPage -= 1;
      await refreshFavorites();
      showToast(`${name} removed from favorites.`);
    } catch (error) { showToast(error.message || 'Could not update favorites.'); }
    finally { button.disabled = false; }
  });

  pagination.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-page]');
    if (!button) return;
    currentPage = Number(button.dataset.page);
    await refreshFavorites();
  });

  document.querySelector('#share-favorites').addEventListener('click', async () => {
    if (totalItems === 0) { showToast('Save a place first to share your list.'); return; }
    const shareText = `My Tablely favorites: ${restaurants.map((place) => place.name).join(', ')}`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Tablely Favorites', text: shareText });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(shareText); showToast('This page of favorites was copied.'); }
      else showToast('Sharing is not available in this browser.');
    } catch (error) { if (error.name !== 'AbortError') showToast('Could not share your favorites list.'); }
  });
}

export async function initMyFavoritesPage() {
  if (!grid || !emptyState) return;
  bindInteractions();
  await refreshFavorites();
}
