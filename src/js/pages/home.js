import { createRestaurantCard } from '../components/restaurant-card.js';
import { getFeaturedRestaurants } from '../services/restaurants.service.js';
import { toggleFavorite } from '../services/favorites.service.js';
import { escapeHTML } from '../utils/helpers.js';

const categories = [
  { name: 'Restaurants', note: 'Find open tables', image: '/images/restaurants/category-restaurants.jpg', key: 'restaurant' },
  { name: 'Cafes', note: 'Find your new favorite', image: '/images/cafes/category-cafes.jpg', key: 'cafe' },
  { name: 'Fine dining', note: 'Make it a special night', image: '/images/restaurants/category-fine-dining.jpg', key: 'fine-dining' },
  { name: 'Fast food', note: 'Quick and delicious', image: '/images/food/category-fast-food.jpg', key: 'fast-food' },
  { name: 'Casual dining', note: 'Good food, easy plans', image: '/images/restaurants/category-casual-dining.jpg', key: 'casual-dining' },
];

const popularTags = ['Rooftops', 'Specialty espresso', 'Michelin Guide', 'Date night', 'Brunch'];

function renderCategories() {
  const container = document.querySelector('#category-list');
  if (!container) return;

  container.innerHTML = categories.map((category) => `
    <a class="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-high shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" href="explore.html?category=${encodeURIComponent(category.key)}">
      <img class="h-full w-full object-cover transition duration-700 group-hover:scale-110" src="${category.image}" alt="${escapeHTML(category.name)}" loading="lazy" />
      <span class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></span>
      <span class="absolute inset-x-4 bottom-4 text-white">
        <span class="block font-display text-base font-bold sm:text-lg">${escapeHTML(category.name)}</span>
        <span class="mt-1 block text-xs text-white/80">${escapeHTML(category.note)}</span>
      </span>
    </a>
  `).join('');
}

function renderPopularTags() {
  const container = document.querySelector('#popular-tags');
  if (!container) return;

  container.innerHTML = popularTags.map((tag) => `
    <a class="rounded-full bg-surface-high px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-primary hover:text-on-primary" href="explore.html?q=${encodeURIComponent(tag)}">${escapeHTML(tag)}</a>
  `).join('');
}

function connectHomeSearch() {
  const form = document.querySelector('#home-search');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const query = String(formData.get('query') || '').trim();
    const location = String(formData.get('location') || '').trim();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    window.location.href = `explore.html${params.size ? `?${params}` : ''}`;
  });
}

async function renderFeaturedRestaurants() {
  const container = document.querySelector('#featured-restaurants');
  if (!container) return;

  const places = await getFeaturedRestaurants();
  // Keep the home page focused on a small selection; Explore shows the full list.
  container.innerHTML = places.slice(0, 3).map(createRestaurantCard).join('');

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-favorite-id]');
    if (!button) return;

    const isSaved = toggleFavorite(button.dataset.favoriteId);
    button.setAttribute('aria-pressed', String(isSaved));
    button.setAttribute('aria-label', `${isSaved ? 'Remove from' : 'Add to'} favorites`);
  });
}

export function initHomePage() {
  renderCategories();
  renderPopularTags();
  connectHomeSearch();
  renderFeaturedRestaurants();
}
