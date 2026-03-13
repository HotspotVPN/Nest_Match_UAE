import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { maintenanceTickets, listings, users, formatDate } from '@/data/mockData';
import type { MaintenanceCategory, MaintenanceUrgency, MaintenanceStatus, MaintenanceTicket } from '@/types';
import { Wrench, Plus, MessageSquare, AlertTriangle, AlertCircle, CheckCircle2, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MaintenancePage() {
    const { currentUser } = useAuth();
    
    // For demo purposes, we hold tickets in local state to allow Kanban moves and new submissions
    const [tickets, setTickets] = useState<MaintenanceTicket[]>(maintenanceTickets);

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState<MaintenanceCategory>('AC/Cooling');
    const [urgency, setUrgency] = useState<MaintenanceUrgency>('Low');
    const [description, setDescription] = useState('');

    if (!currentUser) return null;

    const isTenant = currentUser.type === 'roommate';
    const isLandlordOrAgent = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';

    // Filter tickets relevant to the user
    // For demo simplicity, we associate directly using tenant_id or landlord_id matching properties
    const userTickets = tickets.filter(t => {
        if (isTenant) return t.tenant_id === currentUser.id;
        
        // For landlords, find their properties
        if (isLandlordOrAgent) {
            const myPropertyIds = listings.filter(l => l.landlord_id === currentUser.id || l.letting_agent_id === currentUser.id).map(l => l.id);
            return myPropertyIds.includes(t.property_id);
        }
        return false;
    });

    const handleSubmitTicket = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Mock API call
        setTimeout(() => {
            const newTicket: MaintenanceTicket = {
                id: `mt-new-${Date.now()}`,
                property_id: currentUser.current_house_id || 'listing-1', // Fallback for mock
                tenant_id: currentUser.id,
                issue_type: category,
                urgency: urgency,
                status: 'Reported',
                description: description,
                created_at: new Date().toISOString()
            };
            
            setTickets([newTicket, ...tickets]);
            setDescription('');
            setCategory('General');
            setUrgency('Low');
            setIsSubmitting(false);
            alert('Ticket submitted to your Property Manager successfully.');
        }, 1000);
    };

    const handleStatusMove = (ticketId: string, newStatus: MaintenanceStatus) => {
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    };

    const getUrgencyColor = (u: MaintenanceUrgency) => {
        if (u === 'Emergency') return 'var(--error)';
        if (u === 'Medium') return 'var(--warning)';
        return 'var(--text-muted)';
    };

    const getStatusBadge = (status: MaintenanceStatus) => {
        if (status === 'Reported') return <span className="badge badge-orange"><AlertCircle size={12} /> Reported</span>;
        if (status === 'In Progress') return <span className="badge badge-blue"><Wrench size={12} /> In Progress</span>;
        return <span className="badge badge-green"><CheckCircle2 size={12} /> Resolved</span>;
    };

    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Wrench size={32} style={{ color: 'var(--brand-purple)' }} />
                        Maintenance Hub
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isTenant ? 'Report issues to your landlord or property management.' : 'Manage active tenant maintenance requests across your portfolio.'}
                    </p>
                </div>

                {/* ─── TENANT VIEW ────────────────────────────────────────── */}
                {isTenant && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
                        
                        {/* Ticket Submission Form */}
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={20} style={{ color: 'var(--primary)' }} />
                                Submit New Ticket
                            </h2>
                            <form onSubmit={handleSubmitTicket}>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Issue Category</label>
                                    <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}>
                                        <option value="AC/Cooling">AC/Cooling</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Appliances">Appliances</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Urgency Level</label>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {(['Low', 'Medium', 'Emergency'] as MaintenanceUrgency[]).map((level) => (
                                            <label 
                                                key={level} 
                                                style={{ 
                                                    flex: 1, 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    gap: '0.5rem', 
                                                    padding: '0.75rem', 
                                                    background: urgency === level ? 'rgba(79,70,229,0.1)' : 'var(--bg-surface-2)', 
                                                    border: `1px solid ${urgency === level ? 'var(--primary)' : 'var(--border-subtle)'}`, 
                                                    borderRadius: 'var(--radius-md)', 
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                <input type="radio" value={level} checked={urgency === level} onChange={() => setUrgency(level)} style={{ display: 'none' }} />
                                                {level === 'Emergency' && <AlertTriangle size={14} style={{ color: 'var(--error)' }} />}
                                                {level}
                                            </label>
                                        ))}
                                    </div>
                                    {urgency === 'Emergency' && (
                                        <p style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.5rem' }}>
                                            Emergency tickets bypass silence modes and trigger immediate notifications to the Property Manager.
                                        </p>
                                    )}
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        className="form-input" 
                                        rows={4} 
                                        placeholder="Please provide details about the issue..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={isSubmitting || !description}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Maintenance Request'}
                                </button>
                            </form>
                        </div>

                        {/* Recent Tickets List */}
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your Active Requests</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {userTickets.length === 0 ? (
                                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No active maintenance tickets.
                                    </div>
                                ) : (
                                    userTickets.map(ticket => (
                                        <div key={ticket.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                        <span style={{ fontWeight: 600 }}>{ticket.issue_type}</span>
                                                        <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '4px', background: 'var(--bg-surface-2)', color: getUrgencyColor(ticket.urgency), fontWeight: 600 }}>
                                                            {ticket.urgency}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reported on {formatDate(ticket.created_at)}</div>
                                                </div>
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                "{ticket.description}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── LANDLORD/AGENT VIEW (KANBAN) ─────────────────────── */}
                {isLandlordOrAgent && (
                    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {(['Reported', 'In Progress', 'Resolved'] as MaintenanceStatus[]).map((columnStatus) => {
                            const columnTickets = userTickets.filter(t => t.status === columnStatus);
                            
                            return (
                                <div key={columnStatus} style={{ flex: '1 0 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                                        {columnStatus}
                                        <span style={{ fontSize: '0.75rem', background: 'var(--bg-base)', padding: '0.125rem 0.5rem', borderRadius: '10px' }}>
                                            {columnTickets.length}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {columnTickets.map(ticket => {
                                            const tenantUser = users.find(u => u.id === ticket.tenant_id);
                                            const property = listings.find(l => l.id === ticket.property_id);
                                            
                                            return (
                                                <div key={ticket.id} className="glass-card" style={{ padding: '1.25rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{ticket.issue_type}</div>
                                                        <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '4px', border: `1px solid ${getUrgencyColor(ticket.urgency)}`, color: getUrgencyColor(ticket.urgency), fontWeight: 600 }}>
                                                            {ticket.urgency}
                                                        </span>
                                                    </div>
                                                    
                                                    <p style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.4 }}>{ticket.description}</p>
                                                    
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <div><span style={{ color: 'var(--text-secondary)' }}>Prop:</span> {property?.title}</div>
                                                        <div><span style={{ color: 'var(--text-secondary)' }}>Tenant:</span> {tenantUser?.name}</div>
                                                        <div><span style={{ color: 'var(--text-secondary)' }}>Date:</span> {formatDate(ticket.created_at)}</div>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                                        {columnStatus === 'Reported' && (
                                                            <button onClick={() => handleStatusMove(ticket.id, 'In Progress')} className="btn btn-primary btn-sm" style={{ flex: 1 }}><Wrench size={14} /> Start</button>
                                                        )}
                                                        {columnStatus === 'In Progress' && (
                                                            <button onClick={() => handleStatusMove(ticket.id, 'Resolved')} className="btn btn-sm" style={{ flex: 1, background: 'var(--success)', color: 'white' }}><CheckSquare size={14} /> Resolve</button>
                                                        )}
                                                        <Link to="/chat" className="btn btn-outline btn-sm" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                                            <MessageSquare size={14} /> Msg Tenant
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {columnTickets.length === 0 && (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                                No tickets
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
