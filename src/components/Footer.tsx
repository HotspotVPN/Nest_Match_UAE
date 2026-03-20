import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '40px 1.5rem',
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    NestMatch UAE — Property discovery platform
                </p>

                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto 1.5rem' }}>
                    NestMatch is a property discovery and compliance platform. We are not a property management company, RERA-licensed broker, or financial services provider. NestMatch does not process payments, hold deposits, or draft tenancy contracts.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <Link to="/privacy" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-purple-light)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        Privacy Policy
                    </Link>
                    <Link to="/terms" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-purple-light)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        Terms of Use
                    </Link>
                    <a href="mailto:privacy@nestmatch.ae" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-purple-light)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        Contact
                    </a>
                </div>

                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    &copy; 2026 NestMatch Technologies
                </p>
            </div>
        </footer>
    );
}
