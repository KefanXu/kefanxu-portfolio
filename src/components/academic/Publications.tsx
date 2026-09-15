import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Copy, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { publications } from '../../data/publications';
import { personalInfo } from '../../data/portfolio';
import { projectCaseStudies } from '../../data/projectCaseStudies';
import generatedPublications from '../../data/publications.generated.json';
import './Publications.css';

const orderedPublications = [...publications]
  .sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const dateOrder = (date?: string) => {
      const [, month = '0', day = '0'] = (date ?? '').split(/\D+/);
      return Number(month) * 100 + Number(day);
    };
    return dateOrder(b.publicationDate) - dateOrder(a.publicationDate);
  })
  .map((publication, index) => ({ ...publication, number: index + 1 }));

const publicationYears = [...new Set(orderedPublications.map(({ year }) => year))];
const projectByPublication = new Map(projectCaseStudies
  .filter((project) => project.publicationId)
  .map((project) => [project.publicationId, project]));

function Authors({ authors }: { authors: string[] }) {
  return <>{authors.map((author, index) => (
    <Fragment key={`${author}-${index}`}>
      {index > 0 && ', '}
      {author.toLowerCase().replace(/\s+/g, ' ').trim() === personalInfo.name.toLowerCase()
        ? <strong>{author}</strong> : author}
    </Fragment>
  ))}</>;
}


function Citation({ bibtex }: { bibtex: string }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const citationRef = useRef<HTMLTextAreaElement>(null);

  async function copyCitation() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(bibtex);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
      citationRef.current?.focus();
      citationRef.current?.select();
    }
  }

  return (
    <div className="pub-citation">
      <div className="pub-citation-toolbar">
        <span>BibTeX</span>
        <button className="pub-copy" type="button" onClick={copyCitation}>
          {copyState === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copyState === 'copied' ? 'Copied' : 'Copy citation'}
        </button>
      </div>
      <textarea
        ref={citationRef}
        className="pub-bibtex"
        aria-label="BibTeX citation"
        readOnly
        spellCheck={false}
        value={bibtex}
        rows={Math.min(bibtex.split('\n').length + 1, 13)}
      />
      <p className="pub-copy-status" role="status">
        {copyState === 'manual'
          ? 'Automatic copying is unavailable. The citation is selected; use your device’s copy command.'
          : copyState === 'copied' ? 'Citation copied to clipboard.' : ''}
      </p>
    </div>
  );
}

function PublicationRow({ publication, expanded, onToggle, animate }: {
  publication: (typeof orderedPublications)[number];
  expanded: boolean;
  onToggle: () => void;
  animate: boolean;
}) {
  const titleId = `pub-title-${publication.id}`;
  const panelId = `pub-panel-${publication.id}`;
  const project = projectByPublication.get(publication.id);
  const paperUrl = publication.doi || publication.scholarUrl;
  // The legacy CHR enrichment is a short summary. Present the checked-in
  // source abstract excerpt instead of labeling that summary as an abstract.
  const abstract = publication.id === 'cscw2024'
    ? generatedPublications.find((source) => source.doi === publication.doi)?.abstract || publication.abstract
    : publication.abstract;
  const isExcerpt = abstract ? /(?:…|\.\.\.)\s*$/.test(abstract) : false;

  return (
    <motion.li className="pub-row" data-expanded={expanded} initial={animate ? { opacity: 0, y: 28 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
      <h3 className="pub-row-heading" aria-labelledby={titleId}>
        <button className="pub-trigger" type="button" aria-expanded={expanded} aria-controls={panelId} aria-labelledby={titleId} onClick={(event) => { event.currentTarget.focus({ preventScroll: true }); onToggle(); }}>
          <span className="pub-index" aria-hidden="true">{String(publication.number).padStart(2, '0')}</span>
          <span className="pub-main">
            <span className="pub-meta">
              <span className="pub-year">{publication.year}</span>
              <span className="pub-venue">{publication.conference}</span>
              {publication.status && <span className="pub-status">{publication.status}</span>}
            </span>
            <span className="pub-title" id={titleId}>{publication.title}</span>
            <span className="pub-authors"><Authors authors={publication.authors} /></span>
          </span>
          <span className="pub-toggle" aria-hidden="true"><span>Details</span><ChevronDown size={19} strokeWidth={1.5} /></span>
        </button>
      </h3>
      <div
        className="pub-panel"
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        aria-hidden={!expanded}
        ref={(element) => { if (element) element.inert = !expanded; }}
      >
        <div className="pub-panel-clip">
          <div className="pub-panel-body">
            <div className="pub-overview">
              {abstract && <>
                <h4 className="pub-detail-heading">{isExcerpt ? 'Abstract excerpt' : 'Abstract'}</h4>
                <p className="pub-abstract">{abstract}</p>
              </>}
              <div className="pub-work-links">
                {paperUrl && <a className="text-link" href={paperUrl} target="_blank" rel="noopener noreferrer">
                  {publication.doi ? 'Read paper' : 'View on Google Scholar'} <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="pub-sr-only"> (opens in a new tab)</span>
                </a>}
                {project && <a className="text-link" href={`#project/${project.id}`} onClick={(event) => event.currentTarget.focus({ preventScroll: true })}>
                  Explore {project.name} <ArrowUpRight size={16} aria-hidden="true" />
                </a>}
              </div>
              {publication.bibtex && <details className="pub-detail">
                <summary>Cite this work</summary>
                <Citation bibtex={publication.bibtex} />
              </details>}
            </div>
            <dl className="pub-record">
              <div><dt>Published in</dt><dd>{publication.conference}</dd></div>
              <div><dt>Year</dt><dd>{publication.year}</dd></div>
              <div><dt>Authors</dt><dd><Authors authors={publication.authors} /></dd></div>
              {publication.status && <div><dt>Status</dt><dd>{publication.status}</dd></div>}
            </dl>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function Publications() {
  const reducedMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filteredPublications = useMemo(() => {
    const searchTerms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return orderedPublications.filter((publication) => {
      const searchableText = [publication.title, ...publication.authors, publication.conference, publication.year]
        .join(' ')
        .toLocaleLowerCase();
      return (year === 'all' || String(publication.year) === year)
        && searchTerms.every((term) => searchableText.includes(term));
    });
  }, [query, year]);

  useEffect(() => {
    // Keep a matching disclosure open, and forget one removed by filtering.
    setExpandedId((current) => current && filteredPublications.some(({ id }) => id === current) ? current : null);
  }, [filteredPublications]);


  return (
    <section className="pub-section" id="publications" aria-labelledby="publications-heading">
      <div className="section-shell">
        <motion.header className="pub-header" initial={reducedMotion ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease }}>
          <div>
            <p className="eyebrow">05 / PUBLICATIONS</p>
            <h2 id="publications-heading" className="section-heading">Publications</h2>
          </div>
          <a className="text-link pub-scholar" href={personalInfo.social.scholar} target="_blank" rel="noopener noreferrer">
            Google Scholar <ArrowUpRight size={17} aria-hidden="true" />
            <span className="pub-sr-only"> (opens in a new tab)</span>
          </a>
        </motion.header>

        <div className="pub-controls">
          <div className="pub-search-field">
            <label htmlFor="publication-search">Search publications</label>
            <div className="pub-search-input">
              <Search size={17} aria-hidden="true" />
              <input
                id="publication-search"
                type="search"
                placeholder="Title, author, or venue"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-controls="publication-list"
              />
            </div>
          </div>
          <div className="pub-year-field">
            <label htmlFor="publication-year">Year</label>
            <select id="publication-year" value={year} onChange={(event) => setYear(event.target.value)} aria-controls="publication-list">
              <option value="all">All years</option>
              {publicationYears.map((publicationYear) => <option key={publicationYear} value={publicationYear}>{publicationYear}</option>)}
            </select>
          </div>
          <p className="pub-result-count" role="status" aria-live="polite" aria-atomic="true">
            {filteredPublications.length === orderedPublications.length
              ? `${orderedPublications.length} publications`
              : `${filteredPublications.length} of ${orderedPublications.length} publications`}
          </p>
        </div>

        <ol id="publication-list" className="pub-list">
          {filteredPublications.map((publication) => (
            <PublicationRow
              key={publication.id}
              publication={publication}
              expanded={expandedId === publication.id}
              onToggle={() => setExpandedId((current) => current === publication.id ? null : publication.id)}
              animate={!reducedMotion && !query && year === 'all'}
            />
          ))}
        </ol>

        {filteredPublications.length === 0 && (
          <div className="pub-empty">
            <h3>No matching publications.</h3>
            <p>Try a different title, author, venue, or year.</p>
            <button type="button" className="text-link" onClick={() => { setQuery(''); setYear('all'); }}>Clear filters <ArrowUpRight size={16} aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </section>
  );
}
