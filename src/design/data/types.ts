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

/** The rhythm of a study: a deployment counted in days, or one session counted in minutes. */
export type Timeline =
  | { kind: 'days'; days: number; phases: { from: number; to: number; label: string; tone: 'a' | 'b' }[]; marks: { day: number; label: string }[]; ticks?: { every: number; label: string } }
  | { kind: 'session'; minutes: string; segments: { label: string; share: number; tone: 'a' | 'b' | 'c'; interview?: boolean }[]; note?: string };

/** Evidence attached to an insight: a share of participants, their words, or a screen. */
export type Evidence =
  | { kind: 'share'; n: number; of: number; label?: string }
  | { kind: 'quote'; text: string; who: string }
  | { kind: 'shot'; shot: Shot };
export interface Insight { title: string; body: string; evidence?: Evidence }

/** The centrepiece of a research block: a record drawn from the study's own data. */
export type RecordSpec =
  | { kind: 'strategies'; title: string; body: string; caption?: string }
  | { kind: 'scales'; title: string; body: string; caption?: string }
  | { kind: 'planning'; title: string; body: string; columns: { label: string; items: { title: string; n: number; of: number }[] }[]; caption?: string }
  | { kind: 'roster'; title: string; body: string; people: { id: string; role: string; field: string; years: number; case?: string; studies: string; glyph: 'physician' | 'dietitian' | 'dentist' | 'speech' | 'nurse' | 'educator' }[]; themes: { label: string; items: string[] }[]; caption?: string }
  | { kind: 'decisions'; title: string; body: string; groups: { label: string; n: number }[]; scenarios: { title: string; body: string }[]; steps: { label: string; body: string; tone: 'a' | 'b' }[]; figure?: Shot; caption?: string };

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
  /**
   * A user study, presented the way research is presented: headline numbers
   * and the study's rhythm, the participants' record drawn live, insights with
   * their evidence, and the method kept short. `planned` marks a study that has
   * not run yet, so its results read as expectations.
   */
  | {
      type: 'research';
      eyebrow: string;
      title: string;
      intro?: string;
      planned?: boolean;
      numbers: { value: string; label: string }[];
      timeline: Timeline;
      record?: RecordSpec;
      insights: Insight[];
      insightsLabel?: string;
      method: { label: string; value: string }[];
      note?: string;
      source?: { label: string; href: string };
    }
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
