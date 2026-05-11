import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import FormInput from '../components/forms/FormInput';
import FormSelect from '../components/forms/FormSelect';
import { getPropiedadById, createPropiedad, updatePropiedad, getConjuntos, getClasesPropiedad } from '../services/api';
import { showToast } from '../components/common/Toast';

const PropiedadFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [conjuntos, setConjuntos] = useState([]);
  const [clases, setClases] = useState([]);
  const [formData, setFormData] = useState({
    conjId: '',
    cdpId: '',
    numero: '',
    cantidad: '1',
    coefParticipacion: '0.00010000',
    estatus: 'A'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAuxData();
    if (isEditing) loadPropiedad();
  }, [id]);

  const loadAuxData = async () => {
    try {
      const [conjResp, clasesResp] = await Promise.all([
        getConjuntos({ limit: 200 }),
        getClasesPropiedad()
      ]);
      setConjuntos(conjResp.data || []);
      setClases(clasesResp || []);
    } catch (err) {
      showToast('Error al cargar datos auxiliares', 'error');
    }
  };

  const loadPropiedad = async () => {
    try {
      const prop = await getPropiedadById(id);
      setFormData({
        conjId: prop.ppConjId?.toString() || '',
        cdpId: prop.ppCdpId?.toString() || '',
        numero: prop.ppNumero || '',
        cantidad: prop.ppCantidad?.toString() || '1',
        coefParticipacion: prop.ppCoefParticipacion?.toString() || '0.00010000',
        estatus: prop.estatus || 'A'
      });
    } catch (error) {
      showToast(error.message || 'Error al cargar la propiedad', 'error');
      navigate('/dashboard/propiedades');
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
    if (!formData.conjId) newErrors.conjId = 'Seleccione un conjunto';
    if (!formData.cdpId) newErrors.cdpId = 'Seleccione una clase de propiedad';
    if (!formData.numero.trim()) newErrors.numero = 'El número es requerido';
    else if (formData.numero.length > 20) newErrors.numero = 'Máximo 20 caracteres';
    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) newErrors.cantidad = 'Debe ser mayor a 0';
    if (!formData.coefParticipacion || parseFloat(formData.coefParticipacion) <= 0) newErrors.coefParticipacion = 'Debe ser mayor a 0';
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
        conjId: parseInt(formData.conjId),
        cdpId: parseInt(formData.cdpId),
        numero: formData.numero.trim(),
        cantidad: parseFloat(formData.cantidad),
        coefParticipacion: parseFloat(formData.coefParticipacion)
      };

      if (isEditing) {
        await updatePropiedad(id, { ...payload, estatus: formData.estatus });
        showToast('Propiedad actualizada correctamente', 'success');
      } else {
        await createPropiedad(payload);
        showToast('Propiedad creada correctamente', 'success');
      }
      navigate('/dashboard/propiedades');
    } catch (err) {
      showToast(err.message || 'Error al guardar la propiedad', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Cargando..." breadcrumbs={[{ label: 'Propiedades', path: '/dashboard/propiedades' }, { label: isEditing ? 'Editar' : 'Nueva' }]}>
        <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
      breadcrumbs={[
        { label: 'Propiedades', path: '/dashboard/propiedades' },
        { label: isEditing ? 'Editar' : 'Nueva' }
      ]}
    >
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header"><h3 className="card-title">{isEditing ? 'Editar' : 'Nueva'} Propiedad</h3></div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <FormSelect
                  label="Conjunto"
                  value={formData.conjId}
                  onChange={(v) => handleChange('conjId', v)}
                  options={conjuntos.map(c => ({ value: c.id?.toString() || c.id, label: c.nombre || c.conjNombre }))}
                  placeholder="Seleccione un conjunto"
                  error={errors.conjId}
                  disabled={isEditing}
                  required
                />
                <FormSelect
                  label="Clase de Propiedad"
                  value={formData.cdpId}
                  onChange={(v) => handleChange('cdpId', v)}
                  options={clases.map(c => ({ value: c.id?.toString(), label: c.nombre }))}
                  placeholder="Seleccione una clase"
                  error={errors.cdpId}
                  required
                />
                <FormInput
                  label="Número"
                  value={formData.numero}
                  onChange={(v) => handleChange('numero', v)}
                  placeholder="Ej: Apto 101, Casa 5"
                  error={errors.numero}
                  required
                />
                <FormInput
                  label="Cantidad"
                  type="number"
                  step="0.0001"
                  value={formData.cantidad}
                  onChange={(v) => handleChange('cantidad', v)}
                  error={errors.cantidad}
                  required
                />
                <FormInput
                  label="Coeficiente de Participación"
                  type="number"
                  step="0.00000001"
                  value={formData.coefParticipacion}
                  onChange={(v) => handleChange('coefParticipacion', v)}
                  error={errors.coefParticipacion}
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
                <button type="button" className="btn btn-default float-right" onClick={() => navigate('/dashboard/propiedades')}>
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

export default PropiedadFormPage;
