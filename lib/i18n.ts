import type { Lang } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// AutoFleet Pro — Translations
// Languages: EL · EN · DE · FR · IT · ES
// Structure: I18N[lang][section][key]
// ─────────────────────────────────────────────────────────────────────────────

type Section = Record<string, string>
type LangData = Record<string, Section>

export const I18N: Record<Lang, LangData> = {

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ΕΛΛΗΝΙΚΑ ━━━
el: {
  app:      { name:'AutoFleet Pro', tagline:'Διαχείριση Στόλου Οχημάτων' },
  nav:      { dashboard:'Πίνακας Ελέγχου', vehicles:'Οχήματα', newVehicle:'Νέο Όχημα', settings:'Ρυθμίσεις', main:'Κύριο Μενού', analytics:'Αναλυτικά', manifest:'Μανιφέστο' },
  dashboard:{ title:'Πίνακας Ελέγχου', total:'Σύνολο Οχημάτων', inStock:'Σε Στόλο', sold:'Πωλημένα', inTransit:'Σε Μεταφορά', profit:'Συνολικό Κέρδος', recent:'Πρόσφατα Οχήματα', noRecent:'Δεν υπάρχουν οχήματα', statusOverview:'Κατάσταση Στόλου' },
  vehicle:  { id:'Κωδικός', vin:'VIN', category:'Κατηγορία', make:'Μάρκα', model:'Μοντέλο', year:'Έτος', color:'Χρώμα', engine:'Κινητήρας (cc)', fuel:'Καύσιμο', gearbox:'Κιβώτιο', mileage:'Χιλιόμετρα', firstReg:'1η Ταξινόμηση', regCountry:'Χώρα', plate:'Πινακίδα', seats:'Θέσεις', payload:'Φορτίο (kg)', cocNum:'COC', condition:'Κατάσταση', status:'Κατάσταση', notes:'Σημειώσεις' },
  tabs:     { info:'Στοιχεία', purchase:'Αγορά', importT:'Μεταφορά Αγοράς', storage:'Αποθήκη', sale:'Πώληση', exportT:'Μεταφορά Πώλησης', documents:'Έγγραφα', financials:'Οικονομικά', listings:'🌍 Αγγελίες', inspection:'🔍 Επιθεώρηση' },
  purchase: { title:'Αγορά', date:'Ημ/νία', sellerName:'Πωλητής', sellerCountry:'Χώρα', sellerContact:'Επικοινωνία', priceNet:'Τιμή (καθαρή)', vatRate:'ΦΠΑ %', priceGross:'Τιμή (μικτή)', currency:'Νόμισμα', vatType:'Τύπος ΦΠΑ', invoiceNum:'Αρ. Τιμολογίου', extraCosts:'Πρόσθετα Κόστη', notes:'Σημειώσεις', addCost:'+ Προσθήκη', costDesc:'Περιγραφή', costAmt:'Ποσό' },
  transport:{ title:'Μεταφορά', cmr:'Αρ. CMR', carrier:'Μεταφορέας', carrierContact:'Επικοινωνία', origin:'Τόπος Φόρτωσης', dest:'Τόπος Παράδοσης', depDate:'Ημ. Αναχώρησης', arrDate:'Ημ. Άφιξης', cost:'Κόστος', currency:'Νόμισμα', truckPlate:'Πινακίδα Φορτηγού', driver:'Οδηγός', notes:'Σημειώσεις' },
  storage:  { title:'Αποθήκη', location:'Τοποθεσία', locDetails:'Λεπτομέρειες', entryDate:'Ημ. Εισόδου', exitDate:'Ημ. Εξόδου', cpd:'Κόστος/Ημέρα', currency:'Νόμισμα', days:'Ημέρες', totalSC:'Σύνολο', workTitle:'Εργασίες', addWork:'+ Εργασία', wDesc:'Περιγραφή', wCost:'Κόστος', wDate:'Ημ/νία', wBy:'Από', notes:'Σημειώσεις' },
  sale:     { title:'Πώληση', date:'Ημ/νία', buyerName:'Αγοραστής', buyerCountry:'Χώρα', buyerContact:'Επικοινωνία', priceNet:'Τιμή (καθαρή)', vatRate:'ΦΠΑ %', priceGross:'Τιμή (μικτή)', currency:'Νόμισμα', vatType:'Τύπος ΦΠΑ', invoiceNum:'Αρ. Τιμολογίου', notes:'Σημειώσεις' },
  documents:{ title:'Έγγραφα', upload:'Ανέβασμα', hint:'Σύρετε ή κλικ (PDF, JPG)', name:'Όνομα', type:'Τύπος', date:'Ημ/νία', aiExtract:'Εξαγωγή AI', aiLoading:'Επεξεργασία...', aiOk:'Εξήχθησαν δεδομένα!', aiErr:'Σφάλμα', noDoc:'Δεν υπάρχουν έγγραφα', del:'Διαγραφή', view:'Προβολή' },
  financials:{ title:'Οικονομική Ανάλυση', purchaseP:'Τιμή Αγοράς', importC:'Κόστος Εισαγωγής', storageC:'Κόστος Αποθήκης', workC:'Εργασίες', exportC:'Κόστος Εξαγωγής', extraC:'Πρόσθετα', totalC:'ΣΥΝΟΛΟ ΚΟΣΤΟΥΣ', saleP:'Τιμή Πώλησης', profit:'ΚΕΡΔΟΣ / ΖΗΜΙΑ', margin:'Περιθώριο %', notSold:'Δεν πωλήθηκε' },
  status:   { purchased:'Αγοράστηκε', transit_in:'Σε Εισαγωγή', at_depot:'Στην Έδρα', for_sale:'Προς Πώληση', sold:'Πωλήθηκε', transit_out:'Σε Εξαγωγή', delivered:'Παραδόθηκε' },
  cat:      { car:'Επιβατικό', truck:'Φορτηγό', van:'Van', bus:'Λεωφορείο', moto:'Μοτοσικλέτα', construction:'Μηχανήματα Έργων' },
  fuel:     { diesel:'Πετρέλαιο', petrol:'Βενζίνη', electric:'Ηλεκτρικό', hybrid:'Υβριδικό', lpg:'Υγραέριο' },
  gear:     { manual:'Χειροκίνητο', automatic:'Αυτόματο' },
  vat:      { standard:'Κανονικό ΦΠΑ', margin:'Καθεστώς Περιθωρίου', no_vat:'Χωρίς ΦΠΑ' },
  cond:     { excellent:'Άριστη', good:'Καλή', fair:'Μέτρια', poor:'Κακή' },
  docType:  { invoice:'Τιμολόγιο', registration:'Άδεια', coc:'COC', kteo:'ΚΤΕΟ', cmr:'CMR', insurance:'Ασφάλεια', other:'Άλλο' },
  loc:      { de:'Γερμανία', gr:'Ελλάδα', other:'Άλλο' },
  actions:  { save:'Αποθήκευση', cancel:'Ακύρωση', delete:'Διαγραφή', back:'Πίσω', pdf:'PDF', search:'Αναζήτηση', confirm:'Επιβεβαίωση', remove:'Αφαίρεση', all:'Όλα', add:'Προσθήκη' },
  msg:      { saved:'Αποθηκεύτηκε ✓', deleted:'Διαγράφηκε ✓', confirmDel:'Διαγραφή αυτού του οχήματος;', noVeh:'Δεν υπάρχουν οχήματα.', search:'Αναζήτηση VIN, πινακίδα, μάρκα...', apiMissing:'Βάλτε API Key στις Ρυθμίσεις' },
  settings: { title:'Ρυθμίσεις', company:'Εταιρεία', compName:'Επωνυμία', compDE:'Διεύθυνση Γερμανίας', compGR:'Διεύθυνση Ελλάδας', apiKey:'Anthropic API Key', apiHint:'Για AI εξαγωγή εγγράφων', lang:'Γλώσσα', currency:'Νόμισμα', data:'Δεδομένα', exportJson:'Εξαγωγή JSON', importJson:'Εισαγωγή JSON' },
  report:   { title:'Αναφορά Οχήματος', genOn:'Δημιουργήθηκε', confid:'ΕΜΠΙΣΤΕΥΤΙΚΟ', vInfo:'ΣΤΟΙΧΕΙΑ ΟΧΗΜΑΤΟΣ', pInfo:'ΑΓΟΡΑ', itInfo:'ΜΕΤΑΦΟΡΑ ΑΓΟΡΑΣ', stInfo:'ΑΠΟΘΗΚΗ', sInfo:'ΠΩΛΗΣΗ', etInfo:'ΜΕΤΑΦΟΡΑ ΠΩΛΗΣΗΣ', fInfo:'ΟΙΚΟΝΟΜΙΚΑ' },
  manifest: { title:'Μανιφέστο Στόλου', subtitle:'Κατάσταση Οχημάτων', printAll:'Εκτύπωση Όλων', printStatus:'Εκτύπωση', noVehicles:'Δεν υπάρχουν οχήματα σε αυτή την κατηγορία', generatedOn:'Δημιουργήθηκε', totalVehicles:'Σύνολο Οχημάτων', page:'Σελίδα' },
},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ENGLISH ━━━
en: {
  app:      { name:'AutoFleet Pro', tagline:'Vehicle Fleet Management' },
  nav:      { dashboard:'Dashboard', vehicles:'Vehicles', newVehicle:'New Vehicle', settings:'Settings', main:'Main Menu', analytics:'Analytics', manifest:'Manifest' },
  dashboard:{ title:'Dashboard', total:'Total Vehicles', inStock:'In Stock', sold:'Sold', inTransit:'In Transit', profit:'Total Profit', recent:'Recent Vehicles', noRecent:'No vehicles yet', statusOverview:'Fleet Status' },
  vehicle:  { id:'ID', vin:'VIN', category:'Category', make:'Make', model:'Model', year:'Year', color:'Color', engine:'Engine (cc)', fuel:'Fuel', gearbox:'Gearbox', mileage:'Mileage (km)', firstReg:'First Reg.', regCountry:'Country', plate:'Plate', seats:'Seats', payload:'Payload (kg)', cocNum:'COC No.', condition:'Condition', status:'Status', notes:'Notes' },
  tabs:     { info:'Vehicle Info', purchase:'Purchase', importT:'Import Transport', storage:'Storage', sale:'Sale', exportT:'Export Transport', documents:'Documents', financials:'Financials', listings:'🌍 Listings', inspection:'🔍 Inspection' },
  purchase: { title:'Purchase', date:'Date', sellerName:'Seller', sellerCountry:'Country', sellerContact:'Contact', priceNet:'Price (net)', vatRate:'VAT %', priceGross:'Price (gross)', currency:'Currency', vatType:'VAT Type', invoiceNum:'Invoice No.', extraCosts:'Extra Costs', notes:'Notes', addCost:'+ Add Cost', costDesc:'Description', costAmt:'Amount' },
  transport:{ title:'Transport', cmr:'CMR No.', carrier:'Carrier', carrierContact:'Contact', origin:'Loading Place', dest:'Delivery Place', depDate:'Departure', arrDate:'Arrival', cost:'Cost', currency:'Currency', truckPlate:'Truck Plate', driver:'Driver', notes:'Notes' },
  storage:  { title:'Storage', location:'Location', locDetails:'Details', entryDate:'Entry Date', exitDate:'Exit Date', cpd:'Cost/Day', currency:'Currency', days:'Days', totalSC:'Total', workTitle:'Work Done', addWork:'+ Add Work', wDesc:'Description', wCost:'Cost', wDate:'Date', wBy:'By', notes:'Notes' },
  sale:     { title:'Sale', date:'Date', buyerName:'Buyer', buyerCountry:'Country', buyerContact:'Contact', priceNet:'Price (net)', vatRate:'VAT %', priceGross:'Price (gross)', currency:'Currency', vatType:'VAT Type', invoiceNum:'Invoice No.', notes:'Notes' },
  documents:{ title:'Documents', upload:'Upload', hint:'Drag or click (PDF, JPG)', name:'Name', type:'Type', date:'Date', aiExtract:'AI Extract', aiLoading:'Processing...', aiOk:'Data extracted!', aiErr:'Error', noDoc:'No documents', del:'Delete', view:'View' },
  financials:{ title:'Financial Analysis', purchaseP:'Purchase Price', importC:'Import Cost', storageC:'Storage Cost', workC:'Work Costs', exportC:'Export Cost', extraC:'Extra', totalC:'TOTAL COSTS', saleP:'Sale Price', profit:'PROFIT / LOSS', margin:'Margin %', notSold:'Not sold yet' },
  status:   { purchased:'Purchased', transit_in:'Import Transit', at_depot:'At Depot', for_sale:'For Sale', sold:'Sold', transit_out:'Export Transit', delivered:'Delivered' },
  cat:      { car:'Car', truck:'Truck', van:'Van', bus:'Bus', moto:'Motorcycle', construction:'Construction Equip.' },
  fuel:     { diesel:'Diesel', petrol:'Petrol', electric:'Electric', hybrid:'Hybrid', lpg:'LPG' },
  gear:     { manual:'Manual', automatic:'Automatic' },
  vat:      { standard:'Standard VAT', margin:'Margin Scheme', no_vat:'No VAT' },
  cond:     { excellent:'Excellent', good:'Good', fair:'Fair', poor:'Poor' },
  docType:  { invoice:'Invoice', registration:'Registration', coc:'COC', kteo:'Technical Insp.', cmr:'CMR', insurance:'Insurance', other:'Other' },
  loc:      { de:'Germany', gr:'Greece', other:'Other' },
  actions:  { save:'Save', cancel:'Cancel', delete:'Delete', back:'Back', pdf:'PDF', search:'Search', confirm:'Confirm', remove:'Remove', all:'All', add:'Add' },
  msg:      { saved:'Saved ✓', deleted:'Deleted ✓', confirmDel:'Delete this vehicle?', noVeh:'No vehicles.', search:'Search VIN, plate, make...', apiMissing:'Add API Key in Settings' },
  settings: { title:'Settings', company:'Company', compName:'Company Name', compDE:'Germany Address', compGR:'Greece Address', apiKey:'Anthropic API Key', apiHint:'For AI document extraction', lang:'Language', currency:'Currency', data:'Data', exportJson:'Export JSON', importJson:'Import JSON' },
  report:   { title:'Vehicle Report', genOn:'Generated on', confid:'CONFIDENTIAL', vInfo:'VEHICLE INFO', pInfo:'PURCHASE', itInfo:'IMPORT TRANSPORT', stInfo:'STORAGE', sInfo:'SALE', etInfo:'EXPORT TRANSPORT', fInfo:'FINANCIALS' },
  manifest: { title:'Fleet Manifest', subtitle:'Vehicle Status Report', printAll:'Print All', printStatus:'Print', noVehicles:'No vehicles in this category', generatedOn:'Generated on', totalVehicles:'Total Vehicles', page:'Page' },
},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ DEUTSCH ━━━
de: {
  app:      { name:'AutoFleet Pro', tagline:'Fuhrparkmanagement' },
  nav:      { dashboard:'Dashboard', vehicles:'Fahrzeuge', newVehicle:'Neues Fahrzeug', settings:'Einstellungen', main:'Hauptmenü', analytics:'Analysen', manifest:'Manifest' },
  dashboard:{ title:'Dashboard', total:'Fahrzeuge gesamt', inStock:'Im Bestand', sold:'Verkauft', inTransit:'Im Transport', profit:'Gesamtgewinn', recent:'Letzte Fahrzeuge', noRecent:'Noch keine Fahrzeuge', statusOverview:'Flottenübersicht' },
  vehicle:  { id:'ID', vin:'FIN', category:'Kategorie', make:'Marke', model:'Modell', year:'Baujahr', color:'Farbe', engine:'Motor (cm³)', fuel:'Kraftstoff', gearbox:'Getriebe', mileage:'Km-Stand', firstReg:'Erstzulassung', regCountry:'Land', plate:'Kennzeichen', seats:'Sitze', payload:'Nutzlast (kg)', cocNum:'COC-Nr.', condition:'Zustand', status:'Status', notes:'Bemerkungen' },
  tabs:     { info:'Fahrzeugdaten', purchase:'Ankauf', importT:'Einfuhrtransport', storage:'Lagerung', sale:'Verkauf', exportT:'Ausfuhrtransport', documents:'Dokumente', financials:'Finanzen', listings:'🌍 Inserate', inspection:'🔍 Inspektion' },
  purchase: { title:'Ankauf', date:'Datum', sellerName:'Verkäufer', sellerCountry:'Land', sellerContact:'Kontakt', priceNet:'Preis (netto)', vatRate:'MwSt %', priceGross:'Preis (brutto)', currency:'Währung', vatType:'MwSt-Art', invoiceNum:'Rechnungsnr.', extraCosts:'Zusatzkosten', notes:'Bemerkungen', addCost:'+ Hinzufügen', costDesc:'Beschreibung', costAmt:'Betrag' },
  transport:{ title:'Transport', cmr:'CMR-Nr.', carrier:'Spediteur', carrierContact:'Kontakt', origin:'Abgangsort', dest:'Zielort', depDate:'Abgang', arrDate:'Ankunft', cost:'Kosten', currency:'Währung', truckPlate:'LKW-Kennzeichen', driver:'Fahrer', notes:'Bemerkungen' },
  storage:  { title:'Lagerung', location:'Standort', locDetails:'Details', entryDate:'Einlagerung', exitDate:'Auslagerung', cpd:'Kosten/Tag', currency:'Währung', days:'Tage', totalSC:'Gesamt', workTitle:'Arbeiten', addWork:'+ Arbeit', wDesc:'Beschreibung', wCost:'Kosten', wDate:'Datum', wBy:'Von', notes:'Bemerkungen' },
  sale:     { title:'Verkauf', date:'Datum', buyerName:'Käufer', buyerCountry:'Land', buyerContact:'Kontakt', priceNet:'Preis (netto)', vatRate:'MwSt %', priceGross:'Preis (brutto)', currency:'Währung', vatType:'MwSt-Art', invoiceNum:'Rechnungsnr.', notes:'Bemerkungen' },
  documents:{ title:'Dokumente', upload:'Hochladen', hint:'Hierher ziehen (PDF, JPG)', name:'Name', type:'Typ', date:'Datum', aiExtract:'KI-Extraktion', aiLoading:'Verarbeitung...', aiOk:'Daten extrahiert!', aiErr:'Fehler', noDoc:'Keine Dokumente', del:'Löschen', view:'Anzeigen' },
  financials:{ title:'Finanzanalyse', purchaseP:'Kaufpreis', importC:'Einfuhrkosten', storageC:'Lagerkosten', workC:'Arbeitskosten', exportC:'Ausfuhrkosten', extraC:'Sonstiges', totalC:'GESAMTKOSTEN', saleP:'Verkaufspreis', profit:'GEWINN / VERLUST', margin:'Marge %', notSold:'Noch nicht verkauft' },
  status:   { purchased:'Angekauft', transit_in:'Einfuhrtransport', at_depot:'Im Depot', for_sale:'Zum Verkauf', sold:'Verkauft', transit_out:'Ausfuhrtransport', delivered:'Ausgeliefert' },
  cat:      { car:'PKW', truck:'LKW', van:'Transporter', bus:'Bus', moto:'Motorrad', construction:'Baumaschinen' },
  fuel:     { diesel:'Diesel', petrol:'Benzin', electric:'Elektrisch', hybrid:'Hybrid', lpg:'Flüssiggas' },
  gear:     { manual:'Manuell', automatic:'Automatik' },
  vat:      { standard:'Standard MwSt', margin:'Differenzbesteuerung', no_vat:'Ohne MwSt' },
  cond:     { excellent:'Ausgezeichnet', good:'Gut', fair:'Befriedigend', poor:'Schlecht' },
  docType:  { invoice:'Rechnung', registration:'Zulassung', coc:'COC', kteo:'HU/TÜV', cmr:'CMR', insurance:'Versicherung', other:'Sonstiges' },
  loc:      { de:'Deutschland', gr:'Griechenland', other:'Anderer Standort' },
  actions:  { save:'Speichern', cancel:'Abbrechen', delete:'Löschen', back:'Zurück', pdf:'PDF', search:'Suchen', confirm:'Bestätigen', remove:'Entfernen', all:'Alle', add:'Hinzufügen' },
  msg:      { saved:'Gespeichert ✓', deleted:'Gelöscht ✓', confirmDel:'Dieses Fahrzeug löschen?', noVeh:'Keine Fahrzeuge.', search:'FIN, Kennzeichen, Marke suchen...', apiMissing:'API-Schlüssel in Einstellungen eingeben' },
  settings: { title:'Einstellungen', company:'Firma', compName:'Firmenname', compDE:'Adresse Deutschland', compGR:'Adresse Griechenland', apiKey:'Anthropic API-Schlüssel', apiHint:'Für KI-Dokumentenextraktion', lang:'Sprache', currency:'Währung', data:'Daten', exportJson:'JSON exportieren', importJson:'JSON importieren' },
  report:   { title:'Fahrzeugbericht', genOn:'Erstellt am', confid:'VERTRAULICH', vInfo:'FAHRZEUGDATEN', pInfo:'ANKAUF', itInfo:'EINFUHRTRANSPORT', stInfo:'LAGERUNG', sInfo:'VERKAUF', etInfo:'AUSFUHRTRANSPORT', fInfo:'FINANZEN' },
  manifest: { title:'Flottenmanifest', subtitle:'Fahrzeugstatus-Bericht', printAll:'Alle drucken', printStatus:'Drucken', noVehicles:'Keine Fahrzeuge in dieser Kategorie', generatedOn:'Erstellt am', totalVehicles:'Fahrzeuge gesamt', page:'Seite' },
},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FRANÇAIS ━━
fr: {
  app:      { name:'AutoFleet Pro', tagline:'Gestion de Flotte de Véhicules' },
  nav:      { dashboard:'Tableau de Bord', vehicles:'Véhicules', newVehicle:'Nouveau Véhicule', settings:'Paramètres', main:'Menu Principal', analytics:'Analyses', manifest:'Manifeste' },
  dashboard:{ title:'Tableau de Bord', total:'Total Véhicules', inStock:'En Stock', sold:'Vendus', inTransit:'En Transit', profit:'Bénéfice Total', recent:'Véhicules Récents', noRecent:'Aucun véhicule', statusOverview:'État de la Flotte' },
  vehicle:  { id:'ID', vin:'VIN', category:'Catégorie', make:'Marque', model:'Modèle', year:'Année', color:'Couleur', engine:'Moteur (cc)', fuel:'Carburant', gearbox:'Boîte de Vitesse', mileage:'Kilométrage', firstReg:'1ère Immat.', regCountry:'Pays', plate:'Plaque', seats:'Places', payload:'Charge (kg)', cocNum:'N° COC', condition:'État', status:'Statut', notes:'Notes' },
  tabs:     { info:'Informations', purchase:'Achat', importT:'Transport Entrée', storage:'Stockage', sale:'Vente', exportT:'Transport Sortie', documents:'Documents', financials:'Finances', listings:'🌍 Annonces', inspection:'🔍 Inspection' },
  purchase: { title:'Détails Achat', date:'Date', sellerName:'Vendeur', sellerCountry:'Pays', sellerContact:'Contact', priceNet:'Prix (HT)', vatRate:'TVA %', priceGross:'Prix (TTC)', currency:'Devise', vatType:'Type TVA', invoiceNum:'N° Facture', extraCosts:'Frais Additionnels', notes:'Notes', addCost:'+ Ajouter', costDesc:'Description', costAmt:'Montant' },
  transport:{ title:'Transport', cmr:'N° CMR', carrier:'Transporteur', carrierContact:'Contact', origin:'Lieu Chargement', dest:'Lieu Livraison', depDate:'Départ', arrDate:'Arrivée', cost:'Coût', currency:'Devise', truckPlate:'Plaque Camion', driver:'Chauffeur', notes:'Notes' },
  storage:  { title:'Stockage', location:'Emplacement', locDetails:'Détails', entryDate:'Date Entrée', exitDate:'Date Sortie', cpd:'Coût/Jour', currency:'Devise', days:'Jours', totalSC:'Total', workTitle:'Travaux', addWork:'+ Travail', wDesc:'Description', wCost:'Coût', wDate:'Date', wBy:'Par', notes:'Notes' },
  sale:     { title:'Détails Vente', date:'Date', buyerName:'Acheteur', buyerCountry:'Pays', buyerContact:'Contact', priceNet:'Prix (HT)', vatRate:'TVA %', priceGross:'Prix (TTC)', currency:'Devise', vatType:'Type TVA', invoiceNum:'N° Facture', notes:'Notes' },
  documents:{ title:'Documents', upload:'Télécharger', hint:'Glisser ou cliquer (PDF, JPG)', name:'Nom', type:'Type', date:'Date', aiExtract:'Extraire IA', aiLoading:'Traitement...', aiOk:'Données extraites !', aiErr:'Erreur', noDoc:'Aucun document', del:'Supprimer', view:'Voir' },
  financials:{ title:'Analyse Financière', purchaseP:'Prix Achat', importC:'Transport Entrée', storageC:'Stockage', workC:'Travaux', exportC:'Transport Sortie', extraC:'Frais', totalC:'COÛT TOTAL', saleP:'Prix Vente', profit:'BÉNÉFICE / PERTE', margin:'Marge %', notSold:'Pas encore vendu' },
  status:   { purchased:'Acheté', transit_in:'Transit Entrée', at_depot:'Au Dépôt', for_sale:'À Vendre', sold:'Vendu', transit_out:'Transit Sortie', delivered:'Livré' },
  cat:      { car:'Voiture', truck:'Camion', van:'Utilitaire', bus:'Bus', moto:'Moto', construction:'Engins de Chantier' },
  fuel:     { diesel:'Diesel', petrol:'Essence', electric:'Électrique', hybrid:'Hybride', lpg:'GPL' },
  gear:     { manual:'Manuelle', automatic:'Automatique' },
  vat:      { standard:'TVA Normale', margin:'Régime Marge', no_vat:'Sans TVA' },
  cond:     { excellent:'Excellent', good:'Bon', fair:'Moyen', poor:'Mauvais' },
  docType:  { invoice:'Facture', registration:'Carte Grise', coc:'COC', kteo:'Contrôle Technique', cmr:'CMR', insurance:'Assurance', other:'Autre' },
  loc:      { de:'Dépôt Allemagne', gr:'Dépôt Grèce', other:'Autre Lieu' },
  actions:  { save:'Enregistrer', cancel:'Annuler', delete:'Supprimer', back:'Retour', pdf:'PDF', search:'Rechercher', confirm:'Confirmer', remove:'Retirer', all:'Tous', add:'Ajouter' },
  msg:      { saved:'Enregistré ✓', deleted:'Supprimé ✓', confirmDel:'Supprimer ce véhicule ?', noVeh:'Aucun véhicule.', search:'Chercher VIN, plaque, marque...', apiMissing:'Ajoutez la clé API dans Paramètres' },
  settings: { title:'Paramètres', company:'Entreprise', compName:'Nom de la Société', compDE:'Adresse Allemagne', compGR:'Adresse Grèce', apiKey:'Clé API Anthropic', apiHint:'Pour extraction documents IA', lang:'Langue', currency:'Devise', data:'Données', exportJson:'Exporter JSON', importJson:'Importer JSON' },
  report:   { title:'Rapport Véhicule', genOn:'Généré le', confid:'CONFIDENTIEL', vInfo:'DONNÉES VÉHICULE', pInfo:'ACHAT', itInfo:'TRANSPORT ENTRÉE', stInfo:'STOCKAGE', sInfo:'VENTE', etInfo:'TRANSPORT SORTIE', fInfo:'FINANCES' },
  manifest: { title:'Manifeste de Flotte', subtitle:'Rapport de Statut des Véhicules', printAll:'Tout imprimer', printStatus:'Imprimer', noVehicles:'Aucun véhicule dans cette catégorie', generatedOn:'Généré le', totalVehicles:'Total Véhicules', page:'Page' },
},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ITALIANO ━━
it: {
  app:      { name:'AutoFleet Pro', tagline:'Gestione Parco Veicoli' },
  nav:      { dashboard:'Pannello', vehicles:'Veicoli', newVehicle:'Nuovo Veicolo', settings:'Impostazioni', main:'Menu Principale', analytics:'Analisi', manifest:'Manifesto' },
  dashboard:{ title:'Pannello di Controllo', total:'Totale Veicoli', inStock:'In Stock', sold:'Venduti', inTransit:'In Transito', profit:'Profitto Totale', recent:'Veicoli Recenti', noRecent:'Nessun veicolo ancora', statusOverview:'Stato del Parco' },
  vehicle:  { id:'ID', vin:'Telaio (VIN)', category:'Categoria', make:'Marca', model:'Modello', year:'Anno', color:'Colore', engine:'Cilindrata (cc)', fuel:'Carburante', gearbox:'Cambio', mileage:'Chilometraggio', firstReg:'Prima Immat.', regCountry:'Paese', plate:'Targa', seats:'Posti', payload:'Portata (kg)', cocNum:'N. COC', condition:'Condizione', status:'Stato', notes:'Note' },
  tabs:     { info:'Dati Veicolo', purchase:'Acquisto', importT:'Trasporto Entrata', storage:'Magazzino', sale:'Vendita', exportT:'Trasporto Uscita', documents:'Documenti', financials:'Finanze', listings:'🌍 Annunci', inspection:'🔍 Ispezione' },
  purchase: { title:'Dettagli Acquisto', date:'Data', sellerName:'Venditore', sellerCountry:'Paese', sellerContact:'Contatto', priceNet:'Prezzo (netto)', vatRate:'IVA %', priceGross:'Prezzo (lordo)', currency:'Valuta', vatType:'Tipo IVA', invoiceNum:'N. Fattura', extraCosts:'Costi Aggiuntivi', notes:'Note', addCost:'+ Aggiungi', costDesc:'Descrizione', costAmt:'Importo' },
  transport:{ title:'Trasporto', cmr:'N. CMR', carrier:'Vettore', carrierContact:'Contatto', origin:'Luogo di Carico', dest:'Luogo di Consegna', depDate:'Data Partenza', arrDate:'Data Arrivo', cost:'Costo', currency:'Valuta', truckPlate:'Targa Camion', driver:'Autista', notes:'Note' },
  storage:  { title:'Magazzino', location:'Ubicazione', locDetails:'Dettagli', entryDate:'Data Entrata', exitDate:'Data Uscita', cpd:'Costo/Giorno', currency:'Valuta', days:'Giorni', totalSC:'Totale', workTitle:'Lavori Eseguiti', addWork:'+ Aggiungi Lavoro', wDesc:'Descrizione', wCost:'Costo', wDate:'Data', wBy:'Eseguito da', notes:'Note' },
  sale:     { title:'Dettagli Vendita', date:'Data', buyerName:'Acquirente', buyerCountry:'Paese', buyerContact:'Contatto', priceNet:'Prezzo (netto)', vatRate:'IVA %', priceGross:'Prezzo (lordo)', currency:'Valuta', vatType:'Tipo IVA', invoiceNum:'N. Fattura', notes:'Note' },
  documents:{ title:'Documenti e File', upload:'Carica Documento', hint:'Trascina o clicca (PDF, JPG)', name:'Nome', type:'Tipo', date:'Data', aiExtract:'Estrai con AI', aiLoading:'Elaborazione...', aiOk:'Dati estratti con successo!', aiErr:'Errore', noDoc:'Nessun documento caricato', del:'Elimina', view:'Visualizza' },
  financials:{ title:'Analisi Finanziaria', purchaseP:'Prezzo di Acquisto', importC:'Costo Trasporto Entrata', storageC:'Costo Magazzino', workC:'Costo Lavori', exportC:'Costo Trasporto Uscita', extraC:'Costi Extra', totalC:'TOTALE COSTI', saleP:'Prezzo di Vendita', profit:'PROFITTO / PERDITA', margin:'Margine %', notSold:'Non ancora venduto' },
  status:   { purchased:'Acquistato', transit_in:'Transito Entrata', at_depot:'In Deposito', for_sale:'In Vendita', sold:'Venduto', transit_out:'Transito Uscita', delivered:'Consegnato' },
  cat:      { car:'Autovettura', truck:'Camion', van:'Furgone', bus:'Autobus', moto:'Motocicletta', construction:'Macchine Movimento Terra' },
  fuel:     { diesel:'Diesel', petrol:'Benzina', electric:'Elettrico', hybrid:'Ibrido', lpg:'GPL' },
  gear:     { manual:'Manuale', automatic:'Automatico' },
  vat:      { standard:'IVA Ordinaria', margin:'Regime del Margine', no_vat:'Esente IVA' },
  cond:     { excellent:'Ottimo', good:'Buono', fair:'Discreto', poor:'Scarso' },
  docType:  { invoice:'Fattura', registration:'Libretto di Circolazione', coc:'COC', kteo:'Revisione', cmr:'CMR', insurance:'Assicurazione', other:'Altro' },
  loc:      { de:'Deposito Germania', gr:'Deposito Grecia', other:'Altra Sede' },
  actions:  { save:'Salva', cancel:'Annulla', delete:'Elimina', back:'Indietro', pdf:'PDF', search:'Cerca', confirm:'Conferma', remove:'Rimuovi', all:'Tutti', add:'Aggiungi' },
  msg:      { saved:'Salvato ✓', deleted:'Eliminato ✓', confirmDel:'Eliminare questo veicolo?', noVeh:'Nessun veicolo presente.', search:'Cerca VIN, targa, marca...', apiMissing:'Inserire la chiave API nelle Impostazioni' },
  settings: { title:'Impostazioni', company:'Dati Azienda', compName:'Ragione Sociale', compDE:'Indirizzo Germania', compGR:'Indirizzo Grecia', apiKey:'Chiave API Anthropic', apiHint:'Per l\'estrazione dati con AI', lang:'Lingua', currency:'Valuta', data:'Gestione Dati', exportJson:'Esporta JSON', importJson:'Importa JSON' },
  report:   { title:'Scheda Veicolo', genOn:'Generato il', confid:'RISERVATO', vInfo:'DATI VEICOLO', pInfo:'ACQUISTO', itInfo:'TRASPORTO ENTRATA', stInfo:'MAGAZZINO', sInfo:'VENDITA', etInfo:'TRASPORTO USCITA', fInfo:'ANALISI FINANZIARIA' },
  manifest: { title:'Manifesto del Parco', subtitle:'Riepilogo Stato Veicoli', printAll:'Stampa Tutto', printStatus:'Stampa Selezionati', noVehicles:'Nessun veicolo in questa categoria', generatedOn:'Generato il', totalVehicles:'Totale Veicoli', page:'Pagina' },
},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ESPAÑOL ━━━
es: {
  app:      { name:'AutoFleet Pro', tagline:'Gestión de Flota de Vehículos' },
  nav:      { dashboard:'Panel de Control', vehicles:'Vehículos', newVehicle:'Nuevo Vehículo', settings:'Ajustes', main:'Menú Principal', analytics:'Análisis', manifest:'Manifiesto' },
  dashboard:{ title:'Panel de Control', total:'Total Vehículos', inStock:'En Stock', sold:'Vendidos', inTransit:'En Tránsito', profit:'Beneficio Total', recent:'Vehículos Recientes', noRecent:'Sin vehículos aún', statusOverview:'Estado de la Flota' },
  vehicle:  { id:'ID', vin:'VIN', category:'Categoría', make:'Marca', model:'Modelo', year:'Año', color:'Color', engine:'Motor (cc)', fuel:'Combustible', gearbox:'Caja de Cambios', mileage:'Kilometraje', firstReg:'Primera Matrícula', regCountry:'País', plate:'Matrícula', seats:'Asientos', payload:'Carga (kg)', cocNum:'N.º COC', condition:'Estado', status:'Estado', notes:'Notas' },
  tabs:     { info:'Datos del Vehículo', purchase:'Compra', importT:'Transporte Entrada', storage:'Almacén', sale:'Venta', exportT:'Transporte Salida', documents:'Documentos', financials:'Finanzas', listings:'🌍 Anuncios', inspection:'🔍 Inspección' },
  purchase: { title:'Detalles de Compra', date:'Fecha', sellerName:'Vendedor', sellerCountry:'País', sellerContact:'Contacto', priceNet:'Precio (neto)', vatRate:'IVA %', priceGross:'Precio (bruto)', currency:'Moneda', vatType:'Tipo de IVA', invoiceNum:'N.º Factura', extraCosts:'Costes Adicionales', notes:'Notas', addCost:'+ Añadir Coste', costDesc:'Descripción', costAmt:'Importe' },
  transport:{ title:'Transporte', cmr:'N.º CMR', carrier:'Transportista', carrierContact:'Contacto', origin:'Lugar de Carga', dest:'Lugar de Entrega', depDate:'Fecha Salida', arrDate:'Fecha Llegada', cost:'Coste', currency:'Moneda', truckPlate:'Matrícula Camión', driver:'Conductor', notes:'Notas' },
  storage:  { title:'Almacén', location:'Ubicación', locDetails:'Detalles', entryDate:'Fecha Entrada', exitDate:'Fecha Salida', cpd:'Coste/Día', currency:'Moneda', days:'Días', totalSC:'Total', workTitle:'Trabajos Realizados', addWork:'+ Añadir Trabajo', wDesc:'Descripción', wCost:'Coste', wDate:'Fecha', wBy:'Realizado por', notes:'Notas' },
  sale:     { title:'Detalles de Venta', date:'Fecha', buyerName:'Comprador', buyerCountry:'País', buyerContact:'Contacto', priceNet:'Precio (neto)', vatRate:'IVA %', priceGross:'Precio (bruto)', currency:'Moneda', vatType:'Tipo de IVA', invoiceNum:'N.º Factura', notes:'Notas' },
  documents:{ title:'Documentos', upload:'Subir Documento', hint:'Arrastrar o hacer clic (PDF, JPG)', name:'Nombre', type:'Tipo', date:'Fecha', aiExtract:'Extraer con IA', aiLoading:'Procesando...', aiOk:'¡Datos extraídos!', aiErr:'Error', noDoc:'No hay documentos', del:'Eliminar', view:'Ver' },
  financials:{ title:'Análisis Financiero', purchaseP:'Precio de Compra', importC:'Transporte Entrada', storageC:'Almacenamiento', workC:'Trabajos', exportC:'Transporte Salida', extraC:'Costes Extra', totalC:'COSTE TOTAL', saleP:'Precio de Venta', profit:'BENEFICIO / PÉRDIDA', margin:'Margen %', notSold:'No vendido aún' },
  status:   { purchased:'Comprado', transit_in:'Tránsito Entrada', at_depot:'En Depósito', for_sale:'En Venta', sold:'Vendido', transit_out:'Tránsito Salida', delivered:'Entregado' },
  cat:      { car:'Turismo', truck:'Camión', van:'Furgoneta', bus:'Autobús', moto:'Motocicleta', construction:'Maquinaria de Obra' },
  fuel:     { diesel:'Diésel', petrol:'Gasolina', electric:'Eléctrico', hybrid:'Híbrido', lpg:'GLP' },
  gear:     { manual:'Manual', automatic:'Automático' },
  vat:      { standard:'IVA Normal', margin:'Régimen de Margen', no_vat:'Sin IVA' },
  cond:     { excellent:'Excelente', good:'Bueno', fair:'Regular', poor:'Malo' },
  docType:  { invoice:'Factura', registration:'Permiso de Circulación', coc:'COC', kteo:'ITV', cmr:'CMR', insurance:'Seguro', other:'Otro' },
  loc:      { de:'Depósito Alemania', gr:'Depósito Grecia', other:'Otra Ubicación' },
  actions:  { save:'Guardar', cancel:'Cancelar', delete:'Eliminar', back:'Volver', pdf:'PDF', search:'Buscar', confirm:'Confirmar', remove:'Quitar', all:'Todos', add:'Añadir' },
  msg:      { saved:'Guardado ✓', deleted:'Eliminado ✓', confirmDel:'¿Eliminar este vehículo?', noVeh:'Sin vehículos.', search:'Buscar VIN, matrícula, marca...', apiMissing:'Añade la clave API en Ajustes' },
  settings: { title:'Ajustes', company:'Datos de la Empresa', compName:'Razón Social', compDE:'Dirección Alemania', compGR:'Dirección Grecia', apiKey:'Clave API Anthropic', apiHint:'Para extracción de datos con IA', lang:'Idioma', currency:'Moneda', data:'Datos', exportJson:'Exportar JSON', importJson:'Importar JSON' },
  report:   { title:'Ficha del Vehículo', genOn:'Generado el', confid:'CONFIDENCIAL', vInfo:'DATOS DEL VEHÍCULO', pInfo:'COMPRA', itInfo:'TRANSPORTE ENTRADA', stInfo:'ALMACÉN', sInfo:'VENTA', etInfo:'TRANSPORTE SALIDA', fInfo:'FINANZAS' },
  manifest: { title:'Manifiesto de Flota', subtitle:'Resumen del Estado de Vehículos', printAll:'Imprimir Todo', printStatus:'Imprimir Selección', noVehicles:'No hay vehículos en esta categoría', generatedOn:'Generado el', totalVehicles:'Total Vehículos', page:'Página' },
},

} // end I18N

// ─────────────────────────────────────────────────────────────────────────────
// Accessor: t(lang, 'section.key')
// ─────────────────────────────────────────────────────────────────────────────
export function t(lang: Lang, key: string): string {
  const [section, ...rest] = key.split('.')
  const subKey = rest.join('.')
  const langData = I18N[lang] ?? I18N.en
  const val = langData[section]?.[subKey]
  if (typeof val === 'string' && val) return val
  // Fallback to English
  const fallback = I18N.en[section]?.[subKey]
  if (typeof fallback === 'string' && fallback) return fallback
  return key
}

// Shorthand: app name & tagline
export function appName(lang: Lang): string { return I18N[lang]?.app?.name ?? 'AutoFleet Pro' }
export function tagline(lang: Lang): string { return I18N[lang]?.app?.tagline ?? 'Fleet Management' }
