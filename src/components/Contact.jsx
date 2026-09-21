import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

const API_URL = "http://localhost:8080/api/contact";

const WHATSAPP_NUMBER = "2290152905310";

function Contact() {
    const { t, language } = useLanguage();

    const [formStatus, setFormStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    /*
     * Message WhatsApp selon la langue du portfolio
     */
    const whatsappMessage =
        language === "en"
            ? "Hello Fréjus, I am contacting you from your portfolio. I would like to discuss a project with you."
            : "Bonjour Fréjus, je vous contacte depuis votre portfolio. J’aimerais échanger avec vous au sujet d’un projet.";

    /*
     * URL WhatsApp avec message prérempli
     */
    const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

    /*
     * Informations de contact
     */
    const contactItems = [
        {
            label: t("contact.email"),
            value: "f2987319@gmail.com",
            href: "mailto:f2987319@gmail.com",
        },
        {
            label: t("contact.whatsapp"),
            value: "+229 01 52 90 53 10",
            href: whatsappUrl,
        },
        {
            label: t("contact.github"),
            value: "github.com/frejus-1",
            href: "https://github.com/frejus-1/",
        },
        {
            label: t("contact.linkedin"),
            value: "Fréjus Adjanohoun",
            href: "https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/",
        },
    ];

    /*
     * Envoi du formulaire vers Spring Boot
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormStatus("sending");
        setErrorMessage("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        const contactMessage = {
            nom: formData.get("nom"),
            email: formData.get("email"),
            sujet: formData.get("sujet"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(contactMessage),
            });

            if (!response.ok) {
                let errorText = "";

                try {
                    const data = await response.json();

                    if (data?.message) {
                        errorText = data.message;
                    }
                } catch {
                    // La réponse peut ne pas contenir de JSON.
                }

                setErrorMessage(
                    errorText || t("contact.error")
                );

                setFormStatus("error");
                return;
            }

            /*
             * Le message a été enregistré avec succès.
             */
            form.reset();

            setFormStatus("success");
        } catch (error) {
            console.error(
                "Erreur lors de l'envoi du message :",
                error
            );

            setErrorMessage(
                t("contact.networkError")
            );

            setFormStatus("error");
        }
    };

    return (
        <section
            id="contact"
            className="section contact-section"
        >
            <div className="contact-container">

                <ScrollReveal direction="left">
                    <div className="contact-content">

                        <p className="section-label">
                            {t("contact.title")}
                        </p>

                        <h2>
                            {t("contact.heading")}
                            <span>
                                {" "}
                                {t(
                                    "contact.headingHighlight"
                                )}
                            </span>
                        </h2>

                        <p className="contact-introduction">
                            {t("contact.introduction")}
                        </p>

                        <div className="contact-list">

                            {contactItems.map(
                                (item, index) => (
                                    <ScrollReveal
                                        key={item.label}
                                        direction="left"
                                        delay={
                                            150 +
                                            index * 100
                                        }
                                    >
                                        <a
                                            href={item.href}
                                            target={
                                                item.href.startsWith(
                                                    "mailto:"
                                                )
                                                    ? undefined
                                                    : "_blank"
                                            }
                                            rel={
                                                item.href.startsWith(
                                                    "mailto:"
                                                )
                                                    ? undefined
                                                    : "noopener noreferrer"
                                            }
                                            className="contact-item"
                                        >
                                            <span className="contact-item-number">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <span className="contact-item-content">

                                                <span className="contact-item-label">
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                                <span className="contact-item-value">
                                                    {
                                                        item.value
                                                    }
                                                </span>

                                            </span>

                                            <span className="contact-item-arrow">
                                                ↗
                                            </span>
                                        </a>
                                    </ScrollReveal>
                                )
                            )}

                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal
                    direction="right"
                    delay={150}
                >
                    <div className="contact-form-wrapper">

                        <div className="contact-form-header">

                            <span>
                                {t(
                                    "contact.sendMessage"
                                )}
                            </span>

                            <span className="contact-form-status">
                                {t(
                                    "contact.available"
                                )}
                            </span>

                        </div>

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label htmlFor="nom">
                                    {t(
                                        "contact.name"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    placeholder={t(
                                        "contact.namePlaceholder"
                                    )}
                                    required
                                    disabled={
                                        formStatus ===
                                        "sending"
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="email">
                                    {t(
                                        "contact.email"
                                    )}
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="votre@email.com"
                                    required
                                    disabled={
                                        formStatus ===
                                        "sending"
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="sujet">
                                    {t(
                                        "contact.subject"
                                    )}
                                </label>

                                <input
                                    type="text"
                                    id="sujet"
                                    name="sujet"
                                    placeholder={t(
                                        "contact.subjectPlaceholder"
                                    )}
                                    required
                                    disabled={
                                        formStatus ===
                                        "sending"
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="message">
                                    {t(
                                        "contact.message"
                                    )}
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder={t(
                                        "contact.messagePlaceholder"
                                    )}
                                    required
                                    disabled={
                                        formStatus ===
                                        "sending"
                                    }
                                ></textarea>

                            </div>

                            {formStatus ===
                                "success" && (
                                <p className="form-message form-message-success">
                                    {t(
                                        "contact.success"
                                    )}
                                </p>
                            )}

                            {formStatus ===
                                "error" && (
                                <p className="form-message form-message-error">
                                    {errorMessage}
                                </p>
                            )}

                            <div className="contact-form-actions">

                                <button
                                    type="submit"
                                    className="button button-primary contact-submit"
                                    disabled={
                                        formStatus ===
                                        "sending"
                                    }
                                >
                                    {formStatus ===
                                    "sending"
                                        ? t(
                                              "contact.sending"
                                          )
                                        : t(
                                              "contact.send"
                                          )}

                                    {formStatus !==
                                        "sending" && (
                                        <span>
                                            ↗
                                        </span>
                                    )}
                                </button>

                                <a
                                    href={
                                        whatsappUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button button-whatsapp"
                                >
                                    {t(
                                        "contact.whatsapp"
                                    )}
                                    <span>
                                        ↗
                                    </span>
                                </a>

                            </div>

                        </form>

                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}

export default Contact;