import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
}

const sentryBuildOptions = {
  org: process.env.SENTRY_ORG || 'autofleet-pro',
  project: process.env.SENTRY_PROJECT || 'autofleet-pro',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  // tunnelRoute removed: incompatible with Turbopack (SKILL.md warning)
  // Client sends events directly to DSN instead
  silent: !process.env.CI,
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
