'use client'

import dynamic from 'next/dynamic'
import type { Book, Profile } from '@/lib/types'

// Render the library entirely on the client — avoids any server-side
// rendering crash and is ideal for an interactive, auth-gated app.
const LibraryClient = dynamic(() => import('./LibraryClient'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: 'var(--color-muted)' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid rgba(109,40,217,.18)', borderTopColor: '#6D28D9', animation: 'spin .7s linear infinite' }} />
        <span style={{ fontSize: '.88rem' }}>Ouverture de votre bibliothèque…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  ),
})

interface Props { books: Book[]; profile: Profile; userEmail: string; isDemo?: boolean }

export default function LibraryShell(props: Props) {
  return <LibraryClient {...props} />
}
