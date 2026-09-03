import { ClubEvent, GalleryPhoto, KnowledgeResource, TeamProfile, ClubMember } from '../types';

export const CLUB_INFO = {
  name: 'SILICON QUIZ CLUB',
  shortName: 'SQC',
  tagline: 'WHERE CURIOSITY MEETS COMPETITION',
  institution: 'Silicon Institute of Technology, Sambalpur, Odisha',
  motto: 'LESS · BETTER · BOLDER · SMARTER',
  established: '2018',
  description: 'The premier intellectual society and high-velocity competitive quiz syndicate of Silicon Institute of Technology, Sambalpur, Odisha. We cultivate analytical agility, multidisciplinary lateral thinking, and competitive excellence through arena-scale championships and razor-sharp knowledge sessions.',
  manifesto: [
    {
      title: 'THE PURSUIT OF UNKNOWN',
      text: 'Quiz is not rote memorization. It is the art of connecting isolated vertices of science, history, pop culture, and logic at lightning speed.'
    },
    {
      title: 'PRESSURE MAKES PRECISION',
      text: 'When the timer ticks down from ten seconds and an auditorium of 200 minds waits in silence, only structured deduction survives.'
    },
    {
      title: 'AN INTELLECTUAL BROTHERHOOD',
      text: 'From first-year prelims in lecture halls to inter-collegiate national finals, we build a community that celebrates curiosity over conformity.'
    }
  ],
  stats: [
    { label: 'Live Arena Quizzes', value: '48+' },
    { label: 'Active Quizzers', value: '350+' },
    { label: 'Championship Trophies', value: '18+' },
    { label: 'Collegiate Reach', value: '12+ Institutes' }
  ]
};

export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: 'brainblast-2026',
    title: 'BRAINBLAST 2026',
    subtitle: 'The Ultimate Inter-College Quiz Challenge',
    edition: 'Edition VII',
    date: 'OCTOBER 24, 2026',
    category: 'Flagship League',
    location: 'Silicon Sambalpur Auditorium & Virtual Slido Arena',
    venue: 'Main Academic Block, Silicon Campus',
    description: 'The flagship annual multi-tier championship bringing together the sharpest minds across Eastern India. Multi-round elimination: Rapid Fire, Audio-Visual Clues, Lateral Connects, and high-stakes Buzzer Final.',
    shortDescription: 'Flagship inter-collegiate championship with multi-round elimination and live buzzer finals.',
    image: '/assets/images/WhatsApp Image 2026-08-23 at 12.44.33 AM (1).jpeg',
    status: 'upcoming',
    registrationOpen: true,
    highlights: [
      '3-Tier Elimination: Written Prelims → Semi-Finals → Main Stage Final',
      'Instant Live Audience & Team Telemetry powered by Slido',
      'Domains: Tech & AI, Sci-Astronomy, Geo-History, Pop Connects, Math Aptitude',
      'Exclusive Silicon Quiz Club Trophy & Merit Certificates'
    ],
    podium: {
      first: 'TBA — Open Registrations',
      second: 'TBA — Open Registrations',
      third: 'TBA — Open Registrations'
    }
  },
  {
    id: 'college-quiz-league',
    title: 'COLLEGE QUIZ LEAGUE',
    subtitle: 'Think Fast. Answer Quicker.',
    edition: 'Winter League Season 4',
    date: 'ARCHIVED · FEB 2025',
    category: 'National Championship',
    location: 'Auditorium Hall, Silicon Institute of Technology, Sambalpur',
    venue: 'Stage One Arena',
    description: 'An adrenaline-fueled speed league featuring 20 live interactive rounds, real-time Slido telemetry, and high-pressure buzzer tiebreakers witnessed by a packed auditorium.',
    shortDescription: 'Speed league with 20 live rounds, real-time scoring, and packed-house buzzer finals.',
    image: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.13 AM.jpeg',
    status: 'archived',
    registrationOpen: false,
    highlights: [
      '20 Live Interactive Rounds with Real-Time Scoreboard',
      'Over 40 participating two-member syndicates',
      'High-decibel tiebreaker buzzer rounds'
    ],
    podium: {
      first: 'Priyabrata Pal & Ayush Jena',
      second: 'Sanya Sonalika & Saundarya Sinha',
      third: 'Satyam Chandra Nath & ARYAN DEO'
    }
  },
  {
    id: 'ast-challenge-2025',
    title: 'AST-2025 QUIZ CHALLENGE',
    subtitle: 'Applied Science & Technology Invitational',
    edition: '2025 Annual',
    date: 'ARCHIVED · NOV 2025',
    category: 'Aptitude Challenge',
    location: 'Lecture Hall 04, Silicon Institute of Technology',
    venue: 'LH-04',
    description: 'Faculty-supervised analytical invitational testing mathematical shortcuts, astronomical anomalies, and deep tech fundamentals through rigorous pen-and-paper screening.',
    shortDescription: 'Analytical invitational with pen-and-paper screening and faculty-supervised jury.',
    image: '/assets/images/WhatsApp Image 2026-08-23 at 12.44.32 AM.jpeg',
    status: 'archived',
    registrationOpen: false,
    highlights: [
      'Rigorous pen-and-paper preliminary screening',
      'Faculty-supervised jury and certificate commendation',
      'Analytical aptitude and clock mechanics special segment'
    ],
    podium: {
      first: 'K. Bharat & Asish Patra',
      second: 'Om Prakash Dash & Tanisha Pattnaik',
      third: 'Jane Eric Barla & Rahul Raj'
    }
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-01',
    title: 'Gold Champions Trophy Presentation',
    category: 'championship',
    categoryLabel: 'Championship Podium',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.08 AM.jpeg',
    caption: 'Faculty advisor conferring the 1st Place Trophy to the winners of the College Quiz League after a grueling 20-round final.',
    date: 'College Quiz League Finals',
    location: 'Main Auditorium',
    featured: true
  },
  {
    id: 'gal-02',
    title: 'Slido Arena Live Telemetry & Participant Grid',
    category: 'live-stage',
    categoryLabel: 'Live Stage Console',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.13 AM.jpeg',
    caption: 'Quizmasters moderating the digital room #2229 510 with live audience responses streaming onto the 4K projection display.',
    date: 'Live Interactive Session',
    location: 'Central Stage',
    featured: true
  },
  {
    id: 'gal-03',
    title: 'Brainblast 2025 Official Syndicate & Faculty Group',
    category: 'championship',
    categoryLabel: 'Championship Archives',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.44.33 AM (1).jpeg',
    caption: 'Official delegation and finalists of BRAINBLAST 2025 at Silicon Institute of Technology, Sambalpur.',
    date: '29 Nov 2025',
    location: 'Silicon Sambalpur',
    featured: true
  },
  {
    id: 'gal-04',
    title: 'Visual Connect Round: Iconic Clues',
    category: 'live-stage',
    categoryLabel: 'Interactive Round',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.14 AM (1).jpeg',
    caption: 'Stage moderators presenting the infamous Oreo vs Biscuit visual connect riddle as tension mounted in the arena.',
    date: 'Flagship Finals',
    location: 'Auditorium Stage'
  },
  {
    id: 'gal-05',
    title: 'Silver Runners-Up Trophy Conferral',
    category: 'championship',
    categoryLabel: 'Championship Podium',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.14 AM.jpeg',
    caption: 'Distinguished faculty member awarding the 2nd Place Trophy to the runners-up syndicate.',
    date: 'Championship Ceremony',
    location: 'Main Stage'
  },
  {
    id: 'gal-06',
    title: 'Bronze 3rd Place Trophy Presentation',
    category: 'championship',
    categoryLabel: 'Championship Podium',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.09 AM.jpeg',
    caption: '3rd Place laureates receiving their honors with "Think Fast. Answer Quicker" displayed on the auditorium backdrop.',
    date: 'Championship Ceremony',
    location: 'Main Stage'
  },
  {
    id: 'gal-07',
    title: 'Astronomical Rotation & Planetary Physics Round',
    category: 'live-stage',
    categoryLabel: 'Live Round',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.12 AM.jpeg',
    caption: 'Question 7/20 on retrograde planetary motion (Venus) displayed during the rapid-fire qualifier.',
    date: 'Live League Round',
    location: 'Silicon Stage'
  },
  {
    id: 'gal-08',
    title: 'Live Team Consultation & Answering under the Spotlight',
    category: 'audience',
    categoryLabel: 'Arena Atmosphere',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.11 AM.jpeg',
    caption: 'Finalists conferring rapidly before delivering their answer directly into the handheld microphone.',
    date: 'Auditorium Arena',
    location: 'Silicon Auditorium'
  },
  {
    id: 'gal-09',
    title: 'Clock Mechanics & Mathematical Aptitude Riddle',
    category: 'live-stage',
    categoryLabel: 'Live Round',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.41.37 AM.jpeg',
    caption: 'Full auditorium view as a participant stands to answer the clock hand coincidence problem.',
    date: 'Inter-Department Qualifier',
    location: 'Silicon Hall'
  },
  {
    id: 'gal-10',
    title: 'AST-2025 Certificate of Merit Conferral',
    category: 'championship',
    categoryLabel: 'Academic Laurels',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.44.32 AM.jpeg',
    caption: 'Merit certificate presentation for exceptional analytical problem solving during AST-2025.',
    date: 'AST 2025 Ceremony',
    location: 'Lecture Hall'
  },
  {
    id: 'gal-11',
    title: 'Pen & Paper Preliminary Screening Round',
    category: 'prelims',
    categoryLabel: 'Classroom Prelims',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.44.34 AM.jpeg',
    caption: 'The intense preliminary filter round where hundreds of aspirant quizzers battle for the 6 top stage seats.',
    date: 'Prelim Intake',
    location: 'Gallery Lecture Hall'
  },
  {
    id: 'gal-12',
    title: 'Silicon Institute of Technology Official Podium Address',
    category: 'live-stage',
    categoryLabel: 'Stage Master',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.49.07 AM.jpeg',
    caption: 'Chief Quizmaster welcoming the audience and setting the ground rules for the College Quiz League.',
    date: 'Opening Ceremony',
    location: 'Main Auditorium'
  },
  {
    id: 'gal-13',
    title: 'Live Slido Console & QR Code Registration',
    category: 'live-stage',
    categoryLabel: 'Tech Operations',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.49.25 AM.jpeg',
    caption: 'Audience member scanning the real-time QR code to participate in audience spot prizes.',
    date: 'Live Interaction',
    location: 'Stage Console'
  },
  {
    id: 'gal-14',
    title: 'Faculty Mentors & Packed Audience Section',
    category: 'audience',
    categoryLabel: 'Audience & Mentors',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.16 AM.jpeg',
    caption: 'Distinguished professors and enthralled students filling the tiers of the auditorium during finals.',
    date: 'Championship Day',
    location: 'Auditorium Gallery'
  },
  {
    id: 'gal-15',
    title: 'Geopolitical Trivia & Instant Reveal',
    category: 'live-stage',
    categoryLabel: 'Live Round',
    src: '/assets/images/WhatsApp Image 2026-08-23 at 12.39.10 AM.jpeg',
    caption: 'Answer reveal slide on screen confirming Uruguay after tense 30-second team countdown.',
    date: 'College Quiz League',
    location: 'Silicon Stage'
  }
];


export const KNOWLEDGE_RESOURCES: KnowledgeResource[] = [
  {
    id: 'res-1',
    title: 'The Lateral Connect: High-Velocity Question Architecture',
    category: 'Quizmaster Blueprints',
    readTime: '12 min study',
    description: 'Master framework used by Silicon Quiz Club quizmasters to construct four-clue interconnected trivia grids and avoid dead-end knowledge bottlenecks.',
    format: 'PDF Guide',
    tags: ['Question Setting', 'Visual Connects', 'Curiosity Engineering'],
    downloadName: 'SQC_Lateral_Connect_Masterclass.pdf'
  },
  {
    id: 'res-2',
    title: 'Clock Angles & Rapid Modular Aptitude Formulae',
    category: 'Speed Aptitude',
    readTime: '8 min study',
    description: 'Direct mathematical derivations for clock coincidences, percentage splits, calendar dates, and speed-distance shortcuts used in competitive prelims.',
    format: 'Curated Bank',
    tags: ['Aptitude', 'Mental Math', 'Clock Mechanics'],
    downloadName: 'SQC_Speed_Aptitude_Protocols.pdf'
  },
  {
    id: 'res-3',
    title: 'The Retrograde Cosmos: 100 Astronomy Trivia Anomalies',
    category: 'Trivia Archives',
    readTime: '15 min study',
    description: 'A deep-dive question repository covering retrograde planetary physics, astronomical milestones, Lagrange points, and deep space exploration.',
    format: 'Curated Bank',
    tags: ['Astronomy', 'Space Science', 'Anomalies'],
    downloadName: 'SQC_Astronomy_DeepBank_2025.pdf'
  },
  {
    id: 'res-4',
    title: 'Live Arena Infrastructure: Slido & Buzzer System Ops',
    category: 'Live Platform Setup',
    readTime: '6 min study',
    description: 'Technical walkthrough on orchestrating latency-free live auditorium quiz rounds with simultaneous audience smartphone interactions.',
    format: 'Protocol',
    tags: ['Tech Operations', 'Slido Live', 'Hardware Buzzers'],
    downloadName: 'SQC_Arena_Technical_Operations.pdf'
  }
];

export const CLUB_MEMBERS: ClubMember[] = [
  // TIER 01 — FACULTY / FIC
  {
    id: 'fic-padhi',
    name: 'Dr. Chinmayee Padhi',
    designation: 'FIC · QUIZ CLUB',
    tier: 'fic',
    image: '/assets/images/Members/Dr. Chinmayee Padhi.png',
    bio: 'Faculty-in-Charge guiding the intellectual mission, institutional governance, and academic excellence of Silicon Quiz Club at Silicon Institute of Technology.',
    department: 'Faculty-in-Charge · Silicon Institute of Technology'
  },

  // TIER 02 — SECRETARY
  {
    id: 'sec-kausik',
    name: 'Kausik Hussain',
    designation: 'SECRETARY · QUIZ CLUB',
    tier: 'secretary',
    image: '/assets/images/Members/Kausik Hussain.png',
    bio: 'Chief student executive spearheading tournament architecture, collegiate syndicate representation, and inter-institutional championship coordination.'
  },

  // TIER 03 — JOINT SECRETARY
  {
    id: 'jsec-rupesh',
    name: 'Rupesh Sahu',
    designation: 'JOINT SECRETARY · QUIZ CLUB',
    tier: 'joint_secretary',
    image: '/assets/images/Members/Rupesh Sahu.jpeg',
    bio: 'Co-directing stage operations, real-time arena telemetry, and high-velocity syndicate coordination across collegiate championships.'
  },

  // TIER 04 — SENIOR COORDINATORS
  {
    id: 'snr-sourav',
    name: 'Sourav',
    designation: 'SENIOR COORDINATOR',
    tier: 'senior_coordinator',
    image: '/assets/images/Members/Sourav.jpeg'
  },
  {
    id: 'snr-saurav-kr',
    name: 'Saurav Kumar',
    designation: 'SENIOR COORDINATOR',
    tier: 'senior_coordinator',
    image: '/assets/images/Members/Saurav Kumar.jpeg'
  },
  {
    id: 'snr-ujjwal',
    name: 'Ujjwal',
    designation: 'SENIOR COORDINATOR',
    tier: 'senior_coordinator',
    image: '/assets/images/Members/Ujjwal Kumar Pandey.png'
  },
  {
    id: 'snr-sneha',
    name: 'Sneha',
    designation: 'SENIOR COORDINATOR',
    tier: 'senior_coordinator',
    image: '/assets/images/Members/Sneha Rout Ray.jpeg'
  },
  {
    id: 'snr-aakriti',
    name: 'Aakriti',
    designation: 'SENIOR COORDINATOR',
    tier: 'senior_coordinator',
    image: '/assets/images/Members/Aakriti Priya Pandit.png'
  },

  // TIER 05 & 06 — COORDINATORS
  {
    id: 'coord-rakesh',
    name: 'Rakesh',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Rakesh barik.jpeg'
  },
  {
    id: 'coord-baishnavi',
    name: 'Baishnavi',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Baishnabi Bidyadhar.jpeg'
  },
  {
    id: 'coord-rahul',
    name: 'Rahul',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Rahul Pattnaik.jpeg'
  },
  {
    id: 'coord-ankita',
    name: 'Ankita Naik',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Ankita Naik.jpeg'
  },
  {
    id: 'coord-anshuman',
    name: 'Anshuman Choudhury',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Anshuman Choudhury.jpeg'
  },
  {
    id: 'coord-haripriya',
    name: 'Haripriya Meher',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Haripriya meher.jpeg'
  },
  {
    id: 'coord-krishna',
    name: 'Krishna Sahoo',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Krishna Sahoo.jpeg'
  },
  {
    id: 'coord-smruti',
    name: 'Smruti Ranjan Rout',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/SMRUTI RANJAN ROUT.jpeg'
  },
  {
    id: 'coord-shivam',
    name: 'Shivam Kumar Padhi',
    designation: 'COORDINATOR',
    tier: 'coordinator',
    image: '/assets/images/Members/Shivam Kumar phadhi.png'
  }
];

export const TEAM_PROFILES: TeamProfile[] = [
  {
    id: 'fic-padhi',
    name: 'Dr. Chinmayee Padhi',
    role: 'FIC · QUIZ CLUB',
    title: 'Faculty-in-Charge, Silicon Quiz Club',
    specialty: ['Academic Oversight', 'Tournament Sanctioning', 'Institutional Governance'],
    bio: 'Faculty-in-Charge guiding the intellectual mission, institutional governance, and academic excellence of Silicon Quiz Club at Silicon Institute of Technology.',
    image: '/assets/images/Members/Dr. Chinmayee Padhi.png',
    socials: {
      email: 'fic.quiz@silicon.ac.in'
    }
  },
  {
    id: 'sec-kausik',
    name: 'Kausik Hussain',
    role: 'SECRETARY · QUIZ CLUB',
    title: 'Chief Student Executive',
    specialty: ['Tournament Architecture', 'Syndicate Direction', 'Arena Operations'],
    bio: 'Chief student executive spearheading tournament architecture, collegiate syndicate representation, and inter-institutional championship coordination.',
    image: '/assets/images/Members/Kausik Hussain.png',
    socials: {
      email: 'quizclub@silicon.ac.in'
    }
  },
  {
    id: 'jsec-rupesh',
    name: 'Rupesh Sahu',
    role: 'JOINT SECRETARY · QUIZ CLUB',
    title: 'Joint Student Executive',
    specialty: ['Stage Operations', 'Real-time Telemetry', 'Arena Logistics'],
    bio: 'Co-directing stage operations, real-time arena telemetry, and high-velocity syndicate coordination across collegiate championships.',
    image: '/assets/images/Members/Rupesh Sahu.jpeg',
    socials: {
      email: 'quizclub@silicon.ac.in'
    }
  }
];
