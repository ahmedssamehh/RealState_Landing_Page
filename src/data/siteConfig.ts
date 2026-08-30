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
    { key: 'location', href: '#location' },
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
    title: 'YACHT LAUNDRY — Private Residences', // DEMO
    description:
      'Four private residences available to rent — designed around light, space and modern living. A collection of exclusive homes at a single address.',
    ogLocale: 'en_GB',
  },

  brand: { tagline: 'PRIVATE RESIDENCES' },

  nav: {
    residences: 'RESIDENCES',
    location: 'LOCATION',
    contact: 'CONTACT',
  },

  cta: {
    primary: 'ENQUIRE',
    hero: 'EXPLORE RESIDENCES',
    scroll: 'SCROLL TO DISCOVER',
    final: 'ENQUIRE NOW',
    viewResidence: 'VIEW RESIDENCE',
    requestInformation: 'REQUEST INFORMATION',
  },

  hero: {
    eyebrow: 'A COLLECTION OF FOUR',
    headline: ['THE ART', 'OF LIVING.'],
    subline: ['FOUR PRIVATE RESIDENCES', 'DESIGNED FOR MODERN LIVING.'],
  },

  intro: {
    index: '01',
    label: 'THE PROJECT',
    headline: ['FOUR PRIVATE.', 'ONE ADDRESS.'],
    body:
      'Four residences carved from a single architectural idea — that a home should be measured in light, in silence, and in the distance between you and everything you came here to leave behind.',
    note:
      'Conceived as a private address rather than a development. Poured concrete, travertine, oak and glass, held in proportion by a facade that turns with the sun.',
    stats: [
      { value: '04', label: 'RESIDENCES' },
      { value: '185–320', label: 'SQUARE METRES' },
      { value: '2026', label: 'AVAILABLE FROM' },
    ],
  },

  residences: {
    index: '02',
    label: 'THE RESIDENCES',
    headline: ['FOUR PRIVATE', 'RESIDENCES.'],
    note:
      'Each residence occupies its own position in the building, with its own aspect, its own light and its own relationship to the ground. Select one to view the full specification.',
  },

  transition: {
    headline: ['FOUR HOMES.', 'ONE ADDRESS.'],
    body: 'No two floors repeat. No two views are shared.',
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
    city: 'Athens Riviera',
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

  finalCta: {
    headline: ['YOUR NEXT', 'ADDRESS', 'AWAITS.'],
    note: 'PRIVATE VIEWINGS AVAILABLE',
  },


  /** Small interface labels used across the page. */
  ui: {
    loading: 'LOADING',
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
    title: 'YACHT LAUNDRY — Ιδιωτικές Κατοικίες', // DEMO
    description:
      'Τέσσερις ιδιωτικές κατοικίες προς ενοικίαση — σχεδιασμένες γύρω από το φως, τον χώρο και τη σύγχρονη ζωή. Μια συλλογή αποκλειστικών κατοικιών σε μία διεύθυνση.',
    ogLocale: 'el_GR',
  },

  brand: { tagline: 'ΙΔΙΩΤΙΚΕΣ ΚΑΤΟΙΚΙΕΣ' },

  nav: {
    residences: 'ΚΑΤΟΙΚΙΕΣ',
    location: 'ΤΟΠΟΘΕΣΙΑ',
    contact: 'ΕΠΙΚΟΙΝΩΝΙΑ',
  },

  cta: {
    primary: 'ΕΝΔΙΑΦΕΡΟΜΑΙ',
    hero: 'ΔΕΙΤΕ ΤΙΣ ΚΑΤΟΙΚΙΕΣ',
    scroll: 'ΚΥΛΗΣΤΕ ΓΙΑ ΝΑ ΑΝΑΚΑΛΥΨΕΤΕ',
    final: 'ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΤΩΡΑ',
    viewResidence: 'ΔΕΙΤΕ ΤΗΝ ΚΑΤΟΙΚΙΑ',
    requestInformation: 'ΖΗΤΗΣΤΕ ΠΛΗΡΟΦΟΡΙΕΣ',
  },

  hero: {
    eyebrow: 'ΜΙΑ ΣΥΛΛΟΓΗ ΤΕΣΣΑΡΩΝ',
    headline: ['Η ΤΕΧΝΗ', 'ΤΟΥ ΖΗΝ.'],
    subline: ['ΤΕΣΣΕΡΙΣ ΙΔΙΩΤΙΚΕΣ ΚΑΤΟΙΚΙΕΣ', 'ΣΧΕΔΙΑΣΜΕΝΕΣ ΓΙΑ ΤΗ ΣΥΓΧΡΟΝΗ ΖΩΗ.'],
  },

  intro: {
    index: '01',
    label: 'ΤΟ ΕΡΓΟ',
    headline: ['ΤΕΣΣΕΡΙΣ ΚΑΤΟΙΚΙΕΣ.', 'ΜΙΑ ΔΙΕΥΘΥΝΣΗ.'],
    body:
      'Τέσσερις κατοικίες λαξεμένες από μία και μόνη αρχιτεκτονική ιδέα — ότι ένα σπίτι μετριέται στο φως, στη σιωπή και στην απόσταση που σας χωρίζει από όσα αφήσατε πίσω.',
    note:
      'Σχεδιασμένο ως μια ιδιωτική διεύθυνση και όχι ως ένα ακόμη συγκρότημα. Εμφανές σκυρόδεμα, τραβερτίνης, δρυς και γυαλί, σε αναλογίες που ορίζει μια πρόσοψη η οποία στρέφεται με τον ήλιο.',
    stats: [
      { value: '04', label: 'ΚΑΤΟΙΚΙΕΣ' },
      { value: '185–320', label: 'ΤΕΤΡΑΓΩΝΙΚΑ ΜΕΤΡΑ' },
      { value: '2026', label: 'ΔΙΑΘΕΣΙΜΕΣ ΑΠΟ' },
    ],
  },

  residences: {
    index: '02',
    label: 'ΟΙ ΚΑΤΟΙΚΙΕΣ',
    headline: ['ΤΕΣΣΕΡΙΣ ΙΔΙΩΤΙΚΕΣ', 'ΚΑΤΟΙΚΙΕΣ.'],
    note:
      'Κάθε κατοικία καταλαμβάνει τη δική της θέση στο κτίριο, με τον δικό της προσανατολισμό, το δικό της φως και τη δική της σχέση με το έδαφος. Επιλέξτε μία για να δείτε τα πλήρη χαρακτηριστικά.',
  },

  transition: {
    headline: ['ΤΕΣΣΕΡΑ ΣΠΙΤΙΑ.', 'ΜΙΑ ΔΙΕΥΘΥΝΣΗ.'],
    body: 'Κανένας όροφος δεν επαναλαμβάνεται. Καμία θέα δεν μοιράζεται.',
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
    city: 'Αθηναϊκή Ριβιέρα',
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

  finalCta: {
    headline: ['Η ΕΠΟΜΕΝΗ ΣΑΣ', 'ΔΙΕΥΘΥΝΣΗ', 'ΣΑΣ ΠΕΡΙΜΕΝΕΙ.'],
    note: 'ΙΔΙΩΤΙΚΕΣ ΕΠΙΣΚΕΨΕΙΣ ΚΑΤΟΠΙΝ ΡΑΝΤΕΒΟΥ',
  },


  ui: {
    loading: 'ΦΟΡΤΩΣΗ',
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
