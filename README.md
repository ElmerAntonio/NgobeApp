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
Para compilar la aplicación nativamente en tu emulador de Android Studio:

1. **Configurar `JAVA_HOME`:**
   Si al compilar obtienes el error `JAVA_HOME is not set`, indica a Windows dónde encontrar el compilador Java integrado de Android Studio:
   - Abre el buscador de Windows y selecciona **"Editar las variables de entorno del sistema"**.
   - Haz clic en **Variables de entorno...**.
   - En **Variables del sistema** (sección inferior), haz clic en **Nueva...**:
     - **Nombre:** `JAVA_HOME`
     - **Valor:** `C:\Program Files\Android\Android Studio\jbr`
   - Busca la variable **`Path`**, haz clic en **Editar...**, presiona **Nuevo** y agrega: `%JAVA_HOME%\bin`.
   - Guarda todos los cambios.

2. **Configurar el Android SDK:**
   La primera vez que compiles, se creará el archivo `./android/local.properties`. Asegúrate de que apunte a la ruta de instalación de tu SDK de Android. Por ejemplo:
   ```properties
   sdk.dir=C\:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
   ```

3. **Versión de Gradle:**
   El proyecto está configurado para compilar con la versión **Gradle 8.13** (definida en `./android/gradle/wrapper/gradle-wrapper.properties`). Se configuró un tiempo de espera extendido (`networkTimeout=120000`) para evitar cancelaciones por timeouts de red al descargar las herramientas nativas.

### 3. Levantar Servidores locales
Abre dos terminales e inicia los servicios del monorepo:

*   **Terminal 1 (Backend - API Express):**
    ```bash
    pnpm --filter ngobeapp-backend dev
    ```
    Si la app no se refresca, fuerza el cierre desde la terminal usando ADB:
    ```powershell
    adb shell am force-stop com.anonymous.ngobeapp
    adb shell am start -n com.anonymous.ngobeapp/.MainActivity
    ```

### 4. Lanzar la App en Emulador o Dispositivo Físico

#### Opción A: Desde la Consola (Terminal)
Una vez que Metro Bundler esté corriendo, ejecuta en una nueva consola:
```bash
npx expo run:android
```
Esto compilará el código nativo e instalará la aplicación directamente en tu emulador abierto.

#### Opción B: Desde la Interfaz de Android Studio
Sí, puedes compilar, depurar y ejecutar las pruebas de la app directamente usando la interfaz gráfica de Android Studio:
1. Abre **Android Studio**.
2. Selecciona **Open** (Abrir) y elige la carpeta **`./android`** de este repositorio.
3. Espera a que Android Studio indexe el proyecto y compile el sistema usando el Gradle wrapper `8.13` que configuramos.
4. Conecta tu teléfono por USB (con depuración activa) o inicia un emulador desde el *Device Manager*.
5. Presiona el botón verde de **"Run"** (o `Shift + F10`) en Android Studio para instalar la app en el dispositivo.
6. **Importante:** Deja corriendo la consola de Metro Bundler (`pnpm run start`) en segundo plano para que la aplicación móvil pueda cargar el código JavaScript en caliente.
7. Una vez abierta la app, puedes interactuar con el micrófono del dispositivo, registrar usuarios, hacer aportes y monitorear la depuración con **Logcat** en Android Studio.

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

