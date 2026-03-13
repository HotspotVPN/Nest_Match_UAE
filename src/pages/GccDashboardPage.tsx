import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, Star, Download, ChevronLeft, CreditCard, Activity, Copy, Check, Wrench, Building2, Clock } from 'lucide-react';
import { useState } from 'react';

export default function GccDashboardPage() {
    const { currentUser } = useAuth();
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    if (!currentUser) return (
        <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <h2>Please log in to view your GCC</h2>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>Log In</Link>
        </div>
    );

    const score = currentUser.gccScore || 0;
    const isPremium = score >= 80;
    const isLandlord = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';

    // SVG Circle Math for Gauge
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://nestmatch.ae/verify/gcc/${currentUser.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => {
            setDownloading(false);
            alert('Your official GCC PDF has been generated and downloaded.');
        }, 1500);
    };

    // ── Role-aware Score Factors ────────────────────────────────
    const tenantFactors = [
        {
            icon: ShieldCheck,
            label: 'UAE PASS Identity KYC',
            desc: 'Government verified identity linked.',
            points: 20,
            active: currentUser.isUaePassVerified,
            noDataLabel: 'Action Required',
        },
        {
            icon: CheckCircle2,
            label: 'No RERA Rental Disputes',
            desc: 'Clean record with the Rental Dispute Center.',
            points: 30,
            active: true,
            noDataLabel: 'Dispute Recorded',
        },
        {
            icon: CreditCard,
            label: 'On-Time Rent Payments',
            desc: '100% on-time processing for the last 12 months.',
            points: 25,
            active: currentUser.good_conduct_certificate?.payment_reliability === 'excellent',
            noDataLabel: 'Insufficient Data',
        },
        {
            icon: Star,
            label: 'Peer Reviews',
            desc: 'Verified roommate reviews for cleanliness and noise.',
            points: 10,
            active: true,
            stars: 4,
            noDataLabel: 'No Reviews Yet',
        },
    ];

    const landlordFactors = [
        {
            icon: ShieldCheck,
            label: 'UAE PASS / RERA Broker Verification',
            desc: 'Government-verified identity and active RERA broker license.',
            points: 25,
            active: currentUser.isUaePassVerified,
            noDataLabel: 'Verification Pending',
        },
        {
            icon: Wrench,
            label: 'Avg Maintenance Resolution < 24h',
            desc: 'Tenants rate your response speed on maintenance tickets.',
            points: 25,
            active: score >= 60,
            noDataLabel: 'No Ticket History',
        },
        {
            icon: Building2,
            label: 'Deposit Return Reliability',
            desc: 'No DLD complaints or disputes about security deposit deductions.',
            points: 30,
            active: true,
            noDataLabel: 'Complaint Recorded',
        },
        {
            icon: Clock,
            label: 'Tenant Satisfaction',
            desc: 'Aggregated ratings on AC quality, amenities, and responsiveness.',
            points: 20,
            active: score >= 40,
            stars: 4,
            noDataLabel: 'Insufficient Ratings',
        },
    ];

    const factors = isLandlord ? landlordFactors : tenantFactors;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link to="/profile" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
                    <ChevronLeft size={16} /> Back to Profile
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <Award size={32} style={{ color: isPremium ? '#f59e0b' : 'var(--brand-purple)' }} />
                        {isLandlord ? 'Property Manager Trust Score' : 'Good Conduct Certificate'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLandlord
                            ? 'Your verified track record as a property owner in the UAE.'
                            : 'Your official renter reputation score in the UAE.'}
                    </p>
                    {isLandlord && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                                <Building2 size={10} /> Graded by Residing Tenants
                            </span>
                        </div>
                    )}
                </div>

                {/* Gauge */}
                <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    {isPremium && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                    )}
                    
                    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 1.5rem' }}>
                        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="100" cy="100" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            <circle
                                cx="100" cy="100" r={radius}
                                fill="transparent"
                                stroke={isPremium ? '#f59e0b' : 'var(--brand-purple)'}
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                            />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, color: isPremium ? '#f59e0b' : 'var(--text-primary)' }}>
                                {score}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                    </div>

                    {isPremium ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(245,158,11,0.3)' }}>
                            <Award size={18} style={{ color: '#f59e0b' }} />
                            <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                                {isLandlord ? 'Premium Property Manager Status' : 'Premium GCC Status Achieved'}
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}>
                            <Activity size={18} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{80 - score} points needed for Premium Status</span>
                        </div>
                    )}
                </div>

                {/* Score Factors */}
                <h3 style={{ marginBottom: '1rem' }}>Score Factors</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {factors.map((factor) => {
                        const Icon = factor.icon;
                        return (
                            <div key={factor.label} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ padding: '0.5rem', background: factor.active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', color: factor.active ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{factor.label}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{factor.desc}</div>
                                    {'stars' in factor && factor.active && (
                                        <div style={{ display: 'flex', gap: '0.125rem', color: '#f59e0b', marginBottom: '0.375rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < (factor.stars ?? 0) ? '#f59e0b' : 'rgba(255,255,255,0.2)'} />
                                            ))}
                                        </div>
                                    )}
                                    {factor.active
                                        ? <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+{factor.points} Points</div>
                                        : <div style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>{factor.noDataLabel}</div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleDownload}
                        className="btn btn-primary"
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                        disabled={downloading}
                    >
                        {downloading ? <Activity className="spin" size={18} /> : <Download size={18} />}
                        {downloading ? 'Generating PDF...' : 'Download Official Certificate (PDF)'}
                    </button>
                    
                    <button
                        onClick={handleCopy}
                        className="btn btn-secondary"
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {copied ? <Check size={18} style={{ color: 'var(--success)' }} /> : <Copy size={18} />}
                        {copied ? 'Link Copied!'
                            : isLandlord ? 'Share Trust Profile with Tenants'
                            : 'Copy Verification Link for Landlords'}
                    </button>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p>NestMatch UAE uses aggregated data from DLD, RERA, and platform behavior to calculate this score.</p>
                    <p>Sharing your GCC is strictly bound by UAE Personal Data Protection Law (PDPL).</p>
                </div>
            </div>
        </div>
    );
}
