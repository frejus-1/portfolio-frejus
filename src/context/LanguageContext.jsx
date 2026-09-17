/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useEffect,
    useState,
} from "react";

export const LanguageContext = createContext(null);

const translations = {
    /* ==================================================
       🇫🇷 FRANÇAIS
       ================================================== */

    fr: {
        /* ==================================================
           NAVIGATION
           ================================================== */

        nav: {
            home: "Accueil",
            about: "À propos",
            skills: "Compétences",
            projects: "Projets",
            journey: "Parcours",
            rates: "Mes tarifs",
            contact: "Contact",
        },

        /* ==================================================
           HERO
           ================================================== */

        hero: {
            greeting: "Bonjour, je suis",

            role: "Développeur Full Stack Web & Mobile",

            description:
                "Étudiant en Système Informatique et Logiciel à l'IATF, je conçois des applications web et mobiles en explorant les technologies modernes du développement frontend, backend et mobile.",

            projects: "Voir mes projets",
            contact: "Me contacter",
            cv: "Télécharger mon CV",

            typingWords: [
                "Développeur Full Stack",
                "Développeur React",
                "Développeur Flutter",
                "Développeur Backend",
                "Développeur Web & Mobile",
            ],
        },

        /* ==================================================
           À PROPOS
           ================================================== */

        about: {
            title: "À propos",

            heading:
                "Construire, apprendre et progresser.",

            paragraph1:
                "Je suis Fréjus Adjanohoun, étudiant en Système Informatique et Logiciel à l'IATF et passionné par le développement web et mobile.",

            paragraph2:
                "Je m'intéresse particulièrement à la conception d'applications modernes, aux interfaces web, aux API et au développement d'applications mobiles.",

            paragraph3:
                "Mon objectif est de continuer à renforcer mes compétences techniques à travers des projets concrets et de participer à la réalisation de solutions utiles, accessibles et bien conçues.",

            webTitle:
                "Développement Web",

            webDescription:
                "Création d'interfaces modernes et responsive avec les technologies du web.",

            backendTitle:
                "Backend & API",

            backendDescription:
                "Conception de services backend et découverte de l'architecture des applications modernes.",

            mobileTitle:
                "Développement Mobile",

            mobileDescription:
                "Exploration du développement d'applications mobiles avec Flutter et Dart.",
        },

        /* ==================================================
           COMPÉTENCES
           ================================================== */

        skills: {
            title: "Compétences",

            heading:
                "Les technologies que j'utilise.",

            subtitle:
                "Un ensemble de technologies que j'apprends et que je mets progressivement en pratique à travers mes projets.",

            frontendTitle:
                "Frontend",

            frontendDescription:
                "Création d'interfaces web modernes, responsives et interactives.",

            backendTitle:
                "Backend",

            backendDescription:
                "Développement d'API et de services côté serveur.",

            mobileTitle:
                "Mobile",

            mobileDescription:
                "Développement d'applications mobiles avec une approche multiplateforme.",

            dataTitle:
                "Données & outils",

            dataDescription:
                "Gestion des données et utilisation des outils de développement.",
        },

        /* ==================================================
           PROJETS
           ================================================== */

        projects: {
            title: "Projets",

            heading:
                "Des projets pour apprendre et construire.",

            subtitle:
                "Une sélection de projets réalisés ou en cours de développement, autour du développement web, backend et mobile.",

            all: "Tous",
            frontend: "Frontend",
            backend: "Backend",
            mobile: "Mobile",
            fullStack: "Full Stack",

            filterLabel:
                "Filtrer les projets",

            empty:
                "Aucun projet ne correspond à cette catégorie.",

            details:
                "Voir les détails",

            viewProject:
                "Voir le projet",

            close:
                "Fermer",

            preview:
                "Aperçu du projet",

            technologies:
                "Technologies",

            aboutProject:
                "À propos du projet",

            aboutProjectDescription:
                "Ce projet fait partie de mon parcours d'apprentissage et me permet de mettre en pratique les technologies utilisées ainsi que les principes de conception d'applications modernes.",

            inDevelopment:
                "Projet actuellement en développement.",

            online:
                "En ligne",

            development:
                "En développement",
        },

        /* ==================================================
           DONNÉES DES PROJETS
           ================================================== */

        projectsData: {
            campuslib:
                "Site web d'une bibliothèque universitaire permettant de consulter un catalogue de livres et de gérer les emprunts.",

            programmationWeb:
                "Projet web réalisé autour de la création d'une interface moderne et responsive.",

            myinter:
                "Application backend développée avec Laravel et MySQL.",

            todo:
                "Application mobile de gestion de tâches développée avec Flutter.",

            orienterEducation:
                "Plateforme d'orientation permettant aux étudiants de passer un test et d'obtenir des recommandations de filières.",
        },

        /* ==================================================
           PARCOURS
           ================================================== */

        timeline: {
            title: "Parcours",

            heading:
                "Un parcours construit par la pratique.",

            subtitle:
                "Une progression basée sur l'apprentissage, la réalisation de projets et l'exploration de nouvelles technologies.",

            item1Category:
                "Formation",

            item1Title:
                "Système Informatique et Logiciel",

            item1Description:
                "Formation universitaire à l'IATF avec un apprentissage progressif du développement logiciel, des bases de données et des technologies web et mobile.",

            item2Category:
                "Développement Web",

            item2Title:
                "Création de projets web",

            item2Description:
                "Mise en pratique des connaissances à travers différents projets frontend et backend, avec une attention particulière portée à la structure, au responsive design et à l'expérience utilisateur.",

            item3Category:
                "Full Stack & Mobile",

            item3Title:
                "Approfondissement des technologies",

            item3Description:
                "Exploration de nouvelles technologies pour développer des applications complètes, du frontend au backend, ainsi que des applications mobiles.",
        },

        /* ==================================================
           CONTACT
           ================================================== */

        contact: {
            title: "Contact",

            heading:
                "Un projet ou une idée ?",

            headingHighlight:
                "Parlons-en.",

            introduction:
                "Vous souhaitez échanger autour d'un projet, d'une collaboration ou simplement discuter de développement web et mobile ? Vous pouvez me contacter directement.",

            email:
                "Email",

            whatsapp:
                "WhatsApp",

            github:
                "GitHub",

            linkedin:
                "LinkedIn",

            sendMessage:
                "Envoyer un message",

            available:
                "Disponible",

            name:
                "Nom",

            namePlaceholder:
                "Votre nom",

            subject:
                "Sujet",

            subjectPlaceholder:
                "Objet de votre message",

            message:
                "Message",

            messagePlaceholder:
                "Décrivez votre projet ou votre demande...",

            send:
                "Envoyer le message",

            sending:
                "Envoi en cours...",

            success:
                "Votre message a bien été envoyé. Merci pour votre contact.",

            error:
                "Impossible d'envoyer le message pour le moment.",

            networkError:
                "Une erreur réseau est survenue. Vérifiez votre connexion puis réessayez.",
        },

        /* ==================================================
           FOOTER
           ================================================== */

        footer: {
            description:
                "Développeur Full Stack Web & Mobile, étudiant en Système Informatique et Logiciel.",

            navigation:
                "Navigation",

            navigationLabel:
                "Navigation du pied de page",

            socials:
                "Me retrouver",

            rights:
                "Tous droits réservés.",

            backTop:
                "Retour en haut",
        },

        /* ==================================================
           WHATSAPP
           ================================================== */

        whatsapp: {
            button:
                "Discutons sur WhatsApp",

            label:
                "Me contacter sur WhatsApp",
        },

        /* ==================================================
           TERMINAL
           ================================================== */

        terminal: {
            label:
                "Mode développeur",

            title:
                "Explorez mon terminal",

            description:
                "Découvrez mon portfolio autrement. Tapez une commande pour commencer.",

            windowTitle:
                "frejus@portfolio:~",

            placeholder:
                "Tapez une commande...",

            close:
                "Fermer le terminal",

            welcome:
                "Bienvenue dans le terminal de Fréjus.",

            instruction:
                'Tapez "help" pour voir les commandes disponibles.',

            commands: {
                help: {
                    description:
                        "Voir les commandes disponibles",

                    output: [
                        "Commandes disponibles :",
                        "about    → À propos de Fréjus",
                        "skills   → Mes compétences",
                        "projects → Mes projets",
                        "contact  → Mes coordonnées",
                        "whoami   → Qui suis-je ?",
                        "clear    → Effacer le terminal",
                    ],
                },

                about: {
                    description:
                        "À propos de Fréjus",

                    output: [
                        "Fréjus Adjanohoun",
                        "Étudiant en Système Informatique et Logiciel.",
                        "Développeur Full Stack Web & Mobile.",
                    ],
                },

                skills: {
                    description:
                        "Mes compétences",

                    output: [
                        "Frontend : React, JavaScript, HTML, CSS",
                        "Backend  : Laravel, Spring Boot",
                        "Mobile   : Flutter",
                        "Outils   : Git, GitHub, Vite",
                    ],
                },

                projects: {
                    description:
                        "Mes projets",

                    output: [
                        "Mes projets :",
                        "• CampusLib",
                        "• Orienter Education",
                        "• Applications Flutter",
                        "• Projets Web Full Stack",
                    ],
                },

                contact: {
                    description:
                        "Mes coordonnées",

                    output: [
                        "Email    : f2987319@gmail.com",
                        "GitHub   : github.com/frejus-1",
                        "LinkedIn : Fréjus Adjanohoun",
                    ],
                },

                whoami: {
                    description:
                        "Qui suis-je ?",

                    output: [
                        "Je suis le terminal de Fréjus.",
                        "Bienvenue sur son portfolio.",
                    ],
                },

                clear: {
                    description:
                        "Effacer le terminal",
                },
            },

            unknownCommand:
                "Commande inconnue",
        },

        /* ==================================================
           🎁 OFFRES SPÉCIALES
           ================================================== */

        gifts: {
            label:
                "Secret débloqué",

            title:
                "Une petite surprise pour ",

            highlight:
                "vous",

            description:
                "Vous avez découvert le code secret. Choisissez une offre spéciale et profitez d'une réduction sur votre prochain projet.",

            codeLabel:
                "Code promo",

            action:
                "Profiter de l'offre",

            footer:
                "Offres valables pour une première commande et non cumulables avec une autre promotion.",

            items: [
                {
                    id: "website",
                    icon: "🌐",
                    discount: "-20%",
                    code: "WEB20",

                    title:
                        "Création de site web",

                    description:
                        "Landing page, portfolio, site vitrine ou plateforme web personnalisée.",

                    message:
                        "Je souhaite profiter de la réduction de 20 % sur la création d'un site web.",
                },

                {
                    id: "mobile",
                    icon: "📱",
                    discount: "-15%",
                    code: "APP15",

                    title:
                        "Application mobile",

                    description:
                        "Application mobile Flutter adaptée à votre projet ou votre activité.",

                    message:
                        "Je souhaite profiter de la réduction de 15 % sur la création d'une application mobile.",
                },

                {
                    id: "backend",
                    icon: "⚙️",
                    discount: "-10%",
                    code: "API10",

                    title:
                        "Backend & API",

                    description:
                        "Backend Laravel ou Spring Boot, API et intégration de base de données.",

                    message:
                        "Je souhaite profiter de la réduction de 10 % sur le développement backend ou API.",
                },

                {
                    id: "design",
                    icon: "🎨",
                    discount: "-25%",
                    code: "DESIGN25",

                    title:
                        "Design UI / UX",

                    description:
                        "Interfaces modernes, responsives et professionnelles pour votre projet.",

                    message:
                        "Je souhaite profiter de la réduction de 25 % sur la conception UI/UX.",
                },

                {
                    id: "training",
                    icon: "🎓",
                    discount: "-15%",
                    code: "LEARN15",

                    title:
                        "Formation & accompagnement",

                    description:
                        "React, Flutter, Laravel, Spring Boot, Git et développement web.",

                    message:
                        "Je souhaite profiter de la réduction de 15 % sur une formation ou un accompagnement technique.",
                },

                {
                    id: "deployment",
                    icon: "🚀",
                    discount: "-15%",
                    code: "DEPLOY15",

                    title:
                        "Déploiement",

                    description:
                        "Accompagnement pour l'hébergement, le déploiement et la mise en ligne.",

                    message:
                        "Je souhaite profiter de la réduction de 15 % sur le déploiement ou l'hébergement.",
                },
            ],
        },

        /* ==================================================
           TARIFS
           ================================================== */

        tarifs: {
            surtitle:
                "Mes prestations",

            title:
                "Mes tarifs",

            description:
                "Des solutions adaptées à vos besoins et à votre projet.",

            close:
                "Fermer les tarifs",

            whatsappButton:
                "Discuter l'offre",

            whatsappMessage:
                "Bonjour Fréjus, je suis intéressé(e) par votre service « {service} » au prix de {price}. Je souhaiterais avoir plus d'informations concernant cette offre.",

            footer1:
                "Les tarifs sont indicatifs et peuvent varier selon la complexité du projet.",

            footer2:
                "Contactez-moi pour discuter de vos besoins et obtenir un devis personnalisé.",

            services: [
                {
                    title:
                        "Landing Page",

                    price:
                        "50 000 FCFA",

                    description:
                        "Une page web moderne pour présenter une activité, un produit ou un service.",
                },

                {
                    title:
                        "Portfolio professionnel",

                    price:
                        "75 000 FCFA",

                    description:
                        "Un portfolio personnalisé pour mettre en valeur votre profil, vos compétences et vos projets.",
                },

                {
                    title:
                        "Site vitrine",

                    price:
                        "100 000 FCFA",

                    description:
                        "Un site professionnel et responsive pour présenter votre entreprise, activité ou organisation.",
                },

                {
                    title:
                        "Application Web",

                    price:
                        "250 000 FCFA",

                    description:
                        "Une application web interactive adaptée aux besoins spécifiques de votre projet.",
                },

                {
                    title:
                        "Application Mobile",

                    price:
                        "300 000 FCFA",

                    description:
                        "Une application mobile moderne développée pour répondre à vos besoins.",
                },

                {
                    title:
                        "Backend & API",

                    price:
                        "100 000 FCFA",

                    description:
                        "Développement de services backend et d'API pour connecter vos applications à vos données.",
                },

                {
                    title:
                        "Maintenance & corrections",

                    price:
                        "10 000 FCFA",

                    description:
                        "Correction de bugs, améliorations et petites modifications sur vos applications ou sites.",
                },

                {
                    title:
                        "Projet sur mesure",

                    price:
                        "Sur devis",

                    description:
                        "Une solution personnalisée selon les fonctionnalités et objectifs de votre projet.",
                },
            ],
        },
    },

    /* ==================================================
       🇬🇧 ENGLISH
       ================================================== */

    en: {
        /* ==================================================
           NAVIGATION
           ================================================== */

        nav: {
            home: "Home",
            about: "About",
            skills: "Skills",
            projects: "Projects",
            journey: "Journey",
            rates: "My rates",
            contact: "Contact",
        },

        /* ==================================================
           HERO
           ================================================== */

        hero: {
            greeting:
                "Hello, I'm",

            role:
                "Full Stack Web & Mobile Developer",

            description:
                "A Computer Science and Software Engineering student at IATF, I build web and mobile applications while exploring modern frontend, backend and mobile development technologies.",

            projects:
                "View my projects",

            contact:
                "Contact me",

            cv:
                "Download my CV",

            typingWords: [
                "Full Stack Developer",
                "React Developer",
                "Flutter Developer",
                "Backend Developer",
                "Web & Mobile Developer",
            ],
        },

        /* ==================================================
           ABOUT
           ================================================== */

        about: {
            title:
                "About",

            heading:
                "Building, learning and growing.",

            paragraph1:
                "I am Fréjus Adjanohoun, a Computer Science and Software Engineering student at IATF, passionate about web and mobile development.",

            paragraph2:
                "I am particularly interested in designing modern applications, web interfaces, APIs and mobile application development.",

            paragraph3:
                "My goal is to continue strengthening my technical skills through practical projects and contribute to building useful, accessible and well-designed solutions.",

            webTitle:
                "Web Development",

            webDescription:
                "Creating modern and responsive interfaces using web technologies.",

            backendTitle:
                "Backend & API",

            backendDescription:
                "Designing backend services and exploring modern application architecture.",

            mobileTitle:
                "Mobile Development",

            mobileDescription:
                "Exploring mobile application development with Flutter and Dart.",
        },

        /* ==================================================
           SKILLS
           ================================================== */

        skills: {
            title:
                "Skills",

            heading:
                "The technologies I use.",

            subtitle:
                "A set of technologies I am learning and gradually putting into practice through my projects.",

            frontendTitle:
                "Frontend",

            frontendDescription:
                "Creating modern, responsive and interactive web interfaces.",

            backendTitle:
                "Backend",

            backendDescription:
                "Developing APIs and server-side services.",

            mobileTitle:
                "Mobile",

            mobileDescription:
                "Developing mobile applications with a cross-platform approach.",

            dataTitle:
                "Data & Tools",

            dataDescription:
                "Managing data and using development tools.",
        },

        /* ==================================================
           PROJECTS
           ================================================== */

        projects: {
            title:
                "Projects",

            heading:
                "Projects to learn and build.",

            subtitle:
                "A selection of completed and ongoing projects focused on web, backend and mobile development.",

            all:
                "All",

            frontend:
                "Frontend",

            backend:
                "Backend",

            mobile:
                "Mobile",

            fullStack:
                "Full Stack",

            filterLabel:
                "Filter projects",

            empty:
                "No project matches this category.",

            details:
                "View details",

            viewProject:
                "View project",

            close:
                "Close",

            preview:
                "Project preview",

            technologies:
                "Technologies",

            aboutProject:
                "About the project",

            aboutProjectDescription:
                "This project is part of my learning journey and allows me to put the technologies I use into practice while applying modern application design principles.",

            inDevelopment:
                "Project currently under development.",

            online:
                "Online",

            development:
                "In development",
        },

        /* ==================================================
           PROJECT DATA
           ================================================== */

        projectsData: {
            campuslib:
                "University library website allowing users to browse a book catalog and manage book loans.",

            programmationWeb:
                "Web project focused on creating a modern and responsive interface.",

            myinter:
                "Backend application developed with Laravel and MySQL.",

            todo:
                "Mobile task management application developed with Flutter.",

            orienterEducation:
                "Career guidance platform allowing students to take an orientation test and receive study program recommendations.",
        },

        /* ==================================================
           JOURNEY
           ================================================== */

        timeline: {
            title:
                "Journey",

            heading:
                "A journey built through practice.",

            subtitle:
                "A progression based on learning, building projects and exploring new technologies.",

            item1Category:
                "Education",

            item1Title:
                "Computer Science and Software Engineering",

            item1Description:
                "University education at IATF with progressive learning in software development, databases, and web and mobile technologies.",

            item2Category:
                "Web Development",

            item2Title:
                "Building web projects",

            item2Description:
                "Putting knowledge into practice through various frontend and backend projects, with a strong focus on structure, responsive design and user experience.",

            item3Category:
                "Full Stack & Mobile",

            item3Title:
                "Exploring advanced technologies",

            item3Description:
                "Exploring new technologies to build complete applications, from frontend to backend, as well as mobile applications.",
        },

        /* ==================================================
           CONTACT
           ================================================== */

        contact: {
            title:
                "Contact",

            heading:
                "Have a project or an idea?",

            headingHighlight:
                "Let's talk.",

            introduction:
                "Would you like to discuss a project, a collaboration, or simply talk about web and mobile development? You can contact me directly.",

            email:
                "Email",

            whatsapp:
                "WhatsApp",

            github:
                "GitHub",

            linkedin:
                "LinkedIn",

            sendMessage:
                "Send a message",

            available:
                "Available",

            name:
                "Name",

            namePlaceholder:
                "Your name",

            subject:
                "Subject",

            subjectPlaceholder:
                "Subject of your message",

            message:
                "Message",

            messagePlaceholder:
                "Describe your project or request...",

            send:
                "Send message",

            sending:
                "Sending...",

            success:
                "Your message has been sent successfully. Thank you for contacting me.",

            error:
                "Unable to send the message at the moment.",

            networkError:
                "A network error occurred. Please check your connection and try again.",
        },

        /* ==================================================
           FOOTER
           ================================================== */

        footer: {
            description:
                "Full Stack Web & Mobile Developer, Computer Science and Software Engineering student.",

            navigation:
                "Navigation",

            navigationLabel:
                "Footer navigation",

            socials:
                "Find me",

            rights:
                "All rights reserved.",

            backTop:
                "Back to top",
        },

        /* ==================================================
           WHATSAPP
           ================================================== */

        whatsapp: {
            button:
                "Let's chat on WhatsApp",

            label:
                "Contact me on WhatsApp",
        },

        /* ==================================================
           TERMINAL
           ================================================== */

        terminal: {
            label:
                "Developer mode",

            title:
                "Explore my terminal",

            description:
                "Discover my portfolio in a different way. Type a command to get started.",

            windowTitle:
                "frejus@portfolio:~",

            placeholder:
                "Type a command...",

            close:
                "Close terminal",

            welcome:
                "Welcome to Fréjus' terminal.",

            instruction:
                'Type "help" to see the available commands.',

            commands: {
                help: {
                    description:
                        "Show available commands",

                    output: [
                        "Available commands:",
                        "about    → About Fréjus",
                        "skills   → My skills",
                        "projects → My projects",
                        "contact  → My contact information",
                        "whoami   → Who am I?",
                        "clear    → Clear the terminal",
                    ],
                },

                about: {
                    description:
                        "About Fréjus",

                    output: [
                        "Fréjus Adjanohoun",
                        "Computer Science and Software Engineering student.",
                        "Full Stack Web & Mobile Developer.",
                    ],
                },

                skills: {
                    description:
                        "My skills",

                    output: [
                        "Frontend : React, JavaScript, HTML, CSS",
                        "Backend  : Laravel, Spring Boot",
                        "Mobile   : Flutter",
                        "Tools    : Git, GitHub, Vite",
                    ],
                },

                projects: {
                    description:
                        "My projects",

                    output: [
                        "My projects:",
                        "• CampusLib",
                        "• Orienter Education",
                        "• Flutter applications",
                        "• Full Stack Web projects",
                    ],
                },

                contact: {
                    description:
                        "My contact information",

                    output: [
                        "Email    : f2987319@gmail.com",
                        "GitHub   : github.com/frejus-1",
                        "LinkedIn : Fréjus Adjanohoun",
                    ],
                },

                whoami: {
                    description:
                        "Who am I?",

                    output: [
                        "I am Fréjus' terminal.",
                        "Welcome to his portfolio.",
                    ],
                },

                clear: {
                    description:
                        "Clear the terminal",
                },
            },

            unknownCommand:
                "Unknown command",
        },

        /* ==================================================
           🎁 SPECIAL OFFERS
           ================================================== */

        gifts: {
            label:
                "Secret unlocked",

            title:
                "A little gift for ",

            highlight:
                "you",

            description:
                "You found the secret code. Choose one of my special offers and enjoy a discount on your next project.",

            codeLabel:
                "Promo code",

            action:
                "Claim this offer",

            footer:
                "Offers are available for a first order and cannot be combined with another promotion.",

            items: [
                {
                    id: "website",
                    icon: "🌐",
                    discount: "-20%",
                    code: "WEB20",

                    title:
                        "Website development",

                    description:
                        "Landing page, portfolio, showcase website or custom web platform.",

                    message:
                        "I would like to use the 20% discount for website development.",
                },

                {
                    id: "mobile",
                    icon: "📱",
                    discount: "-15%",
                    code: "APP15",

                    title:
                        "Mobile application",

                    description:
                        "Flutter mobile application adapted to your project or business.",

                    message:
                        "I would like to use the 15% discount for mobile application development.",
                },

                {
                    id: "backend",
                    icon: "⚙️",
                    discount: "-10%",
                    code: "API10",

                    title:
                        "Backend & API",

                    description:
                        "Laravel or Spring Boot backend, API and database integration.",

                    message:
                        "I would like to use the 10% discount for backend or API development.",
                },

                {
                    id: "design",
                    icon: "🎨",
                    discount: "-25%",
                    code: "DESIGN25",

                    title:
                        "UI / UX design",

                    description:
                        "Modern, responsive and professional interfaces for your project.",

                    message:
                        "I would like to use the 25% discount for UI/UX design.",
                },

                {
                    id: "training",
                    icon: "🎓",
                    discount: "-15%",
                    code: "LEARN15",

                    title:
                        "Training & guidance",

                    description:
                        "React, Flutter, Laravel, Spring Boot, Git and web development.",

                    message:
                        "I would like to use the 15% discount for training or technical guidance.",
                },

                {
                    id: "deployment",
                    icon: "🚀",
                    discount: "-15%",
                    code: "DEPLOY15",

                    title:
                        "Deployment",

                    description:
                        "Help with hosting, deployment, configuration and going live.",

                    message:
                        "I would like to use the 15% discount for deployment or hosting assistance.",
                },
            ],
        },

        /* ==================================================
           RATES
           ================================================== */

        tarifs: {
            surtitle:
                "My services",

            title:
                "My rates",

            description:
                "Solutions tailored to your needs and your project.",

            close:
                "Close rates",

            whatsappButton:
                "Discuss this offer",

            whatsappMessage:
                "Hello Fréjus, I am interested in your « {service} » service priced at {price}. I would like to get more information about this offer.",

            footer1:
                "Prices are indicative and may vary depending on the complexity of the project.",

            footer2:
                "Contact me to discuss your needs and get a personalized quote.",

            services: [
                {
                    title:
                        "Landing Page",

                    price:
                        "50,000 FCFA",

                    description:
                        "A modern web page to showcase a business, product, or service.",
                },

                {
                    title:
                        "Professional Portfolio",

                    price:
                        "75,000 FCFA",

                    description:
                        "A customized portfolio to showcase your profile, skills, and projects.",
                },

                {
                    title:
                        "Business Website",

                    price:
                        "100,000 FCFA",

                    description:
                        "A professional and responsive website to present your business, activity, or organization.",
                },

                {
                    title:
                        "Web Application",

                    price:
                        "250,000 FCFA",

                    description:
                        "An interactive web application tailored to your project's specific needs.",
                },

                {
                    title:
                        "Mobile Application",

                    price:
                        "300,000 FCFA",

                    description:
                        "A modern mobile application developed to meet your needs.",
                },

                {
                    title:
                        "Backend & API",

                    price:
                        "100,000 FCFA",

                    description:
                        "Backend services and APIs to connect your applications to your data.",
                },

                {
                    title:
                        "Maintenance & Fixes",

                    price:
                        "10,000 FCFA",

                    description:
                        "Bug fixes, improvements, and minor modifications to your websites or applications.",
                },

                {
                    title:
                        "Custom Project",

                    price:
                        "Upon request",

                    description:
                        "A customized solution based on the features and objectives of your project.",
                },
            ],
        },
    },
};

/* ==================================================
   LANGUAGE PROVIDER
   ================================================== */

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const savedLanguage =
            localStorage.getItem(
                "portfolio-language"
            );

        return savedLanguage === "en"
            ? "en"
            : "fr";
    });

    const toggleLanguage = () => {
        setLanguage((currentLanguage) =>
            currentLanguage === "fr"
                ? "en"
                : "fr"
        );
    };

    useEffect(() => {
        localStorage.setItem(
            "portfolio-language",
            language
        );

        document.documentElement.lang =
            language;
    }, [language]);

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

