import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getAdministradoraById, 
  getAdministradoraUsuarios 
} from '../../services/api';
import { showToast } from '../../components/common/Toast';

const AdministradoraUsuariosPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [administradora, setAdministradora] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener datos de la administradora
      const adminResponse = await getAdministradoraById(id);
      setAdministradora(adminResponse);
      
      // Obtener usuarios de la administradora
      const usuariosResponse = await getAdministradoraUsuarios(id);
      setUsuarios(usuariosResponse.data || []);
    } catch (error) {
      showToast(error.message || 'Error al cargar usuarios', 'error');
      if (error.status === 404) {
        navigate('/dashboard/administradoras');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    `${usuario.persona.nombre} ${usuario.persona.apellido} ${usuario.persona.documento}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="content-wrapper">
        <section className="content">
          <div className="text-center mt-5">
            <i className="fas fa-spinner fa-spin fa-3x"></i>
            <p className="mt-3">Cargando usuarios...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Content Header */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Usuarios - {administradora?.nombre}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Inicio</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/dashboard/administradoras">Administradoras</Link>
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
                Usuarios Asignados
              </h3>
              <div className="card-tools">
                <button 
                  className="btn btn-sm btn-primary" 
                  onClick={fetchData}
                  title="Recargar"
                >
                  <i className="fas fa-sync-alt"></i> Recargar
                </button>
              </div>
            </div>
            
            <div className="card-body">
              {/* Search Bar */}
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
                      placeholder="Buscar por nombre o documento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              {filteredUsuarios.length === 0 ? (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle"></i> No hay usuarios asignados
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Email</th>
                        <th>Perfiles</th>
                        <th>Estatus</th>
                        <th width="100">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.map((usuario) => (
                        <tr key={usuario.persona.id}>
                          <td>
                            {usuario.persona.nombre} {usuario.persona.apellido}
                          </td>
                          <td>{usuario.persona.documento}</td>
                          <td>{usuario.persona.email}</td>
                          <td>
                            {usuario.perfiles && usuario.perfiles.length > 0 ? (
                              usuario.perfiles.map((perfil) => (
                                <span 
                                  key={perfil.id} 
                                  className="badge badge-info mr-1"
                                >
                                  {perfil.nombre}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted">Sin perfiles</span>
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
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => navigate(
                                `/dashboard/administradora/${id}/usuarios/${usuario.persona.id}/perfiles`
                              )}
                              title="Gestionar Perfiles"
                            >
                              <i className="fas fa-user-shield"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdministradoraUsuariosPage;
