# Integración Frontend-Backend ResiManager

## 📋 Descripción General

Este documento describe la integración completa entre el frontend React (resimanager-spa) y el backend Spring Boot (resimanager-backoffice).

## 🔧 Componentes Implementados

### 1. API Service Layer
**Archivo:** `src/services/api.js`

Servicio centralizado para todas las llamadas a la API del backend:

- **login(username, password)** - Autenticación de usuario
- **cambiarContexto(contextData)** - Cambio de contexto de trabajo
- **getMenuByPerfil(perfilId)** - Obtener menú dinámico según perfil
- **logout()** - Limpieza de sesión
- **isAuthenticated()** - Verificación de autenticación
- **getCurrentUser()** - Obtener usuario actual
- **getActiveContext()** - Obtener contexto activo

### 2. Authentication Context
**Archivo:** `src/context/AuthContext.jsx`

Gestor global del estado de autenticación:

```jsx
const { 
    user, 
    contextosDisponibles, 
    activeContext, 
    activePerfilId,
    login, 
    logout, 
    selectContext,
    isAuthenticated,
    hasActiveContext 
} = useAuth();
```

### 3. Componentes Actualizados

#### Login Component
**Archivo:** `src/components/login/Login.jsx`

- ✅ Integración real con API `/api/v1/login`
- ✅ Codificación Base64 de contraseña
- ✅ Manejo de errores
- ✅ Redirección automática según contextos disponibles
- ✅ Indicadores de loading

#### Context Selector
**Archivo:** `src/components/login/ContextSelector.jsx`

- ✅ Selección de contexto para usuarios multi-contexto
- ✅ Llamada a `/api/v1/contexto/cambiar`
- ✅ Actualización automática de JWT con contexto

#### Dynamic Menu Hook
**Archivo:** `src/hooks/useMenuData.jsx`

- ✅ Carga dinámica desde `/api/v1/menu/perfil`
- ✅ Reactivo al cambio de perfil activo
- ✅ Manejo de estados de carga y error

### 4. Protected Routes
**Archivo:** `src/components/ProtectedRoute.jsx`

- ✅ Protección de rutas autenticadas
- ✅ Validación de contexto activo
- ✅ Redirección automática a login/select-context

### 5. Environment Configuration

#### Desarrollo Local
**Archivo:** `.env.local`
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=/api/v1
```

#### Desarrollo con Backend en Koyeb
**Archivo:** `.env.development`
```env
VITE_API_BASE_URL=https://chilly-libbey-wtysoftware-aab36281.koyeb.app
VITE_API_VERSION=/api/v1
```

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/v1/login (password en Base64)
   ↓
3. Backend retorna JWT + contextosDisponibles (estructura anidada) + usuario
   Ejemplo de contexto retornado:
   {
     "tipo": "ADMINISTRADORA",
     "administradora": { "id": 99, "nombre": "..." },
     "perfilesDisponibles": [
       { "id": 1, "nombre": "Super Administrador" }
     ]
   }
   ↓
4. Frontend aplana contextos (un item por cada entidad+perfil)
   ↓
5. ¿Usuario tiene múltiples combinaciones entidad+perfil?
   → SÍ: Mostrar ContextSelector
   → NO: Auto-activar única combinación
   ↓
6. POST /api/v1/contexto/cambiar
   Body: { "tipo": "ADMINISTRADORA", "entidadId": 99, "perfilId": 1 }
   ↓
7. Backend retorna nuevo JWT con contexto activo
   ↓
8. GET /api/v1/menu/perfil (header X-Perfil-Id)
   ↓
9. Renderizar Dashboard con menú dinámico
```

## 📊 Usuarios de Prueba

| Usuario | Contraseña | Email | Contextos |
|---------|-----------|-------|-----------|
| admin | Admin2024! | admin@resimanager.com | 1 (Administradora) |
| cmartinez | Carlos2024! | cmartinez@edificiopalmas.com | 1 (Conjunto) |
| mrodriguez | Maria2024! | mrodriguez@condominioazul.com | 1 (Conjunto) |
| jlopez | Juan2024! | jlopez@edificiopalmas.com | 1 (Conjunto) |
| agomez | Ana2024! | agomez@condominioazul.com | 1 (Conjunto) |
| lperez | Luis2024! | lperez@edificiopalmas.com | 1 (Conjunto) |

## 🚀 Cómo Probar

### 1. Iniciar Backend (Terminal 1)

```bash
cd resimanager-backoffice
mvn spring-boot:run
```

Backend disponible en: `http://localhost:8080`

### 2. Iniciar Frontend (Terminal 2)

```bash
cd resimanager-spa
npm run dev
```

Frontend disponible en: `http://localhost:5000`

### 3. Proceso de Login

1. Abrir `http://localhost:5000`
2. Ingresar credenciales (ej: admin / Admin2024!)
3. Si hay múltiples contextos, seleccionar uno
4. El dashboard cargará con el menú basado en el perfil

### 4. Verificar en Developer Tools

**Network Tab:**
- POST `/v1/login` → Retorna token + contextos
- POST `/api/v1/contexto/cambiar` → Retorna nuevo token
- GET `/api/v1/menu/perfil` → Retorna menú filtrado

**Console:**
- No debe haber errores de CORS
- Logs de autenticación exitosa

**Application > Local Storage:**
- `token` - JWT del usuario
- `usuario` - Datos del usuario
- `contextosDisponibles` - Contextos disponibles
- `activeContext` - Contexto actual
- `activePerfilId` - ID del perfil activo

## 🔍 Troubleshooting

### Error: "Failed to fetch" en login

**Causa:** Backend no está corriendo o CORS mal configurado

**Solución:**
1. Verificar que backend esté en `http://localhost:8080`
2. Verificar CORS en `SecurityConfig.java`

### Error: "Usuario o contraseña incorrectos"

**Causa:** Contraseña incorrecta o usuario no existe

**Solución:**
1. Verificar usuarios en `V2.0.5__INSERT_BASE_DATA.sql` y `V2.0.6__INSERT_TEST_DATA.sql`
2. Usar contraseñas exactas (sensible a mayúsculas)

### Menú no carga

**Causa:** Contexto no activado o perfilId incorrecto

**Solución:**
1. Verificar en DevTools que `activePerfilId` exista en localStorage
2. Verificar que endpoint `/api/v1/menu/perfil` retorne 200
3. Verificar header `X-Perfil-Id` en la petición

### Redirige a login después de autenticar

**Causa:** Token no se está guardando correctamente

**Solución:**
1. Verificar que localStorage tenga `token`
2. Verificar que `isAuthenticated()` retorne `true`
3. Revisar console para errores en AuthContext

## 📦 Dependencias Frontend

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.3.0"
}
```

No se requieren librerías adicionales - usa Fetch API nativo.

## 🎯 Próximos Pasos

- [ ] Implementar refresh token
- [ ] Agregar timeout de sesión
- [ ] Implementar "Recordarme"
- [ ] Agregar indicador de contexto activo en navbar
- [ ] Implementar cambio de contexto desde dashboard
- [ ] Agregar manejo de errores 401/403 con interceptors
- [ ] Implementar logout desde menú

## 📝 Notas Importantes

1. **Passwords en Base64:** El frontend codifica la contraseña en Base64 antes de enviarla
2. **JWT con contexto:** El token se actualiza después de seleccionar contexto
3. **Menú dinámico:** Se carga basado en `activePerfilId`, no en el usuario
4. **CORS:** Backend configurado para permitir todos los orígenes con credenciales
5. **Protected Routes:** Dashboard requiere autenticación + contexto activo

## 🔗 Enlaces Útiles

- **Backend Local:** http://localhost:8080
- **Swagger Local:** http://localhost:8080/swagger-ui.html
- **Frontend Local:** http://localhost:5000
- **Backend Koyeb:** https://chilly-libbey-wtysoftware-aab36281.koyeb.app
- **Swagger Koyeb:** https://chilly-libbey-wtysoftware-aab36281.koyeb.app/swagger-ui.html

## 📄 Documentación Relacionada

- [Autenticación y Autorización](../resimanager-backoffice/docs/01-autenticacion-autorizacion.md)
- [Context Switching y Permisos](../resimanager-backoffice/docs/02-context-switching-permissions.md)
- [Configuración Swagger en Koyeb](../resimanager-backoffice/KOYEB-SWAGGER-CONFIG.md)
