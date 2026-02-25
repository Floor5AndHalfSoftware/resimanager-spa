import React, { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';
import DataTable from '../components/common/DataTable';

/**
 * Example page showing how to implement a list view with data table
 * This demonstrates the pattern for creating real pages using reusable components
 */
const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call
        // In real implementation, replace with: fetch('/api/propiedades')
        const fetchProperties = async () => {
            try {
                setLoading(true);
                // Simulated data
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setProperties([
                    { id: 1, codigo: 'PROP-001', tipo: 'Apartamento', direccion: 'Calle 123 #45-67', area: 85, estado: 'Ocupado' },
                    { id: 2, codigo: 'PROP-002', tipo: 'Casa', direccion: 'Carrera 45 #23-45', area: 150, estado: 'Disponible' },
                    { id: 3, codigo: 'PROP-003', tipo: 'Apartamento', direccion: 'Avenida 7 #12-34', area: 95, estado: 'Ocupado' },
                    { id: 4, codigo: 'PROP-004', tipo: 'Local', direccion: 'Calle 89 #34-56', area: 120, estado: 'En Mantenimiento' },
                ]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Define table columns
    const columns = [
        { key: 'codigo', label: 'Código' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'area', label: 'Área (m²)' },
        { 
            key: 'estado', 
            label: 'Estado',
            render: (value) => (
                <span className={`badge ${
                    value === 'Ocupado' ? 'badge-success' :
                    value === 'Disponible' ? 'badge-primary' :
                    'badge-warning'
                }`}>
                    {value}
                </span>
            )
        },
    ];

    // Render action buttons for each row
    const renderActions = (row) => (
        <>
            <button 
                className="btn btn-sm btn-info mr-1" 
                title="Ver"
                onClick={() => alert(`Ver propiedad: ${row.codigo}`)}
            >
                <i className="fas fa-eye"></i>
            </button>
            <button 
                className="btn btn-sm btn-primary mr-1" 
                title="Editar"
                onClick={() => alert(`Editar propiedad: ${row.codigo}`)}
            >
                <i className="fas fa-edit"></i>
            </button>
            <button 
                className="btn btn-sm btn-danger" 
                title="Eliminar"
                onClick={() => {
                    if (window.confirm(`¿Eliminar la propiedad ${row.codigo}?`)) {
                        alert('Propiedad eliminada');
                    }
                }}
            >
                <i className="fas fa-trash"></i>
            </button>
        </>
    );

    return (
        <PageLayout 
            title="Gestión de Propiedades"
            breadcrumbs={[{ label: 'Propiedades' }]}
        >
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Lista de Propiedades</h3>
                            <div className="card-tools">
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => alert('Abrir formulario de nueva propiedad')}
                                >
                                    <i className="fas fa-plus"></i> Nueva Propiedad
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <DataTable
                                columns={columns}
                                data={properties}
                                renderActions={renderActions}
                                loading={loading}
                                error={error}
                            />
                        </div>
                        {!loading && !error && properties.length > 0 && (
                            <div className="card-footer clearfix">
                                <ul className="pagination pagination-sm m-0 float-right">
                                    <li className="page-item"><a className="page-link" href="#">«</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">»</a></li>
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
