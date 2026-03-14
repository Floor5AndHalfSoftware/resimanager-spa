import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/common/PageLayout';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import { getPerfilById, createPerfil, updatePerfil } from '../../services/api';
import { showToast } from '../../components/common/Toast';

/**
 * PerfilFormPage - Create or edit profile
 */
const PerfilFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: '',
    estatus: 'A'
  });
  const [errors, setErrors] = useState({});

  // Load profile data if editing
  useEffect(() => {
    if (isEditMode) {
      loadPerfil();
    }
  }, [id]);

  const loadPerfil = async () => {
    setLoading(true);
    try {
      const perfil = await getPerfilById(id);
      setFormData({
        nombre: perfil.nombre || '',
        descripcion: perfil.descripcion || '',
        nivel: perfil.nivel !== undefined ? perfil.nivel.toString() : '',
        estatus: perfil.estatus || 'A'
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast(error.message || 'Error al cargar el perfil', 'error');
      navigate('/dashboard/perfiles');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 60) {
      newErrors.nombre = 'El nombre no puede exceder 60 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 120) {
      newErrors.descripcion = 'La descripción no puede exceder 120 caracteres';
    }

    if (formData.nivel === '' || formData.nivel === null || formData.nivel === undefined) {
      newErrors.nivel = 'El nivel es requerido';
    } else {
      const nivelNum = parseInt(formData.nivel);
      if (isNaN(nivelNum) || nivelNum < 0 || nivelNum > 4) {
        newErrors.nivel = 'El nivel debe estar entre 0 y 4';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        nivel: parseInt(formData.nivel)
      };

      if (isEditMode) {
        dataToSend.estatus = formData.estatus;
        await updatePerfil(id, dataToSend);
        showToast(`Perfil "${dataToSend.nombre}" actualizado exitosamente`, 'success');
      } else {
        await createPerfil(dataToSend);
        showToast(`Perfil "${dataToSend.nombre}" creado exitosamente`, 'success');
      }

      navigate('/dashboard/perfiles');
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Handle specific validation errors from backend
      if (error.status === 400 && error.data) {
        if (typeof error.data === 'string' && error.data.includes('nombre')) {
          setErrors({ nombre: 'Ya existe un perfil con este nombre' });
        }
        showToast(error.data.message || error.data || 'Error de validación', 'error');
      } else {
        showToast(error.message || 'Error al guardar el perfil', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('¿Está seguro que desea cancelar? Los cambios no guardados se perderán.')) {
      navigate('/dashboard/perfiles');
    }
  };

  // Nivel options
  const nivelesOptions = [
    { value: '', label: 'Seleccione un nivel' },
    { value: '0', label: '0 - Super Administrador' },
    { value: '1', label: '1 - Administrador General' },
    { value: '2', label: '2 - Administrador de Conjunto' },
    { value: '3', label: '3 - Propietario' },
    { value: '4', label: '4 - Residente' }
  ];

  // Estatus options (only for edit mode)
  const estatusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' }
  ];

  if (loading) {
    return (
      <PageLayout 
        title={isEditMode ? 'Editar Perfil' : 'Nuevo Perfil'}
        subtitle="Gestión de Perfiles"
      >
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando datos del perfil...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={isEditMode ? 'Editar Perfil' : 'Nuevo Perfil'}
      subtitle="Gestión de Perfiles"
    >
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className={`fas ${isEditMode ? 'fa-edit' : 'fa-plus'} mr-2`}></i>
            {isEditMode ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row">
              {/* Nombre */}
              <div className="col-md-6">
                <FormInput
                  label="Nombre del Perfil"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  error={errors.nombre}
                  required
                  placeholder="Ej: Administrador de Conjunto"
                  maxLength={60}
                />
              </div>

              {/* Nivel */}
              <div className="col-md-6">
                <FormSelect
                  label="Nivel"
                  name="nivel"
                  value={formData.nivel}
                  onChange={(e) => handleChange('nivel', e.target.value)}
                  options={nivelesOptions}
                  error={errors.nivel}
                  required
                />
              </div>
            </div>

            <div className="row">
              {/* Descripción */}
              <div className="col-md-12">
                <FormTextarea
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  error={errors.descripcion}
                  placeholder="Descripción opcional del perfil"
                  rows={3}
                  maxLength={120}
                />
              </div>
            </div>

            {/* Estatus (only in edit mode) */}
            {isEditMode && (
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
            )}

            {/* Info message */}
            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Nota:</strong> Después de {isEditMode ? 'guardar los cambios' : 'crear el perfil'}, 
              podrá asignar módulos y permisos desde la página de detalle del perfil.
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
                      {isEditMode ? 'Guardar Cambios' : 'Crear Perfil'}
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

export default PerfilFormPage;
