import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";

function DashboardPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // AdminLTE requiere clases específicas en el body
    useEffect(() => {
        // Añadir clases base de AdminLTE al body
        document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed');
        
        // Cleanup al desmontar
        return () => {
            document.body.classList.remove('hold-transition', 'sidebar-mini', 'layout-fixed', 'sidebar-collapse');
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
            <Outlet />
            <footer className="main-footer">
                <strong>ResiManager</strong> &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}

export default DashboardPage;
