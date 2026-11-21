import { escapeHTML } from '../utils/helpers.js';

// Build one booking card from a saved reservation.
export function createBookingCard(booking, restaurant, status) {
  const name = restaurant?.name || booking.restaurantName || 'Restaurant';
  const image = restaurant?.image || '/images/banners/home-hero.jpg';
  const imageAlt = restaurant?.imageAlt || `${name} dining room`;
  const date = new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const statusLabels = {
    upcoming: 'Upcoming',
    past: 'Completed',
    cancelled: 'Cancelled',
  };
  const statusStyles = {
    upcoming: 'bg-primary/10 text-primary',
    past: 'bg-surface-high text-on-surface-variant',
    cancelled: 'bg-red-100 text-red-800',
  };

  return `
    <article class="booking-card flex flex-col gap-5 rounded-3xl border border-surface-high bg-surface p-4 shadow-sm transition hover:shadow-md sm:p-5 lg:flex-row" data-booking-id="${escapeHTML(booking.id)}">
      <a class="relative h-52 shrink-0 overflow-hidden rounded-2xl bg-surface-high lg:h-auto lg:w-64" href="restaurant-details.html?id=${encodeURIComponent(booking.restaurantId)}" aria-label="View ${escapeHTML(name)} details">
        <img class="h-full w-full object-cover transition duration-500 hover:scale-105" src="${escapeHTML(image)}" alt="${escapeHTML(imageAlt)}" loading="lazy" />
        <span class="absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status]}">${statusLabels[status]}</span>
      </a>
      <div class="flex min-w-0 flex-1 flex-col justify-between gap-5 py-1">
        <div>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-primary">${escapeHTML(restaurant?.type || 'Reservation')}</p>
              <h2 class="mt-1 font-display text-xl font-bold text-on-surface">${escapeHTML(name)}</h2>
              <p class="mt-1 text-sm text-on-surface-variant">${escapeHTML(restaurant?.location || '')}</p>
            </div>
            <span class="rounded-full bg-surface-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant">Ref. ${escapeHTML(String(booking.id).slice(-8))}</span>
          </div>

          <dl class="mt-5 grid gap-4 border-t border-surface-high pt-4 sm:grid-cols-3">
            <div>
              <dt class="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">calendar_month</span>Date</dt>
              <dd class="mt-1 text-sm font-bold text-on-surface">${escapeHTML(date)}</dd>
            </div>
            <div>
              <dt class="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">schedule</span>Time</dt>
              <dd class="mt-1 text-sm font-bold text-on-surface">${escapeHTML(booking.time || '—')}</dd>
            </div>
            <div>
              <dt class="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant"><span class="material-symbols-outlined text-base text-primary" aria-hidden="true">group</span>Guests</dt>
              <dd class="mt-1 text-sm font-bold text-on-surface">${escapeHTML(String(booking.guests || 1))}</dd>
            </div>
          </dl>
          ${booking.specialRequests ? `<p class="mt-4 rounded-xl bg-surface-low px-3 py-2 text-xs leading-5 text-on-surface-variant"><strong class="text-on-surface">Note:</strong> ${escapeHTML(booking.specialRequests)}</p>` : ''}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-surface-high pt-4">
          <a class="inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2" href="restaurant-details.html?id=${encodeURIComponent(booking.restaurantId)}">View restaurant <span class="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span></a>
          ${status === 'upcoming' ? `<button class="cancel-booking-button min-h-10 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50" type="button" data-cancel-booking="${escapeHTML(booking.id)}">Cancel reservation</button>` : ''}
        </div>
      </div>
    </article>
  `;
}
