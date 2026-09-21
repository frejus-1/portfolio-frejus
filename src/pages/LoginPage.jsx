import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import "../styles/LoginPage.css";

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                username,
                password
            );

            navigate("/admin");

        } catch (error) {

            setError(
                error.message ||
                "Impossible de se connecter."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            <section className="login-card">

                <div className="login-header">

                    <span className="login-icon">
                        🔐
                    </span>

                    <h1>
                        Administration
                    </h1>

                    <p>
                        Connectez-vous pour accéder
                        au tableau de bord.
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="username">
                            Nom d'utilisateur
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            placeholder="admin"
                            autoComplete="username"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Mot de passe
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Votre mot de passe"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {error && (

                        <div
                            className="login-error"
                            role="alert"
                        >
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Connexion..."
                            : "Se connecter"
                        }

                    </button>

                </form>


                <button
                    type="button"
                    className="login-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Retour au portfolio
                </button>

            </section>

        </main>
    );
}

export default LoginPage;