'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  { id: 'trial_14', label: 'Trial 14 giorni — GRATIS', price: '€0', color: '#4a90e2' },
  { id: 'trial_30', label: 'Trial 30 giorni — GRATIS', price: '€0', color: '#4a90e2' },
  { id: 'monthly',  label: '1 Mese — €49/mese',        price: '€49',  color: '#f0a500' },
  { id: 'annual',   label: '1 Anno — €490/anno',        price: '€490', color: '#2ed573' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', plan: 'trial_14', message: '', vehicles: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.name) return
    setLoading(true)
    try {
      // Send via mailto as fallback — works without backend
      const subject = encodeURIComponent(`AutoFleet Pro — ${PLANS.find(p=>p.id===form.plan)?.label}`)
      const body = encodeURIComponent(
        `Nome: ${form.name}\nAzienda: ${form.company}\nEmail: ${form.email}\nTelefono: ${form.phone}\n` +
        `Piano richiesto: ${PLANS.find(p=>p.id===form.plan)?.label}\n` +
        `Veicoli gestiti: ${form.vehicles}\n\nMessaggio: ${form.message}`
      )
      window.location.href = `mailto:info@autofleetpro.app?subject=${subject}&body=${body}`
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, padding: '12px 16px', color: '#e2e2f0', fontSize: 14, outline: 'none',
    fontFamily: 'IBM Plex Sans, sans-serif', boxSizing: 'border-box' as const,
  }

  if (sent) return (
    <div style={{ minHeight:'100vh', background:'#0f0f18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'IBM Plex Sans, sans-serif' }}>
      <div style={{ textAlign:'center', maxWidth:500, padding:40 }}>
        <div style={{ fontSize:64, marginBottom:20 }}>✅</div>
        <h2 style={{ color:'#f0a500', fontSize:28, marginBottom:12 }}>Richiesta inviata!</h2>
        <p style={{ color:'#aaa', lineHeight:1.8, marginBottom:24 }}>
          Ti risponderemo entro <strong style={{color:'#e2e2f0'}}>24 ore</strong> all&apos;email <strong style={{color:'#e2e2f0'}}>{form.email}</strong>
          <br/>con le istruzioni per accedere ad AutoFleet Pro.
        </p>
        <Link href="/pricing" style={{ background:'#f0a500', color:'#000', padding:'12px 28px', borderRadius:10, textDecoration:'none', fontWeight:700 }}>
          ← Torna ai piani
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f18', fontFamily:'IBM Plex Sans, sans-serif', padding:'40px 20px' }}>
      <div style={{ maxWidth:580, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <Link href="/" style={{ color:'#f0a500', fontSize:22, fontWeight:700, textDecoration:'none' }}>🚗 AutoFleet Pro</Link>
          <h1 style={{ color:'#e2e2f0', fontSize:28, fontWeight:700, margin:'12px 0 8px', letterSpacing:-0.5 }}>
            Inizia a usarlo oggi
          </h1>
          <p style={{ color:'#6a6a8a', fontSize:15 }}>
            Compila il form — ti rispondiamo entro 24 ore con l&apos;accesso
          </p>
        </div>

        <div style={{ background:'#17171f', border:'1px solid #2a2a3e', borderRadius:16, padding:'32px 28px' }}>

          {/* Plan selector */}
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', color:'#f0a500', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>
              Piano richiesto
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => setForm(f => ({...f, plan: p.id}))}
                  style={{ padding:'12px 10px', borderRadius:10, cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                    background: form.plan === p.id ? `${p.color}18` : '#0f0f18',
                    border: `1px solid ${form.plan === p.id ? p.color : '#2a2a3e'}`,
                    transition:'all 0.15s',
                  }}>
                  <div style={{ fontSize:12, color: form.plan === p.id ? p.color : '#888', fontWeight:700 }}>{p.price}</div>
                  <div style={{ fontSize:11, color:'#ccc', marginTop:2, lineHeight:1.4 }}>{p.label.split('—')[0].trim()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Nome e Cognome *</label>
                <input style={inp} placeholder="Mario Rossi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div>
                <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Azienda</label>
                <input style={inp} placeholder="Auto Rossi Srl" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Email *</label>
                <input style={inp} type="email" placeholder="mario@autorossi.it" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
              </div>
              <div>
                <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Telefono</label>
                <input style={inp} placeholder="+39 333 1234567" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
              </div>
            </div>

            <div>
              <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>
                Quanti veicoli gestisci in media?
              </label>
              <select style={{...inp, cursor:'pointer'}} value={form.vehicles} onChange={e=>setForm(f=>({...f,vehicles:e.target.value}))}>
                <option value="">Seleziona...</option>
                <option value="1-10">1-10 veicoli</option>
                <option value="10-30">10-30 veicoli</option>
                <option value="30-100">30-100 veicoli</option>
                <option value="100+">Più di 100</option>
              </select>
            </div>

            <div>
              <label style={{ display:'block', color:'#888', fontSize:11, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>
                Note / Domande (opzionale)
              </label>
              <textarea style={{...inp, resize:'vertical', minHeight:80}} placeholder="Es: vengo da Excel e ho già dati da importare..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!form.email || !form.name || loading}
              style={{ width:'100%', padding:'15px', background: (!form.email||!form.name) ? '#333' : '#f0a500',
                color: (!form.email||!form.name) ? '#666' : '#000', border:'none', borderRadius:12,
                fontSize:15, fontWeight:700, cursor: (!form.email||!form.name)?'not-allowed':'pointer',
                fontFamily:'inherit', transition:'all 0.15s', marginTop:4,
              }}>
              {loading ? '⏳ Invio...' : '🚀 Invia richiesta'}
            </button>

            <p style={{ textAlign:'center', color:'#555', fontSize:12, margin:0, lineHeight:1.6 }}>
              Nessuna carta di credito richiesta per il trial.<br/>
              Risposta garantita entro 24 ore lavorative.
            </p>
          </div>
        </div>

        {/* PayPal direct pay */}
        <div style={{ background:'#17171f', border:'1px solid #2a2a3e', borderRadius:16, padding:'20px 24px', marginTop:16 }}>
          <div style={{ fontSize:13, color:'#888', marginBottom:12, fontWeight:600 }}>💳 Pagamento diretto con PayPal</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { label:'1 Mese', price:'€49', url:'https://paypal.me/AutoFleetPro/49' },
              { label:'1 Anno', price:'€490', url:'https://paypal.me/AutoFleetPro/490' },
            ].map(p => (
              <a key={p.label} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px',
                  background:'#003087', borderRadius:10, textDecoration:'none', transition:'opacity 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.opacity='0.85')}
                onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>
                <span style={{ color:'#fff', fontSize:13, fontWeight:600 }}>{p.label}</span>
                <span style={{ color:'#f0c040', fontSize:14, fontWeight:700, fontFamily:'monospace' }}>{p.price}</span>
              </a>
            ))}
          </div>
          <p style={{ color:'#555', fontSize:11, margin:'10px 0 0', textAlign:'center' }}>
            Dopo il pagamento PayPal, invia la conferma a info@autofleetpro.app
          </p>
        </div>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <Link href="/pricing" style={{ color:'#555', fontSize:12, textDecoration:'none' }}>← Torna ai prezzi</Link>
        </div>
      </div>
    </div>
  )
}
