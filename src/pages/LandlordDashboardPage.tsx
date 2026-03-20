import { useAuth } from '@/contexts/AuthContext';
import { listings, viewingBookings, users, maintenanceTickets, getInitials, formatDate, getOrCreateChatChannel } from '@/data/mockData';
import { Building2, Users as UsersIcon, CalendarCheck, CheckCircle2, XCircle, Clock, DoorOpen, ShieldCheck, Wrench, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import type { ViewingStatus, MaintenanceTicket } from '@/types';

type DashboardTab = 'overview' | 'viewings' | 'maintenance';

export default function LandlordDashboardPage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

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
    const myListingIds = myListings.map(l => l.id);
    const totalRooms = myListings.reduce((sum, l) => sum + l.total_rooms, 0);
    const occupiedRooms = myListings.reduce((sum, l) => sum + l.currentOccupants, 0);
    const availableRooms = totalRooms - occupiedRooms;

    const myViewings = viewingBookings.filter(v => v.landlord_id === currentUser.id);
    const pendingViewings = myViewings.filter(v => v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL');

    // Maintenance tickets for landlord's properties
    const myTickets = maintenanceTickets.filter(t => myListingIds.includes(t.property_id));
    const openTickets = myTickets.filter(t => t.status !== 'Resolved');

    const [viewingState, setViewingState] = useState(myViewings);
    const [ticketState, setTicketState] = useState(myTickets);
    const [maintenancePropertyFilter, setMaintenancePropertyFilter] = useState<string>('all');

    const updateStatus = (id: string, status: ViewingStatus) => {
        setViewingState(prev => prev.map(v => {
            if (v.id !== id) return v;
            if (status === 'CONFIRMED') {
                getOrCreateChatChannel(v.searcher_id, v.landlord_id, v.property_id);
            }
            return { ...v, status };
        }));
    };

    const updateTicketStatus = (ticketId: string, newStatus: MaintenanceTicket['status']) => {
        setTicketState(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    };

    // Sort maintenance: emergency first, then high, then by date
    const URGENCY_ORDER: Record<string, number> = { 'Emergency': 0, 'Medium': 1, 'Low': 2 };
    const filteredTickets = useMemo(() => {
        let result = ticketState;
        if (maintenancePropertyFilter !== 'all') {
            result = result.filter(t => t.property_id === maintenancePropertyFilter);
        }
        return [...result].sort((a, b) => {
            const urgA = URGENCY_ORDER[a.urgency] ?? 3;
            const urgB = URGENCY_ORDER[b.urgency] ?? 3;
            if (urgA !== urgB) return urgA - urgB;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }, [ticketState, maintenancePropertyFilter]);

    const tabStyle = (tab: DashboardTab) => ({
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: 600 as const,
        borderBottom: activeTab === tab ? '2px solid var(--brand-purple-light)' : '2px solid transparent',
        color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
        background: 'transparent',
        border: 'none',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid' as const,
        borderBottomColor: activeTab === tab ? 'var(--brand-purple-light)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Landlord Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Overview of your property portfolio and incoming viewing requests.
                </p>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Properties', value: myListings.length, icon: <Building2 size={20} />, color: 'var(--brand-purple-light)' },
                        { label: 'Occupied Rooms', value: occupiedRooms, icon: <UsersIcon size={20} />, color: 'var(--success)' },
                        { label: 'Available Rooms', value: availableRooms, icon: <DoorOpen size={20} />, color: 'var(--info)' },
                        { label: 'Pending Viewings', value: pendingViewings.length, icon: <Clock size={20} />, color: 'var(--warning)' },
                        { label: 'Open Tickets', value: openTickets.length, icon: <Wrench size={20} />, color: openTickets.length > 0 ? 'var(--error)' : 'var(--success)' },
                    ].map(card => (
                        <div key={card.label} className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: card.color }}>
                                {card.icon}
                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                    <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button style={tabStyle('viewings')} onClick={() => setActiveTab('viewings')}>Viewings</button>
                    <button style={tabStyle('maintenance')} onClick={() => setActiveTab('maintenance')}>
                        Maintenance {openTickets.length > 0 && <span className="badge badge-red" style={{ fontSize: '0.5625rem', marginLeft: '0.375rem' }}>{openTickets.length}</span>}
                    </button>
                </div>

                {/* ─── Overview Tab ─────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Property Portfolio</h3>
                            <Link to="/add-property" className="btn btn-primary btn-sm">+ Add Property</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                            {myListings.map(l => {
                                const occPercent = l.maxLegalOccupancy > 0 ? (l.currentOccupants / l.maxLegalOccupancy) * 100 : 0;
                                const occColor = occPercent >= 90 ? 'var(--error)' : occPercent >= 70 ? '#f59e0b' : 'var(--success)';
                                return (
                                    <Link to={`/listing/${l.slug || l.id}`} key={l.id} style={{ textDecoration: 'none' }}>
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
                )}

                {/* ─── Viewings Tab ────────────────────────────── */}
                {activeTab === 'viewings' && (
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
                                            {['Status', 'Property', 'Date', 'Tenant', 'Actions'].map((h, i) => (
                                                <th key={h} style={{ textAlign: i === 4 ? 'right' : 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                            ))}
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
                )}

                {/* ─── Maintenance Tab ─────────────────────────── */}
                {activeTab === 'maintenance' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Maintenance Tickets</h3>
                            <select
                                className="form-input form-select"
                                style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.75rem', fontSize: '0.8125rem' }}
                                value={maintenancePropertyFilter}
                                onChange={e => setMaintenancePropertyFilter(e.target.value)}
                            >
                                <option value="all">All Properties</option>
                                {myListings.map(l => (
                                    <option key={l.id} value={l.id}>{l.title}</option>
                                ))}
                            </select>
                        </div>

                        {filteredTickets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Wrench size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                <p>No maintenance tickets.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            {['Property', 'Tenant', 'Category', 'Priority', 'Status', 'Submitted', 'Actions'].map((h, i) => (
                                                <th key={h} style={{ textAlign: i === 6 ? 'right' : 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.map(t => {
                                            const listing = listings.find(l => l.id === t.property_id);
                                            const tenant = users.find(u => u.id === t.tenant_id);
                                            const priorityBadge = t.urgency === 'Emergency' ? 'badge-red' : t.urgency === 'Medium' ? 'badge-blue' : '';
                                            const priorityColor = t.urgency === 'Emergency' ? 'var(--error)' : t.urgency === 'Medium' ? 'var(--info)' : 'var(--text-muted)';
                                            const statusBadge = t.status === 'Reported' ? 'badge-orange' : t.status === 'In Progress' ? 'badge-blue' : 'badge-green';
                                            return (
                                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, maxWidth: '160px' }}>
                                                        {listing?.title || '—'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                            <div className="avatar avatar-sm" style={{ width: '22px', height: '22px', fontSize: '0.5rem' }}>
                                                                {getInitials(tenant?.name || '?')}
                                                            </div>
                                                            <span>{tenant?.name || 'Unknown'}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>{t.issue_type}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <span className={`badge ${priorityBadge}`} style={{ fontSize: '0.625rem', color: priorityColor }}>
                                                            {t.urgency === 'Emergency' && <AlertTriangle size={10} style={{ marginRight: '0.25rem' }} />}
                                                            {t.urgency}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <span className={`badge ${statusBadge}`} style={{ fontSize: '0.625rem' }}>{t.status}</span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {formatDate(t.created_at)}
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                                                            {t.status === 'Reported' && (
                                                                <button onClick={() => updateTicketStatus(t.id, 'In Progress')} className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>
                                                                    Acknowledge
                                                                </button>
                                                            )}
                                                            {t.status !== 'Resolved' && (
                                                                <button onClick={() => updateTicketStatus(t.id, 'Resolved')} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem', color: 'var(--success)' }}>
                                                                    <CheckCircle2 size={12} /> Resolve
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
