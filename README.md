# Nano Tools Hub

Free utility tools — QR generator, PDF toolkit, background remover.
No sign-up, no subscription.

## Structure
- `frontend/` → React (Vite). Deploy to **Vercel**.
- `backend/` → Python (FastAPI). Deploy to **Render** (free tier).

## How to deploy (phone-only workflow)

### 1. GitHub
- Create a new repo (e.g. `nano-tools-hub`)
- Upload the ENTIRE `frontend` folder and `backend` folder as-is, keeping the folder structure

### 2. Backend (Render)
- Go to render.com → New → Web Service → connect your GitHub repo
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Deploy. Copy the live URL it gives you (e.g. `https://nano-tools-backend.onrender.com`)

### 3. Frontend (Vercel)
- Before deploying: open `frontend/src/api.js` and change `API_BASE` to your Render URL from step 2
- Go to vercel.com → New Project → import your GitHub repo
- Root Directory: `frontend`
- Framework Preset: Vite (auto-detected)
- Deploy

Vercel auto-detects `package.json` and runs `npm install` + `npm run build` on its own server — you never run these commands yourself.

## Local testing (optional, only if you get a laptop later)
```
# backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# frontend
cd frontend
npm install
npm run dev
```

## Notes
- Render free tier "sleeps" after inactivity — first request after idle takes ~30-50s to wake up. Normal, not a bug.
- `rembg` (background remover) downloads a small ML model on first run — this happens automatically on Render.
