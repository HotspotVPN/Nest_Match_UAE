import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import TreasuryPage from '@/pages/TreasuryPage';
import CompliancePage from '@/pages/CompliancePage';
import CustomerDatabasePage from '@/pages/CustomerDatabasePage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import ChatPage from '@/pages/ChatPage';
import GccDashboardPage from '@/pages/GccDashboardPage';
import ViewingAnalyticsPage from '@/pages/ViewingAnalyticsPage';
import MaintenancePage from '@/pages/MaintenancePage';
import RentLedgerPage from '@/pages/RentLedgerPage';
import LandlordWalletPage from '@/pages/LandlordWalletPage';
import LandlordDashboardPage from '@/pages/LandlordDashboardPage';
import RegisterLandingPage from '@/pages/RegisterLandingPage';
import TenantSignupPage from '@/pages/TenantSignupPage';
import LandlordSignupPage from '@/pages/LandlordSignupPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import MyPropertiesPage from '@/pages/MyPropertiesPage';

const DASHBOARD_PATHS = [
    '/dashboard', '/viewings', '/compliance', '/customers', '/analytics',
    '/chat', '/maintenance', '/residing-dashboard', '/wallet', '/gcc',
    '/ledger', '/add-property', '/my-properties',
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
                                <Route path="/register/tenant" element={<TenantSignupPage />} />
                                <Route path="/register/landlord" element={<LandlordSignupPage />} />
                                <Route path="/browse" element={<BrowsePage />} />
                                <Route path="/listing/:id" element={<ListingDetailPage />} />
                                <Route path="/profile/:id?" element={<ProfilePage />} />
                                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms" element={<TermsPage />} />

                                <Route path="/viewings" element={<ViewingsPage />} />
                                <Route path="/add-property" element={<AddPropertyPage />} />
                                <Route path="/residing-dashboard" element={<ResidingDashboardPage />} />
                                <Route path="/treasury" element={<TreasuryPage />} />
                                <Route path="/compliance" element={<CompliancePage />} />
                                <Route path="/customers" element={<CustomerDatabasePage />} />
                                <Route path="/how-it-works" element={<HowItWorksPage />} />
                                <Route path="/chat" element={<ChatPage />} />
                                <Route path="/gcc" element={<GccDashboardPage />} />
                                <Route path="/analytics" element={<ViewingAnalyticsPage />} />
                                <Route path="/maintenance" element={<MaintenancePage />} />
                                <Route path="/ledger" element={<RentLedgerPage />} />
                                <Route path="/wallet" element={<LandlordWalletPage />} />
                                <Route path="/dashboard" element={<LandlordDashboardPage />} />
                                <Route path="/my-properties" element={<MyPropertiesPage />} />
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
