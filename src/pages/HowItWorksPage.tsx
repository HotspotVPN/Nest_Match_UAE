import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Search, ShieldCheck, CheckCircle2, ChevronRight, Activity, ScrollText, CreditCard, Award } from 'lucide-react';

export default function HowItWorksPage() {
    const [activeTab, setActiveTab] = useState<'landlord' | 'residing' | 'searching'>('landlord');

    const landlordSteps = [
        { title: 'Onboard with UAE PASS', desc: 'Sign in with UAE PASS so we can verify you are the legal owner or authorised operator for shared housing.' },
        { title: 'Sync your Permits', desc: 'Enter your unit details and we verify shared-housing permits and Ejari eligibility via DLD APIs.' },
        { title: 'Publish Compliant Listings', desc: 'List bedspaces and rooms with DLD-verified badges and automated occupancy caps.' },
        { title: 'Manage Lifecycle', desc: 'Handle viewings, contracts, Ejari, deposits, and ledgers from a single dashboard.' },
        { title: 'Stay Ahead of Law No. 4', desc: 'We track permit renewals and occupancy rules so you stay fully compliant with Dubai Municipality.' }
    ];

    const residingSteps = [
        { title: 'Verify your Identity', desc: 'Sign in with UAE PASS and link to your existing NestMatch landlord or property group.' },
        { title: 'See your Legal Position', desc: 'Check that your room is permitted and your name is on an Ejari-compliant contract.' },
        { title: 'Live Better', desc: 'Use integrated chat, maintenance tickets, and payment reminders for a better experience.' },
        { title: 'Build your GCC', desc: 'On-time rent and no disputes improve your Good Conduct Certificate score for future moves.' }
    ];

    const searchingSteps = [
        { title: 'Create your Profile', desc: 'Sign up and tell us your budget, preferred areas, and lifestyle preferences.' },
        { title: 'Browse Verified Rooms', desc: 'See bedspaces and rooms from landlords with verified DLD permits — no fake listings.' },
        { title: 'Book with Commitment', desc: 'Request viewings with a pilot 50 AED hold (subject to approval) to reduce no-shows.' },
        { title: 'Move in Legally', desc: 'Both sides sign RERA-aligned terms and trigger Ejari verification inside NestMatch.' }
    ];

    const content = {
        landlord: {
            label: 'For Landlords & Operators',
            icon: Building2,
            color: 'var(--brand-purple-light)',
            steps: landlordSteps
        },
        residing: {
            label: 'For Residing Roommates',
            icon: Users,
            color: 'var(--uaepass-green)',
            steps: residingSteps
        },
        searching: {
            label: 'For Searching Roommates',
            icon: Search,
            color: '#f59e0b',
            steps: searchingSteps
        }
    };

    const activeContent = content[activeTab as keyof typeof content];

    return (
        <div className="section" style={{ paddingTop: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How NestMatch Works</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Providing a secure, digital framework for Dubai's new shared-housing regulatory regime.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-surface-2)', padding: '0.4rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
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
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    background: isActive ? 'var(--bg-surface-3)' : 'transparent',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                <TabIcon size={18} style={{ color: isActive ? content[tab].color : 'inherit' }} />
                                {content[tab].label}
                            </button>
                        );
                    })}
                </div>

                {/* Steps Section */}
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '0.5rem', background: `${activeContent.color}15`, borderRadius: 'var(--radius-md)', color: activeContent.color }}>
                            <activeContent.icon size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{activeContent.label} Flow</h2>
                    </div>

                    <div style={{ position: 'relative' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, var(--border-subtle), transparent)', zIndex: 0 }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {activeContent.steps.map((step: any, i: number) => (
                                <div key={step.title} style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
                                    <div style={{ 
                                        width: '24px', 
                                        height: '24px', 
                                        borderRadius: 'var(--radius-full)', 
                                        background: 'var(--bg-surface-2)', 
                                        border: `2px solid ${activeContent.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        color: activeContent.color,
                                        flexShrink: 0
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Compliance Infrastructure */}
                <div style={{ marginTop: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem' }}>Compliance Infrastructure</h2>
                        <p style={{ color: 'var(--text-muted)' }}>The deep-tech layer making Law No. 4 enforcement possible.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: ShieldCheck, title: 'Identity', desc: 'Every user is anchored to their UAE PASS Emirates ID profile.' },
                            { icon: Activity, title: 'Permit Verification', desc: 'Direct lookup for Trakheesi and Shared Housing permits via DLD API.' },
                            { icon: ScrollText, title: 'Contract Logic', desc: 'RERA-standardised terms for bedspace level leasing.' },
                            { icon: CreditCard, title: 'Escrow Control', desc: 'Stripe-integrated deposit holds Released only upon Ejari success.' },
                            { icon: Award, title: 'GCC Protocol', desc: 'A PDPL-compliant trust scoring system for the Dubai market.' }
                        ].map(pillar => {
                            const Icon = pillar.icon;
                            return (
                                <div key={pillar.title} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <Icon size={28} style={{ color: 'var(--brand-purple-light)', marginBottom: '1rem' }} />
                                    <h4 style={{ marginBottom: '0.5rem' }}>{pillar.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{pillar.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ marginTop: '6rem', marginBottom: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Ready to get started?</h3>
                    <Link to="/login" className="btn btn-primary">Join the Network <ChevronRight size={18} /></Link>
                </div>
            </div>
        </div>
    );
}
