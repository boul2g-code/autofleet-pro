// Auto-fill specs by make + model + fuel
// Format: 'Make|Model|fuel': { engine_cc, power_kw, doors, seats, gear }

export interface VehicleSpecSuggestion {
  engine_cc?: number
  power_kw?: number
  doors?: number
  seats?: number
  gear_type?: string
  category?: string
}

const SPECS: Record<string, VehicleSpecSuggestion> = {
  // BMW
  'BMW|116d|diesel':       { engine_cc:1496, power_kw:85,  doors:5, seats:5, gear_type:'manual' },
  'BMW|118d|diesel':       { engine_cc:1995, power_kw:110, doors:5, seats:5, gear_type:'manual' },
  'BMW|120d|diesel':       { engine_cc:1995, power_kw:140, doors:5, seats:5, gear_type:'automatic' },
  'BMW|318d|diesel':       { engine_cc:1995, power_kw:110, doors:4, seats:5, gear_type:'automatic' },
  'BMW|320d|diesel':       { engine_cc:1995, power_kw:140, doors:4, seats:5, gear_type:'automatic' },
  'BMW|320i|petrol':       { engine_cc:1998, power_kw:135, doors:4, seats:5, gear_type:'automatic' },
  'BMW|330d|diesel':       { engine_cc:2993, power_kw:190, doors:4, seats:5, gear_type:'automatic' },
  'BMW|520d|diesel':       { engine_cc:1995, power_kw:140, doors:4, seats:5, gear_type:'automatic' },
  'BMW|530d|diesel':       { engine_cc:2993, power_kw:190, doors:4, seats:5, gear_type:'automatic' },
  'BMW|X3 xDrive20d|diesel':{ engine_cc:1995, power_kw:140, doors:5, seats:5, gear_type:'automatic' },
  'BMW|X5 xDrive30d|diesel':{ engine_cc:2993, power_kw:190, doors:5, seats:5, gear_type:'automatic' },
  // Mercedes
  'Mercedes-Benz|A 180d|diesel':   { engine_cc:1461, power_kw:85,  doors:5, seats:5, gear_type:'automatic' },
  'Mercedes-Benz|C 200d|diesel':   { engine_cc:1950, power_kw:118, doors:4, seats:5, gear_type:'automatic' },
  'Mercedes-Benz|C 220d|diesel':   { engine_cc:1950, power_kw:143, doors:4, seats:5, gear_type:'automatic' },
  'Mercedes-Benz|E 220d|diesel':   { engine_cc:1950, power_kw:143, doors:4, seats:5, gear_type:'automatic' },
  'Mercedes-Benz|Sprinter 316|diesel':{ engine_cc:2143, power_kw:120, doors:4, seats:3, gear_type:'manual', category:'van' },
  // Volkswagen
  'Volkswagen|Golf 1.6 TDI|diesel':{ engine_cc:1598, power_kw:85,  doors:5, seats:5, gear_type:'manual' },
  'Volkswagen|Golf 2.0 TDI|diesel':{ engine_cc:1968, power_kw:110, doors:5, seats:5, gear_type:'manual' },
  'Volkswagen|Passat 2.0 TDI|diesel':{ engine_cc:1968, power_kw:110, doors:4, seats:5, gear_type:'automatic' },
  'Volkswagen|Transporter|diesel': { engine_cc:1968, power_kw:102, doors:4, seats:3, gear_type:'manual', category:'van' },
  'Volkswagen|Crafter|diesel':     { engine_cc:1968, power_kw:130, doors:4, seats:3, gear_type:'manual', category:'van' },
  // Audi
  'Audi|A3 2.0 TDI|diesel':        { engine_cc:1968, power_kw:110, doors:5, seats:5, gear_type:'manual' },
  'Audi|A4 2.0 TDI|diesel':        { engine_cc:1968, power_kw:110, doors:4, seats:5, gear_type:'automatic' },
  'Audi|A6 2.0 TDI|diesel':        { engine_cc:1968, power_kw:110, doors:4, seats:5, gear_type:'automatic' },
  'Audi|Q3 2.0 TDI|diesel':        { engine_cc:1968, power_kw:110, doors:5, seats:5, gear_type:'automatic' },
  'Audi|Q5 2.0 TDI|diesel':        { engine_cc:1968, power_kw:140, doors:5, seats:5, gear_type:'automatic' },
  // Renault
  'Renault|Megane 1.5 dCi|diesel': { engine_cc:1461, power_kw:81,  doors:5, seats:5, gear_type:'manual' },
  'Renault|Clio 1.5 dCi|diesel':   { engine_cc:1461, power_kw:66,  doors:5, seats:5, gear_type:'manual' },
  'Renault|Master|diesel':         { engine_cc:2299, power_kw:107, doors:4, seats:3, gear_type:'manual', category:'van' },
  'Renault|Kangoo|diesel':         { engine_cc:1461, power_kw:66,  doors:5, seats:5, gear_type:'manual', category:'van' },
  // Fiat
  'Fiat|Ducato|diesel':            { engine_cc:2287, power_kw:96,  doors:4, seats:3, gear_type:'manual', category:'van' },
  'Fiat|500 1.2|petrol':           { engine_cc:1242, power_kw:51,  doors:3, seats:4, gear_type:'manual' },
  'Fiat|Tipo 1.6 Multijet|diesel': { engine_cc:1598, power_kw:88,  doors:4, seats:5, gear_type:'manual' },
  // Toyota
  'Toyota|Yaris 1.5 Hybrid|hybrid':{ engine_cc:1490, power_kw:92,  doors:5, seats:5, gear_type:'automatic' },
  'Toyota|Corolla 2.0 Hybrid|hybrid':{ engine_cc:1987, power_kw:132, doors:4, seats:5, gear_type:'automatic' },
  'Toyota|Land Cruiser|diesel':    { engine_cc:4461, power_kw:200, doors:5, seats:7, gear_type:'automatic' },
  'Toyota|HiAce|diesel':           { engine_cc:2982, power_kw:107, doors:4, seats:3, gear_type:'manual', category:'van' },
  // Volvo
  'Volvo|FH 500|diesel':           { engine_cc:12777, power_kw:368, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'Volvo|FH 460|diesel':           { engine_cc:12777, power_kw:338, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'Volvo|FM 370|diesel':           { engine_cc:12777, power_kw:272, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'Volvo|XC60 B4|diesel':          { engine_cc:1969, power_kw:145, doors:5, seats:5, gear_type:'automatic' },
  'Volvo|XC90 B5|diesel':          { engine_cc:1969, power_kw:173, doors:5, seats:7, gear_type:'automatic' },
  // Scania
  'Scania|R 500|diesel':           { engine_cc:12740, power_kw:368, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'Scania|R 450|diesel':           { engine_cc:12740, power_kw:331, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'Scania|P 360|diesel':           { engine_cc:9290,  power_kw:265, doors:2, seats:2, gear_type:'manual', category:'truck' },
  // MAN
  'MAN|TGX 500|diesel':            { engine_cc:12419, power_kw:368, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'MAN|TGS 400|diesel':            { engine_cc:10518, power_kw:294, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'MAN|TGL 12.250|diesel':         { engine_cc:4580,  power_kw:184, doors:2, seats:2, gear_type:'manual', category:'truck' },
  // Iveco
  'Iveco|Daily 35S|diesel':        { engine_cc:2287, power_kw:107, doors:4, seats:3, gear_type:'manual', category:'van' },
  'Iveco|Stralis 460|diesel':      { engine_cc:12880, power_kw:338, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  // DAF
  'DAF|XF 530|diesel':             { engine_cc:12902, power_kw:390, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  'DAF|CF 400|diesel':             { engine_cc:10837, power_kw:294, doors:2, seats:2, gear_type:'automatic', category:'truck' },
  // Ford
  'Ford|Transit|diesel':           { engine_cc:1995, power_kw:96,  doors:4, seats:3, gear_type:'manual', category:'van' },
  'Ford|Focus 1.5 TDCi|diesel':    { engine_cc:1499, power_kw:88,  doors:5, seats:5, gear_type:'manual' },
  'Ford|Mondeo 2.0 TDCi|diesel':   { engine_cc:1997, power_kw:110, doors:4, seats:5, gear_type:'automatic' },
  // Hyundai
  'Hyundai|i20 1.4 CRDi|diesel':   { engine_cc:1396, power_kw:66,  doors:5, seats:5, gear_type:'manual' },
  'Hyundai|Tucson 2.0 CRDi|diesel':{ engine_cc:1995, power_kw:100, doors:5, seats:5, gear_type:'automatic' },
  'Hyundai|HX220|diesel':          { engine_cc:5890, power_kw:118, doors:1, seats:1, gear_type:'manual', category:'construction' },
  // Komatsu
  'Komatsu|PC210|diesel':          { engine_cc:5193, power_kw:112, doors:1, seats:1, gear_type:'manual', category:'construction' },
  'Komatsu|PC360|diesel':          { engine_cc:8000, power_kw:188, doors:1, seats:1, gear_type:'manual', category:'construction' },
  // Caterpillar
  'Caterpillar|320|diesel':        { engine_cc:7010, power_kw:103, doors:1, seats:1, gear_type:'manual', category:'construction' },
  'Caterpillar|330|diesel':        { engine_cc:8800, power_kw:186, doors:1, seats:1, gear_type:'manual', category:'construction' },
  'Caterpillar|906|diesel':        { engine_cc:3400, power_kw:55,  doors:1, seats:1, gear_type:'manual', category:'construction' },
  // JCB
  'JCB|3CX|diesel':                { engine_cc:4400, power_kw:81,  doors:1, seats:1, gear_type:'manual', category:'construction' },
  // Hitachi
  'Hitachi|ZX210|diesel':          { engine_cc:5193, power_kw:114, doors:1, seats:1, gear_type:'manual', category:'construction' },
  // Doosan
  'Doosan|DX225|diesel':           { engine_cc:5890, power_kw:118, doors:1, seats:1, gear_type:'manual', category:'construction' },
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
