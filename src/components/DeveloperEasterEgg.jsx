import { useEffect, useState } from "react";
import { useLanguage } from "../context/useLanguage";

function DeveloperEasterEgg() {
    const { language } = useLanguage();

    const [secret, setSecret] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.key.length !== 1 ||
                event.ctrlKey ||
                event.altKey ||
                event.metaKey
            ) {
                return;
            }

            const nextSecret = (
                secret + event.key.toLowerCase()
            ).slice(-6);

            setSecret(nextSecret);

            if (nextSecret === "frejus") {
                setVisible(true);
                setSecret("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [secret]);

    useEffect(() => {
        if (!visible) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setVisible(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [visible]);

    const unlockGifts = () => {
        sessionStorage.setItem(
            "frejus-secret-unlocked",
            "true"
        );

        window.dispatchEvent(
            new Event("frejus-secret-unlocked")
        );

        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <div
            className="easter-egg-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    setVisible(false);
                }
            }}
        >
            <div className="easter-egg-card">

                <button
                    type="button"
                    className="easter-egg-close"
                    onClick={() => setVisible(false)}
                    aria-label={
                        language === "fr"
                            ? "Fermer"
                            : "Close"
                    }
                >
                    ×
                </button>

                <div className="easter-egg-icon">
                    &lt;/&gt;
                </div>

                <p className="easter-egg-label">
                    {language === "fr"
                        ? "Secret développeur"
                        : "Developer Easter Egg"}
                </p>

                <h2>
                    {language === "fr"
                        ? "Tu as trouvé le secret."
                        : "You found the secret."}
                </h2>

                <p>
                    {language === "fr"
                        ? "Bien joué. Tu explores vraiment le portfolio de Fréjus."
                        : "Well done. You are really exploring Fréjus' portfolio."}
                </p>

                <div className="easter-egg-code">
                    <span>const</span>{" "}
                    developer ={" "}
                    <strong>"Fréjus"</strong>;
                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={unlockGifts}
                >
                    {language === "fr"
                        ? "🎁 Explorer mes cadeaux"
                        : "🎁 Explore my gifts"}
                </button>

            </div>
        </div>
    );
}

export default DeveloperEasterEgg;