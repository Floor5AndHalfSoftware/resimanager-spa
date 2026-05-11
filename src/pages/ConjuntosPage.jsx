import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';
import { getConjuntos, deleteConjunto } from '../services/api';
import { showToast } from '../components/common/Toast';

const ConjuntosPage = () => {
  const navigate = useNavigate();

  const [conjuntos, setConjuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', estatus: '' });

  useEffect(() => {
    loadConjuntos();
  }, [pagination.page, filters]);

  const loadConjuntos = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.estatus) params.estatus = filters.estatus;

      const response = await getConjuntos(params);
      setConjuntos(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.limit)
      }));
    } catch (error) {
      showToast(error.message || 'Error al cargar conjuntos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Inactivar este conjunto?')) return;
    try {
      await deleteConjunto(id);
      showToast('Conjunto inactivado correctamente', 'success');
      loadConjuntos();
    } catch (err) {
      showToast(err.message || 'Error al inactivar conjunto', 'error');
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
      render: (value, conj) => (
        <div>
          <strong>{conj.nombre}</strong>
          {conj.documento && <div className="text-muted small">{conj.documento}</div>}
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
      render: (value, conj) => (
        <span className={`badge ${conj.estatus === 'A' ? 'badge-success' : 'badge-danger'}`}>
          {conj.estatus === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '180px',
      align: 'center',
      render: (value, conj) => (
        <div className="btn-group">
          <button className="btn btn-sm btn-info" title="Editar"
            onClick={() => navigate(`/dashboard/conjuntos/${conj.id}/editar`)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-success" title="Ver usuarios"
            onClick={() => navigate(`/dashboard/conjuntos/${conj.id}/usuarios`)}>
            <i className="fas fa-users"></i>
          </button>
          <button className="btn btn-sm btn-danger" title="Inactivar"
            onClick={() => handleDelete(conj.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <PageLayout title="Conjuntos Residenciales" subtitle="Listado de conjuntos registrados">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-home mr-2"></i>
                Lista de Conjuntos
              </h3>
            </div>
            <div className="col-md-6 text-right">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/conjuntos/nuevo')}>
                <i className="fas fa-plus mr-1"></i>
                Nuevo Conjunto
              </button>
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
            data={conjuntos}
            loading={loading}
            emptyMessage="No se encontraron conjuntos"
          />

          {pagination.totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="text-muted">
                  Mostrando {conjuntos.length} de {pagination.total} conjuntos
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

export default ConjuntosPage;
