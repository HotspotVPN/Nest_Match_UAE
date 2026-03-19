import { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, FileText, CheckCircle2, Loader2, Scale } from 'lucide-react';

interface ComplianceFlowProps {
    onComplete: () => void;
    propertyTitle: string;
    makaniNumber: string;
    trakheesiPermit: string;
    district: string;
}

interface Step {
    label: string;
    detail: string;
    icon: React.ReactNode;
}

export default function ComplianceFlow({ onComplete, propertyTitle, makaniNumber, trakheesiPermit, district }: ComplianceFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps: Step[] = [
        {
            label: 'Verifying UAE PASS KYC',
            detail: 'Syncing Emirates ID & Residency Status...',
            icon: <ShieldCheck size={16} />,
        },
        {
            label: 'RERA Trakheesi Check',
            detail: `Validating Permit ${trakheesiPermit || 'TRK-XXXXX'}...`,
            icon: <FileText size={16} />,
        },
        {
            label: 'Makani Geo-Verification',
            detail: `Mapping ${makaniNumber || '0000000000'} to ${district}...`,
            icon: <MapPin size={16} />,
        },
        {
            label: 'Law No. 4 Compliance',
            detail: 'Preparing for Electronic Shared Housing Registry...',
            icon: <Scale size={16} />,
        },
        {
            label: 'DocuSign Envelope Prep',
            detail: 'Injecting legal data into DLD Agreement...',
            icon: <FileText size={16} />,
        },
        {
            label: 'Registry Bridge Ready',
            detail: 'Agreement ready for DLD submission...',
            icon: <CheckCircle2 size={16} />,
        },
    ];

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            const completeTimer = setTimeout(onComplete, 800);
            return () => clearTimeout(completeTimer);
        }
    }, [currentStep, steps.length, onComplete]);

    return (
        <div style={{ padding: '1.5rem 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                    background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <ShieldCheck size={14} style={{ color: 'var(--brand-purple)' }} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Legal & Compliance Engine</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {propertyTitle}
            </p>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {steps.map((step, i) => {
                    const isComplete = i < currentStep;
                    const isActive = i === currentStep;
                    const isPending = i > currentStep;

                    return (
                        <div
                            key={step.label}
                            style={{
                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: isActive ? 'rgba(124,58,237,0.06)' : 'transparent',
                                border: isActive ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                                opacity: isPending ? 0.4 : 1,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '24px', height: '24px', borderRadius: 'var(--radius-full)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                background: isComplete ? 'rgba(34,197,94,0.12)' :
                                    isActive ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)',
                            }}>
                                {isComplete ? (
                                    <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                                ) : isActive ? (
                                    <Loader2 size={14} style={{ color: 'var(--brand-purple)', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                                )}
                            </div>

                            {/* Text */}
                            <div>
                                <div style={{
                                    fontWeight: 700, fontSize: '0.8125rem',
                                    color: isComplete ? 'var(--success)' :
                                        isActive ? 'var(--brand-purple-light)' : 'var(--text-muted)',
                                }}>
                                    {step.label}
                                </div>
                                <div style={{
                                    fontSize: '0.6875rem',
                                    color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
                                    marginTop: '0.125rem',
                                }}>
                                    {step.detail}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: '1.5rem' }}>
                <div style={{
                    height: '3px', borderRadius: '2px',
                    background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', borderRadius: '2px',
                        background: currentStep >= steps.length ? 'var(--success)' : 'var(--brand-purple)',
                        width: `${Math.min((currentStep / steps.length) * 100, 100)}%`,
                        transition: 'width 0.5s ease',
                    }} />
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.375rem',
                }}>
                    <span>{Math.min(currentStep, steps.length)}/{steps.length} checks</span>
                    <span>{currentStep >= steps.length ? 'Complete' : 'Processing...'}</span>
                </div>
            </div>
        </div>
    );
}
