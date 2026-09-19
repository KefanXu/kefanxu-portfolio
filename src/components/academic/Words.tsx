import { createElement, type CSSProperties, type ReactNode } from 'react';
import { useRevealRef } from '../../design/components/Reveal';

/*
 * A heading whose words rise one by one from behind a baseline mask once it
 * scrolls into view (styles in src/styles/motion.css). Screen readers get the
 * plain sentence; the animated words are decorative.
 *
 *   text: "Health, care, | and *everyday life.*"
 *   `|` breaks a line; words wrapped in *asterisks* are set as <em>;
 *   a lone `&` is rendered in its own span so it can be styled.
 */
interface WordsProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  delay?: number;
}

interface Word { word: string; italic: boolean; index: number }

export function Words({ text, as = 'h2', className = '', id, delay = 0 }: WordsProps) {
  const ref = useRevealRef<HTMLElement>();
  let emphasised = false;
  let index = 0;
  const lines: Word[][] = text.split('|').map(line => line.split(/\s+/).filter(Boolean).map(token => {
    let word = token;
    let italic = emphasised;
    if (word.startsWith('*')) { italic = true; emphasised = true; word = word.slice(1); }
    if (/\*[.,;:!?—–-]*$/.test(word)) { emphasised = false; word = word.replace('*', ''); }
    return { word, italic, index: index++ };
  }));
  const plain = lines.map(line => line.map(item => item.word).join(' ')).join(' ');
  const render = (item: Word): ReactNode => item.word === '&'
    ? <span className="words__amp">&amp;</span>
    : item.italic ? <em>{item.word}</em> : item.word;

  return createElement(
    as,
    { ref, id, className: `words ${className}`.trim(), style: { '--d': `${delay}ms` } as CSSProperties },
    <span className="words__sr" key="sr">{plain}</span>,
    lines.map((line, lineIndex) => (
      <span key={lineIndex} className={`words__line words__line--${lineIndex + 1}`} aria-hidden="true">
        {line.map((item, wordIndex) => (
          <span key={item.index}>
            <span className="words__word"><span style={{ '--i': item.index } as CSSProperties}>{render(item)}</span></span>
            {wordIndex < line.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    )),
  );
}
