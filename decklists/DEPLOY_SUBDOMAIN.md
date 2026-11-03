# Publicar Decklist Builder en deck.cronoapp.cl

## Objetivo

Servir la carpeta `decklists/` del repositorio `nitouxui/cronoapp` en su propio subdominio, sin cambiar el dominio ni la publicación existentes de `cronoapp.cl`.

| Ruta | Dirección |
| --- | --- |
| Constructor | `https://deck.cronoapp.cl/` |
| Consultar decklist | `https://deck.cronoapp.cl/consultar/` |
| Compartir una decklist | `https://deck.cronoapp.cl/consultar/?list=DK-XXXXXXXXXX` |
| Acceso anterior (mantener durante transición) | `https://cronoapp.cl/decklists/` |

## 1. Crear Cloudflare Pages

1. Entrar a **Cloudflare > Workers & Pages > Create application > Pages > Connect to Git**.
2. Conectar GitHub y elegir `nitouxui/cronoapp`.
3. Configurar:
   - **Nombre del proyecto:** `cronoapp-decklist` (si estuviera ocupado, escoger otro).
   - **Rama de producción:** `main`.
   - **Framework preset:** `None` (sin framework).
   - **Root directory:** vacío (raíz del repositorio).
   - **Build command:** `exit 0` (o dejarlo vacío si Cloudflare lo permite).
   - **Build output directory:** `decklists` (sin barra inicial).
4. Desplegar y probar la URL asignada `*.pages.dev`. Confirmar que el constructor se abre directamente en `/`, que `/consultar/` funciona y que carga `/catalog-m6.js`, `/decklist-ui.css` y `/sharing.js`.

El sitio original continúa funcionando en GitHub Pages: **NO** cambiar el archivo `CNAME` de la raíz, que contiene `cronoapp.cl`. No crear un `CNAME` dentro de la carpeta `decklists`.

## 2. Asociar el subdominio

En el proyecto Cloudflare Pages:
1. Abrir **Custom domains > Set up a domain**.
2. Escribir `deck.cronoapp.cl` y confirmar.
3. Si el dominio raíz ya está gestionado por Cloudflare, normalmente se crea el registro DNS correspondiente automáticamente. Si `deck` ya tiene un registro incompatible, revisarlo antes de asociar el dominio.
4. Confirmar que `https://deck.cronoapp.cl/` sirve la app y conserva **deck.cronoapp.cl** en la barra de direcciones.

Crear únicamente un registro DNS sin asociarlo desde **Custom domains** no completa el procedimiento y puede producir errores.

## 3. Autorizar el nuevo origen en Firebase

En el proyecto Firebase `cronoapp-97aa6`:
1. Abrir **Authentication > Settings > Authorized domains**.
2. Agregar `deck.cronoapp.cl` (sin protocolo ni barra).
3. Probar **Iniciar sesión con Google**, **Hacer Decklist pública**, copiar código, consultar el código y dejar de publicar.
4. Mantener `cronoapp.cl` entre los dominios autorizados mientras funcione la ruta antigua.

No modificar `authDomain` del SDK por este cambio: el controlador OAuth continúa alojado en `cronoapp-97aa6.firebaseapp.com`.

## 4. Conservar los borradores existentes

**Importante:** el borrador se guarda en `localStorage` y está ligado al origen del navegador. Los datos de `https://cronoapp.cl/decklists/` **no aparecen automáticamente** en `https://deck.cronoapp.cl/`.

- Mantener operativa la ruta antigua para no perder el acceso a borradores existentes.
- No activar una redirección automática desde la ruta anterior hasta implementar y verificar una migración de borradores explícita.
- Las decklists ya publicadas están almacenadas en Firebase y sus códigos pueden consultarse desde cualquiera de las dos interfaces, siempre que las reglas de lectura sigan permitiéndolo.
- Una vez que el nuevo sitio esté activo, todos los enlaces de **nuevas publicaciones** se generarán con `deck.cronoapp.cl` porque `sharing.js` construye las URL relativas al origen de la página.

## 5. Pruebas de aceptación

- [ ] `https://cronoapp.cl/` y los temporizadores existentes no cambian.
- [ ] `https://deck.cronoapp.cl/` abre el constructor directamente, sin prefijo `/decklists/`.
- [ ] Imágenes japonesas, energías, búsqueda y controles de cantidad cargan.
- [ ] Se muestran correctamente la vista de lista y la cuadrícula.
- [ ] `https://deck.cronoapp.cl/consultar/` abre el visor.
- [ ] Google Sign-in funciona desde el nuevo subdominio.
- [ ] Se puede publicar, copiar código, consultar y revocar una decklist.
- [ ] Las actualizaciones del directorio `decklists/` en `main` despliegan automáticamente Cloudflare Pages.
- [ ] La ruta antigua conserva acceso a los borradores locales mientras se define su migración.

## Referencias

- Cloudflare Pages + GitHub: https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare Pages — dominio personalizado: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages — configuración del build: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Firebase Authentication — Google sign-in: https://firebase.google.com/docs/auth/web/google-signin

**Estado:** instrucciones de despliegue preparadas. La activación del subdominio requiere completar la configuración de Cloudflare y Firebase; este documento por sí solo no crea DNS ni publica el nuevo origen.
