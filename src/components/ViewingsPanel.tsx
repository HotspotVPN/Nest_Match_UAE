import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getViewingsForUser, getUserById, getListingById, listings,
} from '@/data/mockData';
import {
    Calendar, Clock, MapPin, CheckCircle2, XCircle, RefreshCw,
    Plus, User as UserIcon, ShieldCheck,
} from 'lucide-react';
import type { ViewingStatus } from '@/types';
import type { User } from '@/types';

const timeSlots = [
    '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
    '11:00 - 11:30', '11:30 - 12:00', '13:00 - 13:30', '13:30 - 14:00',
    '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00',
    '16:00 - 16:30', '16:30 - 17:00',
];

const statusLabel = (s: ViewingStatus) => {
    const map: Record<ViewingStatus, string> = {
        'PENDING': 'Pending',
        'PENDING_LANDLORD_APPROVAL': 'Awaiting Approval',
        'CONFIRMED': 'Confirmed',
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled',
    };
    return map[s] || s;
};

const statusColor = (s: ViewingStatus) => {
    if (s === 'CONFIRMED') return 'badge-green';
    if (s === 'PENDING' || s === 'PENDING_LANDLORD_APPROVAL') return 'badge-orange';
    if (s === 'CANCELLED') return 'badge-red';
    if (s === 'COMPLETED') return 'badge-blue';
    return 'badge-purple';
};

const statusIcon = (s: ViewingStatus) => {
    if (s === 'CONFIRMED' || s === 'COMPLETED') return <CheckCircle2 size={14} />;
    if (s === 'CANCELLED') return <XCircle size={14} />;
    return <Clock size={14} />;
};

export default function ViewingsPanel({ currentUser }: { currentUser: User }) {
    const [showNewModal, setShowNewModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedListing, setSelectedListing] = useState('');
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [counterDate, setCounterDate] = useState('');
    const [counterTime, setCounterTime] = useState('');

    const isLandlord = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';
    const userViewings = getViewingsForUser(currentUser.id);

    const today = new Date();
    const calendarDays = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });

    const viewingsOnDate = (date: string) => userViewings.filter((v) => v.requested_date.startsWith(date));

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '1.25rem', fontWeight: 800 }}>
                    <Calendar size={20} style={{ color: 'var(--brand-purple-light)' }} />
                    Viewing Calendar
                    <span className="badge badge-purple" style={{ marginLeft: '0.5rem' }}>{userViewings.length}</span>
                </h3>
                {isLandlord && (
                    <button onClick={() => setShowNewModal(true)} className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem' }}>
                        <Plus size={16} /> Open New Slot
                    </button>
                )}
            </div>

            {/* Mini Calendar View */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <div key={d} style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', padding: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
                    ))}
                    {calendarDays.slice(0, 21).map((date) => {
                        const day = new Date(date).getDate();
                        const hasViewing = viewingsOnDate(date).length > 0;
                        const isSelected = selectedDate === date;
                        return (
                            <button key={date} onClick={() => setSelectedDate(date)} style={{
                                width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                                background: isSelected ? 'var(--brand-purple)' : hasViewing ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                                color: isSelected ? 'white' : hasViewing ? 'var(--brand-purple-light)' : 'var(--text-primary)',
                                border: isSelected ? '1px solid var(--brand-purple)' : hasViewing ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                                transition: 'all 0.2s',
                            }}>{day}</button>
                        );
                    })}
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {(['CONFIRMED', 'PENDING', 'PENDING_LANDLORD_APPROVAL', 'COMPLETED'] as ViewingStatus[]).map((s) => {
                        const count = userViewings.filter((v) => v.status === s).length;
                        if (count === 0) return null;
                        return (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s === 'CONFIRMED' ? 'var(--success)' : s === 'COMPLETED' ? 'var(--brand-blue)' : 'var(--warning)' }} />
                                {statusLabel(s)} ({count})
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* List of Viewings */}
            {userViewings.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Calendar size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                    </div>
                    <h4 style={{ marginBottom: '0.5rem' }}>No Viewings Scheduled</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                        {isLandlord ? 'Set up available slots for prospective tenants to visit your properties.' : 'Start exploring Dubai properties to request your first viewing.'}
                    </p>
                    <Link to="/browse" className="btn btn-primary btn-sm">Browse Properties</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {userViewings.map((v) => {
                        const listing = getListingById(v.property_id);
                        const otherUser = getUserById(isLandlord ? v.searcher_id : v.landlord_id);
                        const viewDate = new Date(v.requested_date);
                        return (
                            <div key={v.id} className="glass-card hover-card" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '60px', minWidth: '60px', textAlign: 'center', padding: '0.625rem',
                                        borderRadius: 'var(--radius-lg)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                                        boxShadow: '0 4px 12px rgba(124,58,237,0.1)',
                                    }}>
                                        <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--brand-purple-light)', textTransform: 'uppercase', marginBottom: '2px' }}>
                                            {viewDate.toLocaleDateString('en-GB', { month: 'short' })}
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                                            {viewDate.getDate()}
                                        </div>
                                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                                            {viewDate.toLocaleDateString('en-GB', { weekday: 'short' })}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div>
                                                <Link to={`/listing/${v.property_id}`} style={{ fontWeight: 800, fontSize: '1.0625rem', textDecoration: 'none', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                                                    {listing?.title || 'Property'}
                                                </Link>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                                    <MapPin size={12} className="text-purple-light" /> {listing?.address?.split(',').slice(0, 2).join(', ')}
                                                </div>
                                            </div>
                                            <span className={`badge ${statusColor(v.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.75rem', fontSize: '0.6875rem', fontWeight: 800 }}>
                                                {statusIcon(v.status)} {statusLabel(v.status).toUpperCase()}
                                            </span>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Clock size={14} className="text-muted" />
                                                <span style={{ fontWeight: 700 }}>{v.time_slot}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <UserIcon size={14} className="text-muted" />
                                                <span style={{ fontWeight: 700 }}>{isLandlord ? 'Client' : 'Handler'}: {otherUser?.name || 'Vetting...'}</span>
                                            </div>
                                        </div>

                                        {(v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL') && (
                                            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                                                {isLandlord ? (
                                                    <>
                                                        <button className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.25rem' }}>Confirm Appointment</button>
                                                        <button onClick={() => setRespondingTo(v.id)} className="btn btn-ghost btn-sm">Reschedule</button>
                                                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Decline</button>
                                                    </>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                                        <RefreshCw size={14} className="spin-slow" /> Awaiting landlord confirmation...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {respondingTo === v.id && (
                                    <div style={{ marginTop: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--brand-purple-light)' }}>
                                        <h5 style={{ marginBottom: '1rem', fontSize: '0.9375rem', fontWeight: 800 }}>Propose Different Slot</h5>
                                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                            <input type="date" className="form-input" style={{ flex: 1, minWidth: '150px' }} value={counterDate} onChange={(e) => setCounterDate(e.target.value)} />
                                            <select className="form-input form-select" style={{ flex: 1, minWidth: '150px' }} value={counterTime} onChange={(e) => setCounterTime(e.target.value)}>
                                                <option value="">Select Time Slot</option>
                                                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.5rem' }}>Send Proposal</button>
                                            <button onClick={() => setRespondingTo(null)} className="btn btn-ghost btn-sm">Dismiss</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* New Slot Modal */}
            {showNewModal && (
                <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Viewing Slot</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowNewModal(false)}><XCircle size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Target Property</label>
                                <select className="form-input form-select" value={selectedListing} onChange={(e) => setSelectedListing(e.target.value)}>
                                    <option value="">Choose one of your listings...</option>
                                    {listings.filter(l => l.landlord_id === currentUser.id || l.letting_agent_id === currentUser.id).map(l => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Available Date</label>
                                <input type="date" className="form-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Time Intervals</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {timeSlots.slice(0, 9).map((t) => (
                                        <button key={t} onClick={() => setSelectedTime(t)} className={`btn ${selectedTime === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ fontSize: '0.6875rem', fontWeight: 700 }}>{t}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--success)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={14} /> This slot will be DLD-verified and synced with RERA portals.
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button onClick={() => setShowNewModal(false)} className="btn btn-primary btn-lg" style={{ flex: 2, fontWeight: 800 }}>Publish Slot</button>
                                <button onClick={() => setShowNewModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Discard</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
