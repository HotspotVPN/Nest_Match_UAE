import { useState, useRef, useEffect, useCallback } from 'react';
import type { ViewingBooking, Listing, User, ViewingAgreementRecord, DigitalSignature } from '@/types';
import { X, FileText, CheckCircle2, Clock, Pen, Download, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

interface Props {
    viewing: ViewingBooking;
    property: Listing;
    tenant: User;
    agent: User;
    onClose: () => void;
    onAgreementUpdate: (updated: ViewingBooking) => void;
}

type Screen = 'generate' | 'awaiting' | 'sign';
type SigningFor = 'broker' | 'tenant';

export default function ViewingAgreementModal({ viewing, property, tenant, agent, onClose, onAgreementUpdate }: Props) {
    const hasAgreement = !!viewing.agreement;
    const [screen, setScreen] = useState<Screen>(hasAgreement ? 'awaiting' : 'generate');
    const [agreement, setAgreement] = useState<ViewingAgreementRecord | undefined>(viewing.agreement);
    const [signingFor, setSigningFor] = useState<SigningFor>('broker');

    // Generate form state
    const [orn, setOrn] = useState(viewing.agreement?.broker_orn || agent.rera_license || '');
    const [brokerCompany, setBrokerCompany] = useState(viewing.agreement?.broker_company || agent.agency_name || '');
    const [brokerBrn, setBrokerBrn] = useState(viewing.agreement?.broker_brn || '');
    const [commercialLicense, setCommercialLicense] = useState(viewing.agreement?.commercial_license || '');
    const [plotNumber, setPlotNumber] = useState(viewing.agreement?.plot_number || '');
    const [buildingNumber, setBuildingNumber] = useState(viewing.agreement?.building_number || '');

    // Loading states
    const [generating, setGenerating] = useState(false);
    const [signing, setSigning] = useState(false);

    // Signature pad state
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [signerName, setSignerName] = useState('');
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const getAgreementNumber = () => {
        const suffix = viewing.id.slice(-5).toUpperCase();
        return `NM-VA-2026-${suffix}`;
    };

    const handleGenerate = async () => {
        setGenerating(true);

        // Try real API first
        const result = await api.createAgreement({
            viewing_id: viewing.id,
            broker_orn: orn || undefined,
            commercial_license: commercialLicense || undefined,
            plot_number: plotNumber || undefined,
            building_number: buildingNumber || undefined,
        });

        if (result.success && result.data) {
            const apiAgreement: ViewingAgreementRecord = {
                id: result.data.id,
                viewing_id: result.data.viewing_id,
                agreement_number: result.data.agreement_number,
                generated_at: result.data.generated_at,
                broker_orn: result.data.broker_orn,
                broker_company: brokerCompany || undefined,
                broker_brn: result.data.broker_brn,
                commercial_license: result.data.commercial_license,
                plot_number: result.data.plot_number,
                building_number: result.data.building_number,
                signatures: [],
                status: result.data.status || 'sent',
            };
            setAgreement(apiAgreement);
            const updated: ViewingBooking = { ...viewing, status: 'AGREEMENT_SENT', agreement: apiAgreement, updated_at: new Date().toISOString() };
            onAgreementUpdate(updated);
        } else {
            // Fallback to local DemoStateContext
            const newAgreement: ViewingAgreementRecord = {
                id: `va-${viewing.id}`,
                viewing_id: viewing.id,
                agreement_number: getAgreementNumber(),
                generated_at: new Date().toISOString(),
                broker_orn: orn || undefined,
                broker_company: brokerCompany || undefined,
                broker_brn: brokerBrn || undefined,
                commercial_license: commercialLicense || undefined,
                plot_number: plotNumber || undefined,
                building_number: buildingNumber || undefined,
                signatures: [],
                status: 'sent',
            };
            setAgreement(newAgreement);
            const updated: ViewingBooking = { ...viewing, status: 'AGREEMENT_SENT', agreement: newAgreement, updated_at: new Date().toISOString() };
            onAgreementUpdate(updated);
        }

        setGenerating(false);
        setScreen('awaiting');
    };

    const handleStartSign = (role: SigningFor) => {
        setSigningFor(role);
        setSignerName(role === 'broker' ? agent.name : tenant.name);
        setHasContent(false);
        setScreen('sign');
    };

    const handleDemoAutoSign = () => {
        if (!agreement) return;
        const now = new Date().toISOString();
        const brokerSig: DigitalSignature = {
            signer_id: agent.id,
            signer_name: agent.name,
            signer_role: 'broker',
            signed_at: now,
            signature_data: 'data:image/png;base64,demo_auto_sig_broker',
            ip_simulated: '192.168.1.100',
        };
        const tenantSig: DigitalSignature = {
            signer_id: tenant.id,
            signer_name: tenant.name,
            signer_role: 'tenant',
            signed_at: now,
            signature_data: 'data:image/png;base64,demo_auto_sig_tenant',
            ip_simulated: '192.168.1.101',
        };
        const updatedAgreement: ViewingAgreementRecord = {
            ...agreement,
            signatures: [brokerSig, tenantSig],
            status: 'fully_signed',
        };
        setAgreement(updatedAgreement);
        const updated: ViewingBooking = { ...viewing, status: 'FULLY_SIGNED', agreement: updatedAgreement, updated_at: now };
        onAgreementUpdate(updated);
    };

    const handleConfirmSignature = async () => {
        if (!agreement || !canvasRef.current) return;
        const now = new Date().toISOString();
        const sigData = canvasRef.current.toDataURL('image/png');

        setSigning(true);

        // Try real API first
        const result = await api.signAgreement(agreement.id, {
            signature_data: sigData,
            signer_role: signingFor,
        });

        if (result.success && result.data) {
            // Use API response for updated state
            const apiSigs: DigitalSignature[] = (result.data.signatures || []).map((s: any) => ({
                signer_id: s.signer_id,
                signer_name: s.signer_id === agent.id ? agent.name : tenant.name,
                signer_role: s.signer_role,
                signed_at: s.signed_at,
                signature_data: sigData, // Canvas data for display
                ip_simulated: '192.168.1.100',
            }));
            const newStatus = result.data.status || agreement.status;
            const viewingStatus = result.data.viewing_status ||
                (newStatus === 'fully_signed' ? 'FULLY_SIGNED' :
                 newStatus === 'agent_signed' ? 'AGENT_SIGNED' : 'AGREEMENT_SENT');

            const updatedAgreement: ViewingAgreementRecord = { ...agreement, signatures: apiSigs, status: newStatus };
            setAgreement(updatedAgreement);
            const updated: ViewingBooking = { ...viewing, status: viewingStatus as ViewingBooking['status'], agreement: updatedAgreement, updated_at: now };
            onAgreementUpdate(updated);
        } else {
            // Fallback to local DemoStateContext
            const newSig: DigitalSignature = {
                signer_id: signingFor === 'broker' ? agent.id : tenant.id,
                signer_name: signerName,
                signer_role: signingFor,
                signed_at: now,
                signature_data: sigData,
                ip_simulated: `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
            };

            const existingSigs = agreement.signatures.filter(s => s.signer_role !== signingFor);
            const allSigs = [...existingSigs, newSig];
            const hasBroker = allSigs.some(s => s.signer_role === 'broker');
            const hasTenant = allSigs.some(s => s.signer_role === 'tenant');
            const newStatus = hasBroker && hasTenant ? 'fully_signed' : hasBroker ? 'agent_signed' : 'sent';
            const viewingStatus = newStatus === 'fully_signed' ? 'FULLY_SIGNED' : newStatus === 'agent_signed' ? 'AGENT_SIGNED' : 'AGREEMENT_SENT';

            const updatedAgreement: ViewingAgreementRecord = { ...agreement, signatures: allSigs, status: newStatus };
            setAgreement(updatedAgreement);
            const updated: ViewingBooking = { ...viewing, status: viewingStatus, agreement: updatedAgreement, updated_at: now } as ViewingBooking;
            onAgreementUpdate(updated);
        }

        setSigning(false);
        setScreen('awaiting');
    };

    const handleDownloadPdf = () => {
        // Download pre-generated DLD Viewing Agreement PDF
        const agNum = agreement?.agreement_number || getAgreementNumber();
        const pdfUrl = `/samples/va-${agNum}.pdf`;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `NestMatch_Viewing_Agreement_${agNum}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Canvas drawing
    const getCanvasPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
    }, []);

    const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        lastPos.current = getCanvasPos(e);
    }, [getCanvasPos]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current || !lastPos.current) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        lastPos.current = pos;
        setHasContent(true);
    }, [isDrawing, getCanvasPos]);

    const endDraw = useCallback(() => {
        setIsDrawing(false);
        lastPos.current = null;
    }, []);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasContent(false);
    };

    useEffect(() => {
        if (screen === 'sign' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 460, 160);
            }
        }
    }, [screen]);

    const agentSigned = agreement?.signatures.some(s => s.signer_role === 'broker');
    const tenantSigned = agreement?.signatures.some(s => s.signer_role === 'tenant');

    const progressSteps = ['CONFIRMED', 'AGREEMENT SENT', 'AGENT SIGNED', 'FULLY SIGNED', 'VIEWING DAY'];
    const currentStep = !agreement ? 0
        : agreement.status === 'sent' ? 1
        : agreement.status === 'agent_signed' ? 2
        : agreement.status === 'fully_signed' ? 3
        : 0;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.375rem', fontWeight: 800 }}>
                        <FileText size={22} style={{ color: 'var(--brand-purple)' }} />
                        {screen === 'generate' ? 'Generate DLD Viewing Agreement' : screen === 'sign' ? 'Digital Signature' : 'Viewing Agreement Status'}
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={20} /></button>
                </div>

                {/* SCREEN 1: Generate Agreement */}
                {screen === 'generate' && (
                    <div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Complete the DLD viewing agreement form below. This will be sent to both parties for digital signature.
                        </p>

                        {/* Broker Details */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-purple)' }}>Broker / Agent Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Agent Name</label>
                                    <input className="form-input" value={agent.name} disabled style={{ opacity: 0.7 }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Broker Company</label>
                                    <input className="form-input" value={brokerCompany} onChange={e => setBrokerCompany(e.target.value)} placeholder="Company name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>ORN (Office Registration Number)</label>
                                    <input className="form-input" value={orn} onChange={e => setOrn(e.target.value)} placeholder="e.g., ORN-12345" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>BRN (Broker Registration Number)</label>
                                    <input className="form-input" value={brokerBrn} onChange={e => setBrokerBrn(e.target.value)} placeholder="e.g., RERA-BRN-2025-XXXXX" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Commercial License</label>
                                    <input className="form-input" value={commercialLicense} onChange={e => setCommercialLicense(e.target.value)} placeholder="DED License Number" />
                                </div>
                            </div>
                        </div>

                        {/* Tenant Details */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-purple)' }}>Tenant Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Tenant Name</label>
                                    <input className="form-input" value={tenant.name} disabled style={{ opacity: 0.7 }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Emirates ID</label>
                                    <input className="form-input" value={tenant.emiratesId || 'Not provided'} disabled style={{ opacity: 0.7 }} />
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--brand-purple)' }}>Property Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Property</label>
                                    <input className="form-input" value={property.title} disabled style={{ opacity: 0.7 }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>District</label>
                                    <input className="form-input" value={property.district} disabled style={{ opacity: 0.7 }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Makani Number</label>
                                    <input className="form-input" value={property.makaniNumber} disabled style={{ opacity: 0.7 }} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Plot Number</label>
                                    <input className="form-input" value={plotNumber} onChange={e => setPlotNumber(e.target.value)} placeholder="Plot / parcel number" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Building Number</label>
                                    <input className="form-input" value={buildingNumber} onChange={e => setBuildingNumber(e.target.value)} placeholder="Building number" />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={14} style={{ color: 'var(--brand-purple)' }} />
                                This agreement will be sent to both parties for digital signing per DLD requirements.
                            </p>
                        </div>

                        <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', fontWeight: 700 }} disabled={generating}>
                            {generating ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : 'Generate & Send for Signing'}
                        </button>
                    </div>
                )}

                {/* SCREEN 2: Awaiting Signatures */}
                {screen === 'awaiting' && agreement && (
                    <div>
                        {/* Agreement Info */}
                        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Agreement:</span> <strong>{agreement.agreement_number}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Property:</span> {property.title}</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>District:</span> {property.district}</div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Generated:</span> {new Date(agreement.generated_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 0.5rem' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', right: '1rem', height: '2px', background: 'var(--border-subtle)', transform: 'translateY(-50%)', zIndex: 0 }} />
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', width: `${(currentStep / (progressSteps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 2rem)', height: '2px', background: 'var(--success)', transform: 'translateY(-50%)', zIndex: 0, transition: 'width 0.5s' }} />
                                {progressSteps.map((label, i) => (
                                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <div style={{
                                            width: '14px', height: '14px', borderRadius: '50%',
                                            background: i <= currentStep ? 'var(--success)' : 'var(--bg-surface-2)',
                                            border: `2px solid ${i <= currentStep ? 'var(--success)' : 'var(--border-subtle)'}`,
                                            marginBottom: '0.5rem',
                                        }} />
                                        <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: i <= currentStep ? 'var(--success)' : 'var(--text-muted)', textAlign: 'center', maxWidth: '70px', lineHeight: 1.2 }}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DocuSign Verification Banner */}
                        {agreement.status === 'fully_signed' && (
                            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #16a34a, #15803d)', marginBottom: '1.5rem', color: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <ShieldCheck size={18} />
                                    <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>DocuSign Digital Verification</span>
                                </div>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.9 }}>VERIFIED — Both Parties Signed</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.85 }}>
                                    <span>Broker: {agent.name} — {agreement.signatures.find(s => s.signer_role === 'broker')?.signed_at ? new Date(agreement.signatures.find(s => s.signer_role === 'broker')!.signed_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                                    <span>Tenant: {tenant.name} — {agreement.signatures.find(s => s.signer_role === 'tenant')?.signed_at ? new Date(agreement.signatures.find(s => s.signer_role === 'tenant')!.signed_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                                </div>
                            </div>
                        )}
                        {agreement.status !== 'fully_signed' && (
                            <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0077C8, #005a9e)', marginBottom: '1.5rem', color: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <ShieldCheck size={18} />
                                    <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>DocuSign Digital Verification</span>
                                </div>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 600, opacity: 0.9 }}>PENDING — Awaiting Signatures</div>
                            </div>
                        )}

                        {/* Signing Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: agentSigned ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${agentSigned ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {agentSigned ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Clock size={18} style={{ color: 'var(--warning)' }} />}
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Agent / Broker</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agent.name}</div>
                                    </div>
                                </div>
                                {agentSigned ? (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Signed</span>
                                ) : (
                                    <button onClick={() => handleStartSign('broker')} className="btn btn-primary btn-sm" style={{ padding: '0.375rem 1rem' }}>
                                        <Pen size={12} /> Sign Now
                                    </button>
                                )}
                            </div>

                            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: tenantSigned ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tenantSigned ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {tenantSigned ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Clock size={18} style={{ color: 'var(--warning)' }} />}
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Tenant</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tenant.name}</div>
                                    </div>
                                </div>
                                {tenantSigned ? (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Signed</span>
                                ) : (
                                    <button onClick={() => handleStartSign('tenant')} className="btn btn-primary btn-sm" style={{ padding: '0.375rem 1rem' }}>
                                        <Pen size={12} /> Sign Now
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            {!agentSigned || !tenantSigned ? (
                                <button onClick={handleDemoAutoSign} className="btn btn-ghost" style={{ flex: 1, fontSize: '0.8125rem', border: '1px dashed var(--border-subtle)' }}>
                                    <Users size={14} /> Demo: auto-sign both parties
                                </button>
                            ) : null}
                            {agreement.status === 'fully_signed' && (
                                <button onClick={handleDownloadPdf} className="btn btn-primary" style={{ flex: 1 }}>
                                    <Download size={14} /> Download PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* SCREEN 3: Signature Pad */}
                {screen === 'sign' && (
                    <div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Sign as <strong>{signingFor === 'broker' ? 'Agent / Broker' : 'Tenant'}</strong> below. Draw your signature in the pad.
                        </p>

                        {/* Canvas */}
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', background: '#fff' }}>
                            <canvas
                                ref={canvasRef}
                                width={460}
                                height={160}
                                style={{ display: 'block', width: '100%', height: '160px', cursor: 'crosshair', touchAction: 'none' }}
                                onMouseDown={startDraw}
                                onMouseMove={draw}
                                onMouseUp={endDraw}
                                onMouseLeave={endDraw}
                                onTouchStart={startDraw}
                                onTouchMove={draw}
                                onTouchEnd={endDraw}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                            <button onClick={clearCanvas} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Clear Signature</button>
                        </div>

                        {/* Signer Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                                <input className="form-input" value={signerName} onChange={e => setSignerName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.75rem' }}>Date</label>
                                <input className="form-input" value={new Date().toLocaleDateString('en-AE')} disabled style={{ opacity: 0.7 }} />
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Simulated IP: 192.168.1.{Math.floor(Math.random() * 200) + 10} | This digital signature is legally binding under UAE Electronic Transactions Law.
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setScreen('awaiting')} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleConfirmSignature} className="btn btn-primary" style={{ flex: 2, fontWeight: 700 }} disabled={!hasContent || !signerName.trim() || signing}>
                                {signing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Signing...</> : <><CheckCircle2 size={14} /> Confirm Signature</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
