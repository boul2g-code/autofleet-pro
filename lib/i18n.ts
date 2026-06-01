import type { Lang } from './types'

const T: Record<string, Record<Lang, string>> = {
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

export function t(lang: Lang, key: string): string {
  const entry = T[key]
  if (!entry) return key
  return entry[lang] || entry['en'] || key
}

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]
