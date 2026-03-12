import { useAuth } from '@/contexts/AuthContext';
import { users, listings, formatCurrency, getInitials, formatDate } from '@/data/mockData';
import { useState } from 'react';
import { Users as UsersIcon, Building2, Award, ShieldCheck } from 'lucide-react';

type Tab = 'roommates' | 'landlords' | 'agents' | 'properties';

export default function CustomerDatabasePage() {
    const { currentUser } = useAuth();
    const [tab, setTab] = useState<Tab>('roommates');

    if (!currentUser || currentUser.type !== 'operations') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Operations admin access only</h2></div>;
    }

    const roommates = users.filter(u => u.type === 'roommate');
    const landlords = users.filter(u => u.type === 'landlord');
    const agents = users.filter(u => u.type === 'letting_agent');

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'roommates', label: 'Roommates', count: roommates.length },
        { key: 'landlords', label: 'Landlords', count: landlords.length },
        { key: 'agents', label: 'Agents', count: agents.length },
        { key: 'properties', label: 'Properties', count: listings.length },
    ];

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Customer Database (CRM)</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Operations overview — users, properties, and platform metrics</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ flex: 1 }}>
                            {t.label} ({t.count})
                        </button>
                    ))}
                </div>

                {/* Roommates Table */}
                {tab === 'roommates' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Name</th><th>Role</th><th>GCC</th><th>Status</th><th>Phone</th><th>Joined</th></tr></thead>
                                <tbody>
                                    {roommates.map(u => (
                                        <tr key={u.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                                </div>
                                            </td>
                                            <td><span className={`badge ${u.resident_role === 'residing' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.625rem' }}>{u.resident_role || 'N/A'}</span></td>
                                            <td>
                                                {u.gccScore >= 80 ? <span className="gcc-badge" style={{ fontSize: '0.5625rem', padding: '0.125rem 0.5rem' }}><Award size={10} /> {u.gccScore}</span> : <span style={{ fontSize: '0.8125rem' }}>{u.gccScore}</span>}
                                            </td>
                                            <td><span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> Verified</span></td>
                                            <td style={{ fontSize: '0.8125rem' }}>{u.phone}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>{formatDate(u.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Landlords / Agents Tables */}
                {(tab === 'landlords' || tab === 'agents') && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Name</th><th>Properties</th><th>Rating</th><th>Status</th><th>Phone</th></tr></thead>
                                <tbody>
                                    {(tab === 'landlords' ? landlords : agents).map(u => (
                                        <tr key={u.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div className="avatar avatar-sm">{getInitials(u.name)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{u.agency_name || u.email}</div>
                                                </div>
                                            </td>
                                            <td>{listings.filter(l => l.landlord_id === u.id || l.letting_agent_id === u.id).length}</td>
                                            <td style={{ color: '#f59e0b' }}>{u.rating ? `★ ${u.rating}` : '—'}</td>
                                            <td><span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> Verified</span></td>
                                            <td style={{ fontSize: '0.8125rem' }}>{u.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Properties Table */}
                {tab === 'properties' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Property</th><th>District</th><th>Makani</th><th>Occupancy</th><th>Rent/Room</th><th>Status</th></tr></thead>
                                <tbody>
                                    {listings.map(l => (
                                        <tr key={l.id}>
                                            <td style={{ fontWeight: 600 }}>{l.title}</td>
                                            <td>{l.district}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{l.makaniNumber}</td>
                                            <td>{l.currentOccupants}/{l.maxLegalOccupancy}</td>
                                            <td style={{ fontWeight: 700 }}>{formatCurrency(l.rent_per_room)}</td>
                                            <td><span className={`badge ${l.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.625rem' }}>{l.isActive ? 'Active' : 'At Capacity'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
