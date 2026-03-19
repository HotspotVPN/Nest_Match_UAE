import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export default function InboxBadge() {
    const { isAuthenticated } = useAuth();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) return;
        api.getUnreadCount().then(setCount);
        const interval = setInterval(() => api.getUnreadCount().then(setCount), 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

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
