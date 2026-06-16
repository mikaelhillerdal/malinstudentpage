import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { AlbumGallery } from "./ui";

export type AlbumPhoto = {
  id: string;
  user_id: string;
  storage_path: string;
  original_filename: string;
  caption: string | null;
  created_at: string;
  uploader_name: string;
  image_url: string;
  download_url: string;
};

export default async function AlbumPage() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const [{ data: photos }, { data: profile }] = await Promise.all([
    supabase
      .from("album_photos")
      .select("id,user_id,storage_path,original_filename,caption,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()
  ]);

  const userIds = [...new Set((photos ?? []).map((p) => p.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id,first_name,last_name").in("id", userIds)
    : { data: [] as { id: string; first_name: string | null; last_name: string | null }[] };

  const nameById = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      [p.first_name, p.last_name].filter(Boolean).join(" ") || "Guest"
    ])
  );

  const admin = createSupabaseAdmin();
  const signed = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data: view } = await admin.storage.from("album").createSignedUrl(photo.storage_path, 3600);
      const { data: download } = await admin.storage
        .from("album")
        .createSignedUrl(photo.storage_path, 3600, { download: photo.original_filename });
      return {
        ...photo,
        uploader_name: nameById.get(photo.user_id) ?? "Guest",
        image_url: view?.signedUrl ?? "",
        download_url: download?.signedUrl ?? view?.signedUrl ?? ""
      };
    })
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Photo album</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Browse, upload, and download photos from the celebration. Only members can access this page.
        </p>
      </div>

      <AlbumGallery
        initialPhotos={signed}
        currentUserId={user.id}
        isAdmin={Boolean(profile?.is_admin)}
      />
    </div>
  );
}
