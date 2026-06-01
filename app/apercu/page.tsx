import LibraryShell from '../library/LibraryShell'
import { DEMO_BOOKS } from '@/lib/demoBooks'
import type { Profile } from '@/lib/types'

// Public, login-free preview of the library (demo catalogue only).
const guestProfile: Profile = {
  id: 'guest', email: 'invite@catho-biblio.com', full_name: 'Invité',
  has_access: true, access_type: 'lifetime', access_expires_at: null, is_admin: false, created_at: '2026-01-01',
}

export default function ApercuPage() {
  return <LibraryShell books={DEMO_BOOKS} profile={guestProfile} userEmail={guestProfile.email!} isDemo />
}
