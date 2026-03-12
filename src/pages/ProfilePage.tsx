import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { listings, formatCurrency, getInitials, users } from '@/data/mockData';
import {
    ShieldCheck, Award, Star, CreditCard, MapPin, Building2,
    CheckCircle2, Phone, Mail, Instagram, Linkedin, Plus,
} from 'lucide-react';

export default function ProfilePage() {
    const { currentUser, verificationTier } = useAuth();
    const navigate = useNavigate();

    if (!currentUser) { navigate('/login'); return null; }

    const currentListing = currentUser.current_house_id ? listings.find(l => l.id === currentUser.current_house_id) : null;
    const managedListings = listings.filter(l => l.landlord_id === currentUser.id || l.letting_agent_id === currentUser.id);

    // GCC badge eligibility
    const gccQualified = currentUser.gccScore >= 80;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Profile Header */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                        <div className="avatar avatar-xl">{getInitials(currentUser.name)}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0 }}>{currentUser.name}</h2>
                                {currentUser.isUaePassVerified ? (
                                    <span className="badge badge-uaepass"><ShieldCheck size={12} /> UAE PASS Verified (Tier 2)</span>
                                ) : currentUser.isIdVerified ? (
                                    <span className="badge badge-green"><ShieldCheck size={12} /> ID Verified (Tier 2)</span>
                                ) : (
                                    <span className="badge badge-orange"><ShieldCheck size={12} /> Tier 1 Basic</span>
                                )}
                                {currentUser.isPremium && <span className="badge badge-gold">⭐ Premium</span>}
                                {gccQualified && (
                                    <span className="gcc-badge"><Award size={12} /> Verified GCC</span>
                                )}
                            </div>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                {currentUser.type === 'letting_agent' ? `RERA Agent — ${currentUser.agency_name}` : currentUser.type === 'landlord' ? 'Property Owner' : currentUser.resident_role === 'residing' ? 'Residing Roommate' : 'Searching Roommate'}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{currentUser.bio}</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        {currentUser.phone && <span className="tag"><Phone size={12} /> {currentUser.phone}</span>}
                        {currentUser.email && <span className="tag"><Mail size={12} /> {currentUser.email}</span>}
                        {currentUser.instagram_handle && <span className="tag"><Instagram size={12} /> {currentUser.instagram_handle}</span>}
                        {currentUser.linkedin_url && <span className="tag"><Linkedin size={12} /> LinkedIn</span>}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* GCC Score */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={20} style={{ color: '#f59e0b' }} /> Good Conduct Certificate
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: gccQualified ? '#f59e0b' : 'var(--text-primary)' }}>
                                {currentUser.gccScore}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100<br />GCC Score</div>
                        </div>
                        <div className="occupancy-bar" style={{ height: '8px', marginBottom: '0.75rem' }}>
                            <div className={`occupancy-bar-fill ${currentUser.gccScore >= 80 ? 'safe' : currentUser.gccScore >= 40 ? 'warning' : 'full'}`} style={{ width: `${currentUser.gccScore}%` }} />
                        </div>
                        {gccQualified ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                                <Award size={16} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.8125rem', color: '#f59e0b', fontWeight: 600 }}>Gold Verified — Priority access to listings</span>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {currentUser.gccScore > 0 ? `${80 - currentUser.gccScore} more points to Gold status. Complete your tenancy for +20 pts.` : 'Start building your GCC score — complete a 12-month tenancy with zero complaints.'}
                            </p>
                        )}

                        {currentUser.good_conduct_certificate && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    <span>Payment Reliability</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)', textTransform: 'capitalize' }}>{currentUser.good_conduct_certificate.payment_reliability}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Property Care</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)', textTransform: 'capitalize' }}>{currentUser.good_conduct_certificate.property_care}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Verification Status */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={20} style={{ color: 'var(--uaepass-green-light)' }} /> Verification
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'UAE PASS Identity', done: !!currentUser.isUaePassVerified },
                                { label: 'Emirates ID Confirmed', done: !!currentUser.emiratesId || !!currentUser.isIdVerified },
                                { label: 'AML / PEP Screening', done: currentUser.compliance.aml_status === 'completed' },
                                { label: 'Bank Account Linked', done: !!currentUser.bank_linked },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)', background: item.done ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)' }}>
                                    {item.done ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <div style={{ width: '16px', height: '16px', borderRadius: 'var(--radius-full)', border: '2px solid var(--text-muted)' }} />}
                                    <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                        {currentUser.uaePassId && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>UAE PASS ID: {currentUser.uaePassId}</div>
                        )}
                        {verificationTier === 'tier1' && (
                            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-medium)' }}>
                                <p style={{ fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Upgrade to Tier 2 to unlock chat and bookings.</p>
                                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>Verify Visual ID (Onfido)</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lifestyle Tags (Roommates) */}
                {currentUser.type === 'roommate' && (currentUser.lifestyle_tags || currentUser.personality_traits || currentUser.hobbies) && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Lifestyle & Personality</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {currentUser.lifestyle_tags && currentUser.lifestyle_tags.length > 0 && (
                                <div>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activities</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.375rem' }}>
                                        {currentUser.lifestyle_tags.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                </div>
                            )}
                            {currentUser.personality_traits && currentUser.personality_traits.length > 0 && (
                                <div>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personality</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.375rem' }}>
                                        {currentUser.personality_traits.map(t => <span key={t} className="badge badge-purple">{t}</span>)}
                                    </div>
                                </div>
                            )}
                            {currentUser.hobbies && currentUser.hobbies.length > 0 && (
                                <div>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hobbies</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.375rem' }}>
                                        {currentUser.hobbies.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Current Accommodation (Residing Roommates) */}
                {currentListing && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Building2 size={20} /> Current Accommodation
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <h4>{currentListing.title}</h4>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={12} /> {currentListing.address}
                                </p>
                                <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem' }}>
                                    <span className="tag">{formatCurrency(currentUser.rent_monthly || 0)}/mo</span>
                                    {currentUser.direct_debit?.status === 'active' && <span className="badge badge-green">Auto-Pay Active</span>}
                                </div>
                            </div>
                            <Link to={`/listing/${currentListing.id}`} className="btn btn-outline btn-sm">View</Link>
                        </div>
                    </div>
                )}

                {/* Managed Properties (Landlords / Agents) */}
                {managedListings.length > 0 && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3><Building2 size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> My Properties</h3>
                            <Link to="/add-property" className="btn btn-primary btn-sm"><Plus size={14} /> Add Property</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {managedListings.map(l => (
                                <Link to={`/listing/${l.id}`} key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s' }}>
                                    <MapPin size={20} style={{ color: 'var(--brand-purple-light)' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{l.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.district} · {l.currentOccupants}/{l.maxLegalOccupancy} occupants</div>
                                    </div>
                                    <span className={`badge ${l.isActive ? 'badge-green' : 'badge-red'}`}>{l.isActive ? 'Active' : 'At Capacity'}</span>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(l.rent_per_room)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bank Details */}
                {currentUser.bank_details && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={20} /> Bank Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {[
                                { label: 'Bank', value: currentUser.bank_details.bank_name },
                                { label: 'Account Name', value: currentUser.bank_details.account_name },
                                { label: 'IBAN', value: currentUser.bank_details.iban },
                                { label: 'SWIFT', value: currentUser.bank_details.swift_code },
                            ].map(d => (
                                <div key={d.label}>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* RERA License (Agents) */}
                {currentUser.rera_license && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                        <h3 style={{ marginBottom: '0.75rem' }}>RERA Broker License</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldCheck size={20} style={{ color: 'var(--uaepass-green-light)' }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>{currentUser.rera_license}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.agency_name}</div>
                            </div>
                            <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Verified</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
