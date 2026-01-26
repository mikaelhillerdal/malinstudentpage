import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminInvitePanel, AdminRsvpTable } from "./ui";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,email,phone,first_name,last_name,is_admin")
    .order("last_name", { ascending: true });

  const { data: rsvps } = await supabase.from("rsvps").select("user_id,attending,party_size,updated_at");

  const rsvpByUser = new Map((rsvps ?? []).map((r) => [r.user_id, r]));
  const merged = (profiles ?? []).map((p) => ({ ...p, rsvp: rsvpByUser.get(p.id) ?? null }));

  const totalAttending = merged.reduce((sum, row) => sum + (row.rsvp?.attending ? row.rsvp.party_size : 0), 0);

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Total attending (sum of party sizes): <span className="font-semibold">{totalAttending}</span>
            </p>
          </div>
          <div className="h-1 w-56 rounded-full bg-accent-gradient" />
        </div>
      </div>

      <AdminInvitePanel />
      <AdminRsvpTable rows={merged as any} />
    </div>
  );
}
