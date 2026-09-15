import ScrollReveal from "./ScrollReveal";

const timelineItems = [
    {
        number: "01",
        category: "Formation",
        title: "Système Informatique et Logiciel",
        description:
            "Formation universitaire à l'IATF avec un apprentissage progressif du développement logiciel, des bases de données et des technologies web et mobile.",
        technologies: [
            "Programmation",
            "Bases de données",
            "Développement web",
        ],
    },
    {
        number: "02",
        category: "Développement Web",
        title: "Création de projets web",
        description:
            "Mise en pratique des connaissances à travers différents projets frontend et backend, avec une attention particulière portée à la structure, au responsive design et à l'expérience utilisateur.",
        technologies: [
            "HTML",
            "CSS",
            "JavaScript",
            "Laravel",
        ],
    },
    {
        number: "03",
        category: "Full Stack & Mobile",
        title: "Approfondissement des technologies",
        description:
            "Exploration de nouvelles technologies pour développer des applications complètes, du frontend au backend, ainsi que des applications mobiles.",
        technologies: [
            "React",
            "Spring Boot",
            "Flutter",
            "MySQL",
        ],
    },
];

function Timeline() {
    return (
        <section id="parcours" className="section timeline-section">
            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        Parcours
                    </p>

                    <h2>
                        Un parcours construit par la pratique.
                    </h2>

                    <p>
                        Une progression basée sur l'apprentissage,
                        la réalisation de projets et l'exploration
                        de nouvelles technologies.
                    </p>
                </div>
            </ScrollReveal>

            <div className="timeline">
                <div
                    className="timeline-line"
                    aria-hidden="true"
                ></div>

                {timelineItems.map((item, index) => (
                    <ScrollReveal
                        key={item.number}
                        direction={
                            index % 2 === 0
                                ? "left"
                                : "right"
                        }
                        delay={150 + index * 150}
                    >
                        <article
                            className={`timeline-item ${
                                index % 2 === 0
                                    ? "timeline-item-left"
                                    : "timeline-item-right"
                            }`}
                        >
                            <div className="timeline-marker">
                                <span>{item.number}</span>
                            </div>

                            <div className="timeline-card">
                                <span className="timeline-category">
                                    {item.category}
                                </span>

                                <h3>{item.title}</h3>

                                <p>
                                    {item.description}
                                </p>

                                <div className="timeline-technologies">
                                    {item.technologies.map(
                                        (technology) => (
                                            <span key={technology}>
                                                {technology}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </article>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

export default Timeline;
