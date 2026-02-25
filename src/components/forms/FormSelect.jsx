import PropTypes from 'prop-types';

/**
 * FormSelect - Componente de select reutilizable según estilos AdminLTE
 * 
 * @param {string} label - Etiqueta del select
 * @param {string} id - ID del select
 * @param {string} value - Valor seleccionado
 * @param {function} onChange - Función onChange
 * @param {Array} options - Array de opciones [{value, label}]
 * @param {boolean} disabled - Si el select está deshabilitado
 * @param {boolean} required - Si el select es requerido
 * @param {boolean} custom - Si usar el estilo custom de AdminLTE
 * @param {boolean} multiple - Si permite selección múltiple
 * @param {string} className - Clases adicionales
 */
const FormSelect = ({
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

FormSelect.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
    ]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    custom: PropTypes.bool,
    multiple: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
};

export default FormSelect;
