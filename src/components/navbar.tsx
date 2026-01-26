import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="bg-accent-gradient bg-clip-text text-transparent">Malin</span>{" "}
          <span className="text-zinc-800">Student Page</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-xl px-3 py-2 hover:bg-zinc-50" href="/event">Event</Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-zinc-50" href="/game">Game</Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-zinc-50" href="/admin">Admin</Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-zinc-50" href="/logout">Logout</Link>
        </nav>
      </div>
    </header>
  );
}
