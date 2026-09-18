import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

import {
    SiHtml5,
    SiJavascript,
    SiReact,
    SiVite,
    SiSpringboot,
    SiPhp,
    SiLaravel,
    SiFlutter,
    SiDart,
    SiMysql,
    SiGit,
    SiGithub,
    SiVercel,
} from "react-icons/si";

import {
    FaCss3Alt,
    FaJava,
    FaCode,
} from "react-icons/fa";
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

    const tools = [
        {
            name: "HTML5",
            icon: SiHtml5,
        },
        {
            name: "CSS3",
            icon: FaCss3Alt,
        },
        {
            name: "JavaScript",
            icon: SiJavascript,
        },
        {
            name: "React",
            icon: SiReact,
        },
        {
            name: "Vite",
            icon: SiVite,
        },
        {
            name: "Java",
            icon: FaJava,
        },
        {
            name: "Spring Boot",
            icon: SiSpringboot,
        },
        {
            name: "PHP",
            icon: SiPhp,
        },
        {
            name: "Laravel",
            icon: SiLaravel,
        },
        {
            name: "Flutter",
            icon: SiFlutter,
        },
        {
            name: "Dart",
            icon: SiDart,
        },
        {
            name: "MySQL",
            icon: SiMysql,
        },
        {
            name: "Git",
            icon: SiGit,
        },
        {
            name: "GitHub",
            icon: SiGithub,
        },
        {
            name: "VS Code",
            icon: FaCode,
        },
        {
            name: "Vercel",
            icon: SiVercel,
        },
    ];

    const firstRow = tools.slice(0, 8);
    const secondRow = tools.slice(8);

    const duplicatedFirstRow = [
        ...firstRow,
        ...firstRow,
        ...firstRow,
    ];

    const duplicatedSecondRow = [
        ...secondRow,
        ...secondRow,
        ...secondRow,
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

            {/* Cartes de compétences */}
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

                            <h3>
                                {group.title}
                            </h3>

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

            {/* Technologies utilisées */}
            <ScrollReveal
                direction="up"
                delay={250}
            >
                <div className="tools-showcase">
                    <div className="tools-showcase-heading">
                        <span className="tools-label">
                            {t.skills.toolsLabel}
                        </span>

                        <h3>
                            {t.skills.toolsHeading}
                        </h3>

                        <p>
                            {t.skills.toolsDescription}
                        </p>
                    </div>

                    <div className="tools-marquee">
                        {/* Première ligne */}
                        <div className="tools-marquee-track tools-marquee-left">
                            {duplicatedFirstRow.map(
                                (tool, index) => {
                                    const Icon = tool.icon;

                                    return (
                                        <div
                                            className="tool-item"
                                            key={`${tool.name}-first-${index}`}
                                        >
                                            <div className="tool-icon">
                                                <Icon />
                                            </div>

                                            <span>
                                                {tool.name}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {/* Deuxième ligne */}
                        <div className="tools-marquee-track tools-marquee-right">
                            {duplicatedSecondRow.map(
                                (tool, index) => {
                                    const Icon = tool.icon;

                                    return (
                                        <div
                                            className="tool-item"
                                            key={`${tool.name}-second-${index}`}
                                        >
                                            <div className="tool-icon">
                                                <Icon />
                                            </div>

                                            <span>
                                                {tool.name}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}

export default Skills;
