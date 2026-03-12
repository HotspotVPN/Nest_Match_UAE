import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { users, getInitials } from '@/data/mockData';
import {
    ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
    UserPlus, Building2, Briefcase, Fingerprint, Award,
} from 'lucide-react';
import type { UserType } from '@/types';

type AuthTab = 'login' | 'register';
type RegStep = 'role' | 'uaepass_verify' | 'lifestyle' | 'complete';

// UAE PASS logo/icon
function UaePassIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#2D9F4F" />
            <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [tab, setTab] = useState<AuthTab>('login');

    // Registration
    const [regStep, setRegStep] = useState<RegStep>('role');
    const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
    const [uaePassVerified, setUaePassVerified] = useState(false);

    // Lifestyle tags for searching roommates
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleQuickLogin = (userId: string) => {
        login(userId);
        const u = users.find(u => u.id === userId);
        if (u?.type === 'finance') navigate('/treasury');
        else if (u?.type === 'compliance') navigate('/compliance');
        else if (u?.type === 'operations') navigate('/customers');
        else navigate('/profile');
    };

    const handleUaePassLogin = () => {
        // Simulate UAE PASS OAuth — log in as first roommate
        login('roommate-1');
        navigate('/profile');
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const regSteps: RegStep[] = ['role', 'uaepass_verify', 'lifestyle', 'complete'];
    const currentStepIdx = regSteps.indexOf(regStep);

    const roles: { key: UserType; icon: typeof UserPlus; label: string; desc: string }[] = [
        { key: 'roommate', icon: UserPlus, label: 'Searching Roommate', desc: 'Looking for a room in a shared apartment. Browse verified listings, book viewings, and build your Good Conduct Certificate.' },
        { key: 'landlord', icon: Building2, label: 'Landlord / Property Owner', desc: 'List your properties with Makani and Municipality permits. Manage tenants and track rent in AED.' },
        { key: 'letting_agent', icon: Briefcase, label: 'RERA-Licensed Agent', desc: 'Manage properties on behalf of landlords. Handle viewings, tenant relations, and compliance coordination. RERA broker license required.' },
    ];

    const lifestyleTags = [
        'Early Bird', 'Night Owl', 'Non-Smoker', 'Gym-Goer', 'Yoga', 'Runner',
        'Cyclist', 'Swimmer', 'Foodie', 'Vegan', 'Vegetarian', 'Coffee Lover',
        'Social', 'Quiet', 'Remote Worker', 'Pet Owner', 'Minimalist', 'Creative',
    ];

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '520px' }}>
                {/* Tab Selector */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
                    <button onClick={() => { setTab('login'); setRegStep('role'); }} className={`btn ${tab === 'login' ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ flex: 1 }}>Sign In</button>
                    <button onClick={() => setTab('register')} className={`btn ${tab === 'register' ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ flex: 1 }}>Create Account</button>
                </div>

                {/* ── SIGN IN ──────────────────────────────────── */}
                {tab === 'login' && (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Welcome to NestMatch UAE</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            Sign in with your UAE PASS — the official UAE National Digital Identity
                        </p>

                        {/* UAE PASS Login — THE ONLY AUTH METHOD */}
                        <button onClick={handleUaePassLogin} className="btn btn-uaepass btn-lg" style={{ width: '100%', marginBottom: '1.5rem', gap: '0.75rem' }}>
                            <UaePassIcon /> Login with UAE PASS
                        </button>

                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(45,159,79,0.08)', border: '1px solid rgba(45,159,79,0.2)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                <Fingerprint size={14} style={{ color: 'var(--uaepass-green)' }} />
                                <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--uaepass-green-light)' }}>Government-Verified Identity</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                UAE PASS provides instant KYC verification. No fake landlords, no scammer tenants.
                                Every user on NestMatch UAE is a verified UAE resident.
                            </p>
                        </div>

                        {/* Demo Quick Access */}
                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
                                Demo Quick Access
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {users.filter(u => u.type !== 'finance' && u.type !== 'compliance' && u.type !== 'operations').map((u) => (
                                    <button key={u.id} onClick={() => handleQuickLogin(u.id)}
                                        className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.625rem 0.75rem', gap: '0.75rem' }}>
                                        <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                        <div style={{ textAlign: 'left', flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                {u.type === 'letting_agent' ? `Agent — ${u.agency_name}` : u.type.charAt(0).toUpperCase() + u.type.slice(1)}
                                                {u.resident_role ? ` · ${u.resident_role === 'residing' ? 'Residing' : 'Searching'}` : ''}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                                            <span className={`badge ${u.type === 'landlord' ? 'badge-blue' : u.type === 'letting_agent' ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize: '0.5625rem' }}>
                                                {u.type.replace('_', ' ')}
                                            </span>
                                            {u.has_gcc && <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>GCC</span>}
                                            {u.gccScore >= 80 && <span className="gcc-badge" style={{ fontSize: '0.5625rem', padding: '0.125rem 0.5rem' }}><Award size={10} /> Verified</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Admin Logins */}
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>Internal Admin Access</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {users.filter(u => ['compliance', 'finance', 'operations'].includes(u.type)).map(u => (
                                        <button key={u.id} onClick={() => handleQuickLogin(u.id)} className="btn btn-secondary btn-sm">
                                            {u.type === 'compliance' ? '🛡️' : u.type === 'finance' ? '💰' : '👥'} {u.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── REGISTER ─────────────────────────────────── */}
                {tab === 'register' && (
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        {/* Progress Bar */}
                        {regStep !== 'complete' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    {regSteps.slice(0, -1).map((s, i) => (
                                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, background: i <= currentStepIdx ? 'var(--uaepass-green)' : 'rgba(255,255,255,0.05)', color: i <= currentStepIdx ? 'white' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                                                {i < currentStepIdx ? <CheckCircle2 size={14} /> : i + 1}
                                            </div>
                                            {i < regSteps.length - 2 && (
                                                <div style={{ width: '40px', height: '2px', background: i < currentStepIdx ? 'var(--uaepass-green)' : 'var(--border-subtle)', transition: 'all 0.3s' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Step {currentStepIdx + 1} of {regSteps.length - 1}: {regStep === 'role' ? 'Choose Role' : regStep === 'uaepass_verify' ? 'UAE PASS Verification' : 'Lifestyle Profile'}
                                </div>
                            </div>
                        )}

                        {/* Step 1: Role */}
                        {regStep === 'role' && (
                            <>
                                <h2 style={{ marginBottom: '0.5rem' }}>Choose Your Role</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>Select how you will use NestMatch UAE</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {roles.map((r) => {
                                        const Icon = r.icon;
                                        const selected = selectedRole === r.key;
                                        return (
                                            <button key={r.key} onClick={() => setSelectedRole(r.key)}
                                                style={{ background: selected ? 'rgba(45,159,79,0.15)' : 'rgba(255,255,255,0.02)', border: `2px solid ${selected ? 'var(--uaepass-green)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <Icon size={22} style={{ color: selected ? 'var(--uaepass-green-light)' : 'var(--text-muted)' }} />
                                                    <span style={{ fontWeight: 700 }}>{r.label}</span>
                                                    {selected && <CheckCircle2 size={16} style={{ color: 'var(--success)', marginLeft: 'auto' }} />}
                                                </div>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => selectedRole && setRegStep('uaepass_verify')} className="btn btn-uaepass btn-lg" style={{ width: '100%' }} disabled={!selectedRole}>
                                    Continue <ArrowRight size={16} />
                                </button>
                            </>
                        )}

                        {/* Step 2: UAE PASS Verification */}
                        {regStep === 'uaepass_verify' && (
                            <>
                                <button onClick={() => setRegStep('role')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <ShieldCheck size={40} style={{ color: 'var(--uaepass-green-light)', marginBottom: '0.75rem' }} />
                                    <h2>Verify with UAE PASS</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        Your identity will be verified through the official UAE National Digital Identity
                                    </p>
                                </div>
                                <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(45,159,79,0.08)', border: '1px solid rgba(45,159,79,0.2)', marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                                        UAE PASS will verify your Emirates ID, full name, and residency status.
                                        This replaces traditional KYC, AML, and PEP checks — all handled instantly by the UAE government.
                                    </p>
                                </div>
                                {!uaePassVerified ? (
                                    <button onClick={() => setUaePassVerified(true)} className="btn btn-uaepass btn-lg" style={{ width: '100%' }}>
                                        <UaePassIcon /> Verify with UAE PASS
                                    </button>
                                ) : (
                                    <>
                                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                                                <span style={{ fontWeight: 700, color: 'var(--success)' }}>UAE PASS Verified</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setRegStep(selectedRole === 'roommate' ? 'lifestyle' : 'complete')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                            Continue <ArrowRight size={16} />
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {/* Step 3: Lifestyle Profile (Searching Roommates only) */}
                        {regStep === 'lifestyle' && (
                            <>
                                <button onClick={() => setRegStep('uaepass_verify')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
                                    <ArrowLeft size={14} /> Back
                                </button>
                                <h2 style={{ marginBottom: '0.5rem' }}>Build Your Lifestyle Profile</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                    Select tags that describe your lifestyle — these help match you with compatible roommates
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {lifestyleTags.map(tag => (
                                        <button key={tag} onClick={() => toggleTag(tag)}
                                            className={`tag`}
                                            style={{ cursor: 'pointer', background: selectedTags.includes(tag) ? 'rgba(45,159,79,0.15)' : undefined, borderColor: selectedTags.includes(tag) ? 'var(--uaepass-green)' : undefined, color: selectedTags.includes(tag) ? 'var(--uaepass-green-light)' : undefined }}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setRegStep('complete')} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={selectedTags.length === 0}>
                                    Complete Profile <ArrowRight size={16} />
                                </button>
                            </>
                        )}

                        {/* Step 4: Complete */}
                        {regStep === 'complete' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', margin: '0 auto 1.5rem', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
                                </div>
                                <h2 style={{ marginBottom: '0.5rem' }}>Account Created!</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                    Your {selectedRole === 'letting_agent' ? 'RERA-licensed agent' : selectedRole} account has been verified through UAE PASS.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                                    {[
                                        { label: 'UAE PASS Verification', done: true },
                                        { label: 'Emirates ID Confirmed', done: true },
                                        { label: 'AML / PEP Screening', done: true },
                                    ].map((c) => (
                                        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
                                            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                                            <span style={{ fontSize: '0.875rem' }}>{c.label}</span>
                                            <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: '0.625rem' }}>Completed</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { login('roommate-1'); navigate('/browse'); }} className="btn btn-uaepass btn-lg" style={{ width: '100%' }}>
                                    Start Exploring <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
