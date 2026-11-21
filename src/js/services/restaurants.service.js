import { restaurants } from '../data/restaurants.data.js';

// Pages call this service instead of importing mock data directly.
export async function getFeaturedRestaurants() {
  return restaurants;
}

// Find one restaurant for the details page from its URL id.
export async function getRestaurantById(restaurantId) {
  return restaurants.find((restaurant) => restaurant.id === restaurantId) || null;
}
