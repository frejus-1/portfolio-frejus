import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function Skills() {
    const { t } = useLanguage();

    const skillGroups = [
        {
            title: t.skills.frontendTitle,
            description: t.skills.frontendDescription,
            skills: [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Vite",
            ],
        },
        {
            title: t.skills.backendTitle,
            description: t.skills.backendDescription,
            skills: [
                "Java",
                "Spring Boot",
                "Laravel",
                "REST API",
                "JWT",
            ],
        },
        {
            title: t.skills.mobileTitle,
            description: t.skills.mobileDescription,
            skills: [
                "Flutter",
                "Dart",
            ],
        },
        {
            title: t.skills.dataTitle,
            description: t.skills.dataDescription,
            skills: [
                "MySQL",
                "Git",
                "GitHub",
                "VS Code",
            ],
        },
    ];

    return (
        <section
            id="competences"
            className="section skills-section"
        >
            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        {t.skills.title}
                    </p>

                    <h2>
                        {t.skills.heading}
                    </h2>

                    <p>
                        {t.skills.subtitle}
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