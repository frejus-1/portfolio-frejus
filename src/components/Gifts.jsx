import { useEffect } from "react";
import { useLanguage } from "../context/useLanguage";

function Gifts({ isOpen, onClose }) {
    const { t, language } = useLanguage();
    const gifts = t.gifts;

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleGiftClick = (gift) => {
        const message =
            language === "fr"
                ? `Bonjour Fréjus 👋

J'ai découvert le secret de ton portfolio 🎁 et j'aimerais profiter d'une de tes offres promotionnelles.

🎁 Offre : ${gift.title}
💰 Réduction : ${gift.discount}
🔑 Code promo : ${gift.code}

${gift.message}

Je voudrais en discuter avec toi pour en savoir plus.`

                : `Hello Fréjus 👋

I discovered the secret on your portfolio 🎁 and I would like to take advantage of one of your special offers.

🎁 Offer: ${gift.title}
💰 Discount: ${gift.discount}
🔑 Promo code: ${gift.code}

${gift.message}

I would like to discuss it with you and get more details.`;

        const whatsappUrl =
            `https://wa.me/2290152905310?text=${encodeURIComponent(
                message
            )}`;

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div
            className="gifts-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gifts-modal-title"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="gifts-modal-window">

                {/* HEADER */}

                <div className="gifts-modal-header">
                    <div>
                        <span className="gifts-modal-label">
                            {gifts.label}
                        </span>

                        <h2 id="gifts-modal-title">
                            {gifts.title}
                            <span>
                                {gifts.highlight}
                            </span>
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="gifts-modal-close"
                        onClick={onClose}
                        aria-label={
                            language === "fr"
                                ? "Fermer"
                                : "Close"
                        }
                    >
                        ×
                    </button>
                </div>

                {/* DESCRIPTION */}

                <p className="gifts-modal-description">
                    {gifts.description}
                </p>

                {/* OFFRES */}

                <div className="gifts-grid">
                    {gifts.items.map((gift) => (
                        <button
                            type="button"
                            className="gift-card"
                            key={gift.id}
                            onClick={() =>
                                handleGiftClick(gift)
                            }
                        >
                            <div className="gift-icon">
                                {gift.icon}
                            </div>

                            <div className="gift-content">

                                <div className="gift-discount">
                                    {gift.discount}
                                </div>

                                <h3>
                                    {gift.title}
                                </h3>

                                <p>
                                    {gift.description}
                                </p>

                                <div className="gift-code">
                                    <span>
                                        {gifts.codeLabel}
                                    </span>

                                    <strong>
                                        {gift.code}
                                    </strong>
                                </div>

                                <span className="gift-action">
                                    {gifts.action}

                                    <span aria-hidden="true">
                                        →
                                    </span>
                                </span>

                            </div>
                        </button>
                    ))}
                </div>

                {/* FOOTER */}

                <div className="gifts-modal-footer">
                    <span>🎁</span>

                    <p>
                        {gifts.footer}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Gifts;