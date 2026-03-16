// backend/src/services/mockStripeService.ts

export const mockStripeService = {
  /**
   * Creates a pre-authorization hold for the Platform Abuse Penalty.
   * Framed as an authorization, NOT a charge, to stay RERA compliant.
   */
  async createHoldAuthorization(userId: string, amountAed: number) {
    console.log(`[Stripe Mock] Creating ${amountAed} AED hold for user: ${userId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      id: `pi_mock_${crypto.randomUUID()}`,
      status: 'requires_capture',
      amount: amountAed * 100, // Stripe uses cents/fils
      currency: 'aed',
      capture_method: 'manual',
      client_secret: `src_mock_secret_${crypto.randomUUID()}`
    };
  },

  async voidHold(intentId: string) {
    console.log(`[Stripe Mock] Voiding hold: ${intentId}`);
    return { id: intentId, status: 'canceled' };
  },

  async capturePenalty(intentId: string) {
    console.log(`[Stripe Mock] CAPTURING PENALTY: ${intentId}`);
    return { id: intentId, status: 'succeeded' };
  }
};
