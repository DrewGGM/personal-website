# Andrew Garcia Mosquera - Portfolio

Professional portfolio website showcasing my experience, skills, and certifications as a Software Engineering Student specializing in backend development.

## Features

- 📱 Fully responsive design
- 🎨 Modern and clean UI
- 📄 Downloadable CV
- 🎓 Interactive certifications showcase
- 🖼️ Profile photo display
- 🔗 Social media links (LinkedIn, GitHub)
- ⚡ Fast loading with Vite

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS variables
- **Netlify** - Deployment platform

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Header with profile and contact info
│   ├── About.tsx       # About section
│   ├── Experience.tsx  # Work experience
│   ├── Education.tsx   # Education history
│   ├── Skills.tsx      # Technical skills
│   ├── Certifications.tsx  # Certifications with view buttons
│   └── Languages.tsx   # Language proficiency
├── data/
│   └── cvData.ts       # Portfolio data
├── types/
│   └── index.ts        # TypeScript interfaces
├── App.tsx             # Main app component
├── index.css           # Global styles
└── main.tsx            # App entry point

public/
├── profile.jpg         # Profile photo
├── Andrew_Garcia_Mosquera_CV.pdf  # CV file
└── certificates/       # Certification PDFs
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/DrewGGM/personal-website-react.git
cd personal-website-react
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains all necessary build settings.

### Deploy to Netlify

1. Connect your Git repository to Netlify
2. Netlify will automatically detect the build settings from `netlify.toml`
3. Push your changes to trigger automatic deployment

### Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Sections

- **Header** - Profile photo, name, title, location, and contact information
- **About** - Professional summary
- **Experience** - Work history with dates and descriptions
- **Education** - Academic background and bootcamps
- **Skills** - Technical skills organized by category
- **Certifications** - Certificates with downloadable PDFs
- **Languages** - Language proficiency levels

## Certifications

Current certifications with view/download capability:
- Spring Boot: Backend Enterprise Professional Certificate - Dev Senior Code
- QA Engineer Bootcamp - TripleTen LatAm
- Scrum Fundamentals Certified (SFC) - VMEdu inc
- Desarrollo Web y UX/UI - Next U

## Contact

- **Email:** contact@andrewgarcia.dev
- **LinkedIn:** [andrewgarciam](https://linkedin.com/in/andrewgarciam)
- **GitHub:** [DrewGGM](https://github.com/DrewGGM)
- **Website:** [andrewgarcia.dev](https://andrewgarcia.dev)

## License

This project is personal portfolio website. Feel free to use it as inspiration for your own portfolio.
