import { useEffect } from "react";

function ProjectModal({ project, onClose }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    return (
        <div
            className="project-modal-overlay"
            onClick={onClose}
        >
            <div
                className="project-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`project-title-${project.id}`}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="project-modal-close"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ×
                </button>

                {project.image && (
                    <div className="project-modal-image">
                        <img
                            src={project.image}
                            alt={`Aperçu du projet ${project.title}`}
                        />
                    </div>
                )}

                <div className="project-modal-header">
                    <span className="project-type">
                        {project.type}
                    </span>

                    <span className="project-number">
                        {String(project.id).padStart(2, "0")}
                    </span>
                </div>

                <div className="project-modal-status">
                    <span
                        className={
                            project.status === "En ligne"
                                ? "status-dot online"
                                : "status-dot development"
                        }
                    ></span>

                    {project.status}
                </div>

                <h2 id={`project-title-${project.id}`}>
                    {project.title}
                </h2>

                <p className="project-modal-description">
                    {project.description}
                </p>

                <div className="project-modal-section">
                    <h3>Technologies</h3>

                    <div className="project-technologies">
                        {project.technologies.map((technology) => (
                            <span key={technology}>
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="project-modal-section">
                    <h3>À propos du projet</h3>

                    <p>
                        Ce projet fait partie de mon parcours
                        d'apprentissage et me permet de mettre en
                        pratique les technologies utilisées ainsi que
                        les principes de conception d'applications
                        modernes.
                    </p>
                </div>

                <div className="project-modal-actions">
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-primary"
                        >
                            Voir le projet
                            <span>↗</span>
                        </a>
                    )}

                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-secondary"
                        >
                            GitHub
                            <span>↗</span>
                        </a>
                    )}

                    {!project.demo && !project.github && (
                        <span className="project-modal-development">
                            Projet actuellement en développement.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;