import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora  = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400','500','600','700','800'] })

export const metadata: Metadata = {
  title: 'Catho Biblio — Bibliothèque Catholique Numérique',
  description: '500+ livres catholiques numériques : Bible, saints, spiritualité, théologie. Accès illimité depuis tous vos appareils.',
  keywords: ['catholique', 'livres', 'bibliothèque', 'Bible', 'saints', 'spiritualité', 'Afrique'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
