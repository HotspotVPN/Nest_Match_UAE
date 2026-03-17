import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/data/mockData';
import {
    User, ShieldCheck, Users, LayoutDashboard,
    LogOut, CalendarCheck, MessageSquare, Wrench, BarChart2, HelpCircle, Search, Building2
} from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout, isAuthenticated } = useAuth();
    const location = useLocation();

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
                            {currentUser.type === 'roommate' && (
                                <>
                                    <Link to="/viewings" className={`navbar-link ${isActive('/viewings')}`}>
                                        <CalendarCheck size={16} /> Viewings
                                    </Link>
                                    <Link to="/chat" className={`navbar-link ${isActive('/chat')}`}>
                                        <MessageSquare size={16} /> Chat
                                    </Link>
                                    <Link to="/maintenance" className={`navbar-link ${isActive('/maintenance')}`}>
                                        <Wrench size={16} /> Maintenance
                                    </Link>
                                </>
                            )}
                            {(currentUser.type === 'landlord' || currentUser.type === 'letting_agent') && (
                                <>
                                    <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')}`}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                    <Link to="/my-properties" className={`navbar-link ${isActive('/my-properties')}`}>
                                        <Building2 size={16} /> My Properties
                                    </Link>
                                    <Link to="/viewings" className={`navbar-link ${isActive('/viewings')}`}>
                                        <CalendarCheck size={16} /> Viewings
                                    </Link>
                                    <Link to="/residing-dashboard" className={`navbar-link ${isActive('/residing-dashboard')}`}>
                                        <Users size={16} /> Applicants
                                    </Link>
                                    <Link to="/chat" className={`navbar-link ${isActive('/chat')}`}>
                                        <MessageSquare size={16} /> Chat
                                    </Link>
                                </>
                            )}
                            {currentUser.type === 'compliance' && (
                                <>
                                    <Link to="/compliance" className={`navbar-link ${isActive('/compliance')}`}>
                                        <ShieldCheck size={16} /> Compliance
                                    </Link>
                                    <Link to="/analytics" className={`navbar-link ${isActive('/analytics')}`}>
                                        <BarChart2 size={16} /> Analytics
                                    </Link>
                                </>
                            )}
                            {currentUser.type === 'operations' && (
                                <>
                                    <Link to="/customers" className={`navbar-link ${isActive('/customers')}`}>
                                        <Users size={16} /> Customers
                                    </Link>
                                    <Link to="/analytics" className={`navbar-link ${isActive('/analytics')}`}>
                                        <BarChart2 size={16} /> Analytics
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="navbar-links">
                            <Link to="/browse" className={`navbar-link ${isActive('/browse')}`}>
                                <Search size={16} /> Browse Properties
                            </Link>
                            <Link to="/how-it-works" className={`navbar-link ${isActive('/how-it-works')}`}>
                                <HelpCircle size={16} /> How it Works
                            </Link>
                        </div>
                    )}

                    <div className="navbar-actions">
                        {isAuthenticated && currentUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className="avatar avatar-sm">{getInitials(currentUser.name)}</div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                        {currentUser.name.split(' ')[0]}
                                    </span>
                                </div>
                                <Link to="/profile" className="btn btn-ghost btn-sm">
                                    <User size={16} /> Profile
                                </Link>
                                <button onClick={() => { logout(); }} className="btn btn-ghost btn-sm" title="Sign out">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            {isAuthenticated && currentUser && (
                <div className="mobile-nav">
                    <Link to="/viewings" className={`mobile-nav-link ${isActive('/viewings')}`}>
                        <CalendarCheck size={20} /> Viewings
                    </Link>
                    <Link to="/chat" className={`mobile-nav-link ${isActive('/chat')}`}>
                        <MessageSquare size={20} /> Chat
                    </Link>
                    <Link to="/profile" className={`mobile-nav-link ${isActive('/profile')}`}>
                        <User size={20} /> Profile
                    </Link>
                </div>
            )}
        </>
    );
}
