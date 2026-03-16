import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Lock, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function TenantSignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Google flow states
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showGooglePicker, setShowGooglePicker] = useState(false);
    const [googlePickerLoading, setGooglePickerLoading] = useState<string | null>(null);

    // Email flow states
    const [emailLoading, setEmailLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        setEmailLoading(true);
        setTimeout(() => {
            login('tier0-3'); // Ravi Menon
            setEmailLoading(false);
            setSubmitted(true);
            showToast('Welcome to NestMatch!', 'success');
            setTimeout(() => navigate('/profile'), 800);
        }, 1200);
    };

    const handleGoogle = () => {
        setGoogleLoading(true);
        setTimeout(() => {
            setGoogleLoading(false);
            setShowGooglePicker(true);
        }, 1500);
    };

    const handleGoogleAccountSelect = (accountEmail: string) => {
        setGooglePickerLoading(accountEmail);
        const userId = accountEmail === 'james.okafor@gmail.com' ? 'tier0-1' : 'tier0-2';
        const slug = accountEmail === 'james.okafor@gmail.com' ? 'james-okafor' : 'sofia-kowalski';
        setTimeout(() => {
            login(userId);
            setShowGooglePicker(false);
            setGooglePickerLoading(null);
            showToast('Welcome to NestMatch!', 'success');
            navigate(`/profile/${slug}`);
        }, 1000);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '2fr 3fr', alignItems: 'center' }}>
            {/* LEFT — Info panel (40%) */}
            <div style={{ padding: '4rem 3rem', background: 'var(--bg-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to registration
                </Link>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find your room in Dubai</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Create a tenant account to browse permit-verified listings, book viewings, and build your verification tier.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { step: '1', badge: 'Tier 0 — Explorer', badgeClass: 'badge-orange', title: 'Sign up', desc: 'Create your account with Google or email. Browse listings immediately.' },
                        { step: '2', badge: 'Tier 1 — Verified', badgeClass: 'badge-blue', title: 'Upload documents', desc: 'Submit passport or Emirates ID for identity verification.' },
                        { step: '3', badge: 'Tier 2 — Gold', badgeClass: 'badge-green', title: 'Connect UAE PASS', desc: 'Authenticate to unlock full access — apply for rooms and sign DLD agreements.' },
                    ].map(s => (
                        <div key={s.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.15)', color: 'var(--brand-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0 }}>{s.step}</div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{s.title}</span>
                                    <span className={`badge ${s.badgeClass}`} style={{ fontSize: '0.5625rem' }}>{s.badge}</span>
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — Form (60%) */}
            <div style={{ padding: '4rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '420px', width: '100%' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center' }}>
                            <ShieldCheck size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                            <h2 style={{ marginBottom: '0.5rem' }}>Account created</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to your profile...</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Tenant Account</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Start at Tier 0 — Explorer. Upgrade anytime.</p>

                            {/* UAE PASS — for residents with Emirates ID */}
                            <button onClick={() => navigate('/login')} className="btn btn-uaepass" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', marginBottom: '0.75rem' }}>
                                <ShieldCheck size={18} /> Register with UAE PASS
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                                Have an Emirates ID? Verify instantly for Tier 2 — Gold access.
                            </p>

                            {/* Google */}
                            <button
                                onClick={handleGoogle}
                                className="btn btn-outline"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', marginBottom: '1.5rem' }}
                                disabled={googleLoading}
                            >
                                {googleLoading ? (
                                    <>
                                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        Connecting to Google...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                        Continue with Google
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.4 }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or use email</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                            </div>

                            {/* Email + Password */}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Mail size={12} /> Email
                                    </label>
                                    <input type="email" className="form-control form-input" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Lock size={12} /> Password
                                    </label>
                                    <input type="password" className="form-control form-input" placeholder="--------" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.875rem', justifyContent: 'center', display: 'flex', gap: '0.5rem' }}
                                    disabled={emailLoading}
                                >
                                    {emailLoading ? (
                                        <>
                                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>Create Tenant Account <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </form>

                            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                Already have an account? <Link to="/login" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Google Account Picker Modal */}
            {showGooglePicker && (
                <div className="modal-overlay" onClick={() => setShowGooglePicker(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Choose an account</span>
                            </div>
                            <button onClick={() => setShowGooglePicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>to continue to NestMatch</p>

                        {[
                            { email: 'james.okafor@gmail.com', name: 'James Okafor', avatar: 'JO' },
                            { email: 'sofia.k@outlook.com', name: 'Sofia Kowalski', avatar: 'SK' },
                        ].map(account => (
                            <button
                                key={account.email}
                                onClick={() => handleGoogleAccountSelect(account.email)}
                                disabled={!!googlePickerLoading}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem', marginBottom: '0.5rem', borderRadius: 'var(--radius-md)',
                                    background: googlePickerLoading === account.email ? 'rgba(66,133,244,0.1)' : 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)', cursor: 'pointer',
                                    color: 'var(--text-primary)', textAlign: 'left',
                                    transition: 'background 0.2s',
                                    opacity: googlePickerLoading && googlePickerLoading !== account.email ? 0.5 : 1,
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'rgba(66,133,244,0.15)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.75rem', color: '#4285F4', flexShrink: 0,
                                }}>
                                    {googlePickerLoading === account.email ? (
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                    ) : account.avatar}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{account.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{account.email}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
