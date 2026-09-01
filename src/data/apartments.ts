/**
 * ---------------------------------------------------------------------------
 * RENTAL DATA - owner supplied listings.
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

export interface PhotoSectionCopy {
  title: string;
  details: string;
}

/** Ordered room group used by the full photo-tour overlay. */
export interface PhotoSection {
  id: 'living-room' | 'full-kitchen' | 'bedroom' | 'full-bathroom' | 'balcony' | 'additional';
  i18n: Record<Locale, PhotoSectionCopy>;
  images: ResidenceImage[];
}

export type ResidenceStatus = 'AVAILABLE' | 'RESERVED' | 'LET' | 'DETAILS_PENDING';

/** The translated half of a residence. */
export interface ApartmentCopy {
  name: string;
  /** Short editorial line shown beside the number. */
  subtitle: string;
  level: string;
  orientation: string;
  description: string;
  features: string[];
  amenities?: string[];
  amenityGroups?: Array<{ title: string; items: string[] }>;
  extraServices?: string[];
  importantNotes?: string[];
  /** When the residence becomes available to occupy. */
  availableFrom: string;
}

export interface Apartment {
  id: string;
  number: string;
  area?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  parking?: number;
  /** Monthly rent in the base currency (see siteConfig.currency.base). */
  rent?: number;
  /** Shortest lease the landlord will sign, in months. */
  minimumTermMonths?: number;
  status: ResidenceStatus;
  listingUrl?: string;
  registrationNumber?: string;
  rating?: number;
  reviewCount?: number;
  host?: string;
  hostBadge?: string;
  dataStatus?: 'complete' | 'pending';
  images: ResidenceImage[];
  photoSections?: PhotoSection[];
  i18n: Record<Locale, ApartmentCopy>;
}

const legacyDemoApartments: Apartment[] = [
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

/**
 * Live rental inventory. The legacy demo array above is intentionally not
 * exported and can be removed after the second real listing is supplied.
 * Images remain clearly labelled placeholders for now.
 */
const gsPhoto = (file: string, alt: string): ResidenceImage => ({
  src: `/images/apartments/gs-luxury-residence-plaka/${file}`,
  alt,
});

const voulaPhoto = (file: string, alt: string): ResidenceImage => ({
  src: `/images/apartments/gs-luxury-residence-voula/${file}`,
  alt,
});

const voulaPhotos = {
  livingRoom: [
    voulaPhoto('main-01.avif', 'Living room and contemporary artwork at GS Luxury Residence Voula'),
    voulaPhoto('main-02.jpeg', 'Living room television area with architectural lighting'),
    voulaPhoto('photo-02.avif', 'Living room seating and decorative details'),
  ],
  kitchen: [
    voulaPhoto('photo-08.avif', 'Full fitted kitchen at GS Luxury Residence Voula'),
  ],
  bedroom: [
    voulaPhoto('main-03.avif', 'Queen bedroom with private balcony access'),
    voulaPhoto('photo-03.avif', 'Bedroom view toward the open-plan residence'),
  ],
  bathroom: [
    voulaPhoto('photo-01.avif', 'Black marble bathroom and illuminated vanity'),
    voulaPhoto('photo-06.avif', 'Full bathroom with glass shower enclosure'),
  ],
  balcony: [
    voulaPhoto('main-04.avif', 'Private balcony and outdoor seating area'),
    voulaPhoto('photo-04.avif', 'Neighbourhood view from the private balcony'),
  ],
  additional: [
    voulaPhoto('photo-05.avif', 'Apartment security keypad and entrance controls'),
    voulaPhoto('photo-07.avif', 'Additional queen bedroom view'),
  ],
};

const gsPhotos = {
  livingRoom: [
    gsPhoto('living-room-01.avif', 'Living room at GS Luxury Residence Plaka'),
    gsPhoto('living-room-02.avif', 'Living room seating and interior details'),
  ],
  kitchen: [
    gsPhoto('kitchen-main.avif', 'Full kitchen at GS Luxury Residence Plaka'),
    gsPhoto('kitchen-01.avif', 'Kitchen hospitality and dining details'),
    gsPhoto('kitchen-02.avif', 'Coffee service and kitchen details'),
  ],
  bedroom: [
    gsPhoto('bedroom-01.avif', 'King bedroom at GS Luxury Residence Plaka'),
    gsPhoto('bedroom-02.avif', 'Second view of the king bedroom'),
    gsPhoto('bedroom-03.avif', 'Bedroom interior and storage'),
    gsPhoto('bedroom-04.avif', 'Bedroom linens and television'),
  ],
  bathroom: [
    gsPhoto('bathroom-01.avif', 'Full black marble bathroom'),
    gsPhoto('bathroom-02.webp', 'Walk-in shower and vanity in the full bathroom'),
    gsPhoto('bathroom-03.avif', 'Bathroom amenities and interior details'),
  ],
  additional: [
    gsPhoto('additional-01.avif', 'Acropolis view from the apartment'),
    gsPhoto('additional-02.avif', 'Additional Acropolis and neighbourhood view'),
    gsPhoto('additional-03.avif', 'Private entrance and apartment details'),
  ],
};

export const apartments: Apartment[] = [
  {
    id: 'gs-luxury-residence-plaka',
    number: '01',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    status: 'AVAILABLE',
    dataStatus: 'complete',
    listingUrl: 'https://www.airbnb.com/rooms/1679830319630435744?source_impression_id=p3_1788288699_P3FWmWBzRUMckq-A',
    registrationNumber: '00003634314',
    rating: 5,
    reviewCount: 25,
    host: 'GS Luxury Residence',
    hostBadge: 'Superhost · 3 years hosting',
    /** Primary carousel supplied by the owner; the grouped tour contains all photos. */
    images: [
      gsPhoto('main-01.avif', 'Main living-room view at GS Luxury Residence Plaka'),
      gsPhoto('main-02.avif', 'Second main view of GS Luxury Residence Plaka'),
      gsPhoto('main-03.avif', 'Third main view of GS Luxury Residence Plaka'),
      gsPhoto('main-04.avif', 'Fourth main view of GS Luxury Residence Plaka'),
    ],
    photoSections: [
      {
        id: 'living-room',
        i18n: {
          en: { title: 'Living room', details: 'Couch · Sound system · Heating · Air conditioning · TV · Books and reading material' },
          el: { title: 'Σαλόνι', details: 'Καναπές · Ηχοσύστημα · Θέρμανση · Κλιματισμός · Τηλεόραση · Βιβλία' },
        },
        images: gsPhotos.livingRoom,
      },
      {
        id: 'full-kitchen',
        i18n: {
          en: { title: 'Full kitchen', details: 'Hot water kettle · Freezer · Coffee maker · Stove · Cooking basics · Dishes and silverware' },
          el: { title: 'Πλήρης κουζίνα', details: 'Βραστήρας · Καταψύκτης · Καφετιέρα · Εστία · Βασικά είδη μαγειρικής · Σερβίτσια' },
        },
        images: gsPhotos.kitchen,
      },
      {
        id: 'bedroom',
        i18n: {
          en: { title: 'Bedroom', details: 'King bed · Extra pillows and blankets · Heating · Air conditioning · Bed linens · Room-darkening shades' },
          el: { title: 'Υπνοδωμάτιο', details: 'King κρεβάτι · Επιπλέον μαξιλάρια και κουβέρτες · Θέρμανση · Κλιματισμός · Λευκά είδη · Κουρτίνες συσκότισης' },
        },
        images: gsPhotos.bedroom,
      },
      {
        id: 'full-bathroom',
        i18n: {
          en: { title: 'Full bathroom', details: 'Shower gel · Hot water · Heating · Air conditioning · Hair dryer · Shampoo · Body soap' },
          el: { title: 'Πλήρες μπάνιο', details: 'Αφρόλουτρο · Ζεστό νερό · Θέρμανση · Κλιματισμός · Σεσουάρ · Σαμπουάν · Σαπούνι σώματος' },
        },
        images: gsPhotos.bathroom,
      },
      {
        id: 'additional',
        i18n: {
          en: { title: 'Additional photos', details: 'Acropolis view · Private entrance · Neighbourhood details' },
          el: { title: 'Πρόσθετες φωτογραφίες', details: 'Θέα Ακρόπολη · Ιδιωτική είσοδος · Λεπτομέρειες γειτονιάς' },
        },
        images: gsPhotos.additional,
      },
    ],
    i18n: {
      en: {
        name: 'GS Luxury Residence Plaka',
        subtitle: 'Acropolis View Balcony',
        level: 'ENTIRE CONDO',
        orientation: 'ACROPOLIS VIEW',
        description: 'A luxury, newly renovated Plaka apartment with an exceptional Acropolis view from its private balcony. Designed for two guests, it combines contemporary comfort with immediate access to Athens’ most celebrated landmarks, restaurants and cocktail bars.',
        features: [
          'TOP 1% OF HOMES',
          'PRIVATE ACROPOLIS-VIEW BALCONY',
          'SELF CHECK-IN WITH LOCKBOX',
          'FULLY EQUIPPED KITCHEN',
          'ELEVATOR ACCESS',
          'CENTRAL PLAKA LOCATION',
        ],
        amenities: [
          'FREE WIFI',
          'AIR CONDITIONING & HEATING',
          'WASHER & LAUNDRY ESSENTIALS',
          'TV & SOUND SYSTEM',
          'NESPRESSO COFFEE MACHINE',
          'BED LINENS & ROOM-DARKENING SHADES',
          'HAIR DRYER & BATH ESSENTIALS',
          'FIRST AID KIT & FIRE EXTINGUISHER',
        ],
        amenityGroups: [
          {
            title: 'Bathroom',
            items: ['Hair dryer', 'Shampoo', 'Body soap', 'Hot water', 'Shower gel'],
          },
          {
            title: 'Bedroom and laundry',
            items: ['Washer', 'Essentials', 'Hangers', 'Bed linens', 'Extra pillows and blankets', 'Room-darkening shades', 'Iron', 'Drying rack for clothing', 'Wardrobe'],
          },
          {
            title: 'Entertainment',
            items: ['TV', 'Sound system', 'Books and reading material'],
          },
          {
            title: 'Heating and cooling',
            items: ['Air conditioning', 'Heating'],
          },
          {
            title: 'Home safety',
            items: ['Fire extinguisher', 'First aid kit'],
          },
          {
            title: 'Internet and office',
            items: ['Free WiFi'],
          },
          {
            title: 'Kitchen and dining',
            items: ['Full kitchen', 'Refrigerator', 'Cooking basics', 'Pots and pans', 'Oil, salt and pepper', 'Dishes and silverware', 'Freezer', 'Electric stove', 'Hot water kettle', 'Nespresso espresso machine', 'Wine glasses', 'Baking sheet', 'Dining table'],
          },
          {
            title: 'Outdoor',
            items: ['Private patio or balcony', 'Table and two chairs with Acropolis view'],
          },
          {
            title: 'Parking and facilities',
            items: ['Elevator'],
          },
          {
            title: 'Services',
            items: ['Self check-in', 'Lockbox', 'Housekeeping available at extra cost'],
          },
          {
            title: 'Location',
            items: ['2–8 minutes to Syntagma, Monastiraki, Metro, Acropolis Museum, Ermou and major historic sites', '5 minutes to leading restaurants and cocktail bars'],
          },
        ],
        extraServices: [
          'PROFESSIONAL LAUNDRY SERVICE',
          'PRIVATE AIRPORT OR PORT TRANSFER',
          'HOUSEKEEPING',
        ],
        importantNotes: [
          'Extra services are available upon advance request and for an additional fee.',
          'A dryer is not available.',
          'The listing states that smoke and carbon monoxide alarms are not available; guests should contact the host with any questions.',
          'No exterior security cameras are listed on the property.',
        ],
        availableFrom: 'CHECK LIVE DATES ON AIRBNB',
      },
      el: {
        name: 'GS Luxury Residence Plaka',
        subtitle: 'Μπαλκόνι με θέα την Ακρόπολη',
        level: 'ΟΛΟΚΛΗΡΟ ΔΙΑΜΕΡΙΣΜΑ',
        orientation: 'ΘΕΑ ΑΚΡΟΠΟΛΗ',
        description: 'Ένα πολυτελές, πρόσφατα ανακαινισμένο διαμέρισμα στην Πλάκα με εξαιρετική θέα στην Ακρόπολη από το ιδιωτικό μπαλκόνι. Σχεδιασμένο για δύο επισκέπτες, συνδυάζει σύγχρονη άνεση με άμεση πρόσβαση στα σημαντικότερα αξιοθέατα, εστιατόρια και cocktail bars της Αθήνας.',
        features: [
          'ΣΤΟ ΚΟΡΥΦΑΙΟ 1% ΤΩΝ ΚΑΤΑΛΥΜΑΤΩΝ',
          'ΙΔΙΩΤΙΚΟ ΜΠΑΛΚΟΝΙ ΜΕ ΘΕΑ ΑΚΡΟΠΟΛΗ',
          'SELF CHECK-IN ΜΕ ΚΛΕΙΔΟΘΗΚΗ',
          'ΠΛΗΡΩΣ ΕΞΟΠΛΙΣΜΕΝΗ ΚΟΥΖΙΝΑ',
          'ΠΡΟΣΒΑΣΗ ΜΕ ΑΝΕΛΚΥΣΤΗΡΑ',
          'ΚΕΝΤΡΙΚΗ ΤΟΠΟΘΕΣΙΑ ΣΤΗΝ ΠΛΑΚΑ',
        ],
        amenities: [
          'ΔΩΡΕΑΝ WIFI',
          'ΚΛΙΜΑΤΙΣΜΟΣ & ΘΕΡΜΑΝΣΗ',
          'ΠΛΥΝΤΗΡΙΟ & ΕΙΔΗ ΠΛΥΣΗΣ',
          'ΤΗΛΕΟΡΑΣΗ & ΗΧΟΣΥΣΤΗΜΑ',
          'ΜΗΧΑΝΗ ΚΑΦΕ NESPRESSO',
          'ΛΕΥΚΑ ΕΙΔΗ & ΚΟΥΡΤΙΝΕΣ ΣΥΣΚΟΤΙΣΗΣ',
          'ΣΕΣΟΥΑΡ & ΕΙΔΗ ΜΠΑΝΙΟΥ',
          'ΦΑΡΜΑΚΕΙΟ & ΠΥΡΟΣΒΕΣΤΗΡΑΣ',
        ],
        amenityGroups: [
          { title: 'Μπάνιο', items: ['Σεσουάρ', 'Σαμπουάν', 'Σαπούνι σώματος', 'Ζεστό νερό', 'Αφρόλουτρο'] },
          { title: 'Υπνοδωμάτιο και πλύσιμο', items: ['Πλυντήριο', 'Βασικά είδη', 'Κρεμάστρες', 'Λευκά είδη', 'Επιπλέον μαξιλάρια και κουβέρτες', 'Κουρτίνες συσκότισης', 'Σίδερο', 'Απλώστρα', 'Ντουλάπα'] },
          { title: 'Ψυχαγωγία', items: ['Τηλεόραση', 'Ηχοσύστημα', 'Βιβλία και αναγνωστικό υλικό'] },
          { title: 'Θέρμανση και ψύξη', items: ['Κλιματισμός', 'Θέρμανση'] },
          { title: 'Ασφάλεια κατοικίας', items: ['Πυροσβεστήρας', 'Κουτί πρώτων βοηθειών'] },
          { title: 'Internet και εργασία', items: ['Δωρεάν WiFi'] },
          { title: 'Κουζίνα και τραπεζαρία', items: ['Πλήρης κουζίνα', 'Ψυγείο', 'Βασικά είδη μαγειρικής', 'Κατσαρόλες και τηγάνια', 'Λάδι, αλάτι και πιπέρι', 'Πιάτα και μαχαιροπίρουνα', 'Καταψύκτης', 'Ηλεκτρική εστία', 'Βραστήρας', 'Μηχανή espresso Nespresso', 'Ποτήρια κρασιού', 'Ταψί', 'Τραπεζαρία'] },
          { title: 'Εξωτερικός χώρος', items: ['Ιδιωτικό αίθριο ή μπαλκόνι', 'Τραπέζι και δύο καρέκλες με θέα στην Ακρόπολη'] },
          { title: 'Εγκαταστάσεις', items: ['Ανελκυστήρας'] },
          { title: 'Υπηρεσίες', items: ['Self check-in', 'Κλειδοθήκη', 'Καθαρισμός με επιπλέον χρέωση'] },
          { title: 'Τοποθεσία', items: ['2–8 λεπτά από Σύνταγμα, Μοναστηράκι, Μετρό, Μουσείο Ακρόπολης, Ερμού και σημαντικά ιστορικά σημεία', '5 λεπτά από κορυφαία εστιατόρια και cocktail bars'] },
        ],
        extraServices: [
          'ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΥΠΗΡΕΣΙΑ ΠΛΥΝΤΗΡΙΟΥ',
          'ΙΔΙΩΤΙΚΗ ΜΕΤΑΦΟΡΑ ΑΠΟ/ΠΡΟΣ ΑΕΡΟΔΡΟΜΙΟ Ή ΛΙΜΑΝΙ',
          'ΥΠΗΡΕΣΙΑ ΚΑΘΑΡΙΣΜΟΥ',
        ],
        importantNotes: [
          'Οι πρόσθετες υπηρεσίες παρέχονται κατόπιν έγκαιρου αιτήματος και με επιπλέον χρέωση.',
          'Δεν διατίθεται στεγνωτήριο.',
          'Η καταχώρηση αναφέρει ότι δεν υπάρχουν ανιχνευτές καπνού και μονοξειδίου του άνθρακα· επικοινωνήστε με τον οικοδεσπότη για διευκρινίσεις.',
          'Δεν αναφέρονται εξωτερικές κάμερες ασφαλείας στο κατάλυμα.',
        ],
        availableFrom: 'ΔΕΙΤΕ ΤΙΣ ΔΙΑΘΕΣΙΜΕΣ ΗΜΕΡΟΜΗΝΙΕΣ ΣΤΟ AIRBNB',
      },
    },
  },
  {
    id: 'gs-luxury-residence-voula',
    number: '02',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    status: 'AVAILABLE',
    dataStatus: 'complete',
    listingUrl: 'https://www.airbnb.com/rooms/754237364375323704?source_impression_id=p3_1788288709_P3MqyMmZOEuTdRTF',
    registrationNumber: '00002160592',
    rating: 4.75,
    reviewCount: 32,
    host: 'GS Luxury Residence',
    hostBadge: 'Superhost · 3 years hosting',
    /** Owner-supplied main carousel, kept in the requested 1 → 4 order. */
    images: [
      voulaPhoto('main-01.avif', 'Living room at GS Luxury Residence Voula'),
      voulaPhoto('main-02.jpeg', 'Second living-room view at GS Luxury Residence Voula'),
      voulaPhoto('main-03.avif', 'Queen bedroom at GS Luxury Residence Voula'),
      voulaPhoto('main-04.avif', 'Private balcony at GS Luxury Residence Voula'),
    ],
    photoSections: [
      {
        id: 'living-room',
        i18n: {
          en: { title: 'Living room', details: 'TV · Air conditioning · Contemporary seating · Architectural lighting' },
          el: { title: 'Σαλόνι', details: 'Τηλεόραση · Κλιματισμός · Σύγχρονο καθιστικό · Αρχιτεκτονικός φωτισμός' },
        },
        images: voulaPhotos.livingRoom,
      },
      {
        id: 'full-kitchen',
        i18n: {
          en: { title: 'Full kitchen', details: 'Refrigerator · Cooking basics · Dishes and silverware · Nespresso coffee maker' },
          el: { title: 'Πλήρης κουζίνα', details: 'Ψυγείο · Βασικά είδη μαγειρικής · Πιάτα και μαχαιροπίρουνα · Καφετιέρα Nespresso' },
        },
        images: voulaPhotos.kitchen,
      },
      {
        id: 'bedroom',
        i18n: {
          en: { title: 'Bedroom', details: 'Queen bed · Bed linens · Air conditioning · Balcony access' },
          el: { title: 'Υπνοδωμάτιο', details: 'Queen κρεβάτι · Λευκά είδη · Κλιματισμός · Πρόσβαση στο μπαλκόνι' },
        },
        images: voulaPhotos.bedroom,
      },
      {
        id: 'full-bathroom',
        i18n: {
          en: { title: 'Full bathroom', details: 'Glass shower · Hair dryer · Shampoo · Body soap · Hot water' },
          el: { title: 'Πλήρες μπάνιο', details: 'Γυάλινη ντουζιέρα · Σεσουάρ · Σαμπουάν · Σαπούνι σώματος · Ζεστό νερό' },
        },
        images: voulaPhotos.bathroom,
      },
      {
        id: 'balcony',
        i18n: {
          en: { title: 'Balcony', details: 'Private balcony · Outdoor dining area · Neighbourhood view' },
          el: { title: 'Μπαλκόνι', details: 'Ιδιωτικό μπαλκόνι · Υπαίθρια τραπεζαρία · Θέα στη γειτονιά' },
        },
        images: voulaPhotos.balcony,
      },
      {
        id: 'additional',
        i18n: {
          en: { title: 'Additional photos', details: 'Entrance and apartment security details' },
          el: { title: 'Πρόσθετες φωτογραφίες', details: 'Είσοδος και λεπτομέρειες ασφάλειας του διαμερίσματος' },
        },
        images: voulaPhotos.additional,
      },
    ],
    i18n: {
      en: {
        name: 'GS Luxury Residence Voula',
        subtitle: "9' Walk to Beach",
        level: 'ENTIRE CONDO',
        orientation: 'VOULA · BEACH ACCESS',
        description:
          'A private condo in Voula designed for two guests, with a balcony, full kitchen and shared beach access a short walk away. Self check-in and practical in-stay amenities make it equally comfortable for a short escape or a longer stay.',
        features: [
          '9-MINUTE WALK TO BEACH',
          'SHARED BEACH ACCESS',
          'PRIVATE PATIO OR BALCONY',
          'SELF CHECK-IN WITH LOCKBOX',
          'FULL KITCHEN',
          'LONG-TERM STAYS ALLOWED',
        ],
        amenities: ['Shared beach access', 'Kitchen', 'WiFi', 'TV', 'Washer', 'Air conditioning', 'Private balcony', 'Hair dryer'],
        amenityGroups: [
          { title: 'Bathroom', items: ['Hair dryer', 'Cleaning products', 'Shampoo', 'Body soap', 'Hot water'] },
          { title: 'Bedroom and laundry', items: ['1 queen bed', 'Washer', 'Essentials', 'Towels, bed sheets, soap and toilet paper', 'Iron'] },
          { title: 'Entertainment', items: ['TV'] },
          { title: 'Heating and cooling', items: ['Air conditioning', 'Portable heater'] },
          { title: 'Home safety', items: ['Fire extinguisher', 'First aid kit'] },
          { title: 'Internet and office', items: ['WiFi'] },
          { title: 'Kitchen and dining', items: ['Full kitchen', 'Refrigerator', 'Cooking basics', 'Pots and pans', 'Oil, salt and pepper', 'Dishes and silverware', 'Nespresso coffee maker'] },
          { title: 'Location features', items: ['Shared beach access'] },
          { title: 'Outdoor', items: ['Private patio or balcony', 'Outdoor dining area'] },
          { title: 'Parking and facilities', items: ['Paid parking lot off premises'] },
          { title: 'Services', items: ['Smoking allowed', 'Long-term stays allowed (28 days or more)', 'Self check-in', 'Lockbox', 'Cleaning available during stay'] },
          { title: 'Listing highlights', items: ['Great check-in experience', 'Self check-in with lockbox', 'Hosted by a Superhost'] },
        ],
        extraServices: ['CLEANING AVAILABLE DURING STAY', 'PAID PARKING OFF PREMISES'],
        importantNotes: [
          'A smoke alarm is not reported on the listing; contact the host with any questions.',
          'A carbon monoxide alarm is not reported on the listing; contact the host with any questions.',
          'A dryer is not available.',
          'No exterior security cameras are listed on the property.',
        ],
        availableFrom: 'CHECK LIVE DATES ON AIRBNB',
      },
      el: {
        name: 'GS Luxury Residence Voula',
        subtitle: '9 λεπτά με τα πόδια από την παραλία',
        level: 'ΟΛΟΚΛΗΡΟ ΔΙΑΜΕΡΙΣΜΑ',
        orientation: 'ΒΟΥΛΑ · ΠΡΟΣΒΑΣΗ ΣΤΗΝ ΠΑΡΑΛΙΑ',
        description:
          'Ένα ιδιωτικό διαμέρισμα στη Βούλα για δύο επισκέπτες, με μπαλκόνι, πλήρως εξοπλισμένη κουζίνα και κοινόχρηστη πρόσβαση στην παραλία σε μικρή απόσταση με τα πόδια. Το self check-in και οι πρακτικές παροχές το κάνουν ιδανικό τόσο για μια σύντομη απόδραση όσο και για μεγαλύτερη διαμονή.',
        features: [
          '9 ΛΕΠΤΑ ΜΕ ΤΑ ΠΟΔΙΑ ΑΠΟ ΤΗΝ ΠΑΡΑΛΙΑ',
          'ΚΟΙΝΟΧΡΗΣΤΗ ΠΡΟΣΒΑΣΗ ΣΤΗΝ ΠΑΡΑΛΙΑ',
          'ΙΔΙΩΤΙΚΟ ΑΙΘΡΙΟ Ή ΜΠΑΛΚΟΝΙ',
          'SELF CHECK-IN ΜΕ ΚΛΕΙΔΟΘΗΚΗ',
          'ΠΛΗΡΩΣ ΕΞΟΠΛΙΣΜΕΝΗ ΚΟΥΖΙΝΑ',
          'ΔΥΝΑΤΟΤΗΤΑ ΜΑΚΡΟΧΡΟΝΙΑΣ ΔΙΑΜΟΝΗΣ',
        ],
        amenities: ['Πρόσβαση στην παραλία', 'Κουζίνα', 'WiFi', 'Τηλεόραση', 'Πλυντήριο', 'Κλιματισμός', 'Ιδιωτικό μπαλκόνι', 'Σεσουάρ'],
        amenityGroups: [
          { title: 'Μπάνιο', items: ['Σεσουάρ', 'Προϊόντα καθαρισμού', 'Σαμπουάν', 'Σαπούνι σώματος', 'Ζεστό νερό'] },
          { title: 'Υπνοδωμάτιο και πλυντήριο', items: ['1 διπλό κρεβάτι queen', 'Πλυντήριο', 'Βασικά είδη', 'Πετσέτες, σεντόνια, σαπούνι και χαρτί υγείας', 'Σίδερο'] },
          { title: 'Ψυχαγωγία', items: ['Τηλεόραση'] },
          { title: 'Θέρμανση και ψύξη', items: ['Κλιματισμός', 'Φορητή θερμάστρα'] },
          { title: 'Ασφάλεια', items: ['Πυροσβεστήρας', 'Κουτί πρώτων βοηθειών'] },
          { title: 'Internet και εργασία', items: ['WiFi'] },
          { title: 'Κουζίνα και τραπεζαρία', items: ['Πλήρης κουζίνα', 'Ψυγείο', 'Βασικά είδη μαγειρικής', 'Κατσαρόλες και τηγάνια', 'Λάδι, αλάτι και πιπέρι', 'Πιάτα και μαχαιροπίρουνα', 'Καφετιέρα Nespresso'] },
          { title: 'Χαρακτηριστικά τοποθεσίας', items: ['Κοινόχρηστη πρόσβαση στην παραλία'] },
          { title: 'Εξωτερικός χώρος', items: ['Ιδιωτικό αίθριο ή μπαλκόνι', 'Υπαίθρια τραπεζαρία'] },
          { title: 'Στάθμευση και εγκαταστάσεις', items: ['Χώρος στάθμευσης επί πληρωμή εκτός καταλύματος'] },
          { title: 'Υπηρεσίες', items: ['Επιτρέπεται το κάπνισμα', 'Επιτρέπονται διαμονές 28 ημερών ή περισσότερο', 'Self check-in', 'Κλειδοθήκη', 'Καθαρισμός κατά τη διάρκεια της διαμονής'] },
          { title: 'Κύρια χαρακτηριστικά', items: ['Εξαιρετική εμπειρία check-in', 'Self check-in με κλειδοθήκη', 'Φιλοξενία από Superhost'] },
        ],
        extraServices: ['ΚΑΘΑΡΙΣΜΟΣ ΚΑΤΑ ΤΗ ΔΙΑΡΚΕΙΑ ΤΗΣ ΔΙΑΜΟΝΗΣ', 'ΣΤΑΘΜΕΥΣΗ ΕΠΙ ΠΛΗΡΩΜΗ ΕΚΤΟΣ ΚΑΤΑΛΥΜΑΤΟΣ'],
        importantNotes: [
          'Δεν αναφέρεται ανιχνευτής καπνού στην καταχώρηση· επικοινωνήστε με τον οικοδεσπότη για διευκρινίσεις.',
          'Δεν αναφέρεται ανιχνευτής μονοξειδίου του άνθρακα στην καταχώρηση· επικοινωνήστε με τον οικοδεσπότη για διευκρινίσεις.',
          'Δεν διατίθεται στεγνωτήριο.',
          'Δεν αναφέρονται εξωτερικές κάμερες ασφαλείας στο κατάλυμα.',
        ],
        availableFrom: 'ΔΕΙΤΕ ΤΙΣ ΔΙΑΘΕΣΙΜΕΣ ΗΜΕΡΟΜΗΝΙΕΣ ΣΤΟ AIRBNB',
      },
    },
  },
];

export const residenceCount = apartments.length;
