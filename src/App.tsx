import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
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

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <main style={{ paddingBottom: '5rem' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/browse" element={<BrowsePage />} />
                        <Route path="/listing/:id" element={<ListingDetailPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/:id" element={<ProfilePage />} />
                        <Route path="/viewings" element={<ViewingsPage />} />
                        <Route path="/add-property" element={<AddPropertyPage />} />
                        <Route path="/residing-dashboard" element={<ResidingDashboardPage />} />
                        <Route path="/treasury" element={<TreasuryPage />} />
                        <Route path="/compliance" element={<CompliancePage />} />
                        <Route path="/customers" element={<CustomerDatabasePage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    );
}
