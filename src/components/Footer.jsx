import ScrollReveal from "./ScrollReveal";

function Footer() {
    const currentYear = new Date().getFullYear();

    const navigationLinks = [
        { label: "Accueil", href: "#accueil" },
        { label: "À propos", href: "#apropos" },
        { label: "Compétences", href: "#competences" },
        { label: "Projets", href: "#projets" },
        { label: "Parcours", href: "#parcours" },
        { label: "Contact", href: "#contact" },
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

                    {/* =========================
                        PARTIE PRINCIPALE
                       ========================= */}

                    <div className="footer-main">

                        <div className="footer-brand">

                            <a
                                href="#accueil"
                                className="footer-logo"
                            >
                                Fréjus<span>.</span>
                            </a>

                            <p>
                                Développeur Full Stack Web & Mobile,
                                étudiant en Système Informatique et
                                Logiciel.
                            </p>

                        </div>

                        {/* Navigation */}

                        <div className="footer-navigation">

                            <h3>
                                Navigation
                            </h3>

                            <nav aria-label="Navigation du pied de page">
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

                        {/* Réseaux */}

                        <div className="footer-socials">

                            <h3>
                                Me retrouver
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

                    {/* =========================
                        BAS DU FOOTER
                       ========================= */}

                    <div className="footer-bottom">

                        <p>
                            © {currentYear} Fréjus Adjanohoun.
                            Tous droits réservés.
                        </p>

                        <a
                            href="#accueil"
                            className="footer-back-top"
                        >
                            Retour en haut
                            <span>↑</span>
                        </a>

                    </div>

                </div>
            </ScrollReveal>

        </footer>
    );
}

export default Footer;
