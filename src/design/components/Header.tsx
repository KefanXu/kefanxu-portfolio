import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '../data/profile';
import { homeHref, useRouter } from '../lib/router';
import { onScrollFrame } from '../lib/scroll';
import cvPdf from '../../assets/KefanXu_CV.pdf';

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

function useLocalTime(timeZone: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone, timeZoneName: 'short' }).format(now);
}

export function Header() {
  const { route, link } = useRouter();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const time = useLocalTime(profile.timezone);

  useEffect(() => onScrollFrame(({ y }) => {
    const delta = y - lastY.current;
    if (Math.abs(delta) > 4) {
      setHidden(delta > 0 && y > 220);
      lastY.current = y;
    }
    setSolid(y > 40);
  }), []);

  useEffect(() => setOpen(false), [route]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-head${hidden && !open ? ' is-hidden' : ''}${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <div className="site-head__bar shell">
        <a className="site-head__brand" href={homeHref} onClick={link(homeHref)} aria-label="Kefan Xu, home">
          <span className="site-head__name">Kefan Xu</span>
          <span className="site-head__role mono">{route.name === 'case' ? 'Back to index' : profile.title}</span>
        </a>

        <nav className="site-head__nav" aria-label="Sections">
          {sections.map(section => (
            <a key={section.id} className="link" href={homeHref} onClick={link(homeHref, { section: section.id })}>{section.label}</a>
          ))}
        </nav>

        <div className="site-head__side">
          <span className="site-head__time mono" aria-label={`Local time in ${profile.location}`}>{profile.location.split(',')[0]} {time}</span>
          <a className="site-head__cv" href={cvPdf} target="_blank" rel="noopener noreferrer">CV <ArrowUpRight size={14} aria-hidden="true" /></a>
          <button type="button" className="site-head__menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <i aria-hidden="true" /><i aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="site-menu" className="site-menu" hidden={!open}>
        <nav className="shell" aria-label="Menu">
          {sections.map((section, index) => (
            <a key={section.id} href={homeHref} onClick={link(homeHref, { section: section.id })} style={{ transitionDelay: `${index * 50}ms` }}>
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>{section.label}
            </a>
          ))}
          <a href={cvPdf} target="_blank" rel="noopener noreferrer"><span className="mono">05</span>Curriculum vitae <ArrowUpRight size={22} aria-hidden="true" /></a>
        </nav>
      </div>
    </header>
  );
}
