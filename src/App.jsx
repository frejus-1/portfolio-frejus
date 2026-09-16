import { BrowserRouter, Routes, Route } from "react-router-dom";

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
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;