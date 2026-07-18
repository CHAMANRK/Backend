import io
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from rembg import remove

router = APIRouter()


@router.post("/remove")
async def remove_background(file: UploadFile = File(...)):
    """Removes background from an uploaded image, returns transparent PNG."""
    input_bytes = await file.read()
    output_bytes = remove(input_bytes)

    buf = io.BytesIO(output_bytes)
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=no-bg.png"},
    )
