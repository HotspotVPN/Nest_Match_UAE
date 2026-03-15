import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Search, ShieldCheck, CheckCircle2, ChevronRight, Activity, ScrollText, CreditCard, Award, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
    const [activeTab, setActiveTab] = useState<'landlord' | 'residing' | 'searching'>('landlord');

    const landlordSteps = [
        { title: 'Onboard with UAE PASS (or Email/Google)', desc: 'Create your NestMatch account using email, Google, or UAE PASS. UAE PASS gives you instant KYC and ties your profile to your legal identity.' },
        { title: 'Complete Compliance & KYC', desc: 'We run AML / PEP screening and confirm you are the legal owner or authorised operator for shared housing under Dubai Law.' },
        { title: 'Verify Makani & Permits', desc: 'Enter your 10-digit Makani, Municipality shared-housing permit, and Trakheesi advertising permit. We verify them before any listing goes live.' },
        { title: 'Publish via the Add-Property Wizard', desc: 'Use the 4-step wizard to set legal occupancy, marketing, DEWA split, cheque frequency, and maintenance routing.' },
        { title: 'Run Operations in One Place', desc: 'Manage viewings with a Two-Way Hold, finalise leases in the Contract Hub (Ejari + deposits), and track rent via RERA-compliant ledgers.' }
    ];

    const residingSteps = [
        { title: 'Verify your Identity', desc: 'Sign in with UAE PASS or visual ID so your tenancy and payments are linked to a verified UAE resident profile.' },
        { title: 'See your Legal Tenancy', desc: 'Access your current accommodation, Ejari details, and rent ledger in one Residing Dashboard. No more guessing what’s on file.' },
        { title: 'Pay Rent & Raise Requests', desc: 'See upcoming rent dates, direct-debit status, and deposit holdings. Raise maintenance requests through structured chat.' },
        { title: 'Build your Good Conduct Certificate (GCC)', desc: 'Complete a 12-month tenancy with on-time payments to increase your GCC score and unlock priority access to premium listings.' }
    ];

    const searchingSteps = [
        { title: 'Create your Account', desc: 'Sign up with email, Google, or UAE PASS and tell us your budget, preferred areas, and lifestyle preferences.' },
        { title: 'Verify for Premium Access', desc: 'Upgrade to UAE PASS or visual ID to unlock chat, bookings, and access to high-trust, GCC-aware listings.' },
        { title: 'Browse Verified Properties', desc: 'Filter properties with valid Makani and Permits. We automatically hide any property at or above legal occupancy.' },
        { title: 'Book Viewings with a Two-Way Hold', desc: 'Book a time slot with a temporary 50 AED hold. If everyone attends, the hold is released. No more ghosting.' },
        { title: 'Sign in the Contract Hub & Move In', desc: 'Move into the Contract Hub to finalise Ejari, pay your deposit, and activate your lease. Then manage your stay from your dashboard.' }
    ];

    const content = {
        landlord: {
            label: 'For Landlords & Operators',
            icon: Building2,
            color: 'var(--brand-purple-light)',
            steps: landlordSteps,
            cta: { label: 'Get started as a landlord', link: '/login?intent=landlord' }
        },
        residing: {
            label: 'For Residing Roommates',
            icon: Users,
            color: 'var(--uaepass-green)',
            steps: residingSteps,
            cta: { label: 'Go to your dashboard', link: '/residing-dashboard' }
        },
        searching: {
            label: 'For Searching Roommates',
            icon: Search,
            color: '#f59e0b',
            steps: searchingSteps,
            cta: { label: 'Browse verified rooms', link: '/browse' }
        }
    };

    const activeContent = content[activeTab as keyof typeof content];

    return (
        <div className="section" style={{ paddingTop: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>How NestMatch Works</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        A secure, digital framework for Dubai's new shared-housing <br/>regulatory regime (Law No. 4 of 2026).
                    </p>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-surface-2)', padding: '0.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '3rem', border: '1px solid var(--border-subtle)' }}>
                    {(['landlord', 'residing', 'searching'] as const).map(tab => {
                        const TabIcon = content[tab].icon;
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '1.25rem',
                                    border: 'none',
                                    borderRadius: 'var(--radius-lg)',
                                    background: isActive ? 'var(--bg-surface-3)' : 'transparent',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 8px 16px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                <TabIcon size={20} style={{ color: isActive ? content[tab].color : 'inherit' }} />
                                {content[tab].label}
                            </button>
                        );
                    })}
                </div>

                {/* Flow Section */}
                <div className="glass-card" style={{ padding: '4rem', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
                        <div style={{ padding: '0.75rem', background: `${activeContent.color}15`, borderRadius: 'var(--radius-lg)', color: activeContent.color }}>
                            <activeContent.icon size={32} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', margin: 0, lineHeight: 1 }}>{activeContent.label} Flow</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Your step-by-step journey on the NestMatch OS</p>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--border-subtle), transparent)', zIndex: 0 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {activeContent.steps.map((step: any, i: number) => (
                                <div key={step.title} style={{ display: 'flex', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                                    <div style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: 'var(--radius-full)', 
                                        background: 'var(--bg-surface-2)', 
                                        border: `2px solid ${activeContent.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: 800,
                                        color: activeContent.color,
                                        flexShrink: 0
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>{step.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                         <Link to={activeContent.cta.link} className="btn btn-primary btn-lg" style={{ padding: '1rem 3rem' }}>
                            {activeContent.cta.label} <ArrowRight size={20} />
                         </Link>
                         {activeTab === 'searching' && (
                             <Link to="/login?intent=roommate" className="btn btn-outline btn-lg">
                                Create Tenant Profile
                             </Link>
                         )}
                    </div>
                </div>

                {/* Compliance Infrastructure */}
                <div style={{ marginTop: '8rem', marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The Compliance Engine</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>The deep-tech layer making Law No. 4 enforcement automatic.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: ShieldCheck, title: 'Identity', desc: 'Securely anchored to UAE PASS Emirates ID profiles.' },
                            { icon: Activity, title: 'Permit Verification', desc: 'Direct lookup for Trakheesi and Shared Housing permits via DLD API.' },
                            { icon: ScrollText, title: 'Contract Logic', desc: 'RERA-standardised digital terms for bedspace leasing.' },
                            { icon: CreditCard, title: 'Escrow Control', desc: 'Stripe-integrated holds released only after Ejari success.' },
                            { icon: Award, title: 'GCC Protocol', desc: 'Behaviour-based scoring for the Dubai shared-housing market.' }
                        ].map(pillar => {
                            const Icon = pillar.icon;
                            return (
                                <div key={pillar.title} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                    <Icon size={32} style={{ color: 'var(--brand-purple-light)', marginBottom: '1.25rem' }} />
                                    <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: 700 }}>{pillar.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{pillar.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
