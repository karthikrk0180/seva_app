/**
 * Search service: aggregates pages, events, sevas, and gurus,
 * filters by query, and returns unified results with navigation routes.
 */

import { ROUTES } from 'src/config';
import { eventService } from 'src/services/event.service';
import { sevaService } from 'src/services/seva.service';
import { guruService } from 'src/services/guru.service';
import type { SearchResult } from 'src/types/search.types';

const DEBOUNCE_MS = 300;

/** Static app pages searchable by title/keywords */
const STATIC_PAGES: Extract<SearchResult, { kind: 'page' }>[] = [
  { kind: 'page', id: 'room-booking', title: 'Guest House / Room Booking', subtitle: 'Book accommodation', stackRoute: { name: ROUTES.SERVICES.ROOM_BOOKING } },
  { kind: 'page', id: 'events', title: 'Events Calendar', subtitle: 'Upcoming events', stackRoute: { name: ROUTES.SERVICES.EVENTS } },
  { kind: 'page', id: 'sevas', title: 'Sevas', subtitle: 'Book a seva', tabRoute: { tab: ROUTES.TABS.SEVA, screen: ROUTES.SEVA.SEVA_LIST } },
  { kind: 'page', id: 'parampara', title: 'Parampara', subtitle: 'Guru lineage', tabRoute: { tab: ROUTES.TABS.HISTORY, screen: ROUTES.HISTORY.GURU_LIST } },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function matchesQuery(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const q = normalize(query);
  const t = normalize(text);
  return t.includes(q) || q.split(/\s+/).every((w) => t.includes(w));
}

function filterPages(query: string): SearchResult[] {
  const q = query.trim();
  if (!q) return [...STATIC_PAGES];
  return STATIC_PAGES.filter(
    (p) => matchesQuery(p.title, q) || (p.subtitle && matchesQuery(p.subtitle, q))
  );
}

export async function getSearchResults(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  const results: SearchResult[] = [];

  // 1) Static pages (always include when empty query, else filter)
  const pages = filterPages(q);
  results.push(...pages);

  // When no query, only show pages (quick links)
  if (!q) return results;

  try {
    const [events, sevas, gurus] = await Promise.all([
      eventService.getEvents().catch(() => []),
      sevaService.getSevas().catch(() => []),
      guruService.getGurus().catch(() => []),
    ]);

    // 2) Events
    const eventList = events.filter(
          (e) =>
            matchesQuery(e.titleEn || '', q) ||
            matchesQuery(e.tithiEn || '', q) ||
            matchesQuery(e.location || '', q) ||
            matchesQuery((e as any).titleKn || '', q)
        );
    eventList.forEach((event) => {
      results.push({
        kind: 'event',
        id: event.id,
        title: event.titleEn || 'Event',
        subtitle: [event.eventDate, event.tithiEn, event.location].filter(Boolean).join(' · ') || undefined,
        stackRoute: { name: ROUTES.SERVICES.EVENT_DETAIL, params: { event } },
      });
    });

    // 3) Sevas
    const activeSevas = sevas.filter((s) => s.isActive !== false);
    const sevaList = activeSevas.filter(
      (s) =>
        matchesQuery(s.titleEn || '', q) ||
        matchesQuery(s.titleKn || '', q) ||
        matchesQuery(s.descEn || '', q)
    );
    sevaList.forEach((seva) => {
      results.push({
        kind: 'seva',
        id: seva.id,
        title: seva.titleEn || seva.titleKn || 'Seva',
        subtitle: seva.location ? `At ${seva.location}` : undefined,
        tabRoute: {
          tab: ROUTES.TABS.SEVA,
          screen: ROUTES.SEVA.SEVA_BOOKING,
          params: { sevaId: seva.id },
        },
        seva,
      });
    });

    // 4) Gurus
    const guruList = gurus.filter(
      (g) =>
        matchesQuery(g.nameEn || '', q) ||
        matchesQuery(g.nameKn || '', q) ||
        matchesQuery(g.period || '', q) ||
        matchesQuery(g.location || '', q)
    );
    guruList.forEach((guru) => {
      results.push({
        kind: 'guru',
        id: guru.id,
        title: guru.nameEn || guru.nameKn || 'Guru',
        subtitle: guru.period ? `${guru.orderNum}${getOrdinal(guru.orderNum)} Peetadhipathi · ${guru.period}` : undefined,
        tabRoute: {
          tab: ROUTES.TABS.HISTORY,
          screen: ROUTES.HISTORY.GURU_DETAIL,
          params: { id: guru.id },
        },
        guru,
      });
    });
  } catch (e) {
    console.warn('Search fetch error:', e);
  }

  return results;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export const searchService = {
  getSearchResults,
  debounceMs: DEBOUNCE_MS,
};
