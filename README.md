# ResiManager — SPA (Frontend)

Aplicación web (SPA) de ResiManager para la gestión de condominios, residencias y conjuntos residenciales. Este README es autocontenido (resume toda la información necesaria para entender, operar y extender el frontend).

---

## Resumen

- **React 19 + Vite 5** con **AdminLTE 3** (tema) y **FontAwesome 6**.
- **Sesión por cookies HttpOnly** (`jwt` + `refresh`): el token **no** se guarda en `localStorage`.
- **Refresco silencioso** *single-flight* ante `401`; si el refresh falla, redirige a login.
- **Menú dinámico** según el perfil activo y navegación **multi-tenant** (selección de contexto).
- CRUDs de usuarios, perfiles, administradoras, conjuntos, propiedades y propietarios, más asignación de perfiles.
- **0 tests automatizados** (pendiente).

## Stack

| Tecnología | Versión |
|------------|---------|
| React | 19.2.3 |
| Vite | 5.x |
| React Router DOM | 7.3.0 |
| AdminLTE 3 / Bootstrap 4 | CSS estático (`public/adminlte.min.css`) |
| FontAwesome Free | 6.6 |
| jQuery | 3.7.1 (declarado; no usado en runtime) |
| ESLint | 9.x (flat config) |

Scripts: `dev`, `build`, `lint`, `preview`.

## Estructura

```
src/
├── components/
│   ├── breadcrumb/Breadcrumb.jsx
│   ├── common/          # PageLayout, DataTable, Toast
│   ├── content/Content.jsx
│   ├── examples/FormExample.jsx
│   ├── forms/           # FormInput, FormCheckbox, FormRadio, FormSelect, FormTextarea, index.js
│   ├── login/           # Login.jsx, ContextSelector.jsx
│   └── menu/            # MenuBar.jsx, SideMenu.jsx
├── context/AuthContext.jsx   # estado de sesión (useAuth)
├── hooks/               # useMenuData.jsx, Menu.json
├── pages/               # una página por ruta (+ perfiles/, asignaciones/)
├── services/api.js      # capa API centralizada
├── App.jsx              # definición de rutas
├── main.jsx             # bootstrap + imports globales (FontAwesome, index.css)
└── index.css            # estilos propios sobre AdminLTE
```

Convenciones: componentes y archivos en **PascalCase**; páginas con sufijo `Page.jsx` / `FormPage.jsx` / `DetailPage.jsx`; subcarpetas por dominio en `pages/`; un componente por archivo.

## Componentes reutilizables

- **`PageLayout`** — wrapper de página con `content-header`, breadcrumbs y `content`. Props: `title`, `breadcrumbs: [{ label, path? }]`, `headerActions`, `children`.
- **`DataTable`** — tabla AdminLTE con estados loading/error/empty. Props: `columns: [{ key, label, render? }]`, `data`, `renderActions`, `loading`, `error`, `onRowClick`.
- **`Toast`** — notificaciones temporales (clases de alerta AdminLTE + iconos).
- **`SideMenu`** — sidebar; genera la ruta de cada ítem (`getMenuPath`) y resalta el activo; asigna iconos por palabras clave.
- **`MenuBar`** — navbar superior (contexto activo, cambio de contexto, usuario, logout).
- **Formularios** (`components/forms/`, con PropTypes + JSDoc):
  | Componente | Props clave |
  |------------|-------------|
  | `FormInput` | `label, id, type, value, onChange, icon?, error?/success?/warning?, placeholder, required, disabled` |
  | `FormCheckbox` | `label, id, checked, onChange, custom?, customColor?, outline?` |
  | `FormRadio` | `label, id, name, checked, onChange, custom?, customColor?` |
  | `FormSelect` | `label, id, value, onChange, options: [{value,label}], custom?, multiple?, required?` |
  | `FormTextarea` | `label, id, value, onChange, rows?, placeholder?` |

## UI y estilos

- Tema **AdminLTE 3** cargado como CSS estático: `public/adminlte.min.css` + `<link>` en `index.html`. FontAwesome se importa en `main.jsx`.
- Capa propia en `src/index.css`: login con gradiente, sidebar/`nav-treeview`, breadcrumb, estados de formulario (`is-warning`), `context-selector-box`, logo de marca, responsive.
- ⚠️ **Nota:** solo se carga el **CSS** de AdminLTE/Bootstrap; el **JS/jQuery no se usa en runtime**, los comportamientos (colapso, dropdowns, modales) se implementan en React.
- Convenciones de clases: `card card-primary|...`, `btn btn-primary|...`, `badge badge-success|danger|warning|secondary`, `table table-bordered table-striped table-hover` (vía `DataTable`), `small-box bg-*`, `is-invalid/is-valid/is-warning`.
- Breakpoints: desktop `>992px`, tablet `768–991px`, mobile `<768px` (sidebar colapsable/oculto).

## Sesión y capa API

- Login envía la contraseña en **Base64** (`btoa`). Sesión en cookies HttpOnly `jwt` (access, 30 min) + `refresh` (7 días).
- Toda la red se centraliza en `services/api.js`:
  - `BASE_URL = VITE_API_BASE_URL + VITE_API_VERSION`.
  - Todas las llamadas usan `credentials: 'include'`.
  - `handleResponse()` unifica parseo de JSON y errores (`status`/`data`).
- `apiFetch` implementa **refresco silencioso**:
  - Ante `401` (excepto `/refresh`, `/login`, `/logout`), llama **una sola vez** a `POST /v1/refresh` (promesa compartida *single-flight*) y **reintenta** la petición original.
  - Si el refresh falla: limpia `localStorage`, emite el evento `resimanager:session-expired` y redirige a `/login`.
- **`AuthContext`** (`useAuth`) expone: `user`, `contextosDisponibles`, `activeContext`, `activePerfilId`, `loading`, `login`, `logout`, `selectContext`, `isAuthenticated`, `hasActiveContext`. Escucha `resimanager:session-expired` para resetear el estado.

## Routing

- `App.jsx` define las rutas; `DashboardPage` es el **layout anidado** (`<Outlet/>`) bajo `/dashboard`.
- **Prioridad**: rutas específicas antes del fallback genérico `:controller[/:method]` → `GenericPage`.
- **`ProtectedRoute`**: `isAuthenticated()` → login; `requireContext` + `hasActiveContext()` → `/select-context`; spinner mientras `loading`.
- Navegación dirigida por el menú del backend (`SideMenu.getMenuPath`).

## Rutas y páginas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/login` | LoginPage | Inicio de sesión |
| `/select-context` | ContextSelectorPage | Selección de contexto multi-tenant |
| `/dashboard` | DashboardPage | Layout con menú dinámico |
| `/dashboard/` | HomePage | Dashboard con estadísticas dinámicas |
| `/dashboard/usuarios` | UsuariosPage | Listado de usuarios |
| `/dashboard/usuarios/:id/editar` | UsuarioFormPage | Editar usuario |
| `/dashboard/usuarios/:usuarioId/perfiles` | UsuarioPerfilesPage | Perfiles del usuario |
| `/dashboard/perfiles` | PerfilesPage | Listado de perfiles |
| `/dashboard/perfiles/nuevo` | PerfilFormPage | Crear perfil |
| `/dashboard/perfiles/:id` | PerfilDetailPage | Detalle de perfil |
| `/dashboard/perfiles/:id/editar` | PerfilFormPage | Editar perfil |
| `/dashboard/administradoras` | AdministradorasPage | Listado + editar/inactivar |
| `/dashboard/administradoras/nuevo` | AdministradoraFormPage | Crear administradora |
| `/dashboard/administradoras/:id/editar` | AdministradoraFormPage | Editar administradora |
| `/dashboard/administradoras/:id/usuarios` | AdministradoraUsuariosPage | Usuarios de administradora |
| `/dashboard/conjuntos` | ConjuntosPage | Listado + editar/inactivar |
| `/dashboard/conjuntos/nuevo` | ConjuntoFormPage | Crear conjunto |
| `/dashboard/conjuntos/:id/editar` | ConjuntoFormPage | Editar conjunto |
| `/dashboard/conjuntos/:id/usuarios` | ConjuntoUsuariosPage | Usuarios de conjunto |
| `/dashboard/:contextType/:contextId/usuarios/:usuarioId/perfiles` | AsignarPerfilesPage | Asignar perfiles |
| `/dashboard/propiedades` (`/nuevo`, `/:id/editar`) | PropiedadesPage / PropiedadFormPage | Propiedades |
| `/dashboard/propietarios` | PropertiesPage | Propietarios |

## Configuración

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=/v1
VITE_PORT=5173
```

## Ejecución

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # build de producción -> dist/
npm run lint
npm run preview
```

## Despliegue

- **Vercel:** integración automática desde `main`. `vercel.json` define el rewrite SPA (`/(.*) → /index.html`) y headers MIME para `/assets/*.js|css`.

## Estado y pendientes

Frontend **~88%**. Completos: login/contexto, sesión con refresco silencioso, menú dinámico, CRUDs y asignación de perfiles, dashboard.

**Pendientes:** pantallas de invitaciones, CRUD de módulos/opciones/acciones y permisos granulares, y **tests automatizados** (se sugiere añadir Vitest + Testing Library).

## Buenas prácticas

- Reutilizar `PageLayout`, `DataTable` y `components/forms/*` antes de crear UI nueva.
- Usar clases AdminLTE/Bootstrap; evitar CSS ad-hoc fuera de `index.css`.
- Centralizar toda la red en `services/api.js` (usar `apiFetch`, no `fetch` directo).
- Documentar props de componentes y mantener las rutas genéricas al final de `App.jsx`.
- No guardar el token en `localStorage` (vive en cookies HttpOnly).
- No asumir que el JS de AdminLTE/Bootstrap está cargado.
