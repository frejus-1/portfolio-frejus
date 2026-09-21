import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { logout } from "../../services/authService";

import "../../styles/AdminSidebar.css";


function AdminSidebar() {

    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] =
        useState(false);


    /*
     * ==========================================
     * NAVIGATION
     * ==========================================
     */

    const navigationItems = [
        {
            label: "Tableau de bord",
            path: "/admin",
            icon: "⌂",
            end: true,
        },
        {
            label: "Projets",
            path: "/admin/projets",
            icon: "▣",
        },
        {
            label: "Parcours",
            path: "/admin/parcours",
            icon: "◈",
        },
        {
            label: "Compétences",
            path: "/admin/competences",
            icon: "◆",
        },
        {
            label: "Messages",
            path: "/admin/messages",
            icon: "✉",
        },
    ];


    /*
     * ==========================================
     * DÉCONNEXION
     * ==========================================
     */

    const handleLogout = () => {

        logout();

        navigate("/login", {
            replace: true,
        });
    };


    /*
     * ==========================================
     * FERMER LE MENU MOBILE
     * ==========================================
     */

    const handleNavigation = () => {
        setMobileOpen(false);
    };


    return (
        <>
            {/* =================================
                BOUTON MENU MOBILE
            ================================== */}

            <button
                type="button"
                className="admin-mobile-menu-button"
                onClick={() =>
                    setMobileOpen(!mobileOpen)
                }
                aria-label={
                    mobileOpen
                        ? "Fermer le menu"
                        : "Ouvrir le menu"
                }
                aria-expanded={mobileOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>


            {/* =================================
                OVERLAY MOBILE
            ================================== */}

            {mobileOpen && (
                <button
                    type="button"
                    className="admin-sidebar-overlay"
                    onClick={() =>
                        setMobileOpen(false)
                    }
                    aria-label="Fermer le menu"
                />
            )}


            {/* =================================
                SIDEBAR
            ================================== */}

            <aside
                className={`admin-sidebar ${mobileOpen
                        ? "admin-sidebar-open"
                        : ""
                    }`}
            >

                {/* =================================
                    LOGO
                ================================== */}

                <div className="admin-sidebar-logo">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin")
                        }
                        className="admin-logo-button"
                    >

                        <span className="admin-logo-mark">
                            F
                        </span>

                        <span className="admin-logo-text">
                            Fréjus
                        </span>

                    </button>

                </div>


                {/* =================================
                    IDENTIFICATION
                ================================== */}

                <div className="admin-sidebar-profile">

                    <div className="admin-profile-avatar">
                        F
                    </div>

                    <div className="admin-profile-info">

                        <strong>
                            Administrateur
                        </strong>

                        <span>
                            Portfolio
                        </span>

                    </div>

                </div>


                {/* =================================
                    NAVIGATION PRINCIPALE
                ================================== */}

                <nav
                    className="admin-sidebar-navigation"
                    aria-label="Navigation administration"
                >

                    <span className="admin-sidebar-section-title">
                        ADMINISTRATION
                    </span>

                    <div className="admin-sidebar-links">

                        {navigationItems.map(
                            (item) => (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={
                                        handleNavigation
                                    }
                                    className={({ isActive }) =>
                                        `admin-sidebar-link ${isActive
                                            ? "active"
                                            : ""
                                        }`
                                    }
                                >

                                    <span className="admin-sidebar-icon">
                                        {item.icon}
                                    </span>

                                    <span>
                                        {item.label}
                                    </span>

                                </NavLink>

                            )
                        )}

                    </div>


                    {/* =================================
                        AUTRES
                    ================================== */}

                    <span className="admin-sidebar-section-title admin-sidebar-section-secondary">
                        SYSTÈME
                    </span>

                    <div className="admin-sidebar-links">

                        <NavLink
                            to="/admin/parametres"
                            onClick={
                                handleNavigation
                            }
                            className={({ isActive }) =>
                                `admin-sidebar-link ${isActive
                                    ? "active"
                                    : ""
                                }`
                            }
                        >

                            <span className="admin-sidebar-icon">
                                ⚙
                            </span>

                            <span>
                                Paramètres
                            </span>

                        </NavLink>

                    </div>

                </nav>


                {/* =================================
                    BAS DE SIDEBAR
                ================================== */}

                <div className="admin-sidebar-footer">

                    <button
                        type="button"
                        className="admin-sidebar-logout"
                        onClick={handleLogout}
                    >

                        <span className="admin-sidebar-icon">
                            ↪
                        </span>

                        <span>
                            Déconnexion
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
}


export default AdminSidebar;