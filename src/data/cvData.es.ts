import type { CVData } from '../types';

/**
 * Versión en español del CV — misma estructura que cvData.ts.
 * Se usa como fuente para generar Andrew_Garcia_Mosquera_CV_ES.pdf.
 * Los nombres propios (empresas, tech stack, certificados oficiales, URLs) se
 * conservan tal cual; solo se traduce el texto narrativo.
 */
export const cvDataES: CVData = {
  name: "Andrew Garcia Mosquera",
  headline: "Ingeniero de Software · Fundador de Lyroo",
  location: "Armenia, Quindío, Colombia",
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
  summary: "Ingeniero de software y fundador de Lyroo S.A.S, una startup colombiana que desarrolla LyrooPOS — un punto de venta offline-first con un motor de facturación electrónica DIAN embebido. Especializado en desarrollo backend y arquitectura de aplicaciones (Java/Spring Boot, Go, arquitectura hexagonal). Actualmente contribuyo a sistemas de core bancario en COFINCAFE mientras lidero producto e ingeniería en Lyroo. Sólida base en QA, código limpio y metodologías ágiles.",
  education: [
    {
      institution: "Institución Universitaria EAM",
      area: "Ingeniería de Software",
      degree: "Pregrado",
      startDate: "2023-02",
      endDate: "present",
      location: "Armenia, Colombia"
    },
    {
      institution: "TripleTen LatAm",
      area: "Ingeniero QA",
      degree: "Bootcamp",
      startDate: "2024-12",
      endDate: "2025-06",
      location: "Online",
      summary: "Programa intensivo de aseguramiento de calidad de software"
    },
    {
      institution: "Next U",
      area: "Desarrollador Web",
      degree: "Curso",
      startDate: "2022-02",
      endDate: "2022-02",
      location: "Online"
    }
  ],
  experience: [
    {
      company: "FINANCIERA COFINCAFE - Cooperativa de Ahorro y Crédito",
      position: "Practicante de Desarrollo",
      startDate: "2026-01",
      endDate: "present",
      location: "Armenia, Quindío, Colombia",
      summary: "Apoyo en el desarrollo y soporte del sistema de core bancario usando Apache Fineract y Mifos.",
      highlights: [
        "Apoyo en la implementación de productos financieros y la configuración de módulos bancarios",
        "Resolución de incidencias y contribución a mejoras del sistema",
        "Trabajo con la plataforma bancaria open-source Apache Fineract y Mifos"
      ]
    },
    {
      company: "Lyroo S.A.S",
      position: "Fundador e Ingeniero de Software Líder",
      startDate: "2025-05",
      endDate: "present",
      location: "Armenia, Quindío, Colombia · Remote-first",
      summary: "Fundé Lyroo, una startup de software para pymes colombianas: LyrooPOS — un punto de venta de escritorio con un motor de facturación electrónica DIAN embebido (offline-first, facturación ilimitada sin costos por documento) — y Lyroo Build, un estudio boutique de software a la medida.",
      highlights: [
        "Desarrollé LyrooPOS de extremo a extremo: backend en Go (Wails) con más de 31 servicios + frontend en React 18 sobre PostgreSQL — v1.2 en producción, primeros clientes activos desde julio de 2026",
        "Diseñé un core de facturación electrónica DIAN embebido (UBL 2.1) — facturación electrónica ilimitada sin APIs de terceros ni costos por folio",
        "Diseñé una arquitectura offline-first: datos locales con respaldos en la nube cifrados con AES-256, apps de cocina/mesero en tiempo real vía WebSocket y datáfonos Bold",
        "Lidero producto, ingeniería, ventas y onboarding de clientes, incluida la gestión de certificados digitales DIAN para los clientes"
      ]
    }
  ],
  skills: [
    { label: "Lenguajes", details: "Java, Go, TypeScript, Python, SQL" },
    { label: "Frameworks y Librerías", details: "Spring Boot, React, Node.js, Next.js, Angular, Wails, Selenium" },
    { label: "DevOps y Herramientas", details: "Git, Docker, Cloudflare (Pages/D1/R2), Scrum" },
    { label: "Ingeniería de Software", details: "POO, Patrones de Diseño, Estructuras de Datos, Código Limpio, Arquitectura Hexagonal, Microservicios" },
    { label: "Áreas de Especialización", details: "Desarrollo Backend y Frontend, Arquitectura de Software, QA, Usabilidad" }
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
    { label: "Español", details: "Nativo" },
    { label: "Inglés", details: "Profesional" }
  ],
  projects: [
    {
      title: "Lyroo — Startup (POS + Facturación Electrónica DIAN)",
      description: "Mi startup: software para pymes colombianas. LyrooPOS es un punto de venta de escritorio offline-first con un motor de facturación electrónica DIAN embebido (UBL 2.1) — facturación ilimitada sin costos por documento, respaldos en la nube cifrados, apps de cocina y mesero en tiempo real, y soporte humano por WhatsApp. Lyroo Build es nuestro estudio boutique de software a la medida.",
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
      title: "Sistema POS para Restaurantes",
      description: "Aplicación de escritorio de punto de venta completa para restaurantes colombianos. Incluye ventas optimizadas para pantalla táctil, apps de cocina/mesero en tiempo real, facturación electrónica DIAN, datáfonos Bold, control de inventario con descuento automático, división de cuentas y automatización con IA vía MCP.",
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
      description: "Fábrica de contenido con IA, agnóstica de agente, para redes sociales. Genera reels, carruseles, publicaciones y videos con motion renderizados por código para cualquier marca usando CUALQUIER agente de código (Claude Code, Codex, Gemini CLI, Kimi, Cursor...) o API de LLM (compatible con OpenAI, OpenRouter, Ollama). Incluye QA visual con IA, un panel de aprobación con humano en el ciclo (PWA), planificación inteligente de contenido a partir del historial y publicación en Meta con un clic.",
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
      title: "Próximamente",
      description: "Más proyectos emocionantes en camino. ¡Vuelve pronto!",
      techStack: [],
      status: "coming-soon"
    }
  ]
};
