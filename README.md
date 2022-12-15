# Backoffice UI

## Scripts

### `npm start`

Ejecuta la aplicación en modo development .\
[http://localhost:3000](http://localhost:3000) para abrirla en el browser.

### `npm run build`

Compila la aplicación para producció en la carpeta `build`.\

## Configuración

## src/vars.js

Se necesita definiar las urls para las distintas APIs de usuarios, backoffice y pagos en las variables: `urlUsers`, `urlBackoffice`, y `urlPayments`, respectivamente.

## src/firebase.js

Es necesario reemplazar `firebaseConfig` con los datos del cliente para poder iniciar sesión

## Usuario admin por defecto

Para acceder a la aplicación por primera vez se necesita contar con un administrador creado de antemano al momento de configurar Firebase.

## CORS

Las APIs de Usuarios, Backoffice y Pagos deben estar configuradas para aceptar peticiones desde ésta UI
