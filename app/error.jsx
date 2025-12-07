"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-400 mb-2">⚠️ Error</h1>
          <p className="text-slate-300">
            Something went wrong. The system encountered an unexpected error.
          </p>
        </div>
        <div className="rounded-lg border border-red-500/40 bg-slate-900/80 p-4 mb-6">
          <p className="text-xs text-red-300 font-mono break-all">
            {error?.message || "Unknown error occurred"}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-900/60 text-slate-50 hover:bg-slate-800"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

