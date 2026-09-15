
import { useEffect, useState } from "react";

function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const hero = document.querySelector("#accueil");

            if (!hero) {
                return;
            }

            const heroBottom = hero.offsetTop + hero.offsetHeight;

            setVisible(window.scrollY > heroBottom);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            className={`back-to-top ${visible ? "back-to-top-visible" : ""}`}
            onClick={scrollToTop}
            aria-label="Retour en haut"
            title="Retour en haut"
        >
            <span>↑</span>
        </button>
    );
}

export default BackToTop;
