import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DemoStateProvider } from '@/contexts/DemoStateContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import DemoControls from '@/components/DemoControls';
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

function AuthenticatedDemoControls() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return null;
    return <DemoControls />;
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
                            </Routes>
                        </main>
                        <AuthenticatedDemoControls />
                    </AuthProvider>
                </DemoStateProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
