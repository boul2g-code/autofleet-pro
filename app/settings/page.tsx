'use client'
// @ts-nocheck
import { useState, useRef } from 'react'
import AppShell from '@/components/AppShell'
import { useFleetStore } from '@/store/useFleetStore'
import { t } from '@/lib/i18n'

type Section = 'company' | 'branding' | 'documents' | 'marketplace' | 'financials' | 'backup'

export default function SettingsPage() {
  const { settings, saveSetting, vehicles } = useFleetStore()
  const lang = settings.lang
  const org = settings.org || {}
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('company')
  const logoRef = useRef<HTMLInputElement>(null)

  // ── Company fields ──
  const [name, setName]         = useState(org.name || '')
  const [vat, setVat]           = useState(org.vat || '')
  const [taxOffice, setTaxOffice] = useState(org.taxOffice || '')
  const [country, setCountry]   = useState(org.country || '')
  const [address, setAddress]   = useState(org.address || '')
  const [city, setCity]         = useState(org.city || '')
  const [zip, setZip]           = useState(org.zip || '')
  const [phone, setPhone]       = useState(org.phone || '')
  const [email, setEmail]       = useState(org.email || '')
  const [website, setWebsite]   = useState(org.website || '')

  // ── Branding ──
  const [logo, setLogo]         = useState(org.logo || '')
  const [primaryColor, setPrimary] = useState(org.primaryColor || '#2563EB')
  const [secondaryColor, setSecondary] = useState(org.secondaryColor || '#1E293B')

  // ── Documents ──
  const [responsible, setResponsible] = useState(org.responsible || '')
  const [stamp, setStamp]       = useState(org.stamp || '')

  // ── Marketplace ──
  const [autoscout, setAutoscout] = useState(org.autoscout || '')
  const [mobilede, setMobilede] = useState(org.mobilede || '')
  const [cargr, setCargr]       = useState(org.cargr || '')
  const [facebook, setFacebook] = useState(org.facebook || '')

  // ── Financials ──
  const [storeCost, setStoreCost]   = useState(String(org.defaultStoreCost || 8))
  const [transportCost, setTransportCost] = useState(String(org.defaultTransportCostPerKm || 1.2))
  const [marginTarget, setMarginTarget] = useState(String(org.marginTarget || 15))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogo(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setStamp(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const save = () => {
    saveSetting({
      org: {
        ...org,
        id: org.id || 'default',
        name, vat, taxOffice, country, address, city, zip, phone, email, website,
        logo, primaryColor, secondaryColor,
        responsible, stamp,
        autoscout, mobilede, cargr, facebook,
        defaultStoreCost: parseFloat(storeCost) || 8,
        defaultTransportCostPerKm: parseFloat(transportCost) || 1.2,
        marginTarget: parseFloat(marginTarget) || 15,
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const exportJSON = () => {
    const data = JSON.stringify({ vehicles, settings, exportedAt: new Date().toISOString() }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    a.download = `AutoFleet_Backup_${new Date().toISOString().slice(0,10)}_${vehicles.length}vehicles.json`
    a.click()
  }

  const SECTIONS: { key: Section; label: string; icon: string }[] = [
    { key: 'company',     icon: '🏢', label: lang==='el'?'Εταιρεία':lang==='it'?'Azienda':lang==='de'?'Unternehmen':'Company' },
    { key: 'branding',    icon: '🎨', label: lang==='el'?'Branding':'Branding' },
    { key: 'documents',   icon: '📄', label: lang==='el'?'Έγγραφα':lang==='it'?'Documenti':'Documents' },
    { key: 'marketplace', icon: '🌐', label: lang==='el'?'Marketplace':'Marketplace' },
    { key: 'financials',  icon: '💶', label: lang==='el'?'Οικονομικά':lang==='it'?'Economici':'Financials' },
    { key: 'backup',      icon: '💾', label: lang==='el'?'Backup':lang==='it'?'Backup':'Backup' },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>
            {lang==='el'?'Ρυθμίσεις':lang==='it'?'Impostazioni':lang==='de'?'Einstellungen':'Settings'}
          </h1>
          <button className="btn btn-primary" onClick={save} style={{ minWidth:100 }}>
            {saved ? `✅ ${lang==='el'?'Αποθηκεύτηκε':lang==='it'?'Salvato':'Saved!'}` : `💾 ${lang==='el'?'Αποθήκευση':lang==='it'?'Salva':'Save'}`}
          </button>
        </div>

        {/* Section tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:16, flexWrap:'wrap' }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              style={{
                padding:'7px 14px', borderRadius:7, fontSize:13, cursor:'pointer',
                border: activeSection===s.key ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: activeSection===s.key ? 'var(--primary-light)' : 'var(--surface)',
                color: activeSection===s.key ? 'var(--primary)' : 'var(--text2)',
                fontWeight: activeSection===s.key ? 600 : 400,
              }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* ── COMPANY ── */}
        {activeSection === 'company' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>
              🏢 {lang==='el'?'Στοιχεία Εταιρείας':lang==='it'?'Dati Aziendali':'Company Details'}
            </h2>
            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'Επωνυμία':lang==='it'?'Ragione Sociale':'Company Name'} *</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="ROSSI AUTO SRL" />
              </div>
              <div className="field-group">
                <label>{lang==='el'?'ΑΦΜ / VAT':lang==='it'?'Partita IVA':'VAT Number'}</label>
                <input value={vat} onChange={e=>setVat(e.target.value)} placeholder="IT12345678901" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'ΔΟΥ':lang==='it'?'Ufficio Fiscale':'Tax Office'}</label>
                <input value={taxOffice} onChange={e=>setTaxOffice(e.target.value)} />
              </div>
              <div className="field-group">
                <label>{lang==='el'?'Χώρα':lang==='it'?'Paese':'Country'}</label>
                <select value={country} onChange={e=>setCountry(e.target.value)}>
                  <option value="">—</option>
                  <option value="IT">🇮🇹 Italia</option>
                  <option value="GR">🇬🇷 Ελλάδα</option>
                  <option value="DE">🇩🇪 Deutschland</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="ES">🇪🇸 España</option>
                  <option value="AT">🇦🇹 Austria</option>
                  <option value="NL">🇳🇱 Netherlands</option>
                  <option value="BE">🇧🇪 Belgium</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label>{lang==='el'?'Διεύθυνση':lang==='it'?'Indirizzo':'Address'}</label>
              <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Via Roma 1" />
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'Πόλη':lang==='it'?'Città':'City'}</label>
                <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ancona" />
              </div>
              <div className="field-group">
                <label>{lang==='el'?'ΤΚ':lang==='it'?'CAP':'ZIP'}</label>
                <input value={zip} onChange={e=>setZip(e.target.value)} placeholder="60100" />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'Τηλέφωνο':lang==='it'?'Telefono':'Phone'}</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+39 071 1234567" />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="info@rossiauto.it" />
              </div>
            </div>
            <div className="field-group">
              <label>Website</label>
              <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://rossiauto.it" />
            </div>
          </div>
        )}

        {/* ── BRANDING ── */}
        {activeSection === 'branding' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>🎨 Branding</h2>

            {/* Logo */}
            <div className="field-group" style={{ marginBottom:20 }}>
              <label>{lang==='el'?'Λογότυπο Εταιρείας':lang==='it'?'Logo Azienda':'Company Logo'}</label>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:8 }}>
                {logo ? (
                  <img src={logo} alt="Logo" style={{ height:60, maxWidth:200, objectFit:'contain', border:'1px solid var(--border)', borderRadius:6, padding:4, background:'#fff' }} />
                ) : (
                  <div style={{ width:120, height:60, border:'2px dashed var(--border)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)', fontSize:12 }}>
                    {lang==='el'?'Χωρίς logo':'No logo'}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <label className="btn btn-ghost" style={{ cursor:'pointer', fontSize:13 }}>
                    📎 {lang==='el'?'Ανέβασε Logo':lang==='it'?'Carica Logo':'Upload Logo'}
                    <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" style={{ display:'none' }}
                      onChange={handleLogoUpload} ref={logoRef} />
                  </label>
                  {logo && (
                    <button className="btn btn-ghost" style={{ fontSize:12 }} onClick={() => setLogo('')}>
                      🗑️ {lang==='el'?'Αφαίρεση':'Remove'}
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontSize:11, color:'var(--text2)', marginTop:6 }}>
                PNG, JPG, SVG · {lang==='el'?'Εμφανίζεται σε PDF, Flyers, Public Pages':'Shown on PDF, Flyers, Public Vehicle Pages'}
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'Κύριο Χρώμα':'Primary Color'}</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={primaryColor} onChange={e=>setPrimary(e.target.value)}
                    style={{ width:44, height:36, padding:2, cursor:'pointer' }} />
                  <input value={primaryColor} onChange={e=>setPrimary(e.target.value)}
                    style={{ fontFamily:'monospace', width:100 }} placeholder="#2563EB" />
                </div>
              </div>
              <div className="field-group">
                <label>{lang==='el'?'Δευτερεύον Χρώμα':'Secondary Color'}</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={secondaryColor} onChange={e=>setSecondary(e.target.value)}
                    style={{ width:44, height:36, padding:2, cursor:'pointer' }} />
                  <input value={secondaryColor} onChange={e=>setSecondary(e.target.value)}
                    style={{ fontFamily:'monospace', width:100 }} placeholder="#1E293B" />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginTop:16, padding:16, background:'var(--surface2)', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, color:'var(--text2)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                {lang==='el'?'Προεπισκόπηση':'Preview'}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {logo
                  ? <img src={logo} alt="" style={{ height:40, maxWidth:120, objectFit:'contain' }} />
                  : <div style={{ background:primaryColor, color:'white', padding:'6px 14px', borderRadius:6, fontWeight:700, fontSize:14 }}>{name || 'ROSSI AUTO'}</div>
                }
                <div>
                  <div style={{ fontWeight:700, color:'var(--text)' }}>{name || 'Company Name'}</div>
                  {city && country && <div style={{ fontSize:12, color:'var(--text2)' }}>{city}, {country}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {activeSection === 'documents' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>
              📄 {lang==='el'?'Στοιχεία Εγγράφων':lang==='it'?'Dati Documenti':'Document Settings'}
            </h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:16 }}>
              {lang==='el'?'Εμφανίζονται αυτόματα σε PDF, CMR και Flyers.':
               lang==='it'?'Appaiono automaticamente su PDF, CMR e Flyer.':
               'Automatically appear on PDF exports, CMR documents and Flyers.'}
            </p>
            <div className="field-group">
              <label>{lang==='el'?'Υπεύθυνος':lang==='it'?'Responsabile':'Responsible Person'}</label>
              <input value={responsible} onChange={e=>setResponsible(e.target.value)} placeholder="Marco Rossi" />
            </div>

            <div className="field-group" style={{ marginTop:16 }}>
              <label>{lang==='el'?'Σφραγίδα Εταιρείας':lang==='it'?'Timbro Aziendale':'Company Stamp'}</label>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:8 }}>
                {stamp ? (
                  <img src={stamp} alt="Stamp" style={{ height:80, maxWidth:150, objectFit:'contain', border:'1px solid var(--border)', borderRadius:6, padding:4, background:'#fff' }} />
                ) : (
                  <div style={{ width:120, height:80, border:'2px dashed var(--border)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)', fontSize:12 }}>
                    {lang==='el'?'Χωρίς σφραγίδα':'No stamp'}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <label className="btn btn-ghost" style={{ cursor:'pointer', fontSize:13 }}>
                    📎 {lang==='el'?'Ανέβασε Σφραγίδα':lang==='it'?'Carica Timbro':'Upload Stamp'}
                    <input type="file" accept=".png,.jpg,.jpeg" style={{ display:'none' }} onChange={handleStampUpload} />
                  </label>
                  {stamp && (
                    <button className="btn btn-ghost" style={{ fontSize:12 }} onClick={() => setStamp('')}>
                      🗑️ {lang==='el'?'Αφαίρεση':'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MARKETPLACE ── */}
        {activeSection === 'marketplace' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:8 }}>🌐 Marketplace Links</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:16 }}>
              {lang==='el'?'Χρησιμοποιούνται στο tab Listings για γρήγορη ανακατεύθυνση.':
               lang==='it'?'Usati nel tab Annunci per reindirizzamento rapido.':
               'Used in the Listings tab for quick marketplace navigation.'}
            </p>
            {[
              { label:'AutoScout24 URL', val:autoscout, set:setAutoscout, ph:'https://www.autoscout24.it/mia-concessionaria' },
              { label:'Mobile.de URL',   val:mobilede,  set:setMobilede,  ph:'https://www.mobile.de/mein-haendler' },
              { label:'Car.gr URL',      val:cargr,     set:setCargr,     ph:'https://www.car.gr/seller/...' },
              { label:'Facebook Page',   val:facebook,  set:setFacebook,  ph:'https://www.facebook.com/rossiauto' },
            ].map(f => (
              <div key={f.label} className="field-group">
                <label>{f.label}</label>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} />
              </div>
            ))}
          </div>
        )}

        {/* ── FINANCIALS ── */}
        {activeSection === 'financials' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:8 }}>
              💶 {lang==='el'?'Οικονομικές Παράμετροι':lang==='it'?'Parametri Economici':'Financial Defaults'}
            </h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:16 }}>
              {lang==='el'?'Χρησιμοποιούνται για τους αυτόματους υπολογισμούς κόστους και alerts.':
               lang==='it'?'Usati per i calcoli automatici dei costi e gli alert.':
               'Used for automatic cost calculations and stock aging alerts.'}
            </p>
            <div className="field-row">
              <div className="field-group">
                <label>{lang==='el'?'Κόστος Αποθήκευσης €/μέρα':lang==='it'?'Costo Stoccaggio €/giorno':'Storage Cost €/day'}</label>
                <input type="number" value={storeCost} onChange={e=>setStoreCost(e.target.value)} min="0" step="0.5" />
                <div style={{ fontSize:11, color:'var(--text2)', marginTop:4 }}>
                  {lang==='el'?'Default: €8/μέρα':'Default: €8/day'}
                </div>
              </div>
              <div className="field-group">
                <label>{lang==='el'?'Κόστος Μεταφοράς €/km':lang==='it'?'Costo Trasporto €/km':'Transport Cost €/km'}</label>
                <input type="number" value={transportCost} onChange={e=>setTransportCost(e.target.value)} min="0" step="0.1" />
              </div>
            </div>
            <div className="field-group">
              <label>{lang==='el'?'Στόχος Περιθωρίου %':lang==='it'?'Target Margine %':'Margin Target %'}</label>
              <input type="number" value={marginTarget} onChange={e=>setMarginTarget(e.target.value)} min="0" max="100" />
              <div style={{ fontSize:11, color:'var(--text2)', marginTop:4 }}>
                {lang==='el'?'Οχήματα κάτω από αυτό το ποσοστό εμφανίζονται σαν alert.':
                 lang==='it'?'Veicoli sotto questa percentuale appaiono come alert.':
                 'Vehicles below this margin % appear as alerts.'}
              </div>
            </div>

            {/* Preview alert */}
            <div style={{ marginTop:16, padding:12, background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8, fontSize:13 }}>
              <div style={{ fontWeight:700, color:'#92400E', marginBottom:4 }}>
                {lang==='el'?'Παράδειγμα Alert:':'Example Alert:'}
              </div>
              <div style={{ color:'#78350F' }}>
                ⚠️ BMW X3 2021 — {lang==='el'?'97 ημέρες στο stock':'97 days in stock'}
                <br/>
                {lang==='el'?'Κόστος αναμονής':'Holding cost'}: <strong>€{(97 * (parseFloat(storeCost)||8)).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── BACKUP ── */}
        {activeSection === 'backup' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>
              💾 {lang==='el'?'Backup & Εξαγωγή':lang==='it'?'Backup & Esportazione':'Backup & Export'}
            </h2>
            <p style={{ fontSize:14, color:'var(--text2)', marginBottom:16 }}>
              {vehicles.length} {lang==='el'?'οχήματα στη βάση δεδομένων':lang==='it'?'veicoli nel database':'vehicles in database'}
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button className="btn btn-ghost" onClick={exportJSON} style={{ justifyContent:'flex-start' }}>
                📥 {lang==='el'?'Εξαγωγή όλων (JSON)':lang==='it'?'Esporta tutto (JSON)':'Export all (JSON)'}
              </button>
              <button className="btn btn-ghost"
                onClick={async () => {
                  const { exportVehiclesToExcel } = await import('@/lib/xlsxExport')
                  exportVehiclesToExcel(vehicles, lang)
                }}
                style={{ justifyContent:'flex-start' }}>
                📊 {lang==='el'?'Εξαγωγή σε Excel':lang==='it'?'Esporta in Excel':'Export to Excel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
