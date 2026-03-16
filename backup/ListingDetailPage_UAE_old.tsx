import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, formatCurrency, users } from '@/data/mockData';
import {
    ChevronLeft, ChevronRight, MapPin, Bed, ShieldCheck,
    CheckCircle2, X, ArrowLeft, Send,
    Landmark, Compass, Dumbbell, Heart, Sparkles, Tag,
    Train, Bus, Footprints, AlertTriangle, Clock, Edit2, Save
} from 'lucide-react';
import { api } from '@/services/api';
import type { Listing, User } from '@/types';

export default function ListingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgIdx, setImgIdx] = useState(0);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applied, setApplied] = useState(false);
    
    // Owner Edit Mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedDesc, setEditedDesc] = useState('');

    useEffect(() => {
        if (id) {
            api.getPropertyById(id).then(data => {
                if (data) {
                    setListing(data);
                    setEditedDesc(data.description);
                }
                setLoading(false);
            }).catch(err => {
                console.error("Failed to fetch property:", err);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return <div className="section"><div className="container" style={{ textAlign: 'center' }}><p>Authenticating with RERA Systems...</p></div></div>;
    if (!listing) return <div className="section"><div className="container" style={{ textAlign: 'center' }}><h2>Listing Not Found</h2><Link to="/browse" className="btn btn-primary">Browse All Listings</Link></div></div>;

    const isOwner = currentUser?.id === listing.landlord_id;
    const landlord = users.find(u => u.id === listing.landlord_id) as User | undefined;
    const agent = listing.letting_agent_id ? users.find(u => u.id === listing.letting_agent_id) as User | undefined : null;
    const roommates = listing.current_roommates.map(rid => users.find(u => u.id === rid)).filter(Boolean) as User[];

    const handleSaveDescription = async () => {
        // In a real app, this would call api.updateProperty
        setListing(prev => prev ? { ...prev, description: editedDesc } : null);
        setIsEditMode(false);
    };

    return (
        <div className="section" style={{ paddingTop: '1.5rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <button onClick={() => navigate('/browse')} className="btn btn-ghost" style={{ marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Listings
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* ── Left Column ─────────────────────────────── */}
                    <div>
                        {/* Image Carousel */}
                        <div className="carousel" style={{ height: '400px', marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                            <div className="carousel-track" style={{ transform: `translateX(-${imgIdx * 100}%)` }}>
                                {listing.images.map((src, i) => (
                                    <div key={i} className="carousel-slide">
                                        <img src={src} alt={`Property ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                            {listing.images.length > 1 && (
                                <>
                                    <button className="carousel-btn carousel-btn-prev" onClick={() => setImgIdx((p) => (p - 1 + listing.images.length) % listing.images.length)}><ChevronLeft size={18} /></button>
                                    <button className="carousel-btn carousel-btn-next" onClick={() => setImgIdx((p) => (p + 1) % listing.images.length)}><ChevronRight size={18} /></button>
                                </>
                            )}
                        </div>

                        {/* ID & Compliance Badges */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.625rem' }}>PRP_ID: {listing.id}</span>
                            <span className="badge badge-blue" style={{ fontSize: '0.625rem' }}>MAKANI: {listing.makaniNumber}</span>
                            {listing.isApiVerified && <span className="badge badge-green" style={{ fontSize: '0.625rem' }}><ShieldCheck size={10} /> DLD VERIFIED</span>}
                        </div>

                        <h2 style={{ marginBottom: '0.5rem' }}>{listing.title}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            <MapPin size={16} /> {listing.address}, {listing.district}
                        </div>

                        {/* Price & Availability */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
                                {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.875rem', fontWeight: 400 }}>/room/mo</span>
                            </span>
                            <span className="badge badge-green"><Bed size={12} /> {listing.available_rooms} available</span>
                            {listing.bills_included && <span className="badge badge-blue">Bills included</span>}
                        </div>

                        {/* Description (Editable by Owner) */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h4>About this property</h4>
                                {isOwner && (
                                    <button onClick={() => isEditMode ? handleSaveDescription() : setIsEditMode(true)} className="btn btn-ghost btn-sm" style={{ gap: '0.5rem' }}>
                                        {isEditMode ? <><Save size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
                                    </button>
                                )}
                            </div>
                            {isEditMode ? (
                                <textarea 
                                    className="form-input" 
                                    rows={6} 
                                    value={editedDesc} 
                                    onChange={(e) => setEditedDesc(e.target.value)}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)' }}
                                />
                            ) : (
                                <p style={{ fontSize: '0.9375rem', lineHeight: 1.8 }}>{listing.description}</p>
                            )}
                        </div>

                        {/* Compliance Details */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--uaepass-green)' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--uaepass-green-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={18} /> Regulatory Compliance (Law No. 4)
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>TRAKHEESI PERMIT</div>
                                    <div style={{ fontWeight: 700 }}>{listing.trakheesiPermit || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>MUNICIPALITY PERMIT</div>
                                    <div style={{ fontWeight: 700 }}>{listing.municipalityPermit || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>LEGAL CAPACITY</div>
                                    <div style={{ fontWeight: 700, color: listing.currentOccupants >= listing.maxLegalOccupancy ? 'var(--error)' : 'var(--success)' }}>
                                        {listing.currentOccupants} / {listing.maxLegalOccupancy} Residents
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Amenities</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {listing.amenities.map((a) => (
                                    <span key={a} className="badge badge-purple">{a}</span>
                                ))}
                            </div>
                        </div>

                        {/* Transport Connectivity (UAE Style) */}
                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Train size={18} style={{ color: 'var(--brand-purple-light)' }} /> Transport Connectivity
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {listing.transport_chips.map((chip, i) => {
                                        const color = chip.type === 'metro' ? '#ef4444' : (chip.type === 'tram' ? '#f59e0b' : '#3b82f6');
                                        return (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: `${color}15`, border: `1px solid ${color}30`, color }}>
                                                {chip.type === 'metro' ? <Train size={14} /> : (chip.type === 'bus' ? <Bus size={14} /> : <Footprints size={14} />)}
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{chip.label}</span>
                                                <span style={{ fontSize: '0.625rem', opacity: 0.8 }}>({chip.walk_time})</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Room Occupancy Grid (Restore UK DNA) */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Room Occupancy Status</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {listing.occupancy_status.map((room) => {
                                    const tenant = room.tenant_id ? users.find(u => u.id === room.tenant_id) : null;
                                    return (
                                        <div key={room.room_number} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <Bed size={16} style={{ color: 'var(--text-muted)' }} />
                                                <span style={{ fontWeight: 600 }}>Room {room.room_number}</span>
                                            </div>
                                            {tenant ? (
                                                <div title="Verified Resident" className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>{getInitials(tenant.name)}</div>
                                            ) : (
                                                <span className="badge badge-orange" style={{ fontSize: '0.625rem' }}>VACANT</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Deposit Protection */}
                        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>RERA Escrow Protection</h4>
                                <span className="badge badge-blue">ESCROW VERIFIED</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Your deposit of <strong>{formatCurrency(listing.deposit)}</strong> is legally protected via NestMatch Escrow in accordance with Dubai RERA guidelines. 
                                Funds are only released upon move-out clearance certificate.
                            </p>
                        </div>
                    </div>

                    {/* ── Right Column (Sidebar) ──────────────────── */}
                    <div style={{ position: 'sticky', top: '80px' }}>
                        {/* Action Card */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--gradient-card)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
                                    {formatCurrency(listing.rent_per_room)}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> /month</span>
                            </div>
                            
                            {applied ? (
                                <div style={{ textAlign: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                                    <CheckCircle2 size={24} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                                    <p style={{ fontWeight: 700, color: 'var(--success)' }}>Viewing Requested!</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>The agent/landlord will contact you within 24 hours.</p>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => currentUser ? setShowApplyModal(true) : navigate('/login')}
                                    className="btn btn-primary btn-lg pulse-glow" 
                                    style={{ width: '100%' }}
                                    disabled={listing.currentOccupants >= listing.maxLegalOccupancy}
                                >
                                    <Send size={16} /> Request Viewing
                                </button>
                            )}
                            
                            {listing.currentOccupants >= listing.maxLegalOccupancy && (
                                <p style={{ color: 'var(--error)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem', fontWeight: 600 }}>
                                    <AlertTriangle size={12} /> Property at legal capacity.
                                </p>
                            )}
                        </div>

                        {/* Sidebar: Letting Agent (LTA_ Priority) */}
                        {agent && (
                            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Authorized Listing Agent</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="avatar avatar-md">{getInitials(agent.name)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700 }}>{agent.name}</div>
                                        <div className="badge badge-orange" style={{ fontSize: '0.5rem', marginTop: '2px' }}>BRN: {agent.rera_license}</div>
                                    </div>
                                    <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>From {agent.agency_name}</div>
                            </div>
                        )}

                        {/* Sidebar: Owner (LND_ / CMP_) */}
                        {landlord && (
                            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', opacity: 0.8 }}>
                                <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Property Owner</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="avatar avatar-sm" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>{getInitials(landlord.name)}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{landlord.name}</div>
                                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>ID: {landlord.id}</div>
                                    </div>
                                    {landlord.isUaePassVerified && <div title="UAE PASS Verified"><ShieldCheck size={14} style={{ color: 'var(--uaepass-green)' }} /></div>}
                                </div>
                            </div>
                        )}

                        {/* Current Residents - PRIVACY PROTECTED */}
                        <div className="glass-card" style={{ padding: '1.25rem' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Current Residents
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {listing.occupancy_status?.filter(room => room.status === 'occupied').map(room => {
                                    const tenant = users.find(u => u.id === room.tenant_id);
                                    return (
                                        <div key={room.room_number} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                            <div className="avatar avatar-sm" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                {tenant ? getInitials(tenant.name) : 'VR'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Verified Resident</div>
                                                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '4px' }}>
                                                    {tenant?.keywords?.slice(0, 2).map(k => (
                                                        <span key={k} className="badge badge-blue" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
                                                            {k}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {listing.occupancy_status?.filter(room => room.status === 'occupied').length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No residents yet. Be the first!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Viewing Modal */}
            {showApplyModal && (
                <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Request Viewing</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowApplyModal(false)}><X size={18} /></button>
                        </div>
                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', border: '1px solid rgba(56,189,248,0.2)', marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--info)' }}>
                                This request will be sent to <strong>{agent?.name || landlord?.name}</strong>. 
                                Due to high demand, please specify your preferred time slots.
                            </p>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Preferred Date</label>
                            <input className="form-input" type="date" />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Preferred Time Slot</label>
                            <select className="form-input">
                                <option>Morning (09:00 - 12:00)</option>
                                <option>Afternoon (12:00 - 17:00)</option>
                                <option>Evening (17:00 - 20:00)</option>
                            </select>
                        </div>
                        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => { setApplied(true); setShowApplyModal(false); }}>
                            <Send size={16} /> Confirm Request
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
