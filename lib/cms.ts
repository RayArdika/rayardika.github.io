import fs from "node:fs/promises";
import path from "node:path";

export interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}

export interface ProfileData {
  name: string;
  displayTitle: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  cvPath: string;
  heroSummary: string;
  heroHighlight: string;
  aboutHeading: string;
  aboutDescription: string;
  heroBackgroundVideo?: string;
  heroBackgroundImage?: string;
  avatarImage?: string;
  stats: StatItem[];
}

export interface FeaturedProjectItem {
  id: string;
  title: string;
  client: string;
  period: string;
  status: string;
  category: string;
  summary: string;
  highlights: string[];
  stack: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  featuredOrder: number;
}

export interface FeaturedProjectsData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: FeaturedProjectItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  client: string;
  period: string;
  status: string;
  category: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface ProjectsData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: ProjectItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: string;
  bullets: string[];
  stack: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  gpa: string;
  period: string;
  notes: string;
}

export interface ExperienceData {
  sectionTitle: string;
  sectionSubtitle: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFile?: string;
  description: string;
}

export interface CertificationsData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: CertificationItem[];
}

export interface ServiceCapabilityItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  codePreview: string;
}

export interface SkillGroupItem {
  category: string;
  skills: string[];
}

export interface CapabilitiesData {
  sectionTitle: string;
  sectionSubtitle: string;
  services: ServiceCapabilityItem[];
  skillGroups: SkillGroupItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: FaqItem[];
}

export interface PortfolioCMSData {
  profile: ProfileData;
  featuredProjects: FeaturedProjectsData;
  projects: ProjectsData;
  experience: ExperienceData;
  certifications: CertificationsData;
  capabilities: CapabilitiesData;
  faq: FaqData;
}

async function readContentFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(process.cwd(), "content", fileName);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getPortfolioCMSData(): Promise<PortfolioCMSData> {
  const [
    profile,
    featuredProjects,
    projects,
    experience,
    certifications,
    capabilities,
    faq,
  ] = await Promise.all([
    readContentFile<ProfileData>("profile.json"),
    readContentFile<FeaturedProjectsData>("featured-projects.json"),
    readContentFile<ProjectsData>("projects.json"),
    readContentFile<ExperienceData>("experience.json"),
    readContentFile<CertificationsData>("certifications.json"),
    readContentFile<CapabilitiesData>("capabilities.json"),
    readContentFile<FaqData>("faq.json"),
  ]);

  return {
    profile,
    featuredProjects,
    projects,
    experience,
    certifications,
    capabilities,
    faq,
  };
}

