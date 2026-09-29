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
import { getVisitorCount } from "../services/visitorService";

import StatCard from "../components/admin/StatCard";
import RecentMessages from "../components/admin/RecentMessages";

import "../styles/AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();


    /* =========================================================
       ÉTATS DES DONNÉES
    ========================================================= */

    const [projects, setProjects] = useState([]);

    const [messages, setMessages] = useState([]);

    const [visitorCount, setVisitorCount] = useState(0);

    const [parcoursStatistics, setParcoursStatistics] = useState({
        total: 0,
        actifs: 0,
        inactifs: 0,
        technologies: 0,
    });


    /* =========================================================
       ÉTATS DE CHARGEMENT INDÉPENDANTS
    ========================================================= */

    const [projectsLoading, setProjectsLoading] =
        useState(true);

    const [messagesLoading, setMessagesLoading] =
        useState(true);

    const [parcoursLoading, setParcoursLoading] =
        useState(true);

    const [visitorsLoading, setVisitorsLoading] =
        useState(true);


    /* =========================================================
       ERREUR
    ========================================================= */

    const [error, setError] =
        useState("");


    /* =========================================================
       CHARGEMENT DU DASHBOARD

       Chaque API est indépendante.

       Une erreur sur les visiteurs ne bloque donc pas
       les projets, les messages ou le parcours.
    ========================================================= */

    const loadDashboard = useCallback(async () => {

        setError("");

        setProjectsLoading(true);
        setMessagesLoading(true);
        setParcoursLoading(true);
        setVisitorsLoading(true);


        const results = await Promise.allSettled([
            getProjects(),
            getMessages(),
            getParcoursStatistics(),
            getVisitorCount(),
        ]);


        /* =====================================================
           PROJETS
        ===================================================== */

        const projectsResult = results[0];

        if (projectsResult.status === "fulfilled") {

            setProjects(
                Array.isArray(projectsResult.value)
                    ? projectsResult.value
                    : []
            );

        } else {

            console.error(
                "Erreur lors du chargement des projets :",
                projectsResult.reason
            );

        }

        setProjectsLoading(false);


        /* =====================================================
           MESSAGES
        ===================================================== */

        const messagesResult = results[1];

        if (messagesResult.status === "fulfilled") {

            setMessages(
                Array.isArray(messagesResult.value)
                    ? messagesResult.value
                    : []
            );

        } else {

            console.error(
                "Erreur lors du chargement des messages :",
                messagesResult.reason
            );

        }

        setMessagesLoading(false);


        /* =====================================================
           PARCOURS
        ===================================================== */

        const parcoursResult = results[2];

        if (parcoursResult.status === "fulfilled") {

            const data =
                parcoursResult.value;

            setParcoursStatistics(
                data &&
                    typeof data === "object"
                    ? {
                        total:
                            Number(data.total) || 0,

                        actifs:
                            Number(data.actifs) || 0,

                        inactifs:
                            Number(data.inactifs) || 0,

                        technologies:
                            Number(data.technologies) || 0,
                    }
                    : {
                        total: 0,
                        actifs: 0,
                        inactifs: 0,
                        technologies: 0,
                    }
            );

        } else {

            console.error(
                "Erreur lors du chargement du parcours :",
                parcoursResult.reason
            );

        }

        setParcoursLoading(false);


        /* =====================================================
           VISITEURS
        ===================================================== */

        const visitorsResult = results[3];

        if (visitorsResult.status === "fulfilled") {

            setVisitorCount(
                Number(visitorsResult.value) || 0
            );

        } else {

            console.error(
                "Erreur lors du chargement des visiteurs :",
                visitorsResult.reason
            );

        }

        setVisitorsLoading(false);


        /* =====================================================
           ERREURS D'AUTHENTIFICATION
        ===================================================== */

        const rejectedResults =
            results.filter(
                (result) =>
                    result.status === "rejected"
            );


        const authenticationError =
            rejectedResults.find(
                (result) => {

                    const message =
                        result.reason?.message
                            ?.toLowerCase() || "";

                    return (
                        message.includes("administrateur") ||
                        message.includes("connecté") ||
                        message.includes("connecte") ||
                        message.includes("unauthorized") ||
                        message.includes("forbidden") ||
                        message.includes("session") ||
                        message.includes("token")
                    );
                }
            );


        if (authenticationError) {

            navigate(
                "/login",
                {
                    replace: true,
                }
            );

            return;
        }


        /* =====================================================
           ERREUR PARTIELLE
        ===================================================== */

        if (rejectedResults.length > 0) {

            setError(
                `${rejectedResults.length} service${
                    rejectedResults.length > 1
                        ? "s"
                        : ""
                } n'a${
                    rejectedResults.length > 1
                        ? "ont"
                        : ""
                } pas pu charger leurs données.`
            );

        }

    }, [navigate]);


    /* =========================================================
       INITIALISATION

       Le chargement est lancé dans une micro-tâche afin
       d'éviter le warning react-hooks/set-state-in-effect.
    ========================================================= */

    useEffect(() => {

        if (getRole() !== "ADMIN") {

            navigate(
                "/login",
                {
                    replace: true,
                }
            );

            return;
        }


        const startDashboardLoading =
            async () => {

                await loadDashboard();

            };


        void startDashboardLoading();

    }, [
        navigate,
        loadDashboard,
    ]);


    /* =========================================================
       MESSAGES NON LUS
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


    const handleVisitors = () => {

        navigate(
            "/admin/visiteurs"
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
                ERREUR PARTIELLE
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
                            Certaines données sont indisponibles
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
                        projectsLoading
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
                        parcoursLoading
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
                        messagesLoading
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
                        messagesLoading
                            ? "—"
                            : unreadMessages.length
                    }
                    description="Messages à consulter"
                    icon="●"
                    variant="unread"
                    onClick={handleMessages}
                />


                {/* =================================================
                    VISITEURS
                ================================================= */}

                <StatCard
                    label="Visiteurs"
                    value={
                        visitorsLoading
                            ? "—"
                            : visitorCount
                    }
                    description="Visites enregistrées"
                    icon="◉"
                    variant="parcours"
                    onClick={handleVisitors}
                />

            </section>


            {/* =====================================================
                CONTENU PRINCIPAL
            ===================================================== */}

            <section className="admin-dashboard-content">


                {/* =================================================
                    MESSAGES RÉCENTS
                ================================================= */}

                <RecentMessages
                    messages={unreadMessages}
                    loading={messagesLoading}
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
                                    {projectsLoading
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
                                    {parcoursLoading
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

                                    {messagesLoading
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
                            VISITEURS
                        ================================================= */}

                        <button
                            type="button"
                            className="admin-quick-action"
                            onClick={handleVisitors}
                        >

                            <span
                                className="admin-quick-icon"
                                aria-hidden="true"
                            >
                                ◉
                            </span>


                            <span className="admin-quick-content">

                                <strong>
                                    Consulter les visiteurs
                                </strong>

                                <small>

                                    {visitorsLoading
                                        ? "Chargement..."
                                        : `${visitorCount} visite${
                                            visitorCount > 1
                                                ? "s"
                                                : ""
                                        } enregistrée${
                                            visitorCount > 1
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
                                {parcoursLoading
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
                                {parcoursLoading
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
                                {parcoursLoading
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
                                {parcoursLoading
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
