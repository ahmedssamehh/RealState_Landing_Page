/**
 * ---------------------------------------------------------------------------
 * SALE DATA — owner supplied listings.
 * ---------------------------------------------------------------------------
 * The sales collection shown on `/sale`. It reuses the `Apartment` shape from
 * apartments.ts so the same components render both collections; the fields
 * that only make sense for a letting (rent, Airbnb listing, reviews, host)
 * are simply left unset, and the sale-only fields (`salePrice`, `yearBuilt`,
 * `commonExpenses`) are filled in instead.
 *
 * Every figure below is stated by the owner. Nothing is inferred: where a
 * detail was not supplied it is absent rather than guessed.
 * ---------------------------------------------------------------------------
 */

import type { Apartment } from './apartments';

const photo = (file: string, alt: string) => ({
  src: `/images/properties/kallipoli-piraeus/${file}`,
  alt,
});

export const saleProperties: Apartment[] = [
  {
    id: 'kallipoli-piraeus-corner-apartment',
    number: '01',
    area: '100 m²',
    bedrooms: 3,
    bathrooms: 1,
    yearBuilt: 1972,
    salePrice: 250000,
    status: 'AVAILABLE',
    dataStatus: 'complete',
    images: [
      photo('main-01.jpg', 'Living room of the corner apartment in Kallipoli, Piraeus'),
      photo('main-02.jpg', 'Bedroom of the corner apartment in Kallipoli, Piraeus'),
      photo('main-03.jpg', 'Kitchen of the corner apartment in Kallipoli, Piraeus'),
      photo('main-04.jpg', 'Entrance hallway of the corner apartment in Kallipoli, Piraeus'),
    ],
    photoSections: [
      {
        id: 'living-room',
        i18n: {
          en: { title: 'Living room', details: 'Corner and dual-aspect · Bright throughout · Balcony access' },
          el: { title: 'Σαλόνι', details: 'Γωνιακό και διαμπερές · Φωτεινό · Πρόσβαση στο μπαλκόνι' },
        },
        images: [
          photo('main-01.jpg', 'Living room of the corner apartment in Kallipoli, Piraeus'),
          photo('living-room-02.jpg', 'Corner living room with dual balcony doors in Kallipoli, Piraeus'),
          photo('living-room-03.jpg', 'Living room with the front door in Kallipoli, Piraeus'),
        ],
      },
      {
        id: 'full-kitchen',
        i18n: {
          en: { title: 'Kitchen', details: 'Separate kitchen' },
          el: { title: 'Κουζίνα', details: 'Ανεξάρτητη κουζίνα' },
        },
        images: [photo('main-03.jpg', 'Kitchen of the corner apartment in Kallipoli, Piraeus')],
      },
      {
        id: 'bedroom',
        i18n: {
          en: { title: 'Bedrooms', details: 'Three spacious bedrooms · Central heating · Air conditioning' },
          el: { title: 'Υπνοδωμάτια', details: 'Τρία ευρύχωρα υπνοδωμάτια · Κεντρική θέρμανση · Κλιματισμός' },
        },
        images: [
          photo('main-02.jpg', 'Bedroom of the corner apartment in Kallipoli, Piraeus'),
          photo('bedroom-02.jpg', 'Second bedroom with balcony access in Kallipoli, Piraeus'),
        ],
      },
      {
        id: 'full-bathroom',
        i18n: {
          en: { title: 'Bathroom', details: 'Bathtub · Bidet · Pedestal sink' },
          el: { title: 'Μπάνιο', details: 'Μπανιέρα · Μπιντέ · Νιπτήρας' },
        },
        images: [photo('bathroom-01.jpg', 'Bathroom of the corner apartment in Kallipoli, Piraeus')],
      },
      {
        id: 'balcony',
        i18n: {
          en: { title: 'Balconies', details: 'Wrap-around balconies · Corner position' },
          el: { title: 'Μπαλκόνια', details: 'Περιμετρικά μπαλκόνια · Γωνιακή θέση' },
        },
        images: [
          photo('balcony-01.jpg', 'Wrap-around balcony of the corner apartment in Kallipoli, Piraeus'),
          photo('balcony-02.jpg', 'Balcony view over the street in Kallipoli, Piraeus'),
        ],
      },
      {
        id: 'additional',
        i18n: {
          en: { title: 'Additional photos', details: 'Sea view, entrance hallway and the building' },
          el: { title: 'Πρόσθετες φωτογραφίες', details: 'Θέα στη θάλασσα, είσοδος και πολυκατοικία' },
        },
        images: [
          photo('additional-01-sea-view.jpg', 'Sea view from the building in Kallipoli, Piraeus'),
          photo('main-04.jpg', 'Entrance hallway of the corner apartment in Kallipoli, Piraeus'),
          photo('additional-05-unit-door.jpg', 'Apartment entrance door, interior side'),
          photo('additional-06-unit-door-inside.jpg', 'Apartment entrance door, hallway side'),
          photo('additional-02-stairwell.jpg', 'Building stairwell in Kallipoli, Piraeus'),
          photo('additional-03-entrance.jpg', 'Building entrance on Agias Paraskevis Street'),
          photo('additional-04-elevator.jpg', 'Building elevator'),
        ],
      },
    ],
    i18n: {
      en: {
        name: 'Kallipoli Corner Apartment',
        subtitle: 'Corner & Dual Aspect · 100 m²',
        level: 'ENTIRE APARTMENT',
        orientation: 'CORNER · DUAL ASPECT',
        neighbourhood: 'Kallipoli, Piraeus',
        proximity: [
          'Agias Paraskevis Street',
          'Quiet, highly desirable residential neighbourhood',
        ],
        description:
          'A bright, corner and dual-aspect apartment of 100 m², built in 1972, in a quiet and highly desirable neighbourhood of Kallipoli, Piraeus. Wrap-around balconies follow the corner position, and three spacious bedrooms make it an ideal home for families or for anyone seeking generous living areas in one of the most attractive residential districts of Piraeus.',
        features: [
          '100 M² CORNER APARTMENT',
          'CORNER & DUAL ASPECT',
          'WRAP-AROUND BALCONIES',
          '3 SPACIOUS BEDROOMS',
          'CENTRAL HEATING',
          '3 AIR CONDITIONING UNITS',
        ],
        amenityGroups: [
          {
            title: 'Interior',
            items: ['100 m² of living space', 'Corner and dual-aspect layout', 'Bright throughout', '3 spacious bedrooms', '1 bathroom'],
          },
          { title: 'Outdoor', items: ['Wrap-around balconies'] },
          { title: 'Heating and cooling', items: ['Central heating', '3 air conditioning units'] },
          { title: 'Building', items: ['Built in 1972'] },
          {
            title: 'Location',
            items: ['Kallipoli, Piraeus', 'Agias Paraskevis Street', 'Quiet, highly desirable residential neighbourhood'],
          },
          { title: 'Running costs', items: ['Common expenses approximately €35–€50 per month'] },
        ],
        commonExpenses: 'Approximately €35–€50 per month',
        importantNotes: [
          'Monthly common expenses are approximately €35–€50.',
          'The apartment was built in 1972.',
        ],
        availableFrom: 'VIEWINGS BY APPOINTMENT',
      },
      el: {
        name: 'Γωνιακό Διαμέρισμα Καλλίπολης',
        subtitle: 'Γωνιακό & Διαμπερές · 100 τ.μ.',
        level: 'ΟΛΟΚΛΗΡΟ ΔΙΑΜΕΡΙΣΜΑ',
        orientation: 'ΓΩΝΙΑΚΟ · ΔΙΑΜΠΕΡΕΣ',
        neighbourhood: 'Καλλίπολη, Πειραιάς',
        proximity: [
          'Οδός Αγίας Παρασκευής',
          'Ήσυχη και προνομιακή γειτονιά',
        ],
        description:
          'Φωτεινό, γωνιακό και διαμπερές διαμέρισμα 100 τ.μ., κατασκευής 1972, σε ήσυχη και προνομιακή γειτονιά της Καλλίπολης Πειραιά. Τα περιμετρικά μπαλκόνια ακολουθούν τη γωνιακή θέση και τα τρία ευρύχωρα υπνοδωμάτια το καθιστούν ιδανικό για οικογένεια ή για όσους αναζητούν άνετους χώρους σε μία από τις πιο όμορφες περιοχές του Πειραιά.',
        features: [
          'ΓΩΝΙΑΚΟ ΔΙΑΜΕΡΙΣΜΑ 100 Τ.Μ.',
          'ΓΩΝΙΑΚΟ & ΔΙΑΜΠΕΡΕΣ',
          'ΠΕΡΙΜΕΤΡΙΚΑ ΜΠΑΛΚΟΝΙΑ',
          '3 ΕΥΡΥΧΩΡΑ ΥΠΝΟΔΩΜΑΤΙΑ',
          'ΚΕΝΤΡΙΚΗ ΘΕΡΜΑΝΣΗ',
          '3 ΚΛΙΜΑΤΙΣΤΙΚΑ',
        ],
        amenityGroups: [
          {
            title: 'Εσωτερικοί χώροι',
            items: ['100 τ.μ. χώρος διαβίωσης', 'Γωνιακή και διαμπερής διαρρύθμιση', 'Φωτεινό σε όλη την έκτασή του', '3 ευρύχωρα υπνοδωμάτια', '1 μπάνιο'],
          },
          { title: 'Εξωτερικός χώρος', items: ['Περιμετρικά μπαλκόνια'] },
          { title: 'Θέρμανση και ψύξη', items: ['Κεντρική θέρμανση', '3 κλιματιστικά'] },
          { title: 'Πολυκατοικία', items: ['Κατασκευής 1972'] },
          {
            title: 'Τοποθεσία',
            items: ['Καλλίπολη, Πειραιάς', 'Οδός Αγίας Παρασκευής', 'Ήσυχη και προνομιακή γειτονιά'],
          },
          { title: 'Λειτουργικά έξοδα', items: ['Κοινόχρηστα περίπου 35–50€ τον μήνα'] },
        ],
        commonExpenses: 'Περίπου 35–50€ τον μήνα',
        importantNotes: [
          'Τα κοινόχρηστα ανέρχονται σε περίπου 35–50€ τον μήνα.',
          'Το διαμέρισμα είναι κατασκευής 1972.',
        ],
        availableFrom: 'ΕΠΙΣΚΕΨΕΙΣ ΚΑΤΟΠΙΝ ΡΑΝΤΕΒΟΥ',
      },
    },
  },
];

export const salePropertyCount = saleProperties.length;
