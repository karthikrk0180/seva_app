/**
 * Guru Model
 * Represents a Guru in the parampara (lineage).
 */

export interface Guru {
  id: string;
  nameEn: string; // English Name
  nameKn: string; // Kannada Name
  period: string; // e.g., "1595-1671"
  location: string; // Brindavana location
  descEn: string; // English description
  descKn: string; // Kannada description
  orderNum: number; // Order in lineage
  imageUrl?: string;
}

export interface GuruCreateRequest {
  nameEn: string;
  nameKn: string;
  period: string;
  location: string;
  descEn: string;
  descKn: string;
  orderNum: number;
  imageUrl?: string;
}

export interface GuruUpdateRequest extends Partial<GuruCreateRequest> {}

export interface GuruListResponse {
  gurus: Guru[];
  total: number;
}
