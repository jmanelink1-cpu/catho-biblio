import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalBooks    },
    { count: totalUsers    },
    { count: activeUsers   },
    { data:  payments      },
  ] = await Promise.all([
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('has_access', true),
    supabase.from('payments').select('amount').eq('status', 'completed'),
  ])

  const revenue = (payments ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0)

  const stats = [
    { icon: '📚', label: 'Livres',              value: totalBooks  ?? 0,  color: 'var(--color-brand-soft)',  text: 'var(--color-brand)' },
    { icon: '👤', label: 'Utilisateurs',         value: totalUsers  ?? 0,  color: '#F0FDF4',                  text: '#16A34A' },
    { icon: '✅', label: 'Abonnements actifs',   value: activeUsers ?? 0,  color: '#F5F3FF',                  text: '#7C3AED' },
    { icon: '💰', label: 'Revenus (FCFA)',        value: revenue.toLocaleString('fr-FR'), color: 'var(--color-gold-soft)', text: 'var(--color-gold)' },
  ]

  return (
    <div>
      <div className="h-14 flex items-center px-6 border-b"
           style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h1 className="font-bold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
          Tableau de bord
        </h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border p-5 flex items-start gap-4"
                 style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                   style={{ background: s.color, color: s.text }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-none mb-1"
                     style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6"
               style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
              Accès rapides
            </h3>
            <div className="space-y-2">
              {[
                ['/admin/books',    '📚', 'Gérer les livres',       'Ajouter, modifier, supprimer des livres'],
                ['/admin/users',    '👤', 'Gérer les utilisateurs', 'Voir et gérer les accès'],
                ['/admin/payments', '💳', 'Voir les paiements',     'Valider les paiements en attente'],
              ].map(([href, icon, title, desc]) => (
                <a key={href} href={href}
                   className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-x-0.5 border"
                   style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{title}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-6"
               style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
              Configuration requise
            </h3>
            <div className="space-y-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              <div className="flex items-start gap-2">
                <span>1.</span>
                <span>Remplissez le fichier <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-subtle)' }}>.env.local</code> avec vos clés Supabase</span>
              </div>
              <div className="flex items-start gap-2">
                <span>2.</span>
                <span>Exécutez le script <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-subtle)' }}>SUPABASE_SETUP.sql</code> dans Supabase</span>
              </div>
              <div className="flex items-start gap-2">
                <span>3.</span>
                <span>Ajoutez vos livres via <a href="/admin/books" className="font-semibold" style={{ color: 'var(--color-brand)' }}>Gérer les livres</a></span>
              </div>
              <div className="flex items-start gap-2">
                <span>4.</span>
                <span>Connectez votre API de paiement dans <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-subtle)' }}>app/pricing/PricingClient.tsx</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
