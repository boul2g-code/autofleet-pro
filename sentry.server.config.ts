import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Show local variables in stack traces — very useful for debugging
  includeLocalVariables: true,

  environment: process.env.NODE_ENV,

  beforeSend(event) {
    if (process.env.NODE_ENV === "development") return null;
    return event;
  },
});
