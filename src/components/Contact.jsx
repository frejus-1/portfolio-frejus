import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "../context/useLanguage";

const FORM_ENDPOINT = "https://formspree.io/f/meaojonv";

const whatsappMessage = encodeURIComponent(
    "Bonjour Fréjus, je vous contacte depuis votre portfolio."
);

function Contact() {
    const { t } = useLanguage();

    const [formStatus, setFormStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const contactItems = [
        {
            label: t.contact.email,
            value: "f2987319@gmail.com",
            href: "mailto:f2987319@gmail.com",
        },
        {
            label: t.contact.whatsapp,
            value: "+229 01 52 90 53 10",
            href: `https://wa.me/2290152905310?text=${whatsappMessage}`,
        },
        {
            label: t.contact.github,
            value: "github.com/frejus-1",
            href: "https://github.com/frejus-1/",
        },
        {
            label: t.contact.linkedin,
            value: "Fréjus Adjanohoun",
            href: "https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/",
        },
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormStatus("sending");
        setErrorMessage("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                form.reset();
                setFormStatus("success");
                return;
            }

            if (data.errors && Array.isArray(data.errors)) {
                setErrorMessage(
                    data.errors
                        .map((error) => error.message)
                        .join(" ")
                );
            } else {
                setErrorMessage(t.contact.error);
            }

            setFormStatus("error");
        } catch (error) {
            console.error("Erreur Formspree :", error);

            setErrorMessage(t.contact.networkError);
            setFormStatus("error");
        }
    };

    return (
        <section id="contact" className="section contact-section">
            <div className="contact-container">
                <ScrollReveal direction="left">
                    <div className="contact-content">
                        <p className="section-label">
                            {t.contact.title}
                        </p>

                        <h2>
                            {t.contact.heading}
                            <span> {t.contact.headingHighlight}</span>
                        </h2>

                        <p className="contact-introduction">
                            {t.contact.introduction}
                        </p>

                        <div className="contact-list">
                            {contactItems.map((item, index) => (
                                <ScrollReveal
                                    key={item.label}
                                    direction="left"
                                    delay={150 + index * 100}
                                >
                                    <a
                                        href={item.href}
                                        target={
                                            item.href.startsWith("mailto:")
                                                ? undefined
                                                : "_blank"
                                        }
                                        rel={
                                            item.href.startsWith("mailto:")
                                                ? undefined
                                                : "noopener noreferrer"
                                        }
                                        className="contact-item"
                                    >
                                        <span className="contact-item-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span className="contact-item-content">
                                            <span className="contact-item-label">
                                                {item.label}
                                            </span>

                                            <span className="contact-item-value">
                                                {item.value}
                                            </span>
                                        </span>

                                        <span className="contact-item-arrow">
                                            ↗
                                        </span>
                                    </a>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={150}>
                    <div className="contact-form-wrapper">
                        <div className="contact-form-header">
                            <span>
                                {t.contact.sendMessage}
                            </span>

                            <span className="contact-form-status">
                                {t.contact.available}
                            </span>
                        </div>

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="nom">
                                    {t.contact.name}
                                </label>

                                <input
                                    type="text"
                                    id="nom"
                                    name="name"
                                    placeholder={t.contact.namePlaceholder}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    {t.contact.email}
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sujet">
                                    {t.contact.subject}
                                </label>

                                <input
                                    type="text"
                                    id="sujet"
                                    name="_subject"
                                    placeholder={t.contact.subjectPlaceholder}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">
                                    {t.contact.message}
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    placeholder={t.contact.messagePlaceholder}
                                    required
                                ></textarea>
                            </div>

                            <input
                                type="hidden"
                                name="_replyto"
                                value=""
                            />

                            {formStatus === "success" && (
                                <p className="form-message form-message-success">
                                    {t.contact.success}
                                </p>
                            )}

                            {formStatus === "error" && (
                                <p className="form-message form-message-error">
                                    {errorMessage}
                                </p>
                            )}

                            <div className="contact-form-actions">
                                <button
                                    type="submit"
                                    className="button button-primary contact-submit"
                                    disabled={formStatus === "sending"}
                                >
                                    {formStatus === "sending"
                                        ? t.contact.sending
                                        : t.contact.send}

                                    {formStatus !== "sending" && (
                                        <span>↗</span>
                                    )}
                                </button>

                                <a
                                    href={`https://wa.me/2290152905310?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="button button-whatsapp"
                                >
                                    {t.contact.whatsapp}
                                    <span>↗</span>
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
