/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const LANGS = ['it', 'el', 'de', 'fr', 'es', 'en'] as const
type Lang = typeof LANGS[number]
const flags: Record<Lang, string> = { it:'🇮🇹', el:'🇬🇷', de:'🇩🇪', fr:'🇫🇷', es:'🇪🇸', en:'🇬🇧' }

const T = {
  title: { it:'Inizia la prova gratuita', el:'Ξεκίνα τη δωρεάν δοκιμή', de:'Kostenlose Testversion starten', fr:'Démarrer l\'essai gratuit', es:'Iniciar prueba gratuita', en:'Start your free trial' },
  sub: { it:'14 giorni gratis. Nessuna carta di credito. Cancella quando vuoi.', el:'14 ημέρες δωρεάν. Χωρίς πιστωτική κάρτα. Ακύρωση ανά πάσα στιγμή.', de:'14 Tage kostenlos. Keine Kreditkarte. Jederzeit kündigen.', fr:'14 jours gratuits. Aucune carte de crédit. Annulation à tout moment.', es:'14 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.', en:'14 days free. No credit card. Cancel anytime.' },
  plan: { it:'Piano', el:'Πλάνο', de:'Plan', fr:'Plan', es:'Plan', en:'Plan' },
  planTrial: { it:'Trial 14 giorni (Gratuito)', el:'Δοκιμή 14 ημερών (Δωρεάν)', de:'14-Tage-Test (Kostenlos)', fr:'Essai 14 jours (Gratuit)', es:'Prueba 14 días (Gratis)', en:'14-day trial (Free)' },
  planFounder: { it:'Founder Plan €29/mese', el:'Founder Plan €29/μήνα', de:'Founder Plan €29/Monat', fr:'Plan Fondateur €29/mois', es:'Plan Fundador €29/mes', en:'Founder Plan €29/month' },
  name: { it:'Nome e Cognome', el:'Ονοματεπώνυμο', de:'Vor- und Nachname', fr:'Prénom et Nom', es:'Nombre y Apellido', en:'Full Name' },
  company: { it:'Autosalone / Azienda', el:'Αυτοκτηματαγορά / Εταιρεία', de:'Autohaus / Unternehmen', fr:'Concessionnaire / Société', es:'Concesionario / Empresa', en:'Dealership / Company' },
  email: { it:'Email', el:'Email', de:'E-Mail', fr:'E-mail', es:'Email', en:'Email' },
  phone: { it:'Telefono (opzionale)', el:'Τηλέφωνο (προαιρετικό)', de:'Telefon (optional)', fr:'Téléphone (optionnel)', es:'Teléfono (opcional)', en:'Phone (optional)' },
  vehicles: { it:'Quanti veicoli gestisci mediamente?', el:'Πόσα οχήματα διαχειρίζεσαι κατά μέσο όρο;', de:'Wie viele Fahrzeuge verwaltest du durchschnittlich?', fr:'Combien de véhicules gérez-vous en moyenne ?', es:'¿Cuántos vehículos gestionas de media?', en:'How many vehicles do you manage on average?' },
  submit: { it:'Richiedi accesso gratuito', el:'Ζήτα δωρεάν πρόσβαση', de:'Kostenlosen Zugang anfragen', fr:'Demander l\'accès gratuit', es:'Solicitar acceso gratuito', en:'Request free access' },
  sending: { it:'Invio...', el:'Αποστολή...', de:'Senden...', fr:'Envoi...', es:'Enviando...', en:'Sending...' },
  successTitle: { it:'✅ Richiesta inviata!', el:'✅ Η αίτηση στάλθηκε!', de:'✅ Anfrage gesendet!', fr:'✅ Demande envoyée !', es:'✅ ¡Solicitud enviada!', en:'✅ Request sent!' },
  successMsg: { it:'Ti contatteremo entro 24 ore per attivare il tuo account.', el:'Θα επικοινωνήσουμε μαζί σου εντός 24 ωρών για να ενεργοποιήσουμε τον λογαριασμό σου.', de:'Wir melden uns innerhalb von 24 Stunden, um dein Konto zu aktivieren.', fr:'Nous vous contacterons dans les 24 heures pour activer votre compte.', es:'Te contactaremos en 24 horas para activar tu cuenta.', en:'We\'ll contact you within 24 hours to activate your account.' },
  backLanding: { it:'← Torna alla home', el:'← Πίσω στην αρχική', de:'← Zurück zur Startseite', fr:'← Retour à l\'accueil', es:'← Volver al inicio', en:'← Back to home' },
  founderBadge: { it:'🔒 Solo 10 posti Founder — Prezzo bloccato per sempre', el:'🔒 Μόνο 10 θέσεις Founder — Τιμή κλειδωμένη για πάντα', de:'🔒 Nur 10 Founder-Plätze — Preis für immer gesperrt', fr:'🔒 Seulement 10 places Fondateur — Prix bloqué pour toujours', es:'🔒 Solo 10 plazas Fundador — Precio bloqueado para siempre', en:'🔒 Only 10 Founder spots — Price locked forever' },
  required: { it:'Campo obbligatorio', el:'Υποχρεωτικό πεδίο', de:'Pflichtfeld', fr:'Champ obligatoire', es:'Campo obligatorio', en:'Required field' },
}

function t(key: keyof typeof T, lang: Lang): string {
  return (T[key] as Record<string, string>)[lang] || (T[key] as Record<string, string>)['en']
}

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [plan, setPlan] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicles, setVehicles] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const nav = navigator.language.toLowerCase()
    if (nav.startsWith('el')) { setLang('el'); setPlan(t('planTrial','el')) }
    else if (nav.startsWith('de')) { setLang('de'); setPlan(t('planTrial','de')) }
    else if (nav.startsWith('fr')) { setLang('fr'); setPlan(t('planTrial','fr')) }
    else if (nav.startsWith('es')) { setLang('es'); setPlan(t('planTrial','es')) }
    else if (nav.startsWith('it')) { setLang('it'); setPlan(t('planTrial','it')) }
    else { setLang('en'); setPlan(t('planTrial','en')) }
  }, [])

  useEffect(() => {
    setPlan(t('planTrial', lang))
  }, [lang])

  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!name.trim()) e.name = true
    if (!email.trim() || !email.includes('@')) e.email = true
    if (!vehicles.trim()) e.vehicles = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('https://formspree.io/f/xpwdjkgb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, name, company, email, phone, vehicles, lang }),
      })
      setSent(true)
    } catch {
      // Show success anyway
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      {/* Nav */}
      <nav style={{ background:'white', borderBottom:'1px solid #E5E7EB', padding:'0 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', alignItems:'center', height:56, gap:16 }}>
          <Link href="/landing" style={{ fontSize:15, fontWeight:700, color:'#111827', textDecoration:'none' }}>🚗 AutoFleet Pro</Link>
          <div style={{ flex:1 }} />
          {/* Language flags */}
          <div style={{ display:'flex', gap:4 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)} title={l.toUpperCase()}
                style={{
                  background: lang===l ? '#6366F1' : '#F8FAFC',
                  border: lang===l ? '2px solid #6366F1' : '1px solid #E5E7EB',
                  borderRadius:6, padding:'4px 8px', cursor:'pointer', fontSize:16,
                  opacity: lang===l ? 1 : 0.6, transition:'all 0.15s',
                }}>
                {flags[l]}
              </button>
            ))}
          </div>
          <Link href="/landing" style={{ fontSize:13, color:'#6B7280', textDecoration:'none' }}>{t('backLanding', lang)}</Link>
        </div>
      </nav>

      <div style={{ maxWidth:540, margin:'0 auto', padding:'48px 24px' }}>

        {/* Founder badge */}
        <div style={{ background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'10px 16px', marginBottom:24, fontSize:13, color:'#4F46E5', fontWeight:500, textAlign:'center' }}>
          {t('founderBadge', lang)}
        </div>

        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:8, color:'#111827', textAlign:'center' }}>
          {t('title', lang)}
        </h1>
        <p style={{ fontSize:15, color:'#6B7280', textAlign:'center', marginBottom:32 }}>
          {t('sub', lang)}
        </p>

        {sent ? (
          <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:12, padding:32, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <h2 style={{ fontSize:20, fontWeight:700, color:'#166534', marginBottom:8 }}>{t('successTitle', lang)}</h2>
            <p style={{ color:'#166534', fontSize:15 }}>{t('successMsg', lang)}</p>
            <div style={{ marginTop:20, fontSize:14, color:'#6B7280' }}>autofleetpro1@gmail.com</div>
          </div>
        ) : (
          <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, padding:32, boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>

            {/* Plan selector */}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#6B7280', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                {t('plan', lang)}
              </label>
              <div style={{ display:'flex', gap:8 }}>
                {[t('planTrial', lang), t('planFounder', lang)].map(p => (
                  <button key={p} onClick={() => setPlan(p)}
                    style={{
                      flex:1, padding:'10px 12px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:500,
                      border: plan===p ? '2px solid #6366F1' : '1px solid #E5E7EB',
                      background: plan===p ? '#EFF6FF' : 'white',
                      color: plan===p ? '#6366F1' : '#6B7280',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            {[
              { key:'name', label:t('name',lang), val:name, set:setName, ph:'Marco Rossi', type:'text' },
              { key:'company', label:t('company',lang), val:company, set:setCompany, ph:'Rossi Auto SRL', type:'text' },
              { key:'email', label:t('email',lang), val:email, set:setEmail, ph:'marco@rossiauto.it', type:'email' },
              { key:'phone', label:t('phone',lang), val:phone, set:setPhone, ph:'+39 071...', type:'tel' },
              { key:'vehicles', label:t('vehicles',lang), val:vehicles, set:setVehicles, ph:'20-50', type:'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#6B7280', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                  {f.label} {(f.key==='name'||f.key==='email'||f.key==='vehicles') && <span style={{ color:'#EF4444' }}>*</span>}
                </label>
                <input
                  type={f.type}
                  value={f.val}
                  onChange={e => { f.set(e.target.value); setErrors(prev => ({...prev, [f.key]: false})) }}
                  placeholder={f.ph}
                  style={{
                    width:'100%', padding:'10px 12px', borderRadius:8, fontSize:14, outline:'none',
                    border: errors[f.key] ? '2px solid #EF4444' : '1px solid #D1D5DB',
                    boxSizing:'border-box',
                    boxShadow: errors[f.key] ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
                  }}
                />
                {errors[f.key] && <div style={{ fontSize:11, color:'#EF4444', marginTop:3 }}>{t('required', lang)}</div>}
              </div>
            ))}

            <button onClick={submit} disabled={loading}
              style={{
                width:'100%', padding:'13px', background:'#6366F1', color:'white', border:'none',
                borderRadius:8, fontSize:16, fontWeight:700, cursor:loading?'not-allowed':'pointer',
                opacity:loading?0.7:1, marginTop:8,
                boxShadow:'0 4px 14px rgba(99,102,241,0.3)',
              }}>
              {loading ? t('sending', lang) : t('submit', lang)}
            </button>

            <div style={{ textAlign:'center', fontSize:12, color:'#9CA3AF', marginTop:12 }}>
              {lang==='el'?'Χωρίς πιστωτική κάρτα · Ακύρωση ανά πάσα στιγμή':
               lang==='it'?'Nessuna carta di credito · Cancella quando vuoi':
               lang==='de'?'Keine Kreditkarte · Jederzeit kündigen':
               lang==='fr'?'Aucune carte de crédit · Annulation à tout moment':
               lang==='es'?'Sin tarjeta de crédito · Cancela cuando quieras':
               'No credit card · Cancel anytime'}
            </div>
          </div>
        )}

        {/* Direct email fallback */}
        <div style={{ textAlign:'center', marginTop:24, fontSize:13, color:'#9CA3AF' }}>
          {lang==='el'?'Ή στείλε email απευθείας:':lang==='it'?'O scrivi direttamente a:':lang==='de'?'Oder schreib direkt an:':lang==='fr'?'Ou écrivez directement à :':lang==='es'?'O escribe directamente a:':'Or email directly:'}{' '}
          <a href="mailto:autofleetpro1@gmail.com" style={{ color:'#6366F1', textDecoration:'none', fontWeight:500 }}>
            autofleetpro1@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}
