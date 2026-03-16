import { useAuth } from '@/contexts/AuthContext';
import { listings, viewingBookings, users, getInitials, formatDate } from '@/data/mockData';
import { Building2, Users as UsersIcon, CalendarCheck, CheckCircle2, XCircle, Clock, DoorOpen, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ViewingStatus } from '@/types';

export default function LandlordDashboardPage() {
    const { currentUser } = useAuth();

    if (!currentUser || (currentUser.type !== 'landlord' && currentUser.type !== 'letting_agent')) {
        return (
            <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <Building2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h2>Landlord / Agent Access Only</h2>
                <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Go Home</Link>
            </div>
        );
    }

    const myListings = listings.filter(l => l.landlord_id === currentUser.id || l.letting_agent_id === currentUser.id);
    const totalRooms = myListings.reduce((sum, l) => sum + l.total_rooms, 0);
    const occupiedRooms = myListings.reduce((sum, l) => sum + l.currentOccupants, 0);
    const availableRooms = totalRooms - occupiedRooms;

    const myViewings = viewingBookings.filter(v => v.landlord_id === currentUser.id);
    const pendingViewings = myViewings.filter(v => v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL');
    const confirmedViewings = myViewings.filter(v => v.status === 'CONFIRMED');

    const [viewingState, setViewingState] = useState(myViewings);

    const updateStatus = (id: string, status: ViewingStatus) => {
        setViewingState(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    };

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Landlord Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                    Overview of your property portfolio and incoming viewing requests.
                </p>

                {/* Summary Cards */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Properties', value: myListings.length, icon: <Building2 size={20} />, color: 'var(--brand-purple-light)' },
                        { label: 'Occupied Rooms', value: occupiedRooms, icon: <UsersIcon size={20} />, color: 'var(--success)' },
                        { label: 'Available Rooms', value: availableRooms, icon: <DoorOpen size={20} />, color: 'var(--info)' },
                        { label: 'Pending Viewings', value: pendingViewings.length, icon: <Clock size={20} />, color: 'var(--warning)' },
                    ].map(card => (
                        <div key={card.label} className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: card.color }}>
                                {card.icon}
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Property Portfolio */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Property Portfolio</h3>
                        <Link to="/add-property" className="btn btn-primary btn-sm">+ Add Property</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                        {myListings.map(l => {
                            const occPercent = l.maxLegalOccupancy > 0 ? (l.currentOccupants / l.maxLegalOccupancy) * 100 : 0;
                            const occColor = occPercent >= 90 ? 'var(--error)' : occPercent >= 70 ? '#f59e0b' : 'var(--success)';
                            return (
                                <Link to={`/listing/${l.id}`} key={l.id} style={{ textDecoration: 'none' }}>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{l.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{l.district} · {l.currentOccupants}/{l.maxLegalOccupancy} occupants</div>
                                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg-surface-3)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <div style={{ height: '100%', width: `${occPercent}%`, background: occColor, borderRadius: '2px' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>{l.available_rooms} room{l.available_rooms !== 1 ? 's' : ''} available</span>
                                            <span style={{ fontWeight: 700 }}>AED {l.rent_per_room}/mo</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Viewing Requests Table */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Viewing Requests</h3>
                    {viewingState.filter(v => v.status !== 'CANCELLED').length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <CalendarCheck size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                            <p>No viewing requests yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tenant</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewingState.filter(v => v.status !== 'CANCELLED').map(v => {
                                        const listing = listings.find(l => l.id === v.property_id);
                                        const tenant = users.find(u => u.id === v.searcher_id);
                                        const statusMap: Record<string, { label: string; badge: string }> = {
                                            PENDING: { label: 'Pending', badge: 'badge-orange' },
                                            PENDING_LANDLORD_APPROVAL: { label: 'Needs Approval', badge: 'badge-orange' },
                                            CONFIRMED: { label: 'Confirmed', badge: 'badge-green' },
                                            COMPLETED: { label: 'Completed', badge: 'badge-blue' },
                                        };
                                        const st = statusMap[v.status] || { label: v.status, badge: '' };
                                        return (
                                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span className={`badge ${st.badge}`} style={{ fontSize: '0.625rem' }}>{st.label}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{listing?.title || '—'}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    {formatDate(v.requested_date)}<br />
                                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{v.time_slot}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.5rem' }}>
                                                            {getInitials(tenant?.name || '?')}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{tenant?.name || 'Unknown'}</div>
                                                            {tenant?.gccScore && tenant.gccScore > 0 && (
                                                                <span style={{ fontSize: '0.5625rem', color: '#f59e0b' }}>GCC: {tenant.gccScore}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                                    {(v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL') && (
                                                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => updateStatus(v.id, 'CONFIRMED')} className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem' }}>
                                                                <CheckCircle2 size={12} /> Accept
                                                            </button>
                                                            <button onClick={() => updateStatus(v.id, 'CANCELLED')} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.75rem', color: 'var(--error)' }}>
                                                                <XCircle size={12} /> Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                    {v.status === 'CONFIRMED' && (
                                                        <button onClick={() => updateStatus(v.id, 'COMPLETED')} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.75rem' }}>
                                                            <CheckCircle2 size={12} /> Complete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
