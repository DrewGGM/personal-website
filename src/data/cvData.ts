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
  summary: "Software engineer and founder of Lyroo S.A.S, a Colombian startup building LyrooPOS — an offline-first point of sale with an embedded DIAN electronic invoicing engine. Specialized in backend development and application architecture (Java/Spring Boot, Go, hexagonal architecture). Currently building core banking systems at COFINCAFE and full-stack client software at JAMS Technologies, while leading product and engineering at Lyroo. Strong foundation in QA, clean code and agile methodologies.",
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
      company: "Financiera Cofincafé (Cooperativa de Ahorro y Crédito)",
      position: "Junior Software Developer",
      startDate: "2026-08",
      endDate: "present",
      location: "Armenia, Quindio, Colombia",
      summary: "Hired into a permanent engineering role after the internship, continuing on the cooperative's core banking platform.",
      highlights: [
        "Developing and maintaining features on the Apache Fineract core banking system",
        "Supporting financial products and banking module configuration in production"
      ]
    },
    {
      company: "JAMS Technologies",
      position: "Full Stack Developer",
      startDate: "2026-04",
      endDate: "present",
      location: "Colombia · Remote",
      summary: "Building custom web and mobile software for clients at a Colombian development studio, from MVPs through to scalable enterprise platforms.",
      highlights: [
        "Developing full-stack features across the front end, API and database",
        "Delivering client projects to production against agreed scope and deadlines"
      ]
    },
    {
      company: "Financiera Cofincafé (Cooperativa de Ahorro y Crédito)",
      position: "Development Intern",
      startDate: "2026-01",
      endDate: "2026-07",
      location: "Armenia, Quindio, Colombia",
      summary: "Assisted in the development and support of the core banking system using Apache Fineract and Mifos.",
      highlights: [
        "Helped implement financial products and configure banking modules",
        "Resolved issues and contributed to system improvements",
        "Worked with the Apache Fineract and Mifos open-source banking platform"
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
        "Built LyrooPOS end-to-end: Go (Wails) backend with 31+ services + React 18 frontend over PostgreSQL — v1.2 in production, first active customers since July 2026",
        "Engineered an embedded DIAN e-invoicing core (UBL 2.1) — unlimited electronic invoicing without third-party APIs or per-folio costs",
        "Designed offline-first architecture: local data with AES-256 encrypted cloud backups, real-time kitchen/waiter apps via WebSocket, Bold payment terminals",
        "Lead product, engineering, sales and customer onboarding, including DIAN digital-certificate management for clients"
      ]
    }
  ],
  skills: [
    { label: "Languages", details: "Java, Go, TypeScript, Python, SQL" },
    { label: "Frameworks & Libraries", details: "Spring Boot, React, Node.js, Next.js, Angular, Wails, Selenium" },
    { label: "DevOps & Tools", details: "Git, Docker, Cloudflare (Pages/D1/R2), Scrum" },
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
  ventures: [
    {
      name: "Lyroo",
      tagline: "Software for Colombian SMBs",
      description:
        "The startup I founded and lead as principal engineer. Lyroo builds offline-first business software for Colombian SMBs, anchored on a DIAN electronic invoicing engine I wrote from scratch — so our products invoice without paying a third party per document. LyrooPOS is in production with paying customers; the rest of the product line is in active development.",
      url: "https://lyroo.com.co",
      role: "Founder & Lead Engineer",
      products: ["lyroo-pos", "dian-engine", "liria", "lyfin", "lydeck"]
    }
  ],
  projects: [
    // ── Lyroo (startup) ────────────────────────────────────────────────────
    {
      slug: "lyroo-pos",
      title: "LyrooPOS — Restaurant Point of Sale",
      tagline: "Offline-first desktop POS with embedded DIAN e-invoicing.",
      description:
        "Lyroo's flagship product: a desktop point of sale for Colombian restaurants, in production at v1.2 with paying customers since July 2026. Touchscreen sales, real-time kitchen and waiter apps over WebSocket, inventory with automatic deduction and split billing.",
      highlights: [
        "DIAN electronic invoicing embedded in the app itself — no third-party API, no per-document fee.",
        "Offline-first: it keeps selling with the internet down and syncs to the DIAN when the connection returns.",
        "Go (Wails) backend with 31+ services over PostgreSQL, Bold card terminals, and AI automation over MCP.",
      ],
      role: "Founder & Lead Engineer",
      year: "2025 — present",
      techStack: ["Go", "Wails", "React", "TypeScript", "PostgreSQL", "WebSocket"],
      links: [
        { label: "Live demo", url: "https://pos-system.v1.andrewgarcia.dev", kind: "demo" },
        { label: "Demo source", url: "https://github.com/DrewGGM/demo-pos-system", kind: "repo" }
      ],
      imageUrl: "/projects/pos-main.webp",
      images: [
        "/projects/pos-main.webp",
        "/projects/pos-dashboard.webp",
        "/projects/pos-products.webp"
      ],
      status: "completed",
      category: "startup",
      featured: true,
      inCv: true
    },
    {
      slug: "dian-engine",
      title: "Lyroo DIAN Engine",
      tagline: "Colombian e-invoicing as an embeddable Go library.",
      description:
        "The proprietary core behind every Lyroo product: UBL 2.1 XML for invoices, credit and debit notes, support documents, POS and payroll; XAdES-EPES signing with PKCS12 certificates; CUFE/CUDE/CUNE hashing; WS-Security SOAP transmission to the DIAN VPFE; and PDF rendering for both A4 and 80mm thermal. Embedded as plain Go calls rather than a separate API server to deploy.",
      role: "Sole author",
      year: "2026",
      techStack: ["Go", "UBL 2.1", "XAdES-EPES", "SOAP / WS-Security", "PKCS12"],
      privateRepo: true,
      status: "completed",
      category: "startup"
    },
    {
      slug: "liria",
      title: "Liria — Vertical micro-drama platform",
      tagline: "AI micro-dramas and webtoons for the Spanish-speaking market.",
      description:
        "A streaming platform for vertical micro-dramas (50–100 episodes of 1–2 minutes) and AI-assisted comics, with a co-creating community and radical-transparency monetization: coins that never expire, full price shown up front, server-side verified rewarded ads, and one-click VIP cancellation. Built on a double-entry, idempotent coin ledger with a three-way unlock gate (free / coins / ad).",
      role: "Founder & Lead Engineer",
      year: "2026",
      techStack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "React Native (Expo)", "React"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },
    {
      slug: "lyfin",
      title: "Lyfin — Personal finance for Colombia",
      tagline: "Local-first expenses, debts and budgets. Private by design.",
      description:
        "A personal finance app for Colombia — expenses, debts, budgets and payment reminders — across an Android (Kotlin/Compose) and a PWA (React/TS) client. Everything works offline and lives encrypted on the device. Money is integer minor units only (COP has no cents), and the two clients are kept in lockstep by shared golden vectors both test suites run in CI, since there is no shared KMP layer.",
      role: "Founder & Lead Engineer",
      year: "2026",
      techStack: ["Kotlin", "Jetpack Compose", "React", "TypeScript", "SQLCipher"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },
    {
      slug: "lydeck",
      title: "LyDeck — Control deck for coding agents",
      tagline: "An agent-neutral terminal, harness console and Git client.",
      description:
        "A GPU-rendered terminal that doubles as the control panel for the CLI coding agents you already use. Approvable diffs, live token and cost, MCP servers and permissions edited in a real UI that writes your CLI's own native config files, a lane-per-worktree visual Git client, and an embedded local model for offline command help. Agent-neutral by design: no account, no telemetry.",
      role: "Founder & Lead Engineer",
      year: "2026",
      techStack: ["Rust", "Tauri", "React", "TypeScript", "WebGPU"],
      privateRepo: true,
      status: "in-progress",
      category: "startup"
    },

    // ── Independent products & open source ─────────────────────────────────
    {
      slug: "ai-content-bot",
      title: "AI Content Bot",
      tagline: "Agent-agnostic content factory for social media.",
      description:
        "Generates reels, carousels, posts and code-rendered motion videos for any brand, driven by ANY coding agent (Claude Code, Codex, Gemini CLI, Cursor…) or any OpenAI-compatible LLM API, OpenRouter or Ollama.",
      highlights: [
        "An AI visual QA pass reviews every render and regenerates the frames that came out wrong.",
        "Human-in-the-loop approval panel as a PWA, so nothing publishes without a person signing off.",
        "Plans the next batch from what already shipped, then publishes to Meta in one click.",
      ],
      role: "Sole author",
      year: "2026",
      techStack: ["Node.js", "TypeScript", "AI Agents", "Remotion", "FFmpeg", "Cloudflare D1/R2"],
      links: [
        { label: "Live demo", url: "https://ai-content-bot-demo.andrewgarcia.dev", kind: "demo" },
        { label: "Source", url: "https://github.com/DrewGGM/ai-content-bot", kind: "repo" }
      ],
      imageUrl: "/projects/content-bot-panel.webp",
      images: [
        "/projects/content-bot-panel.webp",
        "/projects/content-bot-pieces.webp",
        "/projects/content-bot-generate.webp",
        "/projects/content-bot-mobile.webp"
      ],
      status: "completed",
      category: "product",
      featured: true,
      inCv: true
    },
    {
      slug: "project-blueprint",
      title: "Project Blueprint",
      tagline: "An agent skill that acts as your software architect.",
      description:
        "Turns a raw idea into a validated, code-ready blueprint before a line of code is written, through five gated phases: frame, discover, architect, harden, plan. Each phase has an exit gate, and the ceremony scales to the size of the work (Lite / Standard / Full). Portable across Claude Code, Cursor and the wider agent-skills ecosystem.",
      role: "Sole author",
      year: "2026",
      techStack: ["Agent Skills", "Markdown", "Software Architecture", "C4 / Mermaid"],
      links: [
        { label: "Source", url: "https://github.com/DrewGGM/project-blueprint-skill", kind: "repo" }
      ],
      status: "completed",
      category: "product"
    },
    {
      slug: "qr-permanente",
      title: "QR Permanente",
      tagline: "Artistic, permanent QR codes. No server, no expiry, no signup.",
      description:
        "A fully static QR generator with 10 preloaded templates (URL, restaurant menu, WiFi, vCard, payments, calendar events…), six dot styles, gradients, a logo embedded in the SVG rather than overlaid, and export to SVG, PNG, JPEG or WebP. Because nothing is stored server-side, the codes can never break or expire.",
      role: "Sole author",
      year: "2026",
      techStack: ["Astro", "Tailwind CSS v4", "TypeScript", "Cloudflare Pages"],
      links: [
        { label: "Live site", url: "https://qr.andrewgarcia.dev", kind: "site" },
        { label: "Source", url: "https://github.com/DrewGGM/QR-Generator", kind: "repo" }
      ],
      status: "completed",
      category: "product"
    },

    // ── Academic & earlier work ────────────────────────────────────────────
    {
      slug: "vetapp",
      title: "VetApp — Veterinary clinic management",
      tagline: "Spring Boot DDD API plus an Angular 19 client.",
      description:
        "Full-stack management system for veterinary clinics: owners and pets, appointments and medical consultations, vaccinations, treatments, and reminders. The API follows Domain-Driven Design across domain, application, infrastructure and interface layers, with MapStruct mapping and OpenAPI docs; the client is an Angular 19 SPA with Tailwind.",
      role: "University project",
      year: "2025",
      techStack: ["Java 17", "Spring Boot 3.4", "DDD", "MySQL", "Angular 19", "Tailwind"],
      links: [
        { label: "API", url: "https://github.com/DrewGGM/Proyecto-AppsEmpresariales-VetApi", kind: "repo" },
        { label: "Web app", url: "https://github.com/DrewGGM/Proyecto-AppsEmpresariales-VetApp", kind: "repo" }
      ],
      status: "completed",
      category: "academic",
      inCv: true
    },
    {
      slug: "airbnb-clone",
      title: "Airbnb-style booking platform",
      tagline: "NestJS + Prisma API with a Vue 3 front end.",
      description:
        "A property rental platform covering the full booking flow: JWT authentication with role-based access, property listings with images and amenities, availability and reservations. The API is NestJS with Prisma over MySQL and cache-manager; the client is Vue 3 with Pinia stores, Vue Router and Playwright end-to-end tests.",
      role: "University project",
      year: "2024",
      techStack: ["NestJS", "Prisma", "MySQL", "Vue 3", "Pinia", "Playwright"],
      links: [
        { label: "Source (API + web)", url: "https://github.com/DrewGGM/AirBNB-PW", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "unilocal",
      title: "UniLocal — Discover local businesses",
      tagline: "Android app with maps, reviews and a moderation flow.",
      description:
        "A Jetpack Compose app for finding and rating nearby shops, restaurants and services. Interactive Mapbox map with category filters, place creation with photos and schedules, reviews, favourites, and a moderator role with an approval queue and statistics. Firebase Auth and Firestore for the backend, Cloudinary for image uploads, full Material 3 light and dark themes.",
      role: "Solo build, from a team course project",
      year: "2025",
      techStack: ["Kotlin", "Jetpack Compose", "MVVM", "Firebase", "Mapbox", "Cloudinary"],
      links: [
        { label: "Source", url: "https://github.com/DrewGGM/UniLocal", kind: "repo" },
        { label: "Course version", url: "https://github.com/DrewGGM/ProyectoFinal-UniLocal-AppsMoviles", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "bondbox",
      title: "BondBox — Collaborative family organizer",
      tagline: "Shared tasks, inventory and finances for a household.",
      description:
        "A web platform for families to organize together: tasks and calendar, shared inventory, group communication and household finances. Built by a team of four; I owned the Bondy AI assistant and the finance module. React 18 with Zustand, React Hook Form and Zod validation, tested with Vitest and shipped in Docker behind nginx.",
      role: "Team of 4 · AI & Finance modules",
      year: "2025",
      techStack: ["React 18", "TypeScript", "Zustand", "Zod", "Vitest", "Docker"],
      links: [
        { label: "Front-end source", url: "https://github.com/DrewGGM/bondbox-frontend", kind: "repo" }
      ],
      status: "completed",
      category: "academic"
    },
    {
      slug: "apitravel",
      title: "ApiTravel — Travel booking API",
      tagline: "Spring Boot REST API structured with DDD.",
      description:
        "A REST API for browsing and booking travel packages, covering customers, trips, day-by-day itineraries and reservations. Domain-Driven Design splits domain, persistence and web layers; business rules such as unique emails and valid date ranges are enforced in the domain and covered by unit tests, with the surface documented via OpenAPI.",
      role: "University project",
      year: "2025",
      techStack: ["Java", "Spring Boot", "DDD", "JPA", "OpenAPI"],
      privateRepo: true,
      status: "completed",
      category: "academic"
    },

    // ── Game development ───────────────────────────────────────────────────
    {
      slug: "fuse",
      title: "Fuse — Daily chain reaction",
      tagline: "One board a day, the same one for everyone, playable with no signal.",
      description:
        "A daily chain-reaction puzzle: place five pieces, release a spark, and watch it bounce and light the board. Everyone gets the same board because it is derived from the date, so there is nothing to fetch before you can play. No engine and no game framework — a canvas, and rules that live in a pure simulation module with no DOM, no network and no clock in it.",
      highlights: [
        "That same module runs again inside the Cloudflare Worker: every submitted score is replayed server-side, so a forged one comes back as a mismatch and never reaches the board.",
        "An installable PWA that plays a full game offline, and the same core packaged for Android through Capacitor.",
        "Close to 300 unit tests and 58 end-to-end. Attacking my own deployment exposed a race in the daily attempt limit — now enforced inside the INSERT itself, where it cannot be raced.",
      ],
      role: "Sole author",
      year: "2026",
      techStack: [
        "TypeScript",
        "Canvas 2D",
        "Cloudflare Workers",
        "D1",
        "PWA",
        "Capacitor",
        "Playwright"
      ],
      links: [
        { label: "Play now", url: "https://fuse.andrewgarcia.dev", kind: "site" },
        { label: "Web source", url: "https://github.com/DrewGGM/fuse-web", kind: "repo" },
        { label: "Android source", url: "https://github.com/DrewGGM/fuse-game", kind: "repo" }
      ],
      imageUrl: "/projects/fuse-cadena.webp",
      images: [
        "/projects/fuse-cadena.webp",
        "/projects/fuse-inicio.webp",
        "/projects/fuse-tablero.webp",
        "/projects/fuse-resultado.webp"
      ],
      status: "completed",
      category: "game",
      featured: true
    },
    {
      slug: "rummikub",
      title: "Rummikub — Real-time multiplayer",
      tagline: "2–8 player Rummikub on Cloudflare Workers, free to run.",
      description:
        "Open it with a link and play from any phone, 2 to 8 players, running entirely on Cloudflare's free tier. One Durable Object per room holds the game and its WebSockets, and the Hibernation API means an idle table costs nothing. The rules live in a pure engine with no React, no network and no clock in it.",
      highlights: [
        "The server re-validates every proposed board — tile conservation as multiset equality — so editing the browser's JavaScript gets you nowhere.",
        "Tiles shrink and reflow so the board never scrolls, and a long press lifts a whole run at once.",
        "236 unit tests plus bots that play full games against each other. Production taught me that a Durable Object alarm scheduled in the past re-fires immediately — that loop ate a day's quota in under an hour.",
      ],
      role: "Sole author",
      year: "2026",
      techStack: [
        "Cloudflare Workers",
        "Durable Objects",
        "WebSocket",
        "React",
        "TypeScript",
        "Playwright"
      ],
      links: [
        { label: "Play now", url: "https://rummikub.andrewgarcia.dev", kind: "site" },
        { label: "Source", url: "https://github.com/DrewGGM/lyroo-rummikub", kind: "repo" }
      ],
      imageUrl: "/projects/rummikub-mesa.webp",
      images: [
        "/projects/rummikub-mesa.webp",
        "/projects/rummikub-sala.webp",
        "/projects/rummikub-movil.webp"
      ],
      status: "completed",
      category: "game",
      featured: true
    },
    {
      slug: "encubierto",
      title: "Encubierto",
      tagline: "2D isometric narrative stealth game.",
      description:
        "A story-driven isometric game built in Unity across a dozen hand-built scenes. Custom dialogue systems per character and level, an inventory with usable items, trigger-based encounters and suspicion zones, a persistent settings system for audio and text, and a full menu-to-credits flow.",
      role: "Team project",
      year: "2024",
      techStack: ["Unity", "C#", "2D Isometric", "Audio Mixer"],
      privateRepo: true,
      status: "completed",
      category: "game"
    },
    {
      slug: "garden-curse",
      title: "The Garden's Curse",
      tagline: "Unity game with a level-based progression.",
      description:
        "A Unity game built around a sequence of levels with their own environments, materials and soundtrack, from an opening scene through to credits. A second run at game development after Encubierto, focused on tightening the environment art and audio design.",
      role: "Team project",
      year: "2025",
      techStack: ["Unity", "C#", "Game Design"],
      privateRepo: true,
      status: "completed",
      category: "game"
    }
  ]
};
