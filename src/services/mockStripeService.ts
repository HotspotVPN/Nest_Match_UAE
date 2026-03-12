// ─── NestMatch UAE — Mock Stripe Service ──────────────────────
// Simulates Stripe pre-authorization holds for the Two-Way Commitment system.
//
// LEGAL CONSTRAINT (RERA): This is NOT a "viewing fee."
// This is a "Platform Abuse Penalty" — a SaaS-level Terms of Service enforcement.
// The hold is a pre-authorization (capture_method: 'manual') that is VOIDED
// if both parties attend. Money is ONLY captured if a party commits Platform Abuse
// (i.e., fails to attend a confirmed viewing).
//
// In Stripe, AED is processed in fils: 50 AED = 5000 fils.

export interface StripePaymentIntent {
    id: string;
    amount: number;             // In fils (5000 = 50 AED)
    currency: 'aed';
    capture_method: 'manual';   // Pre-authorization — NOT an immediate charge
    status: 'requires_confirmation' | 'requires_capture' | 'succeeded' | 'canceled';
    client_secret: string;
    customer: string;
    created: number;
    description: string;        // MUST say "Platform Abuse Penalty" — NEVER "viewing fee"
}

let intentCounter = 1000;

function generateIntentId(): string {
    intentCounter++;
    return `pi_sim_${Date.now()}_${intentCounter}`;
}

/**
 * Create a pre-authorization hold on a tenant's card.
 * This is a manual-capture PaymentIntent (hotel-style hold).
 * The tenant's card is authorized but NOT charged.
 *
 * @param tenantStripeCustomerId - The tenant's Stripe Customer ID
 * @param amountAed - Amount in AED (default 50)
 * @returns Simulated PaymentIntent with client_secret for frontend card element
 */
export async function createHoldAuthorization(
    tenantStripeCustomerId: string,
    amountAed: number = 50
): Promise<StripePaymentIntent> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const intentId = generateIntentId();
            resolve({
                id: intentId,
                amount: amountAed * 100,  // Convert AED to fils
                currency: 'aed',
                capture_method: 'manual',
                status: 'requires_capture',
                client_secret: `${intentId}_secret_${Math.random().toString(36).slice(2)}`,
                customer: tenantStripeCustomerId,
                created: Math.floor(Date.now() / 1000),
                description: 'NestMatch Platform Abuse Penalty Authorization — Viewing Commitment Hold',
            });
        }, 600);
    });
}

/**
 * Capture a hold — tenant committed Platform Abuse (ghosted a confirmed viewing).
 * This converts the pre-authorization into an actual charge.
 *
 * LEGAL NOTE: This is a SaaS Terms of Service penalty for Platform Abuse.
 * The money goes to NestMatch as platform revenue, NOT to the landlord as a "viewing fee."
 *
 * @param paymentIntentId - The PaymentIntent ID from createHoldAuthorization
 */
export async function captureAbusePenalty(
    paymentIntentId: string
): Promise<StripePaymentIntent> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: paymentIntentId,
                amount: 5000,
                currency: 'aed',
                capture_method: 'manual',
                status: 'succeeded',
                client_secret: '',
                customer: '',
                created: Math.floor(Date.now() / 1000),
                description: 'Platform Abuse Penalty Captured — Tenant No-Show on Confirmed Viewing',
            });
        }, 400);
    });
}

/**
 * Void (cancel) a hold — both parties attended, no abuse occurred.
 * The pre-authorization is released and the tenant is never charged.
 *
 * @param paymentIntentId - The PaymentIntent ID from createHoldAuthorization
 */
export async function voidHoldAuthorization(
    paymentIntentId: string
): Promise<StripePaymentIntent> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: paymentIntentId,
                amount: 5000,
                currency: 'aed',
                capture_method: 'manual',
                status: 'canceled',
                client_secret: '',
                customer: '',
                created: Math.floor(Date.now() / 1000),
                description: 'Hold Released — Viewing Completed Successfully, No Penalty Applied',
            });
        }, 300);
    });
}

/**
 * Charge the landlord off-session for Platform Abuse (ghosted a confirmed viewing).
 *
 * This creates a NEW PaymentIntent against the landlord's stored payment method
 * and immediately captures it. The innocent tenant's hold is voided separately.
 *
 * LEGAL NOTE: This is a confirmed, immediate charge — not a pre-auth.
 * The landlord agreed to this penalty when they accepted the viewing.
 *
 * @param landlordStripeCustomerId - The landlord's Stripe Customer ID
 * @param amountAed - Penalty amount in AED (default 50)
 */
export async function chargeOffSessionPenalty(
    landlordStripeCustomerId: string,
    amountAed: number = 50
): Promise<StripePaymentIntent> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const intentId = generateIntentId();
            resolve({
                id: intentId,
                amount: amountAed * 100,
                currency: 'aed',
                capture_method: 'manual',
                status: 'succeeded',
                client_secret: '',
                customer: landlordStripeCustomerId,
                created: Math.floor(Date.now() / 1000),
                description: 'Platform Abuse Penalty Captured — Landlord No-Show on Confirmed Viewing',
            });
        }, 500);
    });
}
