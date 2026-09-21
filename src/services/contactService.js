const API_URL = "http://localhost:8080/api/contact";

/*
 * ==========================================
 * TOKEN ADMIN
 * ==========================================
 */

const getToken = () => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
        throw new Error(
            "Vous devez être connecté en tant qu'administrateur."
        );
    }

    return token;
};


/*
 * ==========================================
 * RÉPONSE HTTP
 * ==========================================
 */

const handleResponse = async (response) => {
    if (response.ok) {
        if (response.status === 204) {
            return null;
        }

        const text = await response.text();

        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    /*
     * SESSION EXPIRÉE
     */
    if (response.status === 401) {
        throw new Error(
            "Votre session administrateur a expiré. Veuillez vous reconnecter."
        );
    }

    /*
     * ACCÈS REFUSÉ
     */
    if (response.status === 403) {
        throw new Error(
            "Accès refusé. Votre compte doit être administrateur."
        );
    }

    /*
     * MESSAGE INTROUVABLE
     */
    if (response.status === 404) {
        throw new Error(
            "Le message demandé n'existe plus."
        );
    }

    /*
     * AUTRES ERREURS
     */
    let message = "Une erreur est survenue.";

    try {
        const text = await response.text();

        if (text) {
            try {
                const data = JSON.parse(text);

                if (data?.message) {
                    message = data.message;
                }
            } catch {
                message = text;
            }
        }
    } catch (error) {
        console.error(
            "Erreur de lecture de la réponse :",
            error
        );
    }

    throw new Error(message);
};


/*
 * ==========================================
 * RÉCUPÉRER TOUS LES MESSAGES
 * ==========================================
 */

export const getMessages = async () => {
    const token = getToken();

    const response = await fetch(API_URL, {
        method: "GET",

        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
};


/*
 * ==========================================
 * RÉCUPÉRER UN MESSAGE
 * ==========================================
 */

export const getMessageById = async (id) => {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response);
};


/*
 * ==========================================
 * MARQUER COMME LU
 * ==========================================
 */

export const markMessageAsRead = async (id) => {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/${id}/lu`,
        {
            method: "PATCH",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response);
};


/*
 * ==========================================
 * SUPPRIMER UN MESSAGE
 * ==========================================
 */

export const deleteMessage = async (id) => {
    const token = getToken();

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return handleResponse(response);
};


/*
 * ==========================================
 * RÉPONDRE À UN MESSAGE
 * ==========================================
 *
 * La réponse est envoyée au backend Spring Boot.
 * Le backend se charge ensuite de l'envoyer
 * par Gmail SMTP à l'adresse du visiteur.
 *
 * Endpoint :
 * POST /api/contact/{id}/reply
 *
 * Body :
 * {
 *     subject: "...",
 *     body: "..."
 * }
 *
 * ==========================================
 */

export const replyToMessage = async (
    id,
    subject,
    body
) => {
    const token = getToken();

    /*
     * Vérification de l'identifiant
     */
    if (!id) {
        throw new Error(
            "Identifiant du message manquant."
        );
    }

    /*
     * Vérification du sujet
     */
    if (!subject || !subject.trim()) {
        throw new Error(
            "Le sujet de la réponse est obligatoire."
        );
    }

    /*
     * Vérification du contenu
     */
    if (!body || !body.trim()) {
        throw new Error(
            "Le contenu de la réponse est obligatoire."
        );
    }

    const response = await fetch(
        `${API_URL}/${id}/reply`,
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                subject: subject.trim(),
                body: body.trim(),
            }),
        }
    );

    return handleResponse(response);
};