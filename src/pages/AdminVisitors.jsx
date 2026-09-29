import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    getVisitors,
    deleteVisitor,
} from "../services/visitorService";

import { getRole } from "../services/authService";

import "../styles/AdminVisitors.css";


function AdminVisitors() {

    const navigate = useNavigate();

    const [visitors, setVisitors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [deletingId, setDeletingId] = useState(null);

    const [visitorToDelete, setVisitorToDelete] =
        useState(null);


    /* =========================================================
       CHARGEMENT DES VISITEURS
    ========================================================= */

    const loadVisitors = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");

                setSuccess("");

                const data =
                    await getVisitors();

                setVisitors(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                const message =
                    err?.message || "";

                const normalizedMessage =
                    message.toLowerCase();

                if (
                    normalizedMessage.includes("session") ||
                    normalizedMessage.includes("administrateur") ||
                    normalizedMessage.includes("accès") ||
                    normalizedMessage.includes("autorisé") ||
                    normalizedMessage.includes("unauthorized") ||
                    normalizedMessage.includes("forbidden") ||
                    normalizedMessage.includes("401") ||
                    normalizedMessage.includes("403")
                ) {

                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                setError(
                    message ||
                    "Impossible de charger les visiteurs."
                );

            } finally {

                setLoading(false);

            }

        },
        [navigate]
    );


    /* =========================================================
       INITIALISATION
    ========================================================= */

    useEffect(() => {

        if (getRole() !== "ADMIN") {
            navigate("/login", { replace: true });
            return;
        }

        let cancelled = false;

        const initializeVisitors = async () => {

            if (cancelled) {
                return;
            }

            await loadVisitors();

        };

        void initializeVisitors();

        return () => {
            cancelled = true;
        };

    }, [navigate, loadVisitors]);


    /* =========================================================
       OUVERTURE CONFIRMATION SUPPRESSION
    ========================================================= */

    const handleDeleteRequest = (visitor) => {

        setError("");

        setSuccess("");

        setVisitorToDelete(visitor);

    };


    /* =========================================================
       ANNULATION SUPPRESSION
    ========================================================= */

    const handleCancelDelete = () => {

        if (deletingId !== null) {
            return;
        }

        setVisitorToDelete(null);

    };


    /* =========================================================
       SUPPRESSION
    ========================================================= */

    const handleConfirmDelete = async () => {

        if (!visitorToDelete) {
            return;
        }

        const visitorId =
            visitorToDelete.id;

        try {

            setDeletingId(visitorId);

            setError("");

            setSuccess("");

            await deleteVisitor(
                visitorId
            );

            setVisitors(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            visitorId
                    )
            );

            setVisitorToDelete(null);

            setSuccess(
                "La visite a été supprimée avec succès."
            );

        } catch (err) {

            setError(
                err?.message ||
                "Impossible de supprimer le visiteur."
            );

        } finally {

            setDeletingId(null);

        }
    };


    /* =========================================================
       FORMAT DATE
    ========================================================= */

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            "fr-FR",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    /* =========================================================
       RENDU
    ========================================================= */

    return (

        <div className="admin-visitors">

            <header className="admin-visitors-header">

                <div>

                    <span className="admin-dashboard-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Visiteurs
                    </h1>

                    <p>
                        Consultez les visites enregistrées
                        sur votre portfolio.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-visitors-refresh"
                    onClick={loadVisitors}
                    disabled={loading}
                >
                    {loading
                        ? "Actualisation..."
                        : "↻ Actualiser"
                    }
                </button>

            </header>


            {/* =====================================================
                MESSAGE D'ERREUR
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
                            Une erreur est survenue
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =====================================================
                MESSAGE DE SUCCÈS
            ===================================================== */}

            {success && (

                <div
                    className="admin-alert admin-alert-success"
                    role="status"
                >

                    <span
                        className="admin-alert-icon"
                        aria-hidden="true"
                    >
                        ✓
                    </span>

                    <div>

                        <strong>
                            Opération réussie
                        </strong>

                        <p>
                            {success}
                        </p>

                    </div>

                </div>

            )}


            {/* =====================================================
                RÉSUMÉ
            ===================================================== */}

            <section className="admin-visitors-summary">

                <div className="admin-visitors-total">

                    <span>
                        Visites enregistrées
                    </span>

                    <strong>
                        {loading
                            ? "—"
                            : visitors.length
                        }
                    </strong>

                </div>

            </section>


            {/* =====================================================
                TABLEAU
            ===================================================== */}

            <section className="admin-visitors-panel">

                <div className="admin-visitors-table-wrapper">

                    <table className="admin-visitors-table">

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    IP
                                </th>

                                <th>
                                    Appareil
                                </th>

                                <th>
                                    Navigateur
                                </th>

                                <th>
                                    Système
                                </th>

                                <th>
                                    Page
                                </th>

                                <th>
                                    Provenance
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="admin-visitors-empty"
                                    >
                                        Chargement des visiteurs...
                                    </td>

                                </tr>

                            ) : visitors.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="admin-visitors-empty"
                                    >
                                        Aucun visiteur enregistré.
                                    </td>

                                </tr>

                            ) : (

                                visitors.map(
                                    (visitor) => (

                                        <tr
                                            key={
                                                visitor.id
                                            }
                                        >

                                            <td>
                                                {formatDate(
                                                    visitor.visitedAt
                                                )}
                                            </td>

                                            <td>
                                                <code>
                                                    {
                                                        visitor.ipAddress ||
                                                        "—"
                                                    }
                                                </code>
                                            </td>

                                            <td>
                                                {
                                                    visitor.deviceType ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    visitor.browser ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    visitor.operatingSystem ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    visitor.pageVisited ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    visitor.referrer ||
                                                    "Direct"
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="admin-visitor-delete"
                                                    onClick={() =>
                                                        handleDeleteRequest(
                                                            visitor
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        visitor.id
                                                    }
                                                >
                                                    Supprimer
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =====================================================
                MODALE DE CONFIRMATION
            ===================================================== */}

            {visitorToDelete && (

                <div
                    className="admin-visitors-modal-overlay"
                    role="presentation"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCancelDelete();
                        }

                    }}
                >

                    <div
                        className="admin-visitors-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-visitor-title"
                    >

                        <div className="admin-visitors-modal-icon">
                            !
                        </div>

                        <h2 id="delete-visitor-title">
                            Supprimer cette visite ?
                        </h2>

                        <p>
                            Cette action supprimera définitivement
                            cette visite de votre tableau de bord.
                        </p>

                        {visitorToDelete.ipAddress && (

                            <div className="admin-visitors-modal-info">

                                <span>
                                    Visiteur
                                </span>

                                <strong>
                                    {visitorToDelete.ipAddress}
                                </strong>

                            </div>

                        )}

                        <div className="admin-visitors-modal-actions">

                            <button
                                type="button"
                                className="admin-visitors-modal-cancel"
                                onClick={
                                    handleCancelDelete
                                }
                                disabled={
                                    deletingId !== null
                                }
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                className="admin-visitors-modal-confirm"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    deletingId !== null
                                }
                            >

                                {deletingId !== null
                                    ? "Suppression..."
                                    : "Oui, supprimer"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}


export default AdminVisitors;

