import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { FileText, Upload, AlertTriangle, CheckCircle2, XCircle, Loader2, Building2, Calendar, DollarSign } from 'lucide-react';

interface EjariDocument {
    id: string;
    ejari_number: string;
    contract_start_date: string;
    contract_end_date: string;
    annual_rent: number;
    landlord_name: string;
    tenant_name: string;
    ejari_status: string;
    uploaded_at: string;
    property_title?: string;
    property_district?: string;
    property_address?: string;
}

interface EjariStats {
    total_documents: number;
    active: number;
    expired: number;
    total_annual_rent: number;
    expiring_soon: number;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(amount: number | null | undefined): string {
    if (amount == null) return 'AED 0';
    return `AED ${amount.toLocaleString('en-AE')}`;
}

function daysUntil(dateStr: string): number {
    const end = new Date(dateStr);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EjariDocumentsPage() {
    const { currentUser } = useAuth();
    const [documents, setDocuments] = useState<EjariDocument[]>([]);
    const [counts, setCounts] = useState({ active: 0, expired: 0, cancelled: 0 });
    const [stats, setStats] = useState<EjariStats | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
    const [loading, setLoading] = useState(true);

    const isLandlordOrAgent = currentUser?.type === 'landlord' || currentUser?.type === 'letting_agent';

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        Promise.all([
            api.getEjariDocuments(undefined, currentUser.id),
            api.getEjariStats(currentUser.id),
        ]).then(([docData, statsData]) => {
            setDocuments(docData.documents);
            setCounts(docData.counts);
            setStats(statsData);
            setLoading(false);
        });
    }, [currentUser]);

    const filteredDocs = documents.filter(d => d.ejari_status === activeTab);

    if (!currentUser) return null;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={22} style={{ color: 'var(--brand-purple)' }} /> Ejari Documents
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: '0.25rem 0 0' }}>
                            {isLandlordOrAgent ? 'Your uploaded Ejari certificates' : 'Ejari certificates for your tenancies'}
                        </p>
                    </div>
                    {isLandlordOrAgent && (
                        <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Upload size={14} /> Upload Certificate
                        </button>
                    )}
                </div>

                {/* Stats Bar */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-purple)' }} />
                    </div>
                ) : (
                    <>
                        {stats && isLandlordOrAgent && (
                            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                                {[
                                    { label: 'Total', value: stats.total_documents || 0, color: 'var(--text-primary)' },
                                    { label: 'Active', value: stats.active || 0, color: 'var(--success)' },
                                    { label: 'Expiring Soon', value: stats.expiring_soon || 0, color: (stats.expiring_soon || 0) > 0 ? 'var(--warning)' : 'var(--text-muted)' },
                                    { label: 'Annual Rent', value: formatCurrency(stats.total_annual_rent), color: 'var(--brand-purple-light)' },
                                ].map(s => (
                                    <div key={s.label} className="stat-card">
                                        <div className="stat-card-label">{s.label}</div>
                                        <div className="stat-card-value" style={{ color: s.color, fontSize: typeof s.value === 'string' ? '1.125rem' : undefined }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            {[
                                { key: 'active' as const, label: 'Active', count: counts.active },
                                { key: 'expired' as const, label: 'Expired', count: counts.expired },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                                        padding: '0.625rem 1rem', fontSize: '0.8125rem', fontWeight: 600,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: activeTab === tab.key ? 'var(--brand-purple-light)' : 'var(--text-muted)',
                                        borderBottom: activeTab === tab.key ? '2px solid var(--brand-purple)' : '2px solid transparent',
                                        marginBottom: '-1px', transition: 'all 0.15s',
                                    }}
                                >
                                    {tab.label}
                                    <span style={{
                                        fontSize: '0.625rem', fontWeight: 700, padding: '0.0625rem 0.375rem',
                                        borderRadius: 'var(--radius-full)',
                                        background: tab.key === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                        color: tab.key === 'active' ? 'var(--success)' : '#ef4444',
                                    }}>{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Document Cards */}
                        {filteredDocs.length === 0 ? (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <FileText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                                <h3>No {activeTab} Ejari documents</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {activeTab === 'active' ? 'Upload your first Ejari certificate to get started.' : 'No expired certificates on file.'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {filteredDocs.map(doc => {
                                    const daysLeft = doc.contract_end_date ? daysUntil(doc.contract_end_date) : null;
                                    const isExpiringSoon = daysLeft !== null && daysLeft > 0 && daysLeft <= 90;
                                    const monthly = doc.annual_rent ? Math.round(doc.annual_rent / 12) : 0;

                                    return (
                                        <div key={doc.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                        <Building2 size={14} style={{ color: 'var(--brand-purple)' }} />
                                                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{doc.property_title || 'Property'}</span>
                                                        {doc.property_district && (
                                                            <span style={{
                                                                fontSize: '0.5625rem', fontWeight: 600, padding: '0.125rem 0.5rem',
                                                                borderRadius: 'var(--radius-full)', background: 'rgba(124,58,237,0.1)',
                                                                color: 'var(--brand-purple-light)', textTransform: 'uppercase',
                                                            }}>{doc.property_district}</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                        {doc.ejari_number}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    {doc.ejari_status === 'active' ? (
                                                        <span style={{
                                                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                            fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.5rem',
                                                            borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.12)',
                                                            color: 'var(--success)',
                                                        }}><CheckCircle2 size={10} /> Active</span>
                                                    ) : (
                                                        <span style={{
                                                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                            fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.5rem',
                                                            borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.12)',
                                                            color: '#ef4444',
                                                        }}><XCircle size={10} /> Expired</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Tenant</div>
                                                    <div style={{ fontWeight: 600 }}>{doc.tenant_name || '—'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Period</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                                                        {formatDate(doc.contract_start_date)} — {formatDate(doc.contract_end_date)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Rent</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <DollarSign size={12} style={{ color: 'var(--text-muted)' }} />
                                                        <span style={{ fontWeight: 600 }}>AED {monthly.toLocaleString('en-AE')}/mo</span>
                                                        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>({formatCurrency(doc.annual_rent)}/yr)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpiringSoon && (
                                                <div style={{
                                                    marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                                                    borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.08)',
                                                    border: '1px solid rgba(245,158,11,0.2)',
                                                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                                                    fontSize: '0.75rem', color: 'var(--warning)',
                                                }}>
                                                    <AlertTriangle size={12} />
                                                    Expires in {daysLeft} days — renew via Dubai REST app or typing centre
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Legal Disclaimer */}
                        <div style={{
                            marginTop: '2rem', padding: '1rem',
                            borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.6,
                        }}>
                            <strong>Disclaimer:</strong> NestMatch stores Ejari certificates uploaded by landlords for reference purposes only.
                            NestMatch does not draft, manage, verify, or file tenancy contracts or Ejari registrations.
                            Ejari registration is completed by landlords through the Dubai REST app or authorised typing centres.
                            All contract terms shown are as stated on the uploaded certificate.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
