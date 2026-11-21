import { createBookingCard } from '../components/booking-card.js';
import { cancelBooking, getBookings } from '../services/bookings.service.js';
import { getFeaturedRestaurants } from '../services/restaurants.service.js';

const list = document.querySelector('#bookings-list');
const emptyState = document.querySelector('#bookings-empty');
const emptyTitle = document.querySelector('#empty-title');
const emptyDescription = document.querySelector('#empty-description');
const filterButtons = [...document.querySelectorAll('.booking-filter')];
const modal = document.querySelector('#cancel-booking-modal');
const toast = document.querySelector('#bookings-toast');

let restaurantsById = new Map();
let activeFilter = 'all';
let pendingBookingId = null;
let toastTimer;

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function getBookingStatus(booking) {
  if (booking.status === 'cancelled') return 'cancelled';
  if (booking.status === 'completed' || booking.date < getToday()) return 'past';
  return 'upcoming';
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
    const count = button.querySelector('[data-filter-count]');
    if (count) count.textContent = counts[button.dataset.filter];
  });
}

function renderBookings() {
  const bookings = getBookings().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const withStatus = bookings.map((booking) => ({ booking, status: getBookingStatus(booking) }));
  const counts = {
    all: withStatus.length,
    upcoming: withStatus.filter(({ status }) => status === 'upcoming').length,
  };
  const visible = activeFilter === 'all'
    ? withStatus
    : withStatus.filter(({ status }) => status === 'upcoming');

  // Show upcoming reservations first, followed by the most recent past ones.
  visible.sort((a, b) => {
    const order = { upcoming: 0, past: 1 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    const dateOrder = String(a.booking.date).localeCompare(String(b.booking.date));
    return a.status === 'upcoming' ? dateOrder : -dateOrder;
  });

  document.querySelector('#metric-total').textContent = counts.all;
  document.querySelector('#metric-upcoming').textContent = counts.upcoming;
  document.querySelector('#booking-count-label').textContent = `${visible.length} ${visible.length === 1 ? 'booking' : 'bookings'}`;
  const nextReservation = visible.find(({ status }) => status === 'upcoming')?.booking;
  const nextRestaurant = nextReservation && restaurantsById.get(nextReservation.restaurantId);
  document.querySelector('#next-reservation').textContent = nextReservation
    ? nextRestaurant?.name || nextReservation.restaurantName || 'Your next table'
    : 'No upcoming reservation';
  document.querySelector('#next-reservation-time').textContent = nextReservation
    ? `${new Date(`${nextReservation.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${nextReservation.time || 'Time not set'}`
    : 'Past reservations are listed under All';
  updateFilterButtons(counts);

  list.innerHTML = visible.map(({ booking, status }) => (
    createBookingCard(booking, restaurantsById.get(booking.restaurantId), status)
  )).join('');
  list.classList.toggle('hidden', visible.length === 0);
  emptyState.classList.toggle('hidden', visible.length > 0);

  if (counts.all === 0) {
    emptyTitle.textContent = 'No bookings yet';
    emptyDescription.textContent = 'Find a place you love and reserve your first table in a few simple steps.';
  } else if (visible.length === 0) {
    emptyTitle.textContent = 'No upcoming bookings';
    emptyDescription.textContent = 'Your past reservations are still available under All.';
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('translate-y-6', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  toastTimer = window.setTimeout(() => {
    toast.classList.add('translate-y-6', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3500);
}

function setModalOpen(isOpen) {
  modal.classList.toggle('hidden', !isOpen);
  modal.classList.toggle('flex', isOpen);
  document.body.classList.toggle('overflow-hidden', isOpen);
}

function openCancelModal(bookingId) {
  const booking = getBookings().find((item) => item.id === bookingId);
  if (!booking || getBookingStatus(booking) !== 'upcoming') return;

  pendingBookingId = bookingId;
  const restaurant = restaurantsById.get(booking.restaurantId);
  const dateLabel = new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  document.querySelector('#cancel-restaurant-name').textContent = restaurant?.name || booking.restaurantName || 'this restaurant';
  document.querySelector('#cancel-booking-date').textContent = `${dateLabel} at ${booking.time || 'the selected time'}`;
  setModalOpen(true);
  document.querySelector('#confirm-cancel-booking').focus();
}

function bindInteractions() {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderBookings();
    });
  });

  // Event delegation keeps the cancel action working for generated cards.
  list.addEventListener('click', (event) => {
    const cancelButton = event.target.closest('[data-cancel-booking]');
    if (cancelButton) openCancelModal(cancelButton.dataset.cancelBooking);
  });

  document.querySelectorAll('[data-dismiss-cancel]').forEach((button) => {
    button.addEventListener('click', () => {
      pendingBookingId = null;
      setModalOpen(false);
    });
  });

  document.querySelector('#confirm-cancel-booking').addEventListener('click', () => {
    if (!pendingBookingId) return;
    const didCancel = cancelBooking(pendingBookingId);
    pendingBookingId = null;
    setModalOpen(false);
    if (!didCancel) {
      showToast('Could not cancel this reservation. Please try again.');
      return;
    }
    renderBookings();
    showToast('Your reservation has been cancelled.');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      pendingBookingId = null;
      setModalOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      pendingBookingId = null;
      setModalOpen(false);
    }
  });
}

export async function initMyBookingsPage() {
  if (!list || !emptyState) return;
  const restaurants = await getFeaturedRestaurants();
  restaurantsById = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]));
  bindInteractions();
  renderBookings();
}
