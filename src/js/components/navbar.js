import navbarMarkup from '../../html/components/navbar.html?raw';
import { STORAGE_KEYS } from '../config/constants.js';
import { getCurrentUser, logoutUser } from '../services/auth.service.js';
import { setStoredValue } from '../utils/storage.js';

export function renderNavbar(container) {
  if (!container) return;

  container.innerHTML = navbarMarkup;

  // Reflect the local sign-in state in the shared navigation.
  const currentUser = getCurrentUser();
  container.querySelectorAll('[data-auth-signin]').forEach((link) => {
    if (link.hasAttribute('data-auth-desktop')) {
      // Keep it hidden on small screens; only enable the desktop display for guests.
      link.classList.add('hidden');
      link.classList.toggle('sm:inline-flex', !currentUser);
    } else {
      link.classList.toggle('hidden', Boolean(currentUser));
    }
  });
  container.querySelectorAll('[data-auth-signout]').forEach((button) => {
    if (button.hasAttribute('data-auth-desktop')) {
      // Keep the desktop action out of the mobile header; mobile actions live in the menu.
      button.classList.add('hidden');
      button.classList.toggle('sm:inline-flex', Boolean(currentUser));
    } else {
      button.classList.toggle('hidden', !currentUser);
    }
    button.addEventListener('click', async () => {
      button.disabled = true;
      try { await logoutUser(); } catch { /* The local view still returns to the public page. */ }
      window.location.href = 'index.html';
    });
  });
  const userLabel = container.querySelector('[data-user-label]');
  if (userLabel && currentUser?.name) userLabel.textContent = currentUser.name;
  const userInitial = Array.from(String(currentUser?.name || '').trim())[0]?.toLocaleUpperCase() || '';
  container.querySelectorAll('[data-user-initial]').forEach((badge) => {
    if (badge.hasAttribute('data-auth-desktop')) {
      // Keep the desktop initial out of the mobile header; the menu has its own badge.
      badge.classList.add('hidden');
      badge.classList.toggle('sm:inline-flex', Boolean(currentUser));
    } else {
      badge.classList.toggle('hidden', !currentUser);
      badge.classList.toggle('inline-flex', Boolean(currentUser));
    }
    badge.textContent = userInitial;
    if (currentUser?.name) badge.setAttribute('aria-label', `${currentUser.name} profile`);
  });

  // Keep the shared navigation highlight in sync with the current page.
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  container.querySelectorAll('nav a[href]').forEach((link) => {
    const isCurrentPage = link.getAttribute('href') === currentPage;
    if (link.classList.contains('nav-link')) {
      link.classList.toggle('nav-link-active', isCurrentPage);
    }
    if (link.classList.contains('mobile-nav-link')) {
      link.classList.toggle('mobile-nav-link-active', isCurrentPage);
    }
    if (isCurrentPage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const themeButton = container.querySelector('[data-theme-toggle]');
  const themeIcon = container.querySelector('[data-theme-icon]');
  const menuButton = container.querySelector('[data-menu-toggle]');
  const mobileMenu = container.querySelector('#mobile-menu');
  const menuIcon = container.querySelector('[data-menu-icon]');

  const updateThemeButton = () => {
    const isDark = document.documentElement.classList.contains('dark');
    themeButton?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeIcon) themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  };

  updateThemeButton();

  themeButton?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setStoredValue(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
    updateThemeButton();
  });

  menuButton?.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    menuButton.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    mobileMenu?.classList.toggle('hidden', isExpanded);
    if (menuIcon) menuIcon.textContent = isExpanded ? 'menu' : 'close';
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Open menu');
      if (menuIcon) menuIcon.textContent = 'menu';
    });
  });
}
