/**
 * ---------------------------------------------------------------------------
 * RENTAL DATA - owner supplied listings.
 * ---------------------------------------------------------------------------
 * The UI reads everything from here.
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
 * files placed in /public.
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
  /** Neighbourhood as Airbnb states it — no invented street address. */
  neighbourhood: string;
  /** Host-stated proximity facts only, verbatim from the listing. */
  proximity: string[];
  description: string;
  features: string[];
  amenities?: string[];
  amenityGroups?: Array<{ title: string; items: string[] }>;
  extraServices?: string[];
  importantNotes?: string[];
  /** Monthly building charge, sale listings only (already localised). */
  commonExpenses?: string;
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
  /** Asking price in the base currency — sale listings only. */
  salePrice?: number;
  /** Year of construction — sale listings only. */
  yearBuilt?: number;
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
        neighbourhood: 'Plaka, Athens',
        proximity: [
          '2–8 minutes to Syntagma, Monastiraki, Metro, Acropolis Museum, Ermou and major historic sites',
          '5 minutes to leading restaurants and cocktail bars',
        ],
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
        subtitle: 'Μπαλκόνι με θέα στην Ακρόπολη',
        level: 'ΟΛΟΚΛΗΡΟ ΔΙΑΜΕΡΙΣΜΑ',
        orientation: 'ΘΕΑ ΑΚΡΟΠΟΛΗ',
        neighbourhood: 'Πλάκα, Αθήνα',
        proximity: [
          '2–8 λεπτά από Σύνταγμα, Μοναστηράκι, Μετρό, Μουσείο Ακρόπολης, Ερμού και σημαντικά ιστορικά σημεία',
          '5 λεπτά από κορυφαία εστιατόρια και cocktail bars',
        ],
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
          'ΚΟΥΤΙ ΠΡΩΤΩΝ ΒΟΗΘΕΙΩΝ & ΠΥΡΟΣΒΕΣΤΗΡΑΣ',
        ],
        amenityGroups: [
          { title: 'Μπάνιο', items: ['Σεσουάρ', 'Σαμπουάν', 'Σαπούνι σώματος', 'Ζεστό νερό', 'Αφρόλουτρο'] },
          { title: 'Υπνοδωμάτιο και πλυντήριο', items: ['Πλυντήριο', 'Βασικά είδη', 'Κρεμάστρες', 'Λευκά είδη', 'Επιπλέον μαξιλάρια και κουβέρτες', 'Κουρτίνες συσκότισης', 'Σίδερο', 'Απλώστρα', 'Ντουλάπα'] },
          { title: 'Ψυχαγωγία', items: ['Τηλεόραση', 'Ηχοσύστημα', 'Βιβλία και αναγνωστικό υλικό'] },
          { title: 'Θέρμανση και ψύξη', items: ['Κλιματισμός', 'Θέρμανση'] },
          { title: 'Ασφάλεια κατοικίας', items: ['Πυροσβεστήρας', 'Κουτί πρώτων βοηθειών'] },
          { title: 'Internet και εργασία', items: ['Δωρεάν WiFi'] },
          { title: 'Κουζίνα και τραπεζαρία', items: ['Πλήρης κουζίνα', 'Ψυγείο', 'Βασικά είδη μαγειρικής', 'Κατσαρόλες και τηγάνια', 'Λάδι, αλάτι και πιπέρι', 'Πιάτα και μαχαιροπίρουνα', 'Καταψύκτης', 'Ηλεκτρική εστία', 'Βραστήρας', 'Μηχανή espresso Nespresso', 'Ποτήρια κρασιού', 'Ταψί', 'Τραπεζαρία'] },
          { title: 'Εξωτερικός χώρος', items: ['Ιδιωτικό αίθριο ή μπαλκόνι', 'Τραπέζι και δύο καρέκλες με θέα στην Ακρόπολη'] },
          { title: 'Στάθμευση και εγκαταστάσεις', items: ['Ανελκυστήρας'] },
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
        neighbourhood: 'Voula, Athens',
        proximity: ['9-minute walk to the beach', 'Shared beach access'],
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
        neighbourhood: 'Βούλα, Αθήνα',
        proximity: ['9 λεπτά με τα πόδια από την παραλία', 'Κοινόχρηστη πρόσβαση στην παραλία'],
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
        amenities: ['Κοινόχρηστη πρόσβαση στην παραλία', 'Κουζίνα', 'WiFi', 'Τηλεόραση', 'Πλυντήριο', 'Κλιματισμός', 'Ιδιωτικό μπαλκόνι', 'Σεσουάρ'],
        amenityGroups: [
          { title: 'Μπάνιο', items: ['Σεσουάρ', 'Προϊόντα καθαρισμού', 'Σαμπουάν', 'Σαπούνι σώματος', 'Ζεστό νερό'] },
          { title: 'Υπνοδωμάτιο και πλυντήριο', items: ['1 διπλό κρεβάτι queen', 'Πλυντήριο', 'Βασικά είδη', 'Πετσέτες, σεντόνια, σαπούνι και χαρτί υγείας', 'Σίδερο'] },
          { title: 'Ψυχαγωγία', items: ['Τηλεόραση'] },
          { title: 'Θέρμανση και ψύξη', items: ['Κλιματισμός', 'Φορητή θερμάστρα'] },
          { title: 'Ασφάλεια κατοικίας', items: ['Πυροσβεστήρας', 'Κουτί πρώτων βοηθειών'] },
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
