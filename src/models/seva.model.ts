/**
 * Seva Model
 * Represents a service offering and its booking.
 */

export interface Seva {
  id: string;
  titleEn: string;
  titleKn: string;
  descEn: string;
  descKn: string;
  amount: number;
  currency: 'INR' | 'USD';
  isActive: boolean;
  reqGothra: boolean;
  reqNakshatra: boolean;
  availableDays: number; // Bitmask value
  location?: 'Sode' | 'Udupi';
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed';

export interface SevaBooking {
  id: string;
  userId: string;
  sevaId: string;
  sevaSnapshot: Pick<Seva, 'titleEn' | 'titleKn' | 'amount'>; // Snapshot value in case price changes
  bookingDate: string; // ISO Date of booking creation
  sevaDate: string; // ISO Date when Seva is performed
  performeeName: string;
  performeeGotra?: string;
  performeeNakshatra?: string;
  status: BookingStatus;
  paymentReferenceId?: string;
  receiptUrl?: string;
  notes?: string;
}
