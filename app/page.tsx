'use client'

import Link from 'next/link'
import { CATEGORIES, PLANS } from '@/lib/types'

const MOCK_BOOKS = [
  { emoji: '📖', title: 'La Bible de Jérusalem',          color: 'from-blue-100 to-blue-200' },
  { emoji: '🕊️', title: "Catéchisme de l'Église",         color: 'from-amber-100 to-yellow-200' },
  { emoji: '✝',  title: 'Vie des Saints',                  color: 'from-purple-100 to-purple-200' },
  { emoji: '🙏', title: 'Introduction à la Vie Dévote',   color: 'from-green-100 to-green-200' },
  { emoji: '⛪', title: 'Imitation de Jésus-Christ',      color: 'from-pink-100 to-pink-200' },
  { emoji: '📿', title: 'Le Rosaire Médité',               color: 'from-sky-100 to-sky-200' },
]

const FEATURES = [
  { icon: '📚', title: '500+ Livres Catholiques',   desc: 'Bible, Catéchisme, vies des saints, théologie, philosophie catholique, encycliques et bien plus.' },
  { icon: '📱', title: 'Tous vos Appareils',        desc: 'Lisez sur votre téléphone, tablette ou ordinateur. Votre bibliothèque vous suit partout.' },
  { icon: '🔍', title: 'Recherche Facile',          desc: "Trouvez rapidement n'importe quel livre par titre, auteur ou catégorie." },
  { icon: '🗂️', title: 'Catégories Organisées',    desc: 'Bible, Saints, Spiritualité, Théologie, Liturgie, Prière, Documents du Magistère.' },
  { icon: '⚡', title: 'Lecture Instantanée',       desc: 'Aucun téléchargement. Ouvrez et lisez directement dans votre navigateur.' },
  { icon: '✨', title: 'Nouveautés Régulières',     desc: 'De nouveaux livres ajoutés régulièrement pour enrichir votre collection.' },
]

const TESTIMONIALS = [
  { name: 'Jean-Pierre K.', role: 'Séminariste, Abidjan', initials: 'JP', text: "Je peux enfin lire la Bible de Jérusalem et le Catéchisme sur mon téléphone. C'est exactement ce dont j'avais besoin pour ma formation." },
  { name: 'Marie-Noëlle T.', role: 'Catéchiste, Dakar',   initials: 'MN', text: "En tant que catéchiste, j'ai accès à des dizaines de ressources pour préparer mes cours. La bibliothèque est une vraie bénédiction !" },
  { name: 'Père André M.',   role: 'Prêtre, Douala',       initials: 'PA', text: "Les livres de spiritualité sont remarquables. Je lis chaque matin avant ma prière. L'interface est très agréable." },
]

const FAQS = [
  { q: 'Comment accéder aux livres après paiement ?',        a: "Après confirmation de votre paiement, votre accès est activé immédiatement. Connectez-vous et accédez à toute la bibliothèque." },
  { q: 'Les livres sont-ils disponibles hors connexion ?',    a: "Pour le moment, la lecture nécessite une connexion internet. Les livres sont hébergés dans le cloud pour garantir la sécurité." },
  { q: 'Puis-je accéder depuis plusieurs appareils ?',        a: "Oui ! Votre abonnement vous permet de vous connecter depuis téléphone, tablette ou ordinateur avec le même compte." },
  { q: 'Quels formats de livres sont disponibles ?',          a: "Tous les livres sont au format PDF, lisibles directement dans votre navigateur sans installation." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6"
           style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2 font-extrabold text-lg" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
          <span style={{ color: 'var(--color-gold)' }}>✝</span> Catho Biblio
        </div>
        <div className="hidden md:flex items-center gap-6">
          {(['#fonctionnalites','#tarifs','#temoignages','#faq'] as const).map((href, i) => (
            <a key={href} href={href} className="text-sm font-medium transition-colors hover:text-[--color-brand]"
               style={{ color: 'var(--color-muted)' }}>
              {['Fonctionnalités','Tarifs','Témoignages','FAQ'][i]}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login"
                className="hidden md:inline-flex text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all"
                style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>
            Connexion
          </Link>
          <Link href="#tarifs"
                className="text-sm font-semibold px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
                style={{ background: 'var(--color-brand)' }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-20 px-6 text-center"
               style={{ background: 'linear-gradient(180deg,var(--color-brand-soft) 0%,var(--color-bg) 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
             style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)', border: '1px solid rgba(26,86,219,0.2)' }}>
          ✝ 500+ livres catholiques numériques
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold max-w-2xl mx-auto mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
          La <span style={{ color: 'var(--color-brand)' }}>bibliothèque catholique</span>{' '}
          dans votre poche
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Accédez à plus de 500 livres catholiques numériques — Bible, saints, théologie, spiritualité, prière —
          depuis n&apos;importe quel appareil, à tout moment.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
          <Link href="#tarifs"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-bold text-base transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--color-brand)', boxShadow: '0 4px 16px rgba(26,86,219,0.3)' }}>
            📚 Commencer maintenant
          </Link>
          <Link href="#fonctionnalites"
                className="px-7 py-3.5 rounded-full font-bold text-base border-2 transition-all hover:opacity-80"
                style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>
            Découvrir
          </Link>
        </div>

        {/* Mock library preview */}
        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl border"
             style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ background: 'var(--color-brand-dark)' }}>
            <div className="flex items-center gap-2 text-white font-bold text-sm"
                 style={{ fontFamily: 'var(--font-sora)' }}>
              <span style={{ color: 'var(--color-gold-light)' }}>✝</span> Catho Biblio
            </div>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>500+ livres</span>
          </div>
          <div className="flex gap-3 overflow-x-auto p-4" style={{ scrollbarWidth: 'none' }}>
            {MOCK_BOOKS.map((b, i) => (
              <div key={i} className="flex-shrink-0 w-24 rounded-xl overflow-hidden border"
                   style={{ borderColor: 'var(--color-border)' }}>
                <div className={`h-32 bg-gradient-to-br ${b.color} flex items-center justify-center text-3xl`}>{b.emoji}</div>
                <div className="px-2 py-2 text-xs font-semibold leading-snug" style={{ color: 'var(--color-ink-2)' }}>
                  {b.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 px-6" id="fonctionnalites">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-brand)' }}>Fonctionnalités</p>
          <h2 className="text-3xl font-extrabold text-center mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Tout ce qu&apos;il vous faut pour votre foi
          </h2>
          <p className="text-center mb-12 text-base" style={{ color: 'var(--color-muted)' }}>
            Une bibliothèque complète, accessible partout, conçue pour la lecture et la méditation spirituelle.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-7 rounded-2xl border transition-all hover:-translate-y-1"
                   style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                     style={{ background: 'var(--color-brand-soft)' }}>{f.icon}</div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 px-6" style={{ background: 'var(--color-subtle)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            10 catégories de livres
          </h2>
          <p className="mb-8" style={{ color: 'var(--color-muted)' }}>Trouvez exactement ce que vous cherchez.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(c => (
              <div key={c.value} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border"
                   style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink-2)' }}>
                {c.emoji} {c.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-20 px-6" id="tarifs">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-brand)' }}>Tarifs</p>
          <h2 className="text-3xl font-extrabold text-center mb-3" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Choisissez votre accès
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--color-muted)' }}>
            Un abonnement unique pour accéder à toute la bibliothèque.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
              const isFeatured = key === 'yearly'
              const isGold     = key === 'lifetime'
              return (
                <div key={key} className="relative p-8 rounded-2xl border-2 transition-all"
                     style={{
                       background: 'var(--color-surface)',
                       borderColor: isFeatured ? 'var(--color-brand)' : 'var(--color-border)',
                       boxShadow: isFeatured ? '0 8px 32px rgba(26,86,219,0.15)' : 'none',
                     }}>
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                         style={{ background: 'var(--color-brand)' }}>⭐ Plus populaire</div>
                  )}
                  <div className="font-bold mb-2" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>{plan.label}</div>
                  <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                    {plan.price.toLocaleString('fr-FR')}
                    <span className="text-base font-medium ml-1" style={{ color: 'var(--color-muted)' }}>
                      {plan.currency}{key !== 'lifetime' ? ` / ${key === 'yearly' ? 'an' : 'mois'}` : ' une fois'}
                    </span>
                  </div>
                  <ul className="mt-5 mb-7 space-y-2.5 border-t pt-5" style={{ borderColor: 'var(--color-border)' }}>
                    {['Accès à 500+ livres','Lecture illimitée','Tous les appareils','Nouveautés incluses'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                        <span className="font-bold" style={{ color: 'var(--color-brand)' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/auth/register?plan=${key}`}
                        className="flex w-full items-center justify-center py-3 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                        style={isFeatured
                          ? { background: 'var(--color-brand)', color: '#fff' }
                          : isGold
                          ? { background: 'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', color: '#fff' }
                          : { border: '2px solid var(--color-brand)', color: 'var(--color-brand)' }
                        }>
                    Commencer — {plan.label}
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>Moyens de paiement acceptés :</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['📱 MTN Mobile Money','📱 Orange Money','📱 Wave','📱 Moov Money','💳 Carte bancaire','🅿️ PayPal','🌍 CinetPay','🌍 Flutterwave'].map(m => (
                <span key={m} className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-6" id="temoignages" style={{ background: 'var(--color-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-brand)' }}>Témoignages</p>
          <h2 className="text-3xl font-extrabold text-center mb-12" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Ils utilisent Catho Biblio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border"
                   style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                <div className="text-amber-400 mb-3 text-lg">★★★★★</div>
                <p className="text-sm italic leading-relaxed mb-5" style={{ color: 'var(--color-muted)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                       style={{ background: 'var(--color-brand)' }}>{t.initials}</div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 px-6" id="faq">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-brand)' }}>FAQ</p>
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Questions fréquentes
          </h2>
          <div className="space-y-1">
            {FAQS.map((faq, i) => (
              <details key={i} className="border-b py-5 group" style={{ borderColor: 'var(--color-border)' }}>
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm [list-style:none]"
                         style={{ color: 'var(--color-ink)' }}>
                  {faq.q}
                  <span className="ml-4 text-xl transition-transform group-open:rotate-45 flex-shrink-0"
                        style={{ color: 'var(--color-brand)' }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 text-center"
               style={{ background: 'linear-gradient(135deg,var(--color-brand-dark),var(--color-brand))' }}>
        <div className="text-5xl mb-4">✝</div>
        <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: 'var(--font-sora)' }}>
          Rejoignez la bibliothèque catholique
        </h2>
        <p className="text-white/80 max-w-md mx-auto mb-8 leading-relaxed">
          500+ livres, lecture illimitée, tous vos appareils. À partir de 2 000 FCFA / mois.
        </p>
        <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          📚 Commencer maintenant
        </Link>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 pt-12 pb-6" style={{ background: 'var(--color-dark)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3"
                 style={{ fontFamily: 'var(--font-sora)' }}>
              <span style={{ color: 'var(--color-gold-light)' }}>✝</span> Catho Biblio
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              La bibliothèque catholique numérique pour toute l&apos;Afrique francophone.
            </p>
          </div>
          <div>
            <div className="text-white font-bold mb-4 text-sm">Liens</div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {[['#fonctionnalites','Fonctionnalités'],['#tarifs','Tarifs'],['/auth/login','Connexion'],['/auth/register','Inscription']].map(([h,l]) =>
                <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
              )}
            </div>
          </div>
          <div>
            <div className="text-white font-bold mb-4 text-sm">Support</div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="mailto:support@catho-biblio.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="border-t pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
             style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
          <span>© 2025 Catho Biblio. Tous droits réservés.</span>
          <span>🙏 Fait avec foi pour l&apos;Afrique catholique</span>
        </div>
      </footer>
    </div>
  )
}
