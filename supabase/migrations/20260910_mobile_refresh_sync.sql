-- Apply this when an older SOBIMON Supabase database already exists.
alter table public.transactions add column if not exists client_id text;
alter table public.transactions add column if not exists updated_at timestamptz not null default now();
alter table public.user_sobimons add column if not exists updated_at timestamptz not null default now();

-- Backfill a stable client id for old rows before making it required.
update public.transactions
set client_id = coalesce(client_id, id::text)
where client_id is null;

alter table public.transactions alter column client_id set not null;

create unique index if not exists transactions_user_client_uidx
  on public.transactions(user_id, client_id);
create index if not exists transactions_user_date_idx
  on public.transactions(user_id, date desc, time desc);

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;
alter table public.user_sobimons enable row level security;
alter table public.user_quests enable row level security;
