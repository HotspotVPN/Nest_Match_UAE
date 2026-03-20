import { useState, useRef, useEffect } from 'react';
import { Home, Search, Building2, Briefcase, ShieldCheck, ChevronDown, Award, Star } from 'lucide-react';
import type { User, VerificationTier } from '@/types';
import { getTierLabel, getTierColor } from '@/utils/accessControl';

// ── Role helpers ────────────────────────────────────────────
function getRoleLabel(user: User): string {
    if (user.type === 'landlord') return 'Landlord';
    if (user.type === 'letting_agent') return 'Agent';
    if (user.type === 'compliance') return 'Compliance';
    if (user.type === 'operations') return 'Operations';
    if (user.type === 'roommate') {
        return user.resident_role === 'residing' ? 'Resident' : 'Searcher';
    }
    return 'User';
}

function getRoleIcon(user: User) {
    if (user.type === 'landlord') return Building2;
    if (user.type === 'letting_agent') return Briefcase;
    if (user.resident_role === 'residing') return Home;
    return Search;
}

function getRoleColor(user: User): string {
    if (user.type === 'landlord') return '#a855f7'; // purple
    if (user.type === 'letting_agent') return '#f97316'; // orange
    if (user.type === 'compliance' || user.type === 'operations') return '#6366f1'; // indigo
    if (user.resident_role === 'residing') return '#22c55e'; // green
    return '#3b82f6'; // blue (searching)
}

function getTierBadgeColor(tier: VerificationTier): { bg: string; border: string; text: string } {
    switch (tier) {
        case 'tier2_uae_pass':
            return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' };
        case 'tier1_unverified':
            return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94a3b8' };
        case 'tier0_passport':
            return { bg: 'rgba(180,130,80,0.1)', border: 'rgba(180,130,80,0.3)', text: '#b4824f' };
    }
}

// ── Compact Pill (for user cards, chat, roommate lists) ─────
export function UserBadgePill({ user }: { user: User }) {
    const RoleIcon = getRoleIcon(user);
    const roleColor = getRoleColor(user);
    const tierColors = getTierBadgeColor(user.verification_tier);

    return (
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {/* Role pill */}
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.625rem',
                fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase',
                background: `${roleColor}15`, border: `1px solid ${roleColor}40`,
                color: roleColor,
            }}>
                <RoleIcon size={10} /> {getRoleLabel(user)}
            </span>
            {/* Tier pill */}
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.625rem',
                fontWeight: 600,
                background: tierColors.bg, border: `1px solid ${tierColors.border}`,
                color: tierColors.text,
            }}>
                <ShieldCheck size={10} /> {getTierLabel(user.verification_tier)}
            </span>
        </div>
    );
}

// ── Combined Badge with Dropdown (for Profile page header) ──
export function UserBadgeDropdown({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const RoleIcon = getRoleIcon(user);
    const roleColor = getRoleColor(user);
    const tierColors = getTierBadgeColor(user.verification_tier);
    const tierLabel = getTierLabel(user.verification_tier);

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Trigger pill */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    background: `${roleColor}12`, border: `1px solid ${roleColor}35`,
                    color: roleColor,
                }}
            >
                <RoleIcon size={14} />
                {getRoleLabel(user)}
                <span style={{ margin: '0 0.125rem', opacity: 0.4 }}>·</span>
                <span style={{ color: tierColors.text, fontWeight: 600 }}>{tierLabel.split(' — ')[1]}</span>
                <ChevronDown size={12} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 0.375rem)', left: 0, zIndex: 50,
                    minWidth: '240px', padding: '1rem',
                    borderRadius: 'var(--radius-lg, 12px)',
                    background: 'var(--bg-surface, #1a1a2e)', border: '1px solid var(--border-subtle, #333)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}>
                    {/* Role */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `${roleColor}20`,
                        }}>
                            <RoleIcon size={14} style={{ color: roleColor }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: roleColor }}>{getRoleLabel(user)}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #888)' }}>
                                {user.type === 'roommate' && user.resident_role === 'residing' ? 'Currently residing at a property' : user.type === 'roommate' ? 'Searching for shared housing' : user.type === 'landlord' ? 'Property owner' : user.type === 'letting_agent' ? 'RERA-licensed agent' : 'Platform administrator'}
                            </div>
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle, #333)', margin: '0.5rem 0' }} />

                    {/* Tier */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', marginTop: '0.75rem' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: tierColors.bg,
                        }}>
                            <ShieldCheck size={14} style={{ color: tierColors.text }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: tierColors.text }}>{tierLabel}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #888)' }}>
                                {user.verification_tier === 'tier2_uae_pass' ? 'UAE PASS verified identity' : user.verification_tier === 'tier0_passport' ? 'Passport uploaded — awaiting UAE PASS' : 'Email registered — identity pending'}
                            </div>
                        </div>
                    </div>

                    {/* GCC Score (if applicable) */}
                    {user.gccScore > 0 && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle, #333)', margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(245,158,11,0.15)',
                                }}>
                                    <Award size={14} style={{ color: '#f59e0b' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b' }}>GCC Score: {user.gccScore}</div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #888)' }}>
                                        {user.gccScore >= 80 ? 'Excellent conduct record' : user.gccScore >= 50 ? 'Good conduct record' : 'Building conduct history'}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Premium */}
                    {user.isPremium && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle, #333)', margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(245,158,11,0.15)',
                                }}>
                                    <Star size={14} style={{ color: '#f59e0b' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f59e0b' }}>Premium Member</div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #888)' }}>Access to occupant profiles & priority matching</div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Member since */}
                    {user.created_at && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted, #888)', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle, #333)' }}>
                            Member since {new Date(user.created_at).toLocaleDateString('en-AE', { month: 'short', year: 'numeric' })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
