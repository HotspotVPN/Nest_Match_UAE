import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getListingById, getUserById, getInitials, formatCurrency } from '@/data/mockData';
import {
    ChevronLeft, ChevronRight, MapPin, Bed, ShieldCheck,
    CheckCircle2, X, ArrowLeft, Linkedin, Instagram,
    Clock, Calendar, BadgePoundSterling, Sun, Moon, Sunrise, Send,
    Landmark, Compass, Dumbbell, Heart, Sparkles, Tag,
    Train, Bus, TrainFront, Footprints, Award, AlertTriangle,
} from 'lucide-react';

export default function ListingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [imgIdx, setImgIdx] = useState(0);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showRoommateModal, setShowRoommateModal] = useState<string | null>(null);
    const [applied, setApplied] = useState(false);

    const listing = getListingById(id || '');
    if (!listing) {
        return (
            <div className="section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2>Listing Not Found</h2>
                    <p style={{ margin: '1rem 0' }}>This listing doesn't exist or has been removed.</p>
                    <Link to="/browse" className="btn btn-primary">Browse All Listings</Link>
                </div>
            </div>
        );
    }

    const landlord = getUserById(listing.landlord_id);
    const roommates = listing.current_roommates.map((rid) => getUserById(rid)).filter(Boolean);
    const viewedRoommate = showRoommateModal ? getUserById(showRoommateModal) : null;

    const scheduleIcon = (s?: string) => {
        if (s === 'early_bird') return <Sun size={14} />;
        if (s === 'night_owl') return <Moon size={14} />;
        return <Sunrise size={14} />;
    };

    return (
        <div className="section" style={{ paddingTop: '1.5rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Back */}
                <button onClick={() => navigate('/browse')} className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Listings
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* ── Left Column ─────────────────────────────── */}
                    <div>
                        {/* Image Carousel */}
                        <div className="carousel" style={{ height: '400px', marginBottom: '1.5rem' }}>
                            <div className="carousel-track" style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
                                {listing.images.map((src, i) => (
                                    <div key={i} className="carousel-slide">
                                        <img src={src} alt={`Property ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                            {listing.images.length > 1 && (
                                <>
                                    <button className="carousel-btn carousel-btn-prev" onClick={() => setImgIdx((p) => (p - 1 + listing.images.length) % listing.images.length)}>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button className="carousel-btn carousel-btn-next" onClick={() => setImgIdx((p) => (p + 1) % listing.images.length)}>
                                        <ChevronRight size={18} />
                                    </button>
                                    <div className="carousel-dots">
                                        {listing.images.map((_, i) => (
                                            <button key={i} className={`carousel-dot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Title + Address */}
                        <h2 style={{ marginBottom: '0.5rem' }}>{listing.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            <MapPin size={16} /> {listing.address}
                        </div>

                        {/* Price + Availability */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
                                {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.875rem', fontWeight: 400 }}>/room/mo</span>
                            </span>
                            <span className="badge badge-green"><Bed size={12} /> {listing.available_rooms} available</span>
                            {listing.bills_included && <span className="badge badge-blue">Bills included</span>}
                        </div>

                        {/* Description */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '0.75rem' }}>About this property</h4>
                            <p style={{ fontSize: '0.9375rem', lineHeight: 1.8 }}>{listing.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '0.75rem' }}>Amenities</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {listing.amenities.map((a) => (
                                    <span key={a} className="badge badge-purple">{a}</span>
                                ))}
                            </div>
                        </div>

                        {/* House Rules */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '0.75rem' }}>House Rules</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {listing.house_rules.map((r) => (
                                    <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <CheckCircle2 size={14} style={{ color: 'var(--success)', flexShrink: 0 }} /> {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tenant-Suggested Keywords */}
                        {listing.tenant_suggested_tags && listing.tenant_suggested_tags.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Tag size={16} style={{ color: 'var(--brand-purple-light)' }} /> What Tenants Say
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                    Keywords suggested by current and previous tenants. <CheckCircle2 size={10} style={{ color: 'var(--success)', display: 'inline' }} /> = verified by landlord
                                </p>
                                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                    {listing.tenant_suggested_tags.map((t, i) => {
                                        const suggestor = getUserById(t.suggested_by);
                                        return (
                                            <span key={i} title={`Suggested by ${suggestor?.name || 'tenant'}`} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                fontSize: '0.6875rem', padding: '0.25rem 0.5rem',
                                                borderRadius: 'var(--radius-full)',
                                                background: t.approved_by_landlord ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${t.approved_by_landlord ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`,
                                                color: t.approved_by_landlord ? '#22c55e' : 'var(--text-muted)',
                                                cursor: 'default',
                                            }}>
                                                {t.approved_by_landlord && <CheckCircle2 size={11} style={{ color: '#22c55e' }} />}
                                                {t.tag.replace(/-/g, ' ')}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Nearby Landmarks & Attractions */}
                        {listing.nearby_landmarks && listing.nearby_landmarks.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Landmark size={16} style={{ color: 'var(--brand-purple-light)' }} /> Nearby Landmarks & Attractions
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {listing.nearby_landmarks.map((lm, i) => {
                                        const typeColors: Record<string, string> = {
                                            park: '#22c55e', museum: '#3b82f6', gallery: '#a855f7',
                                            market: '#f59e0b', historic: '#ef4444', entertainment: '#ec4899',
                                            sports: '#06b6d4', nature: '#10b981',
                                        };
                                        const color = typeColors[lm.type] || 'var(--text-muted)';
                                        return (
                                            <div key={i} style={{
                                                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                                                padding: '0.625rem', borderRadius: 'var(--radius-md)',
                                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                            }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: 'var(--radius-full)', background: color, marginTop: '0.375rem', flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.125rem' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{lm.name}</span>
                                                        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.5625rem', padding: '0.1rem 0.375rem', borderRadius: 'var(--radius-full)', background: `${color}15`, color, border: `1px solid ${color}30`, textTransform: 'capitalize' }}>{lm.type}</span>
                                                            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}><MapPin size={9} /> {lm.distance}</span>
                                                        </div>
                                                    </div>
                                                    {lm.description && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{lm.description}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Local Activities */}
                        {listing.local_activities && listing.local_activities.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Compass size={16} style={{ color: 'var(--brand-purple-light)' }} /> Things To Do Nearby
                                </h4>
                                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                    {listing.local_activities.map((a, i) => (
                                        <span key={i} style={{
                                            fontSize: '0.6875rem', padding: '0.25rem 0.625rem',
                                            borderRadius: 'var(--radius-full)',
                                            background: 'rgba(124,58,237,0.08)',
                                            border: '1px solid rgba(124,58,237,0.2)',
                                            color: 'var(--brand-purple-light)',
                                        }}>{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Transport Connectivity */}
                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Train size={16} style={{ color: 'var(--brand-purple-light)' }} /> Transport Connectivity
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {listing.transport_chips.map((chip, i) => {
                                        const typeIcons: Record<string, typeof Train> = { tube: TrainFront, train: Train, bus: Bus, walk: Footprints };
                                        const typeColors: Record<string, string> = { tube: '#ef4444', train: '#f59e0b', bus: '#3b82f6', walk: '#22c55e' };
                                        const ChipIcon = typeIcons[chip.type] || Train;
                                        const color = typeColors[chip.type] || 'var(--text-muted)';
                                        return (
                                            <a
                                                key={i}
                                                href={chip.maps_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                                    padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-full)',
                                                    background: `${color}12`, border: `1px solid ${color}30`,
                                                    color, fontSize: '0.75rem', fontWeight: 600,
                                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.05)'; }}
                                                onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                                            >
                                                <ChipIcon size={13} />
                                                <span>{chip.label}</span>
                                                <span style={{ fontSize: '0.625rem', opacity: 0.7 }}>{chip.walk_time} walk</span>
                                            </a>
                                        );
                                    })}
                                </div>
                                <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Click any chip for Google Maps directions from this property
                                </p>
                            </div>
                        )}

                        {/* Room Status */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '0.75rem' }}>Room Occupancy</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {listing.occupancy_status.map((room) => {
                                    const tenant = room.tenant_id ? getUserById(room.tenant_id) : null;
                                    return (
                                        <div key={room.room_number} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <Bed size={16} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Room {room.room_number}</span>
                                            </div>
                                            {tenant ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>
                                                        {getInitials(tenant.name)}
                                                    </div>
                                                    <span style={{ fontSize: '0.8125rem' }}>{tenant.name}</span>
                                                    <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Occupied</span>
                                                </div>
                                            ) : (
                                                <span className="badge badge-orange">Available</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Deposit Guard section */}
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>Deposit Guard</h4>
                                {listing.escrow_verified && (
                                    <span style={{
                                        fontSize: '0.625rem', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)',
                                        background: 'rgba(34,197,94,0.1)', color: 'var(--success)', fontWeight: 700,
                                        border: '1px solid rgba(34,197,94,0.3)'
                                    }}>
                                        ESCROW VERIFIED
                                    </span>
                                )}
                            </div>
                            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(34,197,94,0.1) 100%)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
                                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9375rem' }}>TDS Protected (DPS/2026-X)</span>
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                                    Your deposit of <strong>{formatCurrency(listing.deposit)}</strong> is legally protected via NestMatch Escrow.
                                    Funds are only released upon mutual move-out agreement or TDS adjudication.
                                </p>
                                <button className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                                    <ShieldCheck size={16} /> Secure with NestMatch Escrow
                                </button>
                            </div>
                        </div>

                        {/* Transparency Timeline */}
                        {listing.transparency_log && listing.transparency_log.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={16} style={{ color: 'var(--brand-purple-light)' }} /> Transparency Timeline
                                </h4>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                    A verified audit trail of all agent, landlord, and roommate actions on this property.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {listing.transparency_log.map((entry, i) => {
                                        const roleColors: Record<string, string> = { agent: '#3b82f6', landlord: '#f59e0b', roommate: '#22c55e' };
                                        const roleLabels: Record<string, string> = { agent: 'Agent', landlord: 'Owner', roommate: 'Resident' };
                                        const color = roleColors[entry.actor_role] || 'var(--text-muted)';
                                        return (
                                            <div key={i} style={{
                                                display: 'flex', gap: '0.75rem', padding: '0.625rem 0',
                                                borderBottom: i < listing.transparency_log!.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                            }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '4px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginTop: '0.25rem' }} />
                                                    {i < listing.transparency_log!.length - 1 && (
                                                        <div style={{ width: '2px', flex: 1, background: `${color}30`, marginTop: '0.25rem' }} />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.125rem' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>{entry.actor}</span>
                                                        <span style={{
                                                            fontSize: '0.5625rem', padding: '0.1rem 0.375rem',
                                                            borderRadius: 'var(--radius-full)', background: `${color}18`,
                                                            color, fontWeight: 600, border: `1px solid ${color}30`,
                                                        }}>{roleLabels[entry.actor_role]}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                                        {entry.action}
                                                    </p>
                                                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                                                        {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right Column (Sidebar) ──────────────────── */}
                    <div style={{ position: 'sticky', top: '80px' }}>
                        {/* Apply CTA */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--gradient-card)', boxShadow: 'var(--shadow-glow)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
                                    {formatCurrency(listing.rent_per_room)}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> /month</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Deposit</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(listing.deposit)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Bills</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {listing.bills_included ? 'Included' : listing.bills_breakdown || 'Not included'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>Available rooms</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{listing.available_rooms} of {listing.total_rooms}</span>
                                </div>
                            </div>

                            {applied ? (
                                <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)' }}>
                                    <CheckCircle2 size={20} style={{ color: 'var(--success)', marginBottom: '0.25rem' }} />
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>Application Submitted!</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        Pending approval from landlord + {roommates.length} roommate{roommates.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => currentUser ? setShowApplyModal(true) : navigate('/login')}
                                    className="btn btn-primary btn-lg pulse-glow"
                                    style={{ width: '100%' }}
                                >
                                    <Send size={16} /> Apply for this Room
                                </button>
                            )}
                        </div>

                        {/* Landlord Card */}
                        {landlord && (
                            <Link to={`/profile?id=${landlord.id}`} className="glass-card hover-card" style={{ display: 'block', padding: '1.25rem', marginBottom: '1.5rem', textDecoration: 'none', transition: 'all 0.2s ease' }}>
                                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                    Property Manager
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div className="avatar avatar-md">{getInitials(landlord.name)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{landlord.name}</span>
                                            <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Verified Landlord • 5+ properties
                                        </span>
                                    </div>
                                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <div style={{ background: 'rgba(124,58,237,0.05)', borderRadius: 'var(--radius-md)', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--brand-purple-light)', fontWeight: 600 }}>
                                    View Full Profile
                                </div>
                            </Link>
                        )}

                        {/* Roommate Profiles */}
                        <div className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                People you'd live with
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {roommates.map((rm) => rm && (
                                    <div
                                        key={rm.id}
                                        className="roommate-card"
                                        onClick={() => setShowRoommateModal(rm.id)}
                                    >
                                        <div className="avatar avatar-md">{getInitials(rm.name)}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{rm.name}</span>
                                                {rm.is_paid && (
                                                    <div title="Payment Reliable" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                                                    </div>
                                                )}
                                                <ShieldCheck size={13} style={{ color: 'var(--success)' }} />
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                                {rm.bio.split('.')[0]}.
                                            </p>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                                                {rm.keywords.slice(0, 4).map((k) => (
                                                    <span key={k} className="tag" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Apply Modal ──────────────────────────────────── */}
            {showApplyModal && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Apply for this Room</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowApplyModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{
                            padding: '1rem', borderRadius: 'var(--radius-md)',
                            background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.2)', marginBottom: '1.25rem',
                        }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>
                                Your application will be sent to <strong>{landlord?.name}</strong> (landlord)
                                {roommates.length > 0 && (
                                    <> and <strong>{roommates.map((r) => r?.name).join(', ')}</strong> (existing roommates)</>
                                )}
                                for triple-approval review.
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Move-in Date</label>
                            <input className="form-input" type="date" />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Why do you want to live here?</label>
                            <textarea className="form-input" rows={4} placeholder="Tell the landlord and existing roommates about yourself…" />
                        </div>

                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={() => { setApplied(true); setShowApplyModal(false); }}
                        >
                            <Send size={16} /> Submit Application
                        </button>
                    </div>
                </div>
            )}

            {/* ── Roommate Profile Modal ───────────────────────── */}
            {viewedRoommate && (
                <div className="modal-overlay" onClick={() => setShowRoommateModal(null)}>
                    <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Roommate Profile</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowRoommateModal(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            {/* Left */}
                            <div style={{ flex: '1 1 200px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className="avatar avatar-xl">{getInitials(viewedRoommate.name)}</div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h3>{viewedRoommate.name}</h3>
                                            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                            <span className="badge badge-purple">Verified Roommate</span>
                                            {viewedRoommate.resident_role && (
                                                <span className={`badge ${viewedRoommate.resident_role === 'residing' ? 'badge-green' : 'badge-blue'}`}>
                                                    {viewedRoommate.resident_role === 'residing' ? 'Residing' : 'Searching'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* GCC Eligibility Status */}
                                {viewedRoommate.type === 'roommate' && (
                                    <div style={{
                                        padding: '0.875rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem',
                                        background: viewedRoommate.has_gcc ? 'rgba(34,197,94,0.06)' : 'rgba(245,158,11,0.06)',
                                        border: `1px solid ${viewedRoommate.has_gcc ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                            {viewedRoommate.has_gcc ? (
                                                <>
                                                    <Award size={16} style={{ color: 'var(--success)' }} />
                                                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.8125rem' }}>Good Conduct Certificate — Issued</span>
                                                </>
                                            ) : viewedRoommate.resident_role === 'residing' && viewedRoommate.tenancy_duration_months !== undefined ? (
                                                <>
                                                    <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                                                    <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.8125rem' }}>GCC — In Progress</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                                                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No GCC Yet</span>
                                                </>
                                            )}
                                        </div>

                                        {viewedRoommate.has_gcc && viewedRoommate.good_conduct_certificate ? (
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                Issued on {new Date(viewedRoommate.good_conduct_certificate.issued_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {viewedRoommate.tenancy_duration_months ? ` · ${viewedRoommate.tenancy_duration_months} months verified residence` : ''}
                                                {viewedRoommate.resident_role === 'searching' ? ' (from previous NestMatch tenancy)' : ''}
                                            </p>
                                        ) : viewedRoommate.resident_role === 'residing' && viewedRoommate.tenancy_duration_months !== undefined ? (
                                            <>
                                                <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '0.375rem' }}>
                                                    <div style={{
                                                        width: `${Math.min((viewedRoommate.tenancy_duration_months / 6) * 100, 100)}%`,
                                                        height: '100%', borderRadius: '3px',
                                                        background: 'linear-gradient(90deg, #f59e0b, #22c55e)',
                                                        transition: 'width 0.5s ease',
                                                    }} />
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {viewedRoommate.name.split(' ')[0]} has been a verified resident for <strong>{viewedRoommate.tenancy_duration_months} months</strong>.
                                                    {viewedRoommate.tenancy_duration_months < 6
                                                        ? ` Their Good Conduct Certificate will be eligible for issuance in ${6 - viewedRoommate.tenancy_duration_months} month${6 - viewedRoommate.tenancy_duration_months !== 1 ? 's' : ''}.`
                                                        : ''}
                                                </p>
                                            </>
                                        ) : (
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                New to NestMatch. GCC is earned after 6+ months of verified residence.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                                    {viewedRoommate.bio}
                                </p>

                                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Lifestyle Keywords</h4>
                                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                                    {viewedRoommate.keywords.map((k) => (
                                        <span key={k} className="badge badge-purple">{k}</span>
                                    ))}
                                </div>

                                {/* Personality, Lifestyle & Hobbies */}
                                {viewedRoommate.personality_traits && viewedRoommate.personality_traits.length > 0 && (
                                    <>
                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Sparkles size={13} style={{ color: '#f59e0b' }} /> Personality
                                        </h4>
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                            {viewedRoommate.personality_traits.map((t) => (
                                                <span key={t} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', textTransform: 'capitalize' }}>{t}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {viewedRoommate.lifestyle_tags && viewedRoommate.lifestyle_tags.length > 0 && (
                                    <>
                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Dumbbell size={13} style={{ color: '#22c55e' }} /> Activities
                                        </h4>
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                            {viewedRoommate.lifestyle_tags.map((t) => (
                                                <span key={t} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', textTransform: 'capitalize' }}>{t}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {viewedRoommate.hobbies && viewedRoommate.hobbies.length > 0 && (
                                    <>
                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Heart size={13} style={{ color: '#ec4899' }} /> Hobbies
                                        </h4>
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                            {viewedRoommate.hobbies.map((h) => (
                                                <span key={h} style={{ fontSize: '0.5625rem', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-full)', background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)', textTransform: 'capitalize' }}>{h.replace(/-/g, ' ')}</span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Local Recommendations */}
                                {viewedRoommate.local_recommendations && viewedRoommate.local_recommendations.length > 0 && (
                                    <>
                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Compass size={13} style={{ color: 'var(--brand-purple-light)' }} /> My Local Picks
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
                                            {viewedRoommate.local_recommendations.map((rec, i) => (
                                                <div key={i} style={{ fontSize: '0.75rem', display: 'flex', gap: '0.375rem', alignItems: 'baseline' }}>
                                                    <span style={{ color: 'var(--brand-purple-light)' }}>•</span>
                                                    <span><strong>{rec.name}</strong> — {rec.description} {rec.distance && <span style={{ color: 'var(--text-muted)' }}>({rec.distance})</span>}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Social (demo only — no real links) */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {viewedRoommate.linkedin_url && (
                                        <span className="btn btn-secondary btn-sm" style={{ cursor: 'default', opacity: 0.7 }}>
                                            <Linkedin size={14} /> LinkedIn
                                        </span>
                                    )}
                                    {viewedRoommate.instagram_handle && (
                                        <span className="btn btn-secondary btn-sm" style={{ cursor: 'default', opacity: 0.7 }}>
                                            <Instagram size={14} /> Instagram
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right – Preferences */}
                            {viewedRoommate.preferences && (
                                <div style={{ flex: '0 0 260px' }}>
                                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                                        <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Preferences</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <Calendar size={16} style={{ color: 'var(--brand-purple-light)' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Move-in Date</div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                        {new Date(viewedRoommate.preferences.move_in_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <Clock size={16} style={{ color: 'var(--brand-purple-light)' }} />
                                                <div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Duration</div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                        {viewedRoommate.preferences.duration.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                {scheduleIcon(viewedRoommate.preferences.schedule)}
                                                <div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Schedule</div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                        {viewedRoommate.preferences.schedule.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
