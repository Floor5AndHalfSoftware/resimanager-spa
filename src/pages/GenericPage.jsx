import React from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * Generic page component that can be used for any menu item route
 * This acts as a placeholder until specific pages are implemented
 */
const GenericPage = ({ title, breadcrumbs }) => {
    const params = useParams();
    const { controller, method } = params;

    // Generate a readable title from the URL
    const generateTitle = () => {
        if (title) return title;
        if (method) {
            return method
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        if (controller) {
            return controller
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return 'Página';
    };

    const pageTitle = generateTitle();

    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">{pageTitle}</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard">Home</Link>
                                </li>
                                {controller && (
                                    <li className="breadcrumb-item">
                                        {controller.charAt(0).toUpperCase() + controller.slice(1)}
                                    </li>
                                )}
                                <li className="breadcrumb-item active">{pageTitle}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">{pageTitle}</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-sm btn-primary">
                                            <i className="fas fa-plus"></i> Nuevo
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted">
                                        Esta página está en construcción.
                                    </p>
                                    <div className="alert alert-info">
                                        <h5><i className="icon fas fa-info"></i> Información de desarrollo</h5>
                                        <p><strong>Controlador:</strong> {controller || 'N/A'}</p>
                                        <p><strong>Método:</strong> {method || 'N/A'}</p>
                                        <p className="mb-0">
                                            Esta es una página genérica que se mostrará hasta que se implemente 
                                            el componente específico para esta funcionalidad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GenericPage;
