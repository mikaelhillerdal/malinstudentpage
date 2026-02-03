function toUtcBasic(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

const EVENT_TIMEZONE = "Europe/Stockholm";

function hasExplicitTimezone(iso: string) {
  return /([zZ]|[+-]\d{2}:\d{2})$/.test(iso);
}

function toIcsLocalBasic(iso: string) {
  const pad = (n: number) => String(n).padStart(2, "0");

  // If the ISO string has an explicit timezone, convert to the event timezone.
  if (hasExplicitTimezone(iso)) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) throw new Error(`Invalid ISO datetime: ${iso}`);

    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: EVENT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(d);

    const get = (type: string) => parts.find((p) => p.type === type)?.value;
    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    const minute = get("minute");
    const second = get("second");

    if (!year || !month || !day || !hour || !minute || !second) {
      throw new Error(`Could not format datetime in timezone: ${iso}`);
    }

    return `${year}${month}${day}T${hour}${minute}${second}`;
  }

  // Otherwise, treat it as already being in the event timezone.
  // Accept: YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss
  const m = iso.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  if (!m) throw new Error(`ISO datetime missing timezone and not parseable: ${iso}`);

  const [, y, mo, da, h, mi, s] = m;
  return `${y}${mo}${da}T${h}${mi}${pad(Number(s ?? "0"))}`;
}

function escapeText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildIcs(opts: {
  uid: string;
  title: string;
  startIso: string;
  endIso: string;
  location?: string;
  description?: string;
}) {
  const dtStart = toIcsLocalBasic(opts.startIso);
  const dtEnd = toIcsLocalBasic(opts.endIso);
  const dtStamp = toUtcBasic(new Date().toISOString());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//malinstudentpage//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${EVENT_TIMEZONE}`,
    `X-LIC-LOCATION:${EVENT_TIMEZONE}`,
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:+0100",
    "TZOFFSETTO:+0200",
    "TZNAME:CEST",
    "DTSTART:19700329T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0200",
    "TZOFFSETTO:+0100",
    "TZNAME:CET",
    "DTSTART:19701025T030000",
    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${escapeText(opts.uid)}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${EVENT_TIMEZONE}:${dtStart}`,
    `DTEND;TZID=${EVENT_TIMEZONE}:${dtEnd}`,
    `SUMMARY:${escapeText(opts.title)}`,
    `DESCRIPTION:${escapeText(opts.description ?? "")}`,
    `LOCATION:${escapeText(opts.location ?? "")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return lines.join("\r\n");
}
