import {
    SiHtml5,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiVite,
    SiNextdotjs,
    SiNodedotjs,
    SiExpress,
    SiNestjs,
    SiAngular,
    SiVuedotjs,
    SiSvelte,
    SiAstro,

    SiSpringboot,
    SiSpring,
    SiKotlin,
    SiPhp,
    SiLaravel,
    SiSymfony,
    SiPython,
    SiDjango,
    SiFlask,
    SiFastapi,
    SiC,
    SiCplusplus,
    SiGo,
    SiRust,
    SiRuby,
    SiRubyonrails,

    SiFlutter,
    SiDart,
    SiAndroid,
    SiIos,

    SiMysql,
    SiPostgresql,
    SiMongodb,
    SiRedis,
    SiSqlite,
    SiMariadb,
    SiFirebase,
    SiSupabase,

    SiGit,
    SiGithub,
    SiGitlab,
    SiBitbucket,
    SiDocker,
    SiKubernetes,
    SiJenkins,
    SiGithubactions,
    SiTerraform,
    SiAnsible,
    SiNginx,
    SiApache,
    SiLinux,
    SiUbuntu,
    SiDebian,
    SiKalilinux,
    SiRedhat,
    SiVercel,
    SiNetlify,

    SiGooglecloud,
    SiCloudflare,

    SiPostman,
    SiGraphql,
    SiApollographql,

    SiFigma,


    SiTensorflow,
    SiPytorch,
    SiOpencv,
    SiJupyter,
    SiPandas,
    SiNumpy,
    SiScikitlearn,

    SiWireshark,
    SiMetasploit,
    SiBurpsuite,
    SiOwasp,

    SiIntellijidea,
    SiEclipseide,
    SiAndroidstudio,

    SiMarkdown,
    SiNpm,
    SiYarn,
    SiPnpm,
} from "react-icons/si";

import {
    FaCode,
    FaCss3Alt,
    FaJava,
    FaDatabase,
    FaServer,
    FaCloud,
    FaShieldAlt,
    FaNetworkWired,
    FaRobot,
    FaTerminal,
    FaCogs,
    FaMobileAlt,
    FaLaptopCode,
    FaProjectDiagram,
} from "react-icons/fa";

import {
    VscTerminal,
    VscDebug,
    VscSymbolNamespace,
} from "react-icons/vsc";


/*
|--------------------------------------------------------------------------
| Bibliothèque des icônes
|--------------------------------------------------------------------------
|
| IMPORTANT :
| - Les "value" sont utilisées dans la base de données.
| - Ne pas modifier les valeurs déjà utilisées par le backend.
| - Certaines icônes Simple Icons n'existent pas dans la version
|   de react-icons installée dans le projet.
| - Dans ces cas, on utilise une icône Font Awesome compatible.
|
*/


export const skillIconLibrary = [

    /*
    |--------------------------------------------------------------------------
    | FRONTEND
    |--------------------------------------------------------------------------
    */

    {
        value: "html5",
        label: "HTML5",
        category: "Frontend",
        icon: SiHtml5,
        keywords: [
            "html",
            "html5",
            "markup",
            "web",
            "frontend",
        ],
    },

    {
        value: "css3",
        label: "CSS3",
        category: "Frontend",
        icon: FaCss3Alt,
        keywords: [
            "css",
            "css3",
            "style",
            "frontend",
            "design",
        ],
    },

    {
        value: "javascript",
        label: "JavaScript",
        category: "Frontend",
        icon: SiJavascript,
        keywords: [
            "javascript",
            "js",
            "frontend",
            "web",
        ],
    },

    {
        value: "typescript",
        label: "TypeScript",
        category: "Frontend",
        icon: SiTypescript,
        keywords: [
            "typescript",
            "ts",
            "javascript",
        ],
    },

    {
        value: "react",
        label: "React",
        category: "Frontend",
        icon: SiReact,
        keywords: [
            "react",
            "reactjs",
            "frontend",
        ],
    },

    {
        value: "vite",
        label: "Vite",
        category: "Frontend",
        icon: SiVite,
        keywords: [
            "vite",
            "frontend",
            "build",
            "bundler",
        ],
    },

    {
        value: "nextjs",
        label: "Next.js",
        category: "Frontend",
        icon: SiNextdotjs,
        keywords: [
            "next",
            "nextjs",
            "react",
        ],
    },

    {
        value: "nodejs",
        label: "Node.js",
        category: "Frontend",
        icon: SiNodedotjs,
        keywords: [
            "node",
            "nodejs",
            "javascript",
        ],
    },

    {
        value: "express",
        label: "Express",
        category: "Frontend",
        icon: SiExpress,
        keywords: [
            "express",
            "expressjs",
            "node",
            "backend",
        ],
    },

    {
        value: "nestjs",
        label: "NestJS",
        category: "Frontend",
        icon: SiNestjs,
        keywords: [
            "nestjs",
            "node",
            "backend",
        ],
    },

    {
        value: "angular",
        label: "Angular",
        category: "Frontend",
        icon: SiAngular,
        keywords: [
            "angular",
            "frontend",
        ],
    },

    {
        value: "vue",
        label: "Vue.js",
        category: "Frontend",
        icon: SiVuedotjs,
        keywords: [
            "vue",
            "vuejs",
            "frontend",
        ],
    },

    {
        value: "svelte",
        label: "Svelte",
        category: "Frontend",
        icon: SiSvelte,
        keywords: [
            "svelte",
            "frontend",
        ],
    },

    {
        value: "astro",
        label: "Astro",
        category: "Frontend",
        icon: SiAstro,
        keywords: [
            "astro",
            "frontend",
            "web",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | BACKEND
    |--------------------------------------------------------------------------
    */

    {
        value: "java",
        label: "Java",
        category: "Backend",
        icon: FaJava,
        keywords: [
            "java",
            "backend",
            "programming",
        ],
    },

    {
        value: "springboot",
        label: "Spring Boot",
        category: "Backend",
        icon: SiSpringboot,
        keywords: [
            "spring",
            "springboot",
            "java",
            "backend",
            "api",
        ],
    },

    {
        value: "spring",
        label: "Spring",
        category: "Backend",
        icon: SiSpring,
        keywords: [
            "spring",
            "java",
            "backend",
        ],
    },

    {
        value: "kotlin",
        label: "Kotlin",
        category: "Backend",
        icon: SiKotlin,
        keywords: [
            "kotlin",
            "android",
            "backend",
        ],
    },

    {
        value: "php",
        label: "PHP",
        category: "Backend",
        icon: SiPhp,
        keywords: [
            "php",
            "backend",
            "web",
        ],
    },

    {
        value: "laravel",
        label: "Laravel",
        category: "Backend",
        icon: SiLaravel,
        keywords: [
            "laravel",
            "php",
            "backend",
        ],
    },

    {
        value: "symfony",
        label: "Symfony",
        category: "Backend",
        icon: SiSymfony,
        keywords: [
            "symfony",
            "php",
            "backend",
        ],
    },

    {
        value: "python",
        label: "Python",
        category: "Backend",
        icon: SiPython,
        keywords: [
            "python",
            "programming",
            "backend",
        ],
    },

    {
        value: "django",
        label: "Django",
        category: "Backend",
        icon: SiDjango,
        keywords: [
            "django",
            "python",
            "backend",
        ],
    },

    {
        value: "flask",
        label: "Flask",
        category: "Backend",
        icon: SiFlask,
        keywords: [
            "flask",
            "python",
            "backend",
        ],
    },

    {
        value: "fastapi",
        label: "FastAPI",
        category: "Backend",
        icon: SiFastapi,
        keywords: [
            "fastapi",
            "python",
            "api",
        ],
    },

    {
        value: "c",
        label: "C",
        category: "Backend",
        icon: SiC,
        keywords: [
            "c",
            "programming",
        ],
    },

    {
        value: "cplusplus",
        label: "C++",
        category: "Backend",
        icon: SiCplusplus,
        keywords: [
            "c++",
            "cpp",
            "programming",
        ],
    },

    {
        value: "csharp",
        label: "C#",
        category: "Backend",
        icon: FaCode,
        keywords: [
            "c#",
            "csharp",
            "dotnet",
        ],
    },

    {
        value: "dotnet",
        label: ".NET",
        category: "Backend",
        icon: FaServer,
        keywords: [
            "dotnet",
            ".net",
            "microsoft",
            "backend",
        ],
    },

    {
        value: "go",
        label: "Go",
        category: "Backend",
        icon: SiGo,
        keywords: [
            "go",
            "golang",
            "backend",
        ],
    },

    {
        value: "rust",
        label: "Rust",
        category: "Backend",
        icon: SiRust,
        keywords: [
            "rust",
            "programming",
            "backend",
        ],
    },

    {
        value: "ruby",
        label: "Ruby",
        category: "Backend",
        icon: SiRuby,
        keywords: [
            "ruby",
            "programming",
        ],
    },

    {
        value: "rubyonrails",
        label: "Ruby on Rails",
        category: "Backend",
        icon: SiRubyonrails,
        keywords: [
            "ruby",
            "rails",
            "ruby on rails",
        ],
    },

    {
        value: "restapi",
        label: "REST API",
        category: "Backend",
        icon: FaServer,
        keywords: [
            "rest",
            "api",
            "rest api",
            "backend",
        ],
    },

    {
        value: "jwt",
        label: "JWT",
        category: "Backend",
        icon: FaShieldAlt,
        keywords: [
            "jwt",
            "json web token",
            "authentication",
            "security",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | MOBILE
    |--------------------------------------------------------------------------
    */

    {
        value: "flutter",
        label: "Flutter",
        category: "Mobile",
        icon: SiFlutter,
        keywords: [
            "flutter",
            "mobile",
            "dart",
        ],
    },

    {
        value: "dart",
        label: "Dart",
        category: "Mobile",
        icon: SiDart,
        keywords: [
            "dart",
            "flutter",
            "mobile",
        ],
    },

    {
        value: "android",
        label: "Android",
        category: "Mobile",
        icon: SiAndroid,
        keywords: [
            "android",
            "mobile",
        ],
    },

    {
        value: "ios",
        label: "iOS",
        category: "Mobile",
        icon: SiIos,
        keywords: [
            "ios",
            "apple",
            "mobile",
        ],
    },

    {
        value: "reactnative",
        label: "React Native",
        category: "Mobile",
        icon: FaMobileAlt,
        keywords: [
            "react native",
            "reactnative",
            "react",
            "mobile",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | DATABASE
    |--------------------------------------------------------------------------
    */

    {
        value: "mysql",
        label: "MySQL",
        category: "Database",
        icon: SiMysql,
        keywords: [
            "mysql",
            "sql",
            "database",
        ],
    },

    {
        value: "postgresql",
        label: "PostgreSQL",
        category: "Database",
        icon: SiPostgresql,
        keywords: [
            "postgresql",
            "postgres",
            "sql",
            "database",
        ],
    },

    {
        value: "mongodb",
        label: "MongoDB",
        category: "Database",
        icon: SiMongodb,
        keywords: [
            "mongodb",
            "nosql",
            "database",
        ],
    },

    {
        value: "redis",
        label: "Redis",
        category: "Database",
        icon: SiRedis,
        keywords: [
            "redis",
            "database",
            "cache",
        ],
    },

    {
        value: "sqlite",
        label: "SQLite",
        category: "Database",
        icon: SiSqlite,
        keywords: [
            "sqlite",
            "sql",
            "database",
        ],
    },

    {
        value: "mariadb",
        label: "MariaDB",
        category: "Database",
        icon: SiMariadb,
        keywords: [
            "mariadb",
            "mysql",
            "database",
        ],
    },

    {
        value: "oracle",
        label: "Oracle",
        category: "Database",
        icon: FaDatabase,
        keywords: [
            "oracle",
            "database",
            "sql",
        ],
    },

    {
        value: "microsoftsqlserver",
        label: "Microsoft SQL Server",
        category: "Database",
        icon: FaDatabase,
        keywords: [
            "sql server",
            "microsoft sql server",
            "mssql",
            "database",
        ],
    },

    {
        value: "firebase",
        label: "Firebase",
        category: "Database",
        icon: SiFirebase,
        keywords: [
            "firebase",
            "google",
            "database",
            "backend",
        ],
    },

    {
        value: "supabase",
        label: "Supabase",
        category: "Database",
        icon: SiSupabase,
        keywords: [
            "supabase",
            "database",
            "backend",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | GIT / DEVOPS
    |--------------------------------------------------------------------------
    */

    {
        value: "git",
        label: "Git",
        category: "DevOps",
        icon: SiGit,
        keywords: [
            "git",
            "version control",
        ],
    },

    {
        value: "github",
        label: "GitHub",
        category: "DevOps",
        icon: SiGithub,
        keywords: [
            "github",
            "git",
            "repository",
        ],
    },

    {
        value: "gitlab",
        label: "GitLab",
        category: "DevOps",
        icon: SiGitlab,
        keywords: [
            "gitlab",
            "git",
            "repository",
        ],
    },

    {
        value: "bitbucket",
        label: "Bitbucket",
        category: "DevOps",
        icon: SiBitbucket,
        keywords: [
            "bitbucket",
            "git",
            "repository",
        ],
    },

    {
        value: "docker",
        label: "Docker",
        category: "DevOps",
        icon: SiDocker,
        keywords: [
            "docker",
            "container",
            "devops",
        ],
    },

    {
        value: "kubernetes",
        label: "Kubernetes",
        category: "DevOps",
        icon: SiKubernetes,
        keywords: [
            "kubernetes",
            "k8s",
            "container",
        ],
    },

    {
        value: "jenkins",
        label: "Jenkins",
        category: "DevOps",
        icon: SiJenkins,
        keywords: [
            "jenkins",
            "ci",
            "cd",
            "devops",
        ],
    },

    {
        value: "githubactions",
        label: "GitHub Actions",
        category: "DevOps",
        icon: SiGithubactions,
        keywords: [
            "github actions",
            "ci",
            "cd",
        ],
    },

    {
        value: "terraform",
        label: "Terraform",
        category: "DevOps",
        icon: SiTerraform,
        keywords: [
            "terraform",
            "infrastructure",
            "devops",
        ],
    },

    {
        value: "ansible",
        label: "Ansible",
        category: "DevOps",
        icon: SiAnsible,
        keywords: [
            "ansible",
            "automation",
            "devops",
        ],
    },

    {
        value: "nginx",
        label: "Nginx",
        category: "DevOps",
        icon: SiNginx,
        keywords: [
            "nginx",
            "server",
            "web",
        ],
    },

    {
        value: "apache",
        label: "Apache",
        category: "DevOps",
        icon: SiApache,
        keywords: [
            "apache",
            "server",
            "web",
        ],
    },

    {
        value: "linux",
        label: "Linux",
        category: "DevOps",
        icon: SiLinux,
        keywords: [
            "linux",
            "operating system",
        ],
    },

    {
        value: "ubuntu",
        label: "Ubuntu",
        category: "DevOps",
        icon: SiUbuntu,
        keywords: [
            "ubuntu",
            "linux",
        ],
    },

    {
        value: "debian",
        label: "Debian",
        category: "DevOps",
        icon: SiDebian,
        keywords: [
            "debian",
            "linux",
        ],
    },

    {
        value: "kalilinux",
        label: "Kali Linux",
        category: "DevOps",
        icon: SiKalilinux,
        keywords: [
            "kali",
            "kali linux",
            "linux",
            "security",
        ],
    },

    {
        value: "redhat",
        label: "Red Hat",
        category: "DevOps",
        icon: SiRedhat,
        keywords: [
            "redhat",
            "red hat",
            "linux",
        ],
    },

    {
        value: "vercel",
        label: "Vercel",
        category: "DevOps",
        icon: SiVercel,
        keywords: [
            "vercel",
            "deployment",
            "hosting",
        ],
    },

    {
        value: "netlify",
        label: "Netlify",
        category: "DevOps",
        icon: SiNetlify,
        keywords: [
            "netlify",
            "deployment",
            "hosting",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | CLOUD
    |--------------------------------------------------------------------------
    */

    {
        value: "amazonwebservices",
        label: "Amazon Web Services",
        category: "Cloud",
        icon: FaCloud,
        keywords: [
            "aws",
            "amazon",
            "cloud",
        ],
    },

    {
        value: "googlecloud",
        label: "Google Cloud",
        category: "Cloud",
        icon: SiGooglecloud,
        keywords: [
            "google cloud",
            "gcp",
            "cloud",
        ],
    },

    {
        value: "microsoftazure",
        label: "Microsoft Azure",
        category: "Cloud",
        icon: FaCloud,
        keywords: [
            "azure",
            "microsoft",
            "cloud",
        ],
    },

    {
        value: "cloudflare",
        label: "Cloudflare",
        category: "Cloud",
        icon: SiCloudflare,
        keywords: [
            "cloudflare",
            "cdn",
            "dns",
            "cloud",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | API / SECURITY
    |--------------------------------------------------------------------------
    */

    {
        value: "postman",
        label: "Postman",
        category: "API & Security",
        icon: SiPostman,
        keywords: [
            "postman",
            "api",
            "rest",
        ],
    },

    {
        value: "swagger",
        label: "Swagger",
        category: "API & Security",
        icon: FaCode,
        keywords: [
            "swagger",
            "api",
            "openapi",
        ],
    },

    {
        value: "openapi",
        label: "OpenAPI",
        category: "API & Security",
        icon: FaProjectDiagram,
        keywords: [
            "openapi",
            "api",
            "swagger",
        ],
    },

    {
        value: "jsonwebtokens",
        label: "JSON Web Tokens",
        category: "API & Security",
        icon: FaShieldAlt,
        keywords: [
            "jwt",
            "json web token",
            "authentication",
            "security",
        ],
    },

    {
        value: "graphql",
        label: "GraphQL",
        category: "API & Security",
        icon: SiGraphql,
        keywords: [
            "graphql",
            "api",
        ],
    },

    {
        value: "apollographql",
        label: "Apollo GraphQL",
        category: "API & Security",
        icon: SiApollographql,
        keywords: [
            "apollo",
            "graphql",
            "api",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | DESIGN
    |--------------------------------------------------------------------------
    */

    {
        value: "figma",
        label: "Figma",
        category: "Design",
        icon: SiFigma,
        keywords: [
            "figma",
            "design",
            "ui",
            "ux",
        ],
    },

    {
        value: "adobexd",
        label: "Adobe XD",
        category: "Design",
        icon: FaLaptopCode,
        keywords: [
            "adobe xd",
            "design",
            "ui",
            "ux",
        ],
    },

    {
        value: "adobephotoshop",
        label: "Adobe Photoshop",
        category: "Design",
        icon: FaLaptopCode,
        keywords: [
            "photoshop",
            "adobe",
            "design",
        ],
    },

    {
        value: "adobeillustrator",
        label: "Adobe Illustrator",
        category: "Design",
        icon: FaLaptopCode,
        keywords: [
            "illustrator",
            "adobe",
            "design",
        ],
    },

    {
        value: "canva",
        label: "Canva",
        category: "Design",
        icon: FaLaptopCode,
        keywords: [
            "canva",
            "design",
            "graphic design",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | IA / DATA SCIENCE
    |--------------------------------------------------------------------------
    */

    {
        value: "tensorflow",
        label: "TensorFlow",
        category: "IA & Data",
        icon: SiTensorflow,
        keywords: [
            "tensorflow",
            "machine learning",
            "ai",
        ],
    },

    {
        value: "pytorch",
        label: "PyTorch",
        category: "IA & Data",
        icon: SiPytorch,
        keywords: [
            "pytorch",
            "machine learning",
            "ai",
        ],
    },

    {
        value: "opencv",
        label: "OpenCV",
        category: "IA & Data",
        icon: SiOpencv,
        keywords: [
            "opencv",
            "computer vision",
            "ai",
        ],
    },

    {
        value: "jupyter",
        label: "Jupyter",
        category: "IA & Data",
        icon: SiJupyter,
        keywords: [
            "jupyter",
            "python",
            "data science",
        ],
    },

    {
        value: "pandas",
        label: "Pandas",
        category: "IA & Data",
        icon: SiPandas,
        keywords: [
            "pandas",
            "python",
            "data science",
        ],
    },

    {
        value: "numpy",
        label: "NumPy",
        category: "IA & Data",
        icon: SiNumpy,
        keywords: [
            "numpy",
            "python",
            "data science",
        ],
    },

    {
        value: "scikitlearn",
        label: "Scikit-learn",
        category: "IA & Data",
        icon: SiScikitlearn,
        keywords: [
            "scikit",
            "scikit learn",
            "machine learning",
            "python",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | CYBERSÉCURITÉ
    |--------------------------------------------------------------------------
    */

    {
        value: "wireshark",
        label: "Wireshark",
        category: "Cybersecurity",
        icon: SiWireshark,
        keywords: [
            "wireshark",
            "network",
            "security",
        ],
    },

    {
        value: "metasploit",
        label: "Metasploit",
        category: "Cybersecurity",
        icon: SiMetasploit,
        keywords: [
            "metasploit",
            "security",
            "pentest",
        ],
    },

    {
        value: "burpsuite",
        label: "Burp Suite",
        category: "Cybersecurity",
        icon: SiBurpsuite,
        keywords: [
            "burp",
            "burp suite",
            "security",
            "web security",
        ],
    },

    {
        value: "owasp",
        label: "OWASP",
        category: "Cybersecurity",
        icon: SiOwasp,
        keywords: [
            "owasp",
            "security",
            "web security",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | OUTILS DE DÉVELOPPEMENT
    |--------------------------------------------------------------------------
    */

    {
        value: "vscode",
        label: "Visual Studio Code",
        category: "Tools",
        icon: FaCode,
        keywords: [
            "vscode",
            "visual studio code",
            "editor",
            "ide",
        ],
    },

    {
        value: "intellijidea",
        label: "IntelliJ IDEA",
        category: "Tools",
        icon: SiIntellijidea,
        keywords: [
            "intellij",
            "idea",
            "java",
            "ide",
        ],
    },

    {
        value: "eclipseide",
        label: "Eclipse IDE",
        category: "Tools",
        icon: SiEclipseide,
        keywords: [
            "eclipse",
            "java",
            "ide",
        ],
    },

    {
        value: "androidstudio",
        label: "Android Studio",
        category: "Tools",
        icon: SiAndroidstudio,
        keywords: [
            "android studio",
            "android",
            "ide",
        ],
    },

    {
        value: "terminal",
        label: "Terminal",
        category: "Tools",
        icon: VscTerminal,
        keywords: [
            "terminal",
            "console",
            "command line",
        ],
    },

    {
        value: "debug",
        label: "Debug",
        category: "Tools",
        icon: VscDebug,
        keywords: [
            "debug",
            "debugging",
        ],
    },

    {
        value: "namespace",
        label: "Namespace",
        category: "Tools",
        icon: VscSymbolNamespace,
        keywords: [
            "namespace",
            "code",
        ],
    },

    {
        value: "markdown",
        label: "Markdown",
        category: "Tools",
        icon: SiMarkdown,
        keywords: [
            "markdown",
            "documentation",
        ],
    },

    {
        value: "npm",
        label: "npm",
        category: "Tools",
        icon: SiNpm,
        keywords: [
            "npm",
            "node",
            "javascript",
            "package manager",
        ],
    },

    {
        value: "yarn",
        label: "Yarn",
        category: "Tools",
        icon: SiYarn,
        keywords: [
            "yarn",
            "node",
            "javascript",
            "package manager",
        ],
    },

    {
        value: "pnpm",
        label: "pnpm",
        category: "Tools",
        icon: SiPnpm,
        keywords: [
            "pnpm",
            "node",
            "javascript",
            "package manager",
        ],
    },


    /*
    |--------------------------------------------------------------------------
    | ICÔNES GÉNÉRIQUES
    |--------------------------------------------------------------------------
    */

    {
        value: "code",
        label: "Code",
        category: "General",
        icon: FaCode,
        keywords: [
            "code",
            "programming",
            "development",
        ],
    },

    {
        value: "database",
        label: "Database",
        category: "General",
        icon: FaDatabase,
        keywords: [
            "database",
            "data",
        ],
    },

    {
        value: "server",
        label: "Server",
        category: "General",
        icon: FaServer,
        keywords: [
            "server",
            "backend",
        ],
    },

    {
        value: "cloud",
        label: "Cloud",
        category: "General",
        icon: FaCloud,
        keywords: [
            "cloud",
            "hosting",
        ],
    },

    {
        value: "security",
        label: "Security",
        category: "General",
        icon: FaShieldAlt,
        keywords: [
            "security",
            "cybersecurity",
        ],
    },

    {
        value: "network",
        label: "Network",
        category: "General",
        icon: FaNetworkWired,
        keywords: [
            "network",
            "networking",
        ],
    },

    {
        value: "robot",
        label: "Robot",
        category: "General",
        icon: FaRobot,
        keywords: [
            "robot",
            "ai",
            "automation",
        ],
    },

    {
        value: "terminal-generic",
        label: "Terminal",
        category: "General",
        icon: FaTerminal,
        keywords: [
            "terminal",
            "console",
        ],
    },

    {
        value: "tools",
        label: "Tools",
        category: "General",
        icon: FaCogs,
        keywords: [
            "tools",
            "development",
        ],
    },

    {
        value: "mobile",
        label: "Mobile",
        category: "General",
        icon: FaMobileAlt,
        keywords: [
            "mobile",
            "phone",
        ],
    },

    {
        value: "laptop",
        label: "Laptop",
        category: "General",
        icon: FaLaptopCode,
        keywords: [
            "laptop",
            "computer",
            "development",
        ],
    },

    {
        value: "project",
        label: "Project",
        category: "General",
        icon: FaProjectDiagram,
        keywords: [
            "project",
            "development",
        ],
    },

];


/*
|--------------------------------------------------------------------------
| MAP RAPIDE value -> composant React
|--------------------------------------------------------------------------
*/

export const skillIconMap = Object.fromEntries(
    skillIconLibrary.map((item) => [
        item.value,
        item.icon,
    ])
);


/*
|--------------------------------------------------------------------------
| Récupération sécurisée d'une icône
|--------------------------------------------------------------------------
*/

export function getSkillIcon(iconValue) {
    return (
        skillIconMap[iconValue] ||
        FaCode
    );
}


/*
|--------------------------------------------------------------------------
| Recherche dans la bibliothèque
|--------------------------------------------------------------------------
*/

export function searchSkillIcons(search = "") {
    const normalizedSearch = search
        .trim()
        .toLowerCase();

    if (!normalizedSearch) {
        return skillIconLibrary;
    }

    return skillIconLibrary.filter((item) => {
        const labelMatch = item.label
            .toLowerCase()
            .includes(normalizedSearch);

        const valueMatch = item.value
            .toLowerCase()
            .includes(normalizedSearch);

        const keywordMatch = item.keywords?.some(
            (keyword) =>
                keyword
                    .toLowerCase()
                    .includes(normalizedSearch)
        );

        return (
            labelMatch ||
            valueMatch ||
            keywordMatch
        );
    });
}


/*
|--------------------------------------------------------------------------
| Recherche par catégorie
|--------------------------------------------------------------------------
*/

export function getSkillIconsByCategory(category) {
    if (!category) {
        return skillIconLibrary;
    }

    return skillIconLibrary.filter(
        (item) =>
            item.category.toLowerCase() ===
            category.toLowerCase()
    );
}


/*
|--------------------------------------------------------------------------
| Liste des catégories
|--------------------------------------------------------------------------
*/

export const skillIconCategories = [
    ...new Set(
        skillIconLibrary.map(
            (item) => item.category
        )
    ),
];