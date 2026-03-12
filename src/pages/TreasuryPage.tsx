import { useAuth } from '@/contexts/AuthContext';
import { payments, listings, users, formatCurrency, formatDate } from '@/data/mockData';
import { BarChart3, CreditCard, ShieldCheck } from 'lucide-react';

export default function TreasuryPage() {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.type !== 'finance') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Finance admin access only</h2></div>;
    }

    const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const escrowActive = payments.filter(p => p.rera_escrow_status === 'held').length;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Treasury Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Financial overview — RERA escrow and rent reconciliation</p>

                <div className="grid-4" style={{ marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Collected', value: formatCurrency(totalCollected), color: 'var(--success)' },
                        { label: 'Pending', value: formatCurrency(totalPending), color: 'var(--warning)' },
                        { label: 'RERA Escrow Active', value: `${escrowActive}`, color: 'var(--info)' },
                        { label: 'Total Payments', value: `${payments.length}`, color: 'var(--brand-purple-light)' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-card-label">{s.label}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}><CreditCard size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Recent Transactions</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>Type</th>
                                    <th>Payer</th>
                                    <th>Property</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>RERA Escrow</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => {
                                    const payer = users.find(u => u.id === p.payer_id);
                                    const listing = listings.find(l => l.id === p.listing_id);
                                    return (
                                        <tr key={p.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{p.reference}</td>
                                            <td><span className={`badge ${p.type === 'rent' ? 'badge-blue' : p.type === 'deposit' ? 'badge-purple' : 'badge-green'}`} style={{ fontSize: '0.625rem' }}>{p.type}</span></td>
                                            <td>{payer?.name || '—'}</td>
                                            <td style={{ fontSize: '0.8125rem' }}>{listing?.district || '—'}</td>
                                            <td style={{ fontWeight: 700 }}>{formatCurrency(p.amount)}</td>
                                            <td><span className={`badge ${p.status === 'completed' ? 'badge-green' : p.status === 'pending' ? 'badge-orange' : 'badge-red'}`} style={{ fontSize: '0.625rem' }}>{p.status}</span></td>
                                            <td>
                                                {p.rera_escrow_ref ? (
                                                    <span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> {p.rera_escrow_status}</span>
                                                ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>}
                                            </td>
                                            <td style={{ fontSize: '0.8125rem' }}>{formatDate(p.paid_date || p.due_date)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
