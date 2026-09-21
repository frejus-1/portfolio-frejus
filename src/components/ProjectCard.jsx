import { useRef } from "react";
import { useLanguage } from "../context/useLanguage";

function ProjectCard({ project, onOpen }) {
    const { t } = useLanguage();

    const cardRef = useRef(null);

    /*
     * ==========================================
     * EFFET 3D DE LA CARTE
     * ==========================================
     */

    const handleMouseMove = (event) => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        if (
            event.target.closest(
                ".project-details-button, .project-demo-link"
            )
        ) {
            return;
        }

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -5;

        const rotateY =
            ((x - centerX) / centerX) * 5;

        const lightX =
            (x / rect.width) * 100;

        const lightY =
            (y / rect.height) * 100;

        card.style.setProperty(
            "--rotate-x",
            `${rotateX}deg`
        );

        card.style.setProperty(
            "--rotate-y",
            `${rotateY}deg`
        );

        card.style.setProperty(
            "--mouse-x",
            `${lightX}%`
        );

        card.style.setProperty(
            "--mouse-y",
            `${lightY}%`
        );

        card.style.setProperty(
            "--card-scale",
            "1.015"
        );
    };

    /*
     * ==========================================
     * RÉINITIALISATION DE LA CARTE
     * ==========================================
     */

    const resetCardTransform = () => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        card.style.setProperty(
            "--rotate-x",
            "0deg"
        );

        card.style.setProperty(
            "--rotate-y",
            "0deg"
        );

        card.style.setProperty(
            "--mouse-x",
            "50%"
        );

        card.style.setProperty(
            "--mouse-y",
            "50%"
        );

        card.style.setProperty(
            "--card-scale",
            "1"
        );
    };

    /*
     * ==========================================
     * SOURIS QUITTE LA CARTE
     * ==========================================
     */

    const handleMouseLeave = () => {
        resetCardTransform();
    };

    /*
     * ==========================================
     * SOURIS ENTRE SUR UNE ACTION
     * ==========================================
     */

    const handleActionMouseEnter = () => {
        resetCardTransform();
    };

    /*
     * ==========================================
     * STATUT DU PROJET
     * ==========================================
     */

    const isOnline =
        project.status === "online";

    const statusLabel = isOnline
        ? t("projects.online") || "En ligne"
        : t("projects.development") ||
          "En développement";

    return (
        <article
            ref={cardRef}
            className="project-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* ==================================
                IMAGE DU PROJET
            ================================== */}

            {project.image && (
                <div className="project-card-image">
                    <img
                        src={project.image}
                        alt={`${t(
                            "projects.preview"
                        )} ${project.title}`}
                        loading="lazy"
                    />

                    <div
                        className="project-card-image-shine"
                        aria-hidden="true"
                    />

                    <div
                        className="project-card-image-overlay"
                        aria-hidden="true"
                    >
                        <span>
                            {t(
                                "projects.viewProject"
                            )}
                        </span>
                    </div>

                    <div className="project-card-floating-number">
                        {String(project.id).padStart(
                            2,
                            "0"
                        )}
                    </div>
                </div>
            )}

            {/* ==================================
                CONTENU
            ================================== */}

            <div className="project-card-content">
                {/* ==================================
                    EN-TÊTE
                ================================== */}

                <div className="project-card-top">
                    <span className="project-type">
                        {project.type}
                    </span>

                    <span className="project-number">
                        {String(project.id).padStart(
                            2,
                            "0"
                        )}
                    </span>
                </div>

                {/* ==================================
                    STATUT
                ================================== */}

                <div className="project-status">
                    <span
                        className={
                            isOnline
                                ? "status-dot online"
                                : "status-dot development"
                        }
                    />

                    {statusLabel}
                </div>

                {/* ==================================
                    TITRE
                ================================== */}

                <h3>{project.title}</h3>

                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <p className="project-card-description">
                    {project.description}
                </p>

                {/* ==================================
                    TECHNOLOGIES
                ================================== */}

                <div className="project-technologies">
                    {project.technologies.map(
                        (
                            technology,
                            index
                        ) => (
                            <span
                                key={`${technology}-${index}`}
                                style={{
                                    "--tech-index":
                                        index,
                                }}
                            >
                                {technology}
                            </span>
                        )
                    )}
                </div>

                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="project-card-footer">
                    <button
                        type="button"
                        className="project-details-button"
                        onMouseEnter={
                            handleActionMouseEnter
                        }
                        onClick={() =>
                            onOpen(project)
                        }
                    >
                        <span>
                            {t(
                                "projects.details"
                            )}
                        </span>

                        <span className="project-button-arrow">
                            →
                        </span>
                    </button>

                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-demo-link"
                            onMouseEnter={
                                handleActionMouseEnter
                            }
                        >
                            <span>
                                {t(
                                    "projects.viewProject"
                                )}
                            </span>

                            <span>↗</span>
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;