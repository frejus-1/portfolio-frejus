import { useEffect, useState } from "react";

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

        document.documentElement.classList.toggle("dark", newDarkMode);

        localStorage.setItem(
            "theme",
            newDarkMode ? "dark" : "light"
        );
    };

    return (
        <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
            <a href="#accueil" className="logo" onClick={closeMenu}>
                Fréjus<span>.</span>
            </a>

            <button
                className="menu-toggle"
                type="button"
                aria-label={
                    menuOpen ? "Fermer le menu" : "Ouvrir le menu"
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
                    Accueil
                </a>

                <a href="#apropos" onClick={closeMenu}>
                    À propos
                </a>

                <a href="#competences" onClick={closeMenu}>
                    Compétences
                </a>

                <a href="#projets" onClick={closeMenu}>
                    Projets
                </a>

                <a href="#parcours" onClick={closeMenu}>
                    Parcours
                </a>

                <a href="#contact" onClick={closeMenu}>
                    Contact
                </a>
            </nav>

            <button
                className="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={
                    darkMode
                        ? "Activer le mode clair"
                        : "Activer le mode sombre"
                }
                title={darkMode ? "Mode clair" : "Mode sombre"}
            >
                <span className="theme-icon" aria-hidden="true">
                    {darkMode ? "☀" : "☾"}
                </span>
            </button>
        </header>
    );
}

export default Navbar;