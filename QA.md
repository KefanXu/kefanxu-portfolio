# Validation report

## Thirteenth-iteration validation — September 15, 2026

This record covers the header reading-progress startup correction.

- The progress line now follows the document's measured scroll progress directly. The redundant spring that made the line spend roughly one second catching up after reload or restored scrolling was removed.
- The CSS fallback initializes the line at `scaleX(0)`, so the first rendered frame at the top of `#home` is empty instead of briefly showing a full-width line.
- A normal full-page visit now starts at the introduction and clears a stale section hash before browser restoration can move the page. In-page section links continue to update the hash and scroll normally; direct `#project/...` reader links remain available for sharing.
- At **1280 × 720**, opening a fresh `#projects` URL cleared the hash and rendered at scroll position 0 with scale 0. Refreshing remained at 0 on the first measured frame, after 120 ms, and after 1.02 seconds. Selecting Projects after load still reached the section at scroll position 3067.
- At **390 × 844**, both a fresh `#projects` URL and a subsequent refresh rendered at scroll position 0 with scale 0. Opening the mobile menu and selecting Projects still reached the section at scroll position 3922 with progress 0.256776.
- Strict TypeScript and `git diff --check` passed. Vite 5.4.21 transformed **1,666 modules** in **2.10 seconds**. JavaScript is **369.17 kB / 116.35 kB gzip** and CSS is **136.23 kB / 25.12 kB gzip**.
- The final browser check reported no console errors or warnings.

## Twelfth-iteration validation — September 15, 2026

This record covers the manuscript-grounded Caregiving, Planneregy, and Physicify readers, the revised CareWork and EcoCare media sets, and the glass header.

- Caregiving now reports the paper's final corpus: **427 posts** from **118 informal caregivers** across **five undisclosed subreddits**, plus **888 comments** from the 78 threads containing both conflicts and life-changing events. Its two published figures load at 3030 × 1614 and 4752 × 3722, appear full width, and include the paper, authorship, transformation, and CC BY 4.0 attribution.
- Planneregy reports **17 recruited / 16 completed**, **42 days**, **48 distinct strategies**, **203 keyword instances**, and **434 activity plans**. Four verified interface, workflow, study-overview, and interview-method images are presented with source and license credits. The copy distinguishes the unrecorded week-three check-in and avoids causal claims about increased physical activity.
- Physicify reports **20 enrolled / 17 completed**, two 14-day phases, **248 reported plans**, and three interviews per participant. Three original Figma interface exports show the history summary, contextual calendar, and record-detail views. The reader states that the exploratory study does not establish improved adherence.
- CareWork now contains only its Create, Evaluate, and Iterate interface stages. At 948px each figure renders **785px wide** in a single-column documentation layout. EcoCare contains only its proposed interface figure.
- At **948 × 1250**, all refreshed media loaded at their expected intrinsic dimensions and every reader had zero horizontal overflow. At **390 × 844**, Caregiving, Planneregy, Physicify, CareWork, and EcoCare respectively render 2, 4, 3, 3, and 1 figures with zero horizontal overflow.
- The narrow-width book transition was exercised at **390 × 844**. Its scene occupied the complete viewport, its opening paper remained inside the viewport at approximately **192 × 244px**, body scrolling was locked during the transition, and the final Caregiving dialog opened without overflow.
- The sticky header computes to `blur(22px) saturate(1.55)` at desktop and mobile widths, with a translucent white-to-sage gradient, layered highlights, a subtle border and shadow, and no layout overflow.
- Strict TypeScript and `git diff --check` passed. A production build with `BASE_PATH=/KefanXu_Web/` passed: Vite 5.4.21 transformed **1,666 modules** in **2.00 seconds**. JavaScript is **368.14 kB / 116.10 kB gzip** and CSS is **136.24 kB / 25.13 kB gzip**.
- The final browser session reported no console errors or warnings.

The supplied manuscripts were treated as research sources, while personal contribution statements remain tied to the existing portfolio record and use team-based wording where the papers do not establish sole responsibility. A separate native Safari run, physical touch, screen-reader use, and reduced-motion media emulation were not exercised in this iteration.

## Eleventh-iteration validation — September 15, 2026

This record covers the narrow-width project-opening correction and the revised Moodloop media set.

- The tablet gallery placement rules are now scoped to direct children of `.research-folio-grid`. The portaled `.book-opening-scene` therefore remains full-viewport instead of inheriting the final-card half-width rule between 561 and 1000px.
- Animation-layer geometry was checked at **560, 561, 709, 945, 1000, and 1001px**. At every width its left edge was 0 and its rendered width exactly matched `window.innerWidth`.
- At **709 × 964**, the DUCSS book opened as a centered **324 × 413px** spread against a complete backdrop, handed off to the project reader, and left neither document nor dialog horizontal overflow.
- The selected Moodloop findings diagram was removed from the case study, its dedicated layout rules, asset record, and unused 1.03 MB SVG were removed with it. The reader now presents two sequentially numbered figures: the phone interface and six-week study design.
- Moodloop's two remaining images loaded successfully at desktop width. At **390 × 844** they use a single **308px** column, and both the document and dialog report zero horizontal overflow.
- Browser validation produced no console errors or warnings.
- Strict TypeScript, `git diff --check`, and the `BASE_PATH=/KefanXu_Web/` production build passed. Vite 5.4.21 transformed **1,666 modules**; the application bundle is **362.27 kB / 114.16 kB gzip** JavaScript and **134.14 kB / 24.63 kB gzip** CSS.

The transition was visually reviewed in the controlled local browser. A separate native Safari run, physical touch, and screen-reader use were not exercised in this iteration.

## Tenth-iteration validation — September 15, 2026

This record covers inline playback for the DUCSS and Moodloop project films.

- Each project reader now presents a keyboard-native poster button and replaces it in place with a responsive, privacy-enhanced `youtube-nocookie.com` player after an explicit Play action. YouTube is not contacted for the player until the visitor chooses to play it.
- DUCSS loaded `uYy52PRKmug` inside `#project/ducss`, and Moodloop loaded `otqw3gwkwbE` inside `#project/moodloop`. In both cases the local project URL remained unchanged and the video played inside the existing 16:9 media frame.
- The iframe receives focus after activation, has a descriptive title, supports fullscreen and inline mobile playback, and leaves an “Open on YouTube” caption link as a fallback.
- Desktop inspection measured the player at **803 × 452px**. At **390 × 844**, the player measured **320 × 180px** and both the document and reader reported zero horizontal overflow.
- A browser reload and both playback checks produced no console errors or warnings.
- Strict TypeScript, `git diff --check`, and the `BASE_PATH=/KefanXu_Web/` production build passed. Vite 5.4.21 transformed **1,666 modules**; the application bundle is **362.57 kB / 114.23 kB gzip** JavaScript and **134.60 kB / 24.67 kB gzip** CSS.

Playback was verified in the controlled local browser. A separate native Safari run, screen-reader use, and physical touch were not exercised in this iteration.

## Ninth-iteration validation — September 15, 2026

This record covers the new CareWork and EcoCare books and project readers.

- Strict TypeScript, `git diff --check`, and the `BASE_PATH=/KefanXu_Web/` production build passed. Vite 5.4.21 transformed **1,666 modules**; the application bundle is **362.01 kB / 113.99 kB gzip** JavaScript and **134.26 kB / 24.60 kB gzip** CSS.
- The gallery now contains **nine** books. At **1200 × 900** it forms a balanced 3 × 3 grid; at **709 × 964** it uses two columns and centers EcoCare in the final row; at **390 × 844** it uses one 342px column. Both new 850 × 850 cover images loaded at every inspected size.
- CareWork opens as **08 / 09** and EcoCare as **09 / 09**. Reader pagination moves from CareWork to EcoCare and wraps from EcoCare to DUCSS.
- CareWork displays five manuscript-derived figures: the HomeWork cycle, three legible Create/Evaluate/Iterate interface crops, and the prototype-study flow. EcoCare displays its proposed interface and planned study procedure. All seven reader images loaded at their intended intrinsic dimensions.
- Both readers were reviewed at desktop, tablet, and mobile widths. Their metadata, captions, evidence rows, and custom media layouts remain readable. At 390px, each reader dialog's client width and scroll width are both 390px.
- CareWork copy distinguishes a prototype session with fictional cases and synthesized data from a field deployment or clinical outcome study. It reports six formative interviews, 11 prototype sessions, and 14 unique healthcare professionals because three participated in both studies.
- EcoCare is consistently labeled as a proposed system and planned mixed-methods study. The 22 patient interviews are identified as foundational work from the preceding dissertation chapter rather than as an EcoCare evaluation.
- Neither anonymous/submitted CareWork nor proposed EcoCare was added to the accepted-publications list, and the private source PDFs are not exposed as public downloads.

The readers were verified in the controlled local browser. Physical touch, a native Safari run, screen-reader use, and reduced-motion media emulation were not exercised in this iteration.

## Eighth-iteration validation — September 15, 2026

This record covers the new Moodloop book and case-study reader.

- Strict TypeScript and `git diff --check` passed.
- `BASE_PATH=/KefanXu_Web/` production bundling passed with Vite 5.4.21: **1,666 modules**, **353.70 kB / 111.61 kB gzip** JavaScript, and **132.60 kB / 24.40 kB gzip** CSS.
- All five new Moodloop assets are present in the production output: the 850 × 850 conceptual cover, local video poster, Figma phone mockup, six-week study diagram, and findings diagram.
- The reader was reviewed at **939 × 964**, **709 × 964**, and **390 × 844**. The video poster, two-column interface/study composition, full-width findings figure, metadata, evidence, and editorial copy remain readable and aligned. The 390px reader has no horizontal overflow: dialog and document client/scroll widths all match the 390px viewport.
- The animated Moodloop book opens into `#project/moodloop`; its reader reports **07 / 07**, and previous/next navigation wraps from Moodloop to DUCSS. The new book is present in the one-column mobile gallery with the matching ceramic artwork.
- A full browser reload after implementation produced no new console errors or warnings. Earlier logged entries came from a transient hot-module update while the book and project records were being added separately; the gallery now also tolerates that temporary mismatch without throwing.
- The public case-study copy uses the manuscript’s consistent 42-day/six-week duration, 15 completing participants, 45 valid interviews, and 594 in-window reports. Conflicting draft annotation totals and placeholder venue metadata are not published.

The supplied manuscript is treated as source material rather than a downloadable publication. The project-film thumbnail links to YouTube; third-party playback was not embedded. Screen-reader use, physical touch, and reduced-motion media emulation were not exercised in this iteration.

## Seventh-iteration validation — September 15, 2026

This is the current record for the smaller hero title, pill-shaped primary action, persistent hero artwork, and modality-aware project focus restoration.

- Strict TypeScript and `git diff --check` passed.
- An isolated production build with **Node.js 24.19.0** and `BASE_PATH=/KefanXu_Web/` passed: Vite 5.4.21 transformed **1,666 modules** and bundled in **2.07 seconds**.
- Main JavaScript: **348.62 kB / 110.10 kB gzip**. CSS: **129.02 kB / 23.79 kB gzip**. The build emits one application JavaScript file and no Three.js lazy chunk; the retired scene is no longer reachable from the homepage bundle.
- All **21** referenced asset URLs resolved beneath `/KefanXu_Web/`. The existing work-only asset checker’s individual URL checks all pass; its final legacy assertion still expects the intentionally removed dynamic hero module and therefore needs separate maintenance.
- The Scholar refresh could not reach the network and retained the checked-in publication data as designed.
- At **709 × 964**, the title computes to 52.466px, the primary action has a 999px radius, the preferred `care-ecology.webp` is the only hero image, and the page contains no hero canvas or interaction controls. The document has no horizontal overflow.
- At **320 × 844**, the title computes to 48px, the hero artwork fits a 272px column, the pill action remains intact, and the document has no horizontal overflow.
- A pointer-opened DUCSS reader closed to `#projects` with focus on the page body and no visible focus state. A keyboard-opened reader closed to the exact DUCSS “View project” link with `:focus-visible` active. This preserves keyboard orientation while preventing Safari’s pointer-triggered green selection ring.
- Reloading the local page showed the final still life immediately; the DOM contains one descriptive hero image, zero canvases, and zero obsolete drag/pause/reset controls.

The modality behavior was verified in the controlled local browser. A separate native Safari automation run, physical touch, screen-reader use, and clipboard denial were not exercised. No ESLint pass is claimed because the repository has no ESLint configuration.

## Historical sixth-iteration record — September 14, 2026

This historical record covers the restored side-by-side hero, four-form sculpture with automatic rotation and pause, six raster book illustrations, outlined pill controls, and publication fields with bottom rules.

- Final source, public assets, scripts, manifests, and configuration were mirrored into the existing isolated validation directory, removing obsolete mirrored source files and reusing its validated dependencies.
- With **Node.js 24.19.0**, `BASE_PATH=/KefanXu_Web/ npm run build` passed, including the Scholar prebuild fallback, strict TypeScript check, and Vite 5.4.21.
- Vite transformed **1,672 modules** and bundled in **2.18 seconds**.
- Main JavaScript: **352.39 kB / 111.57 kB gzip**. CSS: **130.71 kB / 24.14 kB gzip**. Lazy sculpture scene: **546.39 kB / 138.67 kB gzip**.
- The expected Scholar network failure retained existing publication data. Stale Browserslist data and the lazy scene exceeding Vite’s standard 500 kB threshold produced non-blocking notices.
- **All 22 distinct asset URLs passed** beneath `/KefanXu_Web/`, including all six book illustrations, hero fallback, dynamic sculpture import, fonts, CV, bundles, and documented project figures. No root-relative `/assets/` references bypassed the configured base.
- SHA-256 comparison matched **all 100** source, public, script, configuration, and manifest files. No obsolete source files remained in the build mirror.
- This verification did not modify the repository’s tracked `node_modules` or `dist`; `git diff --check` passed.

Current browser checks:

- Visually reviewed the restored hero at **709px, 939px, 1440px, and 320px**. The text and sculpture sit side by side above 640px and stack on smaller screens. Boundary checks at **640px, 641px, and 1050px** found no horizontal overflow; the artwork caption remains above the research-area divider. At 320px, the sculpture controls fit their 229px row without overflow.
- Observed automatic rotation, paused and resumed it, dragged the sculpture to a side view, and reset it with both the button and Home key. The simplified forms remain inside the canvas during these interactions.
- Reviewed all three replacement illustrations in the actual gallery at 709px. All six book image elements loaded successfully, with the same raster-image treatment.
- Computed styles confirm 999px radii for the outlined CV and research-perspective controls; filled primary actions remain rectangular. Publication search and year fields have only a 1px bottom border and zero corner radius.
- At 390px, searching `reflective` and selecting 2024 returned **1 of 9 publications**. The result expanded successfully; clearing the filters restored the full list. Both fields retain 16px text and fit without horizontal overflow.
- The refreshed local preview reported no browser errors or warnings during inspection.

A focused scene harness, using actual geometry with mocked rendering and browser lifecycle APIs, verified consistent automatic progression at 30/60/120 fps, explicit pause/resume, a four-second pause after manual interaction, reduced-motion behavior, hidden/offscreen suspension without time catch-up, and one-time resource cleanup. Below 20 fps, the existing capped frame delta can slow the rotation; its duration is intentionally approximate.

Physical touch, screen-reader use, clipboard denial, and actual browser WebGL context loss were not tested in this iteration. Reduced motion was verified in the scene harness and source, without browser media emulation. Prior browser and lifecycle results below describe their respective historical revisions. No ESLint pass is claimed because the repository has no ESLint configuration.

## Historical fifth-iteration record — September 13, 2026

This historical record covers the editorial hero layout, restored rectangular controls and underlined links, expandable publication records, and the book-paper transition into project readers.

- Production validation used the existing isolated build directory and Node.js 24.19.0; repository `node_modules` and `dist` were untouched.
- `BASE_PATH=/KefanXu_Web/ npm run build` passed: Scholar fallback, strict TypeScript, and Vite 5.4.21; **1,672 modules**, **2.11 seconds** of bundling.
- Main JavaScript: **356.03 kB / 112.61 kB gzip**. CSS: **133.00 kB / 24.70 kB gzip**. Lazy sculpture: **548.98 kB / 139.49 kB gzip**, unchanged.
- Scholar was unavailable and retained existing data. Stale Browserslist data and the lazy scene exceeding Vite’s 500 kB threshold produced non-blocking notices.
- **All 19 asset URLs passed** beneath `/KefanXu_Web/`; dynamic imports, fonts, CV, artwork, and project figures resolved without root-relative asset escapes.
- SHA-256 comparison matched **all 97** source, public, script, configuration, and manifest files; no obsolete source files remained in the build mirror.

The main implementation agent confirmed these browser checks:

- Hero layout reviewed at **939px, 390px, 768px, and 1440px**; the responsive composition and ceramic artwork remained intact. Final boundary checks at **320px, 640px, 1050px, and 1200px** found no horizontal overflow; the artwork caption stayed above the research-area divider. The final 1440px composition retained a 26.5px gap above that divider.
- At 939px, the book’s actual paper visibly expanded to approximately **922 × 949px** during the reader handoff. The transparent dialog received title focus with scrolling locked; the transition overlay was removed on completion.
- Closing the reader restored the exact book opener. Enter → Tab → Escape during early opening canceled cleanly. At **320px**, the paper-to-reader handoff was observed with title focus and no horizontal overflow. Escape during the handoff closed the reader, removed the overlay and inert state, restored body scrolling, and returned focus to the exact DUCSS opener.
- Opening the first publication left all eight closed panels inert. Space closed it, and Tab reached the next publication trigger.
- Searching `reflective` returned one of nine papers. “Explore Planneregy” opened its reader; closing restored the project link’s focus and retained the expanded publication. At **320px**, its expanded details fit a 272px content column without horizontal overflow; search fields retained 2px rectangular corners.
- A source-wide CSS scan found no pill radii; remaining curved shapes belong to artwork or modest 2–3px rectangular control/panel corners. Shared stylesheet parsing and `git diff --check` passed.

Reduced-motion behavior was reviewed in source, without browser media emulation. Physical touch gestures, screen-reader use, forced clipboard denial, and browser WebGL context loss were not tested in this iteration. Earlier geometry/material/lifecycle results remain documented below. No ESLint pass is claimed because the repository has no ESLint configuration.

## Historical fourth-iteration record — September 13, 2026

This historical record covers the richer hero sculpture, more visible ceramic surface detail, complete viewing-angle framing, and resource cleanup.

### Final production build and assets

Current source, public assets, scripts, manifests, and configuration were mirrored into the existing isolated validation directory, removing obsolete mirrored source files. The existing validated dependencies were reused. This check did not change the repository’s tracked dependencies or build output.

- Runtime: Node.js 24.19.0.
- `BASE_PATH=/KefanXu_Web/ npm run build` passed, including the Scholar prebuild hook, strict TypeScript check, and Vite 5.4.21.
- Vite transformed **1,670 modules** and completed bundling in 2.09 seconds.
- Main JavaScript: **352.32 kB / 111.58 kB gzip**.
- CSS: **128.76 kB / 24.02 kB gzip**.
- Lazy-loaded hero scene: **548.98 kB / 139.49 kB gzip**. The material and geometry helpers remain inside this separate download.
- The expected Scholar network failure retained the generated publication data. The stale Browserslist-data notice and standard warning for the lazy scene exceeding 500 kB remained non-blocking.
- **All 19 asset URLs passed** under `/KefanXu_Web/`, including the dynamic hero import, fonts, CV, bundles, conceptual artwork, and documented project figures. The hero preload resolves to `/KefanXu_Web/images/care-ecology.webp`; no root-relative `/assets/` references bypass the configured base.
- SHA-256 comparison confirmed **95 source, public, script, configuration, and manifest files** match the final production snapshot.

The ceramic finishes use nine deterministic, locally generated 512px textures; no external texture download was introduced. Tests confirmed integer UV repeats, mipmaps and anisotropy settings, sRGB albedo with non-color bump/roughness maps, distinct finishes, roughness ranging from 0.780 to 0.980, and shared texture ownership.

### Current browser checks

The main implementation agent confirmed these checks in the local browser preview:

- Artwork composition, lighting, and visible surface detail reviewed at **939 × 964** and **1440 × 1000**.
- At 939px, dragging exposed side and rear views; reset restored the composition. Keyboard arrows and R were exercised.
- At **390 × 844**, the sculpture rendered in a 342px square, with exactly one canvas and the ready state active. Main-page client and scroll widths both measured 390px.
- Native scrolling from 0px to 241px at 939px visibly turned the sculpture, which stayed ready.
- After the final factory-cleanup update, the preview again showed the ready state, exactly one canvas, and no horizontal overflow at the restored viewport.

The rest of the website was unchanged in this iteration. Its book-opening, modal focus, publication, responsive, and navigation checks remain in the historical third-iteration record.

### Geometry and lifecycle verification

The geometry helper averages normals at duplicate UV-seam and pole positions without altering positions or UVs. Its framing calculation covers rotation around the vertical axis and the supported camera pitch range. Side/rear framing was also inspected in the browser.

The scene lifecycle review reported **ten scripted fault-injection scenarios passing**, covering partial construction, mesh/listener/observer/resize failures, repeated disposal, and cleanup exceptions. Scene cleanup calls the ceramic material set’s disposal callback once.

A separate five-case test exercised the real material-factory control flow with mocked Three.js resource constructors:

- Partial texture construction cleaned previously allocated textures.
- Texture configuration failure cleaned both that partial set and previously completed sets.
- Partial material construction cleaned all nine maps and previously constructed materials.
- Construction failure plus disposal exceptions still cleaned every remaining resource and preserved the original construction error.
- Repeated disposal with individual cleanup exceptions released all nine maps and five materials exactly once.

Cleanup changes preserve all visual material parameters. The final production TypeScript check passed after both factory and scene cleanup were complete.

### Current validation limits

Reduced-motion behavior remains reviewed in source, without browser media emulation. No physical touch-gesture session or screen-reader audit was performed. Browser WebGL context loss and clipboard-denial behavior were not forcibly triggered during this iteration; scripted cleanup tests are separate from real driver-failure testing. The selectable-text clipboard fallback remains implemented. No ESLint pass is claimed because the repository has no ESLint configuration.

## Historical third-iteration record — September 13, 2026

This historical record covers the six-book collection and opening transitions, abstract research and practice sculptures, pill-shaped controls, and additional scroll motion.

### Final production build

All source, public assets, scripts, manifests, and build configuration were mirrored into the existing isolated validation directory. Removed source files were removed from that mirror. The repository’s tracked dependencies and build output were not changed by this verification; the existing validated dependencies were reused because the lockfile did not change during this iteration.

- Runtime: Node.js 24.19.0.
- Command: `BASE_PATH=/KefanXu_Web/ npm run build` — passed with exit code 0, including the Scholar prebuild hook, strict TypeScript check, and Vite 5.4.21.
- Vite transformed 1,668 modules and completed bundling in 3.39 seconds.
- Main JavaScript: **352.20 kB / 111.51 kB gzip**.
- CSS: **128.76 kB / 24.02 kB gzip**.
- Lazy-loaded Three.js scene: **541.24 kB / 136.49 kB gzip**, unchanged from the prior iteration.
- The expected Scholar network failure retained the checked-in generated publication data. The existing stale Browserslist-data notice and standard warning for the Three.js chunk exceeding 500 kB were the only build notices; neither prevented the build.

The asset-path checker was updated to follow image metadata moved into `ResearchBook.tsx`. **All 19 distinct asset URLs passed** beneath `/KefanXu_Web/`, including the lazy scene import, five fonts, CV, clover, favicon, main bundles, hero artwork, three book illustrations, and four documented project figures. No root-relative `/assets/` references bypassed the deployment base. The hero preload remains `/KefanXu_Web/images/care-ecology.webp` and resolves to the emitted asset. SHA-256 comparison confirmed that all 93 source, public, script, configuration, and manifest files match the validated production snapshot.

### Current browser checks

The main implementation agent confirmed these third-iteration checks in the local browser preview:

- Desktop layouts reviewed at 939px and 1280px. All six books appeared in two columns at 939px and three columns at 1280px.
- Main page and project readers had no horizontal overflow at 390px and 320px.
- The book-opening spread visibly opened to 145 degrees and was reviewed at 939px, 390px, and 320px.
- Pill-shaped controls were inspected; their border radius was 999px.
- At a 740 × 360 landscape viewport, the expanded mobile menu scrolled to its CV link. The menu reached a scroll position of 74px, with the CV link fully visible between vertical positions 287px and 335px.
- Publication search for `reflective` returned one of nine papers. Citation disclosure and copying worked.
- The three abstract research stages and continuous scroll-driven orbit rotation were inspected. All three new practice sculptures were visually reviewed.
- The Projects navigation item became active at the appropriate scroll position at 1280px.
- Previous/next reader navigation from PECSS to Physicify worked.
- Keyboard opening of DUCSS followed by Tab during the opening overlay kept the page background inert, body scrolling locked, and the opening status present. When the project dialog opened, its title received focus; body scrolling remained locked through the native modal.
- Closing that reader cleared the explicit inert state and scroll lock and returned focus to the exact “Open DUCSS project” link.
- A separate Enter → Tab → Escape sequence during the opening animation canceled the transition, cleared the inert state and scroll lock, restored focus to the exact DUCSS opener, and returned the URL to `#projects`.

The hero’s 3D implementation was unchanged in this iteration; its prior browser checks for dragging, keyboard controls, scroll response, and lighting are preserved in the historical record below.

### Current validation limits

Reduced-motion behavior was reviewed in source, including motion-free book opening, static sculpture layers, and disabled automatic mesh rotation. It was not tested through browser media emulation. Touch gestures, a screen-reader session, and forced clipboard-denial behavior were not exercised. The existing selectable-text clipboard fallback remains in the source. No ESLint pass is claimed because the repository has no ESLint configuration.

## Historical second-iteration record

Second-iteration validation on September 13, 2026, covering the interactive sculpture, expanded research narrative, and project readers.

### Clean installation and production build

A separate validation directory was used, leaving this repository’s dependencies and build output unchanged.

- Runtime: Node.js 24.19.0.
- Fresh install: `npm ci --registry=https://registry.npmjs.org --no-audit --no-fund` passed, installing 289 packages from the updated lockfile.
- Production check: `BASE_PATH=/KefanXu_Web/ npm run build` passed. This ran the Scholar synchronization hook, TypeScript, and Vite 5.4.21.
- Latest source, public assets, scripts, manifests, and configuration were mirrored into the validation directory, including removal of files no longer present in the repository.
- Vite transformed 1,667 modules. After the final contribution-copy edits, TypeScript and Vite were rerun successfully, including the `/KefanXu_Web/` base. Main JavaScript: 336.13 kB / 106.43 kB gzip. CSS: 123.44 kB / 23.03 kB gzip.
- The dynamically imported Three.js scene is a separate 541.24 kB / 136.49 kB gzip chunk. It triggers Vite’s standard 500 kB minified-chunk warning; the build succeeds. The main page first displays the static artwork, and it remains the fallback if WebGL is unavailable.
- Case-study source data is 11.3 kB. The four documented project figures total 290.1 kB; the largest is the MotionShift figure at 143.2 kB.

The Scholar refresh could not access the network in the validation environment. Its existing fallback retained the generated publication data, and the build completed successfully. Existing dependency deprecation notices and an older Browserslist dataset did not prevent installation or compilation.

### Static assets and subpath hosting

A script checked the emitted HTML, CSS, JavaScript, relative module imports, and dynamically assembled image paths against the build output. All 19 distinct asset URLs resolved beneath `/KefanXu_Web/`:

- Five self-hosted font files.
- Curriculum vitae PDF, clover, and favicon.
- Main JavaScript, CSS, and the dynamically imported Three.js scene bundle.
- Hero image and three research illustrations.
- Four documented project figures: one MotionShift figure and three CHR panels.

The emitted hero preload is `/KefanXu_Web/images/care-ecology.webp`, matches the image URL, and resolves to the built file. No root-relative `/assets/` references bypassed the configured base.

### Browser checks

The main implementation agent confirmed these second-iteration checks in the local browser preview:

- The hero WebGL scene rendered. Pointer dragging visibly changed its view; keyboard arrows, R, and reset controls were exercised.
- Scroll-driven mesh rotation was observed. The final matte grain, soft contact shadows, and lighting were reviewed on desktop.
- DOM inspection confirmed the page order: home, about, research, projects, practice, publications. The three-column research-practice layout was reviewed on desktop.
- At 870px, the research illustration remained beside the text. Selecting stage two and then scrolling changed the composition visibly to stage three.
- Clicking a case study opened the project dialog. Closing restored focus to the exact opener. Browser Forward reopened it; next-project navigation changed to Caregiving, and browser Back returned to the page.
- The PECSS case study loaded all three documented figures.
- Reloading a direct PECSS project URL at 390px opened the reader and focused its title. Tab focus stayed within the modal. Escape returned to `#projects`.
- The 390px project reader had no horizontal overflow: its client and scroll widths were both 375px after the scrollbar allowance.
- The main page had no horizontal overflow at 390px (375px client/scroll widths) or 320px (305px client/scroll widths). The Physicify dialog at 320px also measured 305px for both widths.
- The mobile navigation’s Research link worked. At an 844px viewport height, the complete selected stage-two illustration and accompanying text fit together; native scrolling advanced the illustration to stage three.
- The final browser console contained no errors or warnings.

These controls and widths were also checked during the initial redesign; they are recorded separately from the second-iteration checks:

- Publication search and year filtering, match counts, empty state, and filter reset.
- Citation disclosure and copying.
- Mobile navigation and Escape dismissal.
- Section anchor navigation.
- Layout review at viewport widths of 320, 360, 390, 768, 1280, and 1440 pixels, including corrections to horizontal overflow and responsive headline sizing.

### Accessibility and validation limits

Source inspection confirmed labeled publication controls, live result/copy feedback, native disclosure elements, author highlighting, mobile menu state attributes, and reduced-motion handling in Framer Motion, CSS, and the Three.js scene. The copy control has a selectable-text fallback when clipboard access fails. The project reader uses a native modal dialog and restores document scrolling when closed.

Reduced-motion support was checked in code; it was **not** tested through browser media emulation. Touch gestures were not exercised in the UI. Clipboard-denial fallback was inspected in code rather than forced in the browser. No screen-reader audit was performed.

### Project documentation

Four case studies retain explicit image placeholders: DUCSS, Caregiving, Planneregy, and Physicify. Their text is implemented, while original project screenshots or figures remain to be supplied. Trackya identifies the MotionShift imagery as a proposed interface, and PECSS identifies its CHR figures as mock-data research prototypes. Source-paper/license attribution is included with the documented figures.

The strict TypeScript check passed as part of the final production build. An earlier targeted ESLint attempt could not run because the repository had no ESLint configuration; no lint pass is claimed.
