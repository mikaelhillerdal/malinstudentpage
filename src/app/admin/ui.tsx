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

export function AdminThankYouPanel({
  attendeeCount,
  adminEmail
}: {
  attendeeCount: number;
  adminEmail: string | null;
}) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  async function submit(test: boolean) {
    if (!attachment) return;
    if (loading || testLoading) return;
    if (!test && !confirm(`Send thank-you email to ${attendeeCount} attending guest${attendeeCount === 1 ? "" : "s"}?`)) {
      return;
    }

    setStatus(null);
    if (test) setTestLoading(true);
    else setLoading(true);

    try {
      const form = new FormData();
      form.append("attachment", attachment);
      if (message.trim()) form.append("message", message.trim());
      if (test) form.append("test", "true");

      const res = await fetch("/api/admin/thank-you", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error ?? "Failed to send emails");
        return;
      }

      if (data.test) {
        setStatus(`Test email sent to ${adminEmail ?? "your account"}.`);
        return;
      }

      const failed = Array.isArray(data.failed) ? data.failed.length : 0;
      setStatus(
        failed > 0
          ? `Sent ${data.sent} of ${data.total}. ${failed} failed.`
          : `Thank-you emails sent to ${data.sent} guest${data.sent === 1 ? "" : "s"}.`
      );
    } catch {
      setStatus("Network error – try again");
    } finally {
      setLoading(false);
      setTestLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Send thank-you email (+ photo)</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Emails guests who RSVP&apos;d <b>Yes</b> ({attendeeCount} account{attendeeCount === 1 ? "" : "s"}), thanks them,
        links to the album, and attaches your chosen image.
      </p>

      <div className="mt-5 grid gap-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          className="rounded-2xl border px-4 py-3 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-100 file:px-3 file:py-2"
        />
        {attachment ? <p className="text-sm text-zinc-600">Selected: {attachment.name}</p> : null}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional personal message (plain text)"
          rows={4}
          className="rounded-2xl border px-4 py-3"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => submit(true)}
          disabled={testLoading || loading || !attachment || !adminEmail}
          className="rounded-2xl border px-5 py-3 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:hover:bg-zinc-900/40"
        >
          {testLoading ? "Sending test…" : "Send test to my email"}
        </button>
        <button
          onClick={() => submit(false)}
          disabled={loading || testLoading || !attachment || attendeeCount === 0}
          className="rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send thank-you emails"}
        </button>
      </div>

      {status ? <p className="mt-3 text-sm text-zinc-700">{status}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        Test goes to {adminEmail ?? "your admin email"} only. Bulk send is one email per guest account, not per party size.
      </p>
    </div>
  );
}

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
