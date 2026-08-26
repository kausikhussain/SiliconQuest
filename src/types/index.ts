export interface ClubEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  edition: string;
  category: 'Flagship League' | 'National Championship' | 'Aptitude Challenge' | 'Intra-University' | 'Special Edition';
  location: string;
  venue: string;
  description: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'archived';
  highlights: string[];
  podium?: {
    first: string;
    second: string;
    third: string;
  };
  registrationOpen: boolean;
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
