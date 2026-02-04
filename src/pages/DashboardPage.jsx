import React, { useState, useEffect } from "react";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";
import Content from "../components/content/Content.jsx";

function DashboardPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // AdminLTE requiere clases específicas en el body
    useEffect(() => {
        // Añadir clases base de AdminLTE al body
        document.body.classList.add('hold-transition', 'sidebar-mini');
        
        // Cleanup al desmontar
        return () => {
            document.body.classList.remove('hold-transition', 'sidebar-mini', 'sidebar-collapse');
        };
    }, []);

    // Manejar el colapso del sidebar
    useEffect(() => {
        if (sidebarCollapsed) {
            document.body.classList.add('sidebar-collapse');
        } else {
            document.body.classList.remove('sidebar-collapse');
        }
    }, [sidebarCollapsed]);

    return (
        <div className="wrapper">
            <MenuBar toggleSidebar={toggleSidebar}/>
            <SideMenu/>
            <Content />
        </div>
    );
}

export default DashboardPage;
