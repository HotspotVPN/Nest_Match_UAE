import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Mail, Lock, AlertTriangle, CheckCircle2, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import UAEPassOverlay from '@/components/UAEPassOverlay';

export default function LandlordSignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showUaePass, setShowUaePass] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        setEmailLoading(true);
        setTimeout(() => {
            login('L002'); // Fatima Hassan
            setEmailLoading(false);
            setSubmitted(true);
            showToast('Welcome to NestMatch!', 'success');
            setTimeout(() => navigate('/dashboard'), 800);
        }, 1200);
    };

    const handleUaePassComplete = () => {
        login('L001'); // Ahmed Al Maktoum
        setShowUaePass(false);
        showToast('Welcome Ahmed. UAE PASS verified.', 'success');
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '2fr 3fr', alignItems: 'center' }}>
            {/* LEFT — Info panel (40%) */}
            <div style={{ padding: '4rem 3rem', background: 'var(--bg-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to registration
                </Link>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>List your property legally</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Register as a landlord or operator to list permit-verified shared housing on NestMatch.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[
                        { step: '1', title: 'Create account', desc: 'Register via UAE PASS (recommended) or email.' },
                        { step: '2', title: 'Submit documents', desc: 'Upload title deed, shared-housing permit, and Trakheesi ad permit.' },
                        { step: '3', title: 'Go live', desc: 'Once verified, your listings are visible to identity-verified tenants.' },
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
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
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
            </div>

            {/* RIGHT — Form (60%) */}
            <div style={{ padding: '4rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '420px', width: '100%' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center' }}>
                            <ShieldCheck size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                            <h2 style={{ marginBottom: '0.5rem' }}>Account created</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Landlord Account</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>UAE PASS recommended for fastest verification.</p>

                            {/* UAE PASS — Primary */}
                            <button onClick={() => setShowUaePass(true)} className="btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                                <ShieldCheck size={18} /> Register with UAE PASS
                            </button>
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}>
                                    <ShieldCheck size={10} /> Tier 2 — Gold
                                </span>
                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Instant full access</span>
                            </div>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.4 }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                            </div>

                            {/* Email + Password — Secondary */}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Mail size={12} /> Email
                                    </label>
                                    <input type="email" className="form-control form-input" placeholder="name@company.ae" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <Lock size={12} /> Password
                                    </label>
                                    <input type="password" className="form-control form-input" placeholder="--------" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.875rem', justifyContent: 'center', display: 'flex', gap: '0.5rem' }} disabled={emailLoading}>
                                    {emailLoading ? (
                                        <>
                                            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                            Creating account...
                                        </>
                                    ) : (
                                        <>Create Landlord Account <ArrowRight size={16} /></>
                                    )}
                                </button>
                            </form>

                            {/* RERA note */}
                            <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    <Building2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem', color: 'var(--info)' }} />
                                    <strong>RERA agents:</strong> your BRN will be verified against the DLD broker registry during onboarding.
                                </p>
                            </div>

                            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                Already have an account? <Link to="/login" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* UAE PASS Overlay */}
            {showUaePass && (
                <UAEPassOverlay
                    onComplete={handleUaePassComplete}
                    onClose={() => setShowUaePass(false)}
                    userName="Ahmed Al Maktoum"
                />
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
