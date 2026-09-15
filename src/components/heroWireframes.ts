import type { WireShape } from './SketchReveal';

/**
 * LCD shell only (bezel → trench → screen).
 * Content pieces are revealed one-by-one via SketchReveal after the shell appears.
 */
export function buildLCDShellShapes(W: number, H: number): WireShape[] {
  if (W <= 0 || H <= 0) return [];

  const pad = 2;
  const outerRx = Math.min(40, W / 8);
  const trenchInset = 4;
  const screenInset = 18;
  const screenRx = Math.min(28, W / 10);

  return [
    {
      kind: 'rect',
      x: pad,
      y: pad,
      w: W - pad * 2,
      h: H - pad * 2,
      rx: outerRx,
      delay: 0,
      duration: 0.5,
    },
    {
      kind: 'rect',
      x: trenchInset + 2,
      y: trenchInset + 2,
      w: W - (trenchInset + 2) * 2,
      h: H - (trenchInset + 2) * 2,
      rx: outerRx - 2,
      delay: 0.12,
      duration: 0.4,
    },
    {
      kind: 'rect',
      x: screenInset,
      y: screenInset,
      w: W - screenInset * 2,
      h: H - screenInset * 2,
      rx: screenRx,
      delay: 0.24,
      duration: 0.4,
    },
  ];
}

/** @deprecated use buildLCDShellShapes — kept for any residual imports */
export const buildLCDWireShapes = buildLCDShellShapes;
