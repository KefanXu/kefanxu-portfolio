import { useEffect } from 'react';
import { Cursor } from './components/Cursor';
import { Header } from './components/Header';
import { LightboxProvider } from './components/Lightbox';
import { setRevealGate } from './components/Reveal';
import { RouterProvider, useRouter } from './lib/router';
import { refreshScroll, startScroll } from './lib/scroll';
import { CaseStudy } from './pages/CaseStudy';
import { Home } from './pages/Home';
import { whenModeRevealed } from '../mode/modeSwitch';

function Pages() {
  const { route } = useRouter();

  // New page → new layout: let scroll-linked pieces re-measure once it paints.
  useEffect(() => {
    const id = window.setTimeout(refreshScroll, 60);
    return () => window.clearTimeout(id);
  }, [route]);

  return (
    <main id="main" tabIndex={-1} key={route.name === 'case' ? route.slug : 'home'}>
      {route.name === 'case' ? <CaseStudy slug={route.slug} /> : <Home />}
    </main>
  );
}

export default function App() {
  useEffect(() => startScroll(), []);

  // Hold entrance animations until webfonts are in and, if we arrived through
  // the mode switch, until its curtain starts to lift.
  useEffect(() => {
    let cancelled = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise<void>(resolve => window.setTimeout(resolve, 1400));
    Promise.all([Promise.race([fonts, timeout]), whenModeRevealed()]).then(() => {
      if (cancelled) return;
      window.setTimeout(() => { setRevealGate(true); refreshScroll(); }, 120);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <RouterProvider>
      <a
        className="skip-link"
        href="#main"
        onClick={event => {
          // The hash belongs to the router, so move focus without changing it.
          event.preventDefault();
          document.getElementById('main')?.focus({ preventScroll: false });
        }}
      >
        Skip to content
      </a>
      <LightboxProvider>
        <Header />
        <Pages />
      </LightboxProvider>
      <Cursor />
    </RouterProvider>
  );
}
