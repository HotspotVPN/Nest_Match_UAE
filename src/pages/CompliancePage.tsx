import { useAuth } from '@/contexts/AuthContext';
import { users, formatDate } from '@/data/mockData';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.type !== 'compliance') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Compliance admin access only</h2></div>;
    }

    const allUsers = users.filter(u => !['compliance', 'finance', 'operations'].includes(u.type));
    const verified = allUsers.filter(u => u.compliance.verified);
    const pending = allUsers.filter(u => !u.compliance.verified);

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container">
                <h2 style={{ marginBottom: '0.5rem' }}>Compliance Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>UAE PASS verification & CBUAE regulatory oversight</p>

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

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}><ShieldCheck size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--uaepass-green-light)' }} /> User Verification Status</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>User</th><th>Type</th><th>UAE PASS</th><th>KYC</th><th>AML</th><th>PEP</th><th>Verified Date</th></tr>
                            </thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u.id}>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td><span className={`badge ${u.type === 'landlord' ? 'badge-blue' : u.type === 'letting_agent' ? 'badge-orange' : 'badge-purple'}`} style={{ fontSize: '0.625rem' }}>{u.type.replace('_', ' ')}</span></td>
                                        <td>{u.uaePassId ? <span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> Verified</span> : <span className="badge badge-red" style={{ fontSize: '0.5625rem' }}>Missing</span>}</td>
                                        <td>{u.compliance.kyc_status === 'completed' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}</td>
                                        <td>{u.compliance.aml_status === 'completed' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <XCircle size={16} style={{ color: 'var(--error)' }} />}</td>
                                        <td>{u.compliance.pep_status === 'clear' ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}</td>
                                        <td style={{ fontSize: '0.8125rem' }}>{u.compliance.kyc_completed_date ? formatDate(u.compliance.kyc_completed_date) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
