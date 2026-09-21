import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    deleteMessage,
    getMessages,
    markMessageAsRead,
} from "../services/contactService";

import "../styles/AdminMessages.css";


function AdminMessages() {

    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);
    const [readingId, setReadingId] = useState(null);


    /* =========================================================
       CHARGEMENT DES MESSAGES
       ========================================================= */

    const loadMessages = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMessages();

            setMessages(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Erreur lors du chargement des messages :",
                err
            );

            const message =
                err?.message ||
                "Impossible de charger les messages.";

            if (
                message
                    .toLowerCase()
                    .includes("administrateur") ||
                message
                    .toLowerCase()
                    .includes("session") ||
                message
                    .toLowerCase()
                    .includes("connecté") ||
                message
                    .toLowerCase()
                    .includes("connecte")
            ) {

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                return;
            }

            setError(message);

        } finally {

            setLoading(false);

        }

    }, [navigate]);


    /* =========================================================
       CHARGEMENT INITIAL
       ========================================================= */

    useEffect(() => {

        let active = true;

        const load = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getMessages();

                if (!active) {
                    return;
                }

                setMessages(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                if (!active) {
                    return;
                }

                console.error(
                    "Erreur lors du chargement des messages :",
                    err
                );

                const message =
                    err?.message ||
                    "Impossible de charger les messages.";

                if (
                    message
                        .toLowerCase()
                        .includes("administrateur") ||
                    message
                        .toLowerCase()
                        .includes("session") ||
                    message
                        .toLowerCase()
                        .includes("connecté") ||
                    message
                        .toLowerCase()
                        .includes("connecte")
                ) {

                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                setError(message);

            } finally {

                if (active) {
                    setLoading(false);
                }

            }

        };

        load();

        return () => {
            active = false;
        };

    }, [navigate]);


    /* =========================================================
       TRI DES MESSAGES
       ========================================================= */

    const sortedMessages = useMemo(() => {

        return [...messages].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.dateEnvoi
                    ).getTime();

                const dateB =
                    new Date(
                        b.dateEnvoi
                    ).getTime();

                return dateB - dateA;
            }
        );

    }, [messages]);


    /* =========================================================
       FILTRAGE
       ========================================================= */

    const filteredMessages = useMemo(() => {

        if (filter === "unread") {

            return sortedMessages.filter(
                (message) =>
                    !message.lu
            );

        }

        if (filter === "read") {

            return sortedMessages.filter(
                (message) =>
                    message.lu
            );

        }

        return sortedMessages;

    }, [
        sortedMessages,
        filter,
    ]);


    /* =========================================================
       STATISTIQUES
       ========================================================= */

    const unreadCount = useMemo(() => {

        return messages.filter(
            (message) =>
                !message.lu
        ).length;

    }, [messages]);


    const readCount =
        messages.length -
        unreadCount;


    /* =========================================================
       FORMATAGE DE DATE
       ========================================================= */

    const formatDate = (date) => {

        if (!date) {
            return "Date inconnue";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Date inconnue";
        }

        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        ).format(parsedDate);

    };


    /* =========================================================
       INITIAL DU NOM
       ========================================================= */

    const getInitial = (name) => {

        if (!name) {
            return "?";
        }

        return name
            .trim()
            .charAt(0)
            .toUpperCase();

    };


    /* =========================================================
       OUVRIR UN MESSAGE
       ========================================================= */

    const handleOpenMessage = async (
        message
    ) => {

        if (!message?.id) {
            return;
        }

        if (!message.lu) {

            try {

                setReadingId(
                    message.id
                );

                const updatedMessage =
                    await markMessageAsRead(
                        message.id
                    );

                setMessages(
                    (currentMessages) =>
                        currentMessages.map(
                            (item) =>
                                item.id ===
                                message.id
                                    ? {
                                        ...item,
                                        ...(updatedMessage || {}),
                                        lu: true,
                                    }
                                    : item
                        )
                );

            } catch (err) {

                console.error(
                    "Impossible de marquer le message comme lu :",
                    err
                );

            } finally {

                setReadingId(null);

            }

        }

        navigate(
            `/admin/messages/${message.id}`
        );

    };


    /* =========================================================
       MARQUER COMME LU
       ========================================================= */

    const handleMarkAsRead = async (
        event,
        message
    ) => {

        event.stopPropagation();

        if (
            !message?.id ||
            message.lu
        ) {
            return;
        }

        try {

            setReadingId(
                message.id
            );

            const updatedMessage =
                await markMessageAsRead(
                    message.id
                );

            setMessages(
                (currentMessages) =>
                    currentMessages.map(
                        (item) =>
                            item.id ===
                            message.id
                                ? {
                                    ...item,
                                    ...(updatedMessage || {}),
                                    lu: true,
                                }
                                : item
                    )
            );

        } catch (err) {

            console.error(
                "Impossible de marquer le message comme lu :",
                err
            );

            setError(
                err?.message ||
                "Impossible de marquer le message comme lu."
            );

        } finally {

            setReadingId(null);

        }

    };


    /* =========================================================
       SUPPRIMER UN MESSAGE
       ========================================================= */

    const handleDelete = async (
        event,
        message
    ) => {

        event.stopPropagation();

        if (!message?.id) {
            return;
        }

        const confirmed =
            window.confirm(
                `Voulez-vous vraiment supprimer le message de ${message.nom || "cet utilisateur"} ?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(
                message.id
            );

            await deleteMessage(
                message.id
            );

            setMessages(
                (currentMessages) =>
                    currentMessages.filter(
                        (item) =>
                            item.id !==
                            message.id
                    )
            );

        } catch (err) {

            console.error(
                "Impossible de supprimer le message :",
                err
            );

            setError(
                err?.message ||
                "Impossible de supprimer le message."
            );

        } finally {

            setDeletingId(null);

        }

    };


    /* =========================================================
       RENDU
       ========================================================= */

    return (

        <div className="admin-messages-page">

            {/* =================================================
                EN-TÊTE
                ================================================= */}

            <header className="admin-messages-header">

                <div>

                    <span className="admin-messages-eyebrow">
                        BOÎTE DE RÉCEPTION
                    </span>

                    <h1>
                        Messages
                    </h1>

                    <p>
                        Consultez et gérez les messages reçus
                        depuis votre portfolio.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-messages-refresh"
                    onClick={loadMessages}
                    disabled={loading}
                >

                    <span
                        className={
                            loading
                                ? "admin-messages-refresh-icon spinning"
                                : "admin-messages-refresh-icon"
                        }
                    >
                        ↻
                    </span>

                    {loading
                        ? "Actualisation..."
                        : "Actualiser"
                    }

                </button>

            </header>


            {/* =================================================
                STATISTIQUES
                ================================================= */}

            <section className="admin-message-stats">

                <article className="admin-message-stat">

                    <span className="admin-message-stat-icon">
                        ✉
                    </span>

                    <div>

                        <strong>
                            {loading
                                ? "—"
                                : messages.length
                            }
                        </strong>

                        <span>
                            Total
                        </span>

                    </div>

                </article>


                <article className="admin-message-stat admin-message-stat-unread">

                    <span className="admin-message-stat-icon">
                        ●
                    </span>

                    <div>

                        <strong>
                            {loading
                                ? "—"
                                : unreadCount
                            }
                        </strong>

                        <span>
                            Non lus
                        </span>

                    </div>

                </article>


                <article className="admin-message-stat admin-message-stat-read">

                    <span className="admin-message-stat-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            {loading
                                ? "—"
                                : readCount
                            }
                        </strong>

                        <span>
                            Lus
                        </span>

                    </div>

                </article>

            </section>


            {/* =================================================
                ERREUR
                ================================================= */}

            {error && (

                <div className="admin-messages-error">

                    <span className="admin-messages-error-icon">
                        !
                    </span>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            loadMessages();
                        }}
                    >
                        Réessayer
                    </button>

                </div>

            )}


            {/* =================================================
                PANNEAU PRINCIPAL
                ================================================= */}

            <section className="admin-messages-panel">


                {/* =================================================
                    BARRE D'OUTILS
                    ================================================= */}

                <div className="admin-messages-toolbar">

                    <div className="admin-message-filters">

                        <button
                            type="button"
                            className={
                                filter === "all"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        >
                            Tous

                            <span>
                                {messages.length}
                            </span>

                        </button>


                        <button
                            type="button"
                            className={
                                filter === "unread"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("unread")
                            }
                        >
                            Non lus

                            <span>
                                {unreadCount}
                            </span>

                        </button>


                        <button
                            type="button"
                            className={
                                filter === "read"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("read")
                            }
                        >
                            Lus

                            <span>
                                {readCount}
                            </span>

                        </button>

                    </div>


                    <span className="admin-message-results">

                        {loading
                            ? "Chargement..."
                            : `${filteredMessages.length} message${filteredMessages.length > 1 ? "s" : ""}`
                        }

                    </span>

                </div>


                {/* =================================================
                    LISTE DES MESSAGES
                    ================================================= */}

                <div className="admin-messages-list">


                    {/* =================================================
                        SKELETON
                        ================================================= */}

                    {loading && (

                        <>
                            {[1, 2, 3, 4].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="admin-message-skeleton"
                                    >

                                        <span className="skeleton skeleton-avatar" />

                                        <div className="skeleton-content">

                                            <span className="skeleton skeleton-line skeleton-line-short" />

                                            <span className="skeleton skeleton-line" />

                                            <span className="skeleton skeleton-line skeleton-line-small" />

                                        </div>

                                        <span className="skeleton skeleton-date" />

                                    </div>

                                )
                            )}
                        </>

                    )}


                    {/* =================================================
                        AUCUN MESSAGE
                        ================================================= */}

                    {!loading &&
                        filteredMessages.length === 0 && (

                            <div className="admin-messages-empty">

                                <div className="admin-messages-empty-icon">
                                    ✉
                                </div>

                                <h2>

                                    {filter === "all"
                                        ? "Aucun message"
                                        : filter === "unread"
                                            ? "Aucun message non lu"
                                            : "Aucun message lu"
                                    }

                                </h2>

                                <p>

                                    {filter === "all"
                                        ? "Les messages envoyés depuis votre formulaire de contact apparaîtront ici."
                                        : "Aucun message ne correspond à ce filtre."
                                    }

                                </p>


                                {filter !== "all" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("all")
                                        }
                                    >
                                        Voir tous les messages
                                    </button>

                                )}

                            </div>

                        )}


                    {/* =================================================
                        MESSAGES
                        ================================================= */}

                    {!loading &&
                        filteredMessages.length > 0 &&
                        filteredMessages.map(
                            (message) => (

                                <article
                                    key={message.id}
                                    className={`admin-message-item ${
                                        message.lu
                                            ? ""
                                            : "unread"
                                    }`}
                                    onClick={() =>
                                        handleOpenMessage(
                                            message
                                        )
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {

                                        if (
                                            event.key ===
                                                "Enter" ||
                                            event.key ===
                                                " "
                                        ) {

                                            event.preventDefault();

                                            handleOpenMessage(
                                                message
                                            );

                                        }

                                    }}
                                >


                                    {/* =================================================
                                        AVATAR
                                        ================================================= */}

                                    <div className="admin-message-avatar">

                                        {getInitial(
                                            message.nom
                                        )}

                                        {!message.lu && (

                                            <span className="admin-message-unread-dot" />

                                        )}

                                    </div>


                                    {/* =================================================
                                        CONTENU
                                        ================================================= */}

                                    <div className="admin-message-item-content">


                                        <div className="admin-message-item-top">

                                            <div className="admin-message-sender">

                                                <strong>
                                                    {message.nom ||
                                                        "Utilisateur"}
                                                </strong>

                                                <span>
                                                    {message.email}
                                                </span>

                                            </div>


                                            <time>

                                                {formatDate(
                                                    message.dateEnvoi
                                                )}

                                            </time>

                                        </div>


                                        <h2>

                                            {message.sujet ||
                                                "Sans sujet"}

                                        </h2>


                                        <p>

                                            {message.message ||
                                                "Aucun contenu."}

                                        </p>

                                    </div>


                                    {/* =================================================
                                        ACTIONS
                                        ================================================= */}

                                    <div className="admin-message-item-actions">


                                        {/* MARQUER COMME LU */}

                                        {!message.lu && (

                                            <button
                                                type="button"
                                                className="admin-message-read-button"
                                                title="Marquer comme lu"
                                                aria-label="Marquer comme lu"
                                                disabled={
                                                    readingId ===
                                                    message.id
                                                }
                                                onClick={(event) =>
                                                    handleMarkAsRead(
                                                        event,
                                                        message
                                                    )
                                                }
                                            >

                                                {readingId ===
                                                message.id
                                                    ? "…"
                                                    : "✓"}

                                            </button>

                                        )}


                                        {/* SUPPRIMER */}

                                        <button
                                            type="button"
                                            className="admin-message-delete-button"
                                            title="Supprimer"
                                            aria-label="Supprimer"
                                            disabled={
                                                deletingId ===
                                                message.id
                                            }
                                            onClick={(event) =>
                                                handleDelete(
                                                    event,
                                                    message
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            message.id
                                                ? "…"
                                                : "×"}

                                        </button>


                                        {/* OUVRIR */}

                                        <span className="admin-message-open-arrow">
                                            →
                                        </span>

                                    </div>

                                </article>

                            )
                        )}

                </div>

            </section>

        </div>
    );
}


export default AdminMessages;
