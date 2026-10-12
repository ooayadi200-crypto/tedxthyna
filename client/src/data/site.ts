export const EVENT = {
  name: "TEDx Thyna Youth",
  edition: "2026",
  caseNo: "TX-026",
  dateISO: "2026-11-15T09:00:00+01:00",
  dateLabel: "15 November 2026",
  dateShort: "15.11.26",
  venue: "Théâtre Municipal de Sfax",
  venueLines: ["Théâtre", "Municipal", "de Sfax"],
  plusCode: "PQM7+J55",
  city: "Sfax, Tunisia",
  mapsUrl: "https://maps.google.com/?q=Theatre+Municipal+de+Sfax",
  email: "affes.zied@tedxthyna.com",
  instagram: "https://www.instagram.com/tedxthyna/",
  linkedin: "https://www.linkedin.com/m/company/tedxthyna-youth/",
};

export type NavItem = { label: string; href: string; code: string };

export const NAV: NavItem[] = [
  { label: "Mission", href: "/mission", code: "02" },
  { label: "The Voices", href: "/minds", code: "03" },
  { label: "Organization", href: "/organization", code: "04" },
  { label: "The Scene", href: "/scene", code: "05" },
  { label: "Agenda", href: "/agenda", code: "06" },
  { label: "Contact", href: "/contact", code: "07" },
];

/** Order of files when visitors move "to the next file" at the bottom of each page. */
export const FILE_ORDER: NavItem[] = [
  ...NAV.slice(0, 5),
  { label: "Register", href: "/register", code: "08" },
  NAV[5],
];

export const TEAM = [
  { name: "Abderrahmen Bouderbela", role: "Event President & Head of Partnerships", email: "abderrahmen.bouderbela@tedxthyna.com" },
  { name: "Khadija Kammoun", role: "Public Relations & Speaker Relations Specialist", email: "khadija.kammoun@tedxthyna.com" },
  { name: "Fatma Guermazi", role: "Social Media & Delegate Experience Specialist", email: "fatma.guermazi@tedxthyna.com" },
  { name: "Youssef Ayedy", role: "Head of Operations", email: "youssef.ayedy@tedxthyna.com" },
  { name: "Zied Affes", role: "Data & Information Specialist", email: "affes.zied@tedxthyna.com" },
  { name: "Mohamed Aziz Mtimet", role: "Head of Finance & Legalities", email: "aziz.mtimet@tedxthyna.com" },
];

export const FILES = [
  {
    code: "01",
    tag: "The Mission",
    title: "Why we gather",
    question: "What is the case really about?",
    href: "/mission",
    image: "dossier",
  },
  {
    code: "02",
    tag: "The Voices",
    title: "Who holds the mic",
    question: "Who is behind the story?",
    href: "/minds",
    image: "jihed",
  },
  {
    code: "03",
    tag: "The Scene",
    title: "Where it unfolds",
    question: "Where will it happen?",
    href: "/scene",
    image: "stage",
  },
  {
    code: "04",
    tag: "The Organization",
    title: "Who runs the operation",
    question: "Who built the file?",
    href: "/organization",
    image: "board",
  },
  {
    code: "05",
    tag: "The Agenda",
    title: "How the day plays out",
    question: "What happens, and when?",
    href: "/agenda",
    image: "desk",
  },
] as const;

export const img = (name: string, size: 1000 | 2000 = 2000) => `/media/${name}-${size}.webp`;
export const srcSet = (name: string) => `/media/${name}-1000.webp 1000w, /media/${name}-2000.webp 2000w`;
