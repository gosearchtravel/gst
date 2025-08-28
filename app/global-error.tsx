'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full text-center p-6">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-gray-400 mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Something went wrong!
              </h2>
              <p className="text-gray-600 mb-6">
                We&apos;re experiencing some technical difficulties. Please try again later.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-3 bg-red-50 text-red-700 text-xs rounded border overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
