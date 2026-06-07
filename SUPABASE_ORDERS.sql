-- Table des commandes / informations clients collectées avant paiement.
-- À coller dans Supabase → SQL Editor → Run.
-- Nécessite la fonction public.is_admin() (créée par SUPABASE_FIX_RLS.sql).

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name  text not null check (char_length(last_name)  between 1 and 80),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 160),
  country    text          check (country is null or char_length(country) <= 60),
  amount     int  not null default 10300,
  promo_code text          check (promo_code is null or char_length(promo_code) <= 40),
  status     text not null default 'pending',   -- pending | paid | cancelled
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_admin_all"     on public.orders;

-- N'importe quel visiteur peut créer une commande (avant paiement)
create policy "orders_public_insert" on public.orders
  for insert with check (true);

-- Les admins voient et gèrent toutes les commandes
create policy "orders_admin_all" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- SÉCURITÉ : ne pas faire confiance au montant/statut envoyés par le client.
-- Ces colonnes prennent leur valeur par défaut côté serveur.
revoke insert (amount, status) on public.orders from anon, authenticated;
