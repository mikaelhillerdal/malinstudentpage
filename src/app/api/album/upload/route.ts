export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  const captionRaw = form.get("caption");
  const caption = typeof captionRaw === "string" && captionRaw.trim() ? captionRaw.trim() : null;

  if (!(file instanceof File)) return NextResponse.json({ error: "File is required" }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 10 MB or smaller" }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  const photoId = crypto.randomUUID();
  const storagePath = `${userData.user.id}/${photoId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createSupabaseAdmin();
  const uploaded = await admin.storage.from("album").upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false
  });
  if (uploaded.error) {
    return NextResponse.json({ error: uploaded.error.message }, { status: 400 });
  }

  const { data: row, error } = await supabase
    .from("album_photos")
    .insert({
      id: photoId,
      user_id: userData.user.id,
      storage_path: storagePath,
      original_filename: file.name,
      caption
    })
    .select("id,user_id,storage_path,original_filename,caption,created_at")
    .single();

  if (error) {
    await admin.storage.from("album").remove([storagePath]);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, photo: row });
}
