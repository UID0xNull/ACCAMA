# ACCAMA

## Requisitos
- Node.js (v18 o superior)
- MariaDB

## Variables de entorno
En la carpeta `backend` copiar el archivo `.env.example` a `.env` y completar los valores de las siguientes claves:

- `PORT`: puerto del servidor (por defecto 3000).
- `DB_HOST`: host de la base de datos.
- `DB_PORT`: puerto de MariaDB.
- `DB_NAME`: nombre de la base de datos.
- `DB_USER`: usuario de la base de datos.
- `DB_PASSWORD`: contraseña del usuario.
- `JWT_SECRET`: clave para firmar los tokens.

## Levantar el backend

```bash
cd backend
npm install
npm run sync-db
npm run seed-roles
npm start
```
El script `npm run seed-roles` crea los roles básicos en la base de datos.

## Iniciar el frontend

```bash
cd frontend
npm install
npm run dev
```

## Roles
- **Admin**: gestiona usuarios, aprueba o rechaza ONGs y retiros y accede a las estadísticas del sistema.
- **Doctor**: administra sus pacientes, puede asociarlos y subir documentos médicos y legales.
- **Legal**: consulta los registros legales cargados.
- **Paciente**: accede a su área personal y puede solicitar retiros.

## Flujo de aprobación

### ONGs
1. Las ONGs se registran mediante `POST /ongs` y quedan en estado `pendiente`.
2. Un administrador revisa las solicitudes.
3. El administrador aprueba (`POST /ongs/:id/approve`) o rechaza (`POST /ongs/:id/reject`).

### Retiros
1. Un usuario autenticado crea un retiro con `POST /withdrawals`. El retiro inicia en estado `pendiente`.
2. Un administrador actualiza el estado con `PUT /withdrawals/:id` a `aprobado` o `rechazado`.
3. Si se rechaza, la cantidad se devuelve al stock correspondiente.

### Documentación legal
1. Un médico sube archivos mediante `POST /legal-records`.
2. Cualquier usuario autenticado puede consultar los registros con `GET /legal-records/:patientId`.
