import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getUsuarioById,
  getAdministradoraById,
  getConjuntoById,
  getPerfiles,
  getAdministradoraUsuarios,
  getConjuntoUsuarios,
  asignarPerfilesAdministradora,
  asignarPerfilesConjunto,
  removerPerfilAdministradora,
  removerPerfilConjunto
} from '../../services/api';
import { showToast } from '../../components/common/Toast';

const AsignarPerfilesPage = () => {
  const { contextType, contextId, usuarioId } = useParams();
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(null);
  const [contexto, setContexto] = useState(null);
  const [perfilesActuales, setPerfilesActuales] = useState([]);
  const [perfilesDisponibles, setPerfilesDisponibles] = useState([]);
  const [selectedPerfiles, setSelectedPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isAdministradora = contextType === 'administradora';

  useEffect(() => {
    fetchData();
  }, [contextId, usuarioId, contextType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener datos del usuario
      const usuarioResponse = await getUsuarioById(usuarioId);
      setUsuario(usuarioResponse);
      
      // Obtener datos del contexto
      let contextResponse;
      let usuariosResponse;
      
      if (isAdministradora) {
        contextResponse = await getAdministradoraById(contextId);
        usuariosResponse = await getAdministradoraUsuarios(contextId);
      } else {
        contextResponse = await getConjuntoById(contextId);
        usuariosResponse = await getConjuntoUsuarios(contextId);
      }
      
      setContexto(contextResponse);
      
      // Encontrar perfiles del usuario en este contexto
      const usuarioEnContexto = usuariosResponse.data.find(
        u => u.persona.id === parseInt(usuarioId)
      );
      
      setPerfilesActuales(usuarioEnContexto?.perfiles || []);
      
      // Obtener todos los perfiles
      const perfilesResponse = await getPerfiles();
      
      // Filtrar perfiles disponibles (no asignados)
      const perfilesYaAsignados = usuarioEnContexto?.perfiles.map(p => p.id) || [];
      const disponibles = perfilesResponse.data.filter(
        p => !perfilesYaAsignados.includes(p.id)
      );
      
      setPerfilesDisponibles(disponibles);
      
    } catch (error) {
      showToast(error.message || 'Error al cargar datos', 'error');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePerfil = (perfilId) => {
    setSelectedPerfiles(prev =>
      prev.includes(perfilId)
        ? prev.filter(id => id !== perfilId)
        : [...prev, perfilId]
    );
  };

  const handleAsignarPerfiles = async () => {
    if (selectedPerfiles.length === 0) {
      showToast('Debe seleccionar al menos un perfil', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (isAdministradora) {
        await asignarPerfilesAdministradora(
          contextId, 
          usuarioId, 
          { perfiles: selectedPerfiles }
        );
      } else {
        await asignarPerfilesConjunto(
          contextId, 
          usuarioId, 
          { perfiles: selectedPerfiles }
        );
      }
      
      showToast(
        `${selectedPerfiles.length} perfil(es) asignado(s) correctamente`, 
        'success'
      );
      
      setSelectedPerfiles([]);
      await fetchData();
      
    } catch (error) {
      showToast(error.message || 'Error al asignar perfiles', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoverPerfil = async (perfilId, perfilNombre) => {
    if (!window.confirm(`¿Remover el perfil "${perfilNombre}"?`)) {
      return;
    }

    try {
      if (isAdministradora) {
        await removerPerfilAdministradora(contextId, usuarioId, perfilId);
      } else {
        await removerPerfilConjunto(contextId, usuarioId, perfilId);
      }
      
      showToast('Perfil removido correctamente', 'success');
      await fetchData();
      
    } catch (error) {
      showToast(error.message || 'Error al remover perfil', 'error');
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <section className="content">
          <div className="text-center mt-5">
            <i className="fas fa-spinner fa-spin fa-3x"></i>
            <p className="mt-3">Cargando datos...</p>
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
              <h1>Gestionar Perfiles</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Inicio</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/dashboard/${contextType}s`}>
                    {isAdministradora ? 'Administradoras' : 'Conjuntos'}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/dashboard/${contextType}s/${contextId}/usuarios`}>
                    Usuarios
                  </Link>
                </li>
                <li className="breadcrumb-item active">Gestionar Perfiles</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content">
        <div className="container-fluid">
          
          {/* Usuario Info Card */}
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-user mr-2"></i>
                Información del Usuario
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <dl className="row">
                    <dt className="col-sm-4">Nombre:</dt>
                    <dd className="col-sm-8">
                      {usuario?.nombre} {usuario?.apellido}
                    </dd>
                    <dt className="col-sm-4">Documento:</dt>
                    <dd className="col-sm-8">{usuario?.documento}</dd>
                    <dt className="col-sm-4">Email:</dt>
                    <dd className="col-sm-8">{usuario?.email}</dd>
                  </dl>
                </div>
                <div className="col-md-6">
                  <dl className="row">
                    <dt className="col-sm-4">Contexto:</dt>
                    <dd className="col-sm-8">{contexto?.nombre}</dd>
                    <dt className="col-sm-4">Tipo:</dt>
                    <dd className="col-sm-8">
                      <span className={`badge badge-${isAdministradora ? 'primary' : 'success'}`}>
                        {isAdministradora ? 'Administradora' : 'Conjunto'}
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Perfiles Actuales */}
            <div className="col-md-6">
              <div className="card card-success card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-check-circle mr-2"></i>
                    Perfiles Asignados
                  </h3>
                </div>
                <div className="card-body">
                  {perfilesActuales.length === 0 ? (
                    <div className="alert alert-info mb-0">
                      <i className="fas fa-info-circle"></i> 
                      No tiene perfiles asignados
                    </div>
                  ) : (
                    <div className="list-group">
                      {perfilesActuales.map((perfil) => (
                        <div 
                          key={perfil.id} 
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            <i className="fas fa-user-shield mr-2 text-success"></i>
                            {perfil.nombre}
                          </span>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoverPerfil(perfil.id, perfil.nombre)}
                            title="Remover perfil"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Perfiles Disponibles */}
            <div className="col-md-6">
              <div className="card card-info card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-plus-circle mr-2"></i>
                    Asignar Nuevos Perfiles
                  </h3>
                </div>
                <div className="card-body">
                  {perfilesDisponibles.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                      <i className="fas fa-exclamation-triangle"></i> 
                      No hay más perfiles disponibles
                    </div>
                  ) : (
                    <>
                      <div className="list-group mb-3">
                        {perfilesDisponibles.map((perfil) => (
                          <label 
                            key={perfil.id} 
                            className="list-group-item d-flex align-items-center"
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type="checkbox"
                              className="mr-3"
                              checked={selectedPerfiles.includes(perfil.id)}
                              onChange={() => handleTogglePerfil(perfil.id)}
                            />
                            <div className="flex-grow-1">
                              <strong>{perfil.nombre}</strong>
                              <br />
                              <small className="text-muted">
                                {perfil.descripcion}
                              </small>
                              <br />
                              <span className="badge badge-secondary">
                                Nivel {perfil.nivel}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                      
                      <button
                        className="btn btn-success btn-block"
                        onClick={handleAsignarPerfiles}
                        disabled={submitting || selectedPerfiles.length === 0}
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Asignando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check mr-2"></i>
                            Asignar Seleccionados ({selectedPerfiles.length})
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="row">
            <div className="col-12">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Volver
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AsignarPerfilesPage;
