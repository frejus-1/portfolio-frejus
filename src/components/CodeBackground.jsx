import "../styles/CodeBackground.css";

const codeElements = [
    "<React />",
    "</>",
    "{ API }",
    "const app =",
    "npm run dev",
    "Flutter",
    "Laravel",
    "Spring Boot",
    "Git",
    "GitHub",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "SQL",
    "MySQL",
    "REST API",
    "JSON",
    "JWT",
    "HTTP",
    "HTTPS",
    "Backend",
    "Frontend",
    "Mobile",
    "Full Stack",
    "Security",
    "Cyber",
    "0101",
    "1010",
    "0011",
    "0110",
    "01",
    "02",
    "03",
    "404",
    "200 OK",
    "localhost",
    "API/",
    "useState()",
    "useEffect()",
    "async()",
    "await",
    "return",
    "import",
    "export",
    "function",
    "class",
    "while(true)",
    "sudo",
    "git push",
    "git commit",
    "npm install",
];

const bubbles = codeElements.map(
    (content, index) => ({
        content,
        className: `code-bubble bubble-${index + 1}`,
    })
);

function CodeBackground() {
    return (
        <div
            className="code-background"
            aria-hidden="true"
        >
            {/* ==========================================
                LUEURS FLOTTANTES
            ========================================== */}

            <div className="code-glow glow-1"></div>
            <div className="code-glow glow-2"></div>
            <div className="code-glow glow-3"></div>
            <div className="code-glow glow-4"></div>
            <div className="code-glow glow-5"></div>

            {/* ==========================================
                PARTICULES
            ========================================== */}

            <div className="code-particles">
                {Array.from({
                    length: 35,
                }).map((_, index) => (
                    <span
                        key={index}
                        className={`code-particle particle-${
                            index + 1
                        }`}
                    />
                ))}
            </div>

            {/* ==========================================
                BULLES DE CODE
            ========================================== */}

            <div className="code-bubbles">
                {bubbles.map(
                    (bubble, index) => (
                        <span
                            key={`${bubble.content}-${index}`}
                            className={
                                bubble.className
                            }
                        >
                            {bubble.content}
                        </span>
                    )
                )}
            </div>

            {/* ==========================================
                GRILLE TECHNIQUE
            ========================================== */}

            <div className="code-background-grid"></div>

            {/* ==========================================
                VIGNETTE
            ========================================== */}

            <div className="code-background-vignette"></div>
        </div>
    );
}

export default CodeBackground;

