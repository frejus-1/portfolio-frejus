import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    changePassword,
    getRole,
    getToken,
    logout,
} from "../services/authService";

import "../styles/AdminSettings.css";

function AdminSettings() {
    const navigate = useNavigate();

    /*
     * =========================================================
     * PRÉFÉRENCES
     * =========================================================
     */

    const [notifications, setNotifications] = useState(() => {
        const storedNotifications =
            localStorage.getItem("admin_notifications");

        if (storedNotifications !== null) {
            return storedNotifications === "true";
        }

        return true;
    });

    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme =
            localStorage.getItem("admin_theme");

        if (storedTheme !== null) {
            return storedTheme === "dark";
        }

        return document.documentElement.classList.contains("dark");
    });

    const [saved, setSaved] = useState(false);

    /*
     * =========================================================
     * CHANGEMENT DE MOT DE PASSE
     * =========================================================
     */

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordSuccess, setPasswordSuccess] =
        useState(false);

    /*
     * =========================================================
     * SESSION
     * =========================================================
     */

    const role = getRole();
    const token = getToken();

    const isAuthenticated = Boolean(token);

    /*
     * =========================================================
     * SAUVEGARDER LES PRÉFÉRENCES
     * =========================================================
     */

    const handleSavePreferences = () => {
        localStorage.setItem(
            "admin_notifications",
            notifications ? "true" : "false"
        );

        localStorage.setItem(
            "admin_theme",
            darkMode ? "dark" : "light"
        );

        document.documentElement.classList.toggle(
            "dark",
            darkMode
        );

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    /*
     * =========================================================
     * MODE SOMBRE
     * =========================================================
     */

    const handleDarkModeChange = () => {
        const newValue = !darkMode;

        setDarkMode(newValue);

        document.documentElement.classList.toggle(
            "dark",
            newValue
        );

        localStorage.setItem(
            "admin_theme",
            newValue ? "dark" : "light"
        );
    };

    /*
     * =========================================================
     * CHANGEMENT DE MOT DE PASSE
     * =========================================================
     */

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setPasswordError("");
        setPasswordSuccess(false);

        /*
         * Validation 1 — champs obligatoires
         */

        if (
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim()
        ) {
            setPasswordError(
                "Veuillez remplir tous les champs."
            );

            return;
        }

        /*
         * Validation 2 — longueur
         */

        if (newPassword.length < 8) {
            setPasswordError(
                "Le nouveau mot de passe doit contenir au moins 8 caractères."
            );

            return;
        }

        /*
         * Validation 3 — ancien / nouveau
         */

        if (currentPassword === newPassword) {
            setPasswordError(
                "Le nouveau mot de passe doit être différent de l'ancien."
            );

            return;
        }

        /*
         * Validation 4 — confirmation
         */

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "La confirmation du nouveau mot de passe ne correspond pas."
            );

            return;
        }

        /*
         * Envoi au backend
         */

        try {
            setPasswordLoading(true);

            await changePassword(
                currentPassword,
                newPassword
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setPasswordSuccess(true);

            /*
             * Après modification du mot de passe,
             * on force une nouvelle connexion.
             */

            window.setTimeout(() => {
                logout();

                navigate("/login", {
                    replace: true,
                    state: {
                        message:
                            "Votre mot de passe a été modifié avec succès. Veuillez vous reconnecter.",
                    },
                });
            }, 1800);
        } catch (error) {
            setPasswordError(
                error?.message ||
                "Impossible de modifier le mot de passe."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    /*
     * =========================================================
     * DÉCONNEXION
     * =========================================================
     */

    const handleLogout = () => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment vous déconnecter ?"
        );

        if (!confirmed) {
            return;
        }

        logout();

        navigate("/login", {
            replace: true,
        });
    };

    /*
     * =========================================================
     * NAVIGATION
     * =========================================================
     */

    const goTo = (path) => {
        navigate(path);
    };

    /*
     * =========================================================
     * RENDU
     *
     * IMPORTANT :
     * Le Sidebar et le Header sont gérés par le layout
     * administrateur global.
     * =========================================================
     */

    return (
        <div className="admin-settings-page">

            {/* =================================================
                EN-TÊTE
            ================================================= */}

            <header className="admin-settings-header">

                <div>

                    <span className="admin-settings-eyebrow">
                        CONFIGURATION
                    </span>

                    <h1>
                        Paramètres
                    </h1>

                    <p>
                        Gérez votre compte administrateur,
                        les préférences de l'interface et
                        les paramètres de votre portfolio.
                    </p>

                </div>

            </header>


            {/* =================================================
                MESSAGE DE SAUVEGARDE
            ================================================= */}

            {saved && (
                <div
                    className="admin-settings-success"
                    role="status"
                >

                    <span className="admin-settings-success-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Modifications enregistrées
                        </strong>

                        <p>
                            Vos préférences ont été
                            sauvegardées avec succès.
                        </p>

                    </div>

                </div>
            )}


            {/* =================================================
                GRILLE PRINCIPALE
            ================================================= */}

            <div className="admin-settings-grid">

                {/* =================================================
                    A — PROFIL ADMINISTRATEUR
                ================================================= */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                COMPTE
                            </span>

                            <h2>
                                Profil administrateur
                            </h2>

                        </div>

                    </div>


                    <div className="admin-settings-profile">

                        <div className="admin-settings-avatar">
                            F
                        </div>

                        <div className="admin-settings-profile-info">

                            <strong>
                                Administrateur
                            </strong>

                            <span>
                                Compte principal du portfolio
                            </span>

                        </div>

                        <div className="admin-settings-profile-status">

                            <i></i>

                            Actif

                        </div>

                    </div>


                    <div className="admin-settings-fields">

                        <div className="admin-settings-field">

                            <label>
                                Rôle
                            </label>

                            <div className="admin-settings-readonly">

                                <span>
                                    {role || "ADMIN"}
                                </span>

                                <small>
                                    ✓
                                </small>

                            </div>

                        </div>


                        <div className="admin-settings-field">

                            <label>
                                Statut
                            </label>

                            <div className="admin-settings-readonly">

                                <span>
                                    {isAuthenticated
                                        ? "Session active"
                                        : "Session inactive"}
                                </span>

                                <small
                                    className={
                                        isAuthenticated
                                            ? "status-active"
                                            : "status-inactive"
                                    }
                                >
                                    ●
                                </small>

                            </div>

                        </div>

                    </div>


                    <div className="admin-settings-account-info">

                        <div>

                            <span>
                                Identifiant
                            </span>

                            <strong>
                                Administrateur
                            </strong>

                        </div>

                        <div>

                            <span>
                                Type de compte
                            </span>

                            <strong>
                                Compte administrateur
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    B — INFORMATIONS PORTFOLIO
                ================================================= */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            ◈
                        </div>

                        <div>

                            <span>
                                PORTFOLIO
                            </span>

                            <h2>
                                Informations générales
                            </h2>

                        </div>

                    </div>


                    <div className="admin-settings-information">

                        <div className="admin-settings-information-row">

                            <div>

                                <span>
                                    Propriétaire
                                </span>

                                <strong>
                                    Fréjus Adjanohoun
                                </strong>

                            </div>

                            <span className="admin-settings-badge">
                                Portfolio
                            </span>

                        </div>


                        <div className="admin-settings-information-row">

                            <div>

                                <span>
                                    Email de contact
                                </span>

                                <strong>
                                    f2987319@gmail.com
                                </strong>

                            </div>

                            <a
                                href="mailto:f2987319@gmail.com"
                                className="admin-settings-action-link"
                            >
                                Ouvrir
                            </a>

                        </div>


                        <div className="admin-settings-information-row">

                            <div>

                                <span>
                                    Backend
                                </span>

                                <strong>
                                    Spring Boot
                                </strong>

                            </div>

                            <span className="admin-settings-api-status">

                                <i></i>

                                Connectée

                            </span>

                        </div>


                        <div className="admin-settings-information-row">

                            <div>

                                <span>
                                    Base de données
                                </span>

                                <strong>
                                    MySQL
                                </strong>

                            </div>

                            <span className="admin-settings-database-status">

                                <i></i>

                                Active

                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    C — PRÉFÉRENCES
                ================================================= */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon">
                            ⚙
                        </div>

                        <div>

                            <span>
                                INTERFACE
                            </span>

                            <h2>
                                Préférences
                            </h2>

                        </div>

                    </div>


                    <div className="admin-settings-preferences">

                        {/* Notifications */}

                        <div className="admin-settings-preference">

                            <div className="admin-settings-preference-icon">
                                🔔
                            </div>

                            <div className="admin-settings-preference-content">

                                <strong>
                                    Notifications
                                </strong>

                                <p>
                                    Activer les notifications
                                    relatives aux nouveaux
                                    messages reçus.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`admin-settings-toggle ${notifications ? "active" : ""
                                    }`}
                                onClick={() =>
                                    setNotifications(
                                        !notifications
                                    )
                                }
                                aria-pressed={notifications}
                                aria-label={
                                    notifications
                                        ? "Désactiver les notifications"
                                        : "Activer les notifications"
                                }
                            >

                                <span></span>

                            </button>

                        </div>


                        {/* Mode sombre */}

                        <div className="admin-settings-preference">

                            <div className="admin-settings-preference-icon">
                                🌙
                            </div>

                            <div className="admin-settings-preference-content">

                                <strong>
                                    Mode sombre
                                </strong>

                                <p>
                                    Utiliser le thème sombre
                                    pour l'espace
                                    d'administration.
                                </p>

                            </div>

                            <button
                                type="button"
                                className={`admin-settings-toggle ${darkMode ? "active" : ""
                                    }`}
                                onClick={
                                    handleDarkModeChange
                                }
                                aria-pressed={darkMode}
                                aria-label={
                                    darkMode
                                        ? "Désactiver le mode sombre"
                                        : "Activer le mode sombre"
                                }
                            >

                                <span></span>

                            </button>

                        </div>

                    </div>


                    <div className="admin-settings-card-footer">

                        <button
                            type="button"
                            className="admin-settings-save"
                            onClick={
                                handleSavePreferences
                            }
                        >

                            <span>
                                ✓
                            </span>

                            Enregistrer les préférences

                        </button>

                    </div>

                </section>


                {/* =================================================
                    D — SÉCURITÉ
                ================================================= */}

                <section className="admin-settings-card">

                    <div className="admin-settings-card-header">

                        <div className="admin-settings-card-icon security">
                            🔒
                        </div>

                        <div>

                            <span>
                                SÉCURITÉ
                            </span>

                            <h2>
                                Session et sécurité
                            </h2>

                        </div>

                    </div>


                    <div className="admin-settings-security">

                        <div className="admin-settings-security-status">

                            <div className="admin-settings-security-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Authentification JWT
                                </strong>

                                <p>
                                    Votre espace
                                    d'administration utilise
                                    une authentification
                                    sécurisée par token.
                                </p>

                            </div>

                            <span className="admin-settings-security-badge">
                                Actif
                            </span>

                        </div>


                        <div className="admin-settings-security-info">

                            <div>

                                <span>
                                    Rôle actuel
                                </span>

                                <strong>
                                    {role || "ADMIN"}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Session
                                </span>

                                <strong>
                                    {isAuthenticated
                                        ? "Active"
                                        : "Inactive"}
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            FORMULAIRE MOT DE PASSE
                        ================================================= */}

                        <div className="admin-settings-password-section">

                            <div className="admin-settings-password-title">

                                <div className="admin-settings-password-icon">
                                    🔑
                                </div>

                                <div>

                                    <strong>
                                        Modifier le mot de passe
                                    </strong>

                                    <p>
                                        Utilisez un mot de passe
                                        d'au moins 8 caractères.
                                    </p>

                                </div>

                            </div>


                            {passwordError && (
                                <div
                                    className="admin-settings-password-alert error"
                                    role="alert"
                                >

                                    <span>
                                        !
                                    </span>

                                    <p>
                                        {passwordError}
                                    </p>

                                </div>
                            )}


                            {passwordSuccess && (
                                <div
                                    className="admin-settings-password-alert success"
                                    role="status"
                                >

                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Mot de passe modifié avec
                                        succès. Redirection vers
                                        la connexion...
                                    </p>

                                </div>
                            )}


                            <form
                                className="admin-settings-password-form"
                                onSubmit={
                                    handleChangePassword
                                }
                            >

                                {/* Ancien mot de passe */}

                                <div className="admin-settings-password-field">

                                    <label htmlFor="current-password">
                                        Ancien mot de passe
                                    </label>

                                    <div className="admin-settings-password-input-wrapper">

                                        <input
                                            id="current-password"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                currentPassword
                                            }
                                            onChange={(event) => {
                                                setCurrentPassword(
                                                    event.target.value
                                                );

                                                setPasswordError(
                                                    ""
                                                );
                                            }}
                                            placeholder="Entrez votre ancien mot de passe"
                                            autoComplete="current-password"
                                            disabled={
                                                passwordLoading
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="admin-settings-password-toggle"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword
                                                )
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Masquer le mot de passe"
                                                    : "Afficher le mot de passe"
                                            }
                                            disabled={
                                                passwordLoading
                                            }
                                        >
                                            {showCurrentPassword
                                                ? "🙈"
                                                : "👁"}
                                        </button>

                                    </div>

                                </div>


                                {/* Nouveau mot de passe */}

                                <div className="admin-settings-password-field">

                                    <label htmlFor="new-password">
                                        Nouveau mot de passe
                                    </label>

                                    <div className="admin-settings-password-input-wrapper">

                                        <input
                                            id="new-password"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                newPassword
                                            }
                                            onChange={(event) => {
                                                setNewPassword(
                                                    event.target.value
                                                );

                                                setPasswordError(
                                                    ""
                                                );
                                            }}
                                            placeholder="Entrez votre nouveau mot de passe"
                                            autoComplete="new-password"
                                            disabled={
                                                passwordLoading
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="admin-settings-password-toggle"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? "Masquer le mot de passe"
                                                    : "Afficher le mot de passe"
                                            }
                                            disabled={
                                                passwordLoading
                                            }
                                        >
                                            {showNewPassword
                                                ? "🙈"
                                                : "👁"}
                                        </button>

                                    </div>

                                    <small>
                                        Minimum 8 caractères
                                    </small>

                                </div>


                                {/* Confirmation */}

                                <div className="admin-settings-password-field">

                                    <label htmlFor="confirm-password">
                                        Confirmer le nouveau mot de passe
                                    </label>

                                    <div className="admin-settings-password-input-wrapper">

                                        <input
                                            id="confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(event) => {
                                                setConfirmPassword(
                                                    event.target.value
                                                );

                                                setPasswordError(
                                                    ""
                                                );
                                            }}
                                            placeholder="Confirmez votre nouveau mot de passe"
                                            autoComplete="new-password"
                                            disabled={
                                                passwordLoading
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="admin-settings-password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Masquer le mot de passe"
                                                    : "Afficher le mot de passe"
                                            }
                                            disabled={
                                                passwordLoading
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "🙈"
                                                : "👁"}
                                        </button>

                                    </div>

                                </div>


                                {/* Actions */}

                                <div className="admin-settings-password-actions">

                                    <button
                                        type="submit"
                                        className="admin-settings-password-submit"
                                        disabled={
                                            passwordLoading ||
                                            passwordSuccess
                                        }
                                    >

                                        {passwordLoading ? (
                                            <>
                                                <span className="admin-settings-spinner"></span>
                                                Modification...
                                            </>
                                        ) : (
                                            <>
                                                <span>
                                                    🔐
                                                </span>

                                                Modifier le mot de passe
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>


                        <div className="admin-settings-security-note">

                            <span>
                                🔐
                            </span>

                            <p>
                                Après la modification du mot
                                de passe, vous serez
                                automatiquement déconnecté
                                afin de vous reconnecter avec
                                vos nouvelles informations.
                            </p>

                        </div>

                    </div>


                    <div className="admin-settings-card-footer">

                        <button
                            type="button"
                            className="admin-settings-logout"
                            onClick={handleLogout}
                        >

                            <span>
                                ↪
                            </span>

                            Se déconnecter

                        </button>

                    </div>

                </section>

            </div>


            {/* =================================================
                E — NOTIFICATIONS
            ================================================= */}

            <section className="admin-settings-wide-card">

                <div className="admin-settings-card-header">

                    <div className="admin-settings-card-icon notification">
                        ✉
                    </div>

                    <div>

                        <span>
                            NOTIFICATIONS
                        </span>

                        <h2>
                            Gestion des notifications
                        </h2>

                    </div>

                </div>


                <div className="admin-settings-notification-content">

                    <div className="admin-settings-notification-main">

                        <div className="admin-settings-notification-symbol">
                            ✉
                        </div>

                        <div>

                            <strong>
                                Notifications des messages
                            </strong>

                            <p>
                                Lorsqu'un visiteur utilise le
                                formulaire de contact, une
                                notification est envoyée par
                                votre serveur Spring Boot.
                            </p>

                        </div>

                    </div>


                    <div className="admin-settings-notification-status">

                        <span>
                            État
                        </span>

                        <strong
                            className={
                                notifications
                                    ? "enabled"
                                    : "disabled"
                            }
                        >
                            {notifications
                                ? "Activées"
                                : "Désactivées"}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                F — INFORMATIONS SYSTÈME
            ================================================= */}

            <section className="admin-settings-wide-card">

                <div className="admin-settings-card-header">

                    <div className="admin-settings-card-icon system">
                        ◉
                    </div>

                    <div>

                        <span>
                            SYSTÈME
                        </span>

                        <h2>
                            Informations techniques
                        </h2>

                    </div>

                </div>


                <div className="admin-settings-system-grid">

                    <div className="admin-settings-system-item">

                        <span>
                            Frontend
                        </span>

                        <strong>
                            React + Vite
                        </strong>

                        <small>
                            Application web
                        </small>

                    </div>


                    <div className="admin-settings-system-item">

                        <span>
                            Backend
                        </span>

                        <strong>
                            Spring Boot
                        </strong>

                        <small>
                            API REST
                        </small>

                    </div>


                    <div className="admin-settings-system-item">

                        <span>
                            Base de données
                        </span>

                        <strong>
                            MySQL
                        </strong>

                        <small>
                            Persistence des données
                        </small>

                    </div>


                    <div className="admin-settings-system-item">

                        <span>
                            Authentification
                        </span>

                        <strong>
                            JWT
                        </strong>

                        <small>
                            Accès administrateur
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                G — ZONE SENSIBLE
            ================================================= */}

            <section className="admin-settings-danger-zone">

                <div>

                    <span className="admin-settings-danger-label">
                        ZONE SENSIBLE
                    </span>

                    <h2>
                        Gestion de la session
                    </h2>

                    <p>
                        La déconnexion supprimera votre session
                        administrateur actuelle de cet appareil.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Se déconnecter
                </button>

            </section>


            {/* =================================================
                H — ACCÈS RAPIDES
            ================================================= */}

            <section className="admin-settings-quick">

                <div className="admin-settings-quick-header">

                    <div>

                        <span>
                            RACCOURCIS
                        </span>

                        <h2>
                            Accès rapides
                        </h2>

                    </div>

                </div>



                <div className="admin-settings-quick-grid">

                    {/* Tableau de bord */}

                    <button
                        type="button"
                        onClick={() =>
                            goTo("/admin")
                        }
                    >

                        <span>
                            ⌂
                        </span>

                        <div>

                            <strong>
                                Tableau de bord
                            </strong>

                            <small>
                                Retour à la vue d'ensemble
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </button>


                    {/* Projets */}

                    <button
                        type="button"
                        onClick={() =>
                            goTo("/admin/projets")
                        }
                    >

                        <span>
                            ▣
                        </span>

                        <div>

                            <strong>
                                Projets
                            </strong>

                            <small>
                                Gérer vos projets
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </button>


                    {/* Parcours */}

                    <button
                        type="button"
                        onClick={() =>
                            goTo("/admin/parcours")
                        }
                    >

                        <span>
                            ◎
                        </span>

                        <div>

                            <strong>
                                Parcours
                            </strong>

                            <small>
                                Gérer votre parcours
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </button>

                    {/* Compétences */}

                    <button
                        type="button"
                        onClick={() =>
                            goTo("/admin/competences")
                        }
                    >

                        <span>
                            ◆
                        </span>

                        <div>

                            <strong>
                                Compétences
                            </strong>

                            <small>
                                Gérer vos compétences et technologies
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </button>


                    {/* Messages */}

                    <button
                        type="button"
                        onClick={() =>
                            goTo("/admin/messages")
                        }
                    >

                        <span>
                            ✉
                        </span>

                        <div>

                            <strong>
                                Messages
                            </strong>

                            <small>
                                Consulter les messages
                            </small>

                        </div>

                        <b>
                            →
                        </b>

                    </button>

                </div>


            </section>

        </div>
    );
}

export default AdminSettings;