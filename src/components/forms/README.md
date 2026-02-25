# Componentes de Formulario - AdminLTE 3

Este directorio contiene componentes de formulario reutilizables basados en los estilos de AdminLTE 3.

## Componentes Disponibles

### FormInput
Componente de input con soporte para iconos y validación.

```jsx
import { FormInput } from '@/components/forms';

<FormInput
  label="Email"
  id="email"
  type="email"
  placeholder="Ingresa tu email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon="fa-envelope"
  required
  error={emailError}
/>
```

**Props:**
- `label` (string): Etiqueta del input
- `id` (string, required): ID del input
- `type` (string): Tipo de input (default: 'text')
- `placeholder` (string): Placeholder
- `value` (string): Valor del input
- `onChange` (function, required): Manejador de cambio
- `disabled` (boolean): Input deshabilitado
- `required` (boolean): Input requerido
- `icon` (string): Icono de FontAwesome (ej: 'fa-user')
- `className` (string): Clases CSS adicionales
- `error` (string): Mensaje de error
- `success` (string): Mensaje de éxito
- `warning` (string): Mensaje de advertencia

### FormCheckbox
Componente de checkbox con estilos standard y custom.

```jsx
import { FormCheckbox } from '@/components/forms';

<FormCheckbox
  label="Recordarme"
  id="remember"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>

// Checkbox custom con color
<FormCheckbox
  label="Acepto términos"
  id="terms"
  checked={terms}
  onChange={(e) => setTerms(e.target.checked)}
  custom
  customColor="danger"
  outline
/>
```

**Props:**
- `label` (string, required): Etiqueta del checkbox
- `id` (string, required): ID del checkbox
- `checked` (boolean, required): Estado del checkbox
- `onChange` (function, required): Manejador de cambio
- `disabled` (boolean): Checkbox deshabilitado
- `custom` (boolean): Usar estilo custom de AdminLTE
- `customColor` (string): Color custom (danger, success, info, etc.)
- `outline` (boolean): Usar estilo outline

### FormRadio
Componente de radio button con estilos standard y custom.

```jsx
import { FormRadio } from '@/components/forms';

<FormRadio
  label="Opción 1"
  id="option1"
  name="options"
  checked={selectedOption === 'option1'}
  onChange={() => setSelectedOption('option1')}
  custom
/>
```

**Props:**
- `label` (string, required): Etiqueta del radio
- `id` (string, required): ID del radio
- `name` (string, required): Nombre del grupo de radios
- `checked` (boolean, required): Estado del radio
- `onChange` (function, required): Manejador de cambio
- `disabled` (boolean): Radio deshabilitado
- `custom` (boolean): Usar estilo custom de AdminLTE
- `customColor` (string): Color custom
- `outline` (boolean): Usar estilo outline

### FormSelect
Componente de select con estilos standard y custom.

```jsx
import { FormSelect } from '@/components/forms';

const options = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
];

<FormSelect
  label="Selecciona una opción"
  id="select"
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
  options={options}
  custom
  required
/>
```

**Props:**
- `label` (string): Etiqueta del select
- `id` (string, required): ID del select
- `value` (string|number|array): Valor seleccionado
- `onChange` (function, required): Manejador de cambio
- `options` (array, required): Array de opciones [{value, label}]
- `disabled` (boolean): Select deshabilitado
- `required` (boolean): Select requerido
- `custom` (boolean): Usar estilo custom de AdminLTE
- `multiple` (boolean): Permitir selección múltiple
- `className` (string): Clases CSS adicionales
- `placeholder` (string): Texto del placeholder

### FormTextarea
Componente de textarea.

```jsx
import { FormTextarea } from '@/components/forms';

<FormTextarea
  label="Descripción"
  id="description"
  placeholder="Ingresa una descripción"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={5}
  required
/>
```

**Props:**
- `label` (string): Etiqueta del textarea
- `id` (string, required): ID del textarea
- `placeholder` (string): Placeholder
- `value` (string): Valor del textarea
- `onChange` (function, required): Manejador de cambio
- `disabled` (boolean): Textarea deshabilitado
- `required` (boolean): Textarea requerido
- `rows` (number): Número de filas (default: 3)
- `className` (string): Clases CSS adicionales

## Uso en Formularios

### Ejemplo Completo

```jsx
import { FormInput, FormCheckbox, FormSelect } from '@/components/forms';
import { useState } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    terms: false,
  });

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title">Mi Formulario</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <FormInput
            label="Nombre"
            id="name"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            icon="fa-user"
            required
          />

          <FormInput
            label="Email"
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            icon="fa-envelope"
            required
          />

          <FormSelect
            label="Rol"
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            options={roles}
            custom
            required
          />

          <FormCheckbox
            label="Acepto términos y condiciones"
            id="terms"
            checked={formData.terms}
            onChange={(e) => setFormData({...formData, terms: e.target.checked})}
            required
          />
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
          <button type="button" className="btn btn-default float-right">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
```

## Estilos AdminLTE Aplicados

Todos los componentes utilizan las clases de AdminLTE 3:

- `.form-group` - Contenedor de cada campo
- `.form-control` - Input standard
- `.custom-select` - Select custom
- `.form-check` - Checkbox/Radio standard
- `.custom-control` - Checkbox/Radio custom
- `.input-group` - Grupo de input con addon
- `.is-invalid`, `.is-valid`, `.is-warning` - Estados de validación

## Referencias

- [AdminLTE 3 Forms Documentation](https://adminlte.io/themes/v3/pages/forms/general.html)
- [Bootstrap 4 Forms](https://getbootstrap.com/docs/4.6/components/forms/)
