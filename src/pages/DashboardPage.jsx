import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "../components/menu/SideMenu.jsx";
import MenuBar from "../components/menu/MenuBar.jsx";

const MOBILE_QUERY = "(max-width: 767.98px)";

function DashboardPage() {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia(MOBILE_QUERY).matches
    );
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => !prev);
        }
    };

    // AdminLTE requiere clases específicas en el body
    useEffect(() => {
        // Añadir clases base de AdminLTE al body
        document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed');

        // Cleanup al desmontar
        return () => {
            document.body.classList.remove(
                'hold-transition',
                'sidebar-mini',
                'layout-fixed',
                'sidebar-collapse',
                'sidebar-open'
            );
        };
    }, []);

    // Detectar cambio entre mobile y desktop
    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const handleChange = (event) => setIsMobile(event.matches);

        if (mql.addEventListener) {
            mql.addEventListener('change', handleChange);
        } else {
            mql.addListener(handleChange);
        }

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handleChange);
            } else {
                mql.removeListener(handleChange);
            }
        };
    }, []);

    // En mobile AdminLTE abre el sidebar con `sidebar-open` en el body,
    // mientras que en desktop se colapsa con `sidebar-collapse`.
    useEffect(() => {
        if (isMobile) {
            document.body.classList.remove('sidebar-collapse');
            document.body.classList.toggle('sidebar-open', sidebarOpen);
        } else {
            document.body.classList.remove('sidebar-open');
            document.body.classList.toggle('sidebar-collapse', sidebarCollapsed);
        }
    }, [isMobile, sidebarOpen, sidebarCollapsed]);

    // Al cambiar de ruta, cerrar el sidebar en mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="wrapper">
            <MenuBar toggleSidebar={toggleSidebar}/>
            <SideMenu/>
            <div
                id="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
                role="button"
                aria-label="Cerrar menú"
            ></div>
            <Outlet />
            <footer className="main-footer">
                <strong>ResiManager</strong> &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}

export default DashboardPage;
