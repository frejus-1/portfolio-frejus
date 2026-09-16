import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../context/useLanguage";
import "./AIChatbot.css";

const API_URL =
    "https://portfolio-ai-server-beta.vercel.app/api/chat";

let messageId = 1;

const createMessageId = () => {
    return messageId++;
};

/*
|--------------------------------------------------------------------------
| Réponses locales
|--------------------------------------------------------------------------
| Ces questions ne consomment pas de quota Gemini.
|--------------------------------------------------------------------------
*/

const LOCAL_ANSWERS = {
    fr: {
        "Qui est Fréjus ?": `
**Fréjus Adjanohoun** est un développeur **Full Stack Web & Mobile**, actuellement étudiant en deuxième année en **Système informatique et logiciel à l'IATF**.

Il travaille notamment avec **React, Laravel, Spring Boot et Flutter**, et développe des applications web et mobiles.

Son portfolio présente son parcours, ses compétences et plusieurs de ses projets.
        `.trim(),

        "Quelles technologies utilise-t-il ?": `
Fréjus travaille principalement avec :

- **Frontend :** React, JavaScript, HTML, CSS
- **Backend :** Laravel, Spring Boot
- **Mobile :** Flutter / Dart
- **Bases de données :** MySQL
- **Outils :** Git, GitHub, Vercel, VS Code

Il développe des projets **web, backend et mobile**.
        `.trim(),

        "Quels sont ses projets ?": `
Parmi les projets présentés dans son portfolio :

- **CampusLib** — plateforme web de bibliothèque universitaire
- **Orienter Education** — plateforme d'orientation scolaire avec React et Spring Boot
- **Application Todo** — application mobile Flutter avec backend
- **Portfolio personnel** — développé avec React et Vite

Chaque projet permet de découvrir davantage ses compétences techniques.
        `.trim(),

        "Comment le contacter ?": `
Vous pouvez contacter Fréjus via ses différents profils :

[GitHub](https://github.com/frejus-1/)

[LinkedIn](https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/)

[Email](mailto:f2987319@gmail.com)

Il est également possible de le contacter directement via le formulaire de contact du portfolio.
        `.trim(),
    },

    en: {
        "Who is Fréjus?": `
**Fréjus Adjanohoun** is a **Full Stack Web & Mobile developer**, currently a second-year student in **Computer Systems and Software at IATF**.

He works mainly with **React, Laravel, Spring Boot and Flutter**, and develops web and mobile applications.

His portfolio presents his background, skills and several projects.
        `.trim(),

        "What technologies does he use?": `
Fréjus mainly works with:

- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Laravel, Spring Boot
- **Mobile:** Flutter / Dart
- **Databases:** MySQL
- **Tools:** Git, GitHub, Vercel, VS Code

He develops **web, backend and mobile applications**.
        `.trim(),

        "What are his projects?": `
Some of the projects presented in his portfolio include:

- **CampusLib** — university library web platform
- **Orienter Education** — educational guidance platform with React and Spring Boot
- **Todo application** — Flutter mobile application with backend
- **Personal portfolio** — built with React and Vite

Each project showcases different technical skills.
        `.trim(),

        "How can I contact him?": `
You can contact Fréjus through his different profiles:

[GitHub](https://github.com/frejus-1/)

[LinkedIn](https://www.linkedin.com/in/fr%C3%A9jus-adjanohoun-3629a0376/)

[Email](mailto:f2987319@gmail.com)

You can also contact him directly through the contact form on the portfolio.
        `.trim(),
    },
};

function AIChatbot() {
    const { language } = useLanguage();

    const ui =
        language === "fr"
            ? {
                title: "Assistant IA",
                subtitle:
                    "Je connais le portfolio de Fréjus",
                placeholder:
                    "Posez-moi une question...",
                send: "Envoyer",
                thinking:
                    "L'assistant réfléchit...",
                welcome:
                    "Bonjour 👋 Je suis l'assistant IA du portfolio de Fréjus. Que souhaitez-vous savoir sur son parcours, ses compétences ou ses projets ?",
                error:
                    "Désolé, je n'arrive pas à contacter l'assistant pour le moment.",
                quotaError:
                    "Le quota de l'assistant IA est temporairement atteint. Réessayez plus tard.",
                quickTitle: "Questions rapides",
                quickQuestions: [
                    "Qui est Fréjus ?",
                    "Quelles technologies utilise-t-il ?",
                    "Quels sont ses projets ?",
                    "Comment le contacter ?",
                ],
                open: "Ouvrir l'assistant IA",
                close: "Fermer l'assistant IA",
            }
            : {
                title: "AI Assistant",
                subtitle:
                    "I know Fréjus' portfolio",
                placeholder:
                    "Ask me a question...",
                send: "Send",
                thinking:
                    "The assistant is thinking...",
                welcome:
                    "Hello 👋 I'm the AI assistant of Fréjus' portfolio. What would you like to know about his background, skills or projects?",
                error:
                    "Sorry, I cannot contact the assistant right now.",
                quotaError:
                    "The AI assistant quota has temporarily been reached. Please try again later.",
                quickTitle: "Quick questions",
                quickQuestions: [
                    "Who is Fréjus?",
                    "What technologies does he use?",
                    "What are his projects?",
                    "How can I contact him?",
                ],
                open: "Open AI assistant",
                close: "Close AI assistant",
            };

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: createMessageId(),
            role: "assistant",
            content: ui.welcome,
        },
    ]);

    /*
    |--------------------------------------------------------------------------
    | Références
    |--------------------------------------------------------------------------
    */

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Empêche plusieurs requêtes simultanées
    const isSendingRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | Scroll automatique
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    /*
    |--------------------------------------------------------------------------
    | Ouverture / fermeture
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "";
            return;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 150);

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            clearTimeout(timer);

            document.body.style.overflow = "";
        };
    }, [isOpen]);

    /*
    |--------------------------------------------------------------------------
    | Ajouter une réponse assistant
    |--------------------------------------------------------------------------
    */

    const addAssistantMessage = (content) => {
        setMessages((previous) => [
            ...previous,
            {
                id: createMessageId(),
                role: "assistant",
                content,
            },
        ]);
    };

    /*
    |--------------------------------------------------------------------------
    | Envoi du message
    |--------------------------------------------------------------------------
    */

    const sendMessage = async (
        text = message,
        localAnswer = null
    ) => {
        const cleanMessage = text.trim();

        if (!cleanMessage) {
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Protection contre les doubles requêtes
        |--------------------------------------------------------------------------
        */

        if (isSendingRef.current) {
            return;
        }

        isSendingRef.current = true;

        setMessage("");

        /*
        |--------------------------------------------------------------------------
        | Message utilisateur
        |--------------------------------------------------------------------------
        */

        const userMessage = {
            id: createMessageId(),
            role: "user",
            content: cleanMessage,
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Réponse locale
        |--------------------------------------------------------------------------
        |
        | Les questions rapides ne passent pas par Gemini.
        |
        */

        if (localAnswer) {
            setTimeout(() => {
                addAssistantMessage(localAnswer);

                isSendingRef.current = false;
            }, 250);

            return;
        }

        setIsLoading(true);

        /*
        |--------------------------------------------------------------------------
        | Appel API Gemini
        |--------------------------------------------------------------------------
        */

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: cleanMessage,
                }),
            });

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            /*
            |--------------------------------------------------------------------------
            | Détection du quota Gemini
            |--------------------------------------------------------------------------
            */

            const details =
                typeof data?.details === "string"
                    ? data.details
                    : "";

            const isQuotaError =
                response.status === 429 ||
                details.includes("429") ||
                details.includes(
                    "RESOURCE_EXHAUSTED"
                ) ||
                details
                    .toLowerCase()
                    .includes("quota");

            if (!response.ok) {
                if (isQuotaError) {
                    throw new Error(
                        "QUOTA_EXCEEDED"
                    );
                }

                throw new Error(
                    data?.error ||
                    "Erreur serveur"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Réponse Gemini
            |--------------------------------------------------------------------------
            */

            const assistantMessage = {
                id: createMessageId(),
                role: "assistant",
                content:
                    data.reply || ui.error,
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);
        } catch (error) {
            console.error(
                "Erreur chatbot :",
                error
            );

            let errorMessage = ui.error;

            if (
                error?.message ===
                "QUOTA_EXCEEDED"
            ) {
                errorMessage =
                    ui.quotaError;
            }

            addAssistantMessage(
                errorMessage
            );
        } finally {
            isSendingRef.current = false;
            setIsLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Formulaire
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        sendMessage();
    };

    /*
    |--------------------------------------------------------------------------
    | Clavier
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            sendMessage();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Liens Markdown
    |--------------------------------------------------------------------------
    */

    const renderMarkdownLink = ({
        href,
        children,
    }) => {
        const url = href || "";

        let platform = null;
        let icon = "↗";

        if (url.includes("github.com")) {
            platform = "GitHub";
            icon = "GH";
        } else if (
            url.includes("linkedin.com")
        ) {
            platform = "LinkedIn";
            icon = "in";
        } else if (
            url.includes("instagram.com")
        ) {
            platform = "Instagram";
            icon = "IG";
        } else if (
            url.includes("facebook.com")
        ) {
            platform = "Facebook";
            icon = "f";
        } else if (url.includes("wa.me")) {
            platform = "WhatsApp";
            icon = "WA";
        } else if (
            url.startsWith("mailto:")
        ) {
            platform = "Email";
            icon = "@";
        }

        /*
        |--------------------------------------------------------------------------
        | Lien social
        |--------------------------------------------------------------------------
        */

        if (platform) {
            return (
                <a
                    href={href}
                    target={
                        url.startsWith("mailto:")
                            ? undefined
                            : "_blank"
                    }
                    rel={
                        url.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                    }
                    className="ai-social-link"
                >
                    <span className="ai-social-icon">
                        {icon}
                    </span>

                    <span className="ai-social-content">
                        <span className="ai-social-platform">
                            {platform}
                        </span>

                        <span className="ai-social-value">
                            {children}
                        </span>
                    </span>

                    <span className="ai-social-arrow">
                        ↗
                    </span>
                </a>
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Lien classique
        |--------------------------------------------------------------------------
        */

        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Interface
    |--------------------------------------------------------------------------
    */

    return (
        <>
            {!isOpen && (
                <button
                    type="button"
                    className="ai-chatbot-button"
                    onClick={() =>
                        setIsOpen(true)
                    }
                    aria-label={ui.open}
                    title={ui.open}
                >
                    <span className="ai-chatbot-button-icon">
                        ✦
                    </span>

                    <span className="ai-chatbot-button-text">
                        AI
                    </span>

                    <span className="ai-chatbot-online-dot" />
                </button>
            )}

            {isOpen && (
                <div
                    className="ai-chatbot-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div
                        className="ai-chatbot-window"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ai-chatbot-title"
                    >
                        {/* HEADER */}

                        <header className="ai-chatbot-header">
                            <div className="ai-chatbot-header-info">
                                <div className="ai-chatbot-avatar">
                                    ✦
                                </div>

                                <div>
                                    <h2 id="ai-chatbot-title">
                                        {ui.title}
                                    </h2>

                                    <p>
                                        <span className="ai-status-dot" />
                                        {ui.subtitle}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="ai-chatbot-close"
                                onClick={() =>
                                    setIsOpen(false)
                                }
                                aria-label={ui.close}
                                title={ui.close}
                            >
                                ×
                            </button>
                        </header>

                        {/* MESSAGES */}

                        <div className="ai-chatbot-messages">
                            {messages.map(
                                (item) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className={`ai-message ai-message-${item.role}`}
                                    >
                                        {item.role ===
                                            "assistant" && (
                                                <div className="ai-message-avatar">
                                                    ✦
                                                </div>
                                            )}

                                        <div className="ai-message-content">
                                            <ReactMarkdown
                                                components={{
                                                    a: renderMarkdownLink,
                                                }}
                                            >
                                                {
                                                    item.content
                                                }
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )
                            )}

                            {/* QUESTIONS RAPIDES */}

                            {messages.length ===
                                1 &&
                                !isLoading && (
                                    <div className="ai-quick-questions">
                                        <span>
                                            {
                                                ui.quickTitle
                                            }
                                        </span>

                                        <div>
                                            {ui.quickQuestions.map(
                                                (
                                                    question
                                                ) => (
                                                    <button
                                                        key={
                                                            question
                                                        }
                                                        type="button"
                                                        disabled={
                                                            isLoading
                                                        }
                                                        onClick={() =>
                                                            sendMessage(
                                                                question,
                                                                LOCAL_ANSWERS[
                                                                language
                                                                ]?.[
                                                                question
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        {
                                                            question
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* CHARGEMENT */}

                            {isLoading && (
                                <div className="ai-message ai-message-assistant">
                                    <div className="ai-message-avatar">
                                        ✦
                                    </div>

                                    <div className="ai-typing">
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <small>
                                        {
                                            ui.thinking
                                        }
                                    </small>
                                </div>
                            )}

                            <div
                                ref={
                                    messagesEndRef
                                }
                            />
                        </div>

                        {/* FORMULAIRE */}

                        <form
                            className="ai-chatbot-form"
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <textarea
                                ref={inputRef}
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={
                                    ui.placeholder
                                }
                                rows="1"
                                disabled={
                                    isLoading
                                }
                                aria-label={
                                    ui.placeholder
                                }
                            />

                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    isLoading
                                }
                                aria-label={
                                    ui.send
                                }
                                title={
                                    ui.send
                                }
                            >
                                ↑
                            </button>
                        </form>

                        {/* FOOTER */}

                        <div className="ai-chatbot-footer">
                            Powered by Gemini
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AIChatbot;