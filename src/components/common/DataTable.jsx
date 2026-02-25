import React from 'react';

/**
 * Reusable data table component with AdminLTE styling
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions: [{ key, label, render }]
 * @param {Array} props.data - Array of data objects
 * @param {Function} props.onRowClick - Optional callback when row is clicked
 * @param {Function} props.renderActions - Optional function to render action buttons
 * @param {boolean} props.loading - Show loading state
 * @param {string} props.error - Error message to display
 */
const DataTable = ({ 
    columns = [], 
    data = [], 
    onRowClick, 
    renderActions,
    loading = false,
    error = null
}) => {
    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
                <p className="text-muted mt-2">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <i className="icon fas fa-ban"></i> Error: {error}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="alert alert-info">
                <i className="icon fas fa-info"></i> No hay registros para mostrar.
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                        {renderActions && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr 
                            key={row.id || rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            style={onRowClick ? { cursor: 'pointer' } : {}}
                        >
                            {columns.map(col => (
                                <td key={col.key}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {renderActions && (
                                <td onClick={(e) => e.stopPropagation()}>
                                    {renderActions(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
