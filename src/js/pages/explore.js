import { createRestaurantCard } from '../components/restaurant-card.js';
import { getFeaturedRestaurants } from '../services/restaurants.service.js';
import { toggleFavorite } from '../services/favorites.service.js';

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
let restaurants = [];
let currentPage = 1;
let appliedFilters = { query: '', type: 'all', location: 'all', rating: 0, category: '' };
let toastTimer;

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function populateLocations() {
  const locations = [...new Set(restaurants.map((place) => place.location))].sort();
  locations.forEach((location) => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationFilter.append(option);
  });
}

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const location = params.get('location') || 'all';
  const category = params.get('category') || '';

  searchInput.value = query;
  if ([...locationFilter.options].some((option) => option.value === location)) {
    locationFilter.value = location;
  }

  appliedFilters = {
    query,
    type: category === 'restaurant' || category === 'cafe' ? category : 'all',
    location,
    rating: 0,
    category: category && category !== 'restaurant' && category !== 'cafe' ? category : '',
  };
  typeFilter.value = appliedFilters.type;
}

function matchesCategory(place, category) {
  if (!category) return true;
  const searchable = normalize([place.name, place.type, place.cuisine, place.price, ...(place.tags || [])].join(' '));
  if (category === 'fine-dining') return place.price === '$$$$' || searchable.includes('fine dining');
  if (category === 'casual-dining') return place.type.toLowerCase() === 'restaurant' && place.price.length <= 3;
  return searchable.includes(category.replaceAll('-', ' '));
}

function getFilteredPlaces() {
  const searchText = normalize(appliedFilters.query);
  const matchingPlaces = restaurants.filter((place) => {
    const searchable = normalize([place.name, place.type, place.cuisine, place.location, ...(place.tags || [])].join(' '));
    return (!searchText || searchable.includes(searchText))
      && (appliedFilters.type === 'all' || place.type.toLowerCase() === appliedFilters.type)
      && (appliedFilters.location === 'all' || place.location === appliedFilters.location)
      && place.rating >= appliedFilters.rating
      && matchesCategory(place, appliedFilters.category);
  });

  if (sortSelect.value === 'lowest') matchingPlaces.sort((a, b) => a.rating - b.rating);
  else if (sortSelect.value === 'reviews') matchingPlaces.sort((a, b) => b.reviewCount - a.reviewCount);
  else matchingPlaces.sort((a, b) => b.rating - a.rating);

  return matchingPlaces;
}

function renderPagination(totalPages) {
  pagination.innerHTML = '';
  pagination.classList.toggle('hidden', totalPages <= 1);
  if (totalPages <= 1) return;

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.dataset.page = String(currentPage - 1);
  previous.disabled = currentPage === 1;
  previous.className = 'inline-flex min-h-10 items-center gap-1 rounded-xl border border-surface-high bg-surface px-3.5 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40';
  previous.innerHTML = '<span class="material-symbols-outlined text-lg" aria-hidden="true">chevron_left</span><span>Previous</span>';
  pagination.append(previous);

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.page = String(pageNumber);
    button.textContent = String(pageNumber);
    button.setAttribute('aria-label', `Page ${pageNumber}`);
    button.setAttribute('aria-current', pageNumber === currentPage ? 'page' : 'false');
    button.className = pageNumber === currentPage
      ? 'h-10 w-10 rounded-xl bg-primary text-sm font-bold text-on-primary shadow-sm'
      : 'h-10 w-10 rounded-xl border border-surface-high bg-surface text-sm font-semibold text-on-surface transition hover:border-primary hover:text-primary';
    pagination.append(button);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.dataset.page = String(currentPage + 1);
  next.disabled = currentPage === totalPages;
  next.className = 'inline-flex min-h-10 items-center gap-1 rounded-xl border border-surface-high bg-surface px-3.5 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40';
  next.innerHTML = '<span>Next</span><span class="material-symbols-outlined text-lg" aria-hidden="true">chevron_right</span>';
  pagination.append(next);
}

function renderPlaces() {
  const places = getFilteredPlaces();
  const totalPages = Math.ceil(places.length / pageSize);
  currentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const start = (currentPage - 1) * pageSize;
  const currentPlaces = places.slice(start, start + pageSize);

  resultsCount.textContent = `${places.length} ${places.length === 1 ? 'place' : 'places'} found`;
  grid.innerHTML = currentPlaces.map(createRestaurantCard).join('');
  grid.classList.toggle('hidden', places.length === 0);
  emptyState.classList.toggle('hidden', places.length > 0);
  renderPagination(totalPages);
}

function applyFilters() {
  const params = new URLSearchParams();
  const query = searchInput.value.trim();
  if (query) params.set('q', query);
  if (typeFilter.value !== 'all') params.set('category', typeFilter.value);
  else if (appliedFilters.category) params.set('category', appliedFilters.category);
  if (locationFilter.value !== 'all') params.set('location', locationFilter.value);

  appliedFilters = {
    query,
    type: typeFilter.value,
    location: locationFilter.value,
    rating: Number(ratingFilter.value),
    category: typeFilter.value === 'all' ? appliedFilters.category : '',
  };
  currentPage = 1;
  const queryString = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}`);
  renderPlaces();
}

function clearFilters() {
  searchInput.value = '';
  typeFilter.value = 'all';
  locationFilter.value = 'all';
  ratingFilter.value = '0';
  appliedFilters = { query: '', type: 'all', location: 'all', rating: 0, category: '' };
  currentPage = 1;
  window.history.replaceState(null, '', window.location.pathname);
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
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
  document.querySelector('#apply-filters-btn').addEventListener('click', applyFilters);
  document.querySelector('#clear-filters-btn').addEventListener('click', clearFilters);
  document.querySelector('#empty-clear-btn').addEventListener('click', clearFilters);
  sortSelect.addEventListener('change', () => {
    currentPage = 1;
    renderPlaces();
  });

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-favorite-id]');
    if (!button) return;
    const isSaved = toggleFavorite(button.dataset.favoriteId);
    button.setAttribute('aria-pressed', String(isSaved));
    button.setAttribute('aria-label', `${isSaved ? 'Remove from' : 'Add to'} favorites`);
    showToast(isSaved ? 'Place added to your favorites.' : 'Place removed from your favorites.');
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
  restaurants = await getFeaturedRestaurants();
  populateLocations();
  readUrlFilters();
  bindEvents();
  renderPlaces();
}
