/**
 * Devotee profile and form options for Seva booking (requirements 3.8, 3.13).
 * Aligns with "Devotee Details" form: name, contact, address, nakshatra, rashi, gothra, payment, prasadam.
 */

export interface DevoteeProfile {
  displayName?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  nakshatra?: string;
  rashi?: string;
  gothra?: string;
}

export type PrasadamCollection = 'personal' | 'post';

export type PaymentMode = 'online' | 'bank_transfer' | 'upi' | 'card' | 'other';

/** Options for dropdowns (subset; extend from backend or https://www.sodematha.in as needed) */
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const RASHIS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];

export const GOTHRAS = [
  'Atri', 'Bharadwaja', 'Gautama', 'Jamadagni', 'Kashyapa', 'Vashishtha', 'Vishwamitra', 'Agastya', 'Other',
];

export const PAYMENT_MODES: { value: PaymentMode; label: string }[] = [
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'online', label: 'Net Banking' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];
