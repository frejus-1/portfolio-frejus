import ScrollReveal from "./ScrollReveal";

const skillGroups = [
    {
        title: "Frontend",
        description:
            "Création d'interfaces web modernes, responsives et interactives.",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Vite",
        ],
    },
    {
        title: "Backend",
        description:
            "Développement d'API et de services côté serveur.",
        skills: [
            "Java",
            "Spring Boot",
            "Laravel",
            "REST API",
            "JWT",
        ],
    },
    {
        title: "Mobile",
        description:
            "Développement d'applications mobiles avec une approche multiplateforme.",
        skills: [
            "Flutter",
            "Dart",
        ],
    },
    {
        title: "Données & outils",
        description:
            "Gestion des données et utilisation des outils de développement.",
        skills: [
            "MySQL",
            "Git",
            "GitHub",
            "VS Code",
        ],
    },
];

function Skills() {
    return (
        <section id="competences" className="section skills-section">
            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        Compétences
                    </p>

                    <h2>
                        Les technologies que j'utilise.
                    </h2>

                    <p>
                        Un ensemble de technologies que j'apprends
                        et que je mets progressivement en pratique
                        à travers mes projets.
                    </p>
                </div>
            </ScrollReveal>

            <div className="skills-grid">
                {skillGroups.map((group, index) => (
                    <ScrollReveal
                        key={group.title}
                        direction={
                            index % 2 === 0
                                ? "left"
                                : "right"
                        }
                        delay={150 + index * 100}
                    >
                        <article className="skill-card">
                            <div className="skill-card-header">
                                <span className="skill-card-number">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="skill-card-line"></span>
                            </div>

                            <h3>{group.title}</h3>

                            <p>
                                {group.description}
                            </p>

                            <div className="skills-list">
                                {group.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="skill-tag"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </article>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

export default Skills;
