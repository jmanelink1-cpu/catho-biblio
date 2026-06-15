import { db } from './client'

/** Gestion des utilisateurs (admin). Toute la logique DB des profils vit ici. */
export const usersService = {
  setAccess:     (id: string, has_access: boolean) =>
    db().from('profiles').update({ has_access }).eq('id', id),

  grantLifetime: (id: string) =>
    db().from('profiles').update({ has_access: true, access_type: 'lifetime', access_expires_at: null }).eq('id', id),

  setBanned:     (id: string, banned: boolean) =>
    db().from('profiles').update(banned ? { banned: true, has_access: false } : { banned: false }).eq('id', id),

  remove:        (id: string) =>
    db().from('profiles').delete().eq('id', id),

  /** Réinitialise les appareils enregistrés d'un compte (libère les 2 créneaux). */
  resetDevices:  (id: string) =>
    db().from('user_devices').delete().eq('user_id', id),
}
