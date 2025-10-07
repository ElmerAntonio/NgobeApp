# Archivo placeholder para el backend (FastAPI)
# Ejecuta: uvicorn backend.src.app:app --reload --port 8000

from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}
