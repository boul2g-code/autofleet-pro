/**
 * AutoFleet Pro — Demo/Seed Data
 * One vehicle per category × status combination (representative examples)
 * Use in Settings → "Load Demo Data" to test all features
 */
import type { Vehicle } from './types'
import { genUuid } from './utils'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10)
const id = (n: number) => `DEMO-${String(n).padStart(4, '0')}-${Math.random().toString(36).slice(2, 6)}`

const RAW_SEED_VEHICLES: Omit<Vehicle, 'businessId'>[] = [

  // ── CAR — purchased ─────────────────────────────────────────────────────
  {
    id: id(1), createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'purchased', category: 'car',
    make: 'BMW', model: '320d', year: '2020', color: 'Metallic Black',
    fuel: 'diesel', gearbox: 'automatic', engine: '1995', mileage: '87400',
    firstReg: '2020-03-15', regCountry: 'DE', plate: 'M-AB 3201',
    vin: 'WBA5A7C50LF123456', cocNum: 'COC-2020-BMW-001', condition: 'good',
    seats: '5', notes: 'Full service history. Minor scratch rear bumper.',
    purchase: {
      date: daysAgo(5), sellerName: 'AutoHaus Müller GmbH', sellerCountry: 'DE',
      sellerContact: '+49 89 123456', priceNet: '18000', vatRate: '19',
      priceGross: '21420', vatType: 'standard', invoiceNum: 'EK-2024-0341',
      currency: 'EUR', extraCosts: [{ desc: 'TÜV Bericht', amt: '120' }],
      notes: '',
    },
  },

  // ── CAR — transit_in ────────────────────────────────────────────────────
  {
    id: id(2), createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'transit_in', category: 'car',
    make: 'Mercedes-Benz', model: 'C 220 d', year: '2021', color: 'Silver',
    fuel: 'diesel', gearbox: 'automatic', engine: '1950', mileage: '62000',
    firstReg: '2021-06-01', regCountry: 'DE', plate: 'B-CD 2201',
    vin: 'WDD2050871R456789', cocNum: 'COC-2021-MB-002', condition: 'excellent',
    seats: '5', notes: 'Panorama roof, leather, full LED.',
    purchase: {
      date: daysAgo(12), sellerName: 'Mercedes Stuttgart', sellerCountry: 'DE',
      sellerContact: '+49 711 654321', priceNet: '24000', vatRate: '19',
      priceGross: '28560', vatType: 'standard', invoiceNum: 'EK-2024-0342',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-001', carrier: 'EuroLogistics GmbH', carrierContact: '+49 30 987654',
      origin: 'Stuttgart, DE', dest: 'Thessaloniki, GR',
      depDate: daysAgo(3), arrDate: daysAgo(-2),
      cost: '680', currency: 'EUR', truckPlate: 'B-TL 9900', driver: 'Klaus Weber', notes: '',
    },
  },

  // ── CAR — at_depot ──────────────────────────────────────────────────────
  {
    id: id(3), createdAt: new Date(now.getTime() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'at_depot', category: 'car',
    make: 'Volkswagen', model: 'Golf 2.0 TDI', year: '2019', color: 'White',
    fuel: 'diesel', gearbox: 'manual', engine: '1968', mileage: '118000',
    firstReg: '2019-09-20', regCountry: 'DE', plate: 'HH-VW 1908',
    vin: 'WVWZZZ1KZ1W012345', cocNum: 'COC-2019-VW-003', condition: 'good',
    seats: '5', notes: 'New brakes fitted. Needs minor interior cleaning.',
    purchase: {
      date: daysAgo(25), sellerName: 'VW Partner Hamburg', sellerCountry: 'DE',
      sellerContact: '+49 40 111222', priceNet: '11000', vatRate: '',
      priceGross: '11000', vatType: 'margin', invoiceNum: 'EK-2024-0301',
      currency: 'EUR', extraCosts: [{ desc: 'Bremsen', amt: '380' }],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-002', carrier: 'Balkantrans', carrierContact: '+30 231 0000111',
      origin: 'Hamburg, DE', dest: 'Αθήνα, GR',
      depDate: daysAgo(20), arrDate: daysAgo(17),
      cost: '720', currency: 'EUR', truckPlate: 'ΑΑΑ-1234', driver: 'Γιώργος Παπαδόπουλος', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Αθήνας — Χώρος Β3',
      entryDate: daysAgo(17), exitDate: '', cpd: '8', currency: 'EUR',
      days: '17', workDone: [{ desc: 'Καθαρισμός εσωτερικού', cost: '80', date: daysAgo(15), by: 'Κώστας' }], notes: '',
    },
  },

  // ── CAR — for_sale ──────────────────────────────────────────────────────
  {
    id: id(4), createdAt: new Date(now.getTime() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'for_sale', category: 'car',
    make: 'Audi', model: 'A4 2.0 TDI', year: '2018', color: 'Metallic Blue',
    fuel: 'diesel', gearbox: 'automatic', engine: '1968', mileage: '134000',
    firstReg: '2018-04-10', regCountry: 'DE', plate: 'F-AU 1801',
    vin: 'WAUZZZ8K0JA045678', cocNum: 'COC-2018-AU-004', condition: 'good',
    seats: '5', notes: 'S-Line exterior. Full Audi service. Ready for delivery.',
    purchase: {
      date: daysAgo(45), sellerName: 'Audi Zentrum Frankfurt', sellerCountry: 'DE',
      sellerContact: '+49 69 222333', priceNet: '14500', vatRate: '',
      priceGross: '14500', vatType: 'margin', invoiceNum: 'EK-2024-0280',
      currency: 'EUR', extraCosts: [{ desc: 'Kühlmittel/Service', amt: '220' }],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-003', carrier: 'EuroLogistics GmbH', carrierContact: '+49 30 987654',
      origin: 'Frankfurt, DE', dest: 'Θεσσαλονίκη, GR',
      depDate: daysAgo(40), arrDate: daysAgo(38), cost: '650', currency: 'EUR',
      truckPlate: 'B-TL 9901', driver: 'Klaus Weber', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Θεσσαλονίκης — Χώρος Α1',
      entryDate: daysAgo(38), exitDate: '', cpd: '8', currency: 'EUR',
      days: '38', workDone: [], notes: 'Posted on car.gr and autoscout24',
    },
  },

  // ── CAR — sold ──────────────────────────────────────────────────────────
  {
    id: id(5), createdAt: new Date(now.getTime() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'sold', category: 'car',
    make: 'Toyota', model: 'Corolla 1.8 Hybrid', year: '2022', color: 'Pearl White',
    fuel: 'hybrid', gearbox: 'automatic', engine: '1798', mileage: '28000',
    firstReg: '2022-01-20', regCountry: 'DE', plate: 'S-TC 2202',
    vin: 'SB1K3CAE50E123456', cocNum: 'COC-2022-TY-005', condition: 'excellent',
    seats: '5', notes: 'One owner. Full Toyota history. Warranty remaining.',
    purchase: {
      date: daysAgo(90), sellerName: 'Toyota Stuttgart', sellerCountry: 'DE',
      sellerContact: '+49 711 333444', priceNet: '18000', vatRate: '19',
      priceGross: '21420', vatType: 'standard', invoiceNum: 'EK-2024-0201',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-010', carrier: 'SwiftTrans', carrierContact: '+30 210 0000222',
      origin: 'Stuttgart, DE', dest: 'Αθήνα, GR',
      depDate: daysAgo(85), arrDate: daysAgo(83), cost: '600', currency: 'EUR',
      truckPlate: 'ΚΚΚ-5678', driver: 'Νίκος Νικολάου', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Αθήνας — Χώρος Α2',
      entryDate: daysAgo(83), exitDate: daysAgo(60), cpd: '8', currency: 'EUR',
      days: '23', workDone: [], notes: '',
    },
    sale: {
      date: daysAgo(60), buyerName: 'Σταύρος Αλεξίου', buyerCountry: 'GR',
      buyerContact: '+30 694 1122334', priceNet: '21000', vatRate: '',
      priceGross: '21000', vatType: 'margin', invoiceNum: 'PW-2024-0055',
      currency: 'EUR', notes: 'Paid in full. Buyer very satisfied.',
    },
  },

  // ── CAR — transit_out ───────────────────────────────────────────────────
  {
    id: id(6), createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'transit_out', category: 'car',
    make: 'Hyundai', model: 'Tucson PHEV', year: '2023', color: 'Dark Green',
    fuel: 'hybrid', gearbox: 'automatic', engine: '1598', mileage: '14000',
    firstReg: '2023-05-01', regCountry: 'DE', plate: 'K-HY 2301',
    vin: '5NMZA3LB0PH123456', cocNum: 'COC-2023-HY-006', condition: 'excellent',
    seats: '5', notes: 'PHEV. Full charge range 62km. Sold to Italian dealer.',
    purchase: {
      date: daysAgo(60), sellerName: 'Hyundai Köln', sellerCountry: 'DE',
      sellerContact: '+49 221 555666', priceNet: '26000', vatRate: '19',
      priceGross: '30940', vatType: 'standard', invoiceNum: 'EK-2024-0320',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    sale: {
      date: daysAgo(10), buyerName: 'Fratelli Rossi Auto Srl', buyerCountry: 'IT',
      buyerContact: '+39 02 9988776', priceNet: '29000', vatRate: '',
      priceGross: '29000', vatType: 'no_vat', invoiceNum: 'PW-2024-0088',
      currency: 'EUR', notes: 'Export sale to Italy. COC verified.',
    },
    exportTransport: {
      cmr: 'CMR-2024-020', carrier: 'ItalTrans Srl', carrierContact: '+39 02 7766554',
      origin: 'Θεσσαλονίκη, GR', dest: 'Milano, IT',
      depDate: daysAgo(2), arrDate: daysAgo(-2), cost: '890', currency: 'EUR',
      truckPlate: 'MI-AB 3456', driver: 'Marco Bianchi', notes: '',
    },
  },

  // ── CAR — delivered ─────────────────────────────────────────────────────
  {
    id: id(7), createdAt: new Date(now.getTime() - 120 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'delivered', category: 'car',
    make: 'Ford', model: 'Focus 1.5 EcoBoost', year: '2020', color: 'Red',
    fuel: 'petrol', gearbox: 'manual', engine: '1497', mileage: '95000',
    firstReg: '2020-08-12', regCountry: 'DE', plate: 'D-FO 2008',
    vin: 'WF0KXXGCHK1A23456', cocNum: 'COC-2020-FO-007', condition: 'fair',
    seats: '5', notes: 'Fully completed sale cycle. Archived.',
    purchase: {
      date: daysAgo(120), sellerName: 'Ford Düsseldorf', sellerCountry: 'DE',
      sellerContact: '+49 211 777888', priceNet: '9000', vatRate: '',
      priceGross: '9000', vatType: 'margin', invoiceNum: 'EK-2024-0150',
      currency: 'EUR', extraCosts: [{ desc: 'Windschutzscheibe', amt: '280' }],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-030', carrier: 'Balkantrans', carrierContact: '+30 231 0000111',
      origin: 'Düsseldorf, DE', dest: 'Αθήνα, GR',
      depDate: daysAgo(115), arrDate: daysAgo(112), cost: '640', currency: 'EUR',
      truckPlate: 'ΑΒΓ-9876', driver: 'Πέτρος Κωνσταντίνου', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Αθήνας — Χώρος Β1',
      entryDate: daysAgo(112), exitDate: daysAgo(95), cpd: '8', currency: 'EUR',
      days: '17', workDone: [{ desc: 'Polishing', cost: '150', date: daysAgo(108), by: 'Μιχάλης' }], notes: '',
    },
    sale: {
      date: daysAgo(95), buyerName: 'Δήμητρα Παπαδάκη', buyerCountry: 'GR',
      buyerContact: '+30 697 4455667', priceNet: '10500', vatRate: '',
      priceGross: '10500', vatType: 'margin', invoiceNum: 'PW-2024-0022',
      currency: 'EUR', notes: 'Cash payment.',
    },
    exportTransport: {
      cmr: 'CMR-2024-031', carrier: 'LocalDel', carrierContact: '+30 210 1111222',
      origin: 'Αθήνα, GR', dest: 'Ηράκλειο, GR',
      depDate: daysAgo(94), arrDate: daysAgo(92), cost: '180', currency: 'EUR',
      truckPlate: 'ΓΔΕ-1122', driver: 'Αντώνης Μαρής', notes: '',
    },
  },

  // ── TRUCK — purchased ───────────────────────────────────────────────────
  {
    id: id(8), createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'purchased', category: 'truck',
    make: 'Mercedes-Benz', model: 'Actros 1845', year: '2019', color: 'White',
    fuel: 'diesel', gearbox: 'automatic', engine: '12800', mileage: '620000',
    firstReg: '2019-02-01', regCountry: 'DE', plate: 'HB-MB 1845',
    vin: 'WDB9634031L654321', cocNum: '', condition: 'good',
    payload: '22000', notes: 'MP4. Hydraulic suspension. New tyres front.',
    purchase: {
      date: daysAgo(8), sellerName: 'Truck Center Bremen', sellerCountry: 'DE',
      sellerContact: '+49 421 999000', priceNet: '38000', vatRate: '19',
      priceGross: '45220', vatType: 'standard', invoiceNum: 'EK-2024-T001',
      currency: 'EUR', extraCosts: [{ desc: 'TÜV / HU', amt: '450' }],
      notes: '',
    },
  },

  // ── TRUCK — sold ─────────────────────────────────────────────────────────
  {
    id: id(9), createdAt: new Date(now.getTime() - 150 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'sold', category: 'truck',
    make: 'Scania', model: 'R 450', year: '2018', color: 'Silver',
    fuel: 'diesel', gearbox: 'automatic', engine: '12742', mileage: '980000',
    firstReg: '2018-07-15', regCountry: 'DE', plate: 'HH-SC 4501',
    vin: 'YS2R4X20001234567', cocNum: '', condition: 'fair',
    payload: '24000', notes: 'Retired truck. Sold to Bulgarian dealer.',
    purchase: {
      date: daysAgo(150), sellerName: 'Scania Hamburg', sellerCountry: 'DE',
      sellerContact: '+49 40 444555', priceNet: '28000', vatRate: '19',
      priceGross: '33320', vatType: 'standard', invoiceNum: 'EK-2024-T010',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    sale: {
      date: daysAgo(80), buyerName: 'Балкан Транс ЕООД', buyerCountry: 'BG',
      buyerContact: '+359 2 111222', priceNet: '34000', vatRate: '',
      priceGross: '34000', vatType: 'no_vat', invoiceNum: 'PW-2024-T005',
      currency: 'EUR', notes: 'Export to Bulgaria. No VAT intra-EU.',
    },
  },

  // ── VAN — at_depot ───────────────────────────────────────────────────────
  {
    id: id(10), createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'at_depot', category: 'van',
    make: 'Volkswagen', model: 'Crafter 2.0 TDI 140', year: '2021', color: 'White',
    fuel: 'diesel', gearbox: 'manual', engine: '1968', mileage: '145000',
    firstReg: '2021-03-10', regCountry: 'DE', plate: 'MYK-VW 210',
    vin: 'WV1ZZZ2EZM6001234', cocNum: '', condition: 'good',
    payload: '1600', notes: 'L3H3 high roof, long. Racking installed.',
    purchase: {
      date: daysAgo(30), sellerName: 'VW Nutzfahrzeuge München', sellerCountry: 'DE',
      sellerContact: '+49 89 888999', priceNet: '19500', vatRate: '19',
      priceGross: '23205', vatType: 'standard', invoiceNum: 'EK-2024-V001',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-V01', carrier: 'EuroLogistics GmbH', carrierContact: '+49 30 987654',
      origin: 'München, DE', dest: 'Θεσσαλονίκη, GR',
      depDate: daysAgo(25), arrDate: daysAgo(23), cost: '550', currency: 'EUR',
      truckPlate: 'B-TL 9902', driver: 'Klaus Weber', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Θεσσαλονίκης',
      entryDate: daysAgo(23), exitDate: '', cpd: '6', currency: 'EUR',
      days: '23', workDone: [], notes: 'Pending buyer',
    },
  },

  // ── BUS — for_sale ───────────────────────────────────────────────────────
  {
    id: id(11), createdAt: new Date(now.getTime() - 55 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'for_sale', category: 'bus',
    make: 'Mercedes-Benz', model: 'Tourismo RHD', year: '2017', color: 'White',
    fuel: 'diesel', gearbox: 'automatic', engine: '11967', mileage: '485000',
    firstReg: '2017-06-01', regCountry: 'DE', plate: 'KA-MB 170',
    vin: 'WEB6280232K123456', cocNum: '', condition: 'good',
    seats: '50', notes: '50+1 seats. AC, toilet, luggage. German registration.',
    purchase: {
      date: daysAgo(55), sellerName: 'Bus Center Karlsruhe', sellerCountry: 'DE',
      sellerContact: '+49 721 111000', priceNet: '65000', vatRate: '19',
      priceGross: '77350', vatType: 'standard', invoiceNum: 'EK-2024-B001',
      currency: 'EUR', extraCosts: [{ desc: 'TÜV/HU', amt: '680' }],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-B01', carrier: 'BigTrans', carrierContact: '+30 2310 111222',
      origin: 'Karlsruhe, DE', dest: 'Αθήνα, GR',
      depDate: daysAgo(50), arrDate: daysAgo(47), cost: '1200', currency: 'EUR',
      truckPlate: 'ΖΗΘ-4455', driver: 'Χρήστος Δημητρίου', notes: '',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Αθήνας — Bus Section',
      entryDate: daysAgo(47), exitDate: '', cpd: '15', currency: 'EUR',
      days: '47', workDone: [{ desc: 'Seats reupholstered', cost: '1200', date: daysAgo(40), by: 'Ταπετσαρία Νότη' }], notes: '',
    },
  },

  // ── MOTO — sold ─────────────────────────────────────────────────────────
  {
    id: id(12), createdAt: new Date(now.getTime() - 70 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'sold', category: 'moto',
    make: 'BMW Motorrad', model: 'R 1250 GS', year: '2021', color: 'Rallye Black',
    fuel: 'petrol', gearbox: 'manual', engine: '1254', mileage: '22000',
    firstReg: '2021-04-01', regCountry: 'DE', plate: 'M-GS 1250',
    vin: 'WB10D1301MZ123456', cocNum: '', condition: 'excellent',
    seats: '2', notes: 'Full options: dynamic pro, enduro pro. German plates.',
    purchase: {
      date: daysAgo(70), sellerName: 'BMW Motorrad München', sellerCountry: 'DE',
      sellerContact: '+49 89 777666', priceNet: '14000', vatRate: '19',
      priceGross: '16660', vatType: 'standard', invoiceNum: 'EK-2024-M001',
      currency: 'EUR', extraCosts: [],
      notes: '',
    },
    storage: {
      location: 'de', locDetails: 'Lager München A',
      entryDate: daysAgo(70), exitDate: daysAgo(50), cpd: '3', currency: 'EUR',
      days: '20', workDone: [], notes: '',
    },
    sale: {
      date: daysAgo(50), buyerName: 'Luca Ferrari', buyerCountry: 'IT',
      buyerContact: '+39 349 1234567', priceNet: '18500', vatRate: '',
      priceGross: '18500', vatType: 'no_vat', invoiceNum: 'PW-2024-M001',
      currency: 'EUR', notes: 'Shipped to Verona, IT.',
    },
    exportTransport: {
      cmr: 'CMR-2024-M01', carrier: 'MotoShip Srl', carrierContact: '+39 45 9876543',
      origin: 'München, DE', dest: 'Verona, IT',
      depDate: daysAgo(49), arrDate: daysAgo(47), cost: '280', currency: 'EUR',
      truckPlate: 'VR-AB 1234', driver: 'Roberto Verdi', notes: '',
    },
  },

  // ── CONSTRUCTION — at_depot ─────────────────────────────────────────────
  {
    id: id(13), createdAt: new Date(now.getTime() - 40 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'at_depot', category: 'construction',
    make: 'Caterpillar (CAT)', model: '320', year: '2018', color: 'Caterpillar Yellow',
    fuel: 'diesel', gearbox: 'automatic', engine: '5200', mileage: '8400',
    firstReg: '2018-11-01', regCountry: 'DE', plate: '',
    vin: 'CAT0320GC8K012345', cocNum: '', condition: 'good',
    payload: '20000', notes: '8.4t engine hours. New bucket teeth. Full service.',
    purchase: {
      date: daysAgo(40), sellerName: 'Zeppelin GmbH', sellerCountry: 'DE',
      sellerContact: '+49 89 600600', priceNet: '72000', vatRate: '19',
      priceGross: '85680', vatType: 'standard', invoiceNum: 'EK-2024-C001',
      currency: 'EUR', extraCosts: [{ desc: 'Hydraulic inspection', amt: '850' }],
      notes: '',
    },
    importTransport: {
      cmr: 'CMR-2024-C01', carrier: 'HeavyTrans GmbH', carrierContact: '+49 40 666777',
      origin: 'München, DE', dest: 'Θεσσαλονίκη, GR',
      depDate: daysAgo(35), arrDate: daysAgo(31), cost: '2200', currency: 'EUR',
      truckPlate: 'B-HT 7788', driver: 'Dieter Hoffmann', notes: 'Special low-loader required',
    },
    storage: {
      location: 'gr', locDetails: 'Αποθήκη Θεσσαλονίκης — Open Yard',
      entryDate: daysAgo(31), exitDate: '', cpd: '20', currency: 'EUR',
      days: '31', workDone: [], notes: 'Potential buyer from Bulgaria contacted',
    },
  },
]

export const SEED_VEHICLES: Vehicle[] = RAW_SEED_VEHICLES.map(vehicle => ({
  ...vehicle,
  businessId: vehicle.id,
  id: genUuid(),
}))
