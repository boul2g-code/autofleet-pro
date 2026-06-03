// Auto-fill specs by make + model + fuel
// Format: 'Make|Model|fuel': { engineCC, powerKW, doors, seats, gearType }

export interface VehicleSpecSuggestion {
  engineCC?: number
  powerKW?: number
  doors?: number
  seats?: number
  gearType?: string
  category?: string
}

const SPECS: Record<string, VehicleSpecSuggestion> = {
  // BMW
  'BMW|116d|diesel':       { engineCC:1496, powerKW:85,  doors:5, seats:5, gearType:'manual' },
  'BMW|118d|diesel':       { engineCC:1995, powerKW:110, doors:5, seats:5, gearType:'manual' },
  'BMW|120d|diesel':       { engineCC:1995, powerKW:140, doors:5, seats:5, gearType:'automatic' },
  'BMW|318d|diesel':       { engineCC:1995, powerKW:110, doors:4, seats:5, gearType:'automatic' },
  'BMW|320d|diesel':       { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic' },
  'BMW|320i|petrol':       { engineCC:1998, powerKW:135, doors:4, seats:5, gearType:'automatic' },
  'BMW|330d|diesel':       { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic' },
  'BMW|520d|diesel':       { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic' },
  'BMW|530d|diesel':       { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic' },
  'BMW|X3 xDrive20d|diesel':{ engineCC:1995, powerKW:140, doors:5, seats:5, gearType:'automatic' },
  'BMW|X5 xDrive30d|diesel':{ engineCC:2993, powerKW:190, doors:5, seats:5, gearType:'automatic' },
  // Mercedes
  'Mercedes-Benz|A 180d|diesel':   { engineCC:1461, powerKW:85,  doors:5, seats:5, gearType:'automatic' },
  'Mercedes-Benz|C 200d|diesel':   { engineCC:1950, powerKW:118, doors:4, seats:5, gearType:'automatic' },
  'Mercedes-Benz|C 220d|diesel':   { engineCC:1950, powerKW:143, doors:4, seats:5, gearType:'automatic' },
  'Mercedes-Benz|E 220d|diesel':   { engineCC:1950, powerKW:143, doors:4, seats:5, gearType:'automatic' },
  'Mercedes-Benz|Sprinter 316|diesel':{ engineCC:2143, powerKW:120, doors:4, seats:3, gearType:'manual', category:'van' },
  // Volkswagen
  'Volkswagen|Golf 1.6 TDI|diesel':{ engineCC:1598, powerKW:85,  doors:5, seats:5, gearType:'manual' },
  'Volkswagen|Golf 2.0 TDI|diesel':{ engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'manual' },
  'Volkswagen|Passat 2.0 TDI|diesel':{ engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic' },
  'Volkswagen|Transporter|diesel': { engineCC:1968, powerKW:102, doors:4, seats:3, gearType:'manual', category:'van' },
  'Volkswagen|Crafter|diesel':     { engineCC:1968, powerKW:130, doors:4, seats:3, gearType:'manual', category:'van' },
  // Audi
  'Audi|A3 2.0 TDI|diesel':        { engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'manual' },
  'Audi|A4 2.0 TDI|diesel':        { engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic' },
  'Audi|A6 2.0 TDI|diesel':        { engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic' },
  'Audi|Q3 2.0 TDI|diesel':        { engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'automatic' },
  'Audi|Q5 2.0 TDI|diesel':        { engineCC:1968, powerKW:140, doors:5, seats:5, gearType:'automatic' },
  // Renault
  'Renault|Megane 1.5 dCi|diesel': { engineCC:1461, powerKW:81,  doors:5, seats:5, gearType:'manual' },
  'Renault|Clio 1.5 dCi|diesel':   { engineCC:1461, powerKW:66,  doors:5, seats:5, gearType:'manual' },
  'Renault|Master|diesel':         { engineCC:2299, powerKW:107, doors:4, seats:3, gearType:'manual', category:'van' },
  'Renault|Kangoo|diesel':         { engineCC:1461, powerKW:66,  doors:5, seats:5, gearType:'manual', category:'van' },
  // Fiat
  'Fiat|Ducato|diesel':            { engineCC:2287, powerKW:96,  doors:4, seats:3, gearType:'manual', category:'van' },
  'Fiat|500 1.2|petrol':           { engineCC:1242, powerKW:51,  doors:3, seats:4, gearType:'manual' },
  'Fiat|Tipo 1.6 Multijet|diesel': { engineCC:1598, powerKW:88,  doors:4, seats:5, gearType:'manual' },
  // Toyota
  'Toyota|Yaris 1.5 Hybrid|hybrid':{ engineCC:1490, powerKW:92,  doors:5, seats:5, gearType:'automatic' },
  'Toyota|Corolla 2.0 Hybrid|hybrid':{ engineCC:1987, powerKW:132, doors:4, seats:5, gearType:'automatic' },
  'Toyota|Land Cruiser|diesel':    { engineCC:4461, powerKW:200, doors:5, seats:7, gearType:'automatic' },
  'Toyota|HiAce|diesel':           { engineCC:2982, powerKW:107, doors:4, seats:3, gearType:'manual', category:'van' },
  // Volvo
  'Volvo|FH 500|diesel':           { engineCC:12777, powerKW:368, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'Volvo|FH 460|diesel':           { engineCC:12777, powerKW:338, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'Volvo|FM 370|diesel':           { engineCC:12777, powerKW:272, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'Volvo|XC60 B4|diesel':          { engineCC:1969, powerKW:145, doors:5, seats:5, gearType:'automatic' },
  'Volvo|XC90 B5|diesel':          { engineCC:1969, powerKW:173, doors:5, seats:7, gearType:'automatic' },
  // Scania
  'Scania|R 500|diesel':           { engineCC:12740, powerKW:368, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'Scania|R 450|diesel':           { engineCC:12740, powerKW:331, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'Scania|P 360|diesel':           { engineCC:9290,  powerKW:265, doors:2, seats:2, gearType:'manual', category:'truck' },
  // MAN
  'MAN|TGX 500|diesel':            { engineCC:12419, powerKW:368, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'MAN|TGS 400|diesel':            { engineCC:10518, powerKW:294, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'MAN|TGL 12.250|diesel':         { engineCC:4580,  powerKW:184, doors:2, seats:2, gearType:'manual', category:'truck' },
  // Iveco
  'Iveco|Daily 35S|diesel':        { engineCC:2287, powerKW:107, doors:4, seats:3, gearType:'manual', category:'van' },
  'Iveco|Stralis 460|diesel':      { engineCC:12880, powerKW:338, doors:2, seats:2, gearType:'automatic', category:'truck' },
  // DAF
  'DAF|XF 530|diesel':             { engineCC:12902, powerKW:390, doors:2, seats:2, gearType:'automatic', category:'truck' },
  'DAF|CF 400|diesel':             { engineCC:10837, powerKW:294, doors:2, seats:2, gearType:'automatic', category:'truck' },
  // Ford
  'Ford|Transit|diesel':           { engineCC:1995, powerKW:96,  doors:4, seats:3, gearType:'manual', category:'van' },
  'Ford|Focus 1.5 TDCi|diesel':    { engineCC:1499, powerKW:88,  doors:5, seats:5, gearType:'manual' },
  'Ford|Mondeo 2.0 TDCi|diesel':   { engineCC:1997, powerKW:110, doors:4, seats:5, gearType:'automatic' },
  // Hyundai
  'Hyundai|i20 1.4 CRDi|diesel':   { engineCC:1396, powerKW:66,  doors:5, seats:5, gearType:'manual' },
  'Hyundai|Tucson 2.0 CRDi|diesel':{ engineCC:1995, powerKW:100, doors:5, seats:5, gearType:'automatic' },
  'Hyundai|HX220|diesel':          { engineCC:5890, powerKW:118, doors:1, seats:1, gearType:'manual', category:'construction' },
  // Komatsu
  'Komatsu|PC210|diesel':          { engineCC:5193, powerKW:112, doors:1, seats:1, gearType:'manual', category:'construction' },
  'Komatsu|PC360|diesel':          { engineCC:8000, powerKW:188, doors:1, seats:1, gearType:'manual', category:'construction' },
  // Caterpillar
  'Caterpillar|320|diesel':        { engineCC:7010, powerKW:103, doors:1, seats:1, gearType:'manual', category:'construction' },
  'Caterpillar|330|diesel':        { engineCC:8800, powerKW:186, doors:1, seats:1, gearType:'manual', category:'construction' },
  'Caterpillar|906|diesel':        { engineCC:3400, powerKW:55,  doors:1, seats:1, gearType:'manual', category:'construction' },
  // JCB
  'JCB|3CX|diesel':                { engineCC:4400, powerKW:81,  doors:1, seats:1, gearType:'manual', category:'construction' },
  // Hitachi
  'Hitachi|ZX210|diesel':          { engineCC:5193, powerKW:114, doors:1, seats:1, gearType:'manual', category:'construction' },
  // Doosan
  'Doosan|DX225|diesel':           { engineCC:5890, powerKW:118, doors:1, seats:1, gearType:'manual', category:'construction' },
}

export function getVehicleSpecs(
  make: string,
  model: string,
  fuel: string
): VehicleSpecSuggestion | null {
  // Try exact match
  const key = `${make}|${model}|${fuel}`
  if (SPECS[key]) return SPECS[key]

  // Try partial model match (e.g. "320d" matches "BMW|320d|diesel")
  for (const [k, v] of Object.entries(SPECS)) {
    const [km, kmod] = k.split('|')
    if (km === make && model.toLowerCase().includes(kmod.toLowerCase().replace(/\s+/g,''))) {
      return v
    }
  }

  return null
}
