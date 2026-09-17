import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useLanguage } from "./context/useLanguage";

import Terminal from "./components/Terminal";
import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import PageLoader from "./components/PageLoader";
import BackToTop from "./components/BackToTop";
import ScrollProgress from "./components/ScrollProgress";
import DeveloperEasterEgg from "./components/DeveloperEasterEgg";
import Gifts from "./components/Gifts";
import AIChatbot from "./components/AIChatbot";
import Tarifs from "./components/Tarifs";

function Home() {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [giftsOpen, setGiftsOpen] = useState(false);
    const [tarifsOpen, setTarifsOpen] = useState(false);

    const { t } = useLanguage();

    useEffect(() => {
        const handleSecretUnlock = () => {
            setGiftsOpen(true);
        };

        window.addEventListener(
            "frejus-secret-unlocked",
            handleSecretUnlock
        );

        return () => {
            window.removeEventListener(
                "frejus-secret-unlocked",
                handleSecretUnlock
            );
        };
    }, []);

    return (
        <>
            <ScrollProgress />

            <Navbar
                onOpenTarifs={() => setTarifsOpen(true)}
            />

            <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Timeline />
                <Contact />
            </main>

            <Footer />

            {/* ==============================
                TERMINAL
            ============================== */}
            <Terminal
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
            />

            <button
                type="button"
                className="terminal-floating-button"
                onClick={() => setTerminalOpen(true)}
                aria-label={t.terminal.title}
            >
                <span>⌨</span>
                <span>Terminal</span>
            </button>

            {/* ==============================
                EASTER EGG
                frejus → secret → cadeaux
            ============================== */}
            <DeveloperEasterEgg />

            {/* ==============================
                CADEAUX - MODAL
            ============================== */}
            <Gifts
                isOpen={giftsOpen}
                onClose={() => setGiftsOpen(false)}
            />

            {/* ==============================
                TARIFS - MODAL
            ============================== */}
            <Tarifs
                isOpen={tarifsOpen}
                onClose={() => setTarifsOpen(false)}
            />

            {/* ==============================
                AI CHATBOT
            ============================== */}
            <AIChatbot />

            {/* ==============================
                WHATSAPP
            ============================== */}
            <WhatsAppButton />

            {/* ==============================
                RETOUR EN HAUT
            ============================== */}
            <BackToTop />
        </>
    );
}

function App() {
    return (
        <>
            <PageLoader />

            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

