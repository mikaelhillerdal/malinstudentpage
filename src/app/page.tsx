import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Malin’s Student Celebration</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">Private event page with RSVP + a unicorn puzzle game.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90" href="/login">
            Log in
          </Link>
          <Link className="rounded-2xl border px-5 py-3 shadow-sm hover:bg-zinc-50" href="/event">
            Event page
          </Link>
          <Link className="rounded-2xl border px-5 py-3 shadow-sm hover:bg-zinc-50" href="/game">
            Unicorn game
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Secure" description="Only invited users can log in and RSVP." />
        <Card title="Installable" description="Works as a PWA (Add to Home Screen)." />
      </div>
    </div>
  );
}
