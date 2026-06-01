import LibraryClient from '../library/LibraryClient'
import { DEMO_BOOKS } from '@/lib/demoBooks'
import type { Profile } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Public, login-free preview of the library (demo catalogue only).
const guestProfile: Profile = {
  id: 'guest', email: 'invite@catho-biblio.com', full_name: 'Invité',
  has_access: true, access_type: 'lifetime', access_expires_at: null, is_admin: false, created_at: '2026-01-01',
}

export default function ApercuPage() {
  return <LibraryClient books={DEMO_BOOKS} profile={guestProfile} userEmail={guestProfile.email!} isDemo />
}
