import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { rentLedgers, listings, users, formatCurrency, formatDate } from '@/data/mockData';
import type { RentInstallment, RentPaymentStatus } from '@/types';
import { Banknote, Calendar, AlertCircle, CheckCircle2, Clock, BellRing, CreditCard } from 'lucide-react';

export default function RentLedgerPage() {
    const { currentUser } = useAuth();
    
    // Holding ledgers in state to allow mock mutations (like paying or sending reminders)
    const [ledgers, setLedgers] = useState(rentLedgers);
    const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

    if (!currentUser) return null;

    const isTenant = currentUser.type === 'roommate';
    const isLandlordOrAgent = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';

    // ─── UTILS ──────────────────────────────────────────────────
    const getDaysUntil = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    const getStatusStyles = (status: RentPaymentStatus) => {
        if (status === 'Paid') return { bg: 'var(--success-bg)', color: 'var(--success)', icon: <CheckCircle2 size={14} /> };
        if (status === 'Overdue') return { bg: 'rgba(239,68,68,0.1)', color: 'var(--error)', icon: <AlertCircle size={14} /> };
        return { bg: 'var(--info-bg)', color: 'var(--info)', icon: <Clock size={14} /> }; // Upcoming
    };

    // ─── ACTIONS ────────────────────────────────────────────────
    const handleStripePayment = (ledgerId: string, installmentId: string) => {
        setIsProcessingPayment(installmentId);
        setTimeout(() => {
            // Update state to Paid
            setLedgers(prev => prev.map(l => {
                if (l.id === ledgerId) {
                    return {
                        ...l,
                        installments: l.installments.map(i => i.id === installmentId ? { ...i, status: 'Paid' as RentPaymentStatus } : i)
                    };
                }
                return l;
            }));
            setIsProcessingPayment(null);
            alert('🎉 Payment processed successfully via Stripe!');
        }, 1500);
    };

    const handleSendReminder = (tenantName: string) => {
        alert(`🔔 Push notification sent to ${tenantName} regarding overdue payment.`);
    };

    // ─── TENANT VIEW LOGIC ──────────────────────────────────────
    // Assuming 1 ledger per tenant for simplicity in this mock
    const myLedger = ledgers.find(l => l.tenant_id === currentUser.id);
    
    const nextPayment = myLedger?.installments
        .filter(i => i.status !== 'Paid')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

    const daysUntilNext = nextPayment ? getDaysUntil(nextPayment.due_date) : 0;

    // ─── LANDLORD VIEW LOGIC ────────────────────────────────────
    const myPortfolioLedgers = ledgers.filter(l => l.landlord_id === currentUser.id);
    
    // Flatten all installments for the landlord table
    const allInstallments = myPortfolioLedgers.flatMap(l => {
        const property = listings.find(p => p.id === l.property_id);
        const tenant = users.find(u => u.id === l.tenant_id);
        return l.installments.map(i => ({
            ...i,
            ledgerId: l.id,
            propertyTitle: property?.title || 'Unknown Property',
            tenantName: tenant?.name || 'Unknown Tenant',
        }));
    }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());


    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Banknote size={32} style={{ color: 'var(--brand-purple)' }} />
                        Rent Ledger
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isTenant ? 'Track your active lease and upcoming cheque/Stripe installments.' : 'Portfolio-wide financial tracking and cheque management.'}
                    </p>
                </div>

                {/* ─── TENANT VIEW ────────────────────────────────────────── */}
                {isTenant && myLedger && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start' }}>
                        
                        {/* HERO CARD */}
                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                                <Calendar size={24} />
                            </div>
                            <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Next Payment Due</h2>
                            
                            {nextPayment ? (
                                <>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: nextPayment.status === 'Overdue' ? 'var(--error)' : 'var(--text-primary)' }}>
                                        {formatCurrency(nextPayment.amount)}
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600, color: nextPayment.status === 'Overdue' ? 'var(--error)' : (daysUntilNext <= 7 ? 'var(--warning)' : 'var(--text-muted)') }}>
                                        {nextPayment.status === 'Overdue' 
                                            ? `Overdue by ${Math.abs(daysUntilNext)} days` 
                                            : `Due in ${daysUntilNext} days (${formatDate(nextPayment.due_date)})`}
                                    </div>

                                    {nextPayment.method === 'Stripe' && daysUntilNext <= 7 && nextPayment.status !== 'Paid' && (
                                        <button 
                                            className="btn btn-primary" 
                                            style={{ width: '100%', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                                            onClick={() => handleStripePayment(myLedger.id, nextPayment.id)}
                                            disabled={isProcessingPayment === nextPayment.id}
                                        >
                                            {isProcessingPayment === nextPayment.id ? <span className="spin">⌛</span> : <CreditCard size={18} />}
                                            {isProcessingPayment === nextPayment.id ? 'Processing...' : 'Pay via Stripe'}
                                        </button>
                                    )}

                                    {nextPayment.method === 'Cheque' && nextPayment.status !== 'Paid' && (
                                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                                            Payment Method: <strong>Post-Dated Cheque</strong>
                                            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Please ensure sufficient funds in your linked bank account before the due date.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)', marginTop: '1rem' }}>
                                    All clear! No upcoming payments.
                                </div>
                            )}
                        </div>

                        {/* TIMELINE TABLE */}
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} style={{ color: 'var(--primary)' }} />
                                Payment Schedule ({myLedger.installments.length} Cheques)
                            </h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {myLedger.installments.map((installment, idx) => {
                                    const { bg, color, icon } = getStatusStyles(installment.status);
                                    return (
                                        <div key={installment.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${color}` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{formatCurrency(installment.amount)}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Due: {formatDate(installment.due_date)} • {installment.method}</div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '0.5rem 1rem', borderRadius: '2rem', background: bg, color: color, fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                {icon} {installment.status}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                
                {isTenant && !myLedger && (
                    <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Banknote size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
                        <h3>No Active Ledger</h3>
                        <p>Complete a lease agreement in the Contract Hub to generate your payment schedule.</p>
                    </div>
                )}

                {/* ─── LANDLORD/AGENT VIEW ──────────────────────────────────── */}
                {isLandlordOrAgent && (
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Portfolio Ledger</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--success)' }}>Total Paid: {allInstallments.filter(i => i.status === 'Paid').length}</span>
                                <span style={{ color: 'var(--info)' }}>Upcoming: {allInstallments.filter(i => i.status === 'Upcoming').length}</span>
                                <span style={{ color: 'var(--error)' }}>Overdue: {allInstallments.filter(i => i.status === 'Overdue').length}</span>
                            </div>
                        </div>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-base)', borderBottom: '2px solid var(--border-subtle)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '1rem 2rem' }}>Property</th>
                                        <th style={{ padding: '1rem' }}>Tenant</th>
                                        <th style={{ padding: '1rem' }}>Due Date</th>
                                        <th style={{ padding: '1rem' }}>Amount</th>
                                        <th style={{ padding: '1rem' }}>Method</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allInstallments.map((inst) => {
                                        const { bg, color, icon } = getStatusStyles(inst.status);
                                        return (
                                            <tr key={inst.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                <td style={{ padding: '1.25rem 2rem', fontWeight: 600 }}>{inst.propertyTitle}</td>
                                                <td style={{ padding: '1.25rem', color: 'var(--text-secondary)' }}>{inst.tenantName}</td>
                                                <td style={{ padding: '1.25rem' }}>{formatDate(inst.due_date)}</td>
                                                <td style={{ padding: '1.25rem', fontWeight: 600 }}>{formatCurrency(inst.amount)}</td>
                                                <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{inst.method}</td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: bg, color: color, fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {icon} {inst.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                    {inst.status === 'Overdue' && (
                                                        <button 
                                                            className="btn btn-outline btn-sm" 
                                                            style={{ color: 'var(--error)', borderColor: 'var(--error)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                                                            onClick={() => handleSendReminder(inst.tenantName)}
                                                        >
                                                            <BellRing size={14} /> Send Reminder
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            {allInstallments.length === 0 && (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No ledger history found for your properties.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
