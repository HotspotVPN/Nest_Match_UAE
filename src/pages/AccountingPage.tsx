import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    getPaymentsForUser, listings,
    getUserById, getListingById, getInitials, formatCurrency, formatDate,
} from '@/data/mockData';
import {
    TrendingUp, TrendingDown, CreditCard, ShieldCheck,
    ArrowUpRight, ArrowDownRight, Filter, Clock, AlertCircle,
    Building2, Landmark,
} from 'lucide-react';
import type { Payment } from '@/types';

type Tab = 'overview' | 'payments' | 'deposits' | 'compliance';

export default function AccountingPage() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    if (!currentUser) return null;

    const isLandlord = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';
    const userPayments = getPaymentsForUser(currentUser.id);

    // Stats
    const completedPayments = userPayments.filter((p) => p.status === 'completed');
    const rentPayments = completedPayments.filter((p) => p.type === 'rent');
    const depositPayments = completedPayments.filter((p) => p.type === 'deposit');
    const pendingPayments = userPayments.filter((p) => p.status === 'pending');

    const totalReceived = isLandlord
        ? rentPayments.reduce((sum, p) => sum + p.amount, 0)
        : 0;
    const totalPaid = !isLandlord
        ? rentPayments.reduce((sum, p) => sum + p.amount, 0)
        : 0;
    const totalDeposits = depositPayments.reduce((sum, p) => sum + p.amount, 0);

    const filteredPayments = userPayments.filter((p) => {
        if (typeFilter === 'all') return true;
        return p.type === typeFilter;
    });

    const tabs: { key: Tab, label: string }[] = [
        { key: 'overview', label: 'Financial Overview' },
        { key: 'payments', label: 'Transaction History' },
        { key: 'deposits', label: 'RERA Escrow' },
        { key: 'compliance', label: 'AML Compliance' },
    ];

    const complianceItems = [
        { label: 'UAE PASS Identity', status: currentUser.isUaePassVerified ? 'completed' : 'pending', date: '2024-01-15', desc: 'Identity verification via UAE PASS and Emirates ID.' },
        { label: 'AML Screening', status: 'completed', date: '2024-01-15', desc: 'Anti-money laundering screening via UAE Central Bank sanctions list.' },
        { label: 'Ejari Integration', status: 'completed', date: '2024-01-20', desc: 'Verified connection to DLD Ejari registration system.' },
    ];

    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: 800 }}>
                                    <Landmark size={28} className="text-purple-light" /> Real Estate Finance Portal
                                </h1>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Secure DLD-linked financial management for your Dubai residency.
                                </p>
                            </div>
                            <div className="badge badge-green" style={{ padding: '0.5rem 1rem' }}>
                                <ShieldCheck size={16} /> RERA PROTECTED
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-xl)', padding: '6px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                            {tabs.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`btn ${activeTab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                    style={{ flex: 1, whiteSpace: 'nowrap', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1.25rem' }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Overview Tab ──────────────────────────────── */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                                    {isLandlord ? (
                                        <>
                                            <div className="stat-card" style={{ background: 'var(--gradient-card)' }}>
                                                <div className="stat-label">Total Portfolio Income</div>
                                                <div className="stat-value gradient-text" style={{ fontSize: '1.75rem' }}>{formatCurrency(totalReceived)}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 700 }}>
                                                    <TrendingUp size={12} /> From {rentPayments.length} Ejari contracts
                                                </div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Projected Yield</div>
                                                <div className="stat-value" style={{ fontSize: '1.75rem' }}>7.2%</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Net Monthly: {formatCurrency(totalReceived / 12)}</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Deposits in Escrow</div>
                                                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{formatCurrency(totalDeposits)}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 700 }}>
                                                    <ShieldCheck size={12} /> DLD Verified Escrow
                                                </div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Active Arrears</div>
                                                <div className="stat-value" style={{ fontSize: '1.75rem', color: pendingPayments.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                                                    {pendingPayments.length}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Days overdue: 0</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="stat-card" style={{ background: 'var(--gradient-card)' }}>
                                                <div className="stat-label">Total Rent Paid</div>
                                                <div className="stat-value gradient-text" style={{ fontSize: '1.75rem' }}>{formatCurrency(totalPaid)}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 700 }}>
                                                    {rentPayments.length} monthly installments
                                                </div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Current Rent</div>
                                                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{formatCurrency(currentUser.rent_monthly || 0)}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Dubai Average: +2%</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Secured Deposit</div>
                                                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{formatCurrency(currentUser.deposit || 0)}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 700 }}>
                                                    <ShieldCheck size={12} /> Held in DLD Escrow
                                                </div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-label">Next Due Date</div>
                                                <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--brand-purple-light)' }}>
                                                    {pendingPayments.length > 0 ? formatDate(pendingPayments[0].due_date) : 'Cleared'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Auto-debit enabled</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Recent Transactions */}
                                <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>DLD-Verified Transactions</h4>
                                        <Link to="#" style={{ fontSize: '0.8125rem', color: 'var(--brand-purple-light)', fontWeight: 700, textDecoration: 'none' }}>Download Statement (PDF)</Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {userPayments.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No historical transactions found.</div>
                                        ) : (
                                            userPayments.slice(0, 8).map((p) => {
                                                const isIncoming = p.payee_id === currentUser.id;
                                                const otherUser = getUserById(isIncoming ? p.payer_id : p.payee_id);
                                                const listing = getListingById(p.listing_id);
                                                return (
                                                    <div key={p.id} style={{
                                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                                        padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
                                                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                                                        transition: 'transform 0.2s',
                                                    }}>
                                                        <div style={{
                                                            width: '42px', height: '42px', borderRadius: 'var(--radius-lg)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: isIncoming ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                            border: `1px solid ${isIncoming ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                                        }}>
                                                            {isIncoming ? <ArrowDownRight size={20} style={{ color: 'var(--success)' }} /> : <ArrowUpRight size={20} style={{ color: 'var(--error)' }} />}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontWeight: 800, fontSize: '0.9375rem', marginBottom: '0.125rem' }}>
                                                                {p.type.charAt(0).toUpperCase() + p.type.slice(1)} Payment
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                                {isIncoming ? 'From' : 'To'} {otherUser?.name || 'Vetted Portal User'} · {listing?.title?.split('—')[0] || 'Direct Unit'}
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                                                            <div style={{ fontWeight: 900, fontFamily: 'var(--font-display)', fontSize: '1.0625rem', color: isIncoming ? 'var(--success)' : 'var(--text-primary)' }}>
                                                                {isIncoming ? '+' : '−'}{formatCurrency(p.amount)}
                                                            </div>
                                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                                {p.paid_date ? formatDate(p.paid_date) : formatDate(p.due_date)}
                                                            </div>
                                                        </div>
                                                        <span className={`badge ${p.status === 'completed' ? 'badge-green' : p.status === 'pending' ? 'badge-orange' : 'badge-red'}`} style={{ fontSize: '0.625rem', padding: '0.3rem 0.6rem', fontWeight: 800 }}>
                                                            {p.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Payments Tab ─────────────────────────────── */}
                        {activeTab === 'payments' && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>Transaction History</h4>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                                        <select
                                            className="form-input form-select"
                                            style={{ width: 'auto', minWidth: '150px', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                        >
                                            <option value="all">All Transactions</option>
                                            <option value="rent">Rentals</option>
                                            <option value="deposit">Escrow Deposits</option>
                                            <option value="refund">Refunds & Rebates</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Ref Date</th>
                                                <th>Type</th>
                                                <th>Origin/Dest</th>
                                                <th>Unit Ref</th>
                                                <th>Amount (AED)</th>
                                                <th>Method</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPayments.map((p) => {
                                                const other = getUserById(isLandlord ? p.payer_id : p.payee_id);
                                                const listing = getListingById(p.listing_id);
                                                return (
                                                    <tr key={p.id}>
                                                        <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{p.paid_date ? formatDate(p.paid_date) : formatDate(p.due_date)}</td>
                                                        <td>
                                                            <span className={`badge ${p.type === 'rent' ? 'badge-blue' : p.type === 'deposit' ? 'badge-purple' : 'badge-green'}`} style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                                                                {p.type.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>
                                                                    {other ? getInitials(other.name) : '?'}
                                                                </div>
                                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{other?.name || 'DLD Portal User'}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{listing?.title?.split('—')[0] || '—'}</td>
                                                        <td style={{ fontWeight: 800 }}>{formatCurrency(p.amount)}</td>
                                                        <td style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>{p.method.replace('_', ' ')}</td>
                                                        <td>
                                                            <span className={`badge ${p.status === 'completed' ? 'badge-green' : p.status === 'pending' ? 'badge-orange' : 'badge-red'}`} style={{ fontSize: '0.625rem', fontWeight: 800 }}>
                                                                {p.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── Escrow Tab (Deposits) ────────────────── */}
                        {activeTab === 'deposits' && (
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <Building2 size={24} className="text-purple-light" />
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>RERA Escrow Accounts (Rental Protection)</h4>
                                </div>
                                <div style={{
                                    padding: '1.5rem', borderRadius: 'var(--radius-lg)',
                                    background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '2rem',
                                }}>
                                    <h5 style={{ color: 'var(--success)', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ShieldCheck size={18} /> Official UAE Rental Escrow Protection
                                    </h5>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                        All security deposits are processed through an official RERA escrow account. This ensures your funds are protected by law and only released upon joint verification by landlord and tenant at the end of the Ejari contract period.
                                    </p>
                                </div>

                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Participant</th>
                                                <th>Original Amount</th>
                                                <th>Deposit Date</th>
                                                <th>DLD Reference</th>
                                                <th>Escrow Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {depositPayments.map((p) => {
                                                const tenant = getUserById(p.payer_id);
                                                const listing = getListingById(p.listing_id);
                                                return (
                                                    <tr key={p.id}>
                                                        <td>
                                                            {isLandlord ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <div className="avatar avatar-sm" style={{ width: '24px', height: '24px', fontSize: '0.625rem' }}>{tenant ? getInitials(tenant.name) : '?'}</div>
                                                                    <span style={{ fontWeight: 600 }}>{tenant?.name || '—'}</span>
                                                                </div>
                                                            ) : (
                                                                <span style={{ fontWeight: 600 }}>{listing?.title?.split('—')[0] || '—'}</span>
                                                            )}
                                                        </td>
                                                        <td style={{ fontWeight: 900 }}>{formatCurrency(p.amount)}</td>
                                                        <td>{p.paid_date ? formatDate(p.paid_date) : '—'}</td>
                                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.reference || '—'}</td>
                                                        <td>
                                                            <span className={`badge ${p.status === 'completed' ? 'badge-green' : p.status === 'pending' ? 'badge-orange' : 'badge-blue'}`} style={{ fontWeight: 800 }}>
                                                                {(p.status || 'pending').toUpperCase()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── Compliance Tab ─────────────────────────────── */}
                        {activeTab === 'compliance' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                                    {complianceItems.map((c) => {
                                        const isDone = c.status === 'completed' || c.status === 'clear';
                                        const isPending = c.status === 'pending';
                                        return (
                                            <div key={c.label} className="glass-card" style={{
                                                padding: '1.5rem',
                                                background: isDone ? 'rgba(34,197,94,0.06)' : 'rgba(234,179,8,0.06)',
                                                border: `1px solid ${isDone ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'}`,
                                                textAlign: 'center',
                                            }}>
                                                {isDone ? (
                                                    <ShieldCheck size={32} style={{ color: 'var(--success)', marginBottom: '1rem', margin: '0 auto 1rem' }} />
                                                ) : (
                                                    <Clock size={32} style={{ color: 'var(--warning)', marginBottom: '1rem', margin: '0 auto 1rem' }} />
                                                )}
                                                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{c.label}</div>
                                                <span className={`badge ${isDone ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '0.6875rem', fontWeight: 800 }}>
                                                    {c.status.toUpperCase()}
                                                </span>
                                                {c.date && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 600 }}>Synced {formatDate(c.date)}</div>}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 800 }}>
                                        <Building2 size={20} className="text-purple-light" /> Compliance Verification Logs
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {complianceItems.map(c => (
                                            <div key={c.label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.status === 'completed' || c.status === 'clear' ? 'var(--success)' : '#f59e0b', marginTop: '0.5rem', flexShrink: 0, boxShadow: `0 0 8px ${c.status === 'completed' ? 'var(--success)' : '#f59e0b'}` }} />
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{c.label}</div>
                                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', lineHeight: 1.6 }}>{c.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                                        <AlertCircle size={20} style={{ color: '#3b82f6' }} />
                                        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#3b82f6' }}>Continuous AML Monitoring</span>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                                        Your account is under continuous monitoring for compliance with UAE Anti-Money Laundering and Counter-Terrorism Financing laws. Any changes to your UAE PASS status or secondary screening will be updated instantly.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
