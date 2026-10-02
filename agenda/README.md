# Agenda de Temuco

La vista pública estará en `/agenda/`. El formulario de administración estará en `/agenda/?admin=1` y usa Google Sign-In. Guarda los registros en Firebase Realtime Database bajo `agenda/events`.

## Antes de publicar

1. La cuenta de Google `quidel.dsgn@gmail.com` fue confirmada por el propietario como administradora.
2. `database.rules.json` contiene las reglas vigentes compartidas por el propietario para `rooms` y `shortRooms`, más la regla de `agenda`. Antes de publicar, compara las reglas actuales de Firebase Console con ese archivo para detectar cambios posteriores.
3. Publica `database.rules.json` desde Firebase Console o, con Firebase CLI autenticada, ejecuta `firebase deploy --only database --project cronoapp-97aa6` desde la raíz del repositorio. `firebase.json` configura únicamente las reglas de Realtime Database.
4. Comprueba con la cuenta administradora que puedes crear, editar y eliminar una actividad. Comprueba con otra cuenta que Firebase rechaza una escritura directa en `agenda/events`, y sin iniciar sesión que la agenda se puede leer.

La comprobación de correo en el navegador controla la interfaz; la seguridad depende de la regla publicada en Firebase.
