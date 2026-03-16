import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, LogIn, ChevronRight, Eye, EyeOff, LayoutPanelLeft, AlertTriangle, Globe } from 'lucide-react';
import { getTierLabel, getTierColor } from '@/utils/accessControl';
import type { VerificationTier } from '@/types';

export default function LoginPage() {
    const { loginWithEmail, loginWithUaePass } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showDemo, setShowDemo] = useState(false);

    const handleUaePassLogin = () => {
        loginWithUaePass('uae-pass-ahmed'); // Mocking an ID
        navigate('/browse');
    };

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginWithEmail(email);
        navigate('/browse');
    };

    const quickLogin = (userEmail: string) => {
        loginWithEmail(userEmail);
        navigate('/browse');
    };

    const tierBadge = (tier: VerificationTier) => (
        <span style={{
            fontSize: '0.5625rem',
            fontWeight: 700,
            padding: '0.125rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: tier === 'tier2_uae_pass' ? 'rgba(20,184,166,0.12)' : tier === 'tier1_unverified' ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.12)',
            color: getTierColor(tier),
            border: `1px solid ${tier === 'tier2_uae_pass' ? 'rgba(20,184,166,0.3)' : tier === 'tier1_unverified' ? 'rgba(245,158,11,0.3)' : 'rgba(148,163,184,0.3)'}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap' as const,
        }}>
            {getTierLabel(tier)}
        </span>
    );

    // Curated demo accounts
    const demoGroups = [
        {
            label: 'Landlords',
            color: 'var(--brand-purple-light)',
            entries: [
                { email: 'ahmed.almaktoum@nestmatch.ae', name: 'Ahmed Al Maktoum', desc: '8 units · Marina, JBR, Downtown', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'fatima.hassan@nestmatch.ae', name: 'Fatima Hassan', desc: 'JLT & Business Bay', tier: 'tier2_uae_pass' as VerificationTier },
            ],
        },
        {
            label: 'Letting Agents',
            color: 'var(--info)',
            entries: [
                { email: 'khalid@dubaipropertygroup.ae', name: 'Khalid Al Rashid', desc: 'Dubai Property Group · RERA-BRN-2025-12345', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'tariq@agency.ae', name: 'Tariq Mahmood', desc: 'Prime Real Estate', tier: 'tier2_uae_pass' as VerificationTier },
            ],
        },
        {
            label: 'Tenants — Tier 2 — Gold (UAE PASS Verified)',
            color: 'var(--success)',
            entries: [
                { email: 'priya.sharma@email.com', name: 'Priya Sharma', desc: 'Residing · JLT · GCC 85', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'marcus.chen@email.com', name: 'Marcus Chen', desc: 'Residing · Marina', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'aisha.patel@email.com', name: 'Aisha Patel', desc: 'Searching · GCC 92 · Premium', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'james.morrison@email.com', name: 'James Morrison', desc: 'Searching · relocating from London', tier: 'tier2_uae_pass' as VerificationTier },
            ],
        },
        {
            label: 'Tenants — Tier 0 — Explorer',
            color: '#f59e0b',
            entries: [
                { email: 'james.okafor@gmail.com', name: 'James Okafor', desc: 'Nigerian · Pending KYC', tier: 'tier0_passport' as VerificationTier },
                { email: 'sofia.k@outlook.com', name: 'Sofia Kowalski', desc: 'Polish · Approved KYC', tier: 'tier0_passport' as VerificationTier },
                { email: 'ravi.menon@gmail.com', name: 'Ravi Menon', desc: 'Indian · No docs yet', tier: 'tier0_passport' as VerificationTier },
            ],
        },
        {
            label: 'Tenants — Tier 1 — Verified',
            color: 'var(--text-muted)',
            entries: [
                { email: 'liam.obrien@gmail.com', name: 'Liam O\'Brien', desc: 'Irish · Job-seeker visa', tier: 'tier1_unverified' as VerificationTier },
                { email: 'amara.diallo@email.com', name: 'Amara Diallo', desc: 'Senegalese · Exploratory visit', tier: 'tier1_unverified' as VerificationTier },
            ],
        },
        {
            label: 'Platform Admin',
            color: '#8b5cf6',
            entries: [
                { email: 'compliance@nestmatch.ae', name: 'Sara Al Hashimi', desc: 'Head of Compliance', tier: 'tier2_uae_pass' as VerificationTier },
                { email: 'operations@nestmatch.ae', name: 'Rashid Khalil', desc: 'Head of Operations', tier: 'tier2_uae_pass' as VerificationTier },
            ],
        },
    ];

    return (
        <div className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
            <div className="container" style={{ maxWidth: '520px' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="navbar-logo-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem', margin: '0 auto 1rem' }}>N</div>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Sign in to NestMatch</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dubai's verified shared-housing platform</p>
                    </div>

                    {/* ── Section 1: UAE PASS ─────────────────── */}
                    <button onClick={handleUaePassLogin} className="btn btn-uaepass" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
                        <ShieldCheck size={20} /> Login with UAE PASS
                    </button>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        {tierBadge('tier2_uae_pass')}
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Full access to all features</span>
                    </div>

                    {/* ── Divider ──────────────────────────────── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.4 }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or sign in as</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    </div>

                    {/* ── Section 2: New Arrival ───────────────── */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Globe size={16} style={{ color: '#f59e0b' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Just arrived in Dubai?</span>
                            {tierBadge('tier0_passport')}
                        </div>

                        <button
                            onClick={() => { /* Google OAuth mock */ loginWithEmail('james.okafor@gmail.com'); navigate('/browse'); }}
                            className="btn btn-outline"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Continue with Google
                        </button>

                        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'block' }}>Email</label>
                                <input type="email" className="form-control" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'block' }}>Password</label>
                                <input type="password" className="form-control" placeholder="--------" value={password} onChange={e => setPassword(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)' }} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                <LogIn size={16} /> Sign In <ChevronRight size={16} />
                            </button>
                        </form>

                        {/* T0 info */}
                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                                <AlertTriangle size={12} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Tier 0 — Explorer Access</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                <div>You can: browse listings, request viewings, chat with landlords, sign viewing agreements</div>
                                <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>You cannot: sign tenancy contracts or apply for rooms (requires UAE PASS / Tier 2 — Gold)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Demo Logins (Collapsible) ──────────────── */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowDemo(!showDemo)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <LayoutPanelLeft size={12} /> {showDemo ? 'Hide Evaluation Users' : 'Demo Mode (Simulation Accounts)'}
                        {showDemo ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>

                    {showDemo && (
                        <div className="glass-card" style={{ marginTop: '1rem', padding: '1.25rem', textAlign: 'left', background: 'rgba(99,102,241,0.03)' }}>
                            {demoGroups.map((group, gi) => (
                                <div key={group.label}>
                                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: group.color, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                        {group.label}
                                    </div>
                                    <div style={{ display: 'grid', gap: '0.375rem', marginBottom: gi < demoGroups.length - 1 ? '1rem' : 0 }}>
                                        {group.entries.map(entry => (
                                            <button key={entry.email} onClick={() => quickLogin(entry.email)} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.8125rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {entry.name} {tierBadge(entry.tier)}
                                                    </div>
                                                    <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>{entry.desc}</div>
                                                </div>
                                                <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Sign up &rarr;</Link>
                </p>
            </div>
        </div>
    );
}
