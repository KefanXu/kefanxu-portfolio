import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Maximize2, Minimize2, RotateCw } from 'lucide-react';
import type { Block } from '../data/types';
import { Reveal } from './Reveal';

/*
 * A deployed prototype, live inside the case study. It sits behind a poster
 * until the reader starts it, so the page stays light and nothing steals the
 * scroll. Small screens open the prototype in a new tab instead: these are
 * desktop tools.
 */
type LiveBlock = Extract<Block, { type: 'live' }>;

const smallScreen = () => window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches;

export function LiveDemo({ block, name }: { block: LiveBlock; name: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [full, setFull] = useState(false);
  const [generation, setGeneration] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const host = new URL(block.url).host;

  const start = useCallback(() => {
    if (smallScreen()) {
      window.open(block.url, '_blank', 'noopener');
      return;
    }
    setState('loading');
  }, [block.url]);

  const reload = useCallback(() => {
    setGeneration(value => value + 1);
    setState('loading');
  }, []);

  const toggleFull = useCallback(async () => {
    const element = windowRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (element.requestFullscreen) await element.requestFullscreen();
      else window.open(block.url, '_blank', 'noopener');
    } catch {
      window.open(block.url, '_blank', 'noopener');
    }
  }, [block.url]);

  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === windowRef.current && windowRef.current !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  // Enlarging starts the prototype if it has not been started yet.
  useEffect(() => {
    if (full && state === 'idle') setState('loading');
  }, [full, state]);

  return (
    <Reveal kind="scale" className="live">
      <div ref={windowRef} className={`live__window${full ? ' is-full' : ''}${state === 'ready' ? ' is-ready' : ''}`} data-lenis-prevent>
        <div className="live__bar">
          <span className="browser__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="live__url mono">
            <i className={`live__dot${state === 'ready' ? ' is-on' : ''}`} aria-hidden="true" />
            {host}
          </span>
          <div className="live__actions">
            {state !== 'idle' ? (
              <button type="button" onClick={reload} aria-label="Reload the prototype" title="Reload"><RotateCw size={15} aria-hidden="true" /></button>
            ) : null}
            <button type="button" onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'View full screen'} title={full ? 'Exit full screen' : 'Full screen'}>
              {full ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
            </button>
            <a href={block.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} in a new tab`} title="Open in a new tab"><ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="live__view">
          {state === 'idle' ? (
            <button type="button" className="live__poster" onClick={start} data-cursor="Start">
              <img src={block.poster.src} alt={block.poster.alt} loading="lazy" decoding="async" draggable={false} />
              <span className="live__start">
                <span className="btn">Start the live prototype <ArrowRight size={18} aria-hidden="true" /></span>
                <span className="mono live__start-note">Runs in this window · opens in a new tab on small screens</span>
              </span>
            </button>
          ) : (
            <>
              <iframe
                key={generation}
                src={block.url}
                title={`${name}: live prototype`}
                allow="clipboard-write; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setState('ready')}
              />
              {state === 'loading' ? (
                <div className="live__loading" role="status">
                  <span className="mono"><i aria-hidden="true" />Loading the live prototype from {host}…</span>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <ol className="live__guide" aria-label="How to explore">
        {block.guide.map((step, index) => (
          <li key={step.title}>
            <span className="mono live__step">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      {block.note ? <p className="block__note muted live__note">{block.note}</p> : null}
    </Reveal>
  );
}
