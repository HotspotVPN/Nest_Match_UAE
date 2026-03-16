import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, Users, Search, CheckCircle2, Award, ArrowRight, Shield, ScrollText, Wallet, FileText, BarChart2 } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="section hero-section" style={{ padding: '8rem 0 6rem', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(99,102,241,0.08) 0%, transparent 70%)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--uaepass-green)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--text-muted)' }}>BUILT FOR LAW NO. 4 OF 2026 COMPLIANCE</span>
                    </div>
                    
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Legal shared rooms in Dubai, <span className="text-gradient">without the grey-market risk.</span>
                    </h1>
                    
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6 }}>
                        NestMatch connects landlords with shared-housing permits to verified UAE PASS roommates. 
                        We automate Ejari, contracts, rent ledgers, and compliance for the new regulatory regime.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Link to="/login?intent=landlord" className="btn btn-primary btn-lg">
                            <Building2 size={20} /> I'm a Landlord / Operator
                        </Link>
                        <Link to="/browse" className="btn btn-secondary btn-lg">
                            <Search size={20} /> I'm looking for a room
                        </Link>
                        <Link to="/login?intent=roommate" className="btn btn-ghost" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            Create Tenant Profile
                        </Link>
                    </div>

                    {/* Engine Overview Strip */}
                    <div style={{ marginTop: '4rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                           <span style={{ color: 'var(--brand-purple-light)' }}>NestMatch OS:</span> Search → Verify Identity → Book Viewing → Sign DLD Agreement → Move In
                        </div>
                        <Link to="/how-it-works" className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem' }}>
                            See how it works <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', opacity: 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="https://www.uaepass.ae/assets/images/uae-pass-logo.png" alt="UAE PASS" style={{ height: '18px', filter: 'grayscale(1) invert(1)' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Powered by UAE PASS</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>DLD & Municipality Aligned</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Engine Section - MOVED UP */}
            <section className="section" style={{ padding: '6rem 0', background: 'var(--bg-surface-2)' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The NestMatch <br/><span className="text-gradient">Compliance Engine</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                                We've digitized the legal requirements of Dubai's shared housing laws into a seamless experience. 
                                Our platform acts as a neutral third-party ensuring every stay is documented and compliant.
                            </p>
                            <Link to="/how-it-works" className="btn btn-secondary">
                                Learn about our Engine <ArrowRight size={18} />
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
                </div>
            </section>

            {/* Who It's For Section */}
            <section className="section" style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Designed for Dubai's Housing Ecosystem</h2>
                        <p style={{ color: 'var(--text-muted)' }}>A specialized platform for every stakeholder in shared living.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Landlords */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: 'var(--brand-purple-light)', marginBottom: '1.5rem' }}>
                                <Building2 size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Landlords & Licensed Operators</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Convert your spare rooms and bedspaces into fully compliant shared housing. Permits, Ejari, contracts and rent tracking in one integrated platform.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    'DLD Permit Verification',
                                    'Automated Occupancy Caps',
                                    'Wallet & Ledger Tracking',
                                    'Legal Contract Builder'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--uaepass-green)' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Residing Roommates */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: 'var(--uaepass-green)', marginBottom: '1.5rem' }}>
                                <Users size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Roommates Already Residing</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Keep your lease legal, track payments and maintenance, and build a Good Conduct Certificate you can take to your next landlord.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    'Ejari-aligned Sub-leases',
                                    'Maintenance Ticketing',
                                    'GCC Trust Score Building',
                                    'Verified Payment History'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--uaepass-green)' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Searching Roommates */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-lg)', width: 'fit-content', color: '#f59e0b', marginBottom: '1.5rem' }}>
                                <Search size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Roommates Searching</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Find verified rooms and flatmates in Dubai. No fake listings, no illegal partitions, no cash viewings with strangers.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    '100% Verified DLD Listings',
                                    'Identity-Verified Flatmates',
                                    'Secure Deposit Escrow',
                                    'Lifestyle Matching'
                                ].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <CheckCircle2 size={16} style={{ color: 'var(--uaepass-green)' }} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <div className="container">
                    <div className="glass-card" style={{ padding: '4rem', background: 'linear-gradient(135deg, var(--brand-purple) 0%, #4338ca 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready for a more <br/>professional rental experience?</h2>
                            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                                Join 5,000+ residents and 200+ property operators already using NestMatch to stay legal and secure in Dubai.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/login" className="btn" style={{ background: 'white', color: 'var(--brand-purple)', padding: '1rem 2rem', fontWeight: 700 }}>
                                    Launch Dashboard
                                </Link>
                                <Link to="/browse" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                                    Browse Legal Rooms
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
