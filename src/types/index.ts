
export interface Apartment {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  images: string[];
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

export type User = "admin" | "user";
