import React from "react";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";
import Content from "../components/content/Content.jsx";

import "./DashboardPage.css";
function DashboardPage() {
    return (
        <div className="dashboard">
            <MenuBar/>
            <SideMenu/>
            <Content/>
        </div>
    );
}

export default DashboardPage;
