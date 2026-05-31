export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import ReaderClient from './ReaderClient'

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen" style={{ background: '#1a1a2e' }}>
        <div className="text-white/60">Ouverture du livre...</div>
      </div>
    }>
      <ReaderClient />
    </Suspense>
  )
}
