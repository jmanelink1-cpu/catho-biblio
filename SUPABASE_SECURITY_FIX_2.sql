-- ═══════════════════════════════════════════════════════════════
--  CATHO BIBLIO — CORRECTIF SÉCURITÉ #2 (Section 4)
--  Supabase → SQL Editor → coller → Run
--  Garantit qu'un paiement ne peut être inséré que pour SOI-MÊME.
-- ═══════════════════════════════════════════════════════════════

-- On retire toute policy d'INSERT existante sur payments (sans toucher
-- aux policies de lecture/admin), puis on installe la version stricte.
do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'payments' and cmd = 'INSERT'
  loop
    execute format('drop policy if exists %I on public.payments', pol.policyname);
  end loop;
end $$;

create policy "payments_insert_own"
  on public.payments for insert
  to authenticated
  with check (user_id = auth.uid());

-- Note : s'il existe une policy "FOR ALL" permissive sur payments, vérifiez-la
-- (select policyname, cmd, qual, with_check from pg_policies where tablename='payments').

select 'Correctif #2 appliqué ✔' as resultat;
