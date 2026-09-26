/**
 * ---------------------------------------------------------------------------
 * SITE CONFIGURATION — SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Language-independent settings and per-language copy for the site. To
 * change any visible text, edit the values here — no UI component needs to
 * be touched.
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
  /** Brand identity — G.S Luxury Residence. */
  brand: {
    /** Official business name. Used in logo alt text, titles and structured data. */
    name: 'G.S Luxury Residence',
    /** Other spellings people search for; used only in structured data. */
    alternateNames: ['GS Luxury Residence', 'GS Luxury Residency'],
    /** The wordmark is set on two lines in the logo. */
    nameLines: ['GS', 'LUXURY RESIDENCE'] as [string, string],
    shortName: 'GS',
    established: 'EST. MMXXV',
  },

  /** Contact details. */
  contact: {
    phone: '+30 694 593 8948',
    phoneHref: 'tel:+306945938948',
    website: 'gsluxuryresidence.gr',
    websiteHref: 'https://gsluxuryresidence.gr/',
    whatsapp: '+30 694 962 3100',
    whatsappHref: 'https://wa.me/306949623100',
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

  /** Section anchors. Labels live in `content[locale].nav`. */
  nav: [
    { key: 'residences', href: '#residences' },
    { key: 'about', href: '#location' },
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
  saleReady: true,

  /** Default locale used for the first paint and for server-rendered metadata. */
  defaultLocale: 'en' as Locale,

  /**
   * SEO. `url` is the one canonical origin (https, no www) — every canonical
   * tag, Open Graph URL, sitemap entry and JSON-LD id is built from it.
   */
  seo: {
    url: 'https://gsluxuryresidence.gr',
    ogImage: '/og.jpg',
    logo: '/images/logo/gs-full-mark.png',
    /**
     * Structured-data address. Mirrors the registered address shown in the
     * footer (`content.*.location.address`) — locality only, no street, because
     * no street address has been confirmed. Keep the two in sync.
     */
    address: { locality: 'Vouliagmeni', region: 'Attica', country: 'GR' },
    /** City the business serves, for structured data. */
    areaServed: 'Athens',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* CONTENT — ENGLISH                                                          */
/* -------------------------------------------------------------------------- */

const en = {
  meta: {
    /** Homepage (`/`). Other routes set their own title in their layout. */
    title: 'G.S Luxury Residence | Luxury Apartments in Athens',
    description:
      'G.S Luxury Residence offers luxury apartments in Athens, Greece — short-stay rentals in Plaka and Voula, and a residence for sale in Piraeus. Explore our properties and photo tours.',
    ogLocale: 'en_GB',
    rent: {
      title: 'Luxury Apartments for Rent in Athens',
      description:
        'Explore luxury short-stay apartments for rent in Athens — in Plaka below the Acropolis and in Voula by the sea — with verified details, photo tours and live Airbnb availability.',
    },
    sale: {
      title: 'Property for Sale in Piraeus',
      description:
        'Residences for sale from G.S Luxury Residence — currently a bright corner apartment in Kallipoli, Piraeus, with owner-verified details, photo tours and viewings arranged directly.',
    },
  },

  brand: { tagline: 'ATHENS APARTMENTS TO RENT' },

  nav: {
    residences: 'RENTALS',
    /** Same nav slot as `residences`, shown instead of it on `/sale`. */
    property: 'PROPERTY',
    location: 'LOCATION',
    about: 'ABOUT',
    contact: 'CONTACT',
  },

  cta: {
    hero: 'VIEW APARTMENTS TO RENT',
    scroll: 'EXPLORE THE RENTALS',
    viewResidence: 'VIEW RENTAL',
    viewOnAirbnb: 'VIEW ON AIRBNB',
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


  location: {
    index: '03',
    label: 'THE LOCATION',
    headline: ['TWO ADDRESSES.', 'ONE CITY.'],
    body:
      'Two neighbourhoods, two very different sides of Athens — steps from the Acropolis in Plaka, and a short walk from the sea in Voula.',
    city: 'Athens',
    country: 'Greece',
    /** The registered address, shown in the footer's bottom line. */
    address: 'Vouliagmeni, Attica',
  },

  /**
   * The entry gate. Two routes into the site — rentals are live, sales are
   * being prepared. Add the sale listings and flip `saleReady` in siteConfig.
   */
  chooser: {
    headline: ['HOW WOULD YOU', 'LIKE TO LIVE?'],
    note: 'Choose a collection to begin.',
    rent: {
      index: '01',
      title: 'RENT',
      description: 'A curated collection of furnished Athens apartments, ready to book on Airbnb.',
      action: 'VIEW RENTALS',
    },
    sale: {
      index: '02',
      title: 'BUY',
      description: 'A curated collection of Athens and Piraeus residences for sale.',
      action: 'VIEW SALES',
      badge: 'COMING SOON',
    },
  },

  /**
   * The sales collection at `/sale`. Mirrors the rental page section for
   * section, so the same components render both with different copy.
   */
  /**
   * The sales collection at `/sale`. Currently one listing, so the copy
   * speaks to that specific property rather than a growing "collection" —
   * revisit the framing if a second listing is added.
   */
  sale: {
    /** Shown in the footer on `/sale`, in place of the rental tagline. */
    tagline: 'RESIDENCES FOR SALE · ATHENS & PIRAEUS',
    hero: {
      eyebrow: 'RESIDENCE FOR SALE · KALLIPOLI, PIRAEUS',
      headline: ['ROOM TO', 'CALL HOME.'],
      body: 'A bright, corner and dual-aspect apartment in Kallipoli, Piraeus — three spacious bedrooms, wrap-around balconies and space to settle in. Explore the full specification, then arrange a viewing directly with us.',
    },
    cta: {
      hero: 'VIEW THE APARTMENT',
      scroll: 'EXPLORE THE DETAILS',
    },
    intro: {
      index: '01',
      label: 'THE PROPERTY',
      headline: ['SPACE, LIGHT', 'AND POSITION.'],
      body:
        'A corner and dual-aspect apartment in one of the most attractive residential pockets of Piraeus — built for comfortable, everyday living.',
      note:
        'Every detail below is stated by the owner, from room-by-room photography to the exact specification — nothing inferred, nothing embellished.',
      stats: [
        { value: '100 M²', label: 'LIVING SPACE' },
        { value: '3', label: 'BEDROOMS' },
        { value: '1972', label: 'YEAR BUILT' },
      ],
    },
    residences: {
      index: '02',
      label: 'THE APARTMENT',
      headline: ['KALLIPOLI', 'PIRAEUS.'],
      note:
        'A concise overview, room-by-room photography and the complete specification. Viewings are arranged directly with us.',
    },
    location: {
      index: '03',
      label: 'THE LOCATION',
      headline: ['A QUIET CORNER', 'OF PIRAEUS.'],
      body:
        'Kallipoli — a quiet, sought-after residential neighbourhood on Agias Paraskevis Street, moments from the heart of the port city.',
    },
    finalCta: {
      headline: ['ARRANGE A', 'VIEWING.'],
      note: 'RESIDENCE FOR SALE · SPEAK WITH US DIRECTLY',
    },
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
    whatsapp: 'WHATSAPP',
    aspect: 'ASPECT',
    description: 'DESCRIPTION',
    features: 'FEATURES',
    monthlyRent: 'MONTHLY RENT',
    perMonth: 'PER MONTH',
    askingPrice: 'ASKING PRICE',
    yearBuilt: 'YEAR BUILT',
    commonExpenses: 'COMMON EXPENSES',
    contactUs: 'CONTACT US',
    viewingEnquiries: 'VIEWINGS & ENQUIRIES',
    availability: 'AVAILABILITY',
    minimumTerm: 'MINIMUM TERM',
    months: 'MONTHS',
    nearby: 'NEARBY',
    allCollections: 'ALL COLLECTIONS',
    rights: 'ALL RIGHTS RESERVED.',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    detailAria: 'details',
    viewAria: 'View',
    /* Listing pages (`/rent/<id>`, `/sale/<id>`). */
    home: 'HOME',
    breadcrumb: 'Breadcrumb',
    theLocation: 'THE LOCATION',
    moreResidences: 'MORE RESIDENCES',
    allRentals: 'ALL RENTALS',
    allSales: 'ALL PROPERTIES FOR SALE',
    viewDetails: 'VIEW DETAILS',
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
    title: 'G.S Luxury Residence | Πολυτελή Διαμερίσματα στην Αθήνα',
    description:
      'Η G.S Luxury Residence προσφέρει πολυτελή διαμερίσματα στην Αθήνα — βραχυχρόνια ενοικίαση στην Πλάκα και τη Βούλα, και κατοικία προς πώληση στον Πειραιά.',
    ogLocale: 'el_GR',
    rent: {
      title: 'Πολυτελή Διαμερίσματα προς Ενοικίαση στην Αθήνα',
      description:
        'Ανακαλύψτε πολυτελή διαμερίσματα βραχυχρόνιας ενοικίασης στην Αθήνα, με επιβεβαιωμένες πληροφορίες, πλήρεις φωτογραφικές περιηγήσεις και ζωντανή διαθεσιμότητα στο Airbnb.',
    },
    sale: {
      title: 'Ακίνητο προς Πώληση στον Πειραιά',
      description:
        'Ακίνητα προς πώληση από την G.S Luxury Residence — ένα φωτεινό γωνιακό διαμέρισμα στην Καλλίπολη Πειραιά, με επιβεβαιωμένα στοιχεία, φωτογραφίες και ραντεβού απευθείας μαζί μας.',
    },
  },

  brand: { tagline: 'ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ ΣΤΗΝ ΑΘΗΝΑ' },

  nav: {
    residences: 'ΕΝΟΙΚΙΑΣΕΙΣ',
    property: 'ΑΚΙΝΗΤΟ',
    location: 'ΤΟΠΟΘΕΣΙΑ',
    about: 'ΣΧΕΤΙΚΑ',
    contact: 'ΕΠΙΚΟΙΝΩΝΙΑ',
  },

  cta: {
    hero: 'ΔΕΙΤΕ ΤΑ ΔΙΑΜΕΡΙΣΜΑΤΑ ΠΡΟΣ ΕΝΟΙΚΙΑΣΗ',
    scroll: 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΙΣ ΕΝΟΙΚΙΑΣΕΙΣ',
    viewResidence: 'ΔΕΙΤΕ ΤΟ ΚΑΤΑΛΥΜΑ',
    viewOnAirbnb: 'ΔΕΙΤΕ ΣΤΟ AIRBNB',
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


  location: {
    index: '03',
    label: 'Η ΤΟΠΟΘΕΣΙΑ',
    headline: ['ΔΥΟ ΔΙΕΥΘΥΝΣΕΙΣ.', 'ΜΙΑ ΠΟΛΗ.'],
    body:
      'Δύο διαφορετικές γειτονιές της Αθήνας — λίγα βήματα από την Ακρόπολη στην Πλάκα, και κοντά στη θάλασσα στη Βούλα.',
    city: 'Αθήνα',
    country: 'Ελλάδα',
    address: 'Βουλιαγμένη, Αττικής',
  },

  chooser: {
    headline: ['ΠΩΣ ΘΑ ΘΕΛΑΤΕ', 'ΝΑ ΖΕΙΤΕ;'],
    note: 'Επιλέξτε μια συλλογή για να ξεκινήσετε.',
    rent: {
      index: '01',
      title: 'ΕΝΟΙΚΙΑΣΗ',
      description: 'Μια επιμελημένη συλλογή επιπλωμένων διαμερισμάτων στην Αθήνα, έτοιμη για κράτηση στο Airbnb.',
      action: 'ΔΕΙΤΕ ΤΙΣ ΕΝΟΙΚΙΑΣΕΙΣ',
    },
    sale: {
      index: '02',
      title: 'ΑΓΟΡΑ',
      description: 'Μια επιμελημένη συλλογή ακινήτων προς πώληση στην Αθήνα και τον Πειραιά.',
      action: 'ΔΕΙΤΕ ΤΙΣ ΠΩΛΗΣΕΙΣ',
      badge: 'ΣΥΝΤΟΜΑ',
    },
  },

  sale: {
    tagline: 'ΑΚΙΝΗΤΑ ΠΡΟΣ ΠΩΛΗΣΗ · ΑΘΗΝΑ & ΠΕΙΡΑΙΑΣ',
    hero: {
      eyebrow: 'ΑΚΙΝΗΤΟ ΠΡΟΣ ΠΩΛΗΣΗ · ΚΑΛΛΙΠΟΛΗ, ΠΕΙΡΑΙΑΣ',
      headline: ['ΧΩΡΟΣ ΓΙΑ ΤΟ', 'ΣΠΙΤΙ ΣΑΣ.'],
      body: 'Ένα φωτεινό, γωνιακό και διαμπερές διαμέρισμα στην Καλλίπολη Πειραιά — τρία ευρύχωρα υπνοδωμάτια, περιμετρικά μπαλκόνια και χώρος για να νιώσετε σπίτι σας. Δείτε την πλήρη περιγραφή και κλείστε ραντεβού απευθείας μαζί μας.',
    },
    cta: {
      hero: 'ΔΕΙΤΕ ΤΟ ΔΙΑΜΕΡΙΣΜΑ',
      scroll: 'ΔΕΙΤΕ ΟΛΕΣ ΤΙΣ ΛΕΠΤΟΜΕΡΕΙΕΣ',
    },
    intro: {
      index: '01',
      label: 'ΤΟ ΑΚΙΝΗΤΟ',
      headline: ['ΧΩΡΟΣ, ΦΩΣ', 'ΚΑΙ ΘΕΣΗ.'],
      body:
        'Ένα γωνιακό και διαμπερές διαμέρισμα σε μία από τις πιο όμορφες γειτονιές του Πειραιά — σχεδιασμένο για άνετη, καθημερινή διαβίωση.',
      note:
        'Κάθε λεπτομέρεια παρακάτω δηλώνεται από τον ιδιοκτήτη, από τις φωτογραφίες κάθε χώρου έως την ακριβή περιγραφή — τίποτα δεν είναι υποθετικό.',
      stats: [
        { value: '100 Τ.Μ.', label: 'ΕΠΙΦΑΝΕΙΑ' },
        { value: '3', label: 'ΥΠΝΟΔΩΜΑΤΙΑ' },
        { value: '1972', label: 'ΕΤΟΣ ΚΑΤΑΣΚΕΥΗΣ' },
      ],
    },
    residences: {
      index: '02',
      label: 'ΤΟ ΔΙΑΜΕΡΙΣΜΑ',
      headline: ['ΚΑΛΛΙΠΟΛΗ', 'ΠΕΙΡΑΙΑΣ.'],
      note:
        'Μια σύντομη παρουσίαση, φωτογραφίες ανά χώρο και η πλήρης περιγραφή του ακινήτου. Τα ραντεβού κλείνονται απευθείας μαζί μας.',
    },
    location: {
      index: '03',
      label: 'Η ΤΟΠΟΘΕΣΙΑ',
      headline: ['ΜΙΑ ΗΣΥΧΗ ΓΩΝΙΑ', 'ΤΟΥ ΠΕΙΡΑΙΑ.'],
      body:
        'Καλλίπολη — μια ήσυχη και περιζήτητη γειτονιά στην οδό Αγίας Παρασκευής, λίγα λεπτά από την καρδιά της πόλης του λιμανιού.',
    },
    finalCta: {
      headline: ['ΚΛΕΙΣΤΕ', 'ΡΑΝΤΕΒΟΥ.'],
      note: 'ΑΚΙΝΗΤΟ ΠΡΟΣ ΠΩΛΗΣΗ · ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΑΠΕΥΘΕΙΑΣ ΜΑΖΙ ΜΑΣ',
    },
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
    residence: 'ΚΑΤΑΛΥΜΑ',
    photo: 'ΦΩΤΟ',
    telephone: 'ΤΗΛΕΦΩΝΟ',
    whatsapp: 'WHATSAPP',
    aspect: 'ΠΡΟΣΑΝΑΤΟΛΙΣΜΟΣ',
    description: 'ΠΕΡΙΓΡΑΦΗ',
    features: 'ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ',
    monthlyRent: 'ΜΗΝΙΑΙΟ ΜΙΣΘΩΜΑ',
    perMonth: 'ΤΟΝ ΜΗΝΑ',
    askingPrice: 'ΤΙΜΗ ΠΩΛΗΣΗΣ',
    yearBuilt: 'ΕΤΟΣ ΚΑΤΑΣΚΕΥΗΣ',
    commonExpenses: 'ΚΟΙΝΟΧΡΗΣΤΑ',
    contactUs: 'ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ',
    viewingEnquiries: 'ΕΠΙΣΚΕΨΕΙΣ & ΠΛΗΡΟΦΟΡΙΕΣ',
    availability: 'ΔΙΑΘΕΣΙΜΟΤΗΤΑ',
    minimumTerm: 'ΕΛΑΧΙΣΤΗ ΔΙΑΡΚΕΙΑ',
    months: 'ΜΗΝΕΣ',
    nearby: 'ΚΟΝΤΑ ΣΑΣ',
    allCollections: 'ΟΛΕΣ ΟΙ ΣΥΛΛΟΓΕΣ',
    rights: 'ΜΕ ΕΠΙΦΥΛΑΞΗ ΠΑΝΤΟΣ ΔΙΚΑΙΩΜΑΤΟΣ.',
    previousImage: 'Προηγούμενη εικόνα',
    nextImage: 'Επόμενη εικόνα',
    detailAria: 'λεπτομέρειες',
    viewAria: 'Δείτε',
    home: 'ΑΡΧΙΚΗ',
    breadcrumb: 'Διαδρομή',
    theLocation: 'Η ΤΟΠΟΘΕΣΙΑ',
    moreResidences: 'ΠΕΡΙΣΣΟΤΕΡΑ ΚΑΤΑΛΥΜΑΤΑ',
    allRentals: 'ΟΛΕΣ ΟΙ ΕΝΟΙΚΙΑΣΕΙΣ',
    allSales: 'ΟΛΑ ΤΑ ΑΚΙΝΗΤΑ ΠΡΟΣ ΠΩΛΗΣΗ',
    viewDetails: 'ΔΕΙΤΕ ΛΕΠΤΟΜΕΡΕΙΕΣ',
  },

  status: {
    AVAILABLE: 'ΔΙΑΘΕΣΙΜΗ',
    RESERVED: 'ΔΕΣΜΕΥΜΕΝΗ',
    LET: 'ΕΝΟΙΚΙΑΣΜΕΝΗ',
  },
};

export const content: Record<Locale, Content> = { en, el };

export type SiteConfig = typeof siteConfig;
