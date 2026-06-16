export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();

  const { data: photo, error: fetchError } = await supabase
    .from("album_photos")
    .select("id,user_id,storage_path")
    .eq("id", params.id)
    .maybeSingle();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });
  if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });

  const isOwner = photo.user_id === userData.user.id;
  const isAdmin = Boolean(me?.is_admin);
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const admin = createSupabaseAdmin();
  const removed = await admin.storage.from("album").remove([photo.storage_path]);
  if (removed.error) return NextResponse.json({ error: removed.error.message }, { status: 400 });

  const { error: deleteError } = await supabase.from("album_photos").delete().eq("id", photo.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
