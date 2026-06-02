'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SINGLE_PLAN } from '@/lib/types'
import DesignedCover from './library/DesignedCover'

/* ════════════════════════════════════════════════════════════
   PALETTE — Plum liturgique · Or antique · Ivoire
════════════════════════════════════════════════════════════ */
const PLUM   = '#190A2E'   // deep dark
const PLUM2  = '#2A1248'
const VIO    = '#7C3AED'
const VIO_DK = '#6D28D9'
const GOLD   = '#C99A3B'
const GOLD_L = '#E3BE6E'
const IVORY  = '#FBF8F3'
const INK    = '#1A1326'
const MUTE   = '#6B6478'

const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`
const IMG = {
  stainedGlass: u('1438032005730-c779502df39b'),
  cathedral:    u('1473177104440-ffee2f376098'),
  pews:         u('1519491050282-cf00c82424b4'),
  prayer:       u('1499209974431-9dddcece7f88'),
}

/* ── Icons ── */
const I = {
  Cross:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>,
  Book:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Open:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Arrow:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Chev:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Down:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Star:    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Lock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Inf:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>,
  Phone:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Card:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Devices: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="14" height="11" rx="1.5"/><path d="M2 18h14"/><rect x="17.5" y="9" width="5" height="11" rx="1.2"/></svg>,
  DL:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Layers:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Quote:   () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4c0 3-1.5 5-4 6V14H4V7h3zm9 0h4v4c0 3-1.5 5-4 6V14h-3V7h3z" opacity=".9"/></svg>,
}

const SHOWCASE: { label: string; category: string; books: { title: string; author: string }[] }[] = [
  { label: 'Bible & Écriture Sainte', category: 'bible', books: [
    { title: 'La Bible de Jérusalem', author: 'École Biblique' },
    { title: 'La Bible de la Liturgie', author: 'AELF' },
    { title: 'Les Psaumes', author: 'Roi David' },
    { title: 'Le Nouveau Testament', author: 'Traduction officielle' },
    { title: 'Évangile selon Saint Jean', author: 'Saint Jean' },
    { title: 'Concordance Biblique', author: 'Collectif' },
  ]},
  { label: 'Saints & Témoins de la Foi', category: 'saints', books: [
    { title: 'Histoire d\'une Âme', author: 'Ste Thérèse de Lisieux' },
    { title: 'Vie des Saints', author: 'Jacques de Voragine' },
    { title: 'Le Curé d\'Ars', author: 'St Jean-Marie Vianney' },
    { title: 'Saint François d\'Assise', author: 'G.K. Chesterton' },
    { title: 'Padre Pio', author: 'Biographie' },
    { title: 'Petit Journal', author: 'Ste Faustine' },
  ]},
  { label: 'Spiritualité & Vie Intérieure', category: 'spiritualite', books: [
    { title: 'L\'Imitation de Jésus-Christ', author: 'Thomas a Kempis' },
    { title: 'Introduction à la Vie Dévote', author: 'St François de Sales' },
    { title: 'Le Château Intérieur', author: 'Ste Thérèse d\'Avila' },
    { title: 'Le Combat Spirituel', author: 'Lorenzo Scupoli' },
    { title: 'L\'Abandon à la Providence', author: 'J.-P. de Caussade' },
    { title: 'La Montée du Carmel', author: 'St Jean de la Croix' },
  ]},
  { label: 'Théologie & Doctrine', category: 'theologie', books: [
    { title: 'Somme Théologique', author: 'St Thomas d\'Aquin' },
    { title: 'Les Confessions', author: 'Saint Augustin' },
    { title: 'La Cité de Dieu', author: 'Saint Augustin' },
    { title: 'Catéchisme de l\'Église', author: 'Magistère' },
    { title: 'Introduction au Christianisme', author: 'J. Ratzinger' },
    { title: 'Le Credo Expliqué', author: 'Collectif' },
  ]},
]

const VALUES = [
  { Icon: I.Book,    t: '500+ ouvrages en français', d: 'De la Bible aux Pères de l\'Église, des saints aux théologiens contemporains — toute la Tradition réunie.' },
  { Icon: I.DL,      t: 'En PDF, téléchargeables',    d: 'Chaque livre est au format PDF, à lire en ligne ou à télécharger pour vous accompagner partout.' },
  { Icon: I.Devices, t: 'Sur tous vos appareils',     d: 'Téléphone, tablette, ordinateur. Votre bibliothèque vous suit, à toute heure, où que vous soyez.' },
  { Icon: I.Inf,     t: 'Un accès à vie',             d: 'Un seul paiement. Aucun abonnement, aucun renouvellement. Les nouveautés sont incluses, pour toujours.' },
]

const STEPS = [
  { n: '01', t: 'Réglez une seule fois', d: 'Un paiement unique de 10 300 FCFA par Mobile Money ou carte bancaire. Pas d\'abonnement.' },
  { n: '02', t: 'Accédez immédiatement',  d: 'Votre bibliothèque s\'ouvre dans les minutes qui suivent. Aucune attente, aucune livraison.' },
  { n: '03', t: 'Lisez & méditez',        d: 'Parcourez les rayons, ouvrez un livre, téléchargez-le. Nourrissez votre foi chaque jour.' },
]

const TESTIMONIALS = [
  { name: 'Père André M.',    role: 'Prêtre · Douala',        initials: 'PA', text: 'Je consulte cette bibliothèque chaque matin avant la prière. La qualité des ouvrages est remarquable — un véritable trésor pour le ministère.' },
  { name: 'Marie-Noëlle T.',  role: 'Catéchiste · Dakar',      initials: 'MN', text: 'En tant que catéchiste, j\'ai enfin toutes mes ressources au même endroit. Préparer mes cours est devenu un bonheur. Une grâce !' },
  { name: 'Jean-Pierre K.',   role: 'Séminariste · Abidjan',   initials: 'JP', text: 'La Bible de Jérusalem, le Catéchisme, les Pères de l\'Église… tout sur mon téléphone. Exactement ce qu\'il me fallait pour ma formation.' },
]

const FAQS = [
  { q: 'C\'est vraiment un paiement unique ?',            a: 'Oui. Vous réglez 10 300 FCFA une seule fois. Votre accès est permanent et illimité — jamais de renouvellement ni de frais cachés.' },
  { q: 'Comment accéder aux livres après paiement ?',     a: 'Votre accès est activé immédiatement. Créez votre compte, connectez-vous, et commencez à lire en quelques minutes.' },
  { q: 'Les livres sont-ils téléchargeables ?',           a: 'Oui, tous les ouvrages sont au format PDF, lisibles en ligne et téléchargeables sur vos appareils.' },
  { q: 'Puis-je lire depuis plusieurs appareils ?',       a: 'Bien sûr. Votre compte fonctionne sur téléphone, tablette et ordinateur, simultanément.' },
  { q: 'Quels moyens de paiement acceptez-vous ?',        a: 'Mobile Money (MTN, Orange, Wave, Moov…) et carte bancaire Visa / Mastercard.' },
]

export default function Landing() {
  const price = SINGLE_PLAN.price.toLocaleString('fr-FR')
  const [scrolled, setScrolled] = useState(false)
  const [showBar, setShowBar]   = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!heroRef.current) return
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { rootMargin: '-200px 0px 0px 0px' })
    io.observe(heroRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <div style={{ background: IVORY, color: INK, fontFamily: 'var(--font-inter), sans-serif', overflowX: 'hidden' }}>
      <style>{`
        ::selection { background: rgba(124,58,237,.22); }
        .serif { font-family: var(--font-cormorant), Georgia, serif; }
        .disp  { font-family: var(--font-sora), sans-serif; }

        @keyframes rvUp { from { opacity:0; transform:translateY(26px);} to {opacity:1; transform:none;} }
        .rv { opacity:0; }
        .rv.on { animation: rvUp .8s cubic-bezier(.22,.61,.36,1) both; }
        .rv.on.d1{animation-delay:.09s}.rv.on.d2{animation-delay:.18s}.rv.on.d3{animation-delay:.27s}.rv.on.d4{animation-delay:.36s}
        @media (prefers-reduced-motion: reduce){ .rv,.rv.on{opacity:1!important;animation:none!important} }

        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee { display:flex; gap:0; white-space:nowrap; animation: marquee 32s linear infinite; }

        .btn { position:relative; overflow:hidden; transition:transform .35s cubic-bezier(.22,.61,.36,1), box-shadow .35s, filter .3s; }
        .btn::after{ content:''; position:absolute; top:0; left:0; height:100%; width:42%; background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent); transform:translateX(-180%);}
        .btn:hover{ transform:translateY(-3px);} .btn:hover::after{ animation:sweep .9s cubic-bezier(.22,.61,.36,1);}
        .btn:active{ transform:translateY(-1px) scale(.99);}
        .btn svg{ transition:transform .35s cubic-bezier(.22,.61,.36,1);} .btn:hover svg{ transform:translateX(4px);}
        @keyframes sweep{ to{ transform:translateX(220%);} }

        .lift{ transition:transform .4s cubic-bezier(.22,.61,.36,1), box-shadow .4s, border-color .4s; }
        .lift:hover{ transform:translateY(-6px); box-shadow:0 24px 60px rgba(25,10,46,.16); }
        .bk{ transition:transform .4s cubic-bezier(.22,.61,.36,1), box-shadow .4s; }
        .bk:hover{ transform:translateY(-9px) rotate(-1deg); box-shadow:0 26px 54px rgba(25,10,46,.32); z-index:2; }

        .nav-a{ position:relative; }
        .nav-a::after{ content:''; position:absolute; left:0; bottom:-5px; height:2px; width:100%; background:currentColor; transform:scaleX(0); transform-origin:right; transition:transform .3s cubic-bezier(.22,.61,.36,1);}
        .nav-a:hover::after{ transform:scaleX(1); transform-origin:left;}

        .shelf::-webkit-scrollbar{ height:0; }
        .faq summary{ list-style:none; cursor:pointer; }
        .faq summary::-webkit-details-marker{ display:none; }
        .faq summary .pm{ transition:transform .3s cubic-bezier(.22,.61,.36,1); }
        .faq[open] summary .pm{ transform:rotate(180deg); }

        .sticky-bar{ position:fixed; left:0; right:0; bottom:0; z-index:60; display:none; align-items:center; justify-content:space-between; gap:12px;
          padding:11px 16px calc(11px + env(safe-area-inset-bottom)); background:rgba(25,10,46,.94); backdrop-filter:blur(14px);
          border-top:1px solid rgba(201,154,59,.28); transform:translateY(120%); transition:transform .45s cubic-bezier(.22,.61,.36,1); }
        .sticky-bar.show{ transform:translateY(0); }

        .hero-h1{ font-size: clamp(2.1rem, 6vw, 4.4rem); }
        @media (max-width:1024px){ .cols2{ grid-template-columns:1fr !important; } }
        @media (max-width:768px){
          .sticky-bar{ display:flex; }
          .nav-links{ display:none !important; }
          .nav-cta-full{ display:none !important; }
          .pad{ padding-left:18px !important; padding-right:18px !important; }
          .sec{ padding-top:58px !important; padding-bottom:58px !important; padding-left:18px !important; padding-right:18px !important; }
          #catalogue{ padding-top:58px !important; padding-bottom:46px !important; }
          .grid4{ grid-template-columns:1fr 1fr !important; }
          .hero-wrap{ padding-top:84px !important; padding-bottom:60px !important; }
          .hide-sm{ display:none !important; }
          .heyebrow{ padding:5px 12px !important; gap:7px !important; }
          .heyebrow > span:last-child{ font-size:.55rem !important; letter-spacing:.04em !important; }
          .heyebrow > span:first-child{ width:12px !important; height:12px !important; }
          .hero-h1{ font-size:clamp(2rem,8.5vw,2.6rem) !important; }
          .herobtn{ padding:15px 26px !important; font-size:.92rem !important; }
        }
        @media (max-width:480px){ .grid4{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* ───────── Sticky mobile bar ───────── */}
      <div className={`sticky-bar${showBar ? ' show' : ''}`}>
        <div style={{ lineHeight: 1.1 }}>
          <div className="disp" style={{ fontWeight: 800, fontSize: '1.02rem', color: '#fff' }}>{price} FCFA</div>
          <div style={{ fontSize: '.7rem', color: GOLD_L }}>Paiement unique · accès à vie</div>
        </div>
        <Link href="/auth/register?plan=lifetime" className="btn disp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, padding: '11px 22px', borderRadius: 999, fontWeight: 800, fontSize: '.85rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Accéder <span style={{ width: 15, height: 15 }}><I.Arrow /></span>
        </Link>
      </div>

      {/* ───────── Navbar ───────── */}
      <nav className="pad" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px',
        transition: 'background .4s, box-shadow .4s, border-color .4s',
        background: scrolled ? 'rgba(25,10,46,.86)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,154,59,.2)' : 'transparent'}`,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${VIO},${VIO_DK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(124,58,237,.4)' }}>
            <span style={{ width: 16, height: 16 }}><I.Cross /></span>
          </span>
          <span className="disp" style={{ fontWeight: 800, fontSize: '1.18rem', color: '#fff', letterSpacing: '-.01em' }}>Catho Biblio</span>
        </Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {[['#catalogue', 'Catalogue'], ['#avantages', 'Avantages'], ['#tarif', 'Tarif'], ['#faq', 'FAQ']].map(([h, l]) => (
            <a key={h} href={h} className="nav-a" style={{ color: 'rgba(255,255,255,.82)', fontSize: '.92rem', fontWeight: 500, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/auth/login" className="nav-cta-full nav-a" style={{ color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none' }}>Connexion</Link>
          <Link href="#tarif" className="btn disp" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, padding: '10px 22px', borderRadius: 999, fontWeight: 700, fontSize: '.88rem', textDecoration: 'none', boxShadow: '0 6px 18px rgba(201,154,59,.35)' }}>
            Accéder <span style={{ width: 14, height: 14 }}><I.Chev /></span>
          </Link>
        </div>
      </nav>

      {/* ───────── HERO — cinematic, centered ───────── */}
      <header ref={heroRef} className="hero-wrap" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 0 90px', overflow: 'hidden' }}>
        <img src={IMG.stainedGlass} alt="Vitraux" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${PLUM} 6%, rgba(25,10,46,.93) 50%, rgba(42,18,72,.8) 100%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(70% 55% at 50% 42%, rgba(124,58,237,.26), transparent 72%)` }} />

        <div className="pad" style={{ position: 'relative', maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="rv on heyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 16px', borderRadius: 999, border: `1px solid ${GOLD}55`, background: 'rgba(201,154,59,.1)', marginBottom: 28, whiteSpace: 'nowrap' }}>
            <span style={{ width: 14, height: 14, color: GOLD_L, flexShrink: 0 }}><I.Book /></span>
            <span style={{ fontSize: '.74rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD_L }}>Bibliothèque catholique numérique</span>
          </div>

          <h1 className="rv on d1 disp hero-h1" style={{ fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.03em', color: '#fff', marginBottom: 24 }}>
            Toute la sagesse de l&apos;Église,{' '}
            <span style={{ background: `linear-gradient(100deg,${GOLD_L},${GOLD},${GOLD_L})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dans votre main.</span>
          </h1>

          <p className="rv on d2" style={{ fontSize: 'clamp(1rem,1.6vw,1.18rem)', lineHeight: 1.75, color: 'rgba(255,255,255,.78)', maxWidth: 560, marginBottom: 36 }}>
            <strong style={{ color: '#fff' }}>Plus de 500 ouvrages catholiques</strong><br />
            Bible, saints, spiritualité, théologie<br />
            dans votre bibliothèque, à vie.
          </p>

          <div className="rv on d3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="#tarif" className="btn disp herobtn" style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, padding: '17px 38px', borderRadius: 999, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 14px 40px rgba(201,154,59,.4)' }}>
              Accéder à la bibliothèque <span style={{ width: 18, height: 18, flexShrink: 0 }}><I.Arrow /></span>
            </Link>
            <a href="#catalogue" className="disp" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: '#fff', fontWeight: 600, fontSize: '.95rem', textDecoration: 'none', padding: '14px 4px', borderBottom: `1px solid rgba(255,255,255,.35)`, whiteSpace: 'nowrap' }}>
              Découvrir le catalogue
            </a>
          </div>

          <div className="rv on d4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap', color: 'rgba(255,255,255,.6)', fontSize: '.84rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 15, height: 15, color: GOLD_L, flexShrink: 0 }}><I.Inf /></span> Paiement unique · {price} FCFA</span>
            <span className="hide-sm" style={{ opacity: .4 }}>·</span>
            <span className="hide-sm" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 15, height: 15, color: GOLD_L, flexShrink: 0 }}><I.Lock /></span> Accès garanti à vie</span>
          </div>
        </div>

        <div className="hide-sm" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>Défiler</span>
          <span style={{ width: 18, height: 18, animation: 'rvUp 1.4s ease-in-out infinite alternate' }}><I.Down /></span>
        </div>
      </header>

      {/* ───────── Marquee strip ───────── */}
      <div style={{ background: PLUM, borderTop: `1px solid rgba(201,154,59,.18)`, borderBottom: `1px solid rgba(201,154,59,.18)`, padding: '15px 0', overflow: 'hidden' }}>
        <div className="marquee">
          {[0, 1].map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {['Bible', 'Catéchisme', 'Vies des Saints', 'Spiritualité', 'Théologie', 'Liturgie', 'Prière', 'Pères de l\'Église', 'Encycliques', 'Mystique'].map(w => (
                <span key={w} style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '0 26px' }}>
                  <span className="serif" style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'rgba(255,255,255,.92)' }}>{w}</span>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── CATALOGUE showcase ───────── */}
      <section id="catalogue" style={{ padding: '96px 0 80px', background: IVORY }}>
        <div className="pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Le catalogue</p>
          <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-.02em', color: INK, marginBottom: 18, lineHeight: 1.1 }}>
            Un trésor de 500+ ouvrages,<br />classés par thème
          </h2>
          <p className="rv d1" style={{ fontSize: '1.05rem', color: MUTE, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Des grands classiques aux références incontournables de la foi.
          </p>
        </div>

        <div style={{ marginTop: 48 }}>
          {SHOWCASE.map((shelf) => (
            <div key={shelf.label} className="rv" style={{ marginBottom: 34 }}>
              <div className="pad" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 2, background: GOLD }} />
                <h3 className="disp" style={{ fontWeight: 700, fontSize: '1.1rem', color: INK }}>{shelf.label}</h3>
              </div>
              <div className="shelf pad" style={{ display: 'flex', gap: 18, overflowX: 'auto', justifyContent: 'safe center', padding: '8px 40px 18px', maxWidth: 1180, margin: '0 auto' }}>
                {shelf.books.map(b => (
                  <div key={b.title} className="bk" style={{ flexShrink: 0, width: 138, cursor: 'pointer' }}>
                    <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 13, overflow: 'hidden', boxShadow: '0 12px 30px rgba(25,10,46,.2)', border: '1px solid rgba(0,0,0,.06)' }}>
                      <DesignedCover title={b.title} author={b.author} category={shelf.category} />
                    </div>
                    <div className="disp" style={{ marginTop: 10, fontSize: '.8rem', fontWeight: 700, color: INK, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.title}</div>
                    <div style={{ fontSize: '.72rem', color: MUTE, marginTop: 2 }}>{b.author}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rv" style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="#tarif" className="btn disp" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(135deg,${VIO},${VIO_DK})`, color: '#fff', padding: '15px 36px', borderRadius: 999, fontWeight: 800, fontSize: '.95rem', textDecoration: 'none', boxShadow: '0 12px 34px rgba(124,58,237,.34)' }}>
            Débloquer les 500+ livres <span style={{ width: 17, height: 17 }}><I.Arrow /></span>
          </Link>
        </div>
      </section>

      {/* ───────── Scripture cinematic band ───────── */}
      <section className="sec" style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '90px 24px' }}>
        <img src={IMG.cathedral} alt="Cathédrale" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(25,10,46,.9), rgba(42,18,72,.78))` }} />
        <div className="rv" style={{ position: 'relative', textAlign: 'center', maxWidth: 760 }}>
          <span style={{ display: 'inline-block', width: 40, height: 40, color: GOLD, marginBottom: 18, opacity: .9 }}><I.Quote /></span>
          <p className="serif" style={{ fontSize: 'clamp(1.7rem,4vw,2.9rem)', fontStyle: 'italic', fontWeight: 500, color: '#fff', lineHeight: 1.32, marginBottom: 22 }}>
            « Ta parole est une lampe à mes pieds,<br />une lumière sur mon chemin. »
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ width: 30, height: 1, background: GOLD }} />
            <span style={{ fontSize: '.82rem', letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD_L, fontWeight: 600 }}>Psaume 119, 105</span>
            <span style={{ width: 30, height: 1, background: GOLD }} />
          </div>
        </div>
      </section>

      {/* ───────── Avantages ───────── */}
      <section id="avantages" className="sec" style={{ padding: '96px 40px', background: IVORY }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Pourquoi Catho Biblio</p>
            <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', fontWeight: 800, letterSpacing: '-.02em', color: INK, lineHeight: 1.12 }}>
              Conçue pour nourrir<br />votre vie spirituelle
            </h2>
          </div>
          <div className="grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
            {VALUES.map(({ Icon, t, d }, i) => (
              <div key={t} className={`rv lift d${(i % 4) + 1}`} style={{ background: '#fff', borderRadius: 18, padding: '30px 26px', border: '1px solid rgba(25,10,46,.07)', boxShadow: '0 2px 16px rgba(25,10,46,.04)' }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: `linear-gradient(135deg,${VIO}1a,${GOLD}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: VIO_DK, marginBottom: 20 }}>
                  <span style={{ width: 23, height: 23 }}><Icon /></span>
                </div>
                <h3 className="disp" style={{ fontWeight: 700, fontSize: '1rem', color: INK, marginBottom: 9 }}>{t}</h3>
                <p style={{ fontSize: '.88rem', color: MUTE, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="sec" style={{ padding: '90px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>En 3 étapes</p>
            <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', fontWeight: 800, letterSpacing: '-.02em', color: INK, lineHeight: 1.12 }}>Commencez en quelques minutes</h2>
          </div>
          <div className="cols2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`rv d${i + 1}`} style={{ position: 'relative', paddingTop: 8 }}>
                <div className="serif" style={{ fontSize: '3.4rem', fontWeight: 600, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1.4px ${GOLD}`, marginBottom: 14 }}>{s.n}</div>
                <h3 className="disp" style={{ fontWeight: 700, fontSize: '1.15rem', color: INK, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ fontSize: '.92rem', color: MUTE, lineHeight: 1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="sec" style={{ padding: '96px 40px', background: PLUM, color: '#fff' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD_L, marginBottom: 16 }}>Ils en témoignent</p>
            <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.7rem,4vw,2.7rem)', fontWeight: 800, letterSpacing: '-.02em', color: '#fff', lineHeight: 1.14 }}>Une grâce pour des milliers de catholiques</h2>
          </div>
          <div className="cols2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`rv d${i + 1}`} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(201,154,59,.22)', borderRadius: 18, padding: 30 }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16, color: GOLD_L }}>
                  {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ width: 15, height: 15 }}><I.Star /></span>)}
                </div>
                <p className="serif" style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.5, color: 'rgba(255,255,255,.92)', marginBottom: 22 }}>« {t.text} »</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${VIO},${VIO_DK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.82rem', color: '#fff' }}>{t.initials}</span>
                  <div>
                    <div className="disp" style={{ fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section id="tarif" className="sec" style={{ padding: '100px 40px', background: IVORY }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>L&apos;offre</p>
          <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', fontWeight: 800, letterSpacing: '-.02em', color: INK, marginBottom: 14, lineHeight: 1.12 }}>Un seul paiement.<br />Un accès pour la vie.</h2>
          <p className="rv d1" style={{ fontSize: '1.02rem', color: MUTE, marginBottom: 44, lineHeight: 1.7 }}>
            Pas d&apos;abonnement. Vous payez une seule fois et accédez à tout, pour toujours.
          </p>

          <div className="rv" style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', background: `linear-gradient(165deg, ${PLUM} 0%, ${PLUM2} 70%, ${VIO_DK} 130%)`, boxShadow: '0 30px 80px rgba(25,10,46,.4)', padding: '52px 40px', border: `1px solid rgba(201,154,59,.3)` }}>
            <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', right: -70, top: -90, background: `radial-gradient(circle, ${GOLD}33, transparent 70%)` }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 999, background: 'rgba(201,154,59,.16)', border: `1px solid ${GOLD}55`, marginBottom: 26 }}>
                <span style={{ width: 14, height: 14, color: GOLD_L }}><I.Inf /></span>
                <span style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD_L }}>Accès à vie · sans abonnement</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="disp" style={{ fontSize: 'clamp(3rem,9vw,4.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{price}</span>
                <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,.6)', marginLeft: 10 }}>FCFA</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', marginBottom: 34 }}>Un paiement unique, une fois pour toutes</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 38, textAlign: 'left' }}>
                {['Accès immédiat à 500+ livres catholiques', 'Tous les ouvrages en PDF, téléchargeables', 'Nouveautés incluses à vie', 'Lecture sur tous vos appareils', 'Support disponible 7j/7'].map(it => (
                  <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 21, height: 21, borderRadius: '50%', background: 'rgba(201,154,59,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD_L, flexShrink: 0 }}><span style={{ width: 12, height: 12 }}><I.Check /></span></span>
                    <span style={{ fontSize: '.92rem', color: 'rgba(255,255,255,.88)' }}>{it}</span>
                  </div>
                ))}
              </div>

              <Link href="/auth/register?plan=lifetime" className="btn disp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, padding: '19px 32px', borderRadius: 999, fontWeight: 900, fontSize: '1.02rem', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 12px 32px rgba(201,154,59,.4)' }}>
                Accéder à ma bibliothèque <span style={{ width: 18, height: 18 }}><I.Arrow /></span>
              </Link>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem', marginTop: 16 }}>Paiement sécurisé · activé immédiatement</p>
            </div>
          </div>

          <div className="rv" style={{ marginTop: 30 }}>
            <p style={{ fontSize: '.74rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTE, marginBottom: 14 }}>Moyens de paiement</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 380, margin: '0 auto' }}>
              {[['Mobile Money', I.Phone], ['Carte bancaire', I.Card]].map(([n, Ic]) => {
                const C = Ic as React.ComponentType
                return (
                  <div key={n as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '13px 14px', borderRadius: 12, background: '#fff', border: '1px solid rgba(25,10,46,.1)', fontSize: '.84rem', fontWeight: 600, color: INK }}>
                    <span style={{ width: 17, height: 17, color: VIO_DK }}><C /></span> {n as string}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="sec" style={{ padding: '90px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="rv" style={{ fontSize: '.76rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Questions fréquentes</p>
            <h2 className="rv d1 disp" style={{ fontSize: 'clamp(1.7rem,4vw,2.5rem)', fontWeight: 800, letterSpacing: '-.02em', color: INK }}>Tout ce qu&apos;il faut savoir</h2>
          </div>
          {FAQS.map(f => (
            <details key={f.q} className="faq rv" style={{ borderBottom: '1px solid rgba(25,10,46,.1)' }}>
              <summary className="disp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 4px', fontWeight: 600, fontSize: '1rem', color: INK }}>
                {f.q}
                <span className="pm" style={{ width: 20, height: 20, color: VIO_DK, flexShrink: 0 }}><I.Down /></span>
              </summary>
              <p style={{ fontSize: '.92rem', color: MUTE, lineHeight: 1.7, padding: '0 4px 22px' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── Final CTA — cinematic ───────── */}
      <section className="sec" style={{ position: 'relative', overflow: 'hidden', padding: '110px 40px', textAlign: 'center' }}>
        <img src={IMG.prayer} alt="Prière" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(25,10,46,.92), rgba(42,18,72,.82))` }} />
        <div className="rv" style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: 18, background: 'rgba(201,154,59,.16)', border: `1px solid ${GOLD}55`, alignItems: 'center', justifyContent: 'center', color: GOLD_L, marginBottom: 26 }}><span style={{ width: 30, height: 30 }}><I.Open /></span></span>
          <h2 className="disp" style={{ fontSize: 'clamp(1.9rem,4.4vw,3rem)', fontWeight: 800, letterSpacing: '-.02em', color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
            Commencez votre chemin spirituel dès aujourd&apos;hui
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>
            Un seul paiement de {price} FCFA, et toute la richesse de la Tradition catholique vous appartient — pour toujours.
          </p>
          <Link href="/auth/register?plan=lifetime" className="btn disp" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: `linear-gradient(135deg,${GOLD},${GOLD_L})`, color: PLUM, padding: '19px 46px', borderRadius: 999, fontWeight: 900, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 16px 44px rgba(0,0,0,.4)' }}>
            Accéder à ma bibliothèque <span style={{ width: 19, height: 19 }}><I.Arrow /></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 28, flexWrap: 'wrap', color: 'rgba(255,255,255,.6)', fontSize: '.82rem' }}>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><span style={{ width: 15, height: 15, color: GOLD_L }}><I.Lock /></span> Paiement sécurisé</span>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><span style={{ width: 15, height: 15, color: GOLD_L }}><I.Check /></span> Accès immédiat</span>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><span style={{ width: 15, height: 15, color: GOLD_L }}><I.Inf /></span> Garanti à vie</span>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer style={{ background: PLUM, color: 'rgba(255,255,255,.55)', padding: '52px 0 26px' }}>
        <div className="pad" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, marginBottom: 36 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${VIO},${VIO_DK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><span style={{ width: 15, height: 15 }}><I.Cross /></span></span>
              <span className="disp" style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>Catho Biblio</span>
            </div>
            <p className="serif" style={{ fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(255,255,255,.6)' }}>
              La bibliothèque catholique numérique pour l&apos;Afrique francophone.
            </p>
          </div>
          <div>
            <div className="disp" style={{ color: '#fff', fontWeight: 700, fontSize: '.86rem', marginBottom: 14 }}>Contact</div>
            <a href="mailto:support@catho-biblio.com" className="nav-a" style={{ color: 'rgba(255,255,255,.55)', fontSize: '.86rem', textDecoration: 'none' }}>support@catho-biblio.com</a>
          </div>
        </div>
        <div className="pad" style={{ maxWidth: 1140, margin: '0 auto', padding: '22px 40px 0', borderTop: '1px solid rgba(201,154,59,.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
          <span>© 2026 Catho Biblio. Tous droits réservés.</span>
          <span className="serif" style={{ fontStyle: 'italic', fontSize: '.92rem' }}>Ad majorem Dei gloriam</span>
        </div>
      </footer>
    </div>
  )
}
