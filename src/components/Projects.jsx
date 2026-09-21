import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";
import { getProjects } from "../services/projectService";

/*
 * =========================================================
 * NORMALISATION DES PROJETS
 * =========================================================
 */

function normalizeProject(project, language) {
    const technologies = project.technologies
        ? project.technologies
              .split(",")
              .map((technology) => technology.trim())
              .filter(Boolean)
        : [];

    return {
        ...project,

        title:
            language === "fr"
                ? project.titleFr
                : project.titleEn,

        description:
            language === "fr"
                ? project.descriptionFr
                : project.descriptionEn,

        image: project.imageUrl,

        github: project.githubUrl,

        demo: project.liveUrl,

        technologies,

        type: project.type,

        status: project.status,
    };
}

/*
 * =========================================================
 * COMPOSANT PROJECTS
 * =========================================================
 */

function Projects() {
    const { language, t } = useLanguage();

    const [projects, setProjects] = useState([]);

    const [activeFilter, setActiveFilter] =
        useState("Tous");

    const [selectedProject, setSelectedProject] =
        useState(null);

    const [filterKey, setFilterKey] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
     * =====================================================
     * RÉCUPÉRATION DES PROJETS
     * =====================================================
     */

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProjects();

                const normalizedProjects =
                    Array.isArray(data)
                        ? data.map((project) =>
                              normalizeProject(
                                  project,
                                  language
                              )
                          )
                        : [];

                setProjects(normalizedProjects);
            } catch (err) {
                console.error(
                    "Erreur lors du chargement des projets :",
                    err
                );

                setError(
                    language === "fr"
                        ? "Impossible de charger les projets."
                        : "Unable to load projects."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [language]);

    /*
     * =====================================================
     * FILTRES
     * =====================================================
     */

    const filters = [
        "Tous",
        "Frontend",
        "Backend",
        "Mobile",
        "Full Stack",
    ];

    /*
     * =====================================================
     * LIBELLÉS DES FILTRES
     * =====================================================
     */

    const filterLabels = {
        Tous:
            t("projects.all") ||
            "Tous",

        Frontend:
            t("projects.frontend") ||
            "Frontend",

        Backend:
            t("projects.backend") ||
            "Backend",

        Mobile:
            t("projects.mobile") ||
            "Mobile",

        "Full Stack":
            t("projects.fullStack") ||
            "Full Stack",
    };

    /*
     * =====================================================
     * FILTRAGE
     * =====================================================
     */

    const filteredProjects =
        activeFilter === "Tous"
            ? projects
            : projects.filter(
                  (project) =>
                      project.type ===
                      activeFilter
              );

    /*
     * =====================================================
     * CHANGEMENT DE FILTRE
     * =====================================================
     */

    const handleFilterChange = (filter) => {
        if (filter === activeFilter) {
            return;
        }

        setActiveFilter(filter);

        setFilterKey(
            (previousKey) =>
                previousKey + 1
        );
    };

    /*
     * =====================================================
     * AFFICHAGE
     * =====================================================
     */

    return (
        <section
            id="projets"
            className="section projects-section"
        >
            {/* =============================================
                TITRE DE LA SECTION
            ============================================== */}

            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        {t("projects.title")}
                    </p>

                    <h2>
                        {t("projects.heading")}
                    </h2>

                    <p>
                        {t("projects.subtitle")}
                    </p>
                </div>
            </ScrollReveal>

            {/* =============================================
                FILTRES
            ============================================== */}

            <ScrollReveal
                direction="up"
                delay={150}
            >
                <div
                    className="project-filters"
                    aria-label={t(
                        "projects.filterLabel"
                    )}
                >
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            className={
                                activeFilter ===
                                filter
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                handleFilterChange(
                                    filter
                                )
                            }
                        >
                            {
                                filterLabels[
                                    filter
                                ]
                            }
                        </button>
                    ))}
                </div>
            </ScrollReveal>

            {/* =============================================
                CHARGEMENT
            ============================================== */}

            {loading && (
                <ScrollReveal direction="up">
                    <div className="projects-empty">
                        {language === "fr"
                            ? "Chargement des projets..."
                            : "Loading projects..."}
                    </div>
                </ScrollReveal>
            )}

            {/* =============================================
                ERREUR
            ============================================== */}

            {!loading && error && (
                <ScrollReveal direction="up">
                    <div className="projects-empty">
                        {error}

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            {language === "fr"
                                ? "Réessayer"
                                : "Try again"}
                        </button>
                    </div>
                </ScrollReveal>
            )}

            {/* =============================================
                PROJETS
            ============================================== */}

            {!loading &&
                !error &&
                filteredProjects.length > 0 && (
                    <div
                        key={filterKey}
                        className="projects-grid projects-grid-filtered"
                    >
                        {filteredProjects.map(
                            (
                                project,
                                index
                            ) => (
                                <ScrollReveal
                                    key={
                                        project.id
                                    }
                                    direction={
                                        index %
                                            2 ===
                                        0
                                            ? "left"
                                            : "right"
                                    }
                                    delay={
                                        100 +
                                        index *
                                            100
                                    }
                                >
                                    <ProjectCard
                                        project={
                                            project
                                        }
                                        onOpen={
                                            setSelectedProject
                                        }
                                    />
                                </ScrollReveal>
                            )
                        )}
                    </div>
                )}

            {/* =============================================
                AUCUN PROJET
            ============================================== */}

            {!loading &&
                !error &&
                filteredProjects.length ===
                    0 && (
                    <ScrollReveal direction="up">
                        <p className="projects-empty">
                            {t(
                                "projects.empty"
                            )}
                        </p>
                    </ScrollReveal>
                )}

            {/* =============================================
                MODAL
            ============================================== */}

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() =>
                        setSelectedProject(
                            null
                        )
                    }
                />
            )}
        </section>
    );
}

export default Projects;