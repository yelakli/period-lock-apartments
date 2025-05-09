
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
  periodId: string;
  apartmentId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  bookingDate: Date;
}

export interface NormalBooking {
  id: string;
  apartmentId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  startDate: Date;
  endDate: Date;
  bookingDate: Date;
}

export type User = "admin" | "user";

// Supabase tables types for reference (not used directly)
export interface ApartmentTable {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  booking_type: "period" | "normal";
  min_nights?: number;
  max_nights?: number;
}

export interface BookingPeriodTable {
  id: string;
  apartment_id: string;
  start_date: string;
  end_date: string;
  is_booked: boolean;
}

export interface BookingTable {
  id: string;
  period_id: string;
  apartment_id: string;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  booking_date: string;
}

export interface NormalBookingTable {
  id: string;
  apartment_id: string;
  user_name: string;
  user_email?: string;
  user_phone?: string;
  start_date: string;
  end_date: string;
  booking_date: string;
}
