import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    getViewingsForUser, getUserById, getListingById, formatDate,
    getInitials, viewings as allViewings,
} from '@/data/mockData';
import {
    Calendar, Clock, MapPin, CheckCircle2, XCircle, RefreshCw,
    Plus, ArrowRight, Send, User as UserIcon,
} from 'lucide-react';
import type { Viewing, ViewingStatus } from '@/types';

export default function ViewingsPage() {
    const { currentUser } = useAuth();
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedListing, setSelectedListing] = useState('');
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [counterDate, setCounterDate] = useState('');
    const [counterTime, setCounterTime] = useState('');

    if (!currentUser) {
        return (
            <div className="section">
                <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <div className="glass-card" style={{ padding: '3rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Not Signed In</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please sign in to manage viewings.</p>
                        <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }

    const isLandlord = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';
    const userViewings = getViewingsForUser(currentUser.id);

    const statusColor = (s: ViewingStatus) => {
        if (s === 'confirmed') return 'badge-green';
        if (s === 'proposed' || s === 'rescheduled') return 'badge-orange';
        if (s === 'cancelled') return 'badge-red';
        if (s === 'completed') return 'badge-blue';
        return 'badge-purple';
    };

    const statusIcon = (s: ViewingStatus) => {
        if (s === 'confirmed' || s === 'completed') return <CheckCircle2 size={14} />;
        if (s === 'cancelled') return <XCircle size={14} />;
        return <Clock size={14} />;
    };

    const timeSlots = [
        '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
        '11:00 - 11:30', '11:30 - 12:00', '13:00 - 13:30', '13:30 - 14:00',
        '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00',
        '16:00 - 16:30', '16:30 - 17:00',
    ];

    // Generate calendar days for the next 30 days
    const today = new Date();
    const calendarDays = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });

    const viewingsOnDate = (date: string) => userViewings.filter((v) => v.date === date);

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                            <span className="gradient-text">Viewings</span> Calendar
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {isLandlord ? 'Manage viewing slots and confirm with prospective tenants' : 'Request and manage property viewings'}
                        </p>
                    </div>
                    {isLandlord && (
                        <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
                            <Plus size={16} /> Create Viewing Slot
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                    {/* Calendar sidebar */}
                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} style={{ color: 'var(--brand-purple-light)' }} /> March 2026
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', padding: '4px', textTransform: 'uppercase' }}>{d}</div>
                            ))}
                            {calendarDays.slice(0, 28).map((date) => {
                                const day = new Date(date).getDate();
                                const hasViewing = viewingsOnDate(date).length > 0;
                                const isSelected = selectedDate === date;
                                return (
                                    <button key={date} onClick={() => setSelectedDate(date)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: 'var(--radius-full)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                            background: isSelected ? 'var(--brand-purple)' : hasViewing ? 'rgba(124,58,237,0.15)' : 'transparent',
                                            color: isSelected ? 'white' : hasViewing ? 'var(--brand-purple-light)' : 'var(--text-primary)',
                                            border: hasViewing && !isSelected ? '1px solid var(--brand-purple)' : '1px solid transparent',
                                            transition: 'all 0.15s',
                                        }}>
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {(['confirmed', 'proposed', 'rescheduled', 'completed'] as ViewingStatus[]).map((s) => {
                                const count = userViewings.filter((v) => v.status === s).length;
                                return (
                                    <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                                        <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{s}</span>
                                        <span className={`badge ${statusColor(s)}`}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Viewings list */}
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {userViewings.length === 0 ? (
                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                    <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                    <h3>No Viewings Yet</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        {isLandlord ? 'Create viewing slots for your properties' : 'Request a viewing on a property you are interested in'}
                                    </p>
                                    <Link to="/browse" className="btn btn-primary">Browse Listings</Link>
                                </div>
                            ) : (
                                userViewings.map((v) => {
                                    const listing = getListingById(v.listing_id);
                                    const otherUser = getUserById(isLandlord ? v.tenant_id : v.landlord_id);
                                    return (
                                        <div key={v.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                {/* Date badge */}
                                                <div style={{
                                                    width: '60px', minWidth: '60px', textAlign: 'center',
                                                    padding: '0.5rem', borderRadius: 'var(--radius-md)',
                                                    background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                                                }}>
                                                    <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--brand-purple-light)', textTransform: 'uppercase' }}>
                                                        {new Date(v.date).toLocaleDateString('en-GB', { month: 'short' })}
                                                    </div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                                        {new Date(v.date).getDate()}
                                                    </div>
                                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                                                        {new Date(v.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                                                        <Link to={`/listing/${v.listing_id}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--text-primary)' }}>
                                                            {listing?.title || 'Property'}
                                                        </Link>
                                                        <span className={`badge ${statusColor(v.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            {statusIcon(v.status)} {v.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <Clock size={13} /> {v.time_slot}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <MapPin size={13} /> {listing?.address?.split(',').slice(0, 2).join(', ')}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <UserIcon size={13} /> {isLandlord ? 'Tenant' : 'Host'}: {otherUser?.name || 'Unknown'}
                                                        </span>
                                                    </div>

                                                    {v.notes && (
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' }}>
                                                            {v.notes}
                                                        </div>
                                                    )}

                                                    {/* Counter proposal */}
                                                    {v.counter_proposal && (
                                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', marginBottom: '0.5rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                                                <RefreshCw size={13} style={{ color: 'var(--warning)' }} />
                                                                <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--warning)' }}>
                                                                    Counter Proposal from {v.counter_proposal.proposed_by === 'landlord' ? 'Landlord' : 'Tenant'}
                                                                </span>
                                                            </div>
                                                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                                {formatDate(v.counter_proposal.date)} at {v.counter_proposal.time_slot}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    {v.status === 'proposed' && (
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {(isLandlord && v.proposed_by === 'tenant') || (!isLandlord && v.proposed_by === 'landlord') ? (
                                                                <>
                                                                    <button className="btn btn-primary btn-sm">
                                                                        <CheckCircle2 size={13} /> Accept
                                                                    </button>
                                                                    <button onClick={() => setRespondingTo(v.id)} className="btn btn-secondary btn-sm">
                                                                        <RefreshCw size={13} /> Propose New Time
                                                                    </button>
                                                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
                                                                        <XCircle size={13} /> Decline
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                                    Waiting for {isLandlord ? 'tenant' : 'landlord'} response...
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {v.counter_proposal && v.status !== 'confirmed' && (
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                            <button className="btn btn-primary btn-sm">
                                                                <CheckCircle2 size={13} /> Accept New Time
                                                            </button>
                                                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
                                                                <XCircle size={13} /> Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Counter proposal form */}
                                            {respondingTo === v.id && (
                                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                                                    <h5 style={{ marginBottom: '0.75rem' }}>Propose a New Date & Time</h5>
                                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                        <input type="date" className="form-input" style={{ flex: 1, minWidth: '150px' }} value={counterDate} onChange={(e) => setCounterDate(e.target.value)} />
                                                        <select className="form-input form-select" style={{ flex: 1, minWidth: '150px' }} value={counterTime} onChange={(e) => setCounterTime(e.target.value)}>
                                                            <option value="">Select Time</option>
                                                            {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn btn-primary btn-sm"><Send size={13} /> Send Proposal</button>
                                                        <button onClick={() => setRespondingTo(null)} className="btn btn-ghost btn-sm">Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* New Viewing Modal */}
                {showNewModal && (
                    <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Create Viewing Slot</h3>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Property</label>
                                <select className="form-input form-select" value={selectedListing} onChange={(e) => setSelectedListing(e.target.value)}>
                                    <option value="">Select property</option>
                                    <option value="listing-1">Modern 3-Bed Flat — Edgware</option>
                                    <option value="listing-2">Cosy 2-Bed — Highgate</option>
                                    <option value="listing-3">Creative Studio 2-Bed — Bethnal Green</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Date</label>
                                <input type="date" className="form-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Time Slot</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem' }}>
                                    {timeSlots.map((t) => (
                                        <button key={t} onClick={() => setSelectedTime(t)}
                                            className={`btn ${selectedTime === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                            style={{ fontSize: '0.75rem' }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <button onClick={() => setShowNewModal(false)} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                                    <Calendar size={16} /> Create Slot
                                </button>
                                <button onClick={() => setShowNewModal(false)} className="btn btn-ghost">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
