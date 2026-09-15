# Kefan Xu — academic portfolio

A personal website for a PhD student in Human-Centered Computing at Georgia Tech. The design combines a white canvas, Crimson Text typography, muted teal, original sculptural artwork, and restrained interaction.

## What is included

- A side-by-side introduction with a restrained serif headline, academic affiliation, concise research statement, and a persistent ceramic still life. Ivory, teal, and sage forms are joined by a fine thread; the high-resolution WebP is shown immediately without a loading swap.
- An introduction followed by biography and education, research perspective, selected projects, research practice, publications, and contact.
- An abstract orbital illustration that changes from individual reflection to caregiving relationships to a wider ecology of care. Scroll position rotates its orbit layers and moves the sculptural forms. It stays beside the text above 760px and adapts to a compact sticky presentation on smaller screens.
- Nine physical book covers featuring original raster ceramic illustrations, scroll-driven perspective, and an animated opening spread whose paper expands into the project reader. All nine lead into project readers; modified clicks retain normal browser link behavior. Reduced-motion preferences skip the opening animation.
- Three abstract sculptural illustrations for design, development, and deployment, with scroll-driven assembly and layered movement.
- Nine project readers with context, design, study evidence, contributions, related papers, and previous/next navigation. Project links use shareable `#project/ID` URLs, so a static host can open them directly without server-side routing.
- Pill-shaped outlined controls and primary actions, with underlined secondary links and active navigation. Publication search and year fields use simple bottom rules.
- Searchable publication disclosures with author highlighting, abstracts or labeled abstract excerpts, related project links, and selectable/copyable BibTeX citations. Opening a paper reveals its details; collapsed panels remain outside keyboard focus.
- Masked hero typography, gentle hero parallax, staggered biography and publication reveals, and a reading-progress line.

## Run locally

Use Node.js 20.19 or newer; clean installation and production builds were verified with Node.js 24.19.0.

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

The existing Scholar sync runs before development and production builds. If Scholar is unavailable, it retains the checked-in publication data. Run `npm run sync:scholar` to refresh explicitly.

The default build uses `/`, suitable for Vercel and other hosts that serve the site from a root domain. Leave `BASE_PATH` unset for production deployment.

## Edit content and presentation

- `src/App.tsx`: navigation, section order, and contact.
- `src/components/academic/HeroIntro.tsx` and `HeroIntro.css`: side-by-side introduction, responsive headline, academic affiliation, research statement, and sculpture placement.
- `src/components/academic/About.tsx`: biography and education.
- `src/components/academic/HeroSculpture.tsx`: persistent hero artwork, intrinsic sizing, and accessible image description.
- `src/components/academic/heroSculptureScene.ts`, `ceramicMaterials.ts`, and `sculptureGeometry.ts`: retained experimental Three.js implementation; the current homepage does not load it.
- `src/components/academic/ResearchPerspective.tsx`: three research perspectives and the animated SVG illustration.
- `src/components/academic/ResearchGallery.tsx`: nine-book collection, scroll response, and the book-opening transition.
- `src/components/academic/ResearchBook.tsx`: metadata and image paths for all nine original raster book illustrations, with live HTML cover titles.
- `src/components/academic/ProjectDetail.tsx`: native dialog, project routes, focus restoration, and case-study layout.
- `src/data/projectCaseStudies.ts`: detailed project copy, study evidence, figures, source credits, and related papers.
- `src/data/portfolio.ts`: original project contributions, roles, collaborations, periods, and methods.
- `src/components/academic/ResearchPractice.tsx`: research methods, capabilities, tools, and animated sculptural SVG illustrations.
- `src/components/academic/Publications.tsx`: publication search, year filtering, expandable records, abstracts, related projects, and citations.
- `src/data/publications.ts` and `src/data/publications.generated.json`: publication data and local enrichments.
- `src/index.css` and component stylesheets: typography, layout, responsiveness, and motion.
- `src/assets/KefanXu_CV.pdf`: curriculum vitae.

## Project media

Fonts are self-hosted with their licenses in `src/assets/fonts/academic/`. Conceptual artwork provenance is documented in `ARTWORK.md`. All nine book illustrations are optimized WebPs in `public/images/`. The hero and gallery illustrations do not depict research systems or participants.

Project documentation lives in `public/images/projects/`:

- Trackya includes the proposed MotionShift interface figure from the related 2025 workshop paper. The case study identifies it as a proposed design, with source and license attribution.
- PECSS includes three panels from the published CHR prototype figure. The case study identifies these as mock-data research interfaces and credits the source paper.
- DUCSS and Moodloop include poster-first, privacy-enhanced YouTube players that open directly inside each project reader. Moodloop also includes original Figma interface and research-design exports.
- CareWork includes three legible interface stages from the supplied manuscript. EcoCare includes the proposed interface from the supplied thesis. The readers distinguish completed study evidence from proposed work.
- Caregiving includes the published four-phase analysis and temporal sense-making framework. Planneregy combines its author-supplied interaction sequence with published workflow, study, and interview figures. Physicify includes three original interface screens from the supplied Figma source.

To add project documentation, place image files in `public/images/projects/`, add a `figures` array of `{ src, alt, caption }` entries to the relevant record in `src/data/projectCaseStudies.ts`, and supply `figureSource` attribution when appropriate. Keep project evidence and personal contributions consistent with the original research records.

## Interaction and verification

Navigation uses native document scrolling, and motion honors the operating system’s reduced-motion preference. Project readers use native modal dialogs. Keyboard-opened readers restore focus to the exact initiating link, while pointer-opened readers close without leaving a Safari focus ring. Publication disclosure buttons expose their expanded state and keep collapsed panels inert; citations use native HTML details.

See `QA.md` for the clean-build results, asset-path checks, browser interactions exercised, and verification limits.
