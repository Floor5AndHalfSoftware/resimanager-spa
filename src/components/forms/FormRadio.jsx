import PropTypes from 'prop-types';

/**
 * FormRadio - Componente de radio button reutilizable según estilos AdminLTE
 * 
 * @param {string} label - Etiqueta del radio
 * @param {string} id - ID del radio
 * @param {string} name - Nombre del grupo de radios
 * @param {boolean} checked - Si el radio está seleccionado
 * @param {function} onChange - Función onChange
 * @param {boolean} disabled - Si el radio está deshabilitado
 * @param {boolean} custom - Si usar el estilo custom de AdminLTE
 * @param {string} customColor - Color custom (danger, success, info, etc.)
 * @param {boolean} outline - Si usar estilo outline
 */
const FormRadio = ({
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

FormRadio.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    custom: PropTypes.bool,
    customColor: PropTypes.string,
    outline: PropTypes.bool,
};

export default FormRadio;
