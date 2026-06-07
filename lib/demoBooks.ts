import type { Book } from './types'

const ol = (id: number) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`

/**
 * Demo catalogue — shown in the library when the database has no books yet,
 * so the experience always looks alive (with real covers). Replace by adding
 * real books in /admin. drive_file_id is empty until real Google Drive IDs are set.
 */
const mk = (
  id: string, title: string, author: string, category: string, cover: string | null,
  description: string, is_featured = false,
): Book => ({
  id, title, author, category, cover_url: cover, drive_file_id: '',
  language: 'fr', year: null, pages: null, is_featured, description,
  created_at: '2026-05-20',
})

export const DEMO_BOOKS: Book[] = [
  // ── Bible & Écriture Sainte ──
  mk('b1', 'La Bible de Jérusalem', 'École Biblique', 'bible', '/covers/bible-jerusalem.jpg', 'La traduction française de référence, fruit du travail de l\'École biblique de Jérusalem.', true),
  mk('b2', 'La Bible de la Liturgie', 'AELF', 'bible', ol(13441794), 'Le texte officiel proclamé dans la liturgie de l\'Église.', true),
  mk('b3', 'Le Nouveau Testament', 'Traduction officielle', 'bible', '/covers/nouveau-testament.webp', 'Les quatre Évangiles, les Actes, les Épîtres et l\'Apocalypse.'),
  mk('b4', 'Évangile selon Saint Jean', 'Saint Jean', 'bible', ol(3099801), 'L\'Évangile spirituel, commenté et médité.'),
  mk('b5', 'Concordance Biblique', 'Collectif', 'bible', '/covers/concordance.jpg', 'Pour retrouver chaque mot et chaque passage de l\'Écriture.'),

  // ── Saints & Témoins de la Foi ──
  mk('s1', 'Histoire d\'une Âme', 'Ste Thérèse de Lisieux', 'saints', ol(2143788), 'L\'autobiographie de la petite voie de l\'enfance spirituelle.', true),
  mk('s2', 'La Vie de Saint Charbel', 'Philippe Beitia', 'saints', '/covers/saint-charbel.jpg', 'La vie du grand ermite et thaumaturge du Liban.'),
  mk('s3', 'Saint François d\'Assise', 'G.K. Chesterton', 'saints', '/covers/francois-assise.jpg', 'Un portrait lumineux du Poverello par Chesterton.'),
  mk('s4', 'Témoin de l\'Amour Crucifié', 'Padre Pio', 'saints', '/covers/padre-pio.jpg', 'La vie et le message du saint stigmatisé de Pietrelcina.'),
  mk('s5', 'Petit Journal', 'Ste Faustine', 'saints', '/covers/faustine.png', 'Le journal de la Miséricorde Divine de sainte Faustine.'),
  mk('s6', 'Vie de Sainte Bernadette', 'François Trochu', 'saints', ol(15056170), 'La biographie de référence de la voyante de Lourdes.'),

  // ── Spiritualité & Vie Intérieure ──
  mk('p1', 'L\'Imitation de Jésus-Christ', 'Thomas a Kempis', 'spiritualite', '/covers/imitation.webp', 'Le classique le plus lu de la spiritualité chrétienne.', true),
  mk('p2', 'Les Exercices Spirituels', 'St Ignace de Loyola', 'spiritualite', '/covers/exercices-spirituels.jpg', 'La méthode ignatienne pour discerner la volonté de Dieu.'),
  mk('p3', 'Le Château Intérieur', 'Ste Thérèse d\'Avila', 'spiritualite', ol(3090639), 'Un chef-d\'œuvre de la mystique carmélitaine.'),
  mk('p4', 'L\'Abandon à la Providence', 'J.-P. de Caussade', 'spiritualite', '/covers/abandon-providence.jpg', 'Le sacrement du moment présent et l\'abandon confiant.'),
  mk('p5', 'L\'Abandon à l\'Immaculée', 'St Maximilien Kolbe', 'spiritualite', '/covers/abandon-immaculee.jpg', 'La voie mariale du martyr d\'Auschwitz.'),
  mk('p6', 'La Montée du Carmel', 'St Jean de la Croix', 'spiritualite', '/covers/montee-carmel.jpeg', 'L\'ascension de l\'âme vers l\'union à Dieu.'),

  // ── Théologie & Doctrine ──
  mk('t1', 'Somme Théologique', 'St Thomas d\'Aquin', 'theologie', '/covers/somme-theologique.jpg', 'La synthèse magistrale de la théologie scolastique.', true),
  mk('t2', 'Le Concile Vatican II', 'Documents conciliaires', 'theologie', '/covers/vatican-ii.jpg', 'Les seize documents du concile, texte intégral.'),
  mk('t3', 'Les Pères Apostoliques', 'Pères de l\'Église', 'theologie', '/covers/peres-apostoliques.webp', 'Les premiers témoins de la foi après les Apôtres.'),
  mk('t4', 'Catéchisme de l\'Église', 'Magistère', 'theologie', ol(3107380), 'L\'exposé de référence de la foi catholique.'),
  mk('t5', 'Introduction au Christianisme', 'J. Ratzinger', 'theologie', '/covers/introduction-christianisme.jpg', 'La foi chrétienne expliquée par Benoît XVI.'),
  mk('t6', 'Le Credo Expliqué', 'Collectif', 'theologie', '/covers/credo-explique.jpg', 'Article par article, le cœur de la foi catholique.'),
]
