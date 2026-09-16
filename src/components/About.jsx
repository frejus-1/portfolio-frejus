import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";
function About() {
    const { t } = useLanguage();

    return (
        <section id="apropos" className="section about-section">
            <ScrollReveal>
                <div className="section-heading">
                    <p className="section-label">
                        {t.about.title}
                    </p>

                    <h2>
                        {t.about.heading}
                    </h2>
                </div>
            </ScrollReveal>

            <div className="about-grid">
                <ScrollReveal direction="left">
                    <div className="about-text">
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

                <ScrollReveal direction="right" delay={150}>
                    <div className="about-highlight">
                        <div className="about-item">
                            <span className="about-number">01</span>

                            <div>
                                <h3>
                                    {t.about.webTitle}
                                </h3>

                                <p>
                                    {t.about.webDescription}
                                </p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span className="about-number">02</span>

                            <div>
                                <h3>
                                    {t.about.backendTitle}
                                </h3>

                                <p>
                                    {t.about.backendDescription}
                                </p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span className="about-number">03</span>

                            <div>
                                <h3>
                                    {t.about.mobileTitle}
                                </h3>

                                <p>
                                    {t.about.mobileDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

export default About;
