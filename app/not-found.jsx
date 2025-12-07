"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-cyan-400 mb-2">404</h1>
          <p className="text-2xl font-semibold text-slate-300 mb-2">
            Page Not Found
          </p>
          <p className="text-slate-400">
            The requested resource could not be located in the system.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/40 bg-slate-900/80 p-4 mb-6">
          <p className="text-xs text-slate-400 font-mono">
            Error: Route not found in CyberSafe Quiz system
          </p>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}

