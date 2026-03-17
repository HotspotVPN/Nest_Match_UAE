import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Calendar, CheckCircle2, FileText, Home,
    Check, X, ChevronDown, ArrowRight, Award, Building2
} from 'lucide-react';

export default function HowItWorksPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

    const faqs = [
        {
            q: 'Can I really use NestMatch before I have my Emirates ID?',
            a: 'Yes. Tier 0 (New Arrival) lets you browse listings, request viewings, message landlords, and sign DLD Property Viewing Agreements using just your passport and UAE visa. The only thing you cannot do until your Emirates ID is issued is sign a tenancy contract — because that requires an Emirates ID by law.'
        },
        {
            q: 'How is my passport data kept secure?',
            a: 'All identity documents are encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted to our compliance team for verification purposes only. We comply with UAE Federal Law No. 45 of 2021 (Personal Data Protection) and never share your documents with third parties without your explicit consent.'
        },
        {
            q: 'Does NestMatch handle rent payments or deposits?',
            a: 'NestMatch does not collect rent or hold deposits. We are a viewing-and-agreement platform. Once you and the landlord agree to proceed, your RERA-licensed broker handles the tenancy contract, Ejari registration, and deposit collection according to Dubai rental law.'
        }
    ];

    return (
        <div className="section" style={{ paddingTop: '4rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>

                {/* ─── SECTION 1 — Hero ─── */}
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        How NestMatch UAE Works
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        From first landing in Dubai to fully verified co-living — we meet you exactly where you are.
                    </p>
                </div>

                {/* ─── SECTION 2 — Three Identity Tiers ─── */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Tier 0. Tier 1. Tier 2. Your level unlocks your access.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            No other platform in the UAE meets new arrivals before they have their Emirates ID.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="tier-grid">
                        {/* Card 1 — Tier 0 Explorer (browse-only) */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--text-muted)' }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(128,128,128,0.15)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                                Tier 0 — Explorer
                            </span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Exploring your options?</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                You're curious about the Dubai co-living market but not ready to share documents yet. No problem — create an account and start exploring.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you can do</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['Browse listings', 'Save favourites'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                                {['Request viewings', 'Message landlords', 'Sign agreements'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <X size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>How to start</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                Sign in with email or Google — no documents needed to start browsing.
                            </p>
                        </div>

                        {/* Card 2 — Tier 1 Verified (new arrival / passport) */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                                Tier 1 — Verified
                            </span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Just landed in Dubai?</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                You have a passport and a UAE visa but your Emirates ID is still processing. That's completely normal — and you're welcome on NestMatch from day one.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you can do</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['Browse listings', 'Request viewings', 'Message landlords', 'Sign DLD Viewing Agreement'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <X size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> Sign tenancy contract (needs Emirates ID)
                                </li>
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>How to start</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                                Sign in with Google or email → upload your passport biodata page and UAE visa stamp → start booking viewings within minutes.
                            </p>

                            <div style={{ background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>KYC note:</strong> Your documents are reviewed by our compliance team within 24 hours and stored securely in compliance with UAE Federal Law No. 45 of 2021.
                            </div>
                        </div>

                        {/* Card 3 — Tier 2 Gold */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--success)' }}>
                            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.15)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                                Tier 2 — Gold
                            </span>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>UAE Resident with Emirates ID?</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                You have an active Emirates ID and can authenticate via UAE PASS. This gives you the highest trust level and full platform access.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you can do</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['Browse listings', 'Request viewings', 'Message landlords', 'Sign DLD Viewing Agreement', 'Sign tenancy contract'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>How to start</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                Click &lsquo;Login with UAE PASS&rsquo; → authorise in the UAE PASS app → full access in under 2 minutes.
                            </p>
                        </div>
                    </div>

                    {/* Responsive CSS for tier grid */}
                    <style>{`
                        @media (max-width: 900px) {
                            .tier-grid { grid-template-columns: 1fr !important; }
                        }
                    `}</style>
                </div>

                {/* ─── SECTION 3 — Viewing Journey ─── */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>From Discovery to Signed Agreement</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
                            Every viewing on NestMatch generates an official DLD Property Viewing Agreement — a digital record signed by both parties.
                        </p>
                    </div>

                    {/* Horizontal timeline */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }} className="timeline-row">
                        {/* Connecting line */}
                        <div className="timeline-line" style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '2px', background: 'var(--border-subtle)', zIndex: 0 }} />

                        {[
                            { num: 1, icon: Search, title: 'Browse & Shortlist', desc: 'Filter by district, budget, transport links, and lifestyle. Every listing shows real occupancy, Makani number, and Trakheesi permit.' },
                            { num: 2, icon: Calendar, title: 'Request a Viewing', desc: 'Pick a date and time. Your verified identity is held securely — shared with the landlord only on confirmation.' },
                            { num: 3, icon: CheckCircle2, title: 'Landlord Confirms', desc: 'The landlord or RERA-licensed agent accepts your request. Both parties are notified immediately.' },
                            { num: 4, icon: FileText, title: 'Sign the DLD Agreement', desc: 'NestMatch auto-generates the official DLD Property Viewing Agreement (Ref: DLD/RERA/RL/LP/P210). Both parties sign digitally.' },
                            { num: 5, icon: Home, title: 'Attend & Proceed', desc: 'Attend the viewing. If it\'s the right fit, your signed DLD agreement goes to your RERA-licensed broker.' }
                        ].map(step => {
                            const Icon = step.icon;
                            return (
                                <div key={step.num} style={{ flex: '1 1 160px', textAlign: 'center', position: 'relative', zIndex: 1, minWidth: '160px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '50%',
                                        background: 'var(--bg-surface-2)', border: '2px solid var(--brand-purple-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1rem', fontWeight: 800, color: 'var(--brand-purple-light)', fontSize: '1rem'
                                    }}>
                                        {step.num}
                                    </div>
                                    <Icon size={20} style={{ color: 'var(--brand-purple-light)', marginBottom: '0.5rem' }} />
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <style>{`
                        @media (max-width: 768px) {
                            .timeline-row { flex-direction: column; align-items: center; }
                            .timeline-line { display: none !important; }
                        }
                    `}</style>

                    {/* Compliance disclaimer */}
                    <div style={{ marginTop: '2.5rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
                        NestMatch is not a property management company, brokerage, or escrow service. We are a technology platform that facilitates verified viewings and generates DLD-compliant viewing agreements between parties. All tenancy contracts, Ejari registration, and deposits are handled by RERA-licensed brokers.
                    </div>
                </div>

                {/* ─── SECTION 4 — For Landlords & Agents ─── */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>For Landlords &amp; Agents</h2>
                    </div>

                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }} className="landlord-grid">
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Why list on NestMatch?</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {[
                                        'Every tenant who books a viewing is identity-verified',
                                        'DLD Viewing Agreements are auto-generated and legally signed',
                                        'Your Trakheesi and shared-housing permits are displayed on every listing',
                                        'Demand data shows how many tenants are searching your area and budget range'
                                    ].map(item => (
                                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            <Check size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '3px' }} /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>What you need to get started</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {[
                                        'A valid Dubai shared-housing permit from Dubai Municipality',
                                        'A Trakheesi advertising permit from DLD',
                                        'Your property\'s 10-digit Makani number',
                                        'A RERA-licensed broker or agent (if applicable)'
                                    ].map(item => (
                                        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            <Check size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '3px' }} /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <style>{`
                            @media (max-width: 768px) {
                                .landlord-grid { grid-template-columns: 1fr !important; }
                            }
                        `}</style>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <Link to="/login?intent=landlord" className="btn btn-primary btn-lg">
                                List your property <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── SECTION 5 — Supply-Side Partners ─── */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>For Landlords, Agents &amp; Property Companies</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto' }}>
                            Every supply-side partner on NestMatch is verified, permitted, and DLD-aligned.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="supply-grid">
                        {/* Card A — Individual Landlord */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--brand-purple-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Home size={20} style={{ color: 'var(--brand-purple-light)' }} />
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(139,92,246,0.15)', color: 'var(--brand-purple-light)', fontSize: '0.75rem', fontWeight: 700 }}>
                                    Self-Managed
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Individual Landlord</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                <strong>Who:</strong> You own one or more Dubai properties and manage them directly without a broker.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you need</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['UAE PASS verification (Tier 2 — Gold)', 'Valid Trakheesi advertising permit', 'Municipality shared-housing permit', "Property's 10-digit Makani number"].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <X size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> RERA BRN not required (self-managed)
                                </li>
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you get</div>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <li>Viewing requests from verified tenants</li>
                                <li>Auto-generated DLD Viewing Agreement</li>
                                <li>Occupancy dashboard per property</li>
                                <li>Applicant profiles with GCC scores</li>
                            </ul>

                            <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Example:</strong> Ahmed Al Maktoum, Fatima Hassan (both Gold verified)
                            </div>
                        </div>

                        {/* Card B — RERA Licensed Agent */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Award size={20} style={{ color: '#f59e0b' }} />
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
                                    BRN Verified
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>RERA Licensed Agent</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                <strong>Who:</strong> You hold a RERA Broker Registration Number and manage properties on behalf of landlords.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you need</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['UAE PASS (Tier 2 — Gold)', 'Active RERA BRN', "Client landlord's Trakheesi permit", 'Makani number for each managed property', 'Agency ORN'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you get</div>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <li>BRN badge on listings</li>
                                <li>Multiple landlord portfolios</li>
                                <li>DLD Agreement pre-filled with ORN/BRN</li>
                                <li>Agent performance analytics</li>
                            </ul>

                            <div style={{ background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Example:</strong> Khalid Al Rashid (BRN-2025-12345, Dubai Property Group)
                            </div>
                        </div>

                        {/* Card C — Property Company */}
                        <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--success)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Building2 size={20} style={{ color: 'var(--success)' }} />
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.15)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 700 }}>
                                    Corporate Account
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Property Company</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                <strong>Who:</strong> A registered UAE company owning or managing a portfolio of shared housing units.
                            </p>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you need</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {['UAE PASS for authorised signatory', 'Trade licence', 'RERA registration', 'Trakheesi permits per unit', 'Makani numbers per unit'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                                    </li>
                                ))}
                            </ul>

                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>What you get</div>
                            <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <li>Multi-unit portfolio dashboard</li>
                                <li>Bulk listing management</li>
                                <li>Corporate tenant matching</li>
                                <li>White-label compliance layer</li>
                                <li>All viewing agreements under one account</li>
                            </ul>

                            <div style={{ background: 'rgba(20,184,166,0.08)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                <strong>Note:</strong> Corporate accounts are currently onboarded by invitation. Contact us at partners@nestmatch.ae
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @media (max-width: 900px) {
                            .supply-grid { grid-template-columns: 1fr !important; }
                        }
                    `}</style>

                    {/* Compliance note */}
                    <div className="glass-card" style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--brand-purple-light)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        All listings on NestMatch are manually reviewed before going live. We verify Trakheesi permit validity and Makani number accuracy with DLD records. Unverified listings are not shown to tenants.
                    </div>
                </div>

                {/* ─── SECTION 6 — FAQ ─── */}
                <div style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', textAlign: 'left'
                                    }}
                                >
                                    {faq.q}
                                    <ChevronDown size={18} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }} />
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
