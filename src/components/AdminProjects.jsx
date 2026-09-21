import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../services/projectService";

import {
    getRole,
    logout,
} from "../services/authService";

import "../styles/AdminProjects.css";

const API_BASE_URL = "http://localhost:8080";

const emptyForm = {
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
    githubUrl: "",
    liveUrl: "",
    technologies: "",
    featured: false,
    type: "Frontend",
    status: "development",
};

const modalTabs = [
    {
        id: "informations",
        label: "Informations",
    },
    {
        id: "descriptions",
        label: "Descriptions",
    },
    {
        id: "image",
        label: "Image",
    },
    {
        id: "liens",
        label: "Liens & technologies",
    },
];

const filterTabs = [
    {
        id: "all",
        label: "Tous",
    },
    {
        id: "online",
        label: "En ligne",
    },
    {
        id: "development",
        label: "En développement",
    },
    {
        id: "featured",
        label: "Mis en avant",
    },
];

const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function getImageUrl(imageUrl) {
    if (!imageUrl) {
        return "";
    }

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        return imageUrl;
    }

    if (imageUrl.startsWith("/uploads/")) {
        return `${API_BASE_URL}${imageUrl}`;
    }

    return imageUrl;
}

function getStatusLabel(status) {
    switch (status) {
        case "online":
            return "En ligne";

        case "development":
            return "En développement";

        case "completed":
            return "Terminé";

        case "archived":
            return "Archivé";

        default:
            return status || "Non défini";
    }
}

function getTypeLabel(type) {
    return type || "Projet";
}

function AdminProjects() {
    const navigate = useNavigate();

    /*
     * =========================================================
     * ÉTATS
     * =========================================================
     */

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [editingId, setEditingId] = useState(null);
    const [projectToDelete, setProjectToDelete] =
        useState(null);

    const [modalTab, setModalTab] =
        useState("informations");

    const [form, setForm] = useState(emptyForm);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] =
        useState("");

    const [message, setMessage] = useState(null);

    /*
     * =========================================================
     * CHARGEMENT DES PROJETS
     * =========================================================
     *
     * Important :
     * - loadProjects est déclaré AVANT le useEffect.
     * - Aucun setLoading(true) synchronique ici.
     * - loading commence déjà à true.
     */

    const loadProjects = useCallback(async () => {
        try {
            const data = await getProjects();

            setProjects(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(error);

            setMessage({
                type: "error",
                text:
                    error.message ||
                    "Impossible de charger les projets.",
            });

            const errorMessage =
                error.message?.toLowerCase() || "";

            if (
                errorMessage.includes(
                    "administrateur"
                ) ||
                errorMessage.includes("401") ||
                errorMessage.includes("403")
            ) {
                logout();
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    /*
     * =========================================================
     * CHARGEMENT INITIAL
     * =========================================================
     */

    useEffect(() => {
        const currentRole = getRole();

        if (currentRole !== "ADMIN") {
            navigate("/login");
            return;
        }

        const timer = setTimeout(() => {
            loadProjects();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [navigate, loadProjects]);

    /*
     * =========================================================
     * DISPARITION AUTOMATIQUE DES MESSAGES
     * =========================================================
     */

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setMessage(null);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [message]);

    /*
     * =========================================================
     * TOUCHE ESCAPE
     * =========================================================
     */

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape") {
                return;
            }

            if (
                showDeleteModal &&
                !deleting
            ) {
                setShowDeleteModal(false);
                setProjectToDelete(null);
                return;
            }

            if (
                showModal &&
                !saving
            ) {
                setShowModal(false);
                setEditingId(null);

                setForm({
                    ...emptyForm,
                });

                setImageFile(null);
                setImagePreview("");
                setModalTab("informations");
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [
        showModal,
        showDeleteModal,
        saving,
        deleting,
    ]);

    /*
     * =========================================================
     * BLOQUER LE SCROLL AVEC UNE MODALE
     * =========================================================
     */

    useEffect(() => {
        document.body.style.overflow =
            showModal || showDeleteModal
                ? "hidden"
                : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [
        showModal,
        showDeleteModal,
    ]);

    /*
     * =========================================================
     * MESSAGES
     * =========================================================
     */

    function showSuccess(text) {
        setMessage({
            type: "success",
            text,
        });
    }

    function showError(text) {
        setMessage({
            type: "error",
            text,
        });
    }

    /*
     * =========================================================
     * FORMULAIRE
     * =========================================================
     */

    function handleInputChange(event) {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    }

    /*
     * =========================================================
     * OUVRIR MODALE CRÉATION
     * =========================================================
     */

    function openCreateModal() {
        setEditingId(null);

        setForm({
            ...emptyForm,
        });

        setImageFile(null);
        setImagePreview("");

        setModalTab("informations");
        setShowModal(true);
    }

    /*
     * =========================================================
     * OUVRIR MODALE MODIFICATION
     * =========================================================
     */

    function openEditModal(project) {
        setEditingId(project.id);

        setForm({
            titleFr: project.titleFr || "",
            titleEn: project.titleEn || "",
            descriptionFr:
                project.descriptionFr || "",
            descriptionEn:
                project.descriptionEn || "",
            githubUrl:
                project.githubUrl || "",
            liveUrl:
                project.liveUrl || "",
            technologies:
                project.technologies || "",
            featured:
                Boolean(project.featured),
            type:
                project.type || "Frontend",
            status:
                project.status ||
                "development",
        });

        setImageFile(null);

        setImagePreview(
            getImageUrl(
                project.imageUrl
            )
        );

        setModalTab("informations");
        setShowModal(true);
    }

    /*
     * =========================================================
     * FERMER MODALE PROJET
     * =========================================================
     */

    function closeProjectModal() {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingId(null);

        setForm({
            ...emptyForm,
        });

        setImageFile(null);
        setImagePreview("");
        setModalTab("informations");
    }

    /*
     * =========================================================
     * IMAGE
     * =========================================================
     */

    function handleImageChange(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            !ALLOWED_IMAGE_TYPES.includes(
                file.type
            )
        ) {
            showError(
                "Format non autorisé. Utilisez PNG, JPG, JPEG, WEBP ou GIF."
            );

            event.target.value = "";
            return;
        }

        if (
            file.size >
            MAX_IMAGE_SIZE
        ) {
            showError(
                "L'image ne doit pas dépasser 5 Mo."
            );

            event.target.value = "";
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    }

    /*
     * =========================================================
     * VALIDATION
     * =========================================================
     */

    function validateForm() {
        if (!form.titleFr.trim()) {
            showError(
                "Le titre français est obligatoire."
            );

            setModalTab(
                "informations"
            );

            return false;
        }

        if (!form.titleEn.trim()) {
            showError(
                "Le titre anglais est obligatoire."
            );

            setModalTab(
                "informations"
            );

            return false;
        }

        if (
            !form.descriptionFr.trim()
        ) {
            showError(
                "La description française est obligatoire."
            );

            setModalTab(
                "descriptions"
            );

            return false;
        }

        if (
            !form.descriptionEn.trim()
        ) {
            showError(
                "La description anglaise est obligatoire."
            );

            setModalTab(
                "descriptions"
            );

            return false;
        }

        if (
            !form.technologies.trim()
        ) {
            showError(
                "Veuillez renseigner les technologies utilisées."
            );

            setModalTab("liens");

            return false;
        }

        return true;
    }

    /*
     * =========================================================
     * ENREGISTRER / MODIFIER
     * =========================================================
     */

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const projectData = {
                titleFr:
                    form.titleFr.trim(),

                titleEn:
                    form.titleEn.trim(),

                descriptionFr:
                    form.descriptionFr.trim(),

                descriptionEn:
                    form.descriptionEn.trim(),

                githubUrl:
                    form.githubUrl.trim(),

                liveUrl:
                    form.liveUrl.trim(),

                technologies:
                    form.technologies.trim(),

                featured:
                    form.featured,

                type:
                    form.type,

                status:
                    form.status,
            };

            let savedProject;

            /*
             * MODIFICATION
             */

            if (editingId) {
                savedProject =
                    await updateProject(
                        editingId,
                        projectData,
                        imageFile
                    );

                setProjects(
                    (previous) =>
                        previous.map(
                            (project) =>
                                project.id ===
                                    editingId
                                    ? savedProject
                                    : project
                        )
                );

                showSuccess(
                    "Le projet a été modifié avec succès."
                );
            }

            /*
             * CRÉATION
             */

            else {
                savedProject =
                    await createProject(
                        projectData,
                        imageFile
                    );

                setProjects(
                    (previous) => [
                        savedProject,
                        ...previous,
                    ]
                );

                showSuccess(
                    "Le projet a été ajouté avec succès."
                );
            }

            closeProjectModal();
        } catch (error) {
            console.error(error);

            showError(
                error.message ||
                "Une erreur est survenue pendant l'enregistrement."
            );

            const errorMessage =
                error.message?.toLowerCase() ||
                "";

            if (
                errorMessage.includes(
                    "administrateur"
                ) ||
                errorMessage.includes(
                    "401"
                ) ||
                errorMessage.includes(
                    "403"
                )
            ) {
                logout();
                navigate("/login");
            }
        } finally {
            setSaving(false);
        }
    }

    /*
     * =========================================================
     * SUPPRESSION
     * =========================================================
     */

    function openDeleteModal(project) {
        setProjectToDelete(project);
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        if (deleting) {
            return;
        }

        setShowDeleteModal(false);
        setProjectToDelete(null);
    }

    async function confirmDelete() {
        if (!projectToDelete) {
            return;
        }

        try {
            setDeleting(true);

            await deleteProject(
                projectToDelete.id
            );

            setProjects(
                (previous) =>
                    previous.filter(
                        (project) =>
                            project.id !==
                            projectToDelete.id
                    )
            );

            showSuccess(
                "Le projet a été supprimé avec succès."
            );

            closeDeleteModal();
        } catch (error) {
            console.error(error);

            showError(
                error.message ||
                "Impossible de supprimer le projet."
            );

            const errorMessage =
                error.message?.toLowerCase() ||
                "";

            if (
                errorMessage.includes(
                    "administrateur"
                ) ||
                errorMessage.includes(
                    "401"
                ) ||
                errorMessage.includes(
                    "403"
                )
            ) {
                logout();
                navigate("/login");
            }
        } finally {
            setDeleting(false);
        }
    }

    /*
     * =========================================================
     * FILTRAGE
     * =========================================================
     */

    const filteredProjects =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return projects.filter(
                (project) => {
                    const titleFr =
                        project.titleFr?.toLowerCase() ||
                        "";

                    const titleEn =
                        project.titleEn?.toLowerCase() ||
                        "";

                    const technologies =
                        project.technologies?.toLowerCase() ||
                        "";

                    const type =
                        project.type?.toLowerCase() ||
                        "";

                    const matchesSearch =
                        !normalizedSearch ||
                        titleFr.includes(
                            normalizedSearch
                        ) ||
                        titleEn.includes(
                            normalizedSearch
                        ) ||
                        technologies.includes(
                            normalizedSearch
                        ) ||
                        type.includes(
                            normalizedSearch
                        );

                    let matchesFilter =
                        true;

                    if (
                        activeFilter ===
                        "online"
                    ) {
                        matchesFilter =
                            project.status ===
                            "online";
                    }

                    if (
                        activeFilter ===
                        "development"
                    ) {
                        matchesFilter =
                            project.status ===
                            "development";
                    }

                    if (
                        activeFilter ===
                        "featured"
                    ) {
                        matchesFilter =
                            project.featured ===
                            true;
                    }

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );
        }, [
            projects,
            search,
            activeFilter,
        ]);

    /*
     * =========================================================
     * STATISTIQUES
     * =========================================================
     */

    const onlineCount =
        projects.filter(
            (project) =>
                project.status ===
                "online"
        ).length;

    const developmentCount =
        projects.filter(
            (project) =>
                project.status ===
                "development"
        ).length;

    const featuredCount =
        projects.filter(
            (project) =>
                project.featured
        ).length;

    /*
     * =========================================================
     * INTERFACE
     * =========================================================
     */

    return (
        <main className="admin-projects-page">
            <div className="admin-projects-container">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="admin-projects-header">
                    <div>
                        <span className="admin-projects-eyebrow">
                            Administration
                        </span>

                        <h1>
                            Mes projets
                        </h1>

                        <p>
                            Gérez les projets
                            présentés sur votre
                            portfolio.
                        </p>
                    </div>

                    <div className="admin-projects-header-actions">

                        <button
                            type="button"
                            className="admin-projects-secondary-button"
                            onClick={() =>
                                navigate(
                                    "/admin"
                                )
                            }
                        >
                            ← Tableau de bord
                        </button>

                        <button
                            type="button"
                            className="admin-projects-primary-button"
                            onClick={
                                openCreateModal
                            }
                        >
                            <span>+</span>
                            Nouveau projet
                        </button>

                    </div>
                </header>

                {/* =====================================================
                    MESSAGE
                ===================================================== */}

                {message && (
                    <div
                        className={`admin-projects-message ${message.type}`}
                        role="status"
                    >
                        <div className="admin-projects-message-icon">
                            {message.type ===
                                "success"
                                ? "✓"
                                : "!"}
                        </div>

                        <div className="admin-projects-message-content">
                            <strong>
                                {message.type ===
                                    "success"
                                    ? "Opération réussie"
                                    : "Une erreur est survenue"}
                            </strong>

                            <span>
                                {message.text}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setMessage(
                                    null
                                )
                            }
                            aria-label="Fermer le message"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* =====================================================
                    STATISTIQUES
                ===================================================== */}

                <section className="admin-projects-stats">

                    <div className="admin-project-stat">
                        <span className="admin-project-stat-icon">
                            ◈
                        </span>

                        <div>
                            <strong>
                                {
                                    projects.length
                                }
                            </strong>

                            <span>
                                Total projets
                            </span>
                        </div>
                    </div>

                    <div className="admin-project-stat">
                        <span className="admin-project-stat-icon">
                            ↗
                        </span>

                        <div>
                            <strong>
                                {
                                    onlineCount
                                }
                            </strong>

                            <span>
                                En ligne
                            </span>
                        </div>
                    </div>

                    <div className="admin-project-stat">
                        <span className="admin-project-stat-icon">
                            ◷
                        </span>

                        <div>
                            <strong>
                                {
                                    developmentCount
                                }
                            </strong>

                            <span>
                                En développement
                            </span>
                        </div>
                    </div>

                    <div className="admin-project-stat">
                        <span className="admin-project-stat-icon">
                            ★
                        </span>

                        <div>
                            <strong>
                                {
                                    featuredCount
                                }
                            </strong>

                            <span>
                                Mis en avant
                            </span>
                        </div>
                    </div>

                </section>

                {/* =====================================================
                    FILTRES
                ===================================================== */}

                <section className="admin-projects-toolbar">

                    <div className="admin-projects-tabs">

                        {filterTabs.map(
                            (tab) => (
                                <button
                                    key={
                                        tab.id
                                    }
                                    type="button"
                                    className={
                                        activeFilter ===
                                            tab.id
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveFilter(
                                            tab.id
                                        )
                                    }
                                >
                                    {
                                        tab.label
                                    }

                                    <span>
                                        {tab.id ===
                                            "all" &&
                                            projects.length}

                                        {tab.id ===
                                            "online" &&
                                            onlineCount}

                                        {tab.id ===
                                            "development" &&
                                            developmentCount}

                                        {tab.id ===
                                            "featured" &&
                                            featuredCount}
                                    </span>
                                </button>
                            )
                        )}

                    </div>

                    <div className="admin-projects-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="search"
                            placeholder="Rechercher un projet..."
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch(
                                        ""
                                    )
                                }
                                aria-label="Effacer la recherche"
                            >
                                ×
                            </button>
                        )}

                    </div>

                </section>

                {/* =====================================================
                    LISTE DES PROJETS
                ===================================================== */}

                <section className="admin-projects-content">

                    {loading ? (
                        <div className="admin-projects-loading">

                            <div className="admin-projects-spinner" />

                            <p>
                                Chargement des
                                projets...
                            </p>

                        </div>
                    ) : filteredProjects.length ===
                        0 ? (
                        <div className="admin-projects-empty">

                            <div className="admin-projects-empty-icon">
                                ◇
                            </div>

                            <h2>
                                {projects.length ===
                                    0
                                    ? "Aucun projet"
                                    : "Aucun résultat"}
                            </h2>

                            <p>
                                {projects.length ===
                                    0
                                    ? "Commencez par ajouter votre premier projet."
                                    : "Aucun projet ne correspond à vos critères de recherche."}
                            </p>

                            {projects.length ===
                                0 ? (
                                <button
                                    type="button"
                                    className="admin-projects-primary-button"
                                    onClick={
                                        openCreateModal
                                    }
                                >
                                    +
                                    Ajouter un
                                    projet
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="admin-projects-secondary-button"
                                    onClick={() => {
                                        setSearch(
                                            ""
                                        );

                                        setActiveFilter(
                                            "all"
                                        );
                                    }}
                                >
                                    Réinitialiser
                                    les filtres
                                </button>
                            )}

                        </div>
                    ) : (
                        <div className="admin-projects-grid">

                            {filteredProjects.map(
                                (project) => {
                                    const imageUrl =
                                        getImageUrl(
                                            project.imageUrl
                                        );

                                    return (
                                        <article
                                            className="admin-project-card"
                                            key={
                                                project.id
                                            }
                                        >

                                            {/* IMAGE */}

                                            <div className="admin-project-card-image">

                                                {imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            project.titleFr ||
                                                            "Projet"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="admin-project-no-image">

                                                        <span>
                                                            ◈
                                                        </span>

                                                        <small>
                                                            Aucune
                                                            image
                                                        </small>

                                                    </div>
                                                )}

                                                <div className="admin-project-card-top">

                                                    <span
                                                        className={`admin-project-status ${project.status}`}
                                                    >
                                                        {getStatusLabel(
                                                            project.status
                                                        )}
                                                    </span>

                                                    {project.featured && (
                                                        <span className="admin-project-featured">
                                                            ★
                                                            Mis
                                                            en
                                                            avant
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                            {/* CONTENU */}

                                            <div className="admin-project-card-body">

                                                <div className="admin-project-card-meta">

                                                    <span>
                                                        {getTypeLabel(
                                                            project.type
                                                        )}
                                                    </span>

                                                    <span>
                                                        #
                                                        {
                                                            project.id
                                                        }
                                                    </span>

                                                </div>

                                                <h2>
                                                    {project.titleFr ||
                                                        "Projet sans titre"}
                                                </h2>

                                                {project.titleEn && (
                                                    <p className="admin-project-card-title-en">
                                                        {
                                                            project.titleEn
                                                        }
                                                    </p>
                                                )}

                                                <p className="admin-project-card-description">
                                                    {project.descriptionFr ||
                                                        "Aucune description disponible."}
                                                </p>

                                                {project.technologies && (
                                                    <div className="admin-project-technologies">

                                                        {project.technologies
                                                            .split(
                                                                ","
                                                            )
                                                            .map(
                                                                (
                                                                    technology,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={`${project.id}-${technology.trim()}-${index}`}
                                                                    >
                                                                        {technology.trim()}
                                                                    </span>
                                                                )
                                                            )}

                                                    </div>
                                                )}

                                                <div className="admin-project-card-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-project-edit-button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        ✎
                                                        Modifier
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-project-delete-button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                project
                                                            )
                                                        }
                                                    >
                                                        🗑
                                                        Supprimer
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>

            </div>

            {/* =========================================================
                MODALE AJOUT / MODIFICATION
            ========================================================= */}

            {showModal && (
                <div
                    className="admin-project-modal-overlay"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget &&
                            !saving
                        ) {
                            closeProjectModal();
                        }
                    }}
                >

                    <div className="admin-project-modal">

                        {/* HEADER */}

                        <div className="admin-project-modal-header">

                            <div>

                                <span className="admin-projects-eyebrow">
                                    {editingId
                                        ? "Modification"
                                        : "Création"}
                                </span>

                                <h2>
                                    {editingId
                                        ? "Modifier le projet"
                                        : "Ajouter un projet"}
                                </h2>

                                <p>
                                    Renseignez les
                                    informations
                                    de votre
                                    projet.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="admin-project-modal-close"
                                onClick={
                                    closeProjectModal
                                }
                                disabled={
                                    saving
                                }
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </div>

                        {/* ONGLETS */}

                        <div className="admin-project-modal-tabs">

                            {modalTabs.map(
                                (tab) => (
                                    <button
                                        key={
                                            tab.id
                                        }
                                        type="button"
                                        className={
                                            modalTab ===
                                                tab.id
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setModalTab(
                                                tab.id
                                            )
                                        }
                                    >
                                        {
                                            tab.label
                                        }
                                    </button>
                                )
                            )}

                        </div>

                        {/* FORMULAIRE */}

                        <form
                            className="admin-project-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="admin-project-modal-content">

                                {/* =================================================
                                    INFORMATIONS
                                ================================================= */}

                                {modalTab ===
                                    "informations" && (
                                        <div className="admin-project-form-section">

                                            <div className="admin-project-form-grid">

                                                <label>
                                                    <span>
                                                        Titre
                                                        français
                                                        *
                                                    </span>

                                                    <input
                                                        type="text"
                                                        name="titleFr"
                                                        value={
                                                            form.titleFr
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Ex : CampusLib"
                                                        required
                                                    />
                                                </label>

                                                <label>
                                                    <span>
                                                        Titre
                                                        anglais
                                                        *
                                                    </span>

                                                    <input
                                                        type="text"
                                                        name="titleEn"
                                                        value={
                                                            form.titleEn
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        placeholder="Ex : CampusLib"
                                                        required
                                                    />
                                                </label>

                                                <label>
                                                    <span>
                                                        Type *
                                                    </span>

                                                    <select
                                                        name="type"
                                                        value={
                                                            form.type
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        <option value="Frontend">
                                                            Frontend
                                                        </option>

                                                        <option value="Backend">
                                                            Backend
                                                        </option>

                                                        <option value="Full Stack">
                                                            Full
                                                            Stack
                                                        </option>

                                                        <option value="Mobile">
                                                            Mobile
                                                        </option>

                                                        <option value="Desktop">
                                                            Desktop
                                                        </option>

                                                        <option value="Autre">
                                                            Autre
                                                        </option>
                                                    </select>
                                                </label>

                                                <label>
                                                    <span>
                                                        Statut *
                                                    </span>

                                                    <select
                                                        name="status"
                                                        value={
                                                            form.status
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    >
                                                        <option value="development">
                                                            En
                                                            développement
                                                        </option>

                                                        <option value="online">
                                                            En ligne
                                                        </option>

                                                        <option value="completed">
                                                            Terminé
                                                        </option>

                                                        <option value="archived">
                                                            Archivé
                                                        </option>
                                                    </select>
                                                </label>

                                            </div>

                                            <label className="admin-project-checkbox">

                                                <input
                                                    type="checkbox"
                                                    name="featured"
                                                    checked={
                                                        form.featured
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                />

                                                <span className="admin-project-checkbox-custom" />

                                                <span>

                                                    <strong>
                                                        Mettre
                                                        en
                                                        avant
                                                        ce
                                                        projet
                                                    </strong>

                                                    <small>
                                                        Le
                                                        projet
                                                        pourra
                                                        être
                                                        présenté
                                                        comme
                                                        projet
                                                        principal
                                                        sur le
                                                        portfolio.
                                                    </small>

                                                </span>

                                            </label>

                                        </div>
                                    )}

                                {/* =================================================
                                    DESCRIPTIONS
                                ================================================= */}

                                {modalTab ===
                                    "descriptions" && (
                                        <div className="admin-project-form-section">

                                            <div className="admin-project-language-label">
                                                <span>
                                                    FR
                                                </span>

                                                Français
                                            </div>

                                            <label>
                                                <span>
                                                    Description
                                                    française
                                                    *
                                                </span>

                                                <textarea
                                                    name="descriptionFr"
                                                    value={
                                                        form.descriptionFr
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                    placeholder="Décrivez le projet, son objectif, les fonctionnalités principales..."
                                                    rows="7"
                                                    required
                                                />
                                            </label>

                                            <div className="admin-project-language-label">
                                                <span>
                                                    EN
                                                </span>

                                                English
                                            </div>

                                            <label>
                                                <span>
                                                    Description
                                                    anglaise
                                                    *
                                                </span>

                                                <textarea
                                                    name="descriptionEn"
                                                    value={
                                                        form.descriptionEn
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                    placeholder="Describe the project, its purpose and main features..."
                                                    rows="7"
                                                    required
                                                />
                                            </label>

                                        </div>
                                    )}

                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                {modalTab ===
                                    "image" && (
                                        <div className="admin-project-form-section">

                                            <div className="admin-project-upload">

                                                <input
                                                    id="project-image"
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                                    onChange={
                                                        handleImageChange
                                                    }
                                                />

                                                <label
                                                    htmlFor="project-image"
                                                    className="admin-project-upload-zone"
                                                >

                                                    <span className="admin-project-upload-icon">
                                                        ↑
                                                    </span>

                                                    <strong>
                                                        Cliquez
                                                        pour
                                                        choisir
                                                        une
                                                        image
                                                    </strong>

                                                    <small>
                                                        PNG,
                                                        JPG,
                                                        JPEG,
                                                        WEBP
                                                        ou
                                                        GIF
                                                        —
                                                        5 Mo
                                                        maximum
                                                    </small>

                                                </label>

                                            </div>

                                            {imagePreview ? (
                                                <div className="admin-project-image-preview">

                                                    <div className="admin-project-image-preview-header">

                                                        <strong>
                                                            Aperçu
                                                        </strong>

                                                        {imageFile && (
                                                            <span>
                                                                {
                                                                    imageFile.name
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                    <div className="admin-project-preview-image">

                                                        <img
                                                            src={
                                                                imagePreview
                                                            }
                                                            alt="Aperçu du projet"
                                                        />

                                                    </div>

                                                </div>
                                            ) : (
                                                <div className="admin-project-no-preview">

                                                    <span>
                                                        ◈
                                                    </span>

                                                    <p>
                                                        Aucune
                                                        image
                                                        sélectionnée
                                                    </p>

                                                </div>
                                            )}

                                            <p className="admin-project-upload-help">
                                                {editingId
                                                    ? "Laissez ce champ vide pour conserver l'image actuelle."
                                                    : "L'image est facultative. Vous pourrez également l'ajouter plus tard."}
                                            </p>

                                        </div>
                                    )}

                                {/* =================================================
                                    LIENS & TECHNOLOGIES
                                ================================================= */}

                                {modalTab ===
                                    "liens" && (
                                        <div className="admin-project-form-section">

                                            <label>
                                                <span>
                                                    Technologies
                                                    *
                                                </span>

                                                <input
                                                    type="text"
                                                    name="technologies"
                                                    value={
                                                        form.technologies
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                    placeholder="React, Spring Boot, MySQL, JWT"
                                                    required
                                                />

                                                <small className="admin-project-field-help">
                                                    Séparez
                                                    les
                                                    technologies
                                                    par des
                                                    virgules.
                                                </small>
                                            </label>

                                            <label>
                                                <span>
                                                    URL
                                                    GitHub
                                                </span>

                                                <input
                                                    type="url"
                                                    name="githubUrl"
                                                    value={
                                                        form.githubUrl
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                    placeholder="https://github.com/..."
                                                />
                                            </label>

                                            <label>
                                                <span>
                                                    URL du
                                                    projet
                                                </span>

                                                <input
                                                    type="url"
                                                    name="liveUrl"
                                                    value={
                                                        form.liveUrl
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </label>

                                        </div>
                                    )}

                            </div>

                            {/* FOOTER */}

                            <div className="admin-project-modal-footer">

                                <button
                                    type="button"
                                    className="admin-projects-secondary-button"
                                    onClick={
                                        closeProjectModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="admin-projects-primary-button"
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving ? (
                                        <>
                                            <span className="admin-project-button-spinner" />
                                            Enregistrement...
                                        </>
                                    ) : editingId ? (
                                        "Enregistrer les modifications"
                                    ) : (
                                        "Créer le projet"
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =========================================================
                MODALE SUPPRESSION
            ========================================================= */}

            {showDeleteModal &&
                projectToDelete && (
                    <div
                        className="admin-project-modal-overlay admin-project-delete-overlay"
                        onMouseDown={(
                            event
                        ) => {
                            if (
                                event.target ===
                                event.currentTarget &&
                                !deleting
                            ) {
                                closeDeleteModal();
                            }
                        }}
                    >

                        <div className="admin-project-delete-modal">

                            <div className="admin-project-delete-icon">
                                !
                            </div>

                            <h2>
                                Supprimer le projet ?
                            </h2>

                            <p>
                                Vous êtes sur le
                                point de supprimer{" "}
                                <strong>
                                    {
                                        projectToDelete.titleFr
                                    }
                                </strong>
                                .
                            </p>

                            <p className="admin-project-delete-warning">
                                Cette action est
                                définitive.
                                L'image associée
                                sera également
                                supprimée du
                                serveur.
                            </p>

                            <div className="admin-project-delete-actions">

                                <button
                                    type="button"
                                    className="admin-projects-secondary-button"
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    Annuler
                                </button>

                                <button
                                    type="button"
                                    className="admin-project-delete-confirm"
                                    onClick={
                                        confirmDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    {deleting
                                        ? "Suppression..."
                                        : "Oui, supprimer"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </main>
    );
}

export default AdminProjects;