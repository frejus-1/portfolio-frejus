import { useEffect } from "react";
import { useLanguage } from "../context/useLanguage";

function ProjectModal({ project, onClose }) {
    const { t } = useLanguage();

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
                    aria-label={t.projects.close}
                >
                    ×
                </button>

                {project.image && (
                    <div className="project-modal-image">
                        <img
                            src={project.image}
                            alt={`${t.projects.preview} ${project.title}`}
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
                    <h3>{t.projects.technologies}</h3>

                    <div className="project-technologies">
                        {project.technologies.map((technology) => (
                            <span key={technology}>
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="project-modal-section">
                    <h3>{t.projects.aboutProject}</h3>

                    <p>
                        {t.projects.aboutProjectDescription}
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
                            {t.projects.viewProject}
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
                            {t.projects.inDevelopment}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;

