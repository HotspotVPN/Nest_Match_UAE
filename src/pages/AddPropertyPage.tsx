import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, MapPin, Building2, Users as UsersIcon } from 'lucide-react';

type Step = 'permits' | 'occupancy' | 'pricing' | 'review';
const STEPS: Step[] = ['permits', 'occupancy', 'pricing', 'review'];
const STEP_LABELS = { permits: 'Location & Permits', occupancy: 'Occupancy & Rules', pricing: 'Pricing & Details', review: 'Review & Submit' };

export default function AddPropertyPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('permits');
    const [form, setForm] = useState({
        title: '', address: '', district: 'Dubai Marina',
        makaniNumber: '', trakheesiPermit: '', municipalityPermit: '',
        maxLegalOccupancy: 3, totalRooms: 3, rentPerRoom: 3500, deposit: 3500,
        amenities: ['Central AC', 'Pool', 'Gym'],
        houseRules: ['No smoking', 'Quiet hours 10PM-7AM'],
        description: '', billsIncluded: true,
    });

    if (!currentUser || (currentUser.type !== 'landlord' && currentUser.type !== 'letting_agent')) {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Landlord / Agent access only</h2></div>;
    }

    const stepIdx = STEPS.indexOf(step);
    const makaniValid = /^\d{10}$/.test(form.makaniNumber);
    const update = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}><ArrowLeft size={14} /> Back</button>
                <h2 style={{ marginBottom: '0.5rem' }}>Add New Property</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>All properties must comply with Dubai Law No. 4 of 2026</p>

                {/* Progress */}
                <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                    {STEPS.map((s, i) => (
                        <div key={s} className={`progress-step ${i < stepIdx ? 'completed' : i === stepIdx ? 'active' : ''}`} />
                    ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>Step {stepIdx + 1}: {STEP_LABELS[step]}</div>

                <div className="glass-card" style={{ padding: '2rem' }}>
                    {/* Step 1: Permits */}
                    {step === 'permits' && (
                        <>
                            <h3 style={{ marginBottom: '1rem' }}><MapPin size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Location & Permits</h3>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Property Title</label>
                                <input className="form-input" placeholder="e.g. Premium Marina View — 3BR Shared Apartment" value={form.title} onChange={e => update('title', e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input className="form-input" placeholder="Building name, street" value={form.address} onChange={e => update('address', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">District</label>
                                    <select className="form-input form-select" value={form.district} onChange={e => update('district', e.target.value)}>
                                        {['Dubai Marina', 'JLT', 'Downtown Dubai', 'Business Bay', 'JBR', 'Al Barsha', 'JVC', 'Sports City', 'Silicon Oasis'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <hr className="divider" />
                            <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} style={{ color: 'var(--uaepass-green-light)' }} /> Compliance Permits</h4>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Makani Number (10 digits) *</label>
                                <input className="form-input" placeholder="e.g. 2567834901" maxLength={10} value={form.makaniNumber} onChange={e => update('makaniNumber', e.target.value.replace(/\D/g, ''))} style={{ borderColor: form.makaniNumber && !makaniValid ? 'var(--error)' : undefined }} />
                                {form.makaniNumber && !makaniValid && <span style={{ fontSize: '0.75rem', color: 'var(--error)' }}>Must be exactly 10 digits</span>}
                                {makaniValid && <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={12} /> Valid Makani format</span>}
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Municipality Shared Housing Permit *</label>
                                <input className="form-input" placeholder="e.g. DM-SH-2026-001234" value={form.municipalityPermit} onChange={e => update('municipalityPermit', e.target.value)} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Trakheesi Advertising Permit</label>
                                <input className="form-input" placeholder="e.g. TRAK-2025-DM-78901" value={form.trakheesiPermit} onChange={e => update('trakheesiPermit', e.target.value)} />
                            </div>

                            <button onClick={() => setStep('occupancy')} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!form.title || !form.address || !makaniValid || !form.municipalityPermit}>
                                Continue <ArrowRight size={16} />
                            </button>
                        </>
                    )}

                    {/* Step 2: Occupancy */}
                    {step === 'occupancy' && (
                        <>
                            <button onClick={() => setStep('permits')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}><ArrowLeft size={14} /> Back</button>
                            <h3 style={{ marginBottom: '1rem' }}><UsersIcon size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Occupancy & Rules</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Max Legal Occupancy *</label>
                                    <input type="number" className="form-input" min={1} max={10} value={form.maxLegalOccupancy} onChange={e => update('maxLegalOccupancy', Number(e.target.value))} />
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>As stated on Municipality permit</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Rooms</label>
                                    <input type="number" className="form-input" min={1} max={10} value={form.totalRooms} onChange={e => update('totalRooms', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Amenities</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {form.amenities.map(a => <span key={a} className="tag">{a}</span>)}
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">House Rules</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                    {form.houseRules.map(r => <span key={r} className="tag">{r}</span>)}
                                </div>
                            </div>
                            <button onClick={() => setStep('pricing')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                Continue <ArrowRight size={16} />
                            </button>
                        </>
                    )}

                    {/* Step 3: Pricing */}
                    {step === 'pricing' && (
                        <>
                            <button onClick={() => setStep('occupancy')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}><ArrowLeft size={14} /> Back</button>
                            <h3 style={{ marginBottom: '1rem' }}><Building2 size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Pricing & Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Rent per Room (AED/month) *</label>
                                    <input type="number" className="form-input" min={500} value={form.rentPerRoom} onChange={e => update('rentPerRoom', Number(e.target.value))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deposit (AED) *</label>
                                    <input type="number" className="form-input" min={0} value={form.deposit} onChange={e => update('deposit', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-input" placeholder="Describe the property..." value={form.description} onChange={e => update('description', e.target.value)} />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.billsIncluded} onChange={e => update('billsIncluded', e.target.checked)} /> Bills included (DEWA, Internet, Chiller)
                            </label>
                            <button onClick={() => setStep('review')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                Review Listing <ArrowRight size={16} />
                            </button>
                        </>
                    )}

                    {/* Step 4: Review */}
                    {step === 'review' && (
                        <>
                            <button onClick={() => setStep('pricing')} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}><ArrowLeft size={14} /> Back</button>
                            <h3 style={{ marginBottom: '1rem' }}>Review & Submit</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {[
                                    { label: 'Title', value: form.title },
                                    { label: 'District', value: form.district },
                                    { label: 'Makani', value: form.makaniNumber, check: true },
                                    { label: 'Municipality Permit', value: form.municipalityPermit, check: true },
                                    { label: 'Trakheesi Permit', value: form.trakheesiPermit || 'N/A' },
                                    { label: 'Max Occupancy', value: `${form.maxLegalOccupancy} persons`, check: true },
                                    { label: 'Total Rooms', value: `${form.totalRooms}` },
                                    { label: 'Rent/Room', value: `AED ${form.rentPerRoom}` },
                                    { label: 'Deposit', value: `AED ${form.deposit}` },
                                    { label: 'Bills', value: form.billsIncluded ? 'Included' : 'Split' },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)' }}>
                                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.label}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            {item.value}
                                            {item.check && <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/profile')} className="btn btn-uaepass btn-lg" style={{ width: '100%' }}>
                                <ShieldCheck size={18} /> Submit for Verification
                            </button>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                                Listing will be verified against RERA and Municipality records before going live.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
