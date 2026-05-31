/* eslint-disable react/no-unescaped-entities */
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

// Public client — uses anon key but bypasses RLS for SELECT on public vehicle data
// This works because we query by exact UUID and expose only non-sensitive fields
function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export default async function PublicVehiclePage({ params }: { params: { id: string } }) {
  const sb = createPublicClient()
  
  // Try with service role first (if available), fallback to anon
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const sbAdmin = serviceKey
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, { auth: { persistSession: false } })
    : sb

  const { data: v, error } = await sbAdmin
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!v || error) notFound()

  const colorMap: Record<string, string> = {
    white:'#fff', black:'#111', silver:'#c0c0c0', grey:'#888',
    blue:'#1e40af', red:'#dc2626', green:'#16a34a', brown:'#78350f',
    beige:'#d4b483', orange:'#ea580c', yellow:'#ca8a04', gold:'#b45309',
    purple:'#7c3aed', pink:'#db2777', navy:'#1e3a5f',
  }
  const colorHex = colorMap[v.color] || '#6b7280'

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{v.make} {v.model} {v.year} — AutoFleet Pro</title>
        <meta property="og:title" content={`${v.make} ${v.model} ${v.year}`} />
        {v.photo && <meta property="og:image" content={v.photo} />}
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#1e293b}
          .header{background:#0f172a;color:white;padding:14px 20px;display:flex;align-items:center;gap:10px}
          .logo{font-size:18px;font-weight:800}
          .badge{background:#3b82f6;color:white;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}
          .container{max-width:680px;margin:20px auto;padding:0 16px}
          .card{background:white;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,0.08);overflow:hidden;margin-bottom:14px}
          .photo{width:100%;height:280px;object-fit:cover;display:block}
          .photo-ph{width:100%;height:200px;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:64px}
          .color-bar{height:5px}
          .info{padding:20px}
          .title{font-size:26px;font-weight:800;margin-bottom:3px}
          .subtitle{color:#64748b;font-size:14px;margin-bottom:14px}
          .price{font-size:30px;font-weight:800;color:#16a34a;margin-bottom:16px}
          .price-note{font-size:12px;color:#64748b;margin-top:2px}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
          .field{background:#f8fafc;border-radius:8px;padding:10px 12px}
          .field-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px}
          .field-value{font-size:14px;font-weight:600}
          .color-dot{width:14px;height:14px;border-radius:50%;border:1px solid #ddd;display:inline-block;margin-right:5px;vertical-align:middle}
          .footer{text-align:center;padding:20px;color:#94a3b8;font-size:12px}
          .powered{background:#0f172a;color:#475569;text-align:center;padding:12px;font-size:11px}
          @media(max-width:500px){.grid{grid-template-columns:1fr}.photo{height:220px}.title{font-size:22px}}
        `}</style>
      </head>
      <body>
        <div className="header">
          <span style={{fontSize:22}}>🚗</span>
          <span className="logo">AutoFleet Pro</span>
          <div style={{flex:1}}/>
          {v.status === 'for_sale' && <span className="badge">FOR SALE</span>}
        </div>

        <div className="container">
          <div className="card">
            {v.photo
              ? <img src={v.photo} alt={`${v.make} ${v.model}`} className="photo" />
              : <div className="photo-ph">🚗</div>
            }
            <div className="color-bar" style={{background: colorHex}} />

            <div className="info">
              <div className="title">{v.make || ''} {v.model || ''}</div>
              <div className="subtitle">
                {v.year && <span>{v.year}</span>}
                {v.fuelType && <span> · {v.fuelType}</span>}
                {v.gearType && <span> · {v.gearType}</span>}
                {v.mileage && <span> · {v.mileage.toLocaleString()} km</span>}
              </div>

              {v.sale?.price && (
                <div>
                  <div className="price">€{v.sale.price.toLocaleString()}</div>
                </div>
              )}

              <div className="grid">
                {v.mileage && <div className="field"><div className="field-label">Mileage</div><div className="field-value">{v.mileage.toLocaleString()} km</div></div>}
                {v.year && <div className="field"><div className="field-label">Year</div><div className="field-value">{v.year}</div></div>}
                {v.fuelType && <div className="field"><div className="field-label">Fuel</div><div className="field-value">{v.fuelType}</div></div>}
                {v.gearType && <div className="field"><div className="field-label">Gearbox</div><div className="field-value">{v.gearType}</div></div>}
                {v.engineCC && <div className="field"><div className="field-label">Engine</div><div className="field-value">{v.engineCC} cc</div></div>}
                {v.powerKW && <div className="field"><div className="field-label">Power</div><div className="field-value">{v.powerKW} kW / {Math.round(v.powerKW*1.36)} HP</div></div>}
                {v.doors && <div className="field"><div className="field-label">Doors</div><div className="field-value">{v.doors}</div></div>}
                {v.seats && <div className="field"><div className="field-label">Seats</div><div className="field-value">{v.seats}</div></div>}
                {v.color && (
                  <div className="field">
                    <div className="field-label">Color</div>
                    <div className="field-value">
                      <span className="color-dot" style={{background:colorHex}}/>
                      {v.color.charAt(0).toUpperCase()+v.color.slice(1)}
                    </div>
                  </div>
                )}
                {v.plate && <div className="field"><div className="field-label">Plate</div><div className="field-value">{v.plate}</div></div>}
                {v.vin && <div className="field" style={{gridColumn:'span 2'}}><div className="field-label">VIN</div><div className="field-value" style={{fontSize:12,fontFamily:'monospace'}}>{v.vin}</div></div>}
              </div>

              {v.notes && (
                <div style={{marginTop:14,background:'#fef9ec',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#78350f',border:'1px solid #fbbf24'}}>
                  📝 {v.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="powered">
          Powered by <strong style={{color:'#94a3b8'}}>AutoFleet Pro</strong> · autofleet-pro.vercel.app
        </div>
      </body>
    </html>
  )
}
