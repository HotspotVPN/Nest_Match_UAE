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
                const token = localStorage.getItem('nm_token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const apiUser = await response.json();
                    // Enrich API user with mock data for complete User object
                    const mockUser = mockUsers.find((u) => u.id === apiUser.id || u.email === apiUser.email);
                    setCurrentUser(mockUser ? { ...mockUser, ...apiUser, name: apiUser.name || mockUser.name } : apiUser);
                }
            } catch (err) {
                console.info('%c[NestMatch] Session check — backend unavailable', 'color: #8B5CF6; font-weight: bold;');
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = (userId: string) => {
        const user = mockUsers.find((u) => u.id === userId);
        if (user) {
            // Clear stale token BEFORE switching persona to prevent race conditions
            // where API calls fire with the old user's JWT.
            localStorage.removeItem('nm_token');
            setCurrentUser(user);
            // Then authenticate with backend to get the correct JWT for this persona.
            if (user.email) {
                fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, password: 'demo2026' })
                }).then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Backend login failed');
                }).then(data => {
                    if (data.token) localStorage.setItem('nm_token', data.token);
                }).catch(() => {
                    // Backend unavailable — token already cleared, mock fallback will be used
                });
            }
        }
    };

    const loginWithEmail = async (email: string, password = 'demo2026') => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('nm_token', data.token);

                // Login returns minimal user — fetch full profile
                try {
                    const meResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${data.token}` }
                    });
                    if (meResponse.ok) {
                        const fullUser = await meResponse.json();
                        // Merge API profile with mock data for complete User object
                        const mockUser = mockUsers.find((u) => u.email === email || u.id === fullUser.id);
                        setCurrentUser(mockUser ? { ...mockUser, ...fullUser, name: fullUser.name || mockUser.name } : fullUser);
                        return;
                    }
                } catch {
                    // /me failed — fall through to mock enrichment
                }

                // Enrich minimal login response with mock data
                const mockUser = mockUsers.find((u) => u.email === email);
                if (mockUser) {
                    setCurrentUser({ ...mockUser, id: data.user.id, email: data.user.email });
                } else {
                    setCurrentUser(data.user);
                }
            } else {
                // Fallback to mock for demo purposes if backend login fails
                const user = mockUsers.find((u) => u.email === email);
                if (user) setCurrentUser(user);
            }
        } catch (err) {
            console.info('%c[NestMatch] Login — using mock fallback', 'color: #8B5CF6; font-weight: bold;');
            const user = mockUsers.find((u) => u.email === email);
            if (user) setCurrentUser(user);
        }
    };

    const loginWithUaePass = (uaePassId: string) => {
        const user = mockUsers.find((u) => u.uaePassId === uaePassId);
        if (user) setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem('nm_token');
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
