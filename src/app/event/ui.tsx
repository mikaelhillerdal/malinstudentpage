"use client";

import { useState } from "react";
import { saveRsvp } from "./actions";

export function EventRsvpForm({
  initial,
  nameFallback
}: {
  initial: { attending: boolean; party_size: number };
  nameFallback: string;
}) {
  const [attending, setAttending] = useState(initial.attending);
  const [partySize, setPartySize] = useState(initial.party_size);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit() {
    setStatus(null);
    const res = await saveRsvp({ attending, party_size: partySize });
    setStatus(res.ok ? `Saved. ${nameFallback} — ${attending ? partySize : 0} attending.` : res.message);
  }

  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={attending} onChange={(e) => setAttending(e.target.checked)} className="h-5 w-5 rounded border" />
        <span>I will attend</span>
      </label>

      <label className="grid gap-1 text-sm md:max-w-xs">
        <span className="text-zinc-700">How many people (including you)?</span>
        <input
          type="number"
          min={1}
          max={20}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          disabled={!attending}
          className="rounded-2xl border px-4 py-3 disabled:opacity-50"
        />
      </label>

      <button type="button" onClick={onSubmit} className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90">
        Save RSVP
      </button>

      {status ? <p className="text-sm text-zinc-700">{status}</p> : null}
    </div>
  );
}
