/**
 * Mock DLD Service (Cloudflare Worker Implementation)
 * Synchronous simulation of Dubai Land Department permit verification.
 */

export const verifySharedHousingPermit = (permit: string, makani: string) => {
  // Mock logic: permit starting with 'DLD-SH' is valid
  if (permit.startsWith('DLD-SH') && makani.length === 10) {
    return {
      success: true,
      maxLegalOccupancy: 4, // Default mock occupancy
      expiryDate: '2026-12-31'
    };
  }
  return { success: false, error: 'Invalid permit or Makani number' };
};

export const verifyTrakheesiPermit = (permit: string) => {
  return permit.startsWith('TRAK-');
};

export const verifyEjariRegistration = (ejari: string) => {
  return ejari.startsWith('EJARI-');
};
