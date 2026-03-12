import { ShieldCheck, Search, CalendarCheck, Star, Award, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
    const steps = [
        { icon: ShieldCheck, title: '1. Verify with UAE PASS', desc: 'Sign in with your UAE National Digital Identity. Instant KYC — no document uploads, no waiting. Every user on NestMatch is a verified UAE resident.', color: 'var(--uaepass-green)' },
        { icon: Search, title: '2. Browse Verified Properties', desc: 'Every listing has a 10-digit Makani number, Trakheesi advertising permit, and Municipality shared housing permit. Properties at legal capacity are automatically hidden.', color: 'var(--brand-blue-light)' },
        { icon: CalendarCheck, title: '3. Book with Two-Way Hold', desc: 'A temporary 50 AED hold prevents no-shows from both sides. If you attend, the hold is released. If either party fails to show, the 50 AED is charged as a penalty.', color: 'var(--warning)' },
        { icon: Star, title: '4. Rate Your Experience', desc: 'After your tenancy, rate the property on 3 objective metrics: AC Quality, Building Amenities, and Maintenance Speed. Star ratings only — no free text to stay compliant with UAE defamation laws.', color: '#f59e0b' },
        { icon: Award, title: '5. Build Your GCC', desc: 'Complete a 12-month tenancy with zero late payments and complaints to earn your Good Conduct Certificate. Gold-verified tenants get priority access to premium listings.', color: '#f59e0b' },
        { icon: Building2, title: '6. Grow Your Portfolio', desc: 'Landlords: Post compliant listings, filter applicants by GCC score, and manage rent in AED with RERA escrow protection. Full legal protection under Law No. 4.', color: 'var(--brand-purple-light)' },
    ];

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    How <span className="gradient-text">NestMatch UAE</span> Works
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>
                    Six steps to 100% legal, verified shared living in Dubai.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                    {steps.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.title} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={28} style={{ color: s.color }} />
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.375rem' }}>{s.title}</h3>
                                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>{s.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login" className="btn btn-uaepass btn-lg">
                        <ShieldCheck size={20} /> Get Started with UAE PASS
                    </Link>
                </div>
            </div>
        </div>
    );
}
