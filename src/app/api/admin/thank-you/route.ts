export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml({
  firstName,
  siteUrl,
  customMessage
}: {
  firstName: string | null;
  siteUrl: string;
  customMessage: string | null;
}) {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  const body = customMessage
    ? escapeHtml(customMessage).replace(/\n/g, "<br/>")
    : "Thank you so much for celebrating with me. It meant a lot to have you there.";

  return `
    <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5">
      <h2>Thank you for coming 🎓🦄</h2>
      <p>${greeting}</p>
      <p>${body}</p>
      <p>Photos from the celebration are now available in our private album:</p>
      <p><a href="${siteUrl}/album">${siteUrl}/album</a></p>
      <p>Log in with the same email and password you received in your invite to browse and download photos.</p>
      <p>A photo from the day is attached to this email.</p>
    </div>
  `;
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (!me?.is_admin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const attachment = form.get("attachment");
  const messageRaw = form.get("message");
  const customMessage = typeof messageRaw === "string" && messageRaw.trim() ? messageRaw.trim() : null;
  const isTest = form.get("test") === "true";

  if (!(attachment instanceof File)) {
    return NextResponse.json({ error: "Attachment image is required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(attachment.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, { status: 400 });
  }
  if (attachment.size > MAX_BYTES) {
    return NextResponse.json({ error: "Attachment must be 10 MB or smaller" }, { status: 400 });
  }

  const admin = createSupabaseAdmin();
  let recipients: { email: string; first_name: string | null }[] = [];

  if (isTest) {
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("email,first_name")
      .eq("id", userData.user.id)
      .maybeSingle();
    const testEmail = adminProfile?.email ?? userData.user.email;
    if (!testEmail) {
      return NextResponse.json({ error: "No email on your admin account" }, { status: 400 });
    }
    recipients = [{ email: testEmail, first_name: adminProfile?.first_name ?? null }];
  } else {
    const { data: rsvps, error: rsvpError } = await admin.from("rsvps").select("user_id").eq("attending", true);
    if (rsvpError) return NextResponse.json({ error: rsvpError.message }, { status: 400 });

    const attendeeIds = (rsvps ?? []).map((r) => r.user_id);
    if (attendeeIds.length === 0) {
      return NextResponse.json({ error: "No attending guests found" }, { status: 400 });
    }

    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id,email,first_name")
      .in("id", attendeeIds);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    recipients = (profiles ?? [])
      .filter((p) => p.email)
      .map((p) => ({ email: p.email!, first_name: p.first_name }));

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No attendee emails found" }, { status: 400 });
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const title = process.env.EVENT_TITLE || "Student Celebration";
  const attachmentBuffer = Buffer.from(await attachment.arrayBuffer());
  const attachmentBase64 = attachmentBuffer.toString("base64");
  const attachmentFilename = attachment.name || "celebration-photo.jpg";
  const subjectPrefix = isTest ? "[TEST] " : "";

  const failed: { email: string; error: string }[] = [];
  let sent = 0;

  for (const recipient of recipients) {
    const html = buildHtml({
      firstName: recipient.first_name,
      siteUrl,
      customMessage
    });

    const result = await resend.emails.send({
      from: "Malins Studentfirande <invite@hillerdal.com>",
      replyTo: "mikael.hillerdal@gmail.com",
      to: [recipient.email],
      subject: `${subjectPrefix}Thank you for celebrating with Malin – ${title}`,
      html,
      attachments: [{ filename: attachmentFilename, content: attachmentBase64 }]
    });

    if (result.error) {
      failed.push({ email: recipient.email, error: result.error.message });
    } else {
      sent += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, failed, total: recipients.length, test: isTest });
}
