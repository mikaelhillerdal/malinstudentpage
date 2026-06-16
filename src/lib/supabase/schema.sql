create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  first_name text,
  last_name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.rsvps (
  user_id uuid primary key references auth.users(id) on delete cascade,
  attending boolean default false,
  party_size int default 0,
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists rsvps_set_updated_at on public.rsvps;
create trigger rsvps_set_updated_at
before update on public.rsvps
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.rsvps enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$ language sql stable;

drop policy if exists "profiles_read_own_or_admin" on public.profiles;
create policy "profiles_read_own_or_admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
on public.profiles for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "rsvps_read_own_or_admin" on public.rsvps;
create policy "rsvps_read_own_or_admin"
on public.rsvps for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "rsvps_upsert_own_or_admin" on public.rsvps;
create policy "rsvps_upsert_own_or_admin"
on public.rsvps for insert
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "rsvps_update_own_or_admin" on public.rsvps;
create policy "rsvps_update_own_or_admin"
on public.rsvps for update
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

-- Photo album — for existing databases, run schema-album.sql instead of re-running this file.
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

-- Private storage bucket for album images
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
