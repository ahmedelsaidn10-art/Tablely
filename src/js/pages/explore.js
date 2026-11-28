import { createRestaurantCard } from '../components/restaurant-card.js';
import { getRestaurants } from '../services/restaurants.service.js';
import { loadFavorites, toggleFavorite } from '../services/favorites.service.js';
import { getCurrentUser } from '../services/auth.service.js';
import { requireVerifiedUser } from '../utils/favorite-access.js';

const page = document.querySelector('[data-explore-page]');
const searchForm = document.querySelector('#explore-search-form');
const searchInput = document.querySelector('#explore-search');
const typeFilter = document.querySelector('#filter-type');
const locationFilter = document.querySelector('#filter-location');
const ratingFilter = document.querySelector('#filter-rating');
const sortSelect = document.querySelector('#sort-select');
const grid = document.querySelector('#places-grid');
const emptyState = document.querySelector('#explore-empty');
const resultsCount = document.querySelector('#results-count');
const pagination = document.querySelector('#explore-pagination');
const toast = document.querySelector('#explore-toast');
const toastMessage = document.querySelector('#explore-toast-message');

const pageSize = 6;
let currentPage = 1;
let totalPages = 0;
let activeCategory = '';
let toastTimer;

function filtersFromControls() {
  return {
    q: searchInput.value.trim(),
    type: typeFilter.value === 'all' ? '' : typeFilter.value,
    location: locationFilter.value.trim() === 'all' ? '' : locationFilter.value.trim(),
    minRating: Number(ratingFilter.value) || '',
    sort: sortSelect.value,
    category: activeCategory,
  };
}

function setLoading(isLoading) {
  grid.setAttribute('aria-busy', String(isLoading));
  if (isLoading) grid.innerHTML = '<p class="col-span-full py-10 text-center text-sm text-on-surface-variant">Loading places...</p>';
}

function renderPagination() {
  pagination.replaceChildren();
  pagination.classList.toggle('hidden', totalPages <= 1);
  if (totalPages <= 1) return;
  const addButton = (label, target, disabled, current = false) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.page = String(target);
    button.textContent = label;
    button.disabled = disabled;
    button.setAttribute('aria-label', current ? `Page ${target}` : label);
    if (current) button.setAttribute('aria-current', 'page');
    button.className = current
      ? 'h-10 min-w-10 rounded-xl bg-primary px-3 text-sm font-bold text-on-primary'
      : 'h-10 min-w-10 rounded-xl border border-surface-high bg-surface px-3 text-sm font-semibold text-on-surface disabled:opacity-40';
    pagination.append(button);
  };
  addButton('Previous', currentPage - 1, currentPage === 1);
  for (let number = 1; number <= totalPages; number += 1) addButton(String(number), number, false, number === currentPage);
  addButton('Next', currentPage + 1, currentPage === totalPages);
}

async function renderPlaces() {
  setLoading(true);
  try {
    const result = await getRestaurants({ ...filtersFromControls(), page: currentPage, pageSize });
    const places = result.items || [];
    currentPage = result.page || currentPage;
    totalPages = result.totalPages || 0;
    resultsCount.textContent = `${result.totalItems || 0} ${(result.totalItems || 0) === 1 ? 'place' : 'places'} found`;
    grid.innerHTML = places.map(createRestaurantCard).join('');
    grid.classList.toggle('hidden', places.length === 0);
    emptyState.classList.toggle('hidden', places.length > 0);
    renderPagination();
  } catch (error) {
    grid.innerHTML = '';
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyState.querySelector('h2').textContent = 'Could not load places';
    emptyState.querySelector('p').textContent = error.message || 'Check your connection and try again.';
    resultsCount.textContent = 'Places unavailable';
    pagination.classList.add('hidden');
  } finally {
    grid.setAttribute('aria-busy', 'false');
  }
}

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  searchInput.value = params.get('q') || '';
  const type = params.get('type') || (['restaurant', 'cafe'].includes(params.get('category')) ? params.get('category') : 'all');
  typeFilter.value = type;
  activeCategory = ['fine-dining', 'casual-dining', 'cafes', 'coffee', 'brunch'].includes(params.get('category'))
    ? params.get('category')
    : '';
  if (params.get('category') === 'fast-food') searchInput.value = 'fast food';
  const location = params.get('location');
  if (location) {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationFilter.append(option);
    locationFilter.value = location;
  }
}

function updateUrl() {
  const params = new URLSearchParams();
  const filters = filtersFromControls();
  if (filters.q) params.set('q', filters.q);
  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.location) params.set('location', filters.location);
  if (filters.minRating) params.set('minRating', String(filters.minRating));
  if (filters.sort !== 'highest') params.set('sort', filters.sort);
  window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`);
}

function applyFilters() {
  currentPage = 1;
  updateUrl();
  renderPlaces();
}

function clearFilters() {
  searchInput.value = '';
  typeFilter.value = 'all';
  locationFilter.value = 'all';
  ratingFilter.value = '0';
  activeCategory = '';
  sortSelect.value = 'highest';
  currentPage = 1;
  updateUrl();
  renderPlaces();
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

function bindEvents() {
  searchForm.addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
  document.querySelector('#apply-filters-btn').addEventListener('click', applyFilters);
  document.querySelector('#clear-filters-btn').addEventListener('click', clearFilters);
  document.querySelector('#empty-clear-btn').addEventListener('click', clearFilters);
  typeFilter.addEventListener('change', () => { activeCategory = ''; applyFilters(); });
  sortSelect.addEventListener('change', applyFilters);
  grid.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-favorite-id]');
    if (!button) return;
    if (!requireVerifiedUser()) return;
    button.disabled = true;
    try {
      const saved = await toggleFavorite(button.dataset.favoriteId);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Remove from' : 'Add to'} favorites`);
      showToast(saved ? 'Place added to your favorites.' : 'Place removed from your favorites.');
    } catch (error) { showToast(error.message || 'Could not update favorites.'); }
    finally { button.disabled = false; }
  });
  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    renderPlaces();
    page.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

export async function initExplorePage() {
  if (!page || !grid) return;
  readUrlFilters();
  bindEvents();
  if (getCurrentUser()?.emailVerified === true) {
    try { await loadFavorites(); } catch { /* Favorite state can be refreshed when the user clicks a heart. */ }
  }
  await renderPlaces();
}
