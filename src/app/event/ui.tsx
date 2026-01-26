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
  const [attending, setAttending] = useState<boolean>(initial.attending);
  const [cannotAttend, setCannotAttend] = useState<boolean>(!initial.attending && (initial.party_size ?? 0) === 0);
  const [partySize, setPartySize] = useState<number>(Math.max(initial.party_size ?? 1, 1));
  const [status, setStatus] = useState<string | null>(null);

  function toggleAttending(next: boolean) {
    setAttending(next);
    if (next) {
      setCannotAttend(false);
      if (partySize < 1) setPartySize(1);
    } else {
      // if unchecking attending without checking cannot-attend, user is "undecided"
      // leave cannotAttend as-is
    }
  }

  function toggleCannotAttend(next: boolean) {
    setCannotAttend(next);
    if (next) {
      setAttending(false);
    }
  }

  async function onSubmit() {
    setStatus(null);

    // Decide what we save:
    // - If "cannot attend" => attending=false, party_size=0
    // - If attending => attending=true, party_size>=1
    // - If neither checked => treat as "not responded yet" (we'll store attending=false, party_size=0)
    const willAttend = attending && !cannotAttend;
    const payload = {
      attending: willAttend,
      party_size: willAttend ? partySize : 0
    };

    const res = await saveRsvp(payload);

    if (!res.ok) {
      setStatus(res.message ?? "Failed to save.");
      return;
    }

    if (willAttend) {
      setStatus(`Saved. ${nameFallback} — ${partySize} attending.`);
    } else if (cannotAttend) {
      setStatus(`Saved. ${nameFallback} — cannot attend.`);
    } else {
      setStatus(`Saved. ${nameFallback} — no response selected (saved as not attending).`);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 text-sm">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={attending}
            onChange={(e) => toggleAttending(e.target.checked)}
            className="h-5 w-5 rounded border"
          />
          <span>I will attend</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={cannotAttend}
            onChange={(e) => toggleCannotAttend(e.target.checked)}
            className="h-5 w-5 rounded border"
          />
          <span>We cannot attend</span>
        </label>

        <p className="text-xs text-zinc-500">
          (Only one of these should be selected.)
        </p>
      </div>

      <label className="grid gap-1 text-sm md:max-w-xs">
        <span className="text-zinc-700">How many people (including you)?</span>
        <input
          type="number"
          min={1}
          max={20}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          disabled={!attending || cannotAttend}
          className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-50"
        />
      </label>

      <button
        type="button"
        onClick={onSubmit}
        className="w-fit rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90"
      >
        Save RSVP
      </button>

      {status ? <p className="text-sm text-zinc-700">{status}</p> : null}
    </div>
  );
}
