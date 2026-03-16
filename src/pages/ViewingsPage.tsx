import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { viewingBookings, listings, users, getInitials, formatDate, getOrCreateChatChannel } from '@/data/mockData';
import { CalendarCheck, Clock, MapPin, CheckCircle2, XCircle, ShieldCheck, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ViewingStatus, ViewingBooking } from '@/types';
import ViewingAgreementModal from '@/components/ViewingAgreementModal';
import LeaseHandoffCard from '@/components/LeaseHandoffCard';

const STATUS_CONFIG: Record<ViewingStatus, { label: string; badge: string; color: string }> = {
    PENDING: { label: 'Pending', badge: 'badge-orange', color: 'var(--warning)' },
    PENDING_LANDLORD_APPROVAL: { label: 'Awaiting Landlord', badge: 'badge-blue', color: 'var(--info)' },
    CONFIRMED: { label: 'Confirmed', badge: 'badge-green', color: 'var(--success)' },
    AGREEMENT_SENT: { label: 'Agreement Sent', badge: 'badge-purple', color: 'var(--brand-purple)' },
    AGENT_SIGNED: { label: 'Agent Signed', badge: 'badge-purple', color: 'var(--brand-purple)' },
    FULLY_SIGNED: { label: 'Fully Signed', badge: 'badge-green', color: 'var(--success)' },
    COMPLETED: { label: 'Completed', badge: 'badge-green', color: 'var(--success)' },
    NO_SHOW_TENANT: { label: 'No-Show (Tenant)', badge: 'badge-red', color: 'var(--error)' },
    NO_SHOW_LANDLORD: { label: 'No-Show (Landlord)', badge: 'badge-red', color: 'var(--error)' },
    CANCELLED: { label: 'Cancelled', badge: 'badge-red', color: 'var(--error)' },
};

export default function ViewingsPage() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    if (!currentUser) return null;

    const myViewings = viewingBookings.filter(v => {
        if (v.searcher_id === currentUser.id || v.landlord_id === currentUser.id) return true;
        // Letting agents see viewings for properties they manage
        const listing = listings.find(l => l.id === v.property_id);
        if (listing?.letting_agent_id === currentUser.id) return true;
        return false;
    });

    const [viewings, setViewings] = useState(myViewings);
    const [statusFilter, setStatusFilter] = useState('All');
    const [agreementModalViewing, setAgreementModalViewing] = useState<ViewingBooking | null>(null);
    const [noShowPicker, setNoShowPicker] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const updateViewingStatus = (id: string, newStatus: ViewingStatus) => {
        setLoadingAction(`${id}-${newStatus}`);
        setTimeout(() => {
            setViewings(prev => prev.map(v => {
                if (v.id !== id) return v;
                // Auto-create chat channel when confirming a viewing
                if (newStatus === 'CONFIRMED') {
                    getOrCreateChatChannel(v.searcher_id, v.landlord_id, v.property_id);
                }
                return { ...v, status: newStatus, updated_at: new Date().toISOString() };
            }));
            setLoadingAction(null);
            const labels: Record<string, string> = {
                CONFIRMED: 'Viewing accepted!',
                CANCELLED: 'Viewing declined.',
                COMPLETED: 'Viewing marked as completed.',
            };
            showToast(labels[newStatus] || `Status updated to ${newStatus}`, newStatus === 'CANCELLED' ? 'warning' : 'success');
        }, 1000);
    };

    const handleAgreementUpdate = (updated: ViewingBooking) => {
        setViewings(prev => prev.map(v => v.id === updated.id ? updated : v));
        setAgreementModalViewing(updated);
    };

    const handleOutcomeCompleted = (id: string) => {
        setLoadingAction(`${id}-outcome`);
        setTimeout(() => {
            setViewings(prev => prev.map(v => v.id === id ? {
                ...v,
                status: 'COMPLETED' as ViewingStatus,
                resolution_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString(),
            } : v));
            setLoadingAction(null);
            showToast('Viewing completed! GCC score updated.', 'success');
        }, 1000);
    };

    const handleNoShow = (id: string, party: 'tenant' | 'landlord') => {
        setLoadingAction(`${id}-noshow`);
        setTimeout(() => {
            const newStatus: ViewingStatus = party === 'tenant' ? 'NO_SHOW_TENANT' : 'NO_SHOW_LANDLORD';
            setViewings(prev => prev.map(v => v.id === id ? {
                ...v,
                status: newStatus,
                resolution_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString(),
            } : v));
            setNoShowPicker(null);
            setLoadingAction(null);
            showToast(`No-show recorded for ${party}.`, 'warning');
        }, 1000);
    };

    const filteredViewings = viewings.filter(v => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'Upcoming') return ['PENDING', 'PENDING_LANDLORD_APPROVAL', 'CONFIRMED', 'AGREEMENT_SENT', 'AGENT_SIGNED', 'FULLY_SIGNED'].includes(v.status);
        if (statusFilter === 'Completed') return v.status === 'COMPLETED';
        if (statusFilter === 'Cancelled') return ['CANCELLED', 'NO_SHOW_TENANT', 'NO_SHOW_LANDLORD'].includes(v.status);
        return true;
    });

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Viewing Bookings</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        {currentUser.type === 'roommate' ? 'Your scheduled property viewings' : 'Incoming viewing requests for your properties'}
                    </p>
                    <select className="form-input form-select" style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.75rem', fontSize: '0.8125rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="All">All Viewings</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled / No-Show</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Total', value: myViewings.length, color: 'var(--text-primary)' },
                        { label: 'Confirmed', value: myViewings.filter(v => ['CONFIRMED', 'AGREEMENT_SENT', 'AGENT_SIGNED', 'FULLY_SIGNED'].includes(v.status)).length, color: 'var(--success)' },
                        { label: 'Pending', value: myViewings.filter(v => ['PENDING', 'PENDING_LANDLORD_APPROVAL'].includes(v.status)).length, color: 'var(--warning)' },
                        { label: 'Completed', value: myViewings.filter(v => v.status === 'COMPLETED').length, color: 'var(--info)' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-card-label">{s.label}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Viewing Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredViewings.map(viewing => {
                        const listing = listings.find(l => l.id === viewing.property_id);
                        const searcher = users.find(u => u.id === viewing.searcher_id);
                        const landlord = users.find(u => u.id === viewing.landlord_id);
                        const config = STATUS_CONFIG[viewing.status];
                        const isLandlord = currentUser.id === viewing.landlord_id;

                        return (
                            <div key={viewing.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '0.25rem' }}>{listing?.title || 'Unknown Property'}</h4>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <MapPin size={12} /> {listing?.address}
                                        </p>
                                    </div>
                                    <span className={`badge ${config.badge}`}>{config.label}</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}>
                                            <CalendarCheck size={14} /> {formatDate(viewing.requested_date)}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                            <Clock size={12} /> {viewing.time_slot}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {isLandlord ? 'Searcher' : 'Landlord'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.5625rem' }}>
                                                {getInitials((isLandlord ? searcher : landlord)?.name || '')}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{(isLandlord ? searcher : landlord)?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions for pending viewings */}
                                {(viewing.status === 'PENDING' || viewing.status === 'PENDING_LANDLORD_APPROVAL') && isLandlord && (
                                    <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                {searcher?.name} has requested a viewing at your property.
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                            <button onClick={() => updateViewingStatus(viewing.id, 'CONFIRMED')} className="btn btn-primary btn-sm" disabled={!!loadingAction}>
                                                {loadingAction === `${viewing.id}-CONFIRMED` ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />} Accept
                                            </button>
                                            <button onClick={() => updateViewingStatus(viewing.id, 'CANCELLED')} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} disabled={!!loadingAction}>
                                                {loadingAction === `${viewing.id}-CANCELLED` ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={14} />} Decline
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {viewing.status === 'CONFIRMED' && (
                                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
                                                    Viewing confirmed
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => updateViewingStatus(viewing.id, 'COMPLETED')}
                                                className="btn btn-primary btn-sm"
                                                disabled={!!loadingAction}
                                            >
                                                {loadingAction === `${viewing.id}-COMPLETED` ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />} Mark Completed
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Agreement-stage statuses */}
                                {(['AGREEMENT_SENT', 'AGENT_SIGNED'] as ViewingStatus[]).includes(viewing.status) && (
                                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={16} style={{ color: 'var(--brand-purple)' }} />
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--brand-purple)', fontWeight: 600 }}>
                                                    {viewing.status === 'AGREEMENT_SENT' ? 'Agreement sent, awaiting signatures' : 'Agent signed, awaiting tenant'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setAgreementModalViewing(viewing)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <FileText size={14} /> View Agreement
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* FULLY_SIGNED: Outcome tracking */}
                                {viewing.status === 'FULLY_SIGNED' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
                                                    Agreement fully signed
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setAgreementModalViewing(viewing)}
                                                className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}
                                            >
                                                <FileText size={12} /> View Agreement
                                            </button>
                                        </div>

                                        {/* Outcome question */}
                                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                            <p style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Did this viewing take place?</p>
                                            {noShowPicker === viewing.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Which party did not attend?</p>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button onClick={() => handleNoShow(viewing.id, 'tenant')} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: '0.75rem', flex: 1 }}>
                                                            <AlertTriangle size={12} /> Tenant No-Show
                                                        </button>
                                                        <button onClick={() => handleNoShow(viewing.id, 'landlord')} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: '0.75rem', flex: 1 }}>
                                                            <AlertTriangle size={12} /> Landlord No-Show
                                                        </button>
                                                        <button onClick={() => setNoShowPicker(null)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button onClick={() => handleOutcomeCompleted(viewing.id)} className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={!!loadingAction}>
                                                        {loadingAction === `${viewing.id}-outcome` ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />} Viewing Completed
                                                    </button>
                                                    <button onClick={() => setNoShowPicker(viewing.id)} className="btn btn-ghost btn-sm" style={{ flex: 1, color: 'var(--error)' }} disabled={!!loadingAction}>
                                                        <XCircle size={14} /> No-show
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* COMPLETED: LeaseHandoffCard */}
                                {viewing.status === 'COMPLETED' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle2 size={16} style={{ color: 'var(--info)' }} />
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>
                                                Viewing completed {viewing.resolution_date ? `on ${formatDate(viewing.resolution_date)}` : ''}
                                            </span>
                                        </div>
                                        {listing && searcher && landlord && (
                                            <LeaseHandoffCard
                                                viewing={viewing}
                                                property={listing}
                                                tenant={searcher}
                                                agent={landlord}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* View Agreement button for any viewing with agreement (non-active statuses) */}
                                {viewing.agreement && !['AGREEMENT_SENT', 'AGENT_SIGNED', 'FULLY_SIGNED'].includes(viewing.status) && viewing.status !== 'CONFIRMED' && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <button
                                            onClick={() => setAgreementModalViewing(viewing)}
                                            className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}
                                        >
                                            <FileText size={12} /> View Agreement
                                        </button>
                                    </div>
                                )}

                                {/* No-show status display */}
                                {(viewing.status === 'NO_SHOW_TENANT' || viewing.status === 'NO_SHOW_LANDLORD') && (
                                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--error)', fontWeight: 600 }}>
                                            {viewing.status === 'NO_SHOW_TENANT' ? 'Tenant did not attend' : 'Landlord did not attend'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {myViewings.length === 0 && (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <CalendarCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3>No viewings yet</h3>
                        <p style={{ fontSize: '0.875rem' }}>Browse properties and book your first viewing.</p>
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Agreement Modal */}
            {agreementModalViewing && (() => {
                const listing = listings.find(l => l.id === agreementModalViewing.property_id);
                const tenantUser = users.find(u => u.id === agreementModalViewing.searcher_id);
                const agentUser = users.find(u => u.id === agreementModalViewing.landlord_id);
                if (!listing || !tenantUser || !agentUser) return null;
                return (
                    <ViewingAgreementModal
                        viewing={agreementModalViewing}
                        property={listing}
                        tenant={tenantUser}
                        agent={agentUser}
                        onClose={() => setAgreementModalViewing(null)}
                        onAgreementUpdate={handleAgreementUpdate}
                    />
                );
            })()}
        </div>
    );
}
