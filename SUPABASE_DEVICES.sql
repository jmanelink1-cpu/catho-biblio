-- ═══════════════════════════════════════════════════════════════
--  CATHO BIBLIO — Limite de 2 appareils par compte
--  Supabase → SQL Editor → coller → Run
--  Nécessite public.is_admin() (SUPABASE_FIX_RLS.sql).
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.user_devices (
  user_id    uuid not null references auth.users(id) on delete cascade,
  device_id  text not null,
  label      text,
  last_seen  timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, device_id)
);

alter table public.user_devices enable row level security;

drop policy if exists user_devices_select on public.user_devices;
drop policy if exists user_devices_delete on public.user_devices;
drop policy if exists user_devices_admin  on public.user_devices;

-- L'utilisateur voit et peut retirer ses propres appareils (self-service)
create policy user_devices_select on public.user_devices for select using (user_id = auth.uid());
create policy user_devices_delete on public.user_devices for delete using (user_id = auth.uid());
-- L'admin peut tout gérer (réinitialiser les appareils d'un compte)
create policy user_devices_admin  on public.user_devices for all using (public.is_admin()) with check (public.is_admin());

-- Revendication atomique d'un appareil : 'ok' (autorisé) ou 'limit' (refusé).
-- L'insertion ne passe que par cette fonction → la limite ne peut être contournée.
create or replace function public.claim_device(p_device_id text, p_label text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  cnt int;
begin
  if uid is null then return 'ok'; end if;

  -- Appareil déjà connu → on rafraîchit et on autorise
  if exists (select 1 from public.user_devices where user_id = uid and device_id = p_device_id) then
    update public.user_devices set last_seen = now(), label = coalesce(p_label, label)
      where user_id = uid and device_id = p_device_id;
    return 'ok';
  end if;

  select count(*) into cnt from public.user_devices where user_id = uid;
  if cnt >= 2 then
    return 'limit';
  end if;

  insert into public.user_devices (user_id, device_id, label) values (uid, p_device_id, p_label);
  return 'ok';
end $$;

grant execute on function public.claim_device(text, text) to authenticated;

select 'Limite de 2 appareils activée ✔' as resultat;
