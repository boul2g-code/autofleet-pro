'use client'
import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell'
import { getEffectiveTargetProfit } from '@/lib/vehicleHealth'
import { t } from '@/lib/i18n'
import { useFleetStore } from '@/store/useFleetStore'

type OrgData = {
  id?: string; name?: string; vat?: string; taxOffice?: string;
  country?: string; address?: string; city?: string; zip?: string;
  phone?: string; email?: string; website?: string;
  logo?: string; primaryColor?: string; secondaryColor?: string;
  responsible?: string; stamp?: string;
  autoscout?: string; mobilede?: string; cargr?: string; facebook?: string;
  defaultStoreCost?: number; defaultTransportCostPerKm?: number; marginTarget?: number; targetProfit?: number;
}

type Section = 'company' | 'branding' | 'documents' | 'marketplace' | 'financials' | 'backup'

export default function SettingsPage() {
  const { settings, saveSetting, vehicles } = useFleetStore()
  const lang = settings.lang
  const tx = (key: string, vars?: Record<string, string | number>) => t(lang, key, vars)
  const org: OrgData = (settings.org as unknown as OrgData) || {}
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [section, setSection] = useState<Section>('company')

  const [name, setName]             = useState(org.name || '')
  const [vat, setVat]               = useState(org.vat || '')
  const [taxOffice, setTaxOffice]   = useState(org.taxOffice || '')
  const [country, setCountry]       = useState(org.country || '')
  const [address, setAddress]       = useState(org.address || '')
  const [city, setCity]             = useState(org.city || '')
  const [zip, setZip]               = useState(org.zip || '')
  const [phone, setPhone]           = useState(org.phone || '')
  const [email, setEmail]           = useState(org.email || '')
  const [website, setWebsite]       = useState(org.website || '')
  const [logo, setLogo]             = useState(org.logo || '')
  const [primary, setPrimary]       = useState(org.primaryColor || '#6366F1')
  const [secondary, setSecondary]   = useState(org.secondaryColor || '#1E293B')
  const [responsible, setResp]      = useState(org.responsible || '')
  const [stamp, setStamp]           = useState(org.stamp || '')
  const [autoscout, setAutoscout]   = useState(org.autoscout || '')
  const [mobilede, setMobilede]     = useState(org.mobilede || '')
  const [cargr, setCargr]           = useState(org.cargr || '')
  const [facebook, setFacebook]     = useState(org.facebook || '')
  const [storeCost, setStoreCost]   = useState(String(org.defaultStoreCost || 8))
  const [transport, setTransport]   = useState(String(org.defaultTransportCostPerKm || 1.2))
  const [targetProfit, setTargetProfit] = useState(String(getEffectiveTargetProfit(org)))

  useEffect(() => {
    setName(org.name || '')
    setVat(org.vat || '')
    setTaxOffice(org.taxOffice || '')
    setCountry(org.country || '')
    setAddress(org.address || '')
    setCity(org.city || '')
    setZip(org.zip || '')
    setPhone(org.phone || '')
    setEmail(org.email || '')
    setWebsite(org.website || '')
    setLogo(org.logo || '')
    setPrimary(org.primaryColor || '#6366F1')
    setSecondary(org.secondaryColor || '#1E293B')
    setResp(org.responsible || '')
    setStamp(org.stamp || '')
    setAutoscout(org.autoscout || '')
    setMobilede(org.mobilede || '')
    setCargr(org.cargr || '')
    setFacebook(org.facebook || '')
    setStoreCost(String(org.defaultStoreCost || 8))
    setTransport(String(org.defaultTransportCostPerKm || 1.2))
    setTargetProfit(String(getEffectiveTargetProfit(org)))
  }, [org])

  const save = async () => {
    const newOrg: OrgData = {
      id: org.id || 'default', name, vat, taxOffice, country, address, city, zip,
      phone, email, website, logo, primaryColor: primary, secondaryColor: secondary,
      responsible, stamp, autoscout, mobilede, cargr, facebook,
      defaultStoreCost: parseFloat(storeCost) || 8,
      defaultTransportCostPerKm: parseFloat(transport) || 1.2,
      marginTarget: typeof org.marginTarget === 'number' ? org.marginTarget : undefined,
      targetProfit: parseFloat(targetProfit) || 2000,
    }
    setSaving(true)
    setSaveError('')
    const ok = await saveSetting({ org: newOrg as unknown as typeof settings.org })
    setSaving(false)
    if (!ok) {
      setSaved(false)
      setSaveError(tx('settings.saveFailed'))
      return
    }
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

  const SECTIONS: { key: Section; icon: string; label: string }[] = [
    { key: 'company',     icon: '🏢', label: tx('settings.section.company') },
    { key: 'branding',    icon: '🎨', label: tx('settings.section.branding') },
    { key: 'documents',   icon: '📄', label: tx('settings.section.documents') },
    { key: 'marketplace', icon: '🌐', label: tx('settings.section.marketplace') },
    { key: 'financials',  icon: '💶', label: tx('settings.section.financials') },
    { key: 'backup',      icon: '💾', label: tx('settings.section.backup') },
  ]

  return (
    <AppShell>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>
            {tx('settings.title')}
          </h1>
          <button className="btn btn-primary" onClick={() => void save()} disabled={saving}>
            {saving
              ? `⏳ ${tx('veh.saving')}`
              : saved
                ? `✅ ${tx('veh.saved')}`
                : `💾 ${tx('action.save')}`}
          </button>
        </div>

        {saveError && (
          <div style={{ marginBottom: 12, color: 'var(--danger)', fontSize: 13 }}>
            {saveError}
          </div>
        )}

        <div style={{ display:'flex', gap:4, marginBottom:16, flexWrap:'wrap' }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              style={{
                padding:'7px 12px', borderRadius:7, fontSize:13, cursor:'pointer',
                border: section===s.key ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: section===s.key ? '#EEF2FF' : 'var(--surface)',
                color: section===s.key ? 'var(--primary)' : 'var(--text2)',
                fontWeight: section===s.key ? 600 : 400,
              }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* COMPANY */}
        {section === 'company' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>🏢 {tx('settings.companyDetails')}</h2>
            <div className="field-row">
              <div className="field-group"><label>{tx('settings.companyName')} *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="ROSSI AUTO SRL" /></div>
              <div className="field-group"><label>VAT / {tx('settings.vatNumber')}</label><input value={vat} onChange={e=>setVat(e.target.value)} placeholder="IT12345678901" /></div>
            </div>
            <div className="field-row">
              <div className="field-group"><label>{tx('settings.taxOffice')}</label><input value={taxOffice} onChange={e=>setTaxOffice(e.target.value)} /></div>
              <div className="field-group">
                <label>{tx('field.country')}</label>
                <select value={country} onChange={e=>setCountry(e.target.value)}>
                  <option value="">—</option>
                  <option value="IT">🇮🇹 Italia</option>
                  <option value="GR">🇬🇷 Ελλάδα</option>
                  <option value="DE">🇩🇪 Deutschland</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="ES">🇪🇸 España</option>
                </select>
              </div>
            </div>
            <div className="field-group"><label>{tx('field.address')}</label><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Via Roma 1" /></div>
            <div className="field-row">
              <div className="field-group"><label>{tx('field.city')}</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ancona" /></div>
              <div className="field-group"><label>{tx('field.zip')}</label><input value={zip} onChange={e=>setZip(e.target.value)} placeholder="60100" /></div>
            </div>
            <div className="field-row">
              <div className="field-group"><label>{tx('field.phone')}</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+39 071..." /></div>
              <div className="field-group"><label>{tx('field.email')}</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="info@rossiauto.it" /></div>
            </div>
            <div className="field-group"><label>{tx('field.website')}</label><input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://rossiauto.it" /></div>
          </div>
        )}

        {/* BRANDING */}
        {section === 'branding' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:16 }}>🎨 {tx('settings.brandingTitle')}</h2>
            <div className="field-group">
              <label>{tx('settings.companyLogo')}</label>
              <input value={logo} onChange={e=>setLogo(e.target.value)} placeholder="https://..." />
              <div style={{ marginTop:8 }}>
                <label style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', textTransform:'none', fontSize:13 }}
                  className="btn btn-ghost">
                  📎 {tx('settings.uploadFile')}
                  <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" style={{ display:'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const r = new FileReader()
                      r.onload = ev => setLogo(ev.target?.result as string)
                      r.readAsDataURL(file)
                    }} />
                </label>
              </div>
              {logo && <img src={logo} alt="Logo preview" style={{ marginTop:8, height:50, maxWidth:200, objectFit:'contain', border:'1px solid var(--border)', borderRadius:6, padding:4 }} />}
              <div style={{ fontSize:11, color:'var(--text2)', marginTop:6 }}>{tx('settings.logoHelp')}</div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>{tx('settings.primaryColor')}</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} style={{ width:44, height:36, padding:2, cursor:'pointer' }} />
                  <input value={primary} onChange={e=>setPrimary(e.target.value)} style={{ fontFamily:'monospace', width:110 }} />
                </div>
              </div>
              <div className="field-group">
                <label>{tx('settings.secondaryColor')}</label>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} style={{ width:44, height:36, padding:2, cursor:'pointer' }} />
                  <input value={secondary} onChange={e=>setSecondary(e.target.value)} style={{ fontFamily:'monospace', width:110 }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop:12, padding:12, background:'var(--surface2)', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, color:'var(--text2)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{tx('settings.preview')}</div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                {logo ? <img src={logo} alt="" style={{ height:36, maxWidth:120, objectFit:'contain' }} />
                  : <div style={{ background:primary, color:'white', padding:'4px 12px', borderRadius:6, fontWeight:700, fontSize:13 }}>{name||'ACME AUTO'}</div>}
                <div style={{ fontWeight:600 }}>{name||tx('settings.companyName')}{city ? ` · ${city}` : ''}</div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {section === 'documents' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:8 }}>📄 {tx('settings.documentSettings')}</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>{tx('settings.documentSettingsHelp')}</p>
            <div className="field-group">
              <label>{tx('settings.responsible')}</label>
              <input value={responsible} onChange={e=>setResp(e.target.value)} placeholder="Marco Rossi" />
            </div>
            <div className="field-group" style={{ marginTop:12 }}>
              <label>{tx('settings.companyStamp')}</label>
              <div style={{ display:'flex', gap:12, alignItems:'center', marginTop:6 }}>
                {stamp ? <img src={stamp} alt="Stamp" style={{ height:70, maxWidth:130, objectFit:'contain', border:'1px solid var(--border)', borderRadius:6, padding:4 }} />
                  : <div style={{ width:110, height:70, border:'2px dashed var(--border)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text3)', fontSize:12 }}>{tx('settings.noStamp')}</div>}
                <label className="btn btn-ghost" style={{ cursor:'pointer', fontSize:13, textTransform:'none' }}>
                  📎 {tx('settings.uploadFile')}
                  <input type="file" accept=".png,.jpg,.jpeg" style={{ display:'none' }}
                    onChange={e => { const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setStamp(ev.target?.result as string); r.readAsDataURL(f) }} />
                </label>
                {stamp && <button className="btn btn-ghost" style={{ fontSize:12 }} onClick={()=>setStamp('')}>🗑️</button>}
              </div>
            </div>
          </div>
        )}

        {/* MARKETPLACE */}
        {section === 'marketplace' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:8 }}>🌐 {tx('settings.marketplaceLinks')}</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>{tx('settings.marketplaceHelp')}</p>
            {[
              { label:tx('settings.autoscoutUrl'), val:autoscout, set:setAutoscout },
              { label:tx('settings.mobiledeUrl'),  val:mobilede,  set:setMobilede },
              { label:tx('settings.cargrUrl'),     val:cargr,     set:setCargr },
              { label:tx('settings.facebookPage'), val:facebook,  set:setFacebook },
            ].map(f=>(
              <div key={f.label} className="field-group">
                <label>{f.label}</label>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder="https://..." />
              </div>
            ))}
          </div>
        )}

        {/* FINANCIALS */}
        {section === 'financials' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:8 }}>💶 {tx('settings.financialDefaults')}</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>{tx('settings.financialHelp')}</p>
            <div className="field-row">
              <div className="field-group">
                <label>{tx('settings.storageCostPerDay')}</label>
                <input type="number" value={storeCost} onChange={e=>setStoreCost(e.target.value)} min="0" step="0.5" />
              </div>
              <div className="field-group">
                <label>{tx('settings.transportCostPerKm')}</label>
                <input type="number" value={transport} onChange={e=>setTransport(e.target.value)} min="0" step="0.1" />
              </div>
            </div>
            <div className="field-group">
              <label>{tx('settings.targetProfit')}</label>
              <input type="number" value={targetProfit} onChange={e=>setTargetProfit(e.target.value)} min="0" step="100" />
            </div>
            <div style={{ marginTop:12, padding:12, background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8, fontSize:13 }}>
              <strong style={{ color:'#92400E' }}>{tx('settings.example')}:</strong>
              <div style={{ color:'#78350F', marginTop:4 }}>
                ⚠️ BMW X3 2021 — 97 {tx('settings.daysInStock')}<br/>
                {tx('settings.cost')}: <strong>€{(97 * (parseFloat(storeCost)||8)).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* BACKUP */}
        {section === 'backup' && (
          <div className="card">
            <h2 style={{ fontSize:15, fontWeight:700, marginTop:0, marginBottom:12 }}>💾 {tx('settings.backupExport')}</h2>
            <p style={{ fontSize:13, color:'var(--text2)', marginBottom:14 }}>{tx('settings.vehiclesInDatabase', { count: vehicles.length })}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button className="btn btn-ghost" onClick={exportJSON} style={{ justifyContent:'flex-start' }}>📥 {tx('settings.exportJson')}</button>
              <button className="btn btn-ghost" style={{ justifyContent:'flex-start' }}
                onClick={async () => { const { exportVehiclesToExcel } = await import('@/lib/xlsxExport'); exportVehiclesToExcel(vehicles, lang) }}>
                📊 {tx('settings.exportExcel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
