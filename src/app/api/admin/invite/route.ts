export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { buildIcs } from "@/lib/ics";

const Body = z.object({
  email: z.string().email(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable()
});

function randomPassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (!me?.is_admin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const admin = createSupabaseAdmin();
  const { email, first_name, last_name, phone } = parsed.data;
  const password = randomPassword();

  // Create/update auth user
  let userId: string | null = null;
  const existing = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = existing.data.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());

  if (found) {
    userId = found.id;
    const upd = await admin.auth.admin.updateUserById(found.id, { password });
    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });
  } else {
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (created.error) return NextResponse.json({ error: created.error.message }, { status: 400 });
    userId = created.data.user?.id ?? null;
  }

  if (!userId) return NextResponse.json({ error: "Could not create user" }, { status: 500 });

  const up = await admin.from("profiles").upsert({
    id: userId,
    email,
    first_name: first_name ?? null,
    last_name: last_name ?? null,
    phone: phone ?? null
  });
  if (up.error) return NextResponse.json({ error: up.error.message }, { status: 400 });

  // Email + calendar (.ics)
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const title = process.env.EVENT_TITLE || "Student Celebration";
  const startIso = process.env.EVENT_START_ISO!;
  const endIso = process.env.EVENT_END_ISO!;
  const address = process.env.EVENT_ADDRESS || "";
  const description = (process.env.EVENT_DESCRIPTION || "").replace(/\\n/g, "\n");

  const ics = buildIcs({
    uid: `${userId}@malinstudentpage`,
    title,
    startIso,
    endIso,
    location: address,
    description
  });

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
      <h2>You’re invited 🎓🦄</h2>
      <p>Use this login to access the private event page and RSVP.</p>
      <p><b>Website:</b> ${siteUrl}</p>
      <p><b>Email:</b> ${email}<br/>
         <b>Password:</b> ${password}</p>
      <p>Calendar invite attached (.ics).</p>
    </div>
  `;

  const sent = await resend.emails.send({
    from: "Student Invite <onboarding@resend.dev>",
    to: [email],
    subject: `Invitation: ${title}`,
    html,
    attachments: [{ filename: "invite.ics", content: Buffer.from(ics).toString("base64") }]
  });

  if (sent?.error) return NextResponse.json({ error: sent.error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
