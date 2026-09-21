import {
    useEffect,
    useRef,
} from "react";

import { useLanguage } from "../context/useLanguage";
import "../styles/Tarifs.css";

// Numéro WhatsApp au format international
const WHATSAPP_NUMBER = "2290152905310";

function Tarifs({ isOpen, onClose }) {
    const { t } = useLanguage();

    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    /*
     * Gestion complète du cycle d'ouverture
     * et de fermeture de la modal.
     */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        /*
         * Mémoriser l'élément actuellement focusé
         * avant l'ouverture.
         */
        previousFocusRef.current =
            document.activeElement;

        /*
         * Bloquer le scroll de la page derrière.
         */
        document.documentElement.style.overflow =
            "hidden";

        document.body.style.overflow =
            "hidden";

        /*
         * Donner le focus au bouton Fermer
         * une fois la modal montée dans le DOM.
         */
        const focusTimer = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const handleKeyDown = (event) => {
            /*
             * ESC
             */
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            /*
             * Gestion du focus avec TAB
             */
            if (event.key !== "Tab") {
                return;
            }

            const modal = modalRef.current;

            if (!modal) {
                return;
            }

            const focusableElements =
                modal.querySelectorAll(
                    `
                    button:not([disabled]),
                    a[href],
                    input:not([disabled]),
                    textarea:not([disabled]),
                    select:not([disabled]),
                    [tabindex]:not([tabindex="-1"])
                    `
                );

            const elements = Array.from(
                focusableElements
            );

            if (elements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = elements[0];

            const lastElement =
                elements[elements.length - 1];

            /*
             * TAB depuis le dernier élément
             * → retour au premier.
             */
            if (
                !event.shiftKey &&
                document.activeElement ===
                    lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
                return;
            }

            /*
             * SHIFT + TAB depuis le premier élément
             * → retour au dernier.
             */
            if (
                event.shiftKey &&
                document.activeElement ===
                    firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        /*
         * Nettoyage exécuté à chaque fermeture
         * ou avant une nouvelle ouverture.
         */
        return () => {
            window.clearTimeout(focusTimer);

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            /*
             * Toujours restaurer le scroll.
             */
            document.documentElement.style.overflow =
                "";

            document.body.style.overflow =
                "";

            /*
             * Restaurer le focus sur le bouton
             * qui avait ouvert la modal.
             */
            if (
                previousFocusRef.current &&
                document.contains(
                    previousFocusRef.current
                )
            ) {
                previousFocusRef.current.focus();
            }

            previousFocusRef.current = null;
        };
    }, [isOpen, onClose]);

    /*
     * Quand la modal est fermée,
     * elle n'est pas rendue.
     */
    if (!isOpen) {
        return null;
    }

    /*
     * Clic sur l'arrière-plan uniquement.
     */
    const handleOverlayClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose();
        }
    };

    /*
     * Ouvrir WhatsApp avec l'offre
     * automatiquement préremplie.
     */
    const handleWhatsApp = (service) => {
        const message = t(
            "tarifs.whatsappMessage"
        )
            .replace(
                "{service}",
                service.title
            )
            .replace(
                "{price}",
                service.price
            );

        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                message
            )}`;

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    /*
     * Liste des services traduits
     */
    const services =
        t("tarifs.services") || [];

    return (
        <div
            className="tarifs-overlay"
            role="presentation"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="tarifs-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tarifs-title"
                aria-describedby="tarifs-description"
            >
                {/* ================================
                    EN-TÊTE DE LA MODAL
                ================================= */}

                <div className="tarifs-header">
                    <div>
                        <span className="tarifs-surtitle">
                            {t(
                                "tarifs.surtitle"
                            )}
                        </span>

                        <h2 id="tarifs-title">
                            {t(
                                "tarifs.title"
                            )}
                        </h2>

                        <p id="tarifs-description">
                            {t(
                                "tarifs.description"
                            )}
                        </p>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="tarifs-close"
                        onClick={onClose}
                        aria-label={t(
                            "tarifs.close"
                        )}
                        title={t(
                            "tarifs.close"
                        )}
                    >
                        ×
                    </button>
                </div>

                {/* ================================
                    LISTE DES TARIFS
                ================================= */}

                <div className="tarifs-grid">
                    {services.map(
                        (service, index) => (
                            <article
                                className="tarif-card"
                                key={`${service.title}-${index}`}
                            >
                                <div className="tarif-card-top">
                                    <span className="tarif-number">
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </div>

                                <h3>
                                    {service.title}
                                </h3>

                                <p className="tarif-price">
                                    {service.price}
                                </p>

                                <p className="tarif-description">
                                    {
                                        service.description
                                    }
                                </p>

                                <button
                                    type="button"
                                    className="tarif-whatsapp-button"
                                    onClick={() =>
                                        handleWhatsApp(
                                            service
                                        )
                                    }
                                >
                                    <span
                                        className="tarif-whatsapp-icon"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.93L.1 24l6.34-1.66a11.9 11.9 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.47-8.39ZM12.09 21.8h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.76.99 1-3.67-.23-.38a9.87 9.87 0 0 1-1.51-5.27C2.17 6.43 6.62 1.98 12.08 1.98c2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.87 9.94Zm5.43-7.42c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.53.07-.81.38-.28.3-1.06 1.04-1.06 2.53 0 1.49 1.08 2.93 1.23 3.13.15.2 2.13 3.25 5.16 4.55.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"
                                            />
                                        </svg>
                                    </span>

                                    <span>
                                        {t(
                                            "tarifs.whatsappButton"
                                        )}
                                    </span>
                                </button>
                            </article>
                        )
                    )}
                </div>

                {/* ================================
                    PIED DE LA MODAL
                ================================= */}

                <div className="tarifs-footer">
                    <p>
                        {t(
                            "tarifs.footer1"
                        )}
                    </p>

                    <p>
                        {t(
                            "tarifs.footer2"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Tarifs;