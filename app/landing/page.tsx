'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const LANGS = ['it', 'el', 'de', 'fr', 'es', 'en'] as const
type Lang = typeof LANGS[number]

const T = {
  // Hero headline — pain-first
  h1: {
    it: 'Sai esattamente quali auto ti fanno perdere soldi?',
    el: 'Ξέρεις ακριβώς ποια αυτοκίνητα σου τρώνε χρήματα;',
    de: 'Weißt du genau, welche Autos dir Geld kosten?',
    fr: 'Savez-vous exactement quelles voitures vous font perdre de l\'argent ?',
    es: '¿Sabes exactamente qué coches te están haciendo perder dinero?',
    en: 'Do you know exactly which vehicles are costing you money?',
  },
  // Hero subheadline
  h2: {
    it: 'AutoFleet Pro mostra quali veicoli sono fermi da troppo tempo, il margine reale su ogni auto e gestisce stock, trasporti e documenti in un unico pannello.',
    el: 'Το AutoFleet Pro δείχνει ποια οχήματα είναι σταματημένα πολύ καιρό, το πραγματικό κέρδος ανά αυτοκίνητο και οργανώνει stock, μεταφορές και έγγραφα σε ένα μέρος.',
    de: 'AutoFleet Pro zeigt, welche Fahrzeuge zu lange stillstehen, die echte Marge pro Fahrzeug und verwaltet Stock, Transporte und Dokumente in einem Panel.',
    fr: 'AutoFleet Pro montre quels véhicules sont immobiles depuis trop longtemps, la marge réelle par véhicule et gère stock, transports et documents en un seul endroit.',
    es: 'AutoFleet Pro muestra qué vehículos llevan demasiado tiempo parados, el margen real por vehículo y gestiona stock, transportes y documentos en un solo lugar.',
    en: 'AutoFleet Pro shows which vehicles have been sitting too long, the real profit margin per vehicle and manages stock, transport and documents in one place.',
  },
  // CTA
  cta: { it:'Prova gratis 14 giorni', el:'Δοκίμασε δωρεάν 14 ημέρες', de:'14 Tage kostenlos testen', fr:'Essai gratuit 14 jours', es:'Prueba gratis 14 días', en:'Free trial 14 days' },
  cta2: { it:'Guarda demo →', el:'Δες demo →', de:'Demo ansehen →', fr:'Voir démo →', es:'Ver demo →', en:'Watch demo →' },
  // No CC
  nocc: { it:'Nessuna carta di credito richiesta', el:'Χωρίς πιστωτική κάρτα', de:'Keine Kreditkarte erforderlich', fr:'Aucune carte de crédit requise', es:'Sin tarjeta de crédito', en:'No credit card required' },
  // Dashboard label
  dashLabel: { it:'Dashboard in tempo reale', el:'Dashboard σε πραγματικό χρόνο', de:'Echtzeit-Dashboard', fr:'Tableau de bord en temps réel', es:'Panel en tiempo real', en:'Real-time dashboard' },
  // Pain/Gain section
  painTitle: { it:'Smetti di perdere denaro con Excel e WhatsApp', el:'Σταμάτα να χάνεις χρήμα με Excel και WhatsApp', de:'Hör auf, mit Excel und WhatsApp Geld zu verlieren', fr:'Arrêtez de perdre de l\'argent avec Excel et WhatsApp', es:'Deja de perder dinero con Excel y WhatsApp', en:'Stop losing money with Excel and WhatsApp' },
  // Features
  f1t: { it:'Sai sempre dove sono i tuoi soldi', el:'Ξέρεις πάντα πού είναι τα χρήματά σου', de:'Du weißt immer, wo dein Geld ist', fr:'Vous savez toujours où est votre argent', es:'Siempre sabes dónde está tu dinero', en:'Always know where your money is' },
  f1d: { it:'Valore totale del magazzino, margine per veicolo e alert su auto ferme — tutto aggiornato in tempo reale.', el:'Συνολική αξία stock, κέρδος ανά όχημα και alerts για σταματημένα αυτοκίνητα — όλα ενημερωμένα σε πραγματικό χρόνο.', de:'Gesamtwert des Lagers, Marge pro Fahrzeug und Alerts für stillstehende Autos — alles in Echtzeit aktualisiert.', fr:'Valeur totale du stock, marge par véhicule et alertes sur les voitures immobiles — tout mis à jour en temps réel.', es:'Valor total del stock, margen por vehículo y alertas sobre coches parados — todo actualizado en tiempo real.', en:'Total stock value, margin per vehicle and alerts on idle vehicles — all updated in real time.' },
  f2t: { it:'Da acquisto a consegna in un click', el:'Από αγορά μέχρι παράδοση σε ένα κλικ', de:'Von Kauf bis Lieferung mit einem Klick', fr:'De l\'achat à la livraison en un clic', es:'De compra a entrega en un clic', en:'From purchase to delivery in one click' },
  f2d: { it:'Gestisci acquisto, trasporto, magazzino, vendita e documenti per ogni veicolo. Esporta CMR e PDF professionali con il tuo logo.', el:'Διαχείρισε αγορά, μεταφορά, αποθήκη, πώληση και έγγραφα για κάθε όχημα. Εξαγωγή CMR και επαγγελματικών PDF με το λογότυπό σου.', de:'Verwalte Kauf, Transport, Lager, Verkauf und Dokumente für jedes Fahrzeug. Exportiere CMR und professionelle PDFs mit deinem Logo.', fr:'Gérez achat, transport, stock, vente et documents pour chaque véhicule. Exportez CMR et PDF professionnels avec votre logo.', es:'Gestiona compra, transporte, almacén, venta y documentos por vehículo. Exporta CMR y PDFs profesionales con tu logo.', en:'Manage purchase, transport, storage, sale and documents per vehicle. Export CMR and professional PDFs with your logo.' },
  f3t: { it:'Alert automatici su stock fermo', el:'Αυτόματα alerts για σταματημένο stock', de:'Automatische Alerts für stillstehende Fahrzeuge', fr:'Alertes automatiques sur le stock immobile', es:'Alertas automáticas sobre stock parado', en:'Automatic alerts on idle stock' },
  f3d: { it:'Ogni giorno che un\'auto è ferma ti costa denaro. AutoFleet Pro calcola il costo esatto e ti mostra quali veicoli vendere prima.', el:'Κάθε μέρα που ένα αυτοκίνητο δεν πουλιέται σου κοστίζει χρήμα. Το AutoFleet Pro υπολογίζει το ακριβές κόστος και σου δείχνει ποια οχήματα να πουλήσεις πρώτα.', de:'Jeder Tag, an dem ein Auto stillsteht, kostet dich Geld. AutoFleet Pro berechnet die genauen Kosten und zeigt, welche Fahrzeuge du zuerst verkaufen sollst.', fr:'Chaque jour qu\'une voiture est immobile vous coûte de l\'argent. AutoFleet Pro calcule le coût exact et vous montre quels véhicules vendre en premier.', es:'Cada día que un coche está parado te cuesta dinero. AutoFleet Pro calcula el coste exacto y te muestra qué vehículos vender primero.', en:'Every day a vehicle sits idle costs you money. AutoFleet Pro calculates the exact cost and shows which vehicles to sell first.' },
  // Social proof numbers
  spTitle: { it:'Numeri reali dal nostro ambiente demo', el:'Πραγματικοί αριθμοί από το demo περιβάλλον', de:'Echte Zahlen aus unserer Demo-Umgebung', fr:'Chiffres réels de notre environnement démo', es:'Números reales de nuestro entorno demo', en:'Real numbers from our demo environment' },
  // Pricing
  pTitle: { it:'Starter €49 / Pro €99 · 14 giorni gratis', el:'Founder Plan — Μόνο για τα πρώτα 10 αυτοκτηματαγορεία', de:'Founder Plan — Nur für die ersten 10 Händler', fr:'Plan Fondateur — Seulement pour les 10 premiers concessionnaires', es:'Plan Fundador — Solo para los 10 primeros concesionarios', en:'Founder Plan — Only for the first 10 dealers' },
  pSub: { it:'Prezzo bloccato per sempre. Non aumenterà mai.', el:'Τιμή κλειδωμένη για πάντα. Δεν θα αυξηθεί ποτέ.', de:'Preis für immer gesperrt. Er wird nie steigen.', fr:'Prix bloqué pour toujours. Il n\'augmentera jamais.', es:'Precio bloqueado para siempre. Nunca subirá.', en:'Price locked forever. It will never increase.' },
  pFeatures: {
    it: ['Tutti i veicoli illimitati','Dashboard con alert stock fermo','Margine reale per veicolo','Export PDF, CMR, Excel','Branding con il tuo logo','6 lingue','Supporto diretto dal fondatore'],
    el: ['Απεριόριστα οχήματα','Dashboard με alerts stock','Πραγματικό κέρδος ανά όχημα','Εξαγωγή PDF, CMR, Excel','Branding με το λογότυπό σου','6 γλώσσες','Άμεση υποστήριξη από τον ιδρυτή'],
    de: ['Unbegrenzte Fahrzeuge','Dashboard mit Stock-Alerts','Echte Marge pro Fahrzeug','Export PDF, CMR, Excel','Branding mit deinem Logo','6 Sprachen','Direkter Support vom Gründer'],
    fr: ['Véhicules illimités','Dashboard avec alertes stock','Marge réelle par véhicule','Export PDF, CMR, Excel','Branding avec votre logo','6 langues','Support direct du fondateur'],
    es: ['Vehículos ilimitados','Dashboard con alertas de stock','Margen real por vehículo','Exportación PDF, CMR, Excel','Branding con tu logo','6 idiomas','Soporte directo del fundador'],
    en: ['Unlimited vehicles','Dashboard with stock alerts','Real margin per vehicle','Export PDF, CMR, Excel','Branding with your logo','6 languages','Direct founder support'],
  },
  trialBtn: { it:'Inizia la prova gratuita', el:'Ξεκίνα τη δωρεάν δοκιμή', de:'Kostenlose Testversion starten', fr:'Démarrer l\'essai gratuit', es:'Iniciar prueba gratuita', en:'Start free trial' },
  // Nav
  navFeatures: { it:'Funzionalità', el:'Λειτουργίες', de:'Funktionen', fr:'Fonctionnalités', es:'Características', en:'Features' },
  navPricing: { it:'Prezzi', el:'Τιμές', de:'Preise', fr:'Tarifs', es:'Precios', en:'Pricing' },
  navLogin: { it:'Accedi', el:'Σύνδεση', de:'Anmelden', fr:'Connexion', es:'Acceder', en:'Login' },
  // FAQ
  faqTitle: { it:'Domande frequenti', el:'Συχνές Ερωτήσεις', de:'Häufige Fragen', fr:'Questions fréquentes', es:'Preguntas frecuentes', en:'FAQ' },
}

function t(key: keyof typeof T, lang: Lang): string {
  const val = T[key] as Record<string, string | string[]>
  return (val[lang] || val['en']) as string
}

function tArr(key: keyof typeof T, lang: Lang): string[] {
  const val = T[key] as Record<string, string[]>
  return val[lang] || val['en']
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const nav = navigator.language.toLowerCase()
    if (nav.startsWith('el')) setLang('el')
    else if (nav.startsWith('de')) setLang('de')
    else if (nav.startsWith('fr')) setLang('fr')
    else if (nav.startsWith('es')) setLang('es')
    else if (nav.startsWith('it')) setLang('it')
    else setLang('en')
  }, [])

  const flags: Record<Lang, string> = { it:'🇮🇹', el:'🇬🇷', de:'🇩🇪', fr:'🇫🇷', es:'🇪🇸', en:'🇬🇧' }

  return (
    <div style={{ fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background:'#F8FAFC', color:'#111827', minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ background:'white', borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, zIndex:50, padding:'0 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', height:60, gap:24 }}>
          <div style={{ fontWeight:800, fontSize:17, color:'#111827' }}>🚗 AutoFleet Pro</div>
          <div style={{ flex:1 }} />
          <a href="#features" style={{ fontSize:14, color:'#6B7280', textDecoration:'none' }}>{t('navFeatures', lang)}</a>
          <a href="#pricing" style={{ fontSize:14, color:'#6B7280', textDecoration:'none' }}>{t('navPricing', lang)}</a>
          {/* Lang switcher */}
          <div style={{ display:'flex', gap:4 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                title={l.toUpperCase()}
                style={{
                  background: lang===l ? '#2563EB' : 'var(--surface,#f8fafc)',
                  border: lang===l ? '2px solid #2563EB' : '1px solid #E5E7EB',
                  borderRadius:6, padding:'4px 8px', cursor:'pointer', fontSize:16,
                  opacity: lang===l ? 1 : 0.65,
                  transform: lang===l ? 'scale(1.1)' : 'scale(1)',
                  transition:'all 0.15s',
                }}>
                {flags[l]}
              </button>
            ))}
          </div>
          <Link href="/login"
            style={{ fontSize:14, color:'#2563EB', textDecoration:'none', fontWeight:500 }}>
            {t('navLogin', lang)}
          </Link>
          <Link href="/login"
            style={{ background:'#2563EB', color:'white', padding:'8px 16px', borderRadius:7, fontSize:14, fontWeight:600, textDecoration:'none' }}>
            {t('cta', lang)}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background:'white', padding:'72px 24px 60px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#EFF6FF', color:'#2563EB', borderRadius:20, padding:'6px 14px', fontSize:13, fontWeight:600, marginBottom:24 }}>
            🎯 Starter €49 · Pro €99 · {lang==='el'?'14 ημέρες δωρεάν':lang==='de'?'14 Tage gratis':lang==='fr'?'14 jours gratuits':lang==='es'?'14 días gratis':'14 giorni gratis'}
          </div>

          <h1 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, lineHeight:1.1, marginBottom:20, color:'#111827' }}>
            {t('h1', lang)}
          </h1>
          <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'#6B7280', maxWidth:700, margin:'0 auto 36px', lineHeight:1.6 }}>
            {t('h2', lang)}
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:12 }}>
            <Link href="/login"
              style={{ background:'#2563EB', color:'white', padding:'14px 28px', borderRadius:8, fontSize:16, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
              {t('cta', lang)}
            </Link>
            <a href="#demo"
              style={{ background:'white', color:'#2563EB', padding:'14px 24px', borderRadius:8, fontSize:16, fontWeight:600, textDecoration:'none', border:'2px solid #2563EB' }}>
              {t('cta2', lang)}
            </a>
          </div>
          <div style={{ fontSize:13, color:'#9CA3AF' }}>{t('nocc', lang)}</div>
        </div>
      </section>

      {/* ── DASHBOARD SCREENSHOT MOCK ── */}
      <section id="demo" style={{ background:'#1E293B', padding:'48px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'6px 14px', fontSize:13, color:'#94A3B8', marginBottom:12 }}>
              📊 {t('dashLabel', lang)}
            </div>
          </div>

          {/* Dashboard mock */}
          <div style={{ background:'#F5F7FA', borderRadius:12, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.1)' }}>
            {/* Top bar mock */}
            <div style={{ background:'white', padding:'10px 16px', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#FF5F57' }} />
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#FFBD2E' }} />
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#28C840' }} />
              <div style={{ fontSize:12, color:'#9CA3AF', marginLeft:8 }}>autofleet-pro.vercel.app/dashboard</div>
            </div>
            {/* Dashboard content */}
            <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', minHeight:320 }}>
              {/* Sidebar */}
              <div style={{ background:'#1E293B', padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
                {['⊞ Dashboard','🚗 Vehicles 56','☰ Manifest','📈 Analytics'].map((item,i) => (
                  <div key={i} style={{
                    padding:'8px 10px', borderRadius:6, fontSize:12, color: i===0 ? 'white' : '#94A3B8',
                    background: i===0 ? 'rgba(37,99,235,0.6)' : 'transparent', fontWeight: i===0 ? 600 : 400,
                  }}>{item}</div>
                ))}
              </div>
              {/* Main content */}
              <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
                {/* Morning brief */}
                <div style={{ background:'linear-gradient(135deg,#1E293B,#1E3A5F)', borderRadius:8, padding:'12px 16px', color:'white' }}>
                  <div style={{ fontSize:11, color:'#94A3B8', marginBottom:4 }}>
                    {lang==='el'?'Καλημέρα 👋':lang==='de'?'Guten Morgen 👋':lang==='fr'?'Bonjour 👋':lang==='es'?'Buenos días 👋':'Buongiorno 👋'}
                  </div>
                  <div style={{ display:'flex', gap:16, fontSize:12 }}>
                    <span style={{ color:'#FCA5A5' }}>⚠️ <strong>27</strong> {lang==='el'?'οχήματα >90 ημέρες':'veicoli >90 giorni'}</span>
                    <span style={{ color:'#86EFAC' }}>💰 <strong>5</strong> {lang==='el'?'περιθώριο >€4k':'margine >€4k'}</span>
                    <span style={{ color:'#FDE68A', marginLeft:'auto', fontWeight:700 }}>P&L +62.828€</span>
                  </div>
                </div>
                {/* KPI row */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                  {[
                    { label: lang==='el'?'Σύνολο':lang==='de'?'Gesamt':lang==='fr'?'Total':lang==='es'?'Total':'Totale', value:'56', color:'#2563EB', icon:'🚗' },
                    { label: lang==='el'?'Αξία Stock':lang==='de'?'Lagerwert':lang==='fr'?'Valeur Stock':lang==='es'?'Valor Stock':'Valore Stock', value:'€1.58M', color:'#059669', icon:'💶' },
                    { label: lang==='el'?'Κέρδος Μήνα':lang==='de'?'Gewinn Monat':lang==='fr'?'Profit Mois':lang==='es'?'Ganancia Mes':'Profitto Mese', value:'+€6.2k', color:'#059669', icon:'📅' },
                    { label: lang==='el'?'Πωλήθηκαν':lang==='de'?'Verkauft':lang==='fr'?'Vendus':lang==='es'?'Vendidos':'Venduti', value:'10', color:'#16A34A', icon:'✅' },
                  ].map(k => (
                    <div key={k.label} style={{ background:'white', borderRadius:8, padding:'10px 12px', border:'1px solid #E5E7EB' }}>
                      <div style={{ fontSize:10, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.04em' }}>{k.icon} {k.label}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:k.color }}>{k.value}</div>
                    </div>
                  ))}
                </div>
                {/* Dead stock + opportunities */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 12px', fontSize:12 }}>
                    <div style={{ fontWeight:700, color:'#991B1B', marginBottom:6 }}>💀 Dead Stock · 3 {lang==='el'?'οχήματα':'veicoli'}</div>
                    {['CAT 320 · 109d · €2.725','Hitachi ZX210 · 99d · €2.178','Komatsu PC210 · 79d · €1.738'].map(v=>(
                      <div key={v} style={{ color:'#B91C1C', padding:'2px 0', borderBottom:'1px solid #FEE2E2', fontSize:11 }}>🔴 {v}</div>
                    ))}
                  </div>
                  <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, padding:'10px 12px', fontSize:12 }}>
                    <div style={{ fontWeight:700, color:'#166534', marginBottom:6 }}>🏆 {lang==='el'?'Top Ευκαιρίες':lang==='de'?'Top Chancen':lang==='fr'?'Top Opportunités':lang==='es'?'Top Oportunidades':'Top Opportunità'}</div>
                    {['Hyundai HX220 · +€21.430','Doosan DX225 · +€16.650','JCB 3CX · +€12.430'].map(v=>(
                      <div key={v} style={{ color:'#16a34a', padding:'2px 0', borderBottom:'1px solid #BBF7D0', fontSize:11 }}>💰 {v}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN vs GAIN ── */}
      <section id="features" style={{ padding:'64px 24px', background:'white' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', fontSize:'clamp(22px,3vw,36px)', fontWeight:800, marginBottom:48 }}>
            {t('painTitle', lang)}
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            {/* Before */}
            <div style={{ background:'#FEF2F2', borderRadius:12, padding:28, border:'1px solid #FECACA' }}>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:16, color:'#991B1B' }}>
                ❌ Excel + WhatsApp
              </div>
              {[
                lang==='el'?'Ξεχνάς οχήματα στο stock':lang==='de'?'Vergessene Fahrzeuge im Lager':lang==='fr'?'Véhicules oubliés en stock':lang==='es'?'Vehículos olvidados en stock':'Veicoli dimenticati in magazzino',
                lang==='el'?'Έγγραφα παντού χαμένα':lang==='de'?'Überall verstreute Dokumente':lang==='fr'?'Documents éparpillés partout':lang==='es'?'Documentos dispersos por doquier':'Documenti sparsi ovunque',
                lang==='el'?'Δεν ξέρεις το κέρδος ανά αυτοκίνητο':lang==='de'?'Keine Kenntnis der Marge pro Fahrzeug':lang==='fr'?'Aucun contrôle de la marge par véhicule':lang==='es'?'Sin control de margen por vehículo':'Nessun controllo margini per veicolo',
                lang==='el'?'Χαμένος χρόνος σε αναφορές':lang==='de'?'Zeitverlust durch Berichte':lang==='fr'?'Temps perdu en rapports':lang==='es'?'Tiempo perdido en informes':'Ore perse a fare report',
                lang==='el'?'Δεν ξέρεις τι αγοράζεις':lang==='de'?'Du weißt nicht, was du kaufst':lang==='fr'?'Vous ne savez pas ce que vous achetez':lang==='es'?'No sabes qué compras':'Non sai cosa stai comprando',
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:14, color:'#7F1D1D' }}>
                  <span>✗</span><span>{item}</span>
                </div>
              ))}
            </div>
            {/* After */}
            <div style={{ background:'#F0FDF4', borderRadius:12, padding:28, border:'1px solid #BBF7D0' }}>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:16, color:'#166534' }}>
                ✅ AutoFleet Pro
              </div>
              {[
                lang==='el'?'Alert: αυτοκίνητο 90+ ημέρες σε stock':lang==='de'?'Alert: Auto 90+ Tage auf Lager':lang==='fr'?'Alerte: voiture 90+ jours en stock':lang==='es'?'Alerta: coche 90+ días en stock':'Alert: auto ferma da 90+ giorni',
                lang==='el'?'Όλα τα έγγραφα ανά όχημα':lang==='de'?'Alle Dokumente pro Fahrzeug':lang==='fr'?'Tous les documents par véhicule':lang==='es'?'Todos los documentos por vehículo':'Tutti i documenti per ogni veicolo',
                lang==='el'?'Κέρδος + κόστος ανά αυτοκίνητο':lang==='de'?'Marge + Kosten pro Fahrzeug':lang==='fr'?'Marge + coûts par véhicule':lang==='es'?'Margen + costes por vehículo':'Margine + costi per ogni veicolo',
                lang==='el'?'PDF, CMR, Excel με ένα κλικ':lang==='de'?'PDF, CMR, Excel mit einem Klick':lang==='fr'?'PDF, CMR, Excel en un clic':lang==='es'?'PDF, CMR, Excel en un clic':'PDF, CMR, Excel con un click',
                lang==='el'?'Dashboard: αξία stock, κέρδος, alerts':lang==='de'?'Dashboard: Lagerwert, Marge, Alerts':lang==='fr'?'Dashboard: valeur stock, marge, alertes':lang==='es'?'Dashboard: valor stock, margen, alertas':'Dashboard: valore stock, margini, alert',
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:14, color:'#14532D' }}>
                  <span style={{ color:'#16a34a', fontWeight:700 }}>✓</span><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 FEATURES ── */}
      <section style={{ padding:'64px 24px', background:'#F8FAFC' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
            {[
              { icon:'💶', title:t('f1t',lang), desc:t('f1d',lang) },
              { icon:'📋', title:t('f2t',lang), desc:t('f2d',lang) },
              { icon:'⚠️', title:t('f3t',lang), desc:t('f3d',lang) },
            ].map((f,i) => (
              <div key={i} style={{ background:'white', borderRadius:12, padding:28, border:'1px solid #E5E7EB', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, marginBottom:10, color:'#111827' }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF NUMBERS ── */}
      <section style={{ padding:'48px 24px', background:'#1E293B' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:14, color:'#64748B', marginBottom:24 }}>{t('spTitle', lang)}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { value:'56', label: lang==='el'?'οχήματα διαχειρισμένα':lang==='de'?'verwaltete Fahrzeuge':lang==='fr'?'véhicules gérés':lang==='es'?'vehículos gestionados':'veicoli gestiti' },
              { value:'€367.600', label: lang==='el'?'πωλήσεις στο demo':lang==='de'?'Umsatz im Demo':lang==='fr'?'ventes en démo':lang==='es'?'ventas en demo':'vendite simulate' },
              { value:'€62.828', label: lang==='el'?'συνολικό κέρδος tracked':lang==='de'?'verfolgte Marge':lang==='fr'?'profit suivi':lang==='es'?'beneficio rastreado':'profitto tracciato' },
            ].map(s => (
              <div key={s.value}>
                <div style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:800, color:'white' }}>{s.value}</div>
                <div style={{ fontSize:13, color:'#64748B', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'64px 24px', background:'white' }}>
        <div style={{ maxWidth:500, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(22px,3vw,32px)', fontWeight:800, marginBottom:8 }}>
            {lang==='el'?'Επιλέξτε πλάνο':lang==='de'?'Plan wählen':lang==='fr'?'Choisissez votre plan':lang==='es'?'Elige tu plan':'Scegli il tuo piano'}
          </h2>
          <p style={{ color:'#6B7280', marginBottom:32, fontSize:15 }}>{lang==='el'?'14 ημέρες δωρεάν σε κάθε πλάνο. Χωρίς πιστωτική κάρτα.':lang==='de'?'14 Tage kostenlos in jedem Plan. Keine Kreditkarte.':lang==='fr'?'14 jours gratuits sur chaque plan. Aucune carte de crédit.':lang==='es'?'14 días gratis en cada plan. Sin tarjeta de crédito.':'14 giorni gratis su ogni piano. Nessuna carta di credito.'}</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {/* Starter */}
            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:28, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#6B7280', marginBottom:8 }}>Starter</div>
              <div style={{ fontSize:44, fontWeight:800, color:'#111827', lineHeight:1 }}>€49</div>
              <div style={{ color:'#6B7280', fontSize:13, marginBottom:20 }}>/{lang==='el'?'μήνα':lang==='de'?'Monat':lang==='fr'?'mois':lang==='es'?'mes':'mese'}</div>
              {['100 '+( lang==='el'?'οχήματα':lang==='it'?'veicoli':lang==='de'?'Fahrzeuge':lang==='fr'?'véhicules':lang==='es'?'vehículos':'vehicles'),'Dashboard + Alerts','PDF, CMR, Excel','1 '+( lang==='el'?'χρήστης':lang==='it'?'utente':lang==='de'?'Benutzer':lang==='fr'?'utilisateur':lang==='es'?'usuario':'user'),'14 '+(lang==='el'?'ημέρες δωρεάν':lang==='it'?'giorni gratis':lang==='de'?'Tage kostenlos':lang==='fr'?'jours gratuits':lang==='es'?'días gratis':'days free')].map((f,i)=>(
                <div key={i} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, color:'#374151' }}>
                  <span style={{ color:'#2563EB', fontWeight:700 }}>✓</span><span>{f}</span>
                </div>
              ))}
              <Link href="/login" style={{ display:'block', background:'#2563EB', color:'white', padding:'12px 20px', borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none', marginTop:20, textAlign:'center' }}>
                {t('trialBtn', lang)}
              </Link>
            </div>
            {/* Pro */}
            <div style={{ background:'#1E293B', border:'2px solid #3B82F6', borderRadius:14, padding:28, boxShadow:'0 8px 30px rgba(37,99,235,0.2)', position:'relative' }}>
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#2563EB', color:'white', borderRadius:20, padding:'4px 14px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
                {lang==='el'?'ΔΗΜΟΦΙΛΕΣΤΕΡΟ':lang==='it'?'PIÙ POPOLARE':lang==='de'?'BELIEBTESTE':lang==='fr'?'PLUS POPULAIRE':lang==='es'?'MÁS POPULAR':'MOST POPULAR'}
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'#94A3B8', marginBottom:8 }}>Pro</div>
              <div style={{ fontSize:44, fontWeight:800, color:'white', lineHeight:1 }}>€99</div>
              <div style={{ color:'#64748B', fontSize:13, marginBottom:20 }}>/{lang==='el'?'μήνα':lang==='de'?'Monat':lang==='fr'?'mois':lang==='es'?'mes':'mese'}</div>
              {[(lang==='el'?'Απεριόριστα οχήματα':lang==='it'?'Veicoli illimitati':lang==='de'?'Unbegrenzte Fahrzeuge':lang==='fr'?'Véhicules illimités':lang==='es'?'Vehículos ilimitados':'Unlimited vehicles'),(lang==='el'?'Πολλαπλοί χρήστες':lang==='it'?'Utenti multipli':lang==='de'?'Mehrere Benutzer':lang==='fr'?'Utilisateurs multiples':lang==='es'?'Usuarios múltiples':'Multiple users'),'Dashboard + Alerts + Analytics','PDF, CMR, Excel, Flyer',(lang==='el'?'Branding με το λογότυπό σου':lang==='it'?'Branding con il tuo logo':lang==='de'?'Branding mit deinem Logo':lang==='fr'?'Branding avec votre logo':lang==='es'?'Branding con tu logo':'Branding with your logo'),'14 '+(lang==='el'?'ημέρες δωρεάν':lang==='it'?'giorni gratis':lang==='de'?'Tage kostenlos':lang==='fr'?'jours gratuits':lang==='es'?'días gratis':'days free')].map((f,i)=>(
                <div key={i} style={{ display:'flex', gap:8, marginBottom:8, fontSize:13, color:'#E2E8F0' }}>
                  <span style={{ color:'#60A5FA', fontWeight:700 }}>✓</span><span>{f}</span>
                </div>
              ))}
              <Link href="/login" style={{ display:'block', background:'#2563EB', color:'white', padding:'12px 20px', borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none', marginTop:20, textAlign:'center', boxShadow:'0 4px 14px rgba(37,99,235,0.4)' }}>
                {t('trialBtn', lang)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#111827', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ color:'#4B5563', fontSize:13 }}>
          © 2025 AutoFleet Pro · autofleetpro1@gmail.com ·{' '}
          <a href="https://paypal.me/Autofleetpro" style={{ color:'#6B7280' }}>PayPal</a>
        </div>
      </footer>
    </div>
  )
}
