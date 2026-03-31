-- Add public persona sharing fields
alter table public.personas
  add column if not exists slug text,
  add column if not exists is_public boolean not null default true,
  add column if not exists creator_name text not null default '';

-- Backfill slug for existing rows (fallback to id string)
update public.personas
set slug = coalesce(slug, id::text)
where slug is null or slug = '';

-- Ensure uniqueness/non-null
alter table public.personas
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'personas_slug_idx'
  ) then
    create index personas_slug_idx on public.personas (slug);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'personas_slug_key'
  ) then
    alter table public.personas add constraint personas_slug_key unique (slug);
  end if;
end $$;

alter table public.personas enable row level security;

drop policy if exists "personas_select_public" on public.personas;
create policy "personas_select_public"
on public.personas for select
using (is_public = true);

