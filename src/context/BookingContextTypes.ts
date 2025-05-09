
import { Apartment, BookingPeriod, Booking, NormalBooking } from "@/types";

export interface BookingContextType {
  apartments: Apartment[];
  bookingPeriods: BookingPeriod[];
  bookings: Booking[];
  normalBookings: NormalBooking[];
  userType: "admin" | "user";
  setUserType: (type: "admin" | "user") => void;
  addApartment: (apartment: Omit<Apartment, "id">) => Promise<void>;
  updateApartment: (apartment: Apartment) => Promise<void>;
  deleteApartment: (id: string) => Promise<void>;
  addBookingPeriod: (period: Omit<BookingPeriod, "id">) => Promise<void>;
  deleteBookingPeriod: (id: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, "id" | "bookingDate">) => Promise<void>;
  createNormalBooking: (booking: Omit<NormalBooking, "id" | "bookingDate">) => Promise<void>;
  getApartmentBookingPeriods: (apartmentId: string) => BookingPeriod[];
  getAvailableBookingPeriods: (apartmentId: string) => BookingPeriod[];
  isNormalDateRangeAvailable: (apartmentId: string, startDate: Date, endDate: Date) => Promise<boolean>;
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  isLoading: boolean;
}
