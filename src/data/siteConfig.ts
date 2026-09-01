/**
 * ---------------------------------------------------------------------------
 * SITE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Everything marked `DEMO` is placeholder content supplied for the design
 * preview only. Replace the values here with the real project data; no UI
 * component needs to be touched.
 *
 * Structure:
 *   siteConfig  — language-independent settings (brand, contact, geometry,
 *                 currency rates, hero mode, SEO defaults)
 *   content     — every piece of visible copy, per language (`en` / `el`)
 *
 * To add a third language: extend `Locale`, add an entry to `content`, and add
 * the label to LOCALES below. Nothing else changes.
 * ---------------------------------------------------------------------------
 */

export type Locale = 'en' | 'el';
export type CurrencyCode = 'EUR' | 'USD';

export const LOCALES: { code: Locale; label: string; htmlLang: string }[] = [
  { code: 'en', label: 'EN', htmlLang: 'en' },
  { code: 'el', label: 'ΕΛ', htmlLang: 'el' },
];

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'USD', label: 'USD', symbol: '$' },
];

export const siteConfig = {
  /** DEMO — placeholder brand identity (temporary preview content). */
  brand: {
    name: 'YACHT LAUNDRY', // DEMO placeholder for the project wordmark
    /** The wordmark is set on two lines in the logo. */
    nameLines: ['YACHT', 'LAUNDRY'] as [string, string], // DEMO
    shortName: 'YL', // DEMO
    established: 'EST. MMXXV',
  },

  /** DEMO — placeholder contact details (temporary preview content). */
  contact: {
    phone: '6945 593948', // DEMO
    phoneHref: 'tel:+306945593948', // DEMO
    email: 'private@yachtlaundry.gr', // DEMO
    website: 'www.yachtlaundry.gr', // DEMO
    websiteHref: 'https://www.yachtlaundry.gr', // DEMO
  },

  /**
   * RENT
   * Every rent in `apartments.ts` is a monthly amount stored as a plain number
   * in the base currency below. Displayed amounts are converted at these
   * rates, so the data never has to be edited when the currency switches.
   * Replace `rates.USD` with the agreed commercial rate (or feed it from an
   * FX endpoint) — it is intentionally a single editable number.
   */
  currency: {
    base: 'EUR' as CurrencyCode,
    default: 'EUR' as CurrencyCode,
    rates: { EUR: 1, USD: 1.08 } as Record<CurrencyCode, number>,
    /**
     * Converted rents are rounded to this step so a switched currency never
     * implies false precision (€4,500 -> $4,900, not $4,860).
     */
    roundTo: 50,
  },

  /** Language-independent geometry and map settings. */
  location: {
    coordinates: { lat: 37.8106, lng: 23.7794 },
    /** Drop a real Google Maps embed URL here to replace the styled placeholder. */
    mapEmbedUrl: '' as string,
  },

  /** Section anchors. Labels live in `content[locale].nav`. */
  nav: [
    { key: 'residences', href: '#residences' },
    { key: 'about', href: '#architecture' },
    { key: 'contact', href: '#contact' },
  ] as const,

  /**
   * HERO VISUAL MODE
   * 'scene' → interactive React Three Fiber architectural scene
   * 'video' → cinematic background video (drop files in /public and set sources)
   */
  hero: {
    mode: 'scene' as 'scene' | 'video',
    video: {
      /** e.g. '/media/hero.webm' — leave empty while previewing the 3D scene. */
      webm: '',
      mp4: '',
      poster: '',
    },
  },

  /**
   * Routes. The site opens on a chooser at `/`; each collection lives on its
   * own route so either can grow independently.
   */
  routes: {
    chooser: '/',
    rent: '/rent',
    sale: '/sale',
  },

  /**
   * Flip to true once the sales listings exist — the chooser drops its
   * "coming soon" badge and `/sale` becomes a real page rather than a notice.
   */
  saleReady: false,

  /** Default locale used for the first paint and for server-rendered metadata. */
  defaultLocale: 'en' as Locale,

  seo: {
    url: 'https://www.yachtlaundry.gr', // DEMO
    ogImage: '/og.jpg', // DEMO — add a 1200x630 image to /public
  },
} as const;

/* -------------------------------------------------------------------------- */
/* CONTENT — ENGLISH                                                          */
/* -------------------------------------------------------------------------- */

const en = {
  meta: {
    title: 'Luxury Apartments for Rent in Athens | YACHT LAUNDRY', // DEMO brand
    description:
      'Explore luxury short-stay apartments for rent in Athens, with verified details, complete photo tours and live Airbnb availability.',
    ogLocale: 'en_GB',
  },

  brand: { tagline: 'ATHENS APARTMENTS TO RENT' },

  nav: {
    residences: 'RENTALS',
    location: 'LOCATION',
    about: 'ABOUT',
    contact: 'CONTACT',
  },

  cta: {
    hero: 'VIEW APARTMENTS TO RENT',
    scroll: 'EXPLORE THE RENTALS',
    viewResidence: 'VIEW RENTAL',
    requestInformation: 'REQUEST INFORMATION',
  },

  hero: {
    eyebrow: 'LUXURY APARTMENTS FOR SHORT-TERM RENT · ATHENS',
    headline: ['YOUR ATHENS', 'STAY AWAITS.'],
    body: 'Browse our apartments available for rent in Athens. Explore verified amenities and complete photo tours, then check live dates directly on Airbnb.',
  },

  intro: {
    index: '01',
    label: 'THE COLLECTION',
    headline: ['CURATED FOR', 'YOUR ATHENS STAY.'],
    body:
      'A considered collection of private Athens stays, chosen for their character, comfort and connection to the city.',
    note:
      'Every address is presented with verified details, honest photography and direct access to live availability.',
    stats: [
      // AUTO_COUNT resolves to the number of residences in apartments.ts, so
      // adding or removing one never leaves a stale figure on the page.
      { value: 'AUTO_COUNT', label: 'PRIVATE STAYS' },
      { value: 'ATHENS', label: 'CITY & COAST' },
      { value: 'AIRBNB', label: 'LIVE AVAILABILITY' },
    ],
  },

  residences: {
    index: '02',
    label: 'APARTMENTS TO RENT',
    headline: ['ATHENS', 'RENTALS.'],
    note:
      'Explore each stay through a concise overview, room-by-room photography and a complete amenity guide. Live dates open directly on Airbnb.',
  },


  lifestyle: {
    index: '03',
    label: 'THE ARCHITECTURE',
    headline: ['DESIGNED', 'AROUND LIFE.'],
    body:
      'Light is treated as a material here. Rooms are oriented to receive it early and hold it late, while deep reveals and shaded terraces keep the interior cool and quiet through the Mediterranean afternoon.',
    pillars: [
      { title: 'LIGHT', text: 'Full-height glazing on two aspects, filtered by a bronze brise-soleil.' },
      { title: 'SPACE', text: 'Three-metre ceilings and uninterrupted living volumes, free of structural walls.' },
      { title: 'PRIVACY', text: 'One residence per level, reached by a private lift lobby.' },
      { title: 'COMFORT', text: 'Zoned climate, acoustic separation and integrated home control throughout.' },
    ],
    /** DEMO imagery — replace with the project's own photography. */
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
    imageAlt: 'Placeholder architectural photography — interior with full-height glazing',
  },

  location: {
    index: '04',
    label: 'THE LOCATION',
    headline: ['THE RIGHT', 'ADDRESS.'],
    body:
      'A quiet street above the coast road, minutes from the marina and the sea, and far enough from the city to forget it is there.',
    city: 'Athens',
    country: 'Greece',
    addressLines: ['14 Apollonos Street', 'Vouliagmeni 166 71', 'Attica, Greece'],
    landmarks: [
      { name: 'Astir Beach', distance: '4 MIN' },
      { name: 'Vouliagmeni Marina', distance: '7 MIN' },
      { name: 'Glyfada Golf Club', distance: '12 MIN' },
      { name: 'Athens International', distance: '28 MIN' },
      { name: 'Acropolis Museum', distance: '32 MIN' },
    ],
  },

  /**
   * The entry gate. Two routes into the site — rentals are live, sales are
   * being prepared. Add the sale listings and flip `saleReady` in siteConfig.
   */
  chooser: {
    eyebrow: 'YACHT LAUNDRY',
    headline: ['HOW WOULD YOU', 'LIKE TO LIVE?'],
    note: 'Choose a collection to begin.',
    rent: {
      index: '01',
      title: 'FOR RENT',
      description: 'Private residences available to lease, ready to move into.',
      action: 'VIEW RENTALS',
    },
    sale: {
      index: '02',
      title: 'FOR SALE',
      description: 'A collection of residences for purchase, arriving shortly.',
      action: 'VIEW SALES',
      badge: 'COMING SOON',
    },
  },

  sale: {
    eyebrow: 'FOR SALE',
    headline: ['A COLLECTION', 'IN PREPARATION.'],
    body:
      'Our sales portfolio is being assembled with the same care as our rentals. Register your interest and you will be among the first to see it.',
    back: 'VIEW RENTALS INSTEAD',
  },

  finalCta: {
    headline: ['BOOK YOUR', 'ATHENS', 'STAY.'],
    note: 'APARTMENTS TO RENT · LIVE AVAILABILITY ON AIRBNB',
  },


  /** Small interface labels used across the page. */
  ui: {
    dragToRotate: 'DRAG TO ROTATE',
    view360: '360° VIEW',
    autoRotate: 'AUTO ROTATE',
    playRotation: 'Start automatic rotation',
    pauseRotation: 'Pause automatic rotation',
    close: 'CLOSE',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    language: 'Language',
    currency: 'Currency',
    area: 'AREA',
    level: 'LEVEL',
    bedrooms: 'BEDROOMS',
    bathrooms: 'BATHROOMS',
    parking: 'PARKING',
    residence: 'RESIDENCE',
    photo: 'PHOTO',
    telephone: 'TELEPHONE',
    email: 'EMAIL',
    aspect: 'ASPECT',
    description: 'DESCRIPTION',
    features: 'FEATURES',
    monthlyRent: 'MONTHLY RENT',
    perMonth: 'PER MONTH',
    availability: 'AVAILABILITY',
    minimumTerm: 'MINIMUM TERM',
    months: 'MONTHS',
    address: 'ADDRESS',
    nearby: 'NEARBY',
    mapPlaceholder: 'MAP PLACEHOLDER',
    allCollections: 'ALL COLLECTIONS',
    rights: 'ALL RIGHTS RESERVED.',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    detailAria: 'details',
    viewAria: 'View',
  },

  status: {
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    LET: 'LET',
  },
};

export type Content = typeof en;

/* -------------------------------------------------------------------------- */
/* CONTENT — GREEK                                                            */
/* -------------------------------------------------------------------------- */

const el: Content = {
  meta: {
    title: 'Πολυτελή Διαμερίσματα προς Ενοικίαση στην Αθήνα | YACHT LAUNDRY', // DEMO brand
    description:
      'Ανακαλύψτε πολυτελή διαμερίσματα βραχυχρόνιας ενοικίασης στην Αθήνα, με επιβεβαιωμένες πληροφορίες, πλήρεις φωτογραφικές περιηγήσεις και ζωντανή διαθεσιμότητα στο Airbnb.',
    ogLocale: 'el_GR',
  },

  brand: { tagline: 'ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ ΣΤΗΝ ΑΘΗΝΑ' },

  nav: {
    residences: 'ΕΝΟΙΚΙΑΣΕΙΣ',
    location: 'ΤΟΠΟΘΕΣΙΑ',
    about: 'ΤΟ ΕΡΓΟ',
    contact: 'ΕΠΙΚΟΙΝΩΝΙΑ',
  },

  cta: {
    hero: 'ΔΕΙΤΕ ΤΑ ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ',
    scroll: 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΙΣ ΕΝΟΙΚΙΑΣΕΙΣ',
    viewResidence: 'ΔΕΙΤΕ ΤΟ ΚΑΤΑΛΥΜΑ',
    requestInformation: 'ΖΗΤΗΣΤΕ ΠΛΗΡΟΦΟΡΙΕΣ',
  },

  hero: {
    eyebrow: 'ΠΟΛΥΤΕΛΗ ΔΙΑΜΕΡΙΣΜΑΤΑ ΒΡΑΧΥΧΡΟΝΙΑΣ ΕΝΟΙΚΙΑΣΗΣ · ΑΘΗΝΑ',
    headline: ['Η ΔΙΑΜΟΝΗ ΣΑΣ', 'ΣΤΗΝ ΑΘΗΝΑ.'],
    body: 'Δείτε τα διαθέσιμα διαμερίσματά μας προς ενοικίαση στην Αθήνα. Εξερευνήστε επιβεβαιωμένες παροχές και πλήρεις φωτογραφικές περιηγήσεις και ελέγξτε ζωντανά τις ημερομηνίες στο Airbnb.',
  },

  intro: {
    index: '01',
    label: 'Η ΣΥΛΛΟΓΗ',
    headline: ['ΕΠΙΛΕΓΜΕΝΑ ΓΙΑ', 'ΤΗ ΔΙΑΜΟΝΗ ΣΑΣ.'],
    body:
      'Μια προσεγμένη συλλογή ιδιωτικών καταλυμάτων στην Αθήνα, επιλεγμένων για τον χαρακτήρα, την άνεση και τη σύνδεσή τους με την πόλη.',
    note:
      'Κάθε διεύθυνση παρουσιάζεται με επιβεβαιωμένες πληροφορίες, αυθεντικές φωτογραφίες και άμεση πρόσβαση στη ζωντανή διαθεσιμότητα.',
    stats: [
      { value: 'AUTO_COUNT', label: 'ΙΔΙΩΤΙΚΑ ΚΑΤΑΛΥΜΑΤΑ' },
      { value: 'ΑΘΗΝΑ', label: 'ΠΟΛΗ & ΑΚΤΗ' },
      { value: 'AIRBNB', label: 'ΖΩΝΤΑΝΗ ΔΙΑΘΕΣΙΜΟΤΗΤΑ' },
    ],
  },

  residences: {
    index: '02',
    label: 'ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ',
    headline: ['ΔΙΑΜΟΝΗ', 'ΣΤΗΝ ΑΘΗΝΑ.'],
    note:
      'Εξερευνήστε κάθε κατάλυμα μέσα από σύντομη παρουσίαση, φωτογραφίες ανά χώρο και πλήρη οδηγό παροχών. Οι διαθέσιμες ημερομηνίες ανοίγουν απευθείας στο Airbnb.',
  },


  lifestyle: {
    index: '03',
    label: 'Η ΑΡΧΙΤΕΚΤΟΝΙΚΗ',
    headline: ['ΣΧΕΔΙΑΣΜΕΝΕΣ', 'ΓΥΡΩ ΑΠΟ ΤΗ ΖΩΗ.'],
    body:
      'Εδώ το φως αντιμετωπίζεται ως υλικό. Οι χώροι είναι προσανατολισμένοι ώστε να το υποδέχονται νωρίς και να το κρατούν ως αργά, ενώ οι βαθιές εσοχές και οι σκιασμένες βεράντες διατηρούν το εσωτερικό δροσερό και ήσυχο όλο το μεσογειακό απόγευμα.',
    pillars: [
      { title: 'ΦΩΣ', text: 'Υαλοστάσια πλήρους ύψους σε δύο όψεις, φιλτραρισμένα από μπρούτζινο περσιδωτό σκίαστρο.' },
      { title: 'ΧΩΡΟΣ', text: 'Ύψος τριών μέτρων και ενιαίοι χώροι διαβίωσης, χωρίς φέροντα τοιχώματα.' },
      { title: 'ΙΔΙΩΤΙΚΟΤΗΤΑ', text: 'Μία κατοικία ανά επίπεδο, με πρόσβαση από ιδιωτικό προθάλαμο ανελκυστήρα.' },
      { title: 'ΑΝΕΣΗ', text: 'Κλιματισμός κατά ζώνες, ηχητική απομόνωση και ενσωματωμένος έλεγχος σε όλη την κατοικία.' },
    ],
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
    imageAlt: 'Ενδεικτική αρχιτεκτονική φωτογραφία — εσωτερικό με υαλοστάσια πλήρους ύψους',
  },

  location: {
    index: '04',
    label: 'Η ΤΟΠΟΘΕΣΙΑ',
    headline: ['Η ΣΩΣΤΗ', 'ΔΙΕΥΘΥΝΣΗ.'],
    body:
      'Ένας ήσυχος δρόμος πάνω από την παραλιακή, λίγα λεπτά από τη μαρίνα και τη θάλασσα, και αρκετά μακριά από την πόλη ώστε να την ξεχνάτε.',
    city: 'Αθήνα',
    country: 'Ελλάδα',
    addressLines: ['Απόλλωνος 14', 'Βουλιαγμένη 166 71', 'Αττική, Ελλάδα'],
    landmarks: [
      { name: 'Παραλία Αστέρας', distance: '4 ΛΕΠΤΑ' },
      { name: 'Μαρίνα Βουλιαγμένης', distance: '7 ΛΕΠΤΑ' },
      { name: 'Γκολφ Γλυφάδας', distance: '12 ΛΕΠΤΑ' },
      { name: 'Αεροδρόμιο Αθηνών', distance: '28 ΛΕΠΤΑ' },
      { name: 'Μουσείο Ακρόπολης', distance: '32 ΛΕΠΤΑ' },
    ],
  },

  chooser: {
    eyebrow: 'YACHT LAUNDRY',
    headline: ['ΠΩΣ ΘΑ ΘΕΛΑΤΕ', 'ΝΑ ΖΕΙΤΕ;'],
    note: 'Επιλέξτε μια συλλογή για να ξεκινήσετε.',
    rent: {
      index: '01',
      title: 'ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ',
      description: 'Ιδιωτικές κατοικίες προς ενοικίαση, έτοιμες για κατοίκηση.',
      action: 'ΔΕΙΤΕ ΤΙΣ ΕΝΟΙΚΙΑΣΕΙΣ',
    },
    sale: {
      index: '02',
      title: 'ΠΡΟΣ ΠΩΛΗΣΗ',
      description: 'Μια συλλογή κατοικιών προς πώληση, σύντομα κοντά σας.',
      action: 'ΔΕΙΤΕ ΤΙΣ ΠΩΛΗΣΕΙΣ',
      badge: 'ΣΥΝΤΟΜΑ',
    },
  },

  sale: {
    eyebrow: 'ΠΡΟΣ ΠΩΛΗΣΗ',
    headline: ['ΜΙΑ ΣΥΛΛΟΓΗ', 'ΥΠΟ ΠΡΟΕΤΟΙΜΑΣΙΑ.'],
    body:
      'Το χαρτοφυλάκιο πωλήσεων ετοιμάζεται με την ίδια φροντίδα όπως και οι ενοικιάσεις μας. Δηλώστε ενδιαφέρον και θα είστε από τους πρώτους που θα το δουν.',
    back: 'ΔΕΙΤΕ ΤΙΣ ΕΝΟΙΚΙΑΣΕΙΣ',
  },

  finalCta: {
    headline: ['ΚΛΕΙΣΤΕ ΤΗ', 'ΔΙΑΜΟΝΗ ΣΑΣ', 'ΣΤΗΝ ΑΘΗΝΑ.'],
    note: 'ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ · ΖΩΝΤΑΝΗ ΔΙΑΘΕΣΙΜΟΤΗΤΑ ΣΤΟ AIRBNB',
  },


  ui: {
    dragToRotate: 'ΣΥΡΕΤΕ ΓΙΑ ΠΕΡΙΣΤΡΟΦΗ',
    view360: 'ΠΡΟΒΟΛΗ 360°',
    autoRotate: 'ΑΥΤΟΜΑΤΗ ΠΕΡΙΣΤΡΟΦΗ',
    playRotation: 'Έναρξη αυτόματης περιστροφής',
    pauseRotation: 'Παύση αυτόματης περιστροφής',
    close: 'ΚΛΕΙΣΙΜΟ',
    menuOpen: 'Άνοιγμα μενού',
    menuClose: 'Κλείσιμο μενού',
    language: 'Γλώσσα',
    currency: 'Νόμισμα',
    area: 'ΕΜΒΑΔΟΝ',
    level: 'ΕΠΙΠΕΔΟ',
    bedrooms: 'ΥΠΝΟΔΩΜΑΤΙΑ',
    bathrooms: 'ΜΠΑΝΙΑ',
    parking: 'ΣΤΑΘΜΕΥΣΗ',
    residence: 'ΚΑΤΟΙΚΙΑ',
    photo: 'ΦΩΤΟ',
    telephone: 'ΤΗΛΕΦΩΝΟ',
    email: 'EMAIL',
    aspect: 'ΠΡΟΣΑΝΑΤΟΛΙΣΜΟΣ',
    description: 'ΠΕΡΙΓΡΑΦΗ',
    features: 'ΠΑΡΟΧΕΣ',
    monthlyRent: 'ΜΗΝΙΑΙΟ ΜΙΣΘΩΜΑ',
    perMonth: 'ΤΟΝ ΜΗΝΑ',
    availability: 'ΔΙΑΘΕΣΙΜΟΤΗΤΑ',
    minimumTerm: 'ΕΛΑΧΙΣΤΗ ΔΙΑΡΚΕΙΑ',
    months: 'ΜΗΝΕΣ',
    address: 'ΔΙΕΥΘΥΝΣΗ',
    nearby: 'ΚΟΝΤΑ ΣΑΣ',
    mapPlaceholder: 'ΘΕΣΗ ΧΑΡΤΗ',
    allCollections: 'ΟΛΕΣ ΟΙ ΣΥΛΛΟΓΕΣ',
    rights: 'ΜΕ ΕΠΙΦΥΛΑΞΗ ΠΑΝΤΟΣ ΔΙΚΑΙΩΜΑΤΟΣ.',
    previousImage: 'Προηγούμενη εικόνα',
    nextImage: 'Επόμενη εικόνα',
    detailAria: 'λεπτομέρειες',
    viewAria: 'Δείτε',
  },

  status: {
    AVAILABLE: 'ΔΙΑΘΕΣΙΜΗ',
    RESERVED: 'ΔΕΣΜΕΥΜΕΝΗ',
    LET: 'ΕΝΟΙΚΙΑΣΜΕΝΗ',
  },
};

export const content: Record<Locale, Content> = { en, el };

export type SiteConfig = typeof siteConfig;
