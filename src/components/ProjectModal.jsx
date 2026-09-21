import {
    useEffect,
    useRef,
} from "react";

import { createPortal } from "react-dom";

import { useLanguage } from "../context/useLanguage";

function ProjectModal({ project, onClose }) {
    const { t } = useLanguage();

    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    /*
     * ==========================================
     * STATUT DU PROJET
     * ==========================================
     */

    const isOnline = project.status === "online";

    const statusLabel = isOnline
        ? t("projects.online") || "En ligne"
        : t("projects.development") ||
          "En développement";

    /*
     * ==========================================
     * GESTION DU FOCUS + CLAVIER + SCROLL
     * ==========================================
     */

    useEffect(() => {
        previousFocusRef.current =
            document.activeElement;

        const focusTimer = setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            /*
             * ESC → fermer la modal
             */
            if (event.key === "Escape") {
                event.preventDefault();

                onClose();

                return;
            }

            /*
             * TAB → garder le focus dans la modal
             */
            if (event.key === "Tab") {
                const modal =
                    modalRef.current;

                if (!modal) {
                    return;
                }

                const focusableElements =
                    modal.querySelectorAll(
                        `
                        button:not([disabled]),
                        a[href],
                        input:not([disabled]),
                        textarea:not([disabled]),
                        select:not([disabled]),
                        [tabindex]:not([tabindex="-1"])
                        `
                    );

                if (!focusableElements.length) {
                    return;
                }

                const firstElement =
                    focusableElements[0];

                const lastElement =
                    focusableElements[
                        focusableElements.length - 1
                    ];

                /*
                 * TAB sur le dernier élément
                 * → revenir au premier.
                 */
                if (
                    !event.shiftKey &&
                    document.activeElement ===
                        lastElement
                ) {
                    event.preventDefault();

                    firstElement.focus();
                }

                /*
                 * SHIFT + TAB sur le premier élément
                 * → revenir au dernier.
                 */
                if (
                    event.shiftKey &&
                    document.activeElement ===
                        firstElement
                ) {
                    event.preventDefault();

                    lastElement.focus();
                }
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        /*
         * Nettoyage à la fermeture.
         */
        return () => {
            clearTimeout(focusTimer);

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                previousOverflow;

            previousFocusRef.current?.focus();

            previousFocusRef.current = null;
        };
    }, [onClose]);

    /*
     * ==========================================
     * CLIC SUR L'ARRIÈRE-PLAN
     * ==========================================
     */

    const handleOverlayClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose();
        }
    };

    /*
     * ==========================================
     * EFFET 3D SUR L'IMAGE
     * ==========================================
     */

    const handleImageMove = (event) => {
        const imageContainer =
            event.currentTarget;

        const rect =
            imageContainer.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const rotateY =
            ((x - rect.width / 2) /
                (rect.width / 2)) *
            3;

        const rotateX =
            ((y - rect.height / 2) /
                (rect.height / 2)) *
            -3;

        imageContainer.style.setProperty(
            "--modal-image-x",
            `${rotateY}deg`
        );

        imageContainer.style.setProperty(
            "--modal-image-y",
            `${rotateX}deg`
        );
    };

    /*
     * Réinitialiser l'effet 3D.
     */
    const handleImageLeave = (event) => {
        event.currentTarget.style.setProperty(
            "--modal-image-x",
            "0deg"
        );

        event.currentTarget.style.setProperty(
            "--modal-image-y",
            "0deg"
        );
    };

    /*
     * ==========================================
     * MODAL
     * ==========================================
     */

    return createPortal(
        <div
            className="project-modal-overlay"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="project-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`project-title-${project.id}`}
                aria-describedby={`project-description-${project.id}`}
            >
                {/* =================================
                    HALOS DÉCORATIFS
                ================================== */}

                <div
                    className="project-modal-glow project-modal-glow-one"
                    aria-hidden="true"
                />

                <div
                    className="project-modal-glow project-modal-glow-two"
                    aria-hidden="true"
                />

                {/* =================================
                    BOUTON FERMER
                ================================== */}

                <button
                    ref={closeButtonRef}
                    type="button"
                    className="project-modal-close"
                    onClick={onClose}
                    aria-label={t(
                        "projects.close"
                    )}
                    title={t("projects.close")}
                >
                    <span>×</span>
                </button>

                {/* =================================
                    CONTENU PRINCIPAL
                ================================== */}

                <div className="project-modal-layout">
                    {/* =================================
                        IMAGE
                    ================================== */}

                    {project.image && (
                        <div
                            className="project-modal-visual"
                            onMouseMove={
                                handleImageMove
                            }
                            onMouseLeave={
                                handleImageLeave
                            }
                        >
                            <div className="project-modal-visual-inner">
                                <img
                                    src={project.image}
                                    alt={`${t(
                                        "projects.preview"
                                    )} ${project.title}`}
                                />

                                <div
                                    className="project-modal-image-shine"
                                    aria-hidden="true"
                                />

                                <div className="project-modal-image-label">
                                    <span>
                                        {t(
                                            "projects.preview"
                                        )}
                                    </span>

                                    <strong>
                                        {String(
                                            project.id
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =================================
                        INFORMATIONS
                    ================================== */}

                    <div className="project-modal-content">
                        {/* HEADER */}

                        <div className="project-modal-header">
                            <div>
                                <span className="project-modal-type">
                                    {project.type}
                                </span>

                                <span className="project-modal-index">
                                    PROJECT /
                                    {String(
                                        project.id
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>
                            </div>

                            <div className="project-modal-status">
                                <span
                                    className={
                                        isOnline
                                            ? "status-dot online"
                                            : "status-dot development"
                                    }
                                />

                                {statusLabel}
                            </div>
                        </div>

                        {/* TITRE */}

                        <h2
                            id={`project-title-${project.id}`}
                        >
                            {project.title}
                        </h2>

                        {/* DESCRIPTION */}

                        <p
                            id={`project-description-${project.id}`}
                            className="project-modal-description"
                        >
                            {project.description}
                        </p>

                        {/* =================================
                            TECHNOLOGIES
                        ================================== */}

                        <div className="project-modal-section">
                            <div className="project-modal-section-heading">
                                <span>01</span>

                                <h3>
                                    {t(
                                        "projects.technologies"
                                    )}
                                </h3>
                            </div>

                            <div className="project-modal-technologies">
                                {project.technologies.map(
                                    (
                                        technology,
                                        index
                                    ) => (
                                        <span
                                            key={`${technology}-${index}`}
                                            style={{
                                                "--modal-tech-index":
                                                    index,
                                            }}
                                        >
                                            <span className="project-modal-tech-dot" />

                                            {technology}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* =================================
                            À PROPOS
                        ================================== */}

                        <div className="project-modal-section">
                            <div className="project-modal-section-heading">
                                <span>02</span>

                                <h3>
                                    {t(
                                        "projects.aboutProject"
                                    )}
                                </h3>
                            </div>

                            <p className="project-modal-about">
                                {t(
                                    "projects.aboutProjectDescription"
                                )}
                            </p>
                        </div>

                        {/* =================================
                            ACTIONS
                        ================================== */}

                        <div className="project-modal-actions">
                            {/* LIEN PROJET */}

                            {project.demo && (
                                <a
                                    href={
                                        project.demo
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-modal-action project-modal-action-primary"
                                >
                                    <span>
                                        {t(
                                            "projects.viewProject"
                                        )}
                                    </span>

                                    <span className="project-modal-action-icon">
                                        ↗
                                    </span>
                                </a>
                            )}

                            {/* GITHUB */}

                            {project.github && (
                                <a
                                    href={
                                        project.github
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-modal-action project-modal-action-secondary"
                                >
                                    <span>
                                        GitHub
                                    </span>

                                    <span className="project-modal-action-icon">
                                        ↗
                                    </span>
                                </a>
                            )}

                            {/* PROJET EN DÉVELOPPEMENT */}

                            {!project.demo &&
                                !project.github && (
                                    <span className="project-modal-development">
                                        {t(
                                            "projects.inDevelopment"
                                        )}
                                    </span>
                                )}
                        </div>
                    </div>
                </div>

                {/* =================================
                    BARRE INFÉRIEURE
                ================================== */}

                <div className="project-modal-bottom">
                    <span>
                        FRÉJUS ADJANOHOUN
                    </span>

                    <span>
                        {String(
                            project.id
                        ).padStart(
                            2,
                            "0"
                        )}{" "}
                        / PROJECT
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ProjectModal;