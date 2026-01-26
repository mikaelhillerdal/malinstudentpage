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

create policy "profiles_read_own_or_admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own_or_admin"
on public.profiles for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_insert_own_or_admin"
on public.profiles for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "rsvps_read_own_or_admin"
on public.rsvps for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "rsvps_upsert_own_or_admin"
on public.rsvps for insert
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "rsvps_update_own_or_admin"
on public.rsvps for update
using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));
