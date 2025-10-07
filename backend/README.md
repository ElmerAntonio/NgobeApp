# Backend (API)

Este directorio contendrá el código del backend que gestiona uploads, moderación y orquesta llamadas al servicio de IA.

Estructura sugerida:

- `backend/src/` - código del servidor (FastAPI o Express)
- `backend/.env` - variables de entorno (no comitear)
- `backend/Dockerfile` - para contenedorizar el servicio
- `backend/docker-compose.yml` - servicios útiles (Postgres, MinIO)

Siguiente paso recomendado:

- Elegir stack: **Python (FastAPI)** o **Node.js (Express)**.
- Si eliges FastAPI, crear `backend/src/app.py` con un endpoint de prueba.
