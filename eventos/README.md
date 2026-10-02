# Agenda de Temuco

- Vista pública: `/eventos/`.
- Administración: `/eventos/?admin=1` (Google Sign-In, cuenta autorizada `quidel.dsgn@gmail.com`).
- Actividades por Top8 Trizano, Top8 Neruda y Bluecard; los registros se guardan en Firebase Realtime Database bajo `agenda/events`.

Las reglas de Firebase están publicadas en el proyecto `cronoapp-97aa6`. La agenda permite lectura pública y limita la escritura a la cuenta administradora verificada con Google. `/agenda/` redirige a `/eventos/` y conserva los parámetros de consulta.
