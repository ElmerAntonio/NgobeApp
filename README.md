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

1. Copia `.env.example` a `.env` (en el directorio raíz y en el directorio `backend/`).
2. Completa estas variables con tus valores de Supabase:
   - `EXPO_PUBLIC_SUPABASE_URL`: Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Tu ANON KEY de Supabase

### Para CI/CD (GitHub Actions):

Los secretos necesarios están configurados en **Settings → Secrets and variables → Actions**:
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: ANON KEY de Supabase

## 🗄️ Inicialización de Base de Datos (Supabase)

Toda la base de datos se ha unificado en un único archivo de configuración consolidado:
*   **`./supabase/setup_complete.sql`**: Contiene la definición de esquemas (`profiles` y `contributions`), funciones de seguridad, triggers automáticos para la creación de perfiles, políticas RLS robustas y datos mock de prueba iniciales (incluyendo usuarios de prueba en `auth.users`).

> [!NOTE]
> Los archivos SQL antiguos e individuales (`schema.sql`, `security_patch.sql`, `roles_schema.sql`, `migration_fase2.sql` y `mock_data.sql`) deben mantenerse en el proyecto para asegurar la compatibilidad con la suite de pruebas automatizadas, pero solo necesitas ejecutar `setup_complete.sql` en el SQL Editor de tu panel de Supabase para configurar la base de datos.

## 🚀 Instalación, Uso y Pruebas

### 1. Clonar e Instalar
1. Clona el repositorio.
2. Instala las dependencias del monorepo usando `pnpm`:
   ```bash
   pnpm install
   ```

### 2. Configurar Entorno de Compilación de Android (Windows)
Para poder compilar la aplicación nativamente en tu emulador de Android Studio:

1. **Configurar las Variables de Entorno en Windows:**
   Es indispensable que configures las siguientes variables de entorno del sistema:
   *   **`JAVA_HOME`**: Debe apuntar al JDK interno de Android Studio:
       *   **Ruta estándar:** `C:\Program Files\Android\Android Studio\jbr`
   *   **`ANDROID_HOME`**: Debe apuntar al SDK de Android:
       *   **Ruta estándar:** `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`
   *   **Agregar al `Path`**: Edita la variable `Path` del sistema y añade:
       *   `%ANDROID_HOME%\platform-tools`
       *   `%ANDROID_HOME%\emulator`
       *   `%JAVA_HOME%\bin`

2. **Configurar el Android SDK en el proyecto:**
   Asegúrate de tener el archivo `./android/local.properties` apuntando a tu ruta de SDK:
   ```properties
   sdk.dir=C\:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
   ```

---

## 💻 Guía de Inicio del Programa

Sigue estos pasos en orden para iniciar la aplicación:

### Paso 1: Iniciar el Emulador de Android
Abre PowerShell y arranca el dispositivo virtual usando la ruta directa del emulador:
```powershell
& "C:\Users\Elmer\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_10_Pro_Fold
```

### Paso 2: Levantar el Servidor de Metro Bundler (Frontend)
En una nueva terminal de PowerShell (dentro de `C:\NgobeApp`), inicia el servidor de desarrollo limpiando la caché para evitar conflictos con archivos compilados anteriormente:
```powershell
# Usando npx de Node directamente (en caso de rutas globales corruptas en tu PC)
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" expo start -c
```

### Paso 3: Instalar y Correr la App en el Emulador
Una vez que Metro Bundler esté corriendo, puedes presionar la tecla **`a`** en la terminal de Metro, o ejecutar el siguiente comando en otra terminal para compilar e instalar el código nativo directamente:
```powershell
# Compila, instala y lanza la app en el emulador activo
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" expo run:android
```

---

## 🛠️ Solución de Problemas Comunes (Troubleshooting)

Durante el desarrollo y configuración en Windows se solucionaron varios inconvenientes críticos. Si te encuentras con alguno, aquí tienes la solución:

### 1. Error de compilación C++ nativa (Ninja `manifest 'build.ninja' still dirty`)
*   **Causa:** En Windows, el límite de longitud de rutas (`MAX_PATH` de 250 caracteres) choca con las rutas profundas creadas por `pnpm` para archivos nativos.
*   **Solución aplicada:** 
    *   Configuramos `virtual-store-dir-max-length=40` en `.npmrc` para acortar directorios.
    *   Añadimos un bloque de reubicación en `android/build.gradle` que mueve dinámicamente las carpetas de compilación `.cxx` de los subproyectos a `android/.cxx/` en la raíz (una ruta plana y corta).

### 2. Error en Pantalla: `Property 'require' doesn't exist` o `Property 'MessageQueue' doesn't exist`
*   **Causa:** Mismatch en los presets de Babel. Se estaba utilizando un preset genérico de React Native en lugar de `babel-preset-expo`, o una versión incorrecta (v57) incompatible con el SDK de tu app (v55).
*   **Solución aplicada:** Se instaló la versión correcta de la dependencia: `babel-preset-expo@~55.0.21` y se configuró en `babel.config.js`.
*   **Qué hacer:** Detén Metro con `Ctrl + C` e inícialo de nuevo limpiando caché: `node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" expo start -c`.

### 3. Error en Pantalla: `Cannot find native module 'ExponentAV'`
*   **Causa:** La versión instalada de la aplicación en el emulador no contiene el código nativo de la librería de audio/video (`expo-av`).
*   **Solución:** Debes forzar la reinstalación del APK nativo corriendo:
    ```powershell
    node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" expo run:android
    ```
    Si la app no se refresca, fuerza el cierre desde la terminal usando ADB:
    ```powershell
    adb shell am force-stop com.anonymous.ngobeapp
    adb shell am start -n com.anonymous.ngobeapp/.MainActivity
    ```

### 4. Error de Red: `TypeError: Network request failed` al Registrarse/Ingresar
*   **Causa:** El servidor de base de datos de **Supabase** ha pausado tu proyecto gratuito por inactividad, por lo que el subdominio DNS no responde en internet.
*   **Solución:** 
    1. Entra a tu panel en [supabase.com](https://supabase.com).
    2. Selecciona tu proyecto y haz clic en **"Restore Project"** (Restaurar proyecto) para reactivarlo.
    3. Si creas un proyecto nuevo, recuerda actualizar las variables `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` en el archivo `.env` de la raíz.

---

## 🧪 Pruebas y Calidad de Código
*   **Correr pruebas locales rápidas:**
    ```bash
    pnpm run test
    ```
*   **Correr batería de pruebas masivas y seguridad:**
    ```bash
    pnpm run test:mass
    ```

Puedes ver el detalle de los avances y el reporte en `PRUEBAS_Y_AVANCE.md` y `REPORTE_COMPLETO.md`.

