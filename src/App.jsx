import { useState } from "react";
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

function Home() {
    const [terminalOpen, setTerminalOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <ScrollProgress />

            <Navbar />

            <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Timeline />
                <Contact />
            </main>

            <Footer />

            {/* Terminal modal */}
            <Terminal
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
            />

            {/* Bouton flottant Terminal */}
            <button
                type="button"
                className="terminal-floating-button"
                onClick={() => setTerminalOpen(true)}
                aria-label={t.terminal.title}
            >
                <span>⌨</span>
                <span>Terminal</span>
            </button>

            <WhatsAppButton />

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