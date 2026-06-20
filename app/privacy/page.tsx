export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#1F2937', lineHeight: 1.7 }}>
      <a href="/landing" style={{ color: '#6366F1', fontSize: 14, textDecoration: 'none' }}>&larr; Back to AutoFleet Pro</a>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#6B7280', marginBottom: 32 }}>Last updated: June 2026</p>

      <p>AutoFleet Pro ("we", "us", "our") provides a fleet management platform for vehicle dealers. This Privacy Policy explains what personal data we collect, how we use it, and your rights under the EU General Data Protection Regulation (GDPR) and applicable national laws (including Greek, Italian, and German data protection law).</p>

      <h2 style={sectionStyle}>1. Who We Are</h2>
      <p>AutoFleet Pro is operated by an individual sole proprietor based in Greece. For any privacy-related question, contact: <a href="mailto:autofleetpro1@gmail.com">autofleetpro1@gmail.com</a>.</p>

      <h2 style={sectionStyle}>2. What Data We Collect</h2>
      <p>We collect and process the following categories of personal data:</p>
      <ul style={listStyle}>
        <li><strong>Account data:</strong> email address and password (hashed), provided when you register.</li>
        <li><strong>Organization data:</strong> company name, VAT number, address, phone, logo — provided voluntarily in Settings.</li>
        <li><strong>Vehicle and customer data you enter:</strong> vehicle details, documents, and any buyer/seller information you choose to record. You are responsible for having a legal basis to enter third-party personal data (e.g. customer names) into the platform.</li>
        <li><strong>Usage and error data:</strong> via Sentry (error monitoring) we may collect browser type, IP address, page URLs, and session activity at the time of an error, to help us fix bugs.</li>
        <li><strong>Payment data:</strong> if you subscribe to a paid plan, payment is processed by a third-party provider (e.g. PayPal). We do not store your card or bank details ourselves.</li>
      </ul>

      <h2 style={sectionStyle}>3. Why We Process Your Data (Legal Basis)</h2>
      <ul style={listStyle}>
        <li><strong>Contract performance</strong> (Art. 6(1)(b) GDPR): to provide the AutoFleet Pro service you signed up for.</li>
        <li><strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR): to monitor and fix technical errors (Sentry), to prevent abuse, and to improve the product.</li>
        <li><strong>Consent</strong> (Art. 6(1)(a) GDPR): for optional marketing communications, where applicable.</li>
        <li><strong>Legal obligation</strong> (Art. 6(1)(c) GDPR): where required by tax or accounting law.</li>
      </ul>

      <h2 style={sectionStyle}>4. Where Your Data Is Stored</h2>
      <p>Your data is stored using Supabase (PostgreSQL database) and hosted on Vercel infrastructure. Sub-processors may store data in EU or US regions depending on their infrastructure; where data is transferred outside the EU/EEA, we rely on Standard Contractual Clauses or equivalent safeguards provided by our sub-processors.</p>

      <h2 style={sectionStyle}>5. Sub-processors We Use</h2>
      <ul style={listStyle}>
        <li><strong>Supabase</strong> — database and authentication</li>
        <li><strong>Vercel</strong> — application hosting</li>
        <li><strong>Sentry</strong> — error monitoring and session replay</li>
        <li><strong>Anthropic</strong> — AI-generated vehicle descriptions and market value estimates (only the data you submit for that specific feature is sent)</li>
        <li><strong>PayPal</strong> — payment processing (if you subscribe)</li>
      </ul>

      <h2 style={sectionStyle}>6. How Long We Keep Your Data</h2>
      <p>We retain your account and vehicle data for as long as your account is active. If you stop paying after a trial, your data remains stored but the account becomes read-only — it is <strong>not deleted</strong>. You can request permanent deletion at any time (see Section 8). Error monitoring data (Sentry) is retained for up to 90 days.</p>

      <h2 style={sectionStyle}>7. Public Vehicle Pages</h2>
      <p>If you mark a vehicle as "for sale", a public page is generated at a unique URL (e.g. autofleet-pro.vercel.app/v/[id]) showing that vehicle's details for sharing with potential buyers. Only vehicles you explicitly mark "for sale" are made public. You control what information appears there via the vehicle's fields.</p>

      <h2 style={sectionStyle}>8. Your Rights (GDPR)</h2>
      <p>Under GDPR, you have the right to:</p>
      <ul style={listStyle}>
        <li>Access the personal data we hold about you</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data ("right to be forgotten")</li>
        <li>Export your data in a portable format (you can do this anytime via the Excel/PDF export features)</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent at any time, where processing is based on consent</li>
        <li>Lodge a complaint with your national Data Protection Authority</li>
      </ul>
      <p>To exercise any of these rights, email <a href="mailto:autofleetpro1@gmail.com">autofleetpro1@gmail.com</a>. We will respond within 30 days.</p>

      <h2 style={sectionStyle}>9. Data Protection Authorities</h2>
      <p>You may lodge a complaint with the data protection authority in your country, for example:</p>
      <ul style={listStyle}>
        <li>Greece: Hellenic Data Protection Authority (dpa.gr)</li>
        <li>Italy: Garante per la protezione dei dati personali (garanteprivacy.it)</li>
        <li>Germany: your regional Landesdatenschutzbehörde</li>
      </ul>

      <h2 style={sectionStyle}>10. Cookies</h2>
      <p>AutoFleet Pro uses essential cookies required for authentication (Supabase Auth session cookies). We do not currently use advertising or third-party tracking cookies. If we add analytics tools like Microsoft Clarity in the future, this policy will be updated and a cookie consent banner will be added before activation.</p>

      <h2 style={sectionStyle}>11. Children</h2>
      <p>AutoFleet Pro is a B2B tool intended for business users (vehicle dealers) and is not directed at children. We do not knowingly collect data from individuals under 18.</p>

      <h2 style={sectionStyle}>12. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Material changes will be communicated by email or via a notice in the app.</p>

      <h2 style={sectionStyle}>13. Contact</h2>
      <p>For any privacy question or request: <a href="mailto:autofleetpro1@gmail.com">autofleetpro1@gmail.com</a></p>
    </div>
  )
}

const sectionStyle = { fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }
const listStyle = { paddingLeft: 20, marginBottom: 16 }
