import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { useLanguage } from "./context/useLanguage";

// ==========================================
// PAGES
// ==========================================

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMessages from "./pages/AdminMessages";
import AdminMessageDetails from "./pages/AdminMessageDetails";
import AdminSettings from "./pages/AdminSettings";
import AdminParcours from "./pages/AdminParcours";
import AdminSkills from "./pages/AdminSkills";

// ==========================================
// ADMIN
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

// ==========================================
// COMPOSANTS ADMIN
// ==========================================

import AdminProjects from "./components/AdminProjects";


// ==========================================
// COMPOSANTS PUBLICS
// ==========================================

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
import CodeBackground from "./components/CodeBackground";


/* =========================================================
   PAGE D'ACCUEIL DU PORTFOLIO
========================================================= */

function Home() {

    const [terminalOpen, setTerminalOpen] =
        useState(false);

    const [giftsOpen, setGiftsOpen] =
        useState(false);

    const [tarifsOpen, setTarifsOpen] =
        useState(false);

    const { t } = useLanguage();


    /* =====================================================
       ÉVÉNEMENT SECRET
    ===================================================== */

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

            {/* ==========================================
                BACKGROUND ANIMÉ GLOBAL
            ========================================== */}

            <CodeBackground />


            {/* ==========================================
                PROGRESSION DU SCROLL
            ========================================== */}

            <ScrollProgress />


            {/* ==========================================
                NAVIGATION
            ========================================== */}

            <Navbar
                onOpenTarifs={() =>
                    setTarifsOpen(true)
                }
            />


            {/* ==========================================
                CONTENU PRINCIPAL
            ========================================== */}

            <main>

                <Hero />

                <About />

                <Skills />

                <Projects />

                <Timeline />

                <Contact />

            </main>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <Footer />


            {/* ==========================================
                TERMINAL
            ========================================== */}

            <Terminal
                isOpen={terminalOpen}
                onClose={() =>
                    setTerminalOpen(false)
                }
            />


            {/* ==========================================
                BOUTON TERMINAL FLOTTANT
            ========================================== */}

            <button
                type="button"
                className="terminal-floating-button"
                onClick={() =>
                    setTerminalOpen(true)
                }
                aria-label={t("terminal.title")}
            >

                <span>⌨</span>

                <span>
                    Terminal
                </span>

            </button>


            {/* ==========================================
                EASTER EGG
            ========================================== */}

            <DeveloperEasterEgg />


            {/* ==========================================
                CADEAUX
            ========================================== */}

            <Gifts
                isOpen={giftsOpen}
                onClose={() =>
                    setGiftsOpen(false)
                }
            />


            {/* ==========================================
                TARIFS
            ========================================== */}

            <Tarifs
                isOpen={tarifsOpen}
                onClose={() =>
                    setTarifsOpen(false)
                }
            />


            {/* ==========================================
                AI CHATBOT
            ========================================== */}

            <AIChatbot />


            {/* ==========================================
                WHATSAPP
            ========================================== */}

            <WhatsAppButton />


            {/* ==========================================
                RETOUR EN HAUT
            ========================================== */}

            <BackToTop />

        </>
    );
}


/* =========================================================
   APPLICATION
========================================================= */

function App() {

    return (
        <>

            {/* ==========================================
                CHARGEMENT INITIAL
            ========================================== */}

            <PageLoader />


            {/* ==========================================
                ROUTER
            ========================================== */}

            <BrowserRouter>

                <Routes>


                    {/* =================================================
                        PORTFOLIO PUBLIC
                    ================================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* =================================================
                        AUTHENTIFICATION ADMIN
                    ================================================= */}

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />


                    {/* =================================================
                        ESPACE ADMINISTRATEUR

                        AdminLayout contient :
                        - Sidebar
                        - Header
                        - Outlet
                    ================================================= */}

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >

                        {/* ==========================================
                            DASHBOARD
                        ========================================== */}

                        <Route
                            index
                            element={<AdminDashboard />}
                        />


                        {/* ==========================================
                            PROJETS
                        ========================================== */}

                        <Route
                            path="projets"
                            element={<AdminProjects />}
                        />


                        {/* ==========================================
                            PARCOURS
                        ========================================== */}

                        <Route
                            path="parcours"
                            element={<AdminParcours />}
                        />


                        {/* ==========================================
                            COMPÉTENCES
                        ========================================== */}

                        <Route
                            path="competences"
                            element={<AdminSkills />}
                        />


                        {/* ==========================================
                            MESSAGES
                        ========================================== */}

                        <Route
                            path="messages"
                            element={<AdminMessages />}
                        />


                        {/* ==========================================
                            DÉTAIL D'UN MESSAGE
                        ========================================== */}

                        <Route
                            path="messages/:id"
                            element={
                                <AdminMessageDetails />
                            }
                        />


                        {/* ==========================================
                            PARAMÈTRES
                        ========================================== */}

                        <Route
                            path="parametres"
                            element={<AdminSettings />}
                        />

                    </Route>


                    {/* =================================================
                        PAGE 404
                    ================================================= */}

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