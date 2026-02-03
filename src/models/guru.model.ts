/**
 * Guru Model
 * Represents a Guru in the parampara (lineage).
 */

export interface Guru {
  id: string;
  name: {
    en: string; // English Name
    kn: string; // Kannada Name
  };
  period: string; // e.g., "1200-1280 AD"
  brindavanaLocation: string;
  description: {
    en: string;
    kn: string;
  };
  orderInLineage: number; // 1 for First Guru, etc.
  imageUrl?: string;
  isAradhanaApproaching: boolean;
  aradhanaDate?: string; // ISO Date for current year Aradhana
}

export interface GuruListResponse {
  gurus: Guru[];
  total: number;
}
