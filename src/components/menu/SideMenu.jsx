import React, { useState } from 'react';
import useMenuData from '../../hooks/useMenuData';
import { useAuth } from '../../context/AuthContext';

const SideMenu = () => {
    const { menuData, loading, error } = useMenuData();
    const { user } = useAuth();
    const [openMenus, setOpenMenus] = useState({});

    const handleMenuClick = (menuId) => {
        setOpenMenus(prevState => ({
            ...prevState,
            [menuId]: !prevState[menuId]
        }));
    };

    const renderMenuItems = (menuItems) => {
        return menuItems.map(item => {
            const hasSubItems = item.submenus && item.submenus.length > 0;
            const isOpen = openMenus[item.itemId];

            return (
                <li key={item.itemId} className={`nav-item ${isOpen ? 'menu-open' : ''}`}>
                    <a href="#" className={`nav-link ${isOpen ? 'active' : ''}`} onClick={(e) => {
                        if (hasSubItems) {
                            e.preventDefault();
                            handleMenuClick(item.itemId);
                        }
                    }}>
                        <i className={`nav-icon fas ${item.icon || 'fa-circle'}`}></i>
                        <p>
                            {item.nombre}
                            {hasSubItems && (
                                <i className="right fas fa-angle-left"></i>
                            )}
                        </p>
                    </a>
                    {hasSubItems && (
                        <ul className="nav nav-treeview" style={{ display: isOpen ? 'block' : 'none', paddingLeft: '1rem' }}>
                            {renderMenuItems(item.submenus)}
                        </ul>
                    )}
                </li>
            );
        });
    };

    if (loading) return <div className="preloader">Cargando menú...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <a href="/dashboard" className="brand-link">
                <svg className="brand-image img-circle elevation-3" style={{opacity: .8, width: '33px', height: '33px', marginLeft: '0.8rem'}} viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7V8.3l7-3.11 7 3.11V13c0 4-3 7-7 7z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="brand-text font-weight-light">DAAT</span>
            </a>

            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <svg className="img-circle elevation-2" style={{width: '34px', height: '34px', backgroundColor: '#fff', padding: '2px', borderRadius: '50%'}} viewBox="0 0 24 24" fill="#6c757d">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{user?.nombre || user?.usuario || 'Usuario'}</a>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        {menuData && renderMenuItems(menuData)}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default SideMenu;
