import { useEffect, useState } from "react";
import { useLanguage } from "../context/useLanguage";

const API_URL = "http://localhost:8080/api/parcours";

function Timeline() {
    const { language, t } = useLanguage();

    const [parcours, setParcours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParcours = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `${API_URL}?lang=${language}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Erreur HTTP : ${response.status}`
                    );
                }

                const data = await response.json();

                const sortedData = [...data].sort(
                    (a, b) => a.ordre - b.ordre
                );

                setParcours(sortedData);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement du parcours :",
                    error
                );

                setParcours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchParcours();
    }, [language]);

    return (
        <section
            className="timeline-section section"
            id="parcours"
        >
            <div className="container">

                {/* EN-TÊTE */}
                <div className="section-header">
                    <span className="section-label">
                        {t("timeline.title")}
                    </span>

                    <h2 className="section-title">
                        {t("timeline.heading")}
                    </h2>

                    <p className="section-subtitle">
                        {t("timeline.subtitle")}
                    </p>
                </div>

                {/* CHARGEMENT */}
                {loading && (
                    <div className="timeline-loading">
                        <span className="timeline-loading-spinner"></span>

                        <p>
                            {language === "fr"
                                ? "Chargement..."
                                : "Loading..."}
                        </p>
                    </div>
                )}

                {/* PARCOURS */}
                {!loading && parcours.length > 0 && (
                    <div className="timeline">

                        {parcours.map((item, index) => {
                            const translation =
                                item.translation;

                            if (!translation) {
                                return null;
                            }

                            const isLeft =
                                index % 2 === 0;

                            const technologies = [
                                ...(item.technologies || [])
                            ].sort(
                                (a, b) =>
                                    a.ordre - b.ordre
                            );

                            return (
                                <div
                                    className={`timeline-item ${
                                        isLeft
                                            ? "timeline-item-left"
                                            : "timeline-item-right"
                                    }`}
                                    key={item.id}
                                >

                                    {/* NUMÉRO */}
                                    <div className="timeline-marker">
                                        <span>
                                            {item.numero}
                                        </span>
                                    </div>

                                    {/* CONTENU */}
                                    <div className="timeline-content">

                                        {/* PÉRIODE */}
                                        <div className="timeline-period">
                                            {translation.periode}
                                        </div>

                                        {/* TITRE */}
                                        <h3 className="timeline-title">
                                            {translation.title}
                                        </h3>

                                        {/* LIEU */}
                                        {translation.location && (
                                            <div className="timeline-location">
                                                <span className="timeline-location-icon">
                                                    📍
                                                </span>

                                                <span>
                                                    {translation.location}
                                                </span>
                                            </div>
                                        )}

                                        {/* DESCRIPTION */}
                                        {translation.description && (
                                            <p className="timeline-description">
                                                {
                                                    translation.description
                                                }
                                            </p>
                                        )}

                                        {/* TECHNOLOGIES */}
                                        {technologies.length > 0 && (
                                            <div className="timeline-technologies">
                                                {technologies.map(
                                                    (technology) => (
                                                        <span
                                                            className="timeline-tech"
                                                            key={
                                                                technology.id
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
                                                href={item.lien}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="timeline-link"
                                            >
                                                <span>
                                                    {t(
                                                        "timeline.visitWebsite"
                                                    )}
                                                </span>

                                                <span>
                                                    ↗
                                                </span>
                                            </a>
                                        )}

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

                {/* AUCUN PARCOURS */}
                {!loading &&
                    parcours.length === 0 && (
                        <div className="timeline-empty">
                            <p>
                                {language === "fr"
                                    ? "Aucun parcours disponible."
                                    : "No journey available."}
                            </p>
                        </div>
                    )}

            </div>
        </section>
    );
}

export default Timeline;