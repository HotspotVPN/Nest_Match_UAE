import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
    ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle,
    Building2, UserPlus, Mail, Lock, X, Loader2, Users, Check,
    Upload, FileText, Camera, Fingerprint, BadgeCheck, PartyPopper,
    Clock, Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import UAEPassOverlay from '@/components/UAEPassOverlay';

type Role = 'tenant' | 'landlord' | null;
type SignupMethod = 'email' | 'google' | 'uaepass' | null;

const TOTAL_STEPS = 4;

export default function RegisterLandingPage() {
    const [params] = useSearchParams();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const initialRole = params.get('role');
    const [step, setStep] = useState(initialRole === 'tenant' || initialRole === 'landlord' ? 2 : 1);
    const [selectedRole, setSelectedRole] = useState<Role>(
        initialRole === 'tenant' ? 'tenant' : initialRole === 'landlord' ? 'landlord' : null
    );
    const [signupMethod, setSignupMethod] = useState<SignupMethod>(null);

    // ─── Tenant form state ─────────────────────────────────
    const [tEmail, setTEmail] = useState('');
    const [tPassword, setTPassword] = useState('');
    const [tEmailLoading, setTEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // ─── Landlord form state ───────────────────────────────
    const [lEmail, setLEmail] = useState('');
    const [lPassword, setLPassword] = useState('');
    const [lEmailLoading, setLEmailLoading] = useState(false);
    const [showUaePass, setShowUaePass] = useState(false);

    // ─── Step 3 demo state ─────────────────────────────────
    const [verifyStep, setVerifyStep] = useState(0);
    const [verifyDocType, setVerifyDocType] = useState<string | null>(null);
    const [verifiedDocs, setVerifiedDocs] = useState<string[]>([]);

    // Redirect already-authenticated users
    useEffect(() => {
        if (isAuthenticated) navigate('/browse', { replace: true });
    }, [isAuthenticated, navigate]);

    // ─── Signup handlers (NO login calls — pure pass-through) ──
    const handleTenantEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTEmailLoading(true);
        setTimeout(() => {
            setTEmailLoading(false);
            setSignupMethod('email');
            showToast('Account created! Complete verification to unlock features.', 'success');
            setStep(3);
        }, 1200);
    };

    const handleGoogle = () => {
        setGoogleLoading(true);
        setTimeout(() => {
            setGoogleLoading(false);
            setSignupMethod('google');
            showToast('Google account linked! Complete verification to unlock features.', 'success');
            setStep(3);
        }, 1800);
    };

    const handleTenantUaePass = () => {
        setShowUaePass(true);
    };

    const handleTenantUaePassComplete = () => {
        setShowUaePass(false);
        setSignupMethod('uaepass');
        showToast('UAE PASS verified! Identity confirmed — Tier 2 Gold.', 'success');
        setStep(3);
    };

    const handleLandlordEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLEmailLoading(true);
        setTimeout(() => {
            setLEmailLoading(false);
            setSignupMethod('email');
            showToast('Account created! Submit documents to go live.', 'success');
            setStep(3);
        }, 1200);
    };

    const handleLandlordUaePassComplete = () => {
        setShowUaePass(false);
        setSignupMethod('uaepass');
        showToast('UAE PASS verified! Identity confirmed — Tier 2 Gold.', 'success');
        setStep(3);
    };

    // ─── Step 3 demo verify handler ────────────────────────
    const handleDemoVerify = (docType: string) => {
        setVerifyDocType(docType);
        setVerifyStep(1);
        setTimeout(() => setVerifyStep(2), 1200);
        setTimeout(() => {
            setVerifyStep(3);
            setVerifiedDocs(prev => [...prev, docType]);
            showToast(`${docType} verified successfully!`, 'success');
            // Reset for next doc
            setTimeout(() => { setVerifyStep(0); setVerifyDocType(null); }, 600);
        }, 2800);
    };

    const handleProceedToStep4 = () => setStep(4);

    const handleFinishOnboarding = () => {
        // At the end of onboarding showcase, redirect to login
        // (signup doesn't log users in — that's the login page's job)
        navigate('/login');
    };

    const goToStep2 = () => { if (selectedRole) setStep(2); };

    const goBack = () => {
        if (step === 2) { setStep(1); }
        else if (step === 3) { setStep(2); setVerifyStep(0); setVerifyDocType(null); setVerifiedDocs([]); }
    };

    // ─── Derived tier based on signup method + verified docs ──
    const getCurrentTier = () => {
        if (signupMethod === 'uaepass') return { label: 'Tier 2 — Gold', class: 'badge-green' };
        if (verifiedDocs.includes('Passport') || verifiedDocs.includes('Emirates ID') || verifiedDocs.includes('Title Deed'))
            return { label: 'Tier 1 — Verified', class: 'badge-blue' };
        return { label: 'Tier 0 — Explorer', class: 'badge-orange' };
    };

    // ─── Step Indicator ────────────────────────────────────
    const stepLabels = ['Choose Role', 'Create Account', 'Verification', 'Complete'];

    const StepIndicator = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '0.5rem' }}>
            {stepLabels.map((_, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isComplete = step > stepNum;
                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '36px' }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8125rem', fontWeight: 700,
                                background: isComplete ? 'var(--brand-purple)' : isActive ? 'var(--brand-purple)' : 'rgba(255,255,255,0.06)',
                                color: isComplete || isActive ? '#fff' : 'var(--text-muted)',
                                border: isActive ? '2px solid var(--brand-purple-light)' : '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}>
                                {isComplete ? <Check size={16} /> : stepNum}
                            </div>
                        </div>
                        {i < stepLabels.length - 1 && (
                            <div style={{
                                width: '56px', height: '2px',
                                background: step > stepNum ? 'var(--brand-purple)' : 'rgba(255,255,255,0.1)',
                                transition: 'background 0.3s ease',
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );

    const StepLabel = () => (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Step {step} of {TOTAL_STEPS}: {stepLabels[step - 1]}
        </p>
    );

    // ═══════════════════════════════════════════════════════
    // STEP 1 — Choose Role
    // ═══════════════════════════════════════════════════════
    const renderStep1 = () => (
        <div style={{ width: '100%' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
                Choose Your Role
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
                Select how you will use NestMatch to get started
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* ── Tenant column ─────────────────────── */}
                <div>
                    <button
                        onClick={() => setSelectedRole('tenant')}
                        style={{
                            width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem',
                            borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            background: selectedRole === 'tenant' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                            border: selectedRole === 'tenant' ? '2px solid var(--brand-purple)' : '2px solid var(--border-subtle)',
                            color: 'var(--text-primary)', marginBottom: '1.25rem',
                            transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                        }}
                    >
                        <div style={{ padding: '0.625rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-purple-light)', flexShrink: 0 }}>
                            <Users size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Roommate / Tenant</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Find a room, book viewings, sign agreements</div>
                        </div>
                        {selectedRole === 'tenant' && <div style={{ color: 'var(--brand-purple)', flexShrink: 0 }}><CheckCircle2 size={22} /></div>}
                    </button>

                    <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.12)' }}>
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <span className="badge badge-orange" style={{ fontSize: '0.625rem' }}>Tier 0 — Explorer</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', alignSelf: 'center' }}>&rarr;</span>
                            <span className="badge badge-blue" style={{ fontSize: '0.625rem' }}>Tier 1 — Verified</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', alignSelf: 'center' }}>&rarr;</span>
                            <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Tier 2 — Gold</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { step: '1', title: 'Create account', desc: 'Sign up with Google or email. You start at Tier 0 — Explorer.' },
                                { step: '2', title: 'Verify identity', desc: 'Upload passport or Emirates ID to reach Tier 1. Book viewings and chat with landlords.' },
                                { step: '3', title: 'Connect UAE PASS', desc: 'Authenticate via UAE PASS to unlock Tier 2 — Gold. Full access to apply for rooms.' },
                            ].map(s => (
                                <div key={s.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.15)', color: 'var(--brand-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{s.step}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Landlord column ──────────────────── */}
                <div>
                    <button
                        onClick={() => setSelectedRole('landlord')}
                        style={{
                            width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem',
                            borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            background: selectedRole === 'landlord' ? 'rgba(20,184,166,0.08)' : 'rgba(255,255,255,0.03)',
                            border: selectedRole === 'landlord' ? '2px solid #14b8a6' : '2px solid var(--border-subtle)',
                            color: 'var(--text-primary)', marginBottom: '1.25rem',
                            transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                        }}
                    >
                        <div style={{ padding: '0.625rem', background: 'rgba(20,184,166,0.1)', borderRadius: 'var(--radius-md)', color: '#14b8a6', flexShrink: 0 }}>
                            <Building2 size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Landlord / Letting Agent</div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>List properties, manage viewings, stay compliant</div>
                        </div>
                        {selectedRole === 'landlord' && <div style={{ color: '#14b8a6', flexShrink: 0 }}><CheckCircle2 size={22} /></div>}
                    </button>

                    <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'rgba(20,184,166,0.03)', border: '1px solid rgba(20,184,166,0.12)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span className="badge badge-green" style={{ fontSize: '0.625rem' }}><ShieldCheck size={10} /> Tier 2 — Gold Required</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {[
                                { step: '1', title: 'Create account', desc: 'Register via UAE PASS (primary) or email to get started.' },
                                { step: '2', title: 'Verify ownership', desc: 'Upload title deed, shared-housing permit, and Trakheesi ad permit for verification.' },
                                { step: '3', title: 'Go live', desc: 'Once verified, your listings appear to identity-verified tenants with full DLD compliance.' },
                            ].map(s => (
                                <div key={s.step} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.15)', color: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{s.step}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                <AlertTriangle size={13} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Requirements</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {['Valid shared-housing permit from Dubai Municipality', 'Trakheesi advertising permit number', 'Title deed or tenancy contract for the property', 'UAE PASS authentication (Tier 2 — Gold)'].map(r => (
                                    <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 size={11} style={{ color: '#f59e0b', flexShrink: 0 }} /> {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={goToStep2} disabled={!selectedRole} className="btn btn-primary"
                style={{ width: '100%', padding: '0.9375rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: selectedRole ? 1 : 0.4, fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                Continue <ArrowRight size={18} />
            </button>
        </div>
    );

    // ═══════════════════════════════════════════════════════
    // STEP 2 — Signup Form + Info Sidebar
    // ═══════════════════════════════════════════════════════
    const renderTenantInfoSidebar = () => (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-purple-light)' }}><UserPlus size={20} /></div>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Tenant Onboarding</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find a room, book viewings, sign agreements</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                <span className="badge badge-orange" style={{ fontSize: '0.625rem' }}>Tier 0 — Explorer</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', alignSelf: 'center' }}>&rarr;</span>
                <span className="badge badge-blue" style={{ fontSize: '0.625rem' }}>Tier 1 — Verified</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', alignSelf: 'center' }}>&rarr;</span>
                <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Tier 2 — Gold</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                    { step: '1', badge: 'Tier 0 — Explorer', badgeClass: 'badge-orange', title: 'Sign up', desc: 'Create your account with Google or email. Browse listings immediately.' },
                    { step: '2', badge: 'Tier 1 — Verified', badgeClass: 'badge-blue', title: 'Upload documents', desc: 'Submit passport or Emirates ID for identity verification.' },
                    { step: '3', badge: 'Tier 2 — Gold', badgeClass: 'badge-green', title: 'Connect UAE PASS', desc: 'Authenticate to unlock full access — apply for rooms and sign DLD agreements.' },
                ].map(s => (
                    <div key={s.step} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.15)', color: 'var(--brand-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{s.step}</div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{s.title}</span>
                                <span className={`badge ${s.badgeClass}`} style={{ fontSize: '0.5rem' }}>{s.badge}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLandlordInfoSidebar = () => (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(20,184,166,0.1)', borderRadius: 'var(--radius-md)', color: '#14b8a6' }}><Building2 size={20} /></div>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Landlord Onboarding</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>List properties, manage viewings, stay compliant</p>
                </div>
            </div>
            <div style={{ marginBottom: '1.75rem' }}>
                <span className="badge badge-green" style={{ fontSize: '0.625rem' }}><ShieldCheck size={10} /> Tier 2 — Gold Required</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {[
                    { step: '1', title: 'Create account', desc: 'Register via UAE PASS (recommended) or email.' },
                    { step: '2', title: 'Submit documents', desc: 'Upload title deed, shared-housing permit, and Trakheesi ad permit.' },
                    { step: '3', title: 'Go live', desc: 'Once verified, your listings are visible to identity-verified tenants.' },
                ].map(s => (
                    <div key={s.step} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-full)', background: 'rgba(20,184,166,0.15)', color: '#14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{s.step}</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.125rem' }}>{s.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={13} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>Requirements</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3125rem' }}>
                    {['Valid shared-housing permit from Dubai Municipality', 'Trakheesi advertising permit number', 'Title deed or tenancy contract for the property', 'UAE PASS authentication (Tier 2 — Gold)'].map(r => (
                        <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                            <CheckCircle2 size={11} style={{ color: '#f59e0b', flexShrink: 0 }} /> {r}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderTenantForm = () => (
        <div style={{ maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.375rem' }}>Create Tenant Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.75rem' }}>Start at Tier 0 — Explorer. Upgrade anytime.</p>

            {/* UAE PASS — instant Gold */}
            <button onClick={handleTenantUaePass} className="btn btn-uaepass" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8125rem', marginBottom: '0.625rem', fontSize: '0.875rem' }}>
                <ShieldCheck size={18} /> Register with UAE PASS
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Have an Emirates ID? Verify instantly for Tier 2 — Gold access.
            </p>

            {/* Google — pass through to Step 3 */}
            <button onClick={handleGoogle} className="btn btn-outline"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.8125rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}
                disabled={googleLoading}>
                {googleLoading ? (
                    <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Connecting to Google...</>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Continue with Google
                    </>
                )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', opacity: 0.4 }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase' }}>or use email</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Email — pass through to Step 3 */}
            <form onSubmit={handleTenantEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Mail size={12} /> Email</label>
                    <input type="email" className="form-control form-input" placeholder="name@email.com" value={tEmail} onChange={e => setTEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Lock size={12} /> Password</label>
                    <input type="password" className="form-control form-input" placeholder="--------" value={tPassword} onChange={e => setTPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8125rem', justifyContent: 'center', display: 'flex', gap: '0.5rem' }} disabled={tEmailLoading}>
                    {tEmailLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
                </button>
            </form>
        </div>
    );

    const renderLandlordForm = () => (
        <div style={{ maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.375rem' }}>Create Landlord Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.75rem' }}>UAE PASS recommended for fastest verification.</p>

            <button onClick={() => setShowUaePass(true)} className="btn" style={{
                width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem',
                padding: '0.8125rem', marginBottom: '0.625rem', fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white',
                borderRadius: 'var(--radius-md)', fontWeight: 600, border: 'none', cursor: 'pointer',
            }}>
                <ShieldCheck size={18} /> Register with UAE PASS
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> Tier 2 — Gold</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Instant full access</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', opacity: 0.4 }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <form onSubmit={handleLandlordEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Mail size={12} /> Email</label>
                    <input type="email" className="form-control form-input" placeholder="name@company.ae" value={lEmail} onChange={e => setLEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Lock size={12} /> Password</label>
                    <input type="password" className="form-control form-input" placeholder="--------" value={lPassword} onChange={e => setLPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '0.8125rem', justifyContent: 'center', display: 'flex', gap: '0.5rem' }} disabled={lEmailLoading}>
                    {lEmailLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
                </button>
            </form>

            <div style={{ marginTop: '1.25rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <Building2 size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem', color: 'var(--info)' }} />
                    <strong>RERA agents:</strong> your BRN will be verified against the DLD broker registry during onboarding.
                </p>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={{ maxWidth: '880px', width: '100%', margin: '0 auto' }}>
            <button onClick={goBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ArrowLeft size={14} /> Back
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                <div className="glass-card" style={{ border: selectedRole === 'tenant' ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(20,184,166,0.2)', overflow: 'hidden' }}>
                    {selectedRole === 'tenant' ? renderTenantInfoSidebar() : renderLandlordInfoSidebar()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                    {selectedRole === 'tenant' ? renderTenantForm() : renderLandlordForm()}
                </div>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════
    // STEP 3 — Verification / Document Upload
    // ═══════════════════════════════════════════════════════
    const tenantDocs = [
        { id: 'passport', icon: FileText, label: 'Passport', desc: 'Upload your passport bio page for Tier 1 verification', tier: 'Tier 1 — Verified', tierClass: 'badge-blue' },
        { id: 'emirates_id', icon: Fingerprint, label: 'Emirates ID', desc: 'Upload both sides of your Emirates ID', tier: 'Tier 1 — Verified', tierClass: 'badge-blue' },
        { id: 'uae_pass', icon: ShieldCheck, label: 'UAE PASS Authentication', desc: 'Connect via UAE PASS for instant Tier 2 — Gold', tier: 'Tier 2 — Gold', tierClass: 'badge-green' },
    ];

    const landlordDocs = [
        { id: 'title_deed', icon: FileText, label: 'Title Deed', desc: 'Upload your property title deed or tenancy contract', tier: 'Required', tierClass: 'badge-orange' },
        { id: 'housing_permit', icon: Building2, label: 'Shared-Housing Permit', desc: 'Dubai Municipality shared-housing permit', tier: 'Required', tierClass: 'badge-orange' },
        { id: 'trakheesi', icon: BadgeCheck, label: 'Trakheesi Permit', desc: 'Advertising permit number from Trakheesi', tier: 'Required', tierClass: 'badge-orange' },
        { id: 'uae_pass_l', icon: ShieldCheck, label: 'UAE PASS Verification', desc: 'Connect via UAE PASS for Tier 2 — Gold access', tier: 'Tier 2 — Gold', tierClass: 'badge-green' },
    ];

    const docs = selectedRole === 'tenant' ? tenantDocs : landlordDocs;
    const isUaePassSignup = signupMethod === 'uaepass';
    const tier = getCurrentTier();

    const renderStep3 = () => (
        <div style={{ maxWidth: '680px', width: '100%', margin: '0 auto' }}>
            {/* UAE PASS users see a different header — already verified */}
            {isUaePassSignup ? (
                <>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <ShieldCheck size={28} style={{ color: '#22c55e' }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.375rem' }}>Identity Verified via UAE PASS</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                            Your identity has been confirmed. You're at <span className="badge badge-green" style={{ fontSize: '0.5625rem', verticalAlign: 'middle' }}>Tier 2 — Gold</span>
                        </p>
                    </div>

                    {selectedRole === 'landlord' && (
                        <>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                You can still upload property documents now, or do it later from your dashboard.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                {landlordDocs.filter(d => d.id !== 'uae_pass_l').map(doc => {
                                    const Icon = doc.icon;
                                    const isThisDoc = verifyDocType === doc.label;
                                    const isDocVerified = verifiedDocs.includes(doc.label);
                                    const isProcessing = isThisDoc && verifyStep > 0 && verifyStep < 3;
                                    return (
                                        <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: isDocVerified ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)', border: isDocVerified ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border-subtle)' }}>
                                            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: isDocVerified ? 'rgba(34,197,94,0.1)' : 'rgba(20,184,166,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDocVerified ? '#22c55e' : '#14b8a6', flexShrink: 0 }}>
                                                {isDocVerified ? <Check size={20} /> : <Icon size={20} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{doc.label}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{doc.desc}</div>
                                                {isProcessing && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#14b8a6' }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />{verifyStep === 1 ? 'Uploading...' : 'Verifying...'}</div>}
                                                {isDocVerified && <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.375rem', fontSize: '0.75rem', color: '#22c55e' }}><CheckCircle2 size={13} /> Verified</div>}
                                            </div>
                                            {!isDocVerified && !isProcessing && (
                                                <button onClick={() => handleDemoVerify(doc.label)} disabled={verifyStep > 0 && verifyStep < 3}
                                                    style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', opacity: (verifyStep > 0 && verifyStep < 3) ? 0.4 : 1 }}>
                                                    <Upload size={14} /> Upload
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
                        {selectedRole === 'tenant' ? 'Verify Your Identity' : 'Submit Property Documents'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                        {selectedRole === 'tenant'
                            ? 'Upload documents to unlock higher tiers and more platform access.'
                            : 'Upload the required documents to verify your property listing and go live.'}
                    </p>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your current tier: </span>
                        <span className={`badge ${tier.class}`} style={{ fontSize: '0.625rem' }}>{tier.label}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                        {docs.map(doc => {
                            const Icon = doc.icon;
                            const isThisDoc = verifyDocType === doc.label;
                            const isDocVerified = verifiedDocs.includes(doc.label);
                            const isProcessing = isThisDoc && verifyStep > 0 && verifyStep < 3;
                            return (
                                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', background: isDocVerified ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)', border: isDocVerified ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border-subtle)', transition: 'all 0.3s ease' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: isDocVerified ? 'rgba(34,197,94,0.1)' : selectedRole === 'tenant' ? 'rgba(99,102,241,0.08)' : 'rgba(20,184,166,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDocVerified ? '#22c55e' : selectedRole === 'tenant' ? 'var(--brand-purple-light)' : '#14b8a6', flexShrink: 0 }}>
                                        {isDocVerified ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{doc.label}</span>
                                            <span className={`badge ${doc.tierClass}`} style={{ fontSize: '0.5rem' }}>{doc.tier}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{doc.desc}</div>
                                        {isProcessing && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--brand-purple-light)' }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />{verifyStep === 1 ? 'Uploading...' : 'Verifying document...'}</div>}
                                        {isDocVerified && <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.375rem', fontSize: '0.75rem', color: '#22c55e' }}><CheckCircle2 size={13} /> Document verified</div>}
                                    </div>
                                    {!isDocVerified && !isProcessing && (
                                        <button onClick={() => handleDemoVerify(doc.label)} disabled={verifyStep > 0 && verifyStep < 3}
                                            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', opacity: (verifyStep > 0 && verifyStep < 3) ? 0.4 : 1 }}>
                                            <Upload size={14} /> Upload
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Demo callout */}
            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <Camera size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.375rem', color: 'var(--brand-purple-light)' }} />
                    <strong>Demo mode:</strong> Click "Upload" to see the verification flow. In production, documents are processed via our KYC pipeline with real-time status updates.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={goBack} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleProceedToStep4} className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    {verifiedDocs.length > 0 || isUaePassSignup ? 'Continue' : 'Skip for now'} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════════════════
    // STEP 4 — Complete (split by verification status)
    // ═══════════════════════════════════════════════════════
    const renderStep4 = () => {
        const isGold = tier.label === 'Tier 2 — Gold';
        const isVerified = tier.label === 'Tier 1 — Verified';
        const isPending = !isGold && !isVerified;
        const accentColor = selectedRole === 'tenant' ? 'var(--brand-purple-light)' : '#14b8a6';
        const accentBg = selectedRole === 'tenant' ? 'rgba(99,102,241,0.1)' : 'rgba(20,184,166,0.1)';

        return (
            <div style={{ maxWidth: '560px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
                {/* Icon */}
                <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1.5rem', background: isGold ? 'rgba(34,197,94,0.1)' : isPending ? 'rgba(245,158,11,0.1)' : accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isGold ? <PartyPopper size={36} style={{ color: '#22c55e' }} />
                        : isPending ? <Clock size={36} style={{ color: '#f59e0b' }} />
                        : <BadgeCheck size={36} style={{ color: accentColor }} />}
                </div>

                {/* Heading */}
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    {isGold ? 'Welcome to NestMatch!'
                        : isPending ? 'Account Created — Verification Pending'
                        : 'Account Created — Documents Submitted'}
                </h2>

                {/* Description */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {isGold && selectedRole === 'tenant' && 'Your identity is verified via UAE PASS. You have full access — browse listings, book viewings, apply for rooms, and sign DLD agreements.'}
                    {isGold && selectedRole === 'landlord' && 'Your identity is verified via UAE PASS. List your properties, manage viewings, and connect with identity-verified tenants on Dubai\'s compliant platform.'}
                    {isPending && selectedRole === 'tenant' && 'Your account is active at Tier 0 — Explorer. You can browse listings now. Upload your passport or Emirates ID to unlock viewings and chat, or connect UAE PASS for full access.'}
                    {isPending && selectedRole === 'landlord' && 'Your account is active but requires document verification before your listings can go live. Upload your title deed, housing permit, and Trakheesi permit from your dashboard.'}
                    {isVerified && 'Your documents have been submitted for review. You\'ll receive a notification once verification is complete. In the meantime, you can explore the platform.'}
                </p>

                {/* Account status card */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Account status</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem' }}>Account type</span>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'capitalize' }}>{selectedRole}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem' }}>Signup method</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{signupMethod === 'uaepass' ? 'UAE PASS' : signupMethod === 'google' ? 'Google' : 'Email'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem' }}>Current tier</span>
                            <span className={`badge ${tier.class}`} style={{ fontSize: '0.625rem' }}>{tier.label}</span>
                        </div>
                        {!isGold && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem' }}>Next step</span>
                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                    {isPending ? (selectedRole === 'tenant' ? 'Upload passport or Emirates ID' : 'Submit property documents') : 'Connect UAE PASS for Gold'}
                                </span>
                            </div>
                        )}
                        {verifiedDocs.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem' }}>Documents uploaded</span>
                                <span style={{ fontSize: '0.8125rem', color: '#22c55e' }}>{verifiedDocs.length} verified</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* KYC awaiting banner for non-Gold */}
                {!isGold && (
                    <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1.5rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                            <Eye size={15} style={{ color: '#f59e0b' }} />
                            <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#f59e0b' }}>KYC Verification {verifiedDocs.length > 0 ? 'In Review' : 'Awaiting'}</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {verifiedDocs.length > 0
                                ? 'Your documents are being reviewed by our compliance team. You\'ll receive a notification once approved. Typical review time: 24–48 hours.'
                                : `You can still ${selectedRole === 'tenant' ? 'browse listings' : 'prepare your property details'} while your verification is pending. Upload documents anytime from your ${selectedRole === 'tenant' ? 'profile' : 'dashboard'}.`}
                        </p>
                    </div>
                )}

                {/* What you can do now */}
                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: selectedRole === 'tenant' ? 'rgba(99,102,241,0.04)' : 'rgba(20,184,166,0.04)', border: selectedRole === 'tenant' ? '1px solid rgba(99,102,241,0.12)' : '1px solid rgba(20,184,166,0.12)', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>What you can do now</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(isGold
                            ? (selectedRole === 'tenant'
                                ? ['Browse all permit-verified listings', 'Book viewings with landlords', 'Apply for rooms directly', 'Sign DLD agreements', 'Access GCC Score dashboard']
                                : ['Access your landlord dashboard', 'List your properties immediately', 'Manage viewings and applications', 'Track tenant verification status', 'Access compliance tools'])
                            : (selectedRole === 'tenant'
                                ? ['Browse all permit-verified listings', 'View property details and photos', 'See roommate compatibility scores', `Upload documents to unlock Tier 1${isPending ? '' : ' (in progress)'}`, 'Connect UAE PASS for full access']
                                : ['Access your landlord dashboard', 'Prepare property listing details', 'Upload verification documents', 'Track verification status', 'Go live once approved'])
                        ).map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                <CheckCircle2 size={14} style={{ color: accentColor, flexShrink: 0 }} /> {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA — goes to login (signup doesn't log you in) */}
                <button onClick={handleFinishOnboarding} className="btn btn-primary"
                    style={{ padding: '0.9375rem 2.5rem', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    Sign in to get started <ArrowRight size={18} />
                </button>

                <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    You'll use your {signupMethod === 'uaepass' ? 'UAE PASS' : signupMethod === 'google' ? 'Google account' : 'email and password'} to sign in.
                </p>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════
    // MAIN LAYOUT
    // ═══════════════════════════════════════════════════════
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 1.5rem 3rem' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '2.5rem', width: 'fit-content' }}>
                <Link to="/login" style={{ padding: '0.75rem 2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', background: 'transparent', transition: 'all 0.2s' }}>Sign In</Link>
                <button style={{ padding: '0.75rem 2rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: 'var(--brand-purple)', border: 'none', cursor: 'default' }}>Create Account</button>
            </div>

            {/* Wizard card */}
            <div className="glass-card" style={{
                maxWidth: step === 1 ? '1040px' : step === 2 ? '960px' : '720px',
                width: '100%', padding: step === 1 ? '2.5rem' : '2rem',
                border: '1px solid var(--border-subtle)', transition: 'max-width 0.3s ease',
            }}>
                <StepIndicator />
                <StepLabel />
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>

            {/* Footer */}
            {step < 4 && (
                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Sign in</Link>
                </p>
            )}

            {/* UAE PASS Overlay */}
            {showUaePass && (
                <UAEPassOverlay
                    onComplete={selectedRole === 'landlord' ? handleLandlordUaePassComplete : handleTenantUaePassComplete}
                    onClose={() => setShowUaePass(false)}
                    userName={selectedRole === 'landlord' ? 'Ahmed Al Maktoum' : 'New User'}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
