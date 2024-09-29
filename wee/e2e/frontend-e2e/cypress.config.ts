import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://capstone-wee.dns.net.za',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}', // Ensure this path matches your actual spec files
    defaultCommandTimeout: 6000,
    supportFile: false, // Set to false if you don't use a support file
  },
  retries: {
    experimentalStrategy: 'detect-flake-but-always-fail',
    experimentalOptions: {
      maxRetries: 3,
      stopIfAnyPassed: true,
    },
    openMode: true,
    runMode: true,
  },
});
