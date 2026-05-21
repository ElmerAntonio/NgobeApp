# Pruebas y avance de NgöbeApp

Fecha base del reporte: 2026-05-09 (Actualizado)

## Estado Ejecutivo de Fases

Basado en la arquitectura del proyecto, nos encontramos en la transición y desarrollo activo de la **Fase 2**.

### ✅ Fase 0 — Ya construido (Completada)
- [x] Navegación (tabs + stack)
- [x] Pantallas UI base (5 screens)
- [x] Tema visual Ngäbe (colores, formas)
- [x] Componente triángulo (`NgobeTriangle`)
- [x] Estructura de carpetas escalable
- [x] Supabase + Expo configurados y listos

### ✅ Fase 1 — Infraestructura y Auth (Completada)
- [x] Supabase: esquema SQL + RLS habilitado
- [x] Auth real (login/logout con Supabase)
- [x] Contexto de sesión (`AuthContext.js`)
- [x] AppNavigator: proteger rutas por rol/sesión
- [x] Variables `.env` reales (URL + anon key)
- [x] `react-native-safe-area` + `bottom-tabs` implementados

### 🚧 Fase 2 — Corpus y gestión de datos (En Progreso - FASE ACTUAL)
*El corazón del proyecto: el diccionario Ngäbere.*
- [ ] CRUD palabras/frases con región y variantes
- [ ] Supabase Storage para audios
- [ ] Flujo aprobación (Colaborador → Maestro)
- [ ] Búsqueda con variantes regionales
- [ ] Módulo grabación audio (lento + rápido)
- [ ] `ExploreScreen`: consumir datos reales de Supabase (sin mocks)

### ⏳ Fase 3 — IA conversacional Ngäbere (Pendiente)
*Integración con API de Anthropic (Claude).*
- [ ] Pantalla chat con IA (`ConversaScreen.js`)
- [ ] Prompt con corpus Ngäbere en contexto
- [ ] Detección de región por vocabulario
- [ ] Traductor Ngäbere ↔ Español
- [ ] Modo lección (aprendiz)
- [ ] Panel admin: stats y calidad corpus

### ⏳ Fase 4 — Lanzamiento y comunidad (Pendiente)
- [ ] Build APK + TestFlight
- [ ] Onboarding maestros
- [ ] Backup + cumplimiento Ley 81 estricto en producción

---

## Cómo usar el programa
1. Instala dependencias con `pnpm install` (el proyecto usa `pnpm`, no `npm`).
2. Copia `.env.example` a `.env`.
3. Completa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Aplica `supabase/schema.sql` en un proyecto Supabase nuevo, o `supabase/security_patch.sql` si ya existe la base.
5. Inicia Expo con `pnpm run start`.
6. Entra con una cuenta existente o regístrate aceptando privacidad y términos.
7. Usa `Aportar` para enviar palabra, frase, cuento o canción.
8. Usa `Perfil` para cerrar sesión.

## Cómo correr pruebas masivas
Ejecuta:

```bash
pnpm run test:mass
```

Esto corre:
- `pnpm run test`: pruebas de validaciones, estructura, accesibilidad, seguridad estática y SQL de Supabase (con el test runner nativo de Node.js).
- `pnpm run test:security`: `pnpm audit` para dependencias.

Para iterar más rápido durante desarrollo:

```bash
pnpm run test
```

## Avance real vs. Estancamiento
Estamos avanzando si:
- `pnpm run test:mass` pasa completo.
- Un usuario puede registrarse, iniciar sesión, aportar datos reales y cerrar sesión.
- Supabase tiene RLS activo y los audios suben a Storage correctamente (Fase 2).
- Los aportes quedan asociados al usuario autenticado en la base de datos de producción.

Estamos estancados si:
- Solo se cambia la interfaz sin probar flujos reales en dispositivo.
- No se aplica el esquema actualizado en Supabase.
- El módulo de grabación no capta audio real.
- El flujo de revisión/aprobación de datos sigue siendo diseño sin conexión a base de datos.

## Siguientes pasos inmediatos (Fase 2)
Prioridad Alta:
- Conectar `ExploreScreen` a Supabase para cargar palabras y frases reales.
- Implementar y probar el módulo de grabación de audios (Lento y Normal) en dispositivo físico.
- Integrar Supabase Storage para guardar y recuperar las grabaciones.
