#!/usr/bin/env python3
"""
NestMatch UAE — DLD Property Viewing Agreement (Form 85) PDF Generator
Matches the official DLD/RERA/RL/LP/P210/No.3/Vr.4 layout
"""

import json
import sys
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

# Colors matching DLD form
DLD_GREEN = HexColor('#2E7D4F')
DLD_DARK = HexColor('#1a1a2e')
LIGHT_GRAY = HexColor('#f5f5f5')
BORDER_GRAY = HexColor('#cccccc')
NESTMATCH_PURPLE = HexColor('#6C47FF')
DOCUSIGN_BLUE = HexColor('#0077C8')
VERIFIED_GREEN = HexColor('#16a34a')

W, H = A4  # 595.27 x 841.89 points


def draw_header(c, agreement_number):
    """Draw the DLD header with logos and title — bilingual"""
    # Government of Dubai logo area (left)
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(DLD_DARK)
    c.drawString(40, H - 40, 'GOVERNMENT OF DUBAI')
    c.setFont('Helvetica', 6)
    c.drawString(40, H - 50, 'Dubai Land Department')

    # DLD logo area (center-right)
    c.setFont('Helvetica-Bold', 10)
    c.setFillColor(DLD_GREEN)
    c.drawCentredString(W / 2, H - 38, 'Land Department')
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, H - 50, 'DLD/RERA/RL/LP/P210/No.3/Vr.4')

    # RERA logo area (right)
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(DLD_DARK)
    c.drawRightString(W - 40, H - 40, 'RERA')
    c.setFont('Helvetica', 6)
    c.drawRightString(W - 40, H - 50, 'Real Estate Regulatory Agency')

    # Divider line
    c.setStrokeColor(DLD_GREEN)
    c.setLineWidth(1.5)
    c.line(40, H - 58, W - 40, H - 58)

    # Title bilingual
    c.setFont('Helvetica-Bold', 14)
    c.setFillColor(DLD_DARK)
    c.drawCentredString(W / 2, H - 80, 'Property Viewing Agreement')
    c.setFont('Helvetica', 10)
    c.setFillColor(DLD_GREEN)
    # Arabic title placeholder
    c.drawCentredString(W / 2, H - 95, 'Agreement Number:  ' + agreement_number)


def draw_section_header(c, y, left_text, right_text=''):
    """Draw a green section header bar"""
    c.setFillColor(DLD_GREEN)
    c.roundRect(40, y - 4, W - 80, 20, 2, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(48, y + 2, left_text)
    if right_text:
        c.drawRightString(W - 48, y + 2, right_text)
    return y - 8


def draw_field_row(c, y, fields, height=18):
    """Draw a row of label: value fields
    fields = [(label, value, width_pct), ...]
    """
    x = 40
    total_w = W - 80
    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.5)

    for label, value, width_pct in fields:
        w = total_w * width_pct
        # Cell border
        c.rect(x, y - height + 2, w, height, stroke=1, fill=0)
        # Label
        c.setFont('Helvetica', 6.5)
        c.setFillColor(HexColor('#666666'))
        c.drawString(x + 4, y - 3, label)
        # Value
        c.setFont('Helvetica-Bold', 8)
        c.setFillColor(DLD_DARK)
        if value:
            c.drawString(x + 4, y - 13, str(value))
        x += w
    return y - height


def draw_docusign_status(c, y, agent_signed, tenant_signed, agent_name='', tenant_name='',
                          agent_signed_at='', tenant_signed_at=''):
    """Draw DocuSign verification banner"""
    banner_h = 60
    both_signed = agent_signed and tenant_signed

    # Background
    bg_color = VERIFIED_GREEN if both_signed else DOCUSIGN_BLUE
    c.setFillColor(bg_color)
    c.roundRect(40, y - banner_h, W - 80, banner_h, 4, fill=1, stroke=0)

    # DocuSign branding
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 11)
    status_text = 'VERIFIED — Both Parties Signed' if both_signed else 'PENDING — Awaiting Signatures'
    c.drawCentredString(W / 2, y - 16, 'DocuSign Digital Verification')
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y - 30, status_text)

    # Signature status line
    c.setFont('Helvetica', 7.5)
    left_status = f'Broker: {agent_name} — Signed {agent_signed_at}' if agent_signed else 'Broker: Pending'
    right_status = f'Tenant: {tenant_name} — Signed {tenant_signed_at}' if tenant_signed else 'Tenant: Pending'
    c.drawString(48, y - 48, left_status)
    c.drawRightString(W - 48, y - 48, right_status)

    # Check/X icons
    c.setFont('Helvetica-Bold', 12)
    c.drawString(48, y - 30, '✓' if agent_signed else '○')
    c.drawRightString(W - 135, y - 48, '✓' if tenant_signed else '○')

    return y - banner_h - 8


def draw_signature_block(c, y, label_left, label_right, sig_left=None, sig_right=None,
                          name_left='', name_right='', date_left='', date_right=''):
    """Draw dual signature boxes"""
    box_w = (W - 80 - 20) / 2  # Two boxes with 20pt gap
    box_h = 70

    # Left box
    c.setStrokeColor(BORDER_GRAY)
    c.setLineWidth(0.5)
    c.rect(40, y - box_h, box_w, box_h, stroke=1, fill=0)

    # Right box
    c.rect(40 + box_w + 20, y - box_h, box_w, box_h, stroke=1, fill=0)

    # Labels
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(DLD_DARK)
    c.drawString(44, y - 12, label_left)
    c.drawString(44 + box_w + 20, y - 12, label_right)

    # Signature placeholders or "Digitally Signed"
    if sig_left:
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(44, y - 35, 'Digitally Signed via DocuSign')
        c.setFont('Helvetica', 7)
        c.setFillColor(DLD_DARK)
        c.drawString(44, y - 48, f'Name: {name_left}')
        c.drawString(44, y - 58, f'Date: {date_left}')
    else:
        c.setFont('Helvetica', 8)
        c.setFillColor(HexColor('#999999'))
        c.drawString(44, y - 40, 'Awaiting signature...')

    if sig_right:
        c.setFont('Helvetica-Oblique', 8)
        c.setFillColor(VERIFIED_GREEN)
        c.drawString(44 + box_w + 20, y - 35, 'Digitally Signed via DocuSign')
        c.setFont('Helvetica', 7)
        c.setFillColor(DLD_DARK)
        c.drawString(44 + box_w + 20, y - 48, f'Name: {name_right}')
        c.drawString(44 + box_w + 20, y - 58, f'Date: {date_right}')
    else:
        c.setFont('Helvetica', 8)
        c.setFillColor(HexColor('#999999'))
        c.drawString(44 + box_w + 20, y - 40, 'Awaiting signature...')

    return y - box_h - 8


def generate_viewing_agreement(data, output_path):
    """Generate the full DLD Property Viewing Agreement PDF"""
    c = canvas.Canvas(output_path, pagesize=A4)
    c.setTitle(f"NestMatch - Viewing Agreement {data.get('agreement_number', '')}")
    c.setAuthor('NestMatch UAE')

    # ── PAGE 1 ──────────────────────────────────────────────

    draw_header(c, data.get('agreement_number', 'NM-VA-2026-XXXXX'))

    y = H - 115

    # BROKER DETAILS
    y = draw_section_header(c, y, 'BROKER DETAILS', '')
    y = draw_field_row(c, y, [
        ('ORN:', data.get('broker_orn', ''), 0.5),
        ('', '', 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Company Name:', data.get('broker_company', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Commercial License Number:', data.get('commercial_license', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('BRN:', data.get('broker_brn', ''), 0.35),
        ("Broker's Name:", data.get('agent_name', ''), 0.35),
        ('', '', 0.3),
    ])
    y = draw_field_row(c, y, [
        ('Mobile:', data.get('agent_phone', ''), 0.35),
        ('Phone:', data.get('agent_phone_2', ''), 0.35),
        ('', '', 0.3),
    ])
    y = draw_field_row(c, y, [
        ('Address:', data.get('agent_address', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Email:', data.get('agent_email', ''), 1.0),
    ])

    y -= 8

    # TENANT DETAILS
    y = draw_section_header(c, y, 'TENANT DETAILS', '')
    y = draw_field_row(c, y, [
        ("Tenant's Name:", data.get('tenant_name', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Emirates ID Number:', data.get('tenant_emirates_id', ''), 0.5),
        ('Passport No:', data.get('tenant_passport', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Phone:', data.get('tenant_phone', ''), 0.5),
        ('Mobile:', data.get('tenant_mobile', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('P.O.Box:', data.get('tenant_pobox', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Address:', data.get('tenant_address', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Email:', data.get('tenant_email', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Additional Information:', data.get('tenant_info', ''), 1.0),
    ])

    y -= 8

    # PROPERTY DETAILS
    y = draw_section_header(c, y, 'PROPERTY DETAILS', '')
    y = draw_field_row(c, y, [
        ('Property Status:', data.get('property_status', 'Active'), 0.5),
        ('Plot Number and Area:', data.get('plot_number', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Type:', data.get('property_type', 'Apartment'), 0.5),
        ('', '', 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Area:', data.get('property_area', ''), 0.5),
        ('Makani ID:', data.get('makani_number', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Use:', data.get('property_use', 'RES (Residential)'), 0.5),
        ('Project Name:', data.get('project_name', ''), 0.5),
    ])
    y = draw_field_row(c, y, [
        ('Building Number:', data.get('building_number', ''), 0.5),
        ("Owner's Association No:", '', 0.5),
    ])
    y = draw_field_row(c, y, [
        ('NO. of Car Parks:', data.get('car_parks', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Approximate Rental Budget:', data.get('rental_budget', ''), 1.0),
    ])
    y = draw_field_row(c, y, [
        ('Services and General information:', data.get('services_info', ''), 1.0),
    ])

    # Footer
    c.setFont('Helvetica', 6)
    c.setFillColor(HexColor('#888888'))
    c.drawString(40, 30, 'DLD/RERA/RL/LP/P210/ No.3/Vr.4/ Issue Date:Aug.2022')
    c.drawRightString(W - 40, 30, 'Page 1')

    # NestMatch watermark - subtle
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 20, 'Generated by NestMatch UAE — nestmatch.ae — Document Storage Only')

    c.showPage()

    # ── PAGE 2: SIGNATURES + DOCUSIGN STATUS ────────────────

    draw_header(c, data.get('agreement_number', 'NM-VA-2026-XXXXX'))

    y = H - 115

    # DocuSign Verification Status Banner
    agent_signed = data.get('agent_signed', False)
    tenant_signed = data.get('tenant_signed', False)
    y = draw_docusign_status(
        c, y,
        agent_signed=agent_signed,
        tenant_signed=tenant_signed,
        agent_name=data.get('agent_name', ''),
        tenant_name=data.get('tenant_name', ''),
        agent_signed_at=data.get('agent_signed_at', ''),
        tenant_signed_at=data.get('tenant_signed_at', ''),
    )

    y -= 8

    # FIRST PARTY (BROKER)
    y = draw_section_header(c, y, 'FIRST PARTY [THE BROKER OFFICE]', '')
    y = draw_field_row(c, y, [
        ('Date:', data.get('agent_signed_at', ''), 0.35),
        ('Signature:', 'Digitally Signed' if agent_signed else '', 0.35),
        ('', '', 0.3),
    ])
    y = draw_field_row(c, y, [
        ('Office Stamp:', data.get('broker_company', ''), 1.0),
    ])

    y -= 16

    # SECOND PARTY (TENANT)
    y = draw_section_header(c, y, 'SECOND PARTY (THE TENANT(S))', '')
    y = draw_field_row(c, y, [
        ('Tenant Name:', data.get('tenant_name', ''), 0.5),
        ('Signature:', 'Digitally Signed' if tenant_signed else '', 0.5),
    ])

    y -= 24

    # Digital Signature Blocks
    y = draw_signature_block(
        c, y,
        'Broker / Agent Signature', 'Tenant Signature',
        sig_left=agent_signed,
        sig_right=tenant_signed,
        name_left=data.get('agent_name', ''),
        name_right=data.get('tenant_name', ''),
        date_left=data.get('agent_signed_at', ''),
        date_right=data.get('tenant_signed_at', ''),
    )

    y -= 16

    # NestMatch compliance notice
    c.setFillColor(HexColor('#f0f0ff'))
    c.roundRect(40, y - 65, W - 80, 65, 4, fill=1, stroke=0)
    c.setFillColor(NESTMATCH_PURPLE)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(48, y - 14, 'NestMatch UAE — Digital Verification Notice')
    c.setFont('Helvetica', 7)
    c.setFillColor(DLD_DARK)
    c.drawString(48, y - 28, 'This document was digitally signed via DocuSign integration on the NestMatch platform.')
    c.drawString(48, y - 40, 'Digital signatures are legally valid under UAE Federal Decree-Law No. 46 of 2021')
    c.drawString(48, y - 52, '(Electronic Transactions and Trust Services). This agreement is compliant with DLD regulations.')

    # Footer
    c.setFont('Helvetica', 6)
    c.setFillColor(HexColor('#888888'))
    c.drawString(40, 30, 'DLD/RERA/RL/LP/P210/ No.3/Vr.4/ Issue Date:Aug.2022')
    c.drawRightString(W - 40, 30, 'Page 2')
    c.setFont('Helvetica', 7)
    c.setFillColor(NESTMATCH_PURPLE)
    c.drawCentredString(W / 2, 20, 'Generated by NestMatch UAE — nestmatch.ae — Document Storage Only')

    c.save()
    return output_path


if __name__ == '__main__':
    # Read JSON data from stdin or arg
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    output = data.get('output_path', '/tmp/viewing_agreement.pdf')
    result = generate_viewing_agreement(data, output)
    print(json.dumps({'success': True, 'path': result}))
