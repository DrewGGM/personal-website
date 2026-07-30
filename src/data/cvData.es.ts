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
  summary: "Ingeniero de software y fundador de Lyroo S.A.S, una startup colombiana que desarrolla LyrooPOS — un punto de venta offline-first con un motor de facturación electrónica DIAN embebido. Especializado en desarrollo backend y arquitectura de aplicaciones (Java/Spring Boot, Go, arquitectura hexagonal). Actualmente desarrollo sistemas de core bancario en COFINCAFE y software full-stack para clientes en JAMS Technologies, mientras lidero producto e ingeniería en Lyroo. Sólida base en QA, código limpio y metodologías ágiles.",
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
      company: "Financiera Cofincafé (Cooperativa de Ahorro y Crédito)",
      position: "Desarrollador de Software Junior",
      startDate: "2026-08",
      endDate: "present",
      location: "Armenia, Quindío, Colombia",
      summary: "Vinculado como desarrollador tras la práctica, continuando en la plataforma de core bancario de la cooperativa.",
      highlights: [
        "Desarrollo y mantenimiento de funcionalidades sobre el core bancario Apache Fineract",
        "Soporte a productos financieros y configuración de módulos bancarios en producción"
      ]
    },
    {
      company: "JAMS Technologies",
      position: "Desarrollador Full Stack",
      startDate: "2026-04",
      endDate: "present",
      location: "Colombia · Remoto",
      summary: "Desarrollo de software web y móvil a la medida para clientes en un estudio de desarrollo colombiano, desde MVPs hasta plataformas empresariales escalables.",
      highlights: [
        "Desarrollo de funcionalidades full-stack entre front-end, API y base de datos",
        "Entrega de proyectos de cliente a producción según el alcance y los plazos acordados"
      ]
    },
    {
      company: "Financiera Cofincafé (Cooperativa de Ahorro y Crédito)",
      position: "Practicante de Desarrollo",
      startDate: "2026-01",
      endDate: "2026-07",
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
  ventures: [
    {
      name: "Lyroo",
      tagline: "Software para pymes colombianas",
      description:
        "La startup que fundé y lidero como ingeniero principal. Lyroo construye software empresarial offline-first para pymes colombianas, sobre un motor de facturación electrónica DIAN que escribí desde cero — así nuestros productos facturan sin pagarle a un tercero por documento. LyrooPOS ya está en producción con clientes de pago; el resto de la línea está en desarrollo activo.",
      url: "https://lyroo.com.co",
      role: "Fundador e Ingeniero Principal",
      products: ["lyroo-pos", "dian-engine", "liria", "lyfin", "lydeck"]
    }
  ],
  projects: [
    // ── Lyroo (startup) ────────────────────────────────────────────────────
    {
      slug: "lyroo-pos",
      title: "LyrooPOS — Punto de venta para restaurantes",
      tagline: "POS de escritorio offline-first con facturación DIAN embebida.",
      description:
        "El producto insignia de Lyroo: un punto de venta de escritorio para restaurantes colombianos, en producción en su versión 1.2. Ventas optimizadas para pantalla táctil, apps de cocina y mesero en tiempo real por WebSocket, facturación electrónica DIAN integrada, datáfonos Bold, inventario con descuento automático, división de cuentas y automatización con IA vía MCP. Sigue vendiendo sin internet y sincroniza las facturas con la DIAN cuando vuelve la conexión.",
      role: "Fundador e Ingeniero Principal",
      year: "2025 — presente",
      techStack: ["Go", "Wails", "React", "TypeScript", "PostgreSQL", "WebSocket"],
      links: [
        { label: "Demo en vivo", url: "https://pos-system.v1.andrewgarcia.dev", kind: "demo" },
        { label: "Código del demo", url: "https://github.com/DrewGGM/demo-pos-system", kind: "repo" }
      ],
      imageUrl: "/projects/pos-main.png",
      images: [
        "/projects/pos-main.png",
        "/projects/pos-dashboard.png",
        "/projects/pos-products.png"
      ],
      status: "completed",
      category: "startup",
      featured: true,
      inCv: true
    },
    {
      slug: "dian-engine",
      title: "Motor DIAN de Lyroo",
      tagline: "Facturación electrónica colombiana como librería Go embebible.",
      description:
        "El núcleo propietario detrás de cada producto de Lyroo: XML UBL 2.1 para facturas, notas crédito y débito, documentos soporte, POS y nómina; firma XAdES-EPES con certificados PKCS12; cálculo de CUFE/CUDE/CUNE; transmisión SOAP con WS-Security al VPFE de la DIAN; y generación de PDF en carta A4 y POS de 80mm. Embebido como llamadas Go, sin desplegar un servidor de API aparte.",
      role: "Autor único",
      year: "2026",
      techStack: ["Go", "UBL 2.1", "XAdES-EPES", "SOAP / WS-Security", "PKCS12"],
      privateRepo: true,
      status: "completed",
      category: "startup"
    },
    {
      slug: "liria",
      title: "Liria — Plataforma de micro-dramas verticales",
      tagline: "Micro-dramas y webtoons con IA para el mercado hispanohablante.",
      description:
        "Plataforma de micro-dramas verticales (series de 50–100 capítulos de 1–2 minutos) y cómics asistidos por IA, con comunidad co-creadora y monetización de transparencia radical: monedas que no expiran, precio total visible, anuncios recompensados verificados en servidor y VIP cancelable en un clic. Construida sobre un ledger de monedas de doble entrada e idempotente, con desbloqueo de tres vías (gratis / monedas / anuncio).",
      role: "Fundador e Ingeniero Principal",
      year: "2026",
      techStack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "React Native (Expo)", "React"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },
    {
      slug: "lyfin",
      title: "Lyfin — Finanzas personales para Colombia",
      tagline: "Gastos, deudas y presupuestos local-first. Privado por diseño.",
      description:
        "App de finanzas personales para Colombia — gastos, deudas, presupuestos y recordatorios de pago — con cliente Android (Kotlin/Compose) y PWA (React/TS). Todo funciona offline y vive cifrado en el dispositivo. El dinero se maneja solo en enteros de unidad menor (el COP no tiene centavos), y los dos clientes se mantienen a la par con golden vectors compartidos que ambas suites corren en CI, ya que no hay capa KMP común.",
      role: "Fundador e Ingeniero Principal",
      year: "2026",
      techStack: ["Kotlin", "Jetpack Compose", "React", "TypeScript", "SQLCipher"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },
    {
      slug: "lydeck",
      title: "LyDeck — Centro de control para agentes de código",
      tagline: "Terminal, consola de configuración y cliente Git, agnóstico de agente.",
      description:
        "Una terminal con renderizado por GPU que además es el panel de control de los agentes CLI que ya usas. Diffs aprobables, tokens y costo en vivo, servidores MCP y permisos editados en una UI real que escribe los archivos de configuración nativos de tu CLI, un cliente Git visual con un carril por worktree, y un modelo local embebido para ayuda de comandos sin conexión. Agnóstico por diseño: sin cuenta, sin telemetría.",
      role: "Fundador e Ingeniero Principal",
      year: "2026",
      techStack: ["Rust", "Tauri", "React", "TypeScript", "WebGPU"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },

    // ── Productos independientes y open source ─────────────────────────────
    {
      slug: "ai-content-bot",
      title: "AI Content Bot",
      tagline: "Fábrica de contenido para redes, agnóstica de agente.",
      description:
        "Genera reels, carruseles, publicaciones y videos con motion renderizados por código para cualquier marca usando CUALQUIER agente de código (Claude Code, Codex, Gemini CLI, Kimi, Cursor…) o API de LLM (compatible con OpenAI, OpenRouter, Ollama). Incluye QA visual con IA que regenera los frames malos, un panel de aprobación con humano en el ciclo (PWA), planificación de contenido a partir del historial y publicación en Meta con un clic.",
      role: "Autor único",
      year: "2026",
      techStack: ["Node.js", "TypeScript", "Agentes IA", "Remotion", "FFmpeg", "Cloudflare D1/R2"],
      links: [
        { label: "Demo en vivo", url: "https://ai-content-bot-demo.andrewgarcia.dev", kind: "demo" },
        { label: "Código", url: "https://github.com/DrewGGM/ai-content-bot", kind: "repo" }
      ],
      imageUrl: "/projects/content-bot-panel.png",
      images: [
        "/projects/content-bot-panel.png",
        "/projects/content-bot-pieces.png",
        "/projects/content-bot-generate.png",
        "/projects/content-bot-mobile.png"
      ],
      status: "completed",
      category: "product",
      featured: true,
      inCv: true
    },
    {
      slug: "project-blueprint",
      title: "Project Blueprint",
      tagline: "Una agent skill que actúa como tu arquitecto de software.",
      description:
        "Convierte una idea cruda en un blueprint validado y listo para codear antes de escribir una línea, a través de cinco fases con compuerta: enmarcar, descubrir, arquitecturar, endurecer y planear. Cada fase tiene una compuerta de salida, y la ceremonia se ajusta al tamaño del trabajo (Lite / Estándar / Full). Portable entre Claude Code, Cursor y el ecosistema de agent skills.",
      role: "Autor único",
      year: "2026",
      techStack: ["Agent Skills", "Markdown", "Arquitectura de Software", "C4 / Mermaid"],
      links: [
        { label: "Código", url: "https://github.com/DrewGGM/project-blueprint-skill", kind: "repo" }
      ],
      status: "completed",
      category: "product"
    },
    {
      slug: "qr-permanente",
      title: "QR Permanente",
      tagline: "Códigos QR artísticos y permanentes. Sin servidor ni caducidad.",
      description:
        "Generador de QR 100% estático con 10 plantillas precargadas (URL, menú de restaurante, WiFi, vCard, pagos, eventos de calendario…), seis estilos de puntos, gradientes, logo embebido dentro del SVG en vez de superpuesto, y exportación a SVG, PNG, JPEG o WebP. Como nada se guarda en servidor, los códigos no se pueden romper ni vencer.",
      role: "Autor único",
      year: "2026",
      techStack: ["Astro", "Tailwind CSS v4", "TypeScript", "Cloudflare Pages"],
      links: [
        { label: "Sitio en vivo", url: "https://qr-permanente.pages.dev", kind: "site" },
        { label: "Código", url: "https://github.com/DrewGGM/QR-Generator", kind: "repo" }
      ],
      status: "completed",
      category: "product"
    },

    // ── Proyectos académicos y anteriores ──────────────────────────────────
    {
      slug: "vetapp",
      title: "VetApp — Gestión de clínicas veterinarias",
      tagline: "API Spring Boot con DDD más un cliente Angular 19.",
      description:
        "Sistema full-stack para clínicas veterinarias: propietarios y mascotas, citas y consultas médicas, vacunaciones, tratamientos y recordatorios. La API sigue Domain-Driven Design en capas de dominio, aplicación, infraestructura e interfaces, con mapeo MapStruct y documentación OpenAPI; el cliente es una SPA en Angular 19 con Tailwind.",
      role: "Proyecto universitario",
      year: "2025",
      techStack: ["Java 17", "Spring Boot 3.4", "DDD", "MySQL", "Angular 19", "Tailwind"],
      links: [
        { label: "API", url: "https://github.com/DrewGGM/Proyecto-AppsEmpresariales-VetApi", kind: "repo" },
        { label: "App web", url: "https://github.com/DrewGGM/Proyecto-AppsEmpresariales-VetApp", kind: "repo" }
      ],
      status: "completed",
      category: "academic",
      inCv: true
    },
    {
      slug: "airbnb-clone",
      title: "Plataforma de reservas tipo Airbnb",
      tagline: "API NestJS + Prisma con front-end en Vue 3.",
      description:
        "Plataforma de alquiler de propiedades que cubre el flujo completo de reserva: autenticación JWT con acceso por roles, publicación de propiedades con imágenes y amenidades, disponibilidad y reservas. La API es NestJS con Prisma sobre MySQL y cache-manager; el cliente es Vue 3 con stores de Pinia, Vue Router y pruebas end-to-end con Playwright.",
      role: "Proyecto universitario",
      year: "2024",
      techStack: ["NestJS", "Prisma", "MySQL", "Vue 3", "Pinia", "Playwright"],
      links: [
        { label: "Código (API + web)", url: "https://github.com/DrewGGM/AirBNB-PW", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "unilocal",
      title: "UniLocal — Descubre comercios locales",
      tagline: "App Android con mapas, reseñas y flujo de moderación.",
      description:
        "App en Jetpack Compose para encontrar y calificar tiendas, restaurantes y servicios cercanos. Mapa interactivo de Mapbox con filtros por categoría, creación de lugares con fotos y horarios, reseñas, favoritos y un rol de moderador con cola de aprobación y estadísticas. Firebase Auth y Firestore como backend, Cloudinary para subir imágenes y temas Material 3 claro y oscuro completos.",
      role: "Versión solo, a partir de un proyecto de curso en equipo",
      year: "2025",
      techStack: ["Kotlin", "Jetpack Compose", "MVVM", "Firebase", "Mapbox", "Cloudinary"],
      links: [
        { label: "Código", url: "https://github.com/DrewGGM/UniLocal", kind: "repo" },
        { label: "Versión del curso", url: "https://github.com/DrewGGM/ProyectoFinal-UniLocal-AppsMoviles", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "bondbox",
      title: "BondBox — Organizador familiar colaborativo",
      tagline: "Tareas, inventario y finanzas compartidas del hogar.",
      description:
        "Plataforma web para que las familias se organicen juntas: tareas y calendario, inventario compartido, comunicación grupal y finanzas del hogar. Construida por un equipo de cuatro; yo estuve a cargo del asistente Bondy AI y del módulo de finanzas. React 18 con Zustand, React Hook Form y validación con Zod, probada con Vitest y desplegada en Docker detrás de nginx.",
      role: "Equipo de 4 · Módulos de IA y Finanzas",
      year: "2025",
      techStack: ["React 18", "TypeScript", "Zustand", "Zod", "Vitest", "Docker"],
      links: [
        { label: "Código del front-end", url: "https://github.com/DrewGGM/bondbox-frontend", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "apitravel",
      title: "ApiTravel — API de reservas de viajes",
      tagline: "API REST en Spring Boot estructurada con DDD.",
      description:
        "API REST para explorar y reservar paquetes turísticos, cubriendo clientes, viajes, itinerarios día a día y reservas. Domain-Driven Design separa las capas de dominio, persistencia y web; las reglas de negocio como emails únicos y rangos de fechas válidos se validan en el dominio y están cubiertas por pruebas unitarias, con la superficie documentada vía OpenAPI.",
      role: "Proyecto universitario",
      year: "2025",
      techStack: ["Java", "Spring Boot", "DDD", "JPA", "OpenAPI"],
      privateRepo: true,
      status: "completed",
      category: "academic"
    },

    // ── Desarrollo de videojuegos ──────────────────────────────────────────
    {
      slug: "encubierto",
      title: "Encubierto",
      tagline: "Juego narrativo de sigilo isométrico en 2D.",
      description:
        "Juego narrativo isométrico hecho en Unity a lo largo de una docena de escenas construidas a mano. Sistemas de diálogo propios por personaje y nivel, inventario con objetos usables, encuentros por trigger y zonas de sospecha, un sistema de ajustes persistente para audio y texto, y un flujo completo de menú a créditos.",
      role: "Proyecto en equipo",
      year: "2024",
      techStack: ["Unity", "C#", "Isométrico 2D", "Audio Mixer"],
      privateRepo: true,
      status: "completed",
      category: "game"
    },
    {
      slug: "garden-curse",
      title: "The Garden's Curse",
      tagline: "Juego en Unity con progresión por niveles.",
      description:
        "Juego en Unity construido alrededor de una secuencia de niveles con sus propios entornos, materiales y banda sonora, desde la escena inicial hasta los créditos. Un segundo intento en desarrollo de videojuegos después de Encubierto, enfocado en pulir el arte de entornos y el diseño de audio.",
      role: "Proyecto en equipo",
      year: "2025",
      techStack: ["Unity", "C#", "Diseño de Juegos"],
      privateRepo: true,
      status: "completed",
      category: "game"
    }
  ]
};
