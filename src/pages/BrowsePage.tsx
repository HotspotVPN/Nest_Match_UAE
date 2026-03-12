import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listings, formatCurrency, users, getInitials } from '@/data/mockData';
import { Search, MapPin, Train, ShieldCheck, Users as UsersIcon, Award } from 'lucide-react';

const DISTRICTS = ['All', 'Dubai Marina', 'JLT', 'Downtown Dubai', 'Business Bay', 'JBR', 'Al Barsha'];

export default function BrowsePage() {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [budgetMax, setBudgetMax] = useState(10000);

    // COMPLIANCE FILTER: Only show properties where currentOccupants < maxLegalOccupancy
    const filteredListings = listings.filter(l => {
        if (l.currentOccupants >= l.maxLegalOccupancy) return false; // STRICT: Hide at-capacity
        if (!l.isActive) return false;
        if (selectedDistrict !== 'All' && l.district !== selectedDistrict) return false;
        if (l.rent_per_room > budgetMax) return false;
        if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()) && !l.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2>Discover Verified Properties</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            100% legal, Municipality-permitted shared housing in Dubai
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-green"><ShieldCheck size={12} /> All Listings Verified</span>
                        <span className="badge badge-blue">Occupancy Capped</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
                        <div className="form-group" style={{ flex: '2', minWidth: '200px' }}>
                            <label className="form-label">Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="form-input" placeholder="Search by area, building..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: '36px' }} />
                            </div>
                        </div>
                        <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                            <label className="form-label">District</label>
                            <select className="form-input form-select" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: '1', minWidth: '150px' }}>
                            <label className="form-label">Max Budget: {formatCurrency(budgetMax)}/mo</label>
                            <input type="range" min={1000} max={10000} step={500} value={budgetMax} onChange={e => setBudgetMax(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand-purple)' }} />
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {filteredListings.length} verified {filteredListings.length === 1 ? 'property' : 'properties'} available
                </p>

                {/* Listing Grid */}
                <div className="grid-3">
                    {filteredListings.map(listing => {
                        const occupancyPercent = (listing.currentOccupants / listing.maxLegalOccupancy) * 100;
                        const occupancyClass = occupancyPercent >= 80 ? 'warning' : 'safe';

                        return (
                            <Link to={`/listing/${listing.id}`} key={listing.id} style={{ textDecoration: 'none' }}>
                                <div className="listing-card">
                                    {/* Image placeholder */}
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

                                        <h4 style={{ marginBottom: '0.375rem', fontSize: '1rem' }}>{listing.title}</h4>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
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
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                    <UsersIcon size={10} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                                                    Occupancy: {listing.currentOccupants}/{listing.maxLegalOccupancy}
                                                </span>
                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Legal max</span>
                                            </div>
                                            <div className="occupancy-bar">
                                                <div className={`occupancy-bar-fill ${occupancyClass}`} style={{ width: `${occupancyPercent}%` }} />
                                            </div>
                                        </div>

                                        {/* Transport */}
                                        {listing.transport_chips && listing.transport_chips.length > 0 && (
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                                {listing.transport_chips.slice(0, 2).map((chip, i) => (
                                                    <span key={i} className="tag" style={{ fontSize: '0.625rem' }}>
                                                        <Train size={10} style={{ color: chip.line_color || 'var(--text-muted)' }} />
                                                        {chip.label} · {chip.walk_time}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Current roommates */}
                                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                            {listing.current_roommates.slice(0, 3).map(rmId => {
                                                const rm = users.find(u => u.id === rmId);
                                                return rm ? (
                                                    <div key={rmId} className="avatar avatar-sm" title={rm.name} style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                                                        {getInitials(rm.name)}
                                                    </div>
                                                ) : null;
                                            })}
                                            {listing.rating && (
                                                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#f59e0b' }}>
                                                    ★ {listing.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredListings.length === 0 && (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3>No properties match your criteria</h3>
                        <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or expanding your budget range.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
