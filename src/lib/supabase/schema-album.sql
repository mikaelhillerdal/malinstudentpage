-- Album migration only — run this if profiles/rsvps already exist.
-- Safe to re-run (drops and recreates album policies).

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  caption text,
  created_at timestamptz default now()
);

alter table public.album_photos enable row level security;

drop policy if exists "album_photos_read_authenticated" on public.album_photos;
create policy "album_photos_read_authenticated"
on public.album_photos for select
to authenticated
using (true);

drop policy if exists "album_photos_insert_own" on public.album_photos;
create policy "album_photos_insert_own"
on public.album_photos for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "album_photos_delete_own_or_admin" on public.album_photos;
create policy "album_photos_delete_own_or_admin"
on public.album_photos for delete
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('album', 'album', false)
on conflict (id) do nothing;

drop policy if exists "album_storage_read_authenticated" on storage.objects;
create policy "album_storage_read_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'album');

drop policy if exists "album_storage_insert_own_folder" on storage.objects;
create policy "album_storage_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'album'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "album_storage_delete_own_or_admin" on storage.objects;
create policy "album_storage_delete_own_or_admin"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'album'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);
