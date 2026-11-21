import footerMarkup from '../../html/components/footer.html?raw';

export function renderFooter(container) {
  if (!container) return;

  container.innerHTML = footerMarkup;
  const year = container.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
}
