import { useState } from 'react';
import type { User, KycDocument } from '@/types';
import { ShieldCheck, Upload, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

interface Props {
    user: User;
    onClose: () => void;
    onUpdate: (user: User) => void;
}

export default function PassportKycModal({ user, onClose, onUpdate }: Props) {
    const [passportUploaded, setPassportUploaded] = useState(false);
    const [visaUploaded, setVisaUploaded] = useState(false);
    const [passportNumber, setPassportNumber] = useState(user.passport_number || '');
    const [visaType, setVisaType] = useState(user.visa_type || '');
    const [nationality, setNationality] = useState(user.nationality || '');
    const [submitted, setSubmitted] = useState(false);

    const canSubmit = passportUploaded && visaUploaded && passportNumber.trim() && visaType && nationality.trim();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Upload passport via API with fallback
            await api.uploadKycDocument('passport', {
                passport_number: passportNumber,
                visa_type: visaType,
                nationality: nationality,
            });

            // Upload visa page via API with fallback
            await api.uploadKycDocument('visa_page', {
                passport_number: passportNumber,
                visa_type: visaType,
                nationality: nationality,
            });
        } catch {
            // Fallback handled inside api.uploadKycDocument — continue with local update
        }

        // Always update local state (mock fallback)
        const now = new Date().toISOString().split('T')[0];
        const newDocs: KycDocument[] = [
            {
                id: `kyc-${user.id}-passport`,
                user_id: user.id,
                doc_type: 'passport',
                r2_key: `kyc/${user.id}/passport.jpg`,
                uploaded_at: now,
                review_status: 'pending',
            },
            {
                id: `kyc-${user.id}-visa`,
                user_id: user.id,
                doc_type: 'visa_page',
                r2_key: `kyc/${user.id}/visa.jpg`,
                uploaded_at: now,
                review_status: 'pending',
            },
        ];

        const updatedUser: User = {
            ...user,
            verification_tier: 'tier0_passport',
            passport_number: passportNumber,
            visa_type: visaType,
            nationality: nationality,
            kyc_documents: newDocs,
        };

        onUpdate(updatedUser);
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={32} style={{ color: '#f59e0b' }} />
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>Documents Submitted</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Your passport and visa page are under review. You now have Tier 0 access — you can browse, request viewings, and chat.
                        </p>
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: '0.8125rem', color: '#f59e0b' }}>Manual review typically completes within 24 hours</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={24} style={{ color: '#f59e0b' }} /> Verify your identity to continue
                    </h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Upload your passport and visa page to unlock Tier 0 access. This lets you browse listings, request viewings, and chat with landlords while your Emirates ID is being processed.
                </p>

                {/* Upload zones */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div
                        onClick={() => setPassportUploaded(true)}
                        style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: `2px dashed ${passportUploaded ? 'var(--success)' : 'var(--border-strong)'}`,
                            background: passportUploaded ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {passportUploaded ? (
                            <CheckCircle2 size={32} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                        ) : (
                            <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        )}
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Passport</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {passportUploaded ? 'Uploaded' : 'Click to upload'}
                        </div>
                    </div>

                    <div
                        onClick={() => setVisaUploaded(true)}
                        style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: `2px dashed ${visaUploaded ? 'var(--success)' : 'var(--border-strong)'}`,
                            background: visaUploaded ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {visaUploaded ? (
                            <CheckCircle2 size={32} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                        ) : (
                            <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        )}
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Visa Page</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {visaUploaded ? 'Uploaded' : 'Click to upload'}
                        </div>
                    </div>
                </div>

                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                            Passport Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. A12345678"
                            value={passportNumber}
                            onChange={e => setPassportNumber(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                            Visa Type
                        </label>
                        <select
                            className="form-control"
                            value={visaType}
                            onChange={e => setVisaType(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            <option value="">Select visa type</option>
                            <option value="Employment">Employment</option>
                            <option value="Residence">Residence</option>
                            <option value="Student">Student</option>
                            <option value="Visit">Visit</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                            Nationality
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Nigerian"
                            value={nationality}
                            onChange={e => setNationality(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        />
                    </div>
                </div>

                {/* Amber note */}
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.8125rem', color: '#f59e0b' }}>
                            Documents are reviewed manually within 24 hours. You will receive Tier 0 access immediately — browse, chat, and request viewings while your Emirates ID is being processed.
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', opacity: canSubmit && !isSubmitting ? 1 : 0.5 }}
                    disabled={!canSubmit || isSubmitting}
                >
                    <ShieldCheck size={18} /> {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    (Demo: documents are not actually stored)
                </p>
            </div>
        </div>
    );
}
