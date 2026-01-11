import type { CVData } from '../types';

export const cvData: CVData = {
  name: "Andrew Garcia Mosquera",
  headline: "Software Engineering Student",
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
  summary: "Software Engineering student specializing in backend development and application architecture. Proficient in Java, Spring Boot, and API development with hexagonal architecture. Currently developing production-ready management systems. Seeking opportunities to contribute to software development teams with strong technical skills and agile methodologies expertise.",
  education: [
    {
      institution: "Institución Universitaria EAM",
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
      company: "La Lechona del Parque S.A.S",
      position: "Freelance Software Developer",
      startDate: "2025-01",
      endDate: "present",
      location: "Armenia, Quindío, Colombia",
      summary: "Development of a custom software management system to support the company's operations",
      highlights: [
        "Project delivered in July 2025, currently providing ongoing support for bug fixes and system improvement updates"
      ]
    }
  ],
  skills: [
    {
      label: "Languages",
      details: "Java, Python, Go, SQL"
    },
    {
      label: "Frameworks & Libraries",
      details: "Spring Boot, Angular, Selenium"
    },
    {
      label: "DevOps & Tools",
      details: "Git, Docker, Scrum"
    },
    {
      label: "Software Engineering",
      details: "OOP, Design patterns, Data structures, Clean Code, Hexagonal Architecture, Microservices"
    },
    {
      label: "Areas of expertise",
      details: "Backend and frontend development, Software architecture, QA, Usability"
    }
  ],
  certifications: [
    {
      title: "Spring Boot: Backend Enterprise Professional Certificate",
      issuer: "Dev Senior Code",
      date: "Dec 2025",
      certificateUrl: "/certificates/devseniorcode%20springboot.pdf"
    },
    {
      title: "QA Engineer Bootcamp",
      issuer: "TripleTen LatAm",
      date: "Dec 2024 - Jun 2025",
      certificateUrl: "/certificates/QAEngineer%20Tripleten.pdf"
    },
    {
      title: "Scrum Fundamentals Certified (SFC)",
      issuer: "VMEdu inc",
      date: "Feb 2024",
      certificateUrl: "/certificates/scrumcertified.pdf"
    },
    {
      title: "Desarrollo Web y UX/UI",
      issuer: "Next U",
      date: "Feb 2022",
      certificateUrl: "/certificates/nextU-DesarrolloWeb%20UXUI.pdf"
    },
    {
      title: "DevOps, APIs and Microservices Architecture Fundamentals",
      issuer: "Udemy",
      date: "Feb 2025"
    },
    {
      title: "Angular",
      issuer: "Edutin Academy",
      date: "Mar 2025"
    },
    {
      title: "Spring Framework",
      issuer: "Udemy",
      date: "May 2025"
    }
  ],
  languages: [
    {
      label: "Spanish",
      details: "Native"
    },
    {
      label: "English",
      details: "Professional"
    }
  ]
};
