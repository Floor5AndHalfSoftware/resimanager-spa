import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';
import { getPropiedades, deletePropiedad } from '../services/api';
import { showToast } from '../components/common/Toast';

const PropiedadesPage = () => {
  const navigate = useNavigate();

  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', estatus: '' });

  useEffect(() => {
    loadPropiedades();
  }, [pagination.page, filters]);

  const loadPropiedades = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (filters.search) params.search = filters.search;
      if (filters.estatus) params.estatus = filters.estatus;

      const response = await getPropiedades(params);
      setPropiedades(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.limit)
      }));
    } catch (error) {
      showToast(error.message || 'Error al cargar propiedades', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Inactivar esta propiedad?')) return;
    try {
      await deletePropiedad(id);
      showToast('Propiedad inactivada correctamente', 'success');
      loadPropiedades();
    } catch (err) {
      showToast(err.message || 'Error al inactivar propiedad', 'error');
    }
  };

  const columns = [
    { key: 'ppid', label: 'ID', width: '70px' },
    {
      key: 'ppNumero',
      label: 'Número',
      render: (value, prop) => (
        <div>
          <strong>{prop.ppNumero}</strong>
          {prop.conjuntoNombre && <div className="text-muted small">{prop.conjuntoNombre}</div>}
        </div>
      )
    },
    { key: 'ppCantidad', label: 'Cantidad' },
    { key: 'ppCoefParticipacion', label: 'Coef. Participación' },
    {
      key: 'estatus',
      label: 'Estado',
      width: '90px',
      align: 'center',
      render: (value) => (
        <span className={`badge ${value === 'A' ? 'badge-success' : 'badge-danger'}`}>
          {value === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      width: '140px',
      align: 'center',
      render: (value, prop) => (
        <div className="btn-group">
          <button className="btn btn-sm btn-info" title="Editar"
            onClick={() => navigate(`/dashboard/propiedades/${prop.ppid}/editar`)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm btn-danger" title="Inactivar"
            onClick={() => handleDelete(prop.ppid)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <PageLayout title="Gestión de Propiedades" subtitle="Listado de propiedades registradas">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h3 className="card-title">
                <i className="fas fa-building mr-2"></i>
                Lista de Propiedades
              </h3>
            </div>
            <div className="col-md-6 text-right">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/propiedades/nuevo')}>
                <i className="fas fa-plus mr-1"></i>
                Nueva Propiedad
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); }} className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <div className="input-group">
                  <input type="text" className="form-control"
                    placeholder="Buscar por número..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-control" value={filters.estatus}
                  onChange={(e) => handleFilterChange('estatus', e.target.value)}>
                  <option value="">Todos los estados</option>
                  <option value="A">Activos</option>
                  <option value="I">Inactivos</option>
                </select>
              </div>
              <div className="col-md-3">
                <button type="button" className="btn btn-secondary btn-block"
                  onClick={() => { setFilters({ search: '', estatus: '' }); setPagination(prev => ({ ...prev, page: 1 })); }}>
                  <i className="fas fa-times mr-2"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          <DataTable columns={columns} data={propiedades} loading={loading}
            emptyMessage="No se encontraron propiedades" />

          {pagination.totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="text-muted">
                  Mostrando {propiedades.length} de {pagination.total} propiedades
                </div>
              </div>
              <div className="col-md-6">
                <nav>
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}>Anterior</button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const p = idx + 1;
                      if (p === 1 || p === pagination.totalPages || (p >= pagination.page - 1 && p <= pagination.page + 1)) {
                        return (
                          <li key={p} className={`page-item ${pagination.page === p ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPagination(prev => ({ ...prev, page: p }))}>{p}</button>
                          </li>
                        );
                      } else if (p === pagination.page - 2 || p === pagination.page + 2) {
                        return <li key={p} className="page-item disabled"><span className="page-link">...</span></li>;
                      }
                      return null;
                    })}
                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button className="page-link"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}>Siguiente</button>
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

export default PropiedadesPage;
