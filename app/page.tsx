'use client'

import Link from 'next/link'
import { PLANS } from '@/lib/types'

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  Cross: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20"/>
    </svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  BookOpen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Smartphone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  CreditCard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Smartphone2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><polyline points="12 18 12.01 18"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
}

const FEATURES = [
  { Icon: Icon.Book,        title: '500+ Livres catholiques',    desc: 'Bible, Catéchisme, vies des saints, encycliques, théologie, spiritualité — toute la tradition catholique en français.' },
  { Icon: Icon.Smartphone,  title: 'Lecture sur tous vos appareils', desc: 'Téléphone, tablette, ordinateur — votre bibliothèque vous suit partout, à toute heure.' },
  { Icon: Icon.Search,      title: 'Retrouvez n\'importe quel livre', desc: 'Recherche par titre, auteur ou catégorie. Trouvez en secondes ce que vous cherchez parmi 500 ouvrages.' },
  { Icon: Icon.Layers,      title: '10 catégories organisées',   desc: 'Bible, Saints, Spiritualité, Théologie, Liturgie, Prière, Documents pontificaux et plus encore.' },
  { Icon: Icon.Zap,         title: 'Lecture instantanée',        desc: 'Aucune installation. Ouvrez un livre en un clic, directement dans votre navigateur.' },
  { Icon: Icon.RefreshCw,   title: 'Nouveaux livres chaque mois', desc: 'La bibliothèque s\'enrichit régulièrement. Vous êtes toujours au courant des dernières additions.' },
]

const PAIN_POINTS = [
  { Icon: Icon.X, text: 'Les livres catholiques de qualité sont introuvables ou très chers en Afrique' },
  { Icon: Icon.X, text: 'Les ressources en français sont rares — trop souvent en anglais ou non disponibles' },
  { Icon: Icon.X, text: 'Vous devez visiter plusieurs sites, acheter plusieurs livres séparément' },
  { Icon: Icon.X, text: 'Pas de bibliothèque numérique catholique centralisée et accessible en Afrique' },
]

const SOLUTIONS = [
  { Icon: Icon.Check, text: '500+ livres catholiques en français, en un seul endroit' },
  { Icon: Icon.Check, text: 'Accès immédiat dès votre inscription — aucune livraison, aucune attente' },
  { Icon: Icon.Check, text: 'Lisez depuis votre téléphone, tablette ou ordinateur, partout en Afrique' },
  { Icon: Icon.Check, text: 'Un abonnement abordable — moins cher qu\'un seul livre physique' },
]

const STATS = [
  { Icon: Icon.Book,  value: '500+',  label: 'Livres disponibles' },
  { Icon: Icon.Layers, value: '10',   label: 'Catégories' },
  { Icon: Icon.Globe, value: '24h/7', label: 'Accès permanent' },
  { Icon: Icon.Users, value: '100%',  label: 'Contenu catholique' },
]

const TESTIMONIALS = [
  { name: 'Jean-Pierre K.', role: 'Séminariste, Abidjan', initials: 'JP', text: 'Je peux enfin lire la Bible de Jérusalem et le Catéchisme sur mon téléphone. C\'est exactement ce dont j\'avais besoin pour ma formation.' },
  { name: 'Marie-Noëlle T.', role: 'Catéchiste, Dakar',   initials: 'MN', text: 'En tant que catéchiste, j\'ai accès à des dizaines de ressources pour préparer mes cours. La bibliothèque est une vraie bénédiction !' },
  { name: 'Père André M.',   role: 'Prêtre, Douala',       initials: 'PA', text: 'Les livres de spiritualité sont remarquables. Je lis chaque matin avant ma prière. L\'interface est très agréable et simple.' },
]

const FAQS = [
  { q: 'Comment accéder aux livres après mon paiement ?',     a: 'Votre accès est activé immédiatement après confirmation du paiement. Vous pouvez commencer à lire dans les minutes qui suivent.' },
  { q: 'Puis-je lire depuis plusieurs appareils ?',            a: 'Oui. Votre compte vous permet de vous connecter depuis votre téléphone, votre tablette et votre ordinateur simultanément.' },
  { q: 'Les livres sont-ils disponibles hors connexion ?',     a: 'Pour le moment, la lecture nécessite une connexion internet. Les livres sont sécurisés et hébergés dans le cloud.' },
  { q: 'Puis-je annuler à tout moment ?',                      a: 'L\'abonnement mensuel peut être arrêté à tout moment. L\'abonnement annuel et à vie ne sont pas remboursables une fois activés.' },
  { q: 'Quels moyens de paiement acceptez-vous ?',             a: 'MTN Mobile Money, Orange Money, Wave, Moov Money, Airtel Money, carte bancaire Visa/Mastercard, PayPal et CinetPay.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#fff', color: 'var(--color-ink)' }}>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6 md:px-10"
           style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'var(--color-brand)', color: '#fff' }}>
            <div className="w-4 h-4"><Icon.Cross /></div>
          </div>
          <span className="font-extrabold text-lg" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-brand)' }}>
            Catho Biblio
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['#fonctionnalites','Fonctionnalités'],['#tarifs','Tarifs'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} className="text-sm font-medium transition-colors hover:opacity-70"
               style={{ color: 'var(--color-muted)' }}>{l}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login"
                className="hidden md:inline-flex text-sm font-semibold px-4 py-2 rounded-full transition-all"
                style={{ color: 'var(--color-brand)' }}>
            Connexion
          </Link>
          <Link href="#tarifs"
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all hover:opacity-90"
                style={{ background: 'var(--color-brand)' }}>
            Accéder maintenant
            <div className="w-4 h-4"><Icon.ChevronRight /></div>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-28 pb-16 px-6 text-center"
               style={{ background: 'linear-gradient(180deg, #EBF2FF 0%, #F8FBFF 60%, #fff 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wide"
             style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)', border: '1px solid rgba(26,86,219,0.2)' }}>
          <div className="w-3.5 h-3.5"><Icon.Book /></div>
          500+ livres catholiques numériques en français
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-3xl mx-auto mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          La plus grande bibliothèque{' '}
          <span style={{ color: 'var(--color-brand)' }}>catholique numérique</span>{' '}
          d&apos;Afrique francophone
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Accédez instantanément à plus de 500 ouvrages catholiques — Bible, saints, théologie, spiritualité —
          depuis n&apos;importe quel appareil. À partir de <strong style={{ color: 'var(--color-ink)' }}>2 000 FCFA / mois</strong>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="#tarifs"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-base transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                style={{ background: 'var(--color-brand)', boxShadow: '0 6px 20px rgba(26,86,219,0.35)' }}>
            Accéder à ma bibliothèque
            <div className="w-5 h-5"><Icon.ArrowRight /></div>
          </Link>
          <a href="#fonctionnalites"
             className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border-2 transition-all w-full sm:w-auto justify-center hover:bg-blue-50"
             style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>
            Voir comment ça marche
          </a>
        </div>

        {/* Social proof bar */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-12">
          {[
            ['500+ livres disponibles'],
            ['10 catégories'],
            ['Accessible 24h/24'],
            ['Paiement sécurisé'],
          ].map(([t]) => (
            <div key={t} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
              <div className="w-4 h-4" style={{ color: 'var(--color-brand)' }}><Icon.Check /></div>
              {t}
            </div>
          ))}
        </div>

        {/* Mock preview */}
        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border"
             style={{ boxShadow: '0 20px 60px rgba(26,86,219,0.15)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-5 py-3.5"
               style={{ background: 'var(--color-brand-dark)' }}>
            <div className="flex items-center gap-2 text-white font-bold"
                 style={{ fontFamily: 'var(--font-sora)', fontSize: '0.9rem' }}>
              <div className="w-4 h-4 opacity-80"><Icon.Cross /></div>
              Catho Biblio
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <div className="w-3.5 h-3.5"><Icon.Book /></div>
              500+ livres
            </div>
          </div>
          <div className="p-4" style={{ background: 'var(--color-bg)' }}>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {[
                ['#EBF2FF','#93C5FD','La Bible de Jérusalem'],
                ['#FEF9C3','#FDE68A','Catéchisme de l\'Église'],
                ['#F3E8FF','#D8B4FE','Vie des Saints'],
                ['#DCFCE7','#86EFAC','Introduction à la Vie Dévote'],
                ['#FEE2E2','#FCA5A5','Imitation de Jésus-Christ'],
                ['#E0F2FE','#7DD3FC','Le Rosaire Médité'],
              ].map(([bg, border, title]) => (
                <div key={title} className="flex-shrink-0 w-24 rounded-xl overflow-hidden border"
                     style={{ borderColor: border }}>
                  <div className="h-32 flex items-center justify-center"
                       style={{ background: bg }}>
                    <div className="w-8 h-8" style={{ color: '#60A5FA' }}><Icon.BookOpen /></div>
                  </div>
                  <div className="px-2 py-2 text-xs font-semibold leading-snug"
                       style={{ color: 'var(--color-ink-2)', background: '#fff' }}>
                    {title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="py-10 px-6 border-y" style={{ borderColor: 'var(--color-border)', background: '#fff' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ Icon: Ic, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-5 h-5" style={{ color: 'var(--color-brand)' }}><Ic /></div>
                <span className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                  {value}
                </span>
              </div>
              <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Problem / Solution ─── */}
      <section className="py-20 px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#DC2626' }}>
              Le problème
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 leading-snug"
                style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
              Trouver de bons livres catholiques en Afrique est un vrai défi
            </h2>
            <div className="space-y-4">
              {PAIN_POINTS.map(({ Icon: Ic, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }}><Ic /></div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
              La solution
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 leading-snug"
                style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
              Catho Biblio centralise tout pour vous
            </h2>
            <div className="space-y-4">
              {SOLUTIONS.map(({ Icon: Ic, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#16A34A' }}><Ic /></div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{text}</p>
                </div>
              ))}
            </div>
            <Link href="#tarifs"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-full text-white font-bold text-sm"
                  style={{ background: 'var(--color-brand)' }}>
              Je veux accéder à la bibliothèque
              <div className="w-4 h-4"><Icon.ArrowRight /></div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-20 px-6" id="fonctionnalites">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3"
             style={{ color: 'var(--color-brand)' }}>
            Fonctionnalités
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Tout ce qu&apos;il vous faut pour nourrir votre foi
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            Une bibliothèque conçue pour les catholiques d&apos;Afrique — simple, accessible et complète.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ Icon: Ic, title, desc }) => (
              <div key={title} className="p-7 rounded-2xl border transition-all hover:-translate-y-1"
                   style={{ background: '#fff', borderColor: 'var(--color-border)', boxShadow: '0 2px 12px rgba(26,86,219,0.04)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}>
                  <div className="w-5 h-5"><Ic /></div>
                </div>
                <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3"
             style={{ color: 'var(--color-brand)' }}>
            Témoignages
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Ils ont transformé leur vie spirituelle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border"
                   style={{ background: '#fff', borderColor: 'var(--color-border)' }}>
                <div className="flex gap-0.5 mb-4" style={{ color: '#F59E0B' }}>
                  {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4"><Icon.Star /></div>)}
                </div>
                <p className="text-sm italic leading-relaxed mb-5" style={{ color: 'var(--color-muted)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                       style={{ background: 'var(--color-brand)' }}>
                    {t.initials}
                  </div>
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

      {/* ─── Pricing ─── */}
      <section className="py-20 px-6" id="tarifs">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3"
             style={{ color: 'var(--color-brand)' }}>
            Tarifs
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-3"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Choisissez votre accès
          </h2>
          <p className="text-center mb-12 max-w-lg mx-auto" style={{ color: 'var(--color-muted)' }}>
            Un abonnement unique. Accès immédiat à toute la bibliothèque.
            Moins cher qu&apos;un seul livre physique.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
              const isFeatured = key === 'yearly'
              const isGold     = key === 'lifetime'
              return (
                <div key={key} className="relative rounded-2xl border-2 overflow-hidden transition-all hover:-translate-y-1"
                     style={{
                       background: '#fff',
                       borderColor: isFeatured ? 'var(--color-brand)' : 'var(--color-border)',
                       boxShadow: isFeatured ? '0 12px 40px rgba(26,86,219,0.18)' : 'none',
                     }}>
                  {isFeatured && (
                    <div className="text-center py-2 text-xs font-bold tracking-wide text-white"
                         style={{ background: 'var(--color-brand)' }}>
                      RECOMMANDÉ — MEILLEURE VALEUR
                    </div>
                  )}
                  <div className="p-8">
                    <div className="font-bold mb-1 text-sm uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                      {plan.label}
                    </div>
                    <div className="text-4xl font-extrabold mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
                      {plan.price.toLocaleString('fr-FR')}
                      <span className="text-base font-medium ml-1" style={{ color: 'var(--color-muted)' }}>
                        {plan.currency}
                        {key !== 'lifetime' ? ` / ${key === 'yearly' ? 'an' : 'mois'}` : ''}
                      </span>
                    </div>
                    {key === 'yearly' && (
                      <div className="text-xs font-semibold mb-4" style={{ color: '#16A34A' }}>
                        Soit 1 250 FCFA/mois — économisez 38%
                      </div>
                    )}
                    {key === 'lifetime' && (
                      <div className="text-xs font-semibold mb-4" style={{ color: 'var(--color-gold)' }}>
                        Paiement unique — accès à vie garanti
                      </div>
                    )}
                    <hr style={{ borderColor: 'var(--color-border)', margin: '16px 0' }} />
                    <ul className="space-y-3 mb-8">
                      {[
                        'Accès à 500+ livres',
                        'Lecture illimitée',
                        'Tous vos appareils',
                        'Nouveaux livres inclus',
                        ...(key === 'yearly' ? ['Priorité sur les nouveautés'] : []),
                        ...(key === 'lifetime' ? ['Toutes les futures additions'] : []),
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-muted)' }}>
                          <div className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brand)' }}>
                            <Icon.Check />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/auth/register?plan=${key}`}
                          className="flex w-full items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5"
                          style={isFeatured
                            ? { background: 'var(--color-brand)', color: '#fff', boxShadow: '0 4px 14px rgba(26,86,219,0.3)' }
                            : isGold
                            ? { background: 'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', color: '#fff' }
                            : { border: '2px solid var(--color-brand)', color: 'var(--color-brand)' }
                          }>
                      Commencer ma lecture
                      <div className="w-4 h-4"><Icon.ArrowRight /></div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment methods */}
          <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-center text-xs font-semibold uppercase tracking-wider mb-4"
               style={{ color: 'var(--color-muted-2)' }}>
              Moyens de paiement acceptés
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'MTN Mobile Money', 'Orange Money', 'Wave', 'Moov Money',
                'Visa / Mastercard', 'PayPal', 'CinetPay', 'Flutterwave',
              ].map((name) => (
                <div key={name} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border"
                     style={{ background: '#fff', borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                  <div className="w-3.5 h-3.5" style={{ color: 'var(--color-brand)' }}>
                    {name.includes('Money') || name === 'Wave' ? <Icon.Smartphone2 /> : <Icon.Globe />}
                  </div>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Guarantee band ─── */}
      <section className="py-12 px-6" style={{ background: 'var(--color-brand-soft)' }}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'var(--color-brand)', color: '#fff' }}>
            <div className="w-7 h-7"><Icon.Shield /></div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
              Paiement 100% sécurisé
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Tous les paiements sont traités via des prestataires certifiés (CinetPay, Stripe, PayPal).
              Vos données bancaires ne sont jamais stockées sur nos serveurs.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 px-6" id="faq">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm font-bold uppercase tracking-widest mb-3"
             style={{ color: 'var(--color-brand)' }}>
            FAQ
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10"
              style={{ fontFamily: 'var(--font-sora)', color: 'var(--color-ink)' }}>
            Vos questions, nos réponses
          </h2>
          <div>
            {FAQS.map((faq) => (
              <details key={faq.q} className="border-b py-5 group" style={{ borderColor: 'var(--color-border)' }}>
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm [list-style:none]"
                         style={{ color: 'var(--color-ink)' }}>
                  {faq.q}
                  <span className="ml-4 flex-shrink-0 transition-transform group-open:rotate-45 text-xl font-light"
                        style={{ color: 'var(--color-brand)' }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand) 100%)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          <div className="w-8 h-8"><Icon.BookOpen /></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 max-w-xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-sora)' }}>
          Commencez à lire dès aujourd&apos;hui
        </h2>
        <p className="text-white/75 max-w-md mx-auto mb-8 text-lg leading-relaxed">
          Rejoignez des milliers de catholiques qui nourrissent leur foi chaque jour avec Catho Biblio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register"
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full font-bold text-base text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg,var(--color-gold),var(--color-gold-light))', boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
            Accéder à ma bibliothèque
            <div className="w-5 h-5"><Icon.ArrowRight /></div>
          </Link>
          <Link href="/auth/login" className="text-white/70 text-sm hover:text-white transition-colors font-medium">
            J&apos;ai déjà un compte — me connecter
          </Link>
        </div>
        <p className="text-white/50 text-xs mt-6">
          Accès immédiat après paiement · Annulation à tout moment · Support disponible
        </p>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 pt-12 pb-6" style={{ background: 'var(--color-dark)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <div className="w-4 h-4"><Icon.Cross /></div>
              </div>
              <span className="font-extrabold text-white" style={{ fontFamily: 'var(--font-sora)' }}>Catho Biblio</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              La bibliothèque catholique numérique pour toute l&apos;Afrique francophone.
            </p>
          </div>
          <div>
            <div className="text-white font-bold mb-4 text-sm">Navigation</div>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {[['#fonctionnalites','Fonctionnalités'],['#tarifs','Tarifs'],['#faq','FAQ'],['/auth/login','Connexion'],['/auth/register','Inscription']].map(([h,l]) => (
                <a key={h} href={h} className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white font-bold mb-4 text-sm">Contact</div>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <a href="mailto:support@catho-biblio.com" className="hover:text-white transition-colors">
                support@catho-biblio.com
              </a>
            </div>
          </div>
        </div>
        <div className="border-t pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
             style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
          <span>© 2025 Catho Biblio. Tous droits réservés.</span>
          <span>Fait avec foi pour l&apos;Afrique catholique</span>
        </div>
      </footer>
    </div>
  )
}
