//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions & import('next').NextConfig}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // You can add other Next.js specific configurations here
};

// Sentry configuration
const sentryOptions = {
  org: process.env.NEXT_PUBLIC_SENTRY_DSN_LINK,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  sentryUrl: "https://sentry.io/",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: false,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  (/** @type {any} */ config) => withSentryConfig(config, sentryOptions),
];

module.exports = composePlugins(...plugins)(nextConfig);
