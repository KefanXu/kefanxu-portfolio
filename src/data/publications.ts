import generatedPublications from './publications.generated.json';
import { Publication, publicationEnrichments } from './portfolio';

const normalizeTitle = (title: string) =>
  title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const publicationEnrichmentByTitle = new Map(
  publicationEnrichments.map((publication) => [normalizeTitle(publication.title), publication]),
);

const mergedPublications = (generatedPublications as Publication[]).map((publication) => {
  const enrichment = publicationEnrichmentByTitle.get(normalizeTitle(publication.title));

  if (!enrichment) {
    return publication;
  }

  return {
    ...publication,
    ...enrichment,
    authors: enrichment.authors ?? publication.authors,
    conference: enrichment.conference ?? publication.conference,
    displayId:
      enrichment.displayId ??
      (enrichment.hideDisplayId ? undefined : enrichment.id) ??
      publication.displayId,
    hideDisplayId: enrichment.hideDisplayId ?? publication.hideDisplayId,
    doi: enrichment.doi ?? publication.doi,
    id: enrichment.id ?? publication.id,
    publicationDate: enrichment.publicationDate ?? publication.publicationDate,
    scholarId: enrichment.scholarId ?? publication.scholarId,
    scholarUrl: enrichment.scholarUrl ?? publication.scholarUrl,
    title: enrichment.title ?? publication.title,
    year: enrichment.year ?? publication.year,
  } satisfies Publication;
});

export const publications: Publication[] =
  mergedPublications.length > 0 ? mergedPublications : publicationEnrichments;
