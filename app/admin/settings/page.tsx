import { getSettings } from '@/lib/settings'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const { price, currency } = await getSettings()
  return <SettingsClient initialPrice={price} initialCurrency={currency} />
}
