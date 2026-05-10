# NgobeApp - Roadmap, Avance y Pendientes

Actualizado: 2026-05-10

Fuente usada:
- `REPORTE_COMPLETO.md`
- `PRUEBAS_Y_AVANCE.md`
- `nogbeapp_roadmap.svg`
- Revisión actual del código

## Estado General

**Estamos avanzando.** La app ya tiene base funcional, navegación, pantallas principales, Supabase configurado en código, pruebas locales y mejoras de seguridad. No estamos estancados, pero todavía no estamos listos para lanzamiento.

**Fase actual:** transición entre **Fase 1: infraestructura/auth** y **Fase 2: corpus y gestión de datos**.

Fase 1 está casi cerrada en código, pero falta validar todo contra Supabase real y completar sesión/roles. Fase 2 ya empezó con pantalla de aportes y grabación de audio, pero todavía falta conectar datos reales, aprobación y calidad de corpus.

## Verificación Actual

- [x] `npm install` ejecutado.
- [x] `npm run test:mass` corre.
- [x] 20 pruebas automatizadas pasan.
- [x] `npm audit` queda en 0 vulnerabilidades después de actualizar dependencias.
- [x] `axios` actualizado a versión segura.
- [x] `postcss` forzado a versión segura con `overrides`.
- [ ] App probada de punta a punta en teléfono Android real.
- [ ] SQL aplicado y verificado dentro del panel real de Supabase.

## Fase 0: Base Ya Construida

- [x] Navegación con stack y tabs.
- [x] Pantallas principales creadas: Login, Dashboard, Contribute, Explore y Profile.
- [x] Tema visual centralizado en `src/utils/theme.js`.
- [x] Componente visual `NgobeTriangle`.
- [x] Estructura base de carpetas.
- [x] Proyecto Expo listo.
- [x] Cliente Supabase creado.
- [x] Safe area provider instalado y usado.
- [x] Bottom tabs instalados y usados.

## Fase 1: Infraestructura, Seguridad y Auth

- [x] Instalación de dependencias base.
- [x] `.env.example` creado.
- [x] `.env` protegido por `.gitignore`.
- [x] Cliente Supabase usando `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Login con Supabase.
- [x] Registro con Supabase.
- [x] Logout real con `supabase.auth.signOut()`.
- [x] Consentimiento obligatorio al registrarse.
- [x] Esquema SQL base para `contributions`.
- [x] RLS definido en SQL.
- [x] Bucket de audios definido como privado en SQL.
- [x] Políticas menos abiertas para lectura/escritura.
- [x] Dependencias auditadas y corregidas.
- [ ] Aplicar `supabase/schema.sql` o `supabase/security_patch.sql` en Supabase real.
- [ ] Verificar en Supabase que RLS esté activo de verdad.
- [ ] Crear `AuthContext.js` para mantener sesión global.
- [ ] Hacer que `AppNavigator` decida entre Login/Main según sesión real.
- [ ] Proteger rutas por rol.
- [ ] Crear roles reales: `maestro`, `colaborador`, `superadmin`.
- [ ] Crear tabla/perfil de usuarios con rol, comunidad y estado de aprobación.
- [ ] Bloquear usuarios no aprobados.
- [ ] Documentar operación de Supabase para administradores.

## Fase 2: Corpus y Gestión de Datos

Esta es la fase donde estamos entrando ahora. Es el corazón del proyecto: recolectar, validar, revisar y consultar corpus Ngäbere.

- [x] Pantalla `ContributeScreen` creada.
- [x] Categorías de aporte: palabra, frase, cuento y canción.
- [x] Campos de texto Ngäbe/Español.
- [x] Campo de región/dialecto.
- [x] Grabación de audio lento y natural/rápido desde la UI.
- [x] Subida de audio a Supabase Storage en código.
- [x] Inserción de aportes en tabla `contributions` en código.
- [x] Validación centralizada de aportes.
- [x] Aviso cuando falta audio.
- [x] `ExploreScreen` creado con lista usando `FlatList`.
- [ ] Probar aporte real en teléfono Android con micrófono.
- [ ] Confirmar que los audios suben a Supabase Storage.
- [ ] Confirmar que los aportes quedan ligados al `user_id`.
- [ ] Conectar `ExploreScreen` a datos reales de Supabase.
- [ ] Eliminar `MOCK_DATA` de `ExploreScreen`.
- [ ] Agregar búsqueda de palabras/frases.
- [ ] Agregar filtros por categoría.
- [ ] Agregar filtros por región/dialecto.
- [ ] Implementar paginación en consultas.
- [ ] Crear pantalla "Mis Aportes".
- [ ] Mostrar estado del aporte: pendiente, aprobado o rechazado.
- [ ] Crear flujo de aprobación: colaborador -> maestro/superadmin.
- [ ] Crear panel de revisión de calidad de datos.
- [ ] Permitir editar o corregir aportes pendientes.
- [ ] Validar duración mínima de audio.
- [ ] Validar que cada aporte tenga región/dialecto.
- [ ] Validar duplicados antes de insertar.
- [ ] Guardar metadatos de audio: duración, tipo, usuario, fecha.
- [ ] Crear métricas de corpus: total de palabras, frases, audios, regiones.
- [ ] Agregar caché o estrategia para no descargar audios repetidamente.

## Fase 3: IA Conversacional Ngäbere

Esta fase todavía no debe ser la prioridad inmediata. Primero necesitamos corpus real, limpio y aprobado.

- [ ] Crear pantalla `ConversaScreen.js`.
- [ ] Agregar pestaña o ruta para conversación con IA.
- [ ] Diseñar prompt base con reglas culturales y lingüísticas.
- [ ] Usar corpus aprobado como contexto.
- [ ] Integrar API de IA desde backend seguro, no desde el frontend.
- [ ] Evitar exponer claves privadas en Expo.
- [ ] Crear traductor Ngäbere <-> Español.
- [ ] Detectar región/dialecto por vocabulario.
- [ ] Crear modo lección para aprendices.
- [ ] Agregar ejercicios de pronunciación.
- [ ] Crear panel admin con estadísticas de calidad del corpus.
- [ ] Evaluar respuestas de IA con maestros antes de abrirlo al público.

## Fase 4: Lanzamiento y Comunidad

- [ ] Preparar build APK para pruebas Android.
- [ ] Preparar build iOS/TestFlight si se decide soportar iPhone.
- [ ] Crear guía de onboarding para maestros.
- [ ] Crear guía de uso para colaboradores.
- [ ] Crear política de privacidad real.
- [ ] Crear términos de uso reales.
- [ ] Crear proceso de consentimiento informado.
- [ ] Crear proceso de eliminación de cuenta y datos.
- [ ] Crear respaldo periódico de base de datos y audios.
- [ ] Crear plan de soporte comunitario.
- [ ] Crear plan de mantenimiento técnico.
- [ ] Revisar cumplimiento Ley 81 de Panamá antes de producción.

## Auditoría Técnica Pendiente

### Seguridad

- [x] Variables sensibles fuera del repositorio.
- [x] Auditoría de dependencias con `npm audit`.
- [x] Corrección de vulnerabilidades de Axios/PostCSS.
- [x] RLS escrito en SQL.
- [ ] RLS verificado en Supabase real.
- [ ] Revisar que el bucket privado no permita lectura pública.
- [ ] Usar `expo-secure-store` si se guarda información sensible.
- [ ] Definir política de backups y acceso administrativo.
- [ ] Revisar certificate pinning más adelante.
- [ ] Evaluar detección root/jailbreak solo si el riesgo lo justifica.

### Testing

- [x] Pruebas automatizadas locales con Node test runner.
- [x] Pruebas de validación.
- [x] Pruebas de estructura.
- [x] Pruebas estáticas de seguridad.
- [x] Pruebas del SQL base.
- [ ] Instalar Jest y Testing Library para pruebas de componentes.
- [ ] Agregar pruebas de LoginScreen.
- [ ] Agregar pruebas de ContributeScreen.
- [ ] Agregar pruebas de ExploreScreen con datos reales mockeados.
- [ ] Agregar pruebas E2E con Detox o alternativa.
- [ ] Crear GitHub Actions para ejecutar `npm run test:mass`.

### Calidad de Código

- [x] Validaciones extraídas a `src/utils/validation.js`.
- [x] Archivos `info.txt` residuales eliminados.
- [ ] Instalar ESLint.
- [ ] Instalar Prettier.
- [ ] Agregar `npm run lint`.
- [ ] Agregar `npm run format`.
- [ ] Migrar gradualmente a TypeScript.
- [ ] Crear tipos para respuestas de Supabase.
- [ ] Crear manejo global de errores.
- [ ] Crear Error Boundary.

### UX y Accesibilidad

- [x] Accesibilidad básica en botones y campos principales.
- [x] Feedback de carga en login y subida de aporte.
- [ ] Revisar textos mojibake/encoding visibles en UI.
- [ ] Revisar pantallas en móvil real.
- [ ] Revisar tamaños de texto y botones.
- [ ] Mejorar estados vacíos.
- [ ] Mejorar mensajes de error.
- [ ] Agregar confirmaciones antes de acciones importantes.
- [ ] Crear pantalla de ayuda básica para maestros.

### Rendimiento

- [x] Uso de `FlatList` en Explore.
- [ ] Paginación en Supabase.
- [ ] Lazy loading para audios.
- [ ] Caché de audios.
- [ ] Memoización de items pesados si la lista crece.
- [ ] Evitar consultas grandes sin límite.

## Bloqueadores Reales

- [ ] Falta validar Supabase real con RLS aplicado.
- [ ] Falta prueba física en Android con micrófono.
- [ ] Falta confirmar subida real de audios.
- [ ] Falta sistema de roles y aprobación.
- [ ] Falta reemplazar datos mock por datos reales.
- [ ] Falta política legal completa para consentimiento, privacidad y eliminación.

## Próximos 10 Pasos Recomendados

1. Aplicar `supabase/security_patch.sql` en Supabase real.
2. Ejecutar `npm run test:mass` después de aplicar cambios.
3. Iniciar app con `npm run start`.
4. Probar login/registro en Android real.
5. Probar grabación lenta y natural.
6. Confirmar en Supabase Storage que se guardan los audios.
7. Confirmar en `contributions` que se guarda el aporte con `user_id`.
8. Crear `AuthContext.js`.
9. Conectar `ExploreScreen` a Supabase.
10. Crear roles y flujo de aprobación.

## Criterio Para Decir "Fase 1 Cerrada"

- [ ] Login, registro y logout funcionan en teléfono real.
- [ ] Sesión persiste correctamente.
- [ ] Rutas se protegen según sesión.
- [ ] Roles básicos existen.
- [ ] RLS está aplicado y probado en Supabase.
- [ ] Usuario no autorizado no puede leer/escribir datos ajenos.

## Criterio Para Decir "Fase 2 Cerrada"

- [ ] Maestros pueden aportar palabras/frases/cuentos/canciones.
- [ ] Se suben audios lento y natural.
- [ ] Todo aporte queda ligado a usuario y región.
- [ ] Existe revisión/aprobación.
- [ ] Explore muestra datos reales aprobados.
- [ ] Hay búsqueda y filtros.
- [ ] Hay métricas mínimas de calidad de corpus.

## Conclusión Actual

NgobeApp ya tiene una base seria. La siguiente victoria no es agregar IA todavía: es cerrar autenticación real, roles, Supabase aplicado, aportes reales y revisión del corpus. Cuando Fase 2 esté sólida, entonces sí conviene entrar a IA conversacional.
