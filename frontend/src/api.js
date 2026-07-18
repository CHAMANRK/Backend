// Change this once your FastAPI backend is deployed on Render/Railway.
// Example: "https://nano-tools-backend.onrender.com"
export const API_BASE = "https://chaman-uxrh.onrender.com";

export async function apiPost(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.blob();
}
