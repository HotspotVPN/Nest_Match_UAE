import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listings, users, formatCurrency, getInitials, viewingBookings, propertyRatings } from '@/data/mockData';
import {
    MapPin, Train, ShieldCheck, Users as UsersIcon, Star, CalendarCheck,
    ChevronLeft, Check, AlertTriangle, Building2, Award, Lock,
    MessageSquare, Edit2, X, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { canRequestViewing } from '@/utils/accessControl';
import PassportKycModal from '@/components/PassportKycModal';

export default function ListingDetailPage() {
    const { id } = useParams();
    const { currentUser, isVerifiedForBooking } = useAuth();
    const listing = listings.find(l => l.id === id);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingStep, setBookingStep] = useState<'details' | 'confirmation'>('details');
    const [isEditingRent, setIsEditingRent] = useState(false);
    const [rentAmount, setRentAmount] = useState(listing?.rent_per_room || 0);
    const [activeBills, setActiveBills] = useState<string[]>(listing?.bills_included ? ['Water', 'Wi-Fi', 'DEWA', 'Building Maintenance'] : []);
    const [activeAmenities, setActiveAmenities] = useState<string[]>(listing?.amenities || []);
    const [showTenantsModal, setShowTenantsModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);

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

    const isOwner = currentUser?.id === listing.landlord_id;

    const myConfirmedViewings = viewingBookings.filter(v =>
        (v.searcher_id === currentUser?.id) &&
        v.property_id === listing.id &&
        ['CONFIRMED', 'COMPLETED'].includes(v.status)
    );
    const canBook = myConfirmedViewings.length === 0;

    const propertyReviews = propertyRatings.filter(pr => pr.property_id === listing.id);

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
                            {listing.isApiVerified ? (
                                <span className="badge badge-green"><ShieldCheck size={12} /> DLD Municipality Verified</span>
                            ) : (
                                <span className="badge badge-orange"><ShieldCheck size={12} /> Verified</span>
                            )}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem' }}>
                                    Current:{' '}
                                    {isOwner ? (
                                        <button onClick={() => setShowTenantsModal(true)} className="btn btn-ghost btn-sm" style={{ padding: '0 0.25rem', textDecoration: 'underline', color: 'var(--primary)', height: 'auto', minHeight: 'auto', display: 'inline' }}>
                                            {listing.currentOccupants} / {listing.maxLegalOccupancy}
                                        </button>
                                    ) : (
                                        `${listing.currentOccupants} / ${listing.maxLegalOccupancy}`
                                    )}
                                </span>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h3 style={{ margin: 0 }}>Amenities</h3>
                                {isOwner && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)', padding: '0 0.5rem', height: 'auto', minHeight: 'auto' }}>+ Add</button>}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {activeAmenities.map(a => (
                                    <span key={a} className="tag" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        {a}
                                        {isOwner && <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setActiveAmenities(activeAmenities.filter(am => am !== a))} />}
                                    </span>
                                ))}
                            </div>

                            {isOwner && (
                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                    <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Pending Tenant Recommendations</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <span className="tag" style={{ borderStyle: 'dashed', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Air Purifier
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button className="btn btn-ghost btn-icon" style={{ width: '20px', height: '20px', color: 'var(--success)' }} onClick={() => setActiveAmenities([...activeAmenities, 'Air Purifier'])}><CheckCircle2 size={14} /></button>
                                                <button className="btn btn-ghost btn-icon" style={{ width: '20px', height: '20px', color: 'var(--error)' }}><X size={14} /></button>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Transport */}
                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem' }}>Transport</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {listing.transport_chips.map((chip, i) => (
                                        <a key={i} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.district + ' ' + chip.label + ' Station')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', textDecoration: 'none', color: 'inherit', transition: 'background 0.2s' }}>
                                            <Train size={16} style={{ color: chip.line_color || 'var(--text-muted)' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{chip.label}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chip.walk_time} walk · {chip.type.charAt(0).toUpperCase() + chip.type.slice(1)}</div>
                                            </div>
                                            {chip.lines?.map(line => (
                                                <span key={line} className="badge" style={{ marginLeft: 'auto', background: `${chip.line_color}20`, color: chip.line_color, border: `1px solid ${chip.line_color}40`, fontSize: '0.625rem' }}>{line}</span>
                                            ))}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Star Ratings — NO TEXT, defamation safe */}
                        {propertyReviews.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Star size={20} style={{ color: '#f59e0b' }} /> Property Ratings
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({propertyReviews.length} ratings)</span>
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                                    {[
                                        { label: 'AC & Cooling', key: 'acQuality' as const },
                                        { label: 'Building Amenities', key: 'amenities' as const },
                                        { label: 'Maintenance Speed', key: 'maintenanceSpeed' as const },
                                    ].map(({ label, key }) => {
                                        const avg = propertyReviews.reduce((s, r) => s + r[key], 0) / propertyReviews.length;
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
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        {/* Price Card */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'sticky', top: '80px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isEditingRent ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>AED</span>
                                                <input type="number" className="form-input" style={{ width: '120px', fontSize: '1.25rem', padding: '0.25rem 0.5rem' }} value={rentAmount} onChange={e => setRentAmount(Number(e.target.value))} />
                                                <button className="btn btn-primary btn-icon" style={{ width: '32px', height: '32px' }} onClick={() => setIsEditingRent(false)}><Check size={16} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                {formatCurrency(rentAmount)}
                                                {isOwner && <button className="btn btn-ghost btn-icon" style={{ color: 'var(--text-muted)', width: '28px', height: '28px' }} onClick={() => setIsEditingRent(true)}><Edit2 size={16} /></button>}
                                            </>
                                        )}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>per room / month</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Deposit</span>
                                <span style={{ fontWeight: 600 }}>{formatCurrency(listing.deposit)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Available Rooms</span>
                                <span style={{ fontWeight: 600 }}>{listing.available_rooms}</span>
                            </div>

                            {/* Bills */}
                            <div style={{ padding: '0.625rem 0', borderTop: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Bills & Utilities</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {['Water', 'Wi-Fi', 'Deep Cleaning', 'Garbage Collection', 'Building Maintenance', 'DEWA'].map(bill => {
                                        const isActive = activeBills.includes(bill);
                                        return (
                                            <button
                                                key={bill}
                                                disabled={!isOwner}
                                                onClick={() => {
                                                    if (isActive) setActiveBills(activeBills.filter(b => b !== bill));
                                                    else setActiveBills([...activeBills, bill]);
                                                }}
                                                className={`badge ${isActive ? 'badge-blue' : ''}`}
                                                style={{
                                                    opacity: isActive ? 1 : 0.5,
                                                    cursor: isOwner ? 'pointer' : 'default',
                                                    border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-strong)'}`,
                                                    background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                                    color: isActive ? 'var(--brand-blue-light)' : 'var(--text-muted)',
                                                    transition: 'all 0.2s',
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.6875rem'
                                                }}
                                            >
                                                {bill}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="divider" />

                            {/* Book Viewing CTA */}
                            {listing.available_rooms > 0 && currentUser?.type === 'roommate' && (
                                <>
                                    {!canBook ? (
                                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.3)', textAlign: 'center' }}>
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>Viewing already booked</span>
                                        </div>
                                    ) : canRequestViewing(currentUser) ? (
                                        <button onClick={() => setShowBookingModal(true)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                            <CalendarCheck size={18} /> Request Viewing
                                        </button>
                                    ) : currentUser?.verification_tier === 'tier1_unverified' ? (
                                        <>
                                            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowKycModal(true)}>
                                                <ShieldCheck size={18} /> Upload Passport to Book
                                            </button>
                                            <p style={{ fontSize: '0.6875rem', color: 'var(--warning)', textAlign: 'center', marginTop: '0.5rem' }}>
                                                Upload passport + visa to unlock viewing requests
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-uaepass btn-lg" style={{ width: '100%', opacity: 0.8 }} disabled>
                                                <Lock size={18} /> Verify to book a viewing
                                            </button>
                                            <p style={{ fontSize: '0.6875rem', color: 'var(--warning)', textAlign: 'center', marginTop: '0.5rem' }}>
                                                Verification required to schedule viewings
                                            </p>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Landlord Info */}
                            {landlord && (
                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Link to={`/profile/${landlord.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="avatar avatar-md">{getInitials(landlord.name)}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{landlord.name}</div>
                                                <span className="verified-badge"><ShieldCheck size={12} /> UAE PASS Verified</span>
                                            </div>
                                        </Link>
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

                {/* Booking Modal — Simple: date/time → confirmation */}
                {showBookingModal && (
                    <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            {bookingStep === 'details' && (
                                <>
                                    <h2 style={{ marginBottom: '0.5rem' }}>Request a Viewing</h2>
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

                                    <button onClick={() => setBookingStep('confirmation')} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!bookingDate || !bookingTime}>
                                        Request Viewing
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
                                        The landlord will review your request and confirm. You'll be notified once it's accepted.
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

                {/* Passport KYC Modal */}
                {showKycModal && currentUser && (
                    <PassportKycModal
                        user={currentUser}
                        onClose={() => setShowKycModal(false)}
                        onUpdate={() => setShowKycModal(false)}
                    />
                )}

                {/* Residing Tenants Modal (Landlord Only) */}
                {showTenantsModal && isOwner && (
                    <div className="modal-overlay" onClick={() => setShowTenantsModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Current Tenants</h2>
                                <button className="btn btn-ghost btn-icon" onClick={() => setShowTenantsModal(false)}><X size={18} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {listing.current_roommates.map(tenantId => {
                                    const tenant = users.find(u => u.id === tenantId);
                                    if (!tenant) return null;
                                    return (
                                        <div key={tenant.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)' }}>
                                            <div className="avatar avatar-md">{getInitials(tenant.name)}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tenant.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GCC Score: <ShieldCheck size={10} style={{ display: 'inline', color: '#f59e0b' }}/> {tenant.gccScore || 0}</div>
                                            </div>
                                            <Link to={`/chat`} className="btn btn-ghost btn-sm"><MessageSquare size={14} /></Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
