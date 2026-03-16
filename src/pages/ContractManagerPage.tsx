import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { viewingBookings, listings, users } from '@/data/mockData';
import { verifyEjariRegistration } from '@/services/mockDldService';
import { FileText, ShieldCheck, CheckCircle2, AlertCircle, ChevronLeft, Lock, Home } from 'lucide-react';

export default function ContractManagerPage() {
    const { viewingId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    
    // Step 1: Commercials
    const [tenantAgreed, setTenantAgreed] = useState(false);
    const [landlordAgreed, setLandlordAgreed] = useState(false);

    // Step 2: Ejari
    const [ejariNumber, setEjariNumber] = useState('');
    const [isVerifyingEjari, setIsVerifyingEjari] = useState(false);
    const [ejariResult, setEjariResult] = useState<{ isValid: boolean; statusMessage: string } | null>(null);

    // Step 3: Finance
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Fetch relational data
    const viewing = viewingBookings.find(v => v.id === viewingId);
    
    useEffect(() => {
        if (!currentUser || !viewing) return;
        
        // Security Gate: Only the specific searcher or landlord can access this contract
        const isAuthorized = currentUser.id === viewing.searcher_id || currentUser.id === viewing.landlord_id;
        if (!isAuthorized) {
            navigate('/', { replace: true });
        }
    }, [currentUser, viewing, navigate]);

    if (!currentUser || !viewing) {
        return <div className="section container" style={{ textAlign: 'center', paddingTop: '4rem' }}>Loading Contract Context...</div>;
    }

    const listing = listings.find(l => l.id === viewing.property_id);
    const tenant = users.find(u => u.id === viewing.searcher_id);
    const landlord = users.find(u => u.id === viewing.landlord_id);

    if (!listing || !tenant || !landlord) return null;

    const isTenant = currentUser.id === tenant.id;
    const isLandlord = currentUser.id === landlord.id;

    const handleVerifyEjari = async () => {
        setIsVerifyingEjari(true);
        try {
            const res = await verifyEjariRegistration(ejariNumber);
            setEjariResult(res);
            if (res.isValid) {
                setTimeout(() => setStep(3), 1500);
            }
        } finally {
            setIsVerifyingEjari(false);
        }
    };

    const handleFinalizeLease = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            alert('🎉 Payment Successful! The lease is now ACTIVE.');
            navigate('/viewings');
        }, 2000);
    };

    return (
        <div className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link to="/viewings" className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronLeft size={16} /> Back to Viewings
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                        <FileText size={32} style={{ color: 'var(--brand-purple)' }} />
                        Contract Management Hub
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Finalize your tenancy agreement securely via Dubai Land Department.</p>
                </div>

                {/* Progress Tracker */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-subtle)', zIndex: 0, transform: 'translateY(-50%)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '0', width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', height: '2px', background: 'var(--primary)', zIndex: 0, transform: 'translateY(-50%)', transition: 'width 0.3s' }} />
                    
                    {[1, 2, 3].map(num => (
                        <div key={num} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= num ? 'var(--primary)' : 'var(--bg-surface-2)', color: step >= num ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: `2px solid ${step >= num ? 'var(--primary)' : 'var(--border-subtle)'}` }}>
                                {step > num ? <CheckCircle2 size={16} /> : num}
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: step >= num ? 600 : 400, color: step >= num ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {num === 1 ? 'Commercials' : num === 2 ? 'Ejari Setup' : 'Financial Closing'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Property Context Card */}
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', backgroundImage: `url(${listing.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{listing.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Home size={14} /> {listing.district}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>AED {listing.rent_per_room} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ month</span></div>
                    </div>
                </div>

                {/* WIZARD CONTENT */}

                {/* STEP 1: Commercial Agreement */}
                {step === 1 && (
                    <div className="glass-card" style={{ padding: '2rem', animation: 'fade-in 0.3s ease-out' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={24} style={{ color: 'var(--primary)' }} />
                            Step 1: Commercial Terms
                        </h2>
                        
                        <div style={{ background: 'var(--bg-surface-2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Tenant:</span> {tenant.name}</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Landlord:</span> {landlord.name}</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Rent:</span> AED {listing.rent_per_room} / month</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Security Deposit:</span> AED {listing.rent_per_room} (1 month)</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Utilities (DEWA):</span> Split equally among tenants</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Cheque Frequency:</span> 4 Cheques</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {isTenant && (
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: tenantAgreed ? 'rgba(34,197,94,0.1)' : 'var(--bg-base)', border: `1px solid ${tenantAgreed ? 'var(--success)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={tenantAgreed} onChange={(e) => setTenantAgreed(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--success)' }} />
                                    <span style={{ fontWeight: tenantAgreed ? 600 : 400, color: tenantAgreed ? 'var(--success)' : 'var(--text-primary)' }}>I, {tenant.name}, agree to these commercial terms.</span>
                                </label>
                            )}
                            
                            {isLandlord && (
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: landlordAgreed ? 'rgba(34,197,94,0.1)' : 'var(--bg-base)', border: `1px solid ${landlordAgreed ? 'var(--success)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={landlordAgreed} onChange={(e) => setLandlordAgreed(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--success)' }} />
                                    <span style={{ fontWeight: landlordAgreed ? 600 : 400, color: landlordAgreed ? 'var(--success)' : 'var(--text-primary)' }}>I, {landlord.name}, agree to these commercial terms.</span>
                                </label>
                            )}

                            {/* Simulation overrides for demo purposes (so one user can bypass the other's check) */}
                            <button 
                                className="btn btn-primary" 
                                style={{ marginTop: '1rem', width: '100%' }}
                                disabled={isTenant ? !tenantAgreed : !landlordAgreed}
                                onClick={() => setStep(2)}
                            >
                                Confirm Terms & Proceed
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Ejari Verification */}
                {step === 2 && (
                    <div className="glass-card" style={{ padding: '2rem', animation: 'fade-in 0.3s ease-out' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
                            Step 2: DLD Ejari Verification
                        </h2>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            To legally bind this tenancy, the Dubai Land Department requires the contract to be registered via Ejari. The Landlord/Agent must provide the Draft Ejari Number for platform validation before payments can be processed.
                        </p>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Ejari Draft Number <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="e.g., EJARI-2026-001" 
                                value={ejariNumber}
                                disabled={isTenant && ejariNumber === ''} // Only landlord types it in a real scenario, but we let anyone test it here
                                onChange={(e) => {
                                    setEjariNumber(e.target.value);
                                    setEjariResult(null);
                                }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Test with <code style={{ color: 'var(--text-primary)' }}>EJARI-</code> prefix to simulate a successful DLD handshake.
                            </p>
                        </div>

                        {ejariResult && (
                            <div style={{ 
                                padding: '1rem', 
                                borderRadius: 'var(--radius-md)', 
                                marginBottom: '1.5rem',
                                background: ejariResult.isValid ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${ejariResult.isValid ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: '0.75rem'
                            }}>
                                {ejariResult.isValid ? (
                                    <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
                                ) : (
                                    <AlertCircle size={20} style={{ color: 'var(--error)' }} />
                                )}
                                <div>
                                    <div style={{ fontWeight: 600, color: ejariResult.isValid ? 'var(--success)' : 'var(--error)', marginBottom: '0.25rem' }}>
                                        {ejariResult.isValid ? 'DLD Contract Verified' : 'Verification Failed'}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                        {ejariResult.statusMessage}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                            <button 
                                className="btn btn-primary" 
                                style={{ flex: 1 }} 
                                disabled={!ejariNumber || isVerifyingEjari}
                                onClick={handleVerifyEjari}
                            >
                                {isVerifyingEjari ? 'Verifying with DLD API...' : 'Verify Ejari Number'}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Financial Closing */}
                {step === 3 && (
                    <div className="glass-card" style={{ padding: '2rem', animation: 'fade-in 0.3s ease-out' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={24} style={{ color: 'var(--success)' }} />
                            Step 3: Financial Closing
                        </h2>

                        <div style={{ background: 'var(--bg-surface-2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                <span>1st Month Rent (Cheque to Landlord)</span>
                                <span style={{ fontWeight: 600 }}>AED {listing.rent_per_room}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                <span>Security Deposit (Cheque to Landlord)</span>
                                <span style={{ fontWeight: 600 }}>AED {listing.rent_per_room}</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 700 }}>
                                <span>Total Due at Move-In</span>
                                <span>AED {listing.rent_per_room * 2}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                All payments are made directly to the landlord. NestMatch does not process or hold any funds.
                            </p>
                        </div>

                        {isTenant ? (
                            <div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: 'var(--success)', borderColor: 'var(--success)' }}
                                    onClick={handleFinalizeLease}
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment ? <span className="spin">⌛</span> : <CheckCircle2 size={18} />}
                                    {isProcessingPayment ? 'Finalizing...' : 'Confirm & Finalize Lease'}
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                                    By confirming, you acknowledge that cheques have been issued directly to the landlord.
                                </p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                                <Lock size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>Waiting for the tenant to confirm the lease agreement.</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Once confirmed, the lease will be marked as active.</p>
                            </div>
                        )}
                        
                    </div>
                )}
            </div>
        </div>
    );
}
