import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartPie, faUser, faCog, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './SideMenu.css';

const SideMenu = ({ isOpen, setIsMenuOpen }) => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    const handleMenuClick = (menuToggleFunc) => {
        if (isOpen) {
            menuToggleFunc();
        }
    };

    return (
        <div
            className={`side-menu ${isOpen ? 'open' : 'collapsed'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ul>
                <li>
                    <div className="menu-item" onClick={() => handleMenuClick(() => setIsDashboardOpen(!isDashboardOpen))}>
                        <FontAwesomeIcon icon={faChartPie} />
                        <span className="menu-text">Dashboard</span>
                        <FontAwesomeIcon icon={isDashboardOpen ? faAngleUp : faAngleDown} className="dropdown-icon" />
                    </div>
                    {isDashboardOpen && isOpen && (
                        <ul className="submenu">
                            <li><a href="#">Dashboard v1</a></li>
                            <li><a href="#">Dashboard v2</a></li>
                            <li><a href="#">Dashboard v3</a></li>
                        </ul>
                    )}
                </li>
                <li>
                    <div className="menu-item" onClick={() => handleMenuClick(() => setIsUserOpen(!isUserOpen))}>
                        <FontAwesomeIcon icon={faUser} />
                        <span className="menu-text">User Management</span>
                        <FontAwesomeIcon icon={isUserOpen ? faAngleUp : faAngleDown} className="dropdown-icon" />
                    </div>
                    {isUserOpen && isOpen && (
                        <ul className="submenu">
                            <li><a href="#">Users</a></li>
                            <li><a href="#">Roles</a></li>
                            <li><a href="#">Permissions</a></li>
                        </ul>
                    )}
                </li>
                <li>
                    <a href="#" className="menu-item">
                        <FontAwesomeIcon icon={faCog} />
                        <span className="menu-text">Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default SideMenu;
