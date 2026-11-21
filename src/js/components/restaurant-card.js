import { isFavorite } from '../services/favorites.service.js';
import { escapeHTML } from '../utils/helpers.js';

// Build one restaurant card from a data object.
export function createRestaurantCard(restaurant) {
  const tags = restaurant.tags
    .map((tag) => `<span class="rounded-md bg-surface-low px-2 py-1 text-xs font-semibold text-on-surface-variant">${escapeHTML(tag)}</span>`)
    .join('');
  const saved = isFavorite(restaurant.id);

  return `
    <article class="restaurant-card group flex flex-col overflow-hidden rounded-2xl border border-surface-high bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div class="relative aspect-[16/10] overflow-hidden bg-surface-high">
        <img class="restaurant-card-image h-full w-full object-cover transition duration-500" src="${escapeHTML(restaurant.image)}" alt="${escapeHTML(restaurant.imageAlt)}" loading="lazy" />
        <span class="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-on-surface backdrop-blur">${escapeHTML(restaurant.type)} · ${escapeHTML(restaurant.cuisine)}</span>
        <button class="favorite-button absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm backdrop-blur transition hover:scale-105" type="button" data-favorite-id="${escapeHTML(restaurant.id)}" aria-label="${saved ? 'Remove from' : 'Add to'} favorites" aria-pressed="${saved}">
          <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
        </button>
      </div>
      <div class="flex flex-1 flex-col justify-between p-5">
        <div>
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display text-lg font-bold leading-snug text-on-surface transition group-hover:text-primary">${escapeHTML(restaurant.name)}</h3>
            <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-1 text-xs font-bold text-tertiary"><span class="material-symbols-outlined text-sm" aria-hidden="true">star</span>${escapeHTML(restaurant.rating)}</span>
          </div>
          <p class="mt-2 flex items-center gap-1.5 text-sm text-on-surface-variant"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">location_on</span>${escapeHTML(restaurant.location)} <span aria-hidden="true">·</span> ${escapeHTML(restaurant.price)}</p>
          <div class="mt-3 flex flex-wrap gap-2">${tags}</div>
        </div>
        <div class="mt-5 flex items-center justify-between gap-3 border-t border-surface-high pt-4">
          <span class="text-xs font-medium text-on-surface-variant">${escapeHTML(restaurant.availability)}</span>
          <a class="shrink-0 rounded-xl bg-surface-high px-4 py-2 text-sm font-bold text-on-surface transition hover:bg-primary hover:text-on-primary" href="restaurant-details.html?id=${encodeURIComponent(restaurant.id)}">View details</a>
        </div>
      </div>
    </article>
  `;
}
