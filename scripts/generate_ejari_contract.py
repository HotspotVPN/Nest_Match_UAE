#!/usr/bin/env python3
"""
NestMatch UAE — Ejari Unified Tenancy Contract PDF Generator
Matches the official DLD Tenancy Contract layout (bilingual)
"""

import json
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas

# Colors matching DLD Ejari form
DLD_NAVY = HexColor('#1B2A4A')
DLD_HEADER = HexColor('#2C3E6B')
LIGHT_GRAY = HexColor('#f5f5f5')
BORDER_GRAY = HexColor('#cccccc')
NESTMATCH_PURPLE = HexColor('#6C47FF')
DOCUSIGN_BLUE = HexColor('#0077C8')
VERIFIED_GREEN = HexColor('#16a34a')
EJARI_WATERMARK = HexColor('#E8EDF5')

W, H = A4


def draw_header(c, date_str=''):
    """DLD header with Government of Dubai + Land Department"""
    # Government of Dubai (left)
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(DLD_NAVY)
    c.drawString(40, H - 40, 'GOVERNMENT OF DUBAI')
    c.setFont('Helvetica', 6)
    c.drawString(40, H - 50, 'Dubai Land Department')

    # Land Department (right)
    c.setFont('Helvetica-Bold', 10)
    c.setFillColor(DLD_NAVY)
    c.drawRightString(W - 40, H - 38, 'Land Department')
    c.setFont('Helvetica', 7)
    c.drawRightString(W - 40, H - 50, 'Dubai Land Department')

    # Divider
    c.setStrokeColor(DLD_NAVY)
    c.setLineWidth(2)
    c.line(40, H - 58, W - 40, H - 58)

    # Title
    c.setFont('Helvetica-Bold', 16)
    c.setFillColor(DLD_NAVY)
    c.drawCentredString(W / 2, H - 82, 'TENANCY CONTRACT')

    # Date
    if date_str:
        c.setFont('Helvetica', 9)
        c.drawString(40, H - 98, f'Date: {date_str}')


def draw_section_header(c, y, left_text, right_text=''):
    """Navy section header bar"""
    c.setFillColor(DLD_HEADER)
    c.roundRect(40, y - 4, W - 80, 20, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(48, y + 2, left_text)
    if right_text:
        c.drawRightString(W - 48, y + 2, right_text)
    return y - 8


def draw_field_row(c, y, fields, height=18):
    """Draw row of label-value fields"""
    x = 40
    total_w = W - 80
    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.5)

    for label, value, width_pct in fields:
        w = total_w * width_pct
        c.rect(x, y - height + 2, w, height, stroke=1, fill=0)
        c.setFont('Helvetica', 6.5)
        c.setFillColor(HexColor('#666666'))
        c.drawString(x + 4, y - 3, label)
        c.setFont('Helvetica-Bold', 8)
        c.setFillColor(DLD_NAVY)
        if value:
            c.drawString(x + 4, y - 13, str(value))
        x += w
    return y - height


def draw_checkbox_row(c, y, label, options, selected=''):
    """Draw a row with checkbox options"""
    x = 40
    total_w = W - 80
    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.5)
    c.rect(x, y - 16, total_w, 18, stroke=1, fill=0)

    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    c.drawString(x + 4, y - 11, label)

    ox = x + 120
    for opt in options:
        is_selected = opt.lower() == selected.lower()
        # Radio circle
        c.setStrokeColor(DLD_NAVY)
        c.circle(ox + 5, y - 8, 4, stroke=1, fill=0)
        if is_selected:
            c.setFillColor(DLD_NAVY)
            c.circle(ox + 5, y - 8, 2.5, stroke=0, fill=1)
        c.setFont('Helvetica', 7)
        c.setFillColor(DLD_NAVY)
        c.drawString(ox + 14, y - 11, opt)
        ox += 90
    return y - 16


def draw_terms_page(c, data):
    """Page 2: Terms and Conditions"""
    draw_header(c)

    y = H - 110

    y = draw_section_header(c, y, 'Terms and Conditions', '')
    y -= 4

    terms = [
        '1. The tenant has inspected the premises and agreed to lease the unit on its current condition.',
        '2. The tenant undertakes to use the premises for designated purpose, tenant has no rights to transfer or relinquish the tenancy contract either with or without counterpart to any without landlord written approval.',
        '3. The tenant undertakes not to make any amendments, modifications or addendums to the premises subject of the contract without obtaining the landlord written approval. Tenant shall be liable for any damages or failure due to this.',
        '4. The tenant shall be responsible for payment of all electricity, water, cooling and gas charges resulting of occupying leased unit unless other condition agreed in written.',
        '5. The tenant must pay the rent amount in the manner and dates agreed with the landlord.',
        '6. The tenant fully undertakes to comply with all the regulations and instructions related to the management of the property and the use of the premises and of common areas such (parking, swimming pools, gymnasium, etc...).',
        '7. Tenancy contract parties declare all mentioned emails addresses and phone numbers are correct, all formal and legal notifications will be sent to those addresses in case of dispute between parties.',
        '8. The landlord undertakes to enable the tenant of the full use of the premises including its facilities and do the regular maintenance as intended unless other condition agreed in written.',
        '9. By signing this agreement the first party, the "Landlord" hereby confirms and undertakes that he is the current owner of the property or his legal representative under legal power of attorney duly entitled by the competent authorities.',
        '10. Any disagreement or dispute may arise from execution or interpretation of this contract shall be settled by the Rental Dispute Center.',
        '11. This contract is subject to all provisions of Law No (26) of 2007 regulating the relation between landlords and tenants in the emirate of Dubai as amended.',
        '12. Any additional condition will not be considered in case it conflicts with law.',
        '13. In case of discrepancy occurs between Arabic and non Arabic texts with regards to the interpretation of this agreement or the scope of its application, the Arabic text shall prevail.',
        '14. The landlord undertakes to register this tenancy contract on EJARI affiliated to Dubai LandDepartment and provide with all required documents.',
    ]

    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    for term in terms:
        # Word wrap
        words = term.split()
        lines = []
        current_line = ''
        for word in words:
            test = current_line + ' ' + word if current_line else word
            if c.stringWidth(test, 'Helvetica', 7) > (W - 100):
                lines.append(current_line)
                current_line = word
            else:
                current_line = test
        if current_line:
            lines.append(current_line)

        for line in lines:
            c.drawString(48, y, line)
            y -= 11
        y -= 4

    return y


def draw_docusign_verification(c, y, data):
    """DocuSign verification banner"""
    landlord_signed = data.get('landlord_signed', False)
    tenant_signed = data.get('tenant_signed', False)
    both_signed = landlord_signed and tenant_signed
    banner_h = 55

    bg_color = VERIFIED_GREEN if both_signed else DOCUSIGN_BLUE
    c.setFillColor(bg_color)
    c.roundRect(40, y - banner_h, W - 80, banner_h, 4, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 11)
    status = 'VERIFIED — Both Parties Signed' if both_signed else 'PENDING — Awaiting Signatures'
    c.drawCentredString(W / 2, y - 16, 'DocuSign Digital Verification')
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y - 30, status)

    c.setFont('Helvetica', 7.5)
    ls = f"Lessor: {data.get('landlord_name', '')} — Signed {data.get('landlord_signed_at', '')}" if landlord_signed else 'Lessor: Pending'
    ts = f"Tenant: {data.get('tenant_name', '')} — Signed {data.get('tenant_signed_at', '')}" if tenant_signed else 'Tenant: Pending'
    c.drawString(48, y - 45, ls)
    c.drawRightString(W - 48, y - 45, ts)

    return y - banner_h - 8


def draw_signature_block(c, y, data):
    """Dual signature boxes with DocuSign status"""
    y = draw_section_header(c, y, 'Signatures', '')

    box_w = (W - 80 - 20) / 2
    box_h = 70

    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.5)
    c.rect(40, y - box_h, box_w, box_h, stroke=1, fill=0)
    c.rect(40 + box_w + 20, y - box_h, box_w, box_h, stroke=1, fill=0)

    # Tenant signature (left)
    tenant_signed = data.get('tenant_signed', False)
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    c.drawString(44, y - 58, 'Tenant Signature')
    c.drawString(44 + 130, y - 58, 'Date')
    if tenant_signed:
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(44, y - 30, 'Digitally Signed via DocuSign')
        c.setFont('Helvetica', 7)
        c.setFillColor(DLD_NAVY)
        c.drawString(44, y - 42, data.get('tenant_name', ''))

    # Lessor signature (right)
    landlord_signed = data.get('landlord_signed', False)
    rx = 40 + box_w + 20
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    c.drawString(rx + 4, y - 58, "Lessor's Signature")
    c.drawString(rx + 130, y - 58, 'Date')
    if landlord_signed:
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(rx + 4, y - 30, 'Digitally Signed via DocuSign')
        c.setFont('Helvetica', 7)
        c.setFillColor(DLD_NAVY)
        c.drawString(rx + 4, y - 42, data.get('landlord_name', ''))

    return y - box_h - 8


def generate_ejari_contract(data, output_path):
    """Generate the full Ejari Unified Tenancy Contract PDF"""
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle(f"NestMatch - Ejari Contract {data.get('ejari_number', '')}")
    c.setAuthor('NestMatch UAE')

    # ── PAGE 1: CONTRACT DETAILS ────────────────────────────

    draw_header(c, data.get('contract_date', ''))

    y = H - 110

    # Owner / Lessor Information
    y = draw_section_header(c, y, 'Owner / Lessor Information', '')
    y = draw_field_row(c, y, [
        ("Owner's Name:", data.get('owner_name', data.get('landlord_name', '')), 1.0),
    ])
    y = draw_field_row(c, y, [
        ("Lessor's Name:", data.get('landlord_name', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ("Lessor's Emirates ID:", data.get('landlord_emirates_id', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('License No.:', data.get('landlord_license', ''), 0.35),
        ('Licensing Authority:', data.get('licensing_authority', ''), 0.35),
        ('', '', 0.3),
    ])
    y = draw_field_row(c, y, [
        ("Lessor's Email:", data.get('landlord_email', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ("Lessor's Phone:", data.get('landlord_phone', ''), 1.0),
    ])

    y -= 8

    # Tenant Information
    y = draw_section_header(c, y, 'Owner / Lessor Information', '')  # Matches DLD form label
    y = draw_field_row(c, y, [
        ("Tenant's Name:", data.get('tenant_name', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ("Tenant's Emirates ID:", data.get('tenant_emirates_id', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('License No.:', data.get('tenant_license', ''), 0.35),
        ('Licensing Authority:', data.get('tenant_licensing_authority', ''), 0.35),
        ('', '', 0.3),
    ])
    y = draw_field_row(c, y, [
        ("Tenant's Email:", data.get('tenant_email', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ("Tenant's Phone:", data.get('tenant_phone', ''), 1.0),
    ])

    y -= 8

    # Property Information
    y = draw_section_header(c, y, 'Property Information', '')
    y = draw_checkbox_row(c, y, 'Property Usage:', ['Industrial', 'Commercial', 'Residential'],
                          data.get('property_usage', 'Residential'))
    y = draw_field_row(c, y, [
        ('Plot No.:', data.get('plot_number', ''), 0.5),
        ('Makani No.:', data.get('makani_number', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Building Name:', data.get('building_name', ''), 0.5),
        ('Property No.:', data.get('property_number', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Property Type:', data.get('property_type', 'Apartment'), 0.5),
        ('Property Area (s.m):', data.get('property_area', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Location:', data.get('district', ''), 0.5),
        ('Premises No. (DEWA):', data.get('dewa_number', ''), 0.5),
    ])

    y -= 8

    # Contract Information
    y = draw_section_header(c, y, 'Contract Information', '')
    y = draw_field_row(c, y, [
        ('Contract Period:', f"{data.get('contract_start', '')} to {data.get('contract_end', '')}", 0.5),
        ('Contract Value:', data.get('contract_value', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Annual Rent:', data.get('annual_rent', ''), 0.5),
        ('Security Deposit Amount:', data.get('security_deposit', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Mode of Payment:', data.get('payment_mode', ''), 1.0),
    ])

    # Ejari Number
    y -= 8
    c.setFillColor(HexColor('#f0f0ff'))
    c.roundRect(40, y - 28, W - 80, 28, 3, fill=1, stroke=0)
    c.setFillColor(NESTMATCH_PURPLE)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(48, y - 10, f"Ejari Registration Number: {data.get('ejari_number', 'Pending Registration')}")
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    c.drawString(48, y - 22, f"Ejari Status: {data.get('ejari_status', 'Active').upper()}")
    y -= 36

    # Footer
    c.setFont('Helvetica', 6)
    c.setFillColor(HexColor('#888888'))
    c.drawString(40, 30, 'Ejari Unified Tenancy Contract — Dubai Land Department')
    c.drawRightString(W - 40, 30, 'Page 1')
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 20, 'Generated by NestMatch UAE — nestmatch.ae — Document Storage Only')

    c.showPage()

    # ── PAGE 2: TERMS AND CONDITIONS ────────────────────────

    y = draw_terms_page(c, data)

    # Footer
    c.setFont('Helvetica', 6)
    c.setFillColor(HexColor('#888888'))
    c.drawString(40, 30, 'Ejari Unified Tenancy Contract — Dubai Land Department')
    c.drawRightString(W - 40, 30, 'Page 2')
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 20, 'Generated by NestMatch UAE — nestmatch.ae — Document Storage Only')

    c.showPage()

    # ── PAGE 3: SIGNATURES + DOCUSIGN VERIFICATION ──────────

    draw_header(c)

    y = H - 110

    # DocuSign Verification Banner
    y = draw_docusign_verification(c, y, data)

    y -= 8

    # Signature Blocks
    y = draw_signature_block(c, y, data)

    y -= 16

    # Know Your Rights section
    y = draw_section_header(c, y, 'Know your Rights', '')
    rights = [
        'You may visit Rental Dispute Center website through www.dubailand.gov.ae in case of any rental dispute between parties.',
        'Law No 26 of 2007 regulating relationship between landlords and tenants.',
        'Law No 33 of 2008 amending law 26 of year 2007.',
        'Law No 43 of 2013 determining rent increases for properties.',
    ]
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    for right in rights:
        c.drawString(52, y - 4, f'• {right}')
        y -= 14

    y -= 8

    # Attachments for Ejari Registration
    y = draw_section_header(c, y, 'Attachments for Ejari Registration', '')
    c.setFont('Helvetica', 7.5)
    c.setFillColor(DLD_NAVY)
    c.drawString(52, y - 4, '1. Original unified tenancy contract')
    y -= 14
    c.drawString(52, y - 4, '2. Original emirates ID of applicant')
    y -= 14

    y -= 16

    # NestMatch compliance notice
    c.setFillColor(HexColor('#f0f0ff'))
    c.roundRect(40, y - 55, W - 80, 55, 4, fill=1, stroke=0)
    c.setFillColor(NESTMATCH_PURPLE)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(48, y - 14, 'NestMatch UAE — Document Storage Disclaimer')
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_NAVY)
    c.drawString(48, y - 28, 'NestMatch stores your Ejari certificates for reference. We do not draft, file, or manage tenancy contracts.')
    c.drawString(48, y - 40, 'For Ejari registration, visit the Dubai REST app or an authorized typing centre.')
    c.drawString(48, y - 52, 'NestMatch is not a RERA-licensed broker or property management company.')

    # Footer
    c.setFont('Helvetica', 6)
    c.setFillColor(HexColor('#888888'))
    c.drawString(40, 30, 'Ejari Unified Tenancy Contract — Dubai Land Department')
    c.drawRightString(W - 40, 30, 'Page 3')
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 20, 'Generated by NestMatch UAE — nestmatch.ae — Document Storage Only')

    # DLD contact info
    c.setFont('Helvetica', 5.5)
    c.setFillColor(HexColor('#888888'))
    c.drawCentredString(W / 2, 42, 'Tel: 8004488 Fax: +971 4 222 2251 P.O.Box 1166, Dubai, U.A.E.')
    c.drawCentredString(W / 2, 35, 'Website: www.dubailand.gov.ae    E-mail: support@dubailand.gov.ae')

    c.save()
    return output_path


if __name__ == '__main__':
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    output = data.get('output_path', '/tmp/ejari_contract.pdf')
    result = generate_ejari_contract(data, output)
    print(json.dumps({'success': True, 'path': result}))
