import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { onScrollFrame, scrollToTop } from '../lib/scroll';

/*
 * A small round button, bottom right, that appears once the cover has
 * scrolled away and takes the page back to the top. Its ring fills with the
 * reading progress, so it also says how far down the page one is.
 */
export function ToTop() {
  const ring = useRef<SVGCircleElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => onScrollFrame(({ y, vh }) => {
    setShown(y > vh * 0.9);
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    ring.current?.style.setProperty('stroke-dashoffset', (1 - Math.min(1, y / max)).toFixed(4));
  }), []);

  return (
    <button
      type="button"
      className={`to-top${shown ? ' is-shown' : ''}`}
      onClick={() => scrollToTop(false)}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
    >
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="to-top__track" cx="22" cy="22" r="20" />
        <circle ref={ring} className="to-top__ring" cx="22" cy="22" r="20" pathLength={1} />
      </svg>
      <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
