import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { sizeOf } from '../data/img';
import type { Shot } from '../data/types';
import { lockScroll } from '../lib/scroll';

/* Click-to-enlarge for detailed figures such as dashboards and diagrams. */
const LightboxContext = createContext<(shot: Shot, opener: HTMLElement) => void>(() => {});

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [shot, setShot] = useState<Shot | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const open = useCallback((next: Shot, from: HTMLElement) => {
    opener.current = from;
    setShot(next);
  }, []);
  const close = useCallback(() => setShot(null), []);

  useEffect(() => {
    if (!shot) return;
    lockScroll(true);
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', close); // a route change dismisses it
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
      lockScroll(false);
      opener.current?.focus({ preventScroll: true });
    };
  }, [shot, close]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {shot
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.alt} onClick={close} data-lenis-prevent>
              <img src={shot.src} alt={shot.alt} {...sizeOf(shot.src)} onClick={event => event.stopPropagation()} />
              {shot.caption ? <p className="lightbox__caption" onClick={event => event.stopPropagation()}>{shot.caption}</p> : null}
              <button ref={closeButton} type="button" className="lightbox__close" onClick={close}>
                <span className="sr-only">Close enlarged image</span>
                <X size={20} aria-hidden="true" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </LightboxContext.Provider>
  );
}

/**
 * Wraps an image in a button that opens the lightbox. Without children it
 * renders as a transparent overlay for framed content (e.g. a browser mock-up):
 * give the parent `position: relative`.
 */
export function Zoom({ shot, children, className = '' }: { shot: Shot; children?: ReactNode; className?: string }) {
  const open = useContext(LightboxContext);
  return (
    <button
      type="button"
      className={`zoom${children ? '' : ' zoom--overlay'} ${className}`.trim()}
      data-cursor="Enlarge"
      aria-label={`Enlarge image: ${shot.alt}`}
      onClick={event => open(shot, event.currentTarget)}
    >
      {children}
    </button>
  );
}
