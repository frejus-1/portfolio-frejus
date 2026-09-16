import { useLanguage } from "../context/useLanguage";

function ProjectCard({ project, onOpen }) {
    const { t } = useLanguage();

    return (
        <article className="project-card">
            {project.image && (
                <div className="project-card-image">
                    <img
                        src={project.image}
                        alt={`${t.projects.preview} ${project.title}`}
                        loading="lazy"
                    />

                    <div className="project-card-image-overlay">
                        <span>
                            {t.projects.viewProject}
                        </span>
                    </div>
                </div>
            )}

            <div className="project-card-content">
                <div className="project-card-top">
                    <span className="project-type">
                        {project.type}
                    </span>

                    <span className="project-number">
                        {String(project.id).padStart(2, "0")}
                    </span>
                </div>

                <div className="project-status">
                    <span
                        className={
                            project.status === "En ligne"
                                ? "status-dot online"
                                : "status-dot development"
                        }
                    ></span>

                    {project.status}
                </div>

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="project-technologies">
                    {project.technologies.map((technology) => (
                        <span key={technology}>
                            {technology}
                        </span>
                    ))}
                </div>

                <div className="project-card-footer">
                    <button
                        type="button"
                        className="project-details-button"
                        onClick={() => onOpen(project)}
                    >
                        {t.projects.details}
                        <span>→</span>
                    </button>

                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t.projects.viewProject} ↗
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;
