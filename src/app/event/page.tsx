import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EventRsvpForm } from "./ui";

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
  const description = (process.env.EVENT_DESCRIPTION || "").replace(/\\n/g, "\n");

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
    <div className="relative overflow-hidden">
      {/* Unicorn background character (head) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden md:block w-1/2 overflow-hidden">
<Image
          src="/unicorn.png"
          alt=""
          aria-hidden={true}
          draggable={false}
          width={950}
          height={950}
          className="
            absolute
            left-[-22%]
            top-1/2
            w-[950px]
            -translate-y-1/2
            opacity-15
            blur-[1px]
            select-none
            dark:opacity-10
          "
        />
        {/* Soft fade so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/35 to-transparent dark:from-zinc-950/75 dark:via-zinc-950/35" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 grid gap-6">
        <div className="rounded-3xl border p-6 shadow-sm">
          <div className="h-1 w-32 rounded-full bg-accent-gradient" />
          <h1 className="mt-4 text-2xl font-semibold">Event info</h1>

          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-zinc-500">Date</dt>
              <dd className="font-medium">{event.date}</dd>
            </div>

            <div>
              <dt className="text-zinc-500">Running out of school</dt>
              <dd className="font-medium">15:00</dd>
            </div>

            <div>
              <dt className="text-zinc-500">Party at home</dt>
              <dd className="font-medium">
                {event.partyTime}
                {event.endTime !== "—" ? `–${event.endTime}` : ""}
              </dd>
            </div>

            <div>
              <dt className="text-zinc-500">Address</dt>
              <dd className="font-medium">{event.address}</dd>
            </div>

            {event.description ? (
              <div className="md:col-span-2">
                <dt className="text-zinc-500">Info</dt>
                <dd className="font-medium whitespace-pre-line">{event.description}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-3xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold">RSVP</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Please tell us if you’re coming — and how many you’ll be.
          </p>

          <div className="mt-6">
            <EventRsvpForm
              initial={{ attending: rsvp?.attending ?? false, party_size: rsvp?.party_size ?? 1 }}
              nameFallback={profile?.last_name ? profile.last_name : user.email ?? "Guest"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
