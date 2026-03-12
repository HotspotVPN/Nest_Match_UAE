import { useAuth } from '@/contexts/AuthContext';
import { users, getInitials } from '@/data/mockData';
import { Users as UsersIcon, ThumbsUp, ThumbsDown, Award, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ResidingDashboardPage() {
    const { currentUser } = useAuth();
    if (!currentUser || currentUser.resident_role !== 'residing') {
        return <div className="section container" style={{ textAlign: 'center' }}><h2>Residing Roommate access only</h2></div>;
    }

    // Show searching roommates as anonymized applicants
    const applicants = users.filter(u => u.type === 'roommate' && u.resident_role === 'searching');

    return (
        <div className="section" style={{ paddingTop: '2rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>Incoming Applicants</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    Review anonymized lifestyle profiles — no name, photo, or nationality shown.
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(45,159,79,0.08)', border: '1px solid rgba(45,159,79,0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <EyeOff size={16} style={{ color: 'var(--uaepass-green-light)' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--uaepass-green-light)' }}>Blind Match Active</strong> — Profiles are anonymized to promote cross-cultural harmony and prevent bias.
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applicants.map((applicant, i) => {
                        const gccQualified = applicant.gccScore >= 80;
                        return (
                            <div key={applicant.id} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        {/* Anonymized avatar — NO real name or photo */}
                                        <div className="avatar avatar-lg" style={{ background: 'var(--bg-surface-3)', fontSize: '1rem' }}>
                                            <Eye size={24} style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: '0.25rem' }}>Applicant #{i + 1}</h4>
                                            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                                                <span className="badge badge-uaepass" style={{ fontSize: '0.5625rem' }}><ShieldCheck size={10} /> UAE PASS</span>
                                                {gccQualified && <span className="gcc-badge" style={{ fontSize: '0.5625rem', padding: '0.125rem 0.5rem' }}><Award size={10} /> GCC {applicant.gccScore}</span>}
                                                {!gccQualified && applicant.gccScore > 0 && <span className="badge badge-orange" style={{ fontSize: '0.5625rem' }}>GCC: {applicant.gccScore}</span>}
                                                {applicant.isPremium && <span className="badge badge-gold" style={{ fontSize: '0.5625rem' }}>⭐ Premium</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {applicant.tenancy_duration_months && applicant.tenancy_duration_months > 0 && (
                                        <span className="badge badge-purple" style={{ fontSize: '0.625rem' }}>{applicant.tenancy_duration_months} months verified tenancy</span>
                                    )}
                                </div>

                                {/* Lifestyle tags — VISIBLE (this is what blind match shows) */}
                                {applicant.lifestyle_tags && applicant.lifestyle_tags.length > 0 && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activities</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                                            {applicant.lifestyle_tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Personality traits — VISIBLE */}
                                {applicant.personality_traits && applicant.personality_traits.length > 0 && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personality</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                                            {applicant.personality_traits.map(t => <span key={t} className="badge badge-purple">{t}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Hobbies — VISIBLE */}
                                {applicant.hobbies && applicant.hobbies.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hobbies</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                                            {applicant.hobbies.map(h => <span key={h} className="tag">{h}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* GCC Score bar */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        <span>GCC Score</span>
                                        <span>{applicant.gccScore}/100</span>
                                    </div>
                                    <div className="occupancy-bar" style={{ height: '6px' }}>
                                        <div className={`occupancy-bar-fill ${applicant.gccScore >= 80 ? 'safe' : applicant.gccScore >= 40 ? 'warning' : 'full'}`} style={{ width: `${applicant.gccScore}%` }} />
                                    </div>
                                </div>

                                {/* Thumbs Up / Down */}
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}><ThumbsUp size={14} /> Good Fit</button>
                                    <button className="btn btn-ghost btn-sm" style={{ flex: 1, color: 'var(--text-muted)' }}><ThumbsDown size={14} /> Not a Match</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
