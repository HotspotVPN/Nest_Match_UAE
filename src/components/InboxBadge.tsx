import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { viewingBookings, chatChannels, chatMessages } from '@/data/mockData';

export default function InboxBadge() {
    const { isAuthenticated, currentUser } = useAuth();

    // Compute unread count from viewing data (always available, no backend dependency)
    const count = useMemo(() => {
        if (!currentUser) return 0;
        const userId = currentUser.id;
        let unread = 0;
        const userViewings = viewingBookings.filter(v => v.searcher_id === userId || v.landlord_id === userId);

        for (const v of userViewings) {
            const isSearcher = v.searcher_id === userId;

            // Completed/fully_signed with agreement → action item
            if ((v.status === 'COMPLETED' || v.status === 'FULLY_SIGNED') && v.agreement?.status === 'fully_signed') {
                unread++;
            }
            // Agreement sent, tenant needs to sign
            if ((v.status === 'AGREEMENT_SENT' || v.status === 'AGENT_SIGNED') && v.agreement && isSearcher) {
                const tenantSigned = v.agreement.signatures.some(s => s.signer_role === 'tenant');
                if (!tenantSigned) unread++;
            }
            // Agreement sent, broker needs to sign
            if (v.status === 'AGREEMENT_SENT' && v.agreement && !isSearcher) {
                const brokerSigned = v.agreement.signatures.some(s => s.signer_role === 'broker');
                if (!brokerSigned) unread++;
            }
            // Confirmed → needs signing
            if (v.status === 'CONFIRMED' && isSearcher) unread++;
            // Pending landlord approval → landlord action
            if (v.status === 'PENDING_LANDLORD_APPROVAL' && !isSearcher) unread++;
        }

        // Count unread chat messages
        const userChannels = chatChannels.filter(ch => ch.participants.includes(userId));
        for (const ch of userChannels) {
            const channelMsgs = chatMessages.filter(m => m.channel_id === ch.id && m.sender_id !== userId);
            if (channelMsgs.length === 0) continue;
            const latest = channelMsgs[channelMsgs.length - 1];
            if (!latest.read_by.includes(userId)) unread++;
        }

        return unread;
    }, [currentUser]);

    if (!isAuthenticated) return null;

    return (
        <Link
            to="/inbox"
            style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                padding: '0.375rem', borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)', textDecoration: 'none',
            }}
            title="Inbox"
        >
            <Bell size={18} />
            {count > 0 && (
                <span style={{
                    position: 'absolute', top: '-2px', right: '-4px',
                    minWidth: '16px', height: '16px', padding: '0 4px',
                    borderRadius: 'var(--radius-full)',
                    background: '#ef4444', color: '#fff',
                    fontSize: '0.5625rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                }}>
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </Link>
    );
}
