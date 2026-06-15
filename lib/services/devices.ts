import { db } from './client'

const KEY = 'cb_device_id'

/** Identifiant d'appareil stable, stocké localement (par navigateur/appareil). */
function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    localStorage.setItem(KEY, id)
  }
  return id
}

/** Libellé lisible de l'appareil (navigateur · système), à titre indicatif. */
function deviceLabel(): string {
  if (typeof navigator === 'undefined') return 'Appareil'
  const ua = navigator.userAgent
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iPhone / iPad'
    : /Android/.test(ua) ? 'Android'
    : /Windows/.test(ua) ? 'Windows'
    : /Mac OS/.test(ua) ? 'Mac'
    : /Linux/.test(ua) ? 'Linux' : 'Appareil'
  const br = /Edg/.test(ua) ? 'Edge'
    : /OPR|Opera/.test(ua) ? 'Opera'
    : /Chrome/.test(ua) ? 'Chrome'
    : /Firefox/.test(ua) ? 'Firefox'
    : /Safari/.test(ua) ? 'Safari' : 'Navigateur'
  return `${br} · ${os}`
}

export type UserDevice = { device_id: string; label: string | null; last_seen: string; created_at: string }

export const devicesService = {
  current: () => getDeviceId(),

  /** Revendique l'appareil courant : 'ok' (autorisé) ou 'limit' (3e appareil refusé). */
  claim: async (): Promise<'ok' | 'limit'> => {
    const id = getDeviceId()
    if (!id) return 'ok'
    const { data, error } = await db().rpc('claim_device', { p_device_id: id, p_label: deviceLabel() })
    if (error) return 'ok' // en cas d'erreur réseau, ne pas bloquer un client légitime
    return data === 'limit' ? 'limit' : 'ok'
  },

  list: async (): Promise<UserDevice[]> => {
    const { data } = await db().from('user_devices')
      .select('device_id, label, last_seen, created_at')
      .order('last_seen', { ascending: false })
    return (data ?? []) as UserDevice[]
  },

  remove: (deviceId: string) => db().from('user_devices').delete().eq('device_id', deviceId),
}
