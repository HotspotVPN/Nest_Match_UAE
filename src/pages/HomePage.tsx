import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Building2, Users, CreditCard, Award, MapPin, ArrowRight } from 'lucide-react';

export default function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-uaepass">🇦🇪 UAE PASS Verified</span>
                        <span className="badge badge-green">Law No. 4 Compliant</span>
                        <span className="badge badge-blue">RERA Approved</span>
                    </div>
                    <h1>
                        Find Your Perfect Nest<br />
                        <span className="gradient-text">In the UAE</span>
                    </h1>
                    <p className="hero-subtitle">
                        The region's first compliance-first co-living platform. Every listing is 100% legal,
                        every user is government-verified via UAE PASS, and every viewing is backed by our
                        Two-Way Commitment Hold.
                    </p>
                    <div className="hero-cta-group">
                        <Link to={isAuthenticated ? '/browse' : '/login'} className="btn btn-uaepass btn-lg">
                            <ShieldCheck size={20} /> Get Started with UAE PASS
                        </Link>
                        <Link to="/how-it-works" className="btn btn-outline btn-lg">
                            How It Works <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section">
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                        Built for <span className="gradient-text">Dubai's New Reality</span>
                    </h2>
                    <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Compliant with Dubai Law No. 4 of 2026 — protecting landlords from Dh500,000 fines
                        and tenants from fake listings.
                    </p>
                    <div className="grid-3">
                        {[
                            { icon: ShieldCheck, title: 'UAE PASS KYC', desc: 'Every user verified through the official National Digital Identity. No fake landlords or scammer tenants — ever.', color: 'var(--uaepass-green)' },
                            { icon: Building2, title: 'Makani + RERA Verified', desc: 'Every property requires a 10-digit Makani number, Trakheesi permit, and Municipality shared housing permit.', color: 'var(--brand-blue-light)' },
                            { icon: Users, title: 'Occupancy Capped', desc: 'Properties are automatically hidden when occupancy reaches the legal maximum — zero risk of overcrowding fines.', color: 'var(--brand-purple-light)' },
                            { icon: CreditCard, title: 'Two-Way Commitment Hold', desc: '50 AED hold prevents tenant no-shows. Landlord penalty prevents ghosting. Mutual accountability for every viewing.', color: 'var(--warning)' },
                            { icon: Award, title: 'Good Conduct Certificate', desc: 'Build a portable, verified rental track record. Premium tenants with a GCC get priority from landlords across the UAE.', color: '#f59e0b' },
                            { icon: MapPin, title: 'Anti-Discrimination Matching', desc: 'Landlords see lifestyle tags, not nationality. Blind matching promotes cross-cultural harmony in the world\'s most diverse country.', color: 'var(--success)' },
                        ].map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className="glass-card" style={{ padding: '2rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <Icon size={24} style={{ color: f.color }} />
                                    </div>
                                    <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
                                    <p style={{ fontSize: '0.875rem' }}>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section className="section" style={{ background: 'var(--gradient-surface)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        Three Roles. <span className="gradient-text">One Ecosystem.</span>
                    </h2>
                    <div className="grid-3">
                        {[
                            { title: 'Searching Roommate', desc: 'Browse 100% verified, legal listings. Book viewings with the Two-Way Hold. Build your GCC for priority access.', badge: 'Demand Side' },
                            { title: 'Residing Roommate', desc: 'Review anonymized lifestyle profiles of incoming applicants. Give your landlord a "vibe check" — no name, no photo, no bias.', badge: 'Community' },
                            { title: 'Landlord / Agent', desc: 'Post compliant listings. AI-filter applicants by GCC score. Full legal protection with Municipality permits and occupancy caps.', badge: 'Supply Side' },
                        ].map((r) => (
                            <div key={r.title} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>{r.badge}</span>
                                <h3 style={{ marginBottom: '0.75rem' }}>{r.title}</h3>
                                <p style={{ fontSize: '0.875rem' }}>{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
