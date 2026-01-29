import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Malin&apos;s Student Celebration</h1>

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
    
      <div className="mt-10 overflow-hidden rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
        
        <div className="mt-6 flex justify-center">
<Image
            src="/unicorn.png"
            alt="Silly unicorn"
            width={520}
            height={520}
            className="w-[520px] max-w-full select-none"
            draggable={false}
          />
        </div>
      </div>


    </div>    
  );
}
