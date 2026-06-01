'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SINGLE_PLAN } from '@/lib/types'
import DesignedCover from './library/DesignedCover'

// ── Real Catholic imagery (royalty-free, Unsplash CDN) ──
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`
const IMG = {
  stainedGlass: u('1438032005730-c779502df39b'),
  cathedral:    u('1473177104440-ffee2f376098'),
  pews:         u('1519491050282-cf00c82424b4'),
  prayer:       u('1499209974431-9dddcece7f88'),
  worship:      u('1507692049790-de58290a4334'),
  oldBooks:     u('1481627834876-b7833e8f5570'),
}

// ── Showcase shelves — illustrate the breadth of the catalogue ──
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
    { title: 'Le Journal d\'un Curé', author: 'Saint Jean-Marie Vianney' },
    { title: 'Saint François d\'Assise', author: 'Chesterton' },
    { title: 'Padre Pio', author: 'Biographie' },
    { title: 'Sainte Faustine', author: 'Petit Journal' },
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

// ── SVG Icons ────────────────────────────────────────────────────────────────
const I = {
  Cross:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>,
  Book:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  BookOpen: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Phone:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Search:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Layers:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Zap:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Refresh:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Shield:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Arrow:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ChevR:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Star:     () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Globe:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Clock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Lock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Card:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Heart:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Infinity: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>,
  // Catholic-specific book icons
  Bible:    () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <path d="M20 8v24M8 20h24" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="5" stroke="#B45309" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Catechism: () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <path d="M14 12h2a6 6 0 0 1 0 12h-2V12z" stroke="#6D28D9" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M14 24v8" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="28" r="5" stroke="#B45309" strokeWidth="2" fill="none"/>
      <path d="M24 26l4 4M28 26l-4 4" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Saints: () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <circle cx="20" cy="16" r="5" stroke="#B45309" strokeWidth="2" fill="none"/>
      <path d="M12 32c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 10 Q20 6 25 10" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  DevoteLife: () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <path d="M20 28s-10-6-10-13a6 6 0 0 1 10-4.5A6 6 0 0 1 30 15c0 7-10 13-10 13z" stroke="#B45309" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M20 14v8M16 18h8" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Imitation: () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <path d="M20 8v24M12 16h16" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M14 8 Q20 4 26 8" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="8" r="2.5" fill="#B45309"/>
    </svg>
  ),
  Rosary: () => (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6D28D9" opacity=".15"/>
      <circle cx="20" cy="20" r="9" stroke="#6D28D9" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
      <circle cx="20" cy="11" r="2" fill="#B45309"/>
      <circle cx="29" cy="20" r="2" fill="#B45309"/>
      <circle cx="20" cy="29" r="2" fill="#B45309"/>
      <circle cx="11" cy="20" r="2" fill="#B45309"/>
      <path d="M20 29v5l-2 2M18 34h4" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 8v3" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

const V = '#6D28D9'   // violet
const G = '#B45309'   // gold

const FEATURES = [
  { Icon: I.Book,     title: '500+ Livres catholiques en français', desc: 'Bible, Catéchisme, vies des saints, encycliques, théologie, spiritualité — toute la richesse de la Tradition catholique.' },
  { Icon: I.Phone,    title: 'Livres PDF téléchargeables',          desc: 'Tous les livres sont au format PDF, téléchargeables et lisibles sur téléphone, tablette ou ordinateur — partout, à tout moment.' },
  { Icon: I.Search,   title: 'Trouvez n\'importe quel ouvrage',     desc: 'Recherche par titre, auteur ou catégorie. Retrouvez en secondes ce que vous cherchez parmi 500+ livres.' },
  { Icon: I.Layers,   title: '10 catégories organisées',           desc: 'Bible, Saints, Spiritualité, Théologie, Liturgie, Prière, Documents pontificaux — tout est classé avec soin.' },
  { Icon: I.Zap,      title: 'Accès instantané après paiement',    desc: 'Votre bibliothèque s\'ouvre en quelques minutes. Pas d\'attente, pas de livraison.' },
  { Icon: I.Refresh,  title: 'Nouveaux livres régulièrement',      desc: 'La bibliothèque s\'enrichit continuellement. Votre accès à vie inclut toutes les futures additions.' },
]

const TESTIMONIALS = [
  { name: 'Jean-Pierre K.', role: 'Séminariste, Abidjan',   initials: 'JP', text: 'Je peux enfin lire la Bible de Jérusalem et le Catéchisme sur mon téléphone. C\'est exactement ce dont j\'avais besoin pour ma formation. Un seul paiement et j\'ai accès à tout !' },
  { name: 'Marie-Noëlle T.', role: 'Catéchiste, Dakar',     initials: 'MN', text: 'En tant que catéchiste, j\'ai accès à des dizaines de ressources pour préparer mes cours. La bibliothèque est une vraie grâce. Je recommande à tous les catholiques.' },
  { name: 'Père André M.',   role: 'Prêtre, Douala',         initials: 'PA', text: 'Je consulte cette bibliothèque chaque matin avant ma prière. La qualité des ouvrages est remarquable. Un investissement spirituel pour toute la vie.' },
]

const FAQS = [
  { q: 'C\'est vraiment un paiement unique ? Pas d\'abonnement ?',  a: 'Oui, absolument. Vous payez 10 300 FCFA une seule et unique fois. Votre accès est permanent et illimité. Jamais de renouvellement, jamais de frais cachés.' },
  { q: 'Comment accéder aux livres après mon paiement ?',           a: 'Votre accès est activé immédiatement après confirmation du paiement. Créez votre compte, connectez-vous, et commencez à lire en quelques minutes.' },
  { q: 'Puis-je lire depuis plusieurs appareils ?',                  a: 'Oui. Votre compte fonctionne sur tous vos appareils — téléphone, tablette, ordinateur — en même temps.' },
  { q: 'Quels moyens de paiement sont acceptés ?',                   a: 'Vous pouvez payer par Mobile Money (MTN, Orange, Wave, Moov…) ou par carte bancaire Visa/Mastercard.' },
  { q: 'Les livres sont-ils téléchargeables ?',                      a: 'Oui. Tous les livres sont au format PDF, téléchargeables sur votre appareil pour les lire à tout moment.' },
]

export default function LandingPage() {
  const price = SINGLE_PLAN.price.toLocaleString('fr-FR')
  const [showStickyCta, setShowStickyCta] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  // Scroll-reveal — elements fade/slide in as they enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Sticky conversion bar appears once the hero is scrolled past
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-120px 0px 0px 0px' }
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <div style={{ background: '#FDFBF7', color: '#1E1032', fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* ─── Responsive overrides (media queries beat inline styles via !important) ─── */}
      <style>{`
        /* ═══ Foundations ═══ */
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(109,40,217,0.18); color: #1E1032; }

        /* ═══ Motion primitives ═══ */
        @keyframes cbReveal      { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes cbFloat       { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes cbGradient    { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes cbGlow        { 0%,100% { opacity: .5; transform: scale(1); } 50% { opacity: .85; transform: scale(1.06); } }
        @keyframes cbShimmer     { to { transform: translateX(220%); } }
        @keyframes cbCaret       { 0%,100% { opacity: 1; } 50% { opacity: .25; } }

        /* ═══ Scroll-reveal (staggered) ═══ */
        .reveal { opacity: 0; }
        .reveal.in { animation: cbReveal .7s cubic-bezier(.22,.61,.36,1) both; }
        .reveal.in.d1 { animation-delay: .08s; }
        .reveal.in.d2 { animation-delay: .16s; }
        .reveal.in.d3 { animation-delay: .24s; }
        .reveal.in.d4 { animation-delay: .32s; }
        .reveal.in.d5 { animation-delay: .40s; }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal.in { opacity: 1 !important; animation: none !important; }
          html { scroll-behavior: auto; }
        }

        /* ═══ Animated gradient keyword ═══ */
        .cb-grad-word {
          background: linear-gradient(100deg, #6D28D9, #9333EA, #B45309, #9333EA, #6D28D9);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: cbGradient 6s linear infinite;
        }

        /* ═══ Primary button — crafted hover with light sweep ═══ */
        .cb-cta { position: relative; overflow: hidden; transition: transform .35s cubic-bezier(.22,.61,.36,1), box-shadow .35s ease, filter .35s ease; will-change: transform; isolation: isolate; }
        .cb-cta::after {
          content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.45), transparent);
          transform: translateX(-160%); pointer-events: none;
        }
        .cb-cta:hover { transform: translateY(-3px); }
        .cb-cta:hover::after { animation: cbShimmer .9s cubic-bezier(.22,.61,.36,1); }
        .cb-cta:active { transform: translateY(-1px) scale(.99); }
        .cb-cta svg { transition: transform .35s cubic-bezier(.22,.61,.36,1); }
        .cb-cta:hover svg { transform: translateX(4px); }

        /* ═══ Cards — considered hover ═══ */
        .cb-lift { transition: transform .4s cubic-bezier(.22,.61,.36,1), box-shadow .4s ease, border-color .4s ease; will-change: transform; }
        .cb-lift:hover { transform: translateY(-6px); box-shadow: 0 18px 50px rgba(109,40,217,0.14); border-color: rgba(109,40,217,0.35) !important; }

        /* ═══ Book showcase — gentle float + hover focus ═══ */
        .cb-book { transition: transform .4s cubic-bezier(.22,.61,.36,1), box-shadow .4s ease; }
        .cb-book:hover { transform: translateY(-8px) rotate(-1deg); box-shadow: 0 22px 48px rgba(109,40,217,.22); z-index: 2; }

        /* ═══ Nav link underline ═══ */
        .cb-navlink { position: relative; }
        .cb-navlink::after { content: ''; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%; background: #6D28D9; transform: scaleX(0); transform-origin: right; transition: transform .3s cubic-bezier(.22,.61,.36,1); border-radius: 2px; }
        .cb-navlink:hover { color: #6D28D9 !important; }
        .cb-navlink:hover::after { transform: scaleX(1); transform-origin: left; }

        /* ═══ Hero ambient glows ═══ */
        .cb-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: cbGlow 9s ease-in-out infinite; }

        /* ═══ FAQ rows ═══ */
        .cb-faq { transition: background .25s ease; border-radius: 12px; }
        .cb-faq summary { transition: color .2s ease; }
        .cb-faq[open] summary { color: #6D28D9 !important; }
        .cb-faq summary span { transition: transform .3s cubic-bezier(.22,.61,.36,1); }
        .cb-faq[open] summary span { transform: rotate(45deg); }

        /* ═══ Sticky conversion bar (mobile) ═══ */
        .cb-sticky {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
          display: none; align-items: center; justify-content: space-between; gap: 12px;
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
          background: rgba(255,255,255,.92); backdrop-filter: blur(14px);
          border-top: 1px solid rgba(109,40,217,.14);
          box-shadow: 0 -8px 30px rgba(30,16,50,.08);
          transform: translateY(120%); transition: transform .45s cubic-bezier(.22,.61,.36,1);
        }
        .cb-sticky.show { transform: translateY(0); }

        /* ═══ Trust pill row ═══ */
        .cb-trustpill { transition: background .3s ease, transform .3s ease; }

        /* ═══ Showcase shelves ═══ */
        .cb-shelf::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
          .cb-grid-2  { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 768px) {
          .cb-sticky    { display: flex; }
          .cb-nav       { padding: 0 14px !important; height: 56px !important; }
          .cb-navlinks  { display: none !important; }
          .cb-navcta    { padding: 8px 14px !important; font-size: .78rem !important; }
          .cb-logo      { font-size: .98rem !important; }

          .cb-hero      { padding-top: 78px !important; padding-bottom: 40px !important; padding-left: 18px !important; padding-right: 18px !important; }
          .cb-section   { padding-top: 52px !important; padding-bottom: 52px !important; padding-left: 18px !important; padding-right: 18px !important; }

          .cb-h1        { font-size: 1.62rem !important; line-height: 1.22 !important; margin-bottom: 18px !important; letter-spacing: -.03em !important; }
          .cb-h2        { font-size: 1.3rem !important; margin-bottom: 8px !important; }
          .cb-eyebrow   { font-size: .68rem !important; margin-bottom: 8px !important; }
          .cb-badge     { font-size: .64rem !important; padding: 5px 11px !important; margin-bottom: 20px !important; }
          .cb-lead      { font-size: .9rem !important; line-height: 1.6 !important; margin-bottom: 16px !important; }
          .cb-lead-2    { font-size: .92rem !important; margin-bottom: 28px !important; }
          .cb-sub       { font-size: .85rem !important; margin-bottom: 28px !important; }

          .cb-herobtn   { width: auto !important; max-width: 92%; margin-left: auto !important; margin-right: auto !important; padding: 15px 28px !important; font-size: .9rem !important; white-space: nowrap !important; }
          .cb-microcopy { font-size: .74rem !important; }

          .cb-trust     { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px 18px !important; margin: 28px auto 0 !important; max-width: 300px; justify-items: center; }
          .cb-trust > div:nth-child(3) { grid-column: 1 / -1 !important; }

          .cb-social      { grid-template-columns: 1fr 1fr !important; max-width: 300px !important; padding: 0 !important; }
          .cb-social-item { border-right: none !important; padding: 14px 6px !important; }
          .cb-social-item:nth-child(odd)  { border-right: 1px solid rgba(109,40,217,0.1) !important; }
          .cb-social-item:nth-child(1),
          .cb-social-item:nth-child(2)    { border-bottom: 1px solid rgba(109,40,217,0.1) !important; }

          .cb-grid-4    { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .cb-card      { padding: 22px !important; }
          .cb-statval   { font-size: 1.25rem !important; }
          .cb-statlabel { font-size: .72rem !important; }

          .cb-bigprice  { font-size: 2.7rem !important; }
          .cb-paycard   { padding: 34px 22px !important; }
        }
        @media (max-width: 420px) {
          .cb-navcta-price { display: none; }
          .cb-h1        { font-size: 1.46rem !important; }
          .cb-bigprice  { font-size: 2.3rem !important; }
          .cb-herobtn   { font-size: .84rem !important; padding: 14px 22px !important; }
          .cb-grid-4    { gap: 12px !important; }
        }
      `}</style>

      {/* ─── Sticky mobile conversion bar ─── */}
      <div className={`cb-sticky${showStickyCta ? ' show' : ''}`}>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#1E1032' }}>{price} FCFA</div>
          <div style={{ fontSize: '.72rem', color: '#8A6FB0' }}>Paiement unique · à vie</div>
        </div>
        <Link href="/auth/register?plan=lifetime" className="cb-cta" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg,#6D28D9,#9333EA)', color: '#fff',
          padding: '12px 22px', borderRadius: 999, fontSize: '.86rem', fontWeight: 800,
          textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 8px 22px rgba(109,40,217,.36)'
        }}>
          Accéder
          <div style={{ width: 15, height: 15 }}><I.Arrow /></div>
        </Link>
      </div>

      {/* ─── Navbar ─── */}
      <nav className="cb-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', background: 'rgba(253,251,247,0.97)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(109,40,217,0.12)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: V, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <div style={{ width: 16, height: 16 }}><I.Cross /></div>
          </div>
          <span className="cb-logo" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: V }}>Catho Biblio</span>
        </Link>

        <div className="cb-navlinks" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[['#fonctionnalites','Fonctionnalités'],['#tarif','Tarif'],['#faq','FAQ']].map(([h,l]) => (
            <a key={h} href={h} className="cb-navlink" style={{ color: '#6B7280', fontSize: '.9rem', fontWeight: 500, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/auth/login" style={{ color: V, fontSize: '.88rem', fontWeight: 600, textDecoration: 'none' }} className="cb-navlinks">
            Connexion
          </Link>
          <Link href="#tarif" className="cb-navcta cb-cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: V, color: '#fff', padding: '10px 20px',
            borderRadius: 999, fontSize: '.88rem', fontWeight: 700,
            textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            Accéder<span className="cb-navcta-price">&nbsp;— {price} FCFA</span>
            <div style={{ width: 14, height: 14 }}><I.ChevR /></div>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="cb-hero" style={{
        paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
        textAlign: 'center',
        background: 'linear-gradient(180deg, #F3EEFF 0%, #FAF8FF 52%, #FDFBF7 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Ambient glows */}
        <div className="cb-glow" style={{ width: 360, height: 360, top: -80, left: '-8%', background: 'radial-gradient(circle, rgba(147,51,234,.30), transparent 70%)' }} />
        <div className="cb-glow" style={{ width: 320, height: 320, top: 40, right: '-6%', background: 'radial-gradient(circle, rgba(180,83,9,.18), transparent 70%)', animationDelay: '2s' }} />

        <h1 className="cb-h1 reveal in d1" style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.12,
          maxWidth: 840, margin: '0 auto 20px', letterSpacing: '-0.03em',
          color: '#1E1032', position: 'relative'
        }}>
          La plus grande bibliothèque{' '}
          <span className="cb-grad-word">catholique numérique</span>{' '}
          d&apos;Afrique francophone
        </h1>

        <p className="cb-lead reveal in d2" style={{ fontSize: '1.12rem', maxWidth: 580, margin: '0 auto 12px', lineHeight: 1.7, color: '#5B5470', position: 'relative' }}>
          500+ ouvrages catholiques — Bible, saints,<br />théologie, spiritualité et bien plus.
        </p>
        <p className="cb-lead-2 reveal in d2" style={{ fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 36px', fontWeight: 700, color: V, position: 'relative' }}>
          Un seul paiement de {price} FCFA.
        </p>

        <div className="reveal in d3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 48, position: 'relative' }}>
          <Link href="#tarif" className="cb-herobtn cb-cta" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'linear-gradient(135deg, #6D28D9 0%, #9333EA 100%)', color: '#fff', padding: '17px 42px',
            borderRadius: 999, fontSize: '1rem', fontWeight: 800,
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 12px 34px rgba(109,40,217,0.42)',
            letterSpacing: '0.01em', textAlign: 'center'
          }}>
            Accéder à ma bibliothèque
            <div style={{ width: 18, height: 18, flexShrink: 0 }}><I.Arrow /></div>
          </Link>
          <p className="cb-microcopy" style={{ fontSize: '.82rem', color: '#9CA3AF' }}>
            Paiement unique · Accès immédiat · Garanti à vie
          </p>
        </div>

        {/* Social proof — clean card grid */}
        <div className="cb-social reveal in d4" style={{
          maxWidth: 520, margin: '0 auto 56px',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(255,255,255,.75)', borderRadius: 18, padding: '20px 12px',
          border: '1px solid rgba(109,40,217,0.12)', backdropFilter: 'blur(6px)',
          boxShadow: '0 6px 26px rgba(109,40,217,0.08)'
        }}>
          {[['500+','Livres'],['10','Catégories'],['24h/7','Disponible'],['1 paiement','Accès à vie']].map(([v,l], i) => (
            <div key={l} className="cb-social-item" style={{
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(109,40,217,0.1)' : 'none'
            }}>
              <div className="cb-statval" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1.35rem', color: V, whiteSpace: 'nowrap' }}>{v}</div>
              <div className="cb-statlabel" style={{ fontSize: '.78rem', color: '#9CA3AF', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Hero visual — real Catholic imagery */}
        <div className="reveal in d5" style={{
          maxWidth: 820, margin: '0 auto', position: 'relative',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 32px 90px rgba(59,7,100,0.32)',
          border: '1px solid rgba(255,255,255,.5)'
        }}>
          <img src={IMG.stainedGlass} alt="Vitraux d'église catholique" loading="lazy"
            style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,16,50,0) 35%, rgba(30,16,50,.82) 100%)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px 26px', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Sora', serif", fontWeight: 600, color: '#fff', fontSize: 'clamp(1rem,2.4vw,1.4rem)', lineHeight: 1.35, maxWidth: 560, textShadow: '0 2px 12px rgba(0,0,0,.4)' }}>
              « Ta parole est une lampe à mes pieds, une lumière sur mon chemin. »
            </div>
            <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.7)', marginTop: 6, letterSpacing: '.04em' }}>Psaume 119, 105</div>
          </div>
        </div>
      </section>

      {/* ─── Catalogue showcase — scrolling shelves ─── */}
      <section className="cb-section" style={{ padding: '72px 0 64px', background: 'linear-gradient(180deg,#FDFBF7,#F5F0FF)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <p className="cb-eyebrow reveal" style={{ textAlign: 'center', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: V, marginBottom: 12 }}>
            Un aperçu du catalogue
          </p>
          <h2 className="cb-h2 reveal d1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', textAlign: 'center', marginBottom: 10, color: '#1E1032' }}>
            500+ ouvrages, classés par thème
          </h2>
          <p className="reveal d1" style={{ textAlign: 'center', color: '#6B7280', marginBottom: 8, maxWidth: 520, margin: '0 auto 8px' }}>
            Des grands classiques aux références incontournables de la foi catholique.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          {SHOWCASE.map((shelf, si) => (
            <div key={shelf.label} className="reveal" style={{ marginBottom: si === SHOWCASE.length - 1 ? 0 : 30 }}>
              <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-gold-bright)' }} />
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#1E1032' }}>{shelf.label}</h3>
              </div>
              <div className="cb-shelf" style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '6px 24px 16px', scrollbarWidth: 'none' }}>
                {shelf.books.map((b) => (
                  <div key={b.title} className="cb-book" style={{ flexShrink: 0, width: 124 }}>
                    <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 26px rgba(30,16,50,.18)', border: '1px solid rgba(0,0,0,.05)' }}>
                      <DesignedCover title={b.title} author={b.author} category={shelf.category} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: '.76rem', fontWeight: 700, color: '#1E1032', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{b.title}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="#tarif" className="cb-cta" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg,#6D28D9,#9333EA)', color: '#fff',
            padding: '14px 32px', borderRadius: 999, fontSize: '.92rem', fontWeight: 800,
            textDecoration: 'none', boxShadow: '0 10px 30px rgba(109,40,217,.34)'
          }}>
            Débloquer les 500+ livres
            <div style={{ width: 17, height: 17 }}><I.Arrow /></div>
          </Link>
        </div>
      </section>

      {/* ─── Cinematic image band ─── */}
      <section style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '72px 24px' }}>
        <img src={IMG.cathedral} alt="Intérieur de cathédrale" loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,16,50,.86), rgba(59,7,100,.72))' }} />
        <div className="reveal" style={{ position: 'relative', textAlign: 'center', maxWidth: 680 }}>
          <div style={{ width: 44, height: 44, margin: '0 auto 20px', color: '#FDE68A' }}><I.BookOpen /></div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3.4vw,2.2rem)', color: '#fff', lineHeight: 1.25, marginBottom: 16 }}>
            Toute la richesse de la Tradition catholique,<br />dans votre poche.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Des Pères de l&apos;Église aux saints d&apos;aujourd&apos;hui — un trésor spirituel
            que vous emportez partout, à lire et méditer chaque jour.
          </p>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="cb-section" style={{ padding: '80px 24px', background: '#fff' }} id="fonctionnalites">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p className="cb-eyebrow reveal" style={{ textAlign: 'center', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: V, marginBottom: 12 }}>
            Fonctionnalités
          </p>
          <h2 className="cb-h2 reveal d1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', textAlign: 'center', marginBottom: 10, color: '#1E1032' }}>
            Tout ce qu&apos;il vous faut pour nourrir votre foi
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 52, maxWidth: 520, margin: '0 auto 52px' }}>
            Une bibliothèque conçue spécialement pour les catholiques francophones d&apos;Afrique.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(({ Icon: Ic, title, desc }, fi) => (
              <div key={title} className={`cb-card cb-lift reveal d${(fi % 3) + 1}`} style={{ padding: 28, borderRadius: 18, border: '1px solid rgba(109,40,217,0.12)', background: '#fff' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, marginBottom: 18,
                  background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: V
                }}>
                  <div style={{ width: 22, height: 22 }}><Ic /></div>
                </div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.95rem', marginBottom: 10, color: '#1E1032' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '.85rem', color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="cb-section" style={{ padding: '80px 24px', background: '#F5F0FF' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p className="cb-eyebrow reveal" style={{ textAlign: 'center', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: V, marginBottom: 12 }}>
            Témoignages
          </p>
          <h2 className="cb-h2 reveal d1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', textAlign: 'center', marginBottom: 52, color: '#1E1032' }}>
            Des catholiques qui ont transformé leur vie spirituelle
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, ti) => (
              <div key={t.name} className={`cb-card cb-lift reveal d${ti + 1}`} style={{ padding: 28, borderRadius: 18, background: '#fff', border: '1px solid rgba(109,40,217,0.1)' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16, color: G }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ width: 15, height: 15 }}><I.Star /></div>)}
                </div>
                <p style={{ fontSize: '.88rem', color: '#4B5563', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: V, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '.78rem', fontWeight: 800
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 700, color: '#1E1032' }}>{t.name}</div>
                    <div style={{ fontSize: '.78rem', color: '#9CA3AF' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="cb-section" style={{ padding: '80px 24px', background: '#fff' }} id="tarif">
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: V, marginBottom: 12 }}>
            Tarif
          </p>
          <h2 className="cb-h2 reveal d1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: 12, color: '#1E1032' }}>
            Un seul paiement. Un accès à vie.
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 48, lineHeight: 1.7 }}>
            Pas d&apos;abonnement. Pas de renouvellement. Vous payez une seule fois et vous accédez à toute la bibliothèque pour toujours.
          </p>

          {/* Pricing Card */}
          <div className="cb-paycard reveal" style={{
            background: 'linear-gradient(160deg, #3B0764 0%, #6D28D9 100%)',
            borderRadius: 24, padding: '48px 40px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(109,40,217,0.4)'
          }}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', padding: '5px 14px',
              borderRadius: 999, fontSize: '.75rem', fontWeight: 700, color: '#FDE68A',
              marginBottom: 24, textTransform: 'uppercase', letterSpacing: '.1em'
            }}>
              <div style={{ width: 14, height: 14 }}><I.Infinity /></div>
              Accès à Vie — Sans abonnement
            </div>

            <div style={{ marginBottom: 8 }}>
              <span className="cb-bigprice" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: '4rem', color: '#fff', lineHeight: 1 }}>
                {price}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,.6)', marginLeft: 8 }}>
                FCFA
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem', marginBottom: 36 }}>
              Paiement unique · Jamais de renouvellement
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40, textAlign: 'left' }}>
              {[
                'Accès immédiat à 500+ livres catholiques',
                'Tous les livres en PDF, téléchargeables',
                'Toutes les nouvelles additions incluses à vie',
                'Lecture sur tous vos appareils',
                'Bible, Saints, Catéchisme, Spiritualité et plus',
                'Support disponible 7j/7',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, color: '#4ADE80', flexShrink: 0 }}><I.Check /></div>
                  <span style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.85)' }}>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register?plan=lifetime" className="cb-herobtn cb-cta" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#fff', color: V,
              padding: '18px 32px', borderRadius: 999,
              fontSize: '1rem', fontWeight: 900,
              textDecoration: 'none', fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              letterSpacing: '0.01em', textAlign: 'center'
            }}>
              Commencer ma lecture
              <div style={{ width: 18, height: 18, flexShrink: 0 }}><I.Arrow /></div>
            </Link>

            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem', marginTop: 16 }}>
              Paiement sécurisé · Accès activé immédiatement
            </p>
          </div>

          {/* Payment methods */}
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: '.78rem', color: '#9CA3AF', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Moyens de paiement acceptés
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 360, margin: '0 auto' }}>
              {[['Mobile Money', I.Phone], ['Carte bancaire', I.Card]].map(([name, Ic]) => {
                const Comp = Ic as React.ComponentType
                return (
                  <div key={name as string} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 14px', borderRadius: 10,
                    border: '1px solid #E5E7EB', background: '#fff',
                    fontSize: '.82rem', fontWeight: 600, color: '#4B5563'
                  }}>
                    <div style={{ width: 16, height: 16, color: V, flexShrink: 0 }}><Comp /></div>
                    {name as string}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Guarantee ─── */}
      <section style={{
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #FFFBEB, #FEF9C3)',
        borderTop: '1px solid #FDE68A', borderBottom: '1px solid #FDE68A'
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <div style={{ width: 26, height: 26 }}><I.Shield /></div>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '1rem', marginBottom: 4, color: '#1E1032' }}>
              Paiement 100% sécurisé —<br />Accès garanti à vie
            </h3>
            <p style={{ fontSize: '.86rem', color: '#6B7280', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              Tous les paiements sont traités par des prestataires certifiés (CinetPay, Stripe, PayPal).
              Votre accès est permanent et ne peut jamais être révoqué.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="cb-section" style={{ padding: '80px 24px', background: '#FDFBF7' }} id="faq">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="cb-eyebrow reveal" style={{ textAlign: 'center', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: V, marginBottom: 12 }}>
            FAQ
          </p>
          <h2 className="cb-h2 reveal d1" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.9rem)', textAlign: 'center', marginBottom: 48, color: '#1E1032' }}>
            Vos questions, nos réponses
          </h2>
          {FAQS.map(faq => (
            <details key={faq.q} style={{ borderBottom: '1px solid rgba(109,40,217,0.12)', paddingBottom: 0 }}
                     className="cb-faq reveal">
              <summary style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', fontWeight: 600, fontSize: '.92rem',
                color: '#1E1032', padding: '20px 4px', listStyle: 'none'
              }}>
                {faq.q}
                <span style={{ color: V, fontSize: '1.4rem', fontWeight: 300, flexShrink: 0, marginLeft: 16, lineHeight: 1 }}>+</span>
              </summary>
              <p style={{ fontSize: '.88rem', color: '#6B7280', lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="cb-section" style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'linear-gradient(160deg, #1E1032 0%, #3B0764 50%, #6D28D9 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 28px',
          background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}>
          <div style={{ width: 36, height: 36 }}><I.BookOpen /></div>
        </div>

        <h2 className="cb-h2 reveal d1" style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff',
          maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.2
        }}>
          Commencez à lire dès aujourd&apos;hui.<br />
          <span style={{ color: '#FDE68A' }}>Un seul paiement pour toujours.</span>
        </h2>

        <p className="cb-sub" style={{ color: 'rgba(255,255,255,.65)', maxWidth: 440, margin: '0 auto 40px', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Rejoignez des milliers de catholiques qui nourrissent leur foi chaque jour grâce à Catho Biblio.
        </p>

        <Link href="/auth/register" className="cb-herobtn cb-cta" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: 'linear-gradient(135deg, #D97706, #F59E0B)',
          color: '#fff', padding: '20px 48px', borderRadius: 999,
          fontSize: '1.05rem', fontWeight: 900, textDecoration: 'none',
          fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          letterSpacing: '0.01em'
        }}>
          Accéder à ma bibliothèque
          <div style={{ width: 20, height: 20, flexShrink: 0 }}><I.Arrow /></div>
        </Link>

        <div className="cb-trust" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, marginTop: 28, flexWrap: 'wrap' }}>
          {[
            [I.Lock,     'Paiement sécurisé'],
            [I.Check,    'Accès immédiat'],
            [I.Infinity, 'Garanti à vie'],
          ].map(([Ic, label]) => {
            const Comp = Ic as React.ComponentType
            return (
              <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, color: '#FDE68A' }}><Comp /></div>
                <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.82rem' }}>{label as string}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ padding: '48px 24px 24px', background: '#0D0820' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
          <div style={{ maxWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <div style={{ width: 15, height: 15 }}><I.Cross /></div>
              </div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Catho Biblio</span>
            </div>
            <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
              La bibliothèque catholique numérique pour l&apos;Afrique francophone.
            </p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '.88rem', marginBottom: 16 }}>Contact</div>
            <a href="mailto:support@catho-biblio.com" style={{ color: 'rgba(255,255,255,.4)', fontSize: '.86rem', textDecoration: 'none' }}>
              support@catho-biblio.com
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.78rem' }}>© 2025 Catho Biblio. Tous droits réservés.</span>
          <span style={{ color: 'rgba(255,255,255,.25)', fontSize: '.78rem' }}>Fait avec foi pour l&apos;Afrique catholique</span>
        </div>
      </footer>
    </div>
  )
}
