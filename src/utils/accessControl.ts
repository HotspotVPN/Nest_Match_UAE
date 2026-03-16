import type { User, VerificationTier } from '@/types';

export function canRequestViewing(user: User | null): boolean {
    if (!user) return false;
    return user.verification_tier === 'tier0_passport' || user.verification_tier === 'tier2_uae_pass';
}

export function canChat(user: User | null): boolean {
    if (!user) return false;
    return user.verification_tier === 'tier0_passport' || user.verification_tier === 'tier2_uae_pass';
}

export function canSignViewingAgreement(user: User | null): boolean {
    if (!user) return false;
    return user.verification_tier === 'tier0_passport' || user.verification_tier === 'tier2_uae_pass';
}

export function canSignTenancyContract(user: User | null): boolean {
    if (!user) return false;
    return user.verification_tier === 'tier2_uae_pass';
}

export function canApply(user: User | null): boolean {
    if (!user) return false;
    return user.verification_tier === 'tier2_uae_pass';
}

export function getTierLabel(tier: VerificationTier): string {
    switch(tier) {
        case 'tier0_passport': return 'Tier 0 — Explorer';
        case 'tier1_unverified': return 'Tier 1 — Verified';
        case 'tier2_uae_pass': return 'Tier 3 — Gold';
    }
}

export function getTierColor(tier: VerificationTier): string {
    switch(tier) {
        case 'tier0_passport': return 'var(--text-muted)';
        case 'tier1_unverified': return 'var(--warning)';
        case 'tier2_uae_pass': return 'var(--success)';
    }
}

// ── FUTURE PHASE scaffolds (licence required) ──────────
export function canUseWallet(_user: User | null): boolean {
    return false; // TODO Phase 1: return tier2_uae_pass when CBUAE obtained
}

export function canPayPlatformFee(_user: User | null): boolean {
    return false; // TODO Phase 1: unlock with wallet system
}

export function canAccessTenancyPortal(_user: User | null): boolean {
    return false; // TODO Phase 2: unlock when RERA broker licence obtained
}
