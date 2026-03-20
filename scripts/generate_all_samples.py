#!/usr/bin/env python3
"""
NestMatch UAE — Generate ALL sample PDFs using Government Templates
Fills actual DLD/RERA PDFs with NestMatch canonical data + DocuSign verification page
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fill_govt_templates import fill_viewing_agreement, fill_ejari_contract

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'samples')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─── VIEWING AGREEMENTS ─────────────────────────────────────────

viewing_agreements = [
    {
        # view-1: James Morrison + Khalid Al Rashid at P012 (FULLY_SIGNED)
        'filename': 'va-NM-VA-2026-IEW01.pdf',
        'agreement_number': 'NM-VA-2026-IEW01',
        'broker_orn': 'ORN-54321',
        'broker_company': 'Dubai Property Group',
        'broker_brn': 'RERA-BRN-2025-12345',
        'commercial_license': 'CL-2025-DXB-7890',
        'agent_name': 'Khalid Al Rashid',
        'agent_email': 'khalid@dubaipropertygroup.ae',
        'agent_phone': '+971 50 123 4567',
        'agent_phone_2': '',
        'agent_address': 'Office 301, Business Bay Tower, Dubai',
        'tenant_name': 'James Morrison',
        'tenant_email': 'james.morrison@email.com',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_passport': 'GB12345678',
        'tenant_phone': '+971 55 987 6543',
        'tenant_mobile': '+971 55 987 6543',
        'tenant_pobox': '1166',
        'tenant_address': 'Al Barsha, Dubai, UAE',
        'tenant_info': 'NestMatch verified tenant',
        'property_status': 'Active',
        'property_type_check': 'Apartment',
        'property_area': 'JBR — Cluster D',
        'makani_number': 'MKN-26851-JBR',
        'project_name': 'JBR Walk Tower',
        'plot_number': 'JBR-1205',
        'building_number': 'BLD-1205',
        'rental_budget': 'AED 7,500/month',
        'services_info': 'Gym, Pool, Parking, 24hr Security, Beach Access',
        'agent_signed': True,
        'tenant_signed': True,
        'agent_signed_at': '11 Mar 2026',
        'tenant_signed_at': '11 Mar 2026',
    },
    {
        # vb-aisha-1: Aisha Patel + Ahmed Al Maktoum at P008 (FULLY_SIGNED)
        'filename': 'va-NM-VA-2026-ISH01.pdf',
        'agreement_number': 'NM-VA-2026-ISH01',
        'broker_orn': 'ORN-11111',
        'broker_company': 'Al Maktoum Properties',
        'broker_brn': 'RERA-BRN-2025-11111',
        'commercial_license': 'CL-2025-DXB-1111',
        'agent_name': 'Ahmed Al Maktoum',
        'agent_email': 'ahmed@nestmatch.ae',
        'agent_phone': '+971 50 111 2222',
        'agent_phone_2': '',
        'agent_address': 'Marina Walk, Dubai Marina, Dubai',
        'tenant_name': 'Aisha Patel',
        'tenant_email': 'aisha.patel@email.com',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_passport': 'IN98765432',
        'tenant_phone': '+971 55 444 5555',
        'tenant_mobile': '+971 55 444 5555',
        'tenant_pobox': '2233',
        'tenant_address': 'Downtown Dubai, UAE',
        'tenant_info': 'Tier 2 Gold verified',
        'property_status': 'Active',
        'property_type_check': 'Apartment',
        'property_area': 'Dubai Marina',
        'makani_number': 'MKN-44521-MAR',
        'project_name': 'Marina Heights',
        'plot_number': 'MAR-808',
        'building_number': 'BLD-808',
        'rental_budget': 'AED 6,500/month',
        'services_info': 'Gym, Pool, Concierge, Marina View',
        'agent_signed': True,
        'tenant_signed': True,
        'agent_signed_at': '15 Mar 2026',
        'tenant_signed_at': '15 Mar 2026',
    },
    {
        # vb-sofia-1: Sofia Kowalski at P012 (AGREEMENT_SENT — pending)
        'filename': 'va-NM-VA-2026-SOF01.pdf',
        'agreement_number': 'NM-VA-2026-SOF01',
        'broker_orn': 'ORN-54321',
        'broker_company': 'Dubai Property Group',
        'broker_brn': 'RERA-BRN-2025-12345',
        'commercial_license': 'CL-2025-DXB-7890',
        'agent_name': 'Khalid Al Rashid',
        'agent_email': 'khalid@dubaipropertygroup.ae',
        'agent_phone': '+971 50 123 4567',
        'agent_phone_2': '',
        'agent_address': 'Office 301, Business Bay Tower, Dubai',
        'tenant_name': 'Sofia Kowalski',
        'tenant_email': 'sofia@nestmatch.ae',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_passport': 'PL55667788',
        'tenant_phone': '+971 55 666 7777',
        'tenant_mobile': '+971 55 666 7777',
        'tenant_pobox': '',
        'tenant_address': 'Al Qusais, Dubai, UAE',
        'tenant_info': 'Tier 0 — Explorer',
        'property_status': 'Active',
        'property_type_check': 'Apartment',
        'property_area': 'JBR — Walk Tower',
        'makani_number': 'MKN-26851-JBR',
        'project_name': 'JBR Walk Tower',
        'plot_number': 'JBR-1205',
        'building_number': 'BLD-1205',
        'rental_budget': 'AED 7,000/month',
        'services_info': 'Gym, Pool, Parking, Beach Access',
        'agent_signed': False,
        'tenant_signed': False,
        'agent_signed_at': '',
        'tenant_signed_at': '',
    },
]

# ─── EJARI CONTRACTS ────────────────────────────────────────────

ejari_contracts = [
    {
        'filename': 'ejari-EJ-2026-001234.pdf',
        'ejari_number': 'EJ-2026-001234',
        'ejari_status': 'Active',
        'contract_date': '15 Dec 2025',
        'owner_name': 'Ahmed Al Maktoum',
        'landlord_name': 'Ahmed Al Maktoum',
        'landlord_emirates_id': '784-XXXX-XXXXXXX-X',
        'landlord_email': 'ahmed@nestmatch.ae',
        'landlord_phone': '+971 50 111 2222',
        'tenant_name': 'Priya Sharma',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_email': 'priya@nestmatch.ae',
        'tenant_phone': '+971 55 333 4444',
        'property_usage': 'Residential',
        'plot_number': 'BB-2201',
        'makani_number': 'MKN-34521-BB',
        'building_name': 'Business Bay Canal View Tower',
        'property_number': 'P010',
        'property_type': 'Apartment — En-Suite',
        'property_area': '45 sqm',
        'district': 'Business Bay',
        'dewa_number': 'DEWA-20254321',
        'contract_start': '15 Dec 2025',
        'contract_end': '14 Dec 2026',
        'contract_value': 'AED 85,000',
        'annual_rent': 'AED 85,000',
        'security_deposit': 'AED 7,083',
        'payment_mode': 'Monthly Bank Transfer',
        'landlord_signed': True, 'tenant_signed': True,
        'landlord_signed_at': '15 Dec 2025', 'tenant_signed_at': '15 Dec 2025',
    },
    {
        'filename': 'ejari-EJ-2026-001235.pdf',
        'ejari_number': 'EJ-2026-001235',
        'contract_date': '1 Jan 2026',
        'owner_name': 'Ahmed Al Maktoum', 'landlord_name': 'Ahmed Al Maktoum',
        'landlord_emirates_id': '784-XXXX-XXXXXXX-X',
        'landlord_email': 'ahmed@nestmatch.ae', 'landlord_phone': '+971 50 111 2222',
        'tenant_name': 'Marcus Chen',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_email': 'marcus.chen@email.com', 'tenant_phone': '+971 55 888 9999',
        'property_usage': 'Residential',
        'plot_number': 'BB-2201', 'makani_number': 'MKN-34521-BB',
        'building_name': 'Business Bay Canal View Tower', 'property_number': 'P010',
        'property_type': 'Apartment — En-Suite', 'property_area': '42 sqm',
        'district': 'Business Bay', 'dewa_number': 'DEWA-20254322',
        'contract_start': '1 Jan 2026', 'contract_end': '31 Dec 2026',
        'contract_value': 'AED 78,000', 'annual_rent': 'AED 78,000',
        'security_deposit': 'AED 6,500', 'payment_mode': 'Monthly Bank Transfer',
        'landlord_signed': True, 'tenant_signed': True,
        'landlord_signed_at': '1 Jan 2026', 'tenant_signed_at': '1 Jan 2026',
    },
    {
        'filename': 'ejari-EJ-2026-001567.pdf',
        'ejari_number': 'EJ-2026-001567',
        'contract_date': '18 Mar 2026',
        'owner_name': 'Ahmed Al Maktoum', 'landlord_name': 'Ahmed Al Maktoum',
        'landlord_emirates_id': '784-XXXX-XXXXXXX-X',
        'landlord_email': 'ahmed@nestmatch.ae', 'landlord_phone': '+971 50 111 2222',
        'tenant_name': 'Aisha Patel',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_email': 'aisha.patel@email.com', 'tenant_phone': '+971 55 444 5555',
        'property_usage': 'Residential',
        'plot_number': 'JLT-CD-1205', 'makani_number': 'MKN-55321-JLT',
        'building_name': 'JLT Cluster D Tower', 'property_number': 'P011',
        'property_type': 'Private Room', 'property_area': '48 sqm',
        'district': 'JLT', 'dewa_number': 'DEWA-20261567',
        'contract_start': '1 Apr 2026', 'contract_end': '31 Mar 2027',
        'contract_value': 'AED 92,000', 'annual_rent': 'AED 92,000',
        'security_deposit': 'AED 7,667', 'payment_mode': 'Monthly Bank Transfer',
        'landlord_signed': True, 'tenant_signed': True,
        'landlord_signed_at': '18 Mar 2026', 'tenant_signed_at': '18 Mar 2026',
    },
    {
        'filename': 'ejari-EJ-2025-008765.pdf',
        'ejari_number': 'EJ-2025-008765',
        'contract_date': '1 Jun 2024',
        'owner_name': 'Ahmed Al Maktoum', 'landlord_name': 'Ahmed Al Maktoum',
        'landlord_emirates_id': '784-XXXX-XXXXXXX-X',
        'landlord_email': 'ahmed@nestmatch.ae', 'landlord_phone': '+971 50 111 2222',
        'tenant_name': 'James Morrison',
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_email': 'james.morrison@email.com', 'tenant_phone': '+971 55 987 6543',
        'property_usage': 'Residential',
        'plot_number': 'SOA-901', 'makani_number': 'MKN-90121-SOA',
        'building_name': 'Silicon Oasis Tower', 'property_number': 'P009',
        'property_type': 'Spacious Room', 'property_area': '38 sqm',
        'district': 'Silicon Oasis', 'dewa_number': 'DEWA-20248765',
        'contract_start': '1 Jun 2024', 'contract_end': '31 May 2025',
        'contract_value': 'AED 72,000', 'annual_rent': 'AED 72,000',
        'security_deposit': 'AED 6,000', 'payment_mode': 'Monthly Bank Transfer',
        'landlord_signed': True, 'tenant_signed': True,
        'landlord_signed_at': '1 Jun 2024', 'tenant_signed_at': '1 Jun 2024',
    },
    {
        'filename': 'ejari-EJ-2026-003456.pdf',
        'ejari_number': 'EJ-2026-003456',
        'contract_date': '1 Feb 2026',
        'owner_name': 'Fatima Hassan', 'landlord_name': 'Fatima Hassan',
        'landlord_emirates_id': '784-XXXX-XXXXXXX-X',
        'landlord_email': 'fatima@nestmatch.ae', 'landlord_phone': '+971 50 222 3333',
        'tenant_name': "Liam O'Brien",
        'tenant_emirates_id': '784-XXXX-XXXXXXX-X',
        'tenant_email': 'liam@nestmatch.ae', 'tenant_phone': '+971 55 777 8888',
        'property_usage': 'Residential',
        'plot_number': 'MAR-808', 'makani_number': 'MKN-44521-MAR',
        'building_name': 'Marina Heights Tower', 'property_number': 'P008',
        'property_type': 'Ultra-Premium En-Suite', 'property_area': '52 sqm',
        'district': 'Dubai Marina', 'dewa_number': 'DEWA-20263456',
        'contract_start': '1 Feb 2026', 'contract_end': '31 Jan 2027',
        'contract_value': 'AED 65,000', 'annual_rent': 'AED 65,000',
        'security_deposit': 'AED 5,417', 'payment_mode': 'Monthly Bank Transfer',
        'landlord_signed': True, 'tenant_signed': True,
        'landlord_signed_at': '1 Feb 2026', 'tenant_signed_at': '3 Feb 2026',
    },
]


def main():
    print('Generating NestMatch UAE sample PDFs (Government Templates)...\n')

    print('── VIEWING AGREEMENTS (DLD Form 85) ──')
    for va in viewing_agreements:
        path = os.path.join(OUTPUT_DIR, va['filename'])
        try:
            fill_viewing_agreement(va, path)
            signed = 'FULLY SIGNED' if va['agent_signed'] and va['tenant_signed'] else 'PENDING'
            size = os.path.getsize(path)
            print(f'  ✓ {va["filename"]} ({va["agreement_number"]}) — {signed} [{size/1024:.0f}KB]')
        except Exception as e:
            print(f'  ✗ {va["filename"]} — ERROR: {e}')

    print('\n── EJARI CONTRACTS (DLD Unified Tenancy) ──')
    for ej in ejari_contracts:
        path = os.path.join(OUTPUT_DIR, ej['filename'])
        try:
            fill_ejari_contract(ej, path)
            status = ej.get('ejari_status', 'Active').upper() if 'ejari_status' in ej else 'ACTIVE'
            size = os.path.getsize(path)
            print(f'  ✓ {ej["filename"]} ({ej["ejari_number"]}) — {status} [{size/1024:.0f}KB]')
        except Exception as e:
            print(f'  ✗ {ej["filename"]} — ERROR: {e}')

    total = len(viewing_agreements) + len(ejari_contracts)
    print(f'\n✅ Generated {total} PDFs using government templates in {OUTPUT_DIR}')


if __name__ == '__main__':
    main()
