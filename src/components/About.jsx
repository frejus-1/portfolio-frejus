import ScrollReveal from "./ScrollReveal";

function About() {
    return (
        <section id="apropos" className="section about-section">
            <ScrollReveal>
                <div className="section-heading">
                    <p className="section-label">À propos</p>

                    <h2>
                        Construire, apprendre et progresser.
                    </h2>
                </div>
            </ScrollReveal>

            <div className="about-grid">
                <ScrollReveal direction="left">
                    <div className="about-text">
                        <p>
                            Je suis Fréjus Adjanohoun, étudiant en
                            Système Informatique et Logiciel à l'IATF
                            et passionné par le développement web et
                            mobile.
                        </p>

                        <p>
                            Je m'intéresse particulièrement à la
                            conception d'applications modernes, aux
                            interfaces web, aux API et au développement
                            d'applications mobiles.
                        </p>

                        <p>
                            Mon objectif est de continuer à renforcer
                            mes compétences techniques à travers des
                            projets concrets et de participer à la
                            réalisation de solutions utiles, accessibles
                            et bien conçues.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={150}>
                    <div className="about-highlight">
                        <div className="about-item">
                            <span className="about-number">01</span>

                            <div>
                                <h3>Développement Web</h3>

                                <p>
                                    Création d'interfaces modernes et
                                    responsive avec les technologies
                                    du web.
                                </p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span className="about-number">02</span>

                            <div>
                                <h3>Backend & API</h3>

                                <p>
                                    Conception de services backend et
                                    découverte de l'architecture des
                                    applications modernes.
                                </p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span className="about-number">03</span>

                            <div>
                                <h3>Développement Mobile</h3>

                                <p>
                                    Exploration du développement
                                    d'applications mobiles avec
                                    Flutter et Dart.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}

export default About