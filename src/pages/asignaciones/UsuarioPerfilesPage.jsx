import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsuarioPerfiles } from '../../services/api';
import { showToast } from '../../components/common/Toast';
import PageLayout from '../../components/common/PageLayout';

const UsuarioPerfilesPage = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [usuarioId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUsuarioPerfiles(usuarioId);
      setData(response);
    } catch (error) {
      showToast(error.message || 'Error al cargar perfiles', 'error');
      if (error.status === 404) {
        navigate('/dashboard/usuarios');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <section className="content">
          <div className="text-center mt-5">
            <i className="fas fa-spinner fa-spin fa-3x"></i>
            <p className="mt-3">Cargando perfiles...</p>
          </div>
        </section>
      </div>
    );
  }

  const administradoras = data?.contextos?.filter(c => c.tipo === 'ADMINISTRADORA') || [];
  const conjuntos = data?.contextos?.filter(c => c.tipo === 'CONJUNTO') || [];

  return (
    <PageLayout
      title="Perfiles del Usuario"
      breadcrumbs={[
        { label: 'Usuarios', path: '/dashboard/usuarios' },
        { label: 'Perfiles' }
      ]}
    >
      {/* Usuario Info */}
          <div className="card card-primary card-outline">
            <div className="card-body">
              <h4>
                <i className="fas fa-user mr-2"></i>
                {data?.persona?.nombre} {data?.persona?.apellido}
              </h4>
              <p className="text-muted mb-0">
                <i className="fas fa-id-card mr-2"></i>
                {data?.persona?.documento}
                <span className="ml-3">
                  <i className="fas fa-envelope mr-2"></i>
                  {data?.persona?.email}
                </span>
              </p>
            </div>
          </div>

          {/* Administradoras */}
          {administradoras.length > 0 && (
            <div className="card card-info card-outline">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-building mr-2"></i>
                  Administradoras
                </h3>
              </div>
              <div className="card-body">
                {administradoras.map((contexto) => (
                  <div key={contexto.entidad.id} className="callout callout-info mb-3">
                    <h5>{contexto.entidad.nombre}</h5>
                    {contexto.perfiles && contexto.perfiles.length > 0 ? (
                      <>
                        <ul className="mb-2">
                          {contexto.perfiles.map((perfil) => (
                            <li key={perfil.id}>
                              <i className="fas fa-user-shield mr-2"></i>
                              {perfil.nombre}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={`/dashboard/administradora/${contexto.entidad.id}/usuarios/${usuarioId}/perfiles`}
                          className="btn btn-sm btn-primary"
                        >
                          <i className="fas fa-cog mr-2"></i>
                          Gestionar Perfiles
                        </Link>
                      </>
                    ) : (
                      <p className="text-muted mb-0">Sin perfiles asignados</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conjuntos */}
          {conjuntos.length > 0 && (
            <div className="card card-success card-outline">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-home mr-2"></i>
                  Conjuntos Residenciales
                </h3>
              </div>
              <div className="card-body">
                {conjuntos.map((contexto) => (
                  <div key={contexto.entidad.id} className="callout callout-success mb-3">
                    <h5>{contexto.entidad.nombre}</h5>
                    {contexto.perfiles && contexto.perfiles.length > 0 ? (
                      <>
                        <ul className="mb-2">
                          {contexto.perfiles.map((perfil) => (
                            <li key={perfil.id}>
                              <i className="fas fa-user-shield mr-2"></i>
                              {perfil.nombre}
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={`/dashboard/conjunto/${contexto.entidad.id}/usuarios/${usuarioId}/perfiles`}
                          className="btn btn-sm btn-success"
                        >
                          <i className="fas fa-cog mr-2"></i>
                          Gestionar Perfiles
                        </Link>
                      </>
                    ) : (
                      <p className="text-muted mb-0">Sin perfiles asignados</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin Perfiles */}
          {administradoras.length === 0 && conjuntos.length === 0 && (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Este usuario no tiene perfiles asignados en ningún contexto.
            </div>
          )}

          {/* Botón Volver */}
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/usuarios')}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Volver a Usuarios
          </button>

    </PageLayout>
  );
};

export default UsuarioPerfilesPage;
