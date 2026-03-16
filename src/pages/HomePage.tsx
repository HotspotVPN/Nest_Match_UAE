import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, Users, Search, CheckCircle2, ArrowRight, FileText, BarChart2, UserPlus } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="home-page">
            {/* ═══ Section 1 — Hero (full viewport) ═══ */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 1.5rem 4rem', background: 'radial-gradient(circle at top, rgba(99,102,241,0.08) 0%, transparent 70%)' }}>
                <div style={{ maxWidth: '900px', width: '100%' }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--uaepass-green)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-muted)' }}>BUILT FOR LAW NO. 4 OF 2026 COMPLIANCE</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Legal shared rooms in Dubai.{'\n'}
                        <span className="text-gradient">Verified tenants. Compliant landlords.</span>
                    </h1>

                    {/* Subheadline */}
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '720px', margin: '0 auto 2.5rem' }}>
                        NestMatch digitises the official DLD Property Viewing Agreement and connects UAE PASS-verified landlords with identity-verified tenants. Every viewing is documented. Every listing is permitted.
                    </p>

                    {/* Search Bar */}
                    <Link to="/browse" style={{ textDecoration: 'none' }}>
                        <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '12px', padding: '0.5rem 0.5rem 0.5rem 1.25rem', gap: '0.75rem' }}>
                            <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            <span style={{ flex: 1, textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>I'm looking for a room in Dubai...</span>
                            <button className="btn btn-primary" style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.375rem', pointerEvents: 'none' }}>
                                Search <ArrowRight size={16} />
                            </button>
                        </div>
                    </Link>

                    {/* AI hint */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-purple-light)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-powered search coming soon</span>
                    </div>

                    {/* Secondary CTAs */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                        <Link to="/register?role=landlord" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#9b9bab', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
                            <Building2 size={16} /> I'm a Landlord / Operator
                        </Link>
                        <Link to="/register?role=tenant" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '0.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#9b9bab', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
                            <UserPlus size={16} /> Create Tenant Profile
                        </Link>
                    </div>

                    {/* NestMatch OS flow bar */}
                    <div style={{ marginTop: '3rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--brand-purple-light)' }}>NestMatch OS:</span> Search &rarr; Verify Identity &rarr; Book Viewing &rarr; Sign DLD Agreement &rarr; Move In
                        </div>
                        <Link to="/how-it-works" className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem' }}>
                            See how it works <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Section 2 — Compliance + Stakeholders ═══ */}
            <section style={{ padding: '6rem 0', background: 'var(--bg-surface-2)' }}>
                <div className="container">
                    {/* Row 1: Compliance Engine */}
                    <div className="glass-card" style={{ padding: '4rem', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The NestMatch <br /><span className="text-gradient">Compliance Engine</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                                We've digitised the legal requirements of Dubai's shared housing laws into a seamless experience.
                                Our platform acts as a neutral third-party ensuring every stay is documented and compliant.
                            </p>
                            <Link to="/how-it-works" className="btn btn-secondary">
                                See how it works <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {[
                                { icon: ShieldCheck, title: 'Three-Tier Identity', desc: 'Browse with email, verify with passport, or authenticate with UAE PASS — access scales with your verification level.' },
                                { icon: FileText, title: 'Official DLD Viewing Agreements', desc: 'Every confirmed viewing generates a DLD Property Viewing Agreement (Ref: DLD/RERA/RL/LP/P210), signed digitally by both parties.' },
                                { icon: Building2, title: 'Permit-Verified Listings', desc: 'Every listing is checked for a valid Trakheesi advertising permit, shared-housing permit, and 10-digit Makani number before going live.' },
                                { icon: BarChart2, title: 'Demand Intelligence', desc: 'Real-time data on how many verified tenants are searching each area, budget band, and room type — so landlords price and market smarter.' }
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <Icon size={24} style={{ color: 'var(--brand-purple-light)', marginBottom: '0.75rem' }} />
                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Row 2: Stakeholder Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Landlords & Operators */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: 'var(--brand-purple-light)', marginBottom: '1.5rem' }}>
                                <Building2 size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Landlords & Operators</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                List your shared-housing units on a platform built for compliance. Reach verified tenants and manage viewings with full DLD documentation.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    'DLD Permit Verification',
                                    'Occupancy Cap Enforcement',
                                    'DLD Viewing Agreement Generation',
                                    'Demand Intelligence Dashboard'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Residents */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(20,184,166,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: '#14b8a6', marginBottom: '1.5rem' }}>
                                <Users size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Residents</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Already living in shared housing? Keep your stay documented and build a verifiable Good Conduct Certificate for your next move.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    'Signed DLD Viewing Agreements on File',
                                    'Maintenance Request Ticketing',
                                    'Good Conduct Certificate Building',
                                    'Verified Residency Timeline'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: '#14b8a6' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Room Seekers */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: '#f59e0b', marginBottom: '1.5rem' }}>
                                <Search size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Room Seekers</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Find verified rooms and flatmates in Dubai. No fake listings, no illegal partitions, no cash viewings with strangers.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    'Permit-Verified Listings Only',
                                    'Identity-Verified Flatmates',
                                    'DLD Viewing Agreement Protection',
                                    'Lifestyle & Location Matching'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: '#f59e0b' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
