import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { viewingBookings, listings, users, formatCurrency, getInitials, formatDate } from '@/data/mockData';
import { CalendarCheck, Clock, MapPin, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { ViewingStatus } from '@/types';

const STATUS_CONFIG: Record<ViewingStatus, { label: string; badge: string; color: string }> = {
    PENDING: { label: 'Pending', badge: 'badge-orange', color: 'var(--warning)' },
    PENDING_LANDLORD_APPROVAL: { label: 'Awaiting Landlord', badge: 'badge-blue', color: 'var(--info)' },
    CONFIRMED: { label: 'Confirmed', badge: 'badge-green', color: 'var(--success)' },
    COMPLETED: { label: 'Completed', badge: 'badge-green', color: 'var(--success)' },
    CANCELLED: { label: 'Cancelled', badge: 'badge-red', color: 'var(--error)' },
};

export default function ViewingsPage() {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    const myViewings = viewingBookings.filter(v =>
        v.searcher_id === currentUser.id || v.landlord_id === currentUser.id
    );

    const [viewings, setViewings] = useState(myViewings);
    const [statusFilter, setStatusFilter] = useState('All');

    const updateViewingStatus = (id: string, newStatus: ViewingStatus) => {
        setViewings(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    };

    const filteredViewings = viewings.filter(v => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'Upcoming') return ['PENDING', 'PENDING_LANDLORD_APPROVAL', 'CONFIRMED'].includes(v.status);
        if (statusFilter === 'Completed') return v.status === 'COMPLETED';
        if (statusFilter === 'Cancelled') return v.status === 'CANCELLED';
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
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Stats */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Total', value: myViewings.length, color: 'var(--text-primary)' },
                        { label: 'Confirmed', value: myViewings.filter(v => v.status === 'CONFIRMED').length, color: 'var(--success)' },
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
                                            <button onClick={() => updateViewingStatus(viewing.id, 'CONFIRMED')} className="btn btn-primary btn-sm"><CheckCircle2 size={14} /> Accept</button>
                                            <button onClick={() => updateViewingStatus(viewing.id, 'CANCELLED')} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}><XCircle size={14} /> Decline</button>
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
                                            >
                                                <CheckCircle2 size={14} /> Mark Completed
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {viewing.status === 'COMPLETED' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle2 size={16} style={{ color: 'var(--info)' }} />
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>
                                                Viewing completed {viewing.resolution_date ? `on ${formatDate(viewing.resolution_date)}` : ''}
                                            </span>
                                        </div>
                                        <Link to={`/contracts/${viewing.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                            Proceed to Lease Setup
                                        </Link>
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
        </div>
    );
}
