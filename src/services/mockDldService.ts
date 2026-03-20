// ─── NestMatch UAE — Mock DLD API Service ─────────────────────
// Simulates integration with Dubai Municipality / DLD Shared Housing Registry
// Law No. 4 of 2026: NestMatch does NOT calculate occupancy — the government API does.

export interface SharedHousingPermitResponse {
    isValid: boolean;
    maxLegalOccupancy: number;
    permittedAreas: string;
    permitExpiry: string;
    statusMessage: string;
}

export interface TrakheesiPermitResponse {
    isValid: boolean;
    advertisingPermitId: string;
    registeredBrokerId: string;
    expiryDate: string;
    statusMessage: string;
}

export interface EjariRegistrationResponse {
    isValid: boolean;
    ejariNumber: string;
    tenancyStart: string;
    tenancyEnd: string;
    registeredLandlord: string;
    statusMessage: string;
}

/**
 * Verify a Shared Housing Permit via the Dubai Municipality Registry.
 * 
 * BUSINESS RULE: Landlords ONLY input their permit number and Makani number.
 * The `maxLegalOccupancy` is FETCHED from the government — never manually entered.
 * Errors here could result in Dh500,000 fines under Law No. 4 of 2026.
 */
export async function verifySharedHousingPermit(
    permitNumber: string,
    makaniNumber: string
): Promise<SharedHousingPermitResponse> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Validate Makani format (must be exactly 10 digits)
            if (!/^\d{10}$/.test(makaniNumber)) {
                reject(new Error('Invalid Makani Number format. Must be 10 digits.'));
                return;
            }

            // Validate permit prefix (Municipality Shared Housing permits start with "SH-")
            if (!permitNumber.startsWith('SH-')) {
                resolve({
                    isValid: false,
                    maxLegalOccupancy: 0,
                    permittedAreas: '',
                    permitExpiry: '',
                    statusMessage: 'Permit number not found in Dubai Municipality Registry. Ensure the permit starts with "SH-" prefix.',
                });
                return;
            }

            // Success — return government-validated data
            // In production: this would hit the DLD API Gateway
            const districtMap: Record<string, string> = {
                '25': 'Dubai Marina',
                '31': 'JLT, Dubai',
                '42': 'Downtown Dubai',
                '55': 'Business Bay',
                '67': 'JBR, Dubai',
                '78': 'Al Barsha',
                '89': 'JVC, Dubai',
            };

            const prefix = makaniNumber.substring(0, 2);
            const area = districtMap[prefix] || 'Dubai';

            resolve({
                isValid: true,
                maxLegalOccupancy: 4, // Hardcoded for predictable demos (would be 2-6 in production)
                permittedAreas: area,
                permitExpiry: '2027-09-01T00:00:00Z',
                statusMessage: 'Permit Validated via Dubai Municipality Registry',
            });
        }, 1500); // Simulate network latency
    });
}

/**
 * Verify a Trakheesi Advertising Permit via the DLD REES Gateway.
 * Required for any property listed for rent in Dubai.
 */
export async function verifyTrakheesiPermit(
    permitNumber: string
): Promise<TrakheesiPermitResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!permitNumber.startsWith('TRAK-')) {
                resolve({
                    isValid: false,
                    advertisingPermitId: '',
                    registeredBrokerId: '',
                    expiryDate: '',
                    statusMessage: 'Trakheesi permit not found. Ensure it starts with "TRAK-" prefix.',
                });
                return;
            }

            resolve({
                isValid: true,
                advertisingPermitId: permitNumber,
                registeredBrokerId: 'BRN-' + Math.floor(Math.random() * 90000 + 10000),
                expiryDate: '2027-03-15T00:00:00Z',
                statusMessage: 'Trakheesi Permit Validated via DLD REES Gateway',
            });
        }, 800);
    });
}

/**
 * Verify an Ejari Registration via the DLD Ejari System.
 * Required for rental contract validation.
 */
export async function verifyEjariRegistration(
    ejariNumber: string
): Promise<EjariRegistrationResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!ejariNumber.startsWith('EJARI-')) {
                resolve({
                    isValid: false,
                    ejariNumber: '',
                    tenancyStart: '',
                    tenancyEnd: '',
                    registeredLandlord: '',
                    statusMessage: 'Ejari registration not found in DLD system.',
                });
                return;
            }

            resolve({
                isValid: true,
                ejariNumber,
                tenancyStart: '2026-01-01T00:00:00Z',
                tenancyEnd: '2027-01-01T00:00:00Z',
                registeredLandlord: 'Registered via DLD Ejari System',
                statusMessage: 'Ejari Registration Verified via DLD Gateway',
            });
        }, 1000);
    });
}
