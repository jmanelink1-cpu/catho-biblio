/**
 * Shared SVG icon set — pure presentational components (no client runtime).
 * Each icon inherits `currentColor` and fills its container (size via parent).
 */
import type { JSX } from 'react'

type P = JSX.IntrinsicElements['svg']
const base = (props: P) => ({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...props })

export const Icon = {
  Cross:    (p: P) => <svg {...base(p)} strokeWidth={2.4}><path d="M12 2v20M2 12h20"/></svg>,
  Book:     (p: P) => <svg {...base(p)} strokeWidth={1.8}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Open:     (p: P) => <svg {...base(p)} strokeWidth={1.8}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Arrow:    (p: P) => <svg {...base(p)} strokeWidth={2.4}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Chev:     (p: P) => <svg {...base(p)} strokeWidth={2.4}><polyline points="9 18 15 12 9 6"/></svg>,
  Down:     (p: P) => <svg {...base(p)}><polyline points="6 9 12 15 18 9"/></svg>,
  Check:    (p: P) => <svg {...base(p)} strokeWidth={2.6}><polyline points="20 6 9 17 4 12"/></svg>,
  Star:     (p: P) => <svg {...base(p)} fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Lock:     (p: P) => <svg {...base(p)}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Inf:      (p: P) => <svg {...base(p)}><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>,
  Phone:    (p: P) => <svg {...base(p)}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  Card:     (p: P) => <svg {...base(p)}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Devices:  (p: P) => <svg {...base(p)} strokeWidth={1.8}><rect x="2" y="4" width="14" height="11" rx="1.5"/><path d="M2 18h14"/><rect x="17.5" y="9" width="5" height="11" rx="1.2"/></svg>,
  DL:       (p: P) => <svg {...base(p)} strokeWidth={1.8}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Layers:   (p: P) => <svg {...base(p)} strokeWidth={1.8}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Quote:    (p: P) => <svg {...base(p)} fill="currentColor" stroke="none"><path d="M7 7h4v4c0 3-1.5 5-4 6V14H4V7h3zm9 0h4v4c0 3-1.5 5-4 6V14h-3V7h3z" opacity=".9"/></svg>,
  Search:   (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Settings: (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:   (p: P) => <svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Sparkle:  (p: P) => <svg {...base(p)} fill="currentColor" stroke="none"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>,
  X:        (p: P) => <svg {...base(p)} strokeWidth={2.4}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Users:    (p: P) => <svg {...base(p)} strokeWidth={1.9}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Grid:     (p: P) => <svg {...base(p)} strokeWidth={1.9}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
  Home:     (p: P) => <svg {...base(p)} strokeWidth={1.9}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Money:    (p: P) => <svg {...base(p)} strokeWidth={1.9}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 6v12M18 6v12"/></svg>,
  Calendar: (p: P) => <svg {...base(p)} strokeWidth={1.9}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Mega:     (p: P) => <svg {...base(p)} strokeWidth={1.9}><path d="M3 11l15-5v12L3 13z"/><path d="M11.6 16.9a2.6 2.6 0 1 1-5-1.4"/><path d="M18 8a3 3 0 0 1 0 6"/></svg>,
  Tag:      (p: P) => <svg {...base(p)} strokeWidth={1.9}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Share:    (p: P) => <svg {...base(p)} strokeWidth={1.9}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>,
  Copy:     (p: P) => <svg {...base(p)} strokeWidth={1.9}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Plus:     (p: P) => <svg {...base(p)} strokeWidth={2.4}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash:    (p: P) => <svg {...base(p)} strokeWidth={1.9}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Clock:    (p: P) => <svg {...base(p)} strokeWidth={1.9}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trend:    (p: P) => <svg {...base(p)} strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
}

export type IconKey = keyof typeof Icon
