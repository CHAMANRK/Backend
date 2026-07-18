import io
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import pikepdf
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

router = APIRouter()


@router.post("/lock")
async def lock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    """Add a password to an existing PDF."""
    data = await file.read()
    pdf = pikepdf.open(io.BytesIO(data))

    buf = io.BytesIO()
    pdf.save(buf, encryption=pikepdf.Encryption(owner=password, user=password))
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=locked.pdf"},
    )


@router.post("/unlock")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    """Remove password protection from a PDF."""
    data = await file.read()
    try:
        pdf = pikepdf.open(io.BytesIO(data), password=password)
    except pikepdf.PasswordError:
        raise HTTPException(status_code=400, detail="Wrong password")

    buf = io.BytesIO()
    pdf.save(buf)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=unlocked.pdf"},
    )


@router.post("/watermark")
async def watermark_pdf(file: UploadFile = File(...), text: str = Form(...)):
    """Stamp a text watermark diagonally across every page."""
    data = await file.read()
    src_pdf = pikepdf.open(io.BytesIO(data))

    # Build a one-page watermark PDF with reportlab
    wm_buf = io.BytesIO()
    c = canvas.Canvas(wm_buf, pagesize=letter)
    c.saveState()
    c.setFont("Helvetica-Bold", 40)
    c.setFillGray(0.5, 0.4)
    c.translate(300, 400)
    c.rotate(45)
    c.drawCentredString(0, 0, text)
    c.restoreState()
    c.save()
    wm_buf.seek(0)

    watermark_pdf = pikepdf.open(wm_buf)
    watermark_page = watermark_pdf.pages[0]

    for page in src_pdf.pages:
        page.add_overlay(watermark_page)

    out_buf = io.BytesIO()
    src_pdf.save(out_buf)
    out_buf.seek(0)
    return StreamingResponse(
        out_buf,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=watermarked.pdf"},
    )
