import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable page layout wrapper component
 * Provides consistent header and breadcrumb structure
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {Array} props.breadcrumbs - Breadcrumb items: [{ label, path }]
 * @param {React.Node} props.headerActions - Optional actions for the header (buttons, etc.)
 * @param {React.Node} props.children - Page content
 */
const PageLayout = ({ title, breadcrumbs = [], headerActions, children }) => {
    return (
        <div className="content-wrapper">
            {/* Content Header */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">{title}</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard">Home</Link>
                                </li>
                                {breadcrumbs.map((crumb, index) => (
                                    <li 
                                        key={index}
                                        className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                                    >
                                        {crumb.path ? (
                                            <Link to={crumb.path}>{crumb.label}</Link>
                                        ) : (
                                            crumb.label
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    {headerActions && (
                        <div className="row">
                            <div className="col-12">
                                {headerActions}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    {children}
                </div>
            </section>
        </div>
    );
};

export default PageLayout;
