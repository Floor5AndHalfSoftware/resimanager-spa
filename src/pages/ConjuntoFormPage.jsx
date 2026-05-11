import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import { getConjuntoById, createConjunto, updateConjunto, getUsuarios } from '../services/api';
import { showToast } from '../components/common/Toast';

const ConjuntoFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    telefono: '',
    email: '',
    persContactoId: '',
    estatus: 'A'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPersonas();
    if (isEditing) loadConjunto();
  }, [id]);

  const loadPersonas = async () => {
    try {
      const resp = await getUsuarios({ limit: 500 });
      setPersonas(resp.data || []);
    } catch (err) {
      showToast('Error al cargar personas de contacto', 'error');
    }
  };

  const loadConjunto = async () => {
    try {
      const conj = await getConjuntoById(id);
      setFormData({
        documento: conj.documento || '',
        nombre: conj.nombre || '',
        telefono: conj.telefono || '',
        email: conj.email || '',
        persContactoId: conj.persContactoId?.toString() || '',
        estatus: conj.estatus || 'A'
      });
    } catch (error) {
      showToast(error.message || 'Error al cargar el conjunto', 'error');
      navigate('/dashboard/conjuntos');
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
    else if (formData.documento.length > 20) newErrors.documento = 'Máximo 20 caracteres';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    else if (formData.nombre.length > 80) newErrors.nombre = 'Máximo 80 caracteres';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    else if (formData.telefono.length > 15) newErrors.telefono = 'Máximo 15 caracteres';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    else if (formData.email.length > 80) newErrors.email = 'Máximo 80 caracteres';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.persContactoId) newErrors.persContactoId = 'Seleccione una persona de contacto';
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
        email: formData.email.trim(),
        persContactoId: parseInt(formData.persContactoId)
      };

      if (isEditing) {
        await updateConjunto(id, { ...payload, estatus: formData.estatus });
        showToast('Conjunto actualizado correctamente', 'success');
      } else {
        await createConjunto(payload);
        showToast('Conjunto creado correctamente', 'success');
      }
      navigate('/dashboard/conjuntos');
    } catch (err) {
      showToast(err.message || 'Error al guardar el conjunto', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Cargando..." breadcrumbs={[{ label: 'Conjuntos', path: '/dashboard/conjuntos' }, { label: isEditing ? 'Editar' : 'Nuevo' }]}>
        <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isEditing ? 'Editar Conjunto' : 'Nuevo Conjunto'}
      breadcrumbs={[
        { label: 'Conjuntos', path: '/dashboard/conjuntos' },
        { label: isEditing ? 'Editar' : 'Nuevo' }
      ]}
    >
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header"><h3 className="card-title">{isEditing ? 'Editar' : 'Nuevo'} Conjunto</h3></div>
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
                  placeholder="Nombre del conjunto residencial"
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
                <FormSelect
                  label="Persona Contacto"
                  value={formData.persContactoId}
                  onChange={(v) => handleChange('persContactoId', v)}
                  options={personas.map(p => ({ value: p.id?.toString(), label: `${p.nombre} ${p.apellido || ''} - ${p.documento || ''}` }))}
                  placeholder="Seleccione una persona"
                  error={errors.persContactoId}
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
                <button type="button" className="btn btn-default float-right" onClick={() => navigate('/dashboard/conjuntos')}>
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

export default ConjuntoFormPage;
