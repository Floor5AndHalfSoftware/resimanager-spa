/**
 * EJEMPLO: Formulario de Registro usando componentes AdminLTE
 * 
 * Este es un ejemplo de cómo usar los componentes de formulario
 * creados para mantener consistencia con AdminLTE 3
 */

import { useState } from 'react';
import { FormInput, FormCheckbox, FormSelect, FormTextarea } from '../forms';

const RegistroEjemplo = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        rol: '',
        notas: '',
        aceptaTerminos: false,
    });

    const [errors, setErrors] = useState({});

    const roles = [
        { value: 'admin', label: 'Administrador' },
        { value: 'residente', label: 'Residente' },
        { value: 'propietario', label: 'Propietario' },
        { value: 'vigilante', label: 'Vigilante' },
    ];

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.rol) {
            newErrors.rol = 'Debes seleccionar un rol';
        }

        if (!formData.aceptaTerminos) {
            newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Formulario válido:', formData);
            // Aquí iría la lógica de envío al servidor
            alert('Formulario enviado correctamente');
        } else {
            console.log('Errores de validación:', errors);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title">Registro de Usuario</h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Nombre Completo"
                                            id="nombre"
                                            placeholder="Ingresa tu nombre completo"
                                            value={formData.nombre}
                                            onChange={(e) => handleChange('nombre', e.target.value)}
                                            icon="fa-user"
                                            required
                                            error={errors.nombre}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <FormInput
                                            label="Email"
                                            id="email"
                                            type="email"
                                            placeholder="ejemplo@correo.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            icon="fa-envelope"
                                            required
                                            error={errors.email}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Contraseña"
                                            id="password"
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            icon="fa-lock"
                                            required
                                            error={errors.password}
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <FormInput
                                            label="Confirmar Contraseña"
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirma tu contraseña"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                            icon="fa-lock"
                                            required
                                            error={errors.confirmPassword}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <FormInput
                                            label="Teléfono"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Ej: +57 300 123 4567"
                                            value={formData.telefono}
                                            onChange={(e) => handleChange('telefono', e.target.value)}
                                            icon="fa-phone"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <FormSelect
                                            label="Rol"
                                            id="rol"
                                            value={formData.rol}
                                            onChange={(e) => handleChange('rol', e.target.value)}
                                            options={roles}
                                            custom
                                            required
                                            placeholder="Selecciona tu rol"
                                        />
                                        {errors.rol && (
                                            <div className="text-danger" style={{ fontSize: '80%', marginTop: '0.25rem' }}>
                                                {errors.rol}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <FormTextarea
                                    label="Notas Adicionales"
                                    id="notas"
                                    placeholder="Información adicional (opcional)"
                                    value={formData.notas}
                                    onChange={(e) => handleChange('notas', e.target.value)}
                                    rows={4}
                                />

                                <FormCheckbox
                                    label="Acepto los términos y condiciones"
                                    id="aceptaTerminos"
                                    checked={formData.aceptaTerminos}
                                    onChange={(e) => handleChange('aceptaTerminos', e.target.checked)}
                                    custom
                                    customColor="primary"
                                />
                                {errors.aceptaTerminos && (
                                    <div className="text-danger" style={{ fontSize: '80%', marginTop: '0.25rem' }}>
                                        {errors.aceptaTerminos}
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save mr-2"></i>
                                    Registrar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-default float-right"
                                    onClick={() => window.history.back()}
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistroEjemplo;
