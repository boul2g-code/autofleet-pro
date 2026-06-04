export interface VehicleSpecSuggestion {
  engineCC?: number
  powerKW?: number
  doors?: number
  seats?: number
  gearType?: string
  fuelType?: string
  category?: string
}

// Format: 'Make|Model': specs (fuel-agnostic where possible)
const SPECS: Record<string, VehicleSpecSuggestion> = {
  // ── BMW ──────────────────────────────────────────────────────
  'BMW|116d':        { engineCC:1496, powerKW:85,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'BMW|116i':        { engineCC:1499, powerKW:80,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'BMW|118d':        { engineCC:1995, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'BMW|118i':        { engineCC:1499, powerKW:103, doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'BMW|120d':        { engineCC:1995, powerKW:140, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|120i':        { engineCC:1998, powerKW:135, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|218d':        { engineCC:1995, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|220d':        { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|220i':        { engineCC:1998, powerKW:135, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|318d':        { engineCC:1995, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|318i':        { engineCC:1499, powerKW:103, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|320d':        { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|320i':        { engineCC:1998, powerKW:135, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|325d':        { engineCC:2993, powerKW:160, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|330d':        { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|330i':        { engineCC:2998, powerKW:184, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|418d':        { engineCC:1995, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|420d':        { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|430d':        { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|518d':        { engineCC:1995, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|520d':        { engineCC:1995, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|520i':        { engineCC:1998, powerKW:135, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'BMW|525d':        { engineCC:2993, powerKW:160, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|530d':        { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|535d':        { engineCC:2993, powerKW:220, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|730d':        { engineCC:2993, powerKW:190, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|740d':        { engineCC:2993, powerKW:235, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|X1 sDrive18d':{ engineCC:1995, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'BMW|X1 xDrive20d':{ engineCC:1995, powerKW:140, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|X3 xDrive20d':{ engineCC:1995, powerKW:140, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|X3 xDrive30d':{ engineCC:2993, powerKW:190, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|X5 xDrive30d':{ engineCC:2993, powerKW:190, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'BMW|X5 xDrive40d':{ engineCC:2993, powerKW:235, doors:5, seats:7, gearType:'automatic', fuelType:'diesel' },

  // ── MERCEDES-BENZ ─────────────────────────────────────────────
  'Mercedes-Benz|A 160':      { engineCC:1332, powerKW:80,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Mercedes-Benz|A 180':      { engineCC:1332, powerKW:100, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|A 180d':     { engineCC:1461, powerKW:85,  doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|A 200':      { engineCC:1332, powerKW:120, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|A 200d':     { engineCC:1950, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|B 180':      { engineCC:1332, powerKW:100, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|B 180d':     { engineCC:1461, powerKW:85,  doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|C 180':      { engineCC:1497, powerKW:115, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|C 200':      { engineCC:1497, powerKW:135, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|C 200d':     { engineCC:1950, powerKW:118, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|C 220d':     { engineCC:1950, powerKW:143, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|C 250d':     { engineCC:2143, powerKW:150, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|E 200':      { engineCC:1991, powerKW:135, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Mercedes-Benz|E 200d':     { engineCC:1950, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|E 220d':     { engineCC:1950, powerKW:143, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|E 300d':     { engineCC:1950, powerKW:180, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|GLC 200d':   { engineCC:1950, powerKW:118, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|GLC 220d':   { engineCC:1950, powerKW:143, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|GLE 300d':   { engineCC:1950, powerKW:180, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Mercedes-Benz|Sprinter 314':{ engineCC:2143, powerKW:100, doors:4, seats:3, gearType:'manual',   fuelType:'diesel', category:'van' },
  'Mercedes-Benz|Sprinter 316':{ engineCC:2143, powerKW:120, doors:4, seats:3, gearType:'manual',   fuelType:'diesel', category:'van' },
  'Mercedes-Benz|Sprinter 319':{ engineCC:2987, powerKW:140, doors:4, seats:3, gearType:'automatic',fuelType:'diesel', category:'van' },
  'Mercedes-Benz|Vito 114':   { engineCC:1950, powerKW:100, doors:5, seats:6, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Mercedes-Benz|Vito 116':   { engineCC:1950, powerKW:120, doors:5, seats:6, gearType:'automatic', fuelType:'diesel', category:'van' },
  'Mercedes-Benz|Actros 1845':{ engineCC:12809, powerKW:330, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },
  'Mercedes-Benz|Actros 1851':{ engineCC:12809, powerKW:375, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },
  'Mercedes-Benz|Atego 1218': { engineCC:4801,  powerKW:130, doors:2, seats:2, gearType:'manual',   fuelType:'diesel', category:'truck' },

  // ── VOLKSWAGEN ────────────────────────────────────────────────
  'Volkswagen|Golf 1.0 TSI':  { engineCC:999,  powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Volkswagen|Golf 1.4 TSI':  { engineCC:1395, powerKW:92,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Volkswagen|Golf 1.5 TSI':  { engineCC:1498, powerKW:96,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Volkswagen|Golf 1.6 TDI':  { engineCC:1598, powerKW:85,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Volkswagen|Golf 2.0 TDI':  { engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Volkswagen|Golf 2.0 GTI':  { engineCC:1984, powerKW:180, doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Volkswagen|Polo 1.0 TSI':  { engineCC:999,  powerKW:70,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Volkswagen|Polo 1.6 TDI':  { engineCC:1598, powerKW:80,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Volkswagen|Passat 1.6 TDI':{ engineCC:1598, powerKW:88,  doors:4, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Volkswagen|Passat 2.0 TDI':{ engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Volkswagen|Tiguan 1.5 TSI':{ engineCC:1498, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Volkswagen|Tiguan 2.0 TDI':{ engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Volkswagen|Touareg 3.0 TDI':{ engineCC:2967,powerKW:170, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Volkswagen|Transporter 2.0 TDI':{ engineCC:1968, powerKW:102, doors:4, seats:3, gearType:'manual', fuelType:'diesel', category:'van' },
  'Volkswagen|Crafter 2.0 TDI':{ engineCC:1968, powerKW:130, doors:4, seats:3, gearType:'manual',   fuelType:'diesel', category:'van' },
  'Volkswagen|Caddy 2.0 TDI': { engineCC:1968, powerKW:75,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── AUDI ──────────────────────────────────────────────────────
  'Audi|A1 1.0 TFSI':  { engineCC:999,  powerKW:70,  doors:3, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Audi|A1 1.4 TFSI':  { engineCC:1395, powerKW:92,  doors:3, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Audi|A3 1.6 TDI':   { engineCC:1598, powerKW:85,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Audi|A3 2.0 TDI':   { engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Audi|A3 1.4 TFSI':  { engineCC:1395, powerKW:92,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Audi|A3 1.5 TFSI':  { engineCC:1498, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Audi|A4 1.8 TFSI':  { engineCC:1798, powerKW:118, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Audi|A4 2.0 TDI':   { engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|A4 2.0 TFSI':  { engineCC:1984, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Audi|A4 3.0 TDI':   { engineCC:2967, powerKW:160, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|A6 2.0 TDI':   { engineCC:1968, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|A6 2.0 TFSI':  { engineCC:1984, powerKW:140, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Audi|A6 3.0 TDI':   { engineCC:2967, powerKW:160, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|Q3 1.4 TFSI':  { engineCC:1395, powerKW:92,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Audi|Q3 2.0 TDI':   { engineCC:1968, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|Q5 2.0 TDI':   { engineCC:1968, powerKW:140, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|Q5 3.0 TDI':   { engineCC:2967, powerKW:190, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Audi|Q7 3.0 TDI':   { engineCC:2967, powerKW:170, doors:5, seats:7, gearType:'automatic', fuelType:'diesel' },

  // ── RENAULT ───────────────────────────────────────────────────
  'Renault|Clio 0.9 TCe':     { engineCC:898,  powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Renault|Clio 1.0 TCe':     { engineCC:999,  powerKW:65,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Renault|Clio 1.5 dCi':     { engineCC:1461, powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Renault|Megane 1.5 dCi':   { engineCC:1461, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Renault|Megane 1.6 dCi':   { engineCC:1598, powerKW:96,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Renault|Megane 1.2 TCe':   { engineCC:1197, powerKW:85,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Renault|Scenic 1.5 dCi':   { engineCC:1461, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Renault|Kadjar 1.5 dCi':   { engineCC:1461, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Renault|Kadjar 1.6 dCi':   { engineCC:1598, powerKW:96,  doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Renault|Trafic 1.6 dCi':   { engineCC:1598, powerKW:89,  doors:5, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Renault|Trafic 2.0 dCi':   { engineCC:1995, powerKW:107, doors:5, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Renault|Master 2.3 dCi':   { engineCC:2299, powerKW:107, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Renault|Kangoo 1.5 dCi':   { engineCC:1461, powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── PEUGEOT ───────────────────────────────────────────────────
  'Peugeot|208 1.2 PureTech':  { engineCC:1199, powerKW:74,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Peugeot|208 1.5 BlueHDi':   { engineCC:1499, powerKW:73,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Peugeot|308 1.2 PureTech':  { engineCC:1199, powerKW:96,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Peugeot|308 1.5 BlueHDi':   { engineCC:1499, powerKW:96,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Peugeot|308 2.0 BlueHDi':   { engineCC:1997, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Peugeot|508 1.5 BlueHDi':   { engineCC:1499, powerKW:96,  doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Peugeot|508 2.0 BlueHDi':   { engineCC:1997, powerKW:133, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Peugeot|3008 1.5 BlueHDi':  { engineCC:1499, powerKW:96,  doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Peugeot|Boxer 2.2 HDi':     { engineCC:2198, powerKW:96,  doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Peugeot|Expert 1.5 BlueHDi':{ engineCC:1499, powerKW:96,  doors:5, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── CITROEN ───────────────────────────────────────────────────
  'Citroën|C3 1.2 PureTech':   { engineCC:1199, powerKW:60,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Citroën|C4 1.5 BlueHDi':    { engineCC:1499, powerKW:96,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Citroën|C5 Aircross 1.5':   { engineCC:1499, powerKW:96,  doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Citroën|Berlingo 1.5 BlueHDi':{ engineCC:1499, powerKW:75, doors:5, seats:5, gearType:'manual',   fuelType:'diesel', category:'van' },
  'Citroën|Jumpy 2.0 BlueHDi': { engineCC:1997, powerKW:120, doors:5, seats:3, gearType:'automatic', fuelType:'diesel', category:'van' },
  'Citroën|Jumper 2.2 HDi':    { engineCC:2198, powerKW:96,  doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── OPEL/VAUXHALL ─────────────────────────────────────────────
  'Opel|Corsa 1.2':       { engineCC:1199, powerKW:55,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Opel|Corsa 1.4':       { engineCC:1364, powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Opel|Corsa 1.3 CDTI':  { engineCC:1248, powerKW:55,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Opel|Astra 1.4 Turbo': { engineCC:1399, powerKW:92,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Opel|Astra 1.6 CDTI':  { engineCC:1598, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Opel|Astra 2.0 CDTI':  { engineCC:1956, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Opel|Insignia 2.0 CDTI':{ engineCC:1956, powerKW:110, doors:4, seats:5, gearType:'automatic',fuelType:'diesel' },
  'Opel|Movano 2.3 CDTI': { engineCC:2299, powerKW:107, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Opel|Vivaro 1.6 CDTI': { engineCC:1598, powerKW:89,  doors:5, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── FIAT ──────────────────────────────────────────────────────
  'Fiat|500 1.2':           { engineCC:1242, powerKW:51,  doors:3, seats:4, gearType:'manual',    fuelType:'petrol' },
  'Fiat|500 1.0 Hybrid':    { engineCC:999,  powerKW:51,  doors:3, seats:4, gearType:'manual',    fuelType:'hybrid' },
  'Fiat|Punto 1.2':         { engineCC:1242, powerKW:51,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Fiat|Punto 1.3 Multijet':{ engineCC:1248, powerKW:55,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Fiat|Tipo 1.4':          { engineCC:1368, powerKW:70,  doors:4, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Fiat|Tipo 1.6 Multijet': { engineCC:1598, powerKW:88,  doors:4, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Fiat|Bravo 1.6 Multijet':{ engineCC:1598, powerKW:88,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Fiat|Ducato 2.3 Multijet':{ engineCC:2287, powerKW:96, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Fiat|Ducato 2.3 150hp':  { engineCC:2287, powerKW:110, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Fiat|Doblo 1.6 Multijet':{ engineCC:1598, powerKW:88,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── FORD ──────────────────────────────────────────────────────
  'Ford|Fiesta 1.0 EcoBoost':  { engineCC:999,  powerKW:74,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Ford|Fiesta 1.5 TDCi':      { engineCC:1499, powerKW:55,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Ford|Focus 1.5 EcoBoost':   { engineCC:1499, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Ford|Focus 1.5 TDCi':       { engineCC:1499, powerKW:88,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Ford|Focus 2.0 TDCi':       { engineCC:1997, powerKW:110, doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Ford|Mondeo 1.5 EcoBoost':  { engineCC:1499, powerKW:118, doors:4, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Ford|Mondeo 2.0 TDCi':      { engineCC:1997, powerKW:110, doors:4, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Ford|Kuga 1.5 EcoBoost':    { engineCC:1499, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Ford|Kuga 2.0 TDCi':        { engineCC:1997, powerKW:110, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },
  'Ford|Transit 2.0 TDCi':     { engineCC:1995, powerKW:96,  doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Ford|Transit Custom 2.0':   { engineCC:1995, powerKW:96,  doors:5, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Ford|Transit Connect 1.5':  { engineCC:1499, powerKW:73,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel', category:'van' },

  // ── TOYOTA ────────────────────────────────────────────────────
  'Toyota|Yaris 1.0':           { engineCC:998,  powerKW:51,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Toyota|Yaris 1.5 Hybrid':    { engineCC:1490, powerKW:82,  doors:5, seats:5, gearType:'automatic', fuelType:'hybrid' },
  'Toyota|Auris 1.6':           { engineCC:1598, powerKW:97,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Toyota|Auris 1.4 D-4D':      { engineCC:1364, powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Toyota|Corolla 1.8 Hybrid':  { engineCC:1798, powerKW:90,  doors:4, seats:5, gearType:'automatic', fuelType:'hybrid' },
  'Toyota|Corolla 2.0 Hybrid':  { engineCC:1987, powerKW:132, doors:4, seats:5, gearType:'automatic', fuelType:'hybrid' },
  'Toyota|RAV4 2.0':            { engineCC:1987, powerKW:116, doors:5, seats:5, gearType:'automatic', fuelType:'petrol' },
  'Toyota|RAV4 2.5 Hybrid':     { engineCC:2487, powerKW:160, doors:5, seats:5, gearType:'automatic', fuelType:'hybrid' },
  'Toyota|HiAce 2.5 D-4D':      { engineCC:2494, powerKW:101, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Toyota|Land Cruiser 3.0 D':  { engineCC:2982, powerKW:120, doors:5, seats:7, gearType:'automatic', fuelType:'diesel' },

  // ── HYUNDAI / KIA ─────────────────────────────────────────────
  'Hyundai|i10 1.0':      { engineCC:998,  powerKW:49,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Hyundai|i20 1.2':      { engineCC:1197, powerKW:62,  doors:5, seats:5, gearType:'manual',    fuelType:'petrol' },
  'Hyundai|i20 1.4 CRDi': { engineCC:1396, powerKW:66,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Hyundai|i30 1.6 CRDi': { engineCC:1582, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Hyundai|Tucson 2.0 CRDi':{ engineCC:1995, powerKW:100, doors:5, seats:5, gearType:'automatic',fuelType:'diesel' },
  'Kia|Ceed 1.6 CRDi':    { engineCC:1582, powerKW:81,  doors:5, seats:5, gearType:'manual',    fuelType:'diesel' },
  'Kia|Sportage 2.0 CRDi':{ engineCC:1995, powerKW:100, doors:5, seats:5, gearType:'automatic', fuelType:'diesel' },

  // ── VOLVO TRUCKS ──────────────────────────────────────────────
  'Volvo|FH 420':  { engineCC:12777, powerKW:309, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FH 460':  { engineCC:12777, powerKW:338, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FH 500':  { engineCC:12777, powerKW:368, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FH 540':  { engineCC:12777, powerKW:397, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FM 330':  { engineCC:12777, powerKW:243, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FM 370':  { engineCC:12777, powerKW:272, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FM 430':  { engineCC:12777, powerKW:316, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FMX 370': { engineCC:12777, powerKW:272, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FMX 460': { engineCC:12777, powerKW:338, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Volvo|FL 250':  { engineCC:7698,  powerKW:184, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },

  // ── SCANIA ────────────────────────────────────────────────────
  'Scania|R 410':  { engineCC:12740, powerKW:302, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|R 450':  { engineCC:12740, powerKW:331, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|R 500':  { engineCC:12740, powerKW:368, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|R 560':  { engineCC:12740, powerKW:412, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|S 500':  { engineCC:12740, powerKW:368, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|S 560':  { engineCC:12740, powerKW:412, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'Scania|P 280':  { engineCC:9290,  powerKW:206, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },
  'Scania|P 360':  { engineCC:9290,  powerKW:265, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },
  'Scania|G 410':  { engineCC:12740, powerKW:302, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },

  // ── MAN ───────────────────────────────────────────────────────
  'MAN|TGX 400':   { engineCC:12419, powerKW:294, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGX 440':   { engineCC:12419, powerKW:324, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGX 480':   { engineCC:12419, powerKW:353, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGX 510':   { engineCC:12419, powerKW:375, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGS 400':   { engineCC:10518, powerKW:294, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGS 440':   { engineCC:10518, powerKW:324, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'MAN|TGL 12.220':{ engineCC:4580,  powerKW:162, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },
  'MAN|TGL 12.250':{ engineCC:4580,  powerKW:184, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },
  'MAN|TGM 18.250':{ engineCC:6871,  powerKW:184, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },

  // ── IVECO ─────────────────────────────────────────────────────
  'Iveco|Daily 35S14':  { engineCC:2287, powerKW:100, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Iveco|Daily 35S16':  { engineCC:2287, powerKW:116, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Iveco|Daily 50C18':  { engineCC:2998, powerKW:132, doors:4, seats:3, gearType:'manual',    fuelType:'diesel', category:'van' },
  'Iveco|Stralis 420':  { engineCC:12880, powerKW:309, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },
  'Iveco|Stralis 460':  { engineCC:12880, powerKW:338, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },
  'Iveco|Stralis 500':  { engineCC:12880, powerKW:368, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },
  'Iveco|S-Way 480':    { engineCC:12880, powerKW:353, doors:2, seats:2, gearType:'automatic',fuelType:'diesel', category:'truck' },

  // ── DAF ───────────────────────────────────────────────────────
  'DAF|XF 450':  { engineCC:12902, powerKW:331, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|XF 480':  { engineCC:12902, powerKW:353, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|XF 530':  { engineCC:12902, powerKW:390, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|CF 340':  { engineCC:10837, powerKW:250, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|CF 400':  { engineCC:10837, powerKW:294, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|CF 450':  { engineCC:10837, powerKW:331, doors:2, seats:2, gearType:'automatic', fuelType:'diesel', category:'truck' },
  'DAF|LF 180':  { engineCC:3996,  powerKW:132, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },
  'DAF|LF 220':  { engineCC:3996,  powerKW:162, doors:2, seats:2, gearType:'manual',    fuelType:'diesel', category:'truck' },

  // ── CONSTRUCTION ──────────────────────────────────────────────
  'Caterpillar|320':  { engineCC:7010, powerKW:103, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Caterpillar|323':  { engineCC:7010, powerKW:119, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Caterpillar|330':  { engineCC:8800, powerKW:186, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Caterpillar|336':  { engineCC:8800, powerKW:200, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Caterpillar|906':  { engineCC:3400, powerKW:55,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Caterpillar|914':  { engineCC:3600, powerKW:69,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Komatsu|PC130':    { engineCC:3260, powerKW:67,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Komatsu|PC210':    { engineCC:5193, powerKW:112, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Komatsu|PC240':    { engineCC:5193, powerKW:125, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Komatsu|PC360':    { engineCC:8000, powerKW:188, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hyundai|HX130':    { engineCC:3800, powerKW:70,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hyundai|HX220':    { engineCC:5890, powerKW:118, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hyundai|HX300':    { engineCC:8910, powerKW:169, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'JCB|3CX':          { engineCC:4400, powerKW:81,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'JCB|3DX':          { engineCC:4400, powerKW:68,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'JCB|JS220':        { engineCC:5700, powerKW:118, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hitachi|ZX130':    { engineCC:3331, powerKW:70,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hitachi|ZX210':    { engineCC:5193, powerKW:114, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Hitachi|ZX350':    { engineCC:8000, powerKW:188, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Doosan|DX140':     { engineCC:4593, powerKW:85,  doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Doosan|DX225':     { engineCC:5890, powerKW:118, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Doosan|DX380':     { engineCC:8910, powerKW:169, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Liebherr|R 926':   { engineCC:6700, powerKW:130, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Liebherr|R 936':   { engineCC:6700, powerKW:160, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
  'Liebherr|R 945':   { engineCC:8700, powerKW:200, doors:1, seats:1, gearType:'manual', fuelType:'diesel', category:'construction' },
}

export function getVehicleSpecs(
  make: string,
  model: string,
  fuel?: string
): VehicleSpecSuggestion | null {
  // 1. Exact match: make + model (fuel-agnostic)
  const key = `${make}|${model}`
  if (SPECS[key]) return SPECS[key]

  // 2. Case-insensitive exact match
  const keyLower = key.toLowerCase()
  for (const [k, v] of Object.entries(SPECS)) {
    if (k.toLowerCase() === keyLower) return v
  }

  // 3. Same make, model starts with same prefix (e.g. "A3 1.6 TDI" → "Audi|A3 1.6 TDI")
  const makeModel = `${make}|${model}`.toLowerCase()
  for (const [k, v] of Object.entries(SPECS)) {
    if (k.toLowerCase() === makeModel) return v
  }

  return null
}


// ── Regex-based spec parser (no API needed) ─────────────────────────────────
export interface ParsedSpecs {
  fuelType?: string
  engineCC?: number
  powerKW?: number
  confidence: 'high' | 'low'
}

export function parseVehicleSpecs(make: string, model: string): ParsedSpecs | null {
  if (!make && !model) return null
  const s = `${make} ${model}`.toLowerCase()
  const result: ParsedSpecs = { confidence: 'low' }
  let filled = false

  // Fuel detection
  if (/e-tron|\bev\b|electric|ioniq|zoe|\bid\./i.test(s)) { result.fuelType = 'electric'; filled = true }
  else if (/hybrid|phev|ehybrid/i.test(s)) { result.fuelType = 'hybrid'; filled = true }
  else if (/tdi|tdci|cdi|dci|hdi|bluehdi|jtd|multijet|crdi|d-4d|xdrive2\dd|sdrive1\dd|\d{3}d\b/i.test(s)) { result.fuelType = 'diesel'; filled = true }
  else if (/tsi|tfsi|vvt-?i|mpi|puretech|ecoboost|\d{3}i\b/i.test(s)) { result.fuelType = 'petrol'; filled = true }

  // Engine CC from displacement (e.g. "1.6" → 1598)
  const CC: Record<string, number> = {
    '0.9':875,'1.0':999,'1.2':1197,'1.3':1298,'1.4':1395,'1.5':1461,
    '1.6':1598,'1.7':1699,'1.8':1798,'1.9':1896,'2.0':1995,'2.1':2148,
    '2.2':2143,'2.3':2299,'2.4':2393,'2.5':2497,'2.7':2698,'2.8':2773,
    '3.0':2993,'3.2':3197,'3.5':3498,'4.0':3982,'4.4':4395
  }
  const m = s.match(/\b(\d\.\d)\b/)
  if (m && CC[m[1]]) { result.engineCC = CC[m[1]]; filled = true }

  // High-confidence overrides (exact make+model)
  const key = `${make.toLowerCase()}|${model.toLowerCase().trim()}`
  const OVERRIDES: Record<string, ParsedSpecs> = {
    // BMW diesel
    'bmw|116d':  { engineCC:1496, powerKW:85,  fuelType:'diesel', confidence:'high' },
    'bmw|118d':  { engineCC:1995, powerKW:110, fuelType:'diesel', confidence:'high' },
    'bmw|120d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
    'bmw|220d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
    'bmw|318d':  { engineCC:1995, powerKW:110, fuelType:'diesel', confidence:'high' },
    'bmw|320d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
    'bmw|330d':  { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
    'bmw|520d':  { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
    'bmw|530d':  { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
    'bmw|x1 sdrive18d': { engineCC:1499, powerKW:100, fuelType:'diesel', confidence:'high' },
    'bmw|x3 xdrive20d': { engineCC:1995, powerKW:140, fuelType:'diesel', confidence:'high' },
    'bmw|x5 xdrive30d': { engineCC:2993, powerKW:190, fuelType:'diesel', confidence:'high' },
    // BMW petrol
    'bmw|116i':  { engineCC:1499, powerKW:75,  fuelType:'petrol', confidence:'high' },
    'bmw|118i':  { engineCC:1499, powerKW:103, fuelType:'petrol', confidence:'high' },
    'bmw|120i':  { engineCC:1998, powerKW:135, fuelType:'petrol', confidence:'high' },
    'bmw|320i':  { engineCC:1998, powerKW:135, fuelType:'petrol', confidence:'high' },
    // Audi
    'audi|a3 1.6 tdi':  { engineCC:1598, powerKW:85,  fuelType:'diesel', confidence:'high' },
    'audi|a3 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'audi|a4 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'audi|a6 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'audi|q3 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'audi|q5 40 tdi':   { engineCC:1968, powerKW:150, fuelType:'diesel', confidence:'high' },
    'audi|q5 2.0 tdi':  { engineCC:1968, powerKW:140, fuelType:'diesel', confidence:'high' },
    // Mercedes
    'mercedes-benz|c 220 cdi': { engineCC:2143, powerKW:125, fuelType:'diesel', confidence:'high' },
    'mercedes-benz|c220 cdi':  { engineCC:2143, powerKW:125, fuelType:'diesel', confidence:'high' },
    'mercedes-benz|c220d':     { engineCC:1950, powerKW:143, fuelType:'diesel', confidence:'high' },
    'mercedes-benz|e 220 d':   { engineCC:1950, powerKW:143, fuelType:'diesel', confidence:'high' },
    'mercedes-benz|e220d':     { engineCC:1950, powerKW:143, fuelType:'diesel', confidence:'high' },
    'mercedes-benz|a 180 d':   { engineCC:1461, powerKW:85,  fuelType:'diesel', confidence:'high' },
    'mercedes-benz|a180d':     { engineCC:1461, powerKW:85,  fuelType:'diesel', confidence:'high' },
    // VW
    'volkswagen|golf 1.6 tdi':  { engineCC:1598, powerKW:85,  fuelType:'diesel', confidence:'high' },
    'volkswagen|golf 2.0 tdi':  { engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'volkswagen|tiguan 2.0 tdi':{ engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    'volkswagen|passat 2.0 tdi':{ engineCC:1968, powerKW:110, fuelType:'diesel', confidence:'high' },
    // Renault
    'renault|clio 1.5 dci':    { engineCC:1461, powerKW:66, fuelType:'diesel', confidence:'high' },
    'renault|megane 1.5 dci':  { engineCC:1461, powerKW:81, fuelType:'diesel', confidence:'high' },
    'renault|scenic 1.5 dci':  { engineCC:1461, powerKW:81, fuelType:'diesel', confidence:'high' },
    // Toyota Hybrid
    'toyota|yaris hybrid':    { engineCC:1490, powerKW:92,  fuelType:'hybrid', confidence:'high' },
    'toyota|corolla hybrid':  { engineCC:1987, powerKW:132, fuelType:'hybrid', confidence:'high' },
    'toyota|yaris 1.5 hybrid':{ engineCC:1490, powerKW:92,  fuelType:'hybrid', confidence:'high' },
    // Tesla
    'tesla|model 3':  { engineCC:0, powerKW:283, fuelType:'electric', confidence:'high' },
    'tesla|model y':  { engineCC:0, powerKW:220, fuelType:'electric', confidence:'high' },
    'tesla|model s':  { engineCC:0, powerKW:340, fuelType:'electric', confidence:'high' },
    // Fiat
    'fiat|ducato':    { engineCC:2287, powerKW:96,  fuelType:'diesel', confidence:'high' },
    'fiat|500 1.2':   { engineCC:1242, powerKW:51,  fuelType:'petrol', confidence:'high' },
  }
  if (OVERRIDES[key]) return OVERRIDES[key]

  return filled ? result : null
}
