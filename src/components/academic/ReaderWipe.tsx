import type { CSSProperties } from 'react';
import { researchBooks } from './ResearchBook';

/*
 * The colour panel that carries a reader open and closed. `idle` waits below
 * the viewport, `cover` rises over it, `hold` stays put without a transition,
 * and `reveal` keeps rising until the view underneath is uncovered.
 * Styles live in src/styles/motion.css.
 */
export type WipePhase = 'idle' | 'cover' | 'hold' | 'reveal';

export interface WipeColours {
  /** Panel colour: the project's cover ink. */
  ink: string;
  /** Text colour: the project's cover paper. */
  paper: string;
  name: string;
  number: string;
}

/** A project's cover colours, read from the custom properties on its folio card. */
export function coloursFor(id: string): WipeColours | null {
  const index = researchBooks.findIndex(study => study.id === id);
  if (index < 0) return null;
  const article = document.getElementById(id);
  const style = article ? getComputedStyle(article) : null;
  return {
    ink: style?.getPropertyValue('--cover-ink').trim() || '#1f6f66',
    paper: style?.getPropertyValue('--cover-color').trim() || '#ffffff',
    name: researchBooks[index].name,
    number: String(index + 1).padStart(2, '0'),
  };
}

export function ReaderWipe({ phase, ink, paper, name, number }: WipeColours & { phase: WipePhase }) {
  return (
    <div className={`reader-wipe reader-wipe--${phase}`} style={{ '--wipe-bg': ink, '--wipe-ink': paper } as CSSProperties} aria-hidden="true">
      <div className="reader-wipe__inner">
        <span className="reader-wipe__label">{name}</span>
        <span className="reader-wipe__meta">Research project {number}</span>
      </div>
    </div>
  );
}
