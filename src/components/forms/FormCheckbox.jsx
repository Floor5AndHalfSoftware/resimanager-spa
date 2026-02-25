import PropTypes from 'prop-types';

/**
 * FormCheckbox - Componente de checkbox reutilizable según estilos AdminLTE
 * 
 * @param {string} label - Etiqueta del checkbox
 * @param {string} id - ID del checkbox
 * @param {boolean} checked - Si el checkbox está marcado
 * @param {function} onChange - Función onChange
 * @param {boolean} disabled - Si el checkbox está deshabilitado
 * @param {boolean} custom - Si usar el estilo custom de AdminLTE
 * @param {string} customColor - Color custom (danger, success, info, etc.)
 * @param {boolean} outline - Si usar estilo outline
 */
const FormCheckbox = ({
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

FormCheckbox.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    custom: PropTypes.bool,
    customColor: PropTypes.string,
    outline: PropTypes.bool,
};

export default FormCheckbox;
