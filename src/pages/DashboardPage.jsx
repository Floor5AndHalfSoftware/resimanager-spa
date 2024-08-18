import React, { useState } from "react";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";
import Content from "../components/content/Content.jsx";

function DashboardPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="dashboard">
            <MenuBar />
            <SideMenu isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Content />
        </div>
    );
}

export default DashboardPage;
