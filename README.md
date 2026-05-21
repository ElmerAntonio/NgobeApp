# NgöbeApp 🌿

[![Security Pipeline](https://github.com/ElmerAntonio/NgobeApp/actions/workflows/security.yml/badge.svg)](https://github.com/ElmerAntonio/NgobeApp/actions/workflows/security.yml)
[![CI Pipeline](https://github.com/ElmerAntonio/NgobeApp/actions/workflows/ci.yml/badge.svg)](https://github.com/ElmerAntonio/NgobeApp/actions/workflows/ci.yml)

**NgöbeApp** es una iniciativa tecnológica y social diseñada para preservar, enseñar y revitalizar el idioma y la cultura Ngäbe a través de Inteligencia Artificial. Este proyecto nace con el propósito de conectar las raíces ancestrales de la Comarca Ngäbe-Buglé (Panamá) con las herramientas del futuro.

Diseño de app para la implementación de una IA para aprendizaje del dialecto Ngöbe, con futura estructura para enseñanza y traducción. Se implementará por medio de documentación y también la aportación de Maestros y otros colaboradores.

## 📍 Estado del Proyecto: En Desarrollo (Fase 2)

El proyecto se está construyendo mediante un enfoque iterativo de 5 Fases. Actualmente nos encontramos en la **Fase 2**.

- ✅ **Fase 0:** Navegación, UI Base y Temas.
- ✅ **Fase 1:** Infraestructura (Supabase, Auth) y Seguridad Base.
- 🚧 **Fase 2 (Actual):** Gestión del Corpus, CRUD de Diccionario y manejo de Audios con Storage.
- ⏳ **Fase 3:** Integración con IA (Claude de Anthropic) y Chat Conversacional.
- ⏳ **Fase 4:** Lanzamiento, Pruebas y despliegue a producción.

## 🎯 Visión y Objetivos

El objetivo principal es entrenar un modelo de Inteligencia Artificial capaz de entender, escribir y hablar el idioma Ngäbe, reconociendo las distintas regionalidades de la Comarca.

En esta fase inicial, la aplicación está diseñada para **maestros, sabios y personas autorizadas** que nutrirán la base de datos de la IA con:

- Palabras y frases.
- Cuentos y canciones tradicionales.
- Grabaciones de audio en pronunciación lenta y rápida para facilitar el aprendizaje de la IA y de futuros estudiantes.
- Identificación de dialectos por región.

## 🎨 Diseño Visual

La interfaz de usuario ha sido concebida con un profundo respeto por la identidad Ngäbe:

- **Colores:** Inspirados en la naturaleza, las montañas de la cordillera y los tonos tierra.
- **Formas:** Uso de patrones geométricos, especialmente triángulos, que son un símbolo distintivo en la artesanía y vestimenta (naguas) Ngäbe.

## 🏗 Arquitectura

- **Frontend:** React Native y Expo (Navegación con React Navigation).
- **Backend & Base de Datos:** Supabase (PostgreSQL, Storage para audios, Autenticación).
- **Gestor de Paquetes:** `pnpm`.
- **Integraciones futuras:** API de Anthropic.

## 📜 Legal y Privacidad

Este proyecto es de código abierto y está protegido bajo la licencia **GNU GPL v3**. Cumple con la **Ley 81 de Protección de Datos Personales de Panamá**, garantizando el uso ético y consentido de las grabaciones y datos aportados por los maestros.

## 🔐 Variables de Entorno

### Para desarrollo local:

1. Copia `.env.example` a `.env`
2. Completa estas variables con tus valores de Supabase:
   - `EXPO_PUBLIC_SUPABASE_URL`: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Tu ANON KEY de Supabase

### Para CI/CD (GitHub Actions):

Los secretos necesarios están configurados en **Settings → Secrets and variables → Actions**:
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: ANON KEY de Supabase

## 🚀 Instalación, Uso y Pruebas

1. Clona el repositorio.
2. Copia `.env.example` a `.env` y completa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. Instala las dependencias usando pnpm:
   ```bash
   pnpm install
   ```
4. Inicia el servidor de desarrollo Expo:
   ```bash
   pnpm run start
   ```
5. Abre la app con Expo Go, o ejecuta en tu emulador con `pnpm run android` o `pnpm run ios`.
6. Ejecuta la batería local de pruebas:
   ```bash
   pnpm run test:mass
   ```

## 🧪 Pruebas y Calidad de Código

El proyecto utiliza el test runner nativo de Node.js y un sistema de auditoría estática.
Puedes ver el detalle de los avances y el reporte en `PRUEBAS_Y_AVANCE.md` y `REPORTE_COMPLETO.md`.
