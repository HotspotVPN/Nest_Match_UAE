import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { currentUser, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-purple)' }} />
            </div>
        );
    }

    if (!isAuthenticated || !currentUser) {
        const returnPath = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?return=${returnPath}`} replace />;
    }

    return <>{children}</>;
}
