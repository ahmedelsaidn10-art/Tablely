import { escapeHTML } from '../utils/helpers.js';

// Render a single customer review using the shared card style.
export function createReviewCard(review) {
  const stars = Array.from({ length: 5 }, (_, index) => (
    `<span class="${index < review.rating ? 'text-primary' : 'text-surface-highest'}" aria-hidden="true">★</span>`
  )).join('');
  const date = new Date(review.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `
    <article class="rounded-2xl border border-surface-high bg-surface p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="font-display font-bold text-on-surface">${escapeHTML(review.author)}</h3>
          <time class="mt-1 block text-xs text-on-surface-variant" datetime="${escapeHTML(review.date)}">${escapeHTML(date)}</time>
        </div>
        <div class="flex gap-0.5 text-lg" aria-label="${review.rating} out of 5 stars">${stars}</div>
      </div>
      ${review.comment ? `<p class="mt-4 text-sm leading-6 text-on-surface-variant">${escapeHTML(review.comment)}</p>` : ''}
    </article>
  `;
}
