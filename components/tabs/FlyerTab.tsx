'use client'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'
import { COLORS } from '@/lib/vehicleData'

export default function FlyerTab({ id }: { id: string }) {
  const { vehicles, settings } = useFleetStore()
  const lang = settings.lang
  const v = vehicles.find(x => x.id === id)
  if (!v) return null

  const colorHex = COLORS.find(c => c.code === v.color)?.hex || '#6b7280'

  const printFlyer = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Flyer - ${v.make} ${v.model}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Arial',sans-serif;background:#f0f4f8;display:flex;justify-content:center;padding:20px}
  .flyer{background:white;width:210mm;min-height:297mm;padding:0;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.15);overflow:hidden}
  .header{background:#0f172a;color:white;padding:24px 28px;display:flex;justify-content:space-between;align-items:center}
  .logo{font-size:20px;font-weight:800;letter-spacing:-0.5px}
  .tagline{font-size:11px;color:#94a3b8;margin-top:2px}
  .badge{background:#3b82f6;color:white;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700}
  .photo-section{width:100%;height:220px;background:#1e293b;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
  .photo-section img{width:100%;height:100%;object-fit:cover}
  .photo-placeholder{font-size:80px;opacity:0.3}
  .color-bar{height:6px;background:${colorHex}}
  .main{padding:28px}
  .title{font-size:32px;font-weight:800;color:#0f172a;margin-bottom:4px}
  .subtitle{font-size:15px;color:#64748b;margin-bottom:20px}
  .price-box{background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:14px 20px;display:inline-block;margin-bottom:24px}
  .price{font-size:36px;font-weight:800;color:#16a34a}
  .price-note{font-size:11px;color:#64748b;margin-top:2px}
  .specs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px}
  .spec{background:#f8fafc;border-radius:8px;padding:12px;text-align:center}
  .spec-icon{font-size:22px;margin-bottom:4px}
  .spec-value{font-size:14px;font-weight:700;color:#0f172a}
  .spec-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em}
  .details{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px}
  .detail{display:flex;gap:8px;padding:8px;background:#f8fafc;border-radius:6px}
  .detail-label{font-size:11px;color:#94a3b8;width:80px;flex-shrink:0}
  .detail-value{font-size:12px;font-weight:600;color:#0f172a}
  .footer{background:#0f172a;color:#94a3b8;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;font-size:11px}
  .footer-contact{color:white;font-size:13px;font-weight:600}
  .qr-placeholder{width:60px;height:60px;background:#1e293b;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#475569;text-align:center}
  @media print{body{background:white;padding:0}.flyer{box-shadow:none;border-radius:0}@page{margin:0;size:A4}}
</style></head><body>
<div class="flyer">
  <div class="header">
    <div>
      <div class="logo">🚗 ${settings.org?.name || 'AutoFleet Pro'}</div>
      <div class="tagline">${settings.org?.address_de || settings.org?.address_gr || 'Used Vehicle Dealer'}</div>
    </div>
    <div class="badge">FOR SALE</div>
  </div>

  <div class="photo-section">
    ${v.photo
      ? `<img src="${v.photo}" alt="${v.make} ${v.model}" />`
      : `<div class="photo-placeholder">🚗</div>`
    }
  </div>
  <div class="color-bar"></div>

  <div class="main">
    <div class="title">${v.make || ''} ${v.model || ''}</div>
    <div class="subtitle">${v.year || ''} ${v.fuelType ? '· ' + v.fuelType : ''} ${v.gearType ? '· ' + v.gearType : ''}</div>

    ${v.sale?.price ? `
    <div class="price-box">
      <div class="price">€${v.sale.price.toLocaleString()}</div>
      <div class="price-note">${v.sale.vatRegime === 'margin' ? 'Margin scheme / incl. taxes' : 'Price incl. VAT'}</div>
    </div>` : ''}

    <div class="specs">
      ${v.mileage ? `<div class="spec"><div class="spec-icon">📍</div><div class="spec-value">${v.mileage.toLocaleString()} km</div><div class="spec-label">Mileage</div></div>` : ''}
      ${v.year ? `<div class="spec"><div class="spec-icon">📅</div><div class="spec-value">${v.year}</div><div class="spec-label">Year</div></div>` : ''}
      ${v.powerKW ? `<div class="spec"><div class="spec-icon">⚡</div><div class="spec-value">${v.powerKW} kW / ${Math.round(v.powerKW * 1.36)} HP</div><div class="spec-label">Power</div></div>` : ''}
      ${v.engineCC ? `<div class="spec"><div class="spec-icon">🔧</div><div class="spec-value">${v.engineCC} cc</div><div class="spec-label">Engine</div></div>` : ''}
      ${v.fuelType ? `<div class="spec"><div class="spec-icon">⛽</div><div class="spec-value">${v.fuelType}</div><div class="spec-label">Fuel</div></div>` : ''}
      ${v.gearType ? `<div class="spec"><div class="spec-icon">⚙️</div><div class="spec-value">${v.gearType}</div><div class="spec-label">Gearbox</div></div>` : ''}
    </div>

    <div class="details">
      ${v.color ? `<div class="detail"><span class="detail-label">Color</span><span class="detail-value" style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:50%;background:${colorHex};display:inline-block;border:1px solid #ddd"></span>${v.color}</span></div>` : ''}
      ${v.plate ? `<div class="detail"><span class="detail-label">Plate</span><span class="detail-value">${v.plate}</span></div>` : ''}
      ${v.vin ? `<div class="detail"><span class="detail-label">VIN</span><span class="detail-value" style="font-size:10px">${v.vin}</span></div>` : ''}
      ${v.seats ? `<div class="detail"><span class="detail-label">Seats</span><span class="detail-value">${v.seats}</span></div>` : ''}
      ${v.doors ? `<div class="detail"><span class="detail-label">Doors</span><span class="detail-value">${v.doors}</span></div>` : ''}
      ${v.weightKg ? `<div class="detail"><span class="detail-label">Weight</span><span class="detail-value">${v.weightKg} kg</span></div>` : ''}
    </div>

    ${v.notes ? `<div style="background:#fef9ec;border:1px solid #fbbf24;border-radius:8px;padding:12px;font-size:12px;color:#78350f;margin-bottom:16px">📝 ${v.notes}</div>` : ''}
  </div>

  <div class="footer">
    <div>
      <div class="footer-contact">${settings.org?.email || 'autofleetpro1@gmail.com'} · ${settings.org?.phone || ''}</div>
      <div style="margin-top:4px">${settings.org?.address_de ? '🇩🇪 ' + settings.org.address_de + ' · ' : ''}${settings.org?.address_gr ? '🇬🇷 ' + settings.org.address_gr : ''}</div>
    </div>
    <div style="text-align:center">
      <div class="qr-placeholder">QR<br>Code</div>
      <div style="font-size:9px;margin-top:2px">Scan for details</div>
    </div>
  </div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (!win) {
      const a = document.createElement('a')
      a.href = url
      a.download = `Flyer_${v.make}_${v.model}_${v.plate || id}.html`
      a.click()
    }
    setTimeout(() => URL.revokeObjectURL(url), 15000)
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, marginTop: 0 }}>
        🖨️ Vehicle Flyer / Advertisement
      </h3>

      <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ background: '#0f172a', borderRadius: '8px 8px 0 0', padding: '12px 16px', color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🚗 {settings.org?.name || 'AutoFleet Pro'}</div>
            </div>
            {v.photo
              ? <img src={v.photo} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
              : <div style={{ background: '#1e293b', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🚗</div>
            }
            <div style={{ height: 4, background: colorHex }} />
            <div style={{ background: 'white', padding: 12, color: '#0f172a', borderRadius: '0 0 8px 8px' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{v.make} {v.model}</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>{v.year} · {v.mileage?.toLocaleString()} km</div>
              {v.sale?.price && <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 18, marginTop: 4 }}>€{v.sale.price.toLocaleString()}</div>}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
              Il flyer include: foto, specifiche tecniche, prezzo, colore, VIN, contatti azienda. Pronto per la stampa in A4.
            </p>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>
              <div>✅ Foto del veicolo (se caricata)</div>
              <div>✅ Specifiche complete</div>
              <div>✅ Prezzo prominente</div>
              <div>✅ Contatti azienda</div>
              <div>✅ Pronto per la stampa A4</div>
            </div>
            {!v.photo && (
              <p style={{ color: 'var(--warning)', fontSize: 12 }}>
                💡 {t(lang, 'misc.noPhoto')} — aggiungi una foto nel tab Info per il flyer completo
              </p>
            )}
            {!v.sale?.price && (
              <p style={{ color: 'var(--warning)', fontSize: 12 }}>
                💡 Aggiungi il prezzo nel tab Vendita
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={printFlyer} style={{ fontSize: 14 }}>
          🖨️ Print / Download Flyer A4
        </button>
        <a href={`/v/${id}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 14 }}>
          🔗 Public Link
        </a>
      </div>
    </div>
  )
}
