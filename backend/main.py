from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import qr, pdf_tools, bg_remover

app = FastAPI(title="Nano Tools Hub API")

# Allow frontend (Vercel) to call this backend.
# Replace "*" with your actual Vercel URL once deployed, for safety.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(qr.router, prefix="/api/qr", tags=["QR"])
app.include_router(pdf_tools.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(bg_remover.router, prefix="/api/bg", tags=["BG Remover"])


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Nano Tools Hub backend is running"}
