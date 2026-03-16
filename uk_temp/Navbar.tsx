import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/data/mockData';
import { Home, Search, BarChart3, HelpCircle, LogOut, User, ShieldCheck, Users } from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const links = currentUser?.type === 'finance'
        ? [{ to: '/treasury', label: 'Treasury', icon: BarChart3 }]
        : currentUser?.type === 'compliance'
            ? [{ to: '/compliance', label: 'Compliance Monitor', icon: ShieldCheck }]
            : currentUser?.type === 'operations'
                ? [{ to: '/customers', label: 'Customer Database', icon: Users }]
                : [
                    { to: '/', label: 'Home', icon: Home },
                    { to: '/browse', label: 'Browse', icon: Search },
                    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
                ];

    const profilePath = currentUser?.type === 'finance' ? '/treasury' : currentUser?.type === 'compliance' ? '/compliance' : currentUser?.type === 'operations' ? '/customers' : '/profile';

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="navbar">
                <div className="navbar-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="navbar-logo-icon">N</div>
                        <span className="navbar-logo-text">NestMatch</span>
                        <span className="navbar-beta-badge">v2.0 BETA</span>
                    </Link>

                    {/* Center Links */}
                    <div className="navbar-links">
                        {links.map(({ to, label, icon: Icon }) => (
                            <Link key={to} to={to} className={`navbar-link ${isActive(to) ? 'active' : ''}`}>
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="navbar-actions">
                        {currentUser ? (
                            <>
                                <Link to={profilePath} className="navbar-link" style={{ gap: '0.5rem' }}>
                                    <div className="avatar avatar-sm">{getInitials(currentUser.name)}</div>
                                    <span style={{ fontSize: '0.875rem' }}>{currentUser.name}</span>
                                    <span className={`badge ${['finance', 'compliance', 'operations'].includes(currentUser.type) ? 'badge-green' : currentUser.type === 'letting_agent' ? 'badge-orange' : currentUser.type === 'landlord' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.5rem' }}>
                                        {currentUser.type === 'letting_agent' ? 'Agent' : ['finance', 'compliance', 'operations'].includes(currentUser.type) ? 'Admin' : currentUser.type}
                                    </span>
                                </Link>
                                <button onClick={logout} className="btn btn-ghost btn-icon" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-nav">
                {links.slice(0, 3).map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}>
                        <Icon size={20} />
                        {label}
                    </Link>
                ))}
                {currentUser ? (
                    <Link to={profilePath} className={`mobile-nav-link ${isActive(profilePath) ? 'active' : ''}`}>
                        <User size={20} />
                        {currentUser.type === 'finance' ? 'Treasury' : currentUser.type === 'compliance' ? 'Monitor' : currentUser.type === 'operations' ? 'CRM' : 'Profile'}
                    </Link>
                ) : (
                    <Link to="/login" className="mobile-nav-link">
                        <User size={20} />
                        Login
                    </Link>
                )}
            </nav>
        </>
    );
}
