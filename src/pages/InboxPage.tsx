import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Bell, FileText, MessageSquare, Info, CheckCircle2, Loader2, Mail, MailOpen } from 'lucide-react';

interface InboxMessage {
    id: string;
    category: 'action' | 'message' | 'update';
    type: string;
    priority: string;
    title: string;
    body: string;
    cta_label?: string;
    cta_link?: string;
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

const TAB_CONFIG = [
    { key: 'action', label: 'Actions', icon: <FileText size={14} /> },
    { key: 'message', label: 'Messages', icon: <MessageSquare size={14} /> },
    { key: 'update', label: 'Updates', icon: <Info size={14} /> },
] as const;

export default function InboxPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('action');
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [unread, setUnread] = useState({ action: 0, message: 0, update: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        api.getInbox().then(data => {
            setMessages(data.messages);
            setUnread(data.unread);
            setLoading(false);
        });
    }, [currentUser]);

    const filteredMessages = messages.filter(m => m.category === activeTab);

    const handleMarkRead = async (msg: InboxMessage) => {
        if (msg.read_at) return;
        await api.markInboxRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read_at: new Date().toISOString() } : m));
        setUnread(prev => ({
            ...prev,
            [msg.category]: Math.max(0, (prev as any)[msg.category] - 1),
            total: Math.max(0, prev.total - 1),
        }));
    };

    const handleCta = (msg: InboxMessage) => {
        handleMarkRead(msg);
        if (msg.cta_link) navigate(msg.cta_link);
    };

    const handleMarkAllRead = async () => {
        await api.markAllInboxRead(activeTab);
        setMessages(prev => prev.map(m => m.category === activeTab && !m.read_at ? { ...m, read_at: new Date().toISOString() } : m));
        setUnread(prev => ({ ...prev, [activeTab]: 0, total: Math.max(0, prev.total - (prev as any)[activeTab]) }));
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            {!msg.read_at ? <Mail size={14} style={{ color: 'var(--brand-purple)' }} /> : <MailOpen size={14} style={{ color: 'var(--text-muted)' }} />}
                                            <span style={{ fontWeight: !msg.read_at ? 700 : 500, fontSize: '0.875rem' }}>{msg.title}</span>
                                            {msg.priority === 'high' && (
                                                <span style={{
                                                    fontSize: '0.5625rem', fontWeight: 700, padding: '0.0625rem 0.375rem',
                                                    borderRadius: 'var(--radius-full)', background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                                                    textTransform: 'uppercase',
                                                }}>Action Required</span>
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
                                {msg.cta_label && msg.cta_link && (
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCta(msg); }}
                                            className="btn btn-primary btn-sm"
                                            style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                                        >
                                            {msg.cta_label} &rarr;
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
