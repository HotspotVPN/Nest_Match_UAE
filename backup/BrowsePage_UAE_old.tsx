import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Search, Building } from 'lucide-react';
import { api } from '@/services/api';
import { formatCurrency } from '@/data/mockData';
import type { Listing, User } from '@/types';

export default function BrowsePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [agents, setAgents] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [maxRent, setMaxRent] = useState(5000);
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getListings();
                setListings(data);

                // Fetch agent data for the cards
                const usersData = await api.getUsers();
                const agentMap: Record<string, User> = {};
                usersData.forEach(u => {
                    if (u.role === 'agent' || u.role === 'landlord' || u.type === 'letting_agent' || u.type === 'landlord') {
                        agentMap[u.id] = u;
                    }
                });
                setAgents(agentMap);
            } catch (error) {
                console.error("Failed to load listings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredListings = listings.filter(listing => {
        if (searchTerm && !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !listing.district.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (selectedDistrict !== 'all' && listing.district !== selectedDistrict) return false;
        if (listing.rent_per_room > maxRent) return false;
        if (verifiedOnly && !listing.isApiVerified) return false;
        return true;
    });

    if (loading) return <div className="section"><div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}><h3>Loading Verified Properties...</h3></div></div>;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Dubai Shared Housing</h1>
                    <div className="badge badge-green" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        <ShieldCheck size={16} style={{ marginRight: '8px' }}/> 
                        Law No. 4 Compliant
                    </div>
                </div>

                {/* UK-Style Filter Bar */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                        
                        {/* Search Input */}
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                Search
                            </label>
                            <input 
                                type="text" 
                                placeholder="Area or property name..." 
                                className="form-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* District Dropdown */}
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                District
                            </label>
                            <select 
                                className="form-input"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option value="all">All Districts</option>
                                <option value="Dubai Marina">Dubai Marina</option>
                                <option value="Downtown Dubai">Downtown Dubai</option>
                                <option value="JLT">JLT</option>
                                <option value="Business Bay">Business Bay</option>
                            </select>
                        </div>

                        {/* Max Rent Slider */}
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                                Max Rent: {formatCurrency(maxRent)}
                            </label>
                            <input 
                                type="range" 
                                min="500" 
                                max="5000" 
                                step="100"
                                value={maxRent}
                                onChange={(e) => setMaxRent(Number(e.target.value))}
                                className="form-input"
                            />
                        </div>

                        {/* Verified Toggle */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                                <input 
                                    type="checkbox"
                                    checked={verifiedOnly}
                                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                                />
                                <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                                <span style={{ fontSize: '0.875rem' }}>DLD Verified Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Showing {filteredListings.length} of {listings.length} properties
                    </div>
                </div>

                {listings.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No properties found. Please check your data connection.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {filteredListings.map(listing => {
                            const manager = listing.letting_agent_id ? agents[listing.letting_agent_id] : null;
                            
                            return (
                                <Link to={`/listing/${listing.id}`} key={listing.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="glass-card listing-card" style={{ overflow: 'hidden', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ height: '200px', position: 'relative' }}>
                                            <img src={listing.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            {listing.isApiVerified && (
                                                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                                    <span className="badge badge-green" style={{ backdropFilter: 'blur(8px)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                                                        DLD Verified
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{listing.title}</h3>
                                            </div>
                                            
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                                                <MapPin size={14} /> {listing.district}
                                            </div>
                                            
                                            <div style={{ marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Rent per room</div>
                                                        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-purple-light)' }}>
                                                            {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
                                                        </span>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Makani Number</div>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{listing.makaniNumber}</span>
                                                    </div>
                                                </div>

                                                {manager && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div className="avatar avatar-sm" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                            {manager.name.substring(0,2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{manager.name}</div>
                                                            {manager.rera_license && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{manager.rera_license}</div>}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
