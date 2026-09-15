import { useEffect, useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

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

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else if (savedTheme === "light") {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            setDarkMode(prefersDark);

            if (prefersDark) {
                document.documentElement.classList.add("dark");
            }
        }
    }, []);

    const toggleTheme = () => {
        const newDarkMode = !darkMode;

        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
            <a href="#accueil" className="logo" onClick={closeMenu}>
                Fréjus<span>.</span>
            </a>

            <button
                className="menu-toggle"
                type="button"
                aria-label="Ouvrir le menu"
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
                <span className="theme-icon">
                    {darkMode ? "☀" : "☾"}
                </span>
            </button>
        </header>
    );
}

export default Navbar;
