import React, { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';
import { getPropietarios, deletePropietario } from '../services/api';
import { showToast } from '../components/common/Toast';

const PropertiesPage = () => {
    const [propietarios, setPropietarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({ search: '', estatus: '' });

    const fetchPropietarios = async (page = 1) => {
        try {
            setLoading(true);
            const params = { page, limit: pagination.limit };
            if (filters.search) params.search = filters.search;
            if (filters.estatus) params.estatus = filters.estatus;

            const result = await getPropietarios(params);
            setPropietarios(result.data || []);
            setPagination(prev => ({ ...prev, page, total: result.total, totalPages: Math.ceil(result.total / pagination.limit) }));
            setLoading(false);
        } catch (err) {
            showToast(err.message || 'Error al cargar propietarios', 'error');
            setLoading(false);
        }
    };

    useEffect(() => { fetchPropietarios(); }, []);

    const handleSearch = () => fetchPropietarios(1);

    const handleDelete = async (conjId, perId) => {
        if (!window.confirm('¿Inactivar este propietario?')) return;
        try {
            await deletePropietario(conjId, perId);
            showToast('Propietario inactivado correctamente', 'success');
            fetchPropietarios(pagination.page);
        } catch (err) {
            showToast(err.message || 'Error al inactivar propietario', 'error');
        }
    };

    const columns = [
        { key: 'personaDocumento', label: 'Documento' },
        { key: 'personaNombre', label: 'Nombre' },
        { key: 'personaApellido', label: 'Apellido' },
        { key: 'propiedadNombre', label: 'Propiedad' },
        { key: 'fechaDesde', label: 'Desde' },
        { key: 'fechaHasta', label: 'Hasta' },
        {
            key: 'estatus',
            label: 'Estado',
            render: (value) => (
                <span className={`badge ${value === 'A' ? 'badge-success' : 'badge-secondary'}`}>
                    {value === 'A' ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
    ];

    const renderActions = (row) => (
        <>
            <button className="btn btn-sm btn-info mr-1" title="Ver"
                onClick={() => alert(`Ver propietario: ${row.personaNombre} ${row.personaApellido}`)}>
                <i className="fas fa-eye"></i>
            </button>
            <button className="btn btn-sm btn-danger" title="Inactivar"
                onClick={() => handleDelete(row.conjId, row.perId)}>
                <i className="fas fa-trash"></i>
            </button>
        </>
    );

    return (
        <PageLayout title="Gestión de Propietarios" breadcrumbs={[{ label: 'Propietarios' }]}>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Lista de Propietarios</h3>
                            <div className="card-tools">
                                <div className="input-group input-group-sm" style={{ width: 300 }}>
                                    <input type="text" className="form-control float-right"
                                        placeholder="Buscar por persona..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                                    <select className="form-control ml-2" style={{ width: 100 }}
                                        value={filters.estatus}
                                        onChange={(e) => setFilters(prev => ({ ...prev, estatus: e.target.value }))}>
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
                                data={propietarios}
                                renderActions={renderActions}
                                loading={loading}
                            />
                        </div>
                        {pagination.totalPages > 1 && (
                            <div className="card-footer clearfix">
                                <ul className="pagination pagination-sm m-0 float-right">
                                    <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => fetchPropietarios(pagination.page - 1)}>«</button>
                                    </li>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                                        <li key={p} className={`page-item ${p === pagination.page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => fetchPropietarios(p)}>{p}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => fetchPropietarios(pagination.page + 1)}>»</button>
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

export default PropertiesPage;
