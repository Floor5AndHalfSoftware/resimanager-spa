import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import useMenuData from '../../hooks/useMenuData';

const SideMenu = ({ isOpen, setIsMenuOpen }) => {
    const { menuData, loading, error } = useMenuData();
    const [openMenus, setOpenMenus] = useState({});

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    const handleMenuClick = (menuId) => {
        setOpenMenus(prevState => ({
            ...prevState,
            [menuId]: !prevState[menuId]
        }));
    };

    const renderMenuItems = (menuItems) => {
        return menuItems.map(item => {
            const hasSubItems = item.submenus && item.submenus.length > 0;

            return (
                <li key={item.id}>
                    <div className="menu-item" onClick={() => hasSubItems && handleMenuClick(item.id)}>
                        <span className="menu-text">{item.nombre}</span>
                        {hasSubItems && (
                            <FontAwesomeIcon
                                icon={openMenus[item.id] ? faAngleUp : faAngleDown}
                                className="dropdown-icon"
                            />
                        )}
                    </div>
                    {hasSubItems && openMenus[item.id] && isOpen && (
                        <ul className="submenu">
                            {renderMenuItems(item.submenus)}
                        </ul>
                    )}
                </li>
            );
        });
    };

    if (loading) return <p>Cargando menú...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div
            className={`side-menu ${isOpen ? 'open' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ul>
                {menuData && renderMenuItems(menuData.menu)}
            </ul>
        </div>
    );
};

export default SideMenu;
