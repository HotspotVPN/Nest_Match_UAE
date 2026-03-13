import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Mail, LogIn, ChevronRight, Eye, EyeOff, LayoutPanelLeft } from 'lucide-react';
import { users } from '@/data/mockData';

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
        loginWithEmail(email); // context only takes email
        navigate('/browse');
    };

    const quickLogin = (userEmail: string) => {
        loginWithEmail(userEmail);
        navigate('/browse');
    };

    return (
        <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="navbar-logo-icon" style={{ width: '48px', height: '48px', fontSize: '1.5rem', margin: '0 auto 1.5rem' }}>N</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Sign in to NestMatch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Access your shared-housing dashboard
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '2rem' }}>
                    {/* UAE PASS Section */}
                    <button onClick={handleUaePassLogin} className="btn btn-uaepass" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '1rem', marginBottom: '2rem' }}>
                        <ShieldCheck size={20} /> Login with UAE PASS
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.4 }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>or use email</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <LogIn size={18} /> Sign In <ChevronRight size={18} />
                        </button>
                    </form>
                </div>

                {/* Demo Access Toggle */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button 
                        onClick={() => setShowDemo(!showDemo)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <LayoutPanelLeft size={12} /> {showDemo ? 'Hide Evaluation Users' : 'Demo Mode (Simulation Accounts)'}
                        {showDemo ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>

                    {showDemo && (
                        <div className="glass-card" style={{ marginTop: '1rem', padding: '1.25rem', textAlign: 'left', background: 'rgba(99,102,241,0.03)' }}>
                            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--brand-purple-light)', textTransform: 'uppercase', marginBottom: '1rem' }}>Test Personas</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                                {users.filter(u => u.type !== 'operations' && u.type !== 'finance').map(user => (
                                    <button 
                                        key={user.id} 
                                        onClick={() => quickLogin(user.email)}
                                        className="btn btn-ghost btn-sm"
                                        style={{ justifyContent: 'flex-start', fontSize: '0.8125rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)' }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>{user.type} · {user.email}</div>
                                        </div>
                                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <span style={{ color: 'var(--brand-purple-light)', fontWeight: 600, cursor: 'pointer' }}>Register via UAE PASS</span>
                </p>
            </div>
        </div>
    );
}
