import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/common/PageLayout';
import DataTable from '../../components/common/DataTable';
import { getPerfiles, deletePerfil } from '../../services/api';
import { showToast } from '../../components/common/Toast';

/**
 * PerfilesPage - List and manage user profiles
 */
const PerfilesPage = () => {
  const navigate = useNavigate();
  
  // State
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    estatus: '',
    nivel: ''
  });

  // Nivel options
  const nivelesOptions = [
    { value: '', label: 'Todos los niveles' },
    { value: '0', label: '0 - Super Administrador' },
    { value: '1', label: '1 - Administrador General' },
    { value: '2', label: '2 - Administrador de Conjunto' },
    { value: '3', label: '3 - Propietario' },
    { value: '4', label: '4 - Residente' }
  ];

  // Load profiles
  useEffect(() => {
    loadPerfiles();
  }, [pagination.page, filters]);

  const loadPerfiles = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await getPerfiles(params);
      
      setPerfiles(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / (response.limit || pagination.limit))
      }));
    } catch (error) {
      console.error('Error loading profiles:', error);
      showToast(error.message || 'Error al cargar los perfiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle delete
  const handleDelete = async (perfil) => {
    const usuariosAsignados = perfil.usuariosAsignados || 0;
    if (usuariosAsignados > 0) {
      showToast(
        `No se puede eliminar el perfil "${perfil.nombre}" porque tiene ${usuariosAsignados} usuario(s) asignado(s)`,
        'warning',
        5000
      );
      return;
    }

    if (!window.confirm(`¿Está seguro que desea eliminar el perfil "${perfil.nombre}"?`)) {
      return;
    }

    try {
      await deletePerfil(perfil.id);
      showToast(`Perfil "${perfil.nombre}" eliminado exitosamente`, 'success');
      loadPerfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      showToast(error.message || 'Error al eliminar el perfil', 'error');
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Table columns
  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '80px'
    },
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, perfil) => (
        <div>
          <strong>{perfil.nombre}</strong>
          {perfil.descripcion && (
            <div className="text-muted small">{perfil.descripcion}</div>
          )}
        </div>
      )
    },
    {
      key: 'nivel',
      label: 'Nivel',
      width: '100px',
      render: (value, perfil) => {
        const nivelLabels = {
          0: 'Super Admin',
          1: 'Admin Gral',
          2: 'Admin Conj',
          3: 'Propietario',
          4: 'Residente'
        };
        return (
          <span className="badge badge-info">
            {perfil.nivel} - {nivelLabels[perfil.nivel] || 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'usuariosAsignados',
      label: 'Usuarios',
      width: '100px',
      align: 'center',
      render: (value, perfil) => (
        <span className="badge badge-secondary">
          {perfil.usuariosAsignados || 0}
        </span>
      )
    },
    {
      key: 'estatus',
      label: 'Estado',
      width: '100px',
      align: 'center',
      render: (value, perfil) => (
        <span className={`badge ${perfil.estatus === 'A' ? 'badge-success' : 'badge-danger'}`}>
          {perfil.estatus === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '180px',
      align: 'center',
      render: (value, perfil) => (
        <div className="btn-group btn-group-sm" role="group">
          <button
            className="btn btn-info"
            onClick={() => navigate(`/dashboard/perfiles/${perfil.id}`)}
            title="Ver detalle"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/dashboard/perfiles/${perfil.id}/editar`)}
            title="Editar"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(perfil)}
            title="Eliminar"
            disabled={(perfil?.usuariosAsignados || 0) > 0}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <PageLayout title="Gestión de Perfiles" subtitle="Administración de perfiles de usuario">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-user-tag mr-2"></i>
                Lista de Perfiles
              </h3>
            </div>
            <div className="col-md-6 text-right">
              <button
                className="btn btn-success"
                onClick={() => navigate('/dashboard/perfiles/nuevo')}
              >
                <i className="fas fa-plus mr-2"></i>
                Nuevo Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Filters */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="row">
              <div className="col-md-5">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <select
                  className="form-control"
                  value={filters.nivel}
                  onChange={(e) => handleFilterChange('nivel', e.target.value)}
                >
                  {nivelesOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-control"
                  value={filters.estatus}
                  onChange={(e) => handleFilterChange('estatus', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="A">Activos</option>
                  <option value="I">Inactivos</option>
                </select>
              </div>

              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setFilters({ search: '', estatus: '', nivel: '' });
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  <i className="fas fa-times mr-2"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          {/* Table */}
          <DataTable
            columns={columns}
            data={perfiles}
            loading={loading}
            emptyMessage="No se encontraron perfiles"
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="text-muted">
                  Mostrando {perfiles.length} de {pagination.total} perfiles
                </div>
              </div>
              <div className="col-md-6">
                <nav>
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Anterior
                      </button>
                    </li>
                    
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                      ) {
                        return (
                          <li
                            key={pageNum}
                            className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                      }
                      return null;
                    })}

                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Siguiente
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default PerfilesPage;
