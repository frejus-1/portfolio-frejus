import { API_BASE_URL } from "../config";
import { getAuthHeaders } from "./authService";

const API_URL = `${API_BASE_URL}/api/projects`;

/*
 * =========================================================
 * RÉCUPÉRER TOUS LES PROJETS
 * =========================================================
 */

export async function getProjects() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            "Impossible de récupérer les projets."
        );
    }

    return response.json();
}

/*
 * =========================================================
 * RÉCUPÉRER UN PROJET
 * =========================================================
 */

export async function getProject(id) {
    const response = await fetch(
        `${API_URL}/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Projet introuvable."
        );
    }

    return response.json();
}

/*
 * =========================================================
 * CRÉER UN PROJET
 * =========================================================
 */

export async function createProject(
    project,
    imageFile = null
) {
    const formData = new FormData();

    formData.append(
        "project",
        new Blob(
            [
                JSON.stringify(project)
            ],
            {
                type: "application/json",
            }
        )
    );

    if (imageFile) {
        formData.append(
            "image",
            imageFile
        );
    }

    const response = await fetch(
        API_URL,
        {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
            },
            body: formData,
        }
    );

    if (!response.ok) {
        if (
            response.status === 401 ||
            response.status === 403
        ) {
            throw new Error(
                "Vous devez être connecté en tant qu'administrateur."
            );
        }

        if (response.status === 413) {
            throw new Error(
                "L'image est trop volumineuse."
            );
        }

        const message =
            await extractErrorMessage(response);

        throw new Error(
            message ||
            "Impossible de créer le projet."
        );
    }

    return response.json();
}

/*
 * =========================================================
 * MODIFIER UN PROJET
 * =========================================================
 */

export async function updateProject(
    id,
    project,
    imageFile = null
) {
    const formData = new FormData();

    formData.append(
        "project",
        new Blob(
            [
                JSON.stringify(project)
            ],
            {
                type: "application/json",
            }
        )
    );

    if (imageFile) {
        formData.append(
            "image",
            imageFile
        );
    }

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
            },
            body: formData,
        }
    );

    if (!response.ok) {
        if (
            response.status === 401 ||
            response.status === 403
        ) {
            throw new Error(
                "Vous devez être connecté en tant qu'administrateur."
            );
        }

        if (response.status === 413) {
            throw new Error(
                "L'image est trop volumineuse."
            );
        }

        const message =
            await extractErrorMessage(response);

        throw new Error(
            message ||
            "Impossible de modifier le projet."
        );
    }

    return response.json();
}

/*
 * =========================================================
 * SUPPRIMER UN PROJET
 * =========================================================
 */

export async function deleteProject(id) {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        }
    );

    if (!response.ok) {
        if (
            response.status === 401 ||
            response.status === 403
        ) {
            throw new Error(
                "Vous devez être connecté en tant qu'administrateur."
            );
        }

        const message =
            await extractErrorMessage(response);

        throw new Error(
            message ||
            "Impossible de supprimer le projet."
        );
    }

    return true;
}

/*
 * =========================================================
 * EXTRAIRE LE MESSAGE D'ERREUR DU BACKEND
 * =========================================================
 */

async function extractErrorMessage(response) {
    try {
        const data = await response.json();

        return (
            data?.message ||
            data?.error ||
            null
        );
    } catch {
        return null;
    }
}