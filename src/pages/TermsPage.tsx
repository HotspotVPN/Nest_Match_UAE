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

export default function TermsPage() {
    return (
        <>
            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Terms of Use</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>What NestMatch is and what it isn't</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Last updated: March 2026</p>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>1. What NestMatch IS</h2>
                    <p style={paraStyle}>NestMatch is:</p>
                    <ul style={listStyle}>
                        <li>A property discovery platform that connects verified tenants with permitted shared-housing listings in Dubai.</li>
                        <li>A digitisation layer for the DLD Property Viewing Agreement (Form P210), replacing paper-based processes with a signed digital workflow.</li>
                        <li>An identity verification system that uses UAE PASS, passport uploads, and Emirates ID to establish trust between parties.</li>
                        <li>A demand intelligence platform that provides landlords with anonymised data on tenant search patterns, helping them price and market listings effectively.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>2. What NestMatch is NOT</h2>
                    <p style={paraStyle}>NestMatch explicitly is not and does not provide:</p>
                    <ul style={listStyle}>
                        <li>Property management services — we do not manage properties, collect rent, or handle maintenance on behalf of landlords.</li>
                        <li>RERA-licensed brokerage — we do not act as a real estate broker and do not hold a RERA broker licence.</li>
                        <li>Payment processing — we do not process payments, hold deposits, collect rent, or operate escrow accounts. We hold no CBUAE or DIFC licence.</li>
                        <li>Ejari filing — we do not file or register tenancy contracts with Ejari on behalf of any party.</li>
                        <li>A guarantee of property condition — listings are verified for permits and compliance documentation, not physical condition. You must inspect the property in person.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>3. The DLD Viewing Agreement</h2>
                    <p style={paraStyle}>
                        NestMatch digitises the official DLD Property Viewing Agreement (Reference: DLD/RERA/RL/LP/P210). When a viewing is confirmed, the platform pre-fills this agreement with property details, landlord information, and tenant identity data from the platform.
                    </p>
                    <p style={paraStyle}>
                        This agreement documents the viewing event. It is NOT a tenancy contract, lease agreement, or commitment to rent. It does not create a landlord-tenant relationship.
                    </p>
                    <p style={paraStyle}>
                        After a viewing, if both parties wish to proceed, they should engage a RERA-licensed broker independently to negotiate and draft a tenancy contract.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>4. User Responsibilities</h2>
                    <p style={paraStyle}>By using NestMatch, you agree to:</p>
                    <ul style={listStyle}>
                        <li>Verify any property in person before making any rental decisions. Do not rely solely on listing photos or descriptions.</li>
                        <li>Engage RERA-licensed brokers independently for any tenancy contract negotiations.</li>
                        <li>Provide accurate and genuine identity documents during verification. Submitting fraudulent documents will result in immediate account termination.</li>
                        <li>Not use the platform for any purpose that violates UAE law.</li>
                    </ul>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>5. Verification Tiers</h2>
                    <p style={paraStyle}>NestMatch operates a three-tier verification system:</p>
                    <ul style={listStyle}>
                        <li><strong>Tier 0 — Explorer:</strong> Sign up with email or Google. Browse listings only. No viewing access.</li>
                        <li><strong>Tier 1 — Verified:</strong> Upload passport + visa or Emirates ID. Access viewings, chat, and DLD agreement signing.</li>
                        <li><strong>Tier 2 — Gold:</strong> Authenticate via UAE PASS (Emirates ID verification). Full platform access including applications and GCC.</li>
                    </ul>
                    <p style={paraStyle}>
                        Premium features are currently available at no cost during the platform's early access period.
                    </p>
                </div>

                <div style={sectionStyle}>
                    <h2 style={headingStyle}>6. Contact</h2>
                    <p style={paraStyle}>For questions or concerns, reach us at:</p>
                    <ul style={listStyle}>
                        <li>General enquiries: <a href="mailto:hello@nestmatch.ae" style={{ color: 'var(--brand-purple-light)' }}>hello@nestmatch.ae</a></li>
                        <li>Privacy and data requests: <a href="mailto:privacy@nestmatch.ae" style={{ color: 'var(--brand-purple-light)' }}>privacy@nestmatch.ae</a></li>
                        <li>Compliance and verification: <a href="mailto:compliance@nestmatch.ae" style={{ color: 'var(--brand-purple-light)' }}>compliance@nestmatch.ae</a></li>
                    </ul>
                </div>
            </div>
            <Footer />
        </>
    );
}
