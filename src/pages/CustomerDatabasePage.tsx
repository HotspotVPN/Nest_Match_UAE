import { useAuth } from '@/contexts/AuthContext';
import { users, listings, viewingBookings, payments, formatCurrency, getInitials, formatDate } from '@/data/mockData';
import { useState } from 'react';
import { Users as UsersIcon, Building2, Award, ShieldCheck, PieChart, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

type Tab = 'analytics' | 'roommates' | 'landlords' | 'agents' | 'properties';

export default function CustomerDatabasePage() {
    const { currentUser } = useAuth();
    const [tab, setTab] = useState<Tab>('analytics');
    const [properties, setProperties] = useState(listings);
    const [searchProperty, setSearchProperty] = useState('');
    const [auditToast, setAuditToast] = useState(false);

    if (!currentUser || currentUser.type !== 'operations') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Operations admin access only</h2></div>;
    }

    const roommates = users.filter(u => u.type === 'roommate');
    const landlords = users.filter(u => u.type === 'landlord');
    const agents = users.filter(u => u.type === 'letting_agent');

    const tabs: { key: Tab; label: string; count?: number; icon?: React.ReactNode }[] = [
        { key: 'analytics', label: 'Platform Analytics', icon: <PieChart size={16} style={{ marginRight: '6px' }} /> },
        { key: 'roommates', label: 'Roommates', count: roommates.length },
        { key: 'landlords', label: 'Landlords', count: landlords.length },
        { key: 'agents', label: 'Agents', count: agents.length },
        { key: 'properties', label: 'Properties', count: listings.length },
    ];

    // ── Analytics Calculations ──
    const totalMaxOccupancy = listings.reduce((sum, l) => sum + (l.maxLegalOccupancy || 0), 0);
    const totalCurrentOccupants = listings.reduce((sum, l) => sum + (l.currentOccupants || 0), 0);
    const totalVacancy = totalMaxOccupancy - totalCurrentOccupants;
    const propertiesWithOpenings = listings.filter(l => (l.currentOccupants || 0) < (l.maxLegalOccupancy || 0)).length;
    
    const residingUsers = roommates.filter(u => u.resident_role === 'residing').length;
    const searchingUsers = roommates.filter(u => u.resident_role === 'searching').length;
    
    const activeViewings = viewingBookings.filter(v => ['CONFIRMED', 'PENDING', 'PENDING_LANDLORD_APPROVAL'].includes(v.status)).length;
    const penaltyBookings = viewingBookings.filter(v => ['TENANT_NO_SHOW_PENALTY', 'LANDLORD_NO_SHOW_PENALTY'].includes(v.status)).length;
    const penaltyRevenue = payments.filter(p => p.type === 'penalty_capture' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

    const supplyDemandRatio = Math.min(100, (searchingUsers / (totalVacancy || 1)) * 100);

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Customer Database (CRM)</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Operations overview — users, properties, and platform metrics</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ flex: 1, whiteSpace: 'nowrap' }}>
                            {t.icon}{t.label} {t.count !== undefined && `(${t.count})`}
                        </button>
                    ))}
                </div>

                {/* Analytics UI */}
                {tab === 'analytics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* KPI Cards Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <Building2 size={18} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Total Vacancy</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{totalVacancy}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Across {propertiesWithOpenings} properties</div>
                            </div>
                            
                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <UsersIcon size={18} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>User Liquidity</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{searchingUsers} <span style={{fontSize:'1rem', color:'var(--text-muted)', fontWeight: 400}}>vs</span> {residingUsers}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Searching vs Residing verified users</div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <Activity size={18} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Active Viewings</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>{activeViewings}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Upcoming or pending requests</div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'linear-gradient(135deg, rgba(244,63,94,0.05), rgba(244,63,94,0.01))', borderColor: 'rgba(244,63,94,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
                                    <AlertTriangle size={18} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Penalty Revenue</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--error)' }}>{formatCurrency(penaltyRevenue)}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>From {penaltyBookings} no-show penalties captured</div>
                            </div>
                        </div>

                        {/* Supply/Demand Ratio Visual */}
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <TrendingUp size={20} color="var(--primary)" />
                                <h3 style={{ margin: 0 }}>Supply / Demand Liquidity</h3>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 600 }}>
                                <div style={{ color: 'var(--primary)' }}>{searchingUsers} Searching Users (Demand)</div>
                                <div style={{ color: 'var(--text-muted)' }}>{totalVacancy} Vacant Beds (Supply)</div>
                            </div>
                            
                            <div style={{ width: '100%', height: '16px', background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ width: `${supplyDemandRatio}%`, background: 'var(--primary)', height: '100%', transition: 'width 1s ease' }} />
                                <div style={{ width: `${100 - supplyDemandRatio}%`, background: 'rgba(255,255,255,0.05)', height: '100%' }} />
                            </div>
                            
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {searchingUsers > totalVacancy 
                                    ? `High Demand: Currently ${searchingUsers - totalVacancy} more searching users than available legal bed spaces.` 
                                    : `Oversupply: Currently ${totalVacancy - searchingUsers} more available legal bed spaces than searching users.`}
                            </p>
                        </div>
                    </div>
                )}

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
                    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                        {auditToast && (
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem 1rem', background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid currentColor', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={14} /> Re-syncing with DLD Registry...
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
                            <input 
                                className="form-input" 
                                placeholder="Search by Makani Number or District..." 
                                value={searchProperty} 
                                onChange={e => setSearchProperty(e.target.value)} 
                                style={{ maxWidth: '400px' }}
                            />
                            <button onClick={() => {
                                setAuditToast(true);
                                setTimeout(() => setAuditToast(false), 3000);
                            }} className="btn btn-uaepass btn-sm">Force Audit</button>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Property</th><th>District</th><th>Makani</th><th>Occupancy</th><th>Rent/Room</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                <tbody>
                                    {properties.filter(l => l.makaniNumber.includes(searchProperty) || l.district.toLowerCase().includes(searchProperty.toLowerCase())).map(l => (
                                        <tr key={l.id}>
                                            <td style={{ fontWeight: 600 }}>{l.title}</td>
                                            <td>{l.district}</td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{l.makaniNumber}</td>
                                            <td>{l.currentOccupants}/{l.maxLegalOccupancy}</td>
                                            <td style={{ fontWeight: 700 }}>{formatCurrency(l.rent_per_room)}</td>
                                            <td><span className={`badge ${l.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.625rem' }}>{l.isActive ? 'Active' : 'Suspended'}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => {
                                                        setProperties(prev => prev.map(p => p.id === l.id ? { ...p, isActive: !p.isActive } : p));
                                                    }} 
                                                    className={`btn btn-sm btn-ghost`} 
                                                    style={{ color: l.isActive ? 'var(--error)' : 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', height: 'auto' }}
                                                >
                                                    {l.isActive ? 'Suspend Listing (Compliance Breach)' : 'Reactivate Listing'}
                                                </button>
                                            </td>
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
