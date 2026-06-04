import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withSentryConfig(nextConfig, {
  org: "autofleet-pro",
  project: "autofleet-pro",

  // Source map upload auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload wider set of client files for better stack traces
  widenClientFileUpload: true,

  // Proxy through /monitoring to bypass ad-blockers
  tunnelRoute: "/monitoring",

  // Suppress output unless in CI
  silent: !process.env.CI,
});
