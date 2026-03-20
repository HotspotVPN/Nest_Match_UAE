import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DemoStateProvider } from '@/contexts/DemoStateContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import DemoControls from '@/components/DemoControls';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import BrowsePage from '@/pages/BrowsePage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import ViewingsPage from '@/pages/ViewingsPage';
import AddPropertyPage from '@/pages/AddPropertyPage';
import ResidingDashboardPage from '@/pages/ResidingDashboardPage';
import CompliancePage from '@/pages/CompliancePage';
import CustomerDatabasePage from '@/pages/CustomerDatabasePage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import ChatPage from '@/pages/ChatPage';
import GccDashboardPage from '@/pages/GccDashboardPage';
import ViewingAnalyticsPage from '@/pages/ViewingAnalyticsPage';
import MaintenancePage from '@/pages/MaintenancePage';
import LandlordDashboardPage from '@/pages/LandlordDashboardPage';
import RegisterLandingPage from '@/pages/RegisterLandingPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import MyPropertiesPage from '@/pages/MyPropertiesPage';
import InboxPage from '@/pages/InboxPage';
import EjariDocumentsPage from '@/pages/EjariDocumentsPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const DASHBOARD_PATHS = [
    '/dashboard', '/viewings', '/compliance', '/customers', '/analytics',
    '/chat', '/maintenance', '/residing-dashboard', '/gcc',
    '/add-property', '/my-properties',
];

function AuthenticatedDemoControls() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return null;
    return <DemoControls />;
}

function ConditionalFooter() {
    const { pathname } = useLocation();
    const isDashboard = DASHBOARD_PATHS.some(p => pathname.startsWith(p));
    if (isDashboard) return null;
    return <Footer />;
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <DemoStateProvider>
                    <AuthProvider>
                        <Navbar />
                        <Toast />
                        <main style={{ paddingBottom: '5rem' }}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterLandingPage />} />
                                <Route path="/register/tenant" element={<Navigate to="/register?role=tenant" replace />} />
                                <Route path="/register/landlord" element={<Navigate to="/register?role=landlord" replace />} />
                                <Route path="/browse" element={<BrowsePage />} />
                                <Route path="/listing/:id" element={<ListingDetailPage />} />
                                <Route path="/profile/:id?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms" element={<TermsPage />} />

                                <Route path="/viewings" element={<ProtectedRoute><ViewingsPage /></ProtectedRoute>} />
                                <Route path="/add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
                                <Route path="/residing-dashboard" element={<ProtectedRoute><ResidingDashboardPage /></ProtectedRoute>} />
                                <Route path="/compliance" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
                                <Route path="/customers" element={<ProtectedRoute><CustomerDatabasePage /></ProtectedRoute>} />
                                <Route path="/how-it-works" element={<HowItWorksPage />} />
                                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                                <Route path="/gcc" element={<ProtectedRoute><GccDashboardPage /></ProtectedRoute>} />
                                <Route path="/analytics" element={<ProtectedRoute><ViewingAnalyticsPage /></ProtectedRoute>} />
                                <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
                                <Route path="/dashboard" element={<ProtectedRoute><LandlordDashboardPage /></ProtectedRoute>} />
                                <Route path="/my-properties" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
                                <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
                                <Route path="/ejari" element={<ProtectedRoute><EjariDocumentsPage /></ProtectedRoute>} />
                            </Routes>
                        </main>
                        <ConditionalFooter />
                        <AuthenticatedDemoControls />
                    </AuthProvider>
                </DemoStateProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
