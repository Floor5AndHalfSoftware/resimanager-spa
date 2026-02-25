import PropTypes from 'prop-types';

/**
 * FormInput - Componente de input reutilizable según estilos AdminLTE
 * 
 * @param {string} label - Etiqueta del input
 * @param {string} id - ID del input
 * @param {string} type - Tipo de input (text, email, password, etc.)
 * @param {string} placeholder - Placeholder del input
 * @param {string} value - Valor del input
 * @param {function} onChange - Función onChange
 * @param {boolean} disabled - Si el input está deshabilitado
 * @param {boolean} required - Si el input es requerido
 * @param {string} icon - Icono de FontAwesome (ej: 'fa-user')
 * @param {string} className - Clases adicionales para el input
 * @param {string} error - Mensaje de error
 * @param {string} success - Mensaje de éxito
 * @param {string} warning - Mensaje de advertencia
 */
const FormInput = ({
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
    // Determinar la clase de validación
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

FormInput.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    icon: PropTypes.string,
    className: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    warning: PropTypes.string,
};

export default FormInput;
