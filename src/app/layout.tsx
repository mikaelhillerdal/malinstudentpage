import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Malin Student Page",
  description: "Secure invite & RSVP + unicorn mini-game",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeInitScript = `(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch {}
  })();`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
