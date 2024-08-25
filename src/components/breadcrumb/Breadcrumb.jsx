import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x).filter((x) => x !== 'resimanager');

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/resimanager/dashboard">Home</Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `resimanager/${pathnames.slice(0, index + 1).join('/')}`;

                    return (
                        <li key={to} className={`breadcrumb-item ${index === pathnames.length - 1 ? 'active' : ''}`}>
                            {index === pathnames.length - 1 ? (
                                value.charAt(0).toUpperCase() + value.slice(1)
                            ) : (
                                <Link to={to}>{value.charAt(0).toUpperCase() + value.slice(1)}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
