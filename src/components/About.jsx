import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function About() {
    const { t } = useLanguage();

    return (
        <section id="apropos" className="section about-section">
            {/* ==========================================
                EN-TÊTE
            ========================================== */}

            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        {t.about.title}
                    </p>

                    <h2>
                        {t.about.heading}
                    </h2>
                </div>
            </ScrollReveal>

            {/* ==========================================
                CONTENU PRINCIPAL
            ========================================== */}

            <div className="about-grid">
                {/* ======================================
                    TEXTE
                ====================================== */}

                <ScrollReveal direction="left">
                    <div className="about-text">
                        <span className="about-intro-label">
                            {t.about.introLabel}
                        </span>

                        <h3 className="about-main-title">
                            {t.about.mainTitle}
                        </h3>

                        <p>
                            {t.about.paragraph1}
                        </p>

                        <p>
                            {t.about.paragraph2}
                        </p>

                        <p>
                            {t.about.paragraph3}
                        </p>
                    </div>
                </ScrollReveal>

                {/* ======================================
                    DEVELOPER PROFILE CARD
                ====================================== */}

                <ScrollReveal
                    direction="right"
                    delay={150}
                >
                    <div className="about-profile-card">

                        {/* Décoration */}
                        <div className="about-profile-glow"></div>

                        <div className="about-profile-top">
                            <span className="about-profile-label">
                                {t.about.profileLabel}
                            </span>

                            <span className="about-profile-status">
                                <span></span>
                                {t.about.status}
                            </span>
                        </div>

                        <div className="about-profile-identity">
                            <div className="about-profile-initial">
                                F
                            </div>

                            <div>
                                <h3>
                                    FRÉJUS ADJANOHOUN
                                </h3>

                                <p>
                                    {t.about.profileRole}
                                </p>
                            </div>
                        </div>

                        <div className="about-profile-line"></div>

                        {/* Informations */}

                        <div className="about-profile-info">

                            <div className="about-profile-info-item">
                                <span>
                                    {t.about.locationLabel}
                                </span>

                                <strong>
                                    {t.about.location}
                                </strong>
                            </div>

                            <div className="about-profile-info-item">
                                <span>
                                    {t.about.educationLabel}
                                </span>

                                <strong>
                                    {t.about.education}
                                </strong>
                            </div>

                            <div className="about-profile-info-item">
                                <span>
                                    {t.about.focusLabel}
                                </span>

                                <strong>
                                    {t.about.focus}
                                </strong>
                            </div>
                        </div>

                        <div className="about-profile-line"></div>

                        {/* Technologies */}

                        <div className="about-profile-stack">
                            <span>
                                {t.about.stackLabel}
                            </span>

                            <div className="about-stack-tags">
                                <span>React</span>
                                <span>Spring Boot</span>
                                <span>Laravel</span>
                                <span>Flutter</span>
                            </div>
                        </div>

                    </div>
                </ScrollReveal>
            </div>

            {/* ==========================================
                POINTS FORTS
            ========================================== */}

            <ScrollReveal
                direction="up"
                delay={250}
            >
                <div className="about-values">

                    <div className="about-value">
                        <span className="about-value-number">
                            01
                        </span>

                        <div>
                            <h3>
                                {t.about.value1Title}
                            </h3>

                            <p>
                                {t.about.value1Description}
                            </p>
                        </div>
                    </div>

                    <div className="about-value">
                        <span className="about-value-number">
                            02
                        </span>

                        <div>
                            <h3>
                                {t.about.value2Title}
                            </h3>

                            <p>
                                {t.about.value2Description}
                            </p>
                        </div>
                    </div>

                    <div className="about-value">
                        <span className="about-value-number">
                            03
                        </span>

                        <div>
                            <h3>
                                {t.about.value3Title}
                            </h3>

                            <p>
                                {t.about.value3Description}
                            </p>
                        </div>
                    </div>

                </div>
            </ScrollReveal>
        </section>
    );
}

export default About;
