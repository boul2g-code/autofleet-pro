// Vehicle colors with hex preview values
export interface VehicleColor {
  name: string      // English name
  el: string        // Greek
  de: string        // German
  hex: string       // for color preview dot
}

export const VEHICLE_COLORS: VehicleColor[] = [
  // Whites
  { name: 'White',               el: 'Λευκό',              de: 'Weiß',               hex: '#FFFFFF' },
  { name: 'Pearl White',         el: 'Περλέ Λευκό',        de: 'Perlweiß',           hex: '#F8F4F0' },
  { name: 'Glacier White',       el: 'Παγετώδες Λευκό',    de: 'Gletscherweiß',      hex: '#F0F4F8' },
  { name: 'Cream White',         el: 'Κρεμ',               de: 'Cremeweiß',           hex: '#FFFDD0' },

  // Blacks & Greys
  { name: 'Black',               el: 'Μαύρο',              de: 'Schwarz',            hex: '#0A0A0A' },
  { name: 'Metallic Black',      el: 'Μεταλλικό Μαύρο',   de: 'Metallschwarz',      hex: '#1C1C1C' },
  { name: 'Anthracite',          el: 'Ανθρακί',            de: 'Anthrazit',          hex: '#383838' },
  { name: 'Dark Grey',           el: 'Σκούρο Γκρι',        de: 'Dunkelgrau',         hex: '#4A4A4A' },
  { name: 'Grey',                el: 'Γκρι',               de: 'Grau',               hex: '#808080' },
  { name: 'Silver Grey',         el: 'Ασημογκρι',          de: 'Silbergrau',         hex: '#C0C0C0' },
  { name: 'Light Grey',          el: 'Ανοιχτό Γκρι',       de: 'Hellgrau',           hex: '#D3D3D3' },

  // Silvers
  { name: 'Silver',              el: 'Ασημί',              de: 'Silber',             hex: '#C0C0C0' },
  { name: 'Metallic Silver',     el: 'Μεταλλικό Ασημί',   de: 'Silbermetallic',     hex: '#A8A9AD' },
  { name: 'Graphite',            el: 'Γραφίτης',           de: 'Graphit',            hex: '#6B6B6B' },

  // Blues
  { name: 'Blue',                el: 'Μπλε',               de: 'Blau',               hex: '#0066CC' },
  { name: 'Dark Blue',           el: 'Σκούρο Μπλε',        de: 'Dunkelblau',         hex: '#003380' },
  { name: 'Navy Blue',           el: 'Ναυτικό Μπλε',       de: 'Marineblau',         hex: '#001F5B' },
  { name: 'Metallic Blue',       el: 'Μεταλλικό Μπλε',    de: 'Blaumetallic',       hex: '#4169E1' },
  { name: 'Light Blue',          el: 'Γαλάζιο',            de: 'Hellblau',           hex: '#87CEEB' },
  { name: 'Sky Blue',            el: 'Ουρανί',             de: 'Himmelblau',         hex: '#00BFFF' },
  { name: 'Midnight Blue',       el: 'Μπλε Μεσάνυχτα',    de: 'Mitternachtsblau',   hex: '#191970' },
  { name: 'Petrol Blue',         el: 'Πετρόλ',             de: 'Petrolblau',         hex: '#005F6B' },

  // Reds
  { name: 'Red',                 el: 'Κόκκινο',            de: 'Rot',                hex: '#CC0000' },
  { name: 'Dark Red',            el: 'Σκούρο Κόκκινο',     de: 'Dunkelrot',          hex: '#8B0000' },
  { name: 'Burgundy',            el: 'Μπορντό',            de: 'Bordeaux',           hex: '#800020' },
  { name: 'Metallic Red',        el: 'Μεταλλικό Κόκκινο',  de: 'Rotmetallic',        hex: '#CC2200' },
  { name: 'Cherry Red',          el: 'Κερασί',             de: 'Kirschrot',          hex: '#990011' },
  { name: 'Ferrari Red',         el: 'Κόκκινο Ferrari',    de: 'Ferrarirot',         hex: '#FF2800' },
  { name: 'Wine Red',            el: 'Κρασί',              de: 'Weinrot',            hex: '#722F37' },

  // Greens
  { name: 'Green',               el: 'Πράσινο',            de: 'Grün',               hex: '#228B22' },
  { name: 'Dark Green',          el: 'Σκούρο Πράσινο',     de: 'Dunkelgrün',         hex: '#006400' },
  { name: 'British Racing Green',el: 'Racing Green',        de: 'Britisch Grün',      hex: '#004225' },
  { name: 'Olive Green',         el: 'Λαδί',               de: 'Olivgrün',           hex: '#808000' },
  { name: 'Metallic Green',      el: 'Μεταλλικό Πράσινο',  de: 'Grünmetallic',       hex: '#2E8B57' },
  { name: 'Mint Green',          el: 'Μέντα',              de: 'Mintgrün',           hex: '#98FF98' },

  // Browns & Beiges
  { name: 'Brown',               el: 'Καφέ',               de: 'Braun',              hex: '#8B4513' },
  { name: 'Bronze',              el: 'Μπρούτζινο',         de: 'Bronze',             hex: '#CD7F32' },
  { name: 'Beige',               el: 'Μπεζ',               de: 'Beige',              hex: '#F5F5DC' },
  { name: 'Champagne',           el: 'Σαμπάνια',           de: 'Champagner',         hex: '#F7E7CE' },
  { name: 'Sand',                el: 'Άμμου',              de: 'Sand',               hex: '#C2B280' },
  { name: 'Caramel',             el: 'Καραμέλα',           de: 'Karamell',           hex: '#C68642' },

  // Yellows & Golds
  { name: 'Yellow',              el: 'Κίτρινο',            de: 'Gelb',               hex: '#FFD700' },
  { name: 'Gold',                el: 'Χρυσό',              de: 'Gold',               hex: '#FFD700' },
  { name: 'Metallic Gold',       el: 'Μεταλλικό Χρυσό',   de: 'Goldmetallic',       hex: '#CFB53B' },

  // Oranges
  { name: 'Orange',              el: 'Πορτοκαλί',          de: 'Orange',             hex: '#FF6600' },
  { name: 'Dark Orange',         el: 'Σκούρο Πορτοκαλί',  de: 'Dunkelorange',       hex: '#CC4400' },

  // Purples
  { name: 'Purple',              el: 'Μωβ',                de: 'Lila',               hex: '#800080' },
  { name: 'Violet',              el: 'Βιολετί',            de: 'Violett',            hex: '#EE82EE' },

  // Special finishes
  { name: 'Metallic',            el: 'Μεταλλικό',          de: 'Metallic',           hex: '#AAA9AD' },
  { name: 'Matte Black',         el: 'Ματ Μαύρο',          de: 'Mattschwarz',        hex: '#28282B' },
  { name: 'Matte Grey',          el: 'Ματ Γκρι',           de: 'Mattgrau',           hex: '#828282' },
  { name: 'Matte White',         el: 'Ματ Λευκό',          de: 'Mattweiß',           hex: '#F5F5F5' },
  { name: 'Matte Green',         el: 'Ματ Πράσινο',        de: 'Mattgrün',           hex: '#4B6043' },
  { name: 'Two-tone',            el: 'Δίχρωμο',            de: 'Zweifarbig',         hex: '#888888' },
  { name: 'Other',               el: 'Άλλο',               de: 'Sonstige',           hex: '#CCCCCC' },
]

export function getColorName(name: string, lang: 'el' | 'en' | 'de'): string {
  const c = VEHICLE_COLORS.find(c => c.name === name || c.el === name || c.de === name)
  if (!c) return name
  return lang === 'el' ? c.el : lang === 'de' ? c.de : c.name
}
