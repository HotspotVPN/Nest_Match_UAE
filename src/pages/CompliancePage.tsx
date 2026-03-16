import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { users, formatDate } from '@/data/mockData';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { getTierLabel, getTierColor } from '@/utils/accessControl';

type TabId = 'verification' | 'passport_kyc';

export default function CompliancePage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('verification');

    if (!currentUser || currentUser.type !== 'compliance') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Compliance admin access only</h2></div>;
    }

    const allUsers = users.filter(u => !['compliance', 'finance', 'operations'].includes(u.type));
    const verified = allUsers.filter(u => u.compliance.verified);
    const pending = allUsers.filter(u => !u.compliance.verified);
    const tier0Users = allUsers.filter(u => u.verification_tier === 'tier0_passport');

    const tabs: { id: TabId; label: string; count?: number }[] = [
        { id: 'verification', label: 'Identity Verification' },
        { id: 'passport_kyc', label: 'Passport KYC', count: tier0Users.filter(u => u.kyc_documents?.some(d => d.review_status === 'pending')).length },
    ];

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Compliance Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>UAE PASS verification, passport KYC & CBUAE regulatory oversight</p>

                <div className="grid-3" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Users', value: allUsers.length, color: 'var(--text-primary)' },
                        { label: 'UAE PASS Verified', value: verified.length, color: 'var(--success)' },
                        { label: 'Pending Review', value: pending.length, color: 'var(--warning)' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-card-label">{s.label}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid var(--brand-purple-light)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span style={{
                                    background: 'var(--warning)',
                                    color: '#000',
                                    fontSize: '0.625rem',
                                    fontWeight: 800,
                                    padding: '0.125rem 0.375rem',
                                    borderRadius: 'var(--radius-full)',
                                }}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Identity Verification ─────────────── */}
                {activeTab === 'verification' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}><ShieldCheck size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--uaepass-green-light)' }} /> User Verification Status</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr><th>User</th><th>Type</th><th>Tier</th><th>UAE PASS</th><th>KYC</th><th>AML</th><th>PEP</th><th>Verified Date</th></tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => (
                                        <tr key={u.id}>
                                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                                            <td><span className={`badge ${u.type === 'landlord' ? 'badge-blue' : u.type === 'letting_agent' ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize: '0.625rem' }}>{u.type.replace('_', ' ')}</span></td>
                                            <td>
                                                <span style={{
                                                    fontSize: '0.5625rem',
                                                    fontWeight: 700,
                                                    padding: '0.125rem 0.375rem',
                                                    borderRadius: 'var(--radius-full)',
                                                    color: getTierColor(u.verification_tier),
                                                    background: u.verification_tier === 'tier2_uae_pass' ? 'rgba(20,184,166,0.1)' : u.verification_tier === 'tier0_passport' ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.1)',
                                                }}>
                                                    {getTierLabel(u.verification_tier)}
                                                </span>
                                            </td>
                                            <td>{u.uaePassId ? <span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> Verified</span> : <span className="badge badge-red" style={{ fontSize: '0.5625rem' }}>Missing</span>}</td>
                                            <td>{u.compliance.kyc_status === 'completed' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}</td>
                                            <td>{u.compliance.aml_status === 'completed' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <XCircle size={16} style={{ color: 'var(--error)' }} />}</td>
                                            <td>{u.compliance.pep_status === 'clear' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>{u.compliance.kyc_completed_date ? formatDate(u.compliance.kyc_completed_date) : '\u2014'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Tab: Passport KYC ──────────────────────── */}
                {activeTab === 'passport_kyc' && (
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} style={{ color: '#f59e0b' }} /> Passport KYC — Tier 0 Users
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            New arrivals who uploaded passport + visa page for manual review.
                        </p>

                        {tier0Users.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No Tier 0 users pending review.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {tier0Users.map(u => (
                                    <div key={u.id} style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{u.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {u.nationality && `${u.nationality} · `}
                                                    {u.passport_number && `Passport: ${u.passport_number} · `}
                                                    {u.visa_type && `${u.visa_type} visa`}
                                                </div>
                                            </div>
                                            <span style={{
                                                fontSize: '0.5625rem',
                                                fontWeight: 700,
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'rgba(245,158,11,0.12)',
                                                color: '#f59e0b',
                                                border: '1px solid rgba(245,158,11,0.3)',
                                                textTransform: 'uppercase',
                                            }}>Tier 0</span>
                                        </div>

                                        {/* Documents */}
                                        {u.kyc_documents && u.kyc_documents.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                {u.kyc_documents.map(doc => (
                                                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <FileText size={14} style={{ color: 'var(--text-muted)' }} />
                                                            <span style={{ fontSize: '0.8125rem', textTransform: 'capitalize' }}>{doc.doc_type.replace('_', ' ')}</span>
                                                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Uploaded {doc.uploaded_at}</span>
                                                        </div>
                                                        <span className={`badge ${doc.review_status === 'approved' ? 'badge-green' : doc.review_status === 'rejected' ? 'badge-red' : 'badge-orange'}`} style={{ fontSize: '0.5625rem' }}>
                                                            {doc.review_status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>No documents uploaded yet.</p>
                                        )}

                                        {/* Action buttons */}
                                        {u.kyc_documents?.some(d => d.review_status === 'pending') && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-sm" style={{ flex: 1, background: 'var(--success)', color: '#fff', border: 'none' }}>
                                                    <CheckCircle2 size={14} /> Approve
                                                </button>
                                                <button className="btn btn-sm" style={{ flex: 1, background: 'var(--error)', color: '#fff', border: 'none' }}>
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
