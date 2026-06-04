'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">AutoFleet Pro</p>
            <h1 className="mt-4 text-3xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The error was captured for review. Try again, or refresh the page if the problem continues.
            </p>
            <button
              className="mt-6 rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
            {process.env.NODE_ENV === 'development' ? (
              <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-left text-xs text-rose-200">
                {error.message}
              </pre>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  )
}
