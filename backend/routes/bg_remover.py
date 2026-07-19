import io
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from PIL import Image

router = APIRouter()

# Cached session (loaded once, reused across requests instead of reloading every time)
_session = None

MAX_DIMENSION = 1200  # downscale large images to keep memory usage low


def get_session():
    global _session
    if _session is None:
        from rembg import new_session
        _session = new_session("u2netp")  # lightweight model (~4.5MB vs ~176MB default)
    return _session


@router.post("/remove")
async def remove_background(file: UploadFile = File(...)):
    """Removes background from an uploaded image, returns transparent PNG."""
    from rembg import remove

    input_bytes = await file.read()

    # Downscale large images before processing to reduce memory usage
    img = Image.open(io.BytesIO(input_bytes))
    if max(img.size) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
        resized_buf = io.BytesIO()
        img.save(resized_buf, format="PNG")
        input_bytes = resized_buf.getvalue()

    output_bytes = remove(input_bytes, session=get_session())

    buf = io.BytesIO(output_bytes)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=no-bg.png"},
    )
    
