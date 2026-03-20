#!/usr/bin/env python3
"""
NestMatch UAE — Fill Government PDF Templates with NestMatch Data
Uses actual DLD/RERA PDFs as base and overlays data + DocuSign verification page
"""

import io
import os
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(SCRIPT_DIR, '..', '..', 'uploads')
OUTPUT_DIR = os.path.join(SCRIPT_DIR, '..', 'public', 'samples')

VIEWING_TEMPLATE = os.path.join(UPLOADS_DIR, 'property_viewing_agreement-7d0f97ee.pdf')
EJARI_TEMPLATE = os.path.join(UPLOADS_DIR, 'ejari_unified_tenancy_contract-e5b4179c.pdf')

# Colors
VERIFIED_GREEN = HexColor('#16a34a')
DOCUSIGN_BLUE = HexColor('#0077C8')
NESTMATCH_PURPLE = HexColor('#6C47FF')
DLD_NAVY = HexColor('#1B2A4A')
FILL_COLOR = HexColor('#1a1a2e')

# ─────────────────────────────────────────────────────────────
# VIEWING AGREEMENT — Page 1 field positions (letter: 612 x 792)
# ─────────────────────────────────────────────────────────────

def create_viewing_overlay_page1(data):
    """Create overlay for Viewing Agreement page 1"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.setFont('Helvetica', 9)
    c.setFillColor(FILL_COLOR)

    W, H = letter  # 612 x 792

    # Agreement Number (next to "Agreement Number:" label at y=136.5)
    c.drawString(272, H - 143, data.get('agreement_number', ''))

    # BROKER DETAILS
    c.drawString(100, H - 201, data.get('broker_orn', ''))                    # ORN
    c.drawString(145, H - 220, data.get('broker_company', ''))                # Company Name
    c.setFont('Helvetica', 8)
    c.drawString(170, H - 239, data.get('commercial_license', ''))            # Commercial License
    c.setFont('Helvetica', 9)
    c.drawString(115, H - 257, data.get('broker_brn', ''))                    # BRN
    c.drawString(395, H - 257, data.get('agent_name', ''))                    # Broker's Name
    c.drawString(110, H - 276, data.get('agent_phone', ''))                   # Mobile
    c.drawString(375, H - 276, data.get('agent_phone_2', ''))                 # Phone
    c.drawString(118, H - 295, data.get('agent_address', ''))                 # Address
    c.drawString(106, H - 313, data.get('agent_email', ''))                   # Email

    # TENANT DETAILS
    c.drawString(138, H - 365, data.get('tenant_name', ''))                   # Tenant's Name
    c.drawString(155, H - 383, data.get('tenant_emirates_id', ''))            # Emirates ID
    c.drawString(372, H - 383, data.get('tenant_passport', ''))               # Passport No
    c.drawString(108, H - 402, data.get('tenant_phone', ''))                  # Phone
    c.drawString(350, H - 402, data.get('tenant_mobile', ''))                 # Mobile
    c.drawString(112, H - 421, data.get('tenant_pobox', ''))                  # P.O.Box
    c.drawString(118, H - 439, data.get('tenant_address', ''))                # Address
    c.drawString(106, H - 458, data.get('tenant_email', ''))                  # Email
    c.setFont('Helvetica', 8)
    c.drawString(155, H - 476, data.get('tenant_info', ''))                   # Additional Information

    # PROPERTY DETAILS
    c.setFont('Helvetica', 9)
    c.drawString(140, H - 528, data.get('property_status', 'Active'))         # Property Status
    c.drawString(410, H - 528, data.get('plot_number', ''))                   # Plot Number
    # Type checkboxes - mark Apartment
    ptype = data.get('property_type_check', 'Apartment')
    if ptype == 'Apartment':
        c.drawString(176, H - 549, 'X')
    c.drawString(102, H - 577, data.get('property_area', ''))                 # Area
    c.drawString(366, H - 577, data.get('makani_number', ''))                 # Makani ID
    # Use - mark RES
    c.drawString(135, H - 597, 'X')                                           # RES checkbox
    c.drawString(375, H - 597, data.get('project_name', ''))                  # Project Name
    c.drawString(140, H - 619, data.get('building_number', ''))               # Building Number
    c.drawString(180, H - 660, data.get('rental_budget', ''))                 # Approximate Rental Budget
    c.setFont('Helvetica', 8)
    c.drawString(180, H - 679, data.get('services_info', ''))                 # Services

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def create_viewing_overlay_page2(data):
    """Create overlay for Viewing Agreement page 2 — signatures"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.setFont('Helvetica', 9)
    c.setFillColor(FILL_COLOR)

    W, H = letter

    # Agreement Number
    c.drawString(272, H - 143, data.get('agreement_number', ''))

    # FIRST PARTY [BROKER]
    agent_signed = data.get('agent_signed', False)
    if agent_signed:
        c.drawString(106, H - 200, data.get('agent_signed_at', ''))           # Date
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(364, H - 200, 'Digitally Signed via DocuSign')           # Signature
        c.setFont('Helvetica', 8)
        c.setFillColor(FILL_COLOR)
        c.drawString(134, H - 219, data.get('broker_company', ''))            # Office Stamp

    # SECOND PARTY [TENANT]
    tenant_signed = data.get('tenant_signed', False)
    c.setFont('Helvetica', 9)
    c.setFillColor(FILL_COLOR)
    c.drawString(108, H - 300, data.get('tenant_name', ''))                   # Tenant Name
    if tenant_signed:
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(508, H - 296, 'Signed')                                  # Signature

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def create_docusign_page(data, doc_type='viewing'):
    """Create a DocuSign Digital Verification page (appended as extra page)"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter if doc_type == 'viewing' else A4)
    W, H = letter if doc_type == 'viewing' else A4

    # NestMatch header
    c.setFont('Helvetica-Bold', 12)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, H - 50, 'NestMatch UAE')
    c.setFont('Helvetica', 8)
    c.drawCentredString(W / 2, H - 65, 'Digital Document Verification')

    y = H - 100

    # DocuSign Banner
    if doc_type == 'viewing':
        agent_signed = data.get('agent_signed', False)
        tenant_signed = data.get('tenant_signed', False)
        both = agent_signed and tenant_signed
        party1_label = 'Broker / Agent'
        party1_name = data.get('agent_name', '')
        party1_date = data.get('agent_signed_at', '')
        party1_signed = agent_signed
        party2_label = 'Tenant'
        party2_name = data.get('tenant_name', '')
        party2_date = data.get('tenant_signed_at', '')
        party2_signed = tenant_signed
    else:
        party1_signed = data.get('landlord_signed', False)
        party2_signed = data.get('tenant_signed', False)
        both = party1_signed and party2_signed
        party1_label = 'Lessor / Landlord'
        party1_name = data.get('landlord_name', '')
        party1_date = data.get('landlord_signed_at', '')
        party2_label = 'Tenant'
        party2_name = data.get('tenant_name', '')
        party2_date = data.get('tenant_signed_at', '')

    # Main verification banner
    banner_h = 80
    bg = VERIFIED_GREEN if both else DOCUSIGN_BLUE
    c.setFillColor(bg)
    c.roundRect(50, y - banner_h, W - 100, banner_h, 6, fill=1, stroke=0)

    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(W / 2, y - 25, 'DocuSign Digital Verification')
    c.setFont('Helvetica', 11)
    status = 'VERIFIED — Both Parties Have Signed' if both else 'PENDING — Awaiting Signatures'
    c.drawCentredString(W / 2, y - 45, status)

    c.setFont('Helvetica', 9)
    p1_text = f'{party1_label}: {party1_name} — Signed {party1_date}' if party1_signed else f'{party1_label}: Pending'
    p2_text = f'{party2_label}: {party2_name} — Signed {party2_date}' if party2_signed else f'{party2_label}: Pending'
    c.drawString(58, y - 68, p1_text)
    c.drawRightString(W - 58, y - 68, p2_text)

    y -= banner_h + 30

    # Party signature details
    for label, name, date, signed in [
        (party1_label, party1_name, party1_date, party1_signed),
        (party2_label, party2_name, party2_date, party2_signed),
    ]:
        c.setFillColor(HexColor('#f8f9fa'))
        c.roundRect(50, y - 80, W - 100, 80, 4, fill=1, stroke=0)
        c.setStrokeColor(HexColor('#e0e0e0'))
        c.roundRect(50, y - 80, W - 100, 80, 4, fill=0, stroke=1)

        c.setFillColor(FILL_COLOR)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(65, y - 18, label)

        if signed:
            c.setFont('Helvetica', 9)
            c.drawString(65, y - 35, f'Name: {name}')
            c.drawString(65, y - 50, f'Signed: {date}')
            c.setFont('Helvetica-Oblique', 9)
            c.setFillColor(VERIFIED_GREEN)
            c.drawString(65, y - 67, 'Digitally Signed via DocuSign')
            # Green checkmark
            c.setFont('Helvetica-Bold', 16)
            c.drawRightString(W - 65, y - 40, '✓')
        else:
            c.setFont('Helvetica', 9)
            c.setFillColor(HexColor('#999999'))
            c.drawString(65, y - 40, 'Awaiting digital signature...')
            c.setFont('Helvetica-Bold', 16)
            c.drawRightString(W - 65, y - 40, '○')

        y -= 95

    # Document reference
    y -= 10
    c.setFillColor(FILL_COLOR)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(50, y, 'Document Reference:')
    c.setFont('Helvetica', 9)
    if doc_type == 'viewing':
        c.drawString(155, y, f"Agreement Number: {data.get('agreement_number', '')}")
    else:
        c.drawString(155, y, f"Ejari Number: {data.get('ejari_number', '')}")

    y -= 20
    c.setFont('Helvetica', 8)
    c.setFillColor(HexColor('#666666'))
    c.drawString(50, y, 'Digital signatures are legally valid under UAE Federal Decree-Law No. 46 of 2021')
    y -= 12
    c.drawString(50, y, '(Electronic Transactions and Trust Services).')

    # NestMatch disclaimer footer
    y -= 40
    c.setFillColor(HexColor('#f0f0ff'))
    c.roundRect(50, y - 55, W - 100, 55, 4, fill=1, stroke=0)
    c.setFillColor(NESTMATCH_PURPLE)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(60, y - 14, 'NestMatch UAE — Document Storage Only')
    c.setFont('Helvetica', 7)
    c.setFillColor(FILL_COLOR)
    c.drawString(60, y - 28, 'NestMatch stores documents for reference. We do not draft, file, or manage contracts.')
    c.drawString(60, y - 40, 'NestMatch is not a RERA-licensed broker or property management company.')

    # Footer
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 25, 'Generated by NestMatch UAE — nestmatch.ae')

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


# ─────────────────────────────────────────────────────────────
# EJARI CONTRACT — Page 1 field positions (A4: 596 x 842)
# ─────────────────────────────────────────────────────────────

def create_ejari_overlay_page1(data):
    """Create overlay for Ejari Tenancy Contract page 1"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    c.setFont('Helvetica', 9)
    c.setFillColor(FILL_COLOR)

    W, H = A4  # 596 x 842

    # Date
    c.drawString(48, H - 120, data.get('contract_date', ''))

    # Owner / Lessor Information
    c.drawString(90, H - 182, data.get('owner_name', data.get('landlord_name', '')))   # Owner's Name
    c.drawString(92, H - 204, data.get('landlord_name', ''))                            # Lessor's Name
    c.drawString(112, H - 227, data.get('landlord_emirates_id', ''))                    # Lessor's Emirates ID
    c.drawString(80, H - 249, data.get('landlord_license', ''))                         # License No
    c.drawString(90, H - 274, data.get('landlord_email', ''))                           # Email
    c.drawString(95, H - 296, data.get('landlord_phone', ''))                           # Phone

    # Tenant Information (second "Owner / Lessor Information" section header — really tenant)
    c.drawString(92, H - 352, data.get('tenant_name', ''))                              # Tenant's Name
    c.drawString(112, H - 374, data.get('tenant_emirates_id', ''))                      # Tenant's Emirates ID
    c.drawString(80, H - 397, data.get('tenant_license', ''))                           # License No
    c.drawString(90, H - 422, data.get('tenant_email', ''))                             # Email
    c.drawString(95, H - 444, data.get('tenant_phone', ''))                             # Phone

    # Property Information
    # Residential checkbox (at x=383, y=492 in pdfplumber coords → reportlab y = H - 492 - offset)
    usage = data.get('property_usage', 'Residential')
    if usage == 'Residential':
        c.drawString(371, H - 501, 'X')                                                 # Residential radio
    elif usage == 'Commercial':
        c.drawString(258, H - 501, 'X')
    elif usage == 'Industrial':
        c.drawString(151, H - 501, 'X')

    c.drawString(67, H - 524, data.get('plot_number', ''))                              # Plot No
    c.drawString(349, H - 524, data.get('makani_number', ''))                           # Makani No
    c.drawString(90, H - 547, data.get('building_name', ''))                            # Building Name
    c.drawString(353, H - 547, data.get('property_number', ''))                         # Property No
    c.drawString(88, H - 570, data.get('property_type', ''))                            # Property Type
    c.drawString(378, H - 570, data.get('property_area', ''))                           # Property Area
    c.drawString(70, H - 593, data.get('district', ''))                                 # Location
    c.drawString(386, H - 593, data.get('dewa_number', ''))                             # DEWA

    # Contract Information
    c.setFont('Helvetica', 8)
    c.drawString(94, H - 650, f"{data.get('contract_start', '')}  to  {data.get('contract_end', '')}")  # Period
    c.setFont('Helvetica', 9)
    c.drawString(360, H - 650, data.get('contract_value', ''))                          # Contract Value
    c.drawString(82, H - 675, data.get('annual_rent', ''))                              # Annual Rent
    c.drawString(397, H - 675, data.get('security_deposit', ''))                        # Security Deposit
    c.drawString(102, H - 697, data.get('payment_mode', ''))                            # Mode of Payment

    # Signatures on page 1
    tenant_signed = data.get('tenant_signed', False)
    landlord_signed = data.get('landlord_signed', False)
    if tenant_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(40, H - 780, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(200, H - 807, data.get('tenant_signed_at', ''))
    if landlord_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(313, H - 780, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(473, H - 807, data.get('landlord_signed_at', ''))

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def create_ejari_overlay_page2(data):
    """Create overlay for Ejari page 2 (Terms) — signatures at bottom"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    tenant_signed = data.get('tenant_signed', False)
    landlord_signed = data.get('landlord_signed', False)

    if tenant_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(40, H - 780, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(200, H - 807, data.get('tenant_signed_at', ''))
    if landlord_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(313, H - 780, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(473, H - 807, data.get('landlord_signed_at', ''))

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def create_ejari_overlay_page3(data):
    """Overlay for Ejari page 3 — signatures"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    tenant_signed = data.get('tenant_signed', False)
    landlord_signed = data.get('landlord_signed', False)

    if tenant_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(40, H - 750, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(200, H - 777, data.get('tenant_signed_at', ''))
    if landlord_signed:
        c.setFont('Helvetica-Oblique', 7)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(313, H - 750, 'DocuSign Verified')
        c.setFont('Helvetica', 7)
        c.setFillColor(FILL_COLOR)
        c.drawString(473, H - 777, data.get('landlord_signed_at', ''))

    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


# ─────────────────────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────────────────────

def fill_viewing_agreement(data, output_path):
    """Fill government Viewing Agreement template + append DocuSign page"""
    reader = PdfReader(VIEWING_TEMPLATE)
    writer = PdfWriter()

    # Page 1: merge overlay onto template
    page1 = reader.pages[0]
    overlay1 = create_viewing_overlay_page1(data)
    page1.merge_page(overlay1)
    writer.add_page(page1)

    # Page 2: merge signature overlay
    page2 = reader.pages[1]
    overlay2 = create_viewing_overlay_page2(data)
    page2.merge_page(overlay2)
    writer.add_page(page2)

    # Page 3: DocuSign verification (new page)
    docusign_page = create_docusign_page(data, 'viewing')
    writer.add_page(docusign_page)

    with open(output_path, 'wb') as f:
        writer.write(f)
    return output_path


def fill_ejari_contract(data, output_path):
    """Fill government Ejari template + append DocuSign page"""
    reader = PdfReader(EJARI_TEMPLATE)
    writer = PdfWriter()

    # Page 1: Contract details
    page1 = reader.pages[0]
    overlay1 = create_ejari_overlay_page1(data)
    page1.merge_page(overlay1)
    writer.add_page(page1)

    # Page 2: Terms and Conditions (+ signature overlay)
    page2 = reader.pages[1]
    overlay2 = create_ejari_overlay_page2(data)
    page2.merge_page(overlay2)
    writer.add_page(page2)

    # Page 3: Know Your Rights / Attachments (+ signature overlay)
    page3 = reader.pages[2]
    overlay3 = create_ejari_overlay_page3(data)
    page3.merge_page(overlay3)
    writer.add_page(page3)

    # Page 4: DocuSign verification (new page)
    docusign_page = create_docusign_page(data, 'ejari')
    writer.add_page(docusign_page)

    with open(output_path, 'wb') as f:
        writer.write(f)
    return output_path
