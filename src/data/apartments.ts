/**
 * ---------------------------------------------------------------------------
 * RESIDENCE DATA — exactly four apartments.
 * ---------------------------------------------------------------------------
 * All values below are DEMO placeholders. Replace copy, figures and image
 * URLs with the real project data; the UI reads everything from here.
 *
 * Structure:
 *   - Structural facts (number, area, bedrooms, images, price) are stored once
 *     and shared by every language.
 *   - `rent` is the MONTHLY rent as a plain number in the base currency set
 *     in siteConfig (`currency.base`, EUR by default). The UI converts and
 *     formats it, so switching currency never requires editing this file.
 *   - `i18n` holds the translated copy for each language. Add a language by
 *     adding a key here and in `content` (siteConfig.ts).
 *
 * Image URLs may be remote (whitelist the host in next.config.mjs) or local
 * files placed in /public. The photography below is generic placeholder
 * imagery — replace both `src` and `alt` with the project's own shots and
 * accurate descriptions.
 * ---------------------------------------------------------------------------
 */

import type { Locale } from './siteConfig';

export interface ResidenceImage {
  src: string;
  alt: string;
}

export type ResidenceStatus = 'AVAILABLE' | 'RESERVED' | 'LET';

/** The translated half of a residence. */
export interface ApartmentCopy {
  name: string;
  /** Short editorial line shown beside the number. */
  subtitle: string;
  level: string;
  orientation: string;
  description: string;
  features: string[];
  /** When the residence becomes available to occupy. */
  availableFrom: string;
}

export interface Apartment {
  id: string;
  number: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  /** Monthly rent in the base currency (see siteConfig.currency.base). */
  rent: number;
  /** Shortest lease the landlord will sign, in months. */
  minimumTermMonths: number;
  status: ResidenceStatus;
  images: ResidenceImage[];
  i18n: Record<Locale, ApartmentCopy>;
}

export const apartments: Apartment[] = [
  {
    id: 'residence-01',
    number: '01',
    area: '185 m²',
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    rent: 4_500, // DEMO — per month
    minimumTermMonths: 12,
    status: 'AVAILABLE',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence One, view 01',
      },
      {
        src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence One, view 02',
      },
      {
        src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence One, view 03',
      },
      {
        src: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence One, view 04',
      },
    ],
    i18n: {
      en: {
        name: 'Residence One',
        subtitle: 'The Garden Residence',
        level: 'GROUND LEVEL',
        orientation: 'SOUTH / WEST',
        description:
          'The ground residence opens directly onto a walled garden, where the interior floor plane continues outward in the same stone. Living, dining and kitchen read as one long volume, held between a planted courtyard on one side and the olive terrace on the other.',
        features: [
          'PRIVATE WALLED GARDEN',
          'OUTDOOR KITCHEN & DINING',
          'TRAVERTINE FLOORS THROUGHOUT',
          'INTEGRATED SMART HOME',
          'DIRECT PARKING ACCESS',
          'GUEST SUITE WITH ENSUITE',
        ],
        availableFrom: 'AVAILABLE NOW',
      },
      el: {
        name: 'Κατοικία Ένα',
        subtitle: 'Η Κατοικία του Κήπου',
        level: 'ΙΣΟΓΕΙΟ',
        orientation: 'ΝΟΤΙΑ / ΔΥΤΙΚΑ',
        description:
          'Η ισόγεια κατοικία ανοίγει απευθείας σε περιτοιχισμένο κήπο, όπου το δάπεδο του εσωτερικού συνεχίζεται προς τα έξω στην ίδια πέτρα. Καθιστικό, τραπεζαρία και κουζίνα διαβάζονται ως ένας ενιαίος επιμήκης χώρος, ανάμεσα σε ένα φυτεμένο αίθριο από τη μία πλευρά και τη βεράντα των ελαιόδεντρων από την άλλη.',
        features: [
          'ΙΔΙΩΤΙΚΟΣ ΠΕΡΙΤΟΙΧΙΣΜΕΝΟΣ ΚΗΠΟΣ',
          'ΥΠΑΙΘΡΙΑ ΚΟΥΖΙΝΑ & ΤΡΑΠΕΖΑΡΙΑ',
          'ΔΑΠΕΔΑ ΤΡΑΒΕΡΤΙΝΗ ΠΑΝΤΟΥ',
          'ΕΝΣΩΜΑΤΩΜΕΝΟΣ ΕΞΥΠΝΟΣ ΕΛΕΓΧΟΣ',
          'ΑΜΕΣΗ ΠΡΟΣΒΑΣΗ ΣΤΗ ΣΤΑΘΜΕΥΣΗ',
          'ΞΕΝΩΝΑΣ ΜΕ ΙΔΙΟ ΜΠΑΝΙΟ',
        ],
        availableFrom: 'ΔΙΑΘΕΣΙΜΗ ΑΜΕΣΑ',
      },
    },
  },
  {
    id: 'residence-02',
    number: '02',
    area: '210 m²',
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    rent: 5_800, // DEMO — per month
    minimumTermMonths: 12,
    status: 'AVAILABLE',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Two, view 01',
      },
      {
        src: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Two, view 02',
      },
      {
        src: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Two, view 03',
      },
      {
        src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Two, view 04',
      },
    ],
    i18n: {
      en: {
        name: 'Residence Two',
        subtitle: 'The Courtyard Residence',
        level: 'FIRST LEVEL',
        orientation: 'SOUTH / EAST',
        description:
          'Arranged around an internal courtyard that draws morning light deep into the plan. Bedrooms sit apart from the living volume, separated by a library corridor lined in oak, so the residence can be quiet in one half while it is occupied in the other.',
        features: [
          'INTERNAL PLANTED COURTYARD',
          'PRIVATE LIFT LOBBY',
          'OAK LIBRARY CORRIDOR',
          'PANORAMIC WINDOWS',
          'ZONED CLIMATE CONTROL',
          'DRESSING ROOM TO PRINCIPAL SUITE',
        ],
        availableFrom: 'AVAILABLE FROM OCTOBER 2026',
      },
      el: {
        name: 'Κατοικία Δύο',
        subtitle: 'Η Κατοικία με το Αίθριο',
        level: 'ΠΡΩΤΟΣ ΟΡΟΦΟΣ',
        orientation: 'ΝΟΤΙΑ / ΑΝΑΤΟΛΙΚΑ',
        description:
          'Οργανωμένη γύρω από ένα εσωτερικό αίθριο που οδηγεί το πρωινό φως βαθιά μέσα στην κάτοψη. Τα υπνοδωμάτια βρίσκονται χωριστά από τον χώρο διαβίωσης, με έναν διάδρομο-βιβλιοθήκη από δρυ να τα διαχωρίζει, ώστε η κατοικία να παραμένει ήσυχη στο ένα μισό ενώ το άλλο χρησιμοποιείται.',
        features: [
          'ΕΣΩΤΕΡΙΚΟ ΦΥΤΕΜΕΝΟ ΑΙΘΡΙΟ',
          'ΙΔΙΩΤΙΚΟΣ ΠΡΟΘΑΛΑΜΟΣ ΑΝΕΛΚΥΣΤΗΡΑ',
          'ΔΙΑΔΡΟΜΟΣ-ΒΙΒΛΙΟΘΗΚΗ ΑΠΟ ΔΡΥ',
          'ΠΑΝΟΡΑΜΙΚΑ ΠΑΡΑΘΥΡΑ',
          'ΚΛΙΜΑΤΙΣΜΟΣ ΚΑΤΑ ΖΩΝΕΣ',
          'ΝΤΡΕΣΙΝΓΚ ΡΟΥΜ ΣΤΗΝ ΚΥΡΙΑ ΣΟΥΙΤΑ',
        ],
        availableFrom: 'ΔΙΑΘΕΣΙΜΗ ΑΠΟ ΟΚΤΩΒΡΙΟ 2026',
      },
    },
  },
  {
    id: 'residence-03',
    number: '03',
    area: '265 m²',
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    rent: 7_500, // DEMO — per month
    minimumTermMonths: 12,
    status: 'LET',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Three, view 01',
      },
      {
        src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Three, view 02',
      },
      {
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Three, view 03',
      },
      {
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Three, view 04',
      },
    ],
    i18n: {
      en: {
        name: 'Residence Three',
        subtitle: 'The Terrace Residence',
        level: 'SECOND LEVEL',
        orientation: 'WEST / SEA',
        description:
          'A single floor given entirely to one home, with a forty-metre terrace running the length of the western facade. The living volume steps down toward the view, so the horizon sits level with the eye from the moment you enter.',
        features: [
          '40M PANORAMIC TERRACE',
          'SEA AND SUNSET ASPECT',
          'FULL-FLOOR PRIVACY',
          'PREMIUM ITALIAN FINISHES',
          'OUTDOOR FIREPLACE',
          'STAFF ENTRANCE & UTILITY',
        ],
        availableFrom: 'LET UNTIL MARCH 2027',
      },
      el: {
        name: 'Κατοικία Τρία',
        subtitle: 'Η Κατοικία με τη Βεράντα',
        level: 'ΔΕΥΤΕΡΟΣ ΟΡΟΦΟΣ',
        orientation: 'ΔΥΤΙΚΑ / ΘΑΛΑΣΣΑ',
        description:
          'Ένας ολόκληρος όροφος αφιερωμένος σε μία μόνο κατοικία, με βεράντα σαράντα μέτρων σε όλο το μήκος της δυτικής όψης. Ο χώρος διαβίωσης κατεβαίνει σταδιακά προς τη θέα, ώστε ο ορίζοντας να βρίσκεται στο ύψος του βλέμματος από τη στιγμή που μπαίνετε.',
        features: [
          'ΠΑΝΟΡΑΜΙΚΗ ΒΕΡΑΝΤΑ 40Μ',
          'ΘΕΑ ΣΤΗ ΘΑΛΑΣΣΑ ΚΑΙ ΤΟ ΗΛΙΟΒΑΣΙΛΕΜΑ',
          'ΙΔΙΩΤΙΚΟΤΗΤΑ ΟΛΟΚΛΗΡΟΥ ΟΡΟΦΟΥ',
          'ΕΚΛΕΚΤΑ ΙΤΑΛΙΚΑ ΦΙΝΙΡΙΣΜΑΤΑ',
          'ΥΠΑΙΘΡΙΟ ΤΖΑΚΙ',
          'ΒΟΗΘΗΤΙΚΗ ΕΙΣΟΔΟΣ & ΧΩΡΟΣ ΥΠΗΡΕΣΙΑΣ',
        ],
        availableFrom: 'ΕΝΟΙΚΙΑΣΜΕΝΗ ΕΩΣ ΜΑΡΤΙΟ 2027',
      },
    },
  },
  {
    id: 'residence-04',
    number: '04',
    area: '320 m²',
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    rent: 11_000, // DEMO — per month
    minimumTermMonths: 12,
    status: 'AVAILABLE',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Four, view 01',
      },
      {
        src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Four, view 02',
      },
      {
        src: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Four, view 03',
      },
      {
        src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=75',
        alt: 'Placeholder photography — Residence Four, view 04',
      },
    ],
    i18n: {
      en: {
        name: 'Residence Four',
        subtitle: 'The Penthouse',
        level: 'UPPER LEVEL',
        orientation: 'PANORAMIC',
        description:
          'The upper residence occupies the crown of the building and opens on all four aspects. A private roof garden with pool sits above the living level, reached by an internal stair in board-marked concrete. The city lies to the north; the sea holds everything else.',
        features: [
          'PRIVATE ROOF GARDEN & POOL',
          'FOUR-ASPECT PANORAMIC GLAZING',
          'INTERNAL SCULPTURAL STAIR',
          'WINE ROOM & CELLAR',
          'SMART HOME & SECURITY SUITE',
          'THREE SECURE PARKING BAYS',
        ],
        availableFrom: 'AVAILABLE FROM JANUARY 2027',
      },
      el: {
        name: 'Κατοικία Τέσσερα',
        subtitle: 'Το Ρετιρέ',
        level: 'ΑΝΩ ΟΡΟΦΟΣ',
        orientation: 'ΠΑΝΟΡΑΜΙΚΟΣ',
        description:
          'Η ανώτερη κατοικία καταλαμβάνει την κορυφή του κτιρίου και ανοίγει και προς τις τέσσερις όψεις. Ένας ιδιωτικός κήπος με πισίνα βρίσκεται πάνω από το επίπεδο διαβίωσης, με πρόσβαση από εσωτερική σκάλα από εμφανές σκυρόδεμα. Η πόλη απλώνεται στα βόρεια· όλα τα υπόλοιπα τα κρατά η θάλασσα.',
        features: [
          'ΙΔΙΩΤΙΚΟΣ ΚΗΠΟΣ ΔΩΜΑΤΟΣ & ΠΙΣΙΝΑ',
          'ΠΑΝΟΡΑΜΙΚΑ ΥΑΛΟΣΤΑΣΙΑ ΣΕ ΤΕΣΣΕΡΙΣ ΟΨΕΙΣ',
          'ΕΣΩΤΕΡΙΚΗ ΓΛΥΠΤΙΚΗ ΣΚΑΛΑ',
          'ΧΩΡΟΣ ΚΑΒΑΣ ΚΡΑΣΙΩΝ',
          'ΕΞΥΠΝΟΣ ΕΛΕΓΧΟΣ & ΣΥΣΤΗΜΑ ΑΣΦΑΛΕΙΑΣ',
          'ΤΡΕΙΣ ΘΕΣΕΙΣ ΣΤΑΘΜΕΥΣΗΣ',
        ],
        availableFrom: 'ΔΙΑΘΕΣΙΜΗ ΑΠΟ ΙΑΝΟΥΑΡΙΟ 2027',
      },
    },
  },
];

export const residenceCount = apartments.length;
