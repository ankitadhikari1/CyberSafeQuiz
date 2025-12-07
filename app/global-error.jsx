"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-black px-4 text-green-400 font-mono">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              SYSTEM ERROR
            </h1>
            <div className="rounded-lg border-2 border-red-500/50 bg-black/90 p-6 mb-6">
              <p className="text-sm text-red-400 mb-4">
                Critical system failure detected
              </p>
              <p className="text-xs text-green-400 font-mono break-all">
                {error?.message || "Unknown error"}
              </p>
            </div>
            <button
              onClick={reset}
              className="rounded-md border-2 border-green-500/50 bg-green-500/10 px-6 py-2 text-green-400 hover:bg-green-500/20 transition-colors"
            >
              [*] Restart System
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

