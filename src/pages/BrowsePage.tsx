import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    formatCurrency,
    users as mockUsers,
    getInitials,
} from '@/data/mockData';
import type { Listing, User } from '@/types';
import { api } from '@/services/api';
import {
    Search, MapPin, Train, ShieldCheck, Users as UsersIcon,
    Filter, LayoutGrid, List, Building2,
    ArrowUpDown, X, Check, Star, Bus, ChevronDown, MapPinned,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────
const DISTRICTS = [
    'Deira', 'International City', 'Al Qusais', 'Bur Dubai', 'Al Nahda',
    'Discovery Gardens', 'JVC', 'Dubai Silicon Oasis', 'Al Barsha',
    'Business Bay', 'JLT', 'Dubai Marina',
];

const AMENITIES = ['Pool', 'Gym', 'Parking', 'En-suite', 'Balcony', 'Central AC', 'Wi-Fi', 'Furnished'];

const TRANSPORT_FILTERS = [
    { label: 'Red Line', color: '#E21836' },
    { label: 'Green Line', color: '#009639' },
    { label: 'Bus', color: '#6366f1' },
];

type SortOption = 'top-rated' | 'price-low' | 'price-high' | 'newest' | 'available' | 'most-available';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'top-rated', label: 'Top Rated' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'available', label: 'Available First' },
    { value: 'most-available', label: 'Most Available' },
];

// District colour map for hero gradients
const DISTRICT_COLORS: Record<string, string> = {
    'Deira': '#E21836', 'International City': '#009639', 'Al Qusais': '#0ea5e9',
    'Bur Dubai': '#f59e0b', 'Al Nahda': '#8b5cf6', 'Discovery Gardens': '#22c55e',
    'JVC': '#ec4899', 'Dubai Silicon Oasis': '#06b6d4', 'Al Barsha': '#f97316',
    'Business Bay': '#6366f1', 'JLT': '#14b8a6', 'Dubai Marina': '#3b82f6',
};

export default function BrowsePage() {
    const { currentUser } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // ─── Filter State ────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [budgetMin, setBudgetMin] = useState(500);
    const [budgetMax, setBudgetMax] = useState(15000);
    const [billsIncluded, setBillsIncluded] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedTransport, setSelectedTransport] = useState<string[]>([]);
    const [showFullyOccupied, setShowFullyOccupied] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('top-rated');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        console.log('[BrowsePage] Starting property fetch...');
        api.getProperties().then(data => {
            console.log('[BrowsePage] API returned:', data.length, 'properties');
            setListings(data as Listing[]);
            setUsers(mockUsers as User[]);
            setLoading(false);
        }).catch(err => {
            console.info('%c[NestMatch] BrowsePage — using mock fallback', 'color: #8B5CF6; font-weight: bold;');
            import('@/data/mockData').then(({ listings: mockListings }) => {
                console.log('[BrowsePage] Mock data:', mockListings.length, 'properties');
                setListings(mockListings as Listing[]);
                setUsers(mockUsers as User[]);
                setLoading(false);
            });
        });
    }, []);

    // ─── Active Filter Count ─────────────────────────────────
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedDistricts.length > 0) count++;
        if (budgetMin > 500 || budgetMax < 15000) count++;
        if (billsIncluded) count++;
        if (verifiedOnly) count++;
        if (availableOnly) count++;
        if (selectedAmenities.length > 0) count++;
        if (selectedTransport.length > 0) count++;
        if (searchQuery) count++;
        return count;
    }, [selectedDistricts, budgetMin, budgetMax, billsIncluded, verifiedOnly, availableOnly, selectedAmenities, selectedTransport, searchQuery]);

    // ─── Filtering + Sorting ─────────────────────────────────
    const filteredListings = useMemo(() => {
        let result = listings.filter(l => {
            if (l.listing_status === 'coming_soon') return false;
            if (l.currentOccupants > l.maxLegalOccupancy) return false;
            // Hide fully occupied by default unless toggle is on
            if (!showFullyOccupied && l.available_rooms === 0) return false;
            if (selectedDistricts.length > 0 && !selectedDistricts.includes(l.district)) return false;
            if (l.rent_per_room < budgetMin || l.rent_per_room > budgetMax) return false;
            if (billsIncluded && !l.bills_included) return false;
            if (verifiedOnly && !l.isApiVerified) return false;
            if (availableOnly && l.available_rooms === 0) return false;
            if (selectedAmenities.length > 0 && !selectedAmenities.every(a => l.amenities.some(la => la.toLowerCase().includes(a.toLowerCase())))) return false;
            if (selectedTransport.length > 0) {
                const hasTransport = selectedTransport.some(tf => {
                    if (tf === 'Bus') return l.transport_chips?.some(tc => tc.type === 'bus');
                    return l.transport_chips?.some(tc => tc.lines?.some(line => line.includes(tf)));
                });
                if (!hasTransport) return false;
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!l.title.toLowerCase().includes(q) && !l.address.toLowerCase().includes(q) && !l.district.toLowerCase().includes(q) && !l.description.toLowerCase().includes(q)) return false;
            }
            return true;
        });

        // Sort
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.rent_per_room - b.rent_per_room); break;
            case 'price-high': result.sort((a, b) => b.rent_per_room - a.rent_per_room); break;
            case 'top-rated': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
            case 'available': result.sort((a, b) => b.available_rooms - a.available_rooms); break;
            case 'most-available': result.sort((a, b) => b.available_rooms - a.available_rooms); break;
        }

        return result;
    }, [listings, selectedDistricts, budgetMin, budgetMax, billsIncluded, verifiedOnly, availableOnly, showFullyOccupied, selectedAmenities, selectedTransport, searchQuery, sortBy]);

    const toggleDistrict = (d: string) => setSelectedDistricts(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    const toggleAmenity = (a: string) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
    const toggleTransport = (t: string) => setSelectedTransport(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

    const clearAllFilters = () => {
        setSelectedDistricts([]); setBudgetMin(500); setBudgetMax(15000);
        setBillsIncluded(false); setVerifiedOnly(false); setAvailableOnly(false);
        setSelectedAmenities([]); setSelectedTransport([]); setSearchQuery('');
    };

    // ─── Render ──────────────────────────────────────────────
    return (
        <div className="section" style={{ paddingTop: '2rem', minHeight: '100vh' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Discover Verified Properties</h1>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Municipality-permitted shared housing across Dubai
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="badge badge-green"><ShieldCheck size={12} /> All DLD Verified</span>
                        <span className="badge badge-purple">{filteredListings.length} results</span>
                    </div>
                </div>

                {/* Search Bar + Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="form-input"
                            placeholder="Search area, building, district..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '36px', height: '44px' }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ height: '44px', gap: '0.5rem', position: 'relative' }}
                    >
                        <Filter size={16} /> Filters
                        {activeFilterCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-6px', right: '-6px',
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: 'var(--error)', color: 'white',
                                fontSize: '0.625rem', fontWeight: 800,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Sort */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="form-input"
                            style={{ height: '44px', paddingLeft: '2rem', paddingRight: '1.5rem', fontSize: '0.8125rem', minWidth: '160px' }}
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ArrowUpDown size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>

                    {/* View Toggle */}
                    <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button onClick={() => setViewMode('grid')} style={{ padding: '0.625rem', background: viewMode === 'grid' ? 'var(--bg-surface-3)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            <LayoutGrid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} style={{ padding: '0.625rem', background: viewMode === 'list' ? 'var(--bg-surface-3)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '6rem 0', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--brand-purple-light)', borderRadius: '50%' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>Fetching verified listings...</p>
                    </div>
                ) : (
                    <>
                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                {/* Districts */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <label className="form-label" style={{ margin: 0 }}>DISTRICT</label>
                                        {selectedDistricts.length > 0 && (
                                            <button onClick={() => setSelectedDistricts([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.6875rem', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                        {DISTRICTS.map(d => {
                                            const active = selectedDistricts.includes(d);
                                            return (
                                                <button
                                                    key={d}
                                                    onClick={() => toggleDistrict(d)}
                                                    style={{
                                                        padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                                                        border: `1px solid ${active ? 'var(--brand-purple)' : 'var(--border-subtle)'}`,
                                                        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                                                        color: active ? 'var(--brand-purple-light)' : 'var(--text-muted)',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {d}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Budget Range */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ margin: 0 }}>BUDGET (AED / month)</label>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--brand-purple-light)' }}>
                                            {formatCurrency(budgetMin)} – {formatCurrency(budgetMax)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input type="range" min={500} max={15000} step={100} value={budgetMin}
                                            onChange={e => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 100))}
                                            style={{ width: '100%', accentColor: 'var(--brand-purple)' }} />
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>to</span>
                                        <input type="range" min={500} max={15000} step={100} value={budgetMax}
                                            onChange={e => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 100))}
                                            style={{ width: '100%', accentColor: 'var(--brand-purple)' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                    {/* Toggles */}
                                    <div>
                                        <label className="form-label">QUICK FILTERS</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {[
                                                { label: 'Bills Included', active: billsIncluded, toggle: () => setBillsIncluded(!billsIncluded) },
                                                { label: 'DLD Verified Only', active: verifiedOnly, toggle: () => setVerifiedOnly(!verifiedOnly) },
                                                { label: 'Available Rooms Only', active: availableOnly, toggle: () => setAvailableOnly(!availableOnly) },
                                                { label: 'Show Fully Occupied', active: showFullyOccupied, toggle: () => setShowFullyOccupied(!showFullyOccupied) },
                                            ].map(f => (
                                                <button key={f.label} onClick={f.toggle} style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem',
                                                    borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: 600,
                                                    background: f.active ? 'rgba(34,197,94,0.1)' : 'transparent',
                                                    border: `1px solid ${f.active ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`,
                                                    color: f.active ? 'var(--success)' : 'var(--text-muted)',
                                                    cursor: 'pointer', transition: 'all 0.15s',
                                                }}>
                                                    {f.active ? <Check size={14} /> : <div style={{ width: 14 }} />} {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <label className="form-label">AMENITIES</label>
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                            {AMENITIES.map(a => {
                                                const active = selectedAmenities.includes(a);
                                                return (
                                                    <button key={a} onClick={() => toggleAmenity(a)} style={{
                                                        padding: '0.375rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 600,
                                                        border: `1px solid ${active ? 'rgba(56,189,248,0.5)' : 'var(--border-subtle)'}`,
                                                        background: active ? 'rgba(56,189,248,0.1)' : 'transparent',
                                                        color: active ? 'var(--brand-blue-light)' : 'var(--text-muted)',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                    }}>
                                                        {a}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Transport */}
                                    <div>
                                        <label className="form-label">TRANSPORT</label>
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                            {TRANSPORT_FILTERS.map(t => {
                                                const active = selectedTransport.includes(t.label);
                                                return (
                                                    <button key={t.label} onClick={() => toggleTransport(t.label)} style={{
                                                        padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700,
                                                        border: `1px solid ${active ? t.color + '80' : 'var(--border-subtle)'}`,
                                                        background: active ? t.color + '15' : 'transparent',
                                                        color: active ? t.color : 'var(--text-muted)',
                                                        cursor: 'pointer', transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                                                    }}>
                                                        {t.label === 'Bus' ? <Bus size={12} /> : <Train size={12} />} {t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Clear All */}
                                {activeFilterCount > 0 && (
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active · {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''}
                                        </span>
                                        <button onClick={clearAllFilters} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
                                            <X size={14} /> Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Listing Grid / List */}
                        {filteredListings.length > 0 ? (
                            <div style={viewMode === 'grid'
                                ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }
                                : { display: 'flex', flexDirection: 'column', gap: '1rem' }
                            }>
                                {filteredListings.map(listing => {
                                    const landlord = users.find(u => u.id === listing.landlord_id);
                                    const agent = listing.letting_agent_id ? users.find(u => u.id === listing.letting_agent_id) : null;
                                    const occupancyPercent = listing.maxLegalOccupancy > 0 ? (listing.currentOccupants / listing.maxLegalOccupancy) * 100 : 0;
                                    const occupancyColor = occupancyPercent >= 90 ? 'var(--error)' : occupancyPercent >= 70 ? '#f59e0b' : 'var(--success)';
                                    const districtColor = DISTRICT_COLORS[listing.district] || '#6366f1';

                                    if (viewMode === 'list') {
                                        // ─── List View Card ─────────────────
                                        return (
                                            <Link to={`/listing/${listing.slug || listing.id}`} key={listing.id} style={{ textDecoration: 'none' }}>
                                                <div className="glass-card hover-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', alignItems: 'center' }}>
                                                    {/* Mini image */}
                                                    <div style={{ width: '140px', minWidth: '140px', height: '100px', borderRadius: 'var(--radius-md)', background: listing.images?.[0] ? 'none' : `linear-gradient(135deg, ${districtColor}20, ${districtColor}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                                        {listing.images?.[0] ? (
                                                            <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <Building2 size={28} style={{ color: districtColor, opacity: 0.6 }} />
                                                        )}
                                                        {listing.isApiVerified && (
                                                            <span style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', padding: '2px 4px' }}>
                                                                <ShieldCheck size={10} style={{ color: 'var(--success)' }} />
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                                                            <h4 style={{ fontSize: '1rem', margin: 0 }}>{listing.title}</h4>
                                                            <span style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                                                                {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> {listing.district}</span>
                                                            <span>{listing.available_rooms} room{listing.available_rooms !== 1 ? 's' : ''} available</span>
                                                            {listing.bills_included && <span className="badge badge-blue" style={{ fontSize: '0.5625rem' }}>Bills Inc.</span>}
                                                            {listing.rating && <span style={{ color: '#f59e0b' }}>★ {listing.rating.toFixed(1)}</span>}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                            {listing.transport_chips?.slice(0, 2).map((chip, i) => (
                                                                <span key={i} className="tag" style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem' }}>
                                                                    <Train size={9} style={{ color: chip.line_color || 'var(--text-muted)' }} /> {chip.label} · {chip.walk_time}
                                                                </span>
                                                            ))}
                                                            {listing.amenities.slice(0, 3).map(a => (
                                                                <span key={a} className="tag" style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem' }}>{a}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    }

                                    // ─── Grid View Card ─────────────────
                                    return (
                                        <Link to={`/listing/${listing.slug || listing.id}`} key={listing.id} style={{ textDecoration: 'none' }}>
                                            <div className="listing-card">
                                                {/* Hero Image */}
                                                <div className="listing-card-image" style={{
                                                    background: listing.images?.[0] ? 'none' : `linear-gradient(135deg, ${districtColor}25, ${districtColor}08, var(--bg-surface-2))`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                                                    overflow: 'hidden',
                                                }}>
                                                    {listing.images?.[0] ? (
                                                        <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <Building2 size={40} style={{ color: districtColor, opacity: 0.4 }} />
                                                    )}

                                                    {/* Makani badge */}
                                                    <span style={{
                                                        position: 'absolute', bottom: '8px', left: '8px',
                                                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                                                        borderRadius: '4px', padding: '2px 6px',
                                                        fontSize: '0.5625rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600,
                                                    }}>
                                                        Makani: {listing.makaniNumber}
                                                    </span>

                                                    {/* Verified badge */}
                                                    {listing.isApiVerified && (
                                                        <span style={{
                                                            position: 'absolute', top: '8px', left: '8px',
                                                            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                                                            borderRadius: '4px', padding: '3px 8px',
                                                            fontSize: '0.5625rem', fontWeight: 700, color: 'var(--success)',
                                                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                        }}>
                                                            <ShieldCheck size={10} /> DLD Verified
                                                        </span>
                                                    )}

                                                    {/* Rating */}
                                                    {listing.rating && (
                                                        <span style={{
                                                            position: 'absolute', top: '8px', right: '8px',
                                                            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                                                            borderRadius: '4px', padding: '3px 8px',
                                                            fontSize: '0.6875rem', fontWeight: 800, color: '#f59e0b',
                                                        }}>
                                                            ★ {listing.rating.toFixed(1)}
                                                        </span>
                                                    )}

                                                    {/* Vacancy badges */}
                                                    {listing.available_rooms === 1 && listing.available_rooms < listing.total_rooms && (
                                                        <span style={{
                                                            position: 'absolute', bottom: '8px', right: '8px',
                                                            background: 'rgba(245,158,11,0.9)', backdropFilter: 'blur(4px)',
                                                            borderRadius: '4px', padding: '3px 8px',
                                                            fontSize: '0.625rem', fontWeight: 700, color: 'white',
                                                        }}>
                                                            Almost Full
                                                        </span>
                                                    )}
                                                    {listing.available_rooms === listing.total_rooms && listing.total_rooms > 0 && (
                                                        <span style={{
                                                            position: 'absolute', bottom: '8px', right: '8px',
                                                            background: 'rgba(34,197,94,0.9)', backdropFilter: 'blur(4px)',
                                                            borderRadius: '4px', padding: '3px 8px',
                                                            fontSize: '0.625rem', fontWeight: 700, color: 'white',
                                                        }}>
                                                            Fully Available
                                                        </span>
                                                    )}
                                                    {(() => {
                                                        const createdDays = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24));
                                                        return createdDays <= 7 ? (
                                                            <span style={{
                                                                position: 'absolute', top: '8px', right: listing.rating ? '70px' : '8px',
                                                                background: 'rgba(34,197,94,0.9)', backdropFilter: 'blur(4px)',
                                                                borderRadius: '4px', padding: '3px 8px',
                                                                fontSize: '0.625rem', fontWeight: 700, color: 'white',
                                                            }}>
                                                                Just Listed
                                                            </span>
                                                        ) : null;
                                                    })()}

                                                    {/* Available rooms overlay */}
                                                    {listing.available_rooms === 0 && (
                                                        <div style={{
                                                            position: 'absolute', inset: 0,
                                                            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                                                        }}>
                                                            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.875rem' }}>FULLY OCCUPIED</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="listing-card-body">
                                                    <h4 style={{ marginBottom: '0.25rem', fontSize: '1.0625rem' }}>{listing.title}</h4>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <MapPin size={11} /> {listing.address}
                                                    </p>

                                                    {/* Price + Bills */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                        <span style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                                                            {formatCurrency(listing.rent_per_room)}
                                                            <span style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                            {listing.bills_included && <span className="badge badge-blue" style={{ fontSize: '0.5625rem' }}>Bills Inc.</span>}
                                                            <span className="badge" style={{ fontSize: '0.5625rem' }}>
                                                                {listing.available_rooms}/{listing.total_rooms} rooms
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Occupancy Bar */}
                                                    <div style={{ marginBottom: '0.75rem' }}>
                                                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg-surface-3)', overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${occupancyPercent}%`, background: occupancyColor, borderRadius: '2px', transition: 'width 0.3s' }} />
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                                            <span style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>
                                                                {listing.currentOccupants}/{listing.maxLegalOccupancy} occupants
                                                            </span>
                                                            <span style={{ fontSize: '0.5625rem', color: occupancyColor, fontWeight: 600 }}>
                                                                {occupancyPercent >= 90 ? 'Nearly Full' : occupancyPercent >= 70 ? 'Filling Up' : 'Available'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Transport Chips */}
                                                    {listing.transport_chips && listing.transport_chips.length > 0 && (
                                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                            {listing.transport_chips.slice(0, 2).map((chip, i) => (
                                                                <span key={i} className="tag" style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem' }}>
                                                                    <Train size={9} style={{ color: chip.line_color || 'var(--text-muted)' }} />
                                                                    {chip.label} · {chip.walk_time}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Top 3 Amenities */}
                                                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                        {listing.amenities.slice(0, 3).map(a => (
                                                            <span key={a} className="tag" style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem' }}>{a}</span>
                                                        ))}
                                                        {listing.amenities.length > 3 && (
                                                            <span className="tag" style={{ fontSize: '0.5625rem', padding: '0.2rem 0.5rem', color: 'var(--brand-purple-light)' }}>+{listing.amenities.length - 3}</span>
                                                        )}
                                                    </div>

                                                    {/* Footer: Landlord + roommates */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                            {agent ? (
                                                                <span>{agent.name} · <span style={{ color: 'var(--brand-purple-light)' }}>{agent.rera_license}</span></span>
                                                            ) : landlord ? (
                                                                <span>{landlord.name}</span>
                                                            ) : null}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {listing.current_roommates.slice(0, 3).map((rmId, idx) => {
                                                                const rm = users.find(u => u.id === rmId);
                                                                return rm ? (
                                                                    <div key={rmId} className="avatar avatar-sm" style={{ width: '22px', height: '22px', fontSize: '0.5rem', border: '2px solid var(--bg-card)', marginLeft: idx > 0 ? '-6px' : '0' }}>
                                                                        {getInitials(rm.name)}
                                                                    </div>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.4 }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No properties match your criteria</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your filters or expanding your budget range.</p>
                                <button onClick={clearAllFilters} className="btn btn-primary">Reset All Filters</button>
                            </div>
                        )}

                        {/* Map View Placeholder */}
                        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPinned size={20} style={{ color: 'var(--brand-purple-light)' }} /> Location Overview
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                {filteredListings.slice(0, 6).map(l => (
                                    <Link to={`/listing/${l.slug || l.id}`} key={l.id} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                            transition: 'border-color 0.2s',
                                        }}>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{l.district}</div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>{l.title}</div>
                                            <div style={{ fontSize: '0.625rem', color: 'var(--brand-purple-light)', fontFamily: 'monospace' }}>
                                                {l.location?.lat.toFixed(3)}°N, {l.location?.lng.toFixed(3)}°E
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
