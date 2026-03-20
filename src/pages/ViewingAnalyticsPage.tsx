import { useAuth } from '@/contexts/AuthContext';
import { viewingBookings, listings, users, formatDate } from '@/data/mockData';
import { BarChart2, TrendingUp, CheckCircle2, MapPin, Download, ShieldCheck, Building2, Users } from 'lucide-react';
import type { ViewingStatus } from '@/types';

const STATUS_COLORS: Record<ViewingStatus, string> = {
    PENDING: '#f59e0b',
    PENDING_LANDLORD_APPROVAL: '#3b82f6',
    CONFIRMED: '#22c55e',
    AGREEMENT_SENT: '#a78bfa',
    AGENT_SIGNED: '#8b5cf6',
    FULLY_SIGNED: '#7c3aed',
    COMPLETED: '#14b8a6',
    NO_SHOW_TENANT: '#ef4444',
    NO_SHOW_LANDLORD: '#f97316',
    CANCELLED: '#6b7280',
};

const STATUS_LABELS: Record<ViewingStatus, string> = {
    PENDING: 'Pending',
    PENDING_LANDLORD_APPROVAL: 'Awaiting Landlord',
    CONFIRMED: 'Confirmed',
    AGREEMENT_SENT: 'Agreement Sent',
    AGENT_SIGNED: 'Agent Signed',
    FULLY_SIGNED: 'Fully Signed',
    COMPLETED: 'Completed',
    NO_SHOW_TENANT: 'No-Show (Tenant)',
    NO_SHOW_LANDLORD: 'No-Show (Landlord)',
    CANCELLED: 'Cancelled',
};

export default function ViewingAnalyticsPage() {
    const { currentUser } = useAuth();

    if (!currentUser || !['operations', 'compliance'].includes(currentUser.type)) {
        return (
            <div className="section" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <ShieldCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h2>Access Restricted</h2>
                <p style={{ color: 'var(--text-muted)' }}>This page is available to operations and compliance admin users only.</p>
            </div>
        );
    }

    const total = viewingBookings.length;
    const agreementsSigned = viewingBookings.filter(v => v.agreement && (v.agreement.status === 'fully_signed' || v.agreement.status === 'agent_signed')).length;
    const completed = viewingBookings.filter(v => v.status === 'COMPLETED').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // District stats
    const districtCounts: Record<string, number> = {};
    viewingBookings.forEach(v => {
        const listing = listings.find(l => l.id === v.property_id);
        if (listing) {
            districtCounts[listing.district] = (districtCounts[listing.district] || 0) + 1;
        }
    });
    const sortedDistricts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1]);
    const topDistrict = sortedDistricts[0]?.[0] || 'N/A';
    const maxDistrictCount = sortedDistricts[0]?.[1] || 1;

    // Status distribution
    const statusCounts: Partial<Record<ViewingStatus, number>> = {};
    viewingBookings.forEach(v => {
        statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
    });

    // Agreement log
    const agreementViewings = viewingBookings.filter(v => v.agreement);

    const handleExportCsv = () => {
        alert('CSV export would be generated here. In production, this would download a file with all viewing agreement data for DLD compliance reporting.');
    };

    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BarChart2 size={24} style={{ color: 'var(--brand-purple)' }} />
                        Viewing Analytics
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        DLD compliance dashboard for viewing agreements and outcomes
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Viewings', value: total, icon: <TrendingUp size={18} />, color: 'var(--text-primary)' },
                        { label: 'DLD Agreements Signed', value: agreementsSigned, icon: <CheckCircle2 size={18} />, color: 'var(--success)' },
                        { label: 'Completion Rate', value: `${completionRate}%`, icon: <BarChart2 size={18} />, color: 'var(--brand-purple)' },
                        { label: 'Top District', value: topDistrict, icon: <MapPin size={18} />, color: 'var(--warning)' },
                    ].map(s => (
                        <div key={s.label} className="stat-card" style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: s.color, opacity: 0.5 }}>{s.icon}</div>
                            <div className="stat-card-label">{s.label}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Status Distribution */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Status Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(Object.entries(statusCounts) as [ViewingStatus, number][]).map(([status, count]) => (
                            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '130px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {STATUS_LABELS[status]}
                                </div>
                                <div style={{ flex: 1, height: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(count / total) * 100}%`, height: '100%', background: STATUS_COLORS[status], borderRadius: '4px', transition: 'width 0.5s' }} />
                                </div>
                                <div style={{ width: '30px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demand by District */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Demand by District</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {sortedDistricts.map(([district, count]) => (
                            <div key={district} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '130px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {district}
                                </div>
                                <div style={{ flex: 1, height: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(count / maxDistrictCount) * 100}%`, height: '100%', background: 'var(--brand-purple)', borderRadius: '4px', transition: 'width 0.5s' }} />
                                </div>
                                <div style={{ width: '30px', fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agreement Log Table */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Agreement Log</h3>
                        <button onClick={handleExportCsv} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                            <Download size={14} /> Export CSV
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                    {['Agreement No', 'Property', 'District', 'Tenant', 'Agent', 'Date', 'Status', 'Outcome'].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {agreementViewings.length === 0 ? (
                                    <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No agreements yet</td></tr>
                                ) : (
                                    agreementViewings.map(v => {
                                        const listing = listings.find(l => l.id === v.property_id);
                                        const tenantUser = users.find(u => u.id === v.searcher_id);
                                        const agentUser = users.find(u => u.id === v.landlord_id);
                                        const a = v.agreement!;
                                        return (
                                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{a.agreement_number}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{listing?.title || '-'}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{listing?.district || '-'}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{tenantUser?.name || '-'}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{agentUser?.name || '-'}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>{formatDate(a.generated_at)}</td>
                                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 700,
                                                        background: a.status === 'fully_signed' ? 'rgba(34,197,94,0.15)' : a.status === 'agent_signed' ? 'rgba(139,92,246,0.15)' : 'rgba(245,158,11,0.15)',
                                                        color: a.status === 'fully_signed' ? 'var(--success)' : a.status === 'agent_signed' ? '#8b5cf6' : 'var(--warning)',
                                                    }}>
                                                        {a.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{a.outcome || '--'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Government Data Section */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} style={{ color: 'var(--brand-purple)' }} />
                        Government Data Insights
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>DLD Demand Signals</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                                Viewing request volumes are aggregated and anonymised for Dubai Land Department demand forecasting models. High-demand districts trigger permit review acceleration.
                            </p>
                        </div>
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Agent Performance Registry</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                                Viewing completion rates, no-show records, and agreement turnaround times are reported to RERA for broker quality scoring and license renewal assessments.
                            </p>
                        </div>
                        <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Supply-Demand Gap</div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                                District-level demand vs available inventory data feeds into Dubai Municipality shared housing permit allocation and urban planning models.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                        All viewing and agreement data is maintained in an immutable audit trail in accordance with UAE Federal Decree-Law No. 45 of 2021 (Personal Data Protection) and Dubai Law No. 4 of 2026 (Shared Housing Regulation). Data is retained for 7 years per DLD requirements.
                    </p>
                </div>
            </div>
        </div>
    );
}
