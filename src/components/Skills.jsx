import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

import {
    getSkillIcon,
} from "../data/skillIconLibrary";
import { API_BASE_URL } from "../config";



const SKILLS_API_URL =
    `${API_BASE_URL}/skills`;

const CATEGORIES_API_URL =
    `${API_BASE_URL}/skill-categories`;


/*
|--------------------------------------------------------------------------
| Ordre actuel du marquee
|--------------------------------------------------------------------------
|
| On conserve exactement l'ordre qui existait dans ton ancien Skills.jsx.
|
*/

const CURRENT_TOOLS_ORDER = [
    "html5",
    "css3",
    "javascript",
    "react",
    "vite",
    "java",
    "springboot",
    "php",
    "laravel",
    "flutter",
    "dart",
    "mysql",
    "git",
    "github",
    "vscode",
    "vercel",
];


function getTranslation(
    translations = [],
    language = "fr"
) {
    const normalizedLanguage =
        language?.toLowerCase() === "en"
            ? "en"
            : "fr";

    const currentTranslation =
        translations.find(
            (translation) =>
                translation?.language?.toLowerCase() ===
                normalizedLanguage
        );

    if (currentTranslation) {
        return currentTranslation;
    }

    return (
        translations.find(
            (translation) =>
                translation?.language?.toLowerCase() === "fr"
        ) ||
        translations[0] ||
        null
    );
}


function getCategoryTitle(
    category,
    language
) {
    const translation =
        getTranslation(
            category?.translations,
            language
        );

    return (
        translation?.title ||
        ""
    );
}


function getSkillTitle(
    skill,
    language
) {
    const translation =
        getTranslation(
            skill?.translations,
            language
        );

    return (
        translation?.title ||
        skill?.iconValue ||
        ""
    );
}


function getSkillOrder(
    skill
) {
    const index =
        CURRENT_TOOLS_ORDER.indexOf(
            skill?.iconValue
        );

    if (index !== -1) {
        return index;
    }

    return (
        CURRENT_TOOLS_ORDER.length +
        Number(skill?.ordre || 0)
    );
}


function Skills() {

    const {
        language,
        t,
    } = useLanguage();


    const [
        categories,
        setCategories,
    ] = useState([]);


    const [
        skills,
        setSkills,
    ] = useState([]);


    const [
        featuredSkills,
        setFeaturedSkills,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Chargement des données depuis Spring Boot
    |--------------------------------------------------------------------------
    */

    const loadSkills =
        useCallback(
            async (
                showLoader = true
            ) => {

                try {

                    if (showLoader) {
                        setLoading(true);
                    }

                    setError("");


                    const [
                        categoriesResponse,
                        skillsResponse,
                        featuredResponse,
                    ] = await Promise.all([

                        fetch(
                            CATEGORIES_API_URL,
                            {
                                cache: "no-store",
                            }
                        ),

                        fetch(
                            `${SKILLS_API_URL}/active`,
                            {
                                cache: "no-store",
                            }
                        ),

                        fetch(
                            `${SKILLS_API_URL}/featured`,
                            {
                                cache: "no-store",
                            }
                        ),

                    ]);


                    if (
                        !categoriesResponse.ok
                    ) {
                        throw new Error(
                            "Impossible de récupérer les catégories de compétences."
                        );
                    }


                    if (
                        !skillsResponse.ok
                    ) {
                        throw new Error(
                            "Impossible de récupérer les compétences."
                        );
                    }


                    if (
                        !featuredResponse.ok
                    ) {
                        throw new Error(
                            "Impossible de récupérer les technologies mises en avant."
                        );
                    }


                    const [
                        categoriesData,
                        skillsData,
                        featuredData,
                    ] = await Promise.all([

                        categoriesResponse.json(),

                        skillsResponse.json(),

                        featuredResponse.json(),

                    ]);


                    /*
                    |--------------------------------------------------------------------------
                    | Catégories actives
                    |--------------------------------------------------------------------------
                    */

                    const activeCategories =
                        Array.isArray(
                            categoriesData
                        )
                            ? categoriesData.filter(
                                (category) =>
                                    category?.actif === true
                            )
                            : [];


                    /*
                    |--------------------------------------------------------------------------
                    | Compétences actives
                    |--------------------------------------------------------------------------
                    */

                    const activeSkills =
                        Array.isArray(
                            skillsData
                        )
                            ? skillsData.filter(
                                (skill) =>
                                    skill?.actif === true
                            )
                            : [];


                    /*
                    |--------------------------------------------------------------------------
                    | Technologies mises en avant
                    |--------------------------------------------------------------------------
                    */

                    const activeFeaturedSkills =
                        Array.isArray(
                            featuredData
                        )
                            ? featuredData.filter(
                                (skill) =>
                                    skill?.actif === true &&
                                    skill?.featured === true
                            )
                            : [];


                    /*
                    |--------------------------------------------------------------------------
                    | Mise à jour de l'état
                    |--------------------------------------------------------------------------
                    */

                    setCategories(
                        activeCategories
                    );

                    setSkills(
                        activeSkills
                    );

                    setFeaturedSkills(
                        activeFeaturedSkills
                    );


                } catch (requestError) {

                    console.error(
                        "Erreur chargement compétences :",
                        requestError
                    );


                    setError(
                        requestError?.message ||
                        "Impossible de charger les compétences."
                    );


                } finally {

                    setLoading(false);
                }

            },
            []
        );


    /*
    |--------------------------------------------------------------------------
    | Chargement initial
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        async function loadInitialSkills() {
            try {
                setLoading(true);
                setError("");

                const [
                    categoriesResponse,
                    skillsResponse,
                    featuredResponse,
                ] = await Promise.all([
                    fetch(
                        CATEGORIES_API_URL,
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        `${SKILLS_API_URL}/active`,
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        `${SKILLS_API_URL}/featured`,
                        {
                            cache: "no-store",
                        }
                    ),
                ]);

                if (!categoriesResponse.ok) {
                    throw new Error(
                        "Impossible de récupérer les catégories de compétences."
                    );
                }

                if (!skillsResponse.ok) {
                    throw new Error(
                        "Impossible de récupérer les compétences."
                    );
                }

                if (!featuredResponse.ok) {
                    throw new Error(
                        "Impossible de récupérer les technologies mises en avant."
                    );
                }

                const [
                    categoriesData,
                    skillsData,
                    featuredData,
                ] = await Promise.all([
                    categoriesResponse.json(),
                    skillsResponse.json(),
                    featuredResponse.json(),
                ]);

                if (cancelled) {
                    return;
                }

                const activeCategories =
                    Array.isArray(categoriesData)
                        ? categoriesData.filter(
                            (category) =>
                                category?.actif === true
                        )
                        : [];

                const activeSkills =
                    Array.isArray(skillsData)
                        ? skillsData.filter(
                            (skill) =>
                                skill?.actif === true
                        )
                        : [];

                const activeFeaturedSkills =
                    Array.isArray(featuredData)
                        ? featuredData.filter(
                            (skill) =>
                                skill?.actif === true &&
                                skill?.featured === true
                        )
                        : [];

                setCategories(
                    activeCategories
                );

                setSkills(
                    activeSkills
                );

                setFeaturedSkills(
                    activeFeaturedSkills
                );

            } catch (requestError) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Erreur chargement compétences :",
                    requestError
                );

                setError(
                    requestError?.message ||
                    "Impossible de charger les compétences."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadInitialSkills();

        return () => {
            cancelled = true;
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Mise à jour automatique après modification dans l'administration
    |--------------------------------------------------------------------------
    |
    | AdminSkills déclenchera :
    |
    | window.dispatchEvent(
    |     new Event("skills-data-updated")
    | );
    |
    */

    useEffect(() => {

        const handleSkillsDataUpdated = () => {

            loadSkills(false);

        };


        window.addEventListener(
            "skills-data-updated",
            handleSkillsDataUpdated
        );


        return () => {

            window.removeEventListener(
                "skills-data-updated",
                handleSkillsDataUpdated
            );

        };

    }, [
        loadSkills,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Rechargement lorsque la page redevient visible
    |--------------------------------------------------------------------------
    |
    | Utile si l'administration et le portfolio
    | sont ouverts dans des onglets différents.
    |
    */

    useEffect(() => {

        const handleVisibilityChange = () => {

            if (
                document.visibilityState ===
                "visible"
            ) {
                loadSkills(false);
            }

        };


        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

        };

    }, [
        loadSkills,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Groupes de compétences
    |--------------------------------------------------------------------------
    |
    | Les catégories viennent de la base.
    | Les compétences appartiennent à ces catégories grâce à categoryId.
    |
    */

    const skillGroups =
        useMemo(() => {

            return categories.map(
                (category) => {

                    const categorySkills =
                        skills
                            .filter(
                                (skill) =>
                                    Number(
                                        skill?.categoryId
                                    ) ===
                                    Number(
                                        category?.id
                                    )
                            )
                            .sort(
                                (a, b) =>
                                    Number(
                                        a?.ordre || 0
                                    ) -
                                    Number(
                                        b?.ordre || 0
                                    )
                            );


                    return {
                        category,
                        title:
                            getCategoryTitle(
                                category,
                                language
                            ),
                        skills:
                            categorySkills,
                    };

                }
            );

        }, [
            categories,
            skills,
            language,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Technologies du marquee
    |--------------------------------------------------------------------------
    */

    const tools =
        useMemo(() => {

            const source =
                featuredSkills.length > 0
                    ? featuredSkills
                    : skills.filter(
                        (skill) =>
                            skill?.featured === true
                    );


            return [
                ...source,
            ].sort(
                (a, b) =>
                    getSkillOrder(a) -
                    getSkillOrder(b)
            );

        }, [
            featuredSkills,
            skills,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Même logique que l'ancien composant
    |--------------------------------------------------------------------------
    */

    const firstRow =
        tools.slice(
            0,
            8
        );


    const secondRow =
        tools.slice(
            8
        );


    const duplicatedFirstRow = [
        ...firstRow,
        ...firstRow,
        ...firstRow,
    ];


    const duplicatedSecondRow = [
        ...secondRow,
        ...secondRow,
        ...secondRow,
    ];


    /*
    |--------------------------------------------------------------------------
    | Affichage
    |--------------------------------------------------------------------------
    */

    return (
        <section
            id="competences"
            className="section skills-section"
        >

            <ScrollReveal direction="up">

                <div className="section-heading">

                    <p className="section-label">
                        {t("skills.title")}
                    </p>

                    <h2>
                        {t("skills.heading")}
                    </h2>

                    <p>
                        {t("skills.subtitle")}
                    </p>

                </div>

            </ScrollReveal>


            {loading && (
                <div
                    className="skills-grid"
                    aria-live="polite"
                >
                    <p>
                        {language === "en"
                            ? "Loading skills..."
                            : "Chargement des compétences..."
                        }
                    </p>
                </div>
            )}


            {!loading && error && (
                <div
                    className="skills-grid"
                    aria-live="polite"
                >
                    <p>
                        {language === "en"
                            ? "Unable to load skills."
                            : "Impossible de charger les compétences."
                        }
                    </p>
                </div>
            )}


            {!loading &&
                !error &&
                (
                    <div className="skills-grid">

                        {skillGroups.map(
                            (
                                group,
                                index
                            ) => (

                                <ScrollReveal
                                    key={
                                        group.category?.id ??
                                        group.title
                                    }
                                    direction={
                                        index % 2 === 0
                                            ? "left"
                                            : "right"
                                    }
                                    delay={
                                        150 +
                                        index * 100
                                    }
                                >

                                    <article className="skill-card">

                                        <div className="skill-card-header">

                                            <span className="skill-card-number">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </span>

                                            <span className="skill-card-line"></span>

                                        </div>


                                        <h3>
                                            {group.title}
                                        </h3>


                                        <p>
                                            {
                                                getTranslation(
                                                    group.category?.translations,
                                                    language
                                                )?.description ||
                                                (
                                                    index === 0
                                                        ? t(
                                                            "skills.frontendDescription"
                                                        )
                                                        : index === 1
                                                            ? t(
                                                                "skills.backendDescription"
                                                            )
                                                            : index === 2
                                                                ? t(
                                                                    "skills.mobileDescription"
                                                                )
                                                                : t(
                                                                    "skills.dataDescription"
                                                                )
                                                )
                                            }
                                        </p>


                                        <div className="skills-list">

                                            {group.skills.map(
                                                (skill) => (

                                                    <span
                                                        key={
                                                            skill.id
                                                        }
                                                        className="skill-tag"
                                                    >

                                                        {
                                                            getSkillTitle(
                                                                skill,
                                                                language
                                                            )
                                                        }

                                                    </span>

                                                )
                                            )}

                                        </div>

                                    </article>

                                </ScrollReveal>

                            )
                        )}

                    </div>
                )
            }


            {!loading &&
                !error &&
                tools.length > 0 && (

                    <ScrollReveal
                        direction="up"
                        delay={250}
                    >

                        <div className="tools-showcase">

                            <div className="tools-showcase-heading">

                                <span className="tools-label">

                                    {t(
                                        "skills.toolsLabel"
                                    )}

                                </span>


                                <h3>

                                    {t(
                                        "skills.toolsHeading"
                                    )}

                                </h3>


                                <p>

                                    {t(
                                        "skills.toolsDescription"
                                    )}

                                </p>

                            </div>


                            <div className="tools-marquee">

                                <div className="tools-marquee-track tools-marquee-left">

                                    {duplicatedFirstRow.map(
                                        (
                                            tool,
                                            index
                                        ) => {

                                            const Icon =
                                                getSkillIcon(
                                                    tool?.iconValue
                                                );


                                            return (

                                                <div
                                                    className="tool-item"
                                                    key={`${tool?.id ?? tool?.iconValue}-first-${index}`}
                                                >

                                                    <div className="tool-icon">

                                                        <Icon />

                                                    </div>


                                                    <span>

                                                        {getSkillTitle(
                                                            tool,
                                                            language
                                                        )}

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>


                                <div className="tools-marquee-track tools-marquee-right">

                                    {duplicatedSecondRow.map(
                                        (
                                            tool,
                                            index
                                        ) => {

                                            const Icon =
                                                getSkillIcon(
                                                    tool?.iconValue
                                                );


                                            return (

                                                <div
                                                    className="tool-item"
                                                    key={`${tool?.id ?? tool?.iconValue}-second-${index}`}
                                                >

                                                    <div className="tool-icon">

                                                        <Icon />

                                                    </div>


                                                    <span>

                                                        {getSkillTitle(
                                                            tool,
                                                            language
                                                        )}

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        </div>

                    </ScrollReveal>

                )
            }

        </section>
    );
}


export default Skills;