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

export type DemoId = 'capsules' | 'mood' | 'loop' | 'ecology' | 'homework' | 'methods';

/** A technical callout pinned to a real screen: x and y are percentages of the screen image. */
export interface Callout { x: number; y: number; side?: 'left' | 'right'; title: string; body: string }
export interface AnnotatedScreen { shot: Shot; device: 'phone' | 'browser'; url?: string; label?: string; callouts: Callout[] }
/** The shape of the system's core record, typeset row by row: a key, its value or type, and a note in the margin. */
export interface RecordRow { key: string; value?: string; note?: string; nested?: boolean }
export interface RecordView { title: string; rows: RecordRow[] }
/** One action followed through the system, step by step, each step in the lane (client, proxy, model…) where it happens. */
export interface TraceStep { lane: string; text: string; detail?: string }
export interface TraceView { title: string; steps: TraceStep[] }
/**
 * The system as an illustrated scene: real screens in tilted device frames,
 * isometric infrastructure, notifications, the people who built it and a few
 * figures, laid out on a 1200 × 640 canvas that scales to the page, with the
 * data that moves between them drawn as ribbons.
 */
export type Side = 'left' | 'right' | 'top' | 'bottom';
interface SceneBase { id: string; x: number; y: number; label?: string; kicker?: string; body?: string }
export type SceneItem =
  | (SceneBase & { type: 'phone'; shot: Shot; w?: number; tilt?: number })
  | (SceneBase & { type: 'browser'; shot: Shot; w?: number; tilt?: number; url?: string })
  | (SceneBase & { type: 'server' | 'database' | 'chip' | 'lock' | 'calendar' | 'sun' | 'bell'; scale?: number })
  | (SceneBase & { type: 'slab'; w: number; d: number })
  | (SceneBase & { type: 'toast'; app: string; title: string; text: string })
  | (SceneBase & { type: 'role'; title: string; role: string; tool?: string })
  | (SceneBase & { type: 'stat'; value: string; unit: string })
  | (SceneBase & { type: 'zone'; w: number; h: number });
export interface SceneFlow { id: string; from: string; to: string; label?: string; fromSide?: Side; toSide?: Side; fromAt?: number; toAt?: number; labelAt?: number; bend?: number; quiet?: boolean }
export interface SceneView { title: string; items: SceneItem[]; flows: SceneFlow[]; path?: string[]; hint?: string }
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
  | { kind: 'decisions'; title: string; body: string; groups: { label: string; n: number }[]; scenarios: { title: string; body: string }[]; steps: { label: string; body: string; tone: 'a' | 'b' }[]; map?: StudyMap; caption?: string };

/** The session as a score: each instrument on its own line, used at some stages, running into the analysis it feeds. */
export interface StudyMap {
  /** One column per stage, in order; `tone: 'b'` marks the stage spent in the system. */
  stages: { label: string; sub: string; tone?: 'a' | 'b' }[];
  /** One line per instrument. `uses` has one entry per stage: what is collected there, or null. Lines that feed the same lane sit together. */
  rows: { label: string; note: string; icon: 'dcs' | 'log' | 'interview' | 'chat'; lane: string; uses: ({ label: string; sub: string } | null)[] }[];
  lanes: { id: string; label: string; body: string }[];
}

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
  /**
   * How it was built: a short spec column beside the headline, then four
   * views of the build behind one switch: the real screen with technical
   * callouts pinned to it, the structure of the system, the shape of its core
   * record, and one action traced through it. Brief on purpose.
   */
  | {
      type: 'build';
      eyebrow: string;
      title: string;
      intro?: string;
      specs: { label: string; value: string }[];
      /** Three views of the same build: the screen annotated, the record it keeps, one action traced through it. */
      screen: AnnotatedScreen;
      scene?: SceneView;
      record?: RecordView;
      trace?: TraceView;
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
