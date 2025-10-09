create table if not exists public.semanas (
  id bigint generated always as identity primary key,
  titulo text not null,
  numero smallint not null unique,
  habilitada boolean not null default false,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.archivos (
  id bigint generated always as identity primary key,
  semana_id bigint references public.semanas(id) on delete cascade,
  nombre text not null,
  github_url text not null,
  fecha_subida timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists archivos_semana_id_idx on public.archivos (semana_id);

-- Ensure default 16 weeks
insert into public.semanas (numero, titulo, habilitada)
select series.numero, 'Semana ' || series.numero, false
from generate_series(1, 16) as series(numero)
where not exists (
  select 1 from public.semanas s where s.numero = series.numero
);

-- Enable Row Level Security
alter table public.semanas enable row level security;
alter table public.archivos enable row level security;

-- RLS policies for semanas
drop policy if exists "política seleccionar semanas" on public.semanas;
create policy "política seleccionar semanas"
  on public.semanas
  for select
  to public
  using (true);

drop policy if exists "política de insertar semanas" on public.semanas;
create policy "política de insertar semanas"
  on public.semanas
  for insert
  to authenticated
  with check (true);

drop policy if exists "política de actualizar semanas" on public.semanas;
create policy "política de actualizar semanas"
  on public.semanas
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "política para eliminar semanas" on public.semanas;
create policy "política para eliminar semanas"
  on public.semanas
  for delete
  to authenticated
  using (true);

-- RLS policies for archivos
drop policy if exists "política de seleccionar" on public.archivos;
create policy "política de seleccionar"
  on public.archivos
  for select
  to public
  using (true);

drop policy if exists "política de insertar" on public.archivos;
create policy "política de insertar"
  on public.archivos
  for insert
  to authenticated
  with check (true);

drop policy if exists "política de actualizacion" on public.archivos;
create policy "política de actualizacion"
  on public.archivos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "política para eliminar" on public.archivos;
create policy "política para eliminar"
  on public.archivos
  for delete
  to authenticated
  using (true);

