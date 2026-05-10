# Pruebas y avance de NgobeApp

Fecha base del reporte: 2026-05-09

## Estado ejecutivo
El proyecto está avanzando, pero todavía está en una fase temprana. Ya existe una app navegable con login, dashboard, aportes, exploración, perfil, Supabase y tema visual. El bloqueo principal era que no había forma repetible de comprobar calidad: ahora existe una batería local con `npm run test:mass`.

## Cómo usar el programa
1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env`.
3. Completa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
4. Aplica `supabase/schema.sql` en un proyecto Supabase nuevo, o `supabase/security_patch.sql` si ya existe la base.
5. Inicia Expo con `npm run start`.
6. Entra con una cuenta existente o regístrate aceptando privacidad y términos.
7. Usa `Aportar` para enviar palabra, frase, cuento o canción con región/dialecto y audios lento/natural.
8. Usa `Perfil` para cerrar sesión.

## Cómo correr pruebas masivas
Ejecuta:

```bash
npm run test:mass
```

Esto corre:
- `npm run test`: pruebas de validaciones, estructura, accesibilidad, seguridad estática y SQL de Supabase.
- `npm run test:security`: `npm audit` para dependencias.

Para iterar más rápido durante desarrollo:

```bash
npm test
```

Última ejecución local:
- `npm run test:mass`: 20 pruebas pasaron.
- `npm audit`: 0 vulnerabilidades.
- Seguridad de dependencias corregida: `axios` subió a `1.16.0` y `postcss` queda forzado a `^8.5.10` mediante `overrides`.
- `npm run start -- --localhost --port 8081`: Metro inició, pero Expo falló al instalar React Native DevTools con `spawn EPERM` dentro del entorno actual. Para uso normal, ejecútalo desde tu terminal local con `npm run start`.

## Qué se corrigió usando el reporte como punto de partida
- Se agregaron scripts reales en `package.json`: `start`, `android`, `ios`, `web`, `test`, `test:security`, `test:mass`.
- Se creó `src/utils/validation.js` para validar login, registro, consentimiento y aportes.
- El registro ahora exige consentimiento antes de crear cuenta.
- Los botones y campos críticos tienen `accessibilityRole`, `accessibilityLabel` o `accessibilityState`.
- El perfil ahora ejecuta `supabase.auth.signOut()` antes de volver al login.
- Se eliminaron los `info.txt` residuales marcados en el reporte.
- El SQL base de Supabase ahora evita lectura pública abierta, asigna `user_id` con `auth.uid()` y deja el bucket de audios privado.

## Avance real vs. estancamiento
Estamos avanzando si:
- `npm run test:mass` pasa completo.
- Un usuario puede registrarse, iniciar sesión, aportar texto/audio y cerrar sesión.
- Supabase tiene RLS activo y las políticas nuevas aplicadas.
- Los aportes quedan asociados al usuario autenticado.

Estamos estancados si:
- Solo se cambia la interfaz sin probar flujos reales.
- No se aplica el SQL en Supabase.
- No se prueba en un teléfono Android real con micrófono.
- Los audios no quedan en Storage o los aportes no llegan a la tabla `contributions`.
- El flujo de revisión/aprobación de datos sigue siendo solo texto de maqueta.

## Siguientes cambios recomendados
Prioridad alta:
- Probar en dispositivo Android real con micrófono.
- Agregar duración mínima de audio antes de subir.
- Crear roles reales de maestro y superadmin en Supabase.
- Mostrar datos reales en `ExploreScreen` en vez de `MOCK_DATA`.

Prioridad media:
- Instalar Jest, Testing Library y Detox para pruebas de UI y E2E.
- Agregar CI con GitHub Actions.
- Migrar gradualmente a TypeScript.
- Guardar sesión con almacenamiento seguro cuando aplique.

Prioridad baja:
- Panel completo de revisión de aportes.
- Métricas de calidad de datos para entrenamiento de IA.
- Caché y paginación para listas grandes.
