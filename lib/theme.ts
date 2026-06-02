/**
 * Design tokens — shared liturgical palette (plum · gold · ivory).
 * Single source of truth so colors stay consistent across the app.
 */
export const theme = {
  plum:   '#190A2E', // deep dark
  plum2:  '#2A1248',
  vio:    '#7C3AED', // violet brand
  vioDk:  '#6D28D9',
  gold:   '#C99A3B', // antique gold
  goldL:  '#E3BE6E',
  ivory:  '#FBF8F3',
  ink:    '#1A1326',
  mute:   '#6B6478',
} as const

export type Theme = typeof theme
