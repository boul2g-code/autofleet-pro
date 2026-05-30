/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Lang = 'en' | 'it' | 'de' | 'el' | 'fr' | 'es'

const T: Record<string, Record<Lang, string>> = {
  hero: {
    en: 'The Fleet Management System for Used Vehicle Dealers',
    it: 'Il sistema di gestione flotta per commercianti di veicoli usati',
    de: 'Das Flottenmanagement-System für Gebrauchtwagenhändler',
    el: 'Το σύστημα διαχείρισης στόλου για εμπόρους μεταχειρισμένων',
    fr: "Le système de gestion de flotte pour marchands de véhicules d'occasion",
    es: 'El sistema de gestión de flota para comerciantes de vehículos usados',
  },
  sub: {
    en: 'Track every vehicle from purchase to delivery. CMR, financials, documents — all in one place.',
    it: "Traccia ogni veicolo dall'acquisto alla consegna. CMR, finanze, documenti — tutto in un posto.",
    de: 'Verfolge jedes Fahrzeug vom Kauf bis zur Lieferung. CMR, Finanzen, Dokumente — alles an einem Ort.',
    el: 'Παρακολούθησε κάθε όχημα από την αγορά έως την παράδοση. CMR, οικονομικά, έγγραφα — όλα σε ένα μέρος.',
    fr: "Suivez chaque véhicule de l'achat à la livraison. CMR, finances, documents — tout en un seul endroit.",
    es: 'Rastrea cada vehículo desde la compra hasta la entrega. CMR, finanzas, documentos — todo en un lugar.',
  },
  trial: {
    en: 'Start Free Trial', it: 'Inizia Prova Gratuita', de: 'Kostenlos testen',
    el: 'Δωρεάν Δοκιμή', fr: 'Essai Gratuit', es: 'Prueba Gratuita',
  },
  features: {
    en: 'Everything you need', it: 'Tutto ciò che ti serve', de: 'Alles was Sie brauchen',
    el: 'Όλα όσα χρειάζεσαι', fr: 'Tout ce dont vous avez besoin', es: 'Todo lo que necesitas',
  },
  pricing_link: {
    en: 'See Pricing', it: 'Vedi Prezzi', de: 'Preise ansehen',
    el: 'Δείτε Τιμές', fr: 'Voir les Prix', es: 'Ver Precios',
  },
}

const FEATURES = [
  { icon: '🚗', en: 'Complete vehicle file', it: 'Scheda veicolo completa', de: 'Vollständige Fahrzeugakte', el: 'Πλήρης καρτέλα οχήματος', fr: 'Fiche véhicule complète', es: 'Ficha de vehículo completa' },
  { icon: '📋', en: 'CMR generation in 1 click', it: 'CMR in 1 click', de: 'CMR in 1 Klick', el: 'CMR σε 1 κλικ', fr: 'CMR en 1 clic', es: 'CMR en 1 clic' },
  { icon: '💶', en: 'Automatic P&L per vehicle', it: 'P&L automatico per veicolo', de: 'Automatisches P&L pro Fahrzeug', el: 'Αυτόματο P&L ανά όχημα', fr: 'P&L automatique par véhicule', es: 'P&L automático por vehículo' },
  { icon: '📱', en: 'Works on phone & PC', it: 'Funziona su telefono e PC', de: 'Funktioniert auf Handy & PC', el: 'Δουλεύει σε κινητό & PC', fr: 'Fonctionne sur téléphone & PC', es: 'Funciona en teléfono y PC' },
  { icon: '🌍', en: '6 languages', it: '6 lingue', de: '6 Sprachen', el: '6 γλώσσες', fr: '6 langues', es: '6 idiomas' },
  { icon: '☁️', en: 'Real-time cloud sync', it: 'Sincronizzazione cloud in tempo reale', de: 'Echtzeit-Cloud-Synchronisation', el: 'Real-time συγχρονισμός', fr: 'Synchronisation cloud en temps réel', es: 'Sincronización en la nube en tiempo real' },
  { icon: '📄', en: 'Document upload + AI extraction', it: 'Upload documenti + estrazione AI', de: 'Dokumenten-Upload + KI-Extraktion', el: 'Upload εγγράφων + AI εξαγωγή', fr: 'Upload documents + extraction IA', es: 'Subida documentos + extracción IA' },
  { icon: '🔗', en: 'Public vehicle link + QR code', it: 'Link pubblico veicolo + QR code', de: 'Öffentlicher Fahrzeug-Link + QR-Code', el: 'Δημόσιος σύνδεσμος + QR code', fr: 'Lien public véhicule + QR code', es: 'Enlace público vehículo + código QR' },
  { icon: '📊', en: 'Fleet manifest & analytics', it: 'Manifesto flotta e analisi', de: 'Flottenmanifest & Analysen', el: 'Μανιφέστο στόλου & αναλυτικά', fr: 'Manifeste de flotte & analyses', es: 'Manifiesto de flota y análisis' },
]

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'el', flag: '🇬🇷', label: 'EL' },
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const bl = navigator.language.slice(0, 2) as Lang
    if (['en','it','de','el','fr','es'].includes(bl)) setLang(bl)
  }, [])

  const tr = (key: string) => T[key]?.[lang] || T[key]?.en || key

  return (
    <div style={{ background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1e293b', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🚗</span>
        <span style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>AutoFleet Pro</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              style={{ background: lang === l.code ? '#3b82f6' : 'transparent', border: 'none', borderRadius: 4, padding: '3px 7px', cursor: 'pointer', fontSize: 13, color: '#f1f5f9' }}>
              {l.flag}
            </button>
          ))}
        </div>
        <Link href="/login" style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Login
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚗🚛🚐</div>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 800, maxWidth: 700, margin: '0 auto 16px', lineHeight: 1.2 }}>
          {tr('hero')}
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          {tr('sub')}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ background: '#3b82f6', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            {tr('trial')} →
          </Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#94a3b8', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 16, border: '1px solid #334155' }}>
            {tr('pricing_link')}
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: '#475569' }}>14 days free · No credit card required</p>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 40 }}>{tr('features')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#1e293b', borderRadius: 12, padding: '20px', border: '1px solid #334155' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{(f as Record<string, string>)[lang] || f.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#1e293b', padding: '60px 24px', textAlign: 'center', borderTop: '1px solid #334155' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>€49/month</h2>
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Unlimited vehicles · All features · 6 languages</p>
        <Link href="/contact" style={{ background: '#22c55e', color: 'white', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
          {tr('trial')} →
        </Link>
      </div>

      <div style={{ textAlign: 'center', padding: 24, color: '#475569', fontSize: 13 }}>
        © 2025 AutoFleet Pro · autofleetpro1@gmail.com
      </div>
    </div>
  )
}
