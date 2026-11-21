import { createRestaurantCard } from '../components/restaurant-card.js';
import { getFeaturedRestaurants } from '../services/restaurants.service.js';
import { getFavoriteIds, toggleFavorite } from '../services/favorites.service.js';

const filterButtons = [...document.querySelectorAll('.favorite-filter')];
const grid = document.querySelector('#favorites-grid');
const emptyState = document.querySelector('#favorites-empty');
const emptyTitle = document.querySelector('#empty-title');
const emptyDescription = document.querySelector('#empty-description');
const counter = document.querySelector('#saved-counter');
const toast = document.querySelector('#favorites-toast');
const toastMessage = document.querySelector('#toast-message');

let restaurants = [];
let activeFilter = 'all';
let toastTimer;

function getSavedRestaurants() {
  const savedIds = new Set(getFavoriteIds());
  return restaurants.filter((restaurant) => savedIds.has(restaurant.id));
}

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
    if (badge) {
      badge.textContent = counts[button.dataset.filter];
      badge.classList.toggle('bg-on-primary/20', isActive);
      badge.classList.toggle('bg-surface-high', !isActive);
    }
  });
}

function renderFavorites() {
  const saved = getSavedRestaurants();
  const counts = {
    all: saved.length,
    restaurant: saved.filter((place) => place.type.toLowerCase() === 'restaurant').length,
    cafe: saved.filter((place) => place.type.toLowerCase() === 'cafe').length,
  };
  const visible = activeFilter === 'all'
    ? saved
    : saved.filter((place) => place.type.toLowerCase() === activeFilter);

  counter.textContent = `${saved.length} saved ${saved.length === 1 ? 'place' : 'places'}`;
  updateFilterButtons(counts);
  grid.innerHTML = visible.map(createRestaurantCard).join('');
  grid.classList.toggle('hidden', visible.length === 0);
  emptyState.classList.toggle('hidden', visible.length > 0);

  // Distinguish an empty collection from a filter with no matching places.
  if (saved.length === 0) {
    emptyTitle.textContent = 'Your favorites list is empty';
    emptyDescription.textContent = 'Save places you love and they will show up here for later.';
  } else if (visible.length === 0) {
    emptyTitle.textContent = `No ${activeFilter === 'cafe' ? 'cafes' : 'restaurants'} saved yet`;
    emptyDescription.textContent = 'Try another filter or explore places to find something you love.';
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
  }, 4000);
}

function bindInteractions() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderFavorites();
    });
  });

  // Use one listener for all generated restaurant cards.
  grid.addEventListener('click', (event) => {
    const favoriteButton = event.target.closest('[data-favorite-id]');
    if (!favoriteButton) return;

    const restaurantId = favoriteButton.dataset.favoriteId;
    const restaurant = restaurants.find((place) => place.id === restaurantId);
    toggleFavorite(restaurantId);
    renderFavorites();
    showToast(`${restaurant?.name || 'Place'} removed from favorites.`);
  });

  document.querySelector('#share-favorites').addEventListener('click', async () => {
    const saved = getSavedRestaurants();
    if (saved.length === 0) {
      showToast('Save a place first to share your list.');
      return;
    }

    const shareText = `My Tablely favorites: ${saved.map((place) => place.name).join(', ')}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Tablely Favorites', text: shareText });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        showToast('Your favorites list was copied.');
      } else {
        showToast('Sharing is not available in this browser.');
      }
    } catch (error) {
      // Closing the native share sheet is not an error the user needs to see.
      if (error.name !== 'AbortError') showToast('Could not share your favorites list.');
    }
  });
}

export async function initMyFavoritesPage() {
  if (!grid || !emptyState) return;
  restaurants = await getFeaturedRestaurants();
  bindInteractions();
  renderFavorites();
}
