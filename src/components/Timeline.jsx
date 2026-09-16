import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function Timeline() {
    const { t } = useLanguage();

    const timelineItems = [
        {
            number: "01",
            category: t.timeline.item1Category,
            title: t.timeline.item1Title,
            description: t.timeline.item1Description,
            technologies: [
                "Programmation",
                "Bases de données",
                "Développement web",
            ],
        },
        {
            number: "02",
            category: t.timeline.item2Category,
            title: t.timeline.item2Title,
            description: t.timeline.item2Description,
            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
                "Laravel",
            ],
        },
        {
            number: "03",
            category: t.timeline.item3Category,
            title: t.timeline.item3Title,
            description: t.timeline.item3Description,
            technologies: [
                "React",
                "Spring Boot",
                "Flutter",
                "MySQL",
            ],
        },
    ];

    return (
        <section id="parcours" className="section timeline-section">
            <ScrollReveal direction="up">
                <div className="section-heading">
                    <p className="section-label">
                        {t.timeline.title}
                    </p>

                    <h2>
                        {t.timeline.heading}
                    </h2>

                    <p>
                        {t.timeline.subtitle}
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