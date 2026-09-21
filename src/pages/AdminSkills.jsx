import {
    createElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import "../styles/AdminSkills.css";

import { getAuthHeaders } from "../services/authService";

import {
    getSkillIcon,
    skillIconLibrary,
} from "../data/skillIconLibrary";


const API_BASE_URL = "http://localhost:8080/api";

const SKILLS_API_URL = `${API_BASE_URL}/skills`;
const CATEGORIES_API_URL = `${API_BASE_URL}/skill-categories`;


/*
 * =========================================================
 * CONSTANTES
 * =========================================================
 */

const LANGUAGES = [
    {
        value: "fr",
        label: "Français",
    },
    {
        value: "en",
        label: "English",
    },
];

const ICON_CATEGORIES = [
    "Tous",
    ...new Set(
        skillIconLibrary
            .map((item) => item.category)
            .filter(Boolean)
    ),
];


/*
 * =========================================================
 * FORMULAIRES PAR DÉFAUT
 * =========================================================
 */

const createEmptySkillForm = () => ({
    categoryId: "",
    niveau: 0,
    ordre: 0,
    actif: true,
    featured: false,
    iconType: "library",
    iconValue: "",

    translations: {
        fr: {
            title: "",
            description: "",
        },
        en: {
            title: "",
            description: "",
        },
    },
});


const createEmptyCategoryForm = () => ({
    ordre: 0,
    actif: true,
    iconValue: "folder",

    translations: {
        fr: {
            title: "",
            description: "",
        },
        en: {
            title: "",
            description: "",
        },
    },
});


/*
 * =========================================================
 * UTILITAIRES
 * =========================================================
 */

const getTranslation = (
    translations = [],
    language
) => {
    if (!Array.isArray(translations)) {
        return {
            title: "",
            description: "",
        };
    }

    const normalizedLanguage =
        String(language || "fr").toLowerCase();

    const translation = translations.find(
        (item) =>
            String(item?.language || "").toLowerCase() ===
            normalizedLanguage
    );

    return {
        title: translation?.title ?? "",
        description: translation?.description ?? "",
    };
};


const normalizeSkillForForm = (skill) => ({
    categoryId: skill?.categoryId ?? "",
    niveau: skill?.niveau ?? 0,
    ordre: skill?.ordre ?? 0,
    actif: skill?.actif ?? true,
    featured: skill?.featured ?? false,
    iconType: skill?.iconType ?? "library",
    iconValue: skill?.iconValue ?? "",

    translations: {
        fr: getTranslation(
            skill?.translations,
            "fr"
        ),
        en: getTranslation(
            skill?.translations,
            "en"
        ),
    },
});


const normalizeCategoryForForm = (category) => ({
    ordre: category?.ordre ?? 0,
    actif: category?.actif ?? true,
    iconValue: category?.iconValue ?? "folder",

    translations: {
        fr: getTranslation(
            category?.translations,
            "fr"
        ),
        en: getTranslation(
            category?.translations,
            "en"
        ),
    },
});


const getCategoryTitle = (
    category,
    language = "fr"
) => {
    const currentTranslation =
        getTranslation(
            category?.translations,
            language
        );

    if (currentTranslation.title.trim()) {
        return currentTranslation.title;
    }

    const fallbackLanguage =
        language === "fr"
            ? "en"
            : "fr";

    const fallbackTranslation =
        getTranslation(
            category?.translations,
            fallbackLanguage
        );

    return (
        fallbackTranslation.title ||
        "Catégorie sans nom"
    );
};


const getSkillTitle = (
    skill,
    language = "fr"
) => {
    const currentTranslation =
        getTranslation(
            skill?.translations,
            language
        );

    if (currentTranslation.title.trim()) {
        return currentTranslation.title;
    }

    const fallbackLanguage =
        language === "fr"
            ? "en"
            : "fr";

    const fallbackTranslation =
        getTranslation(
            skill?.translations,
            fallbackLanguage
        );

    return (
        fallbackTranslation.title ||
        "Compétence sans nom"
    );
};


/*
 * =========================================================
 * COMPOSANT ICÔNE
 * =========================================================
 */

function SkillIcon({
    value,
    size = 24,
    className = "",
}) {
    const IconComponent = getSkillIcon(value);

    if (!IconComponent) {
        return (
            <span
                className={`skill-icon-fallback ${className}`}
                style={{
                    fontSize: size,
                }}
                aria-hidden="true"
            >
                ?
            </span>
        );
    }

    return createElement(
        IconComponent,
        {
            size,
            className,
            "aria-hidden": true,
        }
    );
}


/*
 * =========================================================
 * SÉLECTEUR D'ICÔNES
 * =========================================================
 */

function IconPicker({
    value,
    onChange,
}) {
    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState("Tous");

    const filteredIcons = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return skillIconLibrary.filter(
            (item) => {
                const matchesCategory =
                    category === "Tous" ||
                    item.category === category;

                if (!matchesCategory) {
                    return false;
                }

                if (!normalizedSearch) {
                    return true;
                }

                const searchableText = [
                    item.value,
                    item.label,
                    item.category,
                    ...(item.keywords || []),
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    normalizedSearch
                );
            }
        );
    }, [search, category]);

    const selectedIcon =
        skillIconLibrary.find(
            (item) =>
                item.value === value
        );

    return (
        <div className="skill-icon-picker">

            <div className="skill-icon-selected">

                <div className="skill-icon-selected-preview">
                    {value ? (
                        <SkillIcon
                            value={value}
                            size={34}
                        />
                    ) : (
                        <span>?</span>
                    )}
                </div>

                <div className="skill-icon-selected-info">

                    <strong>
                        {selectedIcon?.label ||
                            "Aucune icône sélectionnée"}
                    </strong>

                    <span>
                        {value
                            ? `library / ${value}`
                            : "Sélectionnez une icône"}
                    </span>

                </div>

            </div>


            <div className="skill-icon-search-row">

                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Rechercher une icône..."
                    className="skill-input"
                />

                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(
                            event.target.value
                        )
                    }
                    className="skill-input"
                >
                    {ICON_CATEGORIES.map(
                        (item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        )
                    )}
                </select>

            </div>


            <div className="skill-icon-count">

                {filteredIcons.length} icône
                {filteredIcons.length > 1
                    ? "s"
                    : ""}{" "}
                disponible
                {filteredIcons.length > 1
                    ? "s"
                    : ""}

            </div>


            <div className="skill-icon-grid">

                {filteredIcons.map(
                    (item) => {

                        const isSelected =
                            item.value === value;

                        return (
                            <button
                                type="button"
                                key={item.value}
                                className={`skill-icon-option ${
                                    isSelected
                                        ? "is-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    onChange(
                                        item.value
                                    )
                                }
                                title={`${item.label} — ${item.category}`}
                            >

                                <SkillIcon
                                    value={
                                        item.value
                                    }
                                    size={27}
                                />

                                <span>
                                    {item.label}
                                </span>

                            </button>
                        );
                    }
                )}


                {filteredIcons.length ===
                    0 && (
                        <div className="skill-icon-empty">

                            <strong>
                                Aucune icône trouvée
                            </strong>

                            <span>
                                Essayez un autre
                                mot-clé ou une
                                autre catégorie.
                            </span>

                        </div>
                    )}

            </div>

        </div>
    );
}


/*
 * =========================================================
 * COMPOSANT PRINCIPAL
 * =========================================================
 */

export default function AdminSkills() {

    /*
     * =====================================================
     * ÉTAT GLOBAL
     * =====================================================
     */

    const [activeTab, setActiveTab] =
        useState("skills");

    const [language, setLanguage] =
        useState("fr");

    const [skills, setSkills] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [featuredFilter, setFeaturedFilter] =
        useState("all");


    /*
     * =====================================================
     * FORMULAIRES
     * =====================================================
     */

    const [skillForm, setSkillForm] =
        useState(
            createEmptySkillForm()
        );

    const [categoryForm, setCategoryForm] =
        useState(
            createEmptyCategoryForm()
        );


    const [editingSkillId, setEditingSkillId] =
        useState(null);

    const [editingCategoryId, setEditingCategoryId] =
        useState(null);


    /*
     * =====================================================
     * MODALS
     * =====================================================
     */

    const [showSkillModal, setShowSkillModal] =
        useState(false);

    const [showCategoryModal, setShowCategoryModal] =
        useState(false);


    /*
     * =====================================================
     * REQUÊTE API
     * =====================================================
     */

    const apiRequest = useCallback(
        async (
            url,
            options = {}
        ) => {

            const response =
                await fetch(
                    url,
                    {
                        ...options,

                        cache:
                            options.cache ||
                            "no-store",

                        headers: {
                            Accept:
                                "application/json",

                            ...(options.body
                                ? {
                                    "Content-Type":
                                        "application/json",
                                }
                                : {}),

                            ...getAuthHeaders(),

                            ...(options.headers ||
                                {}),
                        },
                    }
                );

            if (
                response.status ===
                204
            ) {
                return null;
            }

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";

            const data =
                contentType.includes(
                    "application/json"
                )
                    ? await response.json()
                    : await response.text();

            if (!response.ok) {

                const message =
                    typeof data ===
                        "object" &&
                        data !== null
                        ? data.message ||
                        data.error ||
                        "Une erreur est survenue."
                        : data ||
                        "Une erreur est survenue.";

                throw new Error(
                    message
                );
            }

            return data;
        },
        []
    );


    /*
     * =====================================================
     * CHARGEMENT DES DONNÉES
     *
     * IMPORTANT :
     * On charge toutes les compétences pour permettre
     * la gestion des compétences inactives.
     * =====================================================
     */

    const loadData = useCallback(
        async () => {

            setLoading(true);
            setError("");

            try {

                const [
                    categoriesData,
                    skillsData,
                ] = await Promise.all([
                    apiRequest(
                        CATEGORIES_API_URL
                    ),
                    apiRequest(
                        SKILLS_API_URL
                    ),
                ]);

                setCategories(
                    Array.isArray(
                        categoriesData
                    )
                        ? categoriesData
                        : []
                );

                setSkills(
                    Array.isArray(
                        skillsData
                    )
                        ? skillsData
                        : []
                );

            } catch (err) {

                console.error(
                    "Erreur chargement AdminSkills:",
                    err
                );

                setError(
                    err.message ||
                    "Impossible de charger les compétences."
                );

            } finally {

                setLoading(false);
            }

        },
        [apiRequest]
    );


    /*
     * =====================================================
     * CHARGEMENT INITIAL
     *
     * requestAnimationFrame évite le warning :
     * react-hooks/set-state-in-effect
     * =====================================================
     */

    useEffect(() => {

        let cancelled = false;

        const frame =
            window.requestAnimationFrame(
                () => {

                    if (cancelled) {
                        return;
                    }

                    void loadData();
                }
            );

        return () => {

            cancelled = true;

            window.cancelAnimationFrame(
                frame
            );
        };

    }, [loadData]);


    /*
     * =====================================================
     * RAFRAÎCHISSEMENT EXTERNE
     * =====================================================
     */

    useEffect(() => {

        const handleSkillsUpdated =
            () => {
                void loadData();
            };

        window.addEventListener(
            "skills-data-updated",
            handleSkillsUpdated
        );

        return () => {

            window.removeEventListener(
                "skills-data-updated",
                handleSkillsUpdated
            );
        };

    }, [loadData]);


    /*
     * =====================================================
     * MESSAGES
     * =====================================================
     */

    const showSuccess = useCallback(
        (message) => {

            setSuccess(message);
            setError("");

            window.setTimeout(
                () => setSuccess(""),
                3500
            );
        },
        []
    );


    /*
     * =====================================================
     * FORM SKILL
     * =====================================================
     */

    const updateSkillTranslation = (
        lang,
        field,
        value
    ) => {

        setSkillForm(
            (previous) => ({
                ...previous,

                translations: {
                    ...previous.translations,

                    [lang]: {
                        ...previous
                            .translations[lang],

                        [field]: value,
                    },
                },
            })
        );
    };


    const updateSkillField = (
        field,
        value
    ) => {

        setSkillForm(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );
    };


    /*
     * =====================================================
     * FORM CATEGORY
     * =====================================================
     */

    const updateCategoryTranslation = (
        lang,
        field,
        value
    ) => {

        setCategoryForm(
            (previous) => ({
                ...previous,

                translations: {
                    ...previous.translations,

                    [lang]: {
                        ...previous
                            .translations[lang],

                        [field]: value,
                    },
                },
            })
        );
    };


    const updateCategoryField = (
        field,
        value
    ) => {

        setCategoryForm(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );
    };


    /*
     * =====================================================
     * OUVRIR MODAL SKILL
     * =====================================================
     */

    const openCreateSkill = () => {

        setEditingSkillId(null);

        setSkillForm(
            createEmptySkillForm()
        );

        setLanguage("fr");

        setError("");
        setSuccess("");

        setShowSkillModal(true);
    };


    const openEditSkill = (
        skill
    ) => {

        setEditingSkillId(
            skill.id
        );

        setSkillForm(
            normalizeSkillForForm(
                skill
            )
        );

        setLanguage("fr");

        setError("");
        setSuccess("");

        setShowSkillModal(true);
    };


    /*
     * =====================================================
     * OUVRIR MODAL CATÉGORIE
     * =====================================================
     */

    const openCreateCategory = () => {

        setEditingCategoryId(
            null
        );

        setCategoryForm(
            createEmptyCategoryForm()
        );

        setLanguage("fr");

        setError("");
        setSuccess("");

        setShowCategoryModal(true);
    };


    const openEditCategory = (
        category
    ) => {

        setEditingCategoryId(
            category.id
        );

        setCategoryForm(
            normalizeCategoryForForm(
                category
            )
        );

        setLanguage("fr");

        setError("");
        setSuccess("");

        setShowCategoryModal(true);
    };


    /*
     * =====================================================
     * VALIDATION SKILL
     * =====================================================
     */

    const validateSkillForm = () => {

        if (
            !skillForm.categoryId
        ) {
            return "Veuillez sélectionner une catégorie.";
        }

        if (
            !skillForm.iconValue
        ) {
            return "Veuillez sélectionner une icône.";
        }

        if (
            !skillForm.translations.fr.title.trim()
        ) {
            return "Le titre français est obligatoire.";
        }

        if (
            !skillForm.translations.en.title.trim()
        ) {
            return "Le titre anglais est obligatoire.";
        }

        const niveau =
            Number(
                skillForm.niveau
            );

        if (
            Number.isNaN(niveau) ||
            niveau < 0 ||
            niveau > 100
        ) {
            return "Le niveau doit être compris entre 0 et 100.";
        }

        const ordre =
            Number(
                skillForm.ordre
            );

        if (
            Number.isNaN(ordre) ||
            ordre < 0
        ) {
            return "L'ordre doit être un nombre positif ou nul.";
        }

        return null;
    };


    /*
     * =====================================================
     * ENREGISTRER SKILL
     * =====================================================
     */

    const saveSkill = async (
        event
    ) => {

        event.preventDefault();

        const validationError =
            validateSkillForm();

        if (validationError) {
            setError(
                validationError
            );
            setSuccess("");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const payload = {
                categoryId:
                    Number(
                        skillForm.categoryId
                    ),

                niveau:
                    Number(
                        skillForm.niveau
                    ),

                ordre:
                    Number(
                        skillForm.ordre
                    ),

                actif:
                    Boolean(
                        skillForm.actif
                    ),

                featured:
                    Boolean(
                        skillForm.featured
                    ),

                iconType:
                    "library",

                iconValue:
                    skillForm.iconValue,

                translations: [
                    {
                        language: "fr",

                        title:
                            skillForm
                                .translations
                                .fr
                                .title
                                .trim(),

                        description:
                            skillForm
                                .translations
                                .fr
                                .description
                                .trim(),
                    },

                    {
                        language: "en",

                        title:
                            skillForm
                                .translations
                                .en
                                .title
                                .trim(),

                        description:
                            skillForm
                                .translations
                                .en
                                .description
                                .trim(),
                    },
                ],
            };


            const url =
                editingSkillId
                    ? `${SKILLS_API_URL}/${editingSkillId}`
                    : SKILLS_API_URL;

            const method =
                editingSkillId
                    ? "PUT"
                    : "POST";


            await apiRequest(
                url,
                {
                    method,
                    body: JSON.stringify(
                        payload
                    ),
                }
            );


            await loadData();

            window.dispatchEvent(
                new Event(
                    "skills-data-updated"
                )
            );

            setShowSkillModal(
                false
            );

            showSuccess(
                editingSkillId
                    ? "Compétence modifiée avec succès."
                    : "Compétence créée avec succès."
            );

        } catch (err) {

            console.error(
                "Erreur sauvegarde compétence :",
                err
            );

            setError(
                err.message ||
                "Impossible d'enregistrer la compétence."
            );

        } finally {

            setSaving(false);
        }
    };


    /*
     * =====================================================
     * VALIDATION CATÉGORIE
     * =====================================================
     */

    const validateCategoryForm =
        () => {

            if (
                !categoryForm.translations.fr.title.trim()
            ) {
                return "Le titre français est obligatoire.";
            }

            if (
                !categoryForm.translations.en.title.trim()
            ) {
                return "Le titre anglais est obligatoire.";
            }

            const ordre =
                Number(
                    categoryForm.ordre
                );

            if (
                Number.isNaN(ordre) ||
                ordre < 0
            ) {
                return "L'ordre doit être un nombre positif ou nul.";
            }

            return null;
        };


    /*
     * =====================================================
     * ENREGISTRER CATÉGORIE
     * =====================================================
     */

    const saveCategory = async (
        event
    ) => {

        event.preventDefault();

        const validationError =
            validateCategoryForm();

        if (validationError) {
            setError(
                validationError
            );
            setSuccess("");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const payload = {
                ordre:
                    Number(
                        categoryForm.ordre
                    ),

                actif:
                    Boolean(
                        categoryForm.actif
                    ),

                iconValue:
                    categoryForm.iconValue,

                translations: [
                    {
                        language: "fr",

                        title:
                            categoryForm
                                .translations
                                .fr
                                .title
                                .trim(),

                        description:
                            categoryForm
                                .translations
                                .fr
                                .description
                                .trim(),
                    },

                    {
                        language: "en",

                        title:
                            categoryForm
                                .translations
                                .en
                                .title
                                .trim(),

                        description:
                            categoryForm
                                .translations
                                .en
                                .description
                                .trim(),
                    },
                ],
            };


            const url =
                editingCategoryId
                    ? `${CATEGORIES_API_URL}/${editingCategoryId}`
                    : CATEGORIES_API_URL;

            const method =
                editingCategoryId
                    ? "PUT"
                    : "POST";


            await apiRequest(
                url,
                {
                    method,
                    body: JSON.stringify(
                        payload
                    ),
                }
            );


            await loadData();

            window.dispatchEvent(
                new Event(
                    "skills-data-updated"
                )
            );

            setShowCategoryModal(
                false
            );

            showSuccess(
                editingCategoryId
                    ? "Catégorie modifiée avec succès."
                    : "Catégorie créée avec succès."
            );

        } catch (err) {

            console.error(
                "Erreur sauvegarde catégorie :",
                err
            );

            setError(
                err.message ||
                "Impossible d'enregistrer la catégorie."
            );

        } finally {

            setSaving(false);
        }
    };


    /*
     * =====================================================
     * SUPPRIMER SKILL
     * =====================================================
     */

    const deleteSkill = async (
        skill
    ) => {

        const title =
            getSkillTitle(
                skill,
                "fr"
            );

        const confirmed =
            window.confirm(
                `Voulez-vous vraiment supprimer la compétence "${title}" ?`
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {

            await apiRequest(
                `${SKILLS_API_URL}/${skill.id}`,
                {
                    method: "DELETE",
                }
            );

            await loadData();

            window.dispatchEvent(
                new Event(
                    "skills-data-updated"
                )
            );

            showSuccess(
                "Compétence supprimée."
            );

        } catch (err) {

            console.error(
                "Erreur suppression compétence :",
                err
            );

            setError(
                err.message ||
                "Impossible de supprimer la compétence."
            );
        }
    };


    /*
     * =====================================================
     * SUPPRIMER CATÉGORIE
     * =====================================================
     */

    const deleteCategory = async (
        category
    ) => {

        const categorySkills =
            skills.filter(
                (skill) =>
                    String(
                        skill.categoryId
                    ) ===
                    String(
                        category.id
                    )
            );

        if (
            categorySkills.length >
            0
        ) {
            setError(
                "Cette catégorie contient encore des compétences. Supprimez ou déplacez-les avant de supprimer la catégorie."
            );

            setSuccess("");

            return;
        }

        const title =
            getCategoryTitle(
                category,
                "fr"
            );

        const confirmed =
            window.confirm(
                `Voulez-vous vraiment supprimer la catégorie "${title}" ?`
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {

            await apiRequest(
                `${CATEGORIES_API_URL}/${category.id}`,
                {
                    method: "DELETE",
                }
            );

            await loadData();

            window.dispatchEvent(
                new Event(
                    "skills-data-updated"
                )
            );

            showSuccess(
                "Catégorie supprimée."
            );

        } catch (err) {

            console.error(
                "Erreur suppression catégorie :",
                err
            );

            setError(
                err.message ||
                "Impossible de supprimer la catégorie."
            );
        }
    };


    /*
     * =====================================================
     * COMPÉTENCES D'UNE CATÉGORIE
     * =====================================================
     */

    const getCategorySkills = (
        categoryId
    ) => {

        return skills
            .filter(
                (skill) =>
                    String(
                        skill.categoryId
                    ) ===
                    String(
                        categoryId
                    )
            )
            .sort(
                (a, b) =>
                    Number(a.ordre ?? 0) -
                    Number(b.ordre ?? 0)
            );
    };


    /*
     * =====================================================
     * FILTRAGE DES SKILLS
     * =====================================================
     */

    const filteredSkills =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            const filtered =
                skills.filter(
                    (skill) => {

                        const titleFr =
                            getSkillTitle(
                                skill,
                                "fr"
                            ).toLowerCase();

                        const titleEn =
                            getSkillTitle(
                                skill,
                                "en"
                            ).toLowerCase();

                        const iconValue =
                            String(
                                skill.iconValue ??
                                ""
                            ).toLowerCase();

                        const matchesSearch =
                            !normalizedSearch ||
                            titleFr.includes(
                                normalizedSearch
                            ) ||
                            titleEn.includes(
                                normalizedSearch
                            ) ||
                            iconValue.includes(
                                normalizedSearch
                            );

                        const matchesCategory =
                            !categoryFilter ||
                            String(
                                skill.categoryId
                            ) ===
                            String(
                                categoryFilter
                            );

                        const matchesStatus =
                            statusFilter ===
                            "all" ||
                            (
                                statusFilter ===
                                "active" &&
                                skill.actif
                            ) ||
                            (
                                statusFilter ===
                                "inactive" &&
                                !skill.actif
                            );

                        const matchesFeatured =
                            featuredFilter ===
                            "all" ||
                            (
                                featuredFilter ===
                                "featured" &&
                                skill.featured
                            ) ||
                            (
                                featuredFilter ===
                                "normal" &&
                                !skill.featured
                            );

                        return (
                            matchesSearch &&
                            matchesCategory &&
                            matchesStatus &&
                            matchesFeatured
                        );
                    }
                );

            return filtered.sort(
                (a, b) => {

                    const categoryA =
                        categories.find(
                            (category) =>
                                String(
                                    category.id
                                ) ===
                                String(
                                    a.categoryId
                                )
                        );

                    const categoryB =
                        categories.find(
                            (category) =>
                                String(
                                    category.id
                                ) ===
                                String(
                                    b.categoryId
                                )
                        );

                    const categoryOrder =
                        Number(
                            categoryA?.ordre ?? 0
                        ) -
                        Number(
                            categoryB?.ordre ?? 0
                        );

                    if (
                        categoryOrder !==
                        0
                    ) {
                        return categoryOrder;
                    }

                    return (
                        Number(
                            a.ordre ?? 0
                        ) -
                        Number(
                            b.ordre ?? 0
                        )
                    );
                }
            );

        }, [
            skills,
            categories,
            search,
            categoryFilter,
            statusFilter,
            featuredFilter,
        ]);


    /*
     * =====================================================
     * STATISTIQUES
     * =====================================================
     */

    const statistics =
        useMemo(() => {

            return {
                categories:
                    categories.length,

                activeCategories:
                    categories.filter(
                        (category) =>
                            category.actif
                    ).length,

                skills:
                    skills.length,

                activeSkills:
                    skills.filter(
                        (skill) =>
                            skill.actif
                    ).length,

                featuredSkills:
                    skills.filter(
                        (skill) =>
                            skill.featured &&
                            skill.actif
                    ).length,
            };

        }, [categories, skills]);


    /*
     * =====================================================
     * CHANGEMENT DE LANGUE
     * =====================================================
     */

    const toggleLanguage = () => {
        setLanguage(
            (previous) =>
                previous === "fr"
                    ? "en"
                    : "fr"
        );
    };


    /*
     * =====================================================
     * RENDU
     * =====================================================
     */

    return (
        <div className="admin-skills">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="admin-skills-header">

                <div>

                    <span className="admin-skills-eyebrow">
                        Administration
                    </span>

                    <h1>
                        Compétences
                    </h1>

                    <p>
                        Gérez les catégories,
                        technologies, niveaux,
                        traductions et icônes
                        de votre portfolio.
                    </p>

                </div>


                <div className="admin-skills-header-actions">

                    <button
                        type="button"
                        className="admin-button admin-button-secondary"
                        onClick={
                            toggleLanguage
                        }
                    >
                        {language === "fr"
                            ? "FR"
                            : "EN"}
                    </button>


                    <button
                        type="button"
                        className="admin-button admin-button-primary"
                        onClick={
                            activeTab ===
                                "skills"
                                ? openCreateSkill
                                : openCreateCategory
                        }
                    >
                        <span>+</span>

                        {activeTab ===
                            "skills"
                            ? "Nouvelle compétence"
                            : "Nouvelle catégorie"}

                    </button>

                </div>

            </header>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (
                <div className="admin-alert admin-alert-error">

                    <span>!</span>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        aria-label="Fermer le message d'erreur"
                    >
                        ×
                    </button>

                </div>
            )}


            {success && (
                <div className="admin-alert admin-alert-success">

                    <span>✓</span>

                    <p>
                        {success}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                        aria-label="Fermer le message de succès"
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =================================================
                STATISTIQUES
            ================================================= */}

            <section className="skills-statistics">

                <div className="skills-stat-card">

                    <span className="skills-stat-label">
                        Catégories
                    </span>

                    <strong>
                        {statistics.categories}
                    </strong>

                    <small>
                        {statistics.activeCategories}{" "}
                        actives
                    </small>

                </div>


                <div className="skills-stat-card">

                    <span className="skills-stat-label">
                        Compétences
                    </span>

                    <strong>
                        {statistics.skills}
                    </strong>

                    <small>
                        {statistics.activeSkills}{" "}
                        actives
                    </small>

                </div>


                <div className="skills-stat-card">

                    <span className="skills-stat-label">
                        Featured
                    </span>

                    <strong>
                        {statistics.featuredSkills}
                    </strong>

                    <small>
                        Technologies affichées
                    </small>

                </div>


                <div className="skills-stat-card">

                    <span className="skills-stat-label">
                        Icônes
                    </span>

                    <strong>
                        {skillIconLibrary.length}
                    </strong>

                    <small>
                        Dans la bibliothèque
                    </small>

                </div>

            </section>


            {/* =================================================
                ONGLETS
            ================================================= */}

            <div className="skills-tabs">

                <button
                    type="button"
                    className={
                        activeTab ===
                            "skills"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab(
                            "skills"
                        )
                    }
                >
                    Compétences

                    <span>
                        {skills.length}
                    </span>

                </button>


                <button
                    type="button"
                    className={
                        activeTab ===
                            "categories"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setActiveTab(
                            "categories"
                        )
                    }
                >
                    Catégories

                    <span>
                        {categories.length}
                    </span>

                </button>

            </div>


            {/* =================================================
                CONTENU
            ================================================= */}

            {loading ? (

                <div className="skills-loading">

                    <div className="skills-spinner" />

                    <p>
                        Chargement des compétences...
                    </p>

                </div>

            ) : activeTab ===
                "skills" ? (

                <>

                    {/* =========================================
                        FILTRES
                    ========================================= */}

                    <section className="skills-toolbar">

                        <div className="skills-search">

                            <span>
                                ⌕
                            </span>

                            <input
                                type="search"
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Rechercher une compétence..."
                            />

                        </div>


                        <select
                            value={
                                categoryFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setCategoryFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >

                            <option value="">
                                Toutes les catégories
                            </option>

                            {categories.map(
                                (
                                    category
                                ) => (

                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {getCategoryTitle(
                                            category,
                                            language
                                        )}
                                    </option>

                                )
                            )}

                        </select>


                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >

                            <option value="all">
                                Tous les statuts
                            </option>

                            <option value="active">
                                Actives
                            </option>

                            <option value="inactive">
                                Inactives
                            </option>

                        </select>


                        <select
                            value={
                                featuredFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setFeaturedFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                        >

                            <option value="all">
                                Toutes
                            </option>

                            <option value="featured">
                                Featured
                            </option>

                            <option value="normal">
                                Non featured
                            </option>

                        </select>

                    </section>


                    {/* =========================================
                        LISTE SKILLS
                    ========================================= */}

                    <section className="skills-table-card">

                        <div className="skills-table-header">

                            <div>

                                <h2>
                                    Technologies
                                </h2>

                                <p>
                                    {
                                        filteredSkills.length
                                    }{" "}
                                    résultat
                                    {filteredSkills.length >
                                        1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>

                        </div>


                        {filteredSkills.length ===
                            0 ? (

                            <div className="skills-empty">

                                <div className="skills-empty-icon">
                                    ◇
                                </div>

                                <h3>
                                    Aucune compétence
                                </h3>

                                <p>
                                    Aucune compétence
                                    ne correspond
                                    aux filtres
                                    actuels.
                                </p>

                                <button
                                    type="button"
                                    className="admin-button admin-button-primary"
                                    onClick={
                                        openCreateSkill
                                    }
                                >
                                    Ajouter une compétence
                                </button>

                            </div>

                        ) : (

                            <div className="skills-table-wrapper">

                                <table className="skills-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Technologie
                                            </th>

                                            <th>
                                                Catégorie
                                            </th>

                                            <th>
                                                Niveau
                                            </th>

                                            <th>
                                                Ordre
                                            </th>

                                            <th>
                                                Statut
                                            </th>

                                            <th>
                                                Featured
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredSkills.map(
                                            (
                                                skill
                                            ) => {

                                                const category =
                                                    categories.find(
                                                        (
                                                            item
                                                        ) =>
                                                            String(
                                                                item.id
                                                            ) ===
                                                            String(
                                                                skill.categoryId
                                                            )
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            skill.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="skill-name-cell">

                                                                <div className="skill-list-icon">

                                                                    <SkillIcon
                                                                        value={
                                                                            skill.iconValue
                                                                        }
                                                                        size={
                                                                            26
                                                                        }
                                                                    />

                                                                </div>


                                                                <div>

                                                                    <strong>
                                                                        {getSkillTitle(
                                                                            skill,
                                                                            language
                                                                        )}
                                                                    </strong>

                                                                    <span>
                                                                        {
                                                                            skill.iconValue
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="skill-category-badge">

                                                                {category
                                                                    ? getCategoryTitle(
                                                                        category,
                                                                        language
                                                                    )
                                                                    : "Sans catégorie"}

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="skill-level">

                                                                <div className="skill-level-bar">

                                                                    <span
                                                                        style={{
                                                                            width: `${Math.max(
                                                                                0,
                                                                                Math.min(
                                                                                    100,
                                                                                    Number(
                                                                                        skill.niveau
                                                                                    ) || 0
                                                                                )
                                                                            )}%`,
                                                                        }}
                                                                    />

                                                                </div>

                                                                <strong>
                                                                    {
                                                                        skill.niveau
                                                                    }%
                                                                </strong>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="skill-order">
                                                                {
                                                                    skill.ordre
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={`skill-status ${
                                                                    skill.actif
                                                                        ? "is-active"
                                                                        : "is-inactive"
                                                                }`}
                                                            >
                                                                {skill.actif
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {skill.featured ? (

                                                                <span className="skill-featured">
                                                                    ★ Featured
                                                                </span>

                                                            ) : (

                                                                <span className="skill-not-featured">
                                                                    —
                                                                </span>

                                                            )}

                                                        </td>


                                                        <td>

                                                            <div className="skill-actions">

                                                                <button
                                                                    type="button"
                                                                    className="skill-action-button"
                                                                    onClick={() =>
                                                                        openEditSkill(
                                                                            skill
                                                                        )
                                                                    }
                                                                    title="Modifier"
                                                                    aria-label="Modifier"
                                                                >
                                                                    ✎
                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    className="skill-action-button skill-action-delete"
                                                                    onClick={() =>
                                                                        deleteSkill(
                                                                            skill
                                                                        )
                                                                    }
                                                                    title="Supprimer"
                                                                    aria-label="Supprimer"
                                                                >
                                                                    ×
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </>

            ) : (

                /* =================================================
                   CATÉGORIES
                ================================================= */

                <section className="categories-grid">

                    {categories
                        .slice()
                        .sort(
                            (a, b) =>
                                Number(
                                    a.ordre ?? 0
                                ) -
                                Number(
                                    b.ordre ?? 0
                                )
                        )
                        .map(
                            (
                                category
                            ) => {

                                const categorySkills =
                                    getCategorySkills(
                                        category.id
                                    );

                                return (

                                    <article
                                        className="category-card"
                                        key={
                                            category.id
                                        }
                                    >

                                        <div className="category-card-top">

                                            <div className="category-icon">

                                                <SkillIcon
                                                    value={
                                                        category.iconValue
                                                    }
                                                    size={
                                                        28
                                                    }
                                                />

                                            </div>


                                            <span
                                                className={`skill-status ${
                                                    category.actif
                                                        ? "is-active"
                                                        : "is-inactive"
                                                }`}
                                            >
                                                {category.actif
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </div>


                                        <div className="category-card-content">

                                            <h3>
                                                {getCategoryTitle(
                                                    category,
                                                    language
                                                )}
                                            </h3>

                                            <p>
                                                {getTranslation(
                                                    category.translations,
                                                    language
                                                ).description ||
                                                    "Aucune description."}
                                            </p>

                                        </div>


                                        <div className="category-card-meta">

                                            <span>
                                                {
                                                    categorySkills.length
                                                }{" "}
                                                compétence
                                                {categorySkills.length >
                                                    1
                                                    ? "s"
                                                    : ""}
                                            </span>

                                            <span>
                                                Ordre{" "}
                                                {
                                                    category.ordre
                                                }
                                            </span>

                                        </div>


                                        <div className="category-card-actions">

                                            <button
                                                type="button"
                                                className="admin-button admin-button-secondary"
                                                onClick={() =>
                                                    openEditCategory(
                                                        category
                                                    )
                                                }
                                            >
                                                Modifier
                                            </button>


                                            <button
                                                type="button"
                                                className="admin-button admin-button-danger"
                                                onClick={() =>
                                                    deleteCategory(
                                                        category
                                                    )
                                                }
                                            >
                                                Supprimer
                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}


                    {categories.length ===
                        0 && (

                            <div className="skills-empty">

                                <div className="skills-empty-icon">
                                    ◇
                                </div>

                                <h3>
                                    Aucune catégorie
                                </h3>

                                <p>
                                    Commencez par créer
                                    une catégorie.
                                </p>

                                <button
                                    type="button"
                                    className="admin-button admin-button-primary"
                                    onClick={
                                        openCreateCategory
                                    }
                                >
                                    Créer une catégorie
                                </button>

                            </div>

                        )}

                </section>

            )}


            {/* =================================================
                MODAL SKILL
            ================================================= */}

            {showSkillModal && (

                <div
                    className="skills-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowSkillModal(
                                false
                            );
                        }

                    }}
                >

                    <div
                        className="skills-modal skills-modal-large"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="skills-modal-header">

                            <div>

                                <span>
                                    Compétence
                                </span>

                                <h2>
                                    {editingSkillId
                                        ? "Modifier la compétence"
                                        : "Nouvelle compétence"}
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowSkillModal(
                                        false
                                    )
                                }
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                saveSkill
                            }
                        >

                            <div className="skills-language-tabs">

                                {LANGUAGES.map(
                                    (
                                        item
                                    ) => (

                                        <button
                                            type="button"
                                            key={
                                                item.value
                                            }
                                            className={
                                                language ===
                                                    item.value
                                                    ? "is-active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setLanguage(
                                                    item.value
                                                )
                                            }
                                        >
                                            {item.value.toUpperCase()}
                                        </button>

                                    )
                                )}

                            </div>


                            <div className="skills-modal-body">

                                <div className="skills-form-grid">

                                    <div className="skill-form-group">

                                        <label>
                                            Nom (
                                            {
                                                language
                                            }
                                            )
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                skillForm
                                                    .translations[
                                                    language
                                                ]
                                                    .title
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkillTranslation(
                                                    language,
                                                    "title",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ex : React"
                                        />

                                    </div>


                                    <div className="skill-form-group">

                                        <label>
                                            Catégorie
                                        </label>

                                        <select
                                            value={
                                                skillForm.categoryId
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkillField(
                                                    "categoryId",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Sélectionner...
                                            </option>

                                            {categories
                                                .slice()
                                                .sort(
                                                    (a, b) =>
                                                        Number(
                                                            a.ordre ?? 0
                                                        ) -
                                                        Number(
                                                            b.ordre ?? 0
                                                        )
                                                )
                                                .map(
                                                    (
                                                        category
                                                    ) => (

                                                        <option
                                                            key={
                                                                category.id
                                                            }
                                                            value={
                                                                category.id
                                                            }
                                                        >
                                                            {getCategoryTitle(
                                                                category,
                                                                language
                                                            )}
                                                        </option>

                                                    )
                                                )}

                                        </select>

                                    </div>


                                    <div className="skill-form-group">

                                        <label>
                                            Niveau
                                        </label>

                                        <div className="skill-range-wrapper">

                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={
                                                    skillForm.niveau
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSkillField(
                                                        "niveau",
                                                        Number(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                            />

                                            <strong>
                                                {
                                                    skillForm.niveau
                                                }%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="skill-form-group">

                                        <label>
                                            Ordre
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                skillForm.ordre
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkillField(
                                                    "ordre",
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                <div className="skill-form-group skill-form-full">

                                    <label>
                                        Description (
                                        {
                                            language
                                        }
                                        )
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            skillForm
                                                .translations[
                                                language
                                            ]
                                                .description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateSkillTranslation(
                                                language,
                                                "description",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder={
                                            language ===
                                                "fr"
                                                ? "Description de la technologie..."
                                                : "Technology description..."
                                        }
                                    />

                                </div>


                                <div className="skill-form-options">

                                    <label className="skill-checkbox">

                                        <input
                                            type="checkbox"
                                            checked={
                                                skillForm.actif
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkillField(
                                                    "actif",
                                                    event
                                                        .target
                                                        .checked
                                                )
                                            }
                                        />

                                        <span />

                                        <div>

                                            <strong>
                                                Compétence active
                                            </strong>

                                            <small>
                                                Visible sur le portfolio.
                                            </small>

                                        </div>

                                    </label>


                                    <label className="skill-checkbox">

                                        <input
                                            type="checkbox"
                                            checked={
                                                skillForm.featured
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkillField(
                                                    "featured",
                                                    event
                                                        .target
                                                        .checked
                                                )
                                            }
                                        />

                                        <span />

                                        <div>

                                            <strong>
                                                Featured
                                            </strong>

                                            <small>
                                                Afficher dans Technologies & outils.
                                            </small>

                                        </div>

                                    </label>

                                </div>


                                <div className="skill-icon-section">

                                    <div className="skill-section-title">

                                        <div>

                                            <span>
                                                Icône
                                            </span>

                                            <h3>
                                                Bibliothèque React Icons
                                            </h3>

                                        </div>

                                        <code>
                                            library /{" "}
                                            {
                                                skillForm.iconValue ||
                                                "..."
                                            }
                                        </code>

                                    </div>


                                    <IconPicker
                                        value={
                                            skillForm.iconValue
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            updateSkillField(
                                                "iconValue",
                                                value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="skills-modal-footer">

                                <button
                                    type="button"
                                    className="admin-button admin-button-secondary"
                                    onClick={() =>
                                        setShowSkillModal(
                                            false
                                        )
                                    }
                                >
                                    Annuler
                                </button>


                                <button
                                    type="submit"
                                    className="admin-button admin-button-primary"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Enregistrement..."
                                        : editingSkillId
                                            ? "Enregistrer les modifications"
                                            : "Créer la compétence"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                MODAL CATÉGORIE
            ================================================= */}

            {showCategoryModal && (

                <div
                    className="skills-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowCategoryModal(
                                false
                            );
                        }

                    }}
                >

                    <div
                        className="skills-modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="skills-modal-header">

                            <div>

                                <span>
                                    Catégorie
                                </span>

                                <h2>
                                    {editingCategoryId
                                        ? "Modifier la catégorie"
                                        : "Nouvelle catégorie"}
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowCategoryModal(
                                        false
                                    )
                                }
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                saveCategory
                            }
                        >

                            <div className="skills-language-tabs">

                                {LANGUAGES.map(
                                    (
                                        item
                                    ) => (

                                        <button
                                            type="button"
                                            key={
                                                item.value
                                            }
                                            className={
                                                language ===
                                                    item.value
                                                    ? "is-active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setLanguage(
                                                    item.value
                                                )
                                            }
                                        >
                                            {item.value.toUpperCase()}
                                        </button>

                                    )
                                )}

                            </div>


                            <div className="skills-modal-body">

                                <div className="skills-form-grid">

                                    <div className="skill-form-group">

                                        <label>
                                            Nom (
                                            {
                                                language
                                            }
                                            )
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                categoryForm
                                                    .translations[
                                                    language
                                                ]
                                                    .title
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateCategoryTranslation(
                                                    language,
                                                    "title",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ex : Frontend"
                                        />

                                    </div>


                                    <div className="skill-form-group">

                                        <label>
                                            Ordre
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                categoryForm.ordre
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateCategoryField(
                                                    "ordre",
                                                    Number(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                <div className="skill-form-group skill-form-full">

                                    <label>
                                        Description (
                                        {
                                            language
                                        }
                                        )
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            categoryForm
                                                .translations[
                                                language
                                            ]
                                                .description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateCategoryTranslation(
                                                language,
                                                "description",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder={
                                            language ===
                                                "fr"
                                                ? "Description de la catégorie..."
                                                : "Category description..."
                                        }
                                    />

                                </div>


                                <div className="skill-form-group">

                                    <label>
                                        Icône
                                    </label>

                                    <IconPicker
                                        value={
                                            categoryForm.iconValue
                                        }
                                        onChange={(
                                            value
                                        ) =>
                                            updateCategoryField(
                                                "iconValue",
                                                value
                                            )
                                        }
                                    />

                                </div>


                                <label className="skill-checkbox">

                                    <input
                                        type="checkbox"
                                        checked={
                                            categoryForm.actif
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateCategoryField(
                                                "actif",
                                                event
                                                    .target
                                                    .checked
                                            )
                                        }
                                    />

                                    <span />

                                    <div>

                                        <strong>
                                            Catégorie active
                                        </strong>

                                        <small>
                                            Visible sur le portfolio.
                                        </small>

                                    </div>

                                </label>

                            </div>


                            <div className="skills-modal-footer">

                                <button
                                    type="button"
                                    className="admin-button admin-button-secondary"
                                    onClick={() =>
                                        setShowCategoryModal(
                                            false
                                        )
                                    }
                                >
                                    Annuler
                                </button>


                                <button
                                    type="submit"
                                    className="admin-button admin-button-primary"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Enregistrement..."
                                        : editingCategoryId
                                            ? "Enregistrer"
                                            : "Créer la catégorie"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}