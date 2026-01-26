import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight gradient-text">
           Malin Student Page
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/event" className="nav-link">
            <span>Event</span>
          </Link>
          <Link href="/game" className="nav-link">
            <span>Game</span>
          </Link>
          <Link href="/admin" className="nav-link">
            <span>Admin</span>
          </Link>
          <Link href="/logout" className="nav-link">
            <span>Logout</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
