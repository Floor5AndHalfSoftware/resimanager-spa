import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faComments, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SideMenu from './SideMenu';

const MenuBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <div className="menu-bar">
                <div className="menu-bar-left">
                    <nav className="nav-links">
                        <a href="#" className="icon" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </a>
                        <a href="/resimanager/dashboard">Dashboard</a>
                        <a href="#">Contact</a>
                    </nav>
                </div>
                <div className="menu-bar-right">
                    <nav className="nav-links">
                        <a href="#" className="icon">
                            <FontAwesomeIcon icon={faSearch} />
                        </a>
                        <a href="#" className="icon">
                            <FontAwesomeIcon icon={faComments} />
                        </a>
                        <a href="#" className="icon">
                            <FontAwesomeIcon icon={faBell} />
                        </a>
                        <a href="/resimanager" className="icon">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </a>
                    </nav>
                </div>
            </div>
            <SideMenu isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
    );
};

export default MenuBar;
