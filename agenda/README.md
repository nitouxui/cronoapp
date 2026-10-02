# Agenda de Temuco

La vista pública estará en `/agenda/`. El formulario de administración estará en `/agenda/?admin=1` y usa Google Sign-In. Guarda los registros en Firebase Realtime Database bajo `agenda/events`.

## Antes de publicar

1. Confirma que `quidel.dsgn@gmail.com` es la cuenta de Google administradora. Si no lo es, cambia el correo en `agenda/index.html` y `agenda/rules.fragment.json`.
2. Recupera las reglas vigentes de Realtime Database en Firebase Console. Integra **solo** el nodo `agenda` de `rules.fragment.json` dentro de `rules` y conserva los nodos existentes. Publica las reglas resultantes desde la consola o Firebase CLI.
3. Revisa los permisos de los nodos antecesores: una regla `.write` permisiva en `/` anula las restricciones escritas más abajo. La escritura exclusiva requiere que `/` no otorgue escritura general.
4. Comprueba con la cuenta administradora que puedes crear, editar y eliminar una actividad. Comprueba con otra cuenta que Firebase rechaza una escritura directa en `agenda/events`, y sin iniciar sesión que la agenda se puede leer.

No despliegues `rules.fragment.json` como archivo completo de reglas: reemplazaría los permisos actuales de las salas. La comprobación de correo en el navegador controla la interfaz; la seguridad depende de la regla publicada en Firebase.
