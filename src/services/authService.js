const API_URL = "http://localhost:8080/api/auth";

export async function login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        console.error(
            "Impossible de lire la réponse du serveur :",
            error
        );
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Identifiant ou mot de passe incorrect."
        );
    }

    if (!data?.token) {
        throw new Error(
            "Le serveur n'a pas retourné de token."
        );
    }

    localStorage.setItem(
        "admin_token",
        data.token
    );

    localStorage.setItem(
        "admin_role",
        data.role
    );

    return data;
}

export function getToken() {
    return localStorage.getItem("admin_token");
}

export function getRole() {
    return localStorage.getItem("admin_role");
}

export function isAuthenticated() {
    const token = getToken();
    const role = getRole();

    return Boolean(
        token &&
        role === "ADMIN"
    );
}

export function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
}

export function getAuthHeaders() {
    const token = getToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };

}

export async function changePassword(
    currentPassword,
    newPassword
) {
    const token = getToken();

    if (!token) {
        throw new Error(
            "Votre session administrateur a expiré. Veuillez vous reconnecter."
        );
    }

    const response = await fetch(
        `${API_URL}/change-password`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        }
    );

    if (response.status === 401) {
        throw new Error(
            "Votre session a expiré. Veuillez vous reconnecter."
        );
    }

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            "Impossible de modifier le mot de passe."
        );
    }

    return data;
}