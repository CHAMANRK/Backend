import io
from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import StreamingResponse
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from PIL import Image

router = APIRouter()


@router.post("/generate")
def generate_qr(text: str = Form(...)):
    """Normal black & white QR code."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@router.post("/art")
async def generate_art_qr(text: str = Form(...), logo: UploadFile = File(...)):
    """Styled QR code with a logo/image embedded in the center."""
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)

    logo_bytes = await logo.read()
    logo_img = Image.open(io.BytesIO(logo_bytes)).convert("RGBA")

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        embedded_image=logo_img,
    )

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
