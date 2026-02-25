import { useState } from 'react';
import { FormInput, FormCheckbox, FormSelect, FormTextarea, FormRadio } from '../forms';

/**
 * FormExample - Ejemplo de uso de los componentes de formulario AdminLTE
 * Este archivo muestra cómo utilizar todos los componentes de formulario creados
 */
const FormExample = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        rol: '',
        genero: '',
        descripcion: '',
        terminos: false,
        newsletter: false,
    });

    const [errors, setErrors] = useState({});

    const roles = [
        { value: 'admin', label: 'Administrador' },
        { value: 'user', label: 'Usuario' },
        { value: 'moderator', label: 'Moderador' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Aquí iría la lógica de validación y envío
    };

    const handleInputChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };

    const handleCheckboxChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.checked
        });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6">
                    {/* Card de ejemplo - Formulario básico */}
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Formulario de Registro</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                {/* Input con label e icono */}
                                <FormInput
                                    label="Nombre completo"
                                    id="nombre"
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange('nombre')}
                                    icon="fa-user"
                                    required
                                    error={errors.nombre}
                                />

                                {/* Input de email */}
                                <FormInput
                                    label="Correo electrónico"
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    icon="fa-envelope"
                                    required
                                />

                                {/* Input de password */}
                                <FormInput
                                    label="Contraseña"
                                    id="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    icon="fa-lock"
                                    required
                                />

                                {/* Input sin icono */}
                                <FormInput
                                    label="Teléfono"
                                    id="telefono"
                                    type="tel"
                                    placeholder="123-456-7890"
                                    value={formData.telefono}
                                    onChange={handleInputChange('telefono')}
                                />

                                {/* Select custom */}
                                <FormSelect
                                    label="Rol de usuario"
                                    id="rol"
                                    value={formData.rol}
                                    onChange={handleInputChange('rol')}
                                    options={roles}
                                    custom
                                    required
                                    placeholder="Selecciona un rol"
                                />

                                {/* Textarea */}
                                <FormTextarea
                                    label="Descripción"
                                    id="descripcion"
                                    placeholder="Cuéntanos sobre ti..."
                                    value={formData.descripcion}
                                    onChange={handleInputChange('descripcion')}
                                    rows={4}
                                />

                                {/* Radio buttons custom */}
                                <div className="form-group">
                                    <label>Género</label>
                                    <FormRadio
                                        label="Masculino"
                                        id="genero-m"
                                        name="genero"
                                        checked={formData.genero === 'M'}
                                        onChange={() => setFormData({...formData, genero: 'M'})}
                                        custom
                                    />
                                    <FormRadio
                                        label="Femenino"
                                        id="genero-f"
                                        name="genero"
                                        checked={formData.genero === 'F'}
                                        onChange={() => setFormData({...formData, genero: 'F'})}
                                        custom
                                    />
                                    <FormRadio
                                        label="Otro"
                                        id="genero-o"
                                        name="genero"
                                        checked={formData.genero === 'O'}
                                        onChange={() => setFormData({...formData, genero: 'O'})}
                                        custom
                                    />
                                </div>

                                {/* Checkboxes */}
                                <FormCheckbox
                                    label="Acepto los términos y condiciones"
                                    id="terminos"
                                    checked={formData.terminos}
                                    onChange={handleCheckboxChange('terminos')}
                                    custom
                                    customColor="danger"
                                />

                                <FormCheckbox
                                    label="Deseo recibir newsletter"
                                    id="newsletter"
                                    checked={formData.newsletter}
                                    onChange={handleCheckboxChange('newsletter')}
                                />
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">
                                    Registrar
                                </button>
                                <button type="button" className="btn btn-default float-right">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-6">
                    {/* Card de ejemplo - Estados de validación */}
                    <div className="card card-info">
                        <div className="card-header">
                            <h3 className="card-title">Estados de Validación</h3>
                        </div>
                        <div className="card-body">
                            <FormInput
                                label="Input con éxito"
                                id="input-success"
                                placeholder="Input válido"
                                value="Dato correcto"
                                onChange={() => {}}
                                success="¡Muy bien! Los datos son correctos."
                            />

                            <FormInput
                                label="Input con error"
                                id="input-error"
                                placeholder="Input inválido"
                                value="Dato incorrecto"
                                onChange={() => {}}
                                error="Este campo contiene errores."
                            />

                            <FormInput
                                label="Input con advertencia"
                                id="input-warning"
                                placeholder="Input con advertencia"
                                value="Dato con advertencia"
                                onChange={() => {}}
                                warning="Ten cuidado con este dato."
                            />
                        </div>
                    </div>

                    {/* Card de ejemplo - Diferentes estilos */}
                    <div className="card card-success">
                        <div className="card-header">
                            <h3 className="card-title">Diferentes Tamaños</h3>
                        </div>
                        <div className="card-body">
                            <FormInput
                                label="Input grande"
                                id="input-lg"
                                placeholder="Input grande"
                                value=""
                                onChange={() => {}}
                                className="form-control-lg"
                            />

                            <FormInput
                                label="Input normal"
                                id="input-normal"
                                placeholder="Input normal"
                                value=""
                                onChange={() => {}}
                            />

                            <FormInput
                                label="Input pequeño"
                                id="input-sm"
                                placeholder="Input pequeño"
                                value=""
                                onChange={() => {}}
                                className="form-control-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormExample;
