/** Taux fixe officiel FCFA (XOF) ↔ EUR : 1 € = 655,957 FCFA. */
export const FCFA_PER_EUR = 655.957

/** Convertit un montant en FCFA vers l'euro (arrondi à l'entier). */
export const eurFromFcfa = (fcfa: number): number => Math.round(fcfa / FCFA_PER_EUR)
