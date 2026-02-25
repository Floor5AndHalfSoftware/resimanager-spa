import PropTypes from 'prop-types';

/**
 * FormTextarea - Componente de textarea reutilizable según estilos AdminLTE
 * 
 * @param {string} label - Etiqueta del textarea
 * @param {string} id - ID del textarea
 * @param {string} placeholder - Placeholder del textarea
 * @param {string} value - Valor del textarea
 * @param {function} onChange - Función onChange
 * @param {boolean} disabled - Si el textarea está deshabilitado
 * @param {boolean} required - Si el textarea es requerido
 * @param {number} rows - Número de filas
 * @param {string} className - Clases adicionales
 */
const FormTextarea = ({
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

FormTextarea.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    className: PropTypes.string,
};

export default FormTextarea;
