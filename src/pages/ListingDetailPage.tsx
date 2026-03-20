import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useDemoState } from '@/contexts/DemoStateContext';
import { listings, users, formatCurrency, getInitials, viewingBookings, propertyRatings } from '@/data/mockData';
import {
    MapPin, Train, ShieldCheck, Users as UsersIcon, Star, CalendarCheck,
    ChevronLeft, ChevronRight, Check, AlertTriangle, Building2, Award, Lock,
    MessageSquare, Edit2, X, CheckCircle2, Home, Wrench, LogOut, Loader2, ArrowRight, Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { canRequestViewing, getTierLabel } from '@/utils/accessControl';
import PassportKycModal from '@/components/PassportKycModal';
import ComplianceFlow from '@/components/ComplianceFlow';
import { UserBadgePill } from '@/components/UserBadge';

// Generate next 7 days as date chips
function getNextDays(count: number): { label: string; value: string }[] {
    const days: { label: string; value: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayName = d.toLocaleDateString('en-AE', { weekday: 'short' });
        const dayNum = d.getDate();
        const month = d.toLocaleDateString('en-AE', { month: 'short' });
        days.push({
            label: `${dayName} ${dayNum} ${month}`,
            value: d.toISOString().split('T')[0],
        });
    }
    return days;
}

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];

export default function ListingDetailPage() {
    const { id } = useParams();
    const { currentUser, isVerifiedForBooking } = useAuth();
    const { showToast } = useToast();
    const { setDemoState } = useDemoState();
    const listing = listings.find(l => l.slug === id || l.id === id);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingStep, setBookingStep] = useState<'details' | 'loading' | 'confirmation'>('details');
    const [isEditingRent, setIsEditingRent] = useState(false);
    const [rentAmount, setRentAmount] = useState(listing?.rent_per_room || 0);
    const [activeBills, setActiveBills] = useState<string[]>(listing?.bills_included ? ['Water', 'Wi-Fi', 'DEWA', 'Building Maintenance'] : []);
    const [activeAmenities, setActiveAmenities] = useState<string[]>(listing?.amenities || []);
    const [showTenantsModal, setShowTenantsModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);
    const [showNoticeDialog, setShowNoticeDialog] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const navigate = useNavigate();
    const dateChips = getNextDays(7);
    const [carouselIdx, setCarouselIdx] = useState(0);
    const totalImages = listing?.images?.length || 0;

    useEffect(() => { window.scrollTo(0, 0); setCarouselIdx(0); }, [id]);

    // Detect if current user lives here
    const isResident = currentUser?.current_house_id === listing?.id;
    const residentRoom = isResident && listing ? listing.occupancy_status.find(r => r.tenant_id === currentUser?.id) : null;

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

                {/* Coming Soon Banner */}
                {listing.listing_status === 'coming_soon' && (
                    <div style={{
                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                        <Clock size={16} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
                            This property is Coming Soon — not yet available for viewings
                        </span>
                    </div>
                )}

                {/* Property Image Carousel */}
                <div style={{ height: '380px', borderRadius: 'var(--radius-lg)', background: listing.images?.[0] ? 'none' : 'linear-gradient(135deg, var(--bg-surface-2), var(--bg-surface-3))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    {listing.images?.[0] ? (
                        <>
                            <img
                                src={listing.images[carouselIdx] || listing.images[0]}
                                alt={`${listing.title} — photo ${carouselIdx + 1}`}
                                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', transition: 'opacity 0.3s ease' }}
                            />
                            {/* Prev / Next arrows */}
                            {totalImages > 1 && (
                                <>
                                    <button
                                        onClick={() => setCarouselIdx(i => (i - 1 + totalImages) % totalImages)}
                                        aria-label="Previous image"
                                        style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setCarouselIdx(i => (i + 1) % totalImages)}
                                        aria-label="Next image"
                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                            {/* Dot indicators */}
                            {totalImages > 1 && (
                                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                                    {listing.images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCarouselIdx(i)}
                                            aria-label={`View photo ${i + 1}`}
                                            style={{
                                                width: carouselIdx === i ? 24 : 8, height: 8, borderRadius: 999,
                                                background: carouselIdx === i ? '#fff' : 'rgba(255,255,255,0.5)',
                                                border: 'none', cursor: 'pointer', padding: 0,
                                                transition: 'all 0.3s ease',
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* Photo counter */}
                            {totalImages > 1 && (
                                <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                                    {carouselIdx + 1} / {totalImages}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <Building2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                            <div style={{ color: 'var(--text-muted)' }}>{listing.district}</div>
                        </div>
                    )}
                    {listing.listing_status === 'coming_soon' && (
                        <div style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                            background: 'rgba(245,158,11,0.9)', color: '#fff',
                        }}>
                            Coming Soon
                        </div>
                    )}
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
                                    { label: 'Max Legal Occupancy', value: `${listing.maxLegalOccupancy} rooms (1 tenant per room)`, verified: true },
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

                        {/* Current Roommates — tier-gated visibility */}
                        {(() => {
                            // Filter out the current user so they don't see themselves in the list
                            const coTenantIds = listing.current_roommates.filter(id => id !== currentUser?.id);
                            if (coTenantIds.length === 0) return null;
                            return (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UsersIcon size={20} style={{ color: 'var(--brand-purple-light)' }} /> {isResident ? 'Your Co-Tenants' : 'Current Roommates'}
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({coTenantIds.length})</span>
                                </h3>

                                {/* Tier 2 Gold — full access to roommate profiles */}
                                {currentUser?.verification_tier === 'tier2_uae_pass' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {coTenantIds.map(tenantId => {
                                            const tenant = users.find(u => u.id === tenantId);
                                            if (!tenant) return null;
                                            return (
                                                <Link key={tenant.id} to={`/profile/${tenant.slug || tenant.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', transition: 'border-color 0.2s', cursor: 'pointer' }}
                                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                                                    >
                                                        <div className="avatar avatar-md">{getInitials(tenant.name)}</div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{tenant.name}</div>
                                                            <UserBadgePill user={tenant} />
                                                            {tenant.lifestyle_tags && tenant.lifestyle_tags.length > 0 && (
                                                                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                                                                    {tenant.lifestyle_tags.slice(0, 3).map(tag => (
                                                                        <span key={tag} style={{ fontSize: '0.5625rem', padding: '0.0625rem 0.375rem', borderRadius: '999px', background: 'rgba(124,58,237,0.1)', color: 'var(--brand-purple-light)', border: '1px solid rgba(124,58,237,0.2)' }}>{tag}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {tenant.gccScore > 0 && (
                                                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                                                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f59e0b' }}>{tenant.gccScore}</div>
                                                                <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GCC</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Tier 0/1 — blurred overlay with upgrade prompt */
                                    <div style={{ position: 'relative' }}>
                                        {/* Blurred preview */}
                                        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
                                            {coTenantIds.map((tenantId, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: i < coTenantIds.length - 1 ? '0.5rem' : 0 }}>
                                                    <div className="avatar avatar-md" style={{ background: 'var(--bg-surface-3)' }}>??</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Roommate Profile</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lifestyle tags, GCC score, compatibility</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Upgrade overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)',
                                        }}>
                                            <Lock size={24} style={{ color: 'var(--brand-purple-light)', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '0.25rem' }}>
                                                {currentUser?.verification_tier === 'tier1_unverified'
                                                    ? 'Upgrade to UAE PASS to see who lives here'
                                                    : currentUser?.verification_tier === 'tier0_passport'
                                                    ? 'Complete KYC to unlock roommate profiles'
                                                    : 'Verify identity to see roommate profiles'
                                                }
                                            </div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
                                                See lifestyle compatibility, GCC scores, and shared habits
                                            </div>
                                            {currentUser?.verification_tier === 'tier1_unverified' ? (
                                                <button onClick={() => setShowUpgradeModal(true)} className="btn btn-uaepass btn-sm">
                                                    <ShieldCheck size={14} /> Upgrade to Gold
                                                </button>
                                            ) : currentUser?.verification_tier === 'tier0_passport' ? (
                                                <button onClick={() => setShowKycModal(true)} className="btn btn-primary btn-sm">
                                                    <ShieldCheck size={14} /> Upload Documents
                                                </button>
                                            ) : (
                                                <Link to="/register/tenant" className="btn btn-primary btn-sm">
                                                    <ShieldCheck size={14} /> Sign Up to View
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            );
                        })()}

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

                        {/* P5: Neighbourhood & Landmarks */}
                        {listing.location && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={18} style={{ color: 'var(--brand-teal)' }} /> Neighbourhood
                                </h3>
                                {listing.location.area_description && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                                        {listing.location.area_description}
                                    </p>
                                )}
                                {listing.location.nearby_amenities && listing.location.nearby_amenities.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.5rem' }}>Nearby Landmarks</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {listing.location.nearby_amenities.map(a => (
                                                <a
                                                    key={a}
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a + ' Dubai')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                                        padding: '0.375rem 0.75rem', borderRadius: '999px',
                                                        background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.25)',
                                                        color: 'var(--brand-teal)', fontSize: '0.8125rem', fontWeight: 600,
                                                        textDecoration: 'none', transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <Building2 size={13} /> {a}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* P5: Listing Tags */}
                        {listing.tags && listing.tags.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem' }}>Property Tags</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {listing.tags.map(tag => (
                                        <span key={tag} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                            padding: '0.3125rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                                            background: tag.includes('budget') ? 'rgba(34,197,94,0.1)' :
                                                         tag.includes('metro') ? 'rgba(59,130,246,0.1)' :
                                                         tag.includes('premium') || tag.includes('luxury') ? 'rgba(245,158,11,0.1)' :
                                                         'rgba(124,58,237,0.08)',
                                            color: tag.includes('budget') ? 'var(--success)' :
                                                   tag.includes('metro') ? 'var(--info)' :
                                                   tag.includes('premium') || tag.includes('luxury') ? '#f59e0b' :
                                                   'var(--brand-purple-light)',
                                            border: `1px solid ${tag.includes('budget') ? 'rgba(34,197,94,0.2)' :
                                                                  tag.includes('metro') ? 'rgba(59,130,246,0.2)' :
                                                                  tag.includes('premium') || tag.includes('luxury') ? 'rgba(245,158,11,0.2)' :
                                                                  'rgba(124,58,237,0.15)'}`,
                                        }}>
                                            {tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </span>
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

                            {/* Resident UI — shown if current user lives here */}
                            {isResident && currentUser ? (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '1rem' }}>
                                        <Home size={16} style={{ color: 'var(--success)' }} />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>You live here</span>
                                    </div>
                                    {residentRoom && (
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                            Room {residentRoom.room_number} · Status: <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{residentRoom.status.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <Link to="/chat" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                            <MessageSquare size={16} /> Chat with Landlord
                                        </Link>
                                        <Link to="/maintenance" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                            <Wrench size={16} /> Submit Maintenance Request
                                        </Link>
                                        <button onClick={() => setShowNoticeDialog(true)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', opacity: 0.7, fontSize: '0.8125rem' }}>
                                            <LogOut size={14} /> Give Notice
                                        </button>
                                    </div>
                                </div>
                            ) : listing.listing_status === 'coming_soon' ? (
                                <>
                                    {/* Register Interest CTA for Coming Soon */}
                                    <button
                                        onClick={() => showToast("Interest registered! You'll be notified when this property launches.", 'success')}
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%', background: '#f59e0b', borderColor: '#f59e0b' }}
                                    >
                                        <Clock size={18} /> Register Interest
                                    </button>
                                    <p style={{ fontSize: '0.6875rem', color: '#f59e0b', textAlign: 'center', marginTop: '0.5rem' }}>
                                        This property is not yet available for viewings
                                    </p>
                                </>
                            ) : (
                                <>
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
                                                    <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowUpgradeModal(true)}>
                                                        <ShieldCheck size={18} /> Request Viewing
                                                    </button>
                                                    <p style={{ fontSize: '0.6875rem', color: 'var(--warning)', textAlign: 'center', marginTop: '0.5rem' }}>
                                                        Identity verification required
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
                                </>
                            )}

                            {/* Landlord Info */}
                            {landlord && (
                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Link to={`/profile/${landlord.slug || landlord.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

                {/* Booking Modal — Date chips, time chips, message, loading */}
                {showBookingModal && (
                    <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            {bookingStep === 'details' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h2 style={{ margin: 0 }}>Request a Viewing</h2>
                                        <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{listing.title}</p>

                                    {/* Date chips */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Preferred Date</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            {dateChips.map(d => (
                                                <button
                                                    key={d.value}
                                                    onClick={() => setBookingDate(d.value)}
                                                    style={{
                                                        padding: '0.5rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                                                        background: bookingDate === d.value ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                                                        border: `1px solid ${bookingDate === d.value ? 'rgba(124,58,237,0.4)' : 'var(--border-subtle)'}`,
                                                        color: bookingDate === d.value ? 'var(--brand-purple-light)' : 'var(--text-secondary)',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {d.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time chips */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Preferred Time</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                            {TIME_SLOTS.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setBookingTime(t)}
                                                    style={{
                                                        padding: '0.5rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                                                        background: bookingTime === t ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                                                        border: `1px solid ${bookingTime === t ? 'rgba(124,58,237,0.4)' : 'var(--border-subtle)'}`,
                                                        color: bookingTime === t ? 'var(--brand-purple-light)' : 'var(--text-secondary)',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Message (optional)</label>
                                        <textarea
                                            className="form-input"
                                            placeholder="Introduce yourself or ask a question..."
                                            value={bookingMessage}
                                            onChange={e => setBookingMessage(e.target.value)}
                                            rows={3}
                                            style={{ resize: 'vertical', width: '100%' }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => setBookingStep('loading')}
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%' }}
                                        disabled={!bookingDate || !bookingTime}
                                    >
                                        <CalendarCheck size={16} /> Confirm Viewing Request
                                    </button>
                                </>
                            )}

                            {bookingStep === 'loading' && (
                                <ComplianceFlow
                                    onComplete={() => {
                                        setBookingStep('confirmation');
                                        showToast('Viewing requested!', 'success');
                                    }}
                                    propertyTitle={listing.title}
                                    makaniNumber={listing.makaniNumber}
                                    trakheesiPermit={listing.trakheesiPermit}
                                    district={listing.district}
                                />
                            )}

                            {bookingStep === 'confirmation' && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', margin: '0 auto 1rem', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CalendarCheck size={32} style={{ color: 'var(--success)' }} />
                                    </div>
                                    <h2 style={{ marginBottom: '0.5rem' }}>Viewing Requested!</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        {dateChips.find(d => d.value === bookingDate)?.label || bookingDate} at {bookingTime}
                                    </p>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                        The landlord will review your request and confirm. You'll be notified once it's accepted.
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Link to="/viewings" className="btn btn-primary" style={{ flex: 1 }}>View My Bookings</Link>
                                        <button onClick={() => { setShowBookingModal(false); setBookingStep('details'); setBookingDate(''); setBookingTime(''); setBookingMessage(''); }} className="btn btn-secondary" style={{ flex: 1 }}>Close</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Passport KYC Modal — with auto-approve */}
                {showKycModal && currentUser && (
                    <PassportKycModal
                        user={currentUser}
                        onClose={() => setShowKycModal(false)}
                        onUpdate={() => {
                            setShowKycModal(false);
                            // Auto-approve after 3 seconds
                            setTimeout(() => {
                                setDemoState(prev => ({
                                    ...prev,
                                    tierOverrides: { ...prev.tierOverrides, [currentUser.id]: 'tier0_passport' },
                                    kycSubmissions: { ...prev.kycSubmissions, [currentUser.id]: 'approved' },
                                }));
                                showToast('Identity verified! You\'re now Tier 1 — Verified.', 'success', 6000);
                            }, 3000);
                        }}
                    />
                )}

                {/* Tier 0 Upgrade Modal */}
                {showUpgradeModal && (
                    <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', textAlign: 'center', padding: '2rem' }}>
                            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={18} />
                            </button>

                            {/* Shield icon */}
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1.25rem', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={32} style={{ color: 'var(--brand-purple-light)' }} />
                            </div>

                            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Verify your identity to book viewings</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                Upload your passport or Emirates ID — takes under 2 minutes.
                            </p>

                            {/* Tier progression visual */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ padding: '0.375rem 0.75rem', borderRadius: '999px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.75rem', fontWeight: 600, color: '#22c55e' }}>
                                    Explorer <CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                                </div>
                                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                                <div style={{ padding: '0.375rem 0.75rem', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                                    Verified — unlock
                                </div>
                                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                                <div style={{ padding: '0.375rem 0.75rem', borderRadius: '999px', background: 'rgba(156,163,175,0.1)', border: '1px solid rgba(156,163,175,0.2)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                    Gold
                                </div>
                            </div>

                            <button
                                onClick={() => { setShowUpgradeModal(false); setShowKycModal(true); }}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginBottom: '0.75rem' }}
                            >
                                <ShieldCheck size={16} /> Upload Documents &rarr;
                            </button>

                            <Link to="/how-it-works" style={{ fontSize: '0.8125rem', color: 'var(--brand-purple-light)' }}>
                                Learn about verification &rarr;
                            </Link>
                        </div>
                    </div>
                )}

                {/* Give Notice Confirmation Dialog */}
                {showNoticeDialog && (
                    <div className="modal-overlay" onClick={() => setShowNoticeDialog(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
                            <LogOut size={40} style={{ color: 'var(--warning)', marginBottom: '1rem' }} />
                            <h2 style={{ marginBottom: '0.5rem' }}>Give Notice</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                Are you sure you want to give notice at this property? This action will be recorded in your tenancy history.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button onClick={() => { setShowNoticeDialog(false); navigate('/profile'); }} className="btn btn-primary" style={{ flex: 1 }}>
                                    Confirm Notice
                                </button>
                                <button onClick={() => setShowNoticeDialog(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
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
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{tenant.name}</div>
                                                <UserBadgePill user={tenant} />
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
