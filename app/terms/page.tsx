export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color: '#1F2937', lineHeight: 1.7 }}>
      <a href="/landing" style={{ color: '#6366F1', fontSize: 14, textDecoration: 'none' }}>&larr; Back to AutoFleet Pro</a>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: '#6B7280', marginBottom: 32 }}>Last updated: June 2026</p>

      <p>These Terms of Service ("Terms") govern your use of AutoFleet Pro (the "Service"), operated by an individual sole proprietor based in Greece ("we", "us"). By creating an account, you agree to these Terms.</p>

      <h2 style={sectionStyle}>1. The Service</h2>
      <p>AutoFleet Pro is a fleet management platform for used vehicle dealers, providing tools for inventory tracking, document management, financial overview, and related features ("the Service").</p>

      <h2 style={sectionStyle}>2. Eligibility</h2>
      <p>You must be at least 18 years old and have the authority to bind your business to these Terms to use the Service.</p>

      <h2 style={sectionStyle}>3. Free Trial</h2>
      <p>New accounts receive a free trial period (currently 1 month) with full access to the Service. After the trial ends, if no paid subscription is active, your account moves to a <strong>read-only mode</strong>: you can still view, export (Excel/PDF), and access your data, but cannot add, edit, or delete vehicles or settings until you subscribe to a paid plan. We do not delete your data when a trial expires.</p>

      <h2 style={sectionStyle}>4. Subscriptions and Payment</h2>
      <p>Paid plans are billed as described on our Pricing page. Payments are processed via PayPal or other payment providers we may introduce. Prices are listed in EUR and may be subject to applicable VAT. We may change pricing with reasonable advance notice; continued use after a price change constitutes acceptance.</p>

      <h2 style={sectionStyle}>5. Your Data and Content</h2>
      <p>You retain full ownership of all data you enter into AutoFleet Pro, including vehicle records, documents, and any customer data you choose to store. You are solely responsible for:</p>
      <ul style={listStyle}>
        <li>The accuracy of the data you enter</li>
        <li>Having a lawful basis to process any third-party personal data you input (e.g. buyer or seller details)</li>
        <li>Complying with applicable consumer protection, tax, and data protection laws in your jurisdiction</li>
      </ul>

      <h2 style={sectionStyle}>6. Public Vehicle Pages</h2>
      <p>When you mark a vehicle as "for sale," a public webpage is generated showing that vehicle's details, intended to be shared with potential buyers. You are responsible for ensuring the information you choose to publish is accurate and that you have the right to publish it (including any photos).</p>

      <h2 style={sectionStyle}>7. AI Features</h2>
      <p>AutoFleet Pro offers optional AI-assisted features (vehicle description generation, market value estimates) powered by third-party AI providers. These are provided "as is" — AI-generated content and estimates may contain errors and should be reviewed before use. We are not liable for decisions made based on AI-generated suggestions.</p>

      <h2 style={sectionStyle}>8. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul style={listStyle}>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to gain unauthorized access to other accounts or our systems</li>
        <li>Upload malicious code or attempt to disrupt the Service</li>
        <li>Resell or sublicense the Service without our written consent</li>
      </ul>

      <h2 style={sectionStyle}>9. Service Availability</h2>
      <p>We aim to keep the Service available and reliable but do not guarantee uninterrupted access. The Service is provided on an "as is" and "as available" basis, without warranties of any kind, to the maximum extent permitted by law.</p>

      <h2 style={sectionStyle}>10. Limitation of Liability</h2>
      <p>To the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including loss of profits or business opportunities. Our total liability for any claim shall not exceed the amount you paid us in the 3 months preceding the claim. Nothing in these Terms limits liability that cannot be excluded under applicable law (e.g. liability for gross negligence or willful misconduct).</p>

      <h2 style={sectionStyle}>11. Termination</h2>
      <p>You may cancel your subscription and stop using the Service at any time by contacting us. We may suspend or terminate accounts that violate these Terms. Upon termination, you may request export or deletion of your data as described in our Privacy Policy.</p>

      <h2 style={sectionStyle}>12. Changes to the Service or Terms</h2>
      <p>We may update these Terms or modify the Service from time to time. Material changes will be communicated via email or an in-app notice. Continued use after changes take effect constitutes acceptance.</p>

      <h2 style={sectionStyle}>13. Governing Law</h2>
      <p>These Terms are governed by the laws of Greece, without prejudice to any mandatory consumer or data protection rights you may have under the laws of your own country of residence within the EU.</p>

      <h2 style={sectionStyle}>14. Contact</h2>
      <p>Questions about these Terms: <a href="mailto:autofleetpro1@gmail.com">autofleetpro1@gmail.com</a></p>

      <p style={{ marginTop: 32, fontSize: 13, color: '#9CA3AF' }}>See also our <a href="/privacy" style={{color:'#6366F1'}}>Privacy Policy</a>.</p>
    </div>
  )
}

const sectionStyle = { fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }
const listStyle = { paddingLeft: 20, marginBottom: 16 }
