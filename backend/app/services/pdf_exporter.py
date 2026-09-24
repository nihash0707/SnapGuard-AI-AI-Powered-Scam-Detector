import io
from typing import Dict, Any

def generate_pdf_report(analysis: Dict[str, Any]) -> bytes:
    """
    Generates a professional PDF scan report for SnapGuard AI.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=6
        )
        subtitle_style = ParagraphStyle(
            'DocSubTitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            textColor=colors.HexColor('#64748B'),
            spaceAfter=15
        )
        section_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            textColor=colors.HexColor('#1E293B'),
            spaceBefore=12,
            spaceAfter=8
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=colors.HexColor('#334155'),
            spaceAfter=4
        )

        story = []

        # Header
        story.append(Paragraph("SNAPGUARD AI", title_style))
        story.append(Paragraph("Private On-Device AI Security Scan Report", subtitle_style))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#06B6D4'), spaceAfter=15))

        # Risk Banner Color mapping
        risk_level = analysis.get("risk_level", "LOW")
        risk_score = analysis.get("risk_score", 0)

        badge_color = colors.HexColor('#EF4444') if risk_level in ["CRITICAL", "HIGH"] else (
            colors.HexColor('#F59E0B') if risk_level == "MEDIUM" else colors.HexColor('#10B981')
        )

        summary_data = [
            [Paragraph(f"<b>Scan ID:</b> {analysis.get('id')}", body_style), Paragraph(f"<b>Date:</b> {analysis.get('timestamp')}", body_style)],
            [Paragraph(f"<b>Scan Type:</b> {analysis.get('scan_type', '').capitalize()}", body_style), Paragraph(f"<b>AI Provider:</b> {analysis.get('ai_provider_used')}", body_style)],
            [Paragraph(f"<b>Risk Level:</b> <font color='{badge_color.hexval()}'><b>{risk_level}</b></font>", body_style), Paragraph(f"<b>Risk Score:</b> <b>{risk_score} / 100</b>", body_style)]
        ]

        summary_table = Table(summary_data, colWidths=[270, 270])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0'))
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 15))

        # Executive Summary
        story.append(Paragraph("Executive Risk Summary", section_style))
        story.append(Paragraph(analysis.get("summary", ""), body_style))
        story.append(Spacer(1, 10))

        # Signals Table
        signals = analysis.get("signals", [])
        if signals:
            story.append(Paragraph("Detected Security Signals", section_style))
            sig_table_data = [["Signal Indicator", "Severity", "Description & Evidence"]]
            for s in signals:
                sev = s.get("severity", "medium").upper()
                sig_table_data.append([
                    Paragraph(f"<b>{s.get('name')}</b>", body_style),
                    Paragraph(f"<b>{sev}</b>", body_style),
                    Paragraph(f"{s.get('description')}<br/><font color='#64748B'>Evidence: {s.get('evidence', 'N/A')}</font>", body_style)
                ])

            sig_table = Table(sig_table_data, colWidths=[140, 70, 330])
            sig_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('PADDING', (0, 0), (-1, -1), 6),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0'))
            ]))
            story.append(sig_table)
            story.append(Spacer(1, 15))

        # Recommendations
        recs = analysis.get("recommendations", [])
        if recs:
            story.append(Paragraph("Recommended Remediation Actions", section_style))
            for r in recs:
                story.append(Paragraph(f"✓ {r}", body_style))
            story.append(Spacer(1, 15))

        # Footer Notice
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=10, spaceAfter=10))
        privacy_note = "<i>Privacy Note: SnapGuard AI generated this report locally on your device. No private user communication was transmitted to external servers.</i>"
        story.append(Paragraph(privacy_note, ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.HexColor('#94A3B8'))))

        doc.build(story)
        return buffer.getvalue()

    except Exception as e:
        # Text based fallback PDF byte generator if reportlab styling encounters issues
        text_content = f"SNAPGUARD AI REPORT\nID: {analysis.get('id')}\nRisk Level: {analysis.get('risk_level')}\nScore: {analysis.get('risk_score')}\nSummary: {analysis.get('summary')}"
        return text_content.encode('utf-8')
