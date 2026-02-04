import React from 'react';

const MenuBar = ({ toggleSidebar }) => {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" onClick={toggleSidebar} href="#" role="button">
                        <i className="fas fa-bars"></i>
                    </a>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <a href="/daat/dashboard" className="nav-link">Home</a>
                </li>
                <li className="nav-item d-none d-sm-inline-block">
                    <a href="#" className="nav-link">Contact</a>
                </li>
            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto">
                {/* Navbar Search */}
                <li className="nav-item">
                    <a className="nav-link" href="#" role="button">
                        <i className="fas fa-search"></i>
                    </a>
                </li>

                {/* Messages Dropdown Menu */}
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        <i className="far fa-comments"></i>
                        <span className="badge badge-danger navbar-badge">3</span>
                    </a>
                </li>

                {/* Notifications Dropdown Menu */}
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        <i className="far fa-bell"></i>
                        <span className="badge badge-warning navbar-badge">15</span>
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="/daat/login">
                        <i className="fas fa-sign-out-alt"></i>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default MenuBar;
