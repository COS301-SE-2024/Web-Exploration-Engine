import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'cypress',
      webServerCommands: { default: 'nx run frontend:start' },
      ciWebServerCommand: 'nx run frontend:serve-static',
    }),
    baseUrl: 'http://localhost:3001',
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}', // Update this line
  },
});
