import Footer from '@/components/Footer';

const sectionStyle: React.CSSProperties = {
    marginBottom: '2.5rem',
};

const headingStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: 'var(--text-primary)',
};

const paraStyle: React.CSSProperties = {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.8,
    marginBottom: '0.75rem',
};

const listStyle: React.CSSProperties = {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.8,
    paddingLeft: '1.5rem',
    marginBottom: '0.75rem',
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Privacy Policy</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>How NestMatch handles your data</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Last updated: March 2026</p>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>1. What We Collect</h2>
                    <p style={paraStyle}>When you use NestMatch, we may collect the following information:</p>
                    <ul style={listStyle}>
                        <li>Account information (name, email, phone number)</li>
                        <li>Identity documents (passport, visa, Emirates ID) uploaded for verification</li>
                        <li>UAE PASS data (Emirates ID number, verification status) when you authenticate via UAE PASS</li>
                        <li>Search preferences (budget range, preferred areas, room type, lifestyle tags)</li>
                        <li>Viewing history (properties viewed, viewings booked, DLD agreements signed)</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>2. How We Store It</h2>
                    <p style={paraStyle}>
                        All data is stored on Cloudflare infrastructure. Structured data lives in Cloudflare D1 (SQLite at the edge).
                        KYC documents are stored in a private Cloudflare R2 bucket with no public access.
                    </p>
                    <p style={paraStyle}>
                        Emirates ID numbers and passport numbers are masked in the UI and stored with limited access.
                        We do not operate local servers — all infrastructure runs on Cloudflare's global edge network.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>3. Who Sees Your Data</h2>
                    <p style={paraStyle}>Access to your data is limited and role-based:</p>
                    <ul style={listStyle}>
                        <li><strong>Compliance team:</strong> Reviews KYC documents for identity verification purposes only.</li>
                        <li><strong>Landlords:</strong> See your profile and lifestyle tags only after a viewing is confirmed. They do not see raw identity documents.</li>
                        <li><strong>Other tenants:</strong> See only your lifestyle tags on applicant cards (e.g. "non-smoker", "quiet hours preferred"). No personal data is shared.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>4. UAE Data Protection</h2>
                    <p style={paraStyle}>
                        NestMatch complies with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.
                    </p>
                    <p style={paraStyle}>Under this law, you have the right to:</p>
                    <ul style={listStyle}>
                        <li>Access all personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account and associated data</li>
                    </ul>
                    <p style={paraStyle}>
                        To exercise any of these rights, contact us at{' '}
                        <a href="mailto:privacy@nestmatch.ae" style={{ color: 'var(--brand-purple-light)' }}>privacy@nestmatch.ae</a>.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>5. Data We Do NOT Collect</h2>
                    <p style={paraStyle}>NestMatch explicitly does not collect:</p>
                    <ul style={listStyle}>
                        <li>Bank account or credit/debit card information</li>
                        <li>Biometric data beyond what UAE PASS provides (we do not perform facial recognition or fingerprint scanning)</li>
                        <li>Location tracking or GPS data</li>
                        <li>Social media profiles or browsing activity outside NestMatch</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
}
