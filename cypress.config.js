const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://rozetka.com.ua/ua/',
    viewportHeight: 1200,
    viewportWidth: 1800,
  },
});
