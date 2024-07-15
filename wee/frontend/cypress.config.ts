import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'cypress' }),
    baseUrl: 'http://localhost:3000',
  },

  retries: {
    experimentalStrategy: 'detect-flake-but-always-fail',
    experimentalOptions: {
      maxRetries: 5,
      stopIfAnyPassed: true,
    },
    openMode: true,
    runMode: true,
  },
});
