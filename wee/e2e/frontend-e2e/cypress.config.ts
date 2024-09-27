import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: { default: 'nx run frontend:start' },
      ciWebServerCommand: 'nx run frontend:serve-static',
    }),
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 600000,
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
