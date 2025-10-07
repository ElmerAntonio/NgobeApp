# Reporte de Avances del Proyecto NgobeApp

## Estructura de Carpetas y Archivos

- `/App.js` — Configuración principal de la navegación entre pantallas.
- `/src/screens/OnboardingScreen.js` — Pantalla de consentimiento y selección de perfil.
- `/src/screens/ContributionScreen.js` — Pantalla para subir audios, textos y traducciones.
- `/src/screens/ModerationScreen.js` — Pantalla para revisión y aprobación de datos.
- `/src/screens/HomeScreen.js` — Pantalla de inicio (para Fase 2: lecciones).

## Reporte de Avances del Proyecto NgobeApp 2

## Resumen rápido

Documento que resume la estructura actual del proyecto, los archivos añadidos recientemente y los próximos pasos recomendados para avanzar con la recolección de datos y la integración de la IA.

## Estructura de Carpetas y Archivos (estado actual)

- `/App.js` — Punto de entrada de la app (navegación configurada).
- `/src/screens/OnboardingScreen.js` — Onboarding: consentimiento y selección de perfil.
- `/src/screens/ContributionScreen.js` — Contribución: subir audios, textos y traducciones.
- `/src/screens/ModerationScreen.js` — Moderación: cola de revisión.
- `/src/screens/HomeScreen.js` — Home (lista de lecciones, Fase 2).
- `/src/assets/wireframes/` — Carpeta creada para PNG/SVG de wireframes.
- `/backend/` — Scaffold creado con `backend/src/app.py` (placeholder FastAPI) y `backend/README.md`.
- `/ml/` — Carpeta creada con `ml/preprocess.py` (placeholder) y `ml/README.md`.
- `/infra/` — Carpeta creada con `infra/README.md` donde colocar Dockerfiles y `docker-compose`.

## Fases del Proyecto (resumen)

### Fase 1 — Recolección de datos

- Onboarding: consentimiento y perfil (roles: maestro, lingüista, hablante nativo, moderador).
- Contribución: subir audios, textos y traducciones manuales.
- Moderación: aprobar/corregir/rechazar antes de usar datos en entrenamiento.

### Fase 2 — Aplicación de lecciones (próximamente)

- Home educativa: lista de lecciones y progreso.
- Práctica: grabar y recibir feedback automático.
- Contribución y Moderación: siguen activas para mejorar el dataset.

### Fase 3 — Traducción en tiempo real (futuro)

- Chat y llamadas con traducción automática.
- Detección de dialecto y aprendizaje continuo.

## Dependencias principales

- `@react-navigation/native` — Navegación entre pantallas.
- `@react-native-async-storage/async-storage` — Almacenamiento local.
- `axios` — Llamadas a APIs.
- `@react-native-community/voice` — Reconocimiento/grabación de voz.

## Cambios aplicados ahora

- Se creó el scaffold de backend con un endpoint de salud: `backend/src/app.py` (FastAPI placeholder).
- Se creó `ml/preprocess.py` como placeholder para construir el dataset desde contribuciones aprobadas.
- Se añadieron carpetas `infra/` y `src/assets/wireframes/` para infra y assets.

## Siguientes pasos recomendados (elige y ejecuto)

Puedes pedirme que implemente una de estas tareas iniciales, evito duplicar archivos si ya existen:

1. Crear scaffold completo del backend (FastAPI) con:
   `POST /api/contributions/upload` (Multer/Upload), conexión a Postgres y MinIO (docker-compose).
2. Implementar la subida desde la app (`ContributionScreen.js`) y `src/services/api.js` (FormData).
3. Generar migraciones SQL para tablas `users` y `contributions`.
4. Crear script de preprocesado `ml/preprocess.py` que convierta contribuciones aprobadas a dataset (WAV + TXT).
5. Generar PNG/SVG de wireframes y ubicarlos en `src/assets/wireframes/`.

Indica la opción (1–5) que prefieres y la implemento.

---

**Última actualización:** 23 de agosto de 2025
