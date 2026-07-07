import type { CVData } from '../types';

export const cvData: CVData = {
  name: "Andrew Garcia Mosquera",
  headline: "Software Engineer · Founder of Lyroo",
  location: "Armenia, Quindio, Colombia",
  email: "contact@andrewgarcia.dev",
  phone: "+57 320 657 4470",
  website: "https://andrewgarcia.dev",
  socialNetworks: [
    {
      network: "LinkedIn",
      username: "andrewgarciam",
      url: "https://linkedin.com/in/andrewgarciam"
    },
    {
      network: "GitHub",
      username: "DrewGGM",
      url: "https://github.com/DrewGGM"
    }
  ],
  summary: "Software engineer and founder of Lyroo S.A.S, a Colombian startup building LyrooPOS — an offline-first point of sale with an embedded DIAN electronic invoicing engine. Specialized in backend development and application architecture (Java/Spring Boot, Go, hexagonal architecture). Currently contributing to core banking systems at COFINCAFE while leading product and engineering at Lyroo. Strong foundation in QA, clean code and agile methodologies.",
  education: [
    {
      institution: "Institucion Universitaria EAM",
      area: "Software Engineering",
      degree: "Bachelor's Degree",
      startDate: "2023-02",
      endDate: "present",
      location: "Armenia, Colombia"
    },
    {
      institution: "TripleTen LatAm",
      area: "QA Engineer",
      degree: "Bootcamp",
      startDate: "2024-12",
      endDate: "2025-06",
      location: "Online",
      summary: "Intensive training program in software quality assurance"
    },
    {
      institution: "Next U",
      area: "Web Developer",
      degree: "Course",
      startDate: "2022-02",
      endDate: "2022-02",
      location: "Online"
    }
  ],
  experience: [
    {
      company: "FINANCIERA COFINCAFE - Cooperativa de Ahorro y Credito",
      position: "Development Intern",
      startDate: "2026-01",
      endDate: "present",
      location: "Armenia, Quindio, Colombia",
      summary: "Assisting in the development and support of the core banking system using Apache Fineract and Mifos.",
      highlights: [
        "Helping implement financial products and configure banking modules",
        "Resolving issues and contributing to system improvements",
        "Working with Apache Fineract and Mifos open-source banking platform"
      ]
    },
    {
      company: "Lyroo S.A.S",
      position: "Founder & Lead Software Engineer",
      startDate: "2025-05",
      endDate: "present",
      location: "Armenia, Quindio, Colombia · Remote-first",
      summary: "Founded Lyroo, a software startup for Colombian SMBs: LyrooPOS — a desktop point of sale with an embedded DIAN electronic invoicing engine (offline-first, unlimited invoicing with no per-document fees) — and Lyroo Build, a boutique custom software studio.",
      highlights: [
        "Built LyrooPOS end-to-end: Go (Wails) backend with 31+ services + React 18 frontend over PostgreSQL, shipped v1.2 to production with businesses in several Colombian cities",
        "Engineered an embedded DIAN e-invoicing core (UBL 2.1) — unlimited electronic invoicing without third-party APIs or per-folio costs",
        "Designed offline-first architecture: local data with AES-256 encrypted cloud backups, real-time kitchen/waiter apps via WebSocket, Bold payment terminals",
        "Lead product, engineering, sales and customer onboarding, including DIAN digital-certificate management for clients"
      ]
    }
  ],
  skills: [
    { label: "Languages", details: "Java, Python, Go, SQL" },
    { label: "Frameworks & Libraries", details: "Spring Boot, Angular, Selenium" },
    { label: "DevOps & Tools", details: "Git, Docker, Scrum" },
    { label: "Software Engineering", details: "OOP, Design Patterns, Data Structures, Clean Code, Hexagonal Architecture, Microservices" },
    { label: "Areas of Expertise", details: "Backend & Frontend Development, Software Architecture, QA, Usability" }
  ],
  certifications: [
    { title: "Spring Boot: Backend Enterprise Professional Certificate", issuer: "Dev Senior Code", date: "Dec 2025", certificateUrl: "/certificates/devseniorcode%20springboot.pdf" },
    { title: "QA Engineer Bootcamp", issuer: "TripleTen LatAm", date: "Dec 2024 - Jun 2025", certificateUrl: "/certificates/QAEngineer%20Tripleten.pdf" },
    { title: "Scrum Fundamentals Certified (SFC)", issuer: "VMEdu inc", date: "Feb 2024", certificateUrl: "/certificates/scrumcertified.pdf" },
    { title: "Desarrollo Web y UX/UI", issuer: "Next U", date: "Feb 2022", certificateUrl: "/certificates/nextU-DesarrolloWeb%20UXUI.pdf" },
    { title: "DevOps, APIs and Microservices Architecture Fundamentals", issuer: "Udemy", date: "Feb 2025" },
    { title: "Angular", issuer: "Edutin Academy", date: "Mar 2025" },
    { title: "Spring Framework", issuer: "Udemy", date: "May 2025" }
  ],
  languages: [
    { label: "Spanish", details: "Native" },
    { label: "English", details: "Professional" }
  ],
  projects: [
    {
      title: "Lyroo — Startup (POS + DIAN E-Invoicing)",
      description: "My startup: software for Colombian SMBs. LyrooPOS is an offline-first desktop point of sale with an embedded DIAN electronic invoicing engine (UBL 2.1) — unlimited invoicing with no per-document fees, encrypted cloud backups, real-time kitchen & waiter apps, and human WhatsApp support. Lyroo Build is our boutique custom software studio.",
      techStack: ["Go", "Wails", "React", "PostgreSQL", "Next.js", "DIAN UBL 2.1"],
      demoUrl: "https://lyroo.com.co",
      imageUrl: "/projects/lyroo-web.png",
      images: [
        "/projects/lyroo-web.png",
        "/projects/lyroo-web-2.png"
      ],
      status: "completed"
    },
    {
      title: "Restaurant POS System",
      description: "Complete point-of-sale desktop application for Colombian restaurants. Features touchscreen-optimized sales, real-time kitchen/waiter apps, DIAN electronic invoicing, Bold payment terminals, inventory control with auto-deduction, split billing, and AI automation via MCP.",
      techStack: ["Go", "React", "TypeScript", "PostgreSQL", "Material-UI", "WebSocket"],
      githubUrl: "https://github.com/DrewGGM/demo-pos-system",
      demoUrl: "https://pos-system.v1.andrewgarcia.dev",
      imageUrl: "/projects/pos-main.png",
      images: [
        "/projects/pos-main.png",
        "/projects/pos-dashboard.png",
        "/projects/pos-products.png"
      ],
      status: "completed"
    },
    {
      title: "AI Content Bot",
      description: "Agent-agnostic AI content factory for social media. Generates reels, carousels, posts and code-rendered motion videos for any brand using ANY coding agent (Claude Code, Codex, Gemini CLI, Kimi, Cursor...) or LLM API (OpenAI-compatible, OpenRouter, Ollama). Features AI visual QA, a human-in-the-loop approval panel (PWA), smart content planning from history, and one-click publishing to Meta.",
      techStack: ["Node.js", "TypeScript", "AI Agents", "Remotion", "FFmpeg", "Cloudflare D1/R2"],
      githubUrl: "https://github.com/DrewGGM/ai-content-bot",
      demoUrl: "https://ai-content-bot-demo.andrewgarcia.dev",
      imageUrl: "/projects/content-bot-panel.png",
      images: [
        "/projects/content-bot-panel.png",
        "/projects/content-bot-pieces.png",
        "/projects/content-bot-generate.png",
        "/projects/content-bot-mobile.png"
      ],
      status: "completed"
    },
    {
      title: "Coming Soon",
      description: "More exciting projects on the way. Check back soon!",
      techStack: [],
      status: "coming-soon"
    }
  ]
};
