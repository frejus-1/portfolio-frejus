import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

import "../../styles/AdminHeader.css";

function AdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const pageTitles = {
        "/admin": {
            title: "Tableau de bord",
            description: "Vue d'ensemble de votre portfolio.",
        },
        "/admin/projets": {
            title: "Projets",
            description: "Gérez les projets présentés sur votre portfolio.",
        },
        "/admin/messages": {
            title: "Messages",
            description: "Gérez les messages reçus depuis le formulaire de contact.",
        },
        "/admin/parametres": {
            title: "Paramètres",
            description: "Configurez les paramètres de votre administration.",
        },
        "/admin/competences": {
            title: "Compétences",
            description: "Gérez les compétences et technologies présentées sur votre portfolio.",
        },
        "/admin/parcours": {
            title: "Parcours",
            description: "Gérez les parcours présentées sur votre portfolio.",
        },
    };

    const currentPage =
        pageTitles[location.pathname] || {
            title: "Administration",
            description: "Gestion de votre portfolio.",
        };

    const handleLogout = () => {
        logout();
        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="admin-header">

            <div className="admin-header-content">

                <div className="admin-header-title">

                    <span className="admin-header-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        {currentPage.title}
                    </h1>

                    <p>
                        {currentPage.description}
                    </p>

                </div>

                <div className="admin-header-actions">

                    <button
                        type="button"
                        className="admin-header-portfolio"
                        onClick={() => navigate("/")}
                    >
                        <span>↗</span>
                        Voir le portfolio
                    </button>

                    <button
                        type="button"
                        className="admin-header-logout"
                        onClick={handleLogout}
                        title="Déconnexion"
                        aria-label="Déconnexion"
                    >
                        ↪
                    </button>

                </div>

            </div>

        </header>
    );
}

export default AdminHeader;