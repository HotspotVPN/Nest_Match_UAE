// backend/src/services/mockUaePassService.ts

export const mockUaePassService = {
  /**
   * Simulates the UAE PASS OAuth callback and identity verification.
   */
  async verifyIdentity(authCode: string) {
    console.log(`[UAE PASS Mock] Verifying auth code: ${authCode}`);
    
    // Simulate government API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Return mock Emirates ID profile data
    return {
      uae_pass_id: `uuid_${Math.random().toString(36).substr(2, 9)}`,
      fullname_en: "Verified Resident",
      nationality_en: "United Arab Emirates",
      emirates_id: "784-XXXX-XXXXXXX-X",
      is_verified: true
    };
  }
};
