import { Link, useSearchParams } from 'react-router-dom';
import { Shield, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Building2, UserPlus } from 'lucide-react';

export default function RegisterLandingPage() {
    const [params] = useSearchParams();
    const highlight = params.get('role'); // 'landlord' or 'tenant'

    const tenantHighlight = highlight === 'tenant';
    const landlordHighlight = highlight === 'landlord';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem' }}>
            <div style={{ maxWidth: '1040px', width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Join NestMatch</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>Choose your path to Dubai's compliant shared-housing platform.</p>
                </div>

                {/* Two-column split */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'stretch' }}>
                    {/* LEFT — Tenant */}
                    <div className="glass-card" style={{
                        padding: '2.5rem',
                        border: tenantHighlight ? '1px solid var(--brand-purple)' : '1px solid var(--border-subtle)',
                        boxShadow: tenantHighlight ? '0 0 30px rgba(124,58,237,0.15)' : 'none',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.625rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-purple-light)' }}>
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.375rem', marginBottom: '0.125rem' }}>Tenant</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find a room, book viewings, sign agreements</p>
                            </div>
                        </div>

                        {/* Tier progression */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            <span className="badge badge-orange" style={{ fontSize: '0.6875rem' }}>Tier 0 — Explorer</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center' }}>&rarr;</span>
                            <span className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>Tier 1 — Verified</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center' }}>&rarr;</span>
                            <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>Tier 2 — Gold</span>
                        </div>

                        {/* Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { step: '1', title: 'Create account', desc: 'Sign up with Google or email. You start at Tier 0 — Explorer.' },
                                { step: '2', title: 'Verify identity', desc: 'Upload passport or Emirates ID to reach Tier 1. Book viewings and chat with landlords.' },
                                { step: '3', title: 'Connect UAE PASS', desc: 'Authenticate via UAE PASS to unlock Tier 2 — Gold. Full access to apply for rooms.' },
                            ].map(s => (
                                <div key={s.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.15)', color: 'var(--brand-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>{s.step}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link to="/register/tenant" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                            Get Started as a Tenant <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Centre divider */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem' }}>
                        <div style={{ flex: 1, width: 1, background: 'var(--border-subtle)' }} />
                        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>OR</div>
                        <div style={{ flex: 1, width: 1, background: 'var(--border-subtle)' }} />
                    </div>

                    {/* RIGHT — Landlord */}
                    <div className="glass-card" style={{
                        padding: '2.5rem',
                        background: landlordHighlight ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.6)',
                        border: landlordHighlight ? '1px solid rgba(20,184,166,0.5)' : '1px solid var(--border-subtle)',
                        boxShadow: landlordHighlight ? '0 0 30px rgba(20,184,166,0.12)' : 'none',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.625rem', background: 'rgba(20,184,166,0.1)', borderRadius: 'var(--radius-md)', color: '#14b8a6' }}>
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.375rem', marginBottom: '0.125rem' }}>Landlord / Operator</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>List properties, manage viewings, stay compliant</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>
                                <ShieldCheck size={12} /> Tier 2 — Gold Required
                            </span>
                        </div>

                        {/* Steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { step: '1', title: 'Create account', desc: 'Register via UAE PASS (primary) or email to get started.' },
                                { step: '2', title: 'Verify ownership', desc: 'Upload title deed, shared-housing permit, and Trakheesi ad permit for verification.' },
                                { step: '3', title: 'Go live', desc: 'Once verified, your listings appear to identity-verified tenants with full DLD compliance.' },
                            ].map(s => (
                                <div key={s.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.15)', color: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>{s.step}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Requirements amber box */}
                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                                <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Requirements</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {[
                                    'Valid shared-housing permit from Dubai Municipality',
                                    'Trakheesi advertising permit number',
                                    'Title deed or tenancy contract for the property',
                                    'UAE PASS authentication (Tier 2 — Gold)',
                                ].map(r => (
                                    <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 size={12} style={{ color: '#f59e0b', flexShrink: 0 }} /> {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link to="/register/landlord" className="btn" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Get Started as a Landlord <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
