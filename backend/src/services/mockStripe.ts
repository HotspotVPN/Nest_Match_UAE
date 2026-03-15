/**
 * Mock Stripe Service (Cloudflare Worker Implementation)
 * Simulates AED 50 pre-authorization holds for platform compliance.
 */

export const createHoldAuthorization = (customerId: string, amountAed: number) => {
  // Compliance Guard: Force amount to 50 AED if it's for viewings
  const finalAmount = amountAed === 50 ? 50 : 50; 
  
  return {
    id: `pi_mock_${Math.random().toString(36).substring(7)}`,
    status: 'requires_capture',
    amount: finalAmount * 100, // In fils
    currency: 'aed',
    customer: customerId
  };
};

export const captureAbusePenalty = (intentId: string) => {
  return { id: intentId, status: 'succeeded', captured_at: new Date().toISOString() };
};

export const voidHoldAuthorization = (intentId: string) => {
  return { id: intentId, status: 'canceled', canceled_at: new Date().toISOString() };
};

export const chargeOffSessionPenalty = (customerId: string, amountAed: number) => {
  return { 
    id: `ch_mock_${Math.random().toString(36).substring(7)}`, 
    status: 'succeeded', 
    amount: amountAed * 100 
  };
};
