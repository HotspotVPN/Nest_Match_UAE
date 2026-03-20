import { useAuth } from '@/contexts/AuthContext';
import { users, listings, getUserById, getInitials, formatDate } from '@/data/mockData';
import { useState } from 'react';
import {
    Users as UsersIcon, Building2, Award, ShieldCheck,
    Search, Home, UserCheck, UserX, Mail
} from 'lucide-react';
import type { User } from '@/types';

type Tab = 'landlords' | 'agents' | 'gold' | 'verified' | 'explorer' | 'properties';

function toPlatformId(user: User): string {
    switch (user.type) {
        case 'landlord': return 'LND-' + user.id.slice(-4).toUpperCase();
        case 'letting_agent': return 'AGT-' + user.id.slice(-4).toUpperCase();
        case 'roommate':
            if (user.verification_tier === 'tier2_uae_pass') return 'TNT-G-' + user.id.slice(-4).toUpperCase();
            if (user.verification_tier === 'tier0_passport') return 'TNT-V-' + user.id.slice(-4).toUpperCase();
            return 'TNT-E-' + user.id.slice(-4).toUpperCase();
        case 'compliance': return 'ADM-C-' + user.id.slice(-4).toUpperCase();
        case 'operations': return 'ADM-O-' + user.id.slice(-4).toUpperCase();
        default: return 'USR-' + user.id.slice(-4).toUpperCase();
    }
}

function tierDisplayLabel(tier: string): string {
    if (tier === 'tier2_uae_pass') return 'Gold';
    if (tier === 'tier0_passport') return 'Verified';
    if (tier === 'tier1_unverified') return 'Explorer';
    return tier;
}

export default function CustomerDatabasePage() {
    const { currentUser } = useAuth();
    const [tab, setTab] = useState<Tab>('landlords');
    const [search, setSearch] = useState('');

    if (!currentUser || (currentUser.type !== 'operations' && currentUser.type !== 'compliance')) {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Operations admin access only</h2></div>;
    }

    // ── Data slices ──
    const landlords = users.filter(u => u.type === 'landlord');
    const agents = users.filter(u => u.type === 'letting_agent');
    const goldTenants = users.filter(u => u.type === 'roommate' && u.verification_tier === 'tier2_uae_pass');
    const verifiedTenants = users.filter(u => u.type === 'roommate' && u.verification_tier === 'tier0_passport');
    const explorerUsers = users.filter(u => u.type === 'roommate' && u.verification_tier === 'tier1_unverified');

    // ── Search filter ──
    const matchesSearch = (u: User) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            (u.rera_license && u.rera_license.toLowerCase().includes(s)) ||
            (u.nationality && u.nationality.toLowerCase().includes(s))
        );
    };

    const matchesSearchListing = (l: typeof listings[0]) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            l.title.toLowerCase().includes(s) ||
            l.district.toLowerCase().includes(s) ||
            l.makaniNumber.includes(s) ||
            l.trakheesiPermit.toLowerCase().includes(s)
        );
    };

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'landlords', label: 'Landlords', count: landlords.length },
        { key: 'agents', label: 'RERA Agents', count: agents.length },
        { key: 'gold', label: 'Gold Tenants', count: goldTenants.length },
        { key: 'verified', label: 'Verified Tenants', count: verifiedTenants.length },
        { key: 'explorer', label: 'Explorer Users', count: explorerUsers.length },
        { key: 'properties', label: 'Properties', count: listings.length },
    ];

    const gccColor = (score: number) => {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return '#f59e0b';
        return 'var(--error)';
    };

    const occupancyPct = (current: number, max: number) => max > 0 ? Math.round((current / max) * 100) : 0;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Customer Database (CRM)</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Operations overview — users, properties, and platform metrics</p>

                {/* ── Stat Cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Home size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Total Landlords</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{landlords.length}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Award size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>RERA Agents</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{agents.length}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                            <ShieldCheck size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Gold Tenants</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{goldTenants.length}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <UserCheck size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Verified Tenants</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{verifiedTenants.length}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <UsersIcon size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Explorer Users</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{explorerUsers.length}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <Building2 size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Listed Properties</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{listings.length}</div>
                    </div>
                </div>

                {/* ── Global Search ── */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="form-input"
                        placeholder="Search by name, email, RERA licence, nationality..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ flex: 1, whiteSpace: 'nowrap' }}>
                            {t.label} ({t.count})
                        </button>
                    ))}
                </div>

                {/* ── TAB 1: Landlords ── */}
                {tab === 'landlords' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Platform ID</th><th>Name</th><th>Tier</th><th>UAE PASS</th><th>Properties Owned</th><th>Total Rooms</th><th>Occupied</th><th>KYC Status</th></tr></thead>
                                <tbody>
                                    {landlords.filter(matchesSearch).map(u => {
                                        const ownedListings = listings.filter(l => l.landlord_id === u.id);
                                        const totalRooms = ownedListings.reduce((s, l) => s + l.total_rooms, 0);
                                        const occupied = ownedListings.reduce((s, l) => s + l.currentOccupants, 0);
                                        return (
                                            <tr key={u.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{toPlatformId(u)}</td>
                                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                    </div>
                                                </td>
                                                <td><span className="badge badge-green" style={{ fontSize: '0.625rem' }}>{tierDisplayLabel(u.verification_tier)}</span></td>
                                                <td>{u.isUaePassVerified ? <ShieldCheck size={14} style={{ color: 'var(--success)' }} /> : <UserX size={14} style={{ color: 'var(--text-muted)' }} />}</td>
                                                <td>{ownedListings.length}</td>
                                                <td>{totalRooms}</td>
                                                <td>{occupied}</td>
                                                <td><span className={`badge ${u.compliance.kyc_status === 'completed' ? 'badge-green' : u.compliance.kyc_status === 'rejected' ? 'badge-red' : 'badge-blue'}`} style={{ fontSize: '0.625rem' }}>{u.compliance.kyc_status}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: RERA Agents ── */}
                {tab === 'agents' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Platform ID</th><th>Name</th><th>Agency</th><th>BRN</th><th>ORN</th><th>UAE PASS</th><th>Properties Managed</th><th>KYC</th></tr></thead>
                                <tbody>
                                    {agents.filter(matchesSearch).map(u => {
                                        const managedListings = listings.filter(l => l.letting_agent_id === u.id);
                                        return (
                                            <tr key={u.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{toPlatformId(u)}</td>
                                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: '0.8125rem' }}>{u.agency_name || '—'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{u.rera_license || '—'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>—</td>
                                                <td>{u.isUaePassVerified ? <ShieldCheck size={14} style={{ color: 'var(--success)' }} /> : <UserX size={14} style={{ color: 'var(--text-muted)' }} />}</td>
                                                <td>{managedListings.length}</td>
                                                <td><span className={`badge ${u.compliance.kyc_status === 'completed' ? 'badge-green' : u.compliance.kyc_status === 'rejected' ? 'badge-red' : 'badge-blue'}`} style={{ fontSize: '0.625rem' }}>{u.compliance.kyc_status}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 3: Gold Tenants ── */}
                {tab === 'gold' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Platform ID</th><th>Name</th><th>GCC Score</th><th>Role</th><th>Current Property</th><th>Tenancy Months</th><th>Premium</th></tr></thead>
                                <tbody>
                                    {goldTenants.filter(matchesSearch).map(u => {
                                        const currentProp = u.current_house_id ? listings.find(l => l.id === u.current_house_id) : null;
                                        return (
                                            <tr key={u.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{toPlatformId(u)}</td>
                                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                                                            <div style={{ width: `${u.gccScore}%`, height: '100%', background: gccColor(u.gccScore), borderRadius: '3px' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: gccColor(u.gccScore) }}>{u.gccScore}</span>
                                                    </div>
                                                </td>
                                                <td><span className={`badge ${u.resident_role === 'residing' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.625rem' }}>{u.resident_role || 'N/A'}</span></td>
                                                <td style={{ fontSize: '0.8125rem' }}>{currentProp ? currentProp.title : '—'}</td>
                                                <td style={{ fontSize: '0.8125rem' }}>{u.tenancy_duration_months ?? '—'}</td>
                                                <td>{u.isPremium ? <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Premium</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>—</span>}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 4: Verified Tenants ── */}
                {tab === 'verified' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Platform ID</th><th>Name</th><th>Nationality</th><th>Passport</th><th>Visa Type</th><th>KYC Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {verifiedTenants.filter(matchesSearch).map(u => {
                                        const maskedPassport = u.passport_number ? u.passport_number.slice(0, 2) + '****' : '—';
                                        return (
                                            <tr key={u.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{toPlatformId(u)}</td>
                                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: '0.8125rem' }}>{u.nationality || '—'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{maskedPassport}</td>
                                                <td style={{ fontSize: '0.8125rem' }}>{u.visa_type || '—'}</td>
                                                <td><span className={`badge ${u.compliance.kyc_status === 'completed' ? 'badge-green' : u.compliance.kyc_status === 'rejected' ? 'badge-red' : 'badge-blue'}`} style={{ fontSize: '0.625rem' }}>{u.compliance.kyc_status}</span></td>
                                                <td>
                                                    {u.compliance.kyc_status === 'pending' ? (
                                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }}>Approve</button>
                                                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }}>Reject</button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 5: Explorer Users ── */}
                {tab === 'explorer' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Platform ID</th><th>Name</th><th>Email</th><th>Sign-up Date</th><th>Action</th></tr></thead>
                                <tbody>
                                    {explorerUsers.filter(matchesSearch).map(u => (
                                        <tr key={u.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{toPlatformId(u)}</td>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                <span style={{ fontWeight: 600 }}>{u.name}</span>
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>{u.email}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>{formatDate(u.created_at)}</td>
                                            <td>
                                                <button className="btn btn-sm btn-ghost" style={{ color: 'var(--brand-purple-light)', fontSize: '0.75rem', padding: '0.25rem 0.75rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Mail size={12} /> Prompt to Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── TAB 6: Properties ── */}
                {tab === 'properties' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Property ID</th><th>Title</th><th>District</th><th>Owner</th><th>Agent + BRN</th><th>Makani</th><th>Trakheesi</th><th>Max Occ</th><th>Current Occ</th><th>Status</th></tr></thead>
                                <tbody>
                                    {listings.filter(matchesSearchListing).map(l => {
                                        const owner = getUserById(l.landlord_id);
                                        const agent = l.letting_agent_id ? getUserById(l.letting_agent_id) : null;
                                        const pct = occupancyPct(l.currentOccupants, l.maxLegalOccupancy);
                                        return (
                                            <tr key={l.id}>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{l.id.slice(0, 12)}</td>
                                                <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{l.title}</td>
                                                <td style={{ fontSize: '0.8125rem' }}>{l.district}</td>
                                                <td style={{ fontSize: '0.8125rem' }}>{owner?.name || '—'}</td>
                                                <td style={{ fontSize: '0.8125rem' }}>{agent ? `${agent.name} (${agent.rera_license || '—'})` : '—'}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{l.makaniNumber}</td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{l.trakheesiPermit}</td>
                                                <td>{l.maxLegalOccupancy}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                                                            <div style={{ width: `${pct}%`, height: '100%', background: pct >= 90 ? 'var(--error)' : pct >= 70 ? '#f59e0b' : 'var(--success)', borderRadius: '3px' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.8125rem' }}>{l.currentOccupants}/{l.maxLegalOccupancy}</span>
                                                    </div>
                                                </td>
                                                <td><span className={`badge ${l.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.625rem' }}>{l.isActive ? 'Active' : 'Suspended'}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
