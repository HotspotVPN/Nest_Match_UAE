import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { viewingBookings as mockViewings, listings as mockListings, users as mockUsers, chatChannels, chatMessages } from '@/data/mockData';
import { Bell, FileText, MessageSquare, Info, CheckCircle2, Loader2, Mail, MailOpen, Download, ShieldCheck, Eye } from 'lucide-react';
import ViewingAgreementModal from '@/components/ViewingAgreementModal';
import type { ViewingBooking } from '@/types';

interface InboxMessage {
    id: string;
    category: 'action' | 'message' | 'update';
    type: string;
    priority: string;
    title: string;
    body: string;
    cta_label?: string;
    cta_link?: string;
    viewing_id?: string;
    agreement_number?: string;
    sender_id?: string;
    read_at: string | null;
    created_at: string;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Generate inbox messages from viewing data for a given user */
function generateViewingInboxMessages(userId: string, viewingsData: ViewingBooking[]): InboxMessage[] {
    const msgs: InboxMessage[] = [];
    const userViewings = viewingsData.filter(v => v.searcher_id === userId || v.landlord_id === userId);

    for (const v of userViewings) {
        const property = mockListings.find(l => l.id === v.property_id);
        const pTitle = property?.title || 'Property';
        const isSearcher = v.searcher_id === userId;
        const otherParty = isSearcher ? v.landlord_id : v.searcher_id;
        const otherUser = mockUsers.find(u => u.id === otherParty);
        const otherName = otherUser?.name || 'the other party';

        // ── COMPLETED viewings with signed agreement → "Download your signed agreement"
        if (v.status === 'COMPLETED' && v.agreement?.status === 'fully_signed') {
            msgs.push({
                id: `va-inbox-completed-${v.id}`,
                category: 'action', type: 'agreement_signed', priority: 'normal',
                title: 'Signed DLD Agreement — Download',
                body: `Your viewing at ${pTitle} is complete. The DLD Viewing Agreement (${v.agreement.agreement_number}) is fully signed. Download your copy.`,
                cta_label: 'View Agreement', viewing_id: v.id,
                agreement_number: v.agreement.agreement_number,
                sender_id: otherParty, read_at: null, created_at: v.updated_at,
            });
        }

        // ── FULLY_SIGNED → "Agreement fully signed, awaiting viewing day"
        if (v.status === 'FULLY_SIGNED' && v.agreement?.status === 'fully_signed') {
            msgs.push({
                id: `va-inbox-signed-${v.id}`,
                category: 'action', type: 'agreement_signed', priority: 'normal',
                title: 'Signed DLD Agreement Ready',
                body: `Your DLD Viewing Agreement for ${pTitle} has been fully signed by both parties. Download your copy before the viewing.`,
                cta_label: 'View Agreement', viewing_id: v.id,
                agreement_number: v.agreement.agreement_number,
                sender_id: otherParty, read_at: null, created_at: v.updated_at,
            });
        }

        // ── AGREEMENT_SENT or AGENT_SIGNED → tenant needs to sign
        if ((v.status === 'AGREEMENT_SENT' || v.status === 'AGENT_SIGNED') && v.agreement && isSearcher) {
            const tenantSigned = v.agreement.signatures.some(s => s.signer_role === 'tenant');
            if (!tenantSigned) {
                msgs.push({
                    id: `va-inbox-sign-${v.id}`,
                    category: 'action', type: 'sign_agreement', priority: 'high',
                    title: 'Sign Viewing Agreement',
                    body: `The DLD Viewing Agreement for ${pTitle} has been generated. Please sign the agreement to confirm your viewing.`,
                    cta_label: 'Sign Now', viewing_id: v.id,
                    agreement_number: v.agreement.agreement_number,
                    sender_id: otherParty, read_at: null, created_at: v.agreement.generated_at,
                });
            }
        }

        // ── AGREEMENT_SENT → landlord/agent needs to sign
        if ((v.status === 'AGREEMENT_SENT') && v.agreement && !isSearcher) {
            const brokerSigned = v.agreement.signatures.some(s => s.signer_role === 'broker');
            if (!brokerSigned) {
                msgs.push({
                    id: `va-inbox-sign-broker-${v.id}`,
                    category: 'action', type: 'sign_agreement', priority: 'high',
                    title: 'Sign Viewing Agreement — Broker',
                    body: `The DLD Viewing Agreement for ${pTitle} needs your signature as broker. Tenant: ${mockUsers.find(u => u.id === v.searcher_id)?.name || 'Tenant'}.`,
                    cta_label: 'Sign Now', viewing_id: v.id,
                    agreement_number: v.agreement.agreement_number,
                    sender_id: v.searcher_id, read_at: null, created_at: v.agreement.generated_at,
                });
            }
        }

        // ── CONFIRMED → "Viewing confirmed, sign agreement to proceed"
        if (v.status === 'CONFIRMED' && isSearcher) {
            msgs.push({
                id: `va-inbox-confirmed-${v.id}`,
                category: 'action', type: 'sign_agreement', priority: 'high',
                title: 'Sign Viewing Agreement',
                body: `Your viewing at ${pTitle} on ${formatDate(v.requested_date)} at ${v.time_slot} has been confirmed. Please sign the DLD Viewing Agreement to proceed.`,
                cta_label: 'Sign Now', viewing_id: v.id,
                sender_id: otherParty, read_at: null, created_at: v.updated_at,
            });
        }

        // ── PENDING / PENDING_LANDLORD_APPROVAL → update for searcher
        if ((v.status === 'PENDING' || v.status === 'PENDING_LANDLORD_APPROVAL') && isSearcher) {
            msgs.push({
                id: `va-inbox-pending-${v.id}`,
                category: 'update', type: 'viewing_requested', priority: 'normal',
                title: 'Viewing Request Submitted',
                body: `Your viewing request for ${pTitle} on ${formatDate(v.requested_date)} at ${v.time_slot} has been submitted. You will be notified when the landlord responds.`,
                sender_id: otherParty, read_at: v.created_at, created_at: v.created_at,
            });
        }

        // ── PENDING_LANDLORD_APPROVAL → action for landlord
        if (v.status === 'PENDING_LANDLORD_APPROVAL' && !isSearcher) {
            const searcherUser = mockUsers.find(u => u.id === v.searcher_id);
            msgs.push({
                id: `va-inbox-approve-${v.id}`,
                category: 'action', type: 'viewing_request', priority: 'high',
                title: 'New Viewing Request',
                body: `${searcherUser?.name || 'A tenant'} has requested a viewing for ${pTitle} on ${formatDate(v.requested_date)} at ${v.time_slot}. Please approve or decline.`,
                cta_label: 'Review', cta_link: '/viewings',
                viewing_id: v.id,
                sender_id: v.searcher_id, read_at: null, created_at: v.created_at,
            });
        }

        // ── NO_SHOW → update
        if (v.status === 'NO_SHOW_TENANT' || v.status === 'NO_SHOW_LANDLORD') {
            msgs.push({
                id: `va-inbox-noshow-${v.id}`,
                category: 'update', type: 'no_show', priority: 'normal',
                title: v.status === 'NO_SHOW_TENANT' ? 'Tenant No-Show' : 'Landlord No-Show',
                body: `The viewing at ${pTitle} on ${formatDate(v.requested_date)} was recorded as a no-show. ${v.status === 'NO_SHOW_TENANT' ? 'The tenant' : 'The landlord'} did not attend.`,
                sender_id: otherParty, read_at: null, created_at: v.updated_at,
            });
        }

        // ── CANCELLED → update
        if (v.status === 'CANCELLED') {
            msgs.push({
                id: `va-inbox-cancelled-${v.id}`,
                category: 'update', type: 'viewing_cancelled', priority: 'normal',
                title: 'Viewing Cancelled',
                body: `The viewing at ${pTitle} on ${formatDate(v.requested_date)} has been cancelled.`,
                sender_id: otherParty, read_at: null, created_at: v.updated_at,
            });
        }
    }

    // ── Generate message-category items from chat data ──
    const userChannels = chatChannels.filter(ch => ch.participants.includes(userId));
    for (const ch of userChannels) {
        // Get messages in this channel from other people (not the current user)
        const channelMsgs = chatMessages.filter(m => m.channel_id === ch.id && m.sender_id !== userId);
        if (channelMsgs.length === 0) continue;

        // Show the most recent message from the other party as a message-category inbox item
        const latest = channelMsgs[channelMsgs.length - 1];
        const senderUser = mockUsers.find(u => u.id === latest.sender_id);
        const isRead = latest.read_by.includes(userId);

        msgs.push({
            id: `va-inbox-msg-${latest.id}`,
            category: 'message', type: 'chat_message', priority: 'normal',
            title: `Message from ${senderUser?.name || 'Unknown'}`,
            body: latest.content,
            cta_label: 'Reply', cta_link: '/chat',
            sender_id: latest.sender_id,
            read_at: isRead ? latest.created_at : null,
            created_at: latest.created_at,
        });
    }

    // Sort newest first
    msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return msgs;
}

const TAB_CONFIG = [
    { key: 'action', label: 'Actions', icon: <FileText size={14} /> },
    { key: 'message', label: 'Messages', icon: <MessageSquare size={14} /> },
    { key: 'update', label: 'Updates', icon: <Info size={14} /> },
] as const;

export default function InboxPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('action');
    const [backendMessages, setBackendMessages] = useState<InboxMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [agreementModalViewing, setAgreementModalViewing] = useState<ViewingBooking | null>(null);
    const [viewings, setViewings] = useState<ViewingBooking[]>(mockViewings);
    const [readOverrides, setReadOverrides] = useState<Record<string, string>>({});

    // Load backend inbox messages
    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        api.getInbox(undefined, currentUser.id).then(data => {
            setBackendMessages(data.messages || []);
            setLoading(false);
        });
    }, [currentUser]);

    // Generate viewing/agreement messages from live viewing data
    const viewingMessages = useMemo(() => {
        if (!currentUser) return [];
        return generateViewingInboxMessages(currentUser.id, viewings);
    }, [currentUser, viewings]);

    // Merge backend + viewing-generated messages, dedup by viewing_id
    const allMessages = useMemo(() => {
        const viewingMsgIds = new Set(viewingMessages.map(m => m.viewing_id).filter(Boolean));
        // Keep backend messages that aren't about viewings we already generated messages for
        const filteredBackend = backendMessages.filter(m => {
            // Don't filter out non-viewing backend messages (chat messages, system updates)
            if (!m.viewing_id) return true;
            // If we have a generated message for this viewing, skip the backend version
            return !viewingMsgIds.has(m.viewing_id);
        });
        const merged = [...viewingMessages, ...filteredBackend];
        // Apply read overrides
        const withReads = merged.map(m => readOverrides[m.id] ? { ...m, read_at: readOverrides[m.id] } : m);
        // Sort newest first
        withReads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return withReads;
    }, [viewingMessages, backendMessages, readOverrides]);

    // Compute unread counts
    const unread = useMemo(() => {
        const action = allMessages.filter(m => m.category === 'action' && !m.read_at).length;
        const message = allMessages.filter(m => m.category === 'message' && !m.read_at).length;
        const update = allMessages.filter(m => m.category === 'update' && !m.read_at).length;
        return { action, message, update, total: action + message + update };
    }, [allMessages]);

    const filteredMessages = allMessages.filter(m => m.category === activeTab);

    const handleMarkRead = (msg: InboxMessage) => {
        if (msg.read_at) return;
        // For backend messages, also tell the backend
        if (!msg.id.startsWith('va-inbox-')) {
            api.markInboxRead(msg.id);
        }
        setReadOverrides(prev => ({ ...prev, [msg.id]: new Date().toISOString() }));
    };

    const handleDownloadPdf = (agreementNumber: string) => {
        const pdfUrl = `/samples/va-${agreementNumber}.pdf`;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `NestMatch_Viewing_Agreement_${agreementNumber}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCta = (msg: InboxMessage) => {
        handleMarkRead(msg);

        // Agreement-related actions: open modal directly
        if (msg.viewing_id) {
            const viewing = viewings.find(v => v.id === msg.viewing_id);
            if (viewing) {
                if (msg.type === 'agreement_signed' || msg.type === 'viewing_completed' || msg.type === 'sign_agreement') {
                    setAgreementModalViewing(viewing);
                    return;
                }
                if (msg.type === 'viewing_request') {
                    // Landlord reviewing a request → go to viewings page
                    navigate('/viewings');
                    return;
                }
            }
        }

        // Default: navigate to link
        if (msg.cta_link) navigate(msg.cta_link);
    };

    const handleAgreementUpdate = (updated: ViewingBooking) => {
        setViewings(prev => prev.map(v => v.id === updated.id ? updated : v));
        setAgreementModalViewing(updated);
    };

    const handleMarkAllRead = () => {
        const now = new Date().toISOString();
        const overrides: Record<string, string> = {};
        filteredMessages.forEach(m => {
            if (!m.read_at) overrides[m.id] = now;
        });
        setReadOverrides(prev => ({ ...prev, ...overrides }));
        // Also tell backend
        api.markAllInboxRead(activeTab);
    };

    if (!currentUser) return null;

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '720px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bell size={22} /> Inbox
                        {unread.total > 0 && (
                            <span style={{
                                fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.5rem',
                                borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.15)',
                                color: '#ef4444',
                            }}>{unread.total} unread</span>
                        )}
                    </h2>
                    {filteredMessages.some(m => !m.read_at) && (
                        <button onClick={handleMarkAllRead} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>
                            <CheckCircle2 size={12} /> Mark all read
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
                    {TAB_CONFIG.map(tab => (
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
                            {tab.icon} {tab.label}
                            {(unread as any)[tab.key] > 0 && (
                                <span style={{
                                    fontSize: '0.5625rem', fontWeight: 700, padding: '0.0625rem 0.375rem',
                                    borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                                }}>{(unread as any)[tab.key]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-purple)' }} />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Mail size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No {activeTab === 'action' ? 'action items' : activeTab === 'message' ? 'messages' : 'updates'}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {activeTab === 'action' ? 'Nothing requires your attention right now.' :
                             activeTab === 'message' ? 'No messages from landlords or agents yet.' :
                             'No system updates at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => handleMarkRead(msg)}
                                className="glass-card"
                                style={{
                                    padding: '1rem 1.25rem', cursor: 'pointer',
                                    borderLeft: !msg.read_at ? '3px solid var(--brand-purple)' : '3px solid transparent',
                                    background: !msg.read_at ? 'rgba(124,58,237,0.04)' : undefined,
                                    transition: 'all 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                            {msg.type === 'agreement_signed' ? (
                                                <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                                            ) : msg.type === 'sign_agreement' ? (
                                                <FileText size={14} style={{ color: 'var(--brand-purple)' }} />
                                            ) : !msg.read_at ? (
                                                <Mail size={14} style={{ color: 'var(--brand-purple)' }} />
                                            ) : (
                                                <MailOpen size={14} style={{ color: 'var(--text-muted)' }} />
                                            )}
                                            <span style={{ fontWeight: !msg.read_at ? 700 : 500, fontSize: '0.875rem' }}>{msg.title}</span>
                                            {msg.priority === 'high' && (
                                                <span style={{
                                                    fontSize: '0.5625rem', fontWeight: 700, padding: '0.0625rem 0.375rem',
                                                    borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                                                    textTransform: 'uppercase',
                                                }}>Action Required</span>
                                            )}
                                            {msg.agreement_number && (
                                                <span style={{
                                                    fontSize: '0.5625rem', fontWeight: 600, padding: '0.0625rem 0.375rem',
                                                    borderRadius: 'var(--radius-full)', background: 'rgba(124,58,237,0.1)', color: 'var(--brand-purple)',
                                                }}>{msg.agreement_number}</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                                            {msg.body}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                        {timeAgo(msg.created_at)}
                                    </span>
                                </div>
                                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {msg.cta_label && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCta(msg); }}
                                            className="btn btn-primary btn-sm"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                                        >
                                            {msg.type === 'agreement_signed' ? <Eye size={12} /> : msg.type === 'sign_agreement' ? <FileText size={12} /> : null}
                                            {' '}{msg.cta_label} &rarr;
                                        </button>
                                    )}
                                    {/* Quick PDF download for signed agreements */}
                                    {msg.agreement_number && msg.type === 'agreement_signed' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMarkRead(msg); handleDownloadPdf(msg.agreement_number!); }}
                                            className="btn btn-ghost btn-sm"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                                        >
                                            <Download size={12} /> Download PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Viewing Agreement Modal — opens from inbox actions */}
            {agreementModalViewing && (() => {
                const listing = mockListings.find(l => l.id === agreementModalViewing.property_id);
                const tenantUser = mockUsers.find(u => u.id === agreementModalViewing.searcher_id);
                const agentUser = mockUsers.find(u => u.id === agreementModalViewing.landlord_id);
                if (!listing || !tenantUser || !agentUser) return null;
                return (
                    <ViewingAgreementModal
                        viewing={agreementModalViewing}
                        property={listing}
                        tenant={tenantUser}
                        agent={agentUser}
                        onClose={() => setAgreementModalViewing(null)}
                        onAgreementUpdate={handleAgreementUpdate}
                    />
                );
            })()}
        </div>
    );
}
