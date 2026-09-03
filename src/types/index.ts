export interface ClubEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  isoDate?: string;
  year: number;
  edition?: string;
  category: string;
  location: string;
  venue: string;
  description: string;
  shortDescription: string;
  image: string;
  status: 'UPCOMING' | 'COMPLETED' | 'upcoming' | 'archived';
  highlights?: string[];
  podium?: {
    first: string;
    second: string;
    third: string;
  };
  registrationOpen?: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'championship' | 'live-stage' | 'prelims' | 'audience';
  categoryLabel: string;
  src: string;
  caption: string;
  date: string;
  location: string;
  featured?: boolean;
}




export interface KnowledgeResource {
  id: string;
  title: string;
  category: 'Quizmaster Blueprints' | 'Speed Aptitude' | 'Trivia Archives' | 'Live Platform Setup';
  readTime: string;
  description: string;
  format: 'PDF Guide' | 'Curated Bank' | 'Protocol';
  tags: string[];
  downloadName: string;
}

export type OfficialDesignation =
  | 'FIC · QUIZ CLUB'
  | 'SECRETARY · QUIZ CLUB'
  | 'JOINT SECRETARY · QUIZ CLUB'
  | 'SENIOR COORDINATOR'
  | 'COORDINATOR';

export interface ClubMember {
  id: string;
  name: string;
  designation: OfficialDesignation;
  tier: 'fic' | 'secretary' | 'joint_secretary' | 'senior_coordinator' | 'coordinator';
  image: string;
  bio?: string;
  department?: string;
  badge?: string;
}

export interface TeamProfile {
  id: string;
  name: string;
  role: string;
  title: string;
  specialty: string[];
  bio: string;
  image: string;
  socials?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}
