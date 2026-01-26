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

  const startIso = process.env.EVENT_START_ISO || "";
const endIso = process.env.EVENT_END_ISO || "";
const address = process.env.EVENT_ADDRESS || "Your address here";
const description = process.env.EVENT_DESCRIPTION || "";

function formatDateTime(iso: string) {
  if (!iso) return { date: "—", time: "—" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "Invalid date", time: "Invalid time" };

  const date = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(d);

  const time = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);

  return { date, time };
}

const start = formatDateTime(startIso);
const end = formatDateTime(endIso);

const event = {
  date: start.date,
  partyTime: start.time,
  endTime: end.time,
  address,
  description
};


  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6 shadow-sm">
        <div className="h-1 w-32 rounded-full bg-accent-gradient" />
        <h1 className="mt-4 text-2xl font-semibold">Event info</h1>

        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-zinc-500">Date</dt><dd className="font-medium">{event.date}</dd></div>
          <div><dt className="text-zinc-500">Running out of school</dt><dd className="font-medium">15:00</dd></div>
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
