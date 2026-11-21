import { STORAGE_KEYS } from '../config/constants.js';
import { bookings as initialBookings } from '../data/bookings.data.js';
import { getStoredValue, setStoredValue } from '../utils/storage.js';

export function getBookings() {
  const savedBookings = getStoredValue(STORAGE_KEYS.bookings, initialBookings);
  if (!Array.isArray(savedBookings)) return [];

  // Remove old cancelled entries left by the previous status-based behavior.
  const activeBookings = savedBookings.filter((booking) => booking.status !== 'cancelled');
  if (activeBookings.length !== savedBookings.length) {
    setStoredValue(STORAGE_KEYS.bookings, activeBookings);
  }
  return activeBookings;
}

export function createBooking(bookingDetails) {
  const booking = {
    ...bookingDetails,
    id: globalThis.crypto?.randomUUID?.() || `booking-${Date.now()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  const saved = setStoredValue(STORAGE_KEYS.bookings, [...getBookings(), booking]);
  return saved ? booking : null;
}

export function cancelBooking(bookingId) {
  const currentBookings = getBookings();
  const nextBookings = currentBookings.filter((booking) => booking.id !== bookingId);
  if (nextBookings.length === currentBookings.length) return false;
  return setStoredValue(STORAGE_KEYS.bookings, nextBookings);
}

// Any confirmed non-cancelled booking makes the guest eligible to review.
export function hasBookingForRestaurant(restaurantId) {
  return getBookings().some((booking) => (
    booking.restaurantId === restaurantId
    && booking.status !== 'cancelled'
  ));
}
