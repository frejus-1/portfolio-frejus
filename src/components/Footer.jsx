import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

function Footer() {
    const { t } = useLanguage();

    const currentYear = new Date().getFullYear();

    const navigationLinks = [
        { label: t.nav.home, href: "#accueil" },
        { label: t.nav.about, href: "#apropos" },
        { label: t.nav.skills, href: "#competences" },
        { label: t.nav.projects, href: "#projets" },
        { label: t.nav.journey, href: "#parcours" },
        { label: t.nav.contact, href: "#contact" },
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
        {
            label: "WhatsApp",
            href: "https://wa.me/2290152905310",
        },
    ];

    return (
        <footer className="site-footer">
            <ScrollReveal direction="up">
                <div className="footer-container">

                    <div className="footer-main">

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

                        <div className="footer-navigation">
                            <h3>
                                {t.footer.navigation}
                            </h3>

                            <nav
                                aria-label={
                                    t.footer.navigationLabel
                                }
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
                            </div>
                        </div>
                    </div>

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

                </div>
            </ScrollReveal>
        </footer>
    );
}

export default Footer;