# ResiManager SPA - Routing & Page Implementation Guide

## Overview

The application now has a complete routing system with:
- **Dynamic menu-driven navigation** - Menu items automatically generate routes
- **Active menu highlighting** - Currently selected menu item is highlighted
- **Generic page fallback** - All menu items work out of the box with placeholder pages
- **Easy specific page implementation** - Simple pattern to replace generic pages with real ones
- **Reusable components** - PageLayout and DataTable for consistent UI

---

## How Routing Works

### 1. Menu Items Generate Routes Automatically

When a menu item is clicked in `SideMenu.jsx`, it generates a route based on:
- **Controller + Method** (if available): `/dashboard/{controller}/{method}`
- **Item name** (fallback): `/dashboard/{sanitized-name}`

Example menu item from backend:
```javascript
{
  nombre: "Listar Propiedades",
  controlador: "PropiedadController",
  metodo: "listar"
}
```

Generates route: `/dashboard/propiedad/listar`

### 2. Route Priority System

Routes in `App.jsx` are matched in this order:

```jsx
<Route path="/dashboard" ...>
  {/* 1. Dashboard home */}
  <Route index element={<HomePage />} />
  
  {/* 2. Specific implementations (highest priority) */}
  <Route path="propiedades" element={<PropertiesPage />} />
  
  {/* 3. Generic fallbacks (catch-all) */}
  <Route path=":controller/:method" element={<GenericPage />} />
  <Route path=":controller" element={<GenericPage />} />
</Route>
```

**Rule:** Add specific routes BEFORE generic routes to override the default behavior.

---

## Implementing a New Page

### Step 1: Create Your Page Component

Use the `PageLayout` and `DataTable` components for consistency:

```jsx
// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from API
        fetch('/api/usuarios')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        { key: 'rol', label: 'Rol' },
    ];

    const renderActions = (row) => (
        <button className="btn btn-sm btn-primary">
            <i className="fas fa-edit"></i>
        </button>
    );

    return (
        <PageLayout 
            title="Gestión de Usuarios"
            breadcrumbs={[{ label: 'Usuarios' }]}
        >
            <div className="card">
                <div className="card-body">
                    <DataTable
                        columns={columns}
                        data={users}
                        renderActions={renderActions}
                        loading={loading}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default UsersPage;
```

### Step 2: Add Route in App.jsx

Import your page and add the route:

```jsx
// 1. Import
import UsersPage from "./pages/UsersPage.jsx";

// 2. Add route (BEFORE generic routes)
<Route path="/dashboard" ...>
  <Route index element={<HomePage />} />
  
  {/* Add your specific route here */}
  <Route path="usuarios" element={<UsersPage />} />
  <Route path="usuario/:method" element={<UsersPage />} />
  
  {/* Generic routes stay at the end */}
  <Route path=":controller/:method" element={<GenericPage />} />
  <Route path=":controller" element={<GenericPage />} />
</Route>
```

### Step 3: Test

Navigate to the menu item. If the backend sends:
- `controlador: "UsuarioController"` → Route becomes `/dashboard/usuario/...`
- `nombre: "Usuarios"` → Route becomes `/dashboard/usuarios`

Your specific page will now render instead of the generic placeholder.

---

## Reusable Components

### PageLayout Component

Provides consistent page structure with header and breadcrumbs.

**Props:**
- `title` (string) - Page title
- `breadcrumbs` (array) - Breadcrumb items: `[{ label, path }]`
- `headerActions` (node) - Optional header buttons/actions
- `children` (node) - Page content

**Example:**
```jsx
<PageLayout 
    title="Gestión de Facturas"
    breadcrumbs={[
        { label: 'Finanzas', path: '/dashboard/finanzas' },
        { label: 'Facturas' }
    ]}
    headerActions={
        <button className="btn btn-primary">Exportar</button>
    }
>
    {/* Your content here */}
</PageLayout>
```

### DataTable Component

Displays data in AdminLTE-styled tables with loading and error states.

**Props:**
- `columns` (array) - Column definitions: `[{ key, label, render }]`
- `data` (array) - Data array
- `loading` (boolean) - Show loading spinner
- `error` (string) - Error message
- `renderActions` (function) - Render action buttons for each row
- `onRowClick` (function) - Optional row click handler

**Example:**
```jsx
const columns = [
    { key: 'codigo', label: 'Código' },
    { 
        key: 'estado', 
        label: 'Estado',
        render: (value) => (
            <span className={`badge badge-${value === 'Activo' ? 'success' : 'danger'}`}>
                {value}
            </span>
        )
    }
];

<DataTable
    columns={columns}
    data={myData}
    loading={loading}
    error={error}
    renderActions={(row) => (
        <button onClick={() => handleEdit(row)}>
            <i className="fas fa-edit"></i>
        </button>
    )}
/>
```

---

## Menu Integration

### Active Menu Highlighting

The `SideMenu` component automatically highlights the active menu item by comparing the current route with the menu item's generated path.

**How it works:**
1. `useLocation()` gets current route: `/dashboard/propiedades`
2. `getMenuPath(item)` generates path for each menu item
3. `isActive(item)` returns true if paths match
4. Active item gets `active` class

### Menu Item Icon Assignment

Icons are intelligently assigned based on keywords in:
- `item.nombre` - Menu item name
- `item.modulo` - Module name
- `item.accion` - Action name

See `SideMenu.jsx:46-148` for the complete icon mapping logic.

**To add new icon mappings:**
```javascript
// In getIconForMenuItem()
if (searchText.includes('your-keyword')) {
    return 'fa-your-icon';
}

// Add color in iconColorMap
const iconColorMap = {
    'fa-your-icon': 'text-primary',
};
```

---

## File Structure

```
src/
├── pages/
│   ├── HomePage.jsx              # Dashboard home (default route)
│   ├── GenericPage.jsx           # Fallback for unimplemented pages
│   ├── PropertiesPage.jsx        # Example specific implementation
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx         # Layout wrapper (uses Outlet)
│   └── ContextSelectorPage.jsx
│
├── components/
│   ├── common/
│   │   ├── PageLayout.jsx        # Reusable page structure
│   │   └── DataTable.jsx         # Reusable data table
│   ├── menu/
│   │   ├── SideMenu.jsx          # Sidebar with routing logic
│   │   └── MenuBar.jsx           # Top navbar
│   ├── forms/                    # Form components
│   └── ...
│
└── App.jsx                       # Route definitions
```

---

## Common Patterns

### List Page with CRUD Operations

See `src/pages/PropertiesPage.jsx` for a complete example with:
- Data fetching from API
- Loading states
- Error handling
- Action buttons (View, Edit, Delete)
- Pagination footer

### Form Page

```jsx
import PageLayout from '../components/common/PageLayout';
import { FormInput, FormSelect } from '../components/forms';

const PropertyFormPage = () => {
    const [formData, setFormData] = useState({});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // POST to API
    };
    
    return (
        <PageLayout title="Nueva Propiedad" breadcrumbs={[...]}>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="card-body">
                        <FormInput 
                            label="Código"
                            name="codigo"
                            value={formData.codigo}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                        />
                        {/* More fields */}
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};
```

### Dashboard/Statistics Page

```jsx
import PageLayout from '../components/common/PageLayout';

const StatisticsPage = () => {
    return (
        <PageLayout title="Estadísticas" breadcrumbs={[...]}>
            <div className="row">
                <div className="col-lg-3 col-6">
                    <div className="small-box bg-info">
                        <div className="inner">
                            <h3>150</h3>
                            <p>Propiedades</p>
                        </div>
                        <div className="icon">
                            <i className="fas fa-building"></i>
                        </div>
                    </div>
                </div>
                {/* More info boxes */}
            </div>
        </PageLayout>
    );
};
```

---

## Next Steps

### Priority 1: Core CRUD Pages
1. **Users Management** - List, create, edit, delete users
2. **Invoices** - Generate and manage invoices
3. **Residents** - Manage resident information
4. **Properties** - Full CRUD (currently just list view)

### Priority 2: Advanced Features
1. **Search & Filters** - Add search functionality to tables
2. **Pagination** - Implement real server-side pagination
3. **Form Validation** - Integrate React Hook Form or Formik
4. **Modals** - Create/edit forms in modals instead of separate pages
5. **File Uploads** - Handle document uploads

### Priority 3: UX Enhancements
1. **Toasts/Notifications** - Success/error messages
2. **Confirmations** - Better delete confirmations
3. **Loading Skeletons** - Better loading states
4. **Keyboard Shortcuts** - Quick navigation
5. **Recent Items** - Quick access to recent actions

---

## Tips & Best Practices

### 1. Always Use PageLayout
Ensures consistent header, breadcrumbs, and spacing across all pages.

### 2. Leverage DataTable for Lists
Handles loading, errors, and empty states automatically.

### 3. Route Naming Convention
- Use lowercase, hyphenated names: `/dashboard/mis-propiedades`
- Match backend controller names when possible
- Be consistent across similar features

### 4. Component Organization
```
src/
├── pages/           # Full page components (one per route)
├── components/
│   ├── common/      # Reusable UI components (DataTable, PageLayout)
│   ├── forms/       # Form inputs
│   └── [feature]/   # Feature-specific components
```

### 5. API Integration
```jsx
// Create a service file for API calls
// src/services/api.js
export const fetchProperties = async () => {
    const response = await fetch('/api/propiedades');
    return response.json();
};

// Use in component
import { fetchProperties } from '../services/api';

useEffect(() => {
    fetchProperties().then(setProperties);
}, []);
```

### 6. State Management
For complex forms or shared state, consider:
- **React Context** - For auth, user data
- **React Query** - For server state (fetching, caching)
- **Zustand/Redux** - For complex client state

---

## Troubleshooting

### Menu item doesn't navigate
1. Check `SideMenu.jsx` - ensure `navigate(getMenuPath(item))` is called
2. Verify route exists in `App.jsx`
3. Check browser console for errors

### Wrong page shows up
Routes are matched top-to-bottom. Ensure specific routes are BEFORE generic routes.

### Menu not highlighting active item
Check that `getMenuPath()` generates the same path the route uses.

### GenericPage shows instead of specific page
Ensure your specific route in `App.jsx` matches the path generated by `getMenuPath()`.

---

## Questions?

Review these files:
- `src/components/menu/SideMenu.jsx` - Routing logic
- `src/pages/PropertiesPage.jsx` - Complete example implementation
- `src/components/common/PageLayout.jsx` - Page structure
- `src/components/common/DataTable.jsx` - Table component
- `src/App.jsx` - Route configuration
