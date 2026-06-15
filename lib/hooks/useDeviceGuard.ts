'use client'

import { useEffect, useState } from 'react'
import { devicesService } from '@/lib/services/devices'

export type DeviceState = 'checking' | 'allowed' | 'limit'

/**
 * Revendique l'appareil courant au montage et renvoie l'état d'accès.
 * `enabled = false` (admin, aperçu démo) → toujours autorisé, sans contrôle.
 */
export function useDeviceGuard(enabled: boolean): DeviceState {
  const [state, setState] = useState<DeviceState>(enabled ? 'checking' : 'allowed')

  useEffect(() => {
    if (!enabled) { setState('allowed'); return }
    let active = true
    devicesService.claim()
      .then(r => { if (active) setState(r === 'limit' ? 'limit' : 'allowed') })
      .catch(() => { if (active) setState('allowed') })
    return () => { active = false }
  }, [enabled])

  return state
}
