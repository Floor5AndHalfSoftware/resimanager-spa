import { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';
import { getPropiedades, deletePropiedad } from '../services/api';
import { showToast } from '../components/common/Toast';

const PropiedadesPage = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ search: '', estatus: '' });

  useEffect(() => {
    loadPropiedades();
  }, [pagination.page]);

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

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadPropiedades();
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
      width: '100px',
      align: 'center',
      render: (value, prop) => (
        <div className="btn-group">
          <button className="btn btn-sm btn-info" title="Ver"
            onClick={() => alert(`Ver propiedad: ${prop.ppNumero}`)}>
            <i className="fas fa-eye"></i>
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
    <PageLayout title="Gestión de Propiedades" breadcrumbs={[{ label: 'Propiedades' }]}>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lista de Propiedades</h3>
              <div className="card-tools">
                <div className="input-group input-group-sm" style={{ width: 300 }}>
                  <input type="text" className="form-control float-right"
                    placeholder="Buscar por número..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  <select className="form-control ml-2" style={{ width: 100 }}
                    value={filters.estatus}
                    onChange={(e) => handleFilterChange('estatus', e.target.value)}>
                    <option value="">Todos</option>
                    <option value="A">Activos</option>
                    <option value="I">Inactivos</option>
                  </select>
                  <div className="input-group-append ml-2">
                    <button type="button" className="btn btn-default" onClick={handleSearch}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <DataTable
                columns={columns}
                data={propiedades}
                loading={loading}
              />
            </div>
            {pagination.totalPages > 1 && (
              <div className="card-footer clearfix">
                <ul className="pagination pagination-sm m-0 float-right">
                  <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}>«</button>
                  </li>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p} className={`page-item ${p === pagination.page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPagination(prev => ({ ...prev, page: p }))}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}>»</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PropiedadesPage;
