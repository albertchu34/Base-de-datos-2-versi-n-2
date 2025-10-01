create table if not exists public.semanas (
  id bigint generated always as identity primary key,
  titulo text not null,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.archivos (
  id bigint generated always as identity primary key,
  semana_id bigint references public.semanas(id) on delete cascade,
  nombre text not null,
  drive_id text not null,
  fecha_subida timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists archivos_semana_id_idx on public.archivos (semana_id);


-- Enable Row Level Security
alter table public.semanas enable row level security;
alter table public.archivos enable row level security;

-- Replace the admin email below with the real administrator email registered in Supabase
-- Example: admin@upla.edu.pe
-- Read access for everyone (anon & authenticated)
drop policy if exists "Public read semanas" on public.semanas;
create policy "Public read semanas"
  on public.semanas
  for select
  using (true);

drop policy if exists "Public read archivos" on public.archivos;
create policy "Public read archivos"
  on public.archivos
  for select
  using (true);

-- Admin-only write access (insert, update, delete)
drop policy if exists "Admin manage semanas" on public.semanas;
create policy "Admin manage semanas"
  on public.semanas
  for all
  using (lower(coalesce(current_setting('request.jwt.claim.email', true), '')) = lower('admin@upla.edu.pe'))
  with check (lower(coalesce(current_setting('request.jwt.claim.email', true), '')) = lower('admin@upla.edu.pe'));

drop policy if exists "Admin manage archivos" on public.archivos;
create policy "Admin manage archivos"
  on public.archivos
  for all
  using (lower(coalesce(current_setting('request.jwt.claim.email', true), '')) = lower('admin@upla.edu.pe'))
  with check (lower(coalesce(current_setting('request.jwt.claim.email', true), '')) = lower('admin@upla.edu.pe'));

