'use client'
import { useFleetStore } from '@/store/useFleetStore'

interface Props { id: string }

function daysSince(date?: string) {
  if (!date) return 0
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
}

function L(lang: string, el: string, it: string, de: string, fr: string, es: string, en: string) {
  return ({ el, it, de, fr, es }[lang]) || en
}

export default function TimelineTab({ id }: Props) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings?.lang ?? 'el'
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  // Build timeline events from vehicle data
  const events: { date: string; label: string; detail?: string; color: string }[] = []

  const add = (date: string | undefined | null, label: string, detail?: string, color = '#6B7280') => {
    if (date) events.push({ date, label, detail, color })
  }

  // Purchase
  add(v.purchase?.date,
    L(lang,'Αγορά','Acquisto','Kauf','Achat','Compra','Purchased'),
    v.purchase?.price ? `€${v.purchase.price.toLocaleString()}` : undefined,
    '#2563EB'
  )
  // Transport In
  add(v.transportIn?.pickupDate,
    L(lang,'Παραλαβή (αναχώρηση)','Ritiro (partenza)','Abholung (Abfahrt)','Enlèvement (départ)','Recogida (salida)','Pickup (departure)'),
    v.transportIn?.from || undefined,
    '#7C3AED'
  )
  add(v.transportIn?.deliveryDate,
    L(lang,'Άφιξη στην αποθήκη','Arrivo in magazzino','Ankunft im Lager','Arrivée en entrepôt','Llegada al almacén','Arrived at storage'),
    v.transportIn?.to || undefined,
    '#059669'
  )
  // Storage
  add(v.storage?.startDate,
    L(lang,'Εισαγωγή σε αποθήκη','Ingresso in magazzino','Einlagerung','Entrée en entrepôt','Entrada en almacén','Entered storage'),
    undefined, '#F59E0B'
  )
  // Listed / for sale
  if (v.status === 'for_sale' || v.sale?.listedDate) {
    add(v.sale?.listedDate || v.storage?.endDate,
      L(lang,'Δημοσιεύτηκε προς πώληση','Messo in vendita','Zum Verkauf eingestellt','Mis en vente','Publicado en venta','Listed for sale'),
      v.sale?.price ? `€${v.sale.price.toLocaleString()}` : undefined,
      '#8B5CF6'
    )
  }
  // Price change (if sale date different from listed)
  if (v.sale?.priceChangedDate) {
    add(v.sale.priceChangedDate,
      L(lang,'Αλλαγή τιμής','Cambio prezzo','Preisänderung','Changement de prix','Cambio de precio','Price changed'),
      v.sale?.price ? `→ €${v.sale.price.toLocaleString()}` : undefined,
      '#F59E0B'
    )
  }
  // Transport Out
  add(v.transportOut?.pickupDate,
    L(lang,'Παράδοση (αναχώρηση)','Consegna (partenza)','Lieferung (Abfahrt)','Livraison (départ)','Entrega (salida)','Delivery (departure)'),
    v.transportOut?.to || undefined,
    '#7C3AED'
  )
  // Sale
  add(v.sale?.date,
    L(lang,'Πωλήθηκε','Venduto','Verkauft','Vendu','Vendido','Sold'),
    v.sale?.price ? `€${v.sale.price.toLocaleString()}` : undefined,
    '#16A34A'
  )
  // Delivered
  add(v.transportOut?.deliveryDate,
    L(lang,'Παραδόθηκε','Consegnato','Geliefert','Livré','Entregado','Delivered'),
    undefined, '#059669'
  )

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const totalDays = v.purchase?.date
    ? (v.sale?.date
        ? Math.floor((new Date(v.sale.date).getTime() - new Date(v.purchase.date).getTime()) / 86400000)
        : daysSince(v.purchase.date))
    : 0

  const fmtDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(
        lang === 'el' ? 'el-GR' : lang === 'it' ? 'it-IT' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'en-GB',
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      )
    } catch { return d }
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '10px 16px', flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {L(lang,'Συνολικές Ημέρες','Giorni Totali','Gesamttage','Jours Totaux','Días Totales','Total Days')}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: totalDays > 90 ? 'var(--danger)' : totalDays > 45 ? 'var(--warning)' : 'var(--text)' }}>
            {totalDays}d
          </div>
        </div>
        {v.purchase?.price && v.sale?.price && (
          <div className="card" style={{ padding: '10px 16px', flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {L(lang,'Κέρδος','Margine','Gewinn','Profit','Ganancia','Profit')}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: v.sale.price - v.purchase.price >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {v.sale.price - v.purchase.price >= 0 ? '+' : ''}€{(v.sale.price - v.purchase.price).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div style={{ color: 'var(--text2)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
          {L(lang,'Δεν υπάρχουν ακόμα ημερομηνίες. Συμπλήρωσε τα tabs Αγορά, Μεταφορά, Πώληση.','Nessuna data ancora. Compila i tab Acquisto, Trasporto, Vendita.','Noch keine Daten. Fülle die Tabs Kauf, Transport, Verkauf aus.','Aucune date encore. Remplissez les onglets Achat, Transport, Vente.','No hay fechas aún. Rellena las pestañas Compra, Transporte, Venta.','No dates yet. Fill in the Purchase, Transport, Sale tabs.')}
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: 'var(--border)' }} />
          {events.map((ev, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: -23, top: 3,
                width: 12, height: 12, borderRadius: '50%',
                background: ev.color, border: '2px solid white',
                boxShadow: '0 0 0 1px ' + ev.color,
              }} />
              {/* Content */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
                  {fmtDate(ev.date)}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{ev.label}</div>
                {ev.detail && (
                  <div style={{ fontSize: 13, color: ev.color, fontWeight: 500 }}>{ev.detail}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
