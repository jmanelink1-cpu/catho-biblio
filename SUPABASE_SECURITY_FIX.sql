-- ═══════════════════════════════════════════════════════════════
--  CATHO BIBLIO — CORRECTIF DE SÉCURITÉ (à exécuter une fois)
--  Supabase → SQL Editor → coller → Run
--  Corrige : (1) le paywall (drive_file_id public) et
--            (2) l'élévation de privilèges (is_admin/has_access).
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- 1) PAYWALL : la table books (donc drive_file_id) ne doit être
--    lisible QUE par un utilisateur ayant payé (has_access) ou un admin.
--    La vitrine publique (/ et /apercu) utilise des données démo,
--    donc rien de public n'est cassé.
-- ─────────────────────────────────────────────────────────────
drop policy if exists "books_select_all" on public.books;
drop policy if exists "books_select_entitled" on public.books;

create policy "books_select_entitled"
  on public.books for select
  using (
    public.is_admin()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.has_access)
  );

-- (la policy d'écriture admin "books_admin_write" reste inchangée)

-- ─────────────────────────────────────────────────────────────
-- 2) ÉLÉVATION DE PRIVILÈGES : empêcher un utilisateur de modifier
--    lui-même is_admin / has_access / access_type. Un trigger fige
--    ces colonnes pour les non-admins (ils peuvent toujours changer
--    leur full_name). Seuls les admins peuvent les modifier.
-- ─────────────────────────────────────────────────────────────
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.is_admin          := old.is_admin;
    new.has_access        := old.has_access;
    new.access_type       := old.access_type;
    new.access_expires_at := old.access_expires_at;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Vérification
select 'Sécurité appliquée ✔' as resultat;
