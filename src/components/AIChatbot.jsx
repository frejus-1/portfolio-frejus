import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../context/useLanguage";
import "./AIChatbot.css";

const API_URL = "http://localhost:3001/api/chat";

let messageId = 1;

const createMessageId = () => {
    return messageId++;
};

function AIChatbot() {
    const { language } = useLanguage();

    const ui =
        language === "fr"
            ? {
                title: "Assistant IA",
                subtitle: "Je connais le portfolio de Fréjus",
                placeholder: "Posez-moi une question...",
                send: "Envoyer",
                thinking: "L'assistant réfléchit...",
                welcome:
                    "Bonjour 👋 Je suis l'assistant IA du portfolio de Fréjus. Que souhaitez-vous savoir sur son parcours, ses compétences ou ses projets ?",
                error:
                    "Désolé, je n'arrive pas à contacter l'assistant pour le moment.",
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
                subtitle: "I know Fréjus' portfolio",
                placeholder: "Ask me a question...",
                send: "Send",
                thinking: "The assistant is thinking...",
                welcome:
                    "Hello 👋 I'm the AI assistant of Fréjus' portfolio. What would you like to know about his background, skills or projects?",
                error:
                    "Sorry, I cannot contact the assistant right now.",
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

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    /*
     * ==========================================
     * SCROLL AUTOMATIQUE
     * ==========================================
     */

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, isLoading]);

    /*
     * ==========================================
     * GESTION DE LA FENÊTRE
     * ==========================================
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

        document.addEventListener("keydown", handleEscape);

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
     * ==========================================
     * ENVOI D'UN MESSAGE
     * ==========================================
     */

    const sendMessage = async (text = message) => {
        const cleanMessage = text.trim();

        if (!cleanMessage || isLoading) {
            return;
        }

        setMessage("");

        const userMessage = {
            id: createMessageId(),
            role: "user",
            content: cleanMessage,
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
        ]);

        setIsLoading(true);

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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error || "Erreur serveur"
                );
            }

            const assistantMessage = {
                id: createMessageId(),
                role: "assistant",
                content: data.reply || ui.error,
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

            setMessages((previous) => [
                ...previous,
                {
                    id: createMessageId(),
                    role: "assistant",
                    content: ui.error,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    /*
     * ==========================================
     * FORMULAIRE
     * ==========================================
     */

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    /*
     * ==========================================
     * CLAVIER
     * ==========================================
     *
     * Entrée       → envoyer
     * Shift + Entrée → nouvelle ligne
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
     * ==========================================
     * LIENS MARKDOWN
     * ==========================================
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
        } else if (url.includes("linkedin.com")) {
            platform = "LinkedIn";
            icon = "in";
        } else if (url.includes("instagram.com")) {
            platform = "Instagram";
            icon = "IG";
        } else if (url.includes("facebook.com")) {
            platform = "Facebook";
            icon = "f";
        } else if (url.includes("wa.me")) {
            platform = "WhatsApp";
            icon = "WA";
        } else if (url.startsWith("mailto:")) {
            platform = "Email";
            icon = "@";
        }

        /*
         * Liens sociaux et moyens de contact
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
         * Lien classique
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

    return (
        <>
            {/* ======================================
                BOUTON FLOTTANT
            ====================================== */}

            {!isOpen && (
                <button
                    type="button"
                    className="ai-chatbot-button"
                    onClick={() => setIsOpen(true)}
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

            {/* ======================================
                FENÊTRE DU CHATBOT
            ====================================== */}

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
                        {/* ==================================
                            HEADER
                        ================================== */}

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

                        {/* ==================================
                            MESSAGES
                        ================================== */}

                        <div className="ai-chatbot-messages">
                            {messages.map((item) => (
                                <div
                                    key={item.id}
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
                                            {item.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}

                            {/* ==================================
                                QUESTIONS RAPIDES
                            ================================== */}

                            {messages.length === 1 &&
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
                                                        onClick={() =>
                                                            sendMessage(
                                                                question
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

                            {/* ==================================
                                INDICATEUR DE CHARGEMENT
                            ================================== */}

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

                            <div ref={messagesEndRef} />
                        </div>

                        {/* ==================================
                            FORMULAIRE
                        ================================== */}

                        <form
                            className="ai-chatbot-form"
                            onSubmit={handleSubmit}
                        >
                            <textarea
                                ref={inputRef}
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={
                                    ui.placeholder
                                }
                                rows="1"
                                disabled={isLoading}
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
                                aria-label={ui.send}
                                title={ui.send}
                            >
                                ↑
                            </button>
                        </form>

                        {/* ==================================
                            FOOTER
                        ================================== */}

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