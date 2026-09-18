import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function Timeline() {
    const { t } = useLanguage();

    const timelineItems = [
        {
            number: "01",
            category: t.timeline.item1Category,
            title: t.timeline.item1Title,
            location: t.timeline.item1Location,
            description: t.timeline.item1Description,
            link: "https://esfbenin.net/",
            technologies: [
                "Informatique",
                "Programmation",
                "Bases de données",
            ],
        },
        {
            number: "03",
            category: t.timeline.item3Category,
            title: t.timeline.item3Title,
            location: t.timeline.item3Location,
            description: t.timeline.item3Description,
            link: "https://cosit-benin.com/",
            technologies: [
                "HTML",
                "CSS",
                "JavaScript",
            ],
        },
        {
            number: "02",
            category: t.timeline.item2Category,
            title: t.timeline.item2Title,
            location: t.timeline.item2Location,
            description: t.timeline.item2Description,
            link: "https://iatf-university.org/",
            technologies: [
                "Système Informatique",
                "Développement Web",
                "Développement Logiciel",
            ],
        },
        {
            number: "04",
            category: t.timeline.item4Category,
            title: t.timeline.item4Title,
            location: t.timeline.item4Location,
            description: t.timeline.item4Description,
            technologies: [
                "React",
                "Spring Boot",
                "Laravel",
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

                                <h3>
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="timeline-title-link"
                                        >
                                            {item.title}
                                        </a>
                                    ) : (
                                        item.title
                                    )}
                                </h3>

                                <span className="timeline-location">
                                    {item.location}
                                </span>

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

                                {item.link && (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="timeline-link"
                                    >
                                        {t.timeline.visitWebsite}
                                        <span aria-hidden="true">
                                            ↗
                                        </span>
                                    </a>
                                )}
                            </div>
                        </article>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

export default Timeline;

