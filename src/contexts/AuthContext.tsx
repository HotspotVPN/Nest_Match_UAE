import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { users } from '@/data/mockData';

export type VerificationTier = 'unverified' | 'tier1' | 'tier2';

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string) => void;
    loginWithEmail: (email: string) => void;
    loginWithUaePass: (uaePassId: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    verificationTier: VerificationTier;
    isVerifiedForBooking: boolean;
}

function getVerificationTier(user: User | null): VerificationTier {
    if (!user) return 'unverified';
    if (user.isUaePassVerified || user.isIdVerified) return 'tier2';
    return 'tier1';
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => { },
    loginWithEmail: () => { },
    loginWithUaePass: () => { },
    logout: () => { },
    isAuthenticated: false,
    verificationTier: 'unverified',
    isVerifiedForBooking: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const login = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const loginWithEmail = (email: string) => {
        const user = users.find((u) => u.email === email);
        if (user) setCurrentUser(user);
    };

    const loginWithUaePass = (uaePassId: string) => {
        const user = users.find((u) => u.uaePassId === uaePassId);
        if (user) setCurrentUser(user);
    };

    const logout = () => setCurrentUser(null);

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
