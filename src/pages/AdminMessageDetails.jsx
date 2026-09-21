import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getMessageById,
    markMessageAsRead,
    deleteMessage,
    replyToMessage,
} from "../services/contactService";

import "../styles/AdminMessageDetails.css";


function AdminMessageDetails() {

    const navigate = useNavigate();

    const { id } = useParams();


    /*
     * ==========================================
     * MESSAGE
     * ==========================================
     */

    const [message, setMessage] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /*
     * ==========================================
     * SUPPRESSION
     * ==========================================
     */

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [deleteConfirm, setDeleteConfirm] =
        useState(false);

    const [pageSuccess, setPageSuccess] =
        useState("");

    const [pageError, setPageError] =
        useState("");


    /*
     * ==========================================
     * MODALE RÉPONSE
     * ==========================================
     */

    const [showReplyModal, setShowReplyModal] =
        useState(false);

    const [replySubject, setReplySubject] =
        useState("");

    const [replyBody, setReplyBody] =
        useState("");

    const [replyLoading, setReplyLoading] =
        useState(false);

    const [replyError, setReplyError] =
        useState("");

    const [replySuccess, setReplySuccess] =
        useState("");


    /*
     * ==========================================
     * CHARGER LE MESSAGE
     * ==========================================
     */

    useEffect(() => {

        let cancelled = false;


        const fetchMessage = async () => {

            try {

                await Promise.resolve();

                if (cancelled) {
                    return;
                }


                setLoading(true);

                setError("");

                setPageError("");

                setPageSuccess("");

                setMessage(null);


                const data =
                    await getMessageById(id);


                if (cancelled) {
                    return;
                }


                setMessage(data);


                /*
                 * Marquer automatiquement comme lu.
                 */

                if (data && !data.lu) {

                    try {

                        await markMessageAsRead(
                            data.id
                        );


                        if (!cancelled) {

                            setMessage(
                                (currentMessage) => ({
                                    ...currentMessage,
                                    lu: true,
                                })
                            );
                        }

                    } catch (markError) {

                        console.error(
                            "Impossible de marquer le message comme lu :",
                            markError
                        );
                    }
                }

            } catch (err) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Erreur lors du chargement du message :",
                    err
                );


                setError(
                    err?.message ||
                    "Impossible de charger le message."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };


        fetchMessage();


        return () => {

            cancelled = true;
        };

    }, [id]);


    /*
     * ==========================================
     * OUVRIR LA MODALE DE RÉPONSE
     * ==========================================
     */

    const handleOpenReply = useCallback(() => {

        if (!message) {
            return;
        }


        const originalSubject =
            message.sujet?.trim() ||
            "Votre message";


        const subject =
            originalSubject
                .toLowerCase()
                .startsWith("re:")
                ? originalSubject
                : `Re: ${originalSubject}`;


        const body =
            `Bonjour ${message.nom || ""},\n\n` +
            `Merci pour votre message.\n\n` +
            `Je reviens vers vous concernant votre demande.\n\n` +
            `Cordialement,\n` +
            `Fréjus Adjanohoun`;


        setReplySubject(subject);

        setReplyBody(body);

        setReplyError("");

        setReplySuccess("");

        setShowReplyModal(true);

    }, [message]);


    /*
     * ==========================================
     * OUVRIR GMAIL
     * ==========================================
     */

    const handleOpenGmail = useCallback(() => {

        if (!message?.email) {
            return;
        }


        const subject =
            message.sujet?.trim()
                ? (
                    message.sujet
                        .trim()
                        .toLowerCase()
                        .startsWith("re:")
                        ? message.sujet.trim()
                        : `Re: ${message.sujet.trim()}`
                )
                : "Réponse à votre message";


        const gmailUrl =
            "https://mail.google.com/mail/u/0/" +
            "?view=cm" +
            "&fs=1" +
            `&to=${encodeURIComponent(
                message.email
            )}` +
            `&su=${encodeURIComponent(
                subject
            )}`;


        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }, [message]);


    /*
     * ==========================================
     * FERMER LA MODALE
     * ==========================================
     */

    const handleCloseReply = useCallback(() => {

        if (replyLoading) {
            return;
        }


        setShowReplyModal(false);

        setReplyError("");

        setReplySuccess("");

    }, [replyLoading]);


    /*
     * ==========================================
     * ESCAPE + BLOQUER LE SCROLL
     * ==========================================
     */

    useEffect(() => {

        if (!showReplyModal) {
            return undefined;
        }


        const handleEscape = (event) => {

            if (event.key === "Escape") {
                handleCloseReply();
            }
        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );


            document.body.style.overflow =
                previousOverflow;
        };

    }, [
        showReplyModal,
        handleCloseReply,
    ]);


    /*
     * ==========================================
     * ENVOYER LA RÉPONSE
     * ==========================================
     */

    const handleSendReply = async (event) => {

        event.preventDefault();


        if (!message) {
            return;
        }


        setReplyError("");

        setReplySuccess("");


        /*
         * Validation du sujet.
         */

        if (!replySubject.trim()) {

            setReplyError(
                "Veuillez saisir un objet."
            );

            return;
        }


        /*
         * Validation du message.
         */

        if (!replyBody.trim()) {

            setReplyError(
                "Veuillez saisir un message."
            );

            return;
        }


        try {

            setReplyLoading(true);


            /*
             * Envoi vers Spring Boot.
             */

            await replyToMessage(
                message.id,
                replySubject.trim(),
                replyBody.trim()
            );


            /*
             * Succès.
             */

            setReplySuccess(
                "Votre réponse a été envoyée avec succès."
            );


            /*
             * Le message devient lu après une réponse.
             */

            setMessage(
                (currentMessage) => ({
                    ...currentMessage,
                    lu: true,
                })
            );


            /*
             * Fermeture automatique après 1,5 seconde.
             */

            window.setTimeout(() => {

                setShowReplyModal(false);

                setReplySuccess("");

            }, 1500);

        } catch (err) {

            console.error(
                "Erreur lors de l'envoi de la réponse :",
                err
            );


            setReplyError(
                err?.message ||
                "Impossible d'envoyer la réponse."
            );

        } finally {

            setReplyLoading(false);
        }
    };


    /*
     * ==========================================
     * AFFICHER LA CONFIRMATION
     * ==========================================
     */

    const handleOpenDeleteConfirmation = () => {

        setPageError("");

        setPageSuccess("");

        setDeleteConfirm(true);
    };


    /*
     * ==========================================
     * ANNULER LA SUPPRESSION
     * ==========================================
     */

    const handleCancelDelete = () => {

        if (deleteLoading) {
            return;
        }

        setDeleteConfirm(false);
    };


    /*
     * ==========================================
     * SUPPRIMER LE MESSAGE
     * ==========================================
     */

    const handleDelete = async () => {

        if (!message) {
            return;
        }


        try {

            setDeleteLoading(true);

            setPageError("");

            setPageSuccess("");


            await deleteMessage(
                message.id
            );


            /*
             * Afficher le succès.
             */

            setPageSuccess(
                "Le message a été supprimé avec succès."
            );


            setDeleteConfirm(false);


            /*
             * Retour à la liste après un court délai.
             */

            window.setTimeout(() => {

                navigate(
                    "/admin/messages",
                    {
                        replace: true,
                    }
                );

            }, 1200);

        } catch (err) {

            console.error(
                "Erreur lors de la suppression :",
                err
            );


            setPageError(
                err?.message ||
                "Impossible de supprimer le message."
            );

        } finally {

            setDeleteLoading(false);
        }
    };


    /*
     * ==========================================
     * FORMAT DATE
     * ==========================================
     */

    const formatDate = (value) => {

        if (!value) {
            return "Date inconnue";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return value;
        }


        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                dateStyle: "long",
                timeStyle: "short",
            }
        ).format(date);
    };


    /*
     * ==========================================
     * CHARGEMENT
     *
     * IMPORTANT :
     * Le layout global fournit déjà le Sidebar
     * et le Header.
     * ==========================================
     */

    if (loading) {

        return (
            <div className="admin-message-details">

                <div className="admin-message-loading">

                    <div className="admin-message-loading-spinner" />

                    <p>
                        Chargement du message...
                    </p>

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * ERREUR DE CHARGEMENT
     * ==========================================
     */

    if (error || !message) {

        return (
            <div className="admin-message-details">

                <div className="admin-message-error">

                    <div className="admin-message-error-icon">
                        !
                    </div>

                    <h1>
                        Message introuvable
                    </h1>

                    <p>
                        {error ||
                            "Ce message n'existe plus."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/messages"
                            )
                        }
                    >
                        Retour aux messages
                    </button>

                </div>

            </div>
        );
    }


    /*
     * ==========================================
     * INTERFACE
     * ==========================================
     */

    return (
        <div className="admin-message-details">


            {/* =====================================
                NOTIFICATION SUCCÈS
            ===================================== */}

            {pageSuccess && (

                <div
                    className="admin-page-notification success"
                    role="status"
                >

                    <div className="admin-page-notification-icon">
                        ✓
                    </div>


                    <div className="admin-page-notification-content">

                        <strong>
                            Succès
                        </strong>

                        <p>
                            {pageSuccess}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-page-notification-close"
                        onClick={() =>
                            setPageSuccess("")
                        }
                        aria-label="Fermer"
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =====================================
                NOTIFICATION ERREUR
            ===================================== */}

            {pageError && (

                <div
                    className="admin-page-notification error"
                    role="alert"
                >

                    <div className="admin-page-notification-icon">
                        !
                    </div>


                    <div className="admin-page-notification-content">

                        <strong>
                            Erreur
                        </strong>

                        <p>
                            {pageError}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-page-notification-close"
                        onClick={() =>
                            setPageError("")
                        }
                        aria-label="Fermer"
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =====================================
                CONFIRMATION SUPPRESSION
            ===================================== */}

            {deleteConfirm && (

                <div className="admin-delete-confirmation">

                    <div className="admin-delete-confirmation-icon">
                        !
                    </div>


                    <div className="admin-delete-confirmation-content">

                        <strong>
                            Supprimer ce message ?
                        </strong>

                        <p>
                            Cette action est définitive.
                            Le message sera supprimé de
                            votre espace administrateur.
                        </p>

                    </div>


                    <div className="admin-delete-confirmation-actions">

                        <button
                            type="button"
                            className="admin-delete-cancel"
                            onClick={handleCancelDelete}
                            disabled={deleteLoading}
                        >
                            Annuler
                        </button>


                        <button
                            type="button"
                            className="admin-delete-confirm"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading
                                ? "Suppression..."
                                : "Supprimer"}
                        </button>

                    </div>

                </div>
            )}


            {/* =====================================
                EN-TÊTE
            ===================================== */}

            <header className="admin-message-details-header">

                <div>

                    <button
                        type="button"
                        className="admin-back-button"
                        onClick={() =>
                            navigate(
                                "/admin/messages"
                            )
                        }
                    >

                        ←

                        <span>
                            Retour aux messages
                        </span>

                    </button>


                    <span className="admin-message-eyebrow">
                        MESSAGE
                    </span>


                    <h1>
                        Détails du message
                    </h1>

                </div>


                <div className="admin-message-header-actions">

                    <button
                        type="button"
                        className="admin-message-reply-button"
                        onClick={handleOpenReply}
                    >

                        <span>
                            ↩
                        </span>

                        Répondre

                    </button>


                    <button
                        type="button"
                        className="admin-message-delete-button"
                        onClick={
                            handleOpenDeleteConfirmation
                        }
                        disabled={deleteLoading}
                    >

                        <span>
                            ⌫
                        </span>

                        Supprimer

                    </button>

                </div>

            </header>


            {/* =====================================
                CONTENU
            ===================================== */}

            <section className="admin-message-detail-card">


                {/* =====================================
                    PROFIL
                ===================================== */}

                <div className="admin-message-detail-profile">

                    <div className="admin-message-avatar">

                        {(message.nom || "V")
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <h2>
                            {message.nom ||
                                "Visiteur"}
                        </h2>

                        <a
                            href={`mailto:${message.email}`}
                        >
                            {message.email}
                        </a>

                    </div>


                    <div className="admin-message-date">

                        <span>
                            Reçu le
                        </span>

                        <strong>
                            {formatDate(
                                message.dateCreation ||
                                message.createdAt
                            )}
                        </strong>

                    </div>

                </div>


                {/* =====================================
                    SUJET
                ===================================== */}

                <div className="admin-message-subject">

                    <span>
                        Sujet
                    </span>

                    <h3>
                        {message.sujet ||
                            "Sans sujet"}
                    </h3>

                </div>


                {/* =====================================
                    MESSAGE
                ===================================== */}

                <div className="admin-message-content">

                    <span>
                        Message
                    </span>

                    <div className="admin-message-content-text">
                        {message.message}
                    </div>

                </div>


                {/* =====================================
                    ACTIONS
                ===================================== */}

                <div className="admin-message-detail-actions">

                    <button
                        type="button"
                        className="admin-message-reply-large"
                        onClick={handleOpenReply}
                    >

                        ↩

                        <span>
                            Répondre à{" "}
                            {message.nom ||
                                "ce visiteur"}
                        </span>

                    </button>


                    <button
                        type="button"
                        className="admin-message-email-link"
                        onClick={handleOpenGmail}
                        disabled={!message.email}
                    >
                        Ouvrir dans Gmail
                    </button>

                </div>

            </section>


            {/* =================================================
                MODALE RÉPONDRE
            ================================================= */}

            {showReplyModal && (

                <div
                    className="admin-reply-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseReply();
                        }

                    }}
                >

                    <div
                        className="admin-reply-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reply-modal-title"
                    >


                        {/* =====================================
                            HEADER MODALE
                        ===================================== */}

                        <div className="admin-reply-modal-header">

                            <div>

                                <span className="admin-reply-modal-eyebrow">
                                    NOUVELLE RÉPONSE
                                </span>

                                <h2 id="reply-modal-title">
                                    Répondre au message
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="admin-reply-modal-close"
                                onClick={handleCloseReply}
                                disabled={replyLoading}
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </div>


                        {/* =====================================
                            FORMULAIRE
                        ===================================== */}

                        <form
                            className="admin-reply-form"
                            onSubmit={handleSendReply}
                        >


                            {/* DESTINATAIRE */}

                            <div className="admin-reply-field">

                                <label>
                                    Destinataire
                                </label>


                                <div className="admin-reply-recipient">

                                    <div className="admin-reply-recipient-avatar">

                                        {(message.nom || "V")
                                            .charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div>

                                        <strong>
                                            {message.nom ||
                                                "Visiteur"}
                                        </strong>

                                        <span>
                                            {message.email}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* SUJET */}

                            <div className="admin-reply-field">

                                <label htmlFor="reply-subject">
                                    Objet
                                </label>


                                <input
                                    id="reply-subject"
                                    type="text"
                                    value={replySubject}
                                    onChange={(event) =>
                                        setReplySubject(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Objet de la réponse"
                                    maxLength={200}
                                    disabled={replyLoading}
                                />

                            </div>


                            {/* MESSAGE */}

                            <div className="admin-reply-field">

                                <div className="admin-reply-label-row">

                                    <label htmlFor="reply-body">
                                        Message
                                    </label>


                                    <span className="admin-reply-counter">
                                        {replyBody.length}/5000
                                    </span>

                                </div>


                                <textarea
                                    id="reply-body"
                                    value={replyBody}
                                    onChange={(event) =>
                                        setReplyBody(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Écrivez votre réponse..."
                                    rows={10}
                                    maxLength={5000}
                                    disabled={replyLoading}
                                />

                            </div>


                            {/* ERREUR */}

                            {replyError && (

                                <div className="admin-reply-alert error">

                                    <span>
                                        !
                                    </span>

                                    <p>
                                        {replyError}
                                    </p>

                                </div>

                            )}


                            {/* SUCCÈS */}

                            {replySuccess && (

                                <div className="admin-reply-alert success">

                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        {replySuccess}
                                    </p>

                                </div>

                            )}


                            {/* ACTIONS */}

                            <div className="admin-reply-form-actions">

                                <button
                                    type="button"
                                    className="admin-reply-cancel"
                                    onClick={handleCloseReply}
                                    disabled={replyLoading}
                                >
                                    Annuler
                                </button>


                                <button
                                    type="submit"
                                    className="admin-reply-send"
                                    disabled={replyLoading}
                                >

                                    {replyLoading ? (

                                        <>
                                            <span className="admin-reply-spinner" />

                                            Envoi...
                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                ➤
                                            </span>

                                            Envoyer la réponse
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}


export default AdminMessageDetails;