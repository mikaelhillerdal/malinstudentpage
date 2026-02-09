"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean | null;
  rsvp: null | { user_id: string; attending: boolean; party_size: number; updated_at: string | null };
};

export function AdminInvitePanel() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendInvite() {
    if (loading) return;
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName, phone })
      });
      const data = await res.json();
      setStatus(res.ok ? `Invite sent to ${email}` : (data?.error ?? "Failed"));
    } catch {
      setStatus("Network error – try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Send invite email (+ calendar)</h2>
      <p className="mt-1 text-sm text-zinc-600">Creates/updates the user and emails login + .ics invite.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-2xl border px-4 py-3" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-2xl border px-4 py-3" />
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-2xl border px-4 py-3" />
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Surname" className="rounded-2xl border px-4 py-3" />
      </div>

      <button onClick={sendInvite} disabled={loading} className="mt-4 rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90 disabled:opacity-50">
        {loading ? "Sending…" : "Send invite"}
      </button>

      {status ? <p className="mt-3 text-sm text-zinc-700">{status}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">MVP note: email contains a generated password.</p>
    </div>
  );
}

export function AdminRsvpTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      `${r.email ?? ""} ${r.first_name ?? ""} ${r.last_name ?? ""} ${r.phone ?? ""}`.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="rounded-3xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Guests + RSVP</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="rounded-2xl border px-4 py-2 text-sm" />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-2">Surname</th>
              <th className="py-2">First name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Attending</th>
              <th className="py-2">Party size</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2 font-medium">{r.last_name ?? "—"}</td>
                <td className="py-2">{r.first_name ?? "—"}</td>
                <td className="py-2">{r.email ?? "—"}</td>
                <td className="py-2">{r.phone ?? "—"}</td>
                <td className="py-2">{r.rsvp?.attending ? "Yes" : "No"}</td>
                <td className="py-2">{r.rsvp?.attending ? r.rsvp.party_size : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
