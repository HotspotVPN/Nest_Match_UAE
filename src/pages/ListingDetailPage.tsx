import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listings, users, formatCurrency, getInitials, viewingBookings } from '@/data/mockData';
import {
    MapPin, Train, ShieldCheck, Users as UsersIcon, Star, CalendarCheck,
    ChevronLeft, Check, AlertTriangle, Building2, Award,
} from 'lucide-react';

export default function ListingDetailPage() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const listing = listings.find(l => l.id === id);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');

    if (!listing) return (
        <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <h2>Property Not Found</h2>
            <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}><ChevronLeft size={16} /> Back to Browse</Link>
        </div>
    );

    const landlord = users.find(u => u.id === listing.landlord_id);
    const agent = listing.letting_agent_id ? users.find(u => u.id === listing.letting_agent_id) : null;
    const occupancyPercent = (listing.currentOccupants / listing.maxLegalOccupancy) * 100;
    const occupancyClass = occupancyPercent >= 100 ? 'full' : occupancyPercent >= 80 ? 'warning' : 'safe';
    const avgRating = listing.property_ratings?.length ? listing.property_ratings.reduce((sum, r) => sum + (r.acQuality + r.amenities + r.maintenanceSpeed) / 3, 0) / listing.property_ratings.length : 0;

    const hasActiveViewing = currentUser && viewingBookings.some(v => v.property_id === listing.id && v.searcher_id === currentUser.id && !['COMPLETED', 'SEARCHER_NO_SHOW', 'LANDLORD_NO_SHOW'].includes(v.status));

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Link to="/browse" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
                    <ChevronLeft size={14} /> Back to Browse
                </Link>

                {/* Image placeholder */}
                <div style={{ height: '320px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--bg-surface-2), var(--bg-surface-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Building2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        <div style={{ color: 'var(--text-muted)' }}>{listing.district}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Left Column */}
                    <div>
                        {/* Compliance Badges */}
                        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-green"><ShieldCheck size={12} /> Municipality Verified</span>
                            <span className="badge badge-blue">RERA Escrow</span>
                            {listing.rera_escrow_verified && <span className="badge badge-uaepass">Escrow Active</span>}
                        </div>

                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{listing.title}</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <MapPin size={16} /> {listing.address}
                        </p>

                        {/* Description */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.75rem' }}>About This Property</h3>
                            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>{listing.description}</p>
                        </div>

                        {/* UAE Compliance Section */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={20} style={{ color: 'var(--uaepass-green-light)' }} /> Compliance & Permits
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[
                                    { label: 'Makani Number', value: listing.makaniNumber, verified: true },
                                    { label: 'Trakheesi Permit', value: listing.trakheesiPermit, verified: true },
                                    { label: 'Municipality Permit', value: listing.municipalityPermit, verified: true },
                                    { label: 'Max Legal Occupancy', value: `${listing.maxLegalOccupancy} persons`, verified: true },
                                ].map(item => (
                                    <div key={item.label} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{item.label}</div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            {item.value}
                                            {item.verified && <Check size={14} style={{ color: 'var(--success)' }} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Occupancy */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UsersIcon size={20} /> Occupancy Status
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                                <span style={{ fontSize: '0.875rem' }}>Current: {listing.currentOccupants} / {listing.maxLegalOccupancy}</span>
                                <span style={{ fontSize: '0.75rem', color: occupancyClass === 'full' ? 'var(--error)' : occupancyClass === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
                                    {occupancyClass === 'full' ? 'AT CAPACITY' : occupancyClass === 'warning' ? 'Nearly Full' : 'Available'}
                                </span>
                            </div>
                            <div className="occupancy-bar" style={{ height: '8px', marginBottom: '0.75rem' }}>
                                <div className={`occupancy-bar-fill ${occupancyClass}`} style={{ width: `${occupancyPercent}%` }} />
                            </div>
                            {occupancyClass === 'full' && (
                                <div style={{ padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--error-bg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertTriangle size={14} style={{ color: 'var(--error)' }} />
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--error)' }}>This property is at legal capacity under Dubai Law No. 4</span>
                                </div>
                            )}
                        </div>

                        {/* Amenities */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.75rem' }}>Amenities</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {listing.amenities.map(a => <span key={a} className="tag">{a}</span>)}
                            </div>
                        </div>

                        {/* Transport */}
                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem' }}>Transport</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {listing.transport_chips.map((chip, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)' }}>
                                            <Train size={16} style={{ color: chip.line_color || 'var(--text-muted)' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{chip.label}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chip.walk_time} walk · {chip.type.charAt(0).toUpperCase() + chip.type.slice(1)}</div>
                                            </div>
                                            {chip.lines?.map(line => (
                                                <span key={line} className="badge" style={{ marginLeft: 'auto', background: `${chip.line_color}20`, color: chip.line_color, border: `1px solid ${chip.line_color}40`, fontSize: '0.625rem' }}>{line}</span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Star Ratings — NO TEXT, defamation safe */}
                        {listing.property_ratings && listing.property_ratings.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={20} style={{ color: '#f59e0b' }} /> Property Ratings
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({listing.property_ratings.length} ratings)</span>
                                </h3>
                                {/* Aggregate */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                    {[
                                        { label: 'AC & Cooling', key: 'acQuality' as const },
                                        { label: 'Building Amenities', key: 'amenities' as const },
                                        { label: 'Maintenance Speed', key: 'maintenanceSpeed' as const },
                                    ].map(({ label, key }) => {
                                        const avg = listing.property_ratings!.reduce((s, r) => s + r[key], 0) / listing.property_ratings!.length;
                                        return (
                                            <div key={key} style={{ textAlign: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{avg.toFixed(1)}</div>
                                                <div className="star-rating-display">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <span key={s} className={`star ${s <= Math.round(avg) ? 'filled' : ''}`}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* NOTE: NO TEXT REVIEWS — UAE Cybercrime Law compliance */}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        {/* Price Card */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'sticky', top: '80px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
                                {formatCurrency(listing.rent_per_room)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>per room / month</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Deposit</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(listing.deposit)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Bills</span>
                                <span style={{ fontWeight: 600 }}>{listing.bills_included ? 'Included' : 'Split'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Available Rooms</span>
                                <span style={{ fontWeight: 600 }}>{listing.available_rooms}</span>
                            </div>

                            <hr className="divider" />

                            {/* Book Viewing CTA */}
                            {listing.available_rooms > 0 && currentUser?.type === 'roommate' && (
                                <>
                                    {hasActiveViewing ? (
                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.3)', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>Viewing already booked</span>
                                        </div>
                                    ) : (
                                        <button onClick={() => setShowBookingModal(true)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                            <CalendarCheck size={18} /> Book Viewing
                                        </button>
                                    )}
                                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                                        50 AED refundable hold to confirm your attendance
                                    </p>
                                </>
                            )}

                            {/* Landlord Info */}
                            {landlord && (
                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div className="avatar avatar-md">{getInitials(landlord.name)}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{landlord.name}</div>
                                            <span className="verified-badge"><ShieldCheck size={12} /> UAE PASS Verified</span>
                                        </div>
                                    </div>
                                    {landlord.rating && (
                                        <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>★ {landlord.rating.toFixed(1)} ({landlord.total_reviews} reviews)</div>
                                    )}
                                    {agent && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Managed by {agent.name} · <span style={{ color: 'var(--brand-purple-light)' }}>{agent.rera_license}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* House Rules */}
                            <div style={{ marginTop: '1rem' }}>
                                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>House Rules</h4>
                                {listing.house_rules.map((rule, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                        <Check size={12} style={{ color: 'var(--success)' }} /> {rule}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Modal */}
                {showBookingModal && (
                    <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            {bookingStep === 'details' && (
                                <>
                                    <h2 style={{ marginBottom: '0.5rem' }}>Book a Viewing</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{listing.title}</p>

                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label">Preferred Date</label>
                                        <input type="date" className="form-input" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label">Preferred Time</label>
                                        <select className="form-input form-select" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                                            <option value="">Select a time slot</option>
                                            {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', border: '1px solid rgba(251,146,60,0.3)', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                            <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                                            <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--warning)' }}>Two-Way Commitment Hold</span>
                                        </div>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                            A temporary <strong>50 AED hold</strong> will be placed on your card. You will only be charged
                                            if you fail to attend. The landlord also agrees to a 50 AED penalty if they cancel.
                                            This hold will be automatically released after a completed viewing.
                                        </p>
                                    </div>

                                    <button onClick={() => setBookingStep('payment')} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!bookingDate || !bookingTime}>
                                        Continue to Payment Hold
                                    </button>
                                </>
                            )}

                            {bookingStep === 'payment' && (
                                <>
                                    <h2 style={{ marginBottom: '0.5rem' }}>Confirm 50 AED Hold</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                        This is a temporary authorization, not a charge.
                                    </p>

                                    {/* Simulated Stripe Card Input */}
                                    <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', marginBottom: '1rem' }}>
                                        <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                                            <label className="form-label">Card Number</label>
                                            <input className="form-input" placeholder="4242 4242 4242 4242" disabled style={{ opacity: 0.7 }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <label className="form-label">Expiry</label>
                                                <input className="form-input" placeholder="12/28" disabled style={{ opacity: 0.7 }} />
                                            </div>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <label className="form-label">CVC</label>
                                                <input className="form-input" placeholder="123" disabled style={{ opacity: 0.7 }} />
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                                            💳 Demo mode — no real payment processed
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                                        <span>Authorization Hold</span>
                                        <span style={{ color: 'var(--warning)' }}>{formatCurrency(50)}</span>
                                    </div>

                                    <button onClick={() => setBookingStep('confirmation')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                        Authorize 50 AED Hold
                                    </button>
                                </>
                            )}

                            {bookingStep === 'confirmation' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', margin: '0 auto 1rem', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CalendarCheck size={32} style={{ color: 'var(--success)' }} />
                                    </div>
                                    <h2 style={{ marginBottom: '0.5rem' }}>Viewing Requested!</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        {bookingDate} at {bookingTime}
                                    </p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                        The landlord has 24 hours to accept. You'll receive a confirmation once they agree to the mutual commitment hold.
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Link to="/viewings" className="btn btn-primary" style={{ flex: 1 }}>View My Bookings</Link>
                                        <button onClick={() => { setShowBookingModal(false); setBookingStep('details'); }} className="btn btn-secondary" style={{ flex: 1 }}>Close</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
