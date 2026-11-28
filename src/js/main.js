import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { initHomePage } from './pages/home.js';
import { initMyFavoritesPage } from './pages/my-favorites.js';
import { initRestaurantDetailsPage } from './pages/restaurant-details.js';
import { initMyBookingsPage } from './pages/my-bookings.js';
import { initExplorePage } from './pages/explore.js';
import { initMyReviewsPage } from './pages/my-reviews.js';
import { initLoginPage } from './pages/login.js';
import { initRegisterPage } from './pages/register.js';
import { initVerifyEmailPage } from './pages/verify-email.js';
import { getCurrentUser, loadCurrentUser } from './services/auth.service.js';
import { STORAGE_KEYS } from './config/constants.js';
import { getStoredValue } from './utils/storage.js';
import { requireVerifiedUser } from './utils/favorite-access.js';

// Restore the saved theme before adding shared page components.
function initializeTheme() {
  const savedTheme = getStoredValue(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && prefersDark));
}

let authLoadFailed = false;

// Send visitors to sign in before loading a page that contains personal data.
function initializeProtectedPage(selector, initializePage, accessCheck = () => Boolean(getCurrentUser())) {
  if (!document.querySelector(selector)) return;
  if (authLoadFailed) {
    const page = document.querySelector(selector);
    page.innerHTML = '<section class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900" role="alert">Could not check your sign-in status. Refresh the page or try again later.</section>';
    return;
  }
  if (!accessCheck()) return;
  initializePage();
}

async function startApp() {
  try {
    await loadCurrentUser();
  } catch {
    authLoadFailed = true;
  }

  initializeTheme();
  renderNavbar(document.querySelector('#site-header'));
  renderFooter(document.querySelector('#site-footer'));

  if (document.querySelector('[data-home-page]')) initHomePage();
  if (document.querySelector('[data-explore-page]')) initExplorePage();
  initializeProtectedPage('[data-favorites-page]', initMyFavoritesPage, requireVerifiedUser);
  if (document.querySelector('[data-restaurant-details-page]')) initRestaurantDetailsPage();
  initializeProtectedPage('[data-my-bookings-page]', initMyBookingsPage, requireVerifiedUser);
  initializeProtectedPage('[data-my-reviews-page]', initMyReviewsPage, requireVerifiedUser);
  if (document.querySelector('[data-login-page]')) initLoginPage();
  if (document.querySelector('[data-register-page]')) initRegisterPage();
  if (document.querySelector('[data-verify-email-page]')) initVerifyEmailPage();
}

startApp();
