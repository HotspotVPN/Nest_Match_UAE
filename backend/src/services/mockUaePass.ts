/**
 * Mock UAE PASS Service (Cloudflare Worker Implementation)
 * Simulates national digital identity verification.
 */

export const getMockUaePassUser = (code: string) => {
  // In demo mode, the code is just the user ID we want to simulate
  const baseId = code.replace('MOCK-CODE-', '');
  
  return {
    uaePassId: `uaepass_${baseId}`,
    emiratesId: `784-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1 + Math.random() * 9)}`,
    name: 'Verified User',
    email: `${baseId}@demo.uaepass.ae`,
    tier: 2
  };
};
