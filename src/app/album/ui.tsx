"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import type { AlbumPhoto } from "./page";

type Props = {
  initialPhotos: AlbumPhoto[];
  currentUserId: string;
  isAdmin: boolean;
};

export function AlbumGallery({ initialPhotos, currentUserId, isAdmin }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const countLabel = useMemo(() => `${photos.length} photo${photos.length === 1 ? "" : "s"}`, [photos.length]);

  async function uploadPhoto() {
    if (uploading || !file) return;
    setUploadStatus(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      if (caption.trim()) form.append("caption", caption.trim());

      const res = await fetch("/api/album/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setUploadStatus(data?.error ?? "Upload failed");
        return;
      }

      setFile(null);
      setCaption("");
      setUploadStatus("Photo uploaded.");
      router.refresh();
    } catch {
      setUploadStatus("Network error – try again");
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto(id: string) {
    if (deletingId) return;
    if (!confirm("Delete this photo?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/album/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error ?? "Delete failed");
        return;
      }
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      alert("Network error – try again");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Upload a photo</h2>
        <p className="mt-1 text-sm text-zinc-600">JPEG, PNG, or WebP up to 10 MB.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-2xl border px-4 py-3 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-zinc-100 file:px-3 file:py-2"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="rounded-2xl border px-4 py-3"
          />
        </div>

        <button
          onClick={uploadPhoto}
          disabled={uploading || !file}
          className="mt-4 rounded-2xl bg-zinc-900 px-5 py-3 text-white shadow-sm hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload photo"}
        </button>

        {uploadStatus ? <p className="mt-3 text-sm text-zinc-700">{uploadStatus}</p> : null}
      </div>

      <div className="rounded-3xl border p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <span className="text-sm text-zinc-500">{countLabel}</span>
        </div>

        {photos.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">No photos yet. Be the first to upload one.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => {
              const canDelete = isAdmin || photo.user_id === currentUserId;
              return (
                <article key={photo.id} className="overflow-hidden rounded-2xl border shadow-sm">
                  <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                    {photo.image_url ? (
                      <Image
                        src={photo.image_url}
                        alt={photo.caption || photo.original_filename}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-sm font-medium">{photo.caption || photo.original_filename}</p>
                    <p className="text-xs text-zinc-500">By {photo.uploader_name}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={photo.download_url}
                        download={photo.original_filename}
                        className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                      >
                        Download
                      </a>
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => deletePhoto(photo.id)}
                          disabled={deletingId === photo.id}
                          className="rounded-xl border px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {deletingId === photo.id ? "Deleting…" : "Delete"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
