import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/visitors`;

const VISITOR_UUID_KEY = "portfolio_visitor_uuid";

export const getVisitorUuid = () => {
    try {
        return sessionStorage.getItem(
            VISITOR_UUID_KEY
        );
    } catch {
        return null;
    }
};

export const recordVisitor = async () => {
    const existingVisitorUuid =
        getVisitorUuid();

    if (existingVisitorUuid) {
        return existingVisitorUuid;
    }

    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    pageVisited:
                        window.location.pathname +
                        window.location.search,
                }),
            }
        );

        if (!response.ok) {
            return null;
        }

        const visitor =
            await response.json();

        if (visitor?.visitorUuid) {
            try {
                sessionStorage.setItem(
                    VISITOR_UUID_KEY,
                    visitor.visitorUuid
                );
            } catch {
                // Échec silencieux :
                // la visite reste enregistrée côté serveur.
            }

            return visitor.visitorUuid;
        }

        return null;

    } catch {
        return null;
    }
};


/* =========================================================
   ADMINISTRATION
========================================================= */

import { getAuthHeaders } from "./authService";


export const getVisitors = async () => {

    const response = await fetch(
        `${API_URL}/admin`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                ...getAuthHeaders(),
            },
        }
    );

    if (response.status === 401) {
        throw new Error(
            "Votre session administrateur a expiré."
        );
    }

    if (response.status === 403) {
        throw new Error(
            "Accès administrateur refusé."
        );
    }

    if (!response.ok) {
        throw new Error(
            "Impossible de récupérer les visiteurs."
        );
    }

    const data = await response.json();

    return Array.isArray(data)
        ? data
        : [];
};


export const getVisitorCount = async () => {

    const response = await fetch(
        `${API_URL}/admin/count`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                ...getAuthHeaders(),
            },
        }
    );

    if (response.status === 401) {
        throw new Error(
            "Votre session administrateur a expiré."
        );
    }

    if (response.status === 403) {
        throw new Error(
            "Accès administrateur refusé."
        );
    }

    if (!response.ok) {
        throw new Error(
            "Impossible de récupérer le nombre de visiteurs."
        );
    }

    const data = await response.json();

    return Number(data) || 0;
};


export const deleteVisitor = async (id) => {

    const response = await fetch(
        `${API_URL}/admin/${id}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                ...getAuthHeaders(),
            },
        }
    );

    if (response.status === 401) {
        throw new Error(
            "Votre session administrateur a expiré."
        );
    }

    if (response.status === 403) {
        throw new Error(
            "Suppression non autorisée."
        );
    }

    if (!response.ok) {
        throw new Error(
            "Impossible de supprimer ce visiteur."
        );
    }
};

