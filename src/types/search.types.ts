/**
 * Search result types for global app search.
 * Each result can navigate to a page, event, seva, or guru.
 */

import { Event } from 'src/models/event.model';
import { Seva } from 'src/models/seva.model';
import { Guru } from 'src/models/guru.model';

export type SearchResultKind = 'page' | 'event' | 'seva' | 'guru';

/** Stack navigation: same stack (e.g. HomeStack) */
export type StackNav = { name: string; params?: object };
/** Tab navigation: switch tab and optional screen */
export type TabNav = { tab: string; screen?: string; params?: object };

export type SearchResult =
  | {
      kind: 'page';
      id: string;
      title: string;
      subtitle?: string;
      stackRoute?: StackNav;
      tabRoute?: TabNav;
    }
  | {
      kind: 'event';
      id: string;
      title: string;
      subtitle?: string;
      stackRoute: { name: string; params: { event: Event } };
    }
  | {
      kind: 'seva';
      id: string;
      title: string;
      subtitle?: string;
      tabRoute: { tab: string; screen: string; params: { sevaId: string } };
      seva?: Seva;
    }
  | {
      kind: 'guru';
      id: string;
      title: string;
      subtitle?: string;
      tabRoute: { tab: string; screen: string; params: { id: string } };
      guru?: Guru;
    };
