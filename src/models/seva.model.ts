/**
 * Seva Model
 * Represents a service offering and its booking.
 */

export interface Seva {
  id: string;
  title: {
    en: string;
    kn: string;
  };
  description: {
    en: string;
    kn: string;
  };
  amount: number;
  currency: 'INR' | 'USD';
  isActive: boolean;
  requiresGotra: boolean;
  requiresNakshatra: boolean;
  availableDays: number[]; // 0=Sunday, 1=Monday...
  location?: 'Sode' | 'Udupi';
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed';

export interface SevaBooking {
  id: string;
  userId: string;
  sevaId: string;
  sevaSnapshot: Pick<Seva, 'title' | 'amount'>; // Snapshot value in case price changes
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
