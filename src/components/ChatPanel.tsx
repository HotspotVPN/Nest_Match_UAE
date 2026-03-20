import { useState, useRef, useEffect } from 'react';
import {
    getChatChannelsForUser, getMessagesForChannel, getUserById, getInitials,
    formatDate, formatTime,
} from '@/data/mockData';
import {
    MessageSquare, Send, Wrench, Megaphone, Info,
    Hash, Users, Home as HomeIcon, ChevronLeft,
} from 'lucide-react';
import type { MessageType, User } from '@/types';

export default function ChatPanel({ currentUser }: { currentUser: User }) {
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [messageType, setMessageType] = useState<MessageType>('text');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChannel]);

    const channels = getChatChannelsForUser(currentUser.id);
    const activeChannel = channels.find((c) => c.id === selectedChannel);
    const messages = selectedChannel ? getMessagesForChannel(selectedChannel) : [];

    const msgTypeIcon = (t: MessageType) => {
        if (t === 'maintenance_request') return <Wrench size={13} style={{ color: 'var(--warning)' }} />;
        if (t === 'announcement') return <Megaphone size={13} style={{ color: 'var(--brand-purple-light)' }} />;
        if (t === 'system') return <Info size={13} style={{ color: 'var(--text-muted)' }} />;
        return null;
    };

    const msgTypeBg = (t: MessageType) => {
        if (t === 'maintenance_request') return 'rgba(234,179,8,0.06)';
        if (t === 'announcement') return 'rgba(124,58,237,0.06)';
        return 'transparent';
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;
        // Mock send logic
        setNewMessage('');
        setMessageType('text');
    };

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: selectedChannel ? '260px 1fr' : '1fr',
            gap: '0', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            height: '550px',
            background: 'var(--surface-card)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}>
            {/* Channel List */}
            <div style={{
                borderRight: selectedChannel ? '1px solid var(--border-subtle)' : 'none',
                overflowY: 'auto',
                background: 'rgba(255,255,255,0.01)',
            }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.9375rem', fontWeight: 800 }}>
                        <MessageSquare size={16} style={{ color: 'var(--brand-purple-light)' }} />
                        Smart Chat
                        <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>{channels.length}</span>
                    </h4>
                </div>

                {channels.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <MessageSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No active house channels</p>
                    </div>
                ) : (
                    channels.map((ch) => {
                        const channelMessages = getMessagesForChannel(ch.id);
                        const lastMsg = channelMessages[channelMessages.length - 1];
                        const lastSender = lastMsg ? getUserById(lastMsg.sender_id) : null;
                        const unread = channelMessages.filter((m) => !m.read_by.includes(currentUser.id)).length;
                        const isActive = selectedChannel === ch.id;

                        return (
                            <button key={ch.id} onClick={() => setSelectedChannel(ch.id)} style={{
                                width: '100%', textAlign: 'left', padding: '1rem',
                                background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                                border: 'none', borderBottom: '1px solid var(--border-subtle)',
                                cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-primary)',
                                position: 'relative',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                        <HomeIcon size={12} style={{ color: 'var(--brand-purple-light)' }} />
                                        {ch.name}
                                    </span>
                                    {unread > 0 && (
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '50%',
                                            background: 'var(--brand-purple)', color: 'white', fontSize: '0.625rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                                        }}>{unread}</span>
                                    )}
                                </div>
                                {lastMsg && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700 }}>{lastSender?.name?.split(' ')[0]}:</span>{' '}
                                        {lastMsg.content}
                                    </div>
                                )}
                                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Users size={10} /> {ch.participants.length} residents
                                </div>
                                {isActive && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--brand-purple-light)' }} />}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Messages Area */}
            {selectedChannel && activeChannel && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                        <button onClick={() => setSelectedChannel(null)} className="btn btn-ghost btn-icon" style={{ padding: '0.375rem' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <div style={{ flex: 1 }}>
                            <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.9375rem', fontWeight: 800 }}>
                                <Hash size={14} style={{ color: 'var(--brand-purple-light)' }} />
                                {activeChannel.name}
                            </h5>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', marginTop: '2px' }}>
                                {activeChannel.participants.map((pid) => {
                                    const p = getUserById(pid);
                                    return p ? (
                                        <span key={pid} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.type === 'landlord' ? '#3b82f6' : p.type === 'letting_agent' ? '#f59e0b' : 'var(--success)' }} />
                                            {p.name.split(' ')[0]}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                        <div className="badge badge-purple" style={{ fontSize: '0.625rem' }}>ENCRYPTED</div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)', gap: '0.5rem' }}>
                                <MessageSquare size={32} style={{ opacity: 0.2 }} />
                                <p style={{ fontSize: '0.875rem' }}>No messages in this secure channel yet.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const sender = getUserById(msg.sender_id);
                                const isOwn = msg.sender_id === currentUser.id;
                                const showAvatar = i === 0 || messages[i - 1].sender_id !== msg.sender_id;
                                return (
                                    <div key={msg.id} style={{ display: 'flex', gap: '0.625rem', flexDirection: isOwn ? 'row-reverse' : 'row', alignItems: 'flex-end', marginBottom: showAvatar ? '0.5rem' : '0' }}>
                                        {showAvatar && !isOwn ? (
                                            <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.625rem', width: '32px', height: '32px' }}>
                                                {sender ? getInitials(sender.name) : '?'}
                                            </div>
                                        ) : <div style={{ width: '32px', flexShrink: 0 }} />}
                                        <div style={{
                                            maxWidth: '75%', padding: '0.75rem 1rem',
                                            borderRadius: isOwn ? 'var(--radius-lg) var(--radius-lg) 2px var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 2px',
                                            background: isOwn ? 'var(--brand-purple)' : msgTypeBg(msg.message_type) || 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}>
                                            {showAvatar && !isOwn && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--brand-purple-light)' }}>{sender?.name}</span>
                                                    {sender?.type === 'letting_agent' && <span className="badge badge-orange" style={{ fontSize: '0.5625rem', padding: '0.1rem 0.3rem' }}>Agent</span>}
                                                    {sender?.type === 'landlord' && <span className="badge badge-blue" style={{ fontSize: '0.5625rem', padding: '0.1rem 0.3rem' }}>Landlord</span>}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                                                {msgTypeIcon(msg.message_type)}
                                                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: isOwn ? 'white' : 'var(--text-primary)' }}>{msg.content}</p>
                                            </div>
                                            <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                                                <span style={{ fontSize: '0.625rem', color: isOwn ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{formatTime(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {(['text', 'maintenance_request', 'announcement'] as MessageType[]).map((t) => {
                                const labels: Record<string, string> = { text: 'Message', maintenance_request: 'Maintenance/Ejari', announcement: 'Building Alert' };
                                return (
                                    <button key={t} onClick={() => setMessageType(t)} className={`btn ${messageType === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-full)' }}>
                                        {t === 'maintenance_request' && <Wrench size={11} style={{ marginRight: '0.25rem' }} />}
                                        {t === 'announcement' && <Megaphone size={11} style={{ marginRight: '0.25rem' }} />}
                                        {labels[t]}
                                    </button>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input
                                className="form-input"
                                placeholder={messageType === 'maintenance_request' ? 'Describe maintenance issue...' : 'Type a message...'}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <button onClick={handleSend} className="btn btn-primary btn-icon" disabled={!newMessage.trim()} style={{ width: '45px', height: '45px' }}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!selectedChannel && channels.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <MessageSquare size={40} style={{ color: 'var(--brand-purple-light)', opacity: 0.6 }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Active Household Portal</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '300px' }}>
                            Select a property channel to communicate with residents and management.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
