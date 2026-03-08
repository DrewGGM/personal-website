import type { CVData } from '../types';

export const cvData: CVData = {
  name: "Andrew Garcia Mosquera",
  headline: "Software Engineering Student",
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
  summary: "Software Engineering student specializing in backend development and application architecture. Proficient in Java, Spring Boot, and API development with hexagonal architecture. Currently contributing to core banking systems at COFINCAFE and developing production-ready management systems. Seeking opportunities to contribute to software development teams with strong technical skills and agile methodologies expertise.",
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
      company: "La Lechona del Parque S.A.S",
      position: "Freelance Software Developer",
      startDate: "2025-05",
      endDate: "2025-12",
      location: "Armenia, Quindio, Colombia",
      summary: "Designed and developed a custom POS system to streamline business operations, including sales management, inventory control, and electronic invoicing integration in compliance with local regulations.",
      highlights: [
        "Built a full-stack POS system covering sales workflows, inventory tracking, and reporting",
        "Integrated electronic invoicing in compliance with Colombian DIAN regulations",
        "Delivered the project end-to-end, from requirements gathering to production deployment"
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
      title: "Restaurant Management System",
      description: "Custom POS system built for La Lechona del Parque S.A.S, covering sales management, inventory control, and electronic invoicing in compliance with Colombian DIAN regulations.",
      techStack: ["Java", "Spring Boot", "SQL", "Angular"],
      status: "completed"
    },
    {
      title: "Coming Soon",
      description: "New projects are in development. Stay tuned for updates!",
      techStack: [],
      status: "coming-soon"
    },
    {
      title: "Coming Soon",
      description: "More exciting projects on the way. Check back soon!",
      techStack: [],
      status: "coming-soon"
    }
  ]
};
