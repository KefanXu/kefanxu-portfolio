import type { CSSProperties, ReactNode } from 'react';
import { sizeOf } from '../data/img';
import type { Shot } from '../data/types';
import './device.css';

interface PhoneProps {
  shot?: Shot;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  /** Decorative phones (hero fans, card covers) are hidden from assistive tech. */
  decorative?: boolean;
}

export function Phone({ shot, children, className = '', style, eager = false, decorative = false }: PhoneProps) {
  return (
    <div className={`phone ${className}`.trim()} style={style} aria-hidden={decorative || undefined}>
      <div className="phone__screen">
        {shot ? (
          <img src={shot.src} alt={decorative ? '' : shot.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        ) : null}
        {children}
      </div>
    </div>
  );
}

interface BrowserProps {
  shot?: Shot;
  children?: ReactNode;
  url?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  decorative?: boolean;
}

export function Browser({ shot, children, url, className = '', style, eager = false, decorative = false }: BrowserProps) {
  return (
    <div className={`browser ${className}`.trim()} style={style} aria-hidden={decorative || undefined}>
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots"><i /><i /><i /></span>
        {url ? <span className="browser__url">{url}</span> : null}
      </div>
      <div className="browser__view">
        {shot ? (
          <img src={shot.src} alt={decorative ? '' : shot.alt} {...sizeOf(shot.src)} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        ) : null}
        {children}
      </div>
    </div>
  );
}
