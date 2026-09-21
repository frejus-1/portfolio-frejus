import { useState } from "react";
import { useLanguage } from "../context/useLanguage";
import TypingText from "./TypingText";

function Hero() {
    const { t } = useLanguage();

    const [showCvModal, setShowCvModal] = useState(false);

    const closeModal = () => {
        setShowCvModal(false);
    };

    return (
        <>
            <section id="accueil" className="hero">

                <div className="hero-content">

                    <p className="hero-intro">
                        {t("hero.greeting")}
                    </p>

                    <h1>
                        Fréjus<span> Adjanohoun</span>
                    </h1>

                    <h2>
                        <TypingText
                            words={t("hero.typingWords")}
                        />
                    </h2>

                    <p className="hero-description">
                        {t("hero.description")}
                    </p>

                    <div className="hero-actions">

                        <a
                            href="#projets"
                            className="button button-primary"
                        >
                            {t("hero.projects")}
                        </a>

                        <a
                            href="#contact"
                            className="button button-secondary"
                        >
                            {t("hero.contact")}
                        </a>

                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => setShowCvModal(true)}
                        >
                            {t("hero.cv")}
                        </button>

                    </div>

                    <div className="hero-socials">

                        <a
                            href="https://github.com/frejus-1/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                        </a>

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="code-card">

                        <div className="code-header">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="code-content">

                            <p>
                                <span className="code-keyword">
                                    const
                                </span>{" "}
                                developer = {"{"}
                            </p>

                            <p className="code-indent">
                                name: <span>"Fréjus Adjanohoun"</span>,
                            </p>

                            <p className="code-indent">
                                role: <span>"Full Stack Developer"</span>,
                            </p>

                            <p className="code-indent">
                                focus: <span>"Web & Mobile"</span>
                            </p>

                            <p>
                                {"};"}
                            </p>

                        </div>

                    </div>


                    <div className="floating-badge badge-react">
                        React
                    </div>

                    <div className="floating-badge badge-spring">
                        Spring Boot
                    </div>

                    <div className="floating-badge badge-flutter">
                        Flutter
                    </div>

                </div>

            </section>


            {/* ==========================================
                MODAL CV
            ========================================== */}

            {showCvModal && (
                <div
                    className="cv-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="cv-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cv-modal-title"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="cv-modal-close"
                            onClick={closeModal}
                            aria-label={t("hero.cvModal.close")}
                        >
                            ×
                        </button>


                        <div className="cv-modal-icon">
                            📄
                        </div>


                        <h3 id="cv-modal-title">
                            {t("hero.cvModal.title")}
                        </h3>


                        <p className="cv-modal-description">
                            {t("hero.cvModal.description")}
                        </p>


                        <div className="cv-modal-options">

                            {/* ==================================
                                CV FRANÇAIS
                            ================================== */}

                            <a
                                href="/cv-frejus-fr.pdf"
                                download="cv-frejus-fr.pdf"
                                className="cv-download-option"
                                onClick={closeModal}
                            >

                                <span className="cv-language">
                                    FR
                                </span>

                                <span className="cv-option-content">

                                    <strong>
                                        {t("hero.cvModal.french")}
                                    </strong>

                                    <small>
                                        {t(
                                            "hero.cvModal.frenchDescription"
                                        )}
                                    </small>

                                </span>

                                <span className="cv-download-icon">
                                    ↓
                                </span>

                            </a>


                            {/* ==================================
                                CV ANGLAIS
                            ================================== */}

                            <a
                                href="/cv-frejus-en.pdf"
                                download="cv-frejus-en.pdf"
                                className="cv-download-option"
                                onClick={closeModal}
                            >

                                <span className="cv-language">
                                    EN
                                </span>

                                <span className="cv-option-content">

                                    <strong>
                                        {t("hero.cvModal.english")}
                                    </strong>

                                    <small>
                                        {t(
                                            "hero.cvModal.englishDescription"
                                        )}
                                    </small>

                                </span>

                                <span className="cv-download-icon">
                                    ↓
                                </span>

                            </a>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
}

export default Hero;