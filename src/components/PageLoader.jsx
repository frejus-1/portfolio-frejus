import { useEffect, useState } from "react";
import frejusPhoto from "../assets/frejus.png";

function PageLoader() {
    const [closing, setClosing] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const closeTimer = setTimeout(() => {
            setClosing(true);
        }, 2800);

        const hideTimer = setTimeout(() => {
            setVisible(false);
        }, 3300);

        return () => {
            clearTimeout(closeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`page-loader ${closing ? "page-loader--closing" : ""
                }`}
            aria-label="Chargement de la page"
        >
            <div className="page-loader-content">

                <div className="loader-photo-container">
                    <div className="loader-ring"></div>

                    <img
                        src={frejusPhoto}
                        alt="Fréjus Adjanohoun"
                        className="loader-photo"
                    />
                </div>

                <h1 className="loader-name">
                    Fréjus<span>.</span>
                </h1>

                <p className="loader-text">
                    Chargement de mon portfolio
                </p>

                <div className="loader-progress">
                    <div className="loader-progress-bar"></div>
                </div>

                <div className="loader-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>
        </div>
    );
}

export default PageLoader;