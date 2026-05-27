// ── 3 connected marketplaces (deep integration) ──────────────
export interface Marketplace {
  id: string; name: string; country: string; flag: string
  url: string; submitUrl: string; color: string
  categories: string[]; connected: boolean
}

export const CONNECTED_MARKETPLACES: Marketplace[] = [
  {
    id: 'autoscout24_it', name: 'AutoScout24', country: 'IT/EU', flag: '🇪🇺',
    url: 'https://www.autoscout24.it', submitUrl: 'https://www.autoscout24.it/account/listings/new',
    color: '#F4A100', categories: ['car','van','truck','moto','bus','construction'], connected: true,
  },
  {
    id: 'mobile_de', name: 'Mobile.de', country: 'DE', flag: '🇩🇪',
    url: 'https://www.mobile.de', submitUrl: 'https://www.mobile.de/fahrzeuge/inserieren',
    color: '#00467F', categories: ['car','van','truck','moto','bus'], connected: true,
  },
  {
    id: 'car_gr', name: 'Car.gr', country: 'GR', flag: '🇬🇷',
    url: 'https://www.car.gr', submitUrl: 'https://www.car.gr/classifieds/cars/add/',
    color: '#00529B', categories: ['car','van','truck','moto','construction'], connected: true,
  },
]

// ── Additional marketplaces as quick links ────────────────────
export interface QuickLink {
  name: string; flag: string; url: string; category: string
}

export const QUICK_LINKS: QuickLink[] = [
  // Cars
  { name: 'AutoTrader UK',          flag: '🇬🇧', url: 'https://www.autotrader.co.uk',        category: 'car' },
  { name: 'Subito.it',              flag: '🇮🇹', url: 'https://www.subito.it/auto/',          category: 'car' },
  { name: 'Automobile.it',          flag: '🇮🇹', url: 'https://www.automobile.it',            category: 'car' },
  { name: 'Mobile.bg',              flag: '🇧🇬', url: 'https://www.mobile.bg',                category: 'car' },
  { name: 'Autovit.ro',             flag: '🇷🇴', url: 'https://www.autovit.ro',               category: 'car' },
  { name: 'OtoMoto.pl',             flag: '🇵🇱', url: 'https://www.otomoto.pl',               category: 'car' },
  { name: 'Hasznaltauto.hu',        flag: '🇭🇺', url: 'https://www.hasznaltauto.hu',          category: 'car' },
  { name: 'Polovni Automobili',     flag: '🇷🇸', url: 'https://www.polovniautomobili.com',    category: 'car' },
  { name: 'Njuškalo.hr',            flag: '🇭🇷', url: 'https://www.njuskalo.hr/auti',         category: 'car' },
  { name: 'XE.gr',                  flag: '🇬🇷', url: 'https://www.xe.gr/cars/',              category: 'car' },
  { name: 'Kleinanzeigen.de',       flag: '🇩🇪', url: 'https://www.kleinanzeigen.de/s-autos/',category: 'car' },
  { name: 'AutoScout24.de',         flag: '🇩🇪', url: 'https://www.autoscout24.de',           category: 'car' },
  // Trucks & Vans
  { name: 'Truck1.eu',              flag: '🇪🇺', url: 'https://www.truck1.eu',                category: 'truck' },
  { name: 'TruckScout24',           flag: '🇪🇺', url: 'https://www.truckscout24.com',         category: 'truck' },
  { name: 'Autoline.eu (Trucks)',   flag: '🇪🇺', url: 'https://autoline.eu/truck-lorry',      category: 'truck' },
  { name: 'Trucksnl.com',           flag: '🇪🇺', url: 'https://www.trucksnl.com',             category: 'truck' },
  { name: 'Mobile.de (Trucks)',     flag: '🇩🇪', url: 'https://suchen.mobile.de/lkw/',        category: 'truck' },
  // Construction
  { name: 'Mascus.com',             flag: '🇪🇺', url: 'https://www.mascus.com',               category: 'construction' },
  { name: 'MachineryZone.eu',       flag: '🇪🇺', url: 'https://www.machineryzone.eu',         category: 'construction' },
  { name: 'Baumaschinen.eu',        flag: '🇩🇪', url: 'https://www.baumaschinen.eu',          category: 'construction' },
  { name: 'Autoline (Construction)',flag: '🇪🇺', url: 'https://autoline.eu/construction',     category: 'construction' },
]

export function getConnectedForCategory(category: string): Marketplace[] {
  return CONNECTED_MARKETPLACES.filter(m => m.categories.includes(category))
}

export function getQuickLinksForCategory(category: string): QuickLink[] {
  return QUICK_LINKS.filter(l => l.category === category || l.category === 'car')
    .filter(l => !CONNECTED_MARKETPLACES.find(m => l.url.includes(m.url.replace('https://www.',''))))
}
