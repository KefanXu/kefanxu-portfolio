"""
Draws the designer-mode cover poster (src/design/components/Poster.tsx) as six
SVG layers: sky, clouds, sun, ring, hills, flora. Everything is deterministic,
so the output is committed next to the component and this script only needs
running when the drawing changes:

    python3 scripts/poster/make_poster.py            # rewrites the six SVGs
    python3 scripts/poster/make_poster.py --preview  # also writes a day and a night preview page to the temp folder

No dependencies beyond the standard library. The palette is left to CSS
variables (--pz-*, set in cover.css), so the night version is one class, and
the layers are kept apart so the site can move each one on its own.
"""
import math, random, os, sys, base64, io, zlib, struct, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'src', 'design', 'components', 'poster')
os.makedirs(OUT, exist_ok=True)
W, H = 528, 560
SUN = (318, 304, 102)
rng = random.Random(42)

def f(n): return f"{n:.1f}".rstrip('0').rstrip('.') if abs(n - round(n)) > 1e-6 else str(int(round(n)))

def catmull(points, closed=False, tension=1.0):
    """Catmull-Rom through points → cubic bezier path (open)."""
    p = points
    d = [f"M {f(p[0][0])} {f(p[0][1])}"]
    n = len(p)
    for i in range(n - 1):
        p0 = p[i - 1] if i > 0 else p[i]
        p1 = p[i]; p2 = p[i + 1]
        p3 = p[i + 2] if i + 2 < n else p[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6 * tension, p1[1] + (p2[1] - p0[1]) / 6 * tension)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6 * tension, p2[1] - (p3[1] - p1[1]) / 6 * tension)
        d.append(f"C {f(c1[0])} {f(c1[1])}, {f(c2[0])} {f(c2[1])}, {f(p2[0])} {f(p2[1])}")
    return ' '.join(d)

def hill_path(top_points, bottom=H + 20):
    """A hill: smooth ridge across the width, closed down to the bottom."""
    return catmull(top_points) + f" L {f(top_points[-1][0])} {bottom} L {f(top_points[0][0])} {bottom} Z"

def grain_png(size=96, alpha=110, seed=7):
    """A square of ink speckle with random alpha, as a PNG data URI (written by hand, no imaging library)."""
    r = random.Random(seed)
    raw = b''.join(b'\x00' + b''.join(bytes((24, 14, 12, r.randint(0, alpha))) for _ in range(size)) for _ in range(size))
    def chunk(tag, data): return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))
    return 'data:image/png;base64,' + base64.b64encode(png).decode()

def speckle_pattern(pid, n=46, size=72, rmin=0.5, rmax=1.3, seed=3, fill='var(--pz-paper)'):
    r = random.Random(seed)
    dots = ''.join(f'<circle cx="{f(r.uniform(0,size))}" cy="{f(r.uniform(0,size))}" r="{f(r.uniform(rmin,rmax))}"/>' for _ in range(n))
    return f'<pattern id="{pid}" width="{size}" height="{size}" patternUnits="userSpaceOnUse"><g style="fill:{fill}">{dots}</g></pattern>'

def svg(body, defs='', cls=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" '
            f'class="{cls}" aria-hidden="true" focusable="false">' + (f'<defs>{defs}</defs>' if defs else '') + body + '</svg>')

# ── Sky ────────────────────────────────────────────────────────────────────
def sky():
    defs = (
        '<linearGradient id="pz-sky" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" style="stop-color:var(--pz-sky0)"/><stop offset=".52" style="stop-color:var(--pz-sky1)"/>'
        '<stop offset=".84" style="stop-color:var(--pz-sky2)"/><stop offset="1" style="stop-color:var(--pz-sky3)"/></linearGradient>'
        '<linearGradient id="pz-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
        '<stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>'
        '<mask id="pz-band-mask"><rect width="528" height="400" fill="url(#pz-band)"/></mask>'
        '<pattern id="pz-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".9" style="fill:var(--pz-ink)"/></pattern>'
    )
    body = ['<rect x="-40" y="-40" width="608" height="640" fill="url(#pz-sky)"/>']
    # a halftone band that thickens toward the horizon, the way a riso print does
    body.append('<rect width="528" height="400" fill="url(#pz-dots)" mask="url(#pz-band-mask)" opacity=".16"/>')
    # stars, only at night
    stars = []
    r = random.Random(11)
    for _ in range(70):
        x, y = r.uniform(6, 522), r.uniform(6, 300)
        rad = r.choice([0.7, 0.9, 1.1, 1.4])
        stars.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{rad}"/>')
    # a few four-point stars
    for (x, y, s) in [(96, 72, 5), (412, 54, 4), (236, 128, 3.5), (470, 196, 3), (62, 214, 3)]:
        stars.append(f'<path d="M{x} {y-s} Q{x} {y} {x+s} {y} Q{x} {y} {x} {y+s} Q{x} {y} {x-s} {y} Q{x} {y} {x} {y-s}Z"/>')
    body.append(f'<g style="fill:var(--pz-paper);opacity:var(--pz-star)">{"".join(stars)}</g>')
    # birds: small, far, to the upper right
    birds = []
    for (x, y, s, rot) in [(404, 118, 7, -6), (428, 104, 5.5, 4), (452, 126, 6, -2), (386, 146, 4.5, 8), (474, 152, 4, -10)]:
        birds.append(f'<path transform="rotate({rot} {x} {y})" d="M{f(x-s)} {y} q{f(s*0.5)} {f(-s*0.7)} {f(s)} 0 q{f(s*0.5)} {f(-s*0.7)} {f(s)} 0" fill="none" stroke-width="1.3" stroke-linecap="round"/>')
    body.append(f'<g style="stroke:var(--pz-ink)" opacity=".8">{"".join(birds)}</g>')
    return svg(''.join(body), defs, 'poster__sky')

# ── Clouds: long soft lenses that cross the sun ─────────────────────────────
def clouds():
    defs = ('<linearGradient id="pz-lens" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
            '<stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            '<mask id="pz-lens-mask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#pz-lens)"/></mask>')
    out = []
    for (cx, cy, rx, ry, op, tilt) in [(300, 222, 190, 9, .62, -2), (228, 262, 150, 6.5, .5, -1.5), (372, 286, 122, 5, .42, -2.5), (118, 172, 96, 5, .36, -1)]:
        # the lens: flat below, a gently bumped top
        d = (f"M{cx-rx} {cy} C{cx-rx*0.7} {cy-ry*1.8}, {cx-rx*0.35} {cy-ry*2.2}, {cx} {cy-ry*2} "
             f"C{cx+rx*0.35} {cy-ry*1.8}, {cx+rx*0.7} {cy-ry*1.4}, {cx+rx} {cy} C{cx+rx*0.6} {cy+ry*0.9}, {cx-rx*0.6} {cy+ry*0.9}, {cx-rx} {cy}Z")
        out.append(f'<g transform="rotate({tilt} {cx} {cy})"><path d="{d}" style="fill:var(--pz-paper)" opacity="{op}" mask="url(#pz-lens-mask)"/>'
                   f'<path d="{d}" transform="translate(0 {ry*0.9})" style="fill:var(--pz-sky3)" opacity="{op*0.35:.2f}" mask="url(#pz-lens-mask)"/></g>')
    return svg(''.join(out), defs, 'poster__clouds')

# ── Sun (a moon after dark) ─────────────────────────────────────────────────
def sun(grain):
    x, y, r = SUN
    defs = ('<linearGradient id="pz-sunfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--pz-sun0)"/>'
            '<stop offset=".58" style="stop-color:var(--pz-sun1)"/><stop offset="1" style="stop-color:var(--pz-sun2)"/></linearGradient>'
            f'<pattern id="pz-foil" width="96" height="96" patternUnits="userSpaceOnUse"><image href="{grain}" width="96" height="96"/></pattern>'
            f'<mask id="pz-moon"><rect width="528" height="560" fill="#fff"/><circle cx="{x+36}" cy="{y-30}" r="{r*0.86:.0f}" fill="#000" style="opacity:var(--pz-moon)"/></mask>')
    body = (f'<g mask="url(#pz-moon)"><circle cx="{x}" cy="{y}" r="{r}" fill="url(#pz-sunfill)"/>'
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#pz-foil)" opacity=".5"/>'
            f'<circle cx="{x}" cy="{y}" r="{r-0.5}" fill="none" style="stroke:var(--pz-paper)" stroke-opacity=".35" stroke-width="1"/></g>')
    return svg(body, defs, 'poster__sun')

# ── The ring: forty-two days around the sun, six weeks ──────────────────────
def ring():
    x, y, r = SUN
    rr = r + 30
    ticks = []
    for i in range(42):
        a = -math.pi / 2 + i * 2 * math.pi / 42
        long = i % 7 == 0
        l = 9 if long else 5
        x1, y1 = x + math.cos(a) * rr, y + math.sin(a) * rr
        x2, y2 = x + math.cos(a) * (rr + l), y + math.sin(a) * (rr + l)
        ticks.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke-width="{2 if long else 1.3}"/>')
    body = (f'<g style="stroke:var(--pz-tick);opacity:var(--pz-tick-o)">'
            f'<circle cx="{x}" cy="{y}" r="{rr-4}" fill="none" stroke-opacity=".5" stroke-width=".8"/>'
            f'<g stroke-linecap="round">{"".join(ticks)}</g>'
            f'</g>')
    return svg(body, '', 'poster__ring')

# ── Hills ──────────────────────────────────────────────────────────────────
HILLS = [
    # (name, ridge points, rim px, has contour lines)
    ('h1', [(-20, 334), (60, 322), (150, 331), (236, 314), (304, 328), (384, 308), (462, 324), (548, 314)], 0, False),
    ('h2', [(-20, 378), (46, 356), (128, 372), (206, 346), (290, 368), (372, 342), (452, 362), (548, 350)], 6, True),
    ('h3', [(-20, 424), (70, 396), (158, 420), (248, 388), (330, 414), (418, 386), (500, 404), (548, 398)], 7, True),
    ('h4', [(-20, 476), (84, 450), (170, 474), (262, 444), (352, 470), (444, 440), (548, 458)], 8, True),
    ('h5', [(-20, 518), (100, 502), (204, 522), (318, 498), (432, 516), (548, 504)], 6, False),
]

def hills():
    defs = [speckle_pattern('pz-speck', n=40, size=80, rmin=.45, rmax=1.1, seed=5)]
    body = []
    for name, pts, rim, lines in HILLS:
        var = f'var(--pz-{name})'
        defs.append(f'<linearGradient id="pz-g-{name}" x1="0" y1="0" x2="0" y2="1">'
                    f'<stop offset="0" style="stop-color:{var}"/><stop offset=".55" style="stop-color:color-mix(in srgb, {var} 82%, var(--pz-ink))"/>'
                    f'<stop offset="1" style="stop-color:color-mix(in srgb, {var} 60%, var(--pz-ink))"/></linearGradient>')
        d = hill_path(pts)
        g = [f'<g class="hill hill--{name}">']
        if rim:
            # a thin lit edge: the hill in a lighter tone, with the same hill shifted down over it
            g.append(f'<path d="{d}" style="fill:color-mix(in srgb, {var}, var(--pz-paper) var(--pz-rim))"/>')
            g.append(f'<path d="{d}" transform="translate(0 {rim})" fill="url(#pz-g-{name})"/>')
        else:
            g.append(f'<path d="{d}" fill="url(#pz-g-{name})"/>')
        if lines:
            for k, (off, op) in enumerate([(24, .2)]):
                shifted = [(px, py + off) for px, py in pts]
                g.append(f'<path d="{catmull(shifted)}" fill="none" style="stroke:var(--pz-paper);opacity:var(--pz-line)" stroke-width=".9"/>')
        g.append('</g>')
        body.append(''.join(g))
        if name == 'h2': body.append(TREES)
    # one speckle over the whole ground, drawn once rather than per hill: the far ridge's shape runs to the bottom edge, so it covers all five
    body.append(f'<path d="{hill_path(HILLS[0][1])}" fill="url(#pz-speck)" opacity=".2"/>')
    return svg(''.join(body), ''.join(defs), 'poster__hills')

TREES = ''
# ── Flora: grasses, reeds and leaves in the foreground ──────────────────────
def blade(x, y, h, lean, w, curve=0.5):
    tip = (x + lean, y - h)
    cx, cy = x + lean * 0.35, y - h * curve
    return (f"M{f(x-w/2)} {f(y)} Q{f(cx-w*0.22)} {f(cy)} {f(tip[0])} {f(tip[1])} "
            f"Q{f(cx+w*0.22)} {f(cy)} {f(x+w/2)} {f(y)}Z")

def reed(x, y, h, lean, head_h, head_w):
    tip = (x + lean, y - h)
    stem = f'<path d="M{f(x)} {f(y)} Q{f(x+lean*0.3)} {f(y-h*0.5)} {f(tip[0])} {f(tip[1])}" fill="none" stroke-width="2.4" stroke-linecap="round" style="stroke:var(--pz-ink)"/>'
    ang = math.degrees(math.atan2(lean, h))
    head = (f'<rect x="{f(tip[0]-head_w/2)}" y="{f(tip[1]-head_h)}" width="{f(head_w)}" height="{f(head_h)}" rx="{f(head_w/2)}" '
            f'transform="rotate({f(ang)} {f(tip[0])} {f(tip[1])})" style="fill:var(--pz-ink)"/>')
    # a hair-fine highlight down one side of the head
    hi = (f'<line x1="{f(tip[0]-head_w*0.22)}" y1="{f(tip[1]-head_h*0.8)}" x2="{f(tip[0]-head_w*0.22)}" y2="{f(tip[1]-head_h*0.25)}" '
          f'transform="rotate({f(ang)} {f(tip[0])} {f(tip[1])})" style="stroke:var(--pz-paper)" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>')
    return stem + head + hi

def leaf(x, y, h, lean, w, rot=0):
    tip = (x + lean, y - h)
    d = (f"M{f(x)} {f(y)} C{f(x-w*1.1)} {f(y-h*0.28)}, {f(x-w*0.95)} {f(y-h*0.72)}, {f(tip[0])} {f(tip[1])} "
         f"C{f(x+w*0.75)} {f(y-h*0.76)}, {f(x+w*0.9)} {f(y-h*0.3)}, {f(x)} {f(y)}Z")
    rib = f"M{f(x)} {f(y)} Q{f(x+lean*0.3)} {f(y-h*0.5)} {f(tip[0]-lean*0.08)} {f(tip[1]+h*0.07)}"
    veins = ''.join(f'<path d="M{f(x+lean*t*0.28)} {f(y-h*t)} q{f(-w*0.42)} {f(-h*0.09)} {f(-w*0.72)} {f(-h*0.2)}"/>' for t in (0.3, 0.48, 0.66))
    veins += ''.join(f'<path d="M{f(x+lean*t*0.28)} {f(y-h*t)} q{f(w*0.36)} {f(-h*0.09)} {f(w*0.6)} {f(-h*0.2)}"/>' for t in (0.38, 0.56))
    return (f'<g transform="rotate({rot} {f(x)} {f(y)})"><path d="{d}" style="fill:var(--pz-leaf)"/>'
            f'<g fill="none" style="stroke:var(--pz-paper)" stroke-opacity=".26" stroke-width=".9" stroke-linecap="round"><path d="{rib}"/>{veins}</g></g>')

def globe(x, y, rad, n=22):
    """A seed head: short rays with a dot at each end."""
    parts=[]
    for i in range(n):
        a = i * 2 * math.pi / n + 0.2
        x1, y1 = x + math.cos(a) * rad * 0.3, y + math.sin(a) * rad * 0.3
        x2, y2 = x + math.cos(a) * rad, y + math.sin(a) * rad
        parts.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"/><circle cx="{f(x2)}" cy="{f(y2)}" r="1.4"/>')
    return f'<g style="stroke:var(--pz-ink);fill:var(--pz-ink)" stroke-width="1">{"".join(parts)}<circle cx="{f(x)}" cy="{f(y)}" r="2.2" stroke="none"/></g>'

def tree(x, y, h, r_crown, color):
    """A small far tree: a stem and a round crown, with a notch of light on one side."""
    return (f'<g style="fill:{color};stroke:{color}"><line x1="{f(x)}" y1="{f(y)}" x2="{f(x)}" y2="{f(y-h)}" stroke-width="1.4"/>'
            f'<circle cx="{f(x)}" cy="{f(y-h)}" r="{f(r_crown)}" stroke="none"/></g>')

def flora():
    r = random.Random(9)
    back, front = [], []
    def cluster(x0, x1, n, base_y, hmin, hmax, lean_dir, color_back, wmin=5, wmax=9):
        for i in range(n):
            x = r.uniform(x0, x1)
            h = r.uniform(hmin, hmax)
            lean = lean_dir * r.uniform(0.08, 0.5) * h + r.uniform(-10, 10)
            w = r.uniform(wmin, wmax)
            y = base_y + r.uniform(-4, 8)
            d = blade(x, y, h, lean, w, curve=r.uniform(0.42, 0.6))
            (back if r.random() < color_back else front).append(f'<path d="{d}"/>')
    cluster(-6, 120, 11, 574, 72, 158, -1, 0.45)
    cluster(118, 206, 6, 574, 50, 94, -1, 0.5, 3.5, 6)
    cluster(338, 428, 6, 574, 54, 102, 1, 0.5, 3.5, 6)
    cluster(420, 540, 11, 574, 72, 166, 1, 0.45)
    reeds = ''.join([reed(66, 574, 196, -18, 32, 9), reed(116, 574, 224, -8, 36, 9.5), reed(158, 574, 164, -26, 26, 8),
                     reed(456, 574, 210, 16, 34, 9.5), reed(500, 574, 174, 26, 28, 8), reed(410, 574, 134, 10, 22, 7)])
    leaves = ''.join([leaf(22, 576, 172, -40, 36, 0), leaf(94, 578, 126, 10, 24, 12), leaf(518, 576, 184, 8, 38, -2), leaf(442, 578, 116, -16, 24, 8)])
    globes = globe(198, 452, 15) + globe(380, 470, 12) + globe(40, 426, 11)
    stems = (f'<g fill="none" style="stroke:var(--pz-ink)" stroke-width="1.6" stroke-linecap="round">'
             f'<path d="M192 574 Q198 510 198 466"/><path d="M384 574 Q382 530 380 482"/><path d="M36 574 Q42 500 40 437"/></g>')
    # far trees along the second ridge, small, in the colour of the hill in front of them
    trees = ''.join([tree(452, 357, 11, 6, 'var(--pz-h3)'), tree(470, 354, 15, 8, 'var(--pz-h3)'), tree(486, 356, 9, 5, 'var(--pz-h3)'),
                     tree(516, 352, 13, 7, 'var(--pz-h3)'), tree(536, 355, 8, 4.5, 'var(--pz-h3)'),
                     tree(24, 364, 12, 6.5, 'var(--pz-h3)'), tree(44, 361, 16, 8.5, 'var(--pz-h3)'), tree(66, 365, 9, 5, 'var(--pz-h3)')])
    body = (f'<g style="fill:var(--pz-h4)">{"".join(back)}</g>'
            f'{leaves}'
            f'<g style="fill:var(--pz-ink)">{"".join(front)}</g>'
            f'{stems}{globes}{reeds}')
    global TREES
    TREES = trees
    return svg(body, '', 'poster__flora')

if __name__ == '__main__':
    grain = grain_png()
    flora_svg = flora()  # first: it also lays out the far trees that hills() prints
    layers = {'sky': sky(), 'clouds': clouds(), 'sun': sun(grain), 'ring': ring(), 'hills': hills(), 'flora': flora_svg}
    for name, markup in layers.items():
        with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh: fh.write(markup)
    print('wrote', ', '.join(f'{k}.svg ({len(v)} bytes)' for k, v in layers.items()), 'to', os.path.relpath(OUT, ROOT))
    if '--preview' in sys.argv:
        css = """
.plate{position:relative;width:528px;height:560px;overflow:hidden;border-radius:4px;box-shadow:0 0 0 1px rgba(17,17,16,.12);
 --pz-sky0:#f8dbc7;--pz-sky1:#f5b58e;--pz-sky2:#ef8e5e;--pz-sky3:#e8744a;--pz-sun0:#ffb067;--pz-sun1:#ff5a2b;--pz-sun2:#d8401b;
 --pz-h1:#e1915f;--pz-h2:#c35f3b;--pz-h3:#8c3a2c;--pz-h4:#4b2531;--pz-h5:#221a21;--pz-leaf:#5e2e3e;--pz-ink:#1b1719;--pz-paper:#f3f1ec;--pz-tick:#1b1719;--pz-tick-o:.42;--pz-rim:32%;--pz-line:.2;--pz-glow:55%;--pz-glow2:18%;--pz-star:0;--pz-moon:0}
.plate.night{--pz-sky0:#223050;--pz-sky1:#182440;--pz-sky2:#111a30;--pz-sky3:#0d1526;--pz-sun0:#fff7e8;--pz-sun1:#f3f1ec;--pz-sun2:#cfc9bb;
 --pz-h1:#35476e;--pz-h2:#283a5e;--pz-h3:#1c2b4a;--pz-h4:#121d36;--pz-h5:#090e1b;--pz-leaf:#1b2b4c;--pz-ink:#06090f;--pz-tick:#f3f1ec;--pz-tick-o:.7;--pz-rim:16%;--pz-line:.1;--pz-glow:34%;--pz-glow2:10%;--pz-star:1;--pz-moon:1}
.plate svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.plate .glow{position:absolute;inset:0;background:radial-gradient(circle at 60.2% 54.3%, color-mix(in srgb, var(--pz-sun0) var(--pz-glow), transparent), color-mix(in srgb, var(--pz-sun0) var(--pz-glow2), transparent) 20%, transparent 46%)}
body{margin:0;background:#f3f1ec;display:flex;gap:40px;padding:40px}
"""
        where = os.path.join(tempfile.gettempdir(), 'kefanxu-poster')
        os.makedirs(where, exist_ok=True)
        for name, cls in [('preview', ''), ('preview-night', ' night')]:
            plate = layers['sky'] + '<div class="glow"></div>' + ''.join(layers[k] for k in ['clouds', 'sun', 'ring', 'hills', 'flora'])
            with open(os.path.join(where, f'{name}.html'), 'w') as fh:
                fh.write(f'<!doctype html><meta charset="utf-8"><title>Poster {cls or "day"}</title><style>{css}</style><div class="plate{cls}">{plate}</div>')
        print('previews in', where)
