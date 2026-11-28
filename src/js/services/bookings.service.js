import { apiDelete, apiGet, apiPost } from './api-client.js';

export async function getBookings() {
  const response = await apiGet('bookings');
  return response?.data?.items || [];
}

export async function createBooking(details) {
  const response = await apiPost('bookings', {
    restaurantId: Number(details.restaurantId),
    date: details.date,
    time: details.time,
    guests: Number(details.guests),
    ...(details.specialRequests ? { specialRequests: details.specialRequests } : {}),
  });
  return response?.data?.booking || null;
}

export async function cancelBooking(bookingId) {
  const response = await apiDelete(`bookings/${encodeURIComponent(bookingId)}`);
  return response?.success === true;
}

export async function hasBookingForRestaurant(restaurantId) {
  const bookings = await getBookings();
  return bookings.some((booking) => Number(booking.restaurantId) === Number(restaurantId));
}
