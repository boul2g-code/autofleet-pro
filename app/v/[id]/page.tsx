/* eslint-disable react/no-unescaped-entities */
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function PublicVehiclePage({ params }: { params: { id: string } }) {
  const sb = await createClient()
  const { data: v } = await sb.from('vehicles').select('*').eq('id', params.id).single()
  if (!v) notFound()

  const colorMap: Record<string, string> = {
    white: '#fff', black: '#111', silver: '#ccc', grey: '#888',
    blue: '#1e40af', red: '#dc2626', green: '#16a34a', brown: '#78350f',
    beige: '#d4b483', orange: '#ea580c', yellow: '#ca8a04', gold: '#b45309',
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{v.make} {v.model} {v.year} — AutoFleet Pro</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; }
          .header { background: #0f172a; color: white; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
          .container { max-width: 700px; margin: 24px auto; padding: 0 16px; }
          .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 16px; }
          .photo { width: 100%; height: 300px; object-fit: cover; }
          .photo-placeholder { width: 100%; height: 200px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 48px; }
          .info { padding: 20px; }
          .title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
          .subtitle { color: #64748b; font-size: 14px; margin-bottom: 16px; }
          .price { font-size: 28px; font-weight: 700; color: #16a34a; margin-bottom: 16px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .field { }
          .field-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
          .field-value { font-size: 15px; font-weight: 500; }
          .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; background: #dcfce7; color: #166534; }
          .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }
          .color-dot { width: 16px; height: 16px; border-radius: 50%; border: 1px solid #ddd; display: inline-block; margin-right: 6px; vertical-align: middle; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <span style={{ fontSize: 24 }}>🚗</span>
          <span style={{ fontWeight: 700 }}>AutoFleet Pro</span>
        </div>

        <div className="container">
          <div className="card">
            {v.photo
              ? <img src={v.photo} alt={`${v.make} ${v.model}`} className="photo" />
              : <div className="photo-placeholder">🚗</div>
            }
            <div className="info">
              <div className="title">{v.make} {v.model}</div>
              <div className="subtitle">{v.year} · {v.mileage?.toLocaleString()} km · {v.fuel_type}</div>
              {v.sale?.price && (
                <div className="price">€{v.sale.price.toLocaleString()}</div>
              )}
              <div className="grid">
                {v.year && <div className="field"><div className="field-label">Year</div><div className="field-value">{v.year}</div></div>}
                {v.mileage && <div className="field"><div className="field-label">Mileage</div><div className="field-value">{v.mileage.toLocaleString()} km</div></div>}
                {v.fuel_type && <div className="field"><div className="field-label">Fuel</div><div className="field-value">{v.fuel_type}</div></div>}
                {v.gear_type && <div className="field"><div className="field-label">Gearbox</div><div className="field-value">{v.gear_type}</div></div>}
                {v.engine_cc && <div className="field"><div className="field-label">Engine</div><div className="field-value">{v.engine_cc} cc</div></div>}
                {v.power_kw && <div className="field"><div className="field-label">Power</div><div className="field-value">{v.power_kw} kW ({Math.round(v.power_kw * 1.36)} HP)</div></div>}
                {v.color && (
                  <div className="field">
                    <div className="field-label">Color</div>
                    <div className="field-value">
                      <span className="color-dot" style={{ background: colorMap[v.color] || '#888' }}></span>
                      {v.color.charAt(0).toUpperCase() + v.color.slice(1)}
                    </div>
                  </div>
                )}
                {v.vin && <div className="field"><div className="field-label">VIN</div><div className="field-value" style={{ fontSize: 12 }}>{v.vin}</div></div>}
                {v.plate && <div className="field"><div className="field-label">Plate</div><div className="field-value">{v.plate}</div></div>}
              </div>
            </div>
          </div>

          <div className="footer">
            Powered by AutoFleet Pro · autofleet-pro.vercel.app
          </div>
        </div>
      </body>
    </html>
  )
}
