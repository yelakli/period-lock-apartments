
// src/types/index.ts

export interface Apartment {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  bookingType: "period" | "normal";
  minNights?: number;
  maxNights?: number;
  disableBookedDates?: boolean; // Added this property
}

export interface BookingPeriod {
  id: string;
  apartmentId: string;
  startDate: Date;
  endDate: Date;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  apartmentId: string;
  periodId: string;
  bookingDate: Date;
  userName: string;
  userEmail?: string;
  userPhone?: string;
}

export interface NormalBooking {
  id: string;
  apartmentId: string;
  startDate: Date;
  endDate: Date;
  bookingDate: Date;
  userName: string;
  userEmail?: string;
  userPhone?: string;
}
