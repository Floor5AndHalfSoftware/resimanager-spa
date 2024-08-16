import React from 'react';
import './Header.css';
import MenuBar from "../menu/MenuBar.jsx";

const Header = () => {
    return (
        <div>
            <header className="header">
                <MenuBar/>
            </header>
        </div>
    );
};

export default Header;
