import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";
import { getMessages } from "../services/contactService";
import { getRole } from "../services/authService";
import { getParcoursStatistics } from "../services/parcoursService";

import StatCard from "../components/admin/StatCard";
import RecentMessages from "../components/admin/RecentMessages";

import "../styles/AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();


    /* =========================================================
       ÉTATS
    ========================================================= */

    const [projects, setProjects] = useState([]);

    const [messages, setMessages] = useState([]);

    const [parcoursStatistics, setParcoursStatistics] = useState({
        total: 0,
        actifs: 0,
        inactifs: 0,
        technologies: 0,
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================================
       CHARGEMENT DU DASHBOARD
    ========================================================= */

    const loadDashboard = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const [
                projectsData,
                messagesData,
                parcoursStatisticsData,
            ] = await Promise.all([
                getProjects(),
                getMessages(),
                getParcoursStatistics(),
            ]);


            /* =====================================================
               PROJETS
            ===================================================== */

            setProjects(
                Array.isArray(projectsData)
                    ? projectsData
                    : []
            );


            /* =====================================================
               MESSAGES

               On conserve TOUS les messages ici.

               Le filtrage des messages non lus est effectué
               uniquement pour l'affichage de la section
               "Messages récents".
            ===================================================== */

            setMessages(
                Array.isArray(messagesData)
                    ? messagesData
                    : []
            );


            /* =====================================================
               STATISTIQUES PARCOURS
            ===================================================== */

            setParcoursStatistics(
                parcoursStatisticsData &&
                typeof parcoursStatisticsData === "object"
                    ? {
                        total:
                            Number(
                                parcoursStatisticsData.total
                            ) || 0,

                        actifs:
                            Number(
                                parcoursStatisticsData.actifs
                            ) || 0,

                        inactifs:
                            Number(
                                parcoursStatisticsData.inactifs
                            ) || 0,

                        technologies:
                            Number(
                                parcoursStatisticsData.technologies
                            ) || 0,
                    }
                    : {
                        total: 0,
                        actifs: 0,
                        inactifs: 0,
                        technologies: 0,
                    }
            );

        } catch (err) {

            console.error(
                "Erreur lors du chargement du tableau de bord :",
                err
            );


            const errorText =
                err?.message?.toLowerCase() || "";


            /* =====================================================
               SESSION / AUTHENTIFICATION
            ===================================================== */

            if (
                errorText.includes("administrateur") ||
                errorText.includes("connecté") ||
                errorText.includes("connecte") ||
                errorText.includes("unauthorized") ||
                errorText.includes("forbidden") ||
                errorText.includes("session") ||
                errorText.includes("token")
            ) {

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                return;
            }


            /* =====================================================
               ERREUR GÉNÉRALE
            ===================================================== */

            setError(
                err?.message ||
                "Impossible de charger les données du tableau de bord."
            );

        } finally {

            setLoading(false);

        }

    }, [navigate]);


    /* =========================================================
       INITIALISATION
    ========================================================= */

    useEffect(() => {

        let cancelled = false;


        const initializeDashboard = async () => {

            const role = getRole();


            /* =====================================================
               VÉRIFICATION DU RÔLE
            ===================================================== */

            if (role !== "ADMIN") {

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                return;
            }


            if (cancelled) {
                return;
            }


            await loadDashboard();

        };


        initializeDashboard();


        return () => {

            cancelled = true;

        };

    }, [
        navigate,
        loadDashboard,
    ]);


    /* =========================================================
       MESSAGES NON LUS

       Cette liste sert :

       1. au compteur "Non lus"
       2. à la section "Messages récents"

       Un message lu disparaît donc automatiquement de cette
       section après actualisation des données.
    ========================================================= */

    const unreadMessages = useMemo(() => {

        return messages.filter(
            (message) =>
                !message.lu
        );

    }, [messages]);


    /* =========================================================
       NOMBRE TOTAL DE MESSAGES
    ========================================================= */

    const totalMessages = useMemo(() => {

        return messages.length;

    }, [messages]);


    /* =========================================================
       NOMBRE TOTAL DE PROJETS
    ========================================================= */

    const totalProjects = useMemo(() => {

        return projects.length;

    }, [projects]);


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const handleProjects = () => {

        navigate(
            "/admin/projets"
        );

    };


    const handleParcours = () => {

        navigate(
            "/admin/parcours"
        );

    };


    const handleSkills = () => {

        navigate(
            "/admin/competences"
        );

    };


    const handleMessages = () => {

        navigate(
            "/admin/messages"
        );

    };


    const handleSettings = () => {

        navigate(
            "/admin/parametres"
        );

    };


    /* =========================================================
       RENDU
    ========================================================= */

    return (

        <div className="admin-dashboard">


            {/* =====================================================
                EN-TÊTE
            ===================================================== */}

            <header className="admin-dashboard-header">

                <div>

                    <span className="admin-dashboard-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Tableau de bord
                    </h1>

                    <p>
                        Gérez votre portfolio et consultez
                        les dernières activités.
                    </p>

                </div>


                <div className="admin-api-status">

                    <span>
                        API connectée
                    </span>

                </div>

            </header>


            {/* =====================================================
                ERREUR
            ===================================================== */}

            {error && (

                <div
                    className="admin-alert admin-alert-error"
                    role="alert"
                >

                    <span
                        className="admin-alert-icon"
                        aria-hidden="true"
                    >
                        !
                    </span>


                    <div>

                        <strong>
                            Impossible de charger le dashboard
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Réessayer
                    </button>

                </div>

            )}


            {/* =====================================================
                STATISTIQUES
            ===================================================== */}

            <section
                className="admin-stats-grid"
                aria-label="Statistiques"
            >


                {/* =================================================
                    PROJETS
                ================================================= */}

                <StatCard
                    label="Projets"
                    value={
                        loading
                            ? "—"
                            : totalProjects
                    }
                    description="Projets enregistrés"
                    icon="▣"
                    onClick={handleProjects}
                />


                {/* =================================================
                    PARCOURS
                ================================================= */}

                <StatCard
                    label="Parcours"
                    value={
                        loading
                            ? "—"
                            : parcoursStatistics.total
                    }
                    description="Étapes du parcours"
                    icon="◎"
                    variant="parcours"
                    onClick={handleParcours}
                />


                {/* =================================================
                    MESSAGES
                ================================================= */}

                <StatCard
                    label="Messages"
                    value={
                        loading
                            ? "—"
                            : totalMessages
                    }
                    description="Messages reçus"
                    icon="✉"
                    onClick={handleMessages}
                />


                {/* =================================================
                    NON LUS
                ================================================= */}

                <StatCard
                    label="Non lus"
                    value={
                        loading
                            ? "—"
                            : unreadMessages.length
                    }
                    description="Messages à consulter"
                    icon="●"
                    variant="unread"
                    onClick={handleMessages}
                />

            </section>


            {/* =====================================================
                CONTENU PRINCIPAL
            ===================================================== */}

            <section className="admin-dashboard-content">


                {/* =================================================
                    MESSAGES RÉCENTS

                    IMPORTANT :
                    On envoie uniquement les messages non lus.

                    Lorsqu'un message devient lu, il disparaît
                    de cette section.
                ================================================= */}

                <RecentMessages
                    messages={unreadMessages}
                    loading={loading}
                    limit={5}
                />


                {/* =================================================
                    ACTIONS RAPIDES
                ================================================= */}

                <article className="admin-panel admin-quick-panel">


                    <div className="admin-panel-header">

                        <div>

                            <span className="admin-panel-eyebrow">
                                ACTIONS
                            </span>

                            <h2>
                                Accès rapides
                            </h2>

                        </div>

                    </div>


                    <div className="admin-quick-actions">


                        {/* =================================================
                            PROJETS
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleProjects}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ▣
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Gérer les projets
                                </strong>

                                <small>
                                    {loading
                                        ? "Chargement..."
                                        : `${totalProjects} projet${
                                            totalProjects > 1
                                                ? "s"
                                                : ""
                                        }`
                                    }
                                </small>

                            </span>


                            <span
                                className="admin-quick-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        {/* =================================================
                            PARCOURS
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleParcours}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ◎
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Gérer le parcours
                                </strong>

                                <small>
                                    {loading
                                        ? "Chargement..."
                                        : `${parcoursStatistics.total} étape${
                                            parcoursStatistics.total > 1
                                                ? "s"
                                                : ""
                                        }`
                                    }
                                </small>

                            </span>


                            <span
                                className="admin-quick-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        {/* =================================================
                            COMPÉTENCES
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleSkills}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ◆
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Gérer les compétences
                                </strong>

                                <small>
                                    Gérer vos compétences et technologies
                                </small>

                            </span>


                            <span
                                className="admin-quick-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleMessages}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ✉
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Consulter les messages
                                </strong>

                                <small>

                                    {loading
                                        ? "Chargement..."
                                        : unreadMessages.length > 0
                                            ? `${unreadMessages.length} non lu${
                                                unreadMessages.length > 1
                                                    ? "s"
                                                    : ""
                                            }`
                                            : "Aucun message non lu"
                                    }

                                </small>

                            </span>


                            <span
                                className="admin-quick-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>


                        {/* =================================================
                            PARAMÈTRES
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleSettings}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ⚙
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Paramètres
                                </strong>

                                <small>
                                    Configuration du portfolio
                                </small>

                            </span>


                            <span
                                className="admin-quick-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>

                    </div>

                </article>

            </section>


            {/* =====================================================
                ÉTAT DU PARCOURS
            ===================================================== */}

            <section className="admin-dashboard-summary">

                <article className="admin-panel admin-summary-panel">


                    <div className="admin-panel-header">

                        <div>

                            <span className="admin-panel-eyebrow">
                                PARCOURS
                            </span>

                            <h2>
                                État du parcours
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="admin-panel-link"
                            onClick={handleParcours}
                        >

                            <span>
                                Gérer
                            </span>

                            <span
                                className="admin-panel-link-arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>

                    </div>


                    <div className="admin-summary-grid">


                        {/* =================================================
                            TOTAL
                        ================================================= */}

                        <div className="admin-summary-item">

                            <span>
                                Total
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : parcoursStatistics.total
                                }
                            </strong>

                        </div>


                        {/* =================================================
                            ACTIFS
                        ================================================= */}

                        <div className="admin-summary-item">

                            <span>
                                Actifs
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : parcoursStatistics.actifs
                                }
                            </strong>

                        </div>


                        {/* =================================================
                            INACTIFS
                        ================================================= */}

                        <div className="admin-summary-item">

                            <span>
                                Inactifs
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : parcoursStatistics.inactifs
                                }
                            </strong>

                        </div>


                        {/* =================================================
                            TECHNOLOGIES
                        ================================================= */}

                        <div className="admin-summary-item">

                            <span>
                                Technologies
                            </span>

                            <strong>
                                {loading
                                    ? "—"
                                    : parcoursStatistics.technologies
                                }
                            </strong>

                        </div>

                    </div>

                </article>

            </section>


            {/* =====================================================
                PIED DE PAGE
            ===================================================== */}

            <footer className="admin-dashboard-footer">

                <span>
                    Portfolio connecté au backend Spring Boot
                </span>

                <span>
                    •
                </span>

                <span>
                    Données synchronisées depuis l'API
                </span>

            </footer>

        </div>

    );
}


export default AdminDashboard;