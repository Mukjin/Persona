-- Persona platform schema (Supabase Postgres)
-- This assumes Supabase Auth is enabled (auth.users exists).

create extension if not exists "pgcrypto";

-- 1) Public users profile table (1:1 with auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- 2) Personas
create table if not exists public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  personality text not null,
  speech_style text not null,
  slug text not null unique,
  is_public boolean not null default true,
  creator_name text not null default '',
  avatar_emoji text,
  avatar_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists personas_user_id_idx on public.personas (user_id);
create index if not exists personas_slug_idx on public.personas (slug);

drop trigger if exists trg_personas_updated_at on public.personas;
create trigger trg_personas_updated_at
before update on public.personas
for each row execute function public.set_updated_at();

-- 3) Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  persona_id uuid not null references public.personas (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_user_id_idx on public.conversations (user_id);
create index if not exists conversations_persona_id_idx on public.conversations (persona_id);

drop trigger if exists trg_conversations_updated_at on public.conversations;
create trigger trg_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

-- 4) Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  model text,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);

-- Row Level Security
alter table public.users enable row level security;
alter table public.personas enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Policies: users can manage their own rows
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users for select
using (auth.uid() = id);

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
on public.users for insert
with check (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Personas policies
drop policy if exists "personas_select_own" on public.personas;
create policy "personas_select_own"
on public.personas for select
using (auth.uid() = user_id);

drop policy if exists "personas_select_public" on public.personas;
create policy "personas_select_public"
on public.personas for select
using (is_public = true);

drop policy if exists "personas_insert_own" on public.personas;
create policy "personas_insert_own"
on public.personas for insert
with check (auth.uid() = user_id);

drop policy if exists "personas_update_own" on public.personas;
create policy "personas_update_own"
on public.personas for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "personas_delete_own" on public.personas;
create policy "personas_delete_own"
on public.personas for delete
using (auth.uid() = user_id);

-- Conversations policies
drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own"
on public.conversations for select
using (auth.uid() = user_id);

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
on public.conversations for insert
with check (auth.uid() = user_id);

drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own"
on public.conversations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own"
on public.conversations for delete
using (auth.uid() = user_id);

-- Messages policies: user can access messages through their own conversations
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own"
on public.messages for select
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
on public.messages for insert
with check (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
);
