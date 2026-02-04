"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { applyTheme, getTheme, subscribeTheme } from "@/lib/theme";

type NavItem = { href: string; label: string };

const NAV_PUBLIC: NavItem[] = [
  { href: "/event", label: "Event" },
  { href: "/game", label: "Game" }
];

function isActive(pathname: string, href: string) {
  // exact match or nested routes
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // apply on mount
    const t = getTheme();
    applyTheme(t);
    setTheme(t);

    // keep all toggles in sync
    return subscribeTheme(() => setTheme(getTheme()));
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="rounded-xl border px-3 py-2 text-sm shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
      aria-label="Toggle dark mode"
      type="button"
    >
      <span className="gradient-text gradient-anim gradient-anim-hover font-medium">
        {theme === "dark" ? "☾ Dark" : "☀︎ Light"}
      </span>
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ user: null | { id: string; email: string | null }; isAdmin: boolean } | null>(
    null
  );

  // Close mobile menu when route changes
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = (await res.json()) as { user: null | { id: string; email: string | null }; isAdmin: boolean };
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession({ user: null, isAdmin: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const items = useMemo(
    () => {
      const isLoggedIn = Boolean(session?.user);
      const isAdmin = Boolean(session?.isAdmin);

      const nav: NavItem[] = [...NAV_PUBLIC];
      if (isAdmin) nav.push({ href: "/admin", label: "Admin" });
      if (isLoggedIn) nav.push({ href: "/logout", label: "Logout" });
      else nav.push({ href: "/login", label: "Log in" });

      return nav.map((i) => ({ ...i, active: isActive(pathname, i.href) }));
    },
    [pathname, session]
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur dark:bg-zinc-950/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="gradient-text gradient-anim gradient-anim-hover">Malin&apos;s Student Page</span>{" "}          
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-2 text-sm">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${item.active ? "nav-link-active" : ""}`}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border px-3 py-2 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="gradient-text gradient-anim gradient-anim-hover font-medium">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t bg-white/80 backdrop-blur dark:bg-zinc-950/80 md:hidden">
          <nav className="mx-auto max-w-5xl px-4 py-3">
            <div className="grid gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${item.active ? "nav-link-active" : ""}`}
                >
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
