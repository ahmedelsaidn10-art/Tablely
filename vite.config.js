import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  // Include every standalone page in the production build.
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        explore: 'explore.html',
        restaurantDetails: 'restaurant-details.html',
        login: 'login.html',
        register: 'register.html',
        myBookings: 'my-bookings.html',
        myFavorites: 'my-favorites.html',
        myReviews: 'my-reviews.html',
      },
    },
  },
});
