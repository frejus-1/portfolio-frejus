import { useState } from "react";
import projects from "../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function Projects() {
    const { t } = useLanguage();

    const [activeFilter, setActiveFilter] = useState("Tous");
    const [selectedProject, setSelectedProject] = useState(null);
    const [filterKey, setFilterKey] = useState(0);

    const filters = [
        "Tous",
        "Frontend",
        "Backend",
        "Mobile",
        "Full Stack",
    ];

    const filterLabels = {
        Tous: t.projects.all,
        Frontend: t.projects.frontend,
        Backend: t.projects.backend,
        Mobile: t.projects.mobile,
        "Full Stack": t.projects.fullStack,
    };

    const filteredProjects =
        activeFilter === "Tous"
            ? projects
            : projects.filter(
                (project) => project.type === activeFilter
            );

    const handleFilterChange = (filter) => {
        if (filter === activeFilter) {
            return;
        }

        setActiveFilter(filter);
        setFilterKey((previousKey) => previousKey + 1);
    };

    return (
        <section id="projets" className="section projects-section">
            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        {t.projects.title}
                    </p>

                    <h2>
                        {t.projects.heading}
                    </h2>

                    <p>
                        {t.projects.subtitle}
                    </p>
                </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
                <div
                    className="project-filters"
                    aria-label={t.projects.filterLabel}
                >
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            className={
                                activeFilter === filter
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleFilterChange(filter)
                            }
                        >
                            {filterLabels[filter]}
                        </button>
                    ))}
                </div>
            </ScrollReveal>

            <div
                key={filterKey}
                className="projects-grid projects-grid-filtered"
            >
                {filteredProjects.map((project, index) => (
                    <ScrollReveal
                        key={project.id}
                        direction={
                            index % 2 === 0
                                ? "left"
                                : "right"
                        }
                        delay={100 + index * 100}
                    >
                        <ProjectCard
                            project={project}
                            onOpen={setSelectedProject}
                        />
                    </ScrollReveal>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <ScrollReveal direction="up">
                    <p className="projects-empty">
                        {t.projects.empty}
                    </p>
                </ScrollReveal>
            )}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}

export default Projects;
