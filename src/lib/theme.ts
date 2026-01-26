export type Theme = "light" | "dark";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("themechange"));
}

export function subscribeTheme(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("themechange", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("themechange", handler);
    window.removeEventListener("storage", handler);
  };
}
