-- ═══════════════════════════════════════════════════════════════
--  CATHO BIBLIO — Correctif RLS (récursion infinie sur "profiles")
--  À coller dans Supabase → SQL Editor → Run  (une seule fois)
--
--  Problème : une policy de "profiles" interrogeait "profiles"
--  (vérif is_admin), provoquant une récursion infinie. La requête
--  "books" en dépendait → la bibliothèque retombait sur les livres
--  de démonstration au lieu d'afficher les vrais livres.
-- ═══════════════════════════════════════════════════════════════

-- 1) Fonction d'admin SÉCURISÉE (SECURITY DEFINER = ignore la RLS
--    en interne → plus de récursion possible)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- 2) PROFILES : on supprime TOUTES les anciennes policies puis on
--    recrée des policies simples et non récursives.
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_admin_select_all"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_admin_update_all"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- 3) BOOKS : le catalogue (métadonnées) est visible par tous ;
--    seules les écritures sont réservées aux admins. Plus aucun
--    sous-test vers "profiles" dans la lecture → plus de récursion.
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'books'
  loop
    execute format('drop policy if exists %I on public.books', pol.policyname);
  end loop;
end $$;

alter table public.books enable row level security;

create policy "books_select_all"
  on public.books for select
  using (true);

create policy "books_admin_write"
  on public.books for all
  using (public.is_admin())
  with check (public.is_admin());

-- 4) Vérification : combien de livres en base ?
select count(*) as total_livres from public.books;
