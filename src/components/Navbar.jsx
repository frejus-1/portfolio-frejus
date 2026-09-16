import { useEffect, useState } from "react";
import { useLanguage } from "../context/useLanguage";

function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        return true;
    }

    if (savedTheme === "light") {
        return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(getInitialTheme);
    const [scrolled, setScrolled] = useState(false);

    const { language, toggleLanguage, t } = useLanguage();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const isDark = getInitialTheme();

        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !darkMode;

        setDarkMode(newDarkMode);

        document.documentElement.classList.toggle(
            "dark",
            newDarkMode
        );

        localStorage.setItem(
            "theme",
            newDarkMode ? "dark" : "light"
        );
    };

    return (
        <header
            className={`navbar ${
                scrolled ? "navbar-scrolled" : ""
            }`}
        >
            <a
                href="#accueil"
                className="logo"
                onClick={closeMenu}
            >
                Fréjus<span>.</span>
            </a>

            <button
                className="menu-toggle"
                type="button"
                aria-label={
                    menuOpen
                        ? language === "fr"
                            ? "Fermer le menu"
                            : "Close menu"
                        : language === "fr"
                        ? "Ouvrir le menu"
                        : "Open menu"
                }
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav
                className={`navigation ${
                    menuOpen ? "navigation-open" : ""
                }`}
            >
                <a href="#accueil" onClick={closeMenu}>
                    {t.nav.home}
                </a>

                <a href="#apropos" onClick={closeMenu}>
                    {t.nav.about}
                </a>

                <a href="#competences" onClick={closeMenu}>
                    {t.nav.skills}
                </a>

                <a href="#projets" onClick={closeMenu}>
                    {t.nav.projects}
                </a>

                <a href="#parcours" onClick={closeMenu}>
                    {t.nav.journey}
                </a>

                <a href="#contact" onClick={closeMenu}>
                    {t.nav.contact}
                </a>
            </nav>

            <div className="navbar-actions">
                <button
                    className="language-toggle"
                    type="button"
                    onClick={toggleLanguage}
                    aria-label={
                        language === "fr"
                            ? "Passer en anglais"
                            : "Switch to French"
                    }
                    title={
                        language === "fr"
                            ? "English"
                            : "Français"
                    }
                >
                    {language === "fr" ? "EN" : "FR"}
                </button>

                <button
                    className="theme-toggle"
                    type="button"
                    onClick={toggleTheme}
                    aria-label={
                        darkMode
                            ? "Activer le mode clair"
                            : "Activer le mode sombre"
                    }
                    title={
                        darkMode
                            ? "Mode clair"
                            : "Mode sombre"
                    }
                >
                    <span
                        className="theme-icon"
                        aria-hidden="true"
                    >
                        {darkMode ? "☀" : "☾"}
                    </span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;
