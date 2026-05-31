import type { VehicleCategory } from './types'

export const VEHICLE_MAKES: Record<VehicleCategory, string[]> = {
  car: [
    'Alfa Romeo','Audi','BMW','Chevrolet','Chrysler','Citroën','Dacia','Ferrari',
    'Fiat','Ford','Honda','Hyundai','Jaguar','Jeep','Kia','Lamborghini','Land Rover',
    'Lexus','Maserati','Mazda','Mercedes-Benz','MG','Mini','Mitsubishi','Nissan',
    'Opel','Peugeot','Porsche','Renault','Seat','Skoda','Smart','Subaru','Suzuki',
    'Tesla','Toyota','Volkswagen','Volvo',
  ],
  truck: [
    'DAF','Iveco','MAN','Mercedes-Benz','Renault Trucks','Scania','Volvo Trucks',
    'Ford Trucks','Isuzu','Mitsubishi Fuso','Tata','Hino',
  ],
  van: [
    'Citroën','Fiat','Ford','Mercedes-Benz','Opel','Peugeot','Renault','Toyota',
    'Volkswagen','Nissan','Iveco',
  ],
  bus: [
    'Mercedes-Benz','MAN','Volvo','Scania','Iveco','Irisbus','Setra','Neoplan',
    'Otokar','BMC',
  ],
  moto: [
    'BMW','Ducati','Harley-Davidson','Honda','Kawasaki','KTM','Piaggio','Suzuki',
    'Triumph','Vespa','Yamaha',
  ],
  construction: [
    'Caterpillar','JCB','John Deere','Komatsu','Liebherr','Manitou','Merlo',
    'Terex','Volvo CE','Hitachi','Doosan','Hyundai CE','Case CE',
  ],
}

export const VEHICLE_MODELS: Record<string, string[]> = {
  // Cars
  'BMW': ['116d','116i','118d','118i','120d','120i','218d','218i','220d','316d','316i','318d','318i','320d','320i','320d xDrive','325d','330d','330i','335d','340i','418d','420d','420i','430d','518d','520d','520i','523i','525d','528i','530d','530i','535d','540i','630d','640d','730d','730i','740d','740i','750d','M2','M3','M4','M5','M8','X1','X2','X3','X4','X5','X6','X7','iX','i4','i7'],
  'Mercedes-Benz': ['A 180','A 180 d','A 200','A 220','B 180','B 200','C 180','C 200','C 220 d','C 250','C 300','C 43 AMG','CLA 200','CLA 220','CLS 300','E 200','E 220 d','E 250','E 300 de','E 350','E 400','E 43 AMG','GLA 200','GLC 200','GLC 300','GLE 300d','GLE 350','GLS 400','S 400','S 500','S 580','Vito','Sprinter','Actros','Atego'],
  'Audi': ['A1','A3 1.6 TDI','A3 2.0 TDI','A4 2.0 TDI','A4 3.0 TDI','A5','A6 2.0 TDI','A6 3.0 TDI','A7','A8','Q2','Q3','Q5','Q7','Q8','RS3','RS4','RS5','RS6 Avant','RS Q8','S3','S4','S5','S6','TT','e-tron'],
  'Volkswagen': ['Golf 1.4 TSI','Golf 2.0 TDI','Golf GTI','Golf R','Passat 1.4','Passat 2.0 TDI','Tiguan','Touareg','T-Roc','Polo','Arteon','ID.3','ID.4','Caddy','Transporter','Crafter'],
  'Toyota': ['Aygo','Yaris','Corolla','Camry','C-HR','RAV4','Land Cruiser','Hilux','Prius','Auris','Verso','Avensis','GR Yaris','GR86','Supra','bZ4X'],
  'Ford': ['Fiesta','Focus','Mondeo','Kuga','EcoSport','Puma','Mustang','Galaxy','S-Max','C-Max','Transit','Transit Custom','Ranger','Explorer','Bronco'],
  'Renault': ['Clio','Megane','Laguna','Scenic','Kadjar','Captur','Zoe','Talisman','Koleos','Duster','Twingo','Kangoo','Trafic','Master'],
  'Peugeot': ['107','208','308','408','508','2008','3008','5008','e-208','e-2008','Rifter','Partner','Expert','Boxer'],
  'Opel': ['Corsa','Astra','Insignia','Mokka','Grandland','Crossland','Vivaro','Movano','Zafira'],
  'Fiat': ['500','Panda','Punto','Tipo','Bravo','Stilo','500X','500L','Doblo','Ducato','Scudo'],
  'Citroën': ['C1','C3','C4','C5','C5 X','C3 Aircross','C5 Aircross','Berlingo','SpaceTourer','Jumpy','Jumper'],
  'Volvo': ['S60','S90','V60','V90','XC40','XC60','XC90','C40','EX40'],
  'Land Rover': ['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Evoque','Range Rover Velar','Freelander'],
  'Porsche': ['911','Cayenne','Macan','Panamera','Taycan','Boxster','Cayman'],
  'Nissan': ['Micra','Juke','Qashqai','X-Trail','Leaf','Ariya','GT-R','370Z','Navara','NV200','Interstar'],
  'Hyundai': ['i10','i20','i30','i40','i20N','i30N','Tucson','Santa Fe','Kona','Ioniq 5','Ioniq 6'],
  'Kia': ['Picanto','Rio','Ceed','Sportage','Sorento','Stinger','EV6','Niro'],
  'Seat': ['Ibiza','Leon','Arona','Ateca','Tarraco','Cupra Formentor'],
  'Skoda': ['Fabia','Octavia','Superb','Karoq','Kodiaq','Enyaq'],
  'Dacia': ['Sandero','Logan','Duster','Jogger','Spring'],
  'Honda': ['Civic','Jazz','CR-V','HR-V','ZR-V'],
  'Mazda': ['CX-3','CX-5','CX-60','Mazda2','Mazda3','Mazda6'],
  'Jeep': ['Renegade','Compass','Cherokee','Grand Cherokee','Wrangler','Gladiator'],
  'Alfa Romeo': ['Giulia','Stelvio','Giulietta','MiTo','Tonale'],
  'Subaru': ['Forester','Outback','XV','Impreza','Legacy','BRZ'],
  'Mitsubishi': ['Outlander','Eclipse Cross','ASX','L200','Pajero'],
  'Suzuki': ['Swift','Vitara','S-Cross','Jimny','Ignis'],
  'Tesla': ['Model 3','Model Y','Model S','Model X'],
  'Mini': ['Cooper','Clubman','Countryman','Paceman'],

  // Trucks
  'DAF': ['LF 45','LF 55','CF 85','XF 105','XF 480','XF 530'],
  'Scania': ['P 360','R 410','R 450','R 500','S 450','S 500','S 580','G 450'],
  'MAN': ['TGL','TGM','TGS','TGX 18.400','TGX 18.460','TGX 18.500','TGX 26.500'],
  'Volvo Trucks': ['FH 420','FH 460','FH 500','FM 330','FM 420','FMX 450'],
  'Iveco': ['Daily','Eurocargo','Stralis','S-Way','Hi-Way','Trakker'],
  'Renault Trucks': ['C 380','C 460','T 480','T 520','D 210','D 280'],

  // Construction
  'Caterpillar': ['308','315','320','330','345','365','430F2','950','966','980','D5','D6','D8','D9','14M','140M'],
  'JCB': ['3CX','4CX','JS145','JS220','JS260','457','457E','Loadall 526','Loadall 535','Loadall 560'],
  'Komatsu': ['PC200','PC210','PC240','PC290','PC360','WA250','WA380','WA430','D61','D65','D155'],
  'Liebherr': ['A316','A918','A924','R906','R916','R924','R936','L550','L566','LTM 1050','LTM 1100'],
  'Volvo CE': ['EC140','EC200','EC250','EC300','EC380','L70','L90','L120','L150','A25','A30','A40'],
  'Hitachi': ['ZX130','ZX200','ZX250','ZX300','ZX490','EX2600'],

  // Missing car brands
  'Chevrolet': ['Aveo','Spark','Cruze','Malibu','Camaro','Corvette','Equinox','Trax','Captiva','Orlando','Traverse','Tahoe','Suburban','Silverado','Colorado','Trailblazer','Blazer','Bolt','Volt'],
  'Chrysler': ['300','300C','300S','Voyager','Grand Voyager','Pacifica','Sebring','PT Cruiser','Crossfire'],
  'Ferrari': ['488','F8','Roma','Portofino','SF90','812','GTC4Lusso','California','458','F430','360','355'],
  'Jaguar': ['XE','XF','XJ','F-Type','E-Pace','F-Pace','I-Pace','XK','S-Type','X-Type'],
  'Lamborghini': ['Huracán','Urus','Aventador','Gallardo','Murciélago','Diablo','Countach'],
  'Lexus': ['CT200h','IS200','IS300','IS350','ES300','ES350','GS300','GS350','GS450h','LS400','LS460','LS600h','NX200','NX300h','RX300','RX350','RX400h','RX450h','UX','LC500'],
  'Maserati': ['Ghibli','Quattroporte','Levante','GranTurismo','GranCabrio','Grecale','MC20'],
  'MG': ['MG3','MG5','MG6','ZS','HS','EHS','ZS EV','5 EV','MG4','Cyberster'],
  'Smart': ['Fortwo','Forfour','Roadster','Smart #1','Smart #3'],
  // Trucks missing
  'Ford Trucks': ['Transit','Transit Custom','Cargo','F-Max','Trucks 4142'],
  'Isuzu': ['D-Max','N-Series','F-Series','NLR','NMR','NQR','NPR','FVR','FTR'],
  'Mitsubishi Fuso': ['Canter','Fighter','Super Great','Ecanter'],
  'Tata': ['Prima','LPT','Ultra','Starbus','Signa','Xenon'],
  'Hino': ['300','500','700','XL','FD','FG','FL','FM','FS','GH'],
  // Bus
  'Irisbus': ['Crossway','Arway','Evadys','Daily','Agora'],
  'Setra': ['S 415','S 416','S 417','S 431','S 511','S 516','S 517','S 531'],
  'Neoplan': ['Cityliner','Tourliner','Starliner','Skyliner','Euroliner'],
  'Otokar': ['Sultan','Doruk','Territo','Navigo','Vectio','Tempo'],
  'BMC': ['Probus','Procity','Belde','Neocity'],
  // Moto
  'Ducati': ['Panigale V2','Panigale V4','Monster','Multistrada','Diavel','SuperSport','Scrambler','Hypermotard','XDiavel'],
  'Harley-Davidson': ['Sportster','Softail','Touring','Dyna','V-Rod','Street','Pan America','Nightster','Low Rider'],
  'Kawasaki': ['Ninja 300','Ninja 400','Ninja 650','Ninja 1000','Z400','Z650','Z900','Z1000','Versys 650','Versys 1000','ER-6','ZX-10R','ZX-6R','KLX'],
  'KTM': ['Duke 390','Duke 790','Duke 890','Duke 990','RC 390','RC 8','Adventure 390','Adventure 790','Adventure 890','Adventure 1290','Super Duke'],
  'Piaggio': ['Beverly','MP3','Medley','Fly','Typhoon','Zip','Liberty','X-Evo'],
  'Triumph': ['Bonneville','Tiger','Speed Triple','Thruxton','Scrambler','Trident','Rocket','Street Twin','Daytona'],
  'Vespa': ['GTS 125','GTS 150','GTS 300','GTS Super','Primavera 50','Primavera 125','Sprint 125','Elettrica'],
  'Yamaha': ['MT-03','MT-07','MT-09','MT-10','YZF-R1','YZF-R3','YZF-R6','Tracer 700','Tracer 900','Ténéré 700','NMAX','XMAX','TMAX','FZ6','FZ8'],
  // Construction missing
  'John Deere': ['310','410','510','710','324','330','332','344','324G','330G','332G','344G','380G','410G','460G','544','624','644','724','844'],
  'Manitou': ['MLT 625','MLT 630','MLT 635','MLT 737','MLT 840','MHT 10120','MC 18','MT 625','MT 732','MT 932'],
  'Merlo': ['P27.6','P32.6','P38.13','P40.17','P55.9','TF35.7','TF42.7','TF50.8'],
  'Terex': ['AC40','AC50','AC80','AC100','AC200','RT35','RT50','RT100','RT130'],
  'Doosan': ['DX140','DX180','DX225','DX255','DX300','DX380','DX420','DX530','DX700'],
  'Hyundai CE': ['R55','R80','R140','R160','R210','R250','R300','R380','R500','HL740','HL760','HL780'],
  'Case CE': ['580','590','695','770','780','821','856','921','1021','1221','WX148','WX168'],
  }

export const COLORS = [
  { code: 'white', el: 'Λευκό', en: 'White', de: 'Weiß', fr: 'Blanc', it: 'Bianco', es: 'Blanco', hex: '#FFFFFF' },
  { code: 'black', el: 'Μαύρο', en: 'Black', de: 'Schwarz', fr: 'Noir', it: 'Nero', es: 'Negro', hex: '#1a1a1a' },
  { code: 'silver', el: 'Ασημί', en: 'Silver', de: 'Silber', fr: 'Argent', it: 'Argento', es: 'Plata', hex: '#C0C0C0' },
  { code: 'grey', el: 'Γκρι', en: 'Grey', de: 'Grau', fr: 'Gris', it: 'Grigio', es: 'Gris', hex: '#808080' },
  { code: 'blue', el: 'Μπλε', en: 'Blue', de: 'Blau', fr: 'Bleu', it: 'Blu', es: 'Azul', hex: '#1e40af' },
  { code: 'red', el: 'Κόκκινο', en: 'Red', de: 'Rot', fr: 'Rouge', it: 'Rosso', es: 'Rojo', hex: '#dc2626' },
  { code: 'green', el: 'Πράσινο', en: 'Green', de: 'Grün', fr: 'Vert', it: 'Verde', es: 'Verde', hex: '#16a34a' },
  { code: 'brown', el: 'Καφέ', en: 'Brown', de: 'Braun', fr: 'Marron', it: 'Marrone', es: 'Marrón', hex: '#78350f' },
  { code: 'beige', el: 'Μπεζ', en: 'Beige', de: 'Beige', fr: 'Beige', it: 'Beige', es: 'Beige', hex: '#d4b483' },
  { code: 'orange', el: 'Πορτοκαλί', en: 'Orange', de: 'Orange', fr: 'Orange', it: 'Arancione', es: 'Naranja', hex: '#ea580c' },
  { code: 'yellow', el: 'Κίτρινο', en: 'Yellow', de: 'Gelb', fr: 'Jaune', it: 'Giallo', es: 'Amarillo', hex: '#ca8a04' },
  { code: 'purple', el: 'Μοβ', en: 'Purple', de: 'Lila', fr: 'Violet', it: 'Viola', es: 'Morado', hex: '#7c3aed' },
  { code: 'bordeaux', el: 'Μπορντό', en: 'Bordeaux', de: 'Bordeaux', fr: 'Bordeaux', it: 'Bordeaux', es: 'Burdeos', hex: '#7f1d1d' },
  { code: 'gold', el: 'Χρυσό', en: 'Gold', de: 'Gold', fr: 'Or', it: 'Oro', es: 'Dorado', hex: '#b45309' },
  { code: 'other', el: 'Άλλο', en: 'Other', de: 'Andere', fr: 'Autre', it: 'Altro', es: 'Otro', hex: '#6b7280' },
]
