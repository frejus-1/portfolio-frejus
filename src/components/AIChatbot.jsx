import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../context/useLanguage";
import frejusPhoto from "../assets/frejus.png";
import "./AIChatbot.css";

const API_URL =
    "https://portfolio-ai-server-beta.vercel.app/api/chat";

let messageId = 1;

const createMessageId = () => messageId++;

/*
|--------------------------------------------------------------------------
| Normalisation du texte
|--------------------------------------------------------------------------
*/

const normalizeText = (text = "") => {
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");
};

/*
|--------------------------------------------------------------------------
| Réponses locales
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

[WhatsApp](https://wa.me/2290152905310)

Vous pouvez également utiliser le formulaire de contact du portfolio.
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

[WhatsApp](https://wa.me/2290152905310)

You can also use the contact form on the portfolio.
        `.trim(),
    },
};

/*
|--------------------------------------------------------------------------
| Questions naturelles sur Fréjus
|--------------------------------------------------------------------------
*/

const getLocalAnswer = (text, language) => {
    const normalized = normalizeText(text);

    const frejusQuestions = [
        "frejus",
        "qui est frejus",
        "c'est qui frejus",
        "c est qui frejus",
        "parle moi de frejus",
        "parle-moi de frejus",
        "presente frejus",
        "presente moi frejus",
        "presente-moi frejus",
        "tell me about frejus",
        "who is frejus",
    ];

    if (!frejusQuestions.includes(normalized)) {
        return null;
    }

    if (language === "fr") {
        return `
**Fréjus Adjanohoun** est un développeur **Full Stack Web & Mobile**, actuellement étudiant en deuxième année en **Système informatique et logiciel à l'IATF**.

Il développe des applications **Web et Mobile** avec notamment :

- **React**
- **JavaScript**
- **Laravel**
- **Spring Boot**
- **Flutter / Dart**
- **MySQL**

Parmi ses projets figurent **CampusLib**, **Orienter Education**, une **application Todo** et son **portfolio personnel**.

Tu peux découvrir son parcours, ses compétences et ses projets directement sur ce portfolio.
        `.trim();
    }

    return `
**Fréjus Adjanohoun** is a **Full Stack Web & Mobile developer**, currently a second-year student in **Computer Systems and Software at IATF**.

He develops **web and mobile applications** using technologies such as:

- **React**
- **JavaScript**
- **Laravel**
- **Spring Boot**
- **Flutter / Dart**
- **MySQL**

His projects include **CampusLib**, **Orienter Education**, a **Todo application**, and his **personal portfolio**.

You can explore his background, skills and projects throughout this portfolio.
    `.trim();
};

/*
|--------------------------------------------------------------------------
| Protection des informations secrètes
|--------------------------------------------------------------------------
*/

const SECRET_PATTERNS = [
    /code\s+secret/i,
    /secret\s+code/i,
    /mot\s+de\s+passe/i,
    /password/i,
    /code\s+cach[ée]/i,
    /hidden\s+code/i,
    /easter.?egg.*code/i,
    /code.*easter.?egg/i,
    /comment.*déverrouill/i,
    /comment.*deverrouill/i,
    /how.*unlock/i,
    /commande\s+cach[ée]/i,
    /commande\s+secr[èe]te/i,
    /hidden\s+command/i,
    /secret\s+command/i,
    /mécanisme.*secret/i,
    /mecanisme.*secret/i,
    /secret.*mechanism/i,
    /clé\s+api/i,
    /cle\s+api/i,
    /api\s+key/i,
    /variable.*environnement/i,
    /environment.*variable/i,
    /code.*terminal/i,
    /commande.*terminal/i,
    /source.*easter/i,
    /source.*secret/i,
];

const isSecretQuestion = (message) => {
    return SECRET_PATTERNS.some((pattern) =>
        pattern.test(message)
    );
};

/*
|--------------------------------------------------------------------------
| Icônes SVG
|--------------------------------------------------------------------------
*/

const SocialIcon = ({ type }) => {
    if (type === "github") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18A11 11 0 0 1 12 5.84c.98 0 1.97.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.71 5.39-5.29 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                />
            </svg>
        );
    }

    if (type === "linkedin") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47v6.28ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.54 20.45H7.1V8.98H3.54v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
                />
            </svg>
        );
    }

    if (type === "instagram") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                />
            </svg>
        );
    }

    if (type === "facebook") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M13.5 22v-8h2.7l.4-3h-3.1V9.08c0-.87.24-1.46 1.49-1.46h1.59V4.94c-.28-.04-1.25-.12-2.39-.12-2.37 0-3.99 1.45-3.99 4.1V11H7.5v3h2.7v8h3.3Z"
                />
            </svg>
        );
    }

    if (type === "whatsapp") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M20.52 3.48A11.85 11.85 0 0 0 12.09 0C5.54 0 .21 5.32.21 11.88c0 2.09.55 4.13 1.6 5.92L.1 24l6.34-1.66a11.88 11.88 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.14-3.46-8.42ZM12.1 21.74h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.76.98 1-3.66-.23-.38a9.82 9.82 0 0 1-1.51-5.22c0-5.42 4.42-9.83 9.85-9.83a9.78 9.78 0 0 1 6.97 2.89 9.8 9.8 0 0 1 2.88 6.98c0 5.42-4.42 9.83-9.84 9.83Zm5.4-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.84 1.21 3.04c.15.2 2.09 3.2 5.07 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
                />
            </svg>
        );
    }

    if (type === "email") {
        return (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="m3 6 9 7 9-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| Informations propres aux liens sociaux
|--------------------------------------------------------------------------
*/

const getSocialLinkInfo = (url) => {
    if (!url) {
        return null;
    }

    const normalizedUrl = url.toLowerCase();

    if (normalizedUrl.includes("github.com")) {
        return {
            platform: "GitHub",
            type: "github",
            value: "@frejus-1",
        };
    }

    if (normalizedUrl.includes("linkedin.com")) {
        return {
            platform: "LinkedIn",
            type: "linkedin",
            value: "Fréjus Adjanohoun",
        };
    }

    if (normalizedUrl.includes("instagram.com")) {
        return {
            platform: "Instagram",
            type: "instagram",
            value: "@adjanohounf",
        };
    }

    if (normalizedUrl.includes("facebook.com")) {
        return {
            platform: "Facebook",
            type: "facebook",
            value: "Fréjus Adjanohoun",
        };
    }

    if (
        normalizedUrl.includes("wa.me") ||
        normalizedUrl.includes("whatsapp.com")
    ) {
        return {
            platform: "WhatsApp",
            type: "whatsapp",
            value: "+229 01 52 90 53 10",
        };
    }

    if (normalizedUrl.startsWith("mailto:")) {
        return {
            platform: "Email",
            type: "email",
            value: "f2987319@gmail.com",
        };
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| Composant principal
|--------------------------------------------------------------------------
*/

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

                quotaError:
                    "Le quota de l'assistant IA est temporairement atteint. Les questions générales pourront fonctionner à nouveau lorsque le quota sera disponible.",

                secretError:
                    "Je peux parler du parcours, des compétences et des projets de Fréjus, mais je ne peux pas révéler les codes secrets, commandes cachées ou mécanismes internes du portfolio.",

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

                quotaError:
                    "The AI assistant quota has temporarily been reached. General questions will work again when the quota becomes available.",

                secretError:
                    "I can talk about Fréjus' background, skills and projects, but I cannot reveal secret codes, hidden commands or internal portfolio mechanisms.",

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

    /*
    |--------------------------------------------------------------------------
    | États
    |--------------------------------------------------------------------------
    */

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
            return undefined;
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

        if (isSendingRef.current) {
            return;
        }

        isSendingRef.current = true;

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

        /*
        |--------------------------------------------------------------------------
        | Protection informations secrètes
        |--------------------------------------------------------------------------
        */

        if (isSecretQuestion(cleanMessage)) {
            setTimeout(() => {
                addAssistantMessage(ui.secretError);
                isSendingRef.current = false;
            }, 200);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Réponse locale
        |--------------------------------------------------------------------------
        */

        const quickLocalAnswer =
            LOCAL_ANSWERS[language]?.[cleanMessage];

        const automaticLocalAnswer =
            localAnswer ||
            quickLocalAnswer ||
            getLocalAnswer(
                cleanMessage,
                language
            );

        if (automaticLocalAnswer) {
            setTimeout(() => {
                addAssistantMessage(
                    automaticLocalAnswer
                );

                isSendingRef.current = false;
            }, 250);

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Chargement
        |--------------------------------------------------------------------------
        */

        setIsLoading(true);

        /*
        |--------------------------------------------------------------------------
        | Appel API
        |--------------------------------------------------------------------------
        */

        try {
            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
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

            const details =
                typeof data?.details === "string"
                    ? data.details
                    : "";

            const errorText =
                `${data?.error || ""} ${details}`
                    .toLowerCase();

            const isQuotaError =
                response.status === 429 ||
                errorText.includes("429") ||
                errorText.includes(
                    "resource_exhausted"
                ) ||
                errorText.includes("quota");

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

            const assistantMessage = {
                id: createMessageId(),
                role: "assistant",
                content:
                    data?.reply ||
                    ui.error,
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

        const socialInfo =
            getSocialLinkInfo(url);

        /*
        |--------------------------------------------------------------------------
        | Liens sociaux
        |--------------------------------------------------------------------------
        */

        if (socialInfo) {
            const isMail =
                url.toLowerCase().startsWith(
                    "mailto:"
                );

            return (
                <a
                    href={href}
                    target={
                        isMail
                            ? undefined
                            : "_blank"
                    }
                    rel={
                        isMail
                            ? undefined
                            : "noopener noreferrer"
                    }
                    className="ai-social-link"
                >
                    <span className="ai-social-icon">
                        <SocialIcon
                            type={socialInfo.type}
                        />
                    </span>

                    <span className="ai-social-content">
                        <span className="ai-social-platform">
                            {socialInfo.platform}
                        </span>

                        <span className="ai-social-value">
                            {socialInfo.value}
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
                    <span className="ai-chatbot-button-photo">
                        <img
                            src={frejusPhoto}
                            alt="Fréjus"
                        />
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
                                    <img
                                        src={frejusPhoto}
                                        alt="Fréjus"
                                    />
                                </div>

                                <div className="ai-chatbot-header-text">
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
                                                <img
                                                    src={
                                                        frejusPhoto
                                                    }
                                                    alt="Fréjus"
                                                />
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

                            {/* CHARGEMENT */}

                            {isLoading && (
                                <div className="ai-message ai-message-assistant">
                                    <div className="ai-message-avatar">
                                        <img
                                            src={
                                                frejusPhoto
                                            }
                                            alt="Fréjus"
                                        />
                                    </div>

                                    <div className="ai-typing-container">
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
                                        event.target
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
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 12h13M13 6l6 6-6 6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
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

