export interface SocialNetwork {
  network: string;
  username: string;
  url: string;
}

export interface Education {
  institution: string;
  area: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface Skill {
  label: string;
  details: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
}

export interface CVData {
  name: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  socialNetworks: SocialNetwork[];
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Skill[];
}
