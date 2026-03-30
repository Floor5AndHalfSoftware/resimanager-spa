import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import { getUsuarioById, updateUsuario } from '../services/api';
import { showToast } from '../components/common/Toast';

const UsuarioFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    estatus: 'A'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUsuario();
  }, [id]);

  const loadUsuario = async () => {
    setLoading(true);
    try {
      const usuario = await getUsuarioById(id);
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
        email: usuario.email || '',
        estatus: usuario.estatus || 'A'
      });
    } catch (error) {
      showToast(error.message || 'Error al cargar el usuario', 'error');
      navigate('/dashboard/usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 80) {
      newErrors.nombre = 'El nombre no puede exceder 80 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length > 80) {
      newErrors.apellido = 'El apellido no puede exceder 80 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (formData.telefono.length > 15) {
      newErrors.telefono = 'El teléfono no puede exceder 15 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await updateUsuario(id, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        estatus: formData.estatus
      });
      showToast('Usuario actualizado correctamente', 'success');
      navigate('/dashboard/usuarios');
    } catch (error) {
      showToast(error.message || 'Error al actualizar el usuario', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Desea cancelar? Los cambios no guardados se perderán.')) {
      navigate('/dashboard/usuarios');
    }
  };

  const estatusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' }
  ];

  if (loading) {
    return (
      <PageLayout title="Editar Usuario" subtitle="Gestión de Usuarios">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando datos del usuario...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Editar Usuario" subtitle="Gestión de Usuarios">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-user-edit mr-2"></i>
            Editar Usuario
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  error={errors.nombre}
                  required
                  maxLength={80}
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  error={errors.apellido}
                  required
                  maxLength={80}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  required
                  maxLength={80}
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  error={errors.telefono}
                  required
                  maxLength={15}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <FormSelect
                  label="Estado"
                  name="estatus"
                  value={formData.estatus}
                  onChange={(e) => handleChange('estatus', e.target.value)}
                  options={estatusOptions}
                  required
                />
              </div>
            </div>

          </div>

          <div className="card-footer">
            <div className="row">
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancelar
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default UsuarioFormPage;
