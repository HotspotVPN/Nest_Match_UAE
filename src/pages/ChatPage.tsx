import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatChannels, chatMessages, users, listings, viewingBookings, getInitials, formatTime, formatDate } from '@/data/mockData';
import { Send, Users as UsersIcon, Home, CheckCircle2, Phone, Video, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function ChatPage() {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(chatMessages);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter channels where the current user is a participant
    const myChannels = chatChannels.filter(c => c.participants.includes(currentUser.id));
    
    useEffect(() => {
        if (myChannels.length > 0 && !activeChannelId) {
            setActiveChannelId(myChannels[0].id);
        }
    }, [myChannels, activeChannelId]);

    const activeChannel = chatChannels.find(c => c.id === activeChannelId);
    const channelMessages = messages.filter(m => m.channel_id === activeChannelId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [channelMessages]);

    useEffect(() => {
        setShowParticipantsMenu(false);
    }, [activeChannelId]);

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
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" className="form-input" placeholder="Search conversations..." style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} />
                    </div>
                </div>

                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {myChannels.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Home size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No active conversations yet.</p>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Message landlords from property listings, or chat with your housemates here.</p>
                        </div>
                    ) : (
                        myChannels.map(channel => {
                            const isActive = channel.id === activeChannelId;
                            const isPropertyChat = !!channel.listing_id;
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
                                        {isPropertyChat ? <Home size={12} style={{ color: 'var(--primary)' }} /> : <UsersIcon size={12} style={{ color: 'var(--text-muted)' }} />}
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
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.125rem' }}>
                                        {activeChannel.listing_id ? activeChannel.name : getParticipantNames(activeChannel.participants)}
                                    </h3>
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
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.name} {p.id === currentUser.id ? '(You)' : ''}</span>
                                                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                                                                    {p.type === 'landlord' ? 'Landlord' : p.type === 'letting_agent' ? 'Agent' : 'Tenant'}
                                                                </span>
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

                        {/* Property Context Banner (if applicable) */}
                        {activeChannel.listing_id && (
                            <div style={{ background: 'var(--bg-surface-2)', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Home size={14} style={{ color: 'var(--text-secondary)' }} />
                                    <span>Regarding: <strong>{listings.find(l => l.id === activeChannel.listing_id)?.title}</strong></span>
                                </div>
                                <a href={`/listing/${activeChannel.listing_id}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>View Listing</a>
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
                                    placeholder="Type a message..." 
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
                    myChannels.length > 0 && (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            Select a conversation to start messaging
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
