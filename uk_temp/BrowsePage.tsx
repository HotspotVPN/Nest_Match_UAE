import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    listings, getUserById, getRoommatesForListing, getInitials,
    formatCurrency, starDisplay,
} from '@/data/mockData';
import {
    Search, MapPin, SlidersHorizontal, Star, Train, Bus,
    Eye, Wifi, Heart, CheckCircle2, X, Map, TreePine,
    ShoppingCart, Dumbbell, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { Listing } from '@/types';

// All available filter tags derived from listings
const allTags = Array.from(new Set(listings.flatMap((l) => l.tags))).sort();

const locationFeatures = [
    { key: 'near-tube', label: 'Near Tube Station', icon: Train },
    { key: 'near-train', label: 'Near Train Station', icon: Train },
    { key: 'walkable', label: 'Walkable to Bus', icon: Bus },
    { key: 'parks', label: 'Near Parks', icon: TreePine },
    { key: 'restaurants', label: 'High Street / Restaurants', icon: ShoppingCart },
    { key: 'gym-nearby', label: 'Near Gym', icon: Dumbbell },
];

type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

export default function BrowsePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [showMap, setShowMap] = useState(false);

    // Filter state
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000);
    const [minRooms, setMinRooms] = useState(0);
    const [billsIncluded, setBillsIncluded] = useState<boolean | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedLocFeatures, setSelectedLocFeatures] = useState<string[]>([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
    };

    const toggleLocFeature = (key: string) => {
        setSelectedLocFeatures((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setMinPrice(0);
        setMaxPrice(2000);
        setMinRooms(0);
        setBillsIncluded(null);
        setSelectedTags([]);
        setSelectedLocFeatures([]);
        setMinRating(0);
    };

    const activeFilterCount = [
        minPrice > 0 || maxPrice < 2000 ? 1 : 0,
        minRooms > 0 ? 1 : 0,
        billsIncluded !== null ? 1 : 0,
        selectedTags.length > 0 ? 1 : 0,
        selectedLocFeatures.length > 0 ? 1 : 0,
        minRating > 0 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Apply filters
    const filtered = useMemo(() => {
        let results = [...listings];

        // Text search — matches title, address, description, tags
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter((l) =>
                l.title.toLowerCase().includes(q) ||
                l.address.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                l.tags.some((t) => t.toLowerCase().includes(q)) ||
                l.amenities.some((a) => a.toLowerCase().includes(q)) ||
                (l.location?.nearby_amenities.some((a) => a.toLowerCase().includes(q))) ||
                (l.location?.area_description?.toLowerCase().includes(q)) ||
                (l.location?.nearest_tube?.name.toLowerCase().includes(q)) ||
                (l.location?.nearest_tube?.line.toLowerCase().includes(q))
            );
        }

        // Price range
        results = results.filter((l) => l.rent_per_room >= minPrice && l.rent_per_room <= maxPrice);

        // Available rooms
        if (minRooms > 0) {
            results = results.filter((l) => l.available_rooms >= minRooms);
        }

        // Bills included
        if (billsIncluded !== null) {
            results = results.filter((l) => l.bills_included === billsIncluded);
        }

        // Tags
        if (selectedTags.length > 0) {
            results = results.filter((l) => selectedTags.every((t) => l.tags.includes(t)));
        }

        // Location features (check tags + location data)
        if (selectedLocFeatures.length > 0) {
            results = results.filter((l) => {
                return selectedLocFeatures.every((feat) => {
                    if (feat === 'near-tube') return l.location?.nearest_tube && l.location.nearest_tube.walk_mins <= 10;
                    if (feat === 'near-train') return l.location?.nearest_train && l.location.nearest_train.walk_mins <= 15;
                    if (feat === 'walkable') return l.location?.nearest_bus && l.location.nearest_bus.walk_mins <= 5;
                    if (feat === 'parks') return l.location?.nearby_amenities.some((a) => a.toLowerCase().includes('park'));
                    if (feat === 'restaurants') return l.location?.nearby_amenities.some((a) => a.toLowerCase().includes('market') || a.toLowerCase().includes('restaurant') || a.toLowerCase().includes('shopping'));
                    if (feat === 'gym-nearby') return l.location?.nearby_amenities.some((a) => a.toLowerCase().includes('gym') || a.toLowerCase().includes('puregym'));
                    return true;
                });
            });
        }

        // Rating
        if (minRating > 0) {
            results = results.filter((l) => (l.rating || 0) >= minRating);
        }

        // Sort
        results.sort((a, b) => {
            if (sortBy === 'price-asc') return a.rent_per_room - b.rent_per_room;
            if (sortBy === 'price-desc') return b.rent_per_room - a.rent_per_room;
            if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        return results;
    }, [searchQuery, minPrice, maxPrice, minRooms, billsIncluded, selectedTags, selectedLocFeatures, minRating, sortBy]);

    return (
        <div className="section" style={{ paddingTop: '1.5rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        Browse <span className="gradient-text">Listings</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
                        {activeFilterCount > 0 ? ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)` : ''}
                    </p>

                    {/* Search bar + controls */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="form-input" placeholder="Search by area, tube station, postcode, or keyword..."
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '36px' }} />
                        </div>

                        <select className="form-input form-select" style={{ width: 'auto', minWidth: '160px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                            <option value="rating-desc">Top Rated</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>

                        <button onClick={() => setShowFilters(!showFilters)}
                            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ gap: '0.5rem' }}>
                            <SlidersHorizontal size={16} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700 }}>
                                    {activeFilterCount}
                                </span>
                            )}
                            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        <button onClick={() => setShowMap(!showMap)}
                            className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}>
                            <Map size={16} /> Map
                        </button>

                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="btn btn-ghost" style={{ color: 'var(--error)' }}>
                                <X size={14} /> Clear All
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '260px 1fr' : '1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                    {/* Filters Sidebar */}
                    {showFilters && (
                        <div className="glass-card" style={{ padding: '1.25rem', position: 'sticky', top: '80px' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <SlidersHorizontal size={16} style={{ color: 'var(--brand-purple-light)' }} /> Filters
                            </h4>

                            {/* Price Range */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Monthly Rent</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input className="form-input" type="number" placeholder="Min" value={minPrice || ''} onChange={(e) => setMinPrice(Number(e.target.value) || 0)} style={{ width: '90px' }} />
                                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                                    <input className="form-input" type="number" placeholder="Max" value={maxPrice < 2000 ? maxPrice : ''} onChange={(e) => setMaxPrice(Number(e.target.value) || 2000)} style={{ width: '90px' }} />
                                </div>
                            </div>

                            {/* Available Rooms */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Available Rooms</label>
                                <div style={{ display: 'flex', gap: '0.375rem' }}>
                                    {[0, 1, 2, 3].map((n) => (
                                        <button key={n} onClick={() => setMinRooms(n)}
                                            className={`btn ${minRooms === n ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                            style={{ fontSize: '0.75rem' }}>
                                            {n === 0 ? 'Any' : `${n}+`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bills */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Bills</label>
                                <div style={{ display: 'flex', gap: '0.375rem' }}>
                                    {([null, true, false] as (boolean | null)[]).map((val) => (
                                        <button key={String(val)} onClick={() => setBillsIncluded(val)}
                                            className={`btn ${billsIncluded === val ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                            style={{ fontSize: '0.75rem' }}>
                                            {val === null ? 'Any' : val ? 'Included' : 'Separate'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Min Rating */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label">Minimum Rating</label>
                                <div style={{ display: 'flex', gap: '0.375rem' }}>
                                    {[0, 3, 4, 4.5].map((r) => (
                                        <button key={r} onClick={() => setMinRating(r)}
                                            className={`btn ${minRating === r ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                            style={{ fontSize: '0.75rem' }}>
                                            {r === 0 ? 'Any' : `${r}+ ★`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location Features */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <MapPin size={13} /> Location
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {locationFeatures.map((f) => {
                                        const Icon = f.icon;
                                        const active = selectedLocFeatures.includes(f.key);
                                        return (
                                            <button key={f.key} onClick={() => toggleLocFeature(f.key)}
                                                className={`btn ${active ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                                style={{ fontSize: '0.6875rem', gap: '0.25rem' }}>
                                                <Icon size={12} /> {f.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="form-label">Property Tags</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {allTags.map((tag) => {
                                        const active = selectedTags.includes(tag);
                                        return (
                                            <button key={tag} onClick={() => toggleTag(tag)}
                                                className={`btn ${active ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                                style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem' }}>
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    <div>
                        {/* Map View */}
                        {showMap && (
                            <div className="glass-card" style={{ padding: '0', marginBottom: '1.5rem', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
                                <div style={{ position: 'relative', paddingBottom: '45%', background: 'rgba(255,255,255,0.03)' }}>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                                        <Map size={40} style={{ color: 'var(--text-muted)' }} />
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            Google Maps integration — Coming Soon
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {filtered.map((l) => l.location && (
                                                <div key={l.id} style={{
                                                    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)',
                                                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                                                    fontSize: '0.6875rem',
                                                }}>
                                                    <MapPin size={11} style={{ marginRight: '0.25rem' }} />
                                                    {l.address.split(',')[1]?.trim() || l.address.split(',')[0]}
                                                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.375rem' }}>
                                                        ({l.location.lat.toFixed(4)}, {l.location.lng.toFixed(4)})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Listing Cards */}
                        {filtered.length === 0 ? (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <h3>No Properties Found</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    Try adjusting your filters or search query.
                                </p>
                                <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filtered.map((listing) => {
                                    const landlord = getUserById(listing.landlord_id);
                                    const agent = listing.letting_agent_id ? getUserById(listing.letting_agent_id) : null;
                                    const roommates = getRoommatesForListing(listing.id);
                                    const loc = listing.location;

                                    return (
                                        <Link key={listing.id} to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div className="glass-card listing-card" style={{ overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '220px' }}>
                                                    {/* Image */}
                                                    <div style={{ position: 'relative' }}>
                                                        <img src={listing.images[0]} alt={listing.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.375rem' }}>
                                                            <span className="badge badge-green" style={{ backdropFilter: 'blur(8px)' }}>
                                                                {listing.available_rooms} room{listing.available_rooms > 1 ? 's' : ''} available
                                                            </span>
                                                        </div>
                                                        {listing.rating && (
                                                            <div style={{
                                                                position: 'absolute', bottom: '12px', left: '12px',
                                                                padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)',
                                                                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                                                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                                fontSize: '0.75rem', fontWeight: 700,
                                                            }}>
                                                                <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                                                {listing.rating} ({listing.total_reviews})
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                                                            <h3 style={{ fontSize: '1.0625rem', margin: 0 }}>{listing.title}</h3>
                                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--brand-purple-light)' }}>
                                                                    {formatCurrency(listing.rent_per_room)}
                                                                </div>
                                                                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>per room / month</div>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                            <MapPin size={13} /> {listing.address}
                                                        </div>

                                                        {/* Transport info */}
                                                        {loc && (
                                                            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                                {loc.nearest_tube && (
                                                                    <span style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                                                        <Train size={11} style={{ color: '#ef4444' }} />
                                                                        {loc.nearest_tube.name} ({loc.nearest_tube.line}) — {loc.nearest_tube.walk_mins} min walk
                                                                    </span>
                                                                )}
                                                                {loc.nearest_bus && (
                                                                    <span style={{ fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                                                        <Bus size={11} style={{ color: '#3b82f6' }} />
                                                                        Bus {loc.nearest_bus.routes.slice(0, 3).join(', ')} — {loc.nearest_bus.walk_mins} min
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Tags + amenities */}
                                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                                            {listing.bills_included && <span className="badge badge-green" style={{ fontSize: '0.5625rem' }}>Bills Included</span>}
                                                            {listing.tags.slice(0, 4).map((t) => (
                                                                <span key={t} className="badge badge-purple" style={{ fontSize: '0.5625rem' }}>{t}</span>
                                                            ))}
                                                        </div>

                                                        {/* Footer: Roommates + Agent/Landlord */}
                                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            {/* Roommates */}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    {roommates.slice(0, 3).map((rm, i) => (
                                                                        <div key={rm.id} className="avatar avatar-xs"
                                                                            style={{ marginLeft: i > 0 ? '-6px' : 0, fontSize: '0.5rem', width: '24px', height: '24px', border: '2px solid var(--surface-card)', position: 'relative', zIndex: 3 - i }}>
                                                                            {getInitials(rm.name)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                                    {roommates.length} roommate{roommates.length !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>

                                                            {/* Agent or Landlord */}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                                {agent ? (
                                                                    <>
                                                                        <span className="badge badge-orange" style={{ fontSize: '0.5625rem' }}>Agent</span>
                                                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{agent.name}</span>
                                                                    </>
                                                                ) : landlord ? (
                                                                    <>
                                                                        <span className="badge badge-blue" style={{ fontSize: '0.5625rem' }}>Landlord</span>
                                                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{landlord.name}</span>
                                                                    </>
                                                                ) : null}
                                                                {(agent || landlord) && (
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', fontSize: '0.625rem', color: '#fbbf24' }}>
                                                                        <Star size={10} fill="#fbbf24" />
                                                                        {(agent || landlord)!.rating}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
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
            </div>
        </div>
    );
}
