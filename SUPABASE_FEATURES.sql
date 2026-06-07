-- ═══════════════════════════════════════════════════════════════
--  CATHO BIBLIO — Prix dynamique + gestion des utilisateurs
--  Supabase → SQL Editor → coller → Run
--  Nécessite public.is_admin() (SUPABASE_FIX_RLS.sql).
-- ═══════════════════════════════════════════════════════════════

-- 1) PARAMÈTRES (prix modifiable, répercuté partout) — table à 1 ligne
create table if not exists public.app_settings (
  id       int  primary key default 1,
  price    int  not null default 10300 check (price >= 0),
  currency text not null default 'FCFA',
  constraint app_settings_single_row check (id = 1)
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

alter table public.app_settings enable row level security;
drop policy if exists app_settings_read  on public.app_settings;
drop policy if exists app_settings_admin on public.app_settings;
-- Prix lisible par tous (affiché sur la vitrine publique)
create policy app_settings_read  on public.app_settings for select using (true);
-- Modifiable par les admins uniquement
create policy app_settings_admin on public.app_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- 2) GESTION DES UTILISATEURS — colonne "banned"
alter table public.profiles add column if not exists banned boolean not null default false;

-- 2b) Le trigger anti-escalade doit aussi figer "banned" pour les non-admins
create or replace function public.protect_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.is_admin          := old.is_admin;
    new.has_access        := old.has_access;
    new.access_type       := old.access_type;
    new.access_expires_at := old.access_expires_at;
    new.banned            := old.banned;
  end if;
  return new;
end $$;

-- 2c) Les admins peuvent SUPPRIMER un profil
drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles for delete using (public.is_admin());

select 'Fonctionnalités appliquées ✔' as resultat;
