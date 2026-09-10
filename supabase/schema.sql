-- SOBIMON / samfinace Supabase schema
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '소비마스터',
  level integer not null default 1 check (level >= 1),
  title text,
  exp integer not null default 0 check (exp >= 0),
  max_exp integer not null default 100 check (max_exp > 0),
  coins integer not null default 0 check (coins >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_key text not null check (month_key ~ '^\\d{4}-\\d{2}$'),
  total_income numeric(14,2) not null default 0,
  fixed_expenses numeric(14,2) not null default 0,
  monthly_budget numeric(14,2) not null default 0,
  target_savings numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_key)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  date date not null default current_date,
  time time not null default '12:00:00',
  type text not null default 'expense' check (type in ('expense', 'income')),
  category text not null default '기타',
  amount numeric(14,2) not null default 0 check (amount >= 0),
  title text not null default '지출',
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create index if not exists transactions_user_date_idx on public.transactions(user_id, date desc, time desc);

create table if not exists public.user_sobimons (
  user_id uuid not null references auth.users(id) on delete cascade,
  sobimon_id text not null,
  discovered boolean not null default false,
  level integer not null default 1 check (level >= 1),
  unlocked_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, sobimon_id)
);

create table if not exists public.user_quests (
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  current_amount numeric(14,2) not null default 0,
  status text not null default 'progress',
  updated_at timestamptz not null default now(),
  primary key (user_id, quest_id)
);

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;
alter table public.user_sobimons enable row level security;
alter table public.user_quests enable row level security;

-- Re-runnable owner-only policies.
do $$
declare
  t text;
begin
  foreach t in array array['profiles','budgets','transactions','user_sobimons','user_quests'] loop
    execute format('drop policy if exists "owner_select" on public.%I', t);
    execute format('drop policy if exists "owner_insert" on public.%I', t);
    execute format('drop policy if exists "owner_update" on public.%I', t);
    execute format('drop policy if exists "owner_delete" on public.%I', t);
  end loop;
end $$;

create policy "owner_select" on public.profiles for select using (auth.uid() = id);
create policy "owner_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "owner_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "owner_delete" on public.profiles for delete using (auth.uid() = id);

create policy "owner_select" on public.budgets for select using (auth.uid() = user_id);
create policy "owner_insert" on public.budgets for insert with check (auth.uid() = user_id);
create policy "owner_update" on public.budgets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_delete" on public.budgets for delete using (auth.uid() = user_id);

create policy "owner_select" on public.transactions for select using (auth.uid() = user_id);
create policy "owner_insert" on public.transactions for insert with check (auth.uid() = user_id);
create policy "owner_update" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_delete" on public.transactions for delete using (auth.uid() = user_id);

create policy "owner_select" on public.user_sobimons for select using (auth.uid() = user_id);
create policy "owner_insert" on public.user_sobimons for insert with check (auth.uid() = user_id);
create policy "owner_update" on public.user_sobimons for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_delete" on public.user_sobimons for delete using (auth.uid() = user_id);

create policy "owner_select" on public.user_quests for select using (auth.uid() = user_id);
create policy "owner_insert" on public.user_quests for insert with check (auth.uid() = user_id);
create policy "owner_update" on public.user_quests for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner_delete" on public.user_quests for delete using (auth.uid() = user_id);
