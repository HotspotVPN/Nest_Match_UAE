import { useAuth } from '@/contexts/AuthContext';
import { payments, listings, users } from '@/data/mockData';
import { Wallet, TrendingUp, ShieldCheck, AlertTriangle, ArrowDownLeft, ArrowUpRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AED = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

export default function LandlordWalletPage() {
    const { currentUser } = useAuth();

    if (!currentUser || (currentUser.type !== 'landlord' && currentUser.type !== 'letting_agent')) {
        return (
            <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <Wallet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h2>Property Owner Access Only</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    This financial dashboard is for landlords and letting agents.
                </p>
                <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1.5rem' }}>Go Home</Link>
            </div>
        );
    }

    // Incoming: payments where this landlord is the payee
    const incoming = payments.filter(
        p => p.payee_id === currentUser.id && (p.type === 'rent' || p.type === 'deposit')
    );

    // Outgoing: refund payments where this landlord is the payer
    const outgoing = payments.filter(
        p => p.payer_id === currentUser.id && p.type === 'refund'
    );

    const allTransactions = [
        ...incoming.map(p => ({ ...p, direction: 'incoming' as const })),
        ...outgoing.map(p => ({ ...p, direction: 'outgoing' as const })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // KPI Calculations
    const depositEscrow = incoming
        .filter(p => p.type === 'deposit' && p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    const expectedRent = incoming
        .filter(p => p.type === 'rent' && (p.status === 'pending' || p.status === 'completed'))
        .reduce((sum, p) => sum + p.amount, 0);

    const penaltiesOutgoing = outgoing.reduce((sum, p) => sum + p.amount, 0);

    const kpis = [
        {
            label: 'Security Deposits (RERA Escrow)',
            value: AED(depositEscrow),
            icon: ShieldCheck,
            color: 'var(--uaepass-green)',
            bg: 'rgba(34,197,94,0.08)',
            sub: 'Protected & held by RERA',
        },
        {
            label: 'Monthly Rent Revenue',
            value: AED(expectedRent),
            icon: TrendingUp,
            color: 'var(--brand-purple-light)',
            bg: 'rgba(139,92,246,0.08)',
            sub: 'Across all active properties',
        },
        {
            label: 'Platform Penalties (Outgoing)',
            value: AED(penaltiesOutgoing),
            icon: AlertTriangle,
            color: 'var(--warning)',
            bg: 'rgba(234,179,8,0.08)',
            sub: penaltiesOutgoing === 0 ? 'None — excellent record! 🎉' : 'No-show penalties charged',
        },
    ];

    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>

                {/* Header */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Wallet size={28} style={{ color: 'var(--brand-purple)' }} />
                        Landlord Wallet
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Your complete financial portfolio — rent, deposits, and penalties across all properties.
                    </p>
                </div>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    {kpis.map(kpi => {
                        const Icon = kpi.icon;
                        return (
                            <div key={kpi.label} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)', background: kpi.bg }}>
                                        <Icon size={22} style={{ color: kpi.color }} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
                                    {kpi.value}
                                </div>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                    {kpi.label}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {kpi.sub}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Ledger Table */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={18} style={{ color: 'var(--brand-purple)' }} />
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Transaction Ledger</h3>
                        <span className="badge badge-purple" style={{ marginLeft: 'auto', fontSize: '0.625rem' }}>{allTransactions.length} records</span>
                    </div>

                    {allTransactions.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Wallet size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No transactions yet. Payments will appear here once tenants are onboarded.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-surface-2)', textAlign: 'left' }}>
                                        {['Date', 'Property', 'Tenant', 'Type', 'Amount', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactions.map((tx, i) => {
                                        const listing = listings.find(l => l.id === tx.listing_id);
                                        const tenant = users.find(u => u.id === tx.payer_id);
                                        const isIncoming = tx.direction === 'incoming';
                                        const typeLabel =
                                            tx.type === 'rent' ? '🏠 Rent Installment' :
                                            tx.type === 'deposit' ? '🔒 Security Deposit' :
                                            '⚠️ No-Show Penalty';

                                        const statusColor =
                                            tx.status === 'completed' ? 'var(--success)' :
                                            tx.status === 'pending' ? 'var(--warning)' :
                                            'var(--error)';

                                        return (
                                            <tr key={tx.id} style={{ borderTop: i > 0 ? '1px solid var(--border-subtle)' : undefined }}>
                                                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                    {new Date(tx.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', fontWeight: 500, maxWidth: '180px' }}>
                                                    {listing?.title?.split('—')[0]?.trim() ?? tx.listing_id}
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>
                                                    {tenant ? tenant.name : tx.payer_id}
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                                                    {typeLabel}
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: isIncoming ? 'var(--success)' : 'var(--error)' }}>
                                                        {isIncoming ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                        {isIncoming ? '+' : '-'}{AED(tx.amount)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.875rem 1rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.6rem',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        background: `${statusColor}18`,
                                                        color: statusColor,
                                                        border: `1px solid ${statusColor}30`,
                                                    }}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* RERA Escrow Notice */}
                <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--uaepass-green)', display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    All security deposits are held in RERA-regulated escrow accounts and released according to RERA Circular 26 of 2010. NestMatch does not hold any tenant funds directly.
                </div>
            </div>
        </div>
    );
}
