import { Link } from 'react-router-dom';
import type { ViewingBooking, Listing, User } from '@/types';
import { Download, ExternalLink, MessageSquare, ShieldCheck } from 'lucide-react';

interface Props {
    viewing: ViewingBooking;
    property: Listing;
    tenant: User;
    agent: User;
}

export default function LeaseHandoffCard({ viewing, property, tenant, agent }: Props) {
    const handleDownload = () => {
        window.print();
    };

    return (
        <div style={{
            borderLeft: '4px solid #14b8a6',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            borderLeftColor: '#14b8a6',
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            padding: '1.25rem',
            marginTop: '0.75rem',
        }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: '#14b8a6' }} />
                Viewing Complete — Next Steps
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                {/* Tile 1: DLD Viewing Agreement */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Your DLD Viewing Agreement
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {viewing.agreement ? `Agreement ${viewing.agreement.agreement_number}` : 'No agreement on file'}
                    </p>
                    <button onClick={handleDownload} className="btn btn-ghost btn-sm" style={{ fontSize: '0.6875rem', width: '100%', justifyContent: 'center' }}>
                        <Download size={12} /> Download
                    </button>
                </div>

                {/* Tile 2: Find a RERA Broker */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Find a RERA Broker
                    </div>
                    {agent.rera_license ? (
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                            {agent.name} ({agent.agency_name || 'Licensed Agent'})
                        </p>
                    ) : (
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                            Search the DLD broker directory
                        </p>
                    )}
                    <a href="https://dubailand.gov.ae" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.6875rem', width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                        <ExternalLink size={12} /> DLD Portal
                    </a>
                </div>

                {/* Tile 3: Continue via NestMatch Chat */}
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Continue via NestMatch Chat
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        Coordinate next steps with your landlord or agent
                    </p>
                    <Link to="/chat" className="btn btn-ghost btn-sm" style={{ fontSize: '0.6875rem', width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                        <MessageSquare size={12} /> Open Chat
                    </Link>
                </div>
            </div>

            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                NestMatch is not a property management company and does not execute tenancy contracts. All lease agreements must be completed through a licensed RERA broker and registered via Ejari.
            </p>
        </div>
    );
}
