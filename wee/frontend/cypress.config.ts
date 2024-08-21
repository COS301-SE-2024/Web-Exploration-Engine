import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'cypress' }),
    baseUrl: 'http://localhost:3000',
    trashAssetsBeforeRuns: true,  // Prevents Cypress from deleting screenshots before new test runs
  },

  retries: {
    experimentalStrategy: 'detect-flake-but-always-fail',
    experimentalOptions: {
      maxRetries: 1,
      stopIfAnyPassed: true,
    },
    openMode: true,
    runMode: true,
  },
});
