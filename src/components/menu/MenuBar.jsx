import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faComments, faBell, faExpandArrowsAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './MenuBar.css';

const MenuBar = () => {
    return (
        <div className="menu-bar">
            <div className="menu-bar-left">
                <nav className="nav-links">
                    <a href="/" className="icon">
                        <FontAwesomeIcon icon={faBars} />
                    </a>
                    <a href="/">Home</a>
                    <a href="/">Contact</a>
                </nav>
            </div>
            <div className="menu-bar-right">
                <nav className="nav-links">
                    <a href="/" className="icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </a>
                    <a href="/" className="icon">
                        <FontAwesomeIcon icon={faComments} />
                        {/*<span className="badge">3</span>*/}
                    </a>
                    <a href="/" className="icon">
                        <FontAwesomeIcon icon={faBell} />
                        {/*<span className="badge">15</span>*/}
                    </a>
                    <a href="/" className="icon">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </a>
                </nav>
            </div>
        </div>
    );
};

export default MenuBar;
