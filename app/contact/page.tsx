/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [plan, setPlan] = useState('Trial 14 giorni (Gratuito)')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicles, setVehicles] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email) return
    setLoading(true)
    try {
      // Try API first
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, email, phone, vehicles, plan }),
      })
    } catch {}
    // Always also open mailto as backup
    const subject = encodeURIComponent(`AutoFleet Pro — ${plan} — ${company || name}`)
    const body = encodeURIComponent(`Nome: ${name}\nAzienda: ${company}\nEmail: ${email}\nTelefono: ${phone}\nVeicoli/mese: ${vehicles}\nPiano: ${plan}`)
    window.location.href = `mailto:autofleetpro1@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ background:'#0f172a', color:'#f1f5f9', minHeight:'100vh', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', padding:'16px 24px', borderBottom:'1px solid #1e293b' }}>
        <Link href="/landing" style={{ color:'#f1f5f9', textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <span>🚗</span><span style={{ fontWeight:700 }}>AutoFleet Pro</span>
        </Link>
        <div style={{ flex:1 }} />
        <Link href="/pricing" style={{ color:'#94a3b8', textDecoration:'none', fontSize:14, marginRight:16 }}>Pricing</Link>
        <Link href="/login" style={{ background:'#3b82f6', color:'white', padding:'8px 16px', borderRadius:8, textDecoration:'none', fontSize:14 }}>Login</Link>
      </nav>

      <div style={{ maxWidth:520, margin:'60px auto', padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ fontSize:32, fontWeight:800, marginBottom:8 }}>Inizia subito</h1>
          <p style={{ color:'#94a3b8' }}>Compila il form — attiviamo il tuo accesso entro 24 ore</p>
        </div>

        {sent ? (
          <div style={{ background:'#1e293b', borderRadius:16, padding:32, textAlign:'center', border:'1px solid #22c55e' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <h2 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Richiesta inviata!</h2>
            <p style={{ color:'#94a3b8', marginBottom:8 }}>Ti attiviamo l'accesso entro 24 ore.</p>
            <p style={{ color:'#64748b', fontSize:13, marginBottom:20 }}>
              Se il tuo client email non si è aperto, scrivi direttamente a:<br/>
              <a href="mailto:autofleetpro1@gmail.com" style={{ color:'#60a5fa' }}>autofleetpro1@gmail.com</a>
            </p>
            <Link href="/login" style={{ background:'#3b82f6', color:'white', padding:'12px 24px', borderRadius:8, textDecoration:'none', fontWeight:600 }}>
              Vai al Login
            </Link>
          </div>
        ) : (
          <div style={{ background:'#1e293b', borderRadius:16, padding:28, border:'1px solid #334155' }}>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:'#94a3b8', display:'block', marginBottom:4 }}>Piano *</label>
              <select value={plan} onChange={e => setPlan(e.target.value)}
                style={{ width:'100%', background:'#334155', border:'1px solid #475569', color:'#f1f5f9', borderRadius:8, padding:'10px 12px', fontSize:14 }}>
                <option>Trial 14 giorni (Gratuito)</option>
                <option>Starter — €49/mese</option>
                <option>Professional — €99/mese</option>
                <option>Annual — €490/anno</option>
              </select>
            </div>

            {[
              { label:'Nome completo *', val:name, set:setName, ph:'Mario Rossi' },
              { label:'Azienda', val:company, set:setCompany, ph:'Auto Rossi Srl' },
              { label:'Email *', val:email, set:setEmail, ph:'mario@autorossi.it', type:'email' },
              { label:'Telefono / WhatsApp', val:phone, set:setPhone, ph:'+39 333...' },
              { label:'Veicoli acquistati/mese', val:vehicles, set:setVehicles, ph:'10-20' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, color:'#94a3b8', display:'block', marginBottom:4 }}>{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  type={(f as {type?:string}).type || 'text'}
                  style={{ width:'100%', background:'#334155', border:'1px solid #475569', color:'#f1f5f9', borderRadius:8, padding:'10px 12px', fontSize:14, boxSizing:'border-box' }} />
              </div>
            ))}

            <button onClick={handleSubmit} disabled={!name || !email || loading}
              style={{ width:'100%', background:'#3b82f6', color:'white', border:'none', borderRadius:8, padding:'13px', fontSize:16, fontWeight:700, cursor:!name || !email ? 'not-allowed' : 'pointer', opacity:!name || !email ? 0.6 : 1 }}>
              {loading ? '⏳ Invio...' : 'Invia Richiesta →'}
            </button>

            <p style={{ textAlign:'center', marginTop:12, fontSize:12, color:'#475569' }}>
              Oppure scrivi direttamente a{' '}
              <a href="mailto:autofleetpro1@gmail.com" style={{ color:'#60a5fa' }}>autofleetpro1@gmail.com</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
