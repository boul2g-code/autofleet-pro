import type { Lang } from './types'

type TranslationMap = Partial<Record<Lang, string>>
type TranslationVars = Record<string, string | number>

const T: Record<string, TranslationMap> = {
  // App
  'app.name': { el:'AutoFleet Pro', en:'AutoFleet Pro', de:'AutoFleet Pro', fr:'AutoFleet Pro', it:'AutoFleet Pro', es:'AutoFleet Pro' },
  'app.tagline': { el:'Διαχείριση Στόλου', en:'Fleet Management', de:'Flottenmanagement', fr:'Gestion de Flotte', it:'Gestione Flotta', es:'Gestión de Flota' },

  // Nav
  'nav.dashboard': { el:'Πίνακας', en:'Dashboard', de:'Übersicht', fr:'Tableau de bord', it:'Dashboard', es:'Panel' },
  'nav.vehicles': { el:'Οχήματα', en:'Vehicles', de:'Fahrzeuge', fr:'Véhicules', it:'Veicoli', es:'Vehículos' },
  'nav.manifest': { el:'Μανιφέστο', en:'Manifest', de:'Manifest', fr:'Manifeste', it:'Manifesto', es:'Manifiesto' },
  'nav.analytics': { el:'Αναλυτικά', en:'Analytics', de:'Analytik', fr:'Analytique', it:'Analisi', es:'Análisis' },
  'nav.import': { el:'Εισαγωγή', en:'Import', de:'Import', fr:'Importer', it:'Importa', es:'Importar' },
  'nav.settings': { el:'Ρυθμίσεις', en:'Settings', de:'Einstellungen', fr:'Paramètres', it:'Impostazioni', es:'Configuración' },
  'nav.logout': { el:'Αποσύνδεση', en:'Logout', de:'Abmelden', fr:'Déconnexion', it:'Esci', es:'Cerrar sesión' },

  // Dashboard
  'dash.total': { el:'Σύνολο Οχημάτων', en:'Total Vehicles', de:'Fahrzeuge gesamt', fr:'Total Véhicules', it:'Totale Veicoli', es:'Total Vehículos' },
  'dash.inStock': { el:'Σε Απόθεμα', en:'In Stock', de:'Auf Lager', fr:'En stock', it:'In magazzino', es:'En stock' },
  'dash.sold': { el:'Πωλήθηκαν', en:'Sold', de:'Verkauft', fr:'Vendus', it:'Venduti', es:'Vendidos' },
  'dash.revenue': { el:'Έσοδα', en:'Revenue', de:'Umsatz', fr:'Chiffre d\'affaires', it:'Ricavi', es:'Ingresos' },
  'dash.profit': { el:'Κέρδος', en:'Profit', de:'Gewinn', fr:'Bénéfice', it:'Profitto', es:'Beneficio' },
  'dash.recentVehicles': { el:'Πρόσφατα Οχήματα', en:'Recent Vehicles', de:'Neueste Fahrzeuge', fr:'Véhicules récents', it:'Veicoli recenti', es:'Vehículos recientes' },
  'dash.noVehicles': { el:'Δεν υπάρχουν οχήματα', en:'No vehicles yet', de:'Keine Fahrzeuge', fr:'Aucun véhicule', it:'Nessun veicolo', es:'Sin vehículos' },
  'dash.addFirst': { el:'Προσθέστε το πρώτο σας όχημα', en:'Add your first vehicle', de:'Fügen Sie Ihr erstes Fahrzeug hinzu', fr:'Ajoutez votre premier véhicule', it:'Aggiungi il tuo primo veicolo', es:'Añade tu primer vehículo' },
  'dash.agingAlert': { el:'Οχήματα σε απόθεμα >30 ημέρες', en:'Vehicles in stock over 30 days', de:'Fahrzeuge über 30 Tage auf Lager', fr:'Véhicules en stock plus de 30 jours', it:'Veicoli in stock oltre 30 giorni', es:'Vehículos en stock más de 30 días' },
  'dash.agingCost': { el:'Εκτιμ. Κόστος Αναμονής', en:'Est. Holding Cost', de:'Gesch. Lagerkosten', fr:'Coût estimé de stockage', it:'Costo stimato di giacenza', es:'Costo estimado de almacenamiento' },
  'dash.topOpportunity': { el:'Καλύτερη Ευκαιρία', en:'Top Opportunity', de:'Beste Gelegenheit', fr:'Meilleure opportunité', it:'Migliore opportunità', es:'Mejor oportunidad' },
  'dash.needsAttention': { el:'Απαιτεί Προσοχή', en:'Needs Attention', de:'Erfordert Aufmerksamkeit', fr:'Nécessite attention', it:'Richiede attenzione', es:'Requiere atención' },
  'dash.stockValue': { el:'Αξία Αποθέματος', en:'Stock Value', de:'Bestandswert', fr:'Valeur du stock', it:'Valore magazzino', es:'Valor del stock' },
  'dash.monthProfit': { el:'Κέρδος Μήνα', en:'Month Profit', de:'Monatsgewinn', fr:'Bénéfice du mois', it:'Profitto mese', es:'Beneficio del mes' },
  'dash.totalProfit': { el:'Σύνολο Κέρδους', en:'Total Profit', de:'Gesamtgewinn', fr:'Bénéfice total', it:'Profitto totale', es:'Beneficio total' },
  'dash.avgDays': { el:'Μέσος Χρόνος', en:'Avg Days to Sell', de:'Ø Verkaufstage', fr:'Jours moyens de vente', it:'Giorni medi di vendita', es:'Días promedio de venta' },
  'dash.inTransit': { el:'Σε Μεταφορά', en:'In Transit', de:'Im Transport', fr:'En transit', it:'In transito', es:'En tránsito' },
  'dash.fleetStatus': { el:'Κατάσταση Στόλου', en:'Fleet Status', de:'Flottenübersicht', fr:'État de la flotte', it:'Stato della flotta', es:'Estado de la flota' },
  'dash.quickLinks': { el:'Γρήγορες Συνδέσεις', en:'Quick Links', de:'Schnellzugriff', fr:'Liens rapides', it:'Link veloci', es:'Accesos rápidos' },
  'dash.highestScore': { el:'Υψηλότερο score + κέρδος', en:'Highest score + profit', de:'Höchster Score + Gewinn', fr:'Score + profit le plus élevé', it:'Score + profitto più alto', es:'Mayor score + beneficio' },
  'dash.estProfit': { el:'Εκτιμ. Κέρδος', en:'Est. Profit', de:'Gesch. Gewinn', fr:'Bénéfice estimé', it:'Profitto stimato', es:'Beneficio estimado' },

  // Vehicles
  'veh.new': { el:'Νέο Όχημα', en:'New Vehicle', de:'Neues Fahrzeug', fr:'Nouveau véhicule', it:'Nuovo Veicolo', es:'Nuevo Vehículo' },
  'veh.search': { el:'Αναζήτηση...', en:'Search...', de:'Suchen...', fr:'Rechercher...', it:'Cerca...', es:'Buscar...' },
  'veh.all': { el:'Όλα', en:'All', de:'Alle', fr:'Tous', it:'Tutti', es:'Todos' },
  'veh.noResults': { el:'Δεν βρέθηκαν αποτελέσματα', en:'No results found', de:'Keine Ergebnisse', fr:'Aucun résultat', it:'Nessun risultato', es:'Sin resultados' },
  'veh.delete': { el:'Διαγραφή', en:'Delete', de:'Löschen', fr:'Supprimer', it:'Elimina', es:'Eliminar' },
  'veh.deleteConfirm': { el:'Είστε σίγουροι;', en:'Are you sure?', de:'Sind Sie sicher?', fr:'Êtes-vous sûr?', it:'Sei sicuro?', es:'¿Estás seguro?' },
  'veh.deleteConfirm2': { el:'Αυτή η ενέργεια δεν αναιρείται. Διαγραφή;', en:'This cannot be undone. Delete?', de:'Dies kann nicht rückgängig gemacht werden.', fr:'Cela ne peut pas être annulé.', it:'Questa azione non può essere annullata.', es:'Esta acción no se puede deshacer.' },
  'veh.saved': { el:'Αποθηκεύτηκε', en:'Saved', de:'Gespeichert', fr:'Enregistré', it:'Salvato', es:'Guardado' },
  'veh.saving': { el:'Αποθήκευση...', en:'Saving...', de:'Speichern...', fr:'Enregistrement...', it:'Salvataggio...', es:'Guardando...' },

  // Tabs
  'tab.info': { el:'Στοιχεία', en:'Info', de:'Info', fr:'Info', it:'Info', es:'Info' },
  'tab.purchase': { el:'Αγορά', en:'Purchase', de:'Kauf', fr:'Achat', it:'Acquisto', es:'Compra' },
  'tab.transportIn': { el:'Μεταφορά Εισ.', en:'Transport In', de:'Transport Ein', fr:'Transport Entrée', it:'Trasporto In', es:'Transporte Entrada' },
  'tab.storage': { el:'Αποθήκευση', en:'Storage', de:'Lagerung', fr:'Stockage', it:'Deposito', es:'Almacén' },
  'tab.sale': { el:'Πώληση', en:'Sale', de:'Verkauf', fr:'Vente', it:'Vendita', es:'Venta' },
  'tab.transportOut': { el:'Μεταφορά Εξ.', en:'Transport Out', de:'Transport Aus', fr:'Transport Sortie', it:'Trasporto Out', es:'Transporte Salida' },
  'tab.documents': { el:'Έγγραφα', en:'Documents', de:'Dokumente', fr:'Documents', it:'Documenti', es:'Documentos' },
  'tab.financials': { el:'Οικονομικά', en:'Financials', de:'Finanzen', fr:'Finances', it:'Finanze', es:'Finanzas' },
  'tab.score': { el:'Score', en:'Score', de:'Score', fr:'Score', it:'Score', es:'Score' },
  'tab.timeline': { el:'Χρονολόγιο', en:'Timeline', de:'Verlauf', fr:'Chronologie', it:'Cronologia', es:'Cronología' },
  'tab.flyer': { el:'Φυλλάδιο', en:'Flyer', de:'Flyer', fr:'Flyer', it:'Volantino', es:'Folleto' },
  'tab.listings': { el:'Αγγελίες', en:'Listings', de:'Inserate', fr:'Annonces', it:'Inserzioni', es:'Anuncios' },
  'tab.inspection': { el:'Επιθεώρηση', en:'Inspection', de:'Inspektion', fr:'Inspection', it:'Ispezione', es:'Inspección' },

  // Fields
  'field.make': { el:'Μάρκα', en:'Make', de:'Marke', fr:'Marque', it:'Marca', es:'Marca' },
  'field.model': { el:'Μοντέλο', en:'Model', de:'Modell', fr:'Modèle', it:'Modello', es:'Modelo' },
  'field.year': { el:'Έτος', en:'Year', de:'Jahr', fr:'Année', it:'Anno', es:'Año' },
  'field.vin': { el:'VIN', en:'VIN', de:'Fahrgestellnr.', fr:'Numéro VIN', it:'Telaio', es:'Nº de bastidor' },
  'field.plate': { el:'Πινακίδα', en:'Plate', de:'Kennzeichen', fr:'Immatriculation', it:'Targa', es:'Matrícula' },
  'field.color': { el:'Χρώμα', en:'Color', de:'Farbe', fr:'Couleur', it:'Colore', es:'Color' },
  'field.fuel': { el:'Καύσιμο', en:'Fuel', de:'Kraftstoff', fr:'Carburant', it:'Carburante', es:'Combustible' },
  'field.gear': { el:'Κιβώτιο', en:'Gearbox', de:'Getriebe', fr:'Boîte de vitesses', it:'Cambio', es:'Caja de cambios' },
  'field.engineCC': { el:'Κυβισμός (cc)', en:'Engine (cc)', de:'Hubraum (cc)', fr:'Cylindrée (cc)', it:'Cilindrata (cc)', es:'Cilindrada (cc)' },
  'field.powerKW': { el:'Ισχύς (kW)', en:'Power (kW)', de:'Leistung (kW)', fr:'Puissance (kW)', it:'Potenza (kW)', es:'Potencia (kW)' },
  'field.mileage': { el:'Χιλιόμετρα', en:'Mileage', de:'Kilometerstand', fr:'Kilométrage', it:'Chilometraggio', es:'Kilometraje' },
  'field.seats': { el:'Θέσεις', en:'Seats', de:'Sitze', fr:'Sièges', it:'Posti', es:'Plazas' },
  'field.weightKg': { el:'Βάρος (kg)', en:'Weight (kg)', de:'Gewicht (kg)', fr:'Poids (kg)', it:'Peso (kg)', es:'Peso (kg)' },
  'field.payloadKg': { el:'Φορτίο (kg)', en:'Payload (kg)', de:'Nutzlast (kg)', fr:'Charge utile (kg)', it:'Portata (kg)', es:'Carga útil (kg)' },
  'field.status': { el:'Κατάσταση', en:'Status', de:'Status', fr:'Statut', it:'Stato', es:'Estado' },
  'field.category': { el:'Κατηγορία', en:'Category', de:'Kategorie', fr:'Catégorie', it:'Categoria', es:'Categoría' },
  'field.notes': { el:'Σημειώσεις', en:'Notes', de:'Notizen', fr:'Notes', it:'Note', es:'Notas' },
  'field.date': { el:'Ημερομηνία', en:'Date', de:'Datum', fr:'Date', it:'Data', es:'Fecha' },
  'field.price': { el:'Τιμή', en:'Price', de:'Preis', fr:'Prix', it:'Prezzo', es:'Precio' },
  'field.currency': { el:'Νόμισμα', en:'Currency', de:'Währung', fr:'Devise', it:'Valuta', es:'Moneda' },
  'field.vatRegime': { el:'Καθεστώς ΦΠΑ', en:'VAT Regime', de:'MwSt.-Regelung', fr:'Régime TVA', it:'Regime IVA', es:'Régimen IVA' },
  'field.vatAmount': { el:'Ποσό ΦΠΑ', en:'VAT Amount', de:'MwSt.-Betrag', fr:'Montant TVA', it:'Importo IVA', es:'Importe IVA' },
  'field.invoiceNumber': { el:'Αρ. Τιμολογίου', en:'Invoice No.', de:'Rechnungsnr.', fr:'Nº de facture', it:'Nº fattura', es:'Nº factura' },
  'field.seller': { el:'Πωλητής', en:'Seller', de:'Verkäufer', fr:'Vendeur', it:'Venditore', es:'Vendedor' },
  'field.buyer': { el:'Αγοραστής', en:'Buyer', de:'Käufer', fr:'Acheteur', it:'Acquirente', es:'Comprador' },
  'field.country': { el:'Χώρα', en:'Country', de:'Land', fr:'Pays', it:'Paese', es:'País' },
  'field.phone': { el:'Τηλέφωνο', en:'Phone', de:'Telefon', fr:'Téléphone', it:'Telefono', es:'Teléfono' },
  'field.cmr': { el:'CMR', en:'CMR', de:'CMR', fr:'CMR', it:'CMR', es:'CMR' },
  'field.carrier': { el:'Μεταφορέας', en:'Carrier', de:'Spediteur', fr:'Transporteur', it:'Vettore', es:'Transportista' },
  'field.driver': { el:'Οδηγός', en:'Driver', de:'Fahrer', fr:'Chauffeur', it:'Autista', es:'Conductor' },
  'field.truckPlate': { el:'Πινακίδα Φορτηγού', en:'Truck Plate', de:'LKW-Kennzeichen', fr:'Plaque camion', it:'Targa autocarro', es:'Matrícula camión' },
  'field.departure': { el:'Αναχώρηση', en:'Departure', de:'Abfahrt', fr:'Départ', it:'Partenza', es:'Salida' },
  'field.arrival': { el:'Άφιξη', en:'Arrival', de:'Ankunft', fr:'Arrivée', it:'Arrivo', es:'Llegada' },
  'field.origin': { el:'Προέλευση', en:'Origin', de:'Herkunft', fr:'Origine', it:'Origine', es:'Origen' },
  'field.destination': { el:'Προορισμός', en:'Destination', de:'Ziel', fr:'Destination', it:'Destinazione', es:'Destino' },
  'field.cost': { el:'Κόστος', en:'Cost', de:'Kosten', fr:'Coût', it:'Costo', es:'Costo' },
  'field.location': { el:'Τοποθεσία', en:'Location', de:'Standort', fr:'Emplacement', it:'Posizione', es:'Ubicación' },
  'field.address': { el:'Διεύθυνση', en:'Address', de:'Adresse', fr:'Adresse', it:'Indirizzo', es:'Dirección' },
  'field.costPerDay': { el:'Κόστος/Ημέρα', en:'Cost/Day', de:'Kosten/Tag', fr:'Coût/jour', it:'Costo/giorno', es:'Costo/día' },
  'field.workDone': { el:'Εργασίες', en:'Work Done', de:'Durchgeführte Arbeiten', fr:'Travaux effectués', it:'Lavori eseguiti', es:'Trabajos realizados' },
  'field.totalCost': { el:'Συνολικό Κόστος', en:'Total Cost', de:'Gesamtkosten', fr:'Coût total', it:'Costo totale', es:'Costo total' },
  'field.salePrice': { el:'Τιμή Πώλησης', en:'Sale Price', de:'Verkaufspreis', fr:'Prix de vente', it:'Prezzo di vendita', es:'Precio de venta' },
  'field.profit': { el:'Κέρδος', en:'Profit', de:'Gewinn', fr:'Bénéfice', it:'Profitto', es:'Beneficio' },
  'field.margin': { el:'Περιθώριο %', en:'Margin %', de:'Marge %', fr:'Marge %', it:'Margine %', es:'Margen %' },

  // Status
  'status.purchased': { el:'Αγοράστηκε', en:'Purchased', de:'Gekauft', fr:'Acheté', it:'Acquistato', es:'Comprado' },
  'status.transit_in': { el:'Μεταφορά Εισ.', en:'Transit In', de:'Transport Ein', fr:'Transit Entrée', it:'Transito In', es:'Tránsito Entrada' },
  'status.stored': { el:'Σε Αποθήκη', en:'In Storage', de:'Eingelagert', fr:'En stock', it:'In deposito', es:'En almacén' },
  'status.for_sale': { el:'Προς Πώληση', en:'For Sale', de:'Zu verkaufen', fr:'À vendre', it:'In vendita', es:'En venta' },
  'status.sold': { el:'Πωλήθηκε', en:'Sold', de:'Verkauft', fr:'Vendu', it:'Venduto', es:'Vendido' },
  'status.transit_out': { el:'Μεταφορά Εξ.', en:'Transit Out', de:'Transport Aus', fr:'Transit Sortie', it:'Transito Out', es:'Tránsito Salida' },
  'status.delivered': { el:'Παραδόθηκε', en:'Delivered', de:'Geliefert', fr:'Livré', it:'Consegnato', es:'Entregado' },

  // Category
  'cat.car': { el:'Αυτοκίνητο', en:'Car', de:'PKW', fr:'Voiture', it:'Auto', es:'Coche' },
  'cat.truck': { el:'Φορτηγό', en:'Truck', de:'LKW', fr:'Camion', it:'Camion', es:'Camión' },
  'cat.van': { el:'Van', en:'Van', de:'Van', fr:'Van', it:'Van', es:'Furgoneta' },
  'cat.bus': { el:'Λεωφορείο', en:'Bus', de:'Bus', fr:'Bus', it:'Bus', es:'Autobús' },
  'cat.moto': { el:'Μοτοσυκλέτα', en:'Motorcycle', de:'Motorrad', fr:'Moto', it:'Moto', es:'Moto' },
  'cat.construction': { el:'Μηχάνημα Έργων', en:'Construction', de:'Baumaschine', fr:'Engin de chantier', it:'Macchina da cantiere', es:'Maquinaria de obra' },

  // Fuel
  'fuel.diesel': { el:'Diesel', en:'Diesel', de:'Diesel', fr:'Diesel', it:'Diesel', es:'Diésel' },
  'fuel.petrol': { el:'Βενζίνη', en:'Petrol', de:'Benzin', fr:'Essence', it:'Benzina', es:'Gasolina' },
  'fuel.hybrid': { el:'Υβριδικό', en:'Hybrid', de:'Hybrid', fr:'Hybride', it:'Ibrido', es:'Híbrido' },
  'fuel.electric': { el:'Ηλεκτρικό', en:'Electric', de:'Elektrisch', fr:'Électrique', it:'Elettrico', es:'Eléctrico' },
  'fuel.lpg': { el:'LPG', en:'LPG', de:'LPG', fr:'GPL', it:'GPL', es:'GLP' },
  'fuel.cng': { el:'CNG', en:'CNG', de:'CNG', fr:'GNV', it:'CNG', es:'GNC' },
  'fuel.other': { el:'Άλλο', en:'Other', de:'Andere', fr:'Autre', it:'Altro', es:'Otro' },

  // Actions
  'action.save': { el:'Αποθήκευση', en:'Save', de:'Speichern', fr:'Enregistrer', it:'Salva', es:'Guardar' },
  'action.cancel': { el:'Ακύρωση', en:'Cancel', de:'Abbrechen', fr:'Annuler', it:'Annulla', es:'Cancelar' },
  'action.add': { el:'Προσθήκη', en:'Add', de:'Hinzufügen', fr:'Ajouter', it:'Aggiungi', es:'Añadir' },
  'action.edit': { el:'Επεξεργασία', en:'Edit', de:'Bearbeiten', fr:'Modifier', it:'Modifica', es:'Editar' },
  'action.delete': { el:'Διαγραφή', en:'Delete', de:'Löschen', fr:'Supprimer', it:'Elimina', es:'Eliminar' },
  'action.print': { el:'Εκτύπωση', en:'Print', de:'Drucken', fr:'Imprimer', it:'Stampa', es:'Imprimir' },
  'action.export': { el:'Εξαγωγή', en:'Export', de:'Exportieren', fr:'Exporter', it:'Esporta', es:'Exportar' },
  'action.upload': { el:'Μεταφόρτωση', en:'Upload', de:'Hochladen', fr:'Télécharger', it:'Carica', es:'Subir' },
  'action.download': { el:'Λήψη', en:'Download', de:'Herunterladen', fr:'Télécharger', it:'Scarica', es:'Descargar' },
  'action.generate': { el:'Δημιουργία', en:'Generate', de:'Erstellen', fr:'Générer', it:'Genera', es:'Generar' },
  'action.copy': { el:'Αντιγραφή', en:'Copy', de:'Kopieren', fr:'Copier', it:'Copia', es:'Copiar' },
  'action.share': { el:'Κοινοποίηση', en:'Share', de:'Teilen', fr:'Partager', it:'Condividi', es:'Compartir' },
  'action.viewAll': { el:'Προβολή Όλων', en:'View All', de:'Alle anzeigen', fr:'Voir tout', it:'Vedi tutti', es:'Ver todos' },
  'action.backToList': { el:'Πίσω στη Λίστα', en:'Back to List', de:'Zurück zur Liste', fr:'Retour à la liste', it:'Torna alla lista', es:'Volver a la lista' },
  'action.confirm': { el:'Επιβεβαίωση', en:'Confirm', de:'Bestätigen', fr:'Confirmer', it:'Conferma', es:'Confirmar' },

  // Manifest
  'manifest.title': { el:'Μανιφέστο Στόλου', en:'Fleet Manifest', de:'Flottenmanifest', fr:'Manifeste de flotte', it:'Manifesto Flotta', es:'Manifiesto de Flota' },
  'manifest.filterAll': { el:'Όλα', en:'All', de:'Alle', fr:'Tous', it:'Tutti', es:'Todos' },
  'manifest.vehicles': { el:'Οχήματα', en:'Vehicles', de:'Fahrzeuge', fr:'Véhicules', it:'Veicoli', es:'Vehículos' },
  'manifest.printPdf': { el:'Εκτύπωση PDF', en:'Print PDF', de:'PDF drucken', fr:'Imprimer PDF', it:'Stampa PDF', es:'Imprimir PDF' },
  'analytics.totalSold':    { el:'Σύνολο Πωλήσεων',         en:'Total Sold',           de:'Gesamt verkauft',    fr:'Total vendu',           it:'Totale venduto',    es:'Total vendido' },
  'analytics.totalRevenue': { el:'Συνολικά Έσοδα',           en:'Total Revenue',        de:'Gesamtumsatz',       fr:'Chiffre total',         it:'Ricavi totali',     es:'Ingresos totales' },
  'analytics.totalProfit':  { el:'Συνολικό Κέρδος',          en:'Total Profit',         de:'Gesamtgewinn',       fr:'Bénéfice total',        it:'Profitto totale',   es:'Beneficio total' },
  'analytics.avgMargin':    { el:'Μέσο Περιθώριο',           en:'Avg Margin',           de:'Ø Marge',            fr:'Marge moyenne',         it:'Margine medio',     es:'Margen promedio' },
  'analytics.byMake':       { el:'Στόλος ανά Μάρκα',         en:'Fleet by Make',        de:'Flotte nach Marke',  fr:'Flotte par marque',     it:'Flotta per marca',  es:'Flota por marca' },
  'analytics.byStatus':     { el:'Στόλος ανά Κατάσταση',     en:'Fleet by Status',      de:'Flotte nach Status', fr:'Flotte par statut',     it:'Flotta per stato',  es:'Flota por estado' },
  'analytics.top5':         { el:'Κορυφαία 5 Πιο Κερδοφόρα', en:'Top 5 Most Profitable', de:'Top 5 profitabelste', fr:'Top 5 plus rentables', it:'Top 5 più redditizi', es:'Top 5 más rentables' },
  'analytics.vehicle':      { el:'Όχημα',                    en:'Vehicle',              de:'Fahrzeug',           fr:'Véhicule',              it:'Veicolo',           es:'Vehículo' },
  'analytics.profit':       { el:'Κέρδος',                   en:'Profit',               de:'Gewinn',             fr:'Bénéfice',              it:'Profitto',          es:'Beneficio' },
  'analytics.margin':       { el:'Περιθώριο',                en:'Margin',               de:'Marge',              fr:'Marge',                 it:'Margine',           es:'Margen' },
  'analytics.unknown':      { el:'Άγνωστο',                  en:'Unknown',              de:'Unbekannt',          fr:'Inconnu',               it:'Sconosciuto',       es:'Desconocido' },
  'manifest.empty': { el:'Δεν υπάρχουν οχήματα', en:'No vehicles in this status', de:'Keine Fahrzeuge', fr:'Aucun véhicule', it:'Nessun veicolo', es:'Sin vehículos' },

  // Financials
  'fin.purchaseCost': { el:'Κόστος Αγοράς', en:'Purchase Cost', de:'Kaufpreis', fr:'Coût d\'achat', it:'Costo acquisto', es:'Costo compra' },
  'fin.transportInCost': { el:'Κόστος Μεταφοράς Εισ.', en:'Transport In Cost', de:'Transportkosten Ein', fr:'Coût transport entrée', it:'Costo trasporto in', es:'Costo transporte entrada' },
  'fin.storageCost': { el:'Κόστος Αποθήκευσης', en:'Storage Cost', de:'Lagerkosten', fr:'Coût de stockage', it:'Costo deposito', es:'Costo almacén' },
  'fin.workCost': { el:'Κόστος Εργασιών', en:'Work Cost', de:'Arbeitskosten', fr:'Coût des travaux', it:'Costo lavori', es:'Costo trabajos' },
  'fin.transportOutCost': { el:'Κόστος Μεταφοράς Εξ.', en:'Transport Out Cost', de:'Transportkosten Aus', fr:'Coût transport sortie', it:'Costo trasporto out', es:'Costo transporte salida' },
  'fin.totalCost': { el:'Συνολικό Κόστος', en:'Total Cost', de:'Gesamtkosten', fr:'Coût total', it:'Costo totale', es:'Costo total' },
  'fin.saleRevenue': { el:'Έσοδα Πώλησης', en:'Sale Revenue', de:'Verkaufserlös', fr:'Recette de vente', it:'Ricavo vendita', es:'Ingreso venta' },
  'fin.grossProfit': { el:'Μεικτό Κέρδος', en:'Gross Profit', de:'Bruttogewinn', fr:'Bénéfice brut', it:'Utile lordo', es:'Beneficio bruto' },
  'fin.margin': { el:'Περιθώριο', en:'Margin', de:'Marge', fr:'Marge', it:'Margine', es:'Margen' },
  'fin.storageDays': { el:'Ημέρες Αποθήκευσης', en:'Storage Days', de:'Lagertage', fr:'Jours de stockage', it:'Giorni deposito', es:'Días almacén' },

  // Settings
  'settings.title': { el:'Ρυθμίσεις', en:'Settings', de:'Einstellungen', fr:'Paramètres', it:'Impostazioni', es:'Configuración' },
  'settings.company': { el:'Στοιχεία Εταιρείας', en:'Company Info', de:'Firmendaten', fr:'Infos entreprise', it:'Dati azienda', es:'Datos empresa' },
  'settings.companyName': { el:'Επωνυμία', en:'Company Name', de:'Firmenname', fr:'Nom de l\'entreprise', it:'Ragione sociale', es:'Nombre empresa' },
  'settings.aiKey': { el:'Anthropic API Key', en:'Anthropic API Key', de:'Anthropic API-Schlüssel', fr:'Clé API Anthropic', it:'Chiave API Anthropic', es:'Clave API Anthropic' },
  'settings.language': { el:'Γλώσσα', en:'Language', de:'Sprache', fr:'Langue', it:'Lingua', es:'Idioma' },
  'settings.backup': { el:'Αντίγραφο Ασφαλείας', en:'Backup', de:'Datensicherung', fr:'Sauvegarde', it:'Backup', es:'Copia de seguridad' },
  'settings.exportAll': { el:'Εξαγωγή Όλων', en:'Export All', de:'Alle exportieren', fr:'Tout exporter', it:'Esporta tutto', es:'Exportar todo' },

  // Errors / misc
  'err.required': { el:'Υποχρεωτικό πεδίο', en:'Required field', de:'Pflichtfeld', fr:'Champ requis', it:'Campo obbligatorio', es:'Campo obligatorio' },
  'err.notFound': { el:'Δεν βρέθηκε', en:'Not found', de:'Nicht gefunden', fr:'Non trouvé', it:'Non trovato', es:'No encontrado' },
  'misc.daysInStorage': { el:'ημέρες σε αποθήκη', en:'days in storage', de:'Tage eingelagert', fr:'jours en stock', it:'giorni in deposito', es:'días en almacén' },
  'misc.noPhoto': { el:'Χωρίς φωτογραφία', en:'No photo', de:'Kein Foto', fr:'Pas de photo', it:'Nessuna foto', es:'Sin foto' },
  'misc.clickToUpload': { el:'Κλικ για μεταφόρτωση', en:'Click to upload', de:'Zum Hochladen klicken', fr:'Cliquez pour télécharger', it:'Clicca per caricare', es:'Clic para subir' },

  // Onboarding
  'onboard.title': { el:'Καλώς ήρθατε!', en:'Welcome!', de:'Willkommen!', fr:'Bienvenue!', it:'Benvenuto!', es:'¡Bienvenido!' },
  'onboard.subtitle': { el:'Ρυθμίστε την εταιρεία σας', en:'Set up your company', de:'Richten Sie Ihr Unternehmen ein', fr:'Configurez votre entreprise', it:'Configura la tua azienda', es:'Configura tu empresa' },
  'onboard.companyName': { el:'Επωνυμία Εταιρείας', en:'Company Name', de:'Firmenname', fr:'Nom de l\'entreprise', it:'Nome Azienda', es:'Nombre de empresa' },
  'onboard.country': { el:'Χώρα Έδρας', en:'Country', de:'Sitzland', fr:'Pays', it:'Paese', es:'País' },
  'onboard.continue': { el:'Συνέχεια', en:'Continue', de:'Weiter', fr:'Continuer', it:'Continua', es:'Continuar' },

  // Login
  'login.email': { el:'Email', en:'Email', de:'E-Mail', fr:'E-mail', it:'Email', es:'Correo' },
  'login.password': { el:'Κωδικός', en:'Password', de:'Passwort', fr:'Mot de passe', it:'Password', es:'Contraseña' },
  'login.signin': { el:'Σύνδεση', en:'Sign In', de:'Anmelden', fr:'Connexion', it:'Accedi', es:'Iniciar sesión' },
  'login.signup': { el:'Εγγραφή', en:'Sign Up', de:'Registrieren', fr:'S\'inscrire', it:'Registrati', es:'Registrarse' },
  'login.noAccount': { el:'Δεν έχετε λογαριασμό;', en:'No account?', de:'Kein Konto?', fr:'Pas de compte?', it:'Nessun account?', es:'¿Sin cuenta?' },
  'login.hasAccount': { el:'Έχετε ήδη λογαριασμό;', en:'Have an account?', de:'Haben Sie bereits ein Konto?', fr:'Vous avez déjà un compte?', it:'Hai già un account?', es:'¿Ya tienes cuenta?' },
  'login.error': { el:'Λάθος email ή κωδικός', en:'Wrong email or password', de:'Falsche E-Mail oder Passwort', fr:'E-mail ou mot de passe incorrect', it:'Email o password errati', es:'Email o contraseña incorrectos' },
}

const EXTRA_TRANSLATIONS: Record<string, TranslationMap> = {
  'app.tagline': { sq:'Menaxhim Flote', sr:'Upravljanje voznim parkom', bg:'Управление на автопарк', mk:'Управување со возен парк' },
  'nav.dashboard': { sq:'Paneli', sr:'Kontrolna tabla', bg:'Табло', mk:'Контролна табла' },
  'nav.vehicles': { sq:'Automjetet', sr:'Vozila', bg:'Превозни средства', mk:'Возила' },
  'nav.manifest': { sq:'Manifesti', sr:'Manifest', bg:'Манифест', mk:'Манифест' },
  'nav.analytics': { sq:'Analitika', sr:'Analitika', bg:'Анализи', mk:'Аналитика' },
  'nav.import': { sq:'Import', sr:'Uvoz', bg:'Импорт', mk:'Увоз' },
  'nav.settings': { sq:'Cilesimet', sr:'Podesavanja', bg:'Настройки', mk:'Поставки' },
  'nav.logout': { sq:'Dil', sr:'Odjava', bg:'Изход', mk:'Одјава' },

  'dash.total': { sq:'Totali i automjeteve', sr:'Ukupno vozila', bg:'Общо превозни средства', mk:'Вкупно возила' },
  'dash.inStock': { sq:'Ne stok', sr:'Na lageru', bg:'В наличност', mk:'На залиха' },
  'dash.sold': { sq:'Te shitura', sr:'Prodata', bg:'Продадени', mk:'Продадени' },
  'dash.recentVehicles': { sq:'Automjetet e fundit', sr:'Najnovija vozila', bg:'Последни превозни средства', mk:'Последни возила' },
  'dash.addFirst': { sq:'Shto automjetin e pare', sr:'Dodaj prvo vozilo', bg:'Добави първото превозно средство', mk:'Додај го првото возило' },
  'dash.stockValue': { sq:'Vlera e stokut', sr:'Vrednost lagera', bg:'Стойност на наличността', mk:'Вредност на залихата' },
  'dash.monthProfit': { sq:'Fitimi i muajit', sr:'Mesecni profit', bg:'Печалба за месеца', mk:'Месечна добивка' },
  'dash.inTransit': { sq:'Ne transport', sr:'U transportu', bg:'В транспорт', mk:'Во транспорт' },
  'dash.fleetStatus': { sq:'Statusi i flotës', sr:'Status voznog parka', bg:'Статус на автопарка', mk:'Статус на возниот парк' },

  'tab.info': { sq:'Info', sr:'Info', bg:'Инфо', mk:'Инфо' },
  'tab.purchase': { sq:'Blerja', sr:'Kupovina', bg:'Покупка', mk:'Набавка' },
  'tab.transportIn': { sq:'Transport hyrje', sr:'Ulazni transport', bg:'Входящ транспорт', mk:'Влезен транспорт' },
  'tab.storage': { sq:'Depoja', sr:'Skladiste', bg:'Склад', mk:'Складирање' },
  'tab.sale': { sq:'Shitja', sr:'Prodaja', bg:'Продажба', mk:'Продажба' },
  'tab.transportOut': { sq:'Transport dalje', sr:'Izlazni transport', bg:'Изходящ транспорт', mk:'Излезен транспорт' },
  'tab.documents': { sq:'Dokumente', sr:'Dokumenta', bg:'Документи', mk:'Документи' },
  'tab.financials': { sq:'Financa', sr:'Finansije', bg:'Финанси', mk:'Финансии' },
  'tab.score': { sq:'Rezultati', sr:'Skor', bg:'Оценка', mk:'Оцена' },
  'tab.timeline': { sq:'Kronologjia', sr:'Vremenska linija', bg:'Хронология', mk:'Временска линија' },
  'tab.flyer': { sq:'Fletepalosje', sr:'Flajer', bg:'Флаер', mk:'Флаер' },
  'tab.listings': { sq:'Shpallje', sr:'Oglasi', bg:'Обяви', mk:'Огласи' },
  'tab.inspection': { sq:'Inspektim', sr:'Inspekcija', bg:'Инспекция', mk:'Инспекција' },

  'field.make': { sq:'Marka', sr:'Marka', bg:'Марка', mk:'Марка' },
  'field.model': { sq:'Modeli', sr:'Model', bg:'Модел', mk:'Модел' },
  'field.year': { sq:'Viti', sr:'Godina', bg:'Година', mk:'Година' },
  'field.vin': { sq:'VIN', sr:'VIN', bg:'VIN', mk:'VIN' },
  'field.plate': { sq:'Targa', sr:'Tablica', bg:'Номер', mk:'Табличка' },
  'field.color': { sq:'Ngjyra', sr:'Boja', bg:'Цвят', mk:'Боја' },
  'field.fuel': { sq:'Karburanti', sr:'Gorivo', bg:'Гориво', mk:'Гориво' },
  'field.gear': { sq:'Transmisioni', sr:'Menjac', bg:'Скоростна кутия', mk:'Менувач' },
  'field.mileage': { sq:'Kilometrazhi', sr:'Kilometraza', bg:'Пробег', mk:'Километража' },
  'field.status': { sq:'Statusi', sr:'Status', bg:'Статус', mk:'Статус' },
  'field.category': { sq:'Kategoria', sr:'Kategorija', bg:'Категория', mk:'Категорија' },
  'field.notes': { sq:'Shenime', sr:'Napomene', bg:'Бележки', mk:'Белешки' },
  'field.date': { sq:'Data', sr:'Datum', bg:'Дата', mk:'Датум' },
  'field.price': { sq:'Cmimi', sr:'Cena', bg:'Цена', mk:'Цена' },
  'field.vatRegime': { sq:'Regjimi TVSH', sr:'PDV rezim', bg:'Режим на ДДС', mk:'ДДВ режим' },
  'field.vatAmount': { sq:'Shuma e TVSH', sr:'Iznos PDV', bg:'Сума ДДС', mk:'Износ на ДДВ' },
  'field.invoiceNumber': { sq:'Nr. fatures', sr:'Br. fakture', bg:'№ фактура', mk:'Бр. фактура' },
  'field.seller': { sq:'Shitesi', sr:'Prodavac', bg:'Продавач', mk:'Продавач' },
  'field.buyer': { sq:'Bleresi', sr:'Kupac', bg:'Купувач', mk:'Купувач' },
  'field.country': { sq:'Shteti', sr:'Drzava', bg:'Държава', mk:'Држава' },
  'field.phone': { sq:'Telefoni', sr:'Telefon', bg:'Телефон', mk:'Телефон' },
  'field.cmr': { sq:'CMR', sr:'CMR', bg:'CMR', mk:'CMR' },
  'field.carrier': { sq:'Transportuesi', sr:'Prevoznik', bg:'Превозвач', mk:'Превозник' },
  'field.driver': { sq:'Shoferi', sr:'Vozac', bg:'Шофьор', mk:'Возач' },
  'field.truckPlate': { sq:'Targa kamioni', sr:'Tablica kamiona', bg:'Номер на камион', mk:'Табличка на камион' },
  'field.departure': { sq:'Nisja', sr:'Polazak', bg:'Тръгване', mk:'Поаѓање' },
  'field.arrival': { sq:'Mberritja', sr:'Dolazak', bg:'Пристигане', mk:'Пристигнување' },
  'field.origin': { sq:'Origjina', sr:'Poreklo', bg:'Произход', mk:'Потекло' },
  'field.destination': { sq:'Destinacioni', sr:'Odrediste', bg:'Дестинация', mk:'Дестинација' },
  'field.cost': { sq:'Kosto', sr:'Trosak', bg:'Разход', mk:'Трошок' },
  'field.location': { sq:'Vendndodhja', sr:'Lokacija', bg:'Локация', mk:'Локација' },
  'field.address': { sq:'Adresa', sr:'Adresa', bg:'Адрес', mk:'Адреса' },
  'field.costPerDay': { sq:'Kosto/Dite', sr:'Trosak/dan', bg:'Разход/ден', mk:'Трошок/ден' },
  'field.workDone': { sq:'Pune te kryera', sr:'Izvrseni radovi', bg:'Извършена работа', mk:'Извршени работи' },
  'field.totalCost': { sq:'Kosto totale', sr:'Ukupan trosak', bg:'Общ разход', mk:'Вкупен трошок' },
  'field.salePrice': { sq:'Cmimi i shitjes', sr:'Prodajna cena', bg:'Продажна цена', mk:'Продажна цена' },
  'field.profit': { sq:'Fitimi', sr:'Profit', bg:'Печалба', mk:'Добивка' },
  'field.margin': { sq:'Marzhi %', sr:'Marza %', bg:'Марж %', mk:'Маржа %' },
  'field.city': {
    el:'Πόλη', en:'City', de:'Stadt', fr:'Ville', it:'Citta', es:'Ciudad',
    sq:'Qyteti', sr:'Grad', bg:'Град', mk:'Град',
  },
  'field.zip': {
    el:'Τ.Κ.', en:'ZIP', de:'PLZ', fr:'Code postal', it:'CAP', es:'Codigo postal',
    sq:'Kodi postar', sr:'Postanski broj', bg:'Пощенски код', mk:'Поштенски код',
  },
  'field.website': {
    el:'Ιστοσελίδα', en:'Website', de:'Website', fr:'Site web', it:'Sito web', es:'Sitio web',
    sq:'Faqja e internetit', sr:'Veb sajt', bg:'Уебсайт', mk:'Веб-страница',
  },
  'field.email': {
    el:'Email', en:'Email', de:'E-Mail', fr:'E-mail', it:'Email', es:'Correo',
    sq:'Email', sr:'Email', bg:'Имейл', mk:'Е-пошта',
  },

  'status.purchased': { sq:'Blerë', sr:'Kupljeno', bg:'Закупено', mk:'Купено' },
  'status.transit_in': { sq:'Ne hyrje', sr:'Ulazni tranzit', bg:'Входящ транзит', mk:'Влезен транзит' },
  'status.stored': { sq:'Ne depo', sr:'Na lageru', bg:'На склад', mk:'На залиха' },
  'status.for_sale': { sq:'Ne shitje', sr:'Na prodaju', bg:'За продажба', mk:'За продажба' },
  'status.sold': { sq:'Shitur', sr:'Prodato', bg:'Продадено', mk:'Продадено' },
  'status.transit_out': { sq:'Ne dalje', sr:'Izlazni tranzit', bg:'Изходящ транзит', mk:'Излезен транзит' },
  'status.delivered': { sq:'Dorezuar', sr:'Isporuceno', bg:'Доставено', mk:'Испорачано' },

  'action.save': { sq:'Ruaj', sr:'Sacuvaj', bg:'Запази', mk:'Зачувај' },
  'action.cancel': { sq:'Anulo', sr:'Otkazi', bg:'Отказ', mk:'Откажи' },
  'action.delete': { sq:'Fshi', sr:'Obrisi', bg:'Изтрий', mk:'Избриши' },
  'action.viewAll': { sq:'Shih te gjitha', sr:'Vidi sve', bg:'Виж всички', mk:'Види ги сите' },
  'action.backToList': { sq:'Kthehu te lista', sr:'Nazad na listu', bg:'Назад към списъка', mk:'Назад кон листата' },
  'action.confirm': { sq:'Konfirmo', sr:'Potvrdi', bg:'Потвърди', mk:'Потврди' },

  'manifest.vehicles': { sq:'Automjete', sr:'Vozila', bg:'Превозни средства', mk:'Возила' },
  'err.notFound': { sq:'Nuk u gjet', sr:'Nije pronadjeno', bg:'Не е намерено', mk:'Не е пронајдено' },
  'misc.noPhoto': { sq:'Pa foto', sr:'Bez fotografije', bg:'Без снимка', mk:'Без фотографија' },
  'misc.clickToUpload': { sq:'Kliko per ngarkim', sr:'Klikni za otpremanje', bg:'Кликни за качване', mk:'Кликни за прикачување' },
  'veh.noResults': { sq:'Nuk u gjeten rezultate', sr:'Nema rezultata', bg:'Няма резултати', mk:'Нема резултати' },
  'veh.new': { sq:'Automjet i ri', sr:'Novo vozilo', bg:'Ново превозно средство', mk:'Ново возило' },
  'veh.search': { sq:'Kerko...', sr:'Pretrazi...', bg:'Търси...', mk:'Пребарај...' },
  'veh.all': { sq:'Te gjitha', sr:'Sve', bg:'Всички', mk:'Сите' },
  'veh.saved': { sq:'U ruajt', sr:'Sacuvano', bg:'Запазено', mk:'Зачувано' },
  'veh.saving': { sq:'Duke ruajtur...', sr:'Cuvanje...', bg:'Запазване...', mk:'Се зачувува...' },

  'dash.fleetHealth': {
    el:'Υγεία Στόλου', en:'Fleet Health', de:'Flotten-Status', fr:'Sante Flotte', it:'Salute Flotta', es:'Salud Flota',
    sq:'Gjendja e flotës', sr:'Stanje voznog parka', bg:'Състояние на автопарка', mk:'Состојба на возниот парк',
  },
  'dash.healthScore': {
    el:'Health Score', en:'Health Score', de:'Health Score', fr:'Score de sante', it:'Health Score', es:'Puntuacion de salud',
    sq:'Rezultati i gjendjes', sr:'Ocena stanja', bg:'Оценка на състоянието', mk:'Оцена на состојба',
  },
  'dash.greeting.morning': {
    el:'Καλημέρα', en:'Good morning', de:'Guten Morgen', fr:'Bonjour', it:'Buongiorno', es:'Buenos días',
    sq:'Mirëmëngjes', sr:'Dobro jutro', bg:'Добро утро', mk:'Добро утро',
  },
  'dash.greeting.afternoon': {
    el:'Καλό απόγευμα', en:'Good afternoon', de:'Guten Tag', fr:'Bon après-midi', it:'Buon pomeriggio', es:'Buenas tardes',
    sq:'Mirëdita', sr:'Dobar dan', bg:'Добър ден', mk:'Добар ден',
  },
  'dash.greeting.evening': {
    el:'Καλησπέρα', en:'Good evening', de:'Guten Abend', fr:'Bonsoir', it:'Buonasera', es:'Buenas noches',
    sq:'Mirëmbrëma', sr:'Dobro veče', bg:'Добър вечер', mk:'Добра вечер',
  },
  'dash.fixIssues': {
    el:'Fix Issues', en:'Fix Issues', de:'Probleme beheben', fr:'Corriger les problemes', it:'Correggi Problemi', es:'Corregir problemas',
    sq:'Rregullo problemet', sr:'Resi probleme', bg:'Поправи проблемите', mk:'Поправи проблеми',
  },
  'dash.morningBrief': {
    el:'Πρωινή Ενημέρωση', en:'Morning Brief', de:'Morning Brief', fr:'Brief du matin', it:'Brief del mattino', es:'Resumen matinal',
    sq:'Permbledhja e mengjesit', sr:'Jutarnji pregled', bg:'Сутрешен обзор', mk:'Утрински преглед',
  },
  'dash.allGoodNoIssues': {
    el:'Όλα καλά! Δεν υπάρχουν προβλήματα.', en:'All good! No issues.', de:'Alles gut! Keine Probleme.', fr:'Tout va bien! Aucun probleme.', it:'Tutto ok! Nessun problema.', es:'Todo bien! Sin problemas.',
    sq:'Gjithcka ne rregull! Nuk ka probleme.', sr:'Sve je u redu! Nema problema.', bg:'Всичко е наред! Няма проблеми.', mk:'Се е во ред! Нема проблеми.',
  },
  'dash.allGoodShort': {
    el:'Όλα εντάξει!', en:'All good!', de:'Alles gut!', fr:'Tout va bien!', it:'Tutto ok!', es:'Todo bien!',
    sq:'Gjithcka ne rregull!', sr:'Sve u redu!', bg:'Всичко е наред!', mk:'Се е во ред!',
  },
  'dash.healthVehiclesOverDays': {
    el:'{count} οχήματα >{days} ημέρες', en:'{count} vehicles >{days} days', de:'{count} Fahrzeuge >{days} Tage', fr:'{count} vehicules >{days} jours', it:'{count} veicoli >{days} giorni', es:'{count} vehiculos >{days} dias',
    sq:'{count} automjete >{days} dite', sr:'{count} vozila >{days} dana', bg:'{count} превозни средства >{days} дни', mk:'{count} возила >{days} дена',
  },
  'dash.lockedCapital': {
    el:'δεσμευμένο', en:'locked', de:'gebunden', fr:'bloque', it:'bloccato', es:'bloqueado',
    sq:'te bllokuara', sr:'vezano', bg:'блокирани', mk:'блокирано',
  },
  'dash.belowTarget': {
    el:'κάτω από στόχο {amount}', en:'below {amount} target', de:'unter Ziel {amount}', fr:'sous objectif {amount}', it:'sotto target {amount}', es:'bajo objetivo {amount}',
    sq:'nen objektivin {amount}', sr:'ispod cilja {amount}', bg:'под целта {amount}', mk:'под целта {amount}',
  },
  'dash.noSalePrice': {
    el:'χωρίς τιμή πώλησης', en:'no sale price', de:'ohne Verkaufspreis', fr:'sans prix de vente', it:'senza prezzo', es:'sin precio de venta',
    sq:'pa çmim shitjeje', sr:'bez prodajne cene', bg:'без продажна цена', mk:'без продажна цена',
  },
  'dash.missingLabel': {
    el:'Λείπουν:', en:'Missing:', de:'Fehlen:', fr:'Manquent:', it:'Mancano:', es:'Faltan:',
    sq:'Mungojne:', sr:'Nedostaju:', bg:'Липсват:', mk:'Недостасуваат:',
  },
  'dash.breakdown.deadStock': {
    el:'Dead Stock', en:'Dead Stock', de:'Dead Stock', fr:'Stock mort', it:'Dead Stock', es:'Stock muerto',
    sq:'Stok i bllokuar', sr:'Mrtvi lager', bg:'Залежал склад', mk:'Мртов залих',
  },
  'dash.breakdown.missingDocs': {
    el:'Ελλιπή έγγραφα', en:'Missing documents', de:'Fehlende Dokumente', fr:'Documents manquants', it:'Documenti mancanti', es:'Documentos faltantes',
    sq:'Dokumente qe mungojne', sr:'Nedostajuca dokumenta', bg:'Липсващи документи', mk:'Недостасуваат документи',
  },
  'dash.breakdown.lowMargin': {
    el:'Χαμηλό κέρδος', en:'Low margin', de:'Niedrige Marge', fr:'Faible marge', it:'Margine basso', es:'Margen bajo',
    sq:'Marzh i ulet', sr:'Niska marza', bg:'Нисък марж', mk:'Ниска маржа',
  },
  'dash.breakdown.noSalePrice': {
    el:'Χωρίς τιμή πώλησης', en:'No sale price', de:'Kein Verkaufspreis', fr:'Sans prix de vente', it:'Senza prezzo', es:'Sin precio de venta',
    sq:'Pa çmim shitjeje', sr:'Bez prodajne cene', bg:'Без продажна цена', mk:'Без продажна цена',
  },
  'dash.marginOverAmount': {
    el:'περιθώριο >{amount}', en:'margin >{amount}', de:'Marge >{amount}', fr:'marge >{amount}', it:'margine >{amount}', es:'margen >{amount}',
    sq:'marzh >{amount}', sr:'marza >{amount}', bg:'марж >{amount}', mk:'маржа >{amount}',
  },
  'dash.pendingDeliveries': {
    el:'παραδόσεις εκκρεμούν', en:'pending deliveries', de:'Lieferungen ausstehend', fr:'livraisons en attente', it:'consegne in sospeso', es:'entregas pendientes',
    sq:'dorëzime në pritje', sr:'isporuke na cekanju', bg:'чакащи доставки', mk:'испораки во тек',
  },
  'dash.missingDocuments': {
    el:'έγγραφα λείπουν', en:'missing documents', de:'Dokumente fehlen', fr:'documents manquants', it:'documenti mancanti', es:'documentos faltantes',
    sq:'mungojne dokumente', sr:'nedostaju dokumenta', bg:'липсващи документи', mk:'недостасуваат документи',
  },
  'dash.fleetValueLastMonths': {
    el:'Αξία Στόλου - Τελευταίοι 6 Μήνες', en:'Fleet Value - Last 6 Months', de:'Flottenwert - Letzte 6 Monate', fr:'Valeur flotte - 6 derniers mois', it:'Valore Flotta - Ultimi 6 Mesi', es:'Valor de flota - Últimos 6 meses',
    sq:'Vlera e flotës - 6 muajt e fundit', sr:'Vrednost voznog parka - poslednjih 6 meseci', bg:'Стойност на автопарка - последните 6 месеца', mk:'Вредност на возниот парк - последни 6 месеци',
  },
  'dash.monthlyProfit': {
    el:'Κέρδος ανά μήνα', en:'Monthly profit', de:'Gewinn pro Monat', fr:'Profit mensuel', it:'Profitto mensile', es:'Ganancia mensual',
    sq:'Fitimi mujor', sr:'Mesecni profit', bg:'Месечна печалба', mk:'Месечна добивка',
  },
  'dash.avgDaysToSellLong': {
    el:'Μ.Ο. Ημέρες Πώλησης', en:'Avg Days to Sell', de:'Ø Verkaufstage', fr:'Jours moyens de vente', it:'Giorni medi vendita', es:'Dias medios de venta',
    sq:'Mesatarja e ditëve për shitje', sr:'Prosecni dani do prodaje', bg:'Средни дни до продажба', mk:'Просечни денови до продажба',
  },
  'dash.vsPrevPeriod': {
    el:'από προηγούμενη περίοδο', en:'vs prev. period', de:'gegen Vorperiode', fr:'vs periode precedente', it:'dal periodo precedente', es:'vs periodo anterior',
    sq:'kundrejt periudhës së kaluar', sr:'u odnosu na prethodni period', bg:'спрямо предходния период', mk:'спроти претходниот период',
  },
  'dash.noSalesYet': {
    el:'Δεν υπάρχουν πωλήσεις ακόμα', en:'No sales yet', de:'Noch keine Verkäufe', fr:'Pas encore de ventes', it:'Nessuna vendita ancora', es:'Aún no hay ventas',
    sq:'Nuk ka ende shitje', sr:'Jos nema prodaja', bg:'Още няма продажби', mk:'Се уште нема продажби',
  },
  'dash.basedOnSales': {
    el:'Βασίζεται σε {count} πωλήσεις', en:'Based on {count} sales', de:'Basiert auf {count} Verkäufen', fr:'Basé sur {count} ventes', it:'Basato su {count} vendite', es:'Basado en {count} ventas',
    sq:'Bazohet në {count} shitje', sr:'Zasnovano na {count} prodaja', bg:'Базирано на {count} продажби', mk:'Засновано на {count} продажби',
  },
  'dash.deadStockTitle': {
    el:'Dead Stock ({count} οχήματα >{days} ημέρες)', en:'Dead Stock ({count} vehicles >{days} days)', de:'Dead Stock ({count} Fahrzeuge >{days} Tage)', fr:'Stock mort ({count} véhicules >{days} jours)', it:'Dead Stock ({count} veicoli >{days} giorni)', es:'Stock muerto ({count} vehículos >{days} días)',
    sq:'Stok i bllokuar ({count} automjete >{days} dite)', sr:'Mrtvi lager ({count} vozila >{days} dana)', bg:'Залежал склад ({count} превозни средства >{days} дни)', mk:'Мртов залих ({count} возила >{days} дена)',
  },
  'dash.none': {
    el:'Κανένα!', en:'None!', de:'Keine!', fr:'Aucun!', it:'Nessuno!', es:'Ninguno!',
    sq:'Asnje!', sr:'Nijedno!', bg:'Няма!', mk:'Ниту едно!',
  },
  'dash.totalHoldingCost': {
    el:'Εκτιμ. κόστος αναμονής συνολικά:', en:'Est. total holding cost:', de:'Gesch. Gesamtkosten:', fr:'Coût total estimé :', it:'Costo stimato totale:', es:'Coste total estimado:',
    sq:'Kosto totale e pritshme e mbajtjes:', sr:'Procenjeni ukupan trošak zadržavanja:', bg:'Очакван общ разход за престой:', mk:'Проценет вкупен трошок за чување:',
  },
  'dash.topProfitOpportunities': {
    el:'Κορυφαίες Ευκαιρίες Κέρδους', en:'Top Profit Opportunities', de:'Top Gewinnchancen', fr:'Top opportunités de profit', it:'Top Opportunità di Profitto', es:'Top oportunidades de beneficio',
    sq:'Mundësitë kryesore për fitim', sr:'Najbolje profitne prilike', bg:'Топ възможности за печалба', mk:'Топ можности за добивка',
  },
  'dash.setSalePrices': {
    el:'Βάλε τιμή πώλησης στα οχήματα', en:'Set sale prices on vehicles', de:'Verkaufspreise setzen', fr:'Définir les prix de vente', it:'Imposta prezzi di vendita', es:'Define precios de venta',
    sq:'Vendos çmimet e shitjes te automjetet', sr:'Postavi prodajne cene vozilima', bg:'Задай продажни цени на превозните средства', mk:'Постави продажни цени на возилата',
  },
  'dash.sellTodayEarn': {
    el:'Πούλα σήμερα, βγάλε:', en:'Sell today, earn:', de:'Heute verkaufen, Gewinn:', fr:'Vends aujourd’hui, gagnes :', it:'Vendi oggi, guadagni:', es:'Vende hoy, ganas:',
    sq:'Shite sot, fito:', sr:'Prodaj danas, zaradi:', bg:'Продай днес, спечели:', mk:'Продади денес, заработи:',
  },
  'dash.noStockIssues': {
    el:'Κανένα πρόβλημα!', en:'No stock issues!', de:'Keine Lagerprobleme!', fr:'Aucun problème de stock !', it:'Nessun problema!', es:'Sin problemas de stock!',
    sq:'Nuk ka probleme me stokun!', sr:'Nema problema sa lagerom!', bg:'Няма проблеми със склада!', mk:'Нема проблеми со залихата!',
  },
  'dash.nextBestSale': {
    el:'Επόμενη Πώληση', en:'Next Best Sale', de:'Nächster Verkauf', fr:'Prochaine vente', it:'Prossima Vendita', es:'Próxima venta',
    sq:'Shitja e radhës', sr:'Sledeća prodaja', bg:'Следваща продажба', mk:'Следна продажба',
  },
  'dash.noVehiclesForSale': {
    el:'Δεν υπάρχουν προς πώληση', en:'No vehicles for sale', de:'Keine Fahrzeuge zum Verkauf', fr:'Aucun véhicule en vente', it:'Nessun veicolo in vendita', es:'No hay vehículos en venta',
    sq:'Nuk ka automjete për shitje', sr:'Nema vozila za prodaju', bg:'Няма превозни средства за продажба', mk:'Нема возила за продажба',
  },
  'dash.scoreSummary': {
    el:'Score {score}/100', en:'Score {score}/100', de:'Score {score}/100', fr:'Score {score}/100', it:'Score {score}/100', es:'Score {score}/100',
    sq:'Rezultati {score}/100', sr:'Ocena {score}/100', bg:'Оценка {score}/100', mk:'Оцена {score}/100',
  },

  'doc.invoice': {
    el:'Τιμολόγιο', en:'Invoice', de:'Rechnung', fr:'Facture', it:'Fattura', es:'Factura',
    sq:'Fature', sr:'Faktura', bg:'Фактура', mk:'Фактура',
  },
  'doc.registration': {
    el:'Άδεια κυκλοφορίας', en:'Registration', de:'Zulassung', fr:'Immatriculation', it:'Immatricolazione', es:'Matriculación',
    sq:'Regjistrimi', sr:'Registracija', bg:'Регистрация', mk:'Регистрација',
  },
  'doc.coc': {
    el:'COC', en:'COC', de:'COC', fr:'COC', it:'COC', es:'COC',
    sq:'COC', sr:'COC', bg:'COC', mk:'COC',
  },
  'doc.cmr': {
    el:'CMR', en:'CMR', de:'CMR', fr:'CMR', it:'CMR', es:'CMR',
    sq:'CMR', sr:'CMR', bg:'CMR', mk:'CMR',
  },

  'settings.saveFailed': {
    el:'Η αποθήκευση απέτυχε. Δοκίμασε ξανά.', en:'Save failed. Please try again.', de:'Speichern fehlgeschlagen. Bitte erneut versuchen.', fr:'Échec de l’enregistrement. Réessayez.', it:'Salvataggio non riuscito. Riprova.', es:'Error al guardar. Inténtalo de nuevo.',
    sq:'Ruajtja dështoi. Provo sërish.', sr:'Čuvanje nije uspelo. Pokušaj ponovo.', bg:'Записът не бе успешен. Опитай отново.', mk:'Зачувувањето не успеа. Обиди се повторно.',
  },
  'settings.title': {
    sq:'Cilësimet', sr:'Podesavanja', bg:'Настройки', mk:'Поставки',
  },
  'settings.companyName': {
    sq:'Emri i kompanisë', sr:'Naziv kompanije', bg:'Име на фирмата', mk:'Име на компанијата',
  },
  'settings.section.company': {
    el:'Εταιρεία', en:'Company', de:'Unternehmen', fr:'Société', it:'Azienda', es:'Empresa',
    sq:'Kompania', sr:'Kompanija', bg:'Фирма', mk:'Компанија',
  },
  'settings.section.branding': {
    el:'Branding', en:'Branding', de:'Branding', fr:'Branding', it:'Branding', es:'Branding',
    sq:'Branding', sr:'Brending', bg:'Брандинг', mk:'Брендинг',
  },
  'settings.section.documents': {
    el:'Έγγραφα', en:'Documents', de:'Dokumente', fr:'Documents', it:'Documenti', es:'Documentos',
    sq:'Dokumente', sr:'Dokumenta', bg:'Документи', mk:'Документи',
  },
  'settings.section.marketplace': {
    el:'Marketplace', en:'Marketplace', de:'Marketplace', fr:'Marketplace', it:'Marketplace', es:'Marketplace',
    sq:'Marketplace', sr:'Marketplace', bg:'Marketplace', mk:'Marketplace',
  },
  'settings.section.financials': {
    el:'Οικονομικά', en:'Financials', de:'Finanzen', fr:'Finances', it:'Parametri Economici', es:'Finanzas',
    sq:'Financa', sr:'Finansije', bg:'Финанси', mk:'Финансии',
  },
  'settings.section.backup': {
    el:'Backup', en:'Backup', de:'Backup', fr:'Sauvegarde', it:'Backup', es:'Backup',
    sq:'Backup', sr:'Bekap', bg:'Резервно копие', mk:'Резервна копија',
  },
  'settings.companyDetails': {
    el:'Στοιχεία Εταιρείας', en:'Company Details', de:'Unternehmensdetails', fr:'Détails société', it:'Dati Aziendali', es:'Detalles de la empresa',
    sq:'Detajet e kompanisë', sr:'Detalji kompanije', bg:'Данни за фирмата', mk:'Детали за компанијата',
  },
  'settings.vatNumber': {
    el:'ΑΦΜ / ΦΠΑ', en:'VAT Number', de:'USt-IdNr.', fr:'N° TVA', it:'Partita IVA', es:'NIF/CIF',
    sq:'Numri i TVSH-së', sr:'PIB', bg:'ДДС номер', mk:'ДДВ број',
  },
  'settings.taxOffice': {
    el:'ΔΟΥ', en:'Tax Office', de:'Finanzamt', fr:'Centre des impôts', it:'Ufficio Fiscale', es:'Agencia Tributaria',
    sq:'Zyra tatimore', sr:'Poreska uprava', bg:'Данъчна служба', mk:'Даночна управа',
  },
  'settings.brandingTitle': {
    el:'Branding', en:'Branding', de:'Branding', fr:'Branding', it:'Branding', es:'Branding',
    sq:'Branding', sr:'Brending', bg:'Брандинг', mk:'Брендинг',
  },
  'settings.companyLogo': {
    el:'Λογότυπο Εταιρείας', en:'Company Logo', de:'Firmenlogo', fr:'Logo société', it:'Logo Azienda', es:'Logo de la empresa',
    sq:'Logo e kompanisë', sr:'Logo kompanije', bg:'Лого на фирмата', mk:'Лого на компанијата',
  },
  'settings.primaryColor': {
    el:'Κύριο χρώμα', en:'Primary Color', de:'Primärfarbe', fr:'Couleur principale', it:'Colore primario', es:'Color principal',
    sq:'Ngjyra kryesore', sr:'Primarna boja', bg:'Основен цвят', mk:'Примарна боја',
  },
  'settings.secondaryColor': {
    el:'Δευτερεύον χρώμα', en:'Secondary Color', de:'Sekundärfarbe', fr:'Couleur secondaire', it:'Colore secondario', es:'Color secundario',
    sq:'Ngjyra dytësore', sr:'Sekundarna boja', bg:'Вторичен цвят', mk:'Секундарна боја',
  },
  'settings.uploadFile': {
    el:'Ανέβασε αρχείο', en:'Upload file', de:'Datei hochladen', fr:'Télécharger fichier', it:'Carica file', es:'Subir archivo',
    sq:'Ngarko skedar', sr:'Otpremi fajl', bg:'Качи файл', mk:'Прикачи датотека',
  },
  'settings.logoHelp': {
    el:'Εμφανίζεται σε PDF, Flyers και Public Vehicle Pages', en:'Shown on PDF, Flyers and Public Vehicle Pages', de:'Erscheint auf PDF, Flyern und öffentlichen Seiten', fr:'Affiché sur PDF, flyers et pages publiques', it:'Appare su PDF, Flyer e pagine pubbliche', es:'Aparece en PDF, flyers y páginas públicas',
    sq:'Shfaqet në PDF, fletëpalosje dhe faqet publike të automjeteve', sr:'Prikazuje se na PDF-u, flajerima i javnim stranicama vozila', bg:'Показва се в PDF, флаери и публични страници на автомобили', mk:'Се прикажува на PDF, флаери и јавни страници на возила',
  },
  'settings.preview': {
    el:'Προεπισκόπηση', en:'Preview', de:'Vorschau', fr:'Aperçu', it:'Anteprima', es:'Vista previa',
    sq:'Parapamje', sr:'Pregled', bg:'Преглед', mk:'Преглед',
  },
  'settings.documentSettings': {
    el:'Στοιχεία Εγγράφων', en:'Document Settings', de:'Dokumenteinstellungen', fr:'Paramètres documents', it:'Dati Documenti', es:'Configuración de documentos',
    sq:'Cilësimet e dokumenteve', sr:'Podešavanja dokumenata', bg:'Настройки на документи', mk:'Поставки за документи',
  },
  'settings.documentSettingsHelp': {
    el:'Εμφανίζονται αυτόματα σε PDF, CMR και Flyers.', en:'Automatically appear on PDF exports and CMR documents.', de:'Erscheinen automatisch auf PDF-Exporten und CMR-Dokumenten.', fr:'Apparaissent automatiquement sur les PDF et documents CMR.', it:'Appaiono automaticamente su PDF, CMR e Flyer.', es:'Aparecen automáticamente en PDF y documentos CMR.',
    sq:'Shfaqen automatikisht në PDF dhe dokumentet CMR.', sr:'Automatski se prikazuju na PDF i CMR dokumentima.', bg:'Появяват се автоматично в PDF и CMR документи.', mk:'Автоматски се појавуваат на PDF и CMR документи.',
  },
  'settings.responsible': {
    el:'Υπεύθυνος', en:'Responsible', de:'Verantwortlicher', fr:'Responsable', it:'Responsabile', es:'Responsable',
    sq:'Përgjegjësi', sr:'Odgovorno lice', bg:'Отговорник', mk:'Одговорно лице',
  },
  'settings.companyStamp': {
    el:'Σφραγίδα Εταιρείας', en:'Company Stamp', de:'Firmenstempel', fr:'Tampon société', it:'Timbro Aziendale', es:'Sello de la empresa',
    sq:'Vula e kompanisë', sr:'Pečat kompanije', bg:'Печат на фирмата', mk:'Печат на компанијата',
  },
  'settings.noStamp': {
    el:'Χωρίς σφραγίδα', en:'No stamp', de:'Kein Stempel', fr:'Pas de tampon', it:'Nessun timbro', es:'Sin sello',
    sq:'Pa vulë', sr:'Bez pečata', bg:'Без печат', mk:'Без печат',
  },
  'settings.marketplaceLinks': {
    el:'Marketplace Links', en:'Marketplace Links', de:'Marketplace-Links', fr:'Liens marketplace', it:'Marketplace Links', es:'Enlaces de marketplace',
    sq:'Lidhje marketplace', sr:'Marketplace linkovi', bg:'Marketplace връзки', mk:'Marketplace врски',
  },
  'settings.autoscoutUrl': {
    el:'Σύνδεσμος AutoScout24', en:'AutoScout24 URL', de:'AutoScout24-URL', fr:'URL AutoScout24', it:'URL AutoScout24', es:'URL AutoScout24',
    sq:'URL AutoScout24', sr:'AutoScout24 URL', bg:'AutoScout24 URL', mk:'AutoScout24 URL',
  },
  'settings.mobiledeUrl': {
    el:'Σύνδεσμος Mobile.de', en:'Mobile.de URL', de:'Mobile.de-URL', fr:'URL Mobile.de', it:'URL Mobile.de', es:'URL Mobile.de',
    sq:'URL Mobile.de', sr:'Mobile.de URL', bg:'Mobile.de URL', mk:'Mobile.de URL',
  },
  'settings.cargrUrl': {
    el:'Σύνδεσμος Car.gr', en:'Car.gr URL', de:'Car.gr-URL', fr:'URL Car.gr', it:'URL Car.gr', es:'URL Car.gr',
    sq:'URL Car.gr', sr:'Car.gr URL', bg:'Car.gr URL', mk:'Car.gr URL',
  },
  'settings.facebookPage': {
    el:'Σελίδα Facebook', en:'Facebook Page', de:'Facebook-Seite', fr:'Page Facebook', it:'Pagina Facebook', es:'Página de Facebook',
    sq:'Faqja në Facebook', sr:'Facebook stranica', bg:'Facebook страница', mk:'Facebook страница',
  },
  'settings.marketplaceHelp': {
    el:'Χρησιμοποιούνται στο tab Listings.', en:'Used in the Listings tab.', de:'Wird im Listings-Tab verwendet.', fr:'Utilisé dans l’onglet Annonces.', it:'Usati nel tab Annunci.', es:'Se usan en la pestaña Anuncios.',
    sq:'Përdoren te skeda Listings.', sr:'Koriste se u kartici Oglasi.', bg:'Използват се в таба Обяви.', mk:'Се користат во јазичето Огласи.',
  },
  'settings.financialDefaults': {
    el:'Οικονομικές Παράμετροι', en:'Financial Defaults', de:'Finanzparameter', fr:'Paramètres financiers', it:'Parametri Economici', es:'Parámetros financieros',
    sq:'Parametrat financiare', sr:'Finansijski parametri', bg:'Финансови параметри', mk:'Финансиски параметри',
  },
  'settings.financialHelp': {
    el:'Χρησιμοποιούνται για υπολογισμούς κόστους και alerts.', en:'Used for cost calculations and stock aging alerts.', de:'Wird für Kostenberechnungen und Lagerwarnungen verwendet.', fr:'Utilisé pour les calculs de coût et alertes de stock.', it:'Usati per calcoli di costo e alert di giacenza.', es:'Usados para cálculos de costes y alertas.',
    sq:'Përdoren për llogaritje kostosh dhe njoftime.', sr:'Koriste se za obračun troškova i upozorenja.', bg:'Използват се за изчисления на разходи и сигнали.', mk:'Се користат за пресметки на трошоци и предупредувања.',
  },
  'settings.storageCostPerDay': {
    el:'Κόστος Αποθήκευσης €/μέρα', en:'Storage Cost €/day', de:'Lagerkosten €/Tag', fr:'Coût de stockage €/jour', it:'Costo Stoccaggio €/giorno', es:'Coste de almacén €/día',
    sq:'Kosto magazinimi €/ditë', sr:'Trošak skladištenja €/dan', bg:'Разход за склад €/ден', mk:'Трошок за складирање €/ден',
  },
  'settings.transportCostPerKm': {
    el:'Κόστος Μεταφοράς €/km', en:'Transport Cost €/km', de:'Transportkosten €/km', fr:'Coût transport €/km', it:'Costo Trasporto €/km', es:'Coste transporte €/km',
    sq:'Kosto transporti €/km', sr:'Trošak transporta €/km', bg:'Транспортен разход €/km', mk:'Трошок за транспорт €/km',
  },
  'settings.targetProfit': {
    el:'Στόχος Κέρδους €', en:'Target Profit €', de:'Zielgewinn €', fr:'Objectif de profit €', it:'Target Profitto €', es:'Objetivo beneficio €',
    sq:'Fitimi i synuar €', sr:'Ciljni profit €', bg:'Целева печалба €', mk:'Целен профит €',
  },
  'settings.example': {
    el:'Παράδειγμα', en:'Example', de:'Beispiel', fr:'Exemple', it:'Esempio', es:'Ejemplo',
    sq:'Shembull', sr:'Primer', bg:'Пример', mk:'Пример',
  },
  'settings.daysInStock': {
    el:'ημέρες στο stock', en:'days in stock', de:'Tage auf Lager', fr:'jours en stock', it:'giorni in stock', es:'días en stock',
    sq:'ditë në stok', sr:'dana na lageru', bg:'дни на склад', mk:'денови на залиха',
  },
  'settings.cost': {
    el:'Κόστος', en:'Cost', de:'Kosten', fr:'Coût', it:'Costo', es:'Coste',
    sq:'Kosto', sr:'Trošak', bg:'Разход', mk:'Трошок',
  },
  'settings.backupExport': {
    el:'Backup & Export', en:'Backup & Export', de:'Backup & Export', fr:'Sauvegarde & export', it:'Backup & Export', es:'Copia y exportación',
    sq:'Backup & eksport', sr:'Bekap i izvoz', bg:'Архив и експорт', mk:'Резервна копија и извоз',
  },
  'settings.vehiclesInDatabase': {
    el:'{count} οχήματα στη βάση', en:'{count} vehicles in database', de:'{count} Fahrzeuge in der Datenbank', fr:'{count} véhicules dans la base', it:'{count} veicoli nel database', es:'{count} vehículos en la base de datos',
    sq:'{count} automjete në bazë', sr:'{count} vozila u bazi', bg:'{count} превозни средства в базата', mk:'{count} возила во базата',
  },
  'settings.exportJson': {
    el:'Εξαγωγή όλων (JSON)', en:'Export all (JSON)', de:'Alles exportieren (JSON)', fr:'Tout exporter (JSON)', it:'Export all (JSON)', es:'Exportar todo (JSON)',
    sq:'Eksporto të gjitha (JSON)', sr:'Izvezi sve (JSON)', bg:'Експортирай всичко (JSON)', mk:'Извези сè (JSON)',
  },
  'settings.exportExcel': {
    el:'Εξαγωγή σε Excel', en:'Export to Excel', de:'Nach Excel exportieren', fr:'Exporter vers Excel', it:'Export to Excel', es:'Exportar a Excel',
    sq:'Eksporto në Excel', sr:'Izvezi u Excel', bg:'Експорт в Excel', mk:'Извези во Excel',
  },

  'vehicles.fixIssues': {
    el:'Fix Issues:', en:'Fix Issues:', de:'Probleme beheben:', fr:'Corriger les problèmes :', it:'Correggi Problemi:', es:'Corregir problemas:',
    sq:'Rregullo problemet:', sr:'Reši probleme:', bg:'Поправи проблемите:', mk:'Поправи проблеми:',
  },
  'vehicles.health.attention': {
    el:'Όλα τα θέματα', en:'All issues', de:'Alle Probleme', fr:'Tous les problèmes', it:'Tutti i problemi', es:'Todos los problemas',
    sq:'Të gjitha problemet', sr:'Svi problemi', bg:'Всички проблеми', mk:'Сите проблеми',
  },
  'vehicles.health.deadStock': {
    el:'Dead Stock >90 ημέρες', en:'Dead Stock >90 days', de:'Dead Stock >90 Tage', fr:'Stock mort >90 jours', it:'Dead Stock >90 giorni', es:'Stock muerto >90 días',
    sq:'Stok i bllokuar >90 ditë', sr:'Mrtvi lager >90 dana', bg:'Залежал склад >90 дни', mk:'Мртов залих >90 дена',
  },
  'vehicles.health.missingDocs': {
    el:'Ελλιπή έγγραφα', en:'Missing documents', de:'Fehlende Dokumente', fr:'Documents manquants', it:'Documenti mancanti', es:'Documentos faltantes',
    sq:'Dokumente që mungojnë', sr:'Nedostajuća dokumenta', bg:'Липсващи документи', mk:'Недостасуваат документи',
  },
  'vehicles.health.lowMargin': {
    el:'Χαμηλό κέρδος', en:'Low margin', de:'Niedrige Marge', fr:'Faible marge', it:'Margine basso', es:'Margen bajo',
    sq:'Marzh i ulët', sr:'Niska marža', bg:'Нисък марж', mk:'Ниска маржа',
  },
  'vehicles.health.noSalePrice': {
    el:'Χωρίς τιμή πώλησης', en:'No sale price', de:'Kein Verkaufspreis', fr:'Sans prix de vente', it:'Senza prezzo', es:'Sin precio de venta',
    sq:'Pa çmim shitjeje', sr:'Bez prodajne cene', bg:'Без продажна цена', mk:'Без продажна цена',
  },
  'vehicles.clearFilter': {
    el:'Καθαρισμός φίλτρου', en:'Clear filter', de:'Filter löschen', fr:'Effacer le filtre', it:'Cancella filtro', es:'Limpiar filtro',
    sq:'Pastro filtrin', sr:'Očisti filter', bg:'Изчисти филтъра', mk:'Исчисти филтер',
  },
  'vehicles.count': {
    el:'{count} οχήματα', en:'{count} vehicles', de:'{count} Fahrzeuge', fr:'{count} véhicules', it:'{count} veicoli', es:'{count} vehículos',
    sq:'{count} automjete', sr:'{count} vozila', bg:'{count} превозни средства', mk:'{count} возила',
  },
  'vehicles.loading': {
    el:'Φόρτωση...', en:'Loading...', de:'Laden...', fr:'Chargement...', it:'Caricamento...', es:'Cargando...',
    sq:'Duke u ngarkuar...', sr:'Učitavanje...', bg:'Зареждане...', mk:'Се вчитува...',
  },
  'vehicles.makeModel': {
    el:'Μάρκα / Μοντέλο', en:'Make / Model', de:'Marke / Modell', fr:'Marque / Modèle', it:'Marca / Modello', es:'Marca / Modelo',
    sq:'Marka / Modeli', sr:'Marka / Model', bg:'Марка / Модел', mk:'Марка / Модел',
  },
  'vehicles.purchasePriceShort': {
    el:'Αγορά €', en:'Purchase €', de:'Einkauf €', fr:'Achat €', it:'Acquisto €', es:'Compra €',
    sq:'Blerja €', sr:'Kupovina €', bg:'Покупка €', mk:'Набавка €',
  },
  'vehicles.profitShort': {
    el:'Κέρδος €', en:'Profit €', de:'Gewinn €', fr:'Profit €', it:'Profitto €', es:'Beneficio €',
    sq:'Fitimi €', sr:'Profit €', bg:'Печалба €', mk:'Добивка €',
  },
  'vehicles.mileageShort': {
    el:'Χλμ', en:'km', de:'km', fr:'km', it:'km', es:'km',
    sq:'km', sr:'km', bg:'км', mk:'км',
  },
  'vehicles.sortedBy': {
    el:'ταξινόμηση', en:'sorted by', de:'sortiert nach', fr:'trié par', it:'ordinato per', es:'ordenado por',
    sq:'renditur sipas', sr:'sortirano po', bg:'сортирано по', mk:'подредено по',
  },
  'vehicles.newVehiclePlaceholder': {
    el:'Νέο Όχημα', en:'New Vehicle', de:'Neues Fahrzeug', fr:'Nouveau véhicule', it:'Nuovo Veicolo', es:'Nuevo Vehículo',
    sq:'Automjet i ri', sr:'Novo vozilo', bg:'Ново превозно средство', mk:'Ново возило',
  },
  'vehicles.confirmDelete': {
    el:'⚠️ Επιβεβαίωση;', en:'⚠️ Confirm?', de:'⚠️ Bestätigen?', fr:'⚠️ Confirmer ?', it:'⚠️ Confermi?', es:'⚠️ ¿Confirmar?',
    sq:'⚠️ Konfirmo?', sr:'⚠️ Potvrdi?', bg:'⚠️ Потвърди?', mk:'⚠️ Потврди?',
  },
  'vehicles.deletePrompt': {
    el:'Διαγραφή {name}; Αυτή η ενέργεια δεν αναιρείται.', en:'Delete {name}? This cannot be undone.', de:'{name} löschen? Dies kann nicht rückgängig gemacht werden.', fr:'Supprimer {name} ? Cette action est irréversible.', it:'Eliminare {name}? Questa azione non può essere annullata.', es:'¿Eliminar {name}? Esta acción no se puede deshacer.',
    sq:'Të fshihet {name}? Ky veprim nuk zhbëhet.', sr:'Obrisati {name}? Ova radnja se ne može opozvati.', bg:'Да се изтрие {name}? Това действие е необратимо.', mk:'Да се избрише {name}? Ова дејство не може да се врати.',
  },
  'vehicles.searchPlaceholderLong': {
    el:'{search} πινακίδα, VIN, μάρκα, αγοραστής, CMR...', en:'{search} plate, VIN, make, buyer, CMR...', de:'{search} Kennzeichen, VIN, Marke, Käufer, CMR...', fr:'{search} plaque, VIN, marque, acheteur, CMR...', it:'{search} targa, VIN, marca, acquirente, CMR...', es:'{search} matrícula, VIN, marca, comprador, CMR...',
    sq:'{search} targë, VIN, markë, blerës, CMR...', sr:'{search} tablica, VIN, marka, kupac, CMR...', bg:'{search} номер, VIN, марка, купувач, CMR...', mk:'{search} табличка, VIN, марка, купувач, CMR...',
  },
  'vehicles.searchNoResults': {
    el:'Δεν υπάρχουν αποτελέσματα για "{query}"', en:'No results for "{query}"', de:'Keine Ergebnisse für "{query}"', fr:'Aucun résultat pour "{query}"', it:'Nessun risultato per "{query}"', es:'Sin resultados para "{query}"',
    sq:'Nuk ka rezultate për "{query}"', sr:'Nema rezultata za "{query}"', bg:'Няма резултати за "{query}"', mk:'Нема резултати за "{query}"',
  },
  'vehicles.searchTypeMore': {
    el:'Πληκτρολόγησε τουλάχιστον 2 χαρακτήρες για αναζήτηση...', en:'Type at least 2 characters to search...', de:'Mindestens 2 Zeichen zum Suchen eingeben...', fr:'Saisissez au moins 2 caractères pour chercher...', it:'Digita almeno 2 caratteri per cercare...', es:'Escribe al menos 2 caracteres para buscar...',
    sq:'Shkruaj të paktën 2 shkronja për të kërkuar...', sr:'Unesi bar 2 znaka za pretragu...', bg:'Въведи поне 2 символа за търсене...', mk:'Внеси најмалку 2 знаци за пребарување...',
  },

  'backup.weeklyTitle': {
    el:'Εβδομαδιαίο Backup', en:'Weekly Backup', de:'Wöchentliches Backup', fr:'Sauvegarde hebdomadaire', it:'Backup settimanale', es:'Copia semanal',
    sq:'Backup javor', sr:'Nedeljni bekap', bg:'Седмичен архив', mk:'Неделна резервна копија',
  },
  'backup.message': {
    el:'{count} οχήματα — το τελευταίο backup έγινε πριν από πάνω από {days} ημέρες. Να αποθηκευτεί τοπικό αντίγραφο;', en:'{count} vehicles — last backup over {days} days ago. Save a local copy?', de:'{count} Fahrzeuge — letztes Backup vor über {days} Tagen. Lokale Kopie speichern?', fr:'{count} véhicules — dernière sauvegarde il y a plus de {days} jours. Enregistrer une copie locale ?', it:'{count} veicoli — ultimo backup oltre {days} giorni fa. Salvare una copia locale?', es:'{count} vehículos — última copia hace más de {days} días. ¿Guardar una copia local?',
    sq:'{count} automjete — backup-i i fundit ishte para më shumë se {days} ditësh. Ta ruajmë një kopje lokale?', sr:'{count} vozila — poslednji bekap je bio pre više od {days} dana. Sačuvati lokalnu kopiju?', bg:'{count} превозни средства — последният архив е отпреди повече от {days} дни. Да се запази локално копие?', mk:'{count} возила — последната резервна копија е постара од {days} дена. Да се зачува локална копија?',
  },
  'backup.json': {
    el:'JSON', en:'JSON', de:'JSON', fr:'JSON', it:'JSON', es:'JSON',
    sq:'JSON', sr:'JSON', bg:'JSON', mk:'JSON',
  },
  'backup.excel': {
    el:'Excel', en:'Excel', de:'Excel', fr:'Excel', it:'Excel', es:'Excel',
    sq:'Excel', sr:'Excel', bg:'Excel', mk:'Excel',
  },

  'shell.unsavedChanges': {
    el:'Υπάρχουν αλλαγές που δεν αποθηκεύτηκαν. Θέλεις να αποθηκεύσεις πριν φύγεις;', en:'There are unsaved changes. Save before leaving?', de:'Es gibt nicht gespeicherte Änderungen. Vor dem Verlassen speichern?', fr:'Il y a des modifications non sauvegardées. Enregistrer avant de quitter ?', it:'Ci sono modifiche non salvate. Vuoi salvare prima di uscire?', es:'Hay cambios sin guardar. ¿Guardar antes de salir?',
    sq:'Ka ndryshime të paruajtura. Të ruhen para se të largohesh?', sr:'Postoje nesačuvane izmene. Sačuvati pre izlaska?', bg:'Има незапазени промени. Да се запазят преди изход?', mk:'Има незачувани промени. Да се зачуваат пред излез?',
  },
}

for (const [key, value] of Object.entries(EXTRA_TRANSLATIONS)) {
  T[key] = { ...(T[key] ?? {}), ...value }
}

const LOCALE_BY_LANG: Record<Lang, string> = {
  el: 'el-GR',
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  es: 'es-ES',
  sq: 'sq-AL',
  sr: 'sr-RS',
  bg: 'bg-BG',
  mk: 'mk-MK',
}

export function localeForLang(lang: Lang): string {
  return LOCALE_BY_LANG[lang] || 'en-GB'
}

export function t(lang: Lang, key: string, vars?: TranslationVars): string {
  const entry = T[key]
  if (!entry) return key
  const template = entry[lang] || entry.en || key
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
}

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'sr', label: 'Srpski', flag: '🇷🇸' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'mk', label: 'Македонски', flag: '🇲🇰' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]
