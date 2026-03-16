import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
    formatCurrency, 
    users as mockUsers, 
    getInitials 
} from '@/data/mockData';
import type { Listing, User } from '@/types';
import { 
    Search, MapPin, Train, ShieldCheck, Users as UsersIcon, 
    Award, Filter, LayoutGrid, List, Sparkles, Building2, 
    Shield, Activity, TrendingUp, LayoutPanelLeft, Clock,
    CheckCircle2
} from 'lucide-react';


const DISTRICTS = ['All', 'Deira', 'International City', 'Al Qusais', 'Bur Dubai', 'Al Nahda', 'Discovery Gardens', 'JVC', 'Dubai Silicon Oasis', 'Al Barsha', 'Dubai Marina', 'JLT', 'Business Bay', 'Downtown Dubai', 'JBR'];
const CONTRACT_LENGTHS = ['Any', '1 Month', '3 Months', '6 Months', '12 Months'];

export default function BrowsePage() {
    const { currentUser } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [users, setUsers] = useState<User[]>([]); // To be migrated to API later
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [budgetMin, setBudgetMin] = useState(500);
    const [budgetMax, setBudgetMax] = useState(10000);
    const [contractLength, setContractLength] = useState('Any');
    
    // Feature Toggles
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterEarlyBird, setFilterEarlyBird] = useState(false);
    const [filterJustSelling, setFilterJustSelling] = useState(false);
    const [filterLowOccupancy, setFilterLowOccupancy] = useState(false);
    const [ownerCrmMode, setOwnerCrmMode] = useState(false);

    useEffect(() => {
        // Use mock data directly (Cloudflare integration postponed)
        import('@/data/mockData').then(({ listings: mockListings }) => {
            setListings(mockListings as Listing[]);
            setUsers(mockUsers as User[]);
            setLoading(false);
        });
    }, []);

    const isLandlord = currentUser?.type === 'letting_agent' || (currentUser?.type as string) === 'operator';

    // Advanced Filtering Logic
    const filteredListings = useMemo(() => {
        return listings.filter(l => {
            // Only hide if over legal capacity
            if (l.currentOccupants > l.maxLegalOccupancy) return false;
            
            // Basic filters only
            if (selectedDistrict !== 'All' && l.district !== selectedDistrict) return false;
            if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) && !l.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            
            return true;
        });
    }, [listings, selectedDistrict, searchQuery]);

    return (
        <div className="section" style={{ paddingTop: '3rem', minHeight: '100vh', background: 'var(--bg-app)' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Discover Verified Properties</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            100% legal, Municipality-permitted shared housing in Dubai
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-green"><ShieldCheck size={12} /> All Listings Verified</span>
                        <span className="badge badge-blue">Occupancy Capped</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '6rem 0', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                             <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--brand-purple-light)', borderRadius: '50%' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>Fetching latest Law No. 4 permits...</p>
                    </div>
                ) : (
                    <>
                        {/* Filters Row 1 */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                        <div style={{ flex: '2', minWidth: '250px' }}>
                            <label className="form-label">SEARCH</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    className="form-input" 
                                    placeholder="Search by area, building..." 
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                    style={{ paddingLeft: '36px', height: '48px' }} 
                                />
                            </div>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label className="form-label">DISTRICT</label>
                            <select 
                                className="form-input" 
                                value={selectedDistrict} 
                                onChange={e => setSelectedDistrict(e.target.value)}
                                style={{ height: '48px' }}
                            >
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '2', minWidth: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>BUDGET RANGE (AED)</label>
                                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-purple-light)' }}>
                                    {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input 
                                    type="range" 
                                    min={500} 
                                    max={5000} 
                                    step={100} 
                                    value={budgetMin} 
                                    onChange={e => setBudgetMin(Math.min(Number(e.target.value), budgetMax))} 
                                    style={{ width: '100%', accentColor: 'var(--brand-purple)' }} 
                                />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>to</span>
                                <input 
                                    type="range" 
                                    min={500} 
                                    max={5000} 
                                    step={100} 
                                    value={budgetMax} 
                                    onChange={e => setBudgetMax(Math.max(Number(e.target.value), budgetMin))} 
                                    style={{ width: '100%', accentColor: 'var(--brand-purple)' }} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filters Row 2: Advanced Logic Tags */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                        <button 
                            onClick={() => setFilterVerified(!filterVerified)}
                            className={`tag ${filterVerified ? 'active' : ''}`}
                            style={{ background: filterVerified ? 'var(--uaepass-green)' : 'transparent', color: filterVerified ? 'white' : 'var(--text-muted)' }}
                        >
                            <ShieldCheck size={14} /> Verified only
                        </button>
                        <button 
                            onClick={() => setFilterEarlyBird(!filterEarlyBird)}
                            className={`tag ${filterEarlyBird ? 'active' : ''}`}
                        >
                            <Sparkles size={14} /> Early bird
                        </button>
                        <button 
                            onClick={() => setFilterJustSelling(!filterJustSelling)}
                            className={`tag ${filterJustSelling ? 'active' : ''}`}
                        >
                            <TrendingUp size={14} /> Just selling
                        </button>
                        <button 
                            onClick={() => setFilterLowOccupancy(!filterLowOccupancy)}
                            className={`tag ${filterLowOccupancy ? 'active' : ''}`}
                        >
                            <UsersIcon size={14} /> Low occupancy
                        </button>
                        
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 0.5rem' }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contract</span>
                            <select 
                                className="form-input" 
                                style={{ width: '120px', height: '32px', fontSize: '0.75rem', padding: '0 0.5rem' }}
                                value={contractLength}
                                onChange={e => setContractLength(e.target.value)}
                            >
                                {CONTRACT_LENGTHS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {isLandlord && (
                            <button 
                                onClick={() => setOwnerCrmMode(!ownerCrmMode)}
                                className={`btn ${ownerCrmMode ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ marginLeft: 'auto', height: '32px', padding: '0 1rem', fontSize: '0.75rem' }}
                            >
                                <LayoutPanelLeft size={14} /> {ownerCrmMode ? 'Filter by Owner: ON' : 'Filter by Owner: OFF'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    {filteredListings.length} verified {filteredListings.length === 1 ? 'property' : 'properties'} available
                </p>

                {/* Listing Grid */}
                <div className="grid-3">
                    {filteredListings.map(listing => {
                        const occupancyPercent = (listing.currentOccupants / listing.maxLegalOccupancy) * 100;
                        const occupancyClass = occupancyPercent >= 80 ? 'critical' : (occupancyPercent >= 50 ? 'warning' : 'safe');
                        const isOwner = currentUser?.id === listing.landlord_id && ownerCrmMode;

                        return (
                            <Link to={`/listing/${listing.id}`} key={listing.id} style={{ textDecoration: 'none' }}>
                                <div className={`listing-card ${isOwner ? 'owner-highlight' : ''}`} style={{ border: isOwner ? '1px solid var(--brand-purple-light)' : 'none' }}>
                                    {/* Image Placeholder */}
                                    <div className="listing-card-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-surface-2), var(--bg-surface-3))' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <MapPin size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.district}</div>
                                        </div>
                                    </div>

                                    <div className="listing-card-body">
                                        {/* Compliance badges */}
                                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                            <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}>
                                                <ShieldCheck size={10} /> Verified
                                            </span>
                                            <span className="badge badge-blue" style={{ fontSize: '0.5625rem' }}>
                                                Makani: {listing.makaniNumber}
                                            </span>
                                        </div>

                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '1.125rem' }}>{listing.title}</h4>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            <MapPin size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                            {listing.address}
                                        </p>

                                        {/* Price */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                                {formatCurrency(listing.rent_per_room)}
                                                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/room/mo</span>
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {listing.available_rooms} of {listing.total_rooms} rooms
                                            </span>
                                        </div>

                                        {/* Occupancy bar */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                    <UsersIcon size={10} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                                    Occupancy: {listing.currentOccupants}/{listing.maxLegalOccupancy}
                                                </span>
                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Legal max</span>
                                            </div>
                                            <div className="occupancy-bar">
                                                <div 
                                                    className={`occupancy-bar-fill ${occupancyClass}`} 
                                                    style={{ 
                                                        width: `${occupancyPercent}%`,
                                                        background: occupancyClass === 'critical' ? 'var(--status-critical)' : (occupancyClass === 'warning' ? '#f59e0b' : 'var(--uaepass-green)')
                                                    }} 
                                                />
                                            </div>
                                        </div>

                                        {/* Transport */}
                                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                {listing.transport_chips.slice(0, 2).map((chip, i) => (
                                                    <span key={i} className="tag" style={{ fontSize: '0.625rem' }}>
                                                        <Train size={10} style={{ color: chip.line_color || 'var(--text-muted)' }} />
                                                        {chip.label} · {chip.walk_time}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Current roommates */}
                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {listing.current_roommates.slice(0, 3).map(rmId => {
                                                    const rm = users.find(u => u.id === rmId);
                                                    return rm ? (
                                                        <div key={rmId} className="avatar avatar-sm" title={`${rm.name} (GCC: 4.8)`} style={{ width: '24px', height: '24px', fontSize: '0.6rem', border: '2px solid var(--bg-surface-1)', marginLeft: listing.current_roommates.indexOf(rmId) > 0 ? '-8px' : '0' }}>
                                                            {getInitials(rm.name)}
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                            {listing.rating && (
                                                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                                                    ★ {listing.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>

                                        {/* CRM Mode Info */}
                                        {isOwner && (
                                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-purple-light)' }}>
                                                    <span>Revenue</span>
                                                    <span>12 Leads</span>
                                                </div>
                                                <div style={{ fontWeight: 800, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                    {formatCurrency(listing.rent_per_room * listing.currentOccupants)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredListings.length === 0 && (
                    <div className="glass-card" style={{ padding: '6rem 3rem', textAlign: 'center' }}>
                        <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No properties match your criteria</h3>
                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Try adjusting your filters or expanding your budget range.</p>
                        <button 
                            className="btn btn-primary" 
                            style={{ marginTop: '2rem' }}
                            onClick={() => {
                                setSelectedDistrict('All');
                                setBudgetMin(500);
                                setBudgetMax(5000);
                                setFilterVerified(false);
                            }}
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
                </>
                )}
            </div>
            
            <style>{`
                .owner-highlight {
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
                }
                .avatar {
                    transition: transform 0.2s ease;
                }
                .avatar:hover {
                    transform: translateY(-4px);
                    z-index: 10;
                }
            `}</style>
        </div>
    );
}
