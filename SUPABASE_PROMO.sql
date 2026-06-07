-- Table des codes promo (réductions). À coller dans Supabase → SQL Editor → Run.
-- Nécessite la fonction public.is_admin() (créée par SUPABASE_FIX_RLS.sql).

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent int not null default 0 check (discount_percent between 0 and 100),
  max_uses int,
  uses int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

drop policy if exists "promo_admin_all"   on public.promo_codes;
drop policy if exists "promo_read_active"  on public.promo_codes;

-- Les admins gèrent tout (créer / modifier / supprimer / lister)
create policy "promo_admin_all" on public.promo_codes
  for all using (public.is_admin()) with check (public.is_admin());

-- SÉCURITÉ : on NE PERMET PAS de lister les codes (sinon un visiteur
-- récupère tous les codes via l'API publique). On valide un code précis
-- via une fonction SECURITY DEFINER, qui ne révèle jamais la liste.
create or replace function public.validate_promo(p_code text)
returns table(discount_percent int)
language sql
security definer
set search_path = public
as $$
  select discount_percent
  from public.promo_codes
  where code = upper(p_code)
    and active = true
    and (max_uses is null or uses < max_uses);
$$;

grant execute on function public.validate_promo(text) to anon, authenticated;
