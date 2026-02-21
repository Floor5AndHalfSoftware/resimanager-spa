# 🔧 Guía de Solución de Problemas - Login

## ❌ Errores Actuales

1. **Error 400**: "El usuario no tiene acceso a la administradora especificada"
2. **CORS Error**: Intenta conectarse a Koyeb en vez de localhost
3. **Menu Error**: No puede cargar el menú

## ✅ Soluciones Paso a Paso

### 1. Reiniciar Servidor de Vite (OBLIGATORIO)

El servidor de Vite necesita reiniciarse para leer las variables de entorno del `.env`:

```bash
# En la terminal del frontend (Ctrl+C para detener si está corriendo)
cd resimanager-spa
npm run dev
```

**IMPORTANTE**: Abre el navegador en modo incógnito o limpia caché (Ctrl+Shift+Delete) para evitar que use URLs en caché.

### 2. Verificar que el Backend Local está Corriendo

```bash
# En otra terminal
cd resimanager-backoffice
mvn spring-boot:run
```

Espera a ver este mensaje:
```
Started BackofficeApplication in X.XXX seconds
```

### 3. Verificar que la Migración V2.0.7 se Aplicó

En los logs del backend al iniciar, busca:
```
Flyway: Migrating schema "public" to version "2.0.7"
```

Si NO ves esa línea, significa que la migración no se ejecutó. Esto puede pasar si:
- La base de datos ya tiene datos del admin sin contexto
- Flyway ya marcó las migraciones como aplicadas

**Solución si la migración no se aplicó:**

Ejecuta manualmente el SQL en tu base de datos PostgreSQL:

```sql
-- Crear administradora del sistema
INSERT INTO "Administradora" (admid, adm_doc_ident, adm_nombre, adm_telefono, adm_email, adm_pers_contacto, adm_sts, adm_usr_crea, adm_fch_hor_crea, adm_est_crea, adm_usr_mod, adm_fch_hor_mod, adm_est_mod) 
VALUES (99, 'J-00000000-0', 'ResiManager - Administración del Sistema', '+00000000000', 'system@resimanager.com', 1, 'A', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP')
ON CONFLICT (admid) DO NOTHING;

-- Asignar admin a la administradora
INSERT INTO "PersAdministradora" (paid, pa_per_id, pa_adm_id, pa_sts, pa_usr_crea, pa_fch_hor_crea, pa_est_crea, pa_usr_mod, pa_fch_hor_mod, pa_est_mod) 
VALUES (99, 1, 99, 'A', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP')
ON CONFLICT (paid) DO NOTHING;

-- Asignar perfil Super Administrador a la administradora
INSERT INTO "PerfAdministradora" (pfaid, pfa_prf_id, pfa_adm_id, pfa_sts, pfa_usr_crea, pfa_fch_hor_crea, pfa_est_crea, pfa_usr_mod, pfa_fch_hor_mod, pfa_est_mod) 
VALUES (99, 1, 99, 'A', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP')
ON CONFLICT (pfaid) DO NOTHING;

-- Asignar admin con perfil Super Administrador
INSERT INTO "PerfPersAdministradora" (ppaid, ppa_adm_id, ppa_per_id, ppa_prf_id, ppa_sts, ppa_usr_crea, ppa_fch_hor_crea, ppa_est_crea, ppa_usr_mod, ppa_fch_hor_mod, ppa_est_mod) 
VALUES (99, 99, 1, 1, 'A', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP', 1, CURRENT_TIMESTAMP, 'SYSTEM-BOOTSTRAP')
ON CONFLICT (ppaid) DO NOTHING;
```

### 4. Probar el Login con Logs

1. Abre la consola del navegador (F12 → Console)
2. Intenta hacer login con: `admin` / `Admin2024!`
3. Observa los logs:

**En la consola del navegador deberías ver:**
```
Login response: { token: "...", usuario: {...}, contextosDisponibles: [...] }
Contextos aplanados: [...]
Seleccionando contexto: { tipo: "ADMINISTRADORA", entidadId: 99, perfilId: 1 }
Respuesta cambio de contexto: { token: "...", contexto: {...} }
```

**En los logs del backend deberías ver:**
```
Obteniendo contextos para persona ID: 1
Usuario 1 tiene X contextos disponibles
Validando contexto para persona 1: tipo=ADMINISTRADORA, entidadId=99, perfilId=1
Relaciones de persona 1 con administradoras: [99]
```

### 5. Si Sigue el Error "El usuario no tiene acceso a la administradora"

**Significa que:**
- La migración V2.0.7 NO se ejecutó
- No existe la relación entre el usuario admin (ID:1) y la administradora (ID:99)

**Verifica en la base de datos:**

```sql
-- Ver contextos del usuario admin
SELECT * FROM "PersAdministradora" WHERE pa_per_id = 1;
```

**Debería retornar:**
```
paid | pa_per_id | pa_adm_id | pa_sts
-----|-----------|-----------|-------
 99  |     1     |    99     |   A
```

Si está vacío, ejecuta el SQL del paso 3.

### 6. Si el Error Persiste Después de Todo

**Debug adicional:**

Agrega estos logs en el backend para ver qué está pasando:

En `ContextoController.java`, línea ~67, busca:
```java
ContextoActualDTO contextoActual = contextoService.validarYConstruirContexto(
```

Y en el catch, agrega más detalle:
```java
} catch (IllegalArgumentException e) {
    log.error("Error validación: {}", e.getMessage(), e);
    return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
}
```

Reinicia el backend y revisa los logs completos.

## 📋 Checklist Final

- [ ] Backend corriendo en http://localhost:8080
- [ ] Frontend corriendo en http://localhost:5000  
- [ ] Navegador en modo incógnito o caché limpiado
- [ ] Migración V2.0.7 aplicada (verificado en DB)
- [ ] .env apunta a localhost:8080
- [ ] Logs en consola del navegador visibles
- [ ] Logs del backend visibles

## 🎯 Resultado Esperado

```
1. Login exitoso → contextosDisponibles retorna 1 contexto
2. Frontend aplana contextos → 1 combinación entidad+perfil
3. Auto-selecciona el único contexto
4. Cambio de contexto exitoso → nuevo JWT
5. Carga menú con X-Perfil-Id: 1
6. Dashboard visible con menú del Super Administrador
```

## 🆘 Si Nada Funciona

Comparte:
1. Logs completos del backend al iniciar
2. Logs de la consola del navegador
3. Resultado de: `SELECT * FROM "PersAdministradora" WHERE pa_per_id = 1;`
4. Resultado de: `SELECT * FROM "PerfPersAdministradora" WHERE ppa_per_id = 1;`
