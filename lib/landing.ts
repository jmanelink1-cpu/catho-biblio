import { Icon as I } from '@/components/Icons'
import type { ShelfData } from '@/components/landing/BookShelf'

/** Contenu fixe de la page d'accueil (séparé de la présentation). */

const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`
export const IMG = {
  stainedGlass: u('1438032005730-c779502df39b'),
  cathedral:    u('1473177104440-ffee2f376098'),
  pews:         u('1519491050282-cf00c82424b4'),
  prayer:       u('1499209974431-9dddcece7f88'),
}

const ol = (id: number) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`

export const SHOWCASE: ShelfData[] = [
  { label: 'Bible & Écriture Sainte', category: 'bible', books: [
    { title: 'La Bible de Jérusalem', author: 'École Biblique', cover: '/covers/bible-jerusalem.jpg' },
    { title: 'La Bible de la Liturgie', author: 'AELF', cover: ol(13441794) },
    { title: 'Les Psaumes', author: 'Roi David' },
    { title: 'Le Nouveau Testament', author: 'Traduction officielle', cover: '/covers/nouveau-testament.webp' },
    { title: 'Évangile selon Saint Jean', author: 'Saint Jean', cover: ol(3099801) },
    { title: 'Concordance Biblique', author: 'Collectif', cover: '/covers/concordance.jpg' },
  ]},
  { label: 'Saints & Témoins de la Foi', category: 'saints', books: [
    { title: 'Histoire d\'une Âme', author: 'Ste Thérèse de Lisieux', cover: ol(2143788) },
    { title: 'La Vie de Saint Charbel', author: 'Philippe Beitia', cover: '/covers/saint-charbel.jpg' },
    { title: 'Saint François d\'Assise', author: 'G.K. Chesterton', cover: '/covers/francois-assise.jpg' },
    { title: 'Témoin de l\'Amour Crucifié', author: 'Padre Pio', cover: '/covers/padre-pio.jpg' },
    { title: 'Petit Journal', author: 'Ste Faustine', cover: '/covers/faustine.png' },
    { title: 'Vie de Sainte Bernadette', author: 'François Trochu', cover: ol(15056170) },
  ]},
  { label: 'Spiritualité & Vie Intérieure', category: 'spiritualite', books: [
    { title: 'L\'Imitation de Jésus-Christ', author: 'Thomas a Kempis', cover: '/covers/imitation.webp' },
    { title: 'Les Exercices Spirituels', author: 'St Ignace de Loyola', cover: '/covers/exercices-spirituels.jpg' },
    { title: 'Le Château Intérieur', author: 'Ste Thérèse d\'Avila', cover: ol(3090639) },
    { title: 'L\'Abandon à la Providence', author: 'J.-P. de Caussade', cover: '/covers/abandon-providence.jpg' },
    { title: 'L\'Abandon à l\'Immaculée', author: 'St Maximilien Kolbe', cover: '/covers/abandon-immaculee.jpg' },
    { title: 'La Montée du Carmel', author: 'St Jean de la Croix', cover: '/covers/montee-carmel.jpeg' },
  ]},
  { label: 'Théologie & Doctrine', category: 'theologie', books: [
    { title: 'Somme Théologique', author: 'St Thomas d\'Aquin', cover: '/covers/somme-theologique.jpg' },
    { title: 'Le Concile Vatican II', author: 'Documents conciliaires', cover: '/covers/vatican-ii.jpg' },
    { title: 'Les Pères Apostoliques', author: 'Pères de l\'Église', cover: '/covers/peres-apostoliques.webp' },
    { title: 'Catéchisme de l\'Église', author: 'Magistère', cover: ol(3107380) },
    { title: 'Introduction au Christianisme', author: 'J. Ratzinger', cover: '/covers/introduction-christianisme.jpg' },
    { title: 'Le Credo Expliqué', author: 'Collectif', cover: '/covers/credo-explique.jpg' },
  ]},
]

export const VALUES = [
  { Icon: I.Book,    t: 'Nourrissez votre foi au quotidien', d: 'Vous cherchez à approfondir votre foi ? Une parole, une méditation, un enseignement vous attendent chaque jour, du matin au soir.' },
  { Icon: I.DL,      t: 'Retrouvez une régularité spirituelle', d: 'Vous voulez nourrir votre prière sans relâche ? Tous les livres sont en PDF, à télécharger, pour vous accompagner où que vous soyez.' },
  { Icon: I.Devices, t: 'Ne restez plus seul face à vos questions', d: 'Vous désirez mieux comprendre l\'Église ? La sagesse des Pères, des saints et du Magistère est désormais à portée de votre main.' },
  { Icon: I.Inf,     t: 'Un trésor pour toute une vie', d: 'Un seul paiement, et cette richesse vous appartient pour toujours, sans abonnement, avec toutes les futures additions.' },
]

export const STEPS = [
  { n: '01', t: 'Vous réglez une seule fois', d: 'Un paiement unique, par Mobile Money ou carte bancaire. Pas d\'abonnement, jamais.' },
  { n: '02', t: 'Vous accédez immédiatement',  d: 'Votre bibliothèque s\'ouvre dans les minutes qui suivent. Aucune attente, aucune livraison.' },
  { n: '03', t: 'Vous nourrissez votre âme',   d: 'Parcourez les rayons, ouvrez un livre, méditez, et laissez la sagesse de l\'Église éclairer votre chemin.' },
]

export const TESTIMONIALS = [
  { name: 'Père André M.',    role: 'Prêtre · Douala',        initials: 'PA', text: 'Je consulte cette bibliothèque chaque matin avant la prière. La qualité des ouvrages est remarquable, un véritable trésor pour le ministère.' },
  { name: 'Marie-Noëlle T.',  role: 'Catéchiste · Dakar',      initials: 'MN', text: 'En tant que catéchiste, j\'ai enfin toutes mes ressources au même endroit. Préparer mes cours est devenu un bonheur. Une grâce !' },
  { name: 'Jean-Pierre K.',   role: 'Séminariste · Abidjan',   initials: 'JP', text: 'La Bible de Jérusalem, le Catéchisme, les Pères de l\'Église… tout sur mon téléphone. Exactement ce qu\'il me fallait pour ma formation.' },
]

export const FAQS = [
  { q: 'C\'est vraiment un paiement unique ?',            a: 'Oui. Vous réglez une seule fois. Votre accès est permanent et illimité, jamais de renouvellement ni de frais cachés.' },
  { q: 'Comment accéder aux livres après paiement ?',     a: 'Votre accès est activé immédiatement. Créez votre compte, connectez-vous, et commencez à lire en quelques minutes.' },
  { q: 'Les livres sont-ils téléchargeables ?',           a: 'Oui, tous les ouvrages sont au format PDF, lisibles en ligne et téléchargeables sur vos appareils.' },
  { q: 'Sur combien d\'appareils puis-je l\'utiliser ?',    a: 'Votre accès est utilisable sur 2 appareils avec le même compte — par exemple votre téléphone et votre ordinateur.' },
  { q: 'Quels moyens de paiement acceptez-vous ?',        a: 'Mobile Money (MTN, Orange, Wave, Moov…) et carte bancaire Visa / Mastercard.' },
]
