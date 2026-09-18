import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

const WHATSAPP_NUMBER = "2290152905310";

function Footer() {
    const { t, language } = useLanguage();

    const currentYear = new Date().getFullYear();

    const navigationLinks = [
        {
            label: t.nav.home,
            href: "#accueil",
        },
        {
            label: t.nav.about,
            href: "#apropos",
        },
        {
            label: t.nav.skills,
            href: "#competences",
        },
        {
            label: t.nav.projects,
            href: "#projets",
        },
        {
            label: t.nav.journey,
            href: "#parcours",
        },
        {
            label: t.nav.contact,
            href: "#contact",
        },
    ];

    const socialLinks = [
        {
            label: "GitHub",
            href: "https://github.com/frejus-1/",
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/",
        },
        {
            label: "Facebook",
            href: "https://www.facebook.com/frejus.adjanohoun.5/",
        },
        {
            label: "Instagram",
            href: "https://www.instagram.com/adjanohounf/",
        },
    ];

    /*
     * Message WhatsApp selon la langue du portfolio
     */
    const whatsappMessage =
        language === "en"
            ? "Hello Fréjus, I am contacting you from your portfolio. I would like to discuss a project with you."
            : "Bonjour Fréjus, je vous contacte depuis votre portfolio. J’aimerais échanger avec vous au sujet d’un projet.";

    /*
     * URL WhatsApp complète avec message prérempli
     */
    const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

    return (
        <footer className="site-footer">

            <div className="footer-container">

                <div className="footer-main">

                    {/* BRAND */}
                    <ScrollReveal direction="left">
                        <div className="footer-brand">

                            <a
                                href="#accueil"
                                className="footer-logo"
                            >
                                Fréjus<span>.</span>
                            </a>

                            <p>
                                {t.footer.description}
                            </p>

                        </div>
                    </ScrollReveal>

                    {/* NAVIGATION */}
                    <ScrollReveal
                        direction="up"
                        delay={200}
                    >
                        <div className="footer-navigation">

                            <h3>
                                {t.footer.navigation}
                            </h3>

                            <nav
                                aria-label={t.footer.navigationLabel}
                            >
                                {navigationLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                        </div>
                    </ScrollReveal>

                    {/* RÉSEAUX SOCIAUX */}
                    <ScrollReveal
                        direction="right"
                        delay={400}
                    >
                        <div className="footer-socials">

                            <h3>
                                {t.footer.socials}
                            </h3>

                            <div className="footer-social-list">

                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.label}
                                        <span>↗</span>
                                    </a>
                                ))}

                                {/* WHATSAPP */}
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-link"
                                >
                                    WhatsApp
                                    <span>↗</span>
                                </a>

                            </div>

                        </div>
                    </ScrollReveal>

                </div>

                {/* BAS DU FOOTER */}
                <ScrollReveal
                    direction="up"
                    delay={600}
                >
                    <div className="footer-bottom">

                        <p>
                            © {currentYear} Fréjus Adjanohoun.
                            {` ${t.footer.rights}`}
                        </p>

                        <a
                            href="#accueil"
                            className="footer-back-top"
                        >
                            {t.footer.backTop}
                            <span>↑</span>
                        </a>

                    </div>
                </ScrollReveal>

            </div>

        </footer>
    );
}

export default Footer;