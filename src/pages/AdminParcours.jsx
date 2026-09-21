import {
    useCallback,
    useEffect,
    useState,
} from "react";

import "../styles/AdminParcours.css";

import {
    getAuthHeaders,
} from "../services/authService";

import { API_BASE_URL } from "../config";

const API_URL =
    `${API_BASE_URL}/api/parcours`;


/*
 * =========================================================
 * FORMULAIRE VIDE
 * =========================================================
 */

const createEmptyForm = () => ({
    numero: "",
    ordre: "",
    lien: "",
    actif: true,

    fr: {
        periode: "",
        title: "",
        location: "",
        description: "",
    },

    en: {
        periode: "",
        title: "",
        location: "",
        description: "",
    },

    technologies: [],
});


/*
 * =========================================================
 * NORMALISER UNE TECHNOLOGIE
 * =========================================================
 */

const normalizeTechnology = (value) => {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
};


/*
 * =========================================================
 * LIRE LA RÉPONSE DU SERVEUR
 * =========================================================
 */

const readResponseData = async (response) => {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return {
            message: text,
        };
    }
};


/*
 * =========================================================
 * EXTRAIRE LE MESSAGE D'ERREUR
 * =========================================================
 */

const getResponseErrorMessage = (
    response,
    data
) => {
    if (response.status === 401) {
        return (
            "Votre session a expiré. Veuillez vous reconnecter."
        );
    }

    if (response.status === 403) {
        return (
            data?.message ||
            data?.error ||
            data?.detail ||
            "Vous n'avez pas l'autorisation d'effectuer cette opération."
        );
    }

    return (
        data?.message ||
        data?.error ||
        data?.detail ||
        `Erreur HTTP : ${response.status}`
    );
};


/*
 * =========================================================
 * COMPOSANT
 * =========================================================
 */

function AdminParcours() {

    /*
     * =========================================================
     * ÉTATS
     * =========================================================
     */

    const [parcours, setParcours] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [form, setForm] =
        useState(createEmptyForm());

    const [newTechnology, setNewTechnology] =
        useState("");

    const [deleteTarget, setDeleteTarget] =
        useState(null);


    /*
     * =========================================================
     * FERMER LE MODAL
     * =========================================================
     */

    const handleCloseModal =
        useCallback(() => {

            if (saving) {
                return;
            }

            setShowModal(false);

            setEditingId(null);

            setForm(
                createEmptyForm()
            );

            setNewTechnology("");

            setError("");

        }, [saving]);


    /*
     * =========================================================
     * RÉCUPÉRER LES PARCOURS
     * =========================================================
     */

    const getParcours =
        useCallback(async () => {

            const response =
                await fetch(
                    `${API_URL}/admin?lang=fr`,
                    {
                        method: "GET",

                        headers: {
                            Accept:
                                "application/json",

                            ...getAuthHeaders(),
                        },

                        cache: "no-store",
                    }
                );


            const data =
                await readResponseData(
                    response
                );


            if (!response.ok) {
                throw new Error(
                    getResponseErrorMessage(
                        response,
                        data
                    )
                );
            }


            const items =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.content)
                            ? data.content
                            : [];


            return [...items].sort(
                (a, b) =>
                    Number(a?.ordre || 0) -
                    Number(b?.ordre || 0)
            );

        }, []);


    /*
     * =========================================================
     * CHARGEMENT INITIAL
     * =========================================================
     */

    useEffect(() => {

        let cancelled = false;


        getParcours()

            .then((data) => {

                if (cancelled) {
                    return;
                }

                setParcours(data);

                setError("");

            })

            .catch((fetchError) => {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Erreur lors du chargement des parcours :",
                    fetchError
                );

                setParcours([]);

                setError(
                    fetchError.message ||
                    "Impossible de charger les parcours."
                );

            })

            .finally(() => {

                if (cancelled) {
                    return;
                }

                setLoading(false);

            });


        return () => {
            cancelled = true;
        };

    }, [getParcours]);


    /*
     * =========================================================
     * FERMETURE AVEC ESC
     * =========================================================
     */

    useEffect(() => {

        const handleEscape =
            (event) => {

                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }


                if (deleteTarget) {

                    if (!deleting) {
                        setDeleteTarget(null);
                    }

                    return;
                }


                if (
                    showModal &&
                    !saving
                ) {
                    handleCloseModal();
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
        deleteTarget,
        deleting,
        showModal,
        saving,
        handleCloseModal,
    ]);


    /*
     * =========================================================
     * BLOQUER LE SCROLL DERRIÈRE LES MODALS
     * =========================================================
     */

    useEffect(() => {

        const modalActive =
            showModal ||
            Boolean(deleteTarget);


        document.body.style.overflow =
            modalActive
                ? "hidden"
                : "";


        return () => {
            document.body.style.overflow = "";
        };

    }, [
        showModal,
        deleteTarget,
    ]);


    /*
     * =========================================================
     * OUVRIR LE MODAL D'AJOUT
     * =========================================================
     */

    const handleAdd = () => {

        setEditingId(null);

        setForm(
            createEmptyForm()
        );

        setNewTechnology("");

        setError("");

        setSuccess("");

        setShowModal(true);
    };


    /*
     * =========================================================
     * OUVRIR LE MODAL DE MODIFICATION
     * =========================================================
     */

    const handleEdit =
        async (id) => {

            setError("");

            setSuccess("");


            try {

                const [
                    responseFr,
                    responseEn,
                ] = await Promise.all([

                    fetch(
                        `${API_URL}/${id}?lang=fr`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json",

                                ...getAuthHeaders(),
                            },

                            cache: "no-store",
                        }
                    ),

                    fetch(
                        `${API_URL}/${id}?lang=en`,
                        {
                            method: "GET",

                            headers: {
                                Accept:
                                    "application/json",

                                ...getAuthHeaders(),
                            },

                            cache: "no-store",
                        }
                    ),

                ]);


                const [
                    dataFr,
                    dataEn,
                ] = await Promise.all([

                    readResponseData(
                        responseFr
                    ),

                    readResponseData(
                        responseEn
                    ),

                ]);


                if (!responseFr.ok) {
                    throw new Error(
                        getResponseErrorMessage(
                            responseFr,
                            dataFr
                        )
                    );
                }


                if (!responseEn.ok) {
                    throw new Error(
                        getResponseErrorMessage(
                            responseEn,
                            dataEn
                        )
                    );
                }


                const frTranslation =
                    dataFr?.translation ||
                    {};


                const enTranslation =
                    dataEn?.translation ||
                    {};


                const technologies =
                    [
                        ...(dataFr?.technologies || []),
                    ]
                        .sort(
                            (a, b) =>
                                Number(
                                    a?.ordre || 0
                                ) -
                                Number(
                                    b?.ordre || 0
                                )
                        )
                        .map(
                            (technology) =>
                                normalizeTechnology(
                                    technology?.nom
                                )
                        )
                        .filter(Boolean);


                setEditingId(id);


                setForm({

                    numero:
                        dataFr?.numero ||
                        "",

                    ordre:
                        dataFr?.ordre ??
                        "",

                    lien:
                        dataFr?.lien ||
                        "",

                    actif:
                        dataFr?.actif !== false,

                    fr: {

                        periode:
                            frTranslation?.periode ||
                            "",

                        title:
                            frTranslation?.title ||
                            "",

                        location:
                            frTranslation?.location ||
                            "",

                        description:
                            frTranslation?.description ||
                            "",

                    },

                    en: {

                        periode:
                            enTranslation?.periode ||
                            "",

                        title:
                            enTranslation?.title ||
                            "",

                        location:
                            enTranslation?.location ||
                            "",

                        description:
                            enTranslation?.description ||
                            "",

                    },

                    technologies,

                });


                setNewTechnology("");

                setShowModal(true);

            } catch (editError) {

                console.error(
                    "Erreur lors du chargement du parcours :",
                    editError
                );


                setError(
                    editError.message ||
                    "Impossible de charger les données du parcours."
                );

            }

        };


    /*
     * =========================================================
     * MODIFICATION DES INFORMATIONS GÉNÉRALES
     * =========================================================
     */

    const handleMainChange =
        (event) => {

            const {
                name,
                value,
                type,
                checked,
            } = event.target;


            setForm(
                (current) => ({

                    ...current,

                    [name]:
                        type === "checkbox"
                            ? checked
                            : value,

                })
            );

        };


    /*
     * =========================================================
     * MODIFICATION DES TRADUCTIONS
     * =========================================================
     */

    const handleTranslationChange =
        (
            language,
            event
        ) => {

            const {
                name,
                value,
            } = event.target;


            setForm(
                (current) => ({

                    ...current,

                    [language]: {

                        ...current[language],

                        [name]:
                            value,

                    },

                })
            );

        };


    /*
     * =========================================================
     * AJOUT D'UNE TECHNOLOGIE
     * =========================================================
     */

    const handleAddTechnology =
        () => {

            const technology =
                normalizeTechnology(
                    newTechnology
                );


            /*
             * Champ vide.
             */

            if (!technology) {
                setNewTechnology("");
                return;
            }


            /*
             * La base de données accepte
             * au maximum 100 caractères.
             */

            if (technology.length > 100) {

                setError(
                    "Le nom d'une technologie ne peut pas dépasser 100 caractères."
                );

                return;
            }


            /*
             * Vérifier les doublons sans tenir
             * compte des majuscules/minuscules.
             */

            const alreadyExists =
                form.technologies.some(
                    (item) =>
                        normalizeTechnology(item)
                            .toLowerCase() ===
                        technology.toLowerCase()
                );


            if (alreadyExists) {

                setError(
                    `La technologie "${technology}" est déjà ajoutée à ce parcours.`
                );

                setNewTechnology("");

                return;
            }


            /*
             * Ajouter la technologie.
             */

            setForm(
                (current) => ({

                    ...current,

                    technologies: [
                        ...current.technologies,
                        technology,
                    ],

                })
            );


            setNewTechnology("");

            setError("");

        };


    /*
     * =========================================================
     * TOUCHE ENTER POUR AJOUTER
     * =========================================================
     */

    const handleTechnologyKeyDown =
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                handleAddTechnology();
            }

        };


    /*
     * =========================================================
     * SUPPRIMER UNE TECHNOLOGIE
     * =========================================================
     */

    const handleRemoveTechnology =
        (index) => {

            setForm(
                (current) => ({

                    ...current,

                    technologies:
                        current.technologies.filter(
                            (
                                _,
                                itemIndex
                            ) =>
                                itemIndex !==
                                index
                        ),

                })
            );


            setError("");

        };


    /*
     * =========================================================
     * VALIDATION DU FORMULAIRE
     * =========================================================
     */

    const validateForm =
        () => {

            if (
                !form.numero.trim()
            ) {

                return (
                    "Le numéro du parcours est obligatoire."
                );
            }


            if (
                !form.ordre ||
                Number(form.ordre) < 1
            ) {

                return (
                    "L'ordre doit être supérieur ou égal à 1."
                );
            }


            if (
                !form.fr.title.trim()
            ) {

                return (
                    "Le titre français est obligatoire."
                );
            }


            if (
                !form.en.title.trim()
            ) {

                return (
                    "Le titre anglais est obligatoire."
                );
            }


            return "";
        };


    /*
     * =========================================================
     * ENREGISTRER LE PARCOURS
     * =========================================================
     */

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            setError("");

            setSuccess("");


            const validationError =
                validateForm();


            if (validationError) {

                setError(
                    validationError
                );

                return;
            }


            /*
             * Nettoyer les technologies
             * avant l'envoi.
             */

            const cleanTechnologies =
                form.technologies
                    .map(
                        (technology) =>
                            normalizeTechnology(
                                technology
                            )
                    )
                    .filter(Boolean)
                    .filter(
                        (
                            technology,
                            index,
                            array
                        ) =>
                            array.findIndex(
                                (item) =>
                                    item.toLowerCase() ===
                                    technology.toLowerCase()
                            ) === index
                    );


            /*
             * Construire les technologies
             * avec un ordre propre.
             */

            const technologies =
                cleanTechnologies.map(
                    (
                        technology,
                        index
                    ) => ({

                        nom:
                            technology,

                        ordre:
                            index + 1,

                    })
                );


            /*
             * Construire le corps JSON.
             */

            const requestBody = {

                numero:
                    form.numero.trim(),

                ordre:
                    Number(form.ordre),

                lien:
                    form.lien.trim(),

                actif:
                    Boolean(form.actif),

                translations: [

                    {
                        language: "fr",

                        periode:
                            form.fr.periode.trim(),

                        title:
                            form.fr.title.trim(),

                        location:
                            form.fr.location.trim(),

                        description:
                            form.fr.description.trim(),
                    },

                    {
                        language: "en",

                        periode:
                            form.en.periode.trim(),

                        title:
                            form.en.title.trim(),

                        location:
                            form.en.location.trim(),

                        description:
                            form.en.description.trim(),
                    },

                ],

                technologies,

            };


            /*
             * Très utile pour vérifier exactement
             * ce qui est envoyé au backend.
             */

            console.log(
                "Parcours envoyé au backend :",
                JSON.stringify(
                    requestBody,
                    null,
                    2
                )
            );


            setSaving(true);


            try {

                const url =
                    editingId
                        ? `${API_URL}/admin/${editingId}`
                        : `${API_URL}/admin`;


                const method =
                    editingId
                        ? "PUT"
                        : "POST";


                const response =
                    await fetch(
                        url,
                        {

                            method,

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json",

                                ...getAuthHeaders(),

                            },

                            body:
                                JSON.stringify(
                                    requestBody
                                ),

                        }
                    );


                const responseData =
                    await readResponseData(
                        response
                    );


                /*
                 * SESSION EXPIRÉE
                 */

                if (
                    response.status ===
                    401
                ) {

                    throw new Error(
                        "Votre session a expiré. Veuillez vous reconnecter."
                    );
                }


                /*
                 * ACCÈS REFUSÉ
                 */

                if (
                    response.status ===
                    403
                ) {

                    throw new Error(
                        `Erreur 403 : ${
                            responseData?.message ||
                            responseData?.error ||
                            responseData?.detail ||
                            "Vous n'avez pas l'autorisation d'effectuer cette opération."
                        }`
                    );
                }


                /*
                 * AUTRES ERREURS HTTP
                 */

                if (!response.ok) {

                    throw new Error(
                        getResponseErrorMessage(
                            response,
                            responseData
                        )
                    );
                }


                const wasEditing =
                    Boolean(editingId);


                /*
                 * Recharger les données
                 * depuis le backend.
                 */

                const updatedParcours =
                    await getParcours();


                setParcours(
                    updatedParcours
                );


                /*
                 * Fermer le modal.
                 */

                setShowModal(false);

                setEditingId(null);

                setForm(
                    createEmptyForm()
                );

                setNewTechnology("");


                /*
                 * Message de succès.
                 */

                setSuccess(
                    wasEditing
                        ? "Le parcours a été modifié avec succès."
                        : "Le parcours a été ajouté avec succès."
                );


            } catch (saveError) {

                console.error(
                    "Erreur lors de l'enregistrement du parcours :",
                    saveError
                );


                setError(
                    saveError.message ||
                    "Une erreur est survenue lors de l'enregistrement."
                );


            } finally {

                setSaving(false);

            }

        };


    /*
     * =========================================================
     * DEMANDER LA SUPPRESSION
     * =========================================================
     */

    const handleDeleteRequest =
        (item) => {

            setError("");

            setSuccess("");

            setDeleteTarget(item);

        };


    /*
     * =========================================================
     * ANNULER LA SUPPRESSION
     * =========================================================
     */

    const handleCancelDelete =
        () => {

            if (deleting) {
                return;
            }


            setDeleteTarget(null);

        };


    /*
     * =========================================================
     * CONFIRMER LA SUPPRESSION
     * =========================================================
     */

    const handleConfirmDelete =
        async () => {

            if (!deleteTarget) {
                return;
            }


            setDeleting(true);

            setError("");

            setSuccess("");


            try {

                const response =
                    await fetch(
                        `${API_URL}/admin/${deleteTarget.id}`,
                        {

                            method: "DELETE",

                            headers: {

                                Accept:
                                    "application/json",

                                ...getAuthHeaders(),

                            },

                        }
                    );


                const responseData =
                    await readResponseData(
                        response
                    );


                if (
                    response.status ===
                    401
                ) {

                    throw new Error(
                        "Votre session a expiré. Veuillez vous reconnecter."
                    );
                }


                if (
                    response.status ===
                    403
                ) {

                    throw new Error(
                        `Erreur 403 : ${
                            responseData?.message ||
                            responseData?.error ||
                            responseData?.detail ||
                            "Vous n'avez pas l'autorisation de supprimer ce parcours."
                        }`
                    );
                }


                if (!response.ok) {

                    throw new Error(
                        getResponseErrorMessage(
                            response,
                            responseData
                        )
                    );
                }


                setParcours(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.id !==
                                deleteTarget.id
                        )
                );


                setDeleteTarget(null);


                setSuccess(
                    "Le parcours a été supprimé avec succès."
                );


            } catch (deleteError) {

                console.error(
                    "Erreur lors de la suppression :",
                    deleteError
                );


                setError(
                    deleteError.message ||
                    "Impossible de supprimer le parcours."
                );


                setDeleteTarget(null);


            } finally {

                setDeleting(false);

            }

        };


    /*
     * =========================================================
     * RENDU
     * =========================================================
     */

    return (
        <div className="admin-parcours-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-parcours-header">

                <div className="admin-parcours-heading">

                    <span className="admin-parcours-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Gestion du parcours
                    </h1>

                    <p>
                        Gérez votre formation,
                        vos stages et vos
                        différentes expériences.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-parcours-add-button"
                    onClick={handleAdd}
                >

                    <span className="admin-parcours-add-icon">
                        +
                    </span>

                    <span>
                        Ajouter un parcours
                    </span>

                </button>

            </div>


            {/* =================================================
                MESSAGE SUCCÈS
            ================================================= */}

            {success && (

                <div
                    className="admin-parcours-message admin-parcours-message-success"
                    role="status"
                >

                    <span>
                        ✓
                    </span>

                    <span>
                        {success}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                        aria-label="Fermer le message"
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =================================================
                MESSAGE ERREUR
            ================================================= */}

            {error && !showModal && (

                <div
                    className="admin-parcours-message admin-parcours-message-error"
                    role="alert"
                >

                    <span>
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        aria-label="Fermer le message"
                    >
                        ×
                    </button>

                </div>
            )}


            {/* =================================================
                STATISTIQUES
            ================================================= */}

            <div className="admin-parcours-stats">

                {/* TOTAL */}

                <div className="admin-parcours-stat-card">

                    <div className="admin-parcours-stat-icon">
                        🧭
                    </div>

                    <div>

                        <span>
                            Parcours
                        </span>

                        <strong>
                            {parcours.length}
                        </strong>

                    </div>

                </div>


                {/* ACTIFS */}

                <div className="admin-parcours-stat-card">

                    <div className="admin-parcours-stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Actifs
                        </span>

                        <strong>

                            {
                                parcours.filter(
                                    (item) =>
                                        item.actif !==
                                        false
                                ).length
                            }

                        </strong>

                    </div>

                </div>


                {/* TECHNOLOGIES */}

                <div className="admin-parcours-stat-card">

                    <div className="admin-parcours-stat-icon">
                        ⚙
                    </div>

                    <div>

                        <span>
                            Technologies
                        </span>

                        <strong>

                            {
                                new Set(
                                    parcours.flatMap(
                                        (item) =>
                                            (
                                                item.technologies ||
                                                []
                                            )
                                                .map(
                                                    (technology) =>
                                                        technology?.nom
                                                )
                                                .filter(Boolean)
                                    )
                                ).size
                            }

                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                CONTENU
            ================================================= */}

            <div className="admin-parcours-content">

                <div className="admin-parcours-content-header">

                    <div>

                        <h2>
                            Mes parcours
                        </h2>

                        <p>
                            Les éléments apparaîtront
                            dans cet ordre sur
                            votre portfolio.
                        </p>

                    </div>


                    <span className="admin-parcours-count">

                        {parcours.length} élément
                        {parcours.length > 1 ? "s" : ""}

                    </span>

                </div>


                {/* =================================================
                    CHARGEMENT
                ================================================= */}

                {loading && (

                    <div className="admin-parcours-loading">

                        <div className="admin-parcours-spinner"></div>

                        <p>
                            Chargement des parcours...
                        </p>

                    </div>
                )}


                {/* =================================================
                    LISTE
                ================================================= */}

                {!loading &&
                    parcours.length > 0 && (

                        <div className="admin-parcours-list">

                            {parcours.map(
                                (item) => {

                                    const translation =
                                        item.translation ||
                                        {};


                                    const technologies =
                                        [
                                            ...(item.technologies ||
                                                []),
                                        ].sort(
                                            (a, b) =>
                                                Number(
                                                    a?.ordre || 0
                                                ) -
                                                Number(
                                                    b?.ordre || 0
                                                )
                                        );


                                    return (

                                        <article
                                            className="admin-parcours-card"
                                            key={
                                                item.id
                                            }
                                        >

                                            {/* NUMÉRO */}

                                            <div className="admin-parcours-number">

                                                <span>
                                                    {
                                                        item.numero
                                                    }
                                                </span>

                                                <small>
                                                    #
                                                    {
                                                        item.ordre
                                                    }
                                                </small>

                                            </div>


                                            {/* CONTENU */}

                                            <div className="admin-parcours-card-main">

                                                <div className="admin-parcours-card-top">

                                                    <div>

                                                        <span className="admin-parcours-period">

                                                            {
                                                                translation?.periode ||
                                                                "Période non renseignée"
                                                            }

                                                        </span>


                                                        <h3>

                                                            {
                                                                translation?.title ||
                                                                "Sans titre"
                                                            }

                                                        </h3>

                                                    </div>


                                                    {/* STATUT */}

                                                    <span
                                                        className={`admin-parcours-status ${
                                                            item.actif !==
                                                            false
                                                                ? "active"
                                                                : "inactive"
                                                        }`}
                                                    >

                                                        <span></span>

                                                        {
                                                            item.actif !==
                                                            false
                                                                ? "Actif"
                                                                : "Inactif"
                                                        }

                                                    </span>

                                                </div>


                                                {/* LOCALISATION */}

                                                {translation?.location && (

                                                    <div className="admin-parcours-location">

                                                        <span>
                                                            📍
                                                        </span>

                                                        <span>
                                                            {
                                                                translation.location
                                                            }
                                                        </span>

                                                    </div>

                                                )}


                                                {/* DESCRIPTION */}

                                                {translation?.description && (

                                                    <p className="admin-parcours-description">

                                                        {
                                                            translation.description
                                                        }

                                                    </p>

                                                )}


                                                {/* TECHNOLOGIES */}

                                                {technologies.length > 0 && (

                                                    <div className="admin-parcours-technologies">

                                                        {technologies.map(
                                                            (technology) => (

                                                                <span
                                                                    key={
                                                                        technology.id ??
                                                                        technology.nom
                                                                    }
                                                                >

                                                                    {
                                                                        technology.nom
                                                                    }

                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                )}


                                                {/* LIEN */}

                                                {item.lien && (

                                                    <a
                                                        href={
                                                            item.lien
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="admin-parcours-link"
                                                    >

                                                        <span>
                                                            Voir le site
                                                        </span>

                                                        <span>
                                                            ↗
                                                        </span>

                                                    </a>

                                                )}

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="admin-parcours-actions">

                                                <button
                                                    type="button"
                                                    className="admin-parcours-action-button edit"
                                                    onClick={() =>
                                                        handleEdit(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <span>
                                                        ✎
                                                    </span>

                                                    <span>
                                                        Modifier
                                                    </span>

                                                </button>


                                                <button
                                                    type="button"
                                                    className="admin-parcours-action-button delete"
                                                    onClick={() =>
                                                        handleDeleteRequest(
                                                            item
                                                        )
                                                    }
                                                >

                                                    <span>
                                                        ×
                                                    </span>

                                                    <span>
                                                        Supprimer
                                                    </span>

                                                </button>

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>
                    )}


                {/* =================================================
                    AUCUN PARCOURS
                ================================================= */}

                {!loading &&
                    parcours.length === 0 && (

                        <div className="admin-parcours-empty">

                            <div className="admin-parcours-empty-icon">
                                🧭
                            </div>

                            <h3>
                                Aucun parcours
                            </h3>

                            <p>
                                Commencez par ajouter
                                votre premier parcours.
                            </p>

                            <button
                                type="button"
                                onClick={handleAdd}
                            >
                                + Ajouter un parcours
                            </button>

                        </div>
                    )}

            </div>


            {/* =================================================
                MODAL AJOUT / MODIFICATION
            ================================================= */}

            {showModal && (

                <div
                    className="admin-parcours-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            handleCloseModal();
                        }

                    }}
                >

                    <div
                        className="admin-parcours-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-parcours-modal-title"
                    >

                        {/* HEADER */}

                        <div className="admin-parcours-modal-header">

                            <div>

                                <span className="admin-parcours-modal-eyebrow">
                                    PARCOURS
                                </span>

                                <h2
                                    id="admin-parcours-modal-title"
                                >

                                    {
                                        editingId
                                            ? "Modifier le parcours"
                                            : "Ajouter un parcours"
                                    }

                                </h2>

                                <p>

                                    {
                                        editingId
                                            ? "Mettez à jour les informations de cet élément."
                                            : "Ajoutez une nouvelle étape à votre parcours."
                                    }

                                </p>

                            </div>


                            <button
                                type="button"
                                className="admin-parcours-modal-close"
                                onClick={
                                    handleCloseModal
                                }
                                disabled={saving}
                                aria-label="Fermer"
                            >
                                ×
                            </button>

                        </div>


                        {/* ERREUR */}

                        {error && (

                            <div
                                className="admin-parcours-modal-error"
                                role="alert"
                            >

                                <span>
                                    !
                                </span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* FORMULAIRE */}

                        <form
                            className="admin-parcours-form"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* =================================================
                                INFORMATIONS GÉNÉRALES
                            ================================================= */}

                            <section className="admin-parcours-form-section">

                                <div className="admin-parcours-form-section-heading">

                                    <div className="admin-parcours-section-number">
                                        01
                                    </div>

                                    <div>

                                        <h3>
                                            Informations générales
                                        </h3>

                                        <p>
                                            Identifiants et paramètres
                                            principaux du parcours.
                                        </p>

                                    </div>

                                </div>


                                <div className="admin-parcours-form-grid admin-parcours-form-grid-three">

                                    {/* NUMÉRO */}

                                    <div className="admin-parcours-field">

                                        <label htmlFor="numero">
                                            Numéro
                                        </label>

                                        <input
                                            id="numero"
                                            name="numero"
                                            type="text"
                                            value={
                                                form.numero
                                            }
                                            onChange={
                                                handleMainChange
                                            }
                                            placeholder="01"
                                            maxLength={10}
                                        />

                                    </div>


                                    {/* ORDRE */}

                                    <div className="admin-parcours-field">

                                        <label htmlFor="ordre">
                                            Ordre
                                        </label>

                                        <input
                                            id="ordre"
                                            name="ordre"
                                            type="number"
                                            min="1"
                                            value={
                                                form.ordre
                                            }
                                            onChange={
                                                handleMainChange
                                            }
                                            placeholder="1"
                                        />

                                    </div>


                                    {/* LIEN */}

                                    <div className="admin-parcours-field">

                                        <label htmlFor="lien">
                                            Lien du site
                                        </label>

                                        <input
                                            id="lien"
                                            name="lien"
                                            type="url"
                                            value={
                                                form.lien
                                            }
                                            onChange={
                                                handleMainChange
                                            }
                                            placeholder="https://..."
                                        />

                                    </div>

                                </div>


                                {/* ACTIF */}

                                <label className="admin-parcours-checkbox">

                                    <input
                                        type="checkbox"
                                        name="actif"
                                        checked={
                                            form.actif
                                        }
                                        onChange={
                                            handleMainChange
                                        }
                                    />

                                    <span className="admin-parcours-checkbox-ui"></span>

                                    <span>

                                        <strong>
                                            Parcours actif
                                        </strong>

                                        <small>
                                            Afficher ce parcours
                                            sur le portfolio.
                                        </small>

                                    </span>

                                </label>

                            </section>


                            {/* =================================================
                                FRANÇAIS
                            ================================================= */}

                            <section className="admin-parcours-form-section">

                                <div className="admin-parcours-form-section-heading">

                                    <div className="admin-parcours-section-number">
                                        02
                                    </div>

                                    <div>

                                        <h3>
                                            🇫🇷 Version française
                                        </h3>

                                        <p>
                                            Contenu affiché lorsque
                                            le portfolio est en français.
                                        </p>

                                    </div>

                                </div>


                                <div className="admin-parcours-form-grid">

                                    <div className="admin-parcours-field">

                                        <label htmlFor="fr-periode">
                                            Période
                                        </label>

                                        <input
                                            id="fr-periode"
                                            name="periode"
                                            type="text"
                                            value={
                                                form.fr.periode
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "fr",
                                                    event
                                                )
                                            }
                                            placeholder="2025 – Aujourd'hui"
                                        />

                                    </div>


                                    <div className="admin-parcours-field">

                                        <label htmlFor="fr-title">
                                            Titre
                                        </label>

                                        <input
                                            id="fr-title"
                                            name="title"
                                            type="text"
                                            value={
                                                form.fr.title
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "fr",
                                                    event
                                                )
                                            }
                                            placeholder="Système Informatique et Logiciel"
                                        />

                                    </div>


                                    <div className="admin-parcours-field admin-parcours-field-full">

                                        <label htmlFor="fr-location">
                                            Lieu
                                        </label>

                                        <input
                                            id="fr-location"
                                            name="location"
                                            type="text"
                                            value={
                                                form.fr.location
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "fr",
                                                    event
                                                )
                                            }
                                            placeholder="Abomey-Calavi, Bénin"
                                        />

                                    </div>


                                    <div className="admin-parcours-field admin-parcours-field-full">

                                        <label htmlFor="fr-description">
                                            Description
                                        </label>

                                        <textarea
                                            id="fr-description"
                                            name="description"
                                            rows="4"
                                            value={
                                                form.fr.description
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "fr",
                                                    event
                                                )
                                            }
                                            placeholder="Décrivez cette expérience..."
                                        />

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                ANGLAIS
                            ================================================= */}

                            <section className="admin-parcours-form-section">

                                <div className="admin-parcours-form-section-heading">

                                    <div className="admin-parcours-section-number">
                                        03
                                    </div>

                                    <div>

                                        <h3>
                                            🇬🇧 English version
                                        </h3>

                                        <p>
                                            Contenu affiché lorsque
                                            le portfolio est en anglais.
                                        </p>

                                    </div>

                                </div>


                                <div className="admin-parcours-form-grid">

                                    <div className="admin-parcours-field">

                                        <label htmlFor="en-periode">
                                            Period
                                        </label>

                                        <input
                                            id="en-periode"
                                            name="periode"
                                            type="text"
                                            value={
                                                form.en.periode
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "en",
                                                    event
                                                )
                                            }
                                            placeholder="2025 – Present"
                                        />

                                    </div>


                                    <div className="admin-parcours-field">

                                        <label htmlFor="en-title">
                                            Title
                                        </label>

                                        <input
                                            id="en-title"
                                            name="title"
                                            type="text"
                                            value={
                                                form.en.title
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "en",
                                                    event
                                                )
                                            }
                                            placeholder="Computer Science and Software"
                                        />

                                    </div>


                                    <div className="admin-parcours-field admin-parcours-field-full">

                                        <label htmlFor="en-location">
                                            Location
                                        </label>

                                        <input
                                            id="en-location"
                                            name="location"
                                            type="text"
                                            value={
                                                form.en.location
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "en",
                                                    event
                                                )
                                            }
                                            placeholder="Abomey-Calavi, Benin"
                                        />

                                    </div>


                                    <div className="admin-parcours-field admin-parcours-field-full">

                                        <label htmlFor="en-description">
                                            Description
                                        </label>

                                        <textarea
                                            id="en-description"
                                            name="description"
                                            rows="4"
                                            value={
                                                form.en.description
                                            }
                                            onChange={(event) =>
                                                handleTranslationChange(
                                                    "en",
                                                    event
                                                )
                                            }
                                            placeholder="Describe this experience..."
                                        />

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                TECHNOLOGIES
                            ================================================= */}

                            <section className="admin-parcours-form-section">

                                <div className="admin-parcours-form-section-heading">

                                    <div className="admin-parcours-section-number">
                                        04
                                    </div>

                                    <div>

                                        <h3>
                                            Technologies
                                        </h3>

                                        <p>
                                            Ajoutez les technologies
                                            associées à ce parcours.
                                        </p>

                                    </div>

                                </div>


                                <div className="admin-parcours-technology-input">

                                    <input
                                        type="text"
                                        value={
                                            newTechnology
                                        }
                                        onChange={(event) => {

                                            setNewTechnology(
                                                event.target.value
                                            );

                                            if (error) {
                                                setError("");
                                            }

                                        }}
                                        onKeyDown={
                                            handleTechnologyKeyDown
                                        }
                                        placeholder="Ex. React, Spring Boot, MySQL..."
                                        maxLength={100}
                                    />


                                    <button
                                        type="button"
                                        onClick={
                                            handleAddTechnology
                                        }
                                        disabled={
                                            !newTechnology.trim()
                                        }
                                        aria-label="Ajouter une technologie"
                                    >
                                        +
                                    </button>

                                </div>


                                {form.technologies.length > 0 && (

                                    <div className="admin-parcours-technology-list">

                                        {form.technologies.map(
                                            (
                                                technology,
                                                index
                                            ) => (

                                                <span
                                                    className="admin-parcours-technology-tag"
                                                    key={`${technology}-${index}`}
                                                >

                                                    <span>
                                                        {
                                                            technology
                                                        }
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveTechnology(
                                                                index
                                                            )
                                                        }
                                                        aria-label={`Supprimer ${technology}`}
                                                        disabled={saving}
                                                    >
                                                        ×
                                                    </button>

                                                </span>

                                            )
                                        )}

                                    </div>

                                )}

                            </section>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <div className="admin-parcours-modal-footer">

                                <button
                                    type="button"
                                    className="admin-parcours-cancel-button"
                                    onClick={
                                        handleCloseModal
                                    }
                                    disabled={saving}
                                >
                                    Annuler
                                </button>


                                <button
                                    type="submit"
                                    className="admin-parcours-save-button"
                                    disabled={saving}
                                >

                                    {saving ? (

                                        <>
                                            <span className="admin-parcours-button-spinner"></span>

                                            Enregistrement...
                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                ✓
                                            </span>

                                            {
                                                editingId
                                                    ? "Enregistrer les modifications"
                                                    : "Ajouter le parcours"
                                            }
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                MODAL SUPPRESSION
            ================================================= */}

            {deleteTarget && (

                <div
                    className="admin-parcours-modal-overlay admin-parcours-delete-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget &&
                            !deleting
                        ) {

                            handleCancelDelete();
                        }

                    }}
                >

                    <div
                        className="admin-parcours-delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-parcours-title"
                    >

                        <div className="admin-parcours-delete-icon">
                            !
                        </div>


                        <h2 id="delete-parcours-title">
                            Supprimer ce parcours ?
                        </h2>


                        <p>

                            Vous êtes sur le point
                            de supprimer :

                            <strong>
                                {" "}
                                {
                                    deleteTarget
                                        ?.translation
                                        ?.title ||
                                    "ce parcours"
                                }
                            </strong>

                            {" "}.

                            Cette action est
                            irréversible.

                        </p>


                        <div className="admin-parcours-delete-actions">

                            <button
                                type="button"
                                className="admin-parcours-cancel-button"
                                onClick={
                                    handleCancelDelete
                                }
                                disabled={deleting}
                            >
                                Annuler
                            </button>


                            <button
                                type="button"
                                className="admin-parcours-delete-confirm"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={deleting}
                            >

                                {deleting ? (

                                    <>
                                        <span className="admin-parcours-button-spinner"></span>

                                        Suppression...
                                    </>

                                ) : (

                                    <>
                                        <span>
                                            ×
                                        </span>

                                        Supprimer
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


export default AdminParcours;
