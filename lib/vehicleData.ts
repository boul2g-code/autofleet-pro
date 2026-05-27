// ============================================================
// Vehicle Makes & Models — Complete & Accurate Database
// ============================================================

export const CAR_MAKES: Record<string, string[]> = {
  'Alfa Romeo': ['147','156','159','166','Brera','GTV','Spider','GT','Giulia','Stelvio','Tonale','Giulietta','MiTo','4C','GTA'],
  'Audi': [
    'A1 1.0 TFSI','A1 1.4 TFSI','A1 1.6 TDI',
    'A3 1.2 TFSI','A3 1.4 TFSI','A3 1.6 TDI','A3 1.8 TFSI','A3 2.0 TDI','A3 Sportback','A3 Cabriolet','A3 e-tron',
    'A4 1.8 TFSI','A4 2.0 TFSI','A4 2.0 TDI','A4 3.0 TDI','A4 Avant','A4 Allroad',
    'A5 2.0 TFSI','A5 2.0 TDI','A5 3.0 TDI','A5 Sportback','A5 Cabriolet','A5 Coupé',
    'A6 2.0 TDI','A6 2.0 TFSI','A6 3.0 TDI','A6 Avant','A6 Allroad',
    'A7 3.0 TDI','A7 55 TFSI','A7 Sportback',
    'A8 3.0 TDI','A8 4.2 TDI','A8 6.3 W12 L',
    'Q2 1.0 TFSI','Q2 1.4 TFSI','Q2 1.6 TDI',
    'Q3 1.4 TFSI','Q3 2.0 TDI','Q3 35 TFSI','Q3 40 TDI',
    'Q4 e-tron','Q4 Sportback e-tron',
    'Q5 2.0 TFSI','Q5 2.0 TDI','Q5 3.0 TDI','Q5 40 TDI','Q5 55 TFSI e',
    'Q7 3.0 TDI','Q7 4.2 TDI','Q7 55 TFSI','Q7 e-tron',
    'Q8 50 TDI','Q8 55 TFSI','Q8 e-tron',
    'TT 1.8 TFSI','TT 2.0 TFSI','TT 2.0 TDI','TT RS','TTS',
    'R8 4.2 FSI','R8 5.2 FSI','R8 V10',
    'RS3','RS4 Avant','RS5','RS6 Avant','RS7','RS Q3','RS Q8','S3','S4','S5','S6','S7','S8','SQ5','SQ7','SQ8',
    'e-tron 50','e-tron 55','e-tron GT',
  ],
  'BMW': [
    // 1 Series
    '116i','116d','118i','118d','120i','120d','123d','125i','125d','128ti','130i',
    'M135i','M135i xDrive',
    // 2 Series
    '216i','218i','218d','220i','220d','225i','225xe','228i','230i','235i','M235i',
    '218i Gran Coupé','220i Gran Coupé','M240i','220d Gran Coupé',
    '218i Active Tourer','225xe Active Tourer','220d Active Tourer',
    '216d Gran Tourer','218i Gran Tourer','220i Gran Tourer',
    // 3 Series
    '316i','316d','318i','318d','320i','320d','320d xDrive','325i','325d','328i','330i','330d','330d xDrive','335i','335d','340i','340d',
    '318i Touring','320d Touring','320i Touring','330d Touring','M3','M3 Competition',
    // 4 Series
    '420i','420d','425d','428i','430i','430d','435i','435d','440i','M4','M4 Competition','M440i',
    '420i Gran Coupé','430i Gran Coupé','420d Gran Coupé',
    // 5 Series
    '518d','520i','520d','523i','525i','525d','528i','530i','530d','530d xDrive','535i','535d','540i','540d','545i','550i',
    '518d Touring','520d Touring','530d Touring','M5','M5 Competition',
    // 6 Series
    '620d Gran Turismo','630i Gran Turismo','640i Gran Turismo','640d Gran Turismo',
    '630i','640i','650i','M6',
    // 7 Series
    '725d','730i','730d','730d xDrive','740i','740d','745i','745e','750i','750d','760i','760Li','M760Li',
    // 8 Series
    '840i','840d','M850i','M8',
    // X Models
    'X1 18i','X1 20i','X1 18d','X1 20d','X1 23d',
    'X2 18i','X2 20i','X2 18d','X2 20d','X2 M35i',
    'X3 20i','X3 30i','X3 20d','X3 30d','X3 M40i','X3 M40d','X3 M',
    'X4 20i','X4 30i','X4 20d','X4 30d','X4 M40i','X4 M',
    'X5 30i','X5 40i','X5 50i','X5 30d','X5 40d','X5 45e','X5 M','X5 M Competition',
    'X6 30i','X6 40i','X6 30d','X6 40d','X6 M','X6 M Competition',
    'X7 40i','X7 50i','X7 30d','X7 40d','X7 M60i',
    // Electric
    'iX xDrive40','iX xDrive50','iX M60',
    'i3 60Ah','i3 94Ah','i3 120Ah','i3s',
    'i4 eDrive35','i4 eDrive40','i4 M50',
    'i5 eDrive40','i5 M60 xDrive',
    'i7 xDrive60','i7 M70',
    // Z & M
    'Z3 1.8','Z3 2.0','Z3 2.8','Z3 3.0 M Roadster',
    'Z4 20i','Z4 30i','Z4 M40i','Z4 20d',
    'M2','M2 Competition','M2 CS',
  ],
  'Chevrolet': ['Aveo','Captiva','Cruze','Epica','Lacetti','Matiz','Nubira','Orlando','Spark','Trax','Camaro','Corvette','Silverado','Tahoe','Suburban'],
  'Chrysler': ['300','300C','Pacifica','Voyager','PT Cruiser','Sebring'],
  'Citroën': [
    'C1 1.0','C1 1.2',
    'C2 1.1','C2 1.4','C2 1.6',
    'C3 1.0','C3 1.2 PureTech','C3 1.4','C3 1.6 BlueHDi','C3 Aircross',
    'C4 1.2 PureTech','C4 1.6 BlueHDi','C4 2.0 HDi','C4 Cactus','C4 Picasso','C4 Grand Picasso','C4 SpaceTourer',
    'C5 1.6 THP','C5 2.0 HDi','C5 X','C5 Aircross',
    'C6 2.7 HDi','C6 3.0',
    'Berlingo 1.2','Berlingo 1.6 BlueHDi',
    'DS3 1.2','DS3 1.6 THP','DS4 1.6','DS5 2.0',
    'C-Elysée','ë-C4','ë-Berlingo',
  ],
  'Cupra': ['Born','Formentor 1.5 TSI','Formentor 2.0 TSI','Formentor VZ','Leon 2.0 TSI','Leon VZ','Ateca','Terramar'],
  'Dacia': ['Sandero 0.9 TCe','Sandero 1.0 SCe','Sandero Stepway','Logan 0.9','Logan 1.2','Logan MCV','Duster 1.0 TCe','Duster 1.3 TCe','Duster 1.5 dCi','Spring','Jogger','Bigster'],
  'Dodge': ['Challenger 3.6','Challenger 5.7 HEMI','Charger 3.6','Charger 5.7 HEMI','Durango','Ram 1500','Viper'],
  'DS Automobiles': ['DS3 Crossback','DS4 1.5 BlueHDi','DS4 1.6 THP','DS7 Crossback','DS9'],
  'Ferrari': ['458 Italia','488 GTB','488 Pista','F8 Tributo','F8 Spider','812 Superfast','812 GTS','Roma','Portofino','SF90 Stradale','296 GTB','Purosangue'],
  'Fiat': [
    '500 0.9 TwinAir','500 1.0 Hybrid','500 1.2','500 1.4','500e',
    '500X 1.0','500X 1.3','500X 1.4','500X 1.6 MultiJet',
    '500L 1.3 MultiJet','500L 1.4',
    'Punto 1.2','Punto 1.4','Punto 1.3 MultiJet',
    'Tipo 1.0','Tipo 1.4','Tipo 1.6 MultiJet',
    'Bravo 1.4','Bravo 1.6',
    'Panda 1.0 Hybrid','Panda 1.2','Panda 4x4',
    'Stilo','Qubo','Doblo 1.4','Doblo 1.6 MultiJet',
  ],
  'Ford': [
    'Fiesta 1.0 EcoBoost','Fiesta 1.1','Fiesta 1.5 TDCi','Fiesta ST 1.5',
    'Focus 1.0 EcoBoost','Focus 1.5 EcoBoost','Focus 1.6 TDCi','Focus 2.0 TDCi','Focus ST','Focus Active',
    'Mondeo 1.5 EcoBoost','Mondeo 2.0 EcoBoost','Mondeo 2.0 TDCi','Mondeo Vignale','Mondeo Hybrid',
    'Mustang 2.3 EcoBoost','Mustang 5.0 V8','Mustang Mach-E',
    'Puma 1.0 EcoBoost','Puma 1.5 EcoBoost','Puma ST',
    'Kuga 1.5 EcoBoost','Kuga 2.5 PHEV','Kuga 2.0 EcoBlue',
    'EcoSport 1.0','EcoSport 1.5 TDCi',
    'Explorer 3.0 EcoBoost',
    'Galaxy 2.0 EcoBlue',
    'S-Max 2.0 EcoBlue','S-Max 2.5 PHEV',
    'C-Max 1.5 EcoBoost','C-Max 2.0 TDCi',
    'Bronco 2.3','Bronco 2.7',
    'F-150 3.5 EcoBoost','F-150 5.0 V8',
  ],
  'Genesis': ['G70 2.0T','G70 2.2d','G80 2.5T','G80 3.5T','G90 3.3T','G90 5.0','GV70 2.5T','GV70 3.5T','GV80 2.5T','GV80 3.5T'],
  'Honda': [
    'Jazz 1.2','Jazz 1.3','Jazz 1.5 i-VTEC','Jazz e:HEV',
    'Civic 1.0 VTEC','Civic 1.5 VTEC','Civic 1.6 i-DTEC','Civic 2.0 i-MMD','Civic Type R',
    'Accord 2.0 i-VTEC','Accord 2.4 i-VTEC','Accord 2.0 i-MMD',
    'CR-V 1.5 VTEC','CR-V 2.0 i-MMD','CR-V 1.6 i-DTEC',
    'HR-V 1.5 i-VTEC','HR-V 1.8 i-VTEC','HR-V e:HEV',
    'Pilot 3.5 V6','Gold Wing 1800',
    'e:Ny1',
  ],
  'Hyundai': [
    'i10 1.0','i10 1.2',
    'i20 1.0 T-GDi','i20 1.2','i20 1.4 CRDi','i20 N',
    'i30 1.0 T-GDi','i30 1.4 T-GDi','i30 1.6 CRDi','i30 N','i30 Fastback',
    'i40 1.6 GDi','i40 1.7 CRDi',
    'Kona 1.0 T-GDi','Kona 1.6 CRDi','Kona Electric','Kona N',
    'Tucson 1.6 T-GDi','Tucson 2.0 CRDi','Tucson PHEV','Tucson HEV',
    'Santa Fe 2.2 CRDi','Santa Fe 2.5 T-GDi','Santa Fe PHEV',
    'Ioniq 1.6 GDi HEV','Ioniq Electric',
    'Ioniq 5 Standard Range','Ioniq 5 Long Range','Ioniq 5 N',
    'Ioniq 6 Standard Range','Ioniq 6 Long Range',
    'Ioniq 9',
    'Nexo Fuel Cell',
    'Veloster 1.6 T','i20 Coupé',
  ],
  'Jaguar': ['XE 2.0 D','XE 2.0 P','XE 3.0 V6','XF 2.0 D','XF 3.0 D','XF 5.0 V8','F-Pace 2.0 D','F-Pace 3.0 D','E-Pace 2.0 D','I-Pace','F-Type 2.0','F-Type 3.0 V6','F-Type 5.0 V8','XJ 3.0 D','XJ 5.0 V8'],
  'Jeep': ['Renegade 1.0','Renegade 1.3','Renegade 1.6 MultiJet','Compass 1.3','Compass 2.0 MultiJet','Cherokee 2.2','Grand Cherokee 3.0 V6','Grand Cherokee 6.4 SRT','Wrangler 2.0','Wrangler 3.6 V6'],
  'Kia': [
    'Picanto 1.0','Picanto 1.2',
    'Rio 1.0 T-GDi','Rio 1.25','Rio 1.4 CRDi',
    "Ceed 1.0 T-GDi","Ceed 1.4 T-GDi","Ceed 1.6 CRDi","ProCeed GT",
    'Xceed 1.0 T-GDi','Xceed 1.5 T-GDi','Xceed 1.6 CRDi',
    'Sportage 1.6 T-GDi','Sportage 2.0 CRDi','Sportage HEV','Sportage PHEV',
    'Sorento 2.2 CRDi','Sorento 1.6 T-GDi HEV','Sorento PHEV',
    'Stinger 2.0 T','Stinger 3.3 T',
    'EV6 Standard Range','EV6 Long Range','EV6 GT',
    'EV9 Long Range',
    'Niro HEV','Niro PHEV','Niro EV',
    'Soul 1.6 CRDi','Soul EV',
  ],
  'Lamborghini': ['Gallardo','Huracán EVO','Huracán STO','Urus 4.0 V8','Revuelto','Aventador LP700','Aventador SVJ'],
  'Lancia': ['Ypsilon 1.0','Ypsilon 1.2','Delta 1.4','Delta 1.6','Stratos'],
  'Land Rover': [
    'Defender 90 2.0 D','Defender 90 3.0 D','Defender 90 5.0 V8',
    'Defender 110 2.0 D','Defender 110 3.0 D','Defender 110 5.0 V8',
    'Discovery 3.0 D','Discovery 5.0 V8','Discovery Sport 2.0 D','Discovery Sport 2.0 Si4',
    'Freelander 2.2 TD4','Freelander 2.0 Si4',
    'Range Rover 3.0 D','Range Rover 4.4 D','Range Rover 5.0 V8','Range Rover P400e',
    'Range Rover Sport 3.0 D','Range Rover Sport 5.0 V8','Range Rover Sport PHEV',
    'Range Rover Evoque 2.0 D','Range Rover Evoque 2.0 P',
    'Range Rover Velar 2.0 D','Range Rover Velar 3.0 D',
  ],
  'Lexus': ['CT 200h','UX 200','UX 250h','NX 200t','NX 300h','NX 450h+','RX 300','RX 350','RX 450h','RX 500h','LX 500d','LX 600','IS 200','IS 250','IS 300h','IS 350','ES 300h','LS 500h','GS 300','GS 450h'],
  'Maserati': ['Ghibli 2.0 V6','Ghibli 3.0 V6','Ghibli Hybrid','Quattroporte 3.0 V6','Quattroporte 3.8 V8','Levante 3.0 V6','Levante Hybrid','GranTurismo 4.2','GranTurismo 4.7','Grecale 2.0','Grecale Folgore'],
  'Mazda': [
    'Mazda2 1.5 SKYACTIV-G','Mazda2 1.5 SKYACTIV-D',
    'Mazda3 2.0 SKYACTIV-G','Mazda3 2.0 SKYACTIV-X','Mazda3 1.8 SKYACTIV-D',
    'Mazda6 2.0 SKYACTIV-G','Mazda6 2.2 SKYACTIV-D',
    'CX-3 2.0 SKYACTIV-G','CX-3 1.5 SKYACTIV-D',
    'CX-30 2.0 SKYACTIV-G','CX-30 2.0 SKYACTIV-X','CX-30 1.8 SKYACTIV-D',
    'CX-5 2.0 SKYACTIV-G','CX-5 2.5 SKYACTIV-G','CX-5 2.2 SKYACTIV-D',
    'CX-60 2.5 PHEV','CX-60 3.3 SKYACTIV-D',
    'MX-5 1.5 SKYACTIV-G','MX-5 2.0 SKYACTIV-G',
    'MX-30 EV',
  ],
  'McLaren': ['540C','570S','600LT','620R','720S','750S','Artura','GT','Senna','765LT'],
  'Mercedes-Benz': [
    // A-Class
    'A 160','A 170','A 180','A 180 d','A 200','A 200 d','A 220','A 220 d','A 250','A 250 e','A 35 AMG','A 45 AMG',
    // B-Class
    'B 160','B 180','B 180 d','B 200','B 200 d','B 220','B 220 d','B 250 e',
    // C-Class
    'C 160','C 180','C 200','C 200 d','C 220 d','C 250','C 300','C 300 d','C 300 de','C 350 e','C 400','C 43 AMG','C 63 AMG','C 63 AMG S',
    'C 200 T','C 220d T','C 300 T','C 63 AMG T',
    // E-Class
    'E 180','E 200','E 200 d','E 220 d','E 250','E 300','E 300 d','E 300 de','E 350','E 350 d','E 400','E 400 d','E 43 AMG','E 53 AMG','E 63 AMG','E 63 AMG S',
    'E 200 T','E 220d T','E 300 T',
    // S-Class
    'S 300','S 350 d','S 400','S 400 d','S 450','S 500','S 500 e','S 560','S 580','S 600','S 63 AMG','S 65 AMG',
    // CLA
    'CLA 180','CLA 200','CLA 200 d','CLA 220','CLA 220 d','CLA 250','CLA 250 e','CLA 35 AMG','CLA 45 AMG',
    // CLS
    'CLS 220 d','CLS 300 d','CLS 350','CLS 400 d','CLS 450','CLS 53 AMG','CLS 63 AMG',
    // GLA
    'GLA 180','GLA 200','GLA 200 d','GLA 220 d','GLA 250','GLA 250 e','GLA 35 AMG','GLA 45 AMG',
    // GLB
    'GLB 180','GLB 200','GLB 200 d','GLB 220 d','GLB 250','GLB 250 e','GLB 35 AMG',
    // GLC
    'GLC 200','GLC 200 d','GLC 220 d','GLC 300','GLC 300 d','GLC 300 de','GLC 350 e','GLC 400 d','GLC 43 AMG','GLC 63 AMG',
    'GLC 200 Coupé','GLC 300 Coupé','GLC 63 AMG Coupé',
    // GLE
    'GLE 300 d','GLE 350','GLE 350 d','GLE 400 d','GLE 450','GLE 580','GLE 53 AMG','GLE 63 AMG',
    'GLE 350 d Coupé','GLE 400 d Coupé','GLE 53 AMG Coupé',
    // GLS
    'GLS 350 d','GLS 400 d','GLS 450','GLS 580','GLS 600 Maybach','AMG GLS 63',
    // G-Class
    'G 350 d','G 400 d','G 500','G 63 AMG',
    // EQ
    'EQA 250','EQA 350 4MATIC','EQB 250','EQB 350 4MATIC',
    'EQC 400 4MATIC',
    'EQE 300','EQE 350','EQE 350+','EQE 500','EQE 43 AMG','EQE 53 AMG',
    'EQS 450+','EQS 580 4MATIC','EQS 53 AMG',
    // AMG GT
    'AMG GT 43','AMG GT 53','AMG GT 63','AMG GT 63 S','AMG GT R','AMG GT Black Series',
    // SL
    'SL 43','SL 55 AMG','SL 63 AMG',
    // SLK / SLC
    'SLC 180','SLC 200','SLK 200','SLK 250','SLK 350',
    // Vito (passenger)
    'V 220 d','V 250 d','V 300 d',
  ],
  'MINI': [
    'One 1.2','One D 1.5','Cooper 1.5','Cooper S 2.0','Cooper D 1.5','Cooper SD 2.0',
    'John Cooper Works 2.0',
    'Clubman Cooper 1.5','Clubman Cooper S 2.0','Clubman Cooper D 1.5','Clubman Cooper SD 2.0','Clubman JCW 2.0',
    'Countryman Cooper 1.5','Countryman Cooper S 2.0','Countryman Cooper D 1.5','Countryman Cooper SD 2.0','Countryman PHEV','Countryman JCW',
    'Cabrio Cooper 1.5','Cabrio Cooper S 2.0','Cabrio JCW',
    'Paceman Cooper','Paceman Cooper S','Paceman Cooper D',
    'Coupe Cooper S','Coupe JCW',
    'Roadster Cooper S','Roadster JCW',
    'Aceman','Electric SE',
  ],
  'Mitsubishi': ['Colt 1.0','Colt 1.3','ASX 1.0','ASX 1.6','Eclipse Cross 1.5','Eclipse Cross PHEV','Outlander 2.0','Outlander 2.4 PHEV','Outlander 3.0 V6','L200 2.4 DiD','Pajero 3.2 DiD','Galant'],
  'Nissan': [
    'Micra 0.9 DIG-T','Micra 1.0 IG-T','Micra 1.5 dCi',
    'Juke 1.0 DIG-T','Juke 1.6','Juke Hybrid',
    'Qashqai 1.3 DIG-T','Qashqai 1.5 e-Power','Qashqai 1.6 dCi','Qashqai 2.0',
    'X-Trail 1.3 DIG-T','X-Trail 1.5 e-Power','X-Trail 2.0 dCi','X-Trail e-4ORCE',
    'Ariya 63kWh','Ariya 87kWh',
    'Leaf 40 kWh','Leaf 62 kWh',
    '370Z 3.7 V6','GT-R 3.8 V6',
    'Navara 2.3 dCi','Navara 2.5 dCi',
    'Murano 3.5 V6','Pulsar 1.2',
  ],
  'Opel/Vauxhall': [
    'Agila 1.0','Agila 1.2',
    'Astra 1.0 Turbo','Astra 1.2 Turbo','Astra 1.4 Turbo','Astra 1.6 CDTi','Astra 2.0 CDTi','Astra GSi','Astra OPC',
    'Cascada 1.4 Turbo','Cascada 1.6 CDTi',
    'Corsa 1.0 Turbo','Corsa 1.2 Turbo','Corsa 1.4','Corsa 1.5 CDTi','Corsa Electric','Corsa OPC',
    'Crossland 1.2 Turbo','Crossland 1.5 CDTi',
    'Frontera 1.2 Turbo','Frontera Electric',
    'Grandland 1.2 Turbo','Grandland 1.5 CDTi','Grandland PHEV',
    'Insignia 1.5 Turbo','Insignia 2.0 Turbo','Insignia 2.0 CDTi','Insignia Grand Sport','Insignia Sports Tourer',
    'Meriva 1.4 Turbo','Meriva 1.6 CDTi',
    'Mokka 1.2 Turbo','Mokka 1.6 CDTi','Mokka-e',
    'Vectra 1.6','Vectra 1.8','Vectra 2.0 CDTi','Omega',
    'Zafira 1.4 Turbo','Zafira 1.6 CDTi','Zafira Life',
  ],
  'Peugeot': [
    '108 1.0','108 1.2',
    '208 1.0 PureTech','208 1.2 PureTech','208 1.5 BlueHDi','208 e-208',
    '308 1.2 PureTech','308 1.5 BlueHDi','308 1.6 THP','308 GTi',
    '2008 1.2 PureTech','2008 1.5 BlueHDi','2008 e-2008',
    '3008 1.2 PureTech','3008 1.5 BlueHDi','3008 HYBRID4','3008 HYbrid',
    '408 1.2 PureTech','408 1.6 PHEV',
    '5008 1.2 PureTech','5008 1.5 BlueHDi','5008 HYbrid',
    '508 1.5 BlueHDi','508 2.0 BlueHDi','508 HYbrid','508 PSE',
    'Rifter 1.2 PureTech','Rifter 1.5 BlueHDi',
    'Partner 1.2','Partner 1.6 BlueHDi',
    '107 1.0','106 1.1','306 1.6','307 1.6','406 2.0',
  ],
  'Polestar': ['Polestar 1','Polestar 2 Long Range Single','Polestar 2 Long Range Dual','Polestar 3 Long Range Single','Polestar 3 Long Range Dual','Polestar 4'],
  'Porsche': [
    '911 Carrera','911 Carrera S','911 Carrera 4S','911 Targa 4','911 Targa 4S','911 Turbo','911 Turbo S','911 GT3','911 GT3 RS','911 GT2 RS',
    '718 Boxster','718 Boxster S','718 Boxster GTS','718 Spyder',
    '718 Cayman','718 Cayman S','718 Cayman GTS','718 Cayman GT4',
    'Taycan 4S','Taycan Turbo','Taycan Turbo S','Taycan GTS','Taycan Sport Turismo',
    'Panamera 4','Panamera 4S','Panamera Turbo','Panamera GTS','Panamera 4 E-Hybrid',
    'Cayenne 3.0 V6','Cayenne S 2.9 V6','Cayenne GTS 4.0 V8','Cayenne Turbo 4.0 V8','Cayenne E-Hybrid','Cayenne Coupé',
    'Macan 2.0','Macan S 3.0','Macan GTS','Macan Turbo','Macan Electric',
  ],
  'Renault': [
    'Twingo 1.0 SCe','Twingo 1.0 TCe',
    'Clio 1.0 SCe','Clio 1.0 TCe','Clio 1.5 dCi','Clio E-TECH','Clio RS',
    'Megane 1.2 TCe','Megane 1.3 TCe','Megane 1.5 dCi','Megane E-TECH','Megane RS',
    'Megane E-Tech Electric',
    'Laguna 1.5 dCi','Laguna 2.0 dCi',
    'Talisman 1.6 dCi','Talisman 2.0 dCi',
    'Scenic 1.2 TCe','Scenic 1.5 dCi','Scenic E-Tech',
    'Captur 1.0 TCe','Captur 1.3 TCe','Captur 1.5 dCi','Captur E-TECH',
    'Kadjar 1.2 TCe','Kadjar 1.3 TCe','Kadjar 1.5 dCi',
    'Koleos 1.3 TCe','Koleos 2.0 dCi',
    'Arkana 1.3 TCe','Arkana E-TECH',
    'Austral 1.2 TCe','Austral E-TECH',
    'Espace 1.2 TCe','Espace E-TECH',
    'Zoe 41 kWh','Zoe 52 kWh','Twingo Electric',
  ],
  'Rolls-Royce': ['Ghost 6.6 V12','Ghost Extended','Phantom 6.7 V12','Phantom Extended','Wraith 6.6 V12','Dawn 6.6 V12','Cullinan 6.7 V12','Spectre'],
  'SEAT': [
    'Ibiza 1.0 TSI','Ibiza 1.0 MPI','Ibiza 1.6 TDI','Ibiza FR 1.0','Ibiza Cupra',
    'Leon 1.0 TSI','Leon 1.5 TSI','Leon 1.6 TDI','Leon 2.0 TDI','Leon FR 2.0','Leon Cupra',
    'Ateca 1.0 TSI','Ateca 1.5 TSI','Ateca 2.0 TDI','Ateca FR',
    'Arona 1.0 TSI','Arona 1.6 TDI','Arona FR',
    'Tarraco 1.5 TSI','Tarraco 2.0 TDI','Tarraco FR',
    'Toledo','Alhambra 1.4 TSI','Alhambra 2.0 TDI',
    'Mii 1.0',
  ],
  'Skoda': [
    'Fabia 1.0 MPI','Fabia 1.0 TSI','Fabia 1.2 TSI','Fabia 1.4 TDI',
    'Octavia 1.0 TSI','Octavia 1.4 TSI','Octavia 1.5 TSI','Octavia 1.6 TDI','Octavia 2.0 TDI','Octavia RS 2.0','Octavia Scout',
    'Superb 1.5 TSI','Superb 1.8 TSI','Superb 2.0 TDI','Superb iV',
    'Karoq 1.0 TSI','Karoq 1.5 TSI','Karoq 2.0 TDI',
    'Kodiaq 1.5 TSI','Kodiaq 2.0 TSI','Kodiaq 2.0 TDI','Kodiaq RS',
    'Scala 1.0 TSI','Scala 1.5 TSI',
    'Kamiq 1.0 TSI','Kamiq 1.5 TSI',
    'Enyaq 60','Enyaq 80','Enyaq 80x','Enyaq Coupé RS',
    'Citigo 1.0',
    'Rapid 1.2 TSI','Rapid 1.4 TDI',
  ],
  'Smart': ['Fortwo 1.0','Fortwo Electric','Forfour 1.0','Forfour Electric','#1 Pro','#1 Premium','#3 Brabus'],
  'Subaru': [
    'Impreza 1.6','Impreza 2.0 AWD','Impreza WRX STI',
    'Legacy 2.0','Legacy 2.5',
    'Outback 2.5','Outback 3.6 R',
    'Forester 2.0','Forester 2.0 XT','Forester e-Boxer',
    'XV 2.0i','XV e-Boxer',
    'BRZ 2.4',
    'Levorg 2.0 STI',
  ],
  'Suzuki': [
    'Swift 1.0 Boosterjet','Swift 1.2 Dualjet','Swift Sport 1.4',
    'Vitara 1.0 Boosterjet','Vitara 1.4 Boosterjet','Vitara 1.6 DDiS',
    'SX4 S-Cross 1.0','SX4 S-Cross 1.4','SX4 S-Cross 1.6 DDiS',
    'Ignis 1.2 Dualjet',
    'Jimny 1.5','Jimny 1.3',
    'Baleno 1.2','Baleno 1.0',
    'Swace 1.8 Hybrid',
  ],
  'Tesla': [
    'Model S Standard Range','Model S Long Range','Model S Plaid',
    'Model 3 Standard Range Plus','Model 3 Long Range','Model 3 Performance',
    'Model X Long Range','Model X Plaid',
    'Model Y Standard Range','Model Y Long Range','Model Y Performance',
    'Cybertruck AWD','Cybertruck Cyberbeast',
    'Roadster',
  ],
  'Toyota': [
    'Yaris 1.0','Yaris 1.5 Hybrid','Yaris GR',
    'Yaris Cross 1.5 Hybrid',
    'Corolla 1.2 T','Corolla 1.8 Hybrid','Corolla 2.0 Hybrid','Corolla GR Sport',
    'Corolla Touring Sports 1.8 Hybrid','Corolla Touring Sports 2.0 Hybrid',
    'Camry 2.5 Hybrid',
    'Avensis 1.6 D-4D','Avensis 2.0 D-4D',
    'RAV4 2.0','RAV4 2.5 Hybrid','RAV4 2.5 PHEV','RAV4 Adventure',
    'C-HR 1.2 Turbo','C-HR 1.8 Hybrid','C-HR 2.0 Hybrid',
    'Land Cruiser 2.8 D-4D','Land Cruiser 3.0 D-4D','Land Cruiser 4.5 V8',
    'Hilux 2.4 D-4D','Hilux 2.8 D-4D',
    'GR Supra 2.0','GR Supra 3.0',
    'GR86 2.4',
    'Aygo 1.0','Aygo X 1.0',
    'Prius 1.8 Hybrid','Prius 2.0 PHEV',
    'bZ4X 71.4 kWh',
    'Proace City 1.2','Proace City Verso',
  ],
  'Volkswagen': [
    'Up! 1.0','e-Up!',
    'Polo 1.0 MPI','Polo 1.0 TSI','Polo 1.6 TDI','Polo GTI 2.0',
    'Golf 1.0 TSI','Golf 1.5 TSI','Golf 1.5 eTSI','Golf 2.0 TDI','Golf GTI 2.0','Golf GTD 2.0','Golf GTE 1.4','Golf R 2.0','Golf Alltrack',
    'Passat 1.5 TSI','Passat 2.0 TDI','Passat GTE 1.4','Passat Alltrack 2.0',
    'Arteon 1.5 TSI','Arteon 2.0 TDI','Arteon 2.0 TSI','Arteon eHybrid','Arteon R',
    'Tiguan 1.5 TSI','Tiguan 2.0 TDI','Tiguan 2.0 TSI','Tiguan eHybrid','Tiguan R',
    'Tiguan Allspace 1.5 TSI','Tiguan Allspace 2.0 TDI',
    'T-Roc 1.0 TSI','T-Roc 1.5 TSI','T-Roc 2.0 TDI','T-Roc R',
    'T-Cross 1.0 TSI','T-Cross 1.6 TDI',
    'Touareg 3.0 TDI','Touareg 3.0 V6 eHybrid','Touareg 4.0 V8 TDI',
    'Touran 1.5 TSI','Touran 2.0 TDI',
    'Sharan 1.4 TSI','Sharan 2.0 TDI',
    'CC 1.8 TSI','CC 2.0 TDI',
    'Phaeton 3.0 TDI','Phaeton 6.0 W12',
    'ID.3 Pure','ID.3 Pro','ID.3 Pro S','ID.3 GTX',
    'ID.4 Pure','ID.4 Pro','ID.4 GTX','ID.4 Pro Performance',
    'ID.5 Pro','ID.5 GTX',
    'ID.7 Pro','ID.7 GTX',
  ],
  'Volvo': [
    'V40 1.5 T2','V40 2.0 T3','V40 2.0 T4','V40 2.0 D2','V40 2.0 D3','V40 2.0 D4',
    'V60 2.0 B3','V60 2.0 B4','V60 2.0 D3','V60 2.0 D4','V60 T6 AWD','V60 T8 PHEV','V60 Cross Country',
    'V90 2.0 B4','V90 2.0 B5','V90 2.0 D4','V90 2.0 D5','V90 T6','V90 T8 PHEV','V90 Cross Country',
    'S40 1.6','S40 2.0 D',
    'S60 2.0 B3','S60 2.0 B4','S60 T6 AWD','S60 T8 PHEV',
    'S90 2.0 B5','S90 T6','S90 T8 PHEV',
    'XC40 B3','XC40 B4','XC40 D3','XC40 D4','XC40 T5 AWD','XC40 Recharge',
    'XC60 B4','XC60 B5','XC60 D4','XC60 D5','XC60 T6 AWD','XC60 T8 PHEV',
    'XC90 B5','XC90 D5','XC90 T6 AWD','XC90 T8 PHEV',
    'C40 Recharge','EX30','EX90',
  ],
}

// ── TRUCKS ────────────────────────────────────────────────────
export const TRUCK_MAKES: Record<string, string[]> = {
  'DAF': [
    'LF 180','LF 210','LF 250','LF 280',
    'CF 280','CF 330','CF 370','CF 400','CF 450',
    'XF 480','XF 530','XF 560',
    'XG 480','XG 530','XG 560',
    'XG+ 480','XG+ 530',
  ],
  'Iveco': [
    'Daily 35S14','Daily 35S16','Daily 35S18','Daily 50C15','Daily 50C18','Daily 70C18',
    'Eurocargo 75E16','Eurocargo 120E22','Eurocargo 140E25',
    'S-Way 340','S-Way 400','S-Way 440','S-Way 480','S-Way 510','S-Way 570',
    'X-Way 340','X-Way 400','X-Way 490','T-Way 380','T-Way 480',
    'Stralis 360','Stralis 400','Stralis 440',
  ],
  'MAN': [
    'TGE 3.180','TGE 5.180',
    'TGL 8.180','TGL 10.220','TGL 12.250',
    'TGM 15.250','TGM 18.250','TGM 18.290','TGM 26.340',
    'TGS 18.360','TGS 18.400','TGS 26.400','TGS 26.460','TGS 33.400','TGS 41.400',
    'TGX 18.400','TGX 18.440','TGX 18.480','TGX 18.510','TGX 18.560','TGX 18.620','TGX 26.540','TGX 33.540',
    'TGX D38 18.640',
  ],
  'Mercedes-Benz': [
    'Actros 1824','Actros 1833','Actros 1840','Actros 1845','Actros 1848','Actros 1851','Actros 1853','Actros 1857',
    'Actros 1824 L','Actros 1845 L','Actros 2040','Actros 2545','Actros 2548','Actros 2651','Actros 2653',
    'Arocs 1832','Arocs 1836','Arocs 1840','Arocs 2036','Arocs 2040','Arocs 2540','Arocs 3240','Arocs 3340','Arocs 4140','Arocs 4145',
    'Atego 816','Atego 818','Atego 1218','Atego 1224','Atego 1524','Atego 1624','Atego 1824',
    'Axor 1829','Axor 1833','Axor 1840','Axor 2533','Axor 2540',
    'Antos 1824','Antos 1833','Antos 1840','Antos 2040','Antos 2543','Antos 2548',
    'Econic 1824','Econic 2630',
    'Zetros 1833','Zetros 2733',
  ],
  'Renault Trucks': [
    'D 210','D 250','D 280','D Wide 210','D Wide 250',
    'T 380','T 400','T 440','T 460','T 480','T 520','T 560',
    'C 380','C 430','C 460','C 520',
    'K 380','K 430','K 460','K 520',
    'Master 2.3 dCi 135','Master 2.3 dCi 150',
  ],
  'Scania': [
    'P 230','P 280','P 320','P 370','P 410','P 450',
    'G 280','G 320','G 370','G 410','G 450','G 500',
    'R 370','R 410','R 450','R 500','R 560','R 580','R 650',
    'S 410','S 450','S 500','S 560','S 580','S 650','S 730',
    'F 280','F 370',
    'L 280','L 320',
    'XT R 450','XT R 500','XT S 580',
  ],
  'Volvo Trucks': [
    'FL 210','FL 250','FL 280',
    'FE 250','FE 280','FE 320','FE 350',
    'FM 330','FM 370','FM 410','FM 450','FM 500',
    'FMX 330','FMX 370','FMX 410','FMX 460','FMX 500','FMX 540',
    'FH 420','FH 460','FH 500','FH 540','FH 570','FH 600',
    'FH 500 Aero','FH 540 Aero',
    'VHD 300','VHD 400',
  ],
  'Ford Trucks': ['F-MAX 500','F-MAX 500 E6','Cargo 1838','Cargo 2040','Cargo 2533','Cargo 2836','Cargo 3236','Cargo 4142'],
  'Isuzu': [
    'N-Series NLR 45','N-Series NMR 85','N-Series NPR 75','N-Series NPR 85',
    'F-Series FVR 34','F-Series FVZ 34',
    'D-Max 1.9','D-Max 3.0',
  ],
  'Hino': ['300 Series 614','300 Series 716','500 Series 1018','500 Series 1220','700 Series 2841'],
  'Mitsubishi Fuso': ['Canter 3C15','Canter 6C15','Canter 7C15','Fighter FM','Super Great FP','Super Great FS'],
}

// ── VANS ──────────────────────────────────────────────────────
export const VAN_MAKES: Record<string, string[]> = {
  'Citroën': ['Berlingo 1.2 PureTech 110','Berlingo 1.5 BlueHDi 100','Berlingo 1.5 BlueHDi 130','Jumpy 1.5 BlueHDi 100','Jumpy 1.5 BlueHDi 120','Jumpy 2.0 BlueHDi 145','Jumper 2.0 BlueHDi 110','Jumper 2.2 BlueHDi 140','Dispatch 1.5 BlueHDi','Relay 2.0 BlueHDi'],
  'Fiat': ['Doblo 1.4','Doblo 1.6 MultiJet 105','Doblo 1.6 MultiJet 120','Scudo 1.5 BlueHDi','Scudo 2.0 BlueHDi','Ducato 2.3 MultiJet 120','Ducato 2.3 MultiJet 150','Ducato 2.3 MultiJet 180','Talento 1.6 MultiJet'],
  'Ford': ['Transit Connect 1.0 EcoBoost 100','Transit Connect 1.5 EcoBlue 100','Transit Custom 2.0 EcoBlue 105','Transit Custom 2.0 EcoBlue 130','Transit Custom 2.0 EcoBlue 170','Transit 2.0 EcoBlue 105','Transit 2.0 EcoBlue 130','Transit 2.0 EcoBlue 170','Transit Courier 1.5 EcoBlue 100','Tourneo Custom'],
  'Iveco': ['Daily 35S14 Hi-Matic','Daily 35S16','Daily 35S18 Hi-Matic','Daily 50C18'],
  'Mercedes-Benz': ['Citan 108 CDI','Citan 110 CDI','Citan 112','Vito 116 CDI','Vito 119 CDI','Vito 119 BlueTEC','Viano 2.0 CDI','Viano 3.0 CDI','Sprinter 311 CDI','Sprinter 314 CDI','Sprinter 316 CDI','Sprinter 319 CDI','Sprinter 319 BlueTEC','V 220 d','V 250 d','V 300 d'],
  'Nissan': ['NV200 1.5 dCi 90','NV200 1.5 dCi 110','NV250 1.5 dCi 120','NV300 1.6 dCi 95','NV300 1.6 dCi 125','NV400 2.3 dCi 125','NV400 2.3 dCi 145','Primastar 2.0 dCi','Interstar 2.3 dCi'],
  'Opel/Vauxhall': ['Combo 1.2 Turbo 110','Combo 1.5 CDTI 100','Combo 1.5 CDTI 130','Vivaro 1.5 CDTI 100','Vivaro 2.0 CDTI 120','Vivaro 2.0 CDTI 145','Movano 2.3 CDTI 110','Movano 2.3 CDTI 135','Movano 2.3 CDTI 145'],
  'Peugeot': ['Partner 1.2 PureTech 110','Partner 1.5 BlueHDi 100','Expert 1.5 BlueHDi 100','Expert 1.5 BlueHDi 120','Expert 2.0 BlueHDi 145','Boxer 2.2 BlueHDi 120','Boxer 2.2 BlueHDi 140','Boxer 2.2 BlueHDi 165','Traveller 2.0 BlueHDi'],
  'Renault': ['Kangoo 1.3 TCe 100','Kangoo 1.5 dCi 75','Kangoo 1.5 dCi 115','Kangoo E-Tech Electric','Trafic 1.4 TCe 150','Trafic 2.0 dCi 120','Trafic 2.0 dCi 145','Master 2.3 dCi 135','Master 2.3 dCi 150','Master 2.3 dCi 180','Master E-Tech Electric','Express 1.5 dCi 75'],
  'Toyota': ['Proace 1.5 D-4D 100','Proace 2.0 D-4D 120','Proace 2.0 D-4D 150','Proace City 1.2 PureTech','Proace City 1.5 D-4D','HiAce 2.8 D-4D'],
  'Volkswagen': ['Caddy 1.0 TSI 90','Caddy 1.5 TSI 114','Caddy 2.0 TDI 75','Caddy 2.0 TDI 102','Caddy 2.0 TDI 122','Caddy 2.0 TDI 145','Transporter T6.1 2.0 TDI 90','Transporter T6.1 2.0 TDI 110','Transporter T6.1 2.0 TDI 150','Transporter T6.1 2.0 TDI 198','Caravelle 2.0 TDI 110','Multivan 2.0 TDI 150','Multivan eHybrid','Crafter 2.0 TDI 102','Crafter 2.0 TDI 140','Crafter 2.0 TDI 163','Amarok 3.0 TDI 163','Amarok 3.0 TDI 204'],
}

// ── BUSES ─────────────────────────────────────────────────────
export const BUS_MAKES: Record<string, string[]> = {
  'Mercedes-Benz': ['Citaro C2 G','Citaro C2','Intouro M','Tourismo RHD','Tourismo RH','Travego M','Travego RHD','O 303','O 350','O 403','O 405','O 407'],
  'MAN': ["Lion's City A23 G","Lion's City A21","Lion's City A78","Lion's Coach RH","Lion's Coach L","Lion's Regio ÜL","Lion's Intercity ÜL"],
  'Neoplan': ['Cityliner P16','Cityliner L','Starliner L','Starliner SHD','Skyliner C','Tourliner P21','Tourliner SHD','Centroliner Evolution'],
  'Setra': ['S 415 GT-HD','S 416 GT-HD','S 417 HDH','S 431 DT','S 515 HD','S 516 HDH','S 517 HDH','S 521 HD','S 528 DT','ComfortClass 500','MultiClass 400'],
  'Scania': ['Citywide LF','Citywide LE','Interlink HD','Interlink MD','Touring HD','Touring HD EX'],
  'Volvo': ['7900 A','7900 Electric Hybrid','8900','9700 DD','9900','B8R 6x2','B11R 6x2'],
  'Irizar': ['i6 HD','i6 S HD','i8 HD','i4 HD','ie tram','Scania Irizar i6'],
  'Temsa': ['Avenue 12','Safari HD 13','Safari HD 15','Maraton'],
  'Van Hool': ['TX16 Astron','TX17 Altano','EX16','TDX27 Astromidi'],
  'Otokar': ['Navigo 200 U','Navigo 200 T','Vectio U','Vectio T','Territo U'],
}

// ── MOTORCYCLES ───────────────────────────────────────────────
export const MOTO_MAKES: Record<string, string[]> = {
  'BMW Motorrad': ['R 1250 GS','R 1250 GS Adventure','R 1250 RT','R 1250 R','R 1250 RS','S 1000 RR','S 1000 R','S 1000 XR','F 900 R','F 900 XR','F 850 GS','F 750 GS','G 310 R','G 310 GS','M 1000 RR','M 1000 R','C 400 X','C 400 GT','R nineT'],
  'Ducati': ['Panigale V4','Panigale V4 S','Panigale V4 R','Monster 937','Monster 1200','Multistrada V4','Multistrada V4 S','Multistrada 1260','Diavel V4','SuperSport 950','SuperSport 950 S','DesertX','DesertX Rally','Scrambler 800','Scrambler 1100','Hypermotard 950'],
  'Harley-Davidson': ['Sportster S 1250','Iron 883','Iron 1200','Forty-Eight','Road King','Road Glide','Street Glide','Fat Boy','Heritage Classic','Softail Standard','Pan America 1250','Nightster 975','LiveWire One'],
  'Honda': ['CBR 1000 RR Fireblade','CBR 1000 RR-R','CBR 650 R','CBR 500 R','CB 1000 R','CB 750 Hornet','CB 650 R','CB 500 F','CB 300 R','Africa Twin 1100','Africa Twin 1000','PCX 125','Forza 350','Forza 750','Gold Wing 1800','NC 750 S','NC 750 X','X-ADV 750','CMX 1100 Rebel'],
  'Kawasaki': ['Ninja ZX-10R','Ninja ZX-10RR','Ninja ZX-6R','Ninja 650','Ninja 400','Ninja 300','Z900','Z900RS','Z650','Z400','Z125','Versys 1000','Versys 650','Vulcan 900','W800','Vulcan S 650'],
  'KTM': ['1290 Super Duke R','1290 Super Adventure','890 Duke R','890 Adventure R','790 Duke','790 Adventure','390 Duke','390 Adventure','250 Duke','RC 390','450 EXC-F','300 EXC','125 Duke'],
  'Suzuki': ['GSX-R 1000','GSX-R 600','GSX-S 1000','GSX-S 750','V-Strom 1050','V-Strom 650','Burgman 650','Burgman 400','SV 650','SV 650 S','GSX 250 R'],
  'Triumph': ['Bonneville T120','Bonneville T100','Speed Triple 1200 RS','Tiger 900 GT','Tiger 900 Rally','Tiger 1200','Street Triple 765 RS','Rocket 3 R','Rocket 3 GT','Scrambler 1200 XE','Thruxton RS','Speed Twin 900','Tiger Sport 660'],
  'Yamaha': ['YZF-R1','YZF-R1M','YZF-R6','YZF-R7','MT-10','MT-09','MT-09 SP','MT-07','MT-07 A','Tracer 9 GT','Tracer 9','XMAX 300','XMAX 125','TMAX 560','Ténéré 700','Niken','XSR 900','XSR 700'],
  'Aprilia': ['RSV4','RSV4 Factory','Tuono V4','RS 660','Tuono 660','Tuareg 660','Shiver 900','Dorsoduro 900'],
  'Royal Enfield': ['Meteor 350','Classic 350','Himalayan 450','Hunter 350','Interceptor 650','Continental GT 650','Super Meteor 650'],
  'Vespa': ['GTS 300','GTS 300 Super','GTV 300','Sprint 150','Primavera 150','Primavera 125','Elettrica 45','Elettrica 70'],
  'Harley-Davidson ADV': ['Pan America 1250','Pan America 1250 Special'],
}

// ── CONSTRUCTION ──────────────────────────────────────────────
export const CONSTRUCTION_MAKES: Record<string, string[]> = {
  'Caterpillar (CAT)': ['320','320 GC','323','325','330','330 GC','336','336 GC','340','349','365','374','395','D5','D6 T','D6 XE','D7','D8 T','D9','D10 T','D11','836','950 GC','962','966','972','980','988','990','992','994','AP555','AP655','AP1000','CB10','CB13','CB14','CP54','RM400','PM310'],
  'Komatsu': ['PC88MR','PC130','PC138','PC160','PC200','PC210','PC240','PC290','PC360','PC450','PC490','PC650','PC800','D37','D39','D51','D61','D65','D85','D155','D375','D475','WA200','WA270','WA320','WA380','WA430','WA470','WA500','GD655','GD675'],
  'Liebherr': ['R 920','R 926','R 936','R 944','R 950','R 970','R 984','R 9100','R 9150','PR 716','PR 726','PR 736','PR 756','PR 776','LTM 1030-2.1','LTM 1055-3.2','LTM 1100-5.2','LTM 1200-9.1','LTM 1300-6.2','LB 16','LB 28','LHM 420','LHM 550','HS 835 HD','HS 855 HD'],
  'Volvo CE': ['EC140','EC160','EC200','EC220','EC235','EC250','EC300','EC380','EC480','EC750','ECR145','A25G','A30G','A35G','A40G','A45G','L60H','L70H','L90H','L110H','L120H','L150H','L180H','L220H','L260H','G930B','G940B','G960B','P7820','P8820'],
  'Hitachi': ['ZX135','ZX165','ZX225','ZX245','ZX290','ZX350','ZX470','ZX520','ZX670','ZX870','ZX1000','ZX1300','EX2600','EX5600','ZW220','ZW330'],
  'Doosan': ['DX85R','DX140','DX180','DX235','DX255','DX300','DX350','DX380','DX420','DX490','DX700','DA30','DA40'],
  'JCB': ['1CX','2CX','3CX','4CX','5CX','JS130','JS145','JS160','JS190','JS205','JS220','JS260','JS290','JS330','JS370','Fastrac 4220','Fastrac 8330','531-70','535-125','540-140','550-80','TLT35','Loadall 540'],
  'CASE': ['CX130D','CX145D','CX160D','CX210D','CX220D','CX250D','CX300D','CX370D','CX490D','580SN','590SN','695ST','580 Super N','770','821G','921G','1021G','1121G','2050M'],
  'New Holland': ['E115C','E135C','E145C','E215C','E235C','E245C','E265C','E305C','E385C','E485C','W70C','W80C','W110C','W130C','B115C','B95C'],
  'Manitou': ['MT625','MT635','MT732','MT745','MT1030','MT1135','MRT1742','MRT2150','MHT 10210','MHT 12220','MLT741','MLT845'],
  'Terex': ['TC125','TC175','TC225','TC260','TA25','TA30','AC100-4','AC200-1','Demag AC 250','Franna AT 20'],
  'Sandvik': ['QJ341','QJ241','QJ331','QH441','QH331','QE341','QE241','CH440','CS440','HP200','HP300','UH440i'],
  'Wirtgen': ['W 100 CF','W 150 CF','W 200 CF','W 250 CF','W 380 CF','WR 240','WR 250','SP 25i','SP 35i','SP 55 SBi'],
  'Bomag': ['BW 154 AP-4','BW 174 AP-4','BW 177 BVC','BW 213 DH-4','BW 226 BVC','BPR 55/65 D','BPR 60/65 D','BF 300 P-2','BF 600 C-2','BC 472 RB-2'],
  'Ammann': ['ARX 90','ARX 110','ASC 100','ASC 110','AFW 600','AFW 700','AV 26-2','AV 70-2','AV 110-2','DTV 153'],
}

// ── Payloads ──────────────────────────────────────────────────
export const TRUCK_PAYLOADS: Record<string, Record<string, number>> = {
  'DAF': { 'LF 180': 5000, 'LF 210': 5500, 'LF 250': 6000, 'CF 280': 14000, 'CF 330': 16000, 'CF 370': 18000, 'CF 400': 20000, 'CF 450': 22000, 'XF 480': 24000, 'XF 530': 24000, 'XG 480': 24000, 'XG+ 530': 24000 },
  'MAN': { 'TGE 3.180': 2000, 'TGL 8.180': 5000, 'TGL 10.220': 6000, 'TGM 18.250': 10000, 'TGM 26.340': 14000, 'TGS 18.400': 18000, 'TGS 26.400': 20000, 'TGX 18.440': 24000, 'TGX 18.480': 24000, 'TGX 18.560': 24000 },
  'Mercedes-Benz': { 'Atego 816': 4000, 'Atego 1218': 6000, 'Atego 1824': 10000, 'Actros 1824': 14000, 'Actros 1840': 20000, 'Actros 1845': 22000, 'Actros 1851': 24000, 'Arocs 1836': 16000, 'Arocs 2540': 22000, 'Arocs 3340': 24000 },
  'Scania': { 'P 230': 10000, 'P 320': 14000, 'G 370': 18000, 'G 450': 20000, 'R 410': 22000, 'R 450': 24000, 'R 500': 24000, 'R 560': 24000, 'S 500': 24000, 'S 580': 24000 },
  'Volvo Trucks': { 'FL 210': 5000, 'FL 250': 6000, 'FE 250': 8000, 'FE 320': 10000, 'FM 330': 16000, 'FM 410': 18000, 'FMX 370': 20000, 'FH 420': 22000, 'FH 460': 24000, 'FH 500': 24000, 'FH 540': 24000 },
}

export const VAN_PAYLOADS: Record<string, Record<string, number>> = {
  'Volkswagen': { 'Caddy 1.0 TSI 90': 650, 'Caddy 2.0 TDI 102': 720, 'Transporter T6.1 2.0 TDI 90': 1000, 'Transporter T6.1 2.0 TDI 150': 1200, 'Crafter 2.0 TDI 102': 1400, 'Crafter 2.0 TDI 140': 1600 },
  'Mercedes-Benz': { 'Citan 108 CDI': 550, 'Citan 110 CDI': 700, 'Vito 116 CDI': 850, 'Vito 119 CDI': 1000, 'Sprinter 311 CDI': 1000, 'Sprinter 314 CDI': 1200, 'Sprinter 316 CDI': 1400, 'Sprinter 319 CDI': 1600 },
  'Ford': { 'Transit Connect 1.0 EcoBoost 100': 600, 'Transit Connect 1.5 EcoBlue 100': 700, 'Transit Custom 2.0 EcoBlue 105': 1000, 'Transit Custom 2.0 EcoBlue 130': 1100, 'Transit 2.0 EcoBlue 105': 1400, 'Transit 2.0 EcoBlue 170': 1700 },
  'Renault': { 'Kangoo 1.3 TCe 100': 500, 'Kangoo 1.5 dCi 75': 600, 'Trafic 2.0 dCi 120': 1000, 'Trafic 2.0 dCi 145': 1100, 'Master 2.3 dCi 135': 1400, 'Master 2.3 dCi 180': 1800 },
  'Fiat': { 'Doblo 1.6 MultiJet 105': 700, 'Ducato 2.3 MultiJet 120': 1200, 'Ducato 2.3 MultiJet 150': 1500, 'Ducato 2.3 MultiJet 180': 1800 },
}

// ── Helpers ───────────────────────────────────────────────────
export function getMakesList(category: string): string[] {
  const maps: Record<string, Record<string, string[]>> = {
    car: CAR_MAKES, truck: TRUCK_MAKES, van: VAN_MAKES,
    bus: BUS_MAKES, moto: MOTO_MAKES, construction: CONSTRUCTION_MAKES,
  }
  return Object.keys(maps[category] || {}).sort()
}

export function getModelsList(category: string, make: string): string[] {
  const maps: Record<string, Record<string, string[]>> = {
    car: CAR_MAKES, truck: TRUCK_MAKES, van: VAN_MAKES,
    bus: BUS_MAKES, moto: MOTO_MAKES, construction: CONSTRUCTION_MAKES,
  }
  return maps[category]?.[make] || []
}

export function getAutoPayload(category: string, make: string, model: string): string {
  if (category === 'truck') return TRUCK_PAYLOADS[make]?.[model] ? String(TRUCK_PAYLOADS[make][model]) : ''
  if (category === 'van')   return VAN_PAYLOADS[make]?.[model]   ? String(VAN_PAYLOADS[make][model])   : ''
  return ''
}
