import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';
import { users } from '@/data/mockData';

interface AuthContextType {
    currentUser: User | null;
    login: (userId: string) => void;
    loginWithUaePass: (uaePassId: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => { },
    loginWithUaePass: () => { },
    logout: () => { },
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const login = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const loginWithUaePass = (uaePassId: string) => {
        const user = users.find((u) => u.uaePassId === uaePassId);
        if (user) setCurrentUser(user);
    };

    const logout = () => setCurrentUser(null);

    return (
        <AuthContext.Provider value={{ currentUser, login, loginWithUaePass, logout, isAuthenticated: !!currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
