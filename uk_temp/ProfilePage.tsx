import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    getListingById, getPaymentsForUser, getListingsForLandlord, getListingsForAgent,
    getInitials, formatCurrency, formatDate, getReviewsForUser, getUserById,
    getAgentForLandlord, starDisplay,
} from '@/data/mockData';
import {
    ShieldCheck, CheckCircle2, XCircle, Clock, CreditCard, Building2,
    Star, Award, BadgeCheck, Briefcase, Users, ArrowRight, MapPin,
    FileText, Download, Banknote, AlertCircle, Eye,
    Dumbbell, Heart, Sparkles, Compass,
} from 'lucide-react';
import ViewingsPanel from '@/components/ViewingsPanel';
import ChatPanel from '@/components/ChatPanel';
import AccountingPanel from '@/pages/AccountingPage'; // Using the refactored panel

type ProfileTab = 'overview' | 'viewings' | 'chat' | 'reviews' | 'accounting' | 'certificate' | 'agent';

export default function ProfilePage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

    if (!currentUser) {
        return (
            <div className="section">
                <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Not Signed In</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please sign in to view your profile.</p>
                        <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }

    const isRoommate = currentUser.type === 'roommate';
    const isLandlord = currentUser.type === 'landlord';
    const isAgent = currentUser.type === 'letting_agent';
    const reviews = getReviewsForUser(currentUser.id);
    const currentListing = currentUser.current_house_id ? getListingById(currentUser.current_house_id) : null;
    const managedListings = isLandlord ? getListingsForLandlord(currentUser.id) : isAgent ? getListingsForAgent(currentUser.id) : [];
    const agent = isLandlord ? getAgentForLandlord(currentUser.id) : null;
    const gcc = currentUser.good_conduct_certificate;
    const dd = currentUser.direct_debit;

    const complianceItems = [
        { label: 'KYC', status: currentUser.compliance.kyc_status, date: currentUser.compliance.kyc_completed_date },
        { label: 'AML', status: currentUser.compliance.aml_status, date: currentUser.compliance.aml_completed_date },
        { label: 'PEP', status: currentUser.compliance.pep_status, date: currentUser.compliance.pep_completed_date },
    ];

    const tabs: { key: ProfileTab; label: string }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'viewings', label: 'Viewings' },
        { key: 'chat', label: 'Chat' },
        { key: 'reviews', label: `Reviews (${reviews.length})` },
        { key: 'accounting', label: 'Accounting' },
    ];
    if (isRoommate && gcc) tabs.push({ key: 'certificate', label: 'Good Conduct' });
    if (isLandlord && agent) tabs.push({ key: 'agent', label: 'My Agent' });
    if (isAgent) tabs.push({ key: 'agent', label: 'Managed Landlords' });

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>

                {/* Profile Header */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '1.5rem', flexShrink: 0 }}>
                            {getInitials(currentUser.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{currentUser.name}</h1>
                                {currentUser.compliance.verified && (
                                    <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <BadgeCheck size={12} /> Verified
                                    </span>
                                )}
                                <span className={`badge ${isAgent ? 'badge-orange' : isLandlord ? 'badge-blue' : 'badge-purple'}`}>
                                    {isAgent ? 'Letting Agent' : isLandlord ? 'Landlord' : 'Roommate'}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                                {currentUser.email} · {currentUser.phone}
                            </p>

                            {currentUser.rating !== undefined && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>{starDisplay(currentUser.rating)}</span>
                                    <span style={{ fontWeight: 700 }}>{currentUser.rating}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({currentUser.total_reviews} reviews)</span>
                                </div>
                            )}

                            {isAgent && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                                    <Briefcase size={14} /> {currentUser.agency_name}
                                    <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}>{currentUser.agency_license}</span>
                                </div>
                            )}

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                {currentUser.bio}
                            </p>

                            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                {currentUser.keywords.map((kw) => (
                                    <span key={kw} className="badge badge-purple" style={{ fontSize: '0.625rem' }}>{kw}</span>
                                ))}
                            </div>

                            {/* Lifestyle & Personality Tags */}
                            {isRoommate && (
                                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {currentUser.personality_traits && currentUser.personality_traits.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Sparkles size={12} style={{ color: '#f59e0b', marginRight: '0.25rem' }} />
                                            {currentUser.personality_traits.map((t) => (
                                                <span key={t} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', textTransform: 'capitalize' }}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                    {currentUser.lifestyle_tags && currentUser.lifestyle_tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Dumbbell size={12} style={{ color: '#22c55e', marginRight: '0.25rem' }} />
                                            {currentUser.lifestyle_tags.map((t) => (
                                                <span key={t} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'capitalize' }}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                    {currentUser.hobbies && currentUser.hobbies.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                            <Heart size={12} style={{ color: '#ec4899', marginRight: '0.25rem' }} />
                                            {currentUser.hobbies.map((h) => (
                                                <span key={h} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)', textTransform: 'capitalize' }}>{h.replace(/-/g, ' ')}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Auth: {currentUser.auth_method === 'google_sso' ? 'Google SSO' : 'Email'} · Joined {formatDate(currentUser.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    {tabs.map((t) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className={`btn ${activeTab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                            style={{ flex: 1, whiteSpace: 'nowrap' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ── OVERVIEW TAB ─────────────────────────── */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Compliance Status */}
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={18} style={{ color: 'var(--brand-purple-light)' }} /> Compliance Status
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {complianceItems.map((c) => (
                                    <div key={c.label} style={{
                                        padding: '1rem', borderRadius: 'var(--radius-md)',
                                        background: c.status === 'completed' || c.status === 'clear' ? 'var(--success-bg)' : 'rgba(234,179,8,0.06)',
                                        border: `1px solid ${c.status === 'completed' || c.status === 'clear' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}`,
                                        textAlign: 'center',
                                    }}>
                                        {c.status === 'completed' || c.status === 'clear' ? (
                                            <CheckCircle2 size={20} style={{ color: 'var(--success)', marginBottom: '0.375rem' }} />
                                        ) : (
                                            <Clock size={20} style={{ color: 'var(--warning)', marginBottom: '0.375rem' }} />
                                        )}
                                        <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{c.label}</div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                            {c.date ? formatDate(c.date) : 'Pending'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Roommate: Current Property + Direct Debit */}
                        {isRoommate && currentListing && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building2 size={18} style={{ color: 'var(--brand-purple-light)' }} /> Current Property
                                </h3>
                                <Link to={`/listing/${currentListing.id}`} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', textDecoration: 'none', color: 'inherit', marginBottom: '1rem' }}>
                                    <img src={currentListing.images[0]} alt="" style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{currentListing.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <MapPin size={11} /> {currentListing.address}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--brand-purple-light)', fontFamily: 'var(--font-display)' }}>
                                            {formatCurrency(currentUser.rent_monthly || 0)}
                                        </div>
                                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>per month</div>
                                    </div>
                                </Link>

                                {/* Direct Debit */}
                                {dd && (
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <Banknote size={16} style={{ color: 'var(--success)' }} />
                                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Direct Debit</span>
                                            <span className={`badge ${dd.status === 'active' ? 'badge-green' : 'badge-orange'}`} style={{ marginLeft: 'auto' }}>
                                                {dd.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8125rem' }}>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Bank</div>
                                                <div>{dd.bank_name} (****{dd.account_last4})</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Monthly Amount</div>
                                                <div style={{ fontWeight: 700 }}>{formatCurrency(dd.amount)}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Next Payment</div>
                                                <div>{formatDate(dd.next_payment_date)}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Sort Code</div>
                                                <div>{dd.sort_code}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Landlord/Agent: Managed Properties */}
                        {(isLandlord || isAgent) && managedListings.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building2 size={18} style={{ color: 'var(--brand-purple-light)' }} />
                                    {isAgent ? 'Managed Properties' : 'My Properties'}
                                    <span className="badge badge-purple" style={{ marginLeft: '0.375rem' }}>{managedListings.length}</span>
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {managedListings.map((listing) => (
                                        <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <img src={listing.images[0]} alt="" style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{listing.title}</div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                        {listing.current_roommates.length}/{listing.total_rooms} occupied · {listing.available_rooms} available
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--brand-purple-light)' }}>{formatCurrency(listing.rent_per_room)}</div>
                                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>per room</div>
                                                </div>
                                                {listing.rating && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                                        <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> {listing.rating}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Roommate: Local Recommendations */}
                        {isRoommate && currentUser.local_recommendations && currentUser.local_recommendations.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Compass size={18} style={{ color: 'var(--brand-purple-light)' }} /> Things To Do Around Here
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    Recommended by current roommates — activities, food spots, and landmarks near the property
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {currentUser.local_recommendations.map((rec, i) => {
                                        const catColors: Record<string, string> = {
                                            sport: '#22c55e', food: '#f59e0b', landmark: '#3b82f6',
                                            activity: '#a855f7', nightlife: '#ec4899', culture: '#06b6d4',
                                        };
                                        const color = catColors[rec.category] || 'var(--text-muted)';
                                        return (
                                            <div key={i} style={{
                                                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                            }}>
                                                <div style={{
                                                    width: '8px', height: '8px', borderRadius: 'var(--radius-full)',
                                                    background: color, marginTop: '0.375rem', flexShrink: 0,
                                                }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.125rem' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{rec.name}</span>
                                                        <span style={{ fontSize: '0.5625rem', padding: '0.1rem 0.375rem', borderRadius: 'var(--radius-full)', background: `${color}15`, color, border: `1px solid ${color}30`, textTransform: 'capitalize' }}>{rec.category}</span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.description}</p>
                                                    {rec.distance && (
                                                        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
                                                            <MapPin size={9} /> {rec.distance}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Landlord: Financial Overview */}
                        {isLandlord && currentUser.deposits && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={18} style={{ color: 'var(--brand-purple-light)' }} /> Financial Overview
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.06)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--brand-purple-light)' }}>
                                            {formatCurrency(currentUser.monthly_income || 0)}
                                        </div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Monthly Income</div>
                                    </div>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.06)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>
                                            {formatCurrency(currentUser.deposits.held)}
                                        </div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Deposits Held</div>
                                    </div>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.06)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#3b82f6' }}>
                                            {formatCurrency(currentUser.deposits.total)}
                                        </div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Total Deposits</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── VIEWINGS TAB ────────────────────────── */}
                {activeTab === 'viewings' && (
                    <ViewingsPanel currentUser={currentUser} />
                )}

                {/* ── CHAT TAB ────────────────────────────── */}
                {activeTab === 'chat' && (
                    <ChatPanel currentUser={currentUser} />
                )}

                {/* ── REVIEWS TAB ──────────────────────────── */}
                {activeTab === 'reviews' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {reviews.length === 0 ? (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <Star size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <h3>No Reviews Yet</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Reviews will appear here once received.</p>
                            </div>
                        ) : (
                            reviews.map((rev) => {
                                const reviewer = getUserById(rev.reviewer_id);
                                return (
                                    <div key={rev.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="avatar avatar-sm">{reviewer ? getInitials(reviewer.name) : '?'}</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{reviewer?.name}</div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                        {rev.review_type.replace(/_/g, ' ')} · {formatDate(rev.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                                <span style={{ fontWeight: 700 }}>{rev.rating}</span>
                                            </div>
                                        </div>
                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '0.9375rem' }}>{rev.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{rev.comment}</p>
                                        {rev.categories && (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {Object.entries(rev.categories).map(([k, v]) => v !== undefined && (
                                                    <span key={k} style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                                        {k}: {starDisplay(v)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── ACCOUNTING TAB ─────────────────────────── */}
                {activeTab === 'accounting' && (
                    <AccountingPanel />
                )}

                {/* ── GOOD CONDUCT CERTIFICATE TAB ─────────── */}
                {activeTab === 'certificate' && gcc && (
                    <div>
                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--gradient-card)', marginBottom: '1.5rem' }}>
                            <Award size={48} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
                            <h2 style={{ marginBottom: '0.375rem' }}>Good Conduct Certificate</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Verified tenant credential for use when applying to new properties on NestMatch
                            </p>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            {/* Certificate card */}
                            <div style={{
                                padding: '2rem', borderRadius: 'var(--radius-xl)',
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.04))',
                                border: '2px solid rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', fontWeight: 900, color: 'rgba(124,58,237,0.04)', fontFamily: 'var(--font-display)' }}>
                                    GCC
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <BadgeCheck size={20} style={{ color: 'var(--success)' }} />
                                    <span className="badge badge-green">Verified</span>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                        ID: {gcc.id}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tenant</div>
                                        <div style={{ fontWeight: 700 }}>{currentUser.name}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Issued By</div>
                                        <div style={{ fontWeight: 700 }}>{getUserById(gcc.issued_by_landlord)?.name || 'Landlord'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Tenancy Period</div>
                                        <div>{formatDate(gcc.tenancy_start)} — {formatDate(gcc.tenancy_end)}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Property</div>
                                        <div>{getListingById(gcc.property_id)?.title || 'Property'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Payment Reliability</div>
                                        <span className="badge badge-green" style={{ fontSize: '0.625rem', textTransform: 'capitalize' }}>{gcc.payment_reliability}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Property Care</div>
                                        <span className="badge badge-green" style={{ fontSize: '0.625rem', textTransform: 'capitalize' }}>{gcc.property_care}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Landlord Notes</div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic' }}>
                                        &ldquo;{gcc.conduct_notes}&rdquo;
                                    </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{gcc.rating}/5</span>
                                    <span style={{ color: '#fbbf24' }}>{starDisplay(gcc.rating)}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                <button className="btn btn-primary"><Download size={16} /> Download PDF</button>
                                <button className="btn btn-secondary"><FileText size={16} /> Share Certificate</button>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                                    <AlertCircle size={14} style={{ color: '#3b82f6' }} />
                                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#3b82f6' }}>How It Works</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                    Your Good Conduct Certificate is automatically attached to any new property applications you make on NestMatch.
                                    Since you are already verified on the platform, you skip the full onboarding process when moving to a new property.
                                    Landlords and agents can see your verified history, ratings, and payment reliability — giving you a competitive edge over external applicants.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── AGENT TAB (Landlord viewing their agent, or Agent viewing managed landlords) ── */}
                {activeTab === 'agent' && (
                    <div>
                        {isLandlord && agent && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Briefcase size={18} style={{ color: '#f59e0b' }} /> Your Letting Agent
                                </h3>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '1.25rem', flexShrink: 0 }}>
                                        {getInitials(agent.name)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <h4 style={{ margin: 0 }}>{agent.name}</h4>
                                            <span className="badge badge-orange">Letting Agent</span>
                                            <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}>Verified</span>
                                        </div>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                                            {agent.agency_name} · {agent.agency_license}
                                        </p>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                                            {agent.bio}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem' }}>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)' }}>Rating: </span>
                                                <span style={{ fontWeight: 700 }}>{agent.rating} <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} /></span>
                                                <span style={{ color: 'var(--text-muted)' }}> ({agent.total_reviews} reviews)</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)' }}>Commission: </span>
                                                <span style={{ fontWeight: 700 }}>{agent.commission_rate}%</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)' }}>Properties Managed: </span>
                                                <span style={{ fontWeight: 700 }}>{agent.managed_properties?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                    <h5 style={{ marginBottom: '0.5rem' }}>Agent manages your properties</h5>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                        {agent.name} handles all day-to-day operations including tenant viewings, maintenance coordination, rent collection oversight, and compliance management.
                                        They are the primary contact visible to tenants on your listings. You retain full ownership visibility and can review all activity through this dashboard.
                                    </p>
                                </div>
                            </div>
                        )}

                        {isAgent && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="glass-card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Users size={18} style={{ color: 'var(--brand-purple-light)' }} /> Managed Landlords
                                    </h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        You are managing properties on behalf of the following landlord(s). They retain ownership and oversight.
                                    </p>
                                    {currentUser.managed_landlords?.map((lid) => {
                                        const landlord = getUserById(lid);
                                        if (!landlord) return null;
                                        return (
                                            <div key={lid} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div className="avatar avatar-sm">{getInitials(landlord.name)}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700 }}>{landlord.name}</div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{landlord.email}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                                                    <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> {landlord.rating}
                                                </div>
                                                <span className="badge badge-blue">Landlord</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="glass-card" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                        <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--brand-purple-light)' }}>
                                                {currentUser.managed_properties?.length || 0}
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Properties</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>
                                                {currentUser.managed_landlords?.length || 0}
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Landlords</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fbbf24' }}>
                                                {currentUser.commission_rate}%
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Commission</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
