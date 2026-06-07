-- Suivi de lecture (barre de progression par livre). Supabase → SQL Editor → Run.

create table if not exists public.reading_progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  book_id    uuid not null,
  progress   int  not null default 0 check (progress between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

alter table public.reading_progress enable row level security;

drop policy if exists reading_select on public.reading_progress;
drop policy if exists reading_insert on public.reading_progress;
drop policy if exists reading_update on public.reading_progress;

-- Chaque utilisateur ne voit/modifie que SA propre progression
create policy reading_select on public.reading_progress for select using (user_id = auth.uid());
create policy reading_insert on public.reading_progress for insert with check (user_id = auth.uid());
create policy reading_update on public.reading_progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());

select 'Suivi de lecture activé ✔' as resultat;
