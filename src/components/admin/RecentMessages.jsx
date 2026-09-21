import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/RecentMessages.css";

function RecentMessages({
    messages = [],
    loading = false,
    limit = 5,
}) {
    const navigate = useNavigate();

    /* =========================================================
       TRI DES MESSAGES
       ========================================================= */

    const recentMessages = useMemo(() => {
        return [...messages]
            .sort(
                (a, b) =>
                    new Date(b.dateEnvoi) -
                    new Date(a.dateEnvoi)
            )
            .slice(0, limit);
    }, [messages, limit]);

    /* =========================================================
       FORMATAGE DE LA DATE
       ========================================================= */

    const formatDate = (date) => {
        if (!date) {
            return "Date inconnue";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
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
       TRONQUER LE MESSAGE
       ========================================================= */

    const truncate = (
        text,
        maxLength = 70
    ) => {
        if (!text) {
            return "";
        }

        return text.length > maxLength
            ? `${text.substring(0, maxLength)}…`
            : text;
    };

    /* =========================================================
       OUVRIR UN MESSAGE
       ========================================================= */

    const handleMessageClick = (id) => {
        navigate(`/admin/messages/${id}`);
    };

    /* =========================================================
       OUVRIR TOUS LES MESSAGES
       ========================================================= */

    const handleViewAll = () => {
        navigate("/admin/messages");
    };

    /* =========================================================
       RENDU
       ========================================================= */

    return (
        <article className="admin-panel admin-recent-panel">

            {/* =================================================
                EN-TÊTE
            ================================================= */}

            <div className="admin-panel-header">

                <div>

                    <span className="admin-panel-eyebrow">
                        CONTACT
                    </span>

                    <h2>
                        Messages récents
                    </h2>

                </div>

                <button
                    type="button"
                    className="admin-panel-link"
                    onClick={handleViewAll}
                >
                    <span>
                        Voir tout
                    </span>

                    <span
                        className="admin-panel-link-arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>
                </button>

            </div>

            {/* =================================================
                CHARGEMENT
            ================================================= */}

            {loading ? (

                <div className="admin-empty-state">

                    <div
                        className="admin-loader"
                        aria-hidden="true"
                    ></div>

                    <p>
                        Chargement des messages...
                    </p>

                </div>

            ) : recentMessages.length === 0 ? (

                /* =================================================
                   AUCUN MESSAGE
                ================================================= */

                <div className="admin-empty-state">

                    <span
                        className="admin-empty-icon"
                        aria-hidden="true"
                    >
                        ✉
                    </span>

                    <h3>
                        Aucun message
                    </h3>

                    <p>
                        Les messages reçus depuis le
                        formulaire de contact apparaîtront
                        ici.
                    </p>

                    <button
                        type="button"
                        className="admin-empty-action"
                        onClick={handleViewAll}
                    >
                        Voir les messages
                        <span aria-hidden="true">
                            →
                        </span>
                    </button>

                </div>

            ) : (

                /* =================================================
                   LISTE DES MESSAGES
                ================================================= */

                <div
                    className="admin-message-list"
                    aria-label="Messages récents"
                >

                    {recentMessages.map(
                        (message) => {

                            const initial =
                                message.nom
                                    ?.trim()
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                "?";

                            return (
                                <button
                                    type="button"
                                    key={message.id}
                                    className={
                                        `admin-message-row ${
                                            message.lu
                                                ? ""
                                                : "unread"
                                        }`
                                    }
                                    onClick={() =>
                                        handleMessageClick(
                                            message.id
                                        )
                                    }
                                    aria-label={
                                        `Ouvrir le message de ${
                                            message.nom ||
                                            "Visiteur"
                                        }`
                                    }
                                >

                                    {/* =================================================
                                        AVATAR
                                    ================================================= */}

                                    <span
                                        className="admin-message-avatar"
                                        aria-hidden="true"
                                    >
                                        {initial}
                                    </span>

                                    {/* =================================================
                                        CONTENU
                                    ================================================= */}

                                    <span className="admin-message-content">

                                        <span className="admin-message-main">

                                            <strong>
                                                {message.nom ||
                                                    "Visiteur"}
                                            </strong>

                                            {!message.lu && (
                                                <span
                                                    className="admin-unread-dot"
                                                    title="Message non lu"
                                                    aria-label="Message non lu"
                                                ></span>
                                            )}

                                        </span>

                                        <span className="admin-message-subject">
                                            {message.sujet ||
                                                "Sans sujet"}
                                        </span>

                                        <span className="admin-message-preview">
                                            {truncate(
                                                message.message
                                            )}
                                        </span>

                                    </span>

                                    {/* =================================================
                                        DATE
                                    ================================================= */}

                                    <time
                                        className="admin-message-date"
                                        dateTime={
                                            message.dateEnvoi ||
                                            undefined
                                        }
                                    >
                                        {formatDate(
                                            message.dateEnvoi
                                        )}
                                    </time>

                                    {/* =================================================
                                        FLÈCHE
                                    ================================================= */}

                                    <span
                                        className="admin-message-arrow"
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>

                                </button>
                            );
                        }
                    )}

                </div>
            )}

        </article>
    );
}

export default RecentMessages;