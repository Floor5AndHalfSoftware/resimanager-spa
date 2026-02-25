import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useMenuData from "../../hooks/useMenuData";
import { useAuth } from "../../context/AuthContext";

const SideMenu = () => {
  const { menuData, loading, error } = useMenuData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuClick = (menuId) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId],
    }));
  };

  // Generate path from menu item
  const getMenuPath = (item) => {
    if (!item) return "/dashboard";

    // If controlador and metodo are available, use them
    if (item.controlador && item.metodo) {
      const controller = item.controlador
        .toLowerCase()
        .replace("controller", "");
      const method = item.metodo.toLowerCase();
      return `/dashboard/${controller}/${method}`;
    }

    // Otherwise, create a simple path from the item name
    const safeName = item.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

    return `/dashboard/${safeName}`;
  };

  // Check if current path matches menu item
  const isActive = (item) => {
    const menuPath = getMenuPath(item);
    return location.pathname === menuPath;
  };

  // Map of icon colors for better visibility
  const iconColorMap = {
    "fa-tachometer-alt": "text-info",
    "fa-home": "text-success",
    "fa-building": "text-primary",
    "fa-users": "text-warning",
    "fa-user": "text-warning",
    "fa-user-tie": "text-info",
    "fa-file-invoice-dollar": "text-success",
    "fa-money-bill-wave": "text-success",
    "fa-chart-line": "text-info",
    "fa-cog": "text-secondary",
    "fa-wrench": "text-secondary",
    "fa-tools": "text-secondary",
    "fa-file-alt": "text-primary",
    "fa-clipboard-list": "text-info",
    "fa-exclamation-triangle": "text-danger",
    "fa-bell": "text-warning",
    "fa-envelope": "text-info",
    "fa-calendar": "text-primary",
    "fa-key": "text-warning",
    "fa-shield-alt": "text-danger",
    "fa-sitemap": "text-info",
    "fa-list": "text-secondary",
    "fa-bars": "text-secondary",
  };

  // Smart icon mapping based on item name/module/action
  const getIconForMenuItem = (item) => {
    if (item.icon) return item.icon;

    const nombre = (item.nombre || "").toLowerCase();
    const modulo = (item.modulo || "").toLowerCase();
    const accion = (item.accion || "").toLowerCase();
    const searchText = `${nombre} ${modulo} ${accion}`;

    // Dashboard
    if (
      searchText.includes("dashboard") ||
      searchText.includes("inicio") ||
      searchText.includes("principal")
    ) {
      return "fa-tachometer-alt";
    }

    // Properties/Buildings
    if (
      searchText.includes("propiedad") ||
      searchText.includes("inmueble") ||
      searchText.includes("unidad")
    ) {
      return "fa-building";
    }

    if (searchText.includes("conjunto") || searchText.includes("residencial")) {
      return "fa-home";
    }

    // Users/People
    if (searchText.includes("usuario") || searchText.includes("persona")) {
      return "fa-users";
    }

    if (
      searchText.includes("residente") ||
      searchText.includes("propietario")
    ) {
      return "fa-user";
    }

    if (
      searchText.includes("administrador") ||
      searchText.includes("empleado")
    ) {
      return "fa-user-tie";
    }

    // Finance
    if (
      searchText.includes("factura") ||
      searchText.includes("cobro") ||
      searchText.includes("pago")
    ) {
      return "fa-file-invoice-dollar";
    }

    if (searchText.includes("cuota") || searchText.includes("tarifa")) {
      return "fa-money-bill-wave";
    }

    // Reports
    if (
      searchText.includes("reporte") ||
      searchText.includes("informe") ||
      searchText.includes("estadística")
    ) {
      return "fa-chart-line";
    }

    // Settings/Config
    if (
      searchText.includes("configuraci") ||
      searchText.includes("ajuste") ||
      searchText.includes("parámetro")
    ) {
      return "fa-cog";
    }

    if (searchText.includes("perfil") || searchText.includes("rol")) {
      return "fa-user-shield";
    }

    // Documents
    if (searchText.includes("documento") || searchText.includes("archivo")) {
      return "fa-file-alt";
    }

    // Communications
    if (
      searchText.includes("mensaje") ||
      searchText.includes("notificaci") ||
      searchText.includes("aviso")
    ) {
      return "fa-bell";
    }

    if (searchText.includes("correo") || searchText.includes("email")) {
      return "fa-envelope";
    }

    // Maintenance
    if (
      searchText.includes("mantenimiento") ||
      searchText.includes("reparaci")
    ) {
      return "fa-tools";
    }

    if (searchText.includes("incidencia") || searchText.includes("problema")) {
      return "fa-exclamation-triangle";
    }

    // Calendar/Events
    if (
      searchText.includes("calendario") ||
      searchText.includes("evento") ||
      searchText.includes("reserva")
    ) {
      return "fa-calendar";
    }

    // Security
    if (searchText.includes("seguridad") || searchText.includes("acceso")) {
      return "fa-shield-alt";
    }

    // Menu/Catalog
    if (
      searchText.includes("menú") ||
      searchText.includes("catálogo") ||
      searchText.includes("maestro")
    ) {
      return "fa-sitemap";
    }

    if (searchText.includes("lista") || searchText.includes("listado")) {
      return "fa-list";
    }

    // Default icon
    return "fa-circle";
  };

  const getIconColor = (iconClass) => {
    if (!iconClass) return "";
    const iconName = iconClass.split(" ").find((cls) => cls.startsWith("fa-"));
    return iconColorMap[iconName] || "";
  };

  const renderMenuItems = (menuItems, isSubmenu = false) => {
    return menuItems.map((item) => {
      const hasSubItems = item.submenus && item.submenus.length > 0;
      const isOpen = openMenus[item.itemId];
      const itemIsActive = isActive(item);

      // Get icon for menu item
      const itemIcon = getIconForMenuItem(item);
      const iconColor = getIconColor(itemIcon);

      return (
        <li
          key={item.itemId}
          className={`nav-item ${hasSubItems && isOpen ? "menu-open" : ""}`}
        >
          <a
            href="#"
            className={`nav-link ${itemIsActive || isOpen ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              if (hasSubItems) {
                handleMenuClick(item.itemId);
              } else {
                // Navigate to the menu item path
                navigate(getMenuPath(item));
              }
            }}
          >
            {isSubmenu ? (
              <i className="far fa-circle nav-icon"></i>
            ) : (
              <i className={`nav-icon fas ${itemIcon} ${iconColor}`}></i>
            )}
            <p>
              {item.nombre}
              {hasSubItems && <i className="right fas fa-angle-left"></i>}
            </p>
          </a>
          {hasSubItems && (
            <ul className="nav nav-treeview">
              {renderMenuItems(item.submenus, true)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/dashboard" className="brand-link brand-link-large">
        <img
          src="/resimanager-logo.png"
          alt="ResiManager"
          className="brand-image brand-image-large elevation-3"
          style={{ opacity: 0.8 }}
        />
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <svg
              className="img-circle elevation-2"
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#fff",
                padding: "2px",
                borderRadius: "50%",
              }}
              viewBox="0 0 24 24"
              fill="#6c757d"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="info">
            <span className="d-block" style={{ color: "#c2c7d0" }}>
              {user?.nombre || user?.usuario || "Usuario"}
            </span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {loading && (
              <li className="nav-item">
                <span className="nav-link text-muted">
                  <i className="nav-icon fas fa-circle-notch fa-spin"></i>
                  <p>Cargando...</p>
                </span>
              </li>
            )}
            {error && (
              <li className="nav-item">
                <span className="nav-link text-danger">
                  <i className="nav-icon fas fa-exclamation-circle"></i>
                  <p>Error al cargar menú</p>
                </span>
              </li>
            )}
            {!loading && !error && menuData && renderMenuItems(menuData)}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;
