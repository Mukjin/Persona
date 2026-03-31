"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem("persona-theme");
  if (stored === "light" || stored === "dark") return stored;

  return "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const nextTheme = getPreferredTheme();
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("persona-theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-secondary px-4 py-2 text-xs"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
