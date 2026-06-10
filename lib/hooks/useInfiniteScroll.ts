'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Affiche une liste par lots et charge la suite au défilement (IntersectionObserver).
 * Se réinitialise quand `resetKey` change (ex. catégorie/recherche).
 */
export function useInfiniteScroll<T>(items: T[], pageSize = 24, resetKey: unknown = null) {
  const [visible, setVisible] = useState(pageSize)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { setVisible(pageSize) }, [resetKey, pageSize])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(v => Math.min(v + pageSize, items.length)) },
      { rootMargin: '800px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [items.length, visible, pageSize])

  const shown = useMemo(() => items.slice(0, visible), [items, visible])
  const hasMore = visible < items.length

  return { shown, hasMore, sentinelRef }
}
