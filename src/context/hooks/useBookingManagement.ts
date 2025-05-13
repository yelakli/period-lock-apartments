
import { Booking, NormalBooking } from "@/types";
import { useCreateBooking } from "./bookings/useCreateBooking";
import { useCreateNormalBooking } from "./bookings/useCreateNormalBooking";
import { useFetchBookings } from "./bookings/useFetchBookings";
import { useBookingAvailability } from "./bookings/useBookingAvailability";

export const useBookingManagement = (
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  normalBookings: NormalBooking[],
  setNormalBookings: React.Dispatch<React.SetStateAction<NormalBooking[]>>,
  bookingPeriods: any[],
  setBookingPeriods: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // Get the methods from each specialized hook
  const { createBooking } = useCreateBooking(
    bookings,
    setBookings,
    bookingPeriods,
    setBookingPeriods
  );

  const { createNormalBooking } = useCreateNormalBooking(
    normalBookings,
    setNormalBookings
  );

  const { fetchBookings, fetchNormalBookings } = useFetchBookings(
    setBookings,
    setNormalBookings
  );

  const { 
    isNormalDateRangeAvailable, 
    getBookedDatesForApartment,
    testNormalBooking
  } = useBookingAvailability();

  // Return all the methods combined
  return {
    fetchBookings,
    fetchNormalBookings,
    createBooking,
    createNormalBooking,
    isNormalDateRangeAvailable,
    getBookedDatesForApartment,
    testNormalBooking
  };
};
