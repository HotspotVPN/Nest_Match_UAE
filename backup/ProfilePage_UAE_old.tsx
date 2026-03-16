import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Award, Star, Building, CheckCircle2, User as UserIcon, Calendar } from 'lucide-react';
import { getUserById, listings, viewingBookings, getInitials, formatCurrency, formatDate, users } from '@/data/mockData';
import type { User, Listing } from '@/types';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [userViewings, setUserViewings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        const user = await getUserById(id);
        
        if (!user) {
          setProfileUser(null);
          setLoading(false);
          return;
        }
        
        setProfileUser(user);
        
        // Handle both 'role' and 'type' for backward compatibility
        const userRole = user.role;
        
        if (userRole === 'landlord' || userRole === 'letting_agent' || userRole === 'agent') {
          const activeListings = listings.filter(l => 
            l.landlord_id === user.id || l.letting_agent_id === user.id
          );
          setUserListings(activeListings);
        } else if (userRole === 'roommate') {
          const myViewings = viewingBookings
            .filter(v => v.searcher_id === user.id)
            .map(v => ({ 
              ...v, 
              property: listings.find(l => l.id === v.property_id) 
            }));
          setUserViewings(myViewings);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h2>Profile Not Found</h2>
          <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const userRole = profileUser.role;
  const isAgent = userRole === 'agent' || userRole === 'letting_agent';
  const isLandlord = userRole === 'landlord';
  const isRoommate = userRole === 'roommate';

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Hero Header */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="avatar avatar-lg" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
            {getInitials(profileUser.name)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '2rem' }}>{profileUser.name}</h1>
              {profileUser.isUaePassVerified && (
                <span title="UAE PASS Verified">
                  <ShieldCheck size={24} style={{ color: 'var(--uaepass-green)' }} />
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                {isRoommate ? 'Tenant' : userRole}
              </span>
              {isAgent && profileUser.rera_license && (
                <span className="badge badge-orange">BRN: {profileUser.rera_license}</span>
              )}
              {isAgent && profileUser.agency_name && (
                <span className="badge badge-blue">
                  <Building size={12} style={{ marginRight: '4px' }}/> {profileUser.agency_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN */}
          <div>
            
            {/* About Section */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>About</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {profileUser.bio || "This user hasn't added a bio yet."}
              </p>
            </div>

            {/* ROOMMATE VIEW */}
            {isRoommate && (
              <>
                {/* Lifestyle Tags */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserIcon size={20} /> Lifestyle & Traits
                  </h3>
                  {profileUser.keywords && profileUser.keywords.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {profileUser.keywords.map(kw => (
                        <span key={kw} className="badge badge-blue" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No lifestyle tags added.</p>
                  )}
                </div>

                {/* Active Viewings */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> Active Applications
                  </h3>
                  {userViewings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {userViewings.map(v => (
                        <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{v.property?.title || 'Property'}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                              Viewing: {formatDate(v.requested_date)}
                            </div>
                          </div>
                          <span className={`badge ${v.status === 'ACCEPTED' ? 'badge-green' : v.status === 'PENDING' ? 'badge-orange' : 'badge-gray'}`}>
                            {v.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No active applications.</p>
                  )}
                </div>
              </>
            )}

            {/* LANDLORD/AGENT VIEW */}
            {(isLandlord || isAgent) && (
              <div>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={20} /> Managed Properties ({userListings.length})
                </h3>
                
                {userListings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No active properties listed.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {userListings.map(listing => (
                      <Link to={`/listing/${listing.id}`} key={listing.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-card listing-card" style={{ overflow: 'hidden', transition: 'transform 0.2s' }}>
                          
                          {/* Property Image */}
                          <div style={{ height: '180px', position: 'relative' }}>
                            <img 
                              src={listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'} 
                              alt={listing.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {listing.isApiVerified && (
                              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                <span className="badge badge-green" style={{ backdropFilter: 'blur(8px)' }}>
                                  DLD Verified
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Card Content */}
                          <div style={{ padding: '1.25rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{listing.title}</h4>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14}/> {listing.district}
                            </div>
                            
                            {/* Rent & Makani */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--brand-purple-light)' }}>
                                {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/mo</span>
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Makani: {listing.makaniNumber}
                              </span>
                            </div>

                            {/* Current Residents - PRIVACY PROTECTED */}
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Current Residents:
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                {listing.occupancy_status?.filter(room => room.status === 'occupied').length > 0 ? (
                                  listing.occupancy_status.filter(room => room.status === 'occupied').map(room => {
                                    const tenant = users.find(u => u.id === room.tenant_id);
                                    return (
                                      <span key={`${room.room_number}-${room.tenant_id}`} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                                        {tenant ? getInitials(tenant.name) : 'VR'} - Rm {room.room_number}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All rooms available</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Trust Sidebar */}
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Trust & Verification */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} /> Trust & Verification
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Identity</span>
                  {profileUser.isUaePassVerified ? (
                    <span className="badge badge-green" style={{ gap: '4px' }}>
                      <CheckCircle2 size={12}/> UAE PASS
                    </span>
                  ) : (
                    <span className="badge badge-orange">Pending</span>
                  )}
                </div>

                {profileUser.gccScore !== undefined && profileUser.gccScore > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Good Conduct</span>
                    <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FDB931)', color: '#000', fontWeight: 700 }}>
                      <Award size={12} style={{ marginRight: '4px' }} /> {profileUser.gccScore}/100
                    </span>
                  </div>
                )}

                {isAgent && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>RERA Status</span>
                    <span className="badge badge-blue">Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Community Rating */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Community Rating</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Star size={24} style={{ color: '#FFD700', fill: '#FFD700' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>4.9</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>(12 reviews)</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Ratings are defamation-safe per UAE law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
