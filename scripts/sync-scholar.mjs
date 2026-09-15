import { load } from 'cheerio';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SCHOLAR_USER_ID = 'ocdZFbwAAAAJ';
const SCHOLAR_BASE_URL = 'https://scholar.google.com';
const PAGE_SIZE = 100;
const OUTPUT_PATH = path.resolve(process.cwd(), 'src/data/publications.generated.json');
const REQUEST_HEADERS = {
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

const STOP_WORDS = new Set([
  'a',
  'about',
  'an',
  'and',
  'for',
  'from',
  'how',
  'in',
  'into',
  'of',
  'on',
  'or',
  'the',
  'through',
  'to',
  'understanding',
  'using',
  'via',
  'with',
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildScholarListUrl(start = 0) {
  const url = new URL('/citations', SCHOLAR_BASE_URL);
  url.search = new URLSearchParams({
    cstart: String(start),
    hl: 'en',
    pagesize: String(PAGE_SIZE),
    sortby: 'pubdate',
    user: SCHOLAR_USER_ID,
    view_op: 'list_works',
  }).toString();
  return url.toString();
}

function cleanText(value = '') {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseYear(value = '') {
  const match = cleanText(value).match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

function splitAuthors(value = '') {
  return cleanText(value)
    .split(/\s*,\s*/)
    .map((author) => cleanText(author))
    .filter(Boolean);
}

function buildGeneratedId(title, citationForView) {
  const slug = cleanText(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
  const suffix = citationForView.split(':').at(-1)?.toLowerCase() ?? 'publication';
  return `${slug || 'publication'}-${suffix}`;
}

function buildDisplayId(title, year) {
  const words = cleanText(title)
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const initials = words
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word.toLowerCase()))
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('');

  return `${initials || 'PUB'}-${year}`;
}

function normalizePaperLink(href) {
  if (!href) {
    return undefined;
  }

  const url = new URL(href, SCHOLAR_BASE_URL);

  if (url.hostname === 'dl.acm.org') {
    const doiMatch = url.pathname.match(/\/doi\/(?:abs|full|pdf|epdf)?\/(.+)$/);
    if (doiMatch?.[1]) {
      return `https://doi.org/${doiMatch[1]}`;
    }
  }

  return url.toString();
}

function buildVenue(detailFields, fallbackVenueLine) {
  return cleanText(
    detailFields.Conference ||
      detailFields.Journal ||
      detailFields.Book ||
      detailFields['Book title'] ||
      detailFields['Patent office'] ||
      fallbackVenueLine ||
      'Publication',
  );
}

function parseListRows(html) {
  const $ = load(html);

  return $('tr.gsc_a_tr')
    .toArray()
    .map((row) => {
      const titleLink = $(row).find('a.gsc_a_at').first();
      const title = cleanText(titleLink.text());
      const detailHref = titleLink.attr('href');
      const detailUrl = detailHref ? new URL(detailHref, SCHOLAR_BASE_URL).toString() : undefined;
      const citationForView = detailUrl
        ? new URL(detailUrl).searchParams.get('citation_for_view') ?? undefined
        : undefined;
      const meta = $(row)
        .find('div.gs_gray')
        .toArray()
        .map((node) => cleanText($(node).text()));
      const yearText = cleanText($(row).find('.gsc_a_y span').first().text());

      return {
        authorLine: meta[0] ?? '',
        citationForView,
        detailUrl,
        title,
        venueLine: meta[1] ?? '',
        year: parseYear(yearText || meta[1] || ''),
      };
    })
    .filter((row) => row.title && row.citationForView && row.detailUrl);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url} (${response.status})`);
  }

  const html = await response.text();

  if (
    html.includes("Please show you're not a robot") ||
    html.includes('/sorry/image') ||
    html.includes('Our systems have detected unusual traffic')
  ) {
    throw new Error('Google Scholar returned an anti-bot challenge.');
  }

  return html;
}

async function fetchAllRows() {
  const rows = [];
  let start = 0;

  while (true) {
    const html = await fetchHtml(buildScholarListUrl(start));
    const pageRows = parseListRows(html);

    if (pageRows.length === 0) {
      break;
    }

    rows.push(...pageRows);

    if (pageRows.length < PAGE_SIZE) {
      break;
    }

    start += PAGE_SIZE;
    await sleep(300);
  }

  return rows;
}

function parseDetailPage(html) {
  const $ = load(html);
  const detailFields = {};

  $('#gsc_oci_table .gs_scl').each((_, element) => {
    const field = cleanText($(element).find('.gsc_oci_field').first().text());
    const value = cleanText($(element).find('.gsc_oci_value').first().text());

    if (field && value) {
      detailFields[field] = value;
    }
  });

  const externalLink = $('#gsc_oci_title a[href]')
    .toArray()
    .map((element) => $(element).attr('href'))
    .find((href) => href && !href.includes('scholar.google.com'));

  return {
    detailFields,
    externalLink: normalizePaperLink(externalLink),
  };
}

async function buildPublications() {
  const rows = await fetchAllRows();
  const publications = [];

  for (const row of rows) {
    const detailHtml = await fetchHtml(row.detailUrl);
    const { detailFields, externalLink } = parseDetailPage(detailHtml);
    const publicationDate = cleanText(detailFields['Publication date'] || '');
    const year = parseYear(publicationDate || String(row.year));

    publications.push({
      abstract: detailFields.Description || undefined,
      authors: splitAuthors(detailFields.Authors || row.authorLine),
      conference: buildVenue(detailFields, row.venueLine),
      displayId: buildDisplayId(row.title, year),
      doi: externalLink,
      id: buildGeneratedId(row.title, row.citationForView),
      publicationDate: publicationDate || undefined,
      scholarId: row.citationForView,
      scholarUrl: row.detailUrl,
      title: row.title,
      year,
    });

    await sleep(200);
  }

  return publications;
}

async function loadExistingOutput() {
  try {
    return await readFile(OUTPUT_PATH, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function main() {
  try {
    const publications = await buildPublications();

    if (publications.length === 0) {
      throw new Error('No publications were parsed from Google Scholar.');
    }

    await writeFile(OUTPUT_PATH, `${JSON.stringify(publications, null, 2)}\n`, 'utf8');
    console.log(`Synced ${publications.length} publications from Google Scholar.`);
  } catch (error) {
    const existingOutput = await loadExistingOutput();

    if (existingOutput) {
      console.warn(`Google Scholar sync failed, keeping existing generated data: ${error.message}`);
      return;
    }

    throw error;
  }
}

await main();
