'use client'
import { useState } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { dbCreateVehicle } from '@/lib/supabase/db'
import type { Vehicle } from '@/lib/types'

const NOW = new Date().toISOString().split('T')[0]
const D = (days: number) => {
  const d = new Date(); d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

const INSPECTION_FULL = [
  { area: 'front_bumper', condition: 'good' as const },
  { area: 'rear_bumper', condition: 'fair' as const },
  { area: 'hood', condition: 'good' as const },
  { area: 'roof', condition: 'good' as const },
  { area: 'left_door', condition: 'good' as const },
  { area: 'right_door', condition: 'good' as const },
  { area: 'windshield', condition: 'good' as const },
  { area: 'engine', condition: 'good' as const },
  { area: 'tires', condition: 'fair' as const },
  { area: 'brakes', condition: 'good' as const },
  { area: 'interior', condition: 'good' as const },
  { area: 'electronics', condition: 'good' as const },
]

const DOC = (type: string, name: string) => ({
  id: Math.random().toString(36).slice(2),
  name,
  type: type as 'invoice' | 'registration' | 'coc' | 'inspection' | 'cmr' | 'other',
  uploadedAt: NOW,
})

const SEED_VEHICLES: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'org_id'>[] = [
  // ── CARS (20) ──
  {
    category: 'car', make: 'BMW', model: '320d xDrive', year: 2021, status: 'for_sale',
    vin: 'WBA5A71010G123001', plate: 'M-BW 3201', color: 'Black', fuelType: 'diesel',
    gearType: 'automatic', engineCC: 1998, powerKW: 140, mileage: 87400, seats: 5, doors: 4,
    weightKg: 1600, notes: 'Full service history. Navigation, leather seats.',
    purchase: { date: D(120), price: 18500, currency: 'EUR', vatRegime: 'margin', sellerName: 'AutoHaus München', sellerCountry: 'DE', invoiceNumber: 'INV-2024-001', additionalCosts: 350 },
    transportIn: { cmrNumber: 'CMR-2024-001', carrier: 'TransEurope GmbH', driver: 'Hans Müller', truckPlate: 'B-TE 100', departureDate: D(118), arrivalDate: D(115), origin: 'München, DE', destination: 'Thessaloniki, GR', distanceKm: 1850, cost: 420 },
    storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(115), costPerDay: 8, workDone: 'Full wash, minor polish', workCost: 150 },
    sale: { price: 22900, currency: 'EUR', vatRegime: 'margin', buyerName: 'Kostas Papadopoulos', buyerCountry: 'GR', buyerPhone: '+30 6944 123456', invoiceNumber: 'SALE-2024-001' },
    documents: [DOC('invoice','Purchase Invoice BMW 320d'), DOC('registration','Registration Certificate'), DOC('coc','Certificate of Conformity'), DOC('inspection','TÜV Report 2024')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Mercedes-Benz', model: 'C 220 d', year: 2020, status: 'stored',
    vin: 'WDD2050421F234002', plate: 'S-MB 2200', color: 'Silver', fuelType: 'diesel',
    gearType: 'automatic', engineCC: 1950, powerKW: 143, mileage: 112000, seats: 5, doors: 4,
    weightKg: 1640, notes: 'AMG Sport package. Panoramic roof.',
    purchase: { date: D(90), price: 21000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Stern Stuttgart', sellerCountry: 'DE', invoiceNumber: 'INV-2024-002', additionalCosts: 280 },
    transportIn: { cmrNumber: 'CMR-2024-002', carrier: 'BalkanTrans', driver: 'Nikola Petrov', truckPlate: 'A-BT 200', departureDate: D(88), arrivalDate: D(85), origin: 'Stuttgart, DE', destination: 'Athens, GR', distanceKm: 2100, cost: 480 },
    storage: { location: 'GR', address: 'Athens Depot, Koropi', arrivalDate: D(85), costPerDay: 8, workDone: 'Detailing, new floor mats', workCost: 200 },
    documents: [DOC('invoice','Purchase Invoice C220d'), DOC('registration','KFZ-Schein'), DOC('coc','COC Mercedes'), DOC('inspection','Hauptuntersuchung')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Audi', model: 'A4 2.0 TDI', year: 2019, status: 'sold',
    vin: 'WAUZZZ8K5KA345003', plate: 'HH-AU 400', color: 'White', fuelType: 'diesel',
    gearType: 'manual', engineCC: 1968, powerKW: 110, mileage: 145000, seats: 5, doors: 4,
    weightKg: 1540,
    purchase: { date: D(180), price: 14500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Audi Zentrum Hamburg', sellerCountry: 'DE', invoiceNumber: 'INV-2024-003', additionalCosts: 220 },
    transportIn: { cmrNumber: 'CMR-2024-003', carrier: 'EuroLogistics', driver: 'Dimitris Alexiou', truckPlate: 'ΑΒ-1234', departureDate: D(178), arrivalDate: D(174), origin: 'Hamburg, DE', destination: 'Thessaloniki, GR', distanceKm: 2200, cost: 500 },
    storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(174), costPerDay: 7, workDone: 'New tires, brake pads', workCost: 650 },
    sale: { date: D(30), price: 17800, currency: 'EUR', vatRegime: 'margin', buyerName: 'Maria Economou', buyerCountry: 'GR', buyerPhone: '+30 6933 987654', invoiceNumber: 'SALE-2024-003' },
    transportOut: { cmrNumber: 'CMR-OUT-003', carrier: 'LocalTrans', driver: 'Stavros Nikolaou', departureDate: D(28), arrivalDate: D(27), origin: 'Thessaloniki', destination: 'Larissa, GR', cost: 150 },
    documents: [DOC('invoice','Purchase Invoice A4'), DOC('registration','Zulassungsbescheinigung'), DOC('coc','COC Audi A4'), DOC('cmr','CMR Transport')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Volkswagen', model: 'Golf 8 GTI', year: 2022, status: 'transit_in',
    vin: 'WVWZZZ1KZAM456004', plate: 'B-VW 8GTI', color: 'Red', fuelType: 'petrol',
    gearType: 'automatic', engineCC: 1984, powerKW: 180, mileage: 42000, seats: 5, doors: 5,
    weightKg: 1450,
    purchase: { date: D(10), price: 28500, currency: 'EUR', vatRegime: 'standard', vatAmount: 5415, sellerName: 'VW Berlin', sellerCountry: 'DE', invoiceNumber: 'INV-2024-004' },
    transportIn: { cmrNumber: 'CMR-2024-004', carrier: 'SpeedTrans GmbH', driver: 'Wolfgang Bauer', truckPlate: 'B-ST 404', departureDate: D(8), arrivalDate: D(3), origin: 'Berlin, DE', destination: 'Thessaloniki, GR', distanceKm: 1950, cost: 440 },
    documents: [DOC('invoice','VW Golf GTI Invoice'), DOC('registration','Fahrzeugschein'), DOC('coc','COC VW Golf 8')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Toyota', model: 'RAV4 Hybrid', year: 2022, status: 'for_sale',
    vin: 'JTMRFREV8KD567005', plate: 'M-TY 4400', color: 'Pearl White', fuelType: 'hybrid',
    gearType: 'automatic', engineCC: 2487, powerKW: 145, mileage: 38000, seats: 5, doors: 5,
    weightKg: 1890,
    purchase: { date: D(60), price: 32000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Toyota München', sellerCountry: 'DE', invoiceNumber: 'INV-2024-005', additionalCosts: 300 },
    transportIn: { cmrNumber: 'CMR-2024-005', carrier: 'AlphaTrans', driver: 'Panagiotis Kosta', truckPlate: 'ΚΛ-5678', departureDate: D(58), arrivalDate: D(54), origin: 'München, DE', destination: 'Athens, GR', distanceKm: 2050, cost: 460 },
    storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(54), costPerDay: 9, workDone: 'Full detail, window tint', workCost: 300 },
    sale: { price: 38500, currency: 'EUR', vatRegime: 'margin', buyerName: 'Nikos Stavridis', buyerCountry: 'GR' },
    documents: [DOC('invoice','RAV4 Purchase Invoice'), DOC('coc','COC Toyota'), DOC('inspection','Service Record')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Ford', model: 'Focus 1.5 EcoBlue', year: 2020, status: 'purchased',
    vin: 'WF0XXXGCE5KY678006', plate: 'K-FO 1500', color: 'Blue', fuelType: 'diesel',
    gearType: 'manual', engineCC: 1499, powerKW: 88, mileage: 98000, seats: 5, doors: 5,
    weightKg: 1370,
    purchase: { date: D(5), price: 11500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Ford Köln', sellerCountry: 'DE', invoiceNumber: 'INV-2024-006', additionalCosts: 180 },
    documents: [DOC('invoice','Focus Purchase Invoice'), DOC('registration','KFZ Schein')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Opel', model: 'Insignia Grand Sport', year: 2019, status: 'stored',
    vin: 'W0L0ZEL69K1789007', plate: 'F-OP 1900', color: 'Grey', fuelType: 'diesel',
    gearType: 'automatic', engineCC: 1598, powerKW: 100, mileage: 135000, seats: 5, doors: 5,
    weightKg: 1590,
    purchase: { date: D(75), price: 12800, currency: 'EUR', vatRegime: 'margin', sellerName: 'Opel Frankfurt', sellerCountry: 'DE', invoiceNumber: 'INV-2024-007' },
    transportIn: { cmrNumber: 'CMR-2024-007', carrier: 'MidEuroTrans', driver: 'Ilias Georgiou', truckPlate: 'ΑΘ-9012', departureDate: D(73), arrivalDate: D(69), origin: 'Frankfurt, DE', destination: 'Thessaloniki, GR', distanceKm: 2000, cost: 450 },
    storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(69), costPerDay: 7, workDone: 'Minor body repair front bumper', workCost: 280 },
    documents: [DOC('invoice','Insignia Invoice'), DOC('inspection','TÜV 2024')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Peugeot', model: '3008 GT', year: 2021, status: 'delivered',
    vin: 'VF3MCYHZ6LS890008', plate: 'N-PG 3008', color: 'Pearl Black', fuelType: 'diesel',
    gearType: 'automatic', engineCC: 1997, powerKW: 130, mileage: 67000, seats: 5, doors: 5,
    weightKg: 1530,
    purchase: { date: D(150), price: 22000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Peugeot Nürnberg', sellerCountry: 'DE', invoiceNumber: 'INV-2024-008' },
    transportIn: { cmrNumber: 'CMR-2024-008', carrier: 'FastRoute', driver: 'Apostolis Makris', truckPlate: 'ΘΕΣ-3456', departureDate: D(148), arrivalDate: D(144), origin: 'Nürnberg, DE', destination: 'Athens, GR', distanceKm: 1900, cost: 430 },
    storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(144), costPerDay: 8 },
    sale: { date: D(60), price: 27500, currency: 'EUR', vatRegime: 'margin', buyerName: 'Eleni Papadaki', buyerCountry: 'GR', invoiceNumber: 'SALE-2024-008' },
    transportOut: { cmrNumber: 'CMR-OUT-008', carrier: 'LocalExpress', driver: 'Giannis Petrou', departureDate: D(58), arrivalDate: D(57), origin: 'Athens', destination: 'Patra, GR', cost: 180 },
    documents: [DOC('invoice','Peugeot 3008 Invoice'), DOC('coc','COC Peugeot'), DOC('cmr','CMR Delivery')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Renault', model: 'Kadjar 1.5 dCi', year: 2020, status: 'for_sale',
    vin: 'VF1RFE00055901009', plate: 'D-RN 1500', color: 'Orange', fuelType: 'diesel',
    gearType: 'manual', engineCC: 1461, powerKW: 85, mileage: 89000, seats: 5, doors: 5,
    weightKg: 1450,
    purchase: { date: D(55), price: 13900, currency: 'EUR', vatRegime: 'margin', sellerName: 'Renault Düsseldorf', sellerCountry: 'DE', invoiceNumber: 'INV-2024-009' },
    transportIn: { cmrNumber: 'CMR-2024-009', carrier: 'EuroCarTrans', driver: 'Vasilis Christou', truckPlate: 'ΕΛ-7890', departureDate: D(53), arrivalDate: D(49), origin: 'Düsseldorf, DE', destination: 'Thessaloniki, GR', distanceKm: 2150, cost: 490 },
    storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(49), costPerDay: 7 },
    sale: { price: 17200, currency: 'EUR', vatRegime: 'margin' },
    documents: [DOC('invoice','Kadjar Invoice'), DOC('registration','French Carte Grise')],
    inspection: INSPECTION_FULL,
  },
  {
    category: 'car', make: 'Skoda', model: 'Octavia 2.0 TDI', year: 2021, status: 'transit_out',
    vin: 'TMBJP7NE3L5012010', plate: 'L-SK 2000', color: 'Graphite', fuelType: 'diesel',
    gearType: 'automatic', engineCC: 1968, powerKW: 110, mileage: 73000, seats: 5, doors: 5,
    weightKg: 1430,
    purchase: { date: D(100), price: 16800, currency: 'EUR', vatRegime: 'margin', sellerName: 'Skoda Leipzig', sellerCountry: 'DE', invoiceNumber: 'INV-2024-010' },
    transportIn: { cmrNumber: 'CMR-2024-010', carrier: 'BalkaTrans', driver: 'Stelios Andreou', truckPlate: 'ΠΕΙ-2345', departureDate: D(98), arrivalDate: D(94), origin: 'Leipzig, DE', destination: 'Athens, GR', distanceKm: 1980, cost: 445 },
    storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(94), costPerDay: 8, workDone: 'Full service, new oil', workCost: 220 },
    sale: { date: D(15), price: 21500, currency: 'EUR', vatRegime: 'margin', buyerName: 'Andreas Nikolaou', buyerCountry: 'GR', invoiceNumber: 'SALE-2024-010' },
    transportOut: { cmrNumber: 'CMR-OUT-010', carrier: 'FastDel', driver: 'Petros Sotiriou', truckPlate: 'ΑΤΤ-6789', departureDate: D(10), origin: 'Athens', destination: 'Volos, GR', cost: 160 },
    documents: [DOC('invoice','Octavia Invoice'), DOC('coc','COC Skoda')],
    inspection: INSPECTION_FULL,
  },
  // 10 more cars
  { category: 'car', make: 'Volvo', model: 'XC60 D4', year: 2020, status: 'stored', vin: 'YV1DZ8856L2113011', plate: 'HB-VO 600', color: 'Blue Metallic', fuelType: 'diesel', gearType: 'automatic', engineCC: 1969, powerKW: 140, mileage: 95000, seats: 5, doors: 5, weightKg: 1860, purchase: { date: D(40), price: 26500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Volvo Hannover', sellerCountry: 'DE', invoiceNumber: 'INV-2024-011' }, transportIn: { cmrNumber: 'CMR-2024-011', carrier: 'NordTrans', driver: 'Kostas Dimopoulos', departureDate: D(38), arrivalDate: D(34), origin: 'Hannover, DE', destination: 'Thessaloniki, GR', cost: 470 }, storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(34), costPerDay: 9 }, documents: [DOC('invoice','XC60 Invoice'), DOC('inspection','Volvo Service')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Hyundai', model: 'Tucson 1.6 CRDi', year: 2021, status: 'for_sale', vin: 'TMAJ381AABJ114012', plate: 'E-HY 1600', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 1598, powerKW: 100, mileage: 61000, seats: 5, doors: 5, weightKg: 1610, purchase: { date: D(50), price: 19500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Hyundai Essen', sellerCountry: 'DE', invoiceNumber: 'INV-2024-012' }, transportIn: { cmrNumber: 'CMR-2024-012', carrier: 'EastTrans', driver: 'Nikos Alexis', departureDate: D(48), arrivalDate: D(44), origin: 'Essen, DE', destination: 'Athens, GR', cost: 450 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(44), costPerDay: 8 }, sale: { price: 24800, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','Tucson Invoice'), DOC('coc','Hyundai COC')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Kia', model: 'Sportage 1.6 T-GDi', year: 2022, status: 'purchased', vin: 'KNAFH414XA6015013', plate: 'DO-KI 1600', color: 'Red', fuelType: 'petrol', gearType: 'automatic', engineCC: 1591, powerKW: 130, mileage: 28000, seats: 5, doors: 5, weightKg: 1590, purchase: { date: D(3), price: 23000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Kia Dortmund', sellerCountry: 'DE', invoiceNumber: 'INV-2024-013' }, documents: [DOC('invoice','Sportage Invoice')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Seat', model: 'Ateca 2.0 TDI', year: 2020, status: 'sold', vin: 'VSSZZZ5FZL6316014', plate: 'MA-SE 2000', color: 'Dark Blue', fuelType: 'diesel', gearType: 'automatic', engineCC: 1968, powerKW: 110, mileage: 118000, seats: 5, doors: 5, weightKg: 1530, purchase: { date: D(200), price: 15200, currency: 'EUR', vatRegime: 'margin', sellerName: 'Seat Mannheim', sellerCountry: 'DE', invoiceNumber: 'INV-2024-014' }, transportIn: { cmrNumber: 'CMR-2024-014', carrier: 'SpeedTrans', driver: 'Thanasis Kostopoulos', departureDate: D(198), arrivalDate: D(194), origin: 'Mannheim, DE', destination: 'Thessaloniki, GR', cost: 440 }, storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(194), costPerDay: 7 }, sale: { date: D(80), price: 19800, currency: 'EUR', vatRegime: 'margin', buyerName: 'Giorgos Petridis', buyerCountry: 'GR', invoiceNumber: 'SALE-2024-014' }, transportOut: { cmrNumber: 'CMR-OUT-014', carrier: 'LocalTrans', driver: 'Manolis Stavros', departureDate: D(78), arrivalDate: D(77), origin: 'Thessaloniki', destination: 'Drama, GR', cost: 140 }, documents: [DOC('invoice','Ateca Invoice'), DOC('cmr','Delivery CMR')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Mazda', model: 'CX-5 2.2 Skyactiv-D', year: 2021, status: 'stored', vin: 'JMZKF272500117015', plate: 'AC-MA 2200', color: 'Soul Red', fuelType: 'diesel', gearType: 'automatic', engineCC: 2191, powerKW: 140, mileage: 55000, seats: 5, doors: 5, weightKg: 1620, purchase: { date: D(65), price: 24500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Mazda Aachen', sellerCountry: 'DE', invoiceNumber: 'INV-2024-015' }, transportIn: { cmrNumber: 'CMR-2024-015', carrier: 'MazTrans', driver: 'Petros Alexiou', departureDate: D(63), arrivalDate: D(59), origin: 'Aachen, DE', destination: 'Athens, GR', cost: 460 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(59), costPerDay: 8 }, documents: [DOC('invoice','CX-5 Invoice'), DOC('coc','Mazda COC')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Nissan', model: 'Qashqai 1.5 dCi', year: 2019, status: 'for_sale', vin: 'SJNFAAJ10U2018016', plate: 'KA-NI 1500', color: 'Silver', fuelType: 'diesel', gearType: 'manual', engineCC: 1461, powerKW: 85, mileage: 142000, seats: 5, doors: 5, weightKg: 1460, purchase: { date: D(110), price: 12000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Nissan Karlsruhe', sellerCountry: 'DE', invoiceNumber: 'INV-2024-016' }, transportIn: { cmrNumber: 'CMR-2024-016', carrier: 'GrecoTrans', driver: 'Spyros Mitropoulos', departureDate: D(108), arrivalDate: D(104), origin: 'Karlsruhe, DE', destination: 'Thessaloniki, GR', cost: 430 }, storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(104), costPerDay: 7 }, sale: { price: 15500, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','Qashqai Invoice')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Honda', model: 'CR-V 2.0 i-MMD', year: 2022, status: 'transit_in', vin: 'MRHRU3860NY019017', plate: 'FR-HO 2000', color: 'Modern Steel', fuelType: 'hybrid', gearType: 'automatic', engineCC: 1993, powerKW: 145, mileage: 32000, seats: 5, doors: 5, weightKg: 1740, purchase: { date: D(12), price: 34000, currency: 'EUR', vatRegime: 'standard', vatAmount: 6460, sellerName: 'Honda Frankfurt', sellerCountry: 'DE', invoiceNumber: 'INV-2024-017' }, transportIn: { cmrNumber: 'CMR-2024-017', carrier: 'FastEuro', driver: 'Takis Andreou', departureDate: D(10), origin: 'Frankfurt, DE', destination: 'Athens, GR', cost: 465 }, documents: [DOC('invoice','CR-V Invoice'), DOC('coc','Honda COC')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Fiat', model: 'Tipo 1.6 Multijet', year: 2020, status: 'stored', vin: 'ZFA35600005020018', plate: 'TO-FI 1600', color: 'Arancio', fuelType: 'diesel', gearType: 'manual', engineCC: 1598, powerKW: 88, mileage: 99000, seats: 5, doors: 5, weightKg: 1340, purchase: { date: D(80), price: 9800, currency: 'EUR', vatRegime: 'margin', sellerName: 'Fiat Torino', sellerCountry: 'IT', invoiceNumber: 'INV-2024-018' }, transportIn: { cmrNumber: 'CMR-2024-018', carrier: 'ItalTrans', driver: 'Nikos Balamotis', departureDate: D(78), arrivalDate: D(75), origin: 'Torino, IT', destination: 'Thessaloniki, GR', cost: 320 }, storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(75), costPerDay: 6 }, documents: [DOC('invoice','Tipo Invoice'), DOC('registration','Libretto Italiano')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Citroën', model: 'C5 Aircross 1.5 BlueHDi', year: 2021, status: 'for_sale', vin: 'VF73ACYHZMS021019', plate: 'PA-CI 1500', color: 'Cosmic Blue', fuelType: 'diesel', gearType: 'automatic', engineCC: 1499, powerKW: 96, mileage: 78000, seats: 5, doors: 5, weightKg: 1490, purchase: { date: D(70), price: 18900, currency: 'EUR', vatRegime: 'margin', sellerName: 'Citroën Paris', sellerCountry: 'FR', invoiceNumber: 'INV-2024-019' }, transportIn: { cmrNumber: 'CMR-2024-019', carrier: 'FranceTrans', driver: 'Alexandros Papas', departureDate: D(68), arrivalDate: D(63), origin: 'Paris, FR', destination: 'Athens, GR', cost: 550 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(63), costPerDay: 8 }, sale: { price: 23800, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','C5 Aircross Invoice'), DOC('coc','COC Citroen')], inspection: INSPECTION_FULL },
  { category: 'car', make: 'Tesla', model: 'Model 3 Standard Range', year: 2022, status: 'purchased', vin: '5YJ3E1EA4NF122020', plate: 'M-TS 3000', color: 'Midnight Silver', fuelType: 'electric', gearType: 'automatic', engineCC: 0, powerKW: 211, mileage: 45000, seats: 5, doors: 4, weightKg: 1611, purchase: { date: D(7), price: 38000, currency: 'EUR', vatRegime: 'standard', vatAmount: 7220, sellerName: 'Tesla München', sellerCountry: 'DE', invoiceNumber: 'INV-2024-020' }, documents: [DOC('invoice','Tesla Model 3 Invoice'), DOC('coc','Tesla COC')], inspection: INSPECTION_FULL },

  // ── TRUCKS (10) ──
  { category: 'truck', make: 'Mercedes-Benz', model: 'Actros 1845 LS', year: 2019, status: 'for_sale', vin: 'WDB9630031L021001', plate: 'B-MB TRUCK1', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 12800, powerKW: 330, mileage: 680000, weightKg: 8000, payloadKg: 24000, purchase: { date: D(90), price: 48000, currency: 'EUR', vatRegime: 'standard', vatAmount: 9120, sellerName: 'MB Trucks Berlin', sellerCountry: 'DE', invoiceNumber: 'INV-T-001' }, transportIn: { cmrNumber: 'CMR-T-001', carrier: 'HeavyTrans GmbH', driver: 'Konstantinos Triantafyllou', departureDate: D(88), arrivalDate: D(83), origin: 'Berlin, DE', destination: 'Thessaloniki, GR', cost: 850 }, storage: { location: 'GR', address: 'Truck Depot Thessaloniki', arrivalDate: D(83), costPerDay: 15, workDone: 'Full engine service, new injectors', workCost: 2200 }, sale: { price: 62000, currency: 'EUR', vatRegime: 'standard', vatAmount: 11780 }, documents: [DOC('invoice','Actros Purchase Invoice'), DOC('registration','KFZ Truck'), DOC('inspection','TÜV Heavy Vehicle')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Volvo', model: 'FH 500 6x2', year: 2020, status: 'stored', vin: 'YV2XT01C5LB122002', plate: 'GBG-VO FH', color: 'Blue', fuelType: 'diesel', gearType: 'automatic', engineCC: 12777, powerKW: 368, mileage: 520000, weightKg: 8500, payloadKg: 24000, purchase: { date: D(70), price: 55000, currency: 'EUR', vatRegime: 'standard', vatAmount: 10450, sellerName: 'Volvo Trucks Göteborg', sellerCountry: 'DE', invoiceNumber: 'INV-T-002' }, transportIn: { cmrNumber: 'CMR-T-002', carrier: 'NordRoute', driver: 'Giorgos Manos', departureDate: D(68), arrivalDate: D(62), origin: 'Hamburg, DE', destination: 'Athens, GR', cost: 950 }, storage: { location: 'GR', address: 'Athens Truck Depot', arrivalDate: D(62), costPerDay: 15 }, documents: [DOC('invoice','Volvo FH Invoice'), DOC('inspection','Volvo Service Book')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'DAF', model: 'XF 480 FT', year: 2018, status: 'sold', vin: 'XLRTE47MS0E323003', plate: 'EHV-DA XF', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 12902, powerKW: 353, mileage: 890000, weightKg: 8200, payloadKg: 24000, purchase: { date: D(220), price: 35000, currency: 'EUR', vatRegime: 'standard', vatAmount: 6650, sellerName: 'DAF Eindhoven', sellerCountry: 'DE', invoiceNumber: 'INV-T-003' }, transportIn: { cmrNumber: 'CMR-T-003', carrier: 'BeneluTrans', driver: 'Christos Papadimitriou', departureDate: D(218), arrivalDate: D(212), origin: 'Eindhoven, NL', destination: 'Thessaloniki, GR', cost: 1050 }, storage: { location: 'GR', address: 'Thessaloniki Truck Depot', arrivalDate: D(212), costPerDay: 14 }, sale: { date: D(100), price: 45000, currency: 'EUR', vatRegime: 'standard', vatAmount: 8550, buyerName: 'Transports Balkan SA', buyerCountry: 'BG', invoiceNumber: 'SALE-T-003' }, transportOut: { cmrNumber: 'CMR-OUT-T003', carrier: 'DirectTrans', driver: 'Nikolaos Stavros', departureDate: D(98), arrivalDate: D(95), origin: 'Thessaloniki', destination: 'Sofia, BG', cost: 350 }, documents: [DOC('invoice','DAF XF Invoice'), DOC('cmr','CMR Delivery Bulgaria')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Scania', model: 'R 500 A6x2', year: 2021, status: 'transit_in', vin: 'YS2R6X20005424004', plate: 'SDL-SC R500', color: 'Red', fuelType: 'diesel', gearType: 'automatic', engineCC: 12742, powerKW: 368, mileage: 310000, weightKg: 8100, payloadKg: 24000, purchase: { date: D(15), price: 68000, currency: 'EUR', vatRegime: 'standard', vatAmount: 12920, sellerName: 'Scania Södertälje', sellerCountry: 'DE', invoiceNumber: 'INV-T-004' }, transportIn: { cmrNumber: 'CMR-T-004', carrier: 'HeavyRoute', driver: 'Fotis Karamanlis', departureDate: D(12), origin: 'Hamburg, DE', destination: 'Thessaloniki, GR', cost: 900 }, documents: [DOC('invoice','Scania R500 Invoice'), DOC('coc','Scania COC')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'MAN', model: 'TGX 18.440', year: 2019, status: 'for_sale', vin: 'WMA06XZZ2KY025005', plate: 'M-MAN 440', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 10518, powerKW: 324, mileage: 720000, weightKg: 7900, payloadKg: 24000, purchase: { date: D(85), price: 38000, currency: 'EUR', vatRegime: 'standard', vatAmount: 7220, sellerName: 'MAN München', sellerCountry: 'DE', invoiceNumber: 'INV-T-005' }, transportIn: { cmrNumber: 'CMR-T-005', carrier: 'AlpTrans', driver: 'Thodoris Mpakos', departureDate: D(83), arrivalDate: D(77), origin: 'München, DE', destination: 'Athens, GR', cost: 870 }, storage: { location: 'GR', address: 'Athens Truck Depot', arrivalDate: D(77), costPerDay: 14, workDone: 'Gearbox service, clutch replacement', workCost: 3500 }, sale: { price: 52000, currency: 'EUR', vatRegime: 'standard', vatAmount: 9880 }, documents: [DOC('invoice','MAN TGX Invoice'), DOC('inspection','MAN Service')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Iveco', model: 'Stralis 460', year: 2018, status: 'purchased', vin: 'ZCFC47A0001226006', plate: 'TO-IV 460', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 12880, powerKW: 338, mileage: 950000, weightKg: 8000, payloadKg: 24000, purchase: { date: D(8), price: 28000, currency: 'EUR', vatRegime: 'standard', vatAmount: 5320, sellerName: 'Iveco Torino', sellerCountry: 'IT', invoiceNumber: 'INV-T-006' }, documents: [DOC('invoice','Iveco Stralis Invoice')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Renault', model: 'T 520 High', year: 2020, status: 'stored', vin: 'VF629GVA000027007', plate: 'LY-RE T520', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 12837, powerKW: 382, mileage: 480000, weightKg: 8100, payloadKg: 24000, purchase: { date: D(60), price: 52000, currency: 'EUR', vatRegime: 'standard', vatAmount: 9880, sellerName: 'Renault Trucks Lyon', sellerCountry: 'FR', invoiceNumber: 'INV-T-007' }, transportIn: { cmrNumber: 'CMR-T-007', carrier: 'FranceTruck', driver: 'Lambros Gkikas', departureDate: D(58), arrivalDate: D(52), origin: 'Lyon, FR', destination: 'Thessaloniki, GR', cost: 1100 }, storage: { location: 'GR', address: 'Thessaloniki Truck Depot', arrivalDate: D(52), costPerDay: 15 }, documents: [DOC('invoice','Renault T520 Invoice'), DOC('inspection','Contrôle Technique')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Mercedes-Benz', model: 'Atego 1224 L', year: 2020, status: 'delivered', vin: 'WDB9700021K028008', plate: 'K-MB AT12', color: 'White', fuelType: 'diesel', gearType: 'manual', engineCC: 6374, powerKW: 175, mileage: 280000, weightKg: 4500, payloadKg: 8000, purchase: { date: D(160), price: 29000, currency: 'EUR', vatRegime: 'margin', sellerName: 'MB Nutzfahrzeuge Köln', sellerCountry: 'DE', invoiceNumber: 'INV-T-008' }, transportIn: { cmrNumber: 'CMR-T-008', carrier: 'MedioTrans', driver: 'Antonis Katsaros', departureDate: D(158), arrivalDate: D(153), origin: 'Köln, DE', destination: 'Athens, GR', cost: 780 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(153), costPerDay: 12 }, sale: { date: D(70), price: 38000, currency: 'EUR', vatRegime: 'margin', buyerName: 'Ioannidis Transport', buyerCountry: 'GR', invoiceNumber: 'SALE-T-008' }, transportOut: { cmrNumber: 'CMR-OUT-T008', carrier: 'LocalHeavy', driver: 'Giannis Triantis', departureDate: D(68), arrivalDate: D(67), origin: 'Athens', destination: 'Heraklion via ferry, GR', cost: 420 }, documents: [DOC('invoice','Atego Invoice'), DOC('cmr','Delivery CMR Atego')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'Volvo', model: 'FMX 460 6x4', year: 2018, status: 'for_sale', vin: 'YV2XC01C5JB129009', plate: 'GBG-FMX46', color: 'Yellow', fuelType: 'diesel', gearType: 'automatic', engineCC: 12777, powerKW: 338, mileage: 550000, weightKg: 10000, payloadKg: 26000, purchase: { date: D(95), price: 42000, currency: 'EUR', vatRegime: 'standard', vatAmount: 7980, sellerName: 'Volvo CE Göteborg', sellerCountry: 'DE', invoiceNumber: 'INV-T-009' }, transportIn: { cmrNumber: 'CMR-T-009', carrier: 'HeavyNord', driver: 'Ioannis Papakostas', departureDate: D(93), arrivalDate: D(87), origin: 'Hamburg, DE', destination: 'Thessaloniki, GR', cost: 920 }, storage: { location: 'GR', address: 'Thessaloniki Truck Depot', arrivalDate: D(87), costPerDay: 16 }, sale: { price: 56000, currency: 'EUR', vatRegime: 'standard', vatAmount: 10640 }, documents: [DOC('invoice','FMX Invoice'), DOC('inspection','Volvo Check')], inspection: INSPECTION_FULL },
  { category: 'truck', make: 'DAF', model: 'CF 340 FA', year: 2021, status: 'stored', vin: 'XLRTA47CX0E2310010', plate: 'EHV-CF340', color: 'White', fuelType: 'diesel', gearType: 'automatic', engineCC: 10837, powerKW: 250, mileage: 195000, weightKg: 5500, payloadKg: 12000, purchase: { date: D(45), price: 44000, currency: 'EUR', vatRegime: 'standard', vatAmount: 8360, sellerName: 'DAF Trucks Eindhoven', sellerCountry: 'DE', invoiceNumber: 'INV-T-010' }, transportIn: { cmrNumber: 'CMR-T-010', carrier: 'BeneluxFreight', driver: 'Leonidas Alexandros', departureDate: D(43), arrivalDate: D(37), origin: 'Eindhoven, NL', destination: 'Athens, GR', cost: 1000 }, storage: { location: 'GR', address: 'Athens Truck Depot', arrivalDate: D(37), costPerDay: 13 }, documents: [DOC('invoice','DAF CF Invoice'), DOC('coc','DAF COC')], inspection: INSPECTION_FULL },

  // ── VANS (5) ──
  { category: 'van', make: 'Mercedes-Benz', model: 'Sprinter 314 CDI', year: 2021, status: 'for_sale', vin: 'WDB9066031L031001', plate: 'S-SP 3140', color: 'White', fuelType: 'diesel', gearType: 'manual', engineCC: 1950, powerKW: 105, mileage: 125000, weightKg: 2100, payloadKg: 1200, purchase: { date: D(55), price: 22000, currency: 'EUR', vatRegime: 'margin', sellerName: 'MB Vans Stuttgart', sellerCountry: 'DE', invoiceNumber: 'INV-V-001' }, transportIn: { cmrNumber: 'CMR-V-001', carrier: 'VanTrans', driver: 'Christos Manolis', departureDate: D(53), arrivalDate: D(49), origin: 'Stuttgart, DE', destination: 'Thessaloniki, GR', cost: 380 }, storage: { location: 'GR', address: 'Thessaloniki Van Depot', arrivalDate: D(49), costPerDay: 7 }, sale: { price: 28500, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','Sprinter Invoice'), DOC('registration','KFZ Van')], inspection: INSPECTION_FULL },
  { category: 'van', make: 'Volkswagen', model: 'Crafter 30 TDI', year: 2020, status: 'stored', vin: 'WV1ZZZ2EZL9032002', plate: 'WOB-CR 30', color: 'Silver', fuelType: 'diesel', gearType: 'manual', engineCC: 1968, powerKW: 103, mileage: 155000, weightKg: 2200, payloadKg: 1000, purchase: { date: D(80), price: 19500, currency: 'EUR', vatRegime: 'margin', sellerName: 'VW Nutzfahrzeuge Hannover', sellerCountry: 'DE', invoiceNumber: 'INV-V-002' }, transportIn: { cmrNumber: 'CMR-V-002', carrier: 'LogisTrans', driver: 'Vangelis Anagnostopoulos', departureDate: D(78), arrivalDate: D(73), origin: 'Hannover, DE', destination: 'Athens, GR', cost: 400 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(73), costPerDay: 7 }, documents: [DOC('invoice','Crafter Invoice')], inspection: INSPECTION_FULL },
  { category: 'van', make: 'Ford', model: 'Transit Custom 2.0 TDCi', year: 2021, status: 'purchased', vin: 'WF0XXXTTGXLA33003', plate: 'K-FT 2000', color: 'White', fuelType: 'diesel', gearType: 'manual', engineCC: 1995, powerKW: 96, mileage: 87000, weightKg: 1890, payloadKg: 1100, purchase: { date: D(6), price: 21000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Ford Commercial Köln', sellerCountry: 'DE', invoiceNumber: 'INV-V-003' }, documents: [DOC('invoice','Transit Invoice')], inspection: INSPECTION_FULL },
  { category: 'van', make: 'Renault', model: 'Master 2.3 dCi', year: 2020, status: 'sold', vin: 'VF1MA000X63034004', plate: 'PA-MA 230', color: 'White', fuelType: 'diesel', gearType: 'manual', engineCC: 2298, powerKW: 120, mileage: 168000, weightKg: 2100, payloadKg: 1400, purchase: { date: D(170), price: 17000, currency: 'EUR', vatRegime: 'margin', sellerName: 'Renault Utilitaires Paris', sellerCountry: 'FR', invoiceNumber: 'INV-V-004' }, transportIn: { cmrNumber: 'CMR-V-004', carrier: 'FranceVan', driver: 'Sotiris Papas', departureDate: D(168), arrivalDate: D(163), origin: 'Paris, FR', destination: 'Thessaloniki, GR', cost: 520 }, storage: { location: 'GR', address: 'Thessaloniki Depot', arrivalDate: D(163), costPerDay: 6 }, sale: { date: D(90), price: 22000, currency: 'EUR', vatRegime: 'margin', buyerName: 'Express Courier SA', buyerCountry: 'GR', invoiceNumber: 'SALE-V-004' }, transportOut: { cmrNumber: 'CMR-OUT-V004', carrier: 'DirectDel', driver: 'Kosmas Parianos', departureDate: D(88), arrivalDate: D(87), origin: 'Thessaloniki', destination: 'Kavala, GR', cost: 120 }, documents: [DOC('invoice','Master Invoice'), DOC('cmr','CMR Master Delivery')], inspection: INSPECTION_FULL },
  { category: 'van', make: 'Fiat', model: 'Ducato 2.3 Multijet', year: 2019, status: 'for_sale', vin: 'ZFA24400005135005', plate: 'TO-DU 230', color: 'White', fuelType: 'diesel', gearType: 'manual', engineCC: 2287, powerKW: 110, mileage: 192000, weightKg: 2100, payloadKg: 1100, purchase: { date: D(100), price: 14500, currency: 'EUR', vatRegime: 'margin', sellerName: 'Fiat Professional Torino', sellerCountry: 'IT', invoiceNumber: 'INV-V-005' }, transportIn: { cmrNumber: 'CMR-V-005', carrier: 'ItalVan', driver: 'Kostas Zervas', departureDate: D(98), arrivalDate: D(93), origin: 'Torino, IT', destination: 'Athens, GR', cost: 340 }, storage: { location: 'GR', address: 'Athens Depot', arrivalDate: D(93), costPerDay: 6 }, sale: { price: 18500, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','Ducato Invoice'), DOC('registration','Carta Circolazione')], inspection: INSPECTION_FULL },

  // ── MOTORCYCLES (5) ──
  { category: 'moto', make: 'BMW', model: 'R 1250 GS Adventure', year: 2021, status: 'for_sale', vin: 'WB10C1309MZR01001', plate: 'M-GS 1250', color: 'Rallye', fuelType: 'petrol', gearType: 'manual', engineCC: 1254, powerKW: 100, mileage: 28000, seats: 2, weightKg: 249, purchase: { date: D(45), price: 14500, currency: 'EUR', vatRegime: 'margin', sellerName: 'BMW Motorrad München', sellerCountry: 'DE', invoiceNumber: 'INV-M-001' }, transportIn: { cmrNumber: 'CMR-M-001', carrier: 'MotoTrans', driver: 'Takis Nikolaou', departureDate: D(43), arrivalDate: D(40), origin: 'München, DE', destination: 'Athens, GR', cost: 280 }, storage: { location: 'GR', address: 'Athens Moto Depot', arrivalDate: D(40), costPerDay: 5 }, sale: { price: 18500, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','GS Adventure Invoice'), DOC('registration','Fahrzeugschein Moto')], inspection: INSPECTION_FULL },
  { category: 'moto', make: 'Honda', model: 'Africa Twin 1100', year: 2022, status: 'stored', vin: 'JH2SD021XNK002002', plate: 'F-AT 1100', color: 'Pearl Glare White', fuelType: 'petrol', gearType: 'automatic', engineCC: 1084, powerKW: 75, mileage: 15000, seats: 2, weightKg: 226, purchase: { date: D(30), price: 13800, currency: 'EUR', vatRegime: 'margin', sellerName: 'Honda Moto Frankfurt', sellerCountry: 'DE', invoiceNumber: 'INV-M-002' }, transportIn: { cmrNumber: 'CMR-M-002', carrier: 'BikeExpress', driver: 'Mixalis Savvas', departureDate: D(28), arrivalDate: D(25), origin: 'Frankfurt, DE', destination: 'Thessaloniki, GR', cost: 270 }, storage: { location: 'GR', address: 'Thessaloniki Moto', arrivalDate: D(25), costPerDay: 4 }, documents: [DOC('invoice','Africa Twin Invoice')], inspection: INSPECTION_FULL },
  { category: 'moto', make: 'Ducati', model: 'Multistrada V4 S', year: 2022, status: 'purchased', vin: 'ZDMAB703XNB003003', plate: 'BO-DU V4', color: 'Ducati Red', fuelType: 'petrol', gearType: 'manual', engineCC: 1158, powerKW: 125, mileage: 8000, seats: 2, weightKg: 243, purchase: { date: D(4), price: 22000, currency: 'EUR', vatRegime: 'standard', vatAmount: 4180, sellerName: 'Ducati Bologna', sellerCountry: 'IT', invoiceNumber: 'INV-M-003' }, documents: [DOC('invoice','Ducati V4 Invoice'), DOC('coc','Ducati COC')], inspection: INSPECTION_FULL },
  { category: 'moto', make: 'KTM', model: '1290 Super Adventure S', year: 2021, status: 'for_sale', vin: 'VBKV39404MF004004', plate: 'WN-KT 1290', color: 'Orange', fuelType: 'petrol', gearType: 'manual', engineCC: 1301, powerKW: 118, mileage: 22000, seats: 2, weightKg: 223, purchase: { date: D(55), price: 17500, currency: 'EUR', vatRegime: 'margin', sellerName: 'KTM Wels', sellerCountry: 'DE', invoiceNumber: 'INV-M-004' }, transportIn: { cmrNumber: 'CMR-M-004', carrier: 'MotoRoute', driver: 'Aris Theodorakis', departureDate: D(53), arrivalDate: D(50), origin: 'Wels, AT', destination: 'Athens, GR', cost: 295 }, storage: { location: 'GR', address: 'Athens Moto', arrivalDate: D(50), costPerDay: 5 }, sale: { price: 21500, currency: 'EUR', vatRegime: 'margin' }, documents: [DOC('invoice','KTM 1290 Invoice')], inspection: INSPECTION_FULL },
  { category: 'moto', make: 'Harley-Davidson', model: 'Road Glide Special', year: 2020, status: 'sold', vin: '1HD1KAC11LB005005', plate: 'MIL-HD RG', color: 'Vivid Black', fuelType: 'petrol', gearType: 'manual', engineCC: 1746, powerKW: 82, mileage: 35000, seats: 2, weightKg: 388, purchase: { date: D(200), price: 25000, currency: 'EUR', vatRegime: 'margin', sellerName: 'H-D Milano', sellerCountry: 'IT', invoiceNumber: 'INV-M-005' }, transportIn: { cmrNumber: 'CMR-M-005', carrier: 'HogTrans', driver: 'Vaggelis Psaras', departureDate: D(198), arrivalDate: D(193), origin: 'Milano, IT', destination: 'Thessaloniki, GR', cost: 310 }, storage: { location: 'GR', address: 'Thessaloniki Moto', arrivalDate: D(193), costPerDay: 6 }, sale: { date: D(110), price: 30500, currency: 'EUR', vatRegime: 'margin', buyerName: 'Theofanis Mpenos', buyerCountry: 'GR', invoiceNumber: 'SALE-M-005' }, transportOut: { cmrNumber: 'CMR-OUT-M005', carrier: 'BikeDeliv', driver: 'Kostas Rigos', departureDate: D(108), arrivalDate: D(107), origin: 'Thessaloniki', destination: 'Ioannina, GR', cost: 180 }, documents: [DOC('invoice','Harley Invoice'), DOC('cmr','CMR Harley Delivery')], inspection: INSPECTION_FULL },

  // ── CONSTRUCTION (10) ──
  { category: 'construction', make: 'Caterpillar', model: '320 Excavator', year: 2018, status: 'for_sale', vin: 'CAT0320JLHB001001', plate: 'CAT-320-GR', color: 'Yellow', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 4400, powerKW: 103, mileage: 8200, weightKg: 20000, payloadKg: 0, purchase: { date: D(120), price: 85000, currency: 'EUR', vatRegime: 'standard', vatAmount: 16150, sellerName: 'CAT Dealer Germany', sellerCountry: 'DE', invoiceNumber: 'INV-C-001' }, transportIn: { cmrNumber: 'CMR-C-001', carrier: 'HeavyMachTrans', driver: 'Giorgos Kalogeropoulos', departureDate: D(118), arrivalDate: D(110), origin: 'Frankfurt, DE', destination: 'Athens, GR', cost: 1800 }, storage: { location: 'GR', address: 'Construction Depot Athens', arrivalDate: D(110), costPerDay: 25, workDone: 'Hydraulic system service, new filters', workCost: 3500 }, sale: { price: 110000, currency: 'EUR', vatRegime: 'standard', vatAmount: 20900 }, documents: [DOC('invoice','CAT 320 Invoice'), DOC('inspection','CAT Service Report'), DOC('registration','Machine Reg Certificate')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Komatsu', model: 'PC210-10 Excavator', year: 2019, status: 'stored', vin: 'KOM210ABCD002002', plate: 'PC210-IT', color: 'Yellow', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 5193, powerKW: 120, mileage: 6500, weightKg: 21000, payloadKg: 0, purchase: { date: D(90), price: 92000, currency: 'EUR', vatRegime: 'standard', vatAmount: 17480, sellerName: 'Komatsu Italia', sellerCountry: 'IT', invoiceNumber: 'INV-C-002' }, transportIn: { cmrNumber: 'CMR-C-002', carrier: 'MachineryTrans', driver: 'Filippos Dimos', departureDate: D(88), arrivalDate: D(80), origin: 'Torino, IT', destination: 'Thessaloniki, GR', cost: 1600 }, storage: { location: 'GR', address: 'Thessaloniki Construction Depot', arrivalDate: D(80), costPerDay: 22 }, documents: [DOC('invoice','Komatsu PC210 Invoice'), DOC('inspection','Komatsu Service')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'JCB', model: '3CX Backhoe Loader', year: 2020, status: 'sold', vin: 'JCBSLWH99W0003003', plate: 'JCB-3CX-DE', color: 'Yellow', fuelType: 'diesel', gearType: 'manual', engineCC: 4400, powerKW: 74, mileage: 5800, weightKg: 8200, payloadKg: 1200, purchase: { date: D(250), price: 52000, currency: 'EUR', vatRegime: 'standard', vatAmount: 9880, sellerName: 'JCB Deutschland', sellerCountry: 'DE', invoiceNumber: 'INV-C-003' }, transportIn: { cmrNumber: 'CMR-C-003', carrier: 'ConstructTrans', driver: 'Xristos Mavridis', departureDate: D(248), arrivalDate: D(240), origin: 'Cologne, DE', destination: 'Athens, GR', cost: 1400 }, storage: { location: 'GR', address: 'Athens Construction', arrivalDate: D(240), costPerDay: 20 }, sale: { date: D(150), price: 68000, currency: 'EUR', vatRegime: 'standard', vatAmount: 12920, buyerName: 'Kataskeves Hellas AE', buyerCountry: 'GR', invoiceNumber: 'SALE-C-003' }, transportOut: { cmrNumber: 'CMR-OUT-C003', carrier: 'MachDelivery', driver: 'Makis Bakas', departureDate: D(148), arrivalDate: D(144), origin: 'Athens', destination: 'Corinth, GR', cost: 350 }, documents: [DOC('invoice','JCB 3CX Invoice'), DOC('cmr','CMR JCB Delivery'), DOC('inspection','JCB Service History')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Liebherr', model: 'R 926 Compact', year: 2019, status: 'transit_in', vin: 'LIE926XYZW004004', plate: 'LH-926-AT', color: 'Yellow/Black', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 4500, powerKW: 115, mileage: 9200, weightKg: 26000, payloadKg: 0, purchase: { date: D(20), price: 95000, currency: 'EUR', vatRegime: 'standard', vatAmount: 18050, sellerName: 'Liebherr Biberach', sellerCountry: 'DE', invoiceNumber: 'INV-C-004' }, transportIn: { cmrNumber: 'CMR-C-004', carrier: 'HeavyAlpine', driver: 'Dimos Hatzigeorgiou', departureDate: D(18), origin: 'Biberach, DE', destination: 'Thessaloniki, GR', cost: 2000 }, documents: [DOC('invoice','Liebherr R926 Invoice'), DOC('coc','Liebherr Declaration')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Volvo', model: 'EC220E Excavator', year: 2020, status: 'purchased', vin: 'VCE220EFGH005005', plate: 'VCE-220-SE', color: 'Orange', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 4800, powerKW: 122, mileage: 4200, weightKg: 22500, payloadKg: 0, purchase: { date: D(9), price: 105000, currency: 'EUR', vatRegime: 'standard', vatAmount: 19950, sellerName: 'Volvo CE Eskilstuna', sellerCountry: 'DE', invoiceNumber: 'INV-C-005' }, documents: [DOC('invoice','Volvo EC220 Invoice'), DOC('inspection','CE Inspection Report')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Caterpillar', model: '950M Wheel Loader', year: 2019, status: 'stored', vin: 'CAT950MKLM006006', plate: 'CAT-950-US', color: 'Yellow', fuelType: 'diesel', gearType: 'automatic', engineCC: 7100, powerKW: 168, mileage: 7800, weightKg: 19000, payloadKg: 5000, purchase: { date: D(75), price: 115000, currency: 'EUR', vatRegime: 'standard', vatAmount: 21850, sellerName: 'CAT Europe', sellerCountry: 'DE', invoiceNumber: 'INV-C-006' }, transportIn: { cmrNumber: 'CMR-C-006', carrier: 'GiantTrans', driver: 'Stavros Xatzis', departureDate: D(73), arrivalDate: D(65), origin: 'Brussels, BE', destination: 'Athens, GR', cost: 2200 }, storage: { location: 'GR', address: 'Athens Heavy Equipment', arrivalDate: D(65), costPerDay: 30, workDone: 'Tires replacement, bucket refurb', workCost: 8000 }, documents: [DOC('invoice','CAT 950M Invoice'), DOC('registration','Machine Certificate USA')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Hitachi', model: 'ZX210LC-6 Excavator', year: 2018, status: 'for_sale', vin: 'HTZX210LMNP007007', plate: 'HIT-210-JP', color: 'Orange', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 4390, powerKW: 107, mileage: 11500, weightKg: 21000, payloadKg: 0, purchase: { date: D(110), price: 72000, currency: 'EUR', vatRegime: 'standard', vatAmount: 13680, sellerName: 'Hitachi Construction EU', sellerCountry: 'DE', invoiceNumber: 'INV-C-007' }, transportIn: { cmrNumber: 'CMR-C-007', carrier: 'EastMachTrans', driver: 'Pantelis Kouros', departureDate: D(108), arrivalDate: D(100), origin: 'Hamburg, DE', destination: 'Thessaloniki, GR', cost: 1750 }, storage: { location: 'GR', address: 'Thessaloniki Heavy Depot', arrivalDate: D(100), costPerDay: 22 }, sale: { price: 92000, currency: 'EUR', vatRegime: 'standard', vatAmount: 17480 }, documents: [DOC('invoice','Hitachi ZX210 Invoice'), DOC('inspection','Hitachi Maintenance Log')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Doosan', model: 'DX225LC-5 Excavator', year: 2019, status: 'delivered', vin: 'DOS225QRST008008', plate: 'DOO-225-KR', color: 'Orange', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 5882, powerKW: 118, mileage: 8900, weightKg: 22500, payloadKg: 0, purchase: { date: D(200), price: 78000, currency: 'EUR', vatRegime: 'standard', vatAmount: 14820, sellerName: 'Doosan EU Berlin', sellerCountry: 'DE', invoiceNumber: 'INV-C-008' }, transportIn: { cmrNumber: 'CMR-C-008', carrier: 'AsiaEuroTrans', driver: 'Michalis Alexopoulos', departureDate: D(198), arrivalDate: D(190), origin: 'Berlin, DE', destination: 'Athens, GR', cost: 1900 }, storage: { location: 'GR', address: 'Athens Construction Depot', arrivalDate: D(190), costPerDay: 20 }, sale: { date: D(100), price: 99000, currency: 'EUR', vatRegime: 'standard', vatAmount: 18810, buyerName: 'Construction Group SA', buyerCountry: 'GR', invoiceNumber: 'SALE-C-008' }, transportOut: { cmrNumber: 'CMR-OUT-C008', carrier: 'HeavyRoute', driver: 'Giorgos Takas', departureDate: D(98), arrivalDate: D(92), origin: 'Athens', destination: 'Thessaloniki, GR', cost: 650 }, documents: [DOC('invoice','Doosan Invoice'), DOC('cmr','CMR Doosan Delivered'), DOC('inspection','Doosan Service')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Case', model: 'CX130D Excavator', year: 2020, status: 'stored', vin: 'CASEQX130UVWX009', plate: 'CASE-130-IT', color: 'Yellow', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 3600, powerKW: 73, mileage: 3800, weightKg: 14000, payloadKg: 0, purchase: { date: D(50), price: 65000, currency: 'EUR', vatRegime: 'standard', vatAmount: 12350, sellerName: 'CNH Industrial Italia', sellerCountry: 'IT', invoiceNumber: 'INV-C-009' }, transportIn: { cmrNumber: 'CMR-C-009', carrier: 'ItalMachTrans', driver: 'Stratos Mpourmas', departureDate: D(48), arrivalDate: D(42), origin: 'Milano, IT', destination: 'Thessaloniki, GR', cost: 1500 }, storage: { location: 'GR', address: 'Thessaloniki Construction', arrivalDate: D(42), costPerDay: 18 }, documents: [DOC('invoice','Case CX130 Invoice'), DOC('coc','CE Mark Certificate')], inspection: INSPECTION_FULL },
  { category: 'construction', make: 'Hyundai', model: 'HX220L Excavator', year: 2021, status: 'for_sale', vin: 'HDXHX220YYZZ010', plate: 'HYU-220-KR', color: 'Orange', fuelType: 'diesel', gearType: 'other' as 'manual', engineCC: 5898, powerKW: 122, mileage: 2900, weightKg: 22000, payloadKg: 0, purchase: { date: D(40), price: 88000, currency: 'EUR', vatRegime: 'standard', vatAmount: 16720, sellerName: 'Hyundai CE Germany', sellerCountry: 'DE', invoiceNumber: 'INV-C-010' }, transportIn: { cmrNumber: 'CMR-C-010', carrier: 'KoreanEuroTrans', driver: 'Aristeidis Nikolaou', departureDate: D(38), arrivalDate: D(30), origin: 'Hamburg, DE', destination: 'Athens, GR', cost: 1850 }, storage: { location: 'GR', address: 'Athens Heavy Equipment', arrivalDate: D(30), costPerDay: 24 }, sale: { price: 112000, currency: 'EUR', vatRegime: 'standard', vatAmount: 21280 }, documents: [DOC('invoice','Hyundai HX220 Invoice'), DOC('inspection','CE Inspection')], inspection: INSPECTION_FULL },
]

export default function SeedPage() {
  const { reload } = useFleetStore()
  const [status, setStatus] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)

  const runSeed = async () => {
    setRunning(true)
    setProgress(0)
    setDone(false)
    let ok = 0, fail = 0

    for (let i = 0; i < SEED_VEHICLES.length; i++) {
      const v = SEED_VEHICLES[i]
      setStatus(`Inserting ${i+1}/${SEED_VEHICLES.length}: ${v.make} ${v.model}...`)
      try {
        const result = await dbCreateVehicle(v)
        if (result) { ok++ } else { fail++; setStatus(`❌ Failed: ${v.make} ${v.model}`) }
      } catch (e) {
        fail++
        setStatus(`❌ Error: ${e}`)
      }
      setProgress(Math.round(((i+1) / SEED_VEHICLES.length) * 100))
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 300))
    }

    await reload()
    setStatus(`✅ Done! ${ok} inserted, ${fail} failed.`)
    setDone(true)
    setRunning(false)
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🌱 Seed Test Data</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 20 }}>
          Inserts 50 test vehicles (20 cars, 10 trucks, 5 vans, 5 motorcycles, 10 construction)
          with all fields filled — purchase, transport, storage, sale, documents, inspection.
        </p>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Categories:</div>
          {[
            { label: '🚗 Cars', count: 20 },
            { label: '🚛 Trucks', count: 10 },
            { label: '🚐 Vans', count: 5 },
            { label: '🏍️ Motorcycles', count: 5 },
            { label: '🏗️ Construction', count: 10 },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{c.label}</span>
              <strong>{c.count}</strong>
            </div>
          ))}
        </div>

        {!done && (
          <button
            className="btn btn-primary"
            onClick={runSeed}
            disabled={running}
            style={{ width: '100%', padding: '14px', fontSize: 16, fontWeight: 700, marginBottom: 16 }}
          >
            {running ? `⏳ Running... ${progress}%` : '🌱 Insert 50 Test Vehicles'}
          </button>
        )}

        {running && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.3s' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text2)' }}>{status}</div>
          </div>
        )}

        {done && (
          <div style={{ background: '#16a34a', color: 'white', padding: 16, borderRadius: 8, fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
            {status}
            <div style={{ marginTop: 12 }}>
              <a href="/vehicles" style={{ color: 'white', textDecoration: 'underline' }}>→ Go to Vehicles</a>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
