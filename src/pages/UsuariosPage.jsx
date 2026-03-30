import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsuarios, deleteUsuario } from '../services/api';
import { showToast } from '../components/common/Toast';

const UsuariosPage = () => {
  const navigate = useNavigate();
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsuarios();
    }, searchTerm || filtroEstatus ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchTerm, filtroEstatus]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filtroEstatus) params.estatus = filtroEstatus;

      const response = await getUsuarios(params);
      setUsuarios(response.data || []);
    } catch (error) {
      showToast(error.message || 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInactivar = async (usuario) => {
    if (!window.confirm(`¿Inactivar al usuario "${usuario.nombre} ${usuario.apellido}"?`)) return;
    try {
      await deleteUsuario(usuario.id);
      showToast('Usuario inactivado correctamente', 'success');
      fetchUsuarios();
    } catch (error) {
      showToast(error.message || 'Error al inactivar usuario', 'error');
    }
  };

  const handleReload = () => {
    setSearchTerm('');
    setFiltroEstatus('');
    fetchUsuarios();
  };

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Gestión de Usuarios</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Inicio</Link>
                </li>
                <li className="breadcrumb-item active">Usuarios</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-users mr-2"></i>
                Lista de Usuarios
              </h3>
              <div className="card-tools">
                <button 
                  className="btn btn-sm btn-primary" 
                  onClick={handleReload}
                  title="Recargar"
                >
                  <i className="fas fa-sync-alt"></i> Recargar
                </button>
              </div>
            </div>
            
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nombre, documento o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={filtroEstatus}
                    onChange={(e) => setFiltroEstatus(e.target.value)}
                  >
                    <option value="">Todos los estatus</option>
                    <option value="A">Activos</option>
                    <option value="I">Inactivos</option>
                  </select>
                </div>
                <div className="col-md-3 text-right">
                  <span className="text-muted">
                    Total: <strong>{usuarios.length}</strong> usuarios
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <i className="fas fa-spinner fa-spin fa-3x text-primary"></i>
                  <p className="mt-3">Cargando usuarios...</p>
                </div>
              ) : usuarios.length === 0 ? (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle"></i> No hay usuarios registrados
                  {(searchTerm || filtroEstatus) && ' con los filtros aplicados'}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estatus</th>
                        <th width="160">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>
                            <strong>{usuario.nombre} {usuario.apellido}</strong>
                          </td>
                          <td>{usuario.documento}</td>
                          <td>
                            <small>{usuario.email}</small>
                          </td>
                          <td>
                            {usuario.telefono ? (
                              <small>{usuario.telefono}</small>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span 
                              className={`badge badge-${
                                usuario.estatus === 'A' ? 'success' : 'secondary'
                              }`}
                            >
                              {usuario.estatus === 'A' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-info"
                                onClick={() => navigate(`/dashboard/usuarios/${usuario.id}/perfiles`)}
                                title="Gestionar Perfiles"
                              >
                                <i className="fas fa-user-shield"></i>
                              </button>
                              <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/dashboard/usuarios/${usuario.id}/editar`)}
                                title="Editar usuario"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleInactivar(usuario)}
                                title="Inactivar usuario"
                                disabled={usuario.estatus === 'I'}
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Card Footer with Stats */}
            {!loading && usuarios.length > 0 && (
              <div className="card-footer">
                <div className="row">
                  <div className="col-md-4">
                    <small className="text-muted">
                      <i className="fas fa-check-circle text-success"></i> Activos: {usuarios.filter(u => u.estatus === 'A').length}
                    </small>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">
                      <i className="fas fa-ban text-secondary"></i> Inactivos: {usuarios.filter(u => u.estatus === 'I').length}
                    </small>
                  </div>
                  <div className="col-md-4 text-right">
                    <small className="text-muted">
                      <i className="fas fa-users"></i> Total: {usuarios.length}
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Card */}
          <div className="card card-info collapsed-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-question-circle mr-2"></i>
                Ayuda
              </h3>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <h5>Gestión de Perfiles de Usuario</h5>
              <p>
                Desde esta pantalla puedes ver todos los usuarios del sistema y gestionar sus perfiles.
              </p>
              <ul>
                <li>
                  <strong>Búsqueda:</strong> Filtra usuarios por nombre, documento o email
                </li>
                <li>
                  <strong>Filtro de estatus:</strong> Muestra solo usuarios activos o inactivos
                </li>
                <li>
                  <strong>Gestionar Perfiles:</strong> Click en el botón <i className="fas fa-user-shield"></i> para ver y asignar perfiles al usuario en sus diferentes contextos (Administradoras y Conjuntos)
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default UsuariosPage;
