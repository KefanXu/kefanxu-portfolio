import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { projects } from '../data/projects';
import { setRevealGate } from '../components/Reveal';
import { reducedMotion, refreshScroll, scrollToElement, scrollToTop } from './scroll';

/*
 * A very small hash router (`#/` and `#/work/:slug`) so the static host needs
 * no rewrites, wrapped in a cover → swap → reveal page transition.
 */
export type Route = { name: 'home' } | { name: 'case'; slug: string };

export const workHref = (slug: string) => `#/work/${slug}`;
export const homeHref = '#/';

function parseRoute(hash: string): Route {
  const match = hash.match(/^#\/work\/([\w-]+)/);
  if (match && projects.some(project => project.slug === match[1])) return { name: 'case', slug: match[1] };
  return { name: 'home' };
}
const sameRoute = (a: Route, b: Route) => a.name === b.name && (a.name !== 'case' || (b.name === 'case' && a.slug === b.slug));

interface Wipe {
  phase: 'idle' | 'cover' | 'reveal';
  label: string;
  meta: string;
  color: string;
  ink: string;
}
interface NavigateOptions {
  /** Section id to scroll to once the home page is showing. */
  section?: string;
}
interface RouterValue {
  route: Route;
  navigate: (href: string, options?: NavigateOptions) => void;
  /** onClick helper for plain anchors: keeps modified clicks native. */
  link: (href: string, options?: NavigateOptions) => (event: MouseEvent<HTMLAnchorElement>) => void;
  transitioning: boolean;
}

const RouterContext = createContext<RouterValue | null>(null);
export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>');
  return value;
}

const COVER_MS = 760;
const REVEAL_MS = 900;

function wipeFor(route: Route): Omit<Wipe, 'phase'> {
  if (route.name === 'case') {
    const index = projects.findIndex(project => project.slug === route.slug);
    const project = projects[index];
    return {
      label: project.name,
      meta: `Case study ${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`,
      color: project.theme.panel,
      ink: project.theme.ink,
    };
  }
  return { label: 'Kefan Xu', meta: 'Selected work', color: '#111110', ink: '#f3f1ec' };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const [wipe, setWipe] = useState<Wipe>({ phase: 'idle', label: '', meta: '', color: '#111110', ink: '#f3f1ec' });
  const routeRef = useRef(route);
  const busy = useRef(false);
  const homeScroll = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(id => window.clearTimeout(id)), []);

  const settle = useCallback((next: Route, options?: NavigateOptions, restoreHome = false) => {
    routeRef.current = next;
    setRoute(next);
    // Wait for the new page to mount before positioning the viewport.
    requestAnimationFrame(() => {
      if (next.name === 'home' && options?.section) {
        scrollToTop(true);
        requestAnimationFrame(() => {
          const section = document.getElementById(options.section!);
          if (section) window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 40);
          refreshScroll();
        });
      } else if (next.name === 'home' && restoreHome && homeScroll.current > 0) {
        window.scrollTo(0, homeScroll.current);
        refreshScroll();
      } else {
        scrollToTop(true);
      }
    });
  }, []);

  const run = useCallback((next: Route, options: NavigateOptions | undefined, push: boolean, restoreHome: boolean) => {
    const current = routeRef.current;
    if (sameRoute(current, next)) {
      if (options?.section) scrollToElement(options.section, -40);
      else if (next.name === 'home') scrollToElement(document.body, 0);
      return;
    }
    if (busy.current) return;
    if (current.name === 'home') homeScroll.current = window.scrollY;
    const href = next.name === 'case' ? workHref(next.slug) : homeHref;

    if (reducedMotion()) {
      if (push) window.history.pushState(null, '', href);
      settle(next, options, restoreHome);
      return;
    }

    busy.current = true;
    setWipe({ phase: 'cover', ...wipeFor(next) });
    timers.current.push(window.setTimeout(() => {
      if (push) window.history.pushState(null, '', href);
      setRevealGate(false);
      settle(next, options, restoreHome);
      timers.current.push(window.setTimeout(() => {
        setWipe(previous => ({ ...previous, phase: 'reveal' }));
        timers.current.push(window.setTimeout(() => setRevealGate(true), 260));
        timers.current.push(window.setTimeout(() => {
          setWipe(previous => ({ ...previous, phase: 'idle' }));
          busy.current = false;
        }, REVEAL_MS));
      }, 120));
    }, COVER_MS));
  }, [settle]);

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    run(parseRoute(href), options, true, false);
  }, [run]);

  const link = useCallback((href: string, options?: NavigateOptions) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href, options);
  }, [navigate]);

  useEffect(() => {
    const onHistory = () => run(parseRoute(window.location.hash), undefined, false, true);
    window.addEventListener('popstate', onHistory);
    return () => window.removeEventListener('popstate', onHistory);
  }, [run]);

  useEffect(() => {
    const project = route.name === 'case' ? projects.find(item => item.slug === route.slug) : undefined;
    document.title = project ? `${project.name} — Kefan Xu` : 'Kefan Xu — Product Designer';
  }, [route]);

  const value = useMemo<RouterValue>(() => ({ route, navigate, link, transitioning: wipe.phase !== 'idle' }), [route, navigate, link, wipe.phase]);

  return (
    <RouterContext.Provider value={value}>
      {children}
      <div
        className={`wipe wipe--${wipe.phase}`}
        style={{ '--wipe-bg': wipe.color, '--wipe-ink': wipe.ink } as CSSProperties}
        aria-hidden="true"
      >
        <div className="wipe__inner">
          <span className="wipe__meta mono">{wipe.meta}</span>
          <span className="wipe__label">{wipe.label}</span>
        </div>
      </div>
    </RouterContext.Provider>
  );
}
