import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatChannels, chatMessages, users, listings, getInitials, formatTime, formatDate } from '@/data/mockData';
import type { ChatChannelType } from '@/types';
import { Send, Users as UsersIcon, Home, CheckCircle2, Phone, Video, Search, Menu, X, ChevronDown, Building2, CalendarCheck, MessageSquare } from 'lucide-react';
import { UserBadgePill } from '@/components/UserBadge';

export default function ChatPage() {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    const isResiding = currentUser.type === 'roommate' && currentUser.resident_role === 'residing';
    const isLandlordOrAgent = currentUser.type === 'landlord' || currentUser.type === 'letting_agent';

    // All channels where user is a participant
    const myChannels = chatChannels.filter(c => c.participants.includes(currentUser.id));

    // For residing tenants: split into property vs viewing tabs
    const propertyChannels = myChannels.filter(c => c.channel_type === 'property');
    const viewingChannels = myChannels.filter(c => c.channel_type === 'viewing');

    // Active tab: residing tenants default to 'property', searching tenants only see 'viewing'
    const [activeTab, setActiveTab] = useState<ChatChannelType>(isResiding ? 'property' : 'viewing');
    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Determine which channels to show based on tab (landlords/agents see all)
    const visibleChannels = isLandlordOrAgent
        ? myChannels
        : isResiding
            ? (activeTab === 'property' ? propertyChannels : viewingChannels)
            : viewingChannels;

    // Auto-select first channel when tab changes or on mount
    useEffect(() => {
        if (visibleChannels.length > 0 && (!activeChannelId || !visibleChannels.find(c => c.id === activeChannelId))) {
            setActiveChannelId(visibleChannels[0].id);
        } else if (visibleChannels.length === 0) {
            setActiveChannelId(null);
        }
    }, [activeTab, visibleChannels.length]);

    const activeChannel = chatChannels.find(c => c.id === activeChannelId);
    const channelMessages = messages.filter(m => m.channel_id === activeChannelId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [channelMessages]);
    useEffect(() => { setShowParticipantsMenu(false); }, [activeChannelId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChannelId) return;

        const newMsg = {
            id: `msg-${Date.now()}`,
            channel_id: activeChannelId,
            sender_id: currentUser.id,
            message_type: 'text' as const,
            content: newMessage,
            read_by: [currentUser.id],
            created_at: new Date().toISOString(),
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const getParticipantNames = (participantIds: string[]) => {
        const others = participantIds.filter(id => id !== currentUser.id);
        return others.map(id => users.find(u => u.id === id)?.name || 'Unknown').join(', ');
    };

    const showTabs = isResiding;
    const tabConfig = [
        { key: 'property' as ChatChannelType, label: 'My Property', icon: <Building2 size={14} />, count: propertyChannels.length },
        { key: 'viewing' as ChatChannelType, label: 'Viewings', icon: <CalendarCheck size={14} />, count: viewingChannels.length },
    ];

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 4.5rem)', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>

            {/* Mobile Sidebar Toggle */}
            <button
                className="btn btn-ghost"
                style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 10, display: window.innerWidth > 768 ? 'none' : 'flex' }}
                onClick={() => setShowSidebar(!showSidebar)}
            >
                {showSidebar ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar (Channels List) */}
            <div style={{
                width: '320px',
                background: 'var(--bg-surface-1)',
                borderRight: '1px solid var(--border-subtle)',
                display: showSidebar ? 'flex' : 'none',
                flexDirection: 'column',
                height: '100%',
                flexShrink: 0,
                ...(window.innerWidth <= 768 ? { position: 'absolute', zIndex: 5, width: '100%' } : {})
            }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', paddingLeft: window.innerWidth <= 768 ? '2.5rem' : '0' }}>Messages</h2>

                    {/* Tabs for residing tenants */}
                    {showTabs && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                            {tabConfig.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                                        padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
                                        background: activeTab === tab.key ? 'var(--bg-surface-1)' : 'transparent',
                                        border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                                        color: activeTab === tab.key ? 'var(--brand-purple-light)' : 'var(--text-muted)',
                                        boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    {tab.icon} {tab.label}
                                    {tab.count > 0 && (
                                        <span style={{
                                            fontSize: '0.5625rem', fontWeight: 700, padding: '0.0625rem 0.3rem',
                                            borderRadius: 'var(--radius-full)',
                                            background: activeTab === tab.key ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.05)',
                                            color: activeTab === tab.key ? 'var(--brand-purple-light)' : 'var(--text-muted)',
                                        }}>{tab.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" className="form-input" placeholder="Search conversations..." style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {visibleChannels.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {activeTab === 'property' ? (
                                <>
                                    <Building2 size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No property chat yet.</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Once you sign a tenancy contract, your house chat with co-tenants and landlord will appear here.</p>
                                </>
                            ) : (
                                <>
                                    <Home size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No viewing conversations yet.</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Start a conversation from a property listing to chat with landlords and agents.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        visibleChannels.map(channel => {
                            const isActive = channel.id === activeChannelId;
                            const isPropertyChat = channel.channel_type === 'property';
                            const channelName = isPropertyChat ? channel.name : getParticipantNames(channel.participants);

                            return (
                                <div
                                    key={channel.id}
                                    onClick={() => {
                                        setActiveChannelId(channel.id);
                                        if (window.innerWidth <= 768) setShowSidebar(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        background: isActive ? 'var(--bg-surface-2)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {channelName}
                                        </span>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                            {channel.last_message ? formatDate(channel.last_message.created_at) : ''}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isPropertyChat ? (
                                            <Building2 size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        ) : (
                                            <CalendarCheck size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                        )}
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {channel.last_message?.sender_id === currentUser.id ? 'You: ' : ''}
                                            {channel.last_message?.content || 'No messages yet'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
                {activeChannel ? (
                    <>
                        {/* Chat Header */}
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: window.innerWidth <= 768 && !showSidebar ? '2.5rem' : '0' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>
                                            {activeChannel.channel_type === 'property' ? activeChannel.name : getParticipantNames(activeChannel.participants)}
                                        </h3>
                                        <span style={{
                                            fontSize: '0.5625rem', fontWeight: 600, padding: '0.125rem 0.5rem',
                                            borderRadius: 'var(--radius-full)',
                                            background: activeChannel.channel_type === 'property' ? 'rgba(34,197,94,0.12)' : 'rgba(124,58,237,0.1)',
                                            color: activeChannel.channel_type === 'property' ? 'var(--success)' : 'var(--brand-purple-light)',
                                        }}>
                                            {activeChannel.channel_type === 'property' ? 'House Chat' : 'Viewing'}
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: 0, height: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                            onClick={() => setShowParticipantsMenu(!showParticipantsMenu)}
                                        >
                                            {activeChannel.participants.length} participants <ChevronDown size={12} />
                                        </button>

                                        {showParticipantsMenu && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                                                background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md)', padding: '0.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50,
                                                minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                                            }}>
                                                {activeChannel.participants.map(pId => {
                                                    const p = users.find(u => u.id === pId);
                                                    if (!p) return null;
                                                    return (
                                                        <a href={`/profile/${p.id}`} key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', fontSize: '0.8125rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-sm)' }} className="hover-bg-surface-2">
                                                            <div className="avatar avatar-sm" style={{ width: '28px', height: '28px', fontSize: '0.625rem' }}>
                                                                {getInitials(p.name)}
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                                                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name} {p.id === currentUser.id ? '(You)' : ''}</span>
                                                                <UserBadgePill user={p} />
                                                            </div>
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button className="btn btn-ghost btn-icon"><Phone size={18} /></button>
                                <button className="btn btn-ghost btn-icon"><Video size={18} /></button>
                            </div>
                        </div>

                        {/* Property Context Banner */}
                        {activeChannel.listing_id && (
                            <div style={{ background: 'var(--bg-surface-2)', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Home size={14} style={{ color: 'var(--text-secondary)' }} />
                                    <span>
                                        {activeChannel.channel_type === 'property' ? 'Property: ' : 'Regarding: '}
                                        <strong>{listings.find(l => l.id === activeChannel.listing_id)?.title}</strong>
                                    </span>
                                </div>
                                <a href={`/listing/${activeChannel.listing_id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>View Listing</a>
                            </div>
                        )}

                        {/* Compliance notice for property chats */}
                        {activeChannel.channel_type === 'property' && (
                            <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(245,158,11,0.1)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                This is an informal house chat. Official notices, documents, and formal updates from your landlord are delivered via your <a href="/inbox" style={{ color: 'var(--brand-purple-light)', fontWeight: 600 }}>Inbox</a>.
                            </div>
                        )}

                        {/* Message History */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {channelMessages.map((msg, index) => {
                                const isMe = msg.sender_id === currentUser.id;
                                const sender = users.find(u => u.id === msg.sender_id);
                                const showAvatar = index === 0 || channelMessages[index - 1].sender_id !== msg.sender_id;

                                // System/Announcement Messages
                                if (msg.message_type === 'announcement' || msg.message_type === 'maintenance_request') {
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                }

                                // Regular Text Messages
                                return (
                                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '0.5rem', marginTop: showAvatar ? '0.5rem' : '0' }}>
                                        {!isMe && showAvatar && (
                                            <div className="avatar avatar-sm" style={{ width: '28px', height: '28px', fontSize: '0.625rem' }}>
                                                {getInitials(sender?.name || '?')}
                                            </div>
                                        )}
                                        {!isMe && !showAvatar && <div style={{ width: '28px' }} />}

                                        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                                            {showAvatar && !isMe && (
                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', marginLeft: '0.25rem' }}>
                                                    {sender?.name} • {sender?.type === 'landlord' ? 'Landlord' : sender?.type === 'letting_agent' ? 'Agent' : 'Tenant'}
                                                </span>
                                            )}

                                            <div style={{
                                                background: isMe ? 'var(--primary)' : 'var(--bg-surface-2)',
                                                color: isMe ? 'white' : 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                borderRadius: isMe ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                                fontSize: '0.9375rem',
                                                lineHeight: 1.5,
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}>
                                                {msg.content}
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', marginRight: '0.25rem' }}>
                                                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{formatTime(msg.created_at)}</span>
                                                {isMe && <CheckCircle2 size={10} style={{ color: msg.read_by.length > 1 ? 'var(--info)' : 'var(--text-muted)' }} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-surface-1)', borderTop: '1px solid var(--border-subtle)' }}>
                            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={activeChannel.channel_type === 'property' ? 'Message your housemates...' : 'Type a message...'}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '0.75rem 1.5rem' }}
                                />
                                <button type="submit" className="btn btn-primary btn-icon" style={{ borderRadius: '50%', width: '40px', height: '40px', flexShrink: 0 }} disabled={!newMessage.trim()}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '0.5rem' }}>
                        <MessageSquare size={40} style={{ opacity: 0.3 }} />
                        <p>{visibleChannels.length > 0 ? 'Select a conversation to start messaging' : 'No conversations in this channel yet'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
