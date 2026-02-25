/**
 * GUÍA DE COMPONENTES DE FORMULARIO ADMINLTE 3
 * 
 * Esta guía documenta los patrones y componentes de formulario
 * basados en AdminLTE 3 para usar en la aplicación.
 * 
 * Los componentes siguen el patrón del template AdminLTE ubicado en:
 * docs/general/Template/AdminLTE 3 _ Tabbed IFrames_files/general.html
 */

// ============================================================================
// COMPONENTE: FormInput
// ============================================================================

/**
 * Ejemplo de uso de FormInput
 * Componente de input con label, icono opcional y validación
 */

// Importación
import PropTypes from 'prop-types';

// Componente básico
export const FormInput = ({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    icon,
    className = '',
    error,
    success,
    warning,
    ...props
}) => {
    let validationClass = '';
    if (error) validationClass = 'is-invalid';
    else if (warning) validationClass = 'is-warning';
    else if (success) validationClass = 'is-valid';

    const inputElement = (
        <input
            type={type}
            className={`form-control ${validationClass} ${className}`}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            {...props}
        />
    );

    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            {icon ? (
                <div className="input-group">
                    {inputElement}
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className={`fas ${icon}`}></span>
                        </div>
                    </div>
                </div>
            ) : (
                inputElement
            )}
            {error && <div className="invalid-feedback d-block">{error}</div>}
            {warning && <div className="warning-feedback text-warning">{warning}</div>}
            {success && <div className="valid-feedback d-block">{success}</div>}
        </div>
    );
};

// Ejemplo de uso:
// <FormInput
//   label="Email"
//   id="email"
//   type="email"
//   placeholder="Ingresa tu email"
//   value={email}
//   onChange={(e) => setEmail(e.target.value)}
//   icon="fa-envelope"
//   required
//   error={emailError}
// />


// ============================================================================
// COMPONENTE: FormCheckbox
// ============================================================================

/**
 * Componente de checkbox con estilos AdminLTE
 */
export const FormCheckbox = ({
    label,
    id,
    checked,
    onChange,
    disabled = false,
    custom = false,
    customColor,
    outline = false,
    ...props
}) => {
    if (custom) {
        let customClass = 'custom-control-input';
        if (customColor) {
            customClass += ` custom-control-input-${customColor}`;
            if (outline) {
                customClass += ' custom-control-input-outline';
            }
        }

        return (
            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input
                        type="checkbox"
                        className={customClass}
                        id={id}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        {...props}
                    />
                    <label className="custom-control-label" htmlFor={id}>
                        {label}
                    </label>
                </div>
            </div>
        );
    }

    return (
        <div className="form-group">
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                />
                <label className="form-check-label" htmlFor={id}>
                    {label}
                </label>
            </div>
        </div>
    );
};

// Ejemplo de uso:
// <FormCheckbox
//   label="Recordarme"
//   id="remember"
//   checked={rememberMe}
//   onChange={(e) => setRememberMe(e.target.checked)}
// />


// ============================================================================
// COMPONENTE: FormRadio
// ============================================================================

/**
 * Componente de radio button con estilos AdminLTE
 */
export const FormRadio = ({
    label,
    id,
    name,
    checked,
    onChange,
    disabled = false,
    custom = false,
    customColor,
    outline = false,
    ...props
}) => {
    if (custom) {
        let customClass = 'custom-control-input';
        if (customColor) {
            customClass += ` custom-control-input-${customColor}`;
            if (outline) {
                customClass += ' custom-control-input-outline';
            }
        }

        return (
            <div className="custom-control custom-radio">
                <input
                    type="radio"
                    className={customClass}
                    id={id}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                />
                <label className="custom-control-label" htmlFor={id}>
                    {label}
                </label>
            </div>
        );
    }

    return (
        <div className="form-check">
            <input
                type="radio"
                className="form-check-input"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
};

// Ejemplo de uso:
// <FormRadio
//   label="Opción 1"
//   id="option1"
//   name="options"
//   checked={selectedOption === 'option1'}
//   onChange={() => setSelectedOption('option1')}
//   custom
// />


// ============================================================================
// COMPONENTE: FormSelect
// ============================================================================

/**
 * Componente de select con estilos AdminLTE
 */
export const FormSelect = ({
    label,
    id,
    value,
    onChange,
    options = [],
    disabled = false,
    required = false,
    custom = false,
    multiple = false,
    className = '',
    placeholder = 'Selecciona una opción',
    ...props
}) => {
    const selectClass = custom ? 'custom-select' : 'form-control';

    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <select
                className={`${selectClass} ${className}`}
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                multiple={multiple}
                {...props}
            >
                {!multiple && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Ejemplo de uso:
// const options = [
//   { value: '1', label: 'Opción 1' },
//   { value: '2', label: 'Opción 2' },
// ];
//
// <FormSelect
//   label="Selecciona"
//   id="select"
//   value={selectedValue}
//   onChange={(e) => setSelectedValue(e.target.value)}
//   options={options}
//   custom
//   required
// />


// ============================================================================
// COMPONENTE: FormTextarea
// ============================================================================

/**
 * Componente de textarea con estilos AdminLTE
 */
export const FormTextarea = ({
    label,
    id,
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    rows = 3,
    className = '',
    ...props
}) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <textarea
                className={`form-control ${className}`}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                rows={rows}
                {...props}
            />
        </div>
    );
};

// Ejemplo de uso:
// <FormTextarea
//   label="Descripción"
//   id="description"
//   placeholder="Ingresa una descripción"
//   value={description}
//   onChange={(e) => setDescription(e.target.value)}
//   rows={5}
//   required
// />


// ============================================================================
// EJEMPLO COMPLETO DE FORMULARIO
// ============================================================================

/**
 * Ejemplo de formulario completo usando los componentes AdminLTE
 */

/*
import { useState } from 'react';
import { FormInput, FormCheckbox, FormSelect, FormTextarea } from './FormComponents';

const ExampleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    description: '',
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
        <h3 className="card-title">Formulario de Ejemplo</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <FormInput
            label="Nombre Completo"
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
            placeholder="ejemplo@correo.com"
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

          <FormTextarea
            label="Descripción"
            id="description"
            placeholder="Describe brevemente..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
          />

          <FormCheckbox
            label="Acepto los términos y condiciones"
            id="terms"
            checked={formData.terms}
            onChange={(e) => setFormData({...formData, terms: e.target.checked})}
            custom
            customColor="primary"
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

export default ExampleForm;
*/


// ============================================================================
// CLASES CSS ADMINLTE IMPORTANTES
// ============================================================================

/**
 * FORM GROUPS:
 * - .form-group : Contenedor de cada campo (margin-bottom)
 * 
 * INPUTS:
 * - .form-control : Input standard de Bootstrap/AdminLTE
 * - .form-control-lg : Input grande
 * - .form-control-sm : Input pequeño
 * - .form-control-border : Input con solo borde inferior
 * - .is-invalid : Estado de error
 * - .is-valid : Estado de éxito
 * - .is-warning : Estado de advertencia
 * 
 * INPUT GROUPS:
 * - .input-group : Contenedor para input con addons
 * - .input-group-append : Addon a la derecha
 * - .input-group-prepend : Addon a la izquierda
 * - .input-group-text : Contenido del addon
 * 
 * SELECT:
 * - .custom-select : Select con estilos custom
 * - .form-control : Select standard
 * 
 * CHECKBOX/RADIO:
 * - .form-check : Contenedor standard
 * - .form-check-input : Input standard
 * - .form-check-label : Label standard
 * - .custom-control : Contenedor custom
 * - .custom-control-input : Input custom
 * - .custom-control-label : Label custom
 * - .custom-checkbox : Checkbox custom
 * - .custom-radio : Radio custom
 * - .custom-control-input-{color} : Color custom (primary, danger, etc.)
 * - .custom-control-input-outline : Estilo outline
 * 
 * CARDS:
 * - .card : Contenedor principal
 * - .card-primary : Card con tema primary
 * - .card-outline : Card con outline
 * - .card-header : Header del card
 * - .card-body : Body del card
 * - .card-footer : Footer del card
 * - .card-title : Título en el header
 * 
 * BUTTONS:
 * - .btn : Botón base
 * - .btn-primary : Botón primary
 * - .btn-default : Botón default
 * - .btn-block : Botón de ancho completo
 * - .btn-sm : Botón pequeño
 * - .btn-lg : Botón grande
 * 
 * VALIDATION:
 * - .invalid-feedback : Mensaje de error
 * - .valid-feedback : Mensaje de éxito
 * - .d-block : Display block (para mostrar mensajes)
 */
