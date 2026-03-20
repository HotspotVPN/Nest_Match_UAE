import { useAuth } from '@/contexts/AuthContext';
import { users, listings, viewingBookings, getInitials } from '@/data/mockData';
import { Users as UsersIcon, Building2, ThumbsUp, ThumbsDown, Award, ShieldCheck, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api } from '@/services/api';

export default function ResidingDashboardPage() {
    const { currentUser } = useAuth();
    const [approvedIds, setApprovedIds] = useState<string[]>([]);
    const [rejectedIds, setRejectedIds] = useState<string[]>([]);

    // Only landlords and letting agents can see the full applicant management dashboard
    if (!currentUser || (currentUser.type !== 'landlord' && currentUser.type !== 'letting_agent')) {
        return (
            <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <Building2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h2>Landlord / Agent Access Only</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    This page is for property managers to review incoming applicants for their listings.
                </p>
            </div>
        );
    }

    // Find all properties managed by this landlord/agent
    const myListings = listings.filter(l =>
        l.landlord_id === currentUser.id || l.letting_agent_id === currentUser.id
    );

    // Get all CONFIRMED or PENDING viewings for this landlord's properties
    const myViewings = viewingBookings.filter(v =>
        (v.landlord_id === currentUser.id) &&
        (v.status === 'CONFIRMED' || v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL')
    );

    // Resolve applicant users from viewing bookings (unique searcher_ids)
    const applicantsByListing = myListings.map(listing => {
        const viewingsForListing = myViewings.filter(v => v.property_id === listing.id);
        const applicants = viewingsForListing
            .map(v => users.find(u => u.id === v.searcher_id))
            .filter(Boolean);
        return { listing, applicants, viewings: viewingsForListing };
    }).filter(entry => entry.applicants.length > 0);

    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UsersIcon size={28} style={{ color: 'var(--brand-purple)' }} />
                        Incoming Applicants
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Verified applicants who have confirmed a viewing at your properties.
                    </p>
                </div>

                {applicantsByListing.length === 0 ? (
                    <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <CalendarCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <h3>No Applicants Yet</h3>
                        <p style={{ marginTop: '0.5rem' }}>Confirmed viewing bookings for your properties will appear here.</p>
                        <Link to="/viewings" className="btn btn-primary btn-sm" style={{ marginTop: '1.5rem' }}>
                            View My Viewings
                        </Link>
                    </div>
                ) : (
                    applicantsByListing.map(({ listing, applicants, viewings }) => (
                        <div key={listing.id} style={{ marginBottom: '3rem' }}>
                            {/* Property Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Building2 size={20} style={{ color: 'var(--primary)' }} />
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem' }}>{listing.title}</h3>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.district} • {listing.currentOccupants}/{listing.maxLegalOccupancy} occupied</div>
                                    </div>
                                </div>
                                <span className="badge badge-purple">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Applicant Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {applicants.map((applicant, i) => {
                                    if (!applicant) return null;
                                    const gccQualified = applicant.gccScore >= 80;
                                    const viewing = viewings.find(v => v.searcher_id === applicant.id);
                                    return (
                                        <div key={applicant.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <div className="avatar avatar-lg" style={{ fontSize: '1rem' }}>
                                                        {getInitials(applicant.name)}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ marginBottom: '0.25rem' }}>{applicant.name}</h4>
                                                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                            {applicant.isUaePassVerified && <span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> UAE PASS</span>}
                                                            {gccQualified && <span className="gcc-badge" style={{ fontSize: '0.5625rem', padding: '0.125rem 0.5rem' }}><Award size={10} /> GCC {applicant.gccScore}</span>}
                                                            {!gccQualified && applicant.gccScore > 0 && <span className="badge badge-orange" style={{ fontSize: '0.5625rem' }}>GCC: {applicant.gccScore}</span>}
                                                            {applicant.isPremium && <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>⭐ Premium</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    {applicant.tenancy_duration_months && applicant.tenancy_duration_months > 0 && (
                                                        <span className="badge badge-purple" style={{ fontSize: '0.625rem', display: 'block', marginBottom: '0.5rem' }}>{applicant.tenancy_duration_months} months verified tenancy</span>
                                                    )}
                                                    {viewing && (
                                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                            Viewing: {new Date(viewing.requested_date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })} @ {viewing.time_slot}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Lifestyle tags */}
                                            {applicant.lifestyle_tags && applicant.lifestyle_tags.length > 0 && (
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activities</span>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                                                        {applicant.lifestyle_tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Personality */}
                                            {applicant.personality_traits && applicant.personality_traits.length > 0 && (
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personality</span>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                                                        {applicant.personality_traits.map(t => <span key={t} className="badge badge-purple">{t}</span>)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* GCC Score bar */}
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                    <span>GCC Score</span>
                                                    <span>{applicant.gccScore}/100</span>
                                                </div>
                                                <div className="occupancy-bar" style={{ height: '6px' }}>
                                                    <div className={`occupancy-bar-fill ${applicant.gccScore >= 80 ? 'safe' : applicant.gccScore >= 40 ? 'warning' : 'full'}`} style={{ width: `${applicant.gccScore}%` }} />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                {approvedIds.includes(applicant.id) ? (
                                                    <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', fontWeight: 600, fontSize: '0.8125rem' }}>
                                                        Approved
                                                    </div>
                                                ) : rejectedIds.includes(applicant.id) ? (
                                                    <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', fontWeight: 600, fontSize: '0.8125rem' }}>
                                                        Rejected
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={async () => {
                                                            // Wire to API with fallback
                                                            const roomNum = listing.occupancy_status?.findIndex(r => r.tenant_id === applicant.id || r.status === 'pending_approval') ?? 0;
                                                            await api.updateRoomOccupancy(listing.id, roomNum + 1, 'approve_application', applicant.id);
                                                            setApprovedIds(prev => [...prev, applicant.id]);
                                                        }} className="btn btn-primary btn-sm" style={{ flex: 1 }}><ThumbsUp size={14} /> Approve</button>
                                                        <button onClick={async () => {
                                                            const roomNum = listing.occupancy_status?.findIndex(r => r.tenant_id === applicant.id || r.status === 'pending_approval') ?? 0;
                                                            await api.updateRoomOccupancy(listing.id, roomNum + 1, 'reject_application', applicant.id);
                                                            setRejectedIds(prev => [...prev, applicant.id]);
                                                        }} className="btn btn-ghost btn-sm" style={{ flex: 1, color: 'var(--text-muted)' }}><ThumbsDown size={14} /> Reject</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
