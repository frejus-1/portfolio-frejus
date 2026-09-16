import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function NotFound() {
    const { language } = useLanguage();

    const content =
        language === "fr"
            ? {
                  badge: "Erreur 404",
                  title: "Page introuvable",
                  description:
                      "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
                  button: "Retour à l'accueil",
              }
            : {
                  badge: "Error 404",
                  title: "Page not found",
                  description:
                      "Sorry, the page you're looking for doesn't exist or has been moved.",
                  button: "Back to home",
              };

    return (
        <main className="not-found">
            <div className="not-found-background">
                <span className="not-found-circle circle-one"></span>
                <span className="not-found-circle circle-two"></span>
                <span className="not-found-circle circle-three"></span>
            </div>

            <div className="not-found-content">
                <div className="not-found-number" aria-hidden="true">
                    404
                </div>

                <span className="not-found-badge">
                    {content.badge}
                </span>

                <h1>{content.title}</h1>

                <p>{content.description}</p>

                <Link to="/" className="not-found-button">
                    <span>←</span>
                    {content.button}
                </Link>
            </div>
        </main>
    );
}

export default NotFound;