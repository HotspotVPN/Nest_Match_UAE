import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { users as mockUsers } from '@/data/mockData';
import { API_BASE_URL } from '@/services/api';

export type VerificationTier = 'unverified' | 'tier1' | 'tier2';

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string) => void;
    loginWithEmail: (email: string, password?: string) => Promise<void>;
    loginWithUaePass: (uaePassId: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    verificationTier: VerificationTier;
    isVerifiedForBooking: boolean;
    loading: boolean;
}

function getVerificationTier(user: User | null): VerificationTier {
    if (!user) return 'unverified';
    if (user.isUaePassVerified || user.isIdVerified) return 'tier2';
    return 'tier1';
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => { },
    loginWithEmail: async () => { },
    loginWithUaePass: () => { },
    logout: () => { },
    isAuthenticated: false,
    verificationTier: 'unverified',
    isVerifiedForBooking: false,
    loading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Persist session via /api/auth/me
    useEffect(() => {
        const checkSession = async () => {
            try {
                // In local dev, we might not have cookies set yet if we didn't login
                // but we try to fetch the 'me' profile
                const token = localStorage.getItem('nestmatch_token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const user = await response.json();
                    setCurrentUser(user);
                }
            } catch (err) {
                console.error("Session check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = (userId: string) => {
        const user = mockUsers.find((u) => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const loginWithEmail = async (email: string, password = 'pass123') => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('nestmatch_token', data.token);
                setCurrentUser(data.user);
            } else {
                // Fallback to mock for demo purposes if backend login fails
                const user = mockUsers.find((u) => u.email === email);
                if (user) setCurrentUser(user);
            }
        } catch (err) {
            console.error("Login failed, using mock fallback:", err);
            const user = mockUsers.find((u) => u.email === email);
            if (user) setCurrentUser(user);
        }
    };

    const loginWithUaePass = (uaePassId: string) => {
        const user = mockUsers.find((u) => u.uaePassId === uaePassId);
        if (user) setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem('nestmatch_token');
        setCurrentUser(null);
    };

    const tier = getVerificationTier(currentUser);

    return (
        <AuthContext.Provider value={{
            currentUser,
            login,
            loginWithEmail,
            loginWithUaePass,
            logout,
            isAuthenticated: !!currentUser,
            verificationTier: tier,
            isVerifiedForBooking: tier === 'tier2',
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
