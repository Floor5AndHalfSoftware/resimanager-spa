import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';
import { getAdministradoras } from '../services/api';
import { showToast } from '../components/common/Toast';

const AdministradorasPage = () => {
  const navigate = useNavigate();

  const [administradoras, setAdministradoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', estatus: '' });

  useEffect(() => {
    loadAdministradoras();
  }, [pagination.page, filters]);

  const loadAdministradoras = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.estatus) params.estatus = filters.estatus;

      const response = await getAdministradoras(params);
      setAdministradoras(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.limit)
      }));
    } catch (error) {
      showToast(error.message || 'Error al cargar administradoras', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const columns = [
    { key: 'id', label: 'ID', width: '70px' },
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value, adm) => (
        <div>
          <strong>{adm.nombre}</strong>
          {adm.documento && <div className="text-muted small">{adm.documento}</div>}
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono', width: '130px' },
    {
      key: 'estatus',
      label: 'Estado',
      width: '90px',
      align: 'center',
      render: (value, adm) => (
        <span className={`badge ${adm.estatus === 'A' ? 'badge-success' : 'badge-danger'}`}>
          {adm.estatus === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '100px',
      align: 'center',
      render: (value, adm) => (
        <button
          className="btn btn-sm btn-info"
          onClick={() => navigate(`/dashboard/administradoras/${adm.id}/usuarios`)}
          title="Ver usuarios de esta administradora"
        >
          <i className="fas fa-users mr-1"></i>
          Usuarios
        </button>
      )
    }
  ];

  return (
    <PageLayout title="Administradoras" subtitle="Listado de administradoras registradas">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-building mr-2"></i>
                Lista de Administradoras
              </h3>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form
            onSubmit={(e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); }}
            className="mb-3"
          >
            <div className="row">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o documento..."
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
                  value={filters.estatus}
                  onChange={(e) => handleFilterChange('estatus', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="A">Activos</option>
                  <option value="I">Inactivos</option>
                </select>
              </div>
              <div className="col-md-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setFilters({ search: '', estatus: '' });
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  <i className="fas fa-times mr-2"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          <DataTable
            columns={columns}
            data={administradoras}
            loading={loading}
            emptyMessage="No se encontraron administradoras"
          />

          {pagination.totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="text-muted">
                  Mostrando {administradoras.length} de {pagination.total} administradoras
                </div>
              </div>
              <div className="col-md-6">
                <nav>
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Anterior
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                      ) {
                        return (
                          <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                        return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                      }
                      return null;
                    })}
                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
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

export default AdministradorasPage;
