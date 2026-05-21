# Política de Seguridad de NgöbeApp 🛡️

El equipo de NgöbeApp toma muy en serio la seguridad y la privacidad, especialmente porque manejamos información cultural valiosa y datos personales de los sabios y maestros de la Comarca Ngäbe-Buglé. Todas nuestras prácticas se rigen en estricto cumplimiento con la **Ley 81 de Protección de Datos Personales de Panamá** y buenas prácticas como la **ISO 27001**.

## Etapa Actual del Proyecto

El proyecto se encuentra en la **Fase 2 de Desarrollo**. Durante esta etapa temprana, la seguridad se enfoca en las bases de infraestructura y gestión de accesos (Row Level Security en Supabase) y en validar el consentimiento informado desde la aplicación (`PrivacyPolicyScreen`).

## Versiones Soportadas

Actualmente, el proyecto está en etapa Alpha/Beta de desarrollo, por lo que solo la rama `main` y las fases de desarrollo activo reciben monitoreo y parches de seguridad de dependencias (`pnpm audit`).

| Versión | Soportada          |
| ------- | ------------------ |
| v1.0.x  | ✅ Sí (Pre-Release)|
| < v1.0  | ❌ No              |

## Ley 81 de Protección de Datos Personales (Panamá)

Para cumplir con la legislación panameña, NgöbeApp asegura:
1. **Consentimiento Expreso:** Todo usuario (Maestro/Colaborador) debe aceptar de forma explícita los términos y condiciones antes del registro.
2. **Uso Legítimo:** Los audios y el corpus lingüístico recopilado se utilizarán exclusivamente para entrenar y mejorar la herramienta de IA, preservando la lengua Ngäbe.
3. **Derecho ARCO:** Los usuarios tienen el derecho de Acceder, Rectificar, Cancelar o de Oponerse al uso de sus datos o aportes en cualquier momento.

## Reportar una Vulnerabilidad

**Por favor, NO reportes vulnerabilidades de seguridad abriendo un "Issue" público.**

Si crees que has encontrado una vulnerabilidad de seguridad en la aplicación móvil, en el backend o en la configuración de Supabase de NgöbeApp, te pedimos que utilices la herramienta de reportes privados de GitHub. De esta manera, podemos solucionar el problema antes de que se haga público y pueda comprometer el corpus.

### Cómo reportar:
1. Ve a la pestaña **Security** (Seguridad) en la página principal de este repositorio.
2. En el menú de la izquierda, haz clic en **Advisories** (Avisos).
3. Haz clic en el botón verde **Report a vulnerability** (Reportar una vulnerabilidad).
4. Llena el formulario con toda la información posible:
   - Tipo de vulnerabilidad.
   - Pasos exactos para reproducirla.
   - Posible impacto a nivel de base de datos o exposición de información.

### Tiempos de respuesta
Nos comprometemos a revisar tu reporte lo antes posible a través de la plataforma de GitHub. Mantendremos la comunicación contigo en el hilo privado del aviso (Advisory) que acabas de crear hasta que el problema sea resuelto.

Una vez que el problema sea parcheado, daremos el crédito correspondiente a la persona que hizo el reporte (si así lo desea) en nuestras notas de lanzamiento.

¡Gracias por ayudarnos a mantener segura la cultura Ngäbe y los datos de nuestra comunidad! 🌿
