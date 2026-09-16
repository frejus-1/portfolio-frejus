import { useLanguage } from "../context/useLanguage";

function Hero() {
    const { t } = useLanguage();

    return (
        <section id="accueil" className="hero">
            <div className="hero-content">
                <p className="hero-intro">
                    {t.hero.greeting}
                </p>

                <h1>
                    Fréjus<span> Adjanohoun</span>
                </h1>

                <h2>
                    {t.hero.role}
                </h2>

                <p className="hero-description">
                    {t.hero.description}
                </p>

                <div className="hero-actions">
                    <a
                        href="#projets"
                        className="button button-primary"
                    >
                        {t.hero.projects}
                    </a>

                    <a
                        href="#contact"
                        className="button button-secondary"
                    >
                        {t.hero.contact}
                    </a>
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

                        <p>{"};"}</p>
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
    );
}

export default Hero;

