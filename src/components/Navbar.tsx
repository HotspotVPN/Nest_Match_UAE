import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/data/mockData';
import {
    Home, Search, User, BarChart3, ShieldCheck, Users,
    LogOut, Building2, CalendarCheck, MessageSquare, LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout, isAuthenticated, verificationTier } = useAuth();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">
                        <div className="navbar-logo-icon">N</div>
                        <span className="navbar-logo-text">NestMatch</span>
                        <span className="navbar-beta-badge">UAE</span>
                    </Link>

                    {isAuthenticated && currentUser && (
                        <div className="navbar-links">
                            {(currentUser.type === 'roommate') && (
                                <>
                                    <Link to="/browse" className={`navbar-link ${isActive('/browse')}`}>
                                        <Search size={16} /> Browse
                                    </Link>
                                    <Link to="/viewings" className={`navbar-link ${isActive('/viewings')}`}>
                                        <CalendarCheck size={16} /> Viewings
                                    </Link>
                                    <Link to="/chat" className={`navbar-link ${isActive('/chat')}`}>
                                        <MessageSquare size={16} /> Chat
                                    </Link>
                                    {currentUser.resident_role === 'residing' && (
                                        <Link to="/residing-dashboard" className={`navbar-link ${isActive('/residing-dashboard')}`}>
                                            <Users size={16} /> Applicants
                                        </Link>
                                    )}
                                </>
                            )}
                            {(currentUser.type === 'landlord' || currentUser.type === 'letting_agent') && (
                                <>
                                    <Link to="/browse" className={`navbar-link ${isActive('/browse')}`}>
                                        <Building2 size={16} /> Properties
                                    </Link>
                                    <Link to="/viewings" className={`navbar-link ${isActive('/viewings')}`}>
                                        <CalendarCheck size={16} /> Viewings
                                    </Link>
                                    <Link to="/chat" className={`navbar-link ${isActive('/chat')}`}>
                                        <MessageSquare size={16} /> Chat
                                    </Link>
                                </>
                            )}
                            {currentUser.type === 'compliance' && (
                                <Link to="/compliance" className={`navbar-link ${isActive('/compliance')}`}>
                                    <ShieldCheck size={16} /> Compliance
                                </Link>
                            )}
                            {currentUser.type === 'finance' && (
                                <Link to="/treasury" className={`navbar-link ${isActive('/treasury')}`}>
                                    <BarChart3 size={16} /> Treasury
                                </Link>
                            )}
                            {currentUser.type === 'operations' && (
                                <Link to="/customers" className={`navbar-link ${isActive('/customers')}`}>
                                    <Users size={16} /> CRM
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="navbar-actions">
                        {isAuthenticated && currentUser ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Link to="/chat" className="btn btn-ghost btn-icon">
                                        <MessageSquare size={18} />
                                    </Link>
                                    <Link to="/residing-dashboard" className="btn btn-ghost btn-icon">
                                        <LayoutDashboard size={18} />
                                    </Link>
                                    
                                    <div style={{ position: 'relative' }}>
                                        <button onClick={() => setShowDropdown(!showDropdown)} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>
                                            <div className="avatar avatar-sm">{getInitials(currentUser.name)}</div>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                                {currentUser.name.split(' ')[0]}
                                                {verificationTier === 'tier2' && <ShieldCheck size={12} style={{ color: 'var(--uaepass-green)' }} />}
                                            </span>
                                        </button>
                                        {showDropdown && (
                                            <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '0.5rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 10 }}>
                                                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)} style={{ display: 'block', padding: '0.5rem 1rem', textDecoration: 'none', color: '#333' }}>Profile</Link>
                                                <button onClick={() => { logout(); setShowDropdown(false); }} className="dropdown-item" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>Sign Out</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => { logout(); }} className="btn btn-ghost btn-icon" title="Sign out">
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-uaepass btn-sm">
                                <ShieldCheck size={16} /> Login with UAE PASS
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            {isAuthenticated && currentUser && (
                <div className="mobile-nav">
                    <Link to="/" className={`mobile-nav-link ${isActive('/')}`}>
                        <Home size={20} /> Home
                    </Link>
                    <Link to="/browse" className={`mobile-nav-link ${isActive('/browse')}`}>
                        <Search size={20} /> Browse
                    </Link>
                    <Link to="/viewings" className={`mobile-nav-link ${isActive('/viewings')}`}>
                        <CalendarCheck size={20} /> Viewings
                    </Link>
                    <Link to="/profile" className={`mobile-nav-link ${isActive('/profile')}`}>
                        <User size={20} /> Profile
                    </Link>
                </div>
            )}
        </>
    );
}
