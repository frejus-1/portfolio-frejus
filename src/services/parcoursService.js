import { API_BASE_URL } from "../config";
import { getAuthHeaders } from "./authService";

const API_URL = `${API_BASE_URL}/api/parcours`;

// =========================================================
// RÉCUPÉRER TOUS LES PARCOURS POUR L'ADMIN
// =========================================================

export const getAdminParcours = async (
    language = "fr"
) => {
    const response = await fetch(
        `${API_URL}/admin?lang=${language}`,
        {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (!response.ok) {
        const message = await response.text();

        throw new Error(
            message ||
            `Erreur ${response.status} lors de la récupération des parcours.`
        );
    }

    return response.json();
};

// =========================================================
// RÉCUPÉRER LES STATISTIQUES DES PARCOURS
// =========================================================

export const getParcoursStatistics = async () => {
    const response = await fetch(
        `${API_URL}/admin/statistiques`,
        {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (!response.ok) {
        const message = await response.text();

        throw new Error(
            message ||
            `Erreur ${response.status} lors de la récupération des statistiques du parcours.`
        );
    }

    return response.json();
};