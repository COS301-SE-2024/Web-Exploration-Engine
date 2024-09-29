import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://capstone-wee.dns.net.za',
    defaultCommandTimeout: 6000,
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
