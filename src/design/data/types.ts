export interface ProjectTheme {
  /** Colour field behind the project's visuals (cards, hero, page wipe). */
  panel: string;
  /** Text colour that sits on the panel. */
  ink: string;
  /** Signature accent taken from the product's own UI. */
  accent: string;
  /** A quieter companion tone for secondary surfaces inside the case study. */
  soft: string;
  dark?: boolean;
}

export interface Shot {
  src: string;
  alt: string;
  caption?: string;
}

export type DemoId = 'capsules' | 'mood' | 'loop' | 'ecology';
export type CoverId = 'trackya' | 'moodloop' | 'carework' | 'planneregy' | 'physicify' | 'ecocare';

export type Block =
  | { type: 'text'; eyebrow: string; title: string; body: string[]; aside?: { label: string; items: string[] }[] }
  | { type: 'sequence'; eyebrow: string; title: string; intro?: string; device: 'phone' | 'browser'; steps: { title: string; body: string; shot: Shot }[] }
  | { type: 'gallery'; eyebrow: string; title: string; intro?: string; kind: 'phones' | 'wide' | 'posters'; shots: Shot[]; note?: string }
  | { type: 'figure'; eyebrow?: string; title?: string; shot: Shot; frame: 'browser' | 'plain' | 'card' | 'phone' | 'pan'; wide?: boolean }
  | { type: 'insights'; eyebrow: string; title: string; items: { title: string; body: string }[]; note?: string }
  | { type: 'identity'; eyebrow: string; title: string; body: string; swatches: { name: string; hex: string; role: string }[]; marks: Shot[] }
  | { type: 'demo'; eyebrow: string; title: string; body: string; demo: DemoId; hint?: string }
  | { type: 'video'; eyebrow: string; title: string; youtubeId: string; poster: string; caption: string }
  /** A deployed prototype embedded live, behind a poster until the reader starts it. */
  | { type: 'live'; eyebrow: string; title: string; body: string; url: string; poster: Shot; guide: { title: string; body: string }[]; note?: string }
  /** Wireframes from the design file as storyboards: one strip of frames per flow, read left to right. */
  | { type: 'wireframes'; eyebrow: string; title: string; intro?: string; flows: { title: string; body: string; shots: Shot[] }[]; note?: string }
  | { type: 'outcome'; eyebrow: string; title: string; body: string[]; links: { label: string; href: string }[] };

export interface Project {
  slug: string;
  name: string;
  /** Short category line shown on cards, e.g. "Mobile app · Personal informatics". */
  kicker: string;
  year: string;
  /** Headline of the case study. Words in *asterisks* are set in italic serif. */
  headline: string;
  summary: string;
  status: string;
  tags: string[];
  cover: CoverId;
  theme: ProjectTheme;
  meta: { label: string; value: string }[];
  stats: { value: string; label: string }[];
  heroShots: Shot[];
  heroDevice: 'phone' | 'browser';
  blocks: Block[];
}
