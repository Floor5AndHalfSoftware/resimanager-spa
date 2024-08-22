import React, { useState } from "react";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";
import Content from "../components/content/Content.jsx";

function DashboardPage() {
    return (
        <div className="dashboard">
            <MenuBar/>
            <Content />
        </div>
    );
}

export default DashboardPage;
