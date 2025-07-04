
import { Booking, NormalBooking } from "@/types";
import { useCreateBooking } from "./bookings/useCreateBooking";
import { useCreateNormalBooking } from "./bookings/useCreateNormalBooking";
import { useFetchBookings } from "./bookings/useFetchBookings";
import { useBookingAvailability } from "./bookings/useBookingAvailability";
import { useBookingActions } from "./bookings/useBookingActions";

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

  const {
    deleteBooking,
    deleteNormalBooking,
    updateBooking,
    updateNormalBooking
  } = useBookingActions(
    bookings,
    setBookings,
    normalBookings,
    setNormalBookings
  );

  // Return all the methods combined
  return {
    fetchBookings,
    fetchNormalBookings,
    createBooking,
    createNormalBooking,
    deleteBooking,
    deleteNormalBooking,
    updateBooking,
    updateNormalBooking,
    isNormalDateRangeAvailable,
    getBookedDatesForApartment,
    testNormalBooking
  };
};
