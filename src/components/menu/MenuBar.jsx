import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MenuBar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const { logout, activeContext, contextosDisponibles } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const handleChangeContext = (e) => {
        e.preventDefault();
        navigate('/select-context');
    };

    const handleLinkClick = (e) => {
        e.preventDefault();
        // Funcionalidad pendiente
    };

    // Mostrar información del contexto activo
    const getContextInfo = () => {
        if (!activeContext) return 'Sin contexto';
        const tipo = activeContext.tipo === 'ADMINISTRADORA' ? 'Admin' : 'Conjunto';
        return `${tipo}: ${activeContext.entidadNombre}`;
    };

    // Mostrar si hay múltiples contextos disponibles
    const hasMultipleContexts = contextosDisponibles && contextosDisponibles.length > 1;

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" onClick={toggleSidebar} href="#" role="button">
                        <i className="fas fa-bars"></i>
                    </a>
                </li>
            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto">
                {/* Current Context Display */}
                {activeContext && (
                    <li className="nav-item d-none d-md-inline-block">
                        <span className="nav-link text-muted">
                            <i className="fas fa-briefcase mr-1"></i>
                            <small>{getContextInfo()}</small>
                        </span>
                    </li>
                )}

                {/* Change Context Button - Only show if multiple contexts available */}
                {hasMultipleContexts && (
                    <li className="nav-item">
                        <a 
                            className="nav-link" 
                            href="#" 
                            onClick={handleChangeContext}
                            title="Cambiar contexto de trabajo"
                        >
                            <i className="fas fa-exchange-alt"></i>
                        </a>
                    </li>
                )}

                {/* Navbar Search */}
                <li className="nav-item">
                    <a className="nav-link" href="#" role="button" onClick={handleLinkClick}>
                        <i className="fas fa-search"></i>
                    </a>
                </li>

                {/* Messages Dropdown Menu */}
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLinkClick}>
                        <i className="far fa-comments"></i>
                        <span className="badge badge-danger navbar-badge">3</span>
                    </a>
                </li>

                {/* Notifications Dropdown Menu */}
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLinkClick}>
                        <i className="far fa-bell"></i>
                        <span className="badge badge-warning navbar-badge">15</span>
                    </a>
                </li>

                {/* Logout */}
                <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLogout} title="Cerrar sesión">
                        <i className="fas fa-sign-out-alt"></i>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default MenuBar;
