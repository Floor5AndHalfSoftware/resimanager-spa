# ResiManager SPA

Frontend React para la gestión de residencias y condominios.

## Tecnologías

- React 19
- Vite 5
- React Router DOM 7
- AdminLTE 3
- FontAwesome 6

## Páginas Implementadas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| /login | LoginPage | Inicio de sesión |
| /select-context | ContextSelectorPage | Selección de contexto multi-tenant |
| /dashboard | DashboardPage | Layout con menú dinámico |
| /dashboard/ | HomePage | Dashboard con estadísticas dinámicas |
| /dashboard/usuarios | UsuariosPage | Listado de usuarios |
| /dashboard/usuarios/:id/editar | UsuarioFormPage | Editar usuario |
| /dashboard/usuarios/:usuarioId/perfiles | UsuarioPerfilesPage | Perfiles del usuario |
| /dashboard/perfiles | PerfilesPage | Listado de perfiles |
| /dashboard/perfiles/nuevo | PerfilFormPage | Crear perfil |
| /dashboard/perfiles/:id | PerfilDetailPage | Detalle de perfil |
| /dashboard/perfiles/:id/editar | PerfilFormPage | Editar perfil |
| /dashboard/administradoras | AdministradorasPage | Listado + editar/inactivar |
| /dashboard/administradoras/nuevo | AdministradoraFormPage | Crear administradora |
| /dashboard/administradoras/:id/editar | AdministradoraFormPage | Editar administradora |
| /dashboard/administradoras/:id/usuarios | AdministradoraUsuariosPage | Usuarios de administradora |
| /dashboard/conjuntos | ConjuntosPage | Listado + editar/inactivar |
| /dashboard/conjuntos/nuevo | ConjuntoFormPage | Crear conjunto |
| /dashboard/conjuntos/:id/editar | ConjuntoFormPage | Editar conjunto |
| /dashboard/conjuntos/:id/usuarios | ConjuntoUsuariosPage | Usuarios de conjunto |
| /dashboard/:contextType/:contextId/usuarios/:usuarioId/perfiles | AsignarPerfilesPage | Asignar perfiles |
| /dashboard/propiedades | PropertiesPage | Listado de propiedades |

## Configuración

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=/api/v1
```

## Ejecución

```bash
npm install
npm run dev     # http://localhost:5000
npm run build   # Build producción
```

## Despliegue

- **Vercel:** Integración automática desde rama main

## Documentación

Ver `/docs/` para documentación detallada de componentes y routing.
