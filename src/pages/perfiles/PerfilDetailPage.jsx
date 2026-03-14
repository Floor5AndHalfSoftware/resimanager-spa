import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/common/PageLayout';
import { getPerfilById, getModulos, asignarModulos, revocarModulo } from '../../services/api';
import { showToast } from '../../components/common/Toast';

/**
 * PerfilDetailPage - View profile details and manage modules
 */
const PerfilDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [allModulos, setAllModulos] = useState([]);
  const [selectedModulos, setSelectedModulos] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Load profile and modules
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [perfilData, modulosData] = await Promise.all([
        getPerfilById(id),
        getModulos()
      ]);
      
      setPerfil(perfilData);
      setAllModulos(modulosData);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast(error.message || 'Error al cargar los datos', 'error');
      navigate('/dashboard/perfiles');
    } finally {
      setLoading(false);
    }
  };

  // Get available modules (not yet assigned)
  const getAvailableModulos = () => {
    if (!perfil || !perfil.modulos) return allModulos;
    
    const assignedIds = perfil.modulos.map(m => m.id);
    return allModulos.filter(m => !assignedIds.includes(m.id));
  };

  // Handle module selection
  const handleModuleToggle = (moduloId) => {
    setSelectedModulos(prev => {
      if (prev.includes(moduloId)) {
        return prev.filter(id => id !== moduloId);
      } else {
        return [...prev, moduloId];
      }
    });
  };

  // Handle assign modules
  const handleAssignModules = async () => {
    if (selectedModulos.length === 0) {
      showToast('Debe seleccionar al menos un módulo', 'warning');
      return;
    }

    setAssigning(true);
    try {
      await asignarModulos(id, selectedModulos);
      showToast(
        `${selectedModulos.length} módulo(s) asignado(s) exitosamente`,
        'success'
      );
      setSelectedModulos([]);
      setShowAssignModal(false);
      loadData(); // Reload to get updated data
    } catch (error) {
      console.error('Error assigning modules:', error);
      showToast(error.message || 'Error al asignar los módulos', 'error');
    } finally {
      setAssigning(false);
    }
  };

  // Handle revoke module
  const handleRevokeModule = async (modulo) => {
    if (!window.confirm(`¿Está seguro que desea revocar el módulo "${modulo.nombre}"?`)) {
      return;
    }

    try {
      await revocarModulo(id, modulo.id);
      showToast(`Módulo "${modulo.nombre}" revocado exitosamente`, 'success');
      loadData(); // Reload to get updated data
    } catch (error) {
      console.error('Error revoking module:', error);
      showToast(error.message || 'Error al revocar el módulo', 'error');
    }
  };

  // Get nivel label
  const getNivelLabel = (nivel) => {
    const labels = {
      0: 'Super Administrador',
      1: 'Administrador General',
      2: 'Administrador de Conjunto',
      3: 'Propietario',
      4: 'Residente'
    };
    return labels[nivel] || 'N/A';
  };

  if (loading) {
    return (
      <PageLayout title="Detalle de Perfil" subtitle="Gestión de Perfiles">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando detalles del perfil...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!perfil) {
    return (
      <PageLayout title="Perfil No Encontrado" subtitle="Gestión de Perfiles">
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4>Perfil no encontrado</h4>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard/perfiles')}>
              Volver a Perfiles
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const availableModulos = getAvailableModulos();

  return (
    <PageLayout title={perfil.nombre} subtitle="Detalle de Perfil">
      {/* Profile Info Card */}
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-user-tag mr-2"></i>
                Información del Perfil
              </h3>
            </div>
            <div className="col-md-6 text-right">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/dashboard/perfiles/${id}/editar`)}
              >
                <i className="fas fa-edit mr-2"></i>
                Editar
              </button>
              <button
                className="btn btn-secondary btn-sm ml-2"
                onClick={() => navigate('/dashboard/perfiles')}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Volver
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-4">ID:</dt>
                <dd className="col-sm-8">{perfil.id}</dd>

                <dt className="col-sm-4">Nombre:</dt>
                <dd className="col-sm-8"><strong>{perfil.nombre}</strong></dd>

                <dt className="col-sm-4">Descripción:</dt>
                <dd className="col-sm-8">{perfil.descripcion || <em className="text-muted">Sin descripción</em>}</dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-5">Nivel:</dt>
                <dd className="col-sm-7">
                  <span className="badge badge-info">
                    {perfil.nivel} - {getNivelLabel(perfil.nivel)}
                  </span>
                </dd>

                <dt className="col-sm-5">Estado:</dt>
                <dd className="col-sm-7">
                  <span className={`badge ${perfil.estatus === 'A' ? 'badge-success' : 'badge-danger'}`}>
                    {perfil.estatus === 'A' ? 'Activo' : 'Inactivo'}
                  </span>
                </dd>

                <dt className="col-sm-5">Usuarios Asignados:</dt>
                <dd className="col-sm-7">
                  <span className="badge badge-secondary">{perfil.usuariosAsignados || 0}</span>
                </dd>

                <dt className="col-sm-5">Fecha de Creación:</dt>
                <dd className="col-sm-7">
                  {perfil.fechaCreacion 
                    ? new Date(perfil.fechaCreacion).toLocaleDateString('es-ES')
                    : 'N/A'
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Modules Card */}
      <div className="card mt-3">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-th-large mr-2"></i>
                Módulos Asignados ({perfil.modulos?.length || 0})
              </h3>
            </div>
            <div className="col-md-6 text-right">
              {availableModulos.length > 0 && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowAssignModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Asignar Módulos
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          {perfil.modulos && perfil.modulos.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Nivel</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {perfil.modulos.map(modulo => (
                    <tr key={modulo.id}>
                      <td>{modulo.id}</td>
                      <td><strong>{modulo.nombre}</strong></td>
                      <td>{modulo.descripcion || <em className="text-muted">Sin descripción</em>}</td>
                      <td>
                        <span className="badge badge-secondary">Nivel {modulo.nivel}</span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRevokeModule(modulo)}
                          title="Revocar módulo"
                        >
                          <i className="fas fa-times"></i> Revocar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="fas fa-inbox fa-3x mb-3"></i>
              <p>No hay módulos asignados a este perfil</p>
              {availableModulos.length > 0 && (
                <button
                  className="btn btn-success"
                  onClick={() => setShowAssignModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Asignar Módulos
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Permissions Card */}
      {perfil.permisos && perfil.permisos.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-key mr-2"></i>
              Permisos Detallados
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              {perfil.permisos.map(permiso => (
                <div key={permiso.moduloId} className="col-md-6 mb-3">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fas fa-cube mr-2 text-primary"></i>
                        {permiso.modulo}
                      </h5>
                      <div className="mt-2">
                        {permiso.acciones && permiso.acciones.length > 0 ? (
                          permiso.acciones.map(accion => (
                            <span key={accion} className="badge badge-success mr-1 mb-1">
                              {accion}
                            </span>
                          ))
                        ) : (
                          <em className="text-muted">Sin acciones asignadas</em>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Modules Modal */}
      {showAssignModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus-circle mr-2"></i>
                  Asignar Módulos
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedModulos([]);
                  }}
                  disabled={assigning}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {availableModulos.length > 0 ? (
                  <>
                    <p className="text-muted">
                      Seleccione los módulos que desea asignar al perfil <strong>{perfil.nombre}</strong>:
                    </p>
                    <div className="list-group">
                      {availableModulos.map(modulo => (
                        <label
                          key={modulo.id}
                          className={`list-group-item list-group-item-action ${selectedModulos.includes(modulo.id) ? 'active' : ''}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`modulo-${modulo.id}`}
                              checked={selectedModulos.includes(modulo.id)}
                              onChange={() => handleModuleToggle(modulo.id)}
                            />
                            <label className="custom-control-label w-100" htmlFor={`modulo-${modulo.id}`} style={{ cursor: 'pointer' }}>
                              <div>
                                <strong>{modulo.nombre}</strong>
                                <span className="badge badge-secondary ml-2">Nivel {modulo.nivel}</span>
                              </div>
                              {modulo.descripcion && (
                                <small className="text-muted d-block">{modulo.descripcion}</small>
                              )}
                            </label>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 text-muted">
                      <i className="fas fa-info-circle mr-2"></i>
                      {selectedModulos.length} módulo(s) seleccionado(s)
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="fas fa-check-circle fa-3x mb-3 text-success"></i>
                    <p>Todos los módulos disponibles ya están asignados a este perfil</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedModulos([]);
                  }}
                  disabled={assigning}
                >
                  Cancelar
                </button>
                {availableModulos.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAssignModules}
                    disabled={assigning || selectedModulos.length === 0}
                  >
                    {assigning ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Asignando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check mr-2"></i>
                        Asignar ({selectedModulos.length})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default PerfilDetailPage;
