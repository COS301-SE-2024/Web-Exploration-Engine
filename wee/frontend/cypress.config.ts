import { defineConfig } from 'cypress';

module.exports = defineConfig({
  fixturesFolder: false,
  env: {
    codeCoverage: {
      url: 'http://localhost:1234/__coverage__',
      //exclude: 'cypress/**/*.*',
      specPattern	:"./cypress/integration/**/*.cy.{js,jsx,ts,tsx}"
    },
  },
  e2e: {
    setupNodeEvents(on: any, config: any) {
      return require('./cypress/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:1234',
  },
});
