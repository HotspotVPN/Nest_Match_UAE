import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { listings, users, formatCurrency, getInitials } from '@/data/mockData';
import type { Listing } from '@/types';
import {
    Building2, Plus, Eye, Users as UsersIcon, CalendarCheck,
    MapPin, Tag, Clock, Rocket, Edit2, ShieldCheck,
} from 'lucide-react';

type Tab = 'active' | 'coming_soon' | 'all';

export default function MyPropertiesPage() {
    const { currentUser, isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('active');

    if (!isAuthenticated || !currentUser) return <Navigate to="/login" />;
    if (currentUser.type !== 'landlord' && currentUser.type !== 'letting_agent') {
        return <Navigate to="/browse" />;
    }

    // Get properties owned/managed by this user
    const myProperties = useMemo(() => {
        return listings.filter(l => {
            if (currentUser.type === 'landlord') return l.landlord_id === currentUser.id;
            if (currentUser.type === 'letting_agent') return l.letting_agent_id === currentUser.id;
            return false;
        });
    }, [currentUser]);

    const activeListings = myProperties.filter(l => l.listing_status === 'active' || (!l.listing_status && l.isActive));
    const comingSoonListings = myProperties.filter(l => l.listing_status === 'coming_soon');

    const displayedListings = activeTab === 'active' ? activeListings
        : activeTab === 'coming_soon' ? comingSoonListings
        : myProperties;

    // Summary stats
    const totalProperties = activeListings.length + comingSoonListings.length;
    const totalRooms = myProperties.reduce((sum, l) => sum + l.total_rooms, 0);
    const occupiedRooms = myProperties.reduce((sum, l) => sum + l.currentOccupants, 0);
    const availableRooms = myProperties.reduce((sum, l) => sum + l.available_rooms, 0);

    const getOccupancyColor = (listing: Listing) => {
        const pct = (listing.currentOccupants / listing.maxLegalOccupancy) * 100;
        if (pct >= 100) return '#ef4444';
        if (pct >= 70) return '#f59e0b';
        return '#22c55e';
    };

    const getOccupancyPercent = (listing: Listing) => {
        return Math.min((listing.currentOccupants / listing.maxLegalOccupancy) * 100, 100);
    };

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>My Properties</h1>
                    <Link to="/add-property" className="btn btn-primary">
                        <Plus size={16} /> Add Property
                    </Link>
                </div>

                {/* Summary Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Properties', value: totalProperties, color: 'var(--brand-purple)' },
                        { label: 'Active Listings', value: activeListings.length, color: '#22c55e' },
                        { label: 'Coming Soon', value: comingSoonListings.length, color: '#f59e0b' },
                        { label: 'Total Rooms', value: totalRooms, color: 'var(--text-primary)' },
                        { label: 'Occupied Rooms', value: occupiedRooms, color: '#ef4444' },
                        { label: 'Available Rooms', value: availableRooms, color: '#22c55e' },
                    ].map(stat => (
                        <div key={stat.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                    {([
                        { key: 'active' as Tab, label: 'Active', count: activeListings.length },
                        { key: 'coming_soon' as Tab, label: 'Coming Soon', count: comingSoonListings.length },
                        { key: 'all' as Tab, label: 'All', count: myProperties.length },
                    ]).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600,
                                background: activeTab === tab.key ? 'rgba(124,58,237,0.15)' : 'transparent',
                                border: `1px solid ${activeTab === tab.key ? 'rgba(124,58,237,0.4)' : 'transparent'}`,
                                color: activeTab === tab.key ? 'var(--brand-purple-light)' : 'var(--text-secondary)',
                                cursor: 'pointer', transition: 'all 0.15s',
                            }}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Property Cards */}
                {displayedListings.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Building2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <h3 style={{ color: 'var(--text-secondary)' }}>No properties in this category</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {activeTab === 'coming_soon' ? 'You have no upcoming listings.' : 'Add your first property to get started.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {displayedListings.map(listing => {
                            const isComingSoon = listing.listing_status === 'coming_soon';
                            const slug = listing.slug || listing.id;

                            return (
                                <div key={listing.id} className="card" style={{ padding: '1.25rem' }}>
                                    {/* Title Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <Link to={`/listing/${slug}`} style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                                                    {listing.title}
                                                </Link>
                                                {isComingSoon && (
                                                    <span style={{
                                                        padding: '0.125rem 0.625rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700,
                                                        background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)',
                                                    }}>
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                                                <MapPin size={12} /> {listing.district} &middot; {listing.address}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--brand-purple-light)' }}>
                                            {formatCurrency(listing.rent_per_room)}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/room</span>
                                        </div>
                                    </div>

                                    {isComingSoon ? (
                                        /* Coming Soon card body */
                                        <>
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem', lineHeight: 1.5 }}>
                                                {listing.description}
                                            </p>
                                            {/* Tags */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                                                {listing.tags.map(tag => (
                                                    <span key={tag} style={{
                                                        padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600,
                                                        background: tag === 'coming-soon' ? 'rgba(245,158,11,0.15)' :
                                                            tag === 'premium' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
                                                        color: tag === 'coming-soon' ? '#f59e0b' :
                                                            tag === 'premium' ? 'var(--brand-purple-light)' : 'var(--text-secondary)',
                                                        border: `1px solid ${tag === 'coming-soon' ? 'rgba(245,158,11,0.3)' :
                                                            tag === 'premium' ? 'rgba(124,58,237,0.3)' : 'var(--border-subtle)'}`,
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            {/* Action buttons */}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    disabled
                                                    title="Coming soon — editing opens on launch date"
                                                    style={{ opacity: 0.5 }}
                                                >
                                                    <Edit2 size={14} /> Edit Listing
                                                </button>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => showToast('This property will be published to all verified tenants. Launch date feature coming soon.', 'info')}
                                                    style={{ background: 'var(--brand-purple)' }}
                                                >
                                                    <Rocket size={14} /> Launch & Advertise
                                                </button>
                                                <Link to={`/listing/${slug}`} className="btn btn-ghost btn-sm">
                                                    <Eye size={14} /> Preview
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        /* Active card body */
                                        <>
                                            {/* Occupancy bar */}
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        Occupancy: {listing.currentOccupants} / {listing.maxLegalOccupancy}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {listing.available_rooms} room{listing.available_rooms !== 1 ? 's' : ''} available
                                                    </span>
                                                </div>
                                                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%', borderRadius: '3px',
                                                        width: `${getOccupancyPercent(listing)}%`,
                                                        background: getOccupancyColor(listing),
                                                        transition: 'width 0.3s ease',
                                                    }} />
                                                </div>
                                            </div>

                                            {/* Makani */}
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                                                Makani: {listing.makaniNumber}
                                            </div>

                                            {/* Tags */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                                                {listing.tags.map(tag => (
                                                    <span key={tag} style={{
                                                        padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.6875rem',
                                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)',
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action buttons */}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <Link to={`/listing/${slug}`} className="btn btn-secondary btn-sm">
                                                    <Eye size={14} /> View Listing
                                                </Link>
                                                <Link to="/dashboard" className="btn btn-ghost btn-sm">
                                                    <UsersIcon size={14} /> Manage Occupancy
                                                </Link>
                                                <Link to="/viewings" className="btn btn-ghost btn-sm">
                                                    <CalendarCheck size={14} /> View Viewings
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
