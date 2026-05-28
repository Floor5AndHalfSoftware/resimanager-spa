import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import { getAdministradoraById, createAdministradora, updateAdministradora } from '../services/api';
import { showToast } from '../components/common/Toast';

const AdministradoraFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    telefono: '',
    email: '',
    estatus: 'A'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) loadAdministradora();
  }, [id]);

  const loadAdministradora = async () => {
    try {
      const adm = await getAdministradoraById(id);
      setFormData({
        documento: adm.documento || '',
        nombre: adm.nombre || '',
        telefono: adm.telefono || '',
        email: adm.email || '',
        estatus: adm.estatus || 'A'
      });
    } catch (error) {
      showToast(error.message || 'Error al cargar la administradora', 'error');
      navigate('/dashboard/administradoras');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.documento.trim()) newErrors.documento = 'El documento es requerido';
    else if (formData.documento.length > 50) newErrors.documento = 'Máximo 50 caracteres';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    else if (formData.nombre.length > 250) newErrors.nombre = 'Máximo 250 caracteres';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    else if (formData.telefono.length > 15) newErrors.telefono = 'Máximo 15 caracteres';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (formData.email.length > 250) newErrors.email = 'Máximo 250 caracteres';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Corrija los errores del formulario', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        documento: formData.documento.trim(),
        nombre: formData.nombre.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim()
      };

      if (isEditing) {
        await updateAdministradora(id, { ...payload, estatus: formData.estatus });
        showToast('Administradora actualizada correctamente', 'success');
      } else {
        await createAdministradora(payload);
        showToast('Administradora creada correctamente', 'success');
      }
      navigate('/dashboard/administradoras');
    } catch (err) {
      showToast(err.message || 'Error al guardar la administradora', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Cargando..." breadcrumbs={[{ label: 'Administradoras', path: '/dashboard/administradoras' }, { label: isEditing ? 'Editar' : 'Nuevo' }]}>
        <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isEditing ? 'Editar Administradora' : 'Nueva Administradora'}
      breadcrumbs={[
        { label: 'Administradoras', path: '/dashboard/administradoras' },
        { label: isEditing ? 'Editar' : 'Nuevo' }
      ]}
    >
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header"><h3 className="card-title">{isEditing ? 'Editar' : 'Nueva'} Administradora</h3></div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <FormInput
                  label="Documento"
                  value={formData.documento}
                  onChange={(v) => handleChange('documento', v)}
                  placeholder="RIF o documento de identidad"
                  error={errors.documento}
                  required
                />
                <FormInput
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(v) => handleChange('nombre', v)}
                  placeholder="Nombre de la administradora"
                  error={errors.nombre}
                  required
                />
                <FormInput
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(v) => handleChange('telefono', v)}
                  placeholder="Teléfono de contacto"
                  error={errors.telefono}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  placeholder="Correo electrónico"
                  error={errors.email}
                  required
                />
                {isEditing && (
                  <FormSelect
                    label="Estatus"
                    value={formData.estatus}
                    onChange={(v) => handleChange('estatus', v)}
                    options={[
                      { value: 'A', label: 'Activo' },
                      { value: 'I', label: 'Inactivo' }
                    ]}
                  />
                )}
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <><i className="fas fa-spinner fa-spin mr-1"></i> Guardando...</> : (isEditing ? 'Actualizar' : 'Crear')}
                </button>
                <button type="button" className="btn btn-default float-right" onClick={() => navigate('/dashboard/administradoras')}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdministradoraFormPage;
