import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EventRsvpForm } from "./ui";

export default async function EventPage() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const [{ data: profile }, { data: rsvp }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("rsvps").select("*").eq("user_id", user.id).maybeSingle()
  ]);

  const event = {
    date: "June 5, 2026",
    runOutTime: "13:00",
    partyTime: "16:00",
    address: process.env.EVENT_ADDRESS || "Your address here"
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6 shadow-sm">
        <div className="h-1 w-32 rounded-full bg-accent-gradient" />
        <h1 className="mt-4 text-2xl font-semibold">Event info</h1>

        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-zinc-500">Date</dt><dd className="font-medium">{event.date}</dd></div>
          <div><dt className="text-zinc-500">Running out of school</dt><dd className="font-medium">{event.runOutTime}</dd></div>
          <div><dt className="text-zinc-500">Party at home</dt><dd className="font-medium">{event.partyTime}</dd></div>
          <div><dt className="text-zinc-500">Address</dt><dd className="font-medium">{event.address}</dd></div>
        </dl>
      </div>

      <div className="rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">RSVP</h2>
        <p className="mt-1 text-sm text-zinc-600">Please tell us if you’re coming — and how many you’ll be.</p>

        <div className="mt-6">
          <EventRsvpForm
            initial={{ attending: rsvp?.attending ?? false, party_size: rsvp?.party_size ?? 1 }}
            nameFallback={profile?.last_name ? profile.last_name : user.email ?? "Guest"}
          />
        </div>
      </div>
    </div>
  );
}
