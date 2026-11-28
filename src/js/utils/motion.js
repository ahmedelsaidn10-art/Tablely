const REVEAL_SELECTOR = [
  'main > section',
  'main section[id]',
  'main article',
  'main .restaurant-card',
  'main .booking-card',
].join(',');

// Add motion only when the visitor has not asked the browser to reduce it.
export function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const main = document.querySelector('main');
  if (!main) return;

  document.documentElement.classList.add('motion-enabled');
  main.classList.add('motion-page-enter');

  if (!('IntersectionObserver' in window)) {
    main.querySelectorAll(REVEAL_SELECTOR).forEach((item) => item.classList.add('motion-visible'));
    return;
  }

  const observed = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  function observeNewContent(root = main) {
    const items = [];
    if (root.matches?.(REVEAL_SELECTOR)) items.push(root);
    items.push(...root.querySelectorAll(REVEAL_SELECTOR));

    items.forEach((item, index) => {
      if (observed.has(item)) return;
      observed.add(item);
      item.classList.add('motion-reveal');
      item.style.setProperty('--motion-delay', `${Math.min(index % 5, 4) * 70}ms`);
      observer.observe(item);
    });
  }

  observeNewContent();
  const mutationObserver = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) observeNewContent(node);
    }));
  });
  mutationObserver.observe(main, { childList: true, subtree: true });
}
