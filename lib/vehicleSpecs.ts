// Local vehicle spec parser — no API, no AI, pure rules
// Covers European market naming conventions

export interface VehicleSpecSuggestion {
  engineCC?: number
  powerKW?: number
  fuelType?: string
  gearType?: string
  confidence: 'high' | 'low'  // low = don't fill powerKW
}

// ── Fuel detection patterns ──────────────────────────────────
const DIESEL_PATTERNS = [
  /\bTDI\b/i, /\bTDCi\b/i, /\bCDI\b/i, /\bdCi\b/i, /\bHDi\b/i,
  /\bBlueHDi\b/i, /\bJTD\b/i, /\bMultijet\b/i, /\bCRDi\b/i,
  /\bD-4D\b/i, /\bSDI\b/i, /\bTDI\b/i, /\bDTI\b/i,
  // BMW diesel suffix: 116d, 118d, 120d, 220d, 320d, 520d, 730d etc
  /\b\d{3}d\b/i,
  // Mercedes: C220d, E220d, GLC300d
  /\b[A-Z]\d{3}d\b/i,
  // Audi: Q5 40 TDI, e-tron 50
  /\b\d{2}\s?TDI\b/i,
  // Generic diesel marker
  /\bdiesel\b/i,
]

const PETROL_PATTERNS = [
  /\bTSI\b/i, /\bTFSI\b/i, /\bVVT-?i\b/i, /\bMPI\b/i,
  /\bPureTech\b/i, /\bEcoBoost\b/i, /\bGTI\b/i, /\bGSI\b/i,
  /\bSkyactiv-G\b/i, /\bMIVEC\b/i, /\bSCe\b/i, /\bTCe\b/i,
  /\bGDI\b/i, /\bT-GDI\b/i, /\bSmartStream\b/i,
  // BMW petrol suffix: 116i, 118i, 120i, 320i, 520i, 730i
  /\b\d{3}i\b/i,
  // Mercedes petrol: C200, C300 (no letter suffix usually)
  /\bpetrol\b/i, /\bbenzina\b/i, /\bessence\b/i,
]

const ELECTRIC_PATTERNS = [
  /\be-tron\b/i, /\bEV\b/i, /\bElectric\b/i, /\biX\b/i,
  /\bZOE\b/i, /\bLeaf\b/i, /\bTesla\b/i, /\bID\.\d/i,
  /\bEQC\b/i, /\bEQA\b/i, /\bEQB\b/i, /\bEQS\b/i,
  /\bMustang Mach-E\b/i, /\bIoniq\s?5\b/i, /\bIoniq\s?6\b/i,
  /\bKona Electric\b/i, /\bNiro EV\b/i,
]

const HYBRID_PATTERNS = [
  /\bHybrid\b/i, /\bPHEV\b/i, /\beHybrid\b/i, /\be-Hybrid\b/i,
  /\bMild.?Hybrid\b/i, /\bSelf.?Charging\b/i,
  /\bYaris\s+Hybrid\b/i, /\bCorolla\s+Hybrid\b/i,
  /\b330e\b/i, /\b530e\b/i, /\b745e\b/i, /\bGLE\s*350e\b/i,
]

// ── Engine CC from displacement string ───────────────────────
// Maps "1.6" → 1598, "2.0" → 1995 etc (real-world values)
const CC_MAP: Record<string, number> = {
  '0.9': 875,  '1.0': 999,  '1.2': 1197, '1.3': 1298,
  '1.4': 1395, '1.5': 1461, '1.6': 1598, '1.7': 1699,
  '1.8': 1798, '1.9': 1896, '2.0': 1995, '2.1': 2148,
  '2.2': 2143, '2.3': 2299, '2.4': 2393, '2.5': 2497,
  '2.7': 2698, '2.8': 2773, '3.0': 2993, '3.2': 3197,
  '3.5': 3498, '4.0': 3982, '4.4': 4395, '5.0': 4999,
  // Trucks/construction
  '6.7': 6728, '7.0': 6996, '9.0': 8974, '10.0': 10518,
  '12.0': 11967, '12.7': 12740, '12.9': 12902, '13.0': 12880,
}

// ── High-confidence overrides for common European models ─────
interface Override { engineCC: number; powerKW?: number; fuelType: string; confidence: 'high' }
const OVERRIDES: Record<string, Override> = {
  // Audi
  'audi|a3 1.6 tdi':    { engineCC:1598, powerKW:85,  fuelType:'diesel', confidence:'high' },
  'audi|a3 2.0 tdi':    { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'audi|a4 2.0 tdi':    { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'audi|a6 2.0 tdi':    { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'audi|q3 2.0 tdi':    { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'audi|q5 2.0 tdi':    { engineCC:1968, powerKW:140, fuelType:'diesel', confidence:'high' },
  'audi|a3 1.4 tfsi':   { engineCC:1395, powerKW:92,  fuelType:'petrol', confidence:'high' },
  'audi|a4 1.8 tfsi':   { engineCC:1798, powerKW:120, fuelType:'petrol', confidence:'high' },
  // BMW
  'bmw|116d':  { engineCC:1496, powerKW:85,  fuelType:'diesel', confidence:'high' },
  'bmw|118d':  { engineCC:1995, powerKW:110, fuelType:'diesel', confidence:'high' },
  'bmw|120d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
  'bmw|220d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
  'bmw|318d':  { engineCC:1995, powerKW:110, fuelType:'diesel', confidence:'high' },
  'bmw|320d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
  'bmw|330d':  { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
  'bmw|520d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
  'bmw|530d':  { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
  'bmw|116i':  { engineCC:1499, powerKW:75,  fuelType:'petrol', confidence:'high' },
  'bmw|118i':  { engineCC:1499, powerKW:103, fuelType:'petrol', confidence:'high' },
  'bmw|120i':  { engineCC:1998, powerKW:135, fuelType:'petrol', confidence:'high' },
  'bmw|320i':  { engineCC:1998, powerKW:135, fuelType:'petrol', confidence:'high' },
  'bmw|x3 20d': { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
  'bmw|x5 30d': { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
  // Mercedes
  'mercedes-benz|c 200':     { engineCC:1991, powerKW:135, fuelType:'petrol', confidence:'high' },
  'mercedes-benz|c 220 cdi': { engineCC:2143, powerKW:125, fuelType:'diesel', confidence:'high' },
  'mercedes-benz|c 220 d':   { engineCC:1950, powerKW:143, fuelType:'diesel', confidence:'high' },
  'mercedes-benz|e 220 d':   { engineCC:1950, powerKW:143, fuelType:'diesel', confidence:'high' },
  'mercedes-benz|a 180 d':   { engineCC:1461, powerKW:85,  fuelType:'diesel', confidence:'high' },
  // Volkswagen
  'volkswagen|golf 1.6 tdi':  { engineCC:1598, powerKW:85,  fuelType:'diesel', confidence:'high' },
  'volkswagen|golf 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'volkswagen|golf 1.4 tsi':  { engineCC:1395, powerKW:92,  fuelType:'petrol', confidence:'high' },
  'volkswagen|passat 2.0 tdi':{ engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
  'volkswagen|polo 1.0 tsi':  { engineCC:999,  powerKW:70,  fuelType:'petrol', confidence:'high' },
  // Renault
  'renault|clio 1.5 dci':     { engineCC:1461, powerKW:66,  fuelType:'diesel', confidence:'high' },
  'renault|megane 1.5 dci':   { engineCC:1461, powerKW:81,  fuelType:'diesel', confidence:'high' },
  'renault|scenic 1.5 dci':   { engineCC:1461, powerKW:81,  fuelType:'diesel', confidence:'high' },
  // Fiat
  'fiat|500 1.2':              { engineCC:1242, powerKW:51,  fuelType:'petrol', confidence:'high' },
  'fiat|tipo 1.6 multijet':   { engineCC:1598, powerKW:88,  fuelType:'diesel', confidence:'high' },
  'fiat|panda 1.3 multijet':  { engineCC:1248, powerKW:55,  fuelType:'diesel', confidence:'high' },
  // Toyota
  'toyota|yaris 1.5 hybrid':  { engineCC:1490, powerKW:92,  fuelType:'hybrid', confidence:'high' },
  'toyota|corolla 2.0 hybrid':{ engineCC:1987, powerKW:132, fuelType:'hybrid', confidence:'high' },
  // Peugeot
  'peugeot|208 1.5 bluehdi':  { engineCC:1499, powerKW:73,  fuelType:'diesel', confidence:'high' },
  'peugeot|308 1.5 bluehdi':  { engineCC:1499, powerKW:96,  fuelType:'diesel', confidence:'high' },
  'peugeot|3008 1.5 bluehdi': { engineCC:1499, powerKW:96,  fuelType:'diesel', confidence:'high' },
  // Opel/Vauxhall
  'opel|astra 1.6 cdti':      { engineCC:1598, powerKW:100, fuelType:'diesel', confidence:'high' },
  'opel|insignia 2.0 cdti':   { engineCC:1956, powerKW:110, fuelType:'diesel', confidence:'high' },
  // Ford
  'ford|focus 1.5 tdci':      { engineCC:1499, powerKW:88,  fuelType:'diesel', confidence:'high' },
  'ford|mondeo 2.0 tdci':     { engineCC:1997, powerKW:110, fuelType:'diesel', confidence:'high' },
  'ford|fiesta 1.5 tdci':     { engineCC:1499, powerKW:55,  fuelType:'diesel', confidence:'high' },
  // Trucks
  'volvo|fh 500':  { engineCC:12777, powerKW:368, fuelType:'diesel', confidence:'high' },
  'volvo|fh 460':  { engineCC:12777, powerKW:338, fuelType:'diesel', confidence:'high' },
  'scania|r 500':  { engineCC:12740, powerKW:368, fuelType:'diesel', confidence:'high' },
  'man|tgx 500':   { engineCC:12419, powerKW:368, fuelType:'diesel', confidence:'high' },
}

// ── Main parser ──────────────────────────────────────────────
export function parseVehicleSpecs(
  make: string,
  model: string
): VehicleSpecSuggestion | null {
  if (!make && !model) return null
  const combined = `${make} ${model}`.toLowerCase().trim()
  const modelLower = model.toLowerCase().trim()

  // 1. Check high-confidence overrides
  const overrideKey = `${make.toLowerCase()}|${modelLower}`
  if (OVERRIDES[overrideKey]) {
    const o = OVERRIDES[overrideKey]
    return { engineCC: o.engineCC, powerKW: o.powerKW, fuelType: o.fuelType, confidence: 'high' }
  }

  // 2. Parse from model string
  const result: VehicleSpecSuggestion = { confidence: 'low' }
  let filled = false

  // Detect fuel type
  if (ELECTRIC_PATTERNS.some(p => p.test(combined))) {
    result.fuelType = 'electric'; filled = true
  } else if (HYBRID_PATTERNS.some(p => p.test(combined))) {
    result.fuelType = 'hybrid'; filled = true
  } else if (DIESEL_PATTERNS.some(p => p.test(combined))) {
    result.fuelType = 'diesel'; filled = true
  } else if (PETROL_PATTERNS.some(p => p.test(combined))) {
    result.fuelType = 'petrol'; filled = true
  }

  // Detect engine displacement (e.g. "1.6", "2.0")
  const dispMatch = combined.match(/\b(\d\.\d)\b/)
  if (dispMatch) {
    const key = dispMatch[1]
    if (CC_MAP[key]) {
      result.engineCC = CC_MAP[key]
      filled = true
    }
  }

  // If confidence is low, never fill powerKW
  // (too many variants per displacement - e.g. 2.0 TDI can be 90, 110, 140, 150, 184kW)
  delete result.powerKW

  return filled ? result : null
}
