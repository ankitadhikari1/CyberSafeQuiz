"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 border border-border/60 bg-background/80 backdrop-blur hover:bg-accent"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-300 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-cyan-300 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}


